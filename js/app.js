/**
 * DK CONSULTANCY - PRODUCTION CLIENT APPLICATION
 * Smart Finance Guidance | Dhaval Khimani | Rajkot, Gujarat
 */

// Format numbers in Indian Rupee format (e.g. 10,00,000)
function formatINR(val) {
  if (isNaN(val)) return '₹0';
  const num = Math.round(val);
  return '₹' + num.toLocaleString('en-IN');
}

// Escape HTML utility to prevent XSS
function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

/* ==========================================================================
   1. Loan Services Dataset & Rendering
   ========================================================================== */
const loanServices = [
  {
    icon: '🏢',
    title: 'Business Loan',
    desc: 'Unsecured working capital, business expansion, raw material procurement, or cash-flow boost with fast approvals and flexible tenures.',
    tags: ['Working Capital', 'Turnover Based', 'Fast Disbursal'],
    indicativeRate: 'From 11.5% p.a.'
  },
  {
    icon: '🏛️',
    title: 'CGTMSE MSME Loan',
    desc: 'Collateral-free and third-party-guarantee-free credit facility up to ₹5 Crore for eligible micro and small enterprises under government scheme.',
    tags: ['Zero Collateral', 'Govt Scheme', 'Up to ₹5 Cr'],
    indicativeRate: 'Lender / Scheme Terms'
  },
  {
    icon: '🏠',
    title: 'Home Loan',
    desc: 'Tailored finance for purchasing ready/under-construction homes, plot purchase with construction, or balance transfer with top-up facility.',
    tags: ['Lowest Interest', 'Up to 30 Yrs', 'Tax Benefits'],
    indicativeRate: 'From 8.40% p.a.'
  },
  {
    icon: '🏘️',
    title: 'Mortgage / Loan Against Property',
    desc: 'Leverage the market value of your residential, commercial, or industrial property for major business needs with comfortable repayment tenures.',
    tags: ['High Ticket Size', 'Lower EMI', 'Flexible Usage'],
    indicativeRate: 'From 9.25% p.a.'
  },
  {
    icon: '💼',
    title: 'Personal Loan',
    desc: 'Quick collateral-free loans for salaried employees and self-employed professionals to meet immediate medical, family, or travel expenses.',
    tags: ['No Security', 'Minimal Paperwork', '1 to 5 Yrs'],
    indicativeRate: 'From 10.75% p.a.'
  },
  {
    icon: '🩺',
    title: 'Doctor & Professional Loan',
    desc: 'Exclusive specialized credit lines for practicing doctors, dentists, chartered accountants, and architects for clinics, labs, and setups.',
    tags: ['Customized Limits', 'Hassle-Free', 'Practice Expansion'],
    indicativeRate: 'Competitive Rates'
  },
  {
    icon: '🚗',
    title: 'Car & Commercial Vehicle Loan',
    desc: 'Competitive financing options for new or pre-owned private cars, commercial fleets, trucks, and transport vehicles with flexible down payment.',
    tags: ['Up to 100% On-road', 'New & Used', 'Instant Sanction'],
    indicativeRate: 'From 8.75% p.a.'
  },
  {
    icon: '⚙️',
    title: 'Machinery & Equipment Loan',
    desc: 'Upgrade your manufacturing setup, factory machines, CNC, medical equipment, or printing units with term loans against equipment proforma.',
    tags: ['Capital Expenditure', 'Tax Depreciation', 'Supplier Linked'],
    indicativeRate: 'Tailored Tenures'
  },
  {
    icon: '🪙',
    title: 'Gold Loan',
    desc: 'Instant liquidity against gold jewellery with maximum loan-to-value (LTV), transparent valuation, and flexible interest-servicing options.',
    tags: ['Same Day Cash', 'Minimal KYC', 'Safe Storage'],
    indicativeRate: 'From 9.0% p.a.'
  },
  {
    icon: '🛡️',
    title: 'Health & General Insurance',
    desc: 'Comprehensive medical cover, family floater, critical illness, and commercial business assets insurance from top IRDAI-regulated insurers.',
    tags: ['Cashless Hospitalization', 'Zero Waiting Options', 'Tax Saver'],
    indicativeRate: 'Custom Premiums'
  }
];

