'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertCircle, 
  Check, 
  ChevronDown, 
  ChevronRight,
  Clock, 
  FileText, 
  Pill, 
  MessageSquare, 
  Mic, 
  ShieldCheck, 
  User, 
  HelpCircle
} from 'lucide-react';
import AudioRecorder from '@/components/AudioRecorder';
import SoapNoteViewer from '@/components/SoapNoteViewer';
import PatientSummaryCard from '@/components/PatientSummaryCard';
import MemoryTimeline from '@/components/MemoryTimeline';
import ChatInterface from '@/components/ChatInterface';
import { DEFAULT_PATIENT, DEMO_VISITS } from '@/lib/mockData';
import { Consultation, PatientProfile } from '@/lib/types';

const CLINICAL_PATIENTS: PatientProfile[] = [
  DEFAULT_PATIENT,
  {
    id: 'patient_eleanor_vance_202',
    name: 'Eleanor Vance',
    age: 44,
    gender: 'Female',
    knownAllergies: ['Sulfa Drugs'],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Dyslipidemia'],
    activeMedications: ['Metformin 500mg BID', 'Atorvastatin 20mg QHS'],
    pastIntolerances: [],
    visitCount: 1
  },
  {
    id: 'patient_michael_chang_303',
    name: 'Michael Chang',
    age: 62,
    gender: 'Male',
    knownAllergies: ['Aspirin (GI Bleed)'],
    chronicConditions: ['Coronary Artery Disease'],
    activeMedications: ['Clopidogrel 75mg Daily', 'Metoprolol 25mg Daily'],
    pastIntolerances: [],
    visitCount: 1
  }
];

