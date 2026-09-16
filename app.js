// ==========================================
// Calx — Universal Engine & Dashboard Suite
// Developer: Sachin Jatavat
// ==========================================

// --- GLOBAL STATE ---
let currentCategoryFilter = 'all';
let realTimeRates = {};
let lastRateFetchTime = null;

// Calculator State
let calcExpression = '';
let calcDisplayVal = '1,475.00';
let calcMemoryVal = 0;
let calcAngleMode = 'DEG';
let calcMode = 'sci';

// Quick Calc State
let quickCalcExpr = '1,250 + 225';
let quickCalcVal = '1,475.00';

// Quick Tip State
let quickTipPct = 15;

// Currency List with Country Flags & Codes
const CURRENCY_LIST = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', country: 'United States' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', country: 'European Union' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', country: 'United Kingdom' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', country: 'India' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', country: 'Japan' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', country: 'Canada' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', country: 'Australia' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', country: 'Switzerland' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', country: 'China' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', country: 'Brazil' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', country: 'South Africa' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', country: 'Singapore' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', country: 'Hong Kong' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', country: 'New Zealand' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', country: 'South Korea' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽', country: 'Mexico' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', country: 'United Arab Emirates' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', country: 'Turkey' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', country: 'Russia' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', country: 'Sweden' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', country: 'Norway' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', country: 'Denmark' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱', country: 'Poland' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', country: 'Thailand' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', country: 'Indonesia' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', country: 'Malaysia' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', country: 'Philippines' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', country: 'Egypt' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰', country: 'Pakistan' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩', country: 'Bangladesh' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰', country: 'Sri Lanka' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', country: 'Vietnam' }
];

const FALLBACK_RATES = {
  USD: 1.0,
  EUR: 0.9214,
  GBP: 0.7862,
  INR: 83.45,
  JPY: 155.20,
  CAD: 1.365,
  AUD: 1.512,
  CHF: 0.898,
  CNY: 7.245,
  BRL: 5.620,
  ZAR: 18.25,
  SGD: 1.348,
  HKD: 7.812,
  NZD: 1.635,
  KRW: 1378.5,
  MXN: 18.15,
  AED: 3.673,
  SAR: 3.751,
  TRY: 32.85,
  RUB: 89.20,
  SEK: 10.45,
  NOK: 10.60,
  DKK: 6.87,
  PLN: 3.98,
  THB: 36.70,
  IDR: 16350.0,
  MYR: 4.71,
  PHP: 58.70,
  EGP: 47.70,
  PKR: 278.50,
  BDT: 117.50,
  LKR: 304.50,
  VND: 25450.0
};

const INITIAL_HISTORY = [
  { id: 1, timeAgo: 'Just now', expression: '1,250 × 1.18 + 225', result: '1,700' },
  { id: 2, timeAgo: '2 mins ago', expression: 'sin(45°) × √2', result: '1.0' },
  { id: 3, timeAgo: '15 mins ago', expression: '4,500 ÷ 12', result: '375' },
  { id: 4, timeAgo: '1 hour ago', expression: '25% × 8,400', result: '2,100' }
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('calcx_history')) {
    localStorage.setItem('calcx_history', JSON.stringify(INITIAL_HISTORY));
  }

  fetchRealtimeCurrencyRates();
  runQuickFX();
  runQuickTip();
  runQuickLength();
  setupKeyboardListeners();
});

// --- MOBILE DRAWER HANDLERS ---
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar-container');
  const overlay = document.getElementById('mobile-drawer-overlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('mobile-open');
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar-container');
  const overlay = document.getElementById('mobile-drawer-overlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('mobile-open');
  }
}

// --- NAVIGATION & VIEW SWITCHER ---
function switchView(viewId) {
  // Hide all page views
  document.querySelectorAll('.page-view-container').forEach(el => {
    el.classList.add('hidden');
  });

  // Show target page view
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.remove('hidden');
  } else {
    const dashboardView = document.getElementById('view-dashboard');
    if (dashboardView) dashboardView.classList.remove('hidden');
  }

  // Update sidebar active nav styling
  document.querySelectorAll('.nav-pill').forEach(el => {
    el.classList.remove('nav-pill-active', 'bg-purple-600', 'text-white');
    el.classList.add('text-slate-600');
  });

  const activeNav = document.getElementById(`nav-${viewId}`);
  if (activeNav) {
    activeNav.classList.add('nav-pill-active');
    activeNav.classList.remove('text-slate-600');
  }

  // Update Breadcrumb
  const breadcrumbEl = document.getElementById('header-breadcrumb');
  const titleMap = {
    dashboard: 'Workspace / All Tools',
    calculator: 'Standard & Scientific Calculator',
    'currency-converter': 'Real-Time Currency Converter',
    'unit-converters': 'Unit & Data Converters',
    'financial-tools': 'Financial Tools',
    'math-engineering': 'Math & Engineering Workbench',
    'date-time-health': 'Date, Time & Health',
    'calculation-history': 'Calculation History',
    favorites: 'Favorites'
  };

  if (breadcrumbEl) {
    breadcrumbEl.innerText = titleMap[viewId] || 'Workspace';
  }

  // Close mobile drawer if open
  closeMobileSidebar();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Initialize tool view calculations if needed
  if (viewId === 'currency-converter') {
    populateCurrencyDropdowns();
    runCurrencyConversion();
    renderCurrencyMatrix();
  } else if (viewId === 'unit-converters') {
    initUnitConverters();
  } else if (viewId === 'financial-tools') {
    calculateEMI();
    calculateCompoundInterest();
    calculateROI();
    calculateGST();
    calculateTip();
  } else if (viewId === 'math-engineering') {
    convertRadix();
    calculateOhms();
  } else if (viewId === 'date-time-health') {
    calculateBMI();
    calculateAge();
  } else if (viewId === 'calculation-history') {
    renderFullHistoryList();
  }
}

