"use client";

import React, { memo } from 'react';
import { Navbar } from './Navbar';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { MapPin } from 'lucide-react';

/**
 * MainHeader - Fixed at top.
 * Contains Navbar and Ultra-Slim Black Live Status Bar.
 */
export const MainHeader = memo(() => {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => db ? doc(db, 'settings', 'site-config') : null, [db]);
  const { data: settings } = useDoc(settingsRef);

  const hubLocation = settings?.liveLocation || 'BANANI, DHAKA';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[120] bg-black gpu-accelerated shadow-2xl">
        <div className="px-2 md:px-12">
          {/* Constrained Header Container */}
          <div className="overflow-hidden">
            {/* Navbar with Signature Teal Background */}
            <div className="bg-[#01a3a4]">
              <Navbar />
            </div>
            
            {/* Pure Black Live Status Bar - Ultra Slim & Clean */}
            {settings?.liveStatus && (
              <div className="h-[20px] md:h-[24px] flex items-center overflow-hidden whitespace-nowrap py-0 relative w-full bg-black border-t border-white/5">
                <div className="flex items-center gap-10 animate-marquee w-full px-4">
                  <div className="flex items-center gap-2 text-[7px] md:text-[8.5px] font-black uppercase tracking-[0.3em] shrink-0 text-white">
                    <div className="h-1 w-1 bg-red-600 rounded-full animate-pulse shadow-[0_0_5px_rgba(220,38,38,0.8)]" /> 
                    {settings.liveStatusLabel || 'LIVE STATUS:'}
                  </div>
                  <p className="text-[7px] md:text-[8.5px] font-bold uppercase tracking-[0.15em] flex items-center gap-5 shrink-0 text-white/90">
                    {settings.liveStatus} 
                    <span className="text-white/20">|</span> 
                    <span className="flex items-center gap-1.5 text-white">
                      <MapPin className="h-2 w-2 text-white" /> 
                      <span className="font-black opacity-60">HUB:</span> {hubLocation}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Spacer to prevent content overlap */}
      <div className={settings?.liveStatus ? "h-[68px] md:h-[76px]" : "h-[48px] md:h-[52px]"} />
    </>
  );
});

MainHeader.displayName = 'MainHeader';
