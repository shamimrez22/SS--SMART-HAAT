# SS SMART HAAT - Master AI Prompt

This document contains the complete set of requirements and features requested for the SS SMART HAAT project. Use this prompt to recreate or extend this unique application in any AI coding environment.

---

## The Master Prompt

**Role:** Expert Full-stack Developer & UI/UX Designer.
**Project Name:** SS SMART HAAT (Subtitle: PREMIUM MARKET PLACE).
**Core Concept:** A high-end, luxury e-commerce marketplace for the Bangladesh market.

### 1. Visual Identity & Design Language
- **Theme:** Ultra-luxury Dark Theme. Background: Pure Black (#000000), Accent Color: Teal/Cyan (#01a3a4).
- **Typography:** Elegant Serif (Playfair Display) for headlines, Clean Sans-serif (Inter) for body. All text must be UPPERCASE for a premium feel.
- **Layout:** 100% Full-screen width. Zero border-radius (Sharp square edges only).
- **Branding:** Logo must show "SS SMART HAAT" in large bold letters, with "PREMIUM MARKET PLACE" in very small letters underneath.

### 2. Homepage Structure (Slim & Fast)
- **Header Section (Reduced Height):** A three-column grid (Flash Offer, Main Slider, QR/App Bar) with a fixed height: 350px (Desktop) / 300px (Tablet) / 140px (Mobile).
- **Category-wise Grid:** Products must be grouped by category. Each category section displays exactly **16 products in 2 rows** (8 per row on desktop, 2 per row on mobile).
- **Bottom CTA:** A large, wide button labeled **"MORE PRODUCT"** linking to the full archive.
- **Header Spacing:** Minimal gap (Zero padding) between the live status bar and content.

### 3. Shop Page Intelligence
- **Zero Gap Layout:** The product grid must start immediately under the header/live-bar without any black space (Padding-top: 0).
- **Smart Search:** Implementation of "Relevance First" logic. If searching, show matching items at the top, then show all other products below them.
- **Empty States:** No results should show a custom 'SearchX' placeholder with a "Back to Shop" button.

### 4. Navigation & Modals
- **Navbar:** Fixed top navigation with HOME, SHOP, and a specialized **"CATEGORY"** button.
- **Category Modal:** Clicking "CATEGORY" opens a full-screen or large modal displaying all active categories with images in a grid.
- **Mobile Search:** A toggleable search input for mobile devices.

### 5. Ordering & Localization (Bangla Features)
- **Checkout Modal:** Secure popup order form (Name, Phone, Address, Size selection).
- **Delivery Labels:** Must use specific Bangla labels for charges: **"ঢাকার ভিতরে"** and **"ঢাকার বাইরে"**.
- **Thank You Message:** Post-order popup text: **"THANK YOU - আমাদের এক জন প্রতিনিধি যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করবে"**.
- **WhatsApp Link:** Integration to chat with admin regarding a specific product.

### 6. Admin Panel & Business Tools
- **Dashboard:** Revenue bar charts (Recharts), visitor stats, and real-time "New Order" toast notifications.
- **Invoice Generator:** Professional PDF invoice (using jsPDF). Must include branding, customer details, product image, and BDT currency formatting.
- **Management:** Inventory control for Products and Categories with built-in client-side image compression (optimizing for 8-12KB) to ensure ultra-fast loading.
- **Live Hub Control:** Admin interface to update the scrolling "Live Broadcast" message and "Primary Hub Location" globally.

### 7. Technical Specifications & Safety
- **Performance:** Ultra-fast page loads using `next/image` with `priority` loading for all top-fold elements.
- **Null-Safety:** Comprehensive null-checking (e.g., `(price || 0).toLocaleString()`) to prevent "Application Errors" if database fields are missing.
- **Tech Stack:** Next.js 15 (App Router), Firebase Firestore, Firebase Auth, Tailwind CSS, ShadCN UI components, Lucide Icons.

---

*Generated for SS SMART HAAT - Premium Market Place.*
