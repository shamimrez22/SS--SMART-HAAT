"use client";

import React, { useState } from 'react';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, CheckCircle2, FileCode, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function MasterPromptPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const MASTER_PROMPT = `# SS SMART HAAT - Master AI Prompt

**Role:** Expert Full-stack Developer & UI/UX Designer.
**Project Name:** SS SMART HAAT (Subtitle: PREMIUM MARKET PLACE).
**Core Concept:** A high-end, luxury e-commerce marketplace for the Bangladesh market.

### 1. Visual Identity & Design Language
- **Theme:** Ultra-luxury Dark Theme. Background: Pure Black (#000000), Accent Color: Teal/Cyan (#01a3a4).
- **Typography:** Elegant Serif (Playfair Display) for headlines, Clean Sans-serif (Inter) for body. All text must be UPPERCASE for a premium feel.
- **Layout:** 100% Full-screen width. Zero border-radius (Sharp square edges only).
- **Branding:** Logo must show "SS SMART HAAT" in large bold letters, with "PREMIUM MARKET PLACE" in very small letters underneath.

### 2. Homepage Structure (Slim & Fast)
- **Fixed Header Section:** The entire header (Navbar + Live Status Bar) must be fixed at the top of the screen (sticky/fixed).
- **Header Grid:** A three-column grid (Flash Offer, Main Slider, QR/App Bar) with a fixed height: 350px (Desktop) / 300px (Tablet) / 140px (Mobile).
- **Category-wise Grid:** Products must be grouped by category. Each category section displays exactly **16 products in 2 rows** (8 per row).
- **Bottom CTA:** A large, wide button labeled **"MORE PRODUCT"** linking to the full archive.
- **Header Spacing:** Minimal gap (Zero padding) between the live status bar and content.

### 3. Shop Page Intelligence
- **Zero Gap Layout:** The product grid must start immediately under the header/live-bar without any black space (Padding-top: 0).
- **Smart Search:** Implementation of "Relevance First" logic. If searching, show matching items at the top, then show all other products below them.
- **Load More:** A large "LOAD MORE ARCHIVE" button for pagination.

### 4. Navigation & Modals
- **Navbar:** Fixed top navigation with HOME, SHOP, and a specialized **"CATEGORY"** button.
- **Category Modal:** Clicking "CATEGORY" opens a full-screen grid of all categories with images.
- **Mobile Search:** A toggleable search input for mobile devices.

### 5. Ordering & Localization (Bangla Features)
- **Checkout Modal:** Secure popup order form (Name, Phone, Address, Size selection).
- **Delivery Labels:** Must use specific Bangla labels: **"ঢাকার ভিতরে"** and **"ঢাকার বাইরে"**.
- **Thank You Message:** Post-order popup text: **"THANK YOU - আমাদের এক জন প্রতিনিধি যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করবে"**.
- **WhatsApp Link:** Integration to chat with admin regarding a specific product.

### 6. Admin Panel & Business Tools (Command Center)
- **Dashboard:** Revenue charts, visitor stats, and real-time "New Order" notifications.
- **Invoice Generator:** Professional PDF invoice (using jsPDF). Must include branding, customer details, product image, and BDT currency.
- **Management:** Full inventory control with built-in client-side image compression (optimizing for 8-12KB) for ultra-fast loading.
- **Hub & Live Control:** Admin tool to update scrolling broadcast message, colors, and "Primary Hub Location" globally.
- **System Preservation:** A dedicated copy-to-clipboard section for this master prompt.

### 7. Technical Specifications & Safety
- **Performance:** Ultra-fast page loads using 'next/image' with 'priority' loading for top-fold elements and GPU-acceleration.
- **Null-Safety:** Comprehensive null-checking (e.g., '(price || 0).toLocaleString()') to prevent "Application Errors".
- **Tech Stack:** Next.js 15 (App Router), Firebase Firestore, Firebase Auth, Tailwind CSS, ShadCN UI, Lucide Icons.

---
*Preserved for SS SMART HAAT - Premium Market Place.*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(MASTER_PROMPT);
    setCopied(true);
    toast({
      title: "PROMPT COPIED",
      description: "MASTER SYSTEM PROMPT IS NOW IN YOUR CLIPBOARD.",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#01a3a4]/30">
      <MainHeader />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/admin">
            <Button variant="ghost" className="rounded-none hover:bg-white/5 text-white p-2 h-12 w-12 border border-white/10">
              <ArrowLeft className="h-6 w-6 text-[#01a3a4]" />
            </Button>
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-[0.3em]">System Preservation</p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">MASTER PROMPT</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <Card className="bg-card border-white/5 rounded-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-[#01a3a4] flex items-center gap-2">
                <FileCode className="h-4 w-4" /> SYSTEM REQUIREMENTS ARCHIVE
              </CardTitle>
              <Button 
                onClick={handleCopy}
                className={`rounded-none h-10 px-6 font-black uppercase text-[10px] transition-all ${copied ? 'bg-green-600' : 'bg-[#01a3a4] hover:bg-white hover:text-black'}`}
              >
                {copied ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? 'COPIED TO CLIPBOARD' : 'COPY MASTER PROMPT'}
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              <div className="bg-black/50 border border-white/10 p-8 rounded-none font-mono text-[12px] text-white/80 whitespace-pre-wrap leading-relaxed overflow-x-auto h-[600px] no-scrollbar">
                {MASTER_PROMPT}
              </div>
              
              <div className="mt-8 p-6 bg-[#01a3a4]/5 border border-[#01a3a4]/20 flex items-start gap-4">
                <ShieldAlert className="h-6 w-6 text-[#01a3a4] shrink-0" />
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-white uppercase tracking-widest">WHY IS THIS IMPORTANT?</p>
                  <p className="text-[10px] text-white/60 uppercase leading-relaxed font-bold">
                    THIS PROMPT CONTAINS EVERY CUSTOM FEATURE AND DESIGN RULE REQUESTED FOR SS SMART HAAT. 
                    IF YOU EVER NEED TO REBUILD OR EXTEND THIS SITE IN ANOTHER AI ENVIRONMENT, 
                    PASTE THIS ENTIRE TEXT TO GET THE EXACT SAME RESULT.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