// Backward-compatibility alias so any calls to openToolModal switch view inline instead of popping up a modal
function openToolModal(toolId) {
  switchView(toolId);
}

function closeToolModal() {
  switchView('dashboard');
}

// --- QUICK DASHBOARD WIDGET LOGIC ---

// Quick Calc
function quickCalcInput(digit) {
  if (quickCalcVal === '0' || quickCalcVal === '1,475.00') {
    quickCalcVal = digit;
  } else {
    if (digit === '.' && quickCalcVal.includes('.')) return;
    quickCalcVal += digit;
  }
  updateQuickCalcDisplay();
}

function quickCalcOp(op) {
  quickCalcExpr += ` ${quickCalcVal} ${op}`;
  quickCalcVal = '0';
  updateQuickCalcDisplay();
}

function quickCalcClear() {
  quickCalcExpr = '';
  quickCalcVal = '0';
  updateQuickCalcDisplay();
}

function quickCalcEval() {
  try {
    const raw = (quickCalcExpr + ' ' + quickCalcVal).replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').trim();
    if (!raw) return;
    const res = Function(`'use strict'; return (${raw})`)();
    quickCalcVal = Number.isInteger(res) ? res.toLocaleString() : parseFloat(res.toFixed(2)).toLocaleString();
    quickCalcExpr = '';
  } catch (e) {
    quickCalcVal = 'Error';
  }
  updateQuickCalcDisplay();
}

function updateQuickCalcDisplay() {
  const vEl = document.getElementById('quick-calc-val');
  const eEl = document.getElementById('quick-calc-expr');
  if (vEl) vEl.innerText = quickCalcVal;
  if (eEl) eEl.innerText = quickCalcExpr || '0';
}

// Quick FX
function runQuickFX() {
  const amtInp = document.getElementById('quick-fx-amount');
  const fromSel = document.getElementById('quick-fx-from');
  const toSel = document.getElementById('quick-fx-to');
  const outInp = document.getElementById('quick-fx-output');
  const lblEl = document.getElementById('quick-fx-rate-lbl');

  if (!amtInp || !fromSel || !toSel || !outInp) return;

  const amt = parseFloat(amtInp.value) || 0;
  const from = fromSel.value;
  const to = toSel.value;

  const rates = Object.keys(realTimeRates).length ? realTimeRates : FALLBACK_RATES;
  const rFrom = rates[from] || 1;
  const rTo = rates[to] || 1;

  const converted = (amt / rFrom) * rTo;
  const unitRate = (1 / rFrom) * rTo;

  outInp.value = converted.toFixed(2);
  if (lblEl) lblEl.innerText = `1 ${from} = ${unitRate.toFixed(4)} ${to}`;
}

function swapQuickFX() {
  const fromSel = document.getElementById('quick-fx-from');
  const toSel = document.getElementById('quick-fx-to');
  if (fromSel && toSel) {
    const tmp = fromSel.value;
    fromSel.value = toSel.value;
    toSel.value = tmp;
    runQuickFX();
  }
}

// Quick Tip
function runQuickTip() {
  const amtInp = document.getElementById('quick-tip-amount');
  const totalEl = document.getElementById('quick-tip-total');
  const tipEl = document.getElementById('quick-tip-val');

  if (!amtInp) return;

  const bill = parseFloat(amtInp.value) || 0;
  const tipAmt = bill * (quickTipPct / 100);
  const total = bill + tipAmt;

  if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
  if (tipEl) tipEl.innerText = `+$${tipAmt.toFixed(2)}`;
}

function setQuickTipPct(pct) {
  quickTipPct = pct;
  runQuickTip();
}

// Quick Length
function runQuickLength() {
  const valInp = document.getElementById('quick-len-val');
  const resEl = document.getElementById('quick-len-res');

  if (!valInp || !resEl) return;

  const km = parseFloat(valInp.value) || 0;
  const miles = km * 0.621371;

  resEl.innerText = miles.toFixed(4);
}