function renderLoanCards() {
  const container = document.getElementById('loanCards');
  if (!container) return;

  container.innerHTML = loanServices.map(loan => `
    <article class="card">
      <div class="card-icon">${loan.icon}</div>
      <h3>${loan.title}</h3>
      <p>${loan.desc}</p>
      <div class="card-tags">
        ${loan.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="card-action">
        <span style="font-size:12px; font-weight:700; color:var(--maroon);">${loan.indicativeRate}</span>
        <a class="textlink" href="#contact" onclick="selectLoanService('${escapeHTML(loan.title)}')">
          Enquire Now →
        </a>
      </div>
    </article>
  `).join('');
}

function selectLoanService(serviceTitle) {
  const loanInput = document.getElementById('loanType');
  if (loanInput) {
    loanInput.value = serviceTitle;
  }
  showToast(`Selected "${serviceTitle}" for enquiry`);
}

/* ==========================================================================
   2. Interactive EMI Calculator
   ========================================================================== */
function initEMICalculator() {
  const principalInput = document.getElementById('principal');
  const principalSlider = document.getElementById('principalSlider');
  const rateInput = document.getElementById('rate');
  const rateSlider = document.getElementById('rateSlider');
  const tenureInput = document.getElementById('tenure');
  const tenureSlider = document.getElementById('tenureSlider');

  if (!principalInput || !principalSlider) return;

  // Sync inputs with sliders
  principalSlider.addEventListener('input', () => {
    principalInput.value = principalSlider.value;
    calculateEMI();
  });
  principalInput.addEventListener('input', () => {
    principalSlider.value = principalInput.value;
    calculateEMI();
  });

  rateSlider.addEventListener('input', () => {
    rateInput.value = rateSlider.value;
    calculateEMI();
  });
  rateInput.addEventListener('input', () => {
    rateSlider.value = rateInput.value;
    calculateEMI();
  });

  tenureSlider.addEventListener('input', () => {
    tenureInput.value = tenureSlider.value;
    calculateEMI();
  });
  tenureInput.addEventListener('input', () => {
    tenureSlider.value = tenureInput.value;
    calculateEMI();
  });

  calculateEMI();
}

function setPrincipalPreset(amount) {
  const pInput = document.getElementById('principal');
  const pSlider = document.getElementById('principalSlider');
  if (pInput && pSlider) {
    pInput.value = amount;
    pSlider.value = amount;
    calculateEMI();
  }
}

