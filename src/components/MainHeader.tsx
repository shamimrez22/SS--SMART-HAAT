"use client";

import React, { memo } from 'react';
import { Navbar } from './Navbar';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Radio, MapPin } from 'lucide-react';

/**
 * MainHeader - Combines Navbar and Live Status Bar with a fixed position.
 * Optimized for performance: Memoized to prevent jitter during sticky positioning.
 */
export const MainHeader = memo(() => {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  const broadcastColor = settings?.statusColor || '#01a3a4';
  const liveLabel = settings?.liveStatusLabel || 'LIVE STATUS:';
  const hubLocation = settings?.liveLocation || 'BANANI, DHAKA';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[120] shadow-2xl bg-black gpu-accelerated">
        <Navbar />
        {settings?.liveStatus && (
          <div className="bg-black border-b border-white/5 h-[32px] md:h-[36px] flex items-center overflow-hidden whitespace-nowrap py-0 relative w-full">
            <div className="flex items-center gap-8 animate-marquee w-full px-4">
              <div 
                style={{ color: broadcastColor, textShadow: `0 0 10px ${broadcastColor}40` }}
                className="flex items-center gap-2 text-[11px] md:text-[13px] font-black uppercase tracking-widest shrink-0"
              >
                <Radio className="h-3 w-3 animate-pulse" /> {liveLabel}
              </div>
              <p 
                style={{ color: broadcastColor, textShadow: `0 0 10px ${broadcastColor}40` }}
                className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.1em] flex items-center gap-8 shrink-0"
              >
                {settings.liveStatus} <span className="opacity-30">||</span> 
                <span className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> <span className="tracking-tighter opacity-60 text-foreground">HUB:</span> {hubLocation}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className={settings?.liveStatus ? "h-[96px] md:h-[100px]" : "h-[64px]"} />
    </>
  );
});

MainHeader.displayName = 'MainHeader';