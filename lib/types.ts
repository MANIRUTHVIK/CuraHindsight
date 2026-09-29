export interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  withFood: boolean;
  purpose: string;
  warnings?: string;
  status: 'active' | 'discontinued' | 'completed';
}

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icd10Codes?: { code: string; description: string }[];
  vitals?: {
    bloodPressure?: string;
    heartRate?: string;
    respiratoryRate?: string;
    temperature?: string;
    oxygenSat?: string;
  };
  followUp: string;
  criticalAlerts?: string[];
}

export interface PatientSummary {
  plainEnglishOverview: string;
  keyDiagnoses: string[];
  medications: MedicationItem[];
  actionChecklist: string[];
  redFlagWarnings: string[];
  nextSteps: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  visitType: string; // e.g. "Initial Assessment", "Follow-up", "Annual Check"
  rawTranscript: string;
  soapNote: SoapNote;
  patientSummary: PatientSummary;
  retainedMemoryCount?: number;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  knownAllergies: string[];
  chronicConditions: string[];
  activeMedications: string[];
  pastIntolerances: { medication: string; reaction: string; date: string }[];
  visitCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: string[];
}
