
'use client';

import React, { useState } from 'react';
import { Send, Sparkles, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getStyleAdvice, type StyleAssistantOutput } from '@/ai/flows/style-assistant-flow';

export function StyleAssistant() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<StyleAssistantOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const advice = await getStyleAdvice({ userQuery: query });
      setResult(advice);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[550px] bg-card border-none">
      <div className="p-6 bg-gradient-to-r from-[#01a3a4] to-[#00d2d3] flex items-center justify-between">
        <h4 className="font-black flex items-center gap-2 text-white uppercase tracking-widest text-xs">
          <Sparkles className="h-4 w-4 text-white animate-pulse" /> AI STYLE CONSULTANT
        </h4>
        <div className="h-6 w-6 rounded-none border border-white/30 flex items-center justify-center">
          <Info className="h-3 w-3 text-white/70" />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-black/40">
        {!result && !loading && (
          <div className="text-center mt-12 space-y-4">
            <div className="w-16 h-16 bg-[#01a3a4]/10 flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 text-[#01a3a4]/40" />
            </div>
            <p className="text-muted-foreground italic font-black uppercase text-[10px] tracking-widest px-4 leading-relaxed">
              "EXECUTIVE STYLING ADVICE FOR THE DHAKA ELITE..."
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center mt-12 gap-4">
            <Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#01a3a4] animate-pulse font-black">Generating Advice...</p>
          </div>
        )}

        {result && (
          <div className="animate-fade-in-up space-y-8">
            <div className="p-6 bg-[#01a3a4]/5 border-l-2 border-[#01a3a4] shadow-xl">
              <p className="text-lg leading-relaxed text-white italic font-headline">"{result.advice}"</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#01a3a4] font-black">PALETTE RECOMMENDATION</p>
              <div className="flex flex-wrap gap-2">
                {result.suggestedColors.map((color, i) => (
                  <span key={i} className="text-[10px] px-4 py-2 bg-white/5 border border-white/10 uppercase tracking-tighter font-black text-white">
                    {color}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#01a3a4] font-black">
                ESTABLISHED VIBE: <span className="text-white font-headline normal-case ml-2 text-xl">{result.vibe}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-black border-t border-white/10 flex gap-2">
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="E.G. WHAT TO WEAR FOR A GALA?" 
          className="bg-white/5 border-white/10 focus:ring-[#01a3a4] h-12 rounded-none text-[10px] font-black uppercase placeholder:text-white/20"
        />
        <Button disabled={loading} size="icon" className="h-12 w-12 rounded-none bg-[#01a3a4] hover:bg-[#01a3a4]/90 shadow-lg shadow-[#01a3a4]/20">
          <Send className="h-5 w-5 text-white" />
        </Button>
      </form>
    </div>
  );
}
