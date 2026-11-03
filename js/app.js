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
    tags: ['Working Capital', 'Turnover Based', 'Fast Disbursal']
  },
  {
    icon: '🏛️',
    title: 'CGTMSE MSME Loan',
    desc: 'Collateral-free and third-party-guarantee-free credit facility up to ₹5 Crore for eligible micro and small enterprises under government scheme.',
    tags: ['Zero Collateral', 'Govt Scheme', 'Up to ₹5 Cr']
  },
  {
    icon: '🏠',
    title: 'Home Loan',
    desc: 'Tailored finance for purchasing ready/under-construction homes, plot purchase with construction, or balance transfer with top-up facility.',
    tags: ['Lowest Interest', 'Up to 30 Yrs', 'Tax Benefits']
  },
  {
    icon: '🏘️',
    title: 'Mortgage / Loan Against Property',
    desc: 'Leverage the market value of your residential, commercial, or industrial property for major business needs with comfortable repayment tenures.',
    tags: ['High Ticket Size', 'Lower EMI', 'Flexible Usage']
  },
  {
    icon: '💼',
    title: 'Personal Loan',
    desc: 'Quick collateral-free loans for salaried employees and self-employed professionals to meet immediate medical, family, or travel expenses.',
    tags: ['No Security', 'Minimal Paperwork', '1 to 5 Yrs']
  },
  {
    icon: '🩺',
    title: 'Doctor & Professional Loan',
    desc: 'Exclusive specialized credit lines for practicing doctors, dentists, chartered accountants, and architects for clinics, labs, and setups.',
    tags: ['Customized Limits', 'Hassle-Free', 'Practice Expansion']
  },
  {
    icon: '🚗',
    title: 'Car & Commercial Vehicle Loan',
    desc: 'Competitive financing options for new or pre-owned private cars, commercial fleets, trucks, and transport vehicles with flexible down payment.',
    tags: ['Up to 100% On-road', 'New & Used', 'Instant Sanction']
  },
  {
    icon: '⚙️',
    title: 'Machinery & Equipment Loan',
    desc: 'Upgrade your manufacturing setup, factory machines, CNC, medical equipment, or printing units with term loans against equipment proforma.',
    tags: ['Capital Expenditure', 'Tax Depreciation', 'Supplier Linked']
  },
  {
    icon: '🪙',
    title: 'Gold Loan',
    desc: 'Instant liquidity against gold jewellery with maximum loan-to-value (LTV), transparent valuation, and flexible interest-servicing options.',
    tags: ['Same Day Cash', 'Minimal KYC', 'Safe Storage']
  }
];

