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
    <div className="flex flex-col h-[500px] bg-card border-none">
      <div className="p-6 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-between">
        <h4 className="font-bold flex items-center gap-2 text-background">
          <Sparkles className="h-4 w-4 text-background animate-pulse" /> AI Style Assistant
        </h4>
        <div className="h-6 w-6 rounded-full border border-background/30 flex items-center justify-center">
          <Info className="h-3 w-3 text-background/70" />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-background/50">
        {!result && !loading && (
          <div className="text-center mt-12 space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 text-primary/40" />
            </div>
            <p className="text-muted-foreground italic font-light px-4">
              "I can help you find the perfect outfit for any occasion..."
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center mt-12 gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-xs uppercase tracking-[0.2em] text-primary animate-pulse font-bold">Generating Advice...</p>
          </div>
        )}

        {result && (
          <div className="animate-fade-in-up space-y-6">
            <div className="p-5 bg-primary/10 rounded-2xl border-l-4 border-primary shadow-sm">
              <p className="text-sm leading-relaxed text-foreground/90 italic font-medium">"{result.advice}"</p>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Suggested Colors</p>
              <div className="flex flex-wrap gap-2">
                {result.suggestedColors.map((color, i) => (
                  <span key={i} className="text-[10px] px-3 py-1.5 bg-background rounded-full border border-primary/20 shadow-sm uppercase tracking-tighter font-bold">
                    {color}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-primary/10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Vibe: <span className="text-foreground">{result.vibe}</span></p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-card border-t border-primary/10 flex gap-2">
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me: What should I wear to a wedding?" 
          className="bg-background/80 border-primary/20 focus:ring-primary h-12 rounded-xl text-sm"
        />
        <Button disabled={loading} size="icon" className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Send className="h-5 w-5 text-background" />
        </Button>
      </form>
    </div>
  );
}
