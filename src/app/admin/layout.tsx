"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { AdminLoginModal } from '@/components/AdminLoginModal';

/**
 * AdminLayout - Optimized Secure Lock.
 * Ensures the admin panel is strictly locked and unlocks instantly on successful login.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLogin, setShowLogin] = useState(false);

  const checkAuth = useCallback(() => {
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

  useEffect(() => {
    // Instant initial check
    checkAuth();
    
    // Event-based sync for "First" performance
    const handleLoginSuccess = () => checkAuth();
    window.addEventListener('admin-login-success', handleLoginSuccess);
    
    // Fallback sync
    const interval = setInterval(checkAuth, 1000);
    
    return () => {
      window.removeEventListener('admin-login-success', handleLoginSuccess);
      clearInterval(interval);
    };
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" />
        <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">ACCESSING ENCRYPTED TERMINAL...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-red-600/10 border border-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <ShieldAlert className="h-10 w-10 text-red-600" />
            <div className="absolute inset-0 rounded-full border-2 border-red-600/20 animate-ping" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">RESTRICTED ACCESS</h1>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">SECURE SESSION REQUIRED TO MANAGE SS SMART HAAT</p>
          </div>
          <button 
            onClick={() => setShowLogin(true)}
            className="bg-[#01a3a4] hover:bg-white hover:text-black transition-all text-white px-12 py-5 font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl shadow-[#01a3a4]/20"
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

  return <div className="animate-in fade-in duration-700">{children}</div>;
}