// --- CATEGORY FILTERING & GLOBAL SEARCH ---
function filterEngineCategory(cat) {
  currentCategoryFilter = cat;

  // Update tabs visual state
  const tabs = ['all', 'calc', 'conv', 'fin', 'life', 'tech', 'math'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-cat-${t}`);
    if (btn) {
      if (t === cat) {
        btn.className = 'px-3.5 py-1.5 rounded-full bg-white text-purple-700 border border-purple-300 font-bold text-xs shadow-xs';
      } else {
        btn.className = 'px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-all';
      }
    }
  });

  applyFilters();
}

function handleGlobalSearch(query) {
  const searchInpHero = document.getElementById('hero-search-input');
  const searchInpTop = document.getElementById('global-top-search');

  if (searchInpHero && searchInpHero.value !== query) searchInpHero.value = query;
  if (searchInpTop && searchInpTop.value !== query) searchInpTop.value = query;

  applyFilters(query);
}

function filterByTag(tag) {
  handleGlobalSearch(tag);
}

function applyFilters(queryOverride) {
  const query = (queryOverride !== undefined ? queryOverride : (document.getElementById('hero-search-input')?.value || '')).toLowerCase().trim();

  document.querySelectorAll('.engine-card').forEach(card => {
    const cardCat = card.getAttribute('data-category') || '';
    const cardTags = card.getAttribute('data-tags') || '';
    const textContent = card.innerText.toLowerCase();

    const matchesCategory = (currentCategoryFilter === 'all') || cardCat.includes(currentCategoryFilter);
    const matchesQuery = !query || textContent.includes(query) || cardTags.includes(query);

    if (matchesCategory && matchesQuery) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// --- REAL-TIME FOREX PROXY ENGINE ---
async function fetchRealtimeCurrencyRates(isManual = false) {
  const refreshIcon = document.getElementById('ticker-refresh-icon');
  if (refreshIcon) refreshIcon.classList.add('animate-spin');

  try {
    let res = await fetch('/api/currency-rates').catch(() => null);
    let data = res ? await res.json().catch(() => null) : null;

    if (!data || data.result !== 'success' || !data.rates) {
      res = await fetch('https://open.er-api.com/v6/latest/USD');
      data = await res.json();
    }

    if (data && data.rates) {
      realTimeRates = data.rates;
      lastRateFetchTime = new Date();
      updateTickerRates();
      runQuickFX();
    }
  } catch (e) {
    realTimeRates = { ...FALLBACK_RATES };
  } finally {
    if (refreshIcon) refreshIcon.classList.remove('animate-spin');
  }
}

function updateTickerRates() {
  const rates = Object.keys(realTimeRates).length ? realTimeRates : FALLBACK_RATES;
  const eur = rates['EUR'] || 0.9214;
  const gbp = rates['GBP'] || 0.7862;
  const inr = rates['INR'] || 83.45;
  const jpy = rates['JPY'] || 155.20;

  const eurEl = document.getElementById('ticker-usd-eur');
  const gbpEl = document.getElementById('ticker-usd-gbp');
  const inrEl = document.getElementById('ticker-usd-inr');
  const jpyEl = document.getElementById('ticker-usd-jpy');

  if (eurEl) eurEl.innerText = eur.toFixed(4);
  if (gbpEl) gbpEl.innerText = gbp.toFixed(4);
  if (inrEl) inrEl.innerText = inr.toFixed(2);
  if (jpyEl) jpyEl.innerText = jpy.toFixed(2);
}

// --- CORE CALCULATOR LOGIC ---
function calcInputDigit(digit) {
  if (calcDisplayVal === '0' || calcDisplayVal === '1,475.00') {
    calcDisplayVal = digit;
  } else {
    if (digit === '.' && calcDisplayVal.includes('.')) return;
    calcDisplayVal += digit;
  }
  updateCalcDisplay();
}

function calcInputOp(op) {
  calcExpression += ` ${calcDisplayVal} ${op}`;
  calcDisplayVal = '0';
  updateCalcDisplay();
}

function calcInputFunc(func) {
  if (func === '^2') {
    calcDisplayVal = String(Math.pow(parseFloat(calcDisplayVal) || 0, 2));
  } else {
    calcExpression += ` ${func}`;
  }
  updateCalcDisplay();
}

function calcInputConst(constant) {
  if (constant === 'π') calcDisplayVal = String(Math.PI);
  if (constant === 'e') calcDisplayVal = String(Math.E);
  updateCalcDisplay();
}

function calcClearAll() {
  calcExpression = '';
  calcDisplayVal = '0';
  updateCalcDisplay();
}

function calcBackspace() {
  if (calcDisplayVal.length > 1) {
    calcDisplayVal = calcDisplayVal.slice(0, -1);
  } else {
    calcDisplayVal = '0';
  }
  updateCalcDisplay();
}

function calcMemory(action) {
  const current = parseFloat(calcDisplayVal.replace(/,/g, '')) || 0;
  const dot = document.getElementById('calc-mem-dot');

  if (action === 'MC') {
    calcMemoryVal = 0;
    if (dot) dot.classList.add('hidden');
  } else if (action === 'MR') {
    calcDisplayVal = String(calcMemoryVal);
    updateCalcDisplay();
  } else if (action === 'M+') {
    calcMemoryVal += current;
    if (dot) dot.classList.remove('hidden');
  } else if (action === 'M-') {
    calcMemoryVal -= current;
    if (dot) dot.classList.remove('hidden');
  }
}

function calcEvaluate() {
  const rawExpr = calcExpression + ' ' + calcDisplayVal;
  const fullExpr = rawExpr.trim();
  if (!fullExpr) return;

  try {
    let expr = fullExpr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/,/g, '')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/sin\(/g, calcAngleMode === 'DEG' ? 'Math.sin((Math.PI/180)*' : 'Math.sin(')
      .replace(/cos\(/g, calcAngleMode === 'DEG' ? 'Math.cos((Math.PI/180)*' : 'Math.cos(')
      .replace(/tan\(/g, calcAngleMode === 'DEG' ? 'Math.tan((Math.PI/180)*' : 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/\^/g, '**');

    const result = Function(`'use strict'; return (${expr})`)();

    if (isNaN(result) || !isFinite(result)) {
      calcDisplayVal = 'Error';
    } else {
      const formatted = Number.isInteger(result) ? result.toLocaleString() : parseFloat(result.toFixed(6)).toLocaleString();
      
      addHistoryItem({
        id: Date.now(),
        timeAgo: 'Just now',
        expression: fullExpr,
        result: formatted
      });

      calcDisplayVal = formatted;
      calcExpression = '';
    }
  } catch (err) {
    calcDisplayVal = 'Syntax Error';
  }

  updateCalcDisplay();
}

function updateCalcDisplay() {
  const dispEl = document.getElementById('display-val');
  const exprEl = document.getElementById('display-expr');

  if (dispEl) dispEl.innerText = calcDisplayVal;
  if (exprEl) exprEl.innerText = calcExpression || '0';
}

function copyCalcResult() {
  navigator.clipboard.writeText(calcDisplayVal);
}

// --- CURRENCY CONVERTER SEARCHABLE PICKERS ---
function toggleCurrencyPicker(type, event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById(`curr-${type}-dropdown`);
  const otherType = type === 'from' ? 'to' : 'from';
  const otherDropdown = document.getElementById(`curr-${otherType}-dropdown`);

  if (otherDropdown) otherDropdown.classList.add('hidden');

  if (dropdown) {
    const isHidden = dropdown.classList.contains('hidden');
    if (isHidden) {
      filterCustomCurrencyOptions(type, '');
      dropdown.classList.remove('hidden');
      const searchInp = document.getElementById(`search-${type}-curr`);
      if (searchInp) {
        searchInp.value = '';
        setTimeout(() => searchInp.focus(), 50);
      }
    } else {
      dropdown.classList.add('hidden');
    }
  }
}

function filterCustomCurrencyOptions(type, searchQuery) {
  const listEl = document.getElementById(`list-${type}-curr`);
  if (!listEl) return;

  const query = searchQuery.toLowerCase().trim();
  const currentVal = document.getElementById(`curr-select-${type}`)?.value || (type === 'from' ? 'USD' : 'EUR');

  const filtered = CURRENCY_LIST.filter(c => {
    return !query || 
      c.code.toLowerCase().includes(query) || 
      c.name.toLowerCase().includes(query) || 
      c.symbol.toLowerCase().includes(query) || 
      (c.country && c.country.toLowerCase().includes(query));
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="p-3 text-center text-xs text-slate-400">No currency found for "${searchQuery}"</div>`;
    return;
  }

  listEl.innerHTML = filtered.map(c => {
    const isSelected = c.code === currentVal;
    return `
      <div onclick="selectCustomCurrency('${type}', '${c.code}')" class="px-3 py-2 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors ${isSelected ? 'bg-purple-100 text-purple-900 font-bold' : 'hover:bg-slate-100 text-slate-700 font-medium'}">
        <div class="flex items-center gap-2 truncate">
          <span class="text-sm shrink-0">${c.flag}</span>
          <span class="font-extrabold shrink-0">${c.code}</span>
          <span class="truncate text-[11px] opacity-80">${c.name}</span>
        </div>
        <span class="font-mono text-[11px] font-bold text-slate-400 shrink-0 ml-2">${c.symbol}</span>
      </div>
    `;
  }).join('');
}

