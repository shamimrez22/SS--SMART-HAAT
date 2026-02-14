
"use client";

import React, { memo } from 'react';
import { Navbar } from './Navbar';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Radio, MapPin } from 'lucide-react';

export const MainHeader = memo(() => {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  const broadcastColor = settings?.statusColor || '#01a3a4';
  const liveLabel = settings?.liveStatusLabel || 'LIVE STATUS:';
  const hubLocation = settings?.liveLocation || 'BANANI, DHAKA';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[120] shadow-2xl bg-black/95 backdrop-blur-md gpu-accelerated border-b border-white/5">
        <Navbar />
        {settings?.liveStatus && (
          <div className="bg-black border-t border-white/[0.03] h-[22px] md:h-[26px] flex items-center overflow-hidden whitespace-nowrap py-0 relative w-full">
            <div className="flex items-center gap-4 animate-marquee w-full px-2 md:px-12">
              <div 
                style={{ color: broadcastColor }}
                className="flex items-center gap-1 text-[8px] md:text-[10px] font-black uppercase tracking-widest shrink-0"
              >
                <Radio className="h-2 w-2 animate-pulse" /> {liveLabel}
              </div>
              <p 
                style={{ color: broadcastColor }}
                className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-4 shrink-0"
              >
                {settings.liveStatus} <span className="opacity-10 text-white">|</span> 
                <span className="flex items-center gap-1">
                  <MapPin className="h-2 w-2" /> <span className="tracking-tighter opacity-40 text-white font-bold">HUB:</span> {hubLocation}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className={settings?.liveStatus ? "h-[78px] md:h-[82px]" : "h-[56px]"} />
    </>
  );
});

MainHeader.displayName = 'MainHeader';
