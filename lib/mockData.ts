import { Consultation, PatientProfile } from './types';

export const DEFAULT_PATIENT: PatientProfile = {
  id: 'patient_john_doe_101',
  name: 'Johnathan "John" Doe',
  age: 58,
  gender: 'Male',
  knownAllergies: ['Penicillin (Mild Hives, 2018)'],
  chronicConditions: ['Stage 1 Essential Hypertension', 'Mild Exercise-Induced Asthma'],
  activeMedications: ['Losartan Potassium 50mg PO Daily', 'Albuterol Inhaler 90mcg PRN'],
  pastIntolerances: [
    {
      medication: 'Lisinopril (10mg)',
      reaction: 'Intractable dry cough and morning postural dizziness',
      date: '1 Month Ago'
    }
  ],
  visitCount: 2
};

export const DEMO_VISITS: Consultation[] = [
  {
    id: 'visit-1-baseline',
    patientId: 'patient_john_doe_101',
    patientName: 'Johnathan "John" Doe',
    doctorName: 'Dr. Sarah Chen, MD',
    date: '3 Months Ago (June 14)',
    visitType: 'Initial Hypertension Assessment',
    rawTranscript: `Doctor: Good morning John. Looking at your vitals today, your blood pressure came back at 146 over 92. Have you been noticing any headaches or lightheadedness?
Patient: Morning doctor. Honestly I've been feeling slightly fatigued lately, especially in the afternoons. Sometimes when I stand up quickly after skipping breakfast, I feel a quick dizzy spell.
Doctor: Got it. 146 over 92 on three consecutive readings places you in Stage 1 Hypertension. Also reviewing your chart, you have a mild asthma history managed with an albuterol inhaler.
Patient: That's right, mostly when I jog in cold weather.
Doctor: Perfect. Because beta-blockers can sometimes trigger asthma bronchospasms, I am starting you on an ACE inhibitor: Lisinopril 10mg once daily in the morning.
Patient: Okay. Should I take it with food?
Doctor: You can take it with or without food, but since you mentioned dizziness when skipping breakfast, please take it with your morning meal and drink a large glass of water.
Patient: Understood. Any side effects to watch out for?
Doctor: Occasionally some patients get a dry hacking cough or dizziness. If you notice a cough that doesn't go away, let us know immediately. Let's see you back in 6 to 8 weeks.`,
    soapNote: {
      subjective: '58yo male presents for routine physical. Reports mild afternoon fatigue and occasional lightheadedness upon standing when skipping breakfast. Denies chest pain or shortness of breath. Past history of mild exercise-induced asthma.',
      objective: 'BP: 146/92 mmHg (elevated Stage 1). HR: 74 bpm. Lungs: Clear bilaterally, no wheezing. Heart: Regular rate and rhythm, no murmurs.',
      assessment: '1. Essential (Primary) Hypertension (ICD-10: I10), newly diagnosed.\n2. Mild Exercise-Induced Asthma (ICD-10: J45.909), stable.',
      plan: '1. Initiate Lisinopril 10mg PO once daily in the morning with breakfast to avoid postural dizziness.\n2. Avoid beta-blockers due to underlying reactive airway / asthma risk.\n3. Lifestyle: Low-sodium DASH diet, daily walking 30 min.\n4. Follow-up in 6-8 weeks to recheck BP and renal function.',
      icd10Codes: [
        { code: 'I10', description: 'Essential (primary) hypertension' },
        { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' }
      ],
      vitals: {
        bloodPressure: '146/92 mmHg',
        heartRate: '74 bpm',
        oxygenSat: '98%'
      },
      followUp: 'Follow-up in 6 to 8 weeks for blood pressure re-evaluation and metabolic panel.',
      criticalAlerts: ['Avoid beta-blockers due to asthma risk. Watch for ACE inhibitor-induced dry cough.']
    },
    patientSummary: {
      plainEnglishOverview: 'We reviewed your blood pressure today, which was high at 146/92. To protect your heart and kidneys, Dr. Chen started you on a gentle blood pressure medicine called Lisinopril.',
      keyDiagnoses: ['High Blood Pressure (Stage 1 Hypertension)', 'Mild Asthma (Well controlled)'],
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once every morning',
          withFood: true,
          purpose: 'Lower blood pressure safely',
          warnings: 'Call our clinic if you develop an unexplained dry cough or severe dizziness.',
          status: 'active'
        },
        {
          name: 'Albuterol Inhaler',
          dosage: '90mcg (1-2 puffs)',
          frequency: 'As needed before exercise',
          withFood: false,
          purpose: 'Asthma symptom relief',
          status: 'active'
        }
      ],
      actionChecklist: [
        'Take your 10mg Lisinopril tablet every morning with breakfast and water.',
        'Keep track of your morning blood pressure using your home cuff twice weekly.',
        'Aim to reduce salt intake and walk 30 minutes daily.',
        'Call clinic if you develop a persistent dry cough.'
      ],
      redFlagWarnings: [
        'Persistent dry hacking cough that will not go away',
        'Severe dizzy spells or lightheadedness when standing',
        'Swelling of the lips, tongue, or face'
      ],
      nextSteps: 'Return in 6 to 8 weeks for your blood pressure check.'
    },
    retainedMemoryCount: 8
  },
  {
    id: 'visit-2-adverse-event',
    patientId: 'patient_john_doe_101',
    patientName: 'Johnathan "John" Doe',
    doctorName: 'Dr. Sarah Chen, MD',
    date: '1 Month Ago (August 18)',
    visitType: 'Medication Tolerance Follow-up',
    rawTranscript: `Doctor: Welcome back John. How have things been on the Lisinopril?
Patient: Doctor, my blood pressure numbers have come down to around 138 over 88, which is great, but I have developed this persistent, annoying dry cough for the last 3 weeks. It keeps waking me up at night. There's no phlegm or fever, just a constant tickle in the back of my throat.
Doctor: That is a classic ACE inhibitor cough caused by bradykinin accumulation from Lisinopril. It happens in about 10-15% of patients, and cough syrups or antibiotics will not help.
Patient: Oh wow, I thought I caught a stubborn cold!
Doctor: We are going to stop Lisinopril immediately. Today we are switching you to an ARB (Angiotensin Receptor Blocker) called Losartan 50mg once daily. ARBs give the same cardiovascular protection but without causing the bradykinin cough.
Patient: That is a relief. When will the cough stop?
Doctor: It typically disappears within 1 to 2 weeks after stopping Lisinopril. Also, with Losartan, we need to monitor your electrolytes, so I am putting in an order for a comprehensive metabolic panel to check your kidney function and potassium in 4 to 6 weeks.
Patient: Sounds great doctor. I'll make the switch starting tomorrow morning.`,
    soapNote: {
      subjective: 'Patient returns complaining of a 3-week history of dry, non-productive nocturnal cough and mild postural dizziness since initiating Lisinopril 10mg. Denies fever, chills, rhinorrhea, or hemoptysis. Notes BP improved to 138/88 mmHg.',
      objective: 'BP: 138/88 mmHg. HR: 72 bpm. Oropharynx: Clear, no erythema or exudate. Lungs: Clear, no wheezing or rhonchi.',
      assessment: '1. ACE Inhibitor-Induced Cough (adverse drug reaction secondary to Lisinopril).\n2. Essential Hypertension, partially controlled on therapy.\n3. Exercise-induced asthma, inactive.',
      plan: '1. Discontinue Lisinopril 10mg immediately due to adverse reaction (dry cough).\n2. Initiate Losartan Potassium 50mg PO once daily in morning.\n3. Ordered: Serum Potassium & Creatinine (CMP) in 4-6 weeks.\n4. Counsel: Cough should resolve in 1-2 weeks. Recheck BP in 4 weeks.',
      icd10Codes: [
        { code: 'T88.7XXA', description: 'Unspecified adverse effect of drug or medicament (Lisinopril cough)' },
        { code: 'I10', description: 'Essential (primary) hypertension' }
      ],
      vitals: {
        bloodPressure: '138/88 mmHg',
        heartRate: '72 bpm',
        oxygenSat: '99%'
      },
      followUp: 'Follow-up in 4 weeks. Complete ordered CMP lab work before the next visit.',
      criticalAlerts: ['DISCONTINUED: Lisinopril (ACE inhibitor) due to persistent cough intolerance. Switched to Losartan 50mg.']
    },
    patientSummary: {
      plainEnglishOverview: 'Your dry tickling cough was a known side effect of your previous pill, Lisinopril. We stopped Lisinopril today and switched you to Losartan, which gives you the same great blood pressure protection without causing the cough.',
      keyDiagnoses: ['Medication Reaction (Lisinopril dry cough - now stopped)', 'Improving Blood Pressure'],
      medications: [
        {
          name: 'Losartan Potassium (NEW)',
          dosage: '50mg',
          frequency: 'Once every morning',
          withFood: true,
          purpose: 'Blood pressure control without causing cough',
          warnings: 'Do not take with potassium supplements without checking with your doctor.',
          status: 'active'
        },
        {
          name: 'Lisinopril (STOPPED)',
          dosage: '10mg',
          frequency: 'DISCONTINUED',
          withFood: false,
          purpose: 'Replaced due to dry cough side effect',
          status: 'discontinued'
        }
      ],
      actionChecklist: [
        'STOP taking Lisinopril immediately. Safely dispose of leftover pills.',
        'START taking Losartan 50mg once daily with breakfast starting tomorrow morning.',
        'Expect your dry cough to clear up within 7 to 14 days.',
        'Get your ordered blood test (potassium and kidney check) done within 4 weeks.'
      ],
      redFlagWarnings: [
        'If dry cough continues after 3 weeks off Lisinopril',
        'Sudden swelling or dizziness'
      ],
      nextSteps: 'Complete blood draw at local lab and see Dr. Chen in 4 weeks.'
    },
    retainedMemoryCount: 11
  }
];

