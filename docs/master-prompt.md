
# BEST HAAT - Master AI Prompt (ULTIMATE HARD VERSION)

**Role:** Expert Full-stack Developer & UI/UX Designer.
**Project Name:** BEST HAAT (Subtitle: PREMIUM MARKET PLACE).
**Core Concept:** A unique, ultra-fast, high-end luxury e-commerce marketplace for the Bangladesh market.

### 1. Visual Identity & Design Language (STRICT RULES)
- **Theme:** Ultra-luxury DARK THEME. Background: Pure Black (#000000), Accent Color: Teal/Cyan (#01a3a4).
- **Typography:** Elegant Serif (Playfair Display) for headlines, Clean Sans-serif (Inter) for body. ALL TEXT must be UPPERCASE for a premium feel.
- **Layout:** 100% Full-screen width. Zero border-radius (Sharp square edges only for every element).
- **Branding:** Logo: "BEST HAAT" in large bold letters, with "PREMIUM MARKET PLACE" in very small letters underneath.

### 2. Homepage Structure (Slim & High-Impact)
- **Fixed Sticky Header:** The entire header (Navbar + scrolling Live Status Bar) MUST be fixed at the top of the screen (z-index: 120).
- **Top Fold Grid:** A three-column grid containing (1) Flash Offer card, (2) Main Slider, (3) QR/App Bar. Fixed height: 450px (Desktop) / 350px (Tablet) / 180px (Mobile).
- **Category-wise Display:** Group products by category. Each section must show exactly **16 products in 2 rows** (8 per row on desktop, 2 per row on mobile).
- **Section Spacing:** Minimal vertical gaps (py-4 md:py-8) and tight header-to-grid spacing (mb-4 md:mb-6).
- **Main CTA:** A large, wide button labeled **"MORE PRODUCT"** linking to the shop page.

### 3. Shop Page Intelligence
- **Zero-Gap Layout:** The product grid must start immediately under the sticky header/live-bar with 0px padding-top.
- **Smart Search Logic:** Implement "Relevance First". If a user searches, prioritize matching items at the top, then display the rest of the archive below them.
- **Infinite Feel:** A large "LOAD MORE ARCHIVE" button for pagination.

### 4. Navigation & Specialized Modals
- **Navbar:** Must have HOME, SHOP, and a unique **"CATEGORY"** button.
- **Category Modal:** Clicking "CATEGORY" opens a full-screen/large modal with a grid of all categories including their images.
- **Mobile Experience:** Toggleable mobile search input and specialized slim navigation.

### 5. Ordering & Localization (Bangla Precision)
- **Checkout Modal:** Fast order form (Name, Phone, Address, Size selection, Quantity).
- **Delivery Labels:** Use exact Bangla text: **"ঢাকার ভিতরে"** and **"ঢাকার বাইরে"**.
- **Thank You State:** Post-order success text: **"THANK YOU - আমাদের এক জন প্রতিনিধি যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করবে"**.
- **Admin Chat:** Direct WhatsApp integration for every specific product.

### 6. Admin Panel (The Command Center)
- **Dashboard:** Revenue bar charts, visitor counts, and real-time "New Order" notifications using toasts.
- **Invoice System:** Professional PDF generator. Must include site branding, customer details, product image, and BDT currency formatting.
- **Inventory Management:** Full control for Products and Categories.
- **Client-side Image Compression:** Built-in tool to compress all uploads to 8-12KB for ultra-fast site loading.
- **Live Broadcast Control:** Interface to update the marquee "Live Message", label text, color, and "Primary Hub Location" globally.
- **System Preservation:** A dedicated section to copy this master prompt.

### 7. Technical Specifications
- **Framework:** Next.js 15 (App Router), Firebase Firestore, Firebase Auth.
- **Styling:** Tailwind CSS, ShadCN UI, Lucide Icons.
- **Performance:** GPU-accelerated transitions, high-priority loading for top-fold images (`priority={true}`).
- **Safety:** Comprehensive null-checking (e.g., `(price || 0).toLocaleString()`) to prevent runtime crashes.

---
*Generated for BEST HAAT - Premium Market Place.*
