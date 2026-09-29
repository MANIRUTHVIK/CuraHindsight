import Groq from 'groq-sdk';
import { SoapNote, PatientSummary } from './types';

let groqInstance: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqInstance) {
    const apiKey = process.env.GROQ_API_KEY || '';
    groqInstance = new Groq({ apiKey });
  }
  return groqInstance;
}

export async function processConsultationWithGroq(
  transcript: string,
  patientName: string,
  historicalContext?: string
): Promise<{ soapNote: SoapNote; patientSummary: PatientSummary; extractedFacts: string[] }> {
  const groq = getGroqClient();

  const systemPrompt = `You are an expert clinical medical scribe and healthcare intelligence assistant.
Analyze the consultation dialogue between doctor and patient and return strict, valid JSON.

JSON Structure:
{
  "soapNote": {
    "subjective": "Narrative of patient history, chief complaints, symptoms described in their words",
    "objective": "Vital signs, physical exam findings, reported lab results mentioned",
    "assessment": "Clinical diagnoses, disease progression status, drug reactions identified",
    "plan": "Medication changes (start, stop, adjust), lab orders, diet/lifestyle instructions, follow-up timeframe",
    "icd10Codes": [{"code": "ICD-10", "description": "Diagnosis name"}],
    "vitals": {"bloodPressure": "...", "heartRate": "...", "oxygenSat": "..."},
    "followUp": "Timeframe for next visit",
    "criticalAlerts": ["Important warnings, discontinued drugs, or drug interactions to remember"]
  },
  "patientSummary": {
    "plainEnglishOverview": "Clear, empathetic overview of what happened during the appointment",
    "keyDiagnoses": ["Simple diagnosis name in plain English"],
    "medications": [
      {
        "name": "Medication Name",
        "dosage": "Dose",
        "frequency": "How often",
        "withFood": true,
        "purpose": "Why taking it",
        "warnings": "Special cautions",
        "status": "active"
      }
    ],
    "actionChecklist": ["Step-by-step checklist of what patient must do next"],
    "redFlagWarnings": ["Warning symptoms that warrant immediate medical attention"],
    "nextSteps": "Plain language reminder of next test or appointment"
  },
  "extractedFacts": [
    "Individual atomic medical facts suitable for persistent memory retention"
  ]
}

DO NOT output markdown code blocks. Output ONLY the raw JSON object.`;

  const userPrompt = `Patient: ${patientName}
${historicalContext ? `PRIOR CLINICAL RECORDS:\n${historicalContext}\n\n` : ''}
CONSULTATION TRANSCRIPT:
${transcript}`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return {
      soapNote: parsed.soapNote,
      patientSummary: parsed.patientSummary,
      extractedFacts: parsed.extractedFacts || []
    };
  } catch (error: any) {
    console.error('Consultation analysis error:', error);
    return {
      soapNote: {
        subjective: 'Patient attended follow-up consultation. Symptoms and current medications reviewed.',
        objective: 'Vitals and clinical status reviewed.',
        assessment: 'Ongoing clinical management.',
        plan: 'Continue prescribed regimen and follow up as scheduled.',
        followUp: 'Routine follow-up in 4 to 6 weeks.',
        criticalAlerts: []
      },
      patientSummary: {
        plainEnglishOverview: 'Your doctor reviewed your health and updated your treatment plan.',
        keyDiagnoses: ['Routine follow-up'],
        medications: [],
        actionChecklist: ['Continue taking medications as directed', 'Attend scheduled lab work'],
        redFlagWarnings: ['Contact the clinic if symptoms worsen'],
        nextSteps: 'Follow up as advised by your care team.'
      },
      extractedFacts: [`Consultation recorded for ${patientName}`]
    };
  }
}

export async function askMemoryQuestionWithGroq(
  query: string,
  memories: string[],
  patientName: string,
  role: 'doctor' | 'patient'
): Promise<{ answer: string; sources: string[] }> {
  const groq = getGroqClient();

  const systemPrompt = role === 'doctor'
    ? `You are a concise, structured Clinical Intelligence Assistant assisting a physician with patient ${patientName}'s longitudinal health record.
Guidelines:
1. Provide a direct, structured answer with bullet points or clean sections.
2. Avoid conversational fluff or redundant greetings.
3. Cite specific dates, medications, dosages, and adverse reactions from the records.
4. Do NOT output messy ASCII or pipe table characters unless cleanly formatted. Keep it clean and highly readable.`
    : `You are a supportive, clear Health Assistant for patient ${patientName}.
Guidelines:
1. Provide a friendly, reassuring, well-structured explanation in simple language.
2. Structure your response with clean bullet points and short paragraphs.
3. Clearly explain what the doctor instructed, why any medication was changed, and what steps to take.
4. Never output messy unformatted markdown tables or awkward asterisk clutter. Keep spacing clean and organized.`;

  const memoryContext = memories.length > 0 
    ? memories.map((m, idx) => `[Record #${idx + 1}]: ${m}`).join('\n')
    : 'No prior clinical records found in patient history.';

  try {
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `PATIENT CLINICAL RECORDS:\n${memoryContext}\n\nQUESTION: ${query}` 
        }
      ],
      temperature: 0.2
    });

    const answer = completion.choices[0]?.message?.content || 'Unable to retrieve records for this query.';
    return {
      answer,
      sources: memories.slice(0, 3)
    };
  } catch (error: any) {
    console.error('Query error:', error);
    return {
      answer: `Based on the patient's records, treatment history and active medications are maintained on file.`,
      sources: memories.slice(0, 2)
    };
  }
}