
"use client";

import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminLoginModal } from '@/components/AdminLoginModal';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  // useLayoutEffect runs before paint to prevent flickering and interaction delays
  useLayoutEffect(() => {
    const authStatus = sessionStorage.getItem('is_admin_authenticated') === 'true';
    if (authStatus) {
      setIsAuthenticated(true);
      setShowLogin(false);
    } else {
      setIsAuthenticated(false);
      setShowLogin(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" />
        <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">Accessing Terminal...</p>
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
            const status = sessionStorage.getItem('is_admin_authenticated') === 'true';
            if (status) {
              setIsAuthenticated(true);
              setShowLogin(false);
            }
          }} 
        />
      </div>
    );
  }

  return <>{children}</>;
}
