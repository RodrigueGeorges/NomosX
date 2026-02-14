"use client";

import React, { useState } from 'react';
import { Loader2, Play, CheckCircle, AlertCircle, TrendingUp, Users, Target } from 'lucide-react';

interface DemoState {
  status: 'idle' | 'running' | 'completed' | 'error';
  topic: string;
  result?: {
    duration: string;
    sourcesFound: number;
    sourcesUsed: number;
    trustScore: number;
    qualityScore: number;
    summary: string;
    keyFindings: string[];
    researcherInsights: string[];
    councilDecision: string;
  };
  error?: string;
}

export default function InteractiveDemo() {
  const [demoState, setDemoState] = useState<DemoState>({
    status: 'idle',
    topic: ''
  });

  const [inputTopic, setInputTopic] = useState('');

  const runDemo = async () => {
    if (!inputTopic.trim()) return;

    setDemoState({
      status: 'running',
      topic: inputTopic
    });

    try {
      const response = await fetch('/api/demo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: inputTopic, mode: 'quick' })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Demo failed');
      }

      setDemoState({
        status: 'completed',
        topic: inputTopic,
        result
      });

    } catch (error) {
      setDemoState({
        status: 'error',
        topic: inputTopic,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const resetDemo = () => {
    setDemoState({ status: 'idle', topic: '' });
    setInputTopic('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Demo Header */}
      <div className="text-center mb-12">
        <h3 className="nx-heading-2 text-white/95 mb-4">
          See the AI Council in Action
        </h3>
        <p className="nx-body text-white/60 max-w-2xl mx-auto">
          Watch our 8 AI researchers analyze 25+ academic sources in real-time to generate strategic insights.
        </p>
      </div>

      {/* Demo Interface */}
      <div className="nx-card p-8">
        {demoState.status === 'idle' && (
          <div className="space-y-6">
            {/* Input Section */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">
                Enter a research topic
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputTopic}
                  onChange={(e) => setInputTopic(e.target.value)}
                  placeholder="e.g., AI regulation, carbon pricing, digital health..."
                  className="flex-1 px-4 py-3 bg-[#0C0C12] border border-white/[0.08] rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && runDemo()}
                />
                <button
                  onClick={runDemo}
                  disabled={!inputTopic.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-[#00D4FF]/20 to-[#3B82F6]/20 border border-[#00D4FF]/20 text-white rounded-lg hover:border-[#00D4FF]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Play size={16} />
                  Run Demo
                </button>
              </div>
            </div>

            {/* Example Topics */}
            <div className="flex flex-wrap gap-2">
              {['AI Regulation', 'Carbon Pricing', 'Digital Health', 'Supply Chain', 'Climate Tech'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setInputTopic(topic)}
                  className="px-3 py-1 text-sm bg-white/[0.04] border border-white/[0.08] rounded-full text-white/60 hover:border-[#00D4FF]/30 hover:text-[#00D4FF] transition-all"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {demoState.status === 'running' && (
          <div className="space-y-8">
            {/* Running Animation */}
            <div className="text-center py-12">
              <div className="relative inline-flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#00D4FF] animate-spin" />
                <div className="absolute inset-0 rounded-full border-2 border-[#00D4FF]/20 animate-ping" />
              </div>
              
              <div className="mt-6 space-y-2">
                <p className="text-white/90 font-medium">
                  AI Council is analyzing "{demoState.topic}"
                </p>
                <p className="text-white/60 text-sm">
                  Scanning academic sources, evaluating evidence, synthesizing insights...
                </p>
              </div>

              {/* Progress Steps */}
              <div className="mt-8 space-y-3 max-w-md mx-auto">
                {[
                  { step: 'Scanning 25+ academic sources', icon: Target, active: true },
                  { step: '8 AI researchers evaluating evidence', icon: Users, active: true },
                  { step: 'Harvard Council quality review', icon: CheckCircle, active: true },
                  { step: 'Generating strategic brief', icon: TrendingUp, active: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <item.icon 
                      size={16} 
                      className={`${
                        item.active ? 'text-[#00D4FF] animate-pulse' : 'text-white/20'
                      }`} 
                    />
                    <span className={item.active ? 'text-white/80' : 'text-white/40'}>
                      {item.step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {demoState.status === 'completed' && demoState.result && (
          <div className="space-y-8">
            {/* Success Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm mb-4">
                <CheckCircle size={16} />
                Analysis Complete
              </div>
              <h4 className="text-xl font-light text-white/90 mb-2">
                Strategic Brief Generated
              </h4>
              <p className="text-white/60 text-sm">
                Topic: "{demoState.topic}" • Completed in {demoState.result.duration}
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Metrics */}
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-white/70 mb-3">Analysis Metrics</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Sources Found</span>
                    <span className="text-[#00D4FF] font-medium">{demoState.result.sourcesFound}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Sources Used</span>
                    <span className="text-[#00D4FF] font-medium">{demoState.result.sourcesUsed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Trust Score</span>
                    <span className="text-[#00D4FF] font-medium">{demoState.result.trustScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Quality Score</span>
                    <span className="text-[#00D4FF] font-medium">{demoState.result.qualityScore}%</span>
                  </div>
                </div>
              </div>

              {/* Key Findings */}
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-white/70 mb-3">Key Findings</h5>
                <div className="space-y-2">
                  {demoState.result.keyFindings.map((finding, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] mt-2 flex-shrink-0" />
                      <span className="text-white/60 text-sm">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <h5 className="text-sm font-medium text-white/70 mb-3">Executive Summary</h5>
              <p className="text-white/60 text-sm leading-relaxed">
                {demoState.result.summary}
              </p>
            </div>

            {/* Council Decision */}
            <div className="flex items-center justify-between p-4 bg-[#00D4FF]/5 border border-[#00D4FF]/10 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-400" />
                <div>
                  <p className="text-white/90 font-medium">Harvard Council Decision</p>
                  <p className="text-white/60 text-sm">{demoState.result.councilDecision}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={resetDemo}
                className="px-6 py-3 border border-white/[0.1] text-white/70 hover:text-white hover:border-white/[0.2] transition-all rounded-lg"
              >
                Try Another Topic
              </button>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="px-6 py-3 bg-gradient-to-r from-[#00D4FF]/20 to-[#3B82F6]/20 border border-[#00D4FF]/20 text-white rounded-lg hover:border-[#00D4FF]/40 transition-all"
              >
                Get Full Access
              </button>
            </div>
          </div>
        )}

        {demoState.status === 'error' && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full mb-4">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <h4 className="text-lg font-light text-white/90 mb-2">
              Demo Failed
            </h4>
            <p className="text-white/60 text-sm mb-6">
              {demoState.error}
            </p>
            <button
              onClick={resetDemo}
              className="px-6 py-3 border border-white/[0.1] text-white/70 hover:text-white hover:border-white/[0.2] transition-all rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