function calculateEMI() {
  const p = parseFloat(document.getElementById('principal').value) || 0;
  const annualRate = parseFloat(document.getElementById('rate').value) || 0;
  const tenureYears = parseFloat(document.getElementById('tenure').value) || 0;

  if (p <= 0 || annualRate < 0 || tenureYears <= 0) {
    return;
  }

  const monthlyRate = annualRate / 1200; // annual percentage to monthly fraction
  const totalMonths = tenureYears * 12;

  let emi = 0;
  if (monthlyRate === 0) {
    emi = p / totalMonths;
  } else {
    emi = (p * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalRepayment = emi * totalMonths;
  const totalInterest = totalRepayment - p;

  const emiVal = document.getElementById('emiValue');
  const intVal = document.getElementById('interestValue');
  const totVal = document.getElementById('totalValue');
  const barPrincipal = document.getElementById('barPrincipal');
  const barInterest = document.getElementById('barInterest');

  if (emiVal) emiVal.textContent = formatINR(emi);
  if (intVal) intVal.textContent = formatINR(totalInterest);
  if (totVal) totVal.textContent = formatINR(totalRepayment);

  if (barPrincipal && barInterest && totalRepayment > 0) {
    const principalPct = ((p / totalRepayment) * 100).toFixed(1);
    const interestPct = (100 - principalPct).toFixed(1);
    barPrincipal.style.width = principalPct + '%';
    barInterest.style.width = interestPct + '%';

    const pPctLabel = document.getElementById('principalPctLabel');
    const iPctLabel = document.getElementById('interestPctLabel');
    if (pPctLabel) pPctLabel.textContent = `Principal: ${principalPct}%`;
    if (iPctLabel) iPctLabel.textContent = `Interest: ${interestPct}%`;
  }
}

function applyWithEMI() {
  const p = document.getElementById('principal').value;
  const emi = document.getElementById('emiValue').textContent;
  const loanInput = document.getElementById('loanAmount');
  const msgInput = document.getElementById('message');

  if (loanInput) {
    loanInput.value = '₹ ' + parseFloat(p).toLocaleString('en-IN');
  }
  if (msgInput) {
    msgInput.value = `Enquiring for loan of ₹${parseFloat(p).toLocaleString('en-IN')} with estimated monthly repayment of ${emi}.`;
  }

  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    showToast('Loan amount copied to enquiry form!');
  }
}

/* ==========================================================================
   3. Loan Recommendation Finder
   ========================================================================== */
const loanFinderRules = {
  business: {
    title: 'Business Loan / MSME Working Capital',
    highlights: 'Ideal for inventory stocking, machinery purchase, vendor payments, or business expansion.',
    keyDocs: 'GST returns, 1-year bank statements, 3-year ITRs, business registration (Udyam/Shop Act).',
    advice: 'If seeking collateral-free finance under ₹5 Cr, also explore CGTMSE eligibility.'
  },
  home: {
    title: 'Home Loan / Plot & Construction',
    highlights: 'Long-term low-interest finance for purchasing a flat, bungalow, plot or constructing your own home in Rajkot or anywhere in Gujarat.',
    keyDocs: 'Salary slips or ITRs, bank statements, property title clearance, agreement to sell.',
    advice: 'Consider adding a co-applicant (spouse/parent) to enhance loan eligibility.'
  },
  property: {
    title: 'Loan Against Property (LAP) / Mortgage',
    highlights: 'Get substantial funds at interest rates lower than unsecured business loans by pledging your clear-title property.',
    keyDocs: 'Registered property deed, sanctioned plan, title chain, applicant income proof.',
    advice: 'Offers long repayment tenures up to 15 years, significantly lowering your monthly EMI.'
  },
  personal: {
    title: 'Personal Loan',
    highlights: 'Fast processing, completely collateral-free finance for urgent household, wedding, or education requirements.',
    keyDocs: 'PAN, Aadhaar, last 6 months salary slips, 6 months bank statement showing salary credits.',
    advice: 'A CIBIL credit score of 750+ secures the fastest sanctions and lowest processing fees.'
  },
  gold: {
    title: 'Gold Loan',
    highlights: 'Instant loan within hours against your gold ornaments with safe bank vault custody and flexible interest payments.',
    keyDocs: 'Basic KYC (Aadhaar & PAN), gold jewellery for assay valuation.',
    advice: 'Best for urgent short-term cash requirements with zero foreclosure penalties.'
  },
  vehicle: {
    title: 'Car & Commercial Vehicle Finance',
    highlights: 'Up to 90%-100% on-road funding for private cars, commercial transport vehicles, or pre-owned cars.',
    keyDocs: 'Vehicle proforma invoice, income proof, bank statements, KYC.',
    advice: 'Lenders offer competitive rates for hybrid, electric, and commercial fleet operators.'
  },
  machinery: {
    title: 'Machinery & Equipment Loan',
    highlights: 'Finance industrial machinery, tools, CNC machines, or factory lines directly against supplier quotations.',
    keyDocs: 'Machinery quotation, supplier details, business financial audit, cash-flow projections.',
    advice: 'Can be structured with moratorium periods during machinery installation and commissioning.'
  },
  doctor: {
    title: 'Professional Loan for Doctors & CAs',
    highlights: 'Customized credit lines for setting up diagnostics, clinics, acquiring hospital equipment, or professional practice.',
    keyDocs: 'Medical degree / IMA registration, practice proof, 2 years ITRs.',
    advice: 'Enjoys higher credit limits with minimal collateral requirements.'
  },
  insurance: {
    title: 'Health & Comprehensive Insurance',
    highlights: 'Safeguard your family and business assets against unforeseen medical emergencies or losses.',
    keyDocs: 'Basic age and identity proof, existing policy details (if porting).',
    advice: 'Ensure adequate sum insured with cashless hospital network across Rajkot hospitals.'
  }
};

function findLoan() {
  const purpose = document.getElementById('purpose').value;
  const applicant = document.getElementById('applicant').value;
  const amountRange = document.getElementById('amountRange').value;
  const resultBox = document.getElementById('finderResult');

  const match = loanFinderRules[purpose] || loanFinderRules['business'];

  resultBox.classList.remove('hidden');
  resultBox.innerHTML = `
    <div class="finder-card-result">
      <div class="kicker" style="color:var(--primary); font-size:11px;">Recommended Strategy</div>
      <h4>${match.title}</h4>
      <p style="font-size:13px; color:#55433a; margin:6px 0 10px;">${match.highlights}</p>
      <div style="font-size:12px; background:var(--cream); padding:10px; border-radius:8px; margin-bottom:10px;">
        <b>Key Requirements:</b> ${match.keyDocs}<br>
        <span style="color:var(--green); font-weight:700;">💡 Tip:</span> ${match.advice}
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
        <button class="btn btn-primary btn-sm" onclick="selectLoanService('${escapeHTML(match.title)}'); document.getElementById('contact').scrollIntoView({behavior:'smooth'});">
          Enquire for ${escapeHTML(match.title)} →
        </button>
        <span style="font-size:12px; color:var(--muted);">Selected for ${escapeHTML(applicant)} (${escapeHTML(amountRange)})</span>
      </div>
    </div>
  `;
}

/* ==========================================================================
   4. Document Checklist by Category
   ========================================================================== */
const documentChecklists = {
  salaried: {
    title: 'Salaried Applicant Checklist',
    items: [
      'Passport size photographs (recent)',
      'Identity Proof: PAN Card and Aadhaar Card',
      'Address Proof: Electricity bill / Passport / Voter ID',
      'Last 6 months’ Salary Slips with company seal/signature',
      'Last 1 year Bank Account Statement where salary is credited',
      'Form 16 or Income Tax Returns (ITR) for last 2 financial years',
      'Appointment letter / Current employment certificate and Company ID copy'
    ]
  },
  business: {
    title: 'Business Loan & Working Capital Checklist',
    items: [
      'KYC of Proprietor / Partners / Directors (PAN & Aadhaar)',
      'Business Registration: GST Certificate, Udyam Aadhaar, Shop & Establishment Gumastadhara',
      'Partnership Deed / MOA & AOA with Certificate of Incorporation',
      'Last 3 years Audited Financials with Balance Sheet, P&L, Audit Report & 3CA/3CB',
      'Last 3 years Income Tax Returns (ITR) with computation of income',
      'Last 12 months Bank Account Statements for all Current & Savings accounts',
      'Latest GST-3B returns for current financial year',
      'Statement of Account for existing active loans & repayment track record'
    ]
  },
  home: {
    title: 'Home Loan & Construction Checklist',
    items: [
      'Applicant and Co-Applicant KYC (PAN & Aadhaar)',
      'Income Proof: Salary slips & Form 16 (for salaried) OR 3 years ITR & Financials (for self-employed)',
      'Last 1 year Bank Account statement',
      'Property Documents: Agreement to Sell, Allotment letter, Approved Building Plan',
      'Chain of Title Deeds / 30-year Search Report / Title Clearance',
      'N.A. Permission and Municipal / Development Authority clearance (Rajkot RMC / RUDA)',
      'Payment receipts of advance token / margin money paid to builder or seller'
    ]
  },
  mortgage: {
    title: 'Mortgage / Loan Against Property (LAP) Checklist',
    items: [
      'Applicant and Co-Applicant / Property Co-owners KYC',
      'Complete Property Chain documents (Sale Deed, Gift Deed, Sanction Plan)',
      'Latest Property Tax paid receipt and Electricity bill in applicant/owner name',
      'Income proof: 3 years ITR, P&L, Balance Sheet and 12 months Bank Statements',
      'Business proof (if business owner) or Salary credentials (if salaried)',
      'Existing loan sanction letters and track record if transferring balance'
    ]
  },
  personal: {
    title: 'Personal Loan Checklist',
    items: [
      'Passport size photographs',
      'PAN Card (mandatory) and Aadhaar Card',
      'Current residence address proof (Electricity bill, Rent agreement if rented)',
      'Last 3 to 6 months salary slips',
      'Last 6 months bank statement showing regular salary deposits',
      'Details of any existing personal loans, credit cards, or car EMIs'
    ]
  },
  gold: {
    title: 'Gold Loan Checklist',
    items: [
      'Identity & Address KYC: PAN Card and Aadhaar Card / Voter ID',
      'Recent passport size photographs',
      'Gold ornaments / coins for professional karat purity verification and weighing',
      'No formal income proof or CIBIL required for standard gold advances'
    ]
  },
  vehicle: {
    title: 'Car & Commercial Vehicle Checklist',
    items: [
      'Applicant KYC (PAN, Aadhaar, Driving License)',
      'Income Proof: 2 years ITR or 6 months salary slips',
      'Last 6 months bank statement',
      'Vehicle Quotation / Proforma Invoice from authorized dealership',
      'For used vehicles: RC Book copy, valid Insurance policy, and fitness certificate'
    ]
  },
  machinery: {
    title: 'Machinery & Equipment Checklist',
    items: [
      'Business KYC and entity registration certificates',
      'Proforma Invoice / Quotation of machinery from manufacturer/authorized dealer',
      'Last 3 years Financial statements and Income Tax Returns',
      'Last 1 year Current account statements',
      'Brief project note explaining expected capacity increase and cash flow generation'
    ]
  },
  doctor: {
    title: 'Doctor & Professional Loan Checklist',
    items: [
      'KYC of applicant (PAN & Aadhaar)',
      'Educational Degree Certificate (MBBS, MD, MS, BDS, CA Certificate)',
      'Registration Certificate with State Medical Council / MCI / ICAI',
      'Clinic / Hospital / Office ownership or rent agreement proof',
      'Last 2 years ITRs and 12 months primary bank statement'
    ]
  }
};

function showDocs() {
  const select = document.getElementById('docType');
  const output = document.getElementById('docOutput');
  if (!select || !output) return;

  const key = select.value;
  const data = documentChecklists[key] || documentChecklists['salaried'];

  output.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
      <h4 style="margin:0; font-size:17px; color:var(--maroon);">${data.title}</h4>
      <button class="btn btn-soft btn-sm" onclick="window.print()">
        🖨️ Print / Save Checklist
      </button>
    </div>
    <ul class="checklist">
      ${data.items.map((item, idx) => `
        <li class="checklist-item">
          <input type="checkbox" id="chk_${idx}" onchange="toggleChecklistItem(this)">
          <label for="chk_${idx}" style="cursor:pointer; flex:1;">${item}</label>
        </li>
      `).join('')}
    </ul>
    <p class="notice">
      <b>Next Step:</b> You can verify which documents you already have ready. DK Consultancy will assist you with doorstep collection and bank file preparation.
    </p>
  `;
}

function toggleChecklistItem(chk) {
  const li = chk.closest('.checklist-item');
  if (chk.checked) {
    li.classList.add('checked');
  } else {
    li.classList.remove('checked');
  }
}

/* ==========================================================================
   5. "Ask DK" AI Smart Finance Assistant
   ========================================================================== */
function addChatBubble(text, type) {
  const chatWindow = document.getElementById('chat');
  if (!chatWindow) return;

  const bubble = document.createElement('div');
  bubble.className = `bubble ${type}`;
  bubble.innerHTML = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function quickChat(text) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = text;
    sendChat();
  }
}

function sendChat() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const q = input.value.trim();
  if (!q) return;

  addChatBubble(escapeHTML(q), 'user');
  input.value = '';

  // Show typing indicator
  const chatWindow = document.getElementById('chat');
  const typing = document.createElement('div');
  typing.className = 'bubble bot typing';
  typing.id = 'chatTypingIndicator';
  typing.textContent = 'DK Assistant is typing...';
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  setTimeout(() => {
    const el = document.getElementById('chatTypingIndicator');
    if (el) el.remove();

    const reply = generateBotResponse(q);
    addChatBubble(reply, 'bot');
  }, 400);
}

function generateBotResponse(query) {
  const s = query.toLowerCase();

  if (/cibil|credit score|score/.test(s)) {
    return 'For most unsecured business loans and personal loans, lenders prefer a <b>CIBIL score of 720+</b>. For secured loans (like Home Loan or LAP), flexibility is available even with scores around 650–700. If you have past settlement or overdue issues, DK Consultancy can review your credit report and advise on eligible NBFC options.';
  }
  if (/cgtmse|mudra|collateral free|subsidy|guarantee/.test(s)) {
    return '<b>CGTMSE</b> allows eligible micro and small businesses to obtain loans up to <b>₹5 Crore</b> without physical collateral or third-party guarantee. Government fees apply. We help prepare your project report, Udyam registration, and bank proposal to meet CGTMSE underwriting criteria.';
  }
  if (/document|paper|file|dastavej|kyc|itr|salary/.test(s)) {
    return 'Standard requirements include: <b>Identity KYC</b> (PAN & Aadhaar), <b>Address Proof</b> (Electricity bill), <b>Income Proof</b> (Salary slips/Form 16 or 3-year ITRs with computation), and <b>Banking</b> (12 months statements). Check our interactive <i>Document Checklist</i> above for your specific category!';
  }
  if (/interest|rate|byaj|vyaj|roi|percentage/.test(s)) {
    return 'Indicative starting rates in Gujarat currently: <b>Home Loans:</b> ~8.40% – 9.25%, <b>LAP:</b> ~9.25% – 11.50%, <b>Business Loans:</b> ~11.50% – 16%, <b>Gold Loans:</b> from 9.0%. Actual rates depend on your business profile, turnover, credit score, and chosen lender.';
  }
  if (/emi|calculate|formula|repay|monthly/.test(s)) {
    return 'You can use our interactive <b>EMI Calculator</b> on this page! It features live sliders to test loan amounts up to ₹5 Crore and tenures up to 30 years with an instant principal vs interest breakdown.';
  }
  if (/home loan|house|plot|flat|construction/.test(s)) {
    return 'We provide end-to-end guidance for <b>Home Loans</b>, including property title verification, legal search, valuation report, and subsidy assistance. We work with leading banks (SBI, HDFC, ICICI, Bank of Baroda, etc.) and housing finance companies in Rajkot.';
  }
  if (/business|working capital|overdraft|cc|od/.test(s)) {
    return 'We assist businesses with <b>Unsecured Business Loans</b>, <b>Cash Credit / Overdraft (CC/OD)</b> limits, machinery purchase finance, and bill discounting. Minimum 1 to 2 years business vintage with GST filing is typically expected.';
  }
  if (/dhaval|contact|phone|call|mobile|number|whatsapp/.test(s)) {
    return 'You can directly contact <b>Dhaval Khimani</b> at <b><a href="tel:9033012582">90330 12582</a></b> or <b><a href="tel:7048456000">70484 56000</a></b>. You can also chat on WhatsApp by clicking the WhatsApp buttons on this site.';
  }
  if (/address|office|location|where|ramapir|sadbhavna|dwarika/.test(s)) {
    return 'Our office is located at:<br><b>606, Dwarika Pride, 150 Feet Ring Road, near Sadbhavna Hospital, Ramapir Chowkdi, Rajkot, Gujarat – 360007</b>.<br>Office hours: Monday to Saturday, 9:30 AM to 7:30 PM.';
  }
  if (/turnaround|time|days|how long|fast|urgent/.test(s)) {
    return 'Typical processing turnaround:<br>• Gold Loan: 1–3 hours<br>• Personal Loan: 24–48 hours<br>• Business Loan: 3–5 working days<br>• Home Loan / LAP: 7–12 working days (due to title legal & technical evaluation).';
  }
  if (/fee|charge|upfront|commission/.test(s)) {
    return 'DK Consultancy maintains complete transparency. We do <b>not</b> ask for upfront consultation fees. Bank processing fees and legal/valuation charges (where applicable) are paid directly to the financing institution.';
  }

  return 'Thank you for reaching out! I can assist with loan categories, document checklists, CIBIL tips, EMI calculations, and application steps. You can also submit the enquiry form below or call <b>Dhaval Khimani at 90330 12582</b> for personalized advisory.';
}

/* ==========================================================================
   6. Enquiry Form Submission & Dual-Action Handling
   ========================================================================== */
async function submitEnquiry(e) {
  e.preventDefault();

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const loanInput = document.getElementById('loanType');
  const amountInput = document.getElementById('loanAmount');
  const methodInput = document.getElementById('contactMethod');
  const messageInput = document.getElementById('message');
  const consentInput = document.getElementById('consent');

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const loan = loanInput.value;
  const amount = amountInput.value.trim();
  const method = methodInput.value;
  const message = messageInput.value.trim();

  // Validation
  if (name.length < 2) {
    showToast('Please enter your full name');
    nameInput.focus();
    return;
  }

  // Indian phone validation: 10 digits, optionally prefixed with +91 or 0
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
  if (!phoneRegex.test(cleanPhone)) {
    showToast('Please enter a valid 10-digit mobile number');
    phoneInput.focus();
    return;
  }

  if (!consentInput.checked) {
    showToast('Please accept the consent terms');
    consentInput.focus();
    return;
  }

  // Generate Reference ID
  const refId = 'DK-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  const enquiryData = {
    id: refId,
    name,
    phone: cleanPhone,
    loan,
    amount,
    method,
    message,
    date: new Date().toISOString(),
    status: 'New'
  };

  // 1. Try to send to backend API
  try {
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData)
    });
    if (res.ok) {
      console.log('Enquiry successfully submitted to backend API.');
    }
  } catch (err) {
    console.warn('Backend API not reachable (running as static file), saving locally.');
  }

  // 2. Save locally in localStorage as reliable offline backup
  try {
    const existing = JSON.parse(localStorage.getItem('dk_enquiries') || '[]');
    existing.unshift(enquiryData);
    localStorage.setItem('dk_enquiries', JSON.stringify(existing));
  } catch (err) {
    console.error('LocalStorage error:', err);
  }

  window.lastEnquiry = enquiryData;

  // 3. Render Confirmation View
  const resultBox = document.getElementById('enquiryResult');
  resultBox.classList.remove('hidden');
  resultBox.innerHTML = `
    <div style="background:#ffffff; border-radius:12px; padding:18px; border:1px solid #d4edda; margin-top:8px;">
      <div style="display:flex; align-items:center; gap:8px; color:var(--green); font-weight:800; font-size:16px;">
        <span>✓</span> Enquiry Registered Successfully!
      </div>
      <p style="font-size:12.5px; color:#55443d; margin:8px 0 14px;">
        Reference ID: <b>${refId}</b><br>
        Thank you, <b>${escapeHTML(name)}</b>. We have recorded your interest in <b>${escapeHTML(loan)}</b> (${escapeHTML(amount)}). Dhaval Khimani will connect with you via ${escapeHTML(method)}.
      </p>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn btn-whatsapp btn-sm" onclick="sendWhatsApp()">
          💬 Connect on WhatsApp Now →
        </button>
        <a class="btn btn-dark btn-sm" href="tel:9033012582">
          📞 Call Dhaval Khimani
        </a>
      </div>
    </div>
  `;

  showToast('Enquiry received! You can also connect via WhatsApp.');
  resultBox.scrollIntoView({ behavior: 'smooth' });
}

function sendWhatsApp() {
  const d = window.lastEnquiry || {
    name: document.getElementById('name').value.trim() || 'Valued Client',
    loan: document.getElementById('loanType').value || 'Finance Guidance',
    amount: document.getElementById('loanAmount').value || 'Not specified',
    method: document.getElementById('contactMethod').value || 'WhatsApp',
    message: document.getElementById('message').value.trim() || 'Please contact me to discuss my requirement.'
  };

  const text = `Hello Dhaval Sir (DK Consultancy),\n\nMy Name: ${d.name}\nRequirement: ${d.loan}\nEstimated Amount: ${d.amount}\nPreferred Contact: ${d.method}\nDetails: ${d.message || 'Looking for finance guidance'}\n\nPlease let me know the next step. Thank you!`;

  const url = `https://wa.me/919033012582?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function resetForm() {
  const form = document.getElementById('enquiryForm');
  if (form) form.reset();
  const res = document.getElementById('enquiryResult');
  if (res) res.classList.add('hidden');
  showToast('Form cleared');
}

/* ==========================================================================
   7. UI Helpers: Mobile Menu, FAQ, Toasts
   ========================================================================== */
function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  if (drawer) {
    drawer.classList.toggle('active');
  }
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  if (drawer) {
    drawer.classList.remove('active');
  }
}

