# 🩺 CuraHindsight
> **Ambient Longitudinal Doctor-Patient Clinical Intelligence & Care Companion**  
> Built for the *AI Agents That Learn Using Hindsight* Hackathon (Vectorize.io)

---

## 📌 Project Overview
CuraHindsight ambiently captures doctor-patient consultation dialogues and maintains a persistent, longitudinal clinical memory bank using **Hindsight**. 

- **For Doctors**: Eliminates 2+ hours of clinical charting burnout with automated SOAP notes (Subjective, Objective, Assessment, Plan) and provides instant longitudinal recall of patient history, drug intolerances, and treatment responses across visits.
- **For Patients**: Translates clinical discussions into reassuring, jargon-free visit summaries, provides an actionable medication & lab schedule, and powers a 24/7 memory-backed health companion chatbot.

---

## 🛠️ Tech Stack & Zero-Cost Architecture
- **Framework**: Next.js 14/15 (App Router, React, TypeScript, Tailwind CSS)
- **Memory Engine**: [Hindsight Cloud](https://ui.hindsight.vectorize.io) (Vectorize.io) via promo code `MEMHACK99` ($50 free credit) or local open-source Docker
- **LLM Reasoning**: [Groq Cloud](https://console.groq.com) (`llama-3.3-70b-versatile` & `whisper-large-v3`) — 100% Free Developer Tier
- **Audio Capture**: Browser Web Speech API (`webkitSpeechRecognition`) + MediaRecorder

---

## 🔑 Environment Variables (.env.local)

Create a file named `.env.local` in this project directory with:

```env
# 1. Groq Cloud API Key (Get free at https://console.groq.com/keys)
GROQ_API_KEY=gsk_your_groq_api_key_here

# 2. Hindsight Cloud API Key (Get at https://ui.hindsight.vectorize.io)
# Use promo code MEMHACK99 in billing for $50 free credit
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io

# 3. Default Patient Memory Bank
DEFAULT_PATIENT_ID=patient_john_doe_101
```

*Note: The app includes a built-in Mock / Offline Demo mode, so you can test the full UI and multi-visit experience immediately even before adding keys.*

---

## 🚀 Workflows
1. **Live Consultation Recorder**: Captures audio and generates structured SOAP notes + Patient Summary, then calls Hindsight `retain`.
2. **Doctor Longitudinal Cockpit**: 1-click clinical briefing and past history Q&A powered by Hindsight `recall`.
3. **Patient Care Companion**: Plain-English review, action items, and 24/7 memory Q&A via Hindsight `reflect`.
4. **3-Visit Hackathon Demo**: Pre-configured Visits 1, 2, and 3 demonstrating how Hindsight tracks drug side effects and recovery across months.
