
"use client";

import React, { useState } from 'react';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, CheckCircle2, FileCode, ShieldAlert, Zap } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function MasterPromptPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const MASTER_PROMPT = `# BEST HAAT - Master AI Prompt (ULTIMATE HARD VERSION)

**Role:** Expert Full-stack Developer & UI/UX Designer.
**Project Name:** BEST HAAT (Subtitle: PREMIUM MARKET PLACE).
**Core Concept:** A high-end, luxury e-commerce marketplace for the Bangladesh market, optimized for extreme speed and premium feel.

### 1. Visual Identity & Design Language
- **Theme:** Ultra-luxury Dark Theme. Background: Pure Black (#000000), Accent Color: Teal/Cyan (#01a3a4).
- **Typography:** Elegant Serif (Playfair Display) for headlines, Clean Sans-serif (Inter) for body. ALL TEXT must be UPPERCASE for a premium feel.
- **Layout:** 100% Full-screen width. Zero border-radius (Sharp square edges only for every element).
- **Branding:** Logo: "BEST HAAT" in large bold letters, with "PREMIUM MARKET PLACE" in very small letters underneath.

### 2. Homepage Structure (Slim & High-Impact)
- **Fixed Sticky Header:** The entire header (Navbar + scrolling Live Status Bar) MUST be fixed at the top of the screen (z-index: 120).
- **Top Fold Grid:** A three-column grid (Flash Offer, Main Slider, QR/App Bar). Fixed height: 450px (Desktop) / 350px (Tablet) / 180px (Mobile).
- **Category-wise Display:** Group products by category. Each section displays exactly **16 products in 2 rows** (8 per row on desktop).
- **Section Spacing:** Minimal vertical gaps (py-4 md:py-8) and tight header-to-grid spacing.
- **Main CTA:** A large, wide button labeled **"MORE PRODUCT"** linking to the shop page.

### 3. Shop Page Intelligence
- **Zero-Gap Layout:** The product grid starts immediately under the sticky header/live-bar with 0px padding-top.
- **Smart Search Logic:** Implement "Relevance First". If a user searches, prioritize matching items at the top, then display the rest of the archive.
- **Infinite Feel:** A large "LOAD MORE ARCHIVE" button for pagination.

### 4. Navigation & Specialized Modals
- **Navbar:** Must have HOME, SHOP, and a unique **"CATEGORY"** button.
- **Category Modal:** Clicking "CATEGORY" opens a full-screen/large modal with a grid of all categories including images.
- **Language Toggle:** Include an EN/BN toggle in the navbar.

### 5. Ordering & Localization (Bangla Precision)
- **Checkout Modal:** Fast order form (Name, Phone, Address, Size selection, Quantity).
- **Delivery Labels:** Use exact Bangla text: **"ঢাকার ভিতরে"** and **"ঢাকার বাইরে"**.
- **Thank You State:** Post-order success text: **"THANK YOU - আমাদের এক জন প্রতিনিধি যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করবে"**.
- **Admin Chat:** Direct WhatsApp integration for every specific product.

### 6. Admin Panel (The Command Center)
- **Dashboard:** Revenue bar charts, visitor counts, and real-time "New Order" notifications.
- **Invoice System:** Professional PDF generator. Must include site branding, customer details, product image, and auto-calculated BDT totals.
- **Inventory Management:** Full control for Products and Categories.
- **Client-side Image Compression:** Uploads optimized to 8-12KB for ultra-fast site loading.
- **Live Broadcast Control:** Admin tool to update marquee text, color, and "Primary Hub Location" globally.

### 7. Technical Specifications
- **Stack:** Next.js 15 (App Router), Firebase Firestore, Firebase Auth, Tailwind CSS, ShadCN UI.
- **Performance:** GPU-accelerated transitions, high-priority image loading for top-fold items.
- **Safety:** Strict null-checking (e.g., '(price || 0).toLocaleString()') to prevent crashes.

---
*Preserved for BEST HAAT - Premium Market Place.*`;

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
                <Zap className="h-6 w-6 text-[#01a3a4] shrink-0 animate-pulse" />
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-white uppercase tracking-widest">SYSTEM BLUEPRINT READY</p>
                  <p className="text-[10px] text-white/60 uppercase leading-relaxed font-bold">
                    THIS IS THE COMPLETE ARCHITECTURAL DEFINITION OF "BEST HAAT". 
                    USE THIS PROMPT IN ANY ADVANCED AI ENVIRONMENT TO REPLICATE THIS EXACT PROJECT WITH ALL ITS CUSTOM RULES.
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