function toggleFaq(button) {
  const item = button.parentElement;
  item.classList.toggle('open');
  const span = button.querySelector('span');
  if (span) {
    span.textContent = item.classList.contains('open') ? '−' : '＋';
  }
}

let toastTimer = null;
function showToast(message) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = message;
  t.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.style.display = 'none';
  }, 3500);
}

/* ==========================================================================
   8. In-Browser Leads Manager for DK Consultancy (Admin View)
   ========================================================================== */
function openLeadManager() {
  let modal = document.getElementById('leadManagerModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'leadManagerModal';
    modal.style.cssText = `
      position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6);
      z-index:9999; display:flex; align-items:center; justify-content:center; padding:16px;
    `;
    modal.innerHTML = `
      <div style="background:#fff; border-radius:18px; width:100%; max-width:850px; max-height:90vh; display:flex; flex-direction:column; box-shadow:var(--shadow-lg); overflow:hidden;">
        <div style="padding:18px 24px; background:var(--maroon); color:#fff; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:18px;">DK Consultancy · Client Enquiries Manager</h3>
          <button onclick="closeLeadManager()" style="background:none; border:none; color:#fff; font-size:24px; cursor:pointer;">&times;</button>
        </div>
        <div id="leadModalBody" style="padding:20px; overflow-y:auto; flex:1;">
          Loading enquiries...
        </div>
        <div style="padding:14px 24px; background:var(--cream); display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--line);">
          <button class="btn btn-outline btn-sm" onclick="exportLeadsCSV()">📥 Export to CSV</button>
          <button class="btn btn-dark btn-sm" onclick="closeLeadManager()">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.style.display = 'flex';
  renderLeadModalTable();
}

function closeLeadManager() {
  const modal = document.getElementById('leadManagerModal');
  if (modal) modal.style.display = 'none';
}

async function renderLeadModalTable() {
  const body = document.getElementById('leadModalBody');
  if (!body) return;

  let leads = [];
  try {
    const res = await fetch('/api/enquiries');
    if (res.ok) {
      leads = await res.json();
    }
  } catch (e) {
    // Fallback to local storage
  }

  if (!leads || leads.length === 0) {
    leads = JSON.parse(localStorage.getItem('dk_enquiries') || '[]');
  }

  if (leads.length === 0) {
    body.innerHTML = `
      <div style="text-align:center; padding:40px 0; color:var(--muted);">
        <p style="font-size:32px; margin:0 0 10px;">📋</p>
        <p style="font-weight:700;">No enquiries recorded yet.</p>
        <small>When visitors fill the enquiry form, their details appear here.</small>
      </div>
    `;
    return;
  }

  body.innerHTML = `
    <div style="margin-bottom:12px; font-size:13px; color:var(--muted); display:flex; justify-content:space-between;">
      <span>Total Enquiries: <b>${leads.length}</b></span>
      <span>Storage: Server API & Local Cache</span>
    </div>
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:12.5px;">
        <thead>
          <tr style="background:#fff6ee; border-bottom:2px solid var(--line); text-align:left;">
            <th style="padding:10px;">Ref ID</th>
            <th style="padding:10px;">Date</th>
            <th style="padding:10px;">Client Name</th>
            <th style="padding:10px;">Phone</th>
            <th style="padding:10px;">Loan Type</th>
            <th style="padding:10px;">Amount</th>
            <th style="padding:10px;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${leads.map(l => `
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px; font-weight:700; color:var(--primary);">${escapeHTML(l.id || '-')}</td>
              <td style="padding:10px; color:var(--muted);">${new Date(l.date).toLocaleDateString('en-IN')}</td>
              <td style="padding:10px; font-weight:700;">${escapeHTML(l.name)}</td>
              <td style="padding:10px;"><a href="tel:${escapeHTML(l.phone)}" style="color:var(--maroon);">${escapeHTML(l.phone)}</a></td>
              <td style="padding:10px;">${escapeHTML(l.loan)}</td>
              <td style="padding:10px; font-weight:700;">${escapeHTML(l.amount)}</td>
              <td style="padding:10px;">
                <a href="https://wa.me/91${escapeHTML(l.phone)}" target="_blank" class="btn btn-whatsapp btn-sm" style="padding:4px 8px; font-size:11px;">
                  WhatsApp
                </a>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function exportLeadsCSV() {
  const leads = JSON.parse(localStorage.getItem('dk_enquiries') || '[]');
  if (leads.length === 0) {
    showToast('No leads to export.');
    return;
  }

  const headers = ['Reference ID', 'Date', 'Name', 'Phone', 'Loan Type', 'Amount', 'Preferred Method', 'Message'];
  const rows = leads.map(l => [
    `"${l.id || ''}"`,
    `"${l.date || ''}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${l.phone || ''}"`,
    `"${(l.loan || '').replace(/"/g, '""')}"`,
    `"${(l.amount || '').replace(/"/g, '""')}"`,
    `"${(l.method || '').replace(/"/g, '""')}"`,
    `"${(l.message || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `DK_Consultancy_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Global keyboard shortcut to open lead manager (Ctrl + Shift + L)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
    e.preventDefault();
    openLeadManager();
  }
});

/* ==========================================================================
   9. Initialization on DOMContentLoaded
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderLoanCards();
  initEMICalculator();
  showDocs(); // Render initial document checklist

  // Close mobile drawer on navigation link click
  const drawerLinks = document.querySelectorAll('#mobileDrawer a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
});
