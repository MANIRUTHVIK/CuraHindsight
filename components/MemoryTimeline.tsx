'use client';

import React from 'react';
import { Consultation } from '@/lib/types';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface MemoryTimelineProps {
  visits: Consultation[];
  currentVisitId?: string;
  onSelectVisit?: (visit: Consultation) => void;
}

export default function MemoryTimeline({ visits, currentVisitId, onSelectVisit }: MemoryTimelineProps) {
  return (
    <div className="border border-gray-200 bg-white">
      {/* Table Header Bar matching Kuro Recordings tab */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-[#FAFAFA] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="bg-gray-950 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase">
            CONSULTATIONS
          </span>
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider px-2">
            LONGITUDINAL LOG
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
          <button className="p-0.5 text-gray-400 hover:text-gray-900 disabled:opacity-40" disabled>
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-[11px]">01 / 0{visits.length || 1}</span>
          <button className="p-0.5 text-gray-400 hover:text-gray-900 disabled:opacity-40" disabled>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-12 border-b border-gray-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        <div className="col-span-3">DATE / APPOINTMENT</div>
        <div className="col-span-3">TYPE / REASON</div>
        <div className="col-span-4">PRIMARY ASSESSMENT</div>
        <div className="col-span-2 text-right">VITALS / STATUS</div>
      </div>

      {/* Row Items */}
      <div className="divide-y divide-gray-100">
        {visits.map((v) => {
          const isSelected = v.id === currentVisitId;
          const isAdverse = v.soapNote.criticalAlerts && v.soapNote.criticalAlerts.length > 0;

          return (
            <div
              key={v.id}
              onClick={() => onSelectVisit && onSelectVisit(v)}
              className={`grid grid-cols-12 items-center px-4 py-3 text-xs transition cursor-pointer ${
                isSelected
                  ? 'bg-gray-50/90 font-medium'
                  : 'hover:bg-[#FAFAFA]'
              }`}
            >
              <div className="col-span-3 flex items-center gap-2 text-gray-900 font-mono text-[11px]">
                <span className="text-gray-400 text-xs">›</span>
                <span>{v.date}</span>
              </div>

              <div className="col-span-3 text-gray-700 truncate pr-2">
                {v.visitType}
              </div>

              <div className="col-span-4 text-gray-600 truncate pr-4 text-[11px]">
                {v.soapNote.assessment.split('\n')[0]}
              </div>

              <div className="col-span-2 flex items-center justify-end gap-2">
                {v.soapNote.vitals?.bloodPressure && (
                  <span className="font-mono text-[11px] font-semibold text-emerald-700">
                    {v.soapNote.vitals.bloodPressure}
                  </span>
                )}
                <span className={`border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  isAdverse 
                    ? 'border-amber-300 bg-amber-50 text-amber-800' 
                    : 'border-gray-200 bg-white text-gray-600'
                }`}>
                  {isAdverse ? 'ALERT' : 'CHARTED'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}