function selectCustomCurrency(type, code) {
  const hiddenInput = document.getElementById(`curr-select-${type}`);
  if (hiddenInput) hiddenInput.value = code;

  const currObj = CURRENCY_LIST.find(c => c.code === code) || CURRENCY_LIST[0];

  const flagBadge = document.getElementById(`curr-${type}-flag-badge`);
  const labelEl = document.getElementById(`curr-${type}-label`);
  const dropdown = document.getElementById(`curr-${type}-dropdown`);

  if (flagBadge) flagBadge.innerText = `${currObj.flag} ${currObj.code}`;
  if (labelEl) labelEl.innerText = `${currObj.name} (${currObj.symbol})`;
  if (dropdown) dropdown.classList.add('hidden');

  runCurrencyConversion();
}

function updateCurrencyBadges() {
  const fromVal = document.getElementById('curr-select-from')?.value || 'USD';
  const toVal = document.getElementById('curr-select-to')?.value || 'EUR';

  const fromObj = CURRENCY_LIST.find(c => c.code === fromVal) || CURRENCY_LIST[0];
  const toObj = CURRENCY_LIST.find(c => c.code === toVal) || CURRENCY_LIST[1];

  const fromBadge = document.getElementById('curr-from-flag-badge');
  const fromLabel = document.getElementById('curr-from-label');
  const toBadge = document.getElementById('curr-to-flag-badge');
  const toLabel = document.getElementById('curr-to-label');

  if (fromBadge) fromBadge.innerText = `${fromObj.flag} ${fromObj.code}`;
  if (fromLabel) fromLabel.innerText = `${fromObj.name} (${fromObj.symbol})`;
  if (toBadge) toBadge.innerText = `${toObj.flag} ${toObj.code}`;
  if (toLabel) toLabel.innerText = `${toObj.name} (${toObj.symbol})`;
}

function setCurrencyFrom(code) {
  selectCustomCurrency('from', code);
}

function setCurrencyTo(code) {
  selectCustomCurrency('to', code);
}

function populateCurrencyDropdowns() {
  updateCurrencyBadges();
  renderCurrencyQuickCards();
}

// Global click handler to close open currency picker dropdowns
document.addEventListener('click', (e) => {
  const fromWrapper = document.getElementById('curr-from-wrapper');
  const toWrapper = document.getElementById('curr-to-wrapper');

  if (fromWrapper && !fromWrapper.contains(e.target)) {
    document.getElementById('curr-from-dropdown')?.classList.add('hidden');
  }
  if (toWrapper && !toWrapper.contains(e.target)) {
    document.getElementById('curr-to-dropdown')?.classList.add('hidden');
  }
});