function renderLoanCards() {
  const container = document.getElementById('loanCards');
  if (!container) return;

  container.innerHTML = loanServices.map(loan => `
    <article class="card" onclick="selectLoanService('${escapeHTML(loan.title)}')">
      <div class="card-icon">${loan.icon}</div>
      <h3>${loan.title}</h3>
      <p>${loan.desc}</p>
      <div class="card-tags">
        ${loan.tags.map(t => `<span class="tag">${t}</span>`).join('')}
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
   4. Fintech-Grade Document Hub & Category Guide (Visual 3-Stage Architecture)
   ========================================================================== */
const documentData = {
  salaried: {
    title: 'Salaried Applicant Document List',
    icon: '👔',
    subtitle: 'Corporate & Govt Staff',
    tagline: 'Standard documentation portfolio for corporate, MNC, PSU, and government employees.',
    tip: 'All document Xerox copies must be signed (self-attested) on every single page. Keep original documents ready for one-time physical bank verification.',
    groups: [
      {
        name: 'Applicant KYC & Residence',
        icon: '🪪',
        items: [
          { name: '1 Passport Size Photo', desc: 'Recent passport size color photograph of the applicant' },
          { name: 'PAN Card Copy', desc: 'Mandatory for applicant identity verification and CIBIL score check' },
          { name: 'Aadhaar Card Copy', desc: 'Mandatory UIDAI address and digital KYC verification' },
          { name: 'Resident Light Bill Xerox Copy', desc: 'Latest home electricity bill Xerox copy as residential address proof' },
          { name: 'Company ID Card Photo Copy', desc: 'Valid corporate employee identity card Xerox copy' }
        ]
      },
      {
        name: 'Salary & Banking Proofs',
        icon: '💵',
        items: [
          { name: '6 Months Salary Slips', desc: 'Latest 6 months payslips showing gross salary, deductions & net pay' },
          { name: '1 Year Bank Statement', desc: 'Complete 12 months updated bank statement where salary is credited' },
          { name: 'Salary Bank Account Proof', desc: 'Passbook front page or cancelled cheque of operative salary account' },
          { name: 'Joining / Appointment Letter', desc: 'Official company joining letter proving job stability & total tenure' }
        ]
      },
      {
        name: 'Submission & Underwriter Rules',
        icon: '📋',
        items: [
          { name: 'Signature on All Pages (Mandatory)', desc: 'All document Xerox copies must have applicant signature on every single page' },
          { name: 'Form 16 / Tax Assessment', desc: 'Last 2 years Form 16 (Part A & B) or recent income tax assessment returns' },
          { name: 'Clean Banking Track', desc: 'Zero ECS/NACH cheque returns or bounce charges in operative accounts' },
          { name: 'Originals for Verification', desc: 'Keep original PAN, Aadhaar & payslips ready for one-time physical bank verification' }
        ]
      }
    ]
  },
  business: {
    title: 'Business Loan & Working Capital',
    icon: '🏢',
    subtitle: 'MSME & Working Capital',
    tagline: 'Financing solutions for proprietor firms, partnership businesses, MSMEs, and private limited companies.',
    tip: 'All document Xerox copies must be signed on every page. Ensure last 12 months GST returns match current account bank credits.',
    groups: [
      {
        name: 'Promoter & Residence KYC',
        icon: '🪪',
        items: [
          { name: '1 Passport Size Photo', desc: 'Recent passport size photo of applicant / partners / directors' },
          { name: 'PAN Card Copy', desc: 'Individual PAN cards of proprietor/partners and Firm PAN card' },
          { name: 'Aadhaar Card Copy', desc: 'UIDAI KYC proof of all active promoters with mobile link' },
          { name: 'Resident Electric Bill or Tax Bill', desc: 'Latest residential light bill or Municipal Tax Bill as home ownership proof' }
        ]
      },
      {
        name: 'Business Proofs & Ongoing Loans',
        icon: '🏢',
        items: [
          { name: 'Business Proof (SSI / GST / Shop License)', desc: 'Udyam MSME certificate, active GST registration, and Shop & Establishment License' },
          { name: 'Commercial Premises Light Bill', desc: 'Latest electricity bill Xerox copy of office, shop, or factory' },
          { name: 'Current Loan Details (SOA or Welcome Letter)', desc: 'Statement of Account (SOA) or Welcome Letter with repayment schedule for ongoing loans' },
          { name: 'Signatures on All Pages', desc: 'Xerox copy of all documents signed page by page' }
        ]
      },
      {
        name: 'Financials & 1-Year Banking',
        icon: '📊',
        items: [
          { name: 'ITR Last 3 Years', desc: 'Last 3 years filed Income Tax Returns with detailed computation of income' },
          { name: 'Audit Return 3 Years', desc: 'Last 3 years Audited Balance Sheet & Profit and Loss account with CA audit reports' },
          { name: 'Banking Last 1 Year (Current & Savings)', desc: 'Last 12 months comprehensive statements of all Current and Savings accounts' },
          { name: 'Turnover Track Record', desc: 'Reconciled GST-3B turnover matching banking credits' }
        ]
      }
    ]
  },
  home: {
    title: 'Home Loan & Housing Finance',
    icon: '🏠',
    subtitle: 'Residential Property',
    tagline: 'Financing solutions for new flat purchase, residential plot acquisition, bungalow construction, and balance transfer.',
    tip: 'Co-applicant lady KYC borrower mandatory. All document Xerox copies must be signed on every single page.',
    groups: [
      {
        name: 'Applicant KYC & Lady Co-Applicant',
        icon: '🪪',
        items: [
          { name: '2 Passport Size Photos', desc: 'Recent passport size photographs of applicant and co-applicants' },
          { name: 'PAN Card Copy', desc: 'Mandatory identity card copy for primary applicant and all co-owners' },
          { name: 'Aadhaar Card Copy', desc: 'UIDAI KYC proof for primary borrower and co-applicant' },
          { name: 'Co-Applicant Lady KYC (Mandatory)', desc: 'Co-applicant lady KYC borrower is compulsory as per bank guidelines' },
          { name: 'Resident Electric Bill or Tax Bill', desc: 'Latest residential light bill or Municipal Tax Bill as ownership proof' }
        ]
      },
      {
        name: 'Property File & Legal Clearance',
        icon: '🏠',
        items: [
          { name: 'Property File Copy', desc: 'Complete legal property file copy for bank legal and technical valuation' },
          { name: 'Registered Title Deed Chain', desc: 'Complete chain of registered sale deeds / allotment letters tracing ownership' },
          { name: 'Sanctioned Municipal Blueprint', desc: 'Approved building layout plan and construction permission (RMC / RUDA)' },
          { name: 'Property Tax & Light Bill', desc: 'Latest municipal property tax receipt and site electricity bill' }
        ]
      },
      {
        name: 'Income, Banking & Business Proof',
        icon: '📊',
        items: [
          { name: 'ITR Last 3 Years', desc: 'Filed Income Tax Returns for last 3 years with complete computation of income' },
          { name: 'Banking Last 1 Year (Current & Savings)', desc: '12 months updated statements of all operative Savings and Current accounts' },
          { name: 'Business Proof & Light Bill', desc: 'SSI / MSME, GST, Shop License & last commercial light bill (if self-employed)' },
          { name: 'Current Loan Details (SOA / Welcome Letter)', desc: 'Statement of Account (SOA) or Welcome Letter if any loan is ongoing' }
        ]
      }
    ]
  },
  mortgage: {
    title: 'Mortgage / Loan Against Property (LAP)',
    icon: '🏘️',
    subtitle: 'Property Collateral',
    tagline: 'Unlock high-value liquidity against your residential, commercial, or industrial real estate.',
    tip: 'Co-applicant lady KYC borrower mandatory. All document Xerox copies must be signed on every single page.',
    groups: [
      {
        name: 'Borrower KYC & Mandatory Lady Co-Applicant',
        icon: '🪪',
        items: [
          { name: '2 Passport Size Photos', desc: 'Recent passport-sized color photos of applicant and co-applicants' },
          { name: 'PAN Card Copy', desc: 'Individual PAN cards of primary applicant and all property co-owners' },
          { name: 'Aadhaar Card Copy', desc: 'Aadhaar card copy of all property owners and co-applicants' },
          { name: 'Co-Applicant Lady KYC (Mandatory)', desc: 'Co-applicant lady KYC borrower is compulsory for mortgage loans' },
          { name: 'Resident Electric Bill or Tax Bill', desc: 'Latest electric bill or Municipal Tax Bill as home ownership proof' }
        ]
      },
      {
        name: 'Mortgaged Property File & Title',
        icon: '🏘️',
        items: [
          { name: 'Property File Copy', desc: 'Complete legal property file copy of the asset being mortgaged' },
          { name: 'Registered Sale Deed Chain', desc: 'Unbroken 30-year chain of registered title deeds and conveyance deeds' },
          { name: 'Sanctioned Layout Blueprint', desc: 'Approved building blueprint and local municipal permission' },
          { name: 'Property Tax & Light Bill', desc: 'Latest municipal tax receipt and site electric bill' }
        ]
      },
      {
        name: 'Financials & Banking Statements',
        icon: '📊',
        items: [
          { name: 'ITR Last 3 Years', desc: 'Last 3 years filed Income Tax Returns with detailed computation' },
          { name: 'Banking Last 1 Year (Current & Savings)', desc: 'Last 12 months comprehensive statements of Current and Savings accounts' },
          { name: 'Business Proof & Light Bill', desc: 'SSI / MSME, GST, Shop License, and commercial premises light bill' },
          { name: 'Current Loan Details (SOA or Welcome Letter)', desc: 'Statement of Account (SOA) or Welcome Letter for ongoing loans' }
        ]
      }
    ]
  },
  personal: {
    title: 'Personal Loan (Unsecured Cash)',
    icon: '💼',
    subtitle: 'Instant Liquidity',
    tagline: 'Quick multi-purpose cash advance with zero collateral or guarantor requirement.',
    tip: 'Sign and submit all document Xerox copies page by page. Disbursed directly to your bank account within 24 to 48 hours.',
    groups: [
      {
        name: 'Applicant KYC & Residence',
        icon: '🪪',
        items: [
          { name: '1 Passport Size Photo', desc: 'Recent passport size color photograph of the applicant' },
          { name: 'PAN Card Copy', desc: 'Mandatory identity proof for immediate CIBIL credit score check' },
          { name: 'Aadhaar Card Copy', desc: 'UIDAI KYC proof with registered mobile phone link' },
          { name: 'Resident Light Bill Last Xerox', desc: 'Latest Xerox copy of home electricity bill as address proof' }
        ]
      },
      {
        name: 'Business & Ongoing Loan Proofs',
        icon: '💼',
        items: [
          { name: 'Shop Light Bill Xerox', desc: 'Latest electricity bill of shop/office premises (for self-employed)' },
          { name: 'Xerox Copy of GST Number', desc: 'Xerox copy of active GST registration certificate' },
          { name: 'Welcome Letter & Repayment Schedule', desc: 'Welcome letter and repayment schedule if any loan is ongoing' },
          { name: 'Sign & Submit Page by Page', desc: 'Xerox copy of all documents signed and submitted page by page' }
        ]
      },
      {
        name: 'Financials & 1-Year Banking',
        icon: '📊',
        items: [
          { name: '1 Year Bank Statement (Savings & Current)', desc: 'Complete 12 months Savings and Current account Xerox copy' },
          { name: '3 Years Regular Returns', desc: 'Last 3 years regular filed ITR with detailed income computation' },
          { name: '3 Years Balance Sheet', desc: 'Complete balance sheet and profit & loss statements' },
          { name: 'Clean Banking Record', desc: 'Zero ECS/NACH cheque returns or penalty charges in last 12 months' }
        ]
      }
    ]
  },
  vehicle: {
    title: 'Car & Commercial Vehicle Loan',
    icon: '🚗',
    subtitle: 'Auto & Transport',
    tagline: 'Financing solutions for passenger cars, transport fleets, and used vehicles.',
    tip: 'Up to 90% to 100% on-road funding available for selected vehicles. All Xerox copies must be signed page by page.',
    groups: [
      {
        name: 'Applicant KYC',
        icon: '🪪',
        items: [
          { name: 'PAN Card & Aadhaar Card', desc: 'Mandatory identification documents for all applicants' },
          { name: 'Driving License', desc: 'Valid driving license of applicant or co-applicant' },
          { name: 'Passport Photos', desc: '2 recent passport-sized photographs' },
          { name: 'Residence Light Bill', desc: 'Latest home electricity bill Xerox copy as address proof' }
        ]
      },
      {
        name: 'Income & Banking',
        icon: '💵',
        items: [
          { name: 'Salaried Income Proof', desc: 'Last 3-6 months salary slips and 6 months salary bank statement' },
          { name: 'Self-Employed / Fleets', desc: 'Last 2 years ITR with computation, 6 months bank statement & fleet RC copies' },
          { name: '1 Year Bank Statement', desc: 'Bank statement showing regular income credits and healthy balance' },
          { name: 'Existing Loan SOA', desc: 'Repayment track of active vehicle, personal, or business loans' }
        ]
      },
      {
        name: 'Vehicle Quotation / Documentation',
        icon: '🚙',
        items: [
          { name: 'New Vehicle: Proforma Invoice', desc: 'Official dealer proforma invoice with chassis booking details' },
          { name: 'Used Vehicle: RC Book Copy', desc: 'Valid Registration Certificate, Insurance policy, and Fitness certificate' },
          { name: 'Transport Permit (Commercial)', desc: 'State or National permit copy for commercial transport vehicles' },
          { name: 'Signatures on All Pages', desc: 'All document Xerox copies signed page by page' }
        ]
      }
    ]
  },
  gold: {
    title: 'Gold Loan (Instant Liquidity)',
    icon: '🪙',
    subtitle: 'Same-Day Cash',
    tagline: 'Instant cash advance against 18k to 24k gold jewellery with minimal paperwork.',
    tip: 'Instant disbursement within 30 minutes at highest loan-to-value (LTV). Zero ITR or income proof required.',
    groups: [
      {
        name: 'Essential KYC Documents',
        icon: '🪪',
        items: [
          { name: 'PAN Card Copy', desc: 'Mandatory identity card copy for verification and credit reporting' },
          { name: 'Aadhaar Card / Voter ID', desc: 'UIDAI Aadhaar or Voter ID as residential address proof' },
          { name: '2 Passport Size Photos', desc: 'Recent passport-sized color photographs' },
          { name: 'Residence Light Bill', desc: 'Latest home electricity bill Xerox copy' }
        ]
      },
      {
        name: 'Gold Collateral & Appraisal',
        icon: '🪙',
        items: [
          { name: 'Physical Gold Ornaments', desc: 'Gold jewellery (18 Karat to 24 Karat) for on-the-spot caratmeter appraisal' },
          { name: 'Purchase Invoices (Optional)', desc: 'Original jeweler purchase invoice if available' },
          { name: 'Electronic Purity Certificate', desc: 'Instant transparent digital appraisal and valuation report' }
        ]
      },
      {
        name: 'Zero Paperwork & Terms',
        icon: '⚡',
        items: [
          { name: 'No Income Proofs Required', desc: 'Zero salary slips, zero ITR, and zero balance sheet requirements' },
          { name: 'Flexible Repayment Options', desc: 'Bullet repayment, monthly interest EMI, or flexible credit line' },
          { name: 'Insured Vault Storage', desc: '100% insured bank vault security for your pledged gold ornaments' },
          { name: 'Self-Attested KYC Copies', desc: 'All Xerox document copies signed page by page' }
        ]
      }
    ]
  },
  machinery: {
    title: 'Machinery & Equipment Financing',
    icon: '⚙️',
    subtitle: 'Industrial Capex',
    tagline: 'Capex financing for CNC machines, packaging lines, engineering plants, and industrial tools.',
    tip: 'Eligible for Gujarat State & Central Government MSME subsidies to lower interest rates.',
    groups: [
      {
        name: 'Entity & Promoter KYC',
        icon: '🪪',
        items: [
          { name: 'Promoter PAN & Aadhaar', desc: 'PAN and Aadhaar cards of all directors, partners, and key managers' },
          { name: 'Business Registration Proofs', desc: 'GST Certificate, Udyam MSME Registration, & Factory / Shop license' },
          { name: 'Industrial Electricity Bill', desc: 'Latest manufacturing facility / industrial unit electricity bill' },
          { name: 'Passport Photos', desc: '2 photos of all signing authorities' }
        ]
      },
      {
        name: 'Machinery Quotation & Specs',
        icon: '⚙️',
        items: [
          { name: 'Manufacturer Proforma Invoice', desc: 'Official commercial quotation from certified machinery manufacturer/dealer' },
          { name: 'Technical Specs & Layout Note', desc: 'Machine specifications, power requirements, & expected production output' },
          { name: 'Advance Margin Token Receipt', desc: 'Proof of advance token paid to machine supplier (if already remitted)' },
          { name: 'Existing Machine List', desc: 'List of existing factory plant & machinery' }
        ]
      },
      {
        name: 'Financials & Cash Flow',
        icon: '📊',
        items: [
          { name: 'Last 3 Years Audited Financials', desc: 'Balance Sheets, P&L, Audit Reports, and CA 3CA/3CB forms' },
          { name: 'Last 3 Years Income Tax Returns', desc: 'Complete ITRs with detailed computation of income' },
          { name: '12 Months Current Account', desc: 'Statements of all operative business bank accounts' },
          { name: 'Signature Page by Page', desc: 'All Xerox copies duly signed and stamped' }
        ]
      }
    ]
  },
  doctor: {
    title: 'Doctor & Healthcare Professional Loan',
    icon: '🩺',
    subtitle: 'Medical Practice',
    tagline: 'Customized credit lines for doctors, dentists, diagnostic centers, and healthcare practitioners.',
    tip: 'Special concessional interest rates and pre-approved limits up to ₹50 Lakhs without property collateral.',
    groups: [
      {
        name: 'KYC & Professional Credentials',
        icon: '🪪',
        items: [
          { name: 'PAN & Aadhaar Cards', desc: 'Mandatory identity verification for primary applicant' },
          { name: 'Medical Degree Certificate', desc: 'MBBS / MD / MS / BDS / MDS / BHMS / BAMS qualifying degree certificate' },
          { name: 'Medical Council Registration', desc: 'Valid registration certificate from State Medical Council or NMC' },
          { name: 'Passport Photos', desc: 'Recent passport-sized color photos' }
        ]
      },
      {
        name: 'Clinic & Practice Records',
        icon: '🏥',
        items: [
          { name: 'Clinic Ownership / Lease Agreement', desc: 'Property title deed or registered rent lease agreement for clinic premises' },
          { name: 'Establishment Clearance', desc: 'Local municipal clinical establishment certificate / trade permit' },
          { name: 'Clinic Electricity Bill', desc: 'Latest light bill Xerox copy of clinic / hospital premises' },
          { name: 'Self-Attested Copies', desc: 'All documents signed page by page' }
        ]
      },
      {
        name: 'Financials & Practice Banking',
        icon: '📊',
        items: [
          { name: 'Last 2 to 3 Years ITR', desc: 'Income Tax Returns with computation of professional income' },
          { name: '12 Months Bank Account Statements', desc: 'Primary operative bank account statements showing regular receipts' },
          { name: 'Existing Equipment Loan Track', desc: 'Sanction letter & repayment record for any active medical equipment loans' },
          { name: 'Clean Track Record', desc: 'No cheque bounce history in operative accounts' }
        ]
      }
    ]
  }
};

window.documentData = documentData;
window.currentDocCategory = 'salaried';

/**
 * Render modern fintech-grade 3-box document checklist hub
 */
function renderFintechDocHub(key) {
  if (!documentData[key]) key = 'salaried';
  window.currentDocCategory = key;

  // Highlight active button in category nav
  const buttons = document.querySelectorAll('.fintech-tab-btn, .doc-cat-tile');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-cat') === key) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const showcaseContainer = document.getElementById('fintechDocShowcase') || document.getElementById('docShowcaseArea');
  if (!showcaseContainer) return;

  const data = documentData[key];
  const g1 = data.groups[0] || { name: 'Applicant KYC', icon: '🪪', items: [] };
  const g2 = data.groups[1] || { name: 'Income & Banking', icon: '💵', items: [] };
  const g3 = data.groups[2] || { name: 'Asset & Underwriting', icon: '📋', items: [] };

  showcaseContainer.innerHTML = `
    <div class="fintech-doc-header">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
        <div>
          <div class="fintech-pill-badge">${escapeHTML(data.subtitle)}</div>
          <h3 class="fintech-heading">${escapeHTML(data.title)}</h3>
          <p class="fintech-subtitle">${escapeHTML(data.tagline)}</p>
        </div>
        <div class="fintech-header-actions">
          <button class="fintech-btn-soft" onclick="copyDocumentList('${key}')" title="Copy to clipboard">
            📋 Copy List
          </button>
          <button class="fintech-btn-soft" onclick="shareDocListWhatsApp('${key}')" title="Send to WhatsApp">
            💬 WhatsApp List
          </button>
          <button class="fintech-btn-soft" onclick="window.print()" title="Print checklist">
            🖨️ Print
          </button>
        </div>
      </div>
    </div>

    <div class="fintech-grid-3">
      <!-- Card 1 -->
      <div class="fintech-card">
        <div class="fintech-card-head">
          <span class="fintech-card-icon">${g1.icon || '🪪'}</span>
          <h4 class="fintech-card-title">${escapeHTML(g1.name)}</h4>
        </div>
        <ul class="fintech-checklist">
          ${g1.items.map(item => `
            <li class="fintech-item">
              <svg class="fintech-check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <div class="fintech-item-body">
                <div class="fintech-item-title">${escapeHTML(item.name)}</div>
                ${item.desc ? `<div class="fintech-item-desc">${escapeHTML(item.desc)}</div>` : ''}
              </div>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Card 2 -->
      <div class="fintech-card">
        <div class="fintech-card-head">
          <span class="fintech-card-icon">${g2.icon || '💵'}</span>
          <h4 class="fintech-card-title">${escapeHTML(g2.name)}</h4>
        </div>
        <ul class="fintech-checklist">
          ${g2.items.map(item => `
            <li class="fintech-item">
              <svg class="fintech-check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <div class="fintech-item-body">
                <div class="fintech-item-title">${escapeHTML(item.name)}</div>
                ${item.desc ? `<div class="fintech-item-desc">${escapeHTML(item.desc)}</div>` : ''}
              </div>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Card 3 -->
      <div class="fintech-card">
        <div class="fintech-card-head">
          <span class="fintech-card-icon">${g3.icon || '📋'}</span>
          <h4 class="fintech-card-title">${escapeHTML(g3.name)}</h4>
        </div>
        <ul class="fintech-checklist">
          ${g3.items.map(item => `
            <li class="fintech-item">
              <svg class="fintech-check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <div class="fintech-item-body">
                <div class="fintech-item-title">${escapeHTML(item.name)}</div>
                ${item.desc ? `<div class="fintech-item-desc">${escapeHTML(item.desc)}</div>` : ''}
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>

    <!-- Underwriter Advisory Strip -->
    <div class="fintech-tip-strip">
      <span style="font-size:20px; line-height:1; flex-shrink:0;">💡</span>
      <div class="fintech-tip-text">
        <b>DK Underwriter Rule:</b> ${escapeHTML(data.tip || 'All document Xerox copies must be signed (self-attested) on every single page.')}
      </div>
    </div>

    <!-- Doorstep Assistance Banner -->
    <div class="fintech-doorstep-banner">
      <div>
        <h4>Need Doorstep File Pickup in Rajkot?</h4>
        <p>Our loan executive collects and verifies all Xerox copies directly at your home or office across Rajkot &amp; Saurashtra.</p>
      </div>
      <div class="fintech-doorstep-actions">
        <a class="btn btn-outline" style="color:#fff; border-color:rgba(255,255,255,0.3);" href="tel:9033012582">📞 90330 12582</a>
        <a class="btn btn-outline" style="color:#fff; border-color:rgba(255,255,255,0.3);" href="tel:7048456000">📞 70484 56000</a>
        <a class="btn btn-primary" href="#contact" onclick="enquireDocCategory()">Apply with this Checklist →</a>
      </div>
    </div>
  `;
}

/**
 * Direct selection of a document category
 */
function selectDocCategory(key) {
  renderFintechDocHub(key);
}

/**
 * Compatibility alias for renderDocHubShowcase
 */
function renderDocHubShowcase(key) {
  renderFintechDocHub(key);
}

/**
 * Initial or default view render
 */
function showDocs(key) {
  renderFintechDocHub(key || window.currentDocCategory || 'salaried');
}

/**
 * Copy document list formatted to clipboard with visual toast
 */
function copyDocumentList(key) {
  const data = documentData[key] || documentData['salaried'];
  let text = `DK Consultancy - ${data.title} Document Requirements\n`;
  text += `Category: ${data.subtitle}\n`;
  text += `"${data.tagline}"\n\n`;
  data.groups.forEach((g, idx) => {
    text += `[${idx + 1}] ${g.name}:\n`;
    g.items.forEach(it => {
      text += `  ✓ ${it.name}${it.desc ? `: ${it.desc}` : ''}\n`;
    });
    text += `\n`;
  });
  text += `DK Underwriter Advisory: ${data.tip}\n\n`;
  text += `Doorstep Service & Guidance:\n`;
  text += `Dhaval Khimani (DK Consultancy, Rajkot)\n`;
  text += `📞 90330 12582 / 70484 56000\n`;
  text += `✉️ khimanidhaval@gmail.com\n`;
  text += `📍 606, Dwarika Pride, 150ft Ring Rd, Rajkot`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('✅ Document checklist copied to clipboard!');
    }).catch(() => {
      showToast('📋 Document checklist ready for sharing!');
    });
  } else {
    showToast('📋 Document checklist ready for sharing!');
  }
}

function copyDocListToClipboard(key) {
  copyDocumentList(key);
}

/**
 * Share document checklist directly to WhatsApp
 */
function shareDocListWhatsApp(key) {
  const data = documentData[key] || documentData['salaried'];
  let text = `*DK Consultancy - ${data.title} Document Requirements*\n`;
  text += `*Category:* ${data.subtitle}\n`;
  text += `"${data.tagline}"\n\n`;
  data.groups.forEach((g, idx) => {
    text += `*[${idx + 1}] ${g.name}:*\n`;
    g.items.forEach(it => {
      text += `✓ *${it.name}*${it.desc ? ` - ${it.desc}` : ''}\n`;
    });
    text += `\n`;
  });
  text += `*💡 DK Underwriter Rule:*\n${data.tip}\n\n`;
  text += `*Doorstep Pickup & Free Advisory:*\n`;
  text += `Dhaval Khimani · DK Consultancy\n`;
  text += `📞 Phone: +91 90330 12582 / 70484 56000\n`;
  text += `📍 606, Dwarika Pride, 150ft Ring Rd, Rajkot`;

  const url = `https://wa.me/919033012582?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function shareDocsOnWhatsApp(key) {
  shareDocListWhatsApp(key);
}

/**
 * Enquire for currently selected document category in contact form
 */
function enquireDocCategory() {
  const key = window.currentDocCategory || 'salaried';
  const data = documentData[key] || documentData['salaried'];
  const loanSelect = document.getElementById('loanType');
  if (loanSelect) {
    for (let opt of loanSelect.options) {
      if (opt.text.toLowerCase().includes(data.subtitle.toLowerCase()) || 
          opt.text.toLowerCase().includes(data.title.toLowerCase()) ||
          data.title.toLowerCase().includes(opt.text.toLowerCase())) {
        loanSelect.value = opt.value;
        break;
      }
    }
  }
  const contact = document.getElementById('contact');
  if (contact) {
    contact.scrollIntoView({ behavior: 'smooth' });
  }
}

function enquireCurrentDocLoan() {
  enquireDocCategory();
}

window.renderFintechDocHub = renderFintechDocHub;
window.selectDocCategory = selectDocCategory;
window.renderDocHubShowcase = renderDocHubShowcase;
window.showDocs = showDocs;
window.copyDocumentList = copyDocumentList;
window.copyDocListToClipboard = copyDocListToClipboard;
window.shareDocListWhatsApp = shareDocListWhatsApp;
window.shareDocsOnWhatsApp = shareDocsOnWhatsApp;
window.enquireDocCategory = enquireDocCategory;
window.enquireCurrentDocLoan = enquireCurrentDocLoan;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    documentData,
    renderFintechDocHub,
    selectDocCategory,
    copyDocumentList,
    shareDocListWhatsApp,
    enquireDocCategory
  };
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
