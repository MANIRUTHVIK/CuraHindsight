import { HindsightClient } from '@vectorize-io/hindsight-client';

interface MemoryItem {
  id: string;
  bankId: string;
  content: string;
  category?: string;
  timestamp: string;
}

const localMemoryStore: Map<string, MemoryItem[]> = new Map();
const seededBanks: Set<string> = new Set();

let clientInstance: HindsightClient | null = null;

function getHindsightClient(): HindsightClient | null {
  if (!clientInstance && process.env.HINDSIGHT_API_KEY) {
    try {
      clientInstance = new HindsightClient({
        apiKey: process.env.HINDSIGHT_API_KEY,
        baseUrl: process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io'
      });
    } catch (err) {
      console.warn('HindsightClient init notice:', err);
    }
  }
  return clientInstance;
}

/**
 * Retain memory facts into Hindsight Memory Bank
 */
export async function retainMemory(bankId: string, content: string, category?: string): Promise<{ success: boolean; cloudRetained: boolean }> {
  let cloudRetained = false;

  // 1. Store in local resilient bank
  const items = localMemoryStore.get(bankId) || [];
  const newItem: MemoryItem = {
    id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    bankId,
    content,
    category,
    timestamp: new Date().toISOString()
  };
  items.push(newItem);
  localMemoryStore.set(bankId, items);

  // 2. Sync to Hindsight Cloud via SDK
  const client = getHindsightClient();
  if (client) {
    try {
      await client.retain(bankId, content);
      cloudRetained = true;
    } catch (err: any) {
      // Graceful backoff if cloud rate-limited
      if (err?.statusCode === 429) {
        console.warn(`Hindsight Cloud rate limit (429) for ${bankId} - securely stored in local bank.`);
      } else {
        console.warn(`Hindsight Cloud sync notice for ${bankId}:`, err?.message || err);
      }
    }
  }

  return { success: true, cloudRetained };
}

/**
 * Recall memories matching query from Hindsight Memory Bank
 */
export async function recallMemories(bankId: string, query: string): Promise<string[]> {
  const client = getHindsightClient();
  let results: string[] = [];

  if (client) {
    try {
      const recallRes = await client.recall(bankId, query);
      if (Array.isArray(recallRes)) {
        results = recallRes.map((r: any) => typeof r === 'string' ? r : (r.text || r.content || JSON.stringify(r)));
      } else if (recallRes && typeof recallRes === 'object') {
        const list = (recallRes as any).results || (recallRes as any).memories || [];
        results = list.map((r: any) => typeof r === 'string' ? r : (r.text || r.content || ''));
      }
    } catch (err: any) {
      console.warn(`Hindsight Cloud recall notice for ${bankId}:`, err?.message || err);
    }
  }

  // Fast fallback to local store if cloud results are empty
  if (results.length === 0) {
    const local = localMemoryStore.get(bankId) || [];
    const lowerQuery = query.toLowerCase();
    const queryTokens = lowerQuery.split(/\s+/).filter(w => w.length > 2);
    
    const ranked = local.map(item => {
      const lowerContent = item.content.toLowerCase();
      let score = 0;
      queryTokens.forEach(t => {
        if (lowerContent.includes(t)) score += 2;
      });
      return { item, score };
    }).sort((a, b) => b.score - a.score);

    results = ranked.slice(0, 6).map(r => r.item.content);
  }

  return results;
}

/**
 * Reflect / synthesize high-level answer from Hindsight Memory Bank
 */
export async function reflectMemory(bankId: string, query: string): Promise<string | null> {
  const client = getHindsightClient();
  if (client && typeof client.reflect === 'function') {
    try {
      const res = await client.reflect(bankId, query);
      if (typeof res === 'string') return res;
      if (res && (res as any).text) return (res as any).text;
    } catch (err: any) {
      console.warn(`Hindsight Cloud reflect notice for ${bankId}:`, err?.message || err);
    }
  }
  return null;
}

export function getLocalBankMemories(bankId: string): MemoryItem[] {
  return localMemoryStore.get(bankId) || [];
}

/**
 * Seed initial baseline demo memories for Visits 1 & 2 (IDEMPOTENT: runs only once per bank)
 */
export async function seedBaselineMemories(bankId: string) {
  if (seededBanks.has(bankId)) {
    return; // Already seeded, avoid duplicate requests and 429 rate limits
  }
  seededBanks.add(bankId);

  const baselineFacts = [
    'Patient Johnathan "John" Doe diagnosed with Stage 1 Essential Hypertension (BP 146/92) 3 months ago (June 14).',
    'Patient has ongoing history of Mild Exercise-Induced Asthma managed with PRN Albuterol inhaler. Beta-blockers contraindicated.',
    'Doctor initiated Lisinopril 10mg daily with breakfast 3 months ago.',
    'Patient reported occasional dizziness when skipping breakfast.',
    'Patient developed persistent dry non-productive cough 3 weeks into Lisinopril therapy.',
    'Doctor diagnosed ACE-inhibitor induced bradykinin cough 1 month ago (August 18).',
    'Doctor discontinued Lisinopril 10mg immediately due to cough intolerance.',
    'Doctor switched patient to Losartan Potassium 50mg daily (ARB class) on August 18.',
    'Doctor ordered Comprehensive Metabolic Panel (CMP) for potassium & creatinine check within 4-6 weeks.',
    'Patient instructed to avoid over-the-counter decongestants with pseudoephedrine/phenylephrine that spike blood pressure.'
  ];

  // Store all in local bank instantly
  baselineFacts.forEach(fact => {
    const items = localMemoryStore.get(bankId) || [];
    items.push({
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      bankId,
      content: fact,
      category: 'clinical_history',
      timestamp: new Date().toISOString()
    });
    localMemoryStore.set(bankId, items);
  });

  // Async non-blocking single consolidated retain to Hindsight Cloud to avoid rate-limiting
  const client = getHindsightClient();
  if (client) {
    try {
      const summaryBlob = baselineFacts.join(' ');
      await client.retain(bankId, summaryBlob);
    } catch (err: any) {
      console.warn(`Hindsight Cloud baseline sync notice:`, err?.message || err);
    }
  }
}