function runCurrencyConversion() {
  const amountInp = document.getElementById('curr-input-amount');
  const fromSel = document.getElementById('curr-select-from');
  const toSel = document.getElementById('curr-select-to');
  const outputInp = document.getElementById('curr-output-amount');
  const headlineEl = document.getElementById('curr-rate-headline');
  const inverseEl = document.getElementById('curr-rate-inverse');

  if (!amountInp || !fromSel || !toSel || !outputInp) return;

  updateCurrencyBadges();

  const amount = parseFloat(amountInp.value) || 0;
  const from = fromSel.value;
  const to = toSel.value;

  const rates = Object.keys(realTimeRates).length ? realTimeRates : FALLBACK_RATES;
  const rateFrom = rates[from] || 1;
  const rateTo = rates[to] || 1;

  const converted = (amount / rateFrom) * rateTo;
  const unitRate = (1 / rateFrom) * rateTo;
  const inverseUnitRate = (1 / rateTo) * rateFrom;

  const toCurr = CURRENCY_LIST.find(c => c.code === to) || { symbol: '' };
  outputInp.value = `${toCurr.symbol} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (headlineEl) headlineEl.innerText = `1 ${from} = ${unitRate.toFixed(4)} ${to}`;
  if (inverseEl) inverseEl.innerText = `1 ${to} = ${inverseUnitRate.toFixed(4)} ${from}`;
}

function swapCurrenciesMain() {
  const fromSel = document.getElementById('curr-select-from');
  const toSel = document.getElementById('curr-select-to');
  if (fromSel && toSel) {
    const tmp = fromSel.value;
    fromSel.value = toSel.value;
    toSel.value = tmp;
    updateCurrencyBadges();
    runCurrencyConversion();
  }
}

function renderCurrencyMatrix() {
  const tbody = document.getElementById('currency-matrix-body');
  if (!tbody) return;

  const popularPairs = [
    { from: 'USD', to: 'EUR' },
    { from: 'USD', to: 'GBP' },
    { from: 'USD', to: 'INR' },
    { from: 'USD', to: 'JPY' }
  ];

  const rates = Object.keys(realTimeRates).length ? realTimeRates : FALLBACK_RATES;

  tbody.innerHTML = popularPairs.map(p => {
    const rateFrom = rates[p.from] || 1;
    const rateTo = rates[p.to] || 1;
    const rate = (1 / rateFrom) * rateTo;
    const inverse = 1 / rate;

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-2.5 px-3 font-bold">${p.from} / ${p.to}</td>
        <td class="py-2.5 px-3 font-mono font-bold text-purple-700">1 ${p.from} = ${rate.toFixed(4)} ${p.to}</td>
        <td class="py-2.5 px-3 font-mono text-slate-500">1 ${p.to} = ${inverse.toFixed(4)} ${p.from}</td>
        <td class="py-2.5 px-3">
          <button onclick="selectPair('${p.from}', '${p.to}')" class="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold hover:bg-purple-600 hover:text-white transition-all text-[11px]">Convert</button>
        </td>
      </tr>
    `;
  }).join('');
}

function selectPair(from, to) {
  const fromSel = document.getElementById('curr-select-from');
  const toSel = document.getElementById('curr-select-to');
  if (fromSel && toSel) {
    fromSel.value = from;
    toSel.value = to;
    runCurrencyConversion();
  }
}

// --- UNIT CONVERTER TOOLS ---
const UNIT_DEFINITIONS = {
  length: {
    base: 'm',
    units: {
      m: { name: 'Meters (m)', factor: 1 },
      km: { name: 'Kilometers (km)', factor: 1000 },
      cm: { name: 'Centimeters (cm)', factor: 0.01 },
      mm: { name: 'Millimeters (mm)', factor: 0.001 },
      mi: { name: 'Miles (mi)', factor: 1609.344 },
      yd: { name: 'Yards (yd)', factor: 0.9144 },
      ft: { name: 'Feet (ft)', factor: 0.3048 },
      in: { name: 'Inches (in)', factor: 0.0254 }
    }
  },
  weight: {
    base: 'kg',
    units: {
      kg: { name: 'Kilograms (kg)', factor: 1 },
      g: { name: 'Grams (g)', factor: 0.001 },
      mg: { name: 'Milligrams (mg)', factor: 0.000001 },
      lb: { name: 'Pounds (lbs)', factor: 0.453592 },
      oz: { name: 'Ounces (oz)', factor: 0.0283495 },
      ton: { name: 'Metric Tons (t)', factor: 1000 }
    }
  },
  volume: {
    base: 'l',
    units: {
      l: { name: 'Liters (L)', factor: 1 },
      ml: { name: 'Milliliters (mL)', factor: 0.001 },
      gal: { name: 'US Gallons (gal)', factor: 3.78541 },
      qt: { name: 'US Quarts (qt)', factor: 0.946353 },
      pt: { name: 'US Pints (pt)', factor: 0.473176 },
      cup: { name: 'US Cups', factor: 0.24 }
    }
  },
  temp: { custom: true },
  speed: {
    base: 'kmh',
    units: {
      kmh: { name: 'Km / Hour (km/h)', factor: 1 },
      mph: { name: 'Miles / Hour (mph)', factor: 1.60934 },
      ms: { name: 'Meters / Sec (m/s)', factor: 3.6 },
      knot: { name: 'Knots (kt)', factor: 1.852 }
    }
  },
  data: {
    base: 'mb',
    units: {
      b: { name: 'Bytes (B)', factor: 1 / 1048576 },
      kb: { name: 'Kilobytes (KB)', factor: 1 / 1024 },
      mb: { name: 'Megabytes (MB)', factor: 1 },
      gb: { name: 'Gigabytes (GB)', factor: 1024 },
      tb: { name: 'Terabytes (TB)', factor: 1048576 }
    }
  },
  area: {
    base: 'sqm',
    units: {
      sqm: { name: 'Square Meters (m²)', factor: 1 },
      sqkm: { name: 'Square Km (km²)', factor: 1000000 },
      sqft: { name: 'Square Feet (ft²)', factor: 0.092903 },
      acre: { name: 'Acres', factor: 4046.86 },
      hectare: { name: 'Hectares', factor: 10000 }
    }
  }
};

