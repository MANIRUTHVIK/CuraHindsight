'use client';

import React, { useState } from 'react';
import { SoapNote } from '@/lib/types';
import { Copy, Check, AlertCircle } from 'lucide-react';

interface SoapNoteViewerProps {
  soapNote: SoapNote;
  patientName: string;
  visitDate?: string;
}

export default function SoapNoteViewer({ soapNote, patientName, visitDate = 'Today' }: SoapNoteViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const formatted = `PATIENT: ${patientName}\nDATE: ${visitDate}\n\nSUBJECTIVE:\n${soapNote.subjective}\n\nOBJECTIVE:\n${soapNote.objective}\n\nASSESSMENT:\n${soapNote.assessment}\n\nPLAN:\n${soapNote.plan}\n\nFOLLOW-UP:\n${soapNote.followUp}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 bg-white">
      {/* Title & Copy Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-[#FAFAFA] px-5 py-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">CLINICAL DOCUMENTATION</span>
          <h3 className="text-sm font-bold tracking-tight text-gray-950 mt-0.5">
            SOAP Chart Note. <span className="font-normal text-xs text-gray-500">({patientName} • {visitDate})</span>
          </h3>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-gray-400" />
              <span>Copy Note</span>
            </>
          )}
        </button>
      </div>

      {/* Alert Strip if any */}
      {soapNote.criticalAlerts && soapNote.criticalAlerts.length > 0 && (
        <div className="border-b border-amber-200 bg-amber-50/60 px-5 py-2 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            {soapNote.criticalAlerts.map((a, i) => (
              <p key={i} className="font-medium text-[11px]">{a}</p>
            ))}
          </div>
        </div>
      )}

      {/* Vitals Summary Strip */}
      <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-5 py-2 text-xs bg-white">
        {soapNote.vitals?.bloodPressure && (
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span className="text-gray-400 font-sans">BP:</span>
            <span className="font-bold text-emerald-600">{soapNote.vitals.bloodPressure}</span>
          </div>
        )}
        {soapNote.vitals?.heartRate && (
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span className="text-gray-400 font-sans">HR:</span>
            <span className="font-semibold text-gray-800">{soapNote.vitals.heartRate}</span>
          </div>
        )}
        {soapNote.vitals?.oxygenSat && (
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span className="text-gray-400 font-sans">SpO2:</span>
            <span className="font-semibold text-gray-800">{soapNote.vitals.oxygenSat}</span>
          </div>
        )}
        {soapNote.icd10Codes && soapNote.icd10Codes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 ml-auto">
            {soapNote.icd10Codes.map((icd, i) => (
              <span key={i} className="border border-gray-200 bg-[#FAFAFA] px-1.5 py-0.5 font-mono text-[10px] text-gray-600">
                {icd.code}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 p-5 gap-5">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">SUBJECTIVE</span>
            <p className="mt-1 text-xs leading-relaxed text-gray-800 whitespace-pre-line bg-[#FAFAFA] p-3 border border-gray-100">
              {soapNote.subjective}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">OBJECTIVE</span>
            <p className="mt-1 text-xs leading-relaxed text-gray-800 whitespace-pre-line bg-[#FAFAFA] p-3 border border-gray-100">
              {soapNote.objective}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 md:pl-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">ASSESSMENT</span>
            <p className="mt-1 text-xs leading-relaxed text-gray-800 whitespace-pre-line bg-[#FAFAFA] p-3 border border-gray-100">
              {soapNote.assessment}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">PLAN & ORDERS</span>
            <p className="mt-1 text-xs leading-relaxed text-gray-800 whitespace-pre-line bg-[#FAFAFA] p-3 border border-gray-100">
              {soapNote.plan}
            </p>
          </div>

          {soapNote.followUp && (
            <div className="border border-gray-200 bg-white p-2.5 text-xs text-gray-700">
              <span className="font-semibold text-gray-900">Follow-up:</span> {soapNote.followUp}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}