'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Check, Upload } from 'lucide-react';

interface AudioRecorderProps {
  onTranscriptComplete: (transcript: string) => void;
  isProcessing: boolean;
}

export default function AudioRecorder({ onTranscriptComplete, isProcessing }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>([15, 25, 45, 20, 60, 30, 75, 40, 50, 30, 20, 15]);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveAmplitudes(prev => 
          prev.map(() => Math.floor(Math.random() * 65) + 15)
        );
      }, 120);
    } else {
      setWaveAmplitudes([15, 20, 30, 20, 40, 25, 35, 20, 30, 25, 20, 15]);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (!speechSupported) {
      alert('Microphone speech recognition is not supported in this browser. You can type or upload notes.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Recognition error:', err);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setTranscript(text);
      };
      reader.readAsText(file);
    }
  };

  const handleProcess = () => {
    if (!transcript.trim()) return;
    onTranscriptComplete(transcript);
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">INPUT</span>
          <span className="text-gray-300">•</span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${isRecording ? 'text-rose-600' : 'text-gray-600'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isRecording ? 'animate-ping bg-rose-600' : 'bg-emerald-500'}`} />
            {isRecording ? 'Recording Live Dialogue' : 'Ambient Standby'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.doc"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-1 border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Upload className="h-3 w-3 text-gray-400" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Waveform Equalizer Strip */}
      <div className="my-2.5 flex items-center justify-between border border-gray-100 bg-[#FAFAFA] px-3 py-2 shrink-0">
        <div className="flex items-center gap-1 h-6">
          {waveAmplitudes.map((amp, idx) => (
            <div
              key={idx}
              style={{ height: `${amp}%` }}
              className={`w-1 transition-all duration-150 ${
                isRecording ? 'bg-amber-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={toggleRecording}
          disabled={isProcessing}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide transition ${
            isRecording
              ? 'bg-rose-600 text-white hover:bg-rose-700'
              : 'bg-gray-950 text-white hover:bg-black'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="h-3 w-3" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Mic className="h-3 w-3" />
              <span>Record Audio</span>
            </>
          )}
        </button>
      </div>

      {/* Transcript Textbox (Flex-1 so it expands to fill space, resize-none) */}
      <div className="flex-1 flex flex-col min-h-0 space-y-1">
        <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-wider font-semibold shrink-0">
          <span>CONSULTATION DIALOGUE</span>
          <span>{transcript ? `${transcript.split(/\s+/).filter(Boolean).length} WORDS` : 'READY'}</span>
        </div>

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Doctor-patient dialogue will transcribe here automatically in real time, or type/paste notes..."
          className="flex-1 w-full border border-gray-200 bg-white p-2.5 text-xs font-mono text-gray-900 placeholder:text-gray-400 focus:border-gray-950 focus:outline-none resize-none overflow-y-auto"
        />
      </div>

      {/* Action Footer (Always visible pinned at bottom) */}
      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-gray-100 shrink-0">
        <span className="text-[10px] text-gray-400">
          Auto-structures SOAP & updates chart
        </span>

        <div className="flex items-center gap-2">
          {transcript && (
            <button
              onClick={() => setTranscript('')}
              disabled={isProcessing}
              className="border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-500 hover:text-gray-800"
            >
              Clear
            </button>
          )}

          <button
            onClick={handleProcess}
            disabled={!transcript.trim() || isProcessing}
            className="flex items-center gap-1.5 bg-gray-950 px-3.5 py-1 text-xs font-semibold text-white hover:bg-black disabled:opacity-40"
          >
            {isProcessing ? (
              <>
                <div className="h-3 w-3 animate-spin border-2 border-white border-t-transparent" />
                <span>Charting...</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Complete & Chart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}