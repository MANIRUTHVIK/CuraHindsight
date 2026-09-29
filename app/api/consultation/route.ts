import { NextRequest, NextResponse } from 'next/server';
import { processConsultationWithGroq } from '@/lib/groq';
import { recallMemories, retainMemory } from '@/lib/hindsight';
import { Consultation } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      transcript, 
      patientId = 'patient_john_doe_101', 
      patientName = 'Johnathan "John" Doe',
      doctorName = 'Dr. Sarah Chen, MD',
      visitType = 'Follow-up Consultation'
    } = body;

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({ error: 'Transcript content is required.' }, { status: 400 });
    }

    // 1. Recall prior Hindsight memories for longitudinal context
    const priorMemories = await recallMemories(patientId, 'past medical history medications allergies adverse reactions');
    const historicalContext = priorMemories.slice(0, 5).join('\n');

    // 2. Groq LLM extracts SOAP note, patient plain-English summary, and atomic facts
    const { soapNote, patientSummary, extractedFacts } = await processConsultationWithGroq(
      transcript,
      patientName,
      historicalContext
    );

    // 3. Retain each new clinical fact and the core SOAP plan into Hindsight Memory Bank
    const timestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Ingest summary anchor
    await retainMemory(
      patientId,
      `[Visit on ${timestamp} (${visitType})]: Assessment: ${soapNote.assessment}. Plan: ${soapNote.plan}`,
      'clinical_visit'
    );

    // Ingest atomic facts
    for (const fact of extractedFacts) {
      await retainMemory(patientId, fact, 'extracted_fact');
    }

    // Also retain critical alerts
    if (soapNote.criticalAlerts) {
      for (const alert of soapNote.criticalAlerts) {
        await retainMemory(patientId, `[CLINICAL ALERT]: ${alert}`, 'critical_alert');
      }
    }

    const consultation: Consultation = {
      id: `visit-${Date.now()}`,
      patientId,
      patientName,
      doctorName,
      date: `Today (${timestamp})`,
      visitType,
      rawTranscript: transcript,
      soapNote,
      patientSummary,
      retainedMemoryCount: extractedFacts.length + 1
    };

    return NextResponse.json({
      success: true,
      consultation,
      retainedFactsCount: extractedFacts.length
    });
  } catch (error: any) {
    console.error('Consultation processing API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
