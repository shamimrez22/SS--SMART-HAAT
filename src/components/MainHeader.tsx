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
      <div className="fixed top-0 left-0 right-0 z-[120] bg-[#01a3a4] gpu-accelerated shadow-xl">
        <Navbar />
        {settings?.liveStatus && (
          <div className="bg-black h-[20px] md:h-[24px] flex items-center overflow-hidden whitespace-nowrap py-0 relative w-full border-none">
            <div className="flex items-center gap-6 animate-marquee w-full px-2 md:px-12">
              <div 
                style={{ color: broadcastColor }}
                className="flex items-center gap-1.5 text-[7px] md:text-[9px] font-black uppercase tracking-widest shrink-0"
              >
                <Radio className="h-2 w-2 animate-pulse" /> {liveLabel}
              </div>
              <p 
                style={{ color: broadcastColor }}
                className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-4 shrink-0"
              >
                {settings.liveStatus} <span className="opacity-20 text-white">|</span> 
                <span className="flex items-center gap-1">
                  <MapPin className="h-2 w-2" /> <span className="tracking-tighter opacity-50 text-white font-bold">HUB:</span> {hubLocation}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className={settings?.liveStatus ? "h-[76px] md:h-[80px]" : "h-[56px]"} />
    </>
  );
});

MainHeader.displayName = 'MainHeader';
