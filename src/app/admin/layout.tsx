
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminLoginModal } from '@/components/AdminLoginModal';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    // Add a small delay to ensure hydration is complete before session check
    const timer = setTimeout(() => {
      const authStatus = sessionStorage.getItem('is_admin_authenticated') === 'true';
      if (!authStatus) {
        setIsAuthenticated(false);
        setShowLogin(true);
      } else {
        setIsAuthenticated(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration flicker and immediate hanging
  if (!isMounted || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" />
        <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">Initialising Terminal...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">UNAUTHORIZED ACCESS</h1>
          <p className="text-xs text-muted-foreground uppercase">Please log in to continue.</p>
          <button 
            onClick={() => setShowLogin(true)}
            className="bg-[#01a3a4] text-white px-8 py-3 font-black uppercase text-[10px] tracking-widest"
          >
            OPEN LOGIN TERMINAL
          </button>
        </div>
        <AdminLoginModal 
          isOpen={showLogin} 
          onClose={() => {
            setShowLogin(false);
            if (sessionStorage.getItem('is_admin_authenticated') === 'true') {
              setIsAuthenticated(true);
            }
          }} 
        />
      </div>
    );
  }

  return <>{children}</>;
}
