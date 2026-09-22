(() => {
  const STORAGE_KEY = 'raseed-finance-v1';
  const CURRENCIES = { SAR: 'ر.س', YER: 'ر.ي', USD: '$' };
  const CURRENCY_NAMES = { SAR: 'ريال سعودي', YER: 'ريال يمني', USD: 'دولار أمريكي' };
  const TYPE_NAMES = { income: 'دخل', expense: 'مصروف', transfer: 'تحويل', lend: 'إقراض', borrow: 'اقتراض', debt_collection: 'تحصيل دين', debt_payment: 'سداد دين' };
  const TYPE_SIGNS = { income: '+', expense: '−', transfer: '↔', lend: '−', borrow: '+', debt_collection: '+', debt_payment: '−' };
  const PAGE_NAMES = { dashboard: 'لوحة التحكم', transactions: 'العمليات', accounts: 'حساباتي', debts: 'الديون والالتزامات', reports: 'التقارير والكشوف' };
  const ICONS = {
    grid: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="1.7"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.7"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.7"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.7"/></svg>',
    swap: '<svg viewBox="0 0 24 24"><path d="M7 7h13l-3-3M17 17H4l3 3"/><path d="M20 7l-3 3M4 17l3-3"/></svg>',
    wallet: '<svg viewBox="0 0 24 24"><path d="M4 6.5h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5Z"/><path d="M3.5 7 16 4.5a2 2 0 0 1 2.4 1.6M15 12h6"/><circle cx="16" cy="12" r=".7"/></svg>',
    people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.8 20c.4-3.2 2.8-5 6.2-5s5.8 1.8 6.2 5M16 4.8a3.5 3.5 0 0 1 0 6.5M17 15c2.5.6 3.8 2.1 4.1 5"/></svg>',
    chart: '<svg viewBox="0 0 24 24"><path d="M4 19.5h16M6 16V9M11 16V5M16 16v-4M21 16V7"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3 20 6v5.5c0 4.4-3 7.7-8 9.5-5-1.8-8-5.1-8-9.5V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.3 4.3"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 10h17"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M12 4v15m-6-6 6 6 6-6"/></svg>',
    up: '<svg viewBox="0 0 24 24"><path d="M12 20V5m-6 6 6-6 6 6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    download: '<svg viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/></svg>',
    plusCircle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
    file: '<svg viewBox="0 0 24 24"><path d="M6 3.5h8l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"/><path d="M14 3.5v5h5M8 13h8M8 16.5h8"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
    card: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></svg>'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = (value, currency, decimals = 0) => `${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}<small>${CURRENCIES[currency] || currency}</small>`;
  const nfmt = (value, decimals = 0) => Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const toISO = date => {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
  };
  const monthKey = date => String(date || '').slice(0, 7);
  const prettyDate = date => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
  };
  const monthName = month => {
    const d = new Date(`${month}-15T12:00:00`);
    return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { month: 'long', year: 'numeric' }).format(d);
  };
  const safeNumber = raw => {
    const value = Number(String(raw || '').replace(/,/g, '').trim());
    return Number.isFinite(value) ? value : 0;
  };

  function demoState() {
    const accounts = [
      { id: 'a-sar-bank', name: 'مصرف الإنماء', provider: 'alinma', kind: 'bank', currency: 'SAR', openingBalance: 13850 },
      { id: 'a-sar-cash', name: 'نقدي — ريال سعودي', provider: 'cash', kind: 'cash', currency: 'SAR', openingBalance: 2350 },
      { id: 'a-yer-kuraimi', name: 'بنك الكريمي', provider: 'kuraimi', kind: 'bank', currency: 'YER', openingBalance: 1340000 },
      { id: 'a-yer-qutaibi', name: 'بنك القطيبي', provider: 'qutaibi', kind: 'bank', currency: 'YER', openingBalance: 460000 },
      { id: 'a-yer-jib', name: 'محفظة جيب', provider: 'jib', kind: 'wallet', currency: 'YER', openingBalance: 282000 },
      { id: 'a-yer-cash', name: 'نقدي — ريال يمني', provider: 'cash', kind: 'cash', currency: 'YER', openingBalance: 98000 },
      { id: 'a-usd-cash', name: 'نقدي — دولار', provider: 'cash', kind: 'cash', currency: 'USD', openingBalance: 540 }
    ];
    const t = (id, daysAgo, kind, amount, currency, accountId, title, category, extra = {}) => ({ id, date: toISO(Date.now() - daysAgo * 86400000), kind, amount, currency, accountId, title, category, note: '', ...extra });
    const transactions = [
      t('t1', 0, 'income', 3500, 'SAR', 'a-sar-bank', 'دفعة تصميم هوية بصرية', 'عمل حر', { party: 'شركة مسارات' }),
      t('t2', 1, 'income', 1200, 'USD', 'a-usd-cash', 'تصميم حملة إعلانية', 'عمل حر', { party: 'عميل مستقل' }),
      t('t3', 2, 'expense', 275, 'SAR', 'a-sar-cash', 'مستلزمات العمل', 'تشغيل'),
      t('t4', 3, 'expense', 65000, 'YER', 'a-yer-kuraimi', 'فاتورة إنترنت وكهرباء', 'فواتير'),
      t('t5', 5, 'income', 50000, 'YER', 'a-yer-qutaibi', 'دفعة مشروع محتوى', 'عمل حر'),
      t('t6', 7, 'expense', 430, 'SAR', 'a-sar-bank', 'اشتراك برامج تصميم', 'اشتراكات'),
      t('t7', 9, 'expense', 22500, 'YER', 'a-yer-cash', 'مشتريات منزلية', 'شخصي'),
      t('t8', 11, 'income', 620, 'USD', 'a-usd-cash', 'دفعة تصميم سوشال ميديا', 'عمل حر'),
      t('t9', 13, 'expense', 18500, 'YER', 'a-yer-jib', 'تنقلات ومشاوير', 'تنقل'),
      t('t10', 16, 'income', 2800, 'SAR', 'a-sar-bank', 'تصميم منشورات شهرية', 'عمل حر'),
      t('t11', 19, 'expense', 110, 'SAR', 'a-sar-cash', 'قهوة واجتماع عميل', 'ضيافة'),
      t('t12', 23, 'expense', 32000, 'YER', 'a-yer-kuraimi', 'مستلزمات منزلية', 'شخصي'),
      t('t13', 34, 'income', 2600, 'SAR', 'a-sar-bank', 'دفعة مشروع متجر إلكتروني', 'عمل حر'),
      t('t14', 38, 'expense', 570, 'SAR', 'a-sar-bank', 'اشتراكات وأدوات', 'اشتراكات'),
      t('t15', 44, 'income', 720, 'USD', 'a-usd-cash', 'تصميم واجهة متجر', 'عمل حر'),
      t('t16', 52, 'expense', 40000, 'YER', 'a-yer-kuraimi', 'مصروفات شهرية', 'شخصي'),
      t('t17', 64, 'income', 3100, 'SAR', 'a-sar-bank', 'دفعة هوية تجارية', 'عمل حر'),
      t('t18', 73, 'expense', 380, 'SAR', 'a-sar-cash', 'أدوات مكتبية', 'تشغيل'),
      t('t19', 88, 'income', 49000, 'YER', 'a-yer-qutaibi', 'دفعة تصميمات رقمية', 'عمل حر'),
      t('t20', 95, 'expense', 27000, 'YER', 'a-yer-jib', 'مشتريات متنوعة', 'شخصي'),
      t('t21', 111, 'income', 530, 'USD', 'a-usd-cash', 'تصميم إعلان رقمي', 'عمل حر'),
      t('t22', 123, 'expense', 245, 'SAR', 'a-sar-bank', 'خدمات وأدوات', 'تشغيل')
    ];
    const debts = [
      { id: 'd1', direction: 'receivable', person: 'مؤسسة نقطة ضوء', description: 'دفعة متبقية من مشروع الهوية', currency: 'SAR', original: 3200, remaining: 1800, dueDate: toISO(Date.now() + 9 * 86400000), createdAt: toISO(Date.now() - 35 * 86400000) },
      { id: 'd2', direction: 'receivable', person: 'أحمد العريقي', description: 'سلفة شخصية', currency: 'YER', original: 180000, remaining: 120000, dueDate: toISO(Date.now() + 15 * 86400000), createdAt: toISO(Date.now() - 21 * 86400000) },
      { id: 'd3', direction: 'payable', person: 'سارة محمد', description: 'مبلغ مستحق لمشتريات مشتركة', currency: 'SAR', original: 950, remaining: 450, dueDate: toISO(Date.now() - 2 * 86400000), createdAt: toISO(Date.now() - 18 * 86400000) },
      { id: 'd4', direction: 'receivable', person: 'عميل تصميم', description: 'دفعة بالدولار — مرحلة ثانية', currency: 'USD', original: 800, remaining: 800, dueDate: toISO(Date.now() + 21 * 86400000), createdAt: toISO(Date.now() - 7 * 86400000) }
    ];
    return { version: 1, accounts, transactions, debts, currency: 'SAR', dashboardMonth: toISO(Date.now()).slice(0, 7), demo: true };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved?.version === 1 && Array.isArray(saved.accounts) && Array.isArray(saved.transactions)) return { ...demoState(), ...saved };
    } catch (error) { console.warn('Could not read saved ledger', error); }
    return demoState();
  }

  let state = loadState();
  let activePage = 'dashboard';
  let transactionFilters = { query: '', kind: 'all', currency: 'all', month: 'all' };
  let reportCurrency = 'SAR';

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { toast('تعذر حفظ البيانات. تحقق من مساحة التخزين في المتصفح.', 'error'); }
  }
  function accountById(id) { return state.accounts.find(account => account.id === id); }
  function accountBalance(id) {
    const account = accountById(id);
    if (!account) return 0;
    let balance = Number(account.openingBalance || 0);
    state.transactions.forEach(tx => {
      if (tx.kind === 'transfer') {
        if (tx.fromAccountId === id) balance -= tx.amount;
        if (tx.toAccountId === id) balance += tx.amount;
      } else if (tx.accountId === id) {
        if (['income', 'borrow', 'debt_collection'].includes(tx.kind)) balance += tx.amount;
        else if (['expense', 'lend', 'debt_payment'].includes(tx.kind)) balance -= tx.amount;
      }
    });
    return balance;
  }
  function sumAccounts(currency) { return state.accounts.filter(a => a.currency === currency).reduce((sum, a) => sum + accountBalance(a.id), 0); }
  function transactionSum(kind, currency, month = null) {
    return state.transactions.filter(tx => tx.kind === kind && tx.currency === currency && (!month || monthKey(tx.date) === month)).reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  }
  function currencyAccounts(currency) { return state.accounts.filter(a => a.currency === currency); }
  function icon(name) { return ICONS[name] || ''; }
  function accountSymbol(account) {
    if (!account) return '•';
    const providers = { kuraimi: 'ك', qutaibi: 'ق', qasimi: 'ق', jib: 'ج', cash: CURRENCIES[account.currency], alinma: 'إ', rajhi: 'ر', ahli: 'أ' };
    return providers[account.provider] || (account.kind === 'cash' ? CURRENCIES[account.currency] : account.name.slice(0, 1));
  }
  function accountClass(account) {
    if (!account) return '';
    if (account.kind === 'cash') return account.currency === 'USD' ? 'usd' : 'cash';
    if (account.kind === 'wallet') return 'wallet';
    if (account.currency === 'USD') return 'usd';
    return account.provider === 'qutaibi' || account.provider === 'qairimi' ? 'bank' : '';
  }
  function accountTypeLabel(account) {
    return ({ bank: 'حساب بنكي', wallet: 'محفظة إلكترونية', cash: 'نقدي' })[account.kind] || 'حساب';
  }
  function kindClass(kind) { return kind; }
  function amountClass(kind) { return ['income', 'borrow', 'debt_collection'].includes(kind) ? 'positive' : ['expense', 'lend', 'debt_payment'].includes(kind) ? 'negative' : 'neutral'; }
  function amountHTML(tx) { return `<span class="amount ${amountClass(tx.kind)}">${TYPE_SIGNS[tx.kind] || ''}${nfmt(tx.amount)} <span>${CURRENCIES[tx.currency]}</span></span>`; }
  function transactionAccountText(tx) {
    if (tx.kind === 'transfer') return `${accountById(tx.fromAccountId)?.name || 'حساب'} ← ${accountById(tx.toAccountId)?.name || 'حساب'}`;
    return accountById(tx.accountId)?.name || '—';
  }
  function getMonthOptions() {
    const options = [];
    const d = new Date();
    for (let i = 0; i < 7; i++) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1, 12);
      options.push(toISO(m).slice(0, 7));
    }
    return options;
  }
  function pageHead(title, subtitle, actions = '') {
    return `<div class="page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="heading-actions">${actions}</div></div>`;
  }
  function button(label, action, secondary = false, extra = '') {
    return `<button class="button ${secondary ? 'button-secondary' : 'button-primary'} ${extra}" data-action="${action}">${label}</button>`;
  }
  function metricCard(title, value, currency, kind, foot) {
    const icons = { income: 'up', expense: 'down', net: 'chart' };
    return `<article class="metric-card"><div class="metric-top"><span>${title}</span><span class="metric-icon ${kind}">${icon(icons[kind])}</span></div><div class="metric-value">${nfmt(value)} <small>${CURRENCIES[currency]}</small></div><div class="metric-foot">${foot}</div></article>`;
  }
  function chartPath(values, width, height, padding = 7) {
    const max = Math.max(...values, 1) * 1.15;
    const step = width / Math.max(values.length - 1, 1);
    return values.map((value, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)},${(height - padding - (value / max) * (height - padding * 2)).toFixed(1)}`).join(' ');
  }
  function renderChart(currency) {
    const months = getMonthOptions().slice(0, 6).reverse();
    const income = months.map(month => transactionSum('income', currency, month));
    const expenses = months.map(month => transactionSum('expense', currency, month));
    const all = [...income, ...expenses, 1];
    const max = Math.max(...all) * 1.15;
    const width = 620, height = 142, step = width / (months.length - 1);
    const pathFor = values => values.map((value, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)},${(height - 7 - (value / max) * (height - 15)).toFixed(1)}`).join(' ');
    const incomePath = pathFor(income), expensePath = pathFor(expenses);
    const area = `${incomePath} L${width},${height} L0,${height} Z`;
    const grid = [27, 62, 97, 132].map(y => `<line class="chart-grid-line" x1="0" y1="${y}" x2="${width}" y2="${y}"/>`).join('');
    return `<div class="chart-wrap"><svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="مخطط الدخل والمصروف خلال ستة أشهر"><defs><linearGradient id="incomeGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4ebd99" stop-opacity=".16"/><stop offset="1" stop-color="#4ebd99" stop-opacity="0"/></linearGradient></defs>${grid}<path class="chart-area" d="${area}"/><path class="chart-income" d="${incomePath}"/><path class="chart-expense" d="${expensePath}"/></svg></div><div class="chart-x-labels">${months.map(month => `<span>${new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { month: 'short' }).format(new Date(`${month}-15T12:00:00`))}</span>`).join('')}</div>`;
  }
  function miniAccountLines(currency) {
    const accounts = currencyAccounts(currency).slice(0, 4);
    if (!accounts.length) return `<div class="empty-state"><strong>لا توجد حسابات بهذه العملة</strong><p>أضف حسابًا لمتابعة رصيدك.</p></div>`;
    return accounts.map(account => `<div class="account-line"><span class="bank-icon ${accountClass(account)}">${escapeHTML(accountSymbol(account))}</span><div><div class="account-line-name">${escapeHTML(account.name)}</div><div class="account-line-type">${accountTypeLabel(account)}</div></div><div class="account-line-balance">${nfmt(accountBalance(account.id))}<small>${CURRENCIES[currency]}</small></div></div>`).join('');
  }
  function transactionSymbol(kind) { return `<span class="transaction-symbol ${kind}">${TYPE_SIGNS[kind] || '•'}</span>`; }
  function transactionRows(transactions, withActions = false) {
    const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || '').localeCompare(a.createdAt || ''));
    if (!sorted.length) return `<tr><td colspan="${withActions ? 6 : 5}" class="table-empty">لا توجد عمليات مطابقة. سجّل أول عملية لبدء ترتيب حساباتك.</td></tr>`;
    return sorted.map(tx => `<tr><td><div class="transaction-name">${transactionSymbol(tx.kind)}<div><div class="transaction-desc">${escapeHTML(tx.title || TYPE_NAMES[tx.kind])}</div><div class="transaction-sub">${escapeHTML(tx.category || TYPE_NAMES[tx.kind])}</div></div></div></td><td>${escapeHTML(tx.party || '—')}</td><td>${escapeHTML(transactionAccountText(tx))}</td><td>${prettyDate(tx.date)}</td><td>${amountHTML(tx)}</td>${withActions ? `<td><button class="table-action" aria-label="خيارات العملية" data-action="transaction-menu" data-id="${tx.id}">⋯</button></td>` : ''}</tr>`).join('');
  }
  function kindFilterOptions(selected = 'all') {
    return `<option value="all" ${selected === 'all' ? 'selected' : ''}>كل الأنواع</option>${['income', 'expense', 'transfer', 'lend', 'borrow', 'debt_collection', 'debt_payment'].map(kind => `<option value="${kind}" ${selected === kind ? 'selected' : ''}>${TYPE_NAMES[kind]}</option>`).join('')}`;
  }
  function currencyOptions(selected = 'SAR') { return Object.keys(CURRENCIES).map(currency => `<option value="${currency}" ${selected === currency ? 'selected' : ''}>${CURRENCY_NAMES[currency]} (${CURRENCIES[currency]})</option>`).join(''); }

  function renderDashboard() {
    const currency = state.currency;
    const month = state.dashboardMonth || toISO(Date.now()).slice(0, 7);
    const income = transactionSum('income', currency, month);
    const expenses = transactionSum('expense', currency, month);
    const net = income - expenses;
    const previous = new Date(`${month}-15T12:00:00`);
    previous.setMonth(previous.getMonth() - 1);
    const previousMonth = toISO(previous).slice(0, 7);
    const prevIncome = transactionSum('income', currency, previousMonth);
    const prevExpenses = transactionSum('expense', currency, previousMonth);
    const incomeDelta = prevIncome ? Math.round((income - prevIncome) / prevIncome * 100) : null;
    const expenseDelta = prevExpenses ? Math.round((expenses - prevExpenses) / prevExpenses * 100) : null;
    const months = getMonthOptions();
    const debtIn = state.debts.filter(d => d.direction === 'receivable' && d.currency === currency).reduce((s, d) => s + d.remaining, 0);
    const debtOut = state.debts.filter(d => d.direction === 'payable' && d.currency === currency).reduce((s, d) => s + d.remaining, 0);
    const currentTransactions = state.transactions.filter(tx => tx.currency === currency && monthKey(tx.date) === month);
    const recent = [...currentTransactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    return `${pageHead('مرحبًا خالد، هذه لمحتك المالية', 'تابع دخلك ومصروفاتك وأرصدتك في مكان واحد.', `${state.demo ? '<button class="button button-quiet button-sm" data-action="clear-demo">ابدأ ببياناتي</button>' : ''}<button class="button button-secondary" data-action="export-month">${icon('download')} تصدير كشف</button><button class="button button-primary" data-action="new-transaction">${icon('plus')} إضافة عملية</button>`)}
      <div class="summary-strip"><div class="currency-switch"><span>عرض ملخص العملة</span><div class="segmented" role="group" aria-label="اختيار العملة">${Object.keys(CURRENCIES).map(code => `<button class="segment ${currency === code ? 'active' : ''}" data-action="set-currency" data-currency="${code}">${code}</button>`).join('')}</div><select class="period-select" id="dashboardMonth" aria-label="اختيار الشهر">${months.map(m => `<option value="${m}" ${m === month ? 'selected' : ''}>${monthName(m)}</option>`).join('')}</select><span class="period-label">الأرصدة لا تُحوّل بين العملات</span></div><div></div></div>
      <div class="metric-grid">${metricCard('إجمالي الدخل', income, currency, 'income', `${incomeDelta === null ? '—' : `<span class="trend ${incomeDelta < 0 ? 'down' : ''}">${incomeDelta > 0 ? '+' : ''}${incomeDelta}%</span>`} <span>مقارنة بالشهر السابق</span>`)}${metricCard('إجمالي المصروفات', expenses, currency, 'expense', `${expenseDelta === null ? '—' : `<span class="trend ${expenseDelta > 0 ? 'down' : ''}">${expenseDelta > 0 ? '+' : ''}${expenseDelta}%</span>`} <span>مقارنة بالشهر السابق</span>`)}${metricCard('صافي التدفق النقدي', net, currency, 'net', `<span>${net >= 0 ? 'فائض هذا الشهر' : 'عجز هذا الشهر'}</span>`)}</div>
      <div class="overview-grid"><article class="card chart-card"><div class="card-header"><div><h2 class="card-title">الدخل والمصروفات</h2><div class="card-subtitle">ملخص آخر 6 أشهر · ${CURRENCY_NAMES[currency]}</div></div><div class="chart-legend"><span class="legend-key"><i></i> الدخل</span><span class="legend-key out"><i></i> المصروفات</span></div></div><div class="card-body">${renderChart(currency)}</div></article>
        <article class="card account-card"><div class="card-header"><div><h2 class="card-title">أرصدتي · ${currency}</h2><div class="card-subtitle">مجموع الحسابات بهذه العملة</div></div><button class="button button-quiet button-sm" data-page="accounts">كل الحسابات ${icon('arrow')}</button></div><div class="card-body"><div class="account-total-label">إجمالي الرصيد</div><div class="account-total">${nfmt(sumAccounts(currency))}<small>${CURRENCIES[currency]}</small></div><div class="account-subrow"><span>${currencyAccounts(currency).length} حسابات</span><span>محدّث الآن</span></div><div class="account-list">${miniAccountLines(currency)}</div></div></article></div>
      <div class="section-row"><h2>أحدث العمليات</h2><button data-page="transactions">عرض كل العمليات ${icon('arrow')}</button></div>
      <article class="card transaction-card"><table class="transaction-table"><thead><tr><th>العملية</th><th>الجهة</th><th>الحساب</th><th>التاريخ</th><th>المبلغ</th></tr></thead><tbody>${transactionRows(recent)}</tbody></table></article>
      <div class="lower-grid"><section><div class="section-row"><h2>الديون والالتزامات · ${currency}</h2><button data-page="debts">التفاصيل ${icon('arrow')}</button></div><article class="card"><div class="card-body" style="padding-top:15px"><div class="debt-summary"><div class="debt-box receivable"><span>مبالغ لي عند الآخرين</span><strong>${nfmt(debtIn)}<small>${CURRENCIES[currency]}</small></strong></div><div class="debt-box payable"><span>مبالغ عليّ للآخرين</span><strong>${nfmt(debtOut)}<small>${CURRENCIES[currency]}</small></strong></div></div></div></article></section>
        <section><div class="section-row"><h2>آخر التحديثات</h2></div><article class="card"><div class="card-body"><div class="activity-list">${recent.slice(0, 3).map(tx => `<div class="activity-item"><span class="activity-bullet ${tx.kind === 'expense' ? 'orange' : ''}"></span><div class="activity-copy"><strong>${escapeHTML(tx.title)}</strong><span>${prettyDate(tx.date)} · ${escapeHTML(tx.category || TYPE_NAMES[tx.kind])}</span></div><span class="activity-amount">${TYPE_SIGNS[tx.kind] || ''}${nfmt(tx.amount)} ${CURRENCIES[tx.currency]}</span></div>`).join('') || '<div class="empty-state"><p>لا توجد تحديثات لهذا الشهر.</p></div>'}</div></div></article></section></div>`;
  }

  function filteredTransactions() {
    const q = transactionFilters.query.trim().toLowerCase();
    return state.transactions.filter(tx => {
      const queryHit = !q || [tx.title, tx.category, tx.party, accountById(tx.accountId)?.name, accountById(tx.fromAccountId)?.name, accountById(tx.toAccountId)?.name].some(value => String(value || '').toLowerCase().includes(q));
      return queryHit && (transactionFilters.kind === 'all' || tx.kind === transactionFilters.kind) && (transactionFilters.currency === 'all' || tx.currency === transactionFilters.currency) && (transactionFilters.month === 'all' || monthKey(tx.date) === transactionFilters.month);
    });
  }
  function renderTransactions() {
    const list = filteredTransactions();
    const monthOptions = [...new Set(state.transactions.map(tx => monthKey(tx.date)))].sort().reverse();
    return `${pageHead('العمليات', 'سجّل معاملاتك اليومية واعثر على أي عملية بسرعة.', `<button class="button button-secondary" data-action="export-transactions">${icon('download')} تنزيل CSV</button><button class="button button-primary" data-action="new-transaction">${icon('plus')} إضافة عملية</button>`)}
      <div class="filter-bar"><input class="filter-search" id="transactionSearch" type="search" placeholder="ابحث باسم العملية أو الجهة أو الحساب..." value="${escapeHTML(transactionFilters.query)}"/><select class="filter-select" id="transactionKind">${kindFilterOptions(transactionFilters.kind)}</select><select class="filter-select" id="transactionCurrency"><option value="all">كل العملات</option>${currencyOptions(transactionFilters.currency)}</select><select class="filter-select" id="transactionMonth"><option value="all">كل الفترات</option>${monthOptions.map(month => `<option value="${month}" ${transactionFilters.month === month ? 'selected' : ''}>${monthName(month)}</option>`).join('')}</select></div>
      <article class="card table-card"><table class="transaction-table"><thead><tr><th>العملية</th><th>الجهة</th><th>الحساب</th><th>التاريخ</th><th>المبلغ</th><th></th></tr></thead><tbody>${transactionRows(list, true)}</tbody></table><div class="table-footer"><span>عرض ${list.length} من ${state.transactions.length} عملية</span><span>الرصيد يتحدث تلقائيًا مع كل عملية جديدة</span></div></article>`;
  }

  function renderAccounts() {
    const grouped = ['SAR', 'YER', 'USD'];
    const html = grouped.map(currency => {
      const accounts = currencyAccounts(currency);
      return `<div class="account-group-heading"><h2>${CURRENCY_NAMES[currency]} <span style="font-weight:400;color:#8996a3">(${currency})</span></h2><span>${accounts.length} حسابات · الإجمالي ${nfmt(sumAccounts(currency))} ${CURRENCIES[currency]}</span></div><div class="account-grid">${accounts.map(account => `<article class="card account-tile"><div class="tile-top"><span class="tile-logo ${accountClass(account)}">${escapeHTML(accountSymbol(account))}</span><div><div class="tile-name">${escapeHTML(account.name)}</div><div class="tile-kind">${accountTypeLabel(account)} · ${CURRENCY_NAMES[currency]}</div></div><button class="table-action account-edit-button" aria-label="تعديل الحساب" data-action="edit-account" data-id="${account.id}">⋯</button></div><div class="tile-balance">${nfmt(accountBalance(account.id))}<small>${CURRENCIES[currency]}</small></div><div class="tile-bottom"><span>الرصيد الحالي</span><span>تتبّع يدوي</span></div></article>`).join('')}<button class="add-account-tile" data-action="new-account">${icon('plusCircle')}<span>إضافة حساب جديد</span></button></div>`;
    }).join('');
    return `${pageHead('حساباتي', 'اجمع حساباتك البنكية والمحافظ والنقد في مكان واحد.', `<button class="button button-primary" data-action="new-account">${icon('plus')} إضافة حساب</button>`)}<div class="modal-note page-block">أضف الحسابات التي تريد تتبّعها يدويًا. رصيد البداية والعمليات المسجلة تبقى منفصلة لكل عملة؛ التطبيق لا يتصل بالبنوك أو المحافظ.</div>${html}`;
  }

  function debtRows(direction) {
    const debts = state.debts.filter(debt => debt.direction === direction).sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
    if (!debts.length) return `<div class="empty-state"><span class="empty-icon">${icon('check')}</span><strong>لا توجد سجلات هنا</strong><p>أضف دينًا أو التزامًا لمتابعته.</p></div>`;
    return debts.map(debt => {
      const late = debt.remaining > 0 && debt.dueDate && debt.dueDate < toISO(Date.now());
      const paid = debt.remaining <= 0;
      return `<div class="debt-item"><div class="debt-person"><span class="person-avatar">${escapeHTML(debt.person.slice(0, 1))}</span><div><strong>${escapeHTML(debt.person)}</strong><small>${escapeHTML(debt.description || 'بدون تفاصيل')}</small></div></div><div><div class="debt-cell-label">المتبقي من ${nfmt(debt.original)} ${CURRENCIES[debt.currency]}</div><div class="debt-cell-value">${nfmt(debt.remaining)} ${CURRENCIES[debt.currency]}</div></div><div><div class="debt-cell-label">تاريخ الاستحقاق</div><div class="debt-cell-value due-date ${late ? 'overdue' : ''}">${prettyDate(debt.dueDate)}</div></div><div class="debt-item-actions"><span class="status-pill ${paid ? 'paid' : late ? 'late' : ''}">${paid ? 'مكتمل' : late ? 'متأخر' : 'مفتوح'}</span>${!paid ? `<button class="button button-secondary button-sm" data-action="debt-payment" data-id="${debt.id}">${direction === 'receivable' ? 'تسجيل تحصيل' : 'تسجيل سداد'}</button>` : ''}<button class="table-action" aria-label="خيارات الدين" data-action="debt-menu" data-id="${debt.id}">⋯</button></div></div>`;
    }).join('');
  }
  function debtTotals(direction, currency) { return state.debts.filter(d => d.direction === direction && d.currency === currency).reduce((sum, debt) => sum + debt.remaining, 0); }
  function renderDebts() {
    const currency = state.currency;
    const open = state.debts.filter(d => d.remaining > 0).length;
    return `${pageHead('الديون والالتزامات', 'تابع المبالغ المستحقة لك وعليك، وسجّل التحصيل أو السداد.', `<button class="button button-primary" data-action="new-debt">${icon('plus')} إضافة دين</button>`)}
      <div class="summary-strip"><div class="currency-switch"><span>عرض مبالغ العملة</span><div class="segmented">${Object.keys(CURRENCIES).map(code => `<button class="segment ${currency === code ? 'active' : ''}" data-action="set-currency" data-currency="${code}">${code}</button>`).join('')}</div><span class="period-label">${open} سجلات مفتوحة بكل العملات</span></div><div></div></div>
      <div class="debt-grid"><article class="card debt-panel"><div class="debt-panel-top"><div class="debt-title-wrap"><span class="debt-panel-icon">${icon('up')}</span><div><h2>مبالغ لي عند الآخرين</h2><div class="debt-caption">ذمم مدينة · ${currency}</div></div></div><span class="status-pill">${state.debts.filter(d => d.direction === 'receivable' && d.currency === currency && d.remaining > 0).length} مفتوح</span></div><div class="debt-total">${nfmt(debtTotals('receivable', currency))}<small>${CURRENCIES[currency]}</small></div><div class="debt-progress"><span></span></div><div class="debt-panel-foot"><span>إجمالي المبالغ المتبقية</span><span>من العملاء والأفراد</span></div></article>
        <article class="card debt-panel"><div class="debt-panel-top"><div class="debt-title-wrap"><span class="debt-panel-icon payable">${icon('down')}</span><div><h2>مبالغ عليّ للآخرين</h2><div class="debt-caption">ذمم دائنة · ${currency}</div></div></div><span class="status-pill">${state.debts.filter(d => d.direction === 'payable' && d.currency === currency && d.remaining > 0).length} مفتوح</span></div><div class="debt-total">${nfmt(debtTotals('payable', currency))}<small>${CURRENCIES[currency]}</small></div><div class="debt-progress payable"><span></span></div><div class="debt-panel-foot"><span>إجمالي الالتزامات المتبقية</span><span>لأفراد أو جهات</span></div></article></div>
      <div class="section-row"><h2>مبالغ لي عند الآخرين</h2><button data-action="new-debt" data-direction="receivable">إضافة مبلغ مستحق ${icon('plus')}</button></div><article class="card debt-list">${debtRows('receivable')}</article>
      <div class="section-row"><h2>مبالغ عليّ للآخرين</h2><button data-action="new-debt" data-direction="payable">إضافة التزام ${icon('plus')}</button></div><article class="card debt-list">${debtRows('payable')}</article>`;
  }

  function renderReports() {
    const currency = reportCurrency;
    const month = state.dashboardMonth || toISO(Date.now()).slice(0, 7);
    const txs = state.transactions.filter(tx => tx.currency === currency && monthKey(tx.date) === month);
    const income = txs.filter(tx => tx.kind === 'income').reduce((s, tx) => s + tx.amount, 0);
    const expenses = txs.filter(tx => tx.kind === 'expense').reduce((s, tx) => s + tx.amount, 0);
    const net = income - expenses;
    const categories = {};
    txs.filter(tx => tx.kind === 'expense').forEach(tx => { categories[tx.category || 'أخرى'] = (categories[tx.category || 'أخرى'] || 0) + tx.amount; });
    const maxCategory = Math.max(1, ...Object.values(categories));
    const categoryRows = Object.entries(categories).sort((a, b) => b[1] - a[1]).map(([name, total]) => `<div class="bar-row"><span class="bar-label">${escapeHTML(name)}</span><span class="bar-rail"><span class="bar-fill expense" style="display:block;width:${Math.max(3, total / maxCategory * 100)}%"></span></span><span class="bar-amount">${nfmt(total)} ${CURRENCIES[currency]}</span></div>`).join('') || '<div class="empty-state"><p>لا توجد مصروفات مسجّلة لهذا الشهر.</p></div>';
    const currencies = ['SAR', 'YER', 'USD'];
    return `${pageHead('التقارير والكشوف', 'راجع حركة أموالك حسب الفترة والعملة، ونزّل كشفًا للاحتفاظ به.', `<button class="button button-secondary" data-action="export-month">${icon('download')} تنزيل كشف الشهر</button>`)}
      <div class="filter-bar"><label style="font-size:10px;color:#708094">الفترة</label><select class="filter-select" id="reportMonth">${getMonthOptions().map(m => `<option value="${m}" ${m === month ? 'selected' : ''}>${monthName(m)}</option>`).join('')}</select><label style="font-size:10px;color:#708094">العملة</label><select class="filter-select" id="reportCurrency">${currencyOptions(currency)}</select><span class="period-label">الكشوف مستقلة لكل عملة</span></div>
      <div class="statement-summary"><article class="card statement-stat"><span>إجمالي الدخل</span><strong>${nfmt(income)}<small>${CURRENCIES[currency]}</small></strong></article><article class="card statement-stat"><span>إجمالي المصروفات</span><strong>${nfmt(expenses)}<small>${CURRENCIES[currency]}</small></strong></article><article class="card statement-stat"><span>صافي التدفق</span><strong>${nfmt(net)}<small>${CURRENCIES[currency]}</small></strong></article></div>
      <div class="reports-grid"><article class="card report-card"><h2>المصروفات حسب التصنيف</h2><p>${monthName(month)} · ${CURRENCY_NAMES[currency]}</p><div class="bar-list">${categoryRows}</div></article><article class="card report-card"><h2>أرصدة الحسابات</h2><p>تفصيل الحسابات المسجلة بعملة ${CURRENCY_NAMES[currency]}</p>${currencyAccounts(currency).map(account => `<div class="currency-report-row"><span class="currency-code"><i class="currency-dot ${currency.toLowerCase()}"></i>${escapeHTML(account.name)}</span><strong>${nfmt(accountBalance(account.id))} ${CURRENCIES[currency]}</strong></div>`).join('') || '<div class="empty-state"><p>لا توجد حسابات بهذه العملة.</p></div>'}</article></div>
      <div class="section-row"><h2>كشف عمليات ${monthName(month)}</h2><button data-action="export-month">تصدير CSV ${icon('download')}</button></div><article class="card table-card"><div class="statement-intro"><div><strong>كشف ${CURRENCY_NAMES[currency]}</strong><span>يعرض الدخل والمصروف والتحويلات المسجلة خلال الفترة.</span></div><span>${txs.length} عملية</span></div><table class="transaction-table"><thead><tr><th>العملية</th><th>الجهة</th><th>الحساب</th><th>التاريخ</th><th>المبلغ</th></tr></thead><tbody>${transactionRows(txs)}</tbody></table></article>
      <article class="card page-block" style="margin-top:16px"><div class="card-header"><div><h2 class="card-title">رصيد العملات منفصل</h2><div class="card-subtitle">لم يتم تطبيق أسعار تحويل. لا تقارن القيم بين العملات مباشرة.</div></div><span class="period-label">إجمالي الأرصدة الحالية</span></div><div class="card-body">${currencies.map(code => `<div class="currency-report-row"><span class="currency-code"><i class="currency-dot ${code.toLowerCase()}"></i>${CURRENCY_NAMES[code]}</span><strong>${nfmt(sumAccounts(code))} ${CURRENCIES[code]}</strong></div>`).join('')}</div></article>
      <div class="modal-note">إعادة ضبط بيانات العرض تحذف كل ما حفظته على هذا الجهاز وتعيد السجلات التوضيحية. لبدء استخدام بياناتك، اختر «ابدأ ببياناتي» من لوحة التحكم.</div><div style="margin-top:11px"><button class="button button-danger button-sm" data-action="reset-demo">إعادة بيانات العرض</button></div>`;
  }

  function renderPage() {
    const content = $('#pageContent');
    $('#pageTitle').textContent = PAGE_NAMES[activePage];
    content.innerHTML = ({ dashboard: renderDashboard, transactions: renderTransactions, accounts: renderAccounts, debts: renderDebts, reports: renderReports })[activePage]();
    $$('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.page === activePage));
    $('#transactionCount').textContent = String(state.transactions.length);
    $('#demoPill').hidden = !state.demo;
  }
  function navigate(page) {
    if (!PAGE_NAMES[page]) return;
    activePage = page;
    renderPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function toast(message, type = 'success') {
    const node = document.createElement('div');
    node.className = `toast ${type}`;
    node.textContent = message;
    $('#toastRoot').append(node);
    setTimeout(() => node.remove(), 3100);
  }
  function showModal(title, subtitle, body, className = '') {
    $('#modalRoot').innerHTML = `<div class="modal-backdrop" data-action="backdrop-close"><section class="modal ${className}" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><header class="modal-header"><div><h2 id="modalTitle">${title}</h2><p>${subtitle}</p></div><button class="modal-close" aria-label="إغلاق" data-action="close-modal">×</button></header>${body}</section></div>`;
    $('.modal-backdrop').addEventListener('click', event => { if (event.target.classList.contains('modal-backdrop')) closeModal(); });
    const first = $('input:not([type=hidden]), select, textarea', $('.modal'));
    if (first) setTimeout(() => first.focus(), 30);
  }
  function closeModal() { $('#modalRoot').innerHTML = ''; }
  function matchingAccounts(currency) { return currencyAccounts(currency); }
  function accountSelect(name, accounts, selected = '') {
    return `<select name="${name}" required><option value="">اختر الحساب</option>${accounts.map(account => `<option value="${account.id}" ${account.id === selected ? 'selected' : ''}>${escapeHTML(account.name)} — ${account.currency}</option>`).join('')}</select>`;
  }

  function transactionModal() {
    const accountGroups = Object.entries(CURRENCIES).map(([code]) => currencyAccounts(code)).flat();
    const typeRadios = `<div class="radio-row"><label class="radio-option"><input type="radio" name="kind" value="income" checked><span>${icon('up')} دخل</span></label><label class="radio-option expense"><input type="radio" name="kind" value="expense"><span>${icon('down')} مصروف</span></label><label class="radio-option"><input type="radio" name="kind" value="transfer"><span>↔ تحويل</span></label></div>`;
    const body = `<form class="modal-form" id="transactionForm"><div class="form-grid"><div class="form-field full"><label>نوع العملية</label>${typeRadios}</div><div class="form-field full"><label for="txTitle">وصف العملية <span class="required">*</span></label><input id="txTitle" name="title" required maxlength="90" placeholder="مثال: دفعة تصميم شعار"/></div><div class="form-field" id="accountField"><label>الحساب <span class="required">*</span></label>${accountSelect('accountId', accountGroups)}</div><div class="form-field" id="transferToField" hidden><label>إلى الحساب <span class="required">*</span></label>${accountSelect('toAccountId', accountGroups)}</div><div class="form-field"><label for="txAmount">المبلغ <span class="required">*</span></label><input id="txAmount" name="amount" type="number" min="0.01" step="any" inputmode="decimal" required placeholder="0.00"/><span class="helper" id="txCurrencyHint">اختر الحساب أولًا لمعرفة العملة.</span></div><div class="form-field"><label for="txDate">التاريخ</label><input id="txDate" name="date" type="date" value="${toISO(Date.now())}" required/></div><div class="form-field"><label for="txCategory">التصنيف</label><select id="txCategory" name="category"><option>عمل حر</option><option>تشغيل</option><option>اشتراكات</option><option>فواتير</option><option>شخصي</option><option>تنقل</option><option>ضيافة</option><option>أخرى</option></select></div><div class="form-field"><label for="txParty">الجهة (اختياري)</label><input id="txParty" name="party" maxlength="70" placeholder="عميل، مزود خدمة..."/></div><div class="form-field full"><label for="txNote">ملاحظة (اختياري)</label><textarea id="txNote" name="note" maxlength="220" placeholder="تفاصيل إضافية تساعدك عند مراجعة العملية"></textarea></div></div><p class="modal-note" style="margin:13px 0 0">التحويل متاح بين حسابين بعملة واحدة. حدّد المبلغ والعملة الفعلية في الحساب.</p><div class="modal-actions"><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">حفظ العملية</button></div></form>`;
    showModal('إضافة عملية', 'سجّل دخلًا أو مصروفًا أو تحويلًا بين حساباتك.', body);
    const form = $('#transactionForm');
    function setKind() {
      const kind = new FormData(form).get('kind');
      const transfer = kind === 'transfer';
      $('#accountField').querySelector('label').textContent = transfer ? 'من الحساب' : 'الحساب *';
      $('#transferToField').hidden = !transfer;
      $('select[name=accountId]', form).required = true;
      $('select[name=toAccountId]', form).required = transfer;
      updateTxCurrencyHint();
    }
    function updateTxCurrencyHint() {
      const kind = new FormData(form).get('kind');
      const account = accountById($('select[name=accountId]', form).value);
      const to = accountById($('select[name=toAccountId]', form).value);
      $('#txCurrencyHint').textContent = account ? `سيُسجل المبلغ بعملة ${CURRENCY_NAMES[account.currency]}.` : 'اختر الحساب أولًا لمعرفة العملة.';
      if (kind === 'transfer' && account && to && account.currency !== to.currency) $('#txCurrencyHint').textContent = 'اختر حسابًا بعملة مطابقة للحساب الأول لإتمام التحويل.';
    }
    form.addEventListener('change', event => {
      if (event.target.name === 'kind') setKind();
      if (event.target.name === 'accountId' || event.target.name === 'toAccountId') updateTxCurrencyHint();
    });
    setKind();
  }

  function editTransactionModal(tx) {
    if (tx.debtId) return toast('عدّل هذه الحركة من سجل الدين المرتبط بها حتى تبقى الأرصدة متطابقة.', 'error');
    const accounts = state.accounts;
    const body = `<form class="modal-form" id="transactionEditForm"><input type="hidden" name="id" value="${tx.id}"/><div class="form-grid"><div class="form-field full"><label>وصف العملية <span class="required">*</span></label><input name="title" required maxlength="90" value="${escapeHTML(tx.title)}"/></div><div class="form-field"><label>نوع العملية</label><select name="kind"><option value="income" ${tx.kind === 'income' ? 'selected' : ''}>دخل</option><option value="expense" ${tx.kind === 'expense' ? 'selected' : ''}>مصروف</option><option value="transfer" ${tx.kind === 'transfer' ? 'selected' : ''}>تحويل بين حسابين</option></select></div><div class="form-field"><label>المبلغ <span class="required">*</span></label><input name="amount" type="number" min="0.01" step="any" value="${tx.amount}" required/></div><div class="form-field" id="editFromField"><label id="editFromLabel">${tx.kind === 'transfer' ? 'من الحساب' : 'الحساب'}</label>${accountSelect('accountId', accounts, tx.kind === 'transfer' ? tx.fromAccountId : tx.accountId)}</div><div class="form-field" id="editToField" ${tx.kind === 'transfer' ? '' : 'hidden'}><label>إلى الحساب</label>${accountSelect('toAccountId', accounts, tx.toAccountId || '')}</div><div class="form-field"><label>التاريخ</label><input name="date" type="date" value="${tx.date}" required/></div><div class="form-field"><label>التصنيف</label><select name="category">${['عمل حر', 'تشغيل', 'اشتراكات', 'فواتير', 'شخصي', 'تنقل', 'ضيافة', 'أخرى'].map(category => `<option ${tx.category === category ? 'selected' : ''}>${category}</option>`).join('')}</select></div><div class="form-field"><label>الجهة (اختياري)</label><input name="party" maxlength="70" value="${escapeHTML(tx.party || '')}"/></div><div class="form-field full"><label>ملاحظة</label><textarea name="note" maxlength="220">${escapeHTML(tx.note || '')}</textarea></div></div><div class="modal-actions"><button type="button" class="button button-danger button-sm" data-action="delete-transaction-modal" data-id="${tx.id}">حذف العملية</button><span style="flex:1"></span><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">حفظ التغييرات</button></div></form>`;
    showModal('تعديل العملية', 'حدّث التفاصيل، وسيُعاد احتساب الأرصدة تلقائيًا.', body);
    $('select[name=toAccountId]', $('#transactionEditForm')).required = tx.kind === 'transfer';
    $('#transactionEditForm').addEventListener('change', event => {
      if (event.target.name !== 'kind') return;
      const transfer = event.target.value === 'transfer';
      $('#editToField').hidden = !transfer;
      $('#editFromLabel').textContent = transfer ? 'من الحساب' : 'الحساب';
      $('select[name=toAccountId]', $('#transactionEditForm')).required = transfer;
    });
  }

  function accountModal() {
    const body = `<form class="modal-form" id="accountForm"><div class="form-grid"><div class="form-field full"><label>اسم الحساب <span class="required">*</span></label><input name="name" required maxlength="55" placeholder="مثال: حساب بنك الكريمي"/></div><div class="form-field"><label>نوع الحساب</label><select name="kind"><option value="bank">حساب بنكي</option><option value="wallet">محفظة إلكترونية</option><option value="cash">نقدي</option></select></div><div class="form-field"><label>الجهة أو المزود</label><select name="provider"><option value="other">أخرى</option><option value="kuraimi">بنك الكريمي</option><option value="qutaibi">بنك القطيبي</option><option value="qasimi">بنك القاسمي</option><option value="jib">محفظة جيب</option><option value="rajhi">مصرف الراجحي</option><option value="alinma">مصرف الإنماء</option><option value="cash">نقدي</option></select></div><div class="form-field"><label>العملة</label><select name="currency">${currencyOptions(state.currency)}</select></div><div class="form-field"><label>رصيد البداية</label><input name="openingBalance" type="number" step="any" value="0" placeholder="0"/></div></div><div class="modal-actions"><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">حفظ الحساب</button></div></form>`;
    showModal('إضافة حساب', 'أدخل رصيد البداية. سيبقى مستقلًا بعملته.', body);
  }

  function editAccountModal(account) {
    const body = `<form class="modal-form" id="accountEditForm"><input type="hidden" name="id" value="${account.id}"/><div class="form-grid"><div class="form-field full"><label>اسم الحساب <span class="required">*</span></label><input name="name" required maxlength="55" value="${escapeHTML(account.name)}"/></div><div class="form-field"><label>نوع الحساب</label><select name="kind"><option value="bank" ${account.kind === 'bank' ? 'selected' : ''}>حساب بنكي</option><option value="wallet" ${account.kind === 'wallet' ? 'selected' : ''}>محفظة إلكترونية</option><option value="cash" ${account.kind === 'cash' ? 'selected' : ''}>نقدي</option></select></div><div class="form-field"><label>العملة</label><input value="${CURRENCY_NAMES[account.currency]} (${account.currency})" disabled/></div><div class="form-field full"><label>رصيد البداية</label><input name="openingBalance" type="number" step="any" value="${account.openingBalance}"/><span class="helper">تغيير رصيد البداية يعيد احتساب الرصيد الحالي مع كل العمليات.</span></div></div><div class="modal-actions"><button type="button" class="button button-danger button-sm" data-action="delete-account" data-id="${account.id}">حذف الحساب</button><span style="flex:1"></span><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">حفظ التغييرات</button></div></form>`;
    showModal('تعديل الحساب', 'حدّث الاسم أو نوع الحساب أو رصيد البداية.', body);
  }

  function debtModal(direction = 'receivable') {
    const body = `<form class="modal-form" id="debtForm"><div class="form-grid"><div class="form-field full"><label>نوع الدين</label><div class="radio-row"><label class="radio-option"><input type="radio" name="direction" value="receivable" ${direction === 'receivable' ? 'checked' : ''}><span>مبلغ لي عند شخص</span></label><label class="radio-option expense"><input type="radio" name="direction" value="payable" ${direction === 'payable' ? 'checked' : ''}><span>مبلغ عليّ لشخص</span></label></div></div><div class="form-field"><label>اسم الشخص أو الجهة <span class="required">*</span></label><input name="person" required maxlength="70" placeholder="الاسم أو الجهة"/></div><div class="form-field"><label>المبلغ <span class="required">*</span></label><input name="amount" type="number" min="0.01" step="any" required placeholder="0.00"/></div><div class="form-field"><label>العملة</label><select name="currency">${currencyOptions(state.currency)}</select></div><div class="form-field"><label>تاريخ الاستحقاق</label><input name="dueDate" type="date"/></div><div class="form-field full"><label>التفاصيل (اختياري)</label><input name="description" maxlength="110" placeholder="سبب الدين أو تفاصيل الاتفاق"/></div><div class="form-field full"><label>حساب تسجيل المبلغ</label><select name="accountId"><option value="">بدون حركة مالية الآن</option>${accountGroupsOptions()}</select><span class="helper">اختر حسابًا إذا كان المبلغ قد دخل أو خرج فعلًا. اتركه فارغًا لتسجيل الدين فقط.</span></div></div><div class="modal-actions"><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">حفظ الدين</button></div></form>`;
    showModal('إضافة دين أو التزام', 'حدّد إن كان المبلغ لك أم عليك، وسجّل الحركة إن تمت.', body);
  }
  function accountGroupsOptions() { return ['SAR', 'YER', 'USD'].map(currency => currencyAccounts(currency).length ? `<optgroup label="${CURRENCY_NAMES[currency]}">${currencyAccounts(currency).map(a => `<option value="${a.id}">${escapeHTML(a.name)} — ${currency}</option>`).join('')}</optgroup>` : '').join(''); }

  function paymentModal(debt) {
    const collection = debt.direction === 'receivable';
    const accounts = matchingAccounts(debt.currency);
    const body = `<form class="modal-form" id="debtPaymentForm"><input type="hidden" name="debtId" value="${debt.id}"/><div class="form-grid"><div class="form-field full"><label>الجهة</label><input value="${escapeHTML(debt.person)} — متبقٍ ${nfmt(debt.remaining)} ${CURRENCIES[debt.currency]}" disabled/></div><div class="form-field"><label>مبلغ ${collection ? 'التحصيل' : 'السداد'} <span class="required">*</span></label><input name="amount" type="number" min="0.01" max="${debt.remaining}" step="any" required value="${debt.remaining}"/></div><div class="form-field"><label>الحساب <span class="required">*</span></label>${accountSelect('accountId', accounts)}</div><div class="form-field"><label>التاريخ</label><input name="date" type="date" value="${toISO(Date.now())}" required/></div><div class="form-field full"><label>ملاحظة (اختياري)</label><input name="note" maxlength="120" placeholder="دفعة أولى، سداد كامل..."/></div></div><p class="modal-note" style="margin-top:12px">سيُحدّث المبلغ المتبقي في سجل الدين ورصيد الحساب المختار.</p><div class="modal-actions"><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">تأكيد ${collection ? 'التحصيل' : 'السداد'}</button></div></form>`;
    showModal(collection ? 'تسجيل تحصيل' : 'تسجيل سداد', 'سجّل دفعة على هذا الدين.', body);
  }

  function csvCell(value) { return `"${String(value ?? '').replace(/"/g, '""')}"`; }
  function downloadCSV(rows, filename) {
    const csv = '\ufeff' + rows.map(row => row.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    toast('تم تنزيل الكشف بصيغة CSV.');
  }
  function exportTransactions(list = state.transactions, filename = 'raseed-transactions.csv') {
    const rows = [['التاريخ', 'النوع', 'الوصف', 'التصنيف', 'الجهة', 'الحساب', 'المبلغ', 'العملة', 'ملاحظة']];
    [...list].sort((a, b) => a.date.localeCompare(b.date)).forEach(tx => rows.push([tx.date, TYPE_NAMES[tx.kind], tx.title, tx.category, tx.party, transactionAccountText(tx), tx.amount, tx.currency, tx.note]));
    downloadCSV(rows, filename);
  }
  function exportMonth() {
    const month = state.dashboardMonth || toISO(Date.now()).slice(0, 7);
    const currency = activePage === 'reports' ? reportCurrency : state.currency;
    exportTransactions(state.transactions.filter(tx => monthKey(tx.date) === month && tx.currency === currency), `raseed-${month}-${currency}.csv`);
  }

  function addTransaction(formData) {
    const kind = formData.get('kind');
    const amount = safeNumber(formData.get('amount'));
    const account = accountById(formData.get('accountId'));
    const toAccount = kind === 'transfer' ? accountById(formData.get('toAccountId')) : null;
    if (!amount || amount <= 0 || !account) return toast('تحقق من المبلغ والحساب.', 'error');
    if (kind === 'transfer' && (!toAccount || toAccount.id === account.id || toAccount.currency !== account.currency)) return toast('اختر حساب وجهة مختلفًا وبالعملة نفسها.', 'error');
    const tx = { id: uid('t'), date: formData.get('date') || toISO(Date.now()), kind, amount, currency: account.currency, accountId: account.id, fromAccountId: kind === 'transfer' ? account.id : '', toAccountId: kind === 'transfer' ? toAccount.id : '', title: String(formData.get('title') || '').trim(), category: String(formData.get('category') || 'أخرى'), party: String(formData.get('party') || '').trim(), note: String(formData.get('note') || '').trim(), createdAt: new Date().toISOString() };
    state.transactions.push(tx);
    saveState(); closeModal(); renderPage(); toast('تم حفظ العملية وتحديث رصيد الحساب.');
  }
  function updateTransaction(formData) {
    const tx = state.transactions.find(item => item.id === formData.get('id'));
    const kind = formData.get('kind');
    const amount = safeNumber(formData.get('amount'));
    const account = accountById(formData.get('accountId'));
    const toAccount = kind === 'transfer' ? accountById(formData.get('toAccountId')) : null;
    if (!tx || !account || amount <= 0) return toast('تحقق من المبلغ والحساب.', 'error');
    if (kind === 'transfer' && (!toAccount || toAccount.id === account.id || toAccount.currency !== account.currency)) return toast('اختر حساب وجهة مختلفًا وبالعملة نفسها.', 'error');
    Object.assign(tx, { kind, amount, currency: account.currency, accountId: account.id, fromAccountId: kind === 'transfer' ? account.id : '', toAccountId: kind === 'transfer' ? toAccount.id : '', title: String(formData.get('title') || '').trim(), date: formData.get('date'), category: String(formData.get('category') || 'أخرى'), party: String(formData.get('party') || '').trim(), note: String(formData.get('note') || '').trim() });
    saveState(); closeModal(); renderPage(); toast('تم تحديث العملية وإعادة احتساب الأرصدة.');
  }
  function addAccount(formData) {
    const account = { id: uid('a'), name: String(formData.get('name') || '').trim(), kind: formData.get('kind'), provider: formData.get('provider'), currency: formData.get('currency'), openingBalance: safeNumber(formData.get('openingBalance')) };
    if (!account.name) return toast('أدخل اسم الحساب.', 'error');
    state.accounts.push(account); saveState(); closeModal(); renderPage(); toast('تمت إضافة الحساب.');
  }
  function updateAccount(formData) {
    const account = accountById(formData.get('id'));
    const name = String(formData.get('name') || '').trim();
    if (!account || !name) return toast('أدخل اسمًا صالحًا للحساب.', 'error');
    account.name = name;
    account.kind = formData.get('kind');
    account.openingBalance = safeNumber(formData.get('openingBalance'));
    saveState(); closeModal(); renderPage(); toast('تم تحديث الحساب وإعادة احتساب رصيده.');
  }
  function deleteAccount(id) {
    const account = accountById(id);
    if (!account) return;
    if (state.transactions.some(tx => tx.accountId === id || tx.fromAccountId === id || tx.toAccountId === id)) return toast('لا يمكن حذف حساب مرتبط بعمليات مالية. احتفظ بسجل العمليات.', 'error');
    if (accountBalance(id) !== 0) return toast('اجعل رصيد الحساب صفرًا قبل حذفه.', 'error');
    if (!window.confirm(`حذف حساب «${account.name}»؟`)) return;
    state.accounts = state.accounts.filter(item => item.id !== id); saveState(); closeModal(); renderPage(); toast('تم حذف الحساب.');
  }
  function addDebt(formData) {
    const direction = formData.get('direction');
    const person = String(formData.get('person') || '').trim();
    const amount = safeNumber(formData.get('amount'));
    const currency = formData.get('currency');
    const account = accountById(formData.get('accountId'));
    if (!person || amount <= 0) return toast('تحقق من الاسم والمبلغ.', 'error');
    if (account && account.currency !== currency) return toast('عملة الحساب لا تطابق عملة الدين.', 'error');
    const debt = { id: uid('d'), direction, person, description: String(formData.get('description') || '').trim(), currency, original: amount, remaining: amount, dueDate: formData.get('dueDate') || '', createdAt: toISO(Date.now()) };
    state.debts.push(debt);
    if (account) state.transactions.push({ id: uid('t'), date: toISO(Date.now()), kind: direction === 'receivable' ? 'lend' : 'borrow', amount, currency, accountId: account.id, title: direction === 'receivable' ? `إقراض — ${person}` : `اقتراض — ${person}`, category: 'دين', party: person, note: debt.description, debtId: debt.id, createdAt: new Date().toISOString() });
    saveState(); closeModal(); renderPage(); toast('تم حفظ الدين.');
  }
  function recordDebtPayment(formData) {
    const debt = state.debts.find(item => item.id === formData.get('debtId'));
    const account = accountById(formData.get('accountId'));
    const amount = safeNumber(formData.get('amount'));
    if (!debt || !account || amount <= 0 || amount > debt.remaining || account.currency !== debt.currency) return toast('تحقق من المبلغ والحساب.', 'error');
    const collection = debt.direction === 'receivable';
    debt.remaining = Math.max(0, debt.remaining - amount);
    state.transactions.push({ id: uid('t'), date: formData.get('date') || toISO(Date.now()), kind: collection ? 'debt_collection' : 'debt_payment', amount, currency: debt.currency, accountId: account.id, title: `${collection ? 'تحصيل من' : 'سداد إلى'} ${debt.person}`, category: 'تسوية دين', party: debt.person, note: String(formData.get('note') || '').trim(), debtId: debt.id, createdAt: new Date().toISOString() });
    saveState(); closeModal(); renderPage(); toast(collection ? 'تم تسجيل التحصيل وتحديث الدين.' : 'تم تسجيل السداد وتحديث الدين.');
  }
  function deleteTransaction(id) {
    const tx = state.transactions.find(item => item.id === id);
    if (!tx) return;
    if (tx.debtId) return toast('هذه الحركة مرتبطة بسجل دين. راجع سجل الدين قبل حذفها.', 'error');
    const ok = window.confirm(`حذف عملية «${tx.title}»؟ سيُعاد احتساب رصيد الحساب.`);
    if (!ok) return;
    state.transactions = state.transactions.filter(item => item.id !== id); saveState(); closeModal(); renderPage(); toast('تم حذف العملية وإعادة احتساب الرصيد.');
  }
  function deleteDebt(id) {
    const debt = state.debts.find(item => item.id === id);
    if (!debt) return;
    const linked = state.transactions.some(tx => tx.debtId === debt.id);
    if (linked) return toast('للحفاظ على دقة الأرصدة، لا يمكن حذف دين له حركات مالية مسجلة.', 'error');
    if (!window.confirm(`حذف سجل الدين الخاص بـ«${debt.person}»؟`)) return;
    state.debts = state.debts.filter(item => item.id !== id); saveState(); renderPage(); toast('تم حذف سجل الدين.');
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-action], [data-page]');
    if (!target) return;
    if (target.dataset.page) { navigate(target.dataset.page); return; }
    const action = target.dataset.action;
    if (action === 'new-transaction') transactionModal();
    else if (action === 'new-account') accountModal();
    else if (action === 'edit-account') { const account = accountById(target.dataset.id); if (account) editAccountModal(account); }
    else if (action === 'delete-account') deleteAccount(target.dataset.id);
    else if (action === 'delete-transaction-modal') deleteTransaction(target.dataset.id);
    else if (action === 'new-debt') debtModal(target.dataset.direction || 'receivable');
    else if (action === 'close-modal' || action === 'backdrop-close') { if (action === 'close-modal' || event.target === target) closeModal(); }
    else if (action === 'set-currency') { state.currency = target.dataset.currency; saveState(); renderPage(); }
    else if (action === 'debt-payment') { const debt = state.debts.find(item => item.id === target.dataset.id); if (debt) paymentModal(debt); }
    else if (action === 'transaction-menu') {
      const tx = state.transactions.find(item => item.id === target.dataset.id);
      if (!tx) return;
      editTransactionModal(tx);
    } else if (action === 'debt-menu') deleteDebt(target.dataset.id);
    else if (action === 'export-month') exportMonth();
    else if (action === 'export-transactions') exportTransactions(filteredTransactions(), 'raseed-filtered-transactions.csv');
    else if (action === 'reset-demo') {
      if (window.confirm('سيُحذف كل ما سجلته محليًا ويعاد تحميل البيانات التوضيحية. هل تريد المتابعة؟')) { state = demoState(); saveState(); activePage = 'dashboard'; renderPage(); toast('تمت إعادة بيانات العرض.'); }
    } else if (action === 'clear-demo') {
      if (window.confirm('سيُحذف كل سجل توضيحي، وستبدأ بحسابات وعمليات فارغة. نزّل أي بيانات تريد الاحتفاظ بها أولًا. هل تريد المتابعة؟')) {
        state = { version: 1, accounts: [], transactions: [], debts: [], currency: 'SAR', dashboardMonth: toISO(Date.now()).slice(0, 7), demo: false };
        saveState(); activePage = 'accounts'; renderPage(); toast('تم مسح بيانات العرض. أضف حساباتك للبدء.');
      }
    } else if (action === 'search') { navigate('transactions'); const input = $('#transactionSearch'); input?.focus(); input?.select(); }
    else if (action === 'notifications') toast(state.debts.some(d => d.remaining > 0 && d.dueDate && d.dueDate < toISO(Date.now())) ? 'لديك دين أو التزام متأخر. راجع صفحة الديون.' : 'لا توجد تذكيرات مستحقة حاليًا.');
    else if (action === 'profile') toast('إعدادات الملف الشخصي غير مفعّلة في هذه النسخة.');
  });

  document.addEventListener('submit', event => {
    if (event.target.id === 'transactionForm') { event.preventDefault(); addTransaction(new FormData(event.target)); }
    else if (event.target.id === 'transactionEditForm') { event.preventDefault(); updateTransaction(new FormData(event.target)); }
    else if (event.target.id === 'accountForm') { event.preventDefault(); addAccount(new FormData(event.target)); }
    else if (event.target.id === 'accountEditForm') { event.preventDefault(); updateAccount(new FormData(event.target)); }
    else if (event.target.id === 'debtForm') { event.preventDefault(); addDebt(new FormData(event.target)); }
    else if (event.target.id === 'debtPaymentForm') { event.preventDefault(); recordDebtPayment(new FormData(event.target)); }
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'transactionSearch') { transactionFilters.query = event.target.value; const cursor = event.target.selectionStart; renderPage(); const replacement = $('#transactionSearch'); replacement?.focus(); replacement?.setSelectionRange(cursor, cursor); }
  });
  document.addEventListener('change', event => {
    if (event.target.id === 'dashboardMonth') { state.dashboardMonth = event.target.value; saveState(); renderPage(); }
    else if (event.target.id === 'reportMonth') { state.dashboardMonth = event.target.value; saveState(); renderPage(); }
    else if (event.target.id === 'reportCurrency') { reportCurrency = event.target.value; renderPage(); }
    else if (event.target.id === 'transactionKind') { transactionFilters.kind = event.target.value; renderPage(); }
    else if (event.target.id === 'transactionCurrency') { transactionFilters.currency = event.target.value; renderPage(); }
    else if (event.target.id === 'transactionMonth') { transactionFilters.month = event.target.value; renderPage(); }
  });

  $$('[data-icon]').forEach(node => { node.innerHTML = icon(node.dataset.icon); });
  $$('.nav-item').forEach(item => item.addEventListener('click', () => navigate(item.dataset.page)));
  $('#todayText').textContent = new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  renderPage();
})();
