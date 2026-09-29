'use client';

import React, { useState } from 'react';
import { PatientSummary } from '@/lib/types';
import { Check, Clock, Utensils, AlertTriangle } from 'lucide-react';

interface PatientSummaryCardProps {
  summary: PatientSummary;
  patientName: string;
}

export default function PatientSummaryCard({ summary, patientName }: PatientSummaryCardProps) {
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});

  const toggleAction = (idx: number) => {
    setCompletedActions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="space-y-4">
      {/* Overview Box */}
      <div className="border border-gray-200 bg-white p-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">PATIENT RECAP</span>
        <h3 className="text-sm font-bold tracking-tight text-gray-950 mt-0.5">
          Care Plan for {patientName}.
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-gray-700 bg-[#FAFAFA] p-3.5 border border-gray-100">
          {summary.plainEnglishOverview}
        </p>
      </div>

      {/* Medications Table / List */}
      {summary.medications && summary.medications.length > 0 && (
        <div className="border border-gray-200 bg-white">
          <div className="border-b border-gray-100 bg-[#FAFAFA] px-4 py-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              CURRENT MEDICATIONS & INSTRUCTIONS
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {summary.medications.map((med, idx) => {
              const isDiscontinued = med.status === 'discontinued';
              return (
                <div key={idx} className="flex flex-wrap items-center justify-between p-4 text-xs gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${isDiscontinued ? 'line-through text-gray-400' : 'text-gray-950'}`}>
                        {med.name}
                      </span>
                      <span className="text-gray-500 font-mono text-[11px]">{med.dosage}</span>
                      <span className={`border px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                        isDiscontinued 
                          ? 'border-gray-200 bg-gray-50 text-gray-400' 
                          : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      }`}>
                        {med.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-500 text-[11px]">
                      <span>{med.frequency}</span>
                      {med.withFood && (
                        <span className="text-amber-800 font-medium">• Take with morning meal</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-gray-500 max-w-xs">
                    <p>{med.purpose}</p>
                    {med.warnings && (
                      <p className="text-amber-700 font-medium text-[10px] mt-0.5">{med.warnings}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Checklist & Warnings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Action Checklist */}
        {summary.actionChecklist && summary.actionChecklist.length > 0 && (
          <div className="border border-gray-200 bg-white p-4 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              ACTION CHECKLIST
            </span>
            <div className="space-y-1.5">
              {summary.actionChecklist.map((item, idx) => {
                const isChecked = !!completedActions[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => toggleAction(idx)}
                    className="flex w-full items-start gap-2.5 text-left text-xs p-1.5 hover:bg-[#FAFAFA] transition"
                  >
                    <div className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${
                      isChecked ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 bg-white'
                    }`}>
                      {isChecked && <Check className="h-2.5 w-2.5" />}
                    </div>
                    <span className={isChecked ? 'line-through text-gray-400' : 'text-gray-800'}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Cautions & Next Steps */}
        <div className="space-y-3">
          {summary.redFlagWarnings && summary.redFlagWarnings.length > 0 && (
            <div className="border border-amber-200 bg-amber-50/50 p-4 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-[11px] uppercase tracking-wider">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>When to Contact the Clinic</span>
              </div>
              <ul className="space-y-0.5 list-disc list-inside text-amber-900 text-[11px]">
                {summary.redFlagWarnings.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {summary.nextSteps && (
            <div className="border border-gray-200 bg-white p-3 text-xs text-gray-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">SCHEDULED FOLLOW-UP</span>
              <p className="mt-0.5 font-medium text-gray-900">{summary.nextSteps}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}