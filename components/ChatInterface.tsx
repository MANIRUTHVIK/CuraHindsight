'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, User, Sparkles, BookOpen, Bot } from 'lucide-react';
import { ChatMessage } from '@/lib/types';

interface ChatInterfaceProps {
  role: 'doctor' | 'patient';
  patientId: string;
  patientName: string;
}

export default function ChatInterface({ role, patientId, patientName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: role === 'doctor'
        ? `Clinical Intelligence Assistant active for **${patientName}**. Inquire about prior diagnoses, treatment regimens, drug reactions, or longitudinal trends.`
        : `Hello **${patientName}**. Ask any questions about your recent consultation, medication schedule, or follow-up instructions.`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = role === 'doctor' ? [
    'Why was Lisinopril discontinued?',
    'Summarize blood pressure trends across all visits',
    'Are beta-blockers contraindicated?',
    'What lab orders are currently pending?'
  ] : [
    'Can I take cold medicine or cough syrup with Losartan?',
    'Why did the doctor stop my previous blood pressure medicine?',
    'Should I take my morning pills with food?',
    'When is my next follow-up appointment?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          patientId,
          patientName,
          role
        })
      });

      const data = await res.json();
      if (data.answer) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          timestamp: 'Just now',
          sources: data.sources
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'Failed to retrieve response');
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Unable to retrieve clinical records at this moment. Please check connection and try again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-gray-900">
              {role === 'doctor' ? 'Clinical Assistant' : 'Health Assistant'}
            </h3>
            <p className="text-[11px] text-gray-500">
              Grounded in {patientName}'s verified clinical records
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-100 bg-white px-4 py-2.5 no-scrollbar">
        <span className="shrink-0 text-[11px] font-medium text-gray-400">Quick queries:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6 max-h-[460px]">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isUser
                    ? 'bg-gray-900 text-white'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isUser ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-800'
                }`}
              >
                {/* Structured Markdown Rendering */}
                <div className={`prose prose-sm max-w-none ${isUser ? 'text-white' : 'text-gray-800'}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Sources pill */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 border-t border-gray-200 pt-2.5 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 font-semibold text-gray-700 mb-1">
                      <BookOpen className="h-3 w-3 text-emerald-600" />
                      Referenced Clinical Records:
                    </span>
                    <ul className="space-y-1 list-disc list-inside">
                      {msg.sources.map((s, idx) => (
                        <li key={idx} className="truncate text-gray-600">{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-500">
              Reviewing patient clinical records...
            </div>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="border-t border-gray-100 bg-white p-3.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              role === 'doctor'
                ? "Inquire about past appointments, medications, allergies, or vitals..."
                : "Ask about doctor instructions, your medications, or next steps..."
            }
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-black active:scale-95 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}