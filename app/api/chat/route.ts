import { NextRequest, NextResponse } from 'next/server';
import { recallMemories, reflectMemory } from '@/lib/hindsight';
import { askMemoryQuestionWithGroq } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      query, 
      patientId = 'patient_john_doe_101', 
      patientName = 'Johnathan "John" Doe',
      role = 'patient' 
    } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required.' }, { status: 400 });
    }

    // 1. Try Hindsight Reflect first (if available for complex synthesis)
    const reflection = await reflectMemory(patientId, query);

    // 2. Multi-strategy Recall from Hindsight memory bank
    const memories = await recallMemories(patientId, query);

    // 3. Ground answer in Groq LLM with persona (Doctor clinical copilot vs Patient friendly companion)
    const { answer, sources } = await askMemoryQuestionWithGroq(
      query,
      reflection ? [reflection, ...memories] : memories,
      patientName,
      role
    );

    return NextResponse.json({
      success: true,
      answer,
      sources,
      reflectionUsed: Boolean(reflection)
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
