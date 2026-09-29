# 🩺 CuraHindsight: Ambient Longitudinal Consultation Recorder & Memory Bank
> Built for the *AI Agents That Learn Using Hindsight* Hackathon (Vectorize.io)

---

## 📌 Problem & Hackathon Alignment
In healthcare, memory is longitudinal and life-critical.
- **For Doctors**: Eliminates 2+ hours of clinical charting burnout with automated SOAP notes (Subjective, Objective, Assessment, Plan) and provides instant longitudinal recall of patient history, drug intolerances, and treatment responses across visits.
- **For Patients**: Translates clinical discussions into reassuring, jargon-free visit summaries, provides an actionable medication & lab schedule, and powers a 24/7 memory-backed health companion chatbot.

---

## 🛠️ Tech Stack & Zero-Cost Architecture
- **Framework**: Next.js (App Router, React, TypeScript, Tailwind CSS)
- **Memory Engine**: [Hindsight Cloud](https://ui.hindsight.vectorize.io) (Vectorize.io) via promo code `MEMHACK99` ($50 free credit)
- **LLM Reasoning**: [Groq Cloud](https://console.groq.com) (`llama-3.3-70b-versatile` & `whisper-large-v3`) — 100% Free Developer Tier
- **Audio Capture**: Browser Web Speech API (`webkitSpeechRecognition`) + Microphone + 1-Click Demo Presets

---

## 🔑 Environment Setup (.env)
Add your keys into `.env`:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
DEFAULT_PATIENT_ID=patient_john_doe_101
```

### Free Key Instructions:
1. **Groq API Key**: Go to https://console.groq.com/keys -> Sign in -> Create API Key ($0, 14,400 free requests/day).
2. **Hindsight Cloud Key**: Go to https://ui.hindsight.vectorize.io -> Register -> Enter promo code `MEMHACK99` in Billing section ($50 credit) -> Copy API key from Connect / API Keys.

---

## 🚀 Core Workflows
1. **Ambient Consultation Recorder**: Records doctor-patient appointment speech, transcribes, creates SOAP notes and patient summary, and calls Hindsight `retain`.
2. **Doctor Longitudinal Cockpit**: 1-click clinical briefing and past history Q&A powered by Hindsight `recall`.
3. **Patient Care Companion**: Plain-English review, action items, and 24/7 memory Q&A via Hindsight `reflect`.
4. **3-Visit Hackathon Demo**: Pre-configured Visits 1, 2, and 3 demonstrating how Hindsight tracks drug side effects and recovery across months.