export const DEMO_VISIT_3_TRANSCRIPT = `Doctor: Good afternoon John! Great to see you. How has the transition to Losartan 50mg been over this past month?
Patient: Doctor Chen, what a difference! The dry cough stopped completely within about 10 days of switching from Lisinopril. I've been sleeping through the night without coughing at all.
Doctor: That is wonderful news. And looking at your reading today, your blood pressure is 124 over 80. That is right in our optimal target range!
Patient: Wow, 124 over 80! That's the lowest I've seen in years.
Doctor: Your kidney panel and potassium from last week's lab also came back completely normal. Your GFR is greater than 90 and potassium is 4.3, which is right in the sweet spot.
Patient: That's reassuring. Quick question: with the changing weather, I sometimes get a runny nose or head congestion. Can I take standard over-the-counter cold and cough syrups or decongestants with Losartan?
Doctor: Excellent question. You should avoid oral decongestants that contain pseudoephedrine or phenylephrine, like Sudafed or multi-symptom cold syrups, because they constrict blood vessels and can spike your blood pressure right back up. For nasal symptoms, a saline nasal spray or plain antihistamine like Claritin or Zyrtec is much safer.
Patient: Good thing I asked! I will stick to saline spray and Claritin.
Doctor: Keep up the Losartan 50mg every morning, continue walking, and let's schedule our next routine check in 6 months.`;
