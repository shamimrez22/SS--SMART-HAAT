
"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { MapPin, Radio, Store, Lock, Save, Loader2, Settings2 } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const settingsRef = useMemoFirebase(() => doc(db, 'settings', 'site-config'), [db]);
  const { data: settings } = useDoc(settingsRef);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [password, setPassword] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const validPass = settings?.adminPassword || '4321';

    if (password !== validPass) {
      toast({
        variant: "destructive",
        title: "ACCESS DENIED",
        description: "INVALID ADMIN PASSWORD.",
      });
      return;
    }

    setIsUpdating(true);
    setDocumentNonBlocking(settingsRef, {
      liveLocation: newLocation.toUpperCase() || settings?.liveLocation,
      liveStatus: newStatus.toUpperCase() || settings?.liveStatus
    }, { merge: true });

    setTimeout(() => {
      setIsUpdating(false);
      setIsAdminMode(false);
      setPassword('');
      toast({
        title: "SUCCESS",
        description: "LOCATION & STATUS UPDATED LIVE.",
      });
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => {
      if (!val) {
        onClose();
        setIsAdminMode(false);
        setPassword('');
      }
    }}>
      <DialogContent className="max-w-md bg-black border border-[#01a3a4]/30 rounded-none p-10 shadow-2xl">
        <DialogHeader className="space-y-4 text-center">
          <div className="w-16 h-16 bg-[#01a3a4]/10 border border-[#01a3a4]/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Store className="h-8 w-8 text-[#01a3a4]" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">
              {isAdminMode ? 'UPDATE TERMINAL' : 'STORE STATUS'}
            </DialogTitle>
            <DialogDescription className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
              {isAdminMode ? 'SYSTEM OVERRIDE ENABLED' : 'LIVE UPDATES FROM OUR HUB'}
            </DialogDescription>
          </div>
        </DialogHeader>

        {!isAdminMode ? (
          <div className="mt-8 space-y-6">
            <div className="p-6 bg-white/5 border border-white/5 space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-[#01a3a4]/10 border border-[#01a3a4]/20 flex items-center justify-center shrink-0">
                  <Radio className="h-5 w-5 text-[#01a3a4] animate-pulse" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#01a3a4] uppercase tracking-widest">Operation Status</p>
                  <p className="text-[13px] font-black text-white uppercase mt-1 leading-tight">
                    {settings?.liveStatus || 'OPEN & READY TO PROCESS ORDERS'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 pt-6 border-t border-white/5">
                <div className="h-10 w-10 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-white/60" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Primary Hub</p>
                  <p className="text-[13px] font-black text-white uppercase mt-1 leading-tight">
                    {settings?.liveLocation || 'BANANI, DHAKA, BANGLADESH'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 bg-orange-600/5 border border-orange-600/20 text-center">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-relaxed">
                  "WE PROVIDE FAST NATIONWIDE DELIVERY FROM OUR CENTRAL HUB."
                </p>
              </div>
              
              <button 
                onClick={() => {
                  setNewLocation(settings?.liveLocation || '');
                  setNewStatus(settings?.liveStatus || '');
                  setIsAdminMode(true);
                }}
                className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-[#01a3a4] transition-colors flex items-center justify-center gap-2"
              >
                <Settings2 className="h-3 w-3" /> ADMIN UPDATE ACCESS
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">NEW LOCATION</label>
                <Input 
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="E.G. BANANI, DHAKA"
                  className="bg-white/5 border-white/10 rounded-none h-12 text-xs uppercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">NEW STATUS</label>
                <Input 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  placeholder="E.G. OPEN & READY"
                  className="bg-white/5 border-white/10 rounded-none h-12 text-xs uppercase"
                />
              </div>
              <div className="space-y-2 pt-4 border-t border-white/5">
                <label className="text-[9px] font-black text-orange-500 uppercase flex items-center gap-2">
                  <Lock className="h-3 w-3" /> VERIFY ADMIN PASSWORD
                </label>
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className="bg-white/5 border-orange-500/20 rounded-none h-12 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAdminMode(false)}
                className="flex-1 rounded-none border-white/10 text-white uppercase text-[9px] font-black h-12"
              >
                CANCEL
              </Button>
              <Button 
                type="submit" 
                disabled={isUpdating}
                className="flex-2 bg-orange-600 hover:bg-orange-700 text-white rounded-none uppercase text-[9px] font-black h-12"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'CONFIRM UPDATE'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
