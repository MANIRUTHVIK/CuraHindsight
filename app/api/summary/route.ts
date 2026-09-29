export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { recallMemories, getLocalBankMemories, seedBaselineMemories } from '@/lib/hindsight';
import { DEFAULT_PATIENT, DEMO_VISITS } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId') || DEFAULT_PATIENT.id;

    // Seed default memories if bank is newly accessed
    seedBaselineMemories(patientId);

    // Recall key clinical categories from Hindsight
    const medicationMemories = await recallMemories(patientId, 'active and discontinued medications prescription doses');
    const adverseMemories = await recallMemories(patientId, 'adverse reactions intolerance cough allergies side effects');
    const vitalMemories = await recallMemories(patientId, 'blood pressure readings vitals hypertension');
    const allBankMemories = getLocalBankMemories(patientId);

    return NextResponse.json({
      success: true,
      patient: DEFAULT_PATIENT,
      baselineVisits: DEMO_VISITS,
      memoryHighlights: {
        medications: medicationMemories.slice(0, 4),
        adverseReactions: adverseMemories.slice(0, 3),
        vitalsHistory: vitalMemories.slice(0, 3),
        totalMemoriesCount: allBankMemories.length
      },
      allMemories: allBankMemories
    });
  } catch (error: any) {
    console.error('Summary API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
