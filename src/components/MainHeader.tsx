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

  const hubLocation = settings?.liveLocation || 'BANANI, DHAKA';

  return (
    <>
      {/* OUTER FULL-WIDTH BLACK CONTAINER */}
      <div className="fixed top-0 left-0 right-0 z-[120] bg-black gpu-accelerated shadow-2xl">
        
        {/* ALIGNMENT CONTAINER (Matches Product Grid Margin) */}
        <div className="px-2 md:px-12">
          
          {/* TEAL CONTENT BOX (The only part with background color) */}
          <div className="bg-[#01a3a4] overflow-hidden">
            <Navbar />
            
            {/* CONSTRAINED LIVE BAR */}
            {settings?.liveStatus && (
              <div className="h-[18px] md:h-[22px] flex items-center overflow-hidden whitespace-nowrap py-0 relative w-full border-t border-white/10">
                <div className="flex items-center gap-6 animate-marquee w-full px-4">
                  <div className="flex items-center gap-1.5 text-[7px] md:text-[9px] font-black uppercase tracking-widest shrink-0 text-white">
                    <Radio className="h-2 w-2 animate-pulse" /> {settings.liveStatusLabel || 'LIVE STATUS:'}
                  </div>
                  <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-4 shrink-0 text-white">
                    {settings.liveStatus} <span className="opacity-30">|</span> 
                    <span className="flex items-center gap-1">
                      <MapPin className="h-2 w-2" /> <span className="tracking-tighter opacity-60 font-bold">HUB:</span> {hubLocation}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* SPACER TO PREVENT CONTENT OVERLAP */}
      <div className={settings?.liveStatus ? "h-[72px] md:h-[78px]" : "h-[54px] md:h-[56px]"} />
    </>
  );
});

MainHeader.displayName = 'MainHeader';
