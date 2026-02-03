
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
import { Lock, User, Loader2, ShieldAlert } from 'lucide-react';
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'site-config'), [db]);
  const { data: settings } = useDoc(settingsRef);

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validUser = settings?.adminUsername || 'ADMIN';
    const validPass = settings?.adminPassword || '4321';

    setTimeout(() => {
      if (username === validUser && password === validPass) {
        const today = new Date().toISOString().split('T')[0];
        const statsRef = doc(db, 'loginStats', today);
        setDocumentNonBlocking(statsRef, { 
          count: increment(1),
          date: today
        }, { merge: true });

        sessionStorage.setItem('is_admin_authenticated', 'true');
        onClose();
        router.push('/admin');
      } else {
        setError('INVALID CREDENTIALS. ACCESS DENIED.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md bg-black border border-[#01a3a4]/30 rounded-none p-10 shadow-2xl">
        <DialogHeader className="space-y-4 text-center">
          <div className="w-16 h-16 bg-[#01a3a4]/10 border border-[#01a3a4]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Lock className="h-8 w-8 text-[#01a3a4]" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">ADMIN TERMINAL</DialogTitle>
            <DialogDescription className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
              RESTRICTED ACCESS AREA
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-6 mt-6" autoComplete="off">
          <input type="text" style={{ display: 'none' }} name="dummy_username_99" />
          <input type="password" style={{ display: 'none' }} name="dummy_password_99" />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                <User className="h-3 w-3" /> USERNAME
              </label>
              <Input 
                id="sys_admin_u_field"
                name="sys_admin_u_field"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ENTER USERNAME"
                autoComplete="off"
                spellCheck={false}
                data-lpignore="true"
                className="bg-white/5 border-white/10 rounded-none h-12 text-xs uppercase focus:ring-[#01a3a4]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2">
                <Lock className="h-3 w-3" /> ACCESS KEY
              </label>
              <Input 
                id="sys_admin_p_field"
                name="sys_admin_p_field"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                autoComplete="new-password"
                data-lpignore="true"
                className="bg-white/5 border-white/10 rounded-none h-12 text-xs uppercase focus:ring-[#01a3a4] tracking-widest"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-600/10 border border-red-600/30 flex items-center gap-2 animate-shake">
              <ShieldAlert className="h-4 w-4 text-red-600" />
              <p className="text-[9px] font-black text-red-600 uppercase">{error}</p>
            </div>
          )}

          <Button 
            disabled={loading}
            type="submit" 
            className="w-full bg-[#01a3a4] hover:bg-[#01a3a4]/90 text-white h-14 font-black uppercase tracking-widest rounded-none shadow-xl shadow-[#01a3a4]/10"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "GRANT ACCESS"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
