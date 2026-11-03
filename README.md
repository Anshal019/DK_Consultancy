# DK Consultancy — Production Web Platform

A modern, high-performance, production-ready web application for **DK Consultancy**, Rajkot’s premier finance consultancy and loan advisory service led by **Dhaval Khimani**.

---

## 🚀 Quick Start (Run Locally)

The application comes with an integrated, zero-dependency Node.js production server.

```bash
# Option 1: Standard npm script
npm start

# Option 2: Direct node execution
node server.js
```

Then open your browser at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```text
DK_Consultancy_Updated/
├── assets/
│   ├── logo.png             # Official brand logo (640x640)
│   └── favicon.png          # Browser favicon and web app icon
├── css/
│   └── style.css            # Complete responsive stylesheet + print styles
├── js/
│   └── app.js               # Application logic (EMI calculator, chatbot, loan finder, leads)
├── data/
│   └── enquiries.json       # Persistent server lead storage
├── index.html               # Semantic HTML5 with SEO & Schema.org JSON-LD
├── server.js                # Zero-dependency Node.js HTTP & REST API server
├── package.json             # NPM project configuration and scripts
├── .gitignore               # Standard git ignore definitions
└── README.md                # Documentation
```

---

## ✨ Key Production Features

### 1. 🧮 Interactive EMI Calculator
- **Dual-sync Controls:** Real-time synchronized range sliders and direct numeric inputs.
- **Visual Breakdown:** Live interactive progress bar showing the percentage split between Principal and Total Interest.
- **Quick Presets:** Instant 1-click amount presets (₹5L, ₹10L, ₹25L, ₹50L, ₹1Cr).
- **Direct Enquiry:** "Enquire with these Terms" button auto-populates the enquiry form with the calculated amount.

### 2. 🔍 Loan Recommendation Finder
- Analyzes purpose, applicant profile, and ticket size.
- Recommends tailored strategies (e.g. Unsecured Business Loan, CGTMSE Scheme, Home Loan, LAP).
- Provides actionable documentation tips and direct 1-click enquiry pre-selection.

### 3. 📋 Category-Wise Document Checklist
- Categorized for Salaried, Business, Home, LAP, Doctor, Vehicle, Machinery, and Gold loans.
- Interactive checkboxes allow clients to check off documents they have ready.
- **🖨️ Print / Save Checklist:** Clean print stylesheet (`window.print()`) allows clients to print or save their checklist as a PDF before meeting the consultant.

### 4. 🤖 "Ask DK" AI Smart Finance Assistant
- Interactive conversational interface handling questions on:
  - CIBIL score expectations (720+ for unsecured, 650+ for secured loans).
  - CGTMSE collateral-free limits up to ₹5 Crore.
  - Required KYC, ITR, and banking documentation.
  - Indicative interest rate ranges in Gujarat.
  - Dhaval Khimani's contact details and office directions.
- Instant pre-populated query suggestion pills.

### 5. 📬 Dual-Action Lead Capture & WhatsApp Integration
- Form validation for 10-digit Indian phone numbers.
- **Dual Submission:**
  1. Stores lead securely via REST API in `data/enquiries.json` and client-side `localStorage`.
  2. Generates an instant WhatsApp chat link to **+91 90330 12582** with a professionally formatted message.
- Issues a unique Reference ID (e.g. `DK-2026-8492`).

### 6. 📊 In-Browser Lead Manager (Admin View)
- Accessible via the footer link **"Lead Manager (Admin)"** or by pressing **`Ctrl + Shift + L`**.
- Displays all captured leads in a clean table with direct WhatsApp and call actions.
- Includes a **1-click "Export to CSV"** button for easy import into Excel or CRM.

### 7. 📱 Mobile First & Sticky Action Bar
- Responsive navigation with backdrop blur and animated mobile menu drawer.
- Sticky bottom action bar on mobile devices:
  - 📞 **Call Now** (`90330 12582`)
  - 💬 **WhatsApp Us** (`https://wa.me/919033012582`)
  - 📋 **Enquire**

### 8. 🔍 SEO & Local Business Optimization
- Semantic HTML5 structure with Open Graph & Twitter Cards.
- Integrated **Schema.org JSON-LD** for `FinancialService` and `LocalBusiness` featuring:
  - Dhaval Khimani (Founder/Consultant)
  - Ramapir Chowkdi / 150 Feet Ring Road, Rajkot geo-coordinates
  - Business hours, phone numbers, and service areas.

---

## 🌐 Deployment Options

### A. Node.js Production Hosting (VPS, DigitalOcean, Render, Railway, AWS EC2)
```bash
git clone <repo-url>
cd DK_Consultancy_Updated
npm start
# or run with PM2 for background daemon management:
# pm2 start server.js --name "dk-consultancy"
```

### B. Static Hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages, cPanel)
The project is built with progressive enhancement. If deployed to any static host without Node.js:
- `index.html` functions 100% autonomously.
- Enquiries are automatically saved in browser `localStorage`.
- Direct WhatsApp enquiry dispatching and calling work seamlessly.

---

## 📞 Business Information

- **Firm Name:** DK Consultancy
- **Consultant:** Dhaval Khimani
- **Phone:** +91 90330 12582 · +91 70484 56000
- **Email:** khimanidhaval@gmail.com
- **Office Address:** 606 – Dwarika Pride, 150 Feet Ring Road, near Sadbhavna Hospital, Ramapir Chowkdi, Rajkot, Gujarat – 360007
- **Business Hours:** Monday to Saturday, 9:30 AM to 7:30 PM
