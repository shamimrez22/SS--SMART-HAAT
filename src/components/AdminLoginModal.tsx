
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, User, Loader2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, increment } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'site-config');
  }, [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError('');
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validUser = settings?.adminUsername || 'ADMIN';
    const validPass = settings?.adminPassword || '4321';

    // Strict Case Sensitivity Check - No Uppercase Enforcement
    setTimeout(() => {
      if (username === validUser && password === validPass) {
        const today = new Date().toISOString().split('T')[0];
        if (db) {
          const statsRef = doc(db, 'loginStats', today);
          setDocumentNonBlocking(statsRef, { 
            count: increment(1),
            date: today
          }, { merge: true });
        }

        sessionStorage.setItem('is_admin_authenticated', 'true');
        onClose();
        router.push('/admin');
      } else {
        setError('INVALID CREDENTIALS. ACCESS DENIED.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-[320px] md:max-w-sm bg-black border border-[#01a3a4]/30 rounded-none p-6 shadow-2xl gpu-accelerated outline-none overflow-hidden">
        <DialogHeader className="space-y-4 text-center w-full">
          <div className="w-12 h-12 bg-[#01a3a4]/10 border border-[#01a3a4]/20 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6 text-[#01a3a4]" />
          </div>
          <div className="space-y-2 flex flex-col items-center w-full">
            {/* SOLID CONTAINER FOR HEADER - HARD CENTER FIX */}
            <div className="bg-[#01a3a4] w-full py-3 shadow-xl border border-white/10 flex items-center justify-center">
              <DialogTitle className="text-sm md:text-lg font-black text-white uppercase tracking-tighter leading-none m-0 p-0 text-center">
                ADMIN TERMINAL
              </DialogTitle>
            </div>
            <DialogDescription className="text-[8px] text-muted-foreground uppercase font-black tracking-[0.2em] w-full text-center">
              RESTRICTED ACCESS AREA
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 mt-4 w-full" autoComplete="off">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2">
                <User className="h-3 w-3 text-[#01a3a4]" /> USERNAME
              </label>
              <Input 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="bg-white/5 border-white/10 rounded-none h-10 text-xs focus:ring-[#01a3a4] text-white placeholder:text-white/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-2">
                <Lock className="h-3 w-3 text-[#01a3a4]" /> ACCESS KEY
              </label>
              <div className="relative">
                <Input 
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 rounded-none h-10 text-xs focus:ring-[#01a3a4] text-white pr-10 placeholder:text-white/20"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-2 bg-red-600/10 border border-red-600/30 flex items-center gap-2 animate-pulse">
              <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
              <p className="text-[8px] font-black text-red-600 uppercase">{error}</p>
            </div>
          )}

          <Button 
            disabled={loading}
            type="submit" 
            className="w-full bg-[#01a3a4] hover:bg-white hover:text-black text-white h-12 font-black uppercase tracking-widest rounded-none shadow-xl shadow-[#01a3a4]/10 transition-all active:scale-95 text-[10px]"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "GRANT ACCESS"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
