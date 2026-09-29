# CuraHindsight

> **Ambient Longitudinal Doctor-Patient Clinical Intelligence & Care Companion**  
> *Built for the "AI Agents That Learn Using Hindsight" Hackathon (Vectorize.io)*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Groq](https://img.shields.io/badge/Groq-Llama--3.3%20%26%20Whisper-orange?style=flat-square)](https://console.groq.com)
[![Hindsight](https://img.shields.io/badge/Hindsight-Persistent%20Memory-blue?style=flat-square)](https://hindsight.vectorize.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## The Real-World Problem

* **Physician Burnout**: Clinicians spend more than 2 hours on administrative EHR documentation for every 1 hour of direct patient care.
* **Information Loss**: Patients forget **40% to 80%** of medical advice immediately upon leaving the exam room, and nearly half of what they recall is remembered incorrectly.
* **The Stateless AI Bottleneck**: Standard LLMs and ambient scribes treat every consultation as Day One. They possess no longitudinal memory across visits, failing to track chronic trajectories, previous adverse drug events, or medication tolerances across time.

---

## The Solution: CuraHindsight

CuraHindsight ambiently listens during appointments and maintains a persistent, evolving clinical mental model powered by **Hindsight Memory Banks** and **Groq**:

```
                       Consultation Audio / Transcript
                                      |
                                      v
                        +---------------------------+
                        |   Hindsight Memory Bank   |
                        | (bank_id: "patient-101")  |
                        +-------------+-------------+
                                      |
              +-----------------------+-----------------------+
              |                                               |
              v                                               v
       DOCTOR COCKPIT                               PATIENT CARE COMPANION
-------------------------------                 -----------------------------------
- Ambient Audio Capture & Transcribe            - Plain-English Care Summary (Grade 6)
- Automated Clinical SOAP Notes (ICD-10)        - Clear Medication Instructions & Cues
- Instant Longitudinal History Alerts           - Interactive Daily Action Checklist
- Clinical Memory Copilot (Q&A)                 - 24/7 Health Memory Assistant
```

---

## How Hindsight Memory is the Core

Unlike basic vector databases that simply retrieve static text chunks, Hindsight extracts facts, tracks entity states, and resolves relationships over time:

| Hindsight Operation | Implementation in CuraHindsight |
| :--- | :--- |
| **`retain`** | Post-visit ingestion: extracts atomic facts, medication adjustments, and adverse drug reactions into the patient's persistent memory bank. |
| **`recall`** | Multi-strategy retrieval (semantic, keyword, graph, and temporal) to surface prior drug intolerances, vital trends, and lab orders during appointments. |
| **`reflect`** | High-level synthesis across multiple visits: evaluates whether a treatment switch resolved prior side-effects and cross-checks contraindicated medications. |

---

## Key Features

### For Clinicians (Doctor Cockpit)
* **Ambient Audio Capture**: Direct browser microphone capture with real-time waveform equalizer and speech transcription.
* **Automated SOAP Notes**: Instant structuring into Subjective, Objective, Assessment, and Plan with verified ICD-10 diagnostic codes and vitals.
* **Longitudinal Safety Flags**: Real-time alerts highlighting documented past adverse reactions (e.g., ACE-inhibitor cough) and pending laboratory tests.
* **Clinical Memory Copilot**: Grounded Q&A answering longitudinal questions with exact citations back to prior appointment logs.

### For Patients (Care Companion)
* **Jargon-Free Summary**: Translates complex clinical terminology into clear, comforting instructions.
* **Prescription Schedule**: Differentiates active regimens from discontinued pills, complete with food timing cues (e.g., *"Take with morning meal to prevent dizziness"*).
* **Action Checklist**: Interactive daily task list for medications, diet goals, and scheduled lab appointments.
* **Health Assistant**: Answers patient questions at home (e.g., *"Can I take cold medicine with my current blood pressure pills?"*) with personalized safety warnings.

---

## Technology Stack

* **Frontend & Backend**: Next.js 14 (App Router, React 18, TypeScript)
* **Styling**: Minimalist, information-dense SaaS design system inspired by Stripe & Apple
* **LLM Engine**: Groq Cloud API (`openai/gpt-oss-120b` & `whisper-large-v3`)
* **Long-Term Memory**: `@vectorize-io/hindsight-client` connecting to Hindsight Cloud
* **Audio Capture**: Browser Web Speech API (`webkitSpeechRecognition`) + MediaRecorder

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/curahindsight.git
cd curahindsight
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Groq API Key (Free tier at https://console.groq.com/keys)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Hindsight Cloud API Key (https://ui.hindsight.vectorize.io)
HINDSIGHT_API_KEY=hsk_your_hindsight_api_key_here
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io

# Default Demo Patient Memory Bank
DEFAULT_PATIENT_ID=patient_john_doe_101
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Project Structure

```
├── app/
│   ├── layout.tsx              # Application layout & root styling
│   ├── page.tsx                # Unified Doctor Cockpit & Patient Portal
│   ├── globals.css             # Monochromatic typography & minimal styling
│   └── api/
│       ├── consultation/       # Audio/text ingestion -> SOAP note -> Hindsight retain
│       ├── summary/            # Longitudinal patient history & memory retrieval
│       ├── chat/               # Clinical Q&A powered by Groq & Hindsight reflect
│       └── demo/               # Baseline patient records initialization
├── components/
│   ├── AudioRecorder.tsx       # Live microphone audio visualizer & transcription
│   ├── SoapNoteViewer.tsx      # Structured clinical SOAP note viewer & EHR copy
│   ├── PatientSummaryCard.tsx  # Patient-facing care plan & interactive checklist
│   ├── MemoryTimeline.tsx      # Chronological consultation history table
│   └── ChatInterface.tsx       # Markdown-rendered clinical memory Q&A
├── lib/
│   ├── types.ts                # TypeScript domain models
│   ├── groq.ts                 # Groq client integration
│   ├── hindsight.ts            # Hindsight client wrapper & resilient store
│   └── mockData.ts             # Clinical consultation datasets
├── .env.example                # Sample environment template
└── README.md                   # Project documentation
```

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.