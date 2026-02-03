
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminLoginModal } from '@/components/AdminLoginModal';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authStatus = sessionStorage.getItem('is_admin_authenticated') === 'true';
    if (!authStatus) {
      setIsAuthenticated(false);
      setShowLogin(true);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Verifying Access...</p>
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
            className="bg-orange-600 text-white px-8 py-3 font-black uppercase text-[10px] tracking-widest"
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
