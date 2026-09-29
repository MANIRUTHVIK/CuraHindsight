import { NextRequest, NextResponse } from 'next/server';
import { seedBaselineMemories, getLocalBankMemories } from '@/lib/hindsight';
import { DEFAULT_PATIENT, DEMO_VISITS, DEMO_VISIT_3_TRANSCRIPT } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const patientId = body.patientId || DEFAULT_PATIENT.id;

    // Seed baseline visits
    seedBaselineMemories(patientId);
    const memories = getLocalBankMemories(patientId);

    return NextResponse.json({
      success: true,
      message: 'Baseline visits (Visit 1 & Visit 2) successfully seeded into Hindsight Memory Bank.',
      patient: DEFAULT_PATIENT,
      visits: DEMO_VISITS,
      sampleLiveTranscript: DEMO_VISIT_3_TRANSCRIPT,
      retainedMemoriesCount: memories.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