let currentUnitCat = 'length';

function initUnitConverters() {
  setUnitCategory('length');
}

function setUnitCategory(catKey) {
  currentUnitCat = catKey;

  document.querySelectorAll('.unit-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-unit-cat') === catKey) {
      btn.className = 'unit-tab-btn px-3.5 py-1.5 rounded-full bg-purple-600 text-white font-bold text-xs';
    } else {
      btn.className = 'unit-tab-btn px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs';
    }
  });

  const fromSel = document.getElementById('unit-select-from');
  const toSel = document.getElementById('unit-select-to');
  if (!fromSel || !toSel) return;

  fromSel.innerHTML = '';
  toSel.innerHTML = '';

  if (catKey === 'temp') {
    fromSel.appendChild(new Option('Celsius (°C)', 'c'));
    fromSel.appendChild(new Option('Fahrenheit (°F)', 'f'));
    fromSel.appendChild(new Option('Kelvin (K)', 'k'));
    toSel.appendChild(new Option('Celsius (°C)', 'c'));
    toSel.appendChild(new Option('Fahrenheit (°F)', 'f'));
    toSel.appendChild(new Option('Kelvin (K)', 'k'));
    fromSel.value = 'c';
    toSel.value = 'f';
  } else {
    const def = UNIT_DEFINITIONS[catKey] || UNIT_DEFINITIONS.length;
    Object.keys(def.units).forEach(k => {
      fromSel.appendChild(new Option(def.units[k].name, k));
      toSel.appendChild(new Option(def.units[k].name, k));
    });
    const keys = Object.keys(def.units);
    fromSel.value = keys[0];
    toSel.value = keys[1] || keys[0];
  }

  runUnitConversion();
}

function runUnitConversion() {
  const valInp = document.getElementById('unit-input-value');
  const fromSel = document.getElementById('unit-select-from');
  const toSel = document.getElementById('unit-select-to');
  const outInp = document.getElementById('unit-output-value');

  if (!valInp || !fromSel || !toSel || !outInp) return;

  const val = parseFloat(valInp.value) || 0;
  const from = fromSel.value;
  const to = toSel.value;

  let result = val;
  if (currentUnitCat === 'temp') {
    if (from === to) result = val;
    else if (from === 'c' && to === 'f') result = (val * 9/5) + 32;
    else if (from === 'f' && to === 'c') result = (val - 32) * 5/9;
    else if (from === 'c' && to === 'k') result = val + 273.15;
    else if (from === 'k' && to === 'c') result = val - 273.15;
    else if (from === 'f' && to === 'k') result = ((val - 32) * 5/9) + 273.15;
    else if (from === 'k' && to === 'f') result = ((val - 273.15) * 9/5) + 32;
  } else {
    const def = UNIT_DEFINITIONS[currentUnitCat] || UNIT_DEFINITIONS.length;
    const uFrom = def.units[from];
    const uTo = def.units[to];
    if (uFrom && uTo) {
      result = (val * uFrom.factor) / uTo.factor;
    }
  }

  outInp.value = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(6)).toString();
  renderUnitMatrix(val, from);
}

function swapUnits() {
  const fromSel = document.getElementById('unit-select-from');
  const toSel = document.getElementById('unit-select-to');
  if (fromSel && toSel) {
    const tmp = fromSel.value;
    fromSel.value = toSel.value;
    toSel.value = tmp;
    runUnitConversion();
  }
}

function renderUnitMatrix(val, fromKey) {
  const grid = document.getElementById('unit-matrix-grid');
  if (!grid) return;

  if (currentUnitCat === 'temp') {
    let c = val, f = val, k = val;
    if (fromKey === 'c') { f = (val * 9/5) + 32; k = val + 273.15; }
    else if (fromKey === 'f') { c = (val - 32) * 5/9; k = c + 273.15; }
    else if (fromKey === 'k') { c = val - 273.15; f = (c * 9/5) + 32; }

    grid.innerHTML = `
      <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
        <span class="text-slate-400 text-[9px] block uppercase font-bold">Celsius</span>
        <div class="font-bold text-xs text-purple-700">${c.toFixed(2)} °C</div>
      </div>
      <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
        <span class="text-slate-400 text-[9px] block uppercase font-bold">Fahrenheit</span>
        <div class="font-bold text-xs text-purple-700">${f.toFixed(2)} °F</div>
      </div>
      <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
        <span class="text-slate-400 text-[9px] block uppercase font-bold">Kelvin</span>
        <div class="font-bold text-xs text-purple-700">${k.toFixed(2)} K</div>
      </div>
    `;
    return;
  }

  const def = UNIT_DEFINITIONS[currentUnitCat];
  if (!def || !def.units) return;

  const uFrom = def.units[fromKey];
  if (!uFrom) return;

  const baseVal = val * uFrom.factor;

  grid.innerHTML = Object.keys(def.units).map(uKey => {
    const u = def.units[uKey];
    const converted = baseVal / u.factor;
    const formatted = Number.isInteger(converted) ? converted.toString() : parseFloat(converted.toFixed(4)).toString();

    return `
      <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
        <span class="text-slate-400 text-[9px] truncate block font-bold uppercase">${u.name}</span>
        <div class="font-bold text-xs text-purple-700 truncate">${formatted}</div>
      </div>
    `;
  }).join('');
}