export default function Home() {
  const [role, setRole] = useState<'doctor' | 'patient'>('doctor');
  const [activeTab, setActiveTab] = useState<'record' | 'soap' | 'plan' | 'log' | 'chat'>('record');
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile>(CLINICAL_PATIENTS[0]);
  const [visits, setVisits] = useState<Consultation[]>(DEMO_VISITS);
  const [selectedVisit, setSelectedVisit] = useState<Consultation | null>(DEMO_VISITS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/summary?patientId=${selectedPatient.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.baselineVisits && selectedPatient.id === DEFAULT_PATIENT.id) {
          setVisits(data.baselineVisits);
          setSelectedVisit(data.baselineVisits[0]);
        }
      })
      .catch(console.error);
  }, [selectedPatient]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePatientSelect = (patient: PatientProfile) => {
    setSelectedPatient(patient);
    setPatientDropdownOpen(false);
    if (patient.id === DEFAULT_PATIENT.id) {
      setVisits(DEMO_VISITS);
      setSelectedVisit(DEMO_VISITS[0]);
    } else {
      setVisits([]);
      setSelectedVisit(null);
    }
  };

  const handleTranscriptComplete = async (transcript: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          patientId: selectedPatient.id,
          patientName: selectedPatient.name,
          visitType: 'Clinical Follow-up'
        })
      });

      const data = await res.json();
      if (data.success && data.consultation) {
        const newVisit = data.consultation;
        setVisits(prev => [newVisit, ...prev]);
        setSelectedVisit(newVisit);
        setActiveTab('soap');
        showToast('Consultation documented and saved to patient record.');
      } else {
        throw new Error(data.error || 'Failed to process consultation');
      }
    } catch (err: any) {
      alert(`Error processing consultation: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen max-h-screen w-screen overflow-hidden bg-[#FAFAFA] text-gray-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-3 right-4 z-50 flex items-center gap-1.5 border border-gray-950 bg-gray-950 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          <Check className="h-3 w-3 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Minimal Left Sidebar (Fixed 100vh height, zero scroll) */}
      <aside className="w-48 h-full shrink-0 border-r border-gray-200 bg-white p-3.5 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Logo */}
          <div className="flex items-center justify-between px-1">
            <span className="text-lg font-black tracking-tight text-gray-950">cura</span>
            <span className="inline-flex items-center gap-1 border border-amber-200 bg-amber-50 px-1 py-0.2 text-[8px] font-bold text-amber-800 uppercase tracking-wider">
              <span className="h-1 w-1 rounded-full bg-amber-500" />
              CLINICAL
            </span>
          </div>

          <div className="border-b border-dashed border-gray-200" />

          {/* Navigation Links */}
          <nav className="space-y-0.5 text-xs">
            <button
              onClick={() => setActiveTab('record')}
              className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[11px] transition ${
                activeTab === 'record'
                  ? 'bg-[#111827] text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950'
              }`}
            >
              <Mic className="h-3 w-3" />
              <span>Consultations</span>
            </button>

            <button
              onClick={() => setActiveTab('soap')}
              className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[11px] transition ${
                activeTab === 'soap'
                  ? 'bg-[#111827] text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950'
              }`}
            >
              <FileText className="h-3 w-3" />
              <span>SOAP Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('plan')}
              className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[11px] transition ${
                activeTab === 'plan'
                  ? 'bg-[#111827] text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950'
              }`}
            >
              <Pill className="h-3 w-3" />
              <span>Care Plan</span>
            </button>

            <button
              onClick={() => setActiveTab('log')}
              className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[11px] transition ${
                activeTab === 'log'
                  ? 'bg-[#111827] text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950'
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>Medical History</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[11px] transition ${
                activeTab === 'chat'
                  ? 'bg-[#111827] text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950'
              }`}
            >
              <MessageSquare className="h-3 w-3" />
              <span>{role === 'doctor' ? 'Clinical Inquiries' : 'Health Assistant'}</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-2.5 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
          <div className="border border-gray-200 p-0.5 flex bg-[#FAFAFA]">
            <button
              onClick={() => setRole('doctor')}
              className={`flex-1 py-0.5 text-center font-medium text-[10px] ${
                role === 'doctor' ? 'bg-white text-gray-950 font-bold shadow-xs' : 'text-gray-500'
              }`}
            >
              Doctor
            </button>
            <button
              onClick={() => setRole('patient')}
              className={`flex-1 py-0.5 text-center font-medium text-[10px] ${
                role === 'patient' ? 'bg-white text-gray-950 font-bold shadow-xs' : 'text-gray-500'
              }`}
            >
              Patient
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-1 text-gray-500 text-[10px]">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            <span>Verified Records</span>
          </div>
        </div>
      </aside>

      {/* Main Screen (Fits 100vh, zero window scroll) */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        {/* Compact Workspace Header */}
        <div className="flex-1 flex flex-col p-4 max-w-5xl w-full mx-auto overflow-hidden space-y-2.5">
          {/* Top Row: Title & Patient Dropdown */}
          <div className="flex items-center justify-between shrink-0">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">
                {role === 'doctor' ? 'CLINICAL INTELLIGENCE' : 'PATIENT CARE ACCESS'}
              </span>
              <h1 className="text-xl font-bold tracking-tight text-gray-950 -mt-0.5">
                {role === 'doctor' ? 'Consultations.' : 'My Care Plan.'}
              </h1>
            </div>

            {/* Patient Selector */}
            <div className="relative">
              <button
                onClick={() => setPatientDropdownOpen(!patientDropdownOpen)}
                className="flex items-center gap-1.5 border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 hover:border-gray-400 transition"
              >
                <span>{selectedPatient.name}</span>
                <span className="text-gray-400 font-mono text-[10px]">({selectedPatient.age}y)</span>
                <ChevronDown className="h-3 w-3 text-gray-500 ml-0.5" />
              </button>

              {patientDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 border border-gray-200 bg-white p-1 shadow-lg z-50">
                  <div className="px-2 py-0.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    Select Patient Record
                  </div>
                  {CLINICAL_PATIENTS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handlePatientSelect(p)}
                      className={`flex w-full items-center justify-between px-2 py-1 text-left text-xs ${
                        selectedPatient.id === p.id
                          ? 'bg-gray-100 font-semibold text-gray-950'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{p.name}</span>
                      <span className="font-mono text-[9px] text-gray-400">{p.age}y • {p.gender}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Compact Notice Row */}
          {selectedPatient.pastIntolerances.length > 0 && (
            <div className="border border-amber-200 bg-amber-50/60 px-3 py-1.5 text-xs text-amber-900 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-amber-600 font-bold text-xs">↳</span>
                <span className="font-medium text-[11px] truncate">
                  Adverse Reaction: {selectedPatient.pastIntolerances[0].medication} ({selectedPatient.pastIntolerances[0].reaction})
                </span>
              </div>
              <span className="text-[10px] text-amber-700 font-mono uppercase shrink-0 ml-2">DOCUMENTED</span>
            </div>
          )}

          {/* 3 Compact Metrics Cards (Kuro layout) */}
          <div className="grid grid-cols-3 border border-gray-200 bg-white divide-x divide-gray-200 shrink-0">
            <div className="px-3.5 py-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">
                LATEST BP
              </span>
              <div className="text-base font-bold tracking-tight text-[#10B981]">
                124/80 <span className="text-[10px] font-normal text-gray-500">mmHg</span>
              </div>
            </div>

            <div className="px-3.5 py-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">
                TOTAL CONSULTATIONS
              </span>
              <div className="text-base font-bold tracking-tight text-gray-950">
                0{visits.length} <span className="text-[10px] font-normal text-gray-500">On Record</span>
              </div>
            </div>

            <div className="px-3.5 py-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">
                ACTIVE REGIMEN
              </span>
              <div className="text-base font-bold tracking-tight text-gray-950 truncate">
                Losartan 50mg
              </div>
            </div>
          </div>

          {/* Compact Treatment Target Progress Bar */}
          <div className="border border-gray-200 bg-white px-3 py-1.5 shrink-0 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold uppercase tracking-wider text-gray-400">
                TREATMENT TARGET (BP &lt; 130/80)
              </span>
              <span className="font-mono text-gray-600 text-[10px]">
                124/80 achieved <strong className="text-emerald-600">100%</strong>
              </span>
            </div>
            <div className="h-1 w-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-emerald-500 w-full" />
            </div>
          </div>

          {/* Workspace Tabs matching Kuro RECORDINGS */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-1 shrink-0">
            <div className="flex items-center gap-1 text-[11px]">
              <button
                onClick={() => setActiveTab('record')}
                className={`px-2.5 py-0.5 font-bold uppercase tracking-wider transition ${
                  activeTab === 'record'
                    ? 'bg-gray-950 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                RECORDING
              </button>

              <button
                onClick={() => setActiveTab('soap')}
                className={`px-2.5 py-0.5 font-bold uppercase tracking-wider transition ${
                  activeTab === 'soap'
                    ? 'bg-gray-950 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                SOAP NOTE
              </button>

              <button
                onClick={() => setActiveTab('plan')}
                className={`px-2.5 py-0.5 font-bold uppercase tracking-wider transition ${
                  activeTab === 'plan'
                    ? 'bg-gray-950 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                CARE PLAN
              </button>

              <button
                onClick={() => setActiveTab('log')}
                className={`px-2.5 py-0.5 font-bold uppercase tracking-wider transition ${
                  activeTab === 'log'
                    ? 'bg-gray-950 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                LOGS
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`px-2.5 py-0.5 font-bold uppercase tracking-wider transition ${
                  activeTab === 'chat'
                    ? 'bg-gray-950 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {role === 'doctor' ? 'INQUIRIES' : 'ASSISTANT'}
              </button>
            </div>

            <span className="text-[10px] font-mono text-gray-400">
              01 / 0{visits.length || 1}
            </span>
          </div>

          {/* Active Workspace View (Flex-1, fills the exact remaining screen height with zero window scroll) */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {activeTab === 'record' && (
              <AudioRecorder
                onTranscriptComplete={handleTranscriptComplete}
                isProcessing={isProcessing}
              />
            )}

            {activeTab === 'soap' && (
              selectedVisit ? (
                <SoapNoteViewer
                  soapNote={selectedVisit.soapNote}
                  patientName={selectedPatient.name}
                  visitDate={selectedVisit.date}
                />
              ) : (
                <div className="border border-gray-200 bg-white p-5 text-center text-xs text-gray-500">
                  No consultation charted yet. Use the Recording tab to document an appointment.
                </div>
              )
            )}

            {activeTab === 'plan' && (
              selectedVisit ? (
                <PatientSummaryCard
                  summary={selectedVisit.patientSummary}
                  patientName={selectedPatient.name}
                />
              ) : (
                <div className="border border-gray-200 bg-white p-5 text-center text-xs text-gray-500">
                  No active care plan documented yet.
                </div>
              )
            )}

            {activeTab === 'log' && (
              <MemoryTimeline
                visits={visits}
                currentVisitId={selectedVisit?.id}
                onSelectVisit={(v) => {
                  setSelectedVisit(v);
                  setActiveTab('soap');
                }}
              />
            )}

            {activeTab === 'chat' && (
              <div className="h-full flex flex-col">
                <ChatInterface
                  role={role}
                  patientId={selectedPatient.id}
                  patientName={selectedPatient.name}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}