// --- FINANCIAL CALCULATORS ENGINE ---
function setFinTool(toolKey) {
  document.querySelectorAll('.fin-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-fin-tool') === toolKey) {
      btn.className = 'fin-tab-btn px-3.5 py-1.5 rounded-full bg-purple-600 text-white font-bold text-xs';
    } else {
      btn.className = 'fin-tab-btn px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs';
    }
  });

  document.querySelectorAll('.fin-tool-box').forEach(box => box.classList.add('hidden'));
  const target = document.getElementById(`fin-box-${toolKey}`);
  if (target) target.classList.remove('hidden');
}

function calculateEMI() {
  const p = parseFloat(document.getElementById('inp-emi-amount')?.value) || 100000;
  const annualRate = parseFloat(document.getElementById('inp-emi-rate')?.value) || 8.5;
  const tenureYears = parseFloat(document.getElementById('inp-emi-tenure')?.value) || 15;

  const r = annualRate / (12 * 100);
  const n = tenureYears * 12;

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  const mEl = document.getElementById('res-emi-monthly');
  const iEl = document.getElementById('res-emi-interest');

  if (mEl) mEl.innerText = `$${emi.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (iEl) iEl.innerText = `$${Math.round(totalInterest).toLocaleString()}`;
}

function calculateCompoundInterest() {
  const p = parseFloat(document.getElementById('inp-ci-principal')?.value) || 10000;
  const r = (parseFloat(document.getElementById('inp-ci-rate')?.value) || 7) / 100;
  const t = parseFloat(document.getElementById('inp-ci-years')?.value) || 10;

  const total = p * Math.pow(1 + r, t);
  const interest = total - p;

  const tEl = document.getElementById('res-ci-total');
  const iEl = document.getElementById('res-ci-interest');

  if (tEl) tEl.innerText = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (iEl) iEl.innerText = `$${interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function calculateROI() {
  const initial = parseFloat(document.getElementById('inp-roi-initial')?.value) || 5000;
  const finalVal = parseFloat(document.getElementById('inp-roi-final')?.value) || 8500;
  const years = parseFloat(document.getElementById('inp-roi-years')?.value) || 3;

  const roi = ((finalVal - initial) / initial) * 100;
  const cagr = (Math.pow(finalVal / initial, 1 / years) - 1) * 100;

  const rEl = document.getElementById('res-roi-pct');
  const cEl = document.getElementById('res-roi-cagr');

  if (rEl) rEl.innerText = `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`;
  if (cEl) cEl.innerText = `${cagr.toFixed(2)}%`;
}

function calculateGST() {
  const price = parseFloat(document.getElementById('inp-gst-price')?.value) || 500;
  const rate = parseFloat(document.getElementById('inp-gst-rate')?.value) || 18;

  const tax = price * (rate / 100);
  const total = price + tax;

  const tEl = document.getElementById('res-gst-tax');
  const gEl = document.getElementById('res-gst-total');

  if (tEl) tEl.innerText = `$${tax.toFixed(2)}`;
  if (gEl) gEl.innerText = `$${total.toFixed(2)}`;
}

function calculateTip() {
  const bill = parseFloat(document.getElementById('inp-tip-bill')?.value) || 120;
  const tipPct = parseFloat(document.getElementById('inp-tip-pct')?.value) || 15;
  const people = parseInt(document.getElementById('inp-tip-people')?.value) || 3;

  const totalTip = bill * (tipPct / 100);
  const tipPerPerson = totalTip / Math.max(1, people);
  const totalPerPerson = (bill + totalTip) / Math.max(1, people);

  const pEl = document.getElementById('res-tip-person');
  const tEl = document.getElementById('res-tip-total-person');

  if (pEl) pEl.innerText = `$${tipPerPerson.toFixed(2)}`;
  if (tEl) tEl.innerText = `$${totalPerPerson.toFixed(2)}`;
}

// --- MATH & ENGINEERING TOOLS ---
function convertRadix() {
  const decInp = document.getElementById('inp-radix-dec');
  if (!decInp) return;
  const num = parseInt(decInp.value) || 0;

  const hexEl = document.getElementById('res-radix-hex');
  const binEl = document.getElementById('res-radix-bin');
  const octEl = document.getElementById('res-radix-oct');

  if (hexEl) hexEl.innerText = num.toString(16).toUpperCase();
  if (binEl) binEl.innerText = num.toString(2);
  if (octEl) octEl.innerText = num.toString(8);
}

function calculateOhms() {
  const v = parseFloat(document.getElementById('inp-ohms-v')?.value) || 12;
  const r = parseFloat(document.getElementById('inp-ohms-r')?.value) || 4;

  const i = v / Math.max(0.001, r);
  const p = v * i;

  const iEl = document.getElementById('res-ohms-i');
  const pEl = document.getElementById('res-ohms-p');

  if (iEl) iEl.innerText = `${i.toFixed(2)} Amps`;
  if (pEl) pEl.innerText = `${p.toFixed(2)} Watts`;
}

// --- HEALTH & DATE UTILITIES ---
function calculateBMI() {
  const weight = parseFloat(document.getElementById('inp-bmi-weight')?.value) || 70;
  const heightCm = parseFloat(document.getElementById('inp-bmi-height')?.value) || 175;
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);

  const scoreEl = document.getElementById('res-bmi-score');
  const statusEl = document.getElementById('res-bmi-status');

  if (scoreEl) scoreEl.innerText = bmi.toFixed(1);
  if (statusEl) {
    if (bmi < 18.5) {
      statusEl.innerText = 'Underweight';
      statusEl.className = 'px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold';
    } else if (bmi < 25) {
      statusEl.innerText = 'Normal Weight';
      statusEl.className = 'px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold';
    } else if (bmi < 30) {
      statusEl.innerText = 'Overweight';
      statusEl.className = 'px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold';
    } else {
      statusEl.innerText = 'Obese';
      statusEl.className = 'px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold';
    }
  }
}

function calculateAge() {
  const dobVal = document.getElementById('inp-age-dob')?.value;
  if (!dobVal) return;
  const dob = new Date(dobVal);
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();
  if (days < 0) { months--; days += 30; }
  if (months < 0) { years--; months += 12; }

  const outEl = document.getElementById('res-age-output');
  if (outEl) outEl.innerText = `${years} Years, ${months} Months, ${days} Days`;
}

// --- HISTORY LEDGER ---
function getHistory() {
  return JSON.parse(localStorage.getItem('calcx_history') || JSON.stringify(INITIAL_HISTORY));
}

function addHistoryItem(item) {
  const history = getHistory();
  history.unshift(item);
  if (history.length > 50) history.pop();
  localStorage.setItem('calcx_history', JSON.stringify(history));
  renderFullHistoryList();
}

function clearCalcHistory() {
  localStorage.setItem('calcx_history', JSON.stringify([]));
  renderFullHistoryList();
}

function exportHistoryCSV() {
  const history = getHistory();
  const csv = 'Time,Expression,Result\n' + history.map(h => `"${h.timeAgo}","${h.expression}","${h.result}"`).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'calx_history.csv';
  a.click();
}

function renderFullHistoryList() {
  const history = getHistory();
  const countBadge = document.getElementById('sidebar-history-count');
  if (countBadge) countBadge.innerText = history.length;

  const container = document.getElementById('modal-full-history-list');
  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = `<div class="text-center py-6 text-slate-400 font-medium text-xs">No recent calculations recorded.</div>`;
    return;
  }

  container.innerHTML = history.map(h => `
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
      <div>
        <div class="text-[9px] font-bold text-slate-400 uppercase">${h.timeAgo}</div>
        <div class="font-bold text-slate-800">${h.expression}</div>
      </div>
      <div class="font-extrabold text-sm text-purple-700">= ${h.result}</div>
    </div>
  `).join('');
}

// --- SEARCH MODAL & SHORTCUTS MODAL ---
function openSearchModal() {
  const modal = document.getElementById('search-modal');
  const input = document.getElementById('search-modal-input');
  if (modal && input) {
    modal.classList.remove('hidden');
    input.value = '';
    input.focus();
    onSearchModalQuery();
  }
}

function closeSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) modal.classList.add('hidden');
}

function onSearchModalQuery() {
  const query = (document.getElementById('search-modal-input')?.value || '').toLowerCase().trim();
  const resultsContainer = document.getElementById('search-modal-results');
  if (!resultsContainer) return;

  const tools = [
    { title: 'Standard Calculator', icon: 'calculate', path: 'calculator', category: 'Arithmetic' },
    { title: 'Scientific Calculator', icon: 'functions', path: 'calculator', category: 'Fog Math' },
    { title: 'Unit Converter', icon: 'sync_alt', path: 'unit-converters', category: 'Universal' },
    { title: 'Real-Time Currency Converter', icon: 'currency_exchange', path: 'currency-converter', category: 'Real Time FX' },
    { title: 'Temperature Converter', icon: 'thermostat', path: 'unit-converters', category: 'Thermal' },
    { title: 'Percentage Calculator', icon: 'percent', path: 'financial-tools', category: 'Everyday' },
    { title: 'Discount & Tax Calculator', icon: 'sell', path: 'financial-tools', category: 'Commerce' },
    { title: 'EMI & Loan Calculator', icon: 'account_balance', path: 'financial-tools', category: 'Credit Engine' },
    { title: 'Compound Interest Engine', icon: 'trending_up', path: 'financial-tools', category: 'Growth' },
    { title: 'Age & Milestone Engine', icon: 'cake', path: 'date-time-health', category: 'Time & Life' },
    { title: 'Number Base Converter', icon: 'developer_board', path: 'math-engineering', category: 'Tech & Bits' },
    { title: 'Ohm\'s Law & Power', icon: 'electric_bolt', path: 'math-engineering', category: 'Physics' }
  ];

  const filtered = query ? tools.filter(t => t.title.toLowerCase().includes(query) || t.category.toLowerCase().includes(query)) : tools;

  resultsContainer.innerHTML = filtered.map(t => `
    <div onclick="openToolModal('${t.path}'); closeSearchModal();" class="p-2.5 rounded-xl hover:bg-purple-50 flex items-center justify-between cursor-pointer border border-transparent hover:border-purple-200 transition-all">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-purple-600 text-[18px]">${t.icon}</span>
        <div>
          <div class="font-bold text-xs text-slate-900">${t.title}</div>
          <div class="text-[9px] text-slate-400 font-bold uppercase">${t.category}</div>
        </div>
      </div>
      <span class="material-symbols-outlined text-[16px] text-purple-600">arrow_forward</span>
    </div>
  `).join('');
}

function openShortcutsModal() {
  const modal = document.getElementById('shortcuts-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeShortcutsModal() {
  const modal = document.getElementById('shortcuts-modal');
  if (modal) modal.classList.add('hidden');
}

// --- PHYSICAL KEYBOARD SHORTCUTS ---
function setupKeyboardListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearchModal();
      closeShortcutsModal();
      closeToolModal();
      calcClearAll();
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
      return;
    }

    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === '/') {
      e.preventDefault();
      openSearchModal();
      return;
    }

    if (e.key === '?') {
      openShortcutsModal();
      return;
    }
  });
}
