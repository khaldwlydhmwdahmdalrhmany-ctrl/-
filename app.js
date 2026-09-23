(() => {
  const STORAGE_KEY = 'raseed-finance-v1';
  const CURRENCIES = { SAR: 'ر.س', YER: 'ر.ي', USD: '$' };
  const CURRENCY_NAMES = { SAR: 'ريال سعودي', YER: 'ريال يمني', USD: 'دولار أمريكي' };
  const TYPE_NAMES = { income: 'دخل', expense: 'مصروف', transfer: 'تحويل داخلي', exchange: 'مصارفة عملات', lend: 'إقراض', borrow: 'اقتراض', debt_collection: 'تحصيل مستحق', debt_payment: 'سداد التزام' };
  const TYPE_SIGNS = { income: '+', expense: '−', transfer: '↔', exchange: '⇄', lend: '−', borrow: '+', debt_collection: '+', debt_payment: '−' };
  const PAGE_NAMES = { dashboard: 'الرئيسية', transactions: 'العمليات', accounts: 'الحسابات والمحافظ', projects: 'المشاريع', clients: 'الجهات', debts: 'المستحقات', schedules: 'المتكررة', categories: 'التصنيفات', reports: 'التقارير والكشوف' };
  const DEFAULT_CATEGORIES = [
    { id: 'cat-client-work', name: 'عمل ومشاريع', kind: 'income' },
    { id: 'cat-salary', name: 'راتب وعقد', kind: 'income' },
    { id: 'cat-sales', name: 'مبيعات', kind: 'income' },
    { id: 'cat-other-income', name: 'دخل آخر', kind: 'income' },
    { id: 'cat-tools', name: 'برامج وأدوات', kind: 'expense' },
    { id: 'cat-operations', name: 'تشغيل', kind: 'expense' },
    { id: 'cat-subscriptions', name: 'اشتراكات', kind: 'expense' },
    { id: 'cat-bills', name: 'فواتير', kind: 'expense' },
    { id: 'cat-transport', name: 'تنقل', kind: 'expense' },
    { id: 'cat-personal', name: 'شخصي', kind: 'expense' },
    { id: 'cat-team', name: 'أجور ومتعاونون', kind: 'expense' },
    { id: 'cat-other-expense', name: 'مصروف آخر', kind: 'expense' }
  ];
  const ROLE_NAMES = { client: 'عميل', employer: 'شركة / جهة عمل', collaborator: 'متعاون / منفّذ', supplier: 'مورد / مزود خدمة', personal: 'شخص' };
  const INCOME_SOURCE_NAMES = { project: 'دفعة مشروع', salary: 'راتب', retainer: 'أتعاب شهرية', contract: 'عقد / تكليف', other: 'دخل آخر' };
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
    card: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M10 17h4"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>'
    ,tag: '<svg viewBox="0 0 24 24"><path d="M20 13 13 20l-9-9V4h7l9 9Z"/><circle cx="8" cy="8" r="1.2"/></svg>'
    ,eye: '<svg viewBox="0 0 24 24"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>'
    ,income: '<svg viewBox="0 0 24 24"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>'
    ,expense: '<svg viewBox="0 0 24 24"><path d="M12 5v14m6-6-6 6-6-6"/></svg>'
    ,exchange: '<svg viewBox="0 0 24 24"><path d="M5 8h13l-3-3m4 11H6l3 3"/><path d="m18 8-3 3M6 16l3-3"/></svg>'
    ,receipt: '<svg viewBox="0 0 24 24"><path d="M5 3.5h14v17l-3-2-4 2-4-2-3 2v-17Z"/><path d="M8 8h8M8 12h8M8 16h4"/></svg>'
    ,building: '<svg viewBox="0 0 24 24"><path d="M4 21V5l8-2v18M12 9h8v12M8 8v1m0 4v1m0 4v1m8-5v1m0 4v1M2 21h20"/></svg>'
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
    const clients = [
      { id: 'c-studio', name: 'شركة مسارات', phone: '', email: '', notes: '' },
      { id: 'c-nuqta', name: 'مؤسسة نقطة ضوء', phone: '', email: '', notes: '' },
      { id: 'c-ahmad', name: 'أحمد العريقي', phone: '', email: '', notes: '' }
    ];
    const projects = [
      { id: 'p-identity', name: 'هوية بصرية — مسارات', clientId: 'c-studio', amount: 6500, currency: 'SAR', status: 'in_progress', dueDate: '', notes: '' },
      { id: 'p-campaign', name: 'حملة إعلانية رقمية', clientId: 'c-nuqta', amount: 3200, currency: 'SAR', status: 'in_progress', dueDate: '', notes: '' },
      { id: 'p-content', name: 'محتوى شهري', clientId: '', amount: 140000, currency: 'YER', status: 'completed', dueDate: '', notes: '' }
    ];
    transactions[0].clientId = 'c-studio'; transactions[0].projectId = 'p-identity';
    transactions[4].projectId = 'p-content';
    return { ...emptyState(), version: 3, profile: { name: 'تجربة رصيد', currency: 'SAR' }, setupComplete: true, accounts, transactions, debts, projects, clients, currency: 'SAR', dashboardMonth: toISO(Date.now()).slice(0, 7), demo: true };
  }

  function emptyState() {
    return { version: 3, profile: { name: '', currency: 'SAR' }, setupComplete: false, accounts: [], transactions: [], debts: [], projects: [], clients: [], schedules: [], categories: DEFAULT_CATEGORIES.map(item => ({ ...item })), hideBalances: false, currency: 'SAR', dashboardMonth: toISO(Date.now()).slice(0, 7), demo: false };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if ([1, 2, 3].includes(saved?.version) && Array.isArray(saved.accounts) && Array.isArray(saved.transactions)) {
        const migrated = { ...emptyState(), ...saved, version: 3 };
        migrated.profile = { ...emptyState().profile, ...(saved.profile || {}) };
        migrated.projects = Array.isArray(saved.projects) ? saved.projects : [];
        migrated.clients = Array.isArray(saved.clients) ? saved.clients : [];
        migrated.debts = Array.isArray(saved.debts) ? saved.debts : [];
        migrated.schedules = Array.isArray(saved.schedules) ? saved.schedules : [];
        migrated.categories = Array.isArray(saved.categories) && saved.categories.length ? saved.categories : DEFAULT_CATEGORIES.map(item => ({ ...item }));
        migrated.clients = migrated.clients.map(client => ({ ...client, role: client.role || 'client' }));
        migrated.debts = migrated.debts.map(debt => ({ ...debt, expenseRecognized: Boolean(debt.expenseRecognized) }));
        migrated.hideBalances = Boolean(saved.hideBalances);
        if (saved.version === 1) migrated.setupComplete = Boolean(saved.demo || saved.accounts.length || saved.transactions.length || migrated.debts.length);
        return migrated;
      }
    } catch (error) { console.warn('Could not read saved ledger', error); }
    return emptyState();
  }

  let state = loadState();
  let activePage = 'dashboard';
  let modalReturnPage = 'dashboard';
  let onboardingStep = state.setupDraft?.step || 1;
  let onboardingAccounts = state.setupDraft?.accounts || [];
  let onboardingDebts = state.setupDraft?.debts || [];
  let transactionFilters = { query: '', kind: 'all', currency: 'all', month: 'all', account: 'all' };
  let reportCurrency = state.currency || 'SAR';
  let reportAccount = 'all';

  function saveState() {
    try { state.version = 3; localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { toast('تعذر حفظ البيانات. تحقق من مساحة التخزين في المتصفح.', 'error'); }
  }
  function persistSetupDraft() {
    state.setupDraft = { step: onboardingStep, accounts: onboardingAccounts, debts: onboardingDebts };
    saveState();
  }
  function accountById(id) { return state.accounts.find(account => account.id === id); }
  function clientById(id) { return state.clients.find(client => client.id === id); }
  function projectById(id) { return state.projects.find(project => project.id === id); }
  function transactionParty(tx) { return clientById(tx.clientId)?.name || tx.party || '—'; }
  function accountBalance(id) {
    const account = accountById(id);
    if (!account) return 0;
    let balance = Number(account.openingBalance || 0);
    state.transactions.forEach(tx => {
      if (tx.kind === 'transfer') {
        if (tx.fromAccountId === id) balance -= tx.amount;
        if (tx.toAccountId === id) balance += tx.amount;
      } else if (tx.kind === 'exchange') {
        if (tx.fromAccountId === id) balance -= Number(tx.amount || 0) + Number(tx.fee || 0);
        if (tx.toAccountId === id) balance += Number(tx.receivedAmount || 0);
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
    const providers = { kuraimi: 'ك', qutaibi: 'قط', shailan: 'ش', qasimi: 'قس', jib: 'ج', flousak: 'ف', jawali: 'ج', cash: CURRENCIES[account.currency], alinma: 'إ', rajhi: 'ر', ahli: 'أ', exchange: 'ص' };
    return providers[account.provider] || (account.kind === 'cash' ? CURRENCIES[account.currency] : account.name.slice(0, 1));
  }
  function accountClass(account) {
    if (!account) return '';
    if (account.kind === 'cash') return account.currency === 'USD' ? 'usd' : 'cash';
    if (account.kind === 'wallet') return 'wallet';
    if (account.kind === 'exchange') return 'exchange';
    if (account.currency === 'USD') return 'usd';
    return account.provider === 'qutaibi' || account.provider === 'kuraimi' ? 'bank' : '';
  }
  function accountTypeLabel(account) {
    return ({ bank: 'حساب بنكي', wallet: 'محفظة إلكترونية', cash: 'نقدي', exchange: 'حساب صرّاف' })[account.kind] || 'حساب';
  }
  function normalizedProvider(kind, provider) {
    if (kind === 'cash') return 'cash';
    return provider === 'cash' ? 'other' : provider;
  }
  function kindClass(kind) { return kind; }
  function amountClass(kind) { return ['income', 'borrow', 'debt_collection'].includes(kind) ? 'positive' : ['expense', 'lend', 'debt_payment'].includes(kind) ? 'negative' : 'neutral'; }
  function amountHTML(tx) {
    if (tx.kind === 'exchange') return `<span class="amount neutral">${nfmt(tx.amount)} <span>${CURRENCIES[tx.currency]}</span><i>←</i>${nfmt(tx.receivedAmount)} <span>${CURRENCIES[tx.toCurrency]}</span></span>`;
    return `<span class="amount ${amountClass(tx.kind)}">${TYPE_SIGNS[tx.kind] || ''}${nfmt(tx.amount)} <span>${CURRENCIES[tx.currency]}</span></span>`;
  }
  function transactionAccountText(tx) {
    if (['transfer', 'exchange'].includes(tx.kind)) return `${accountById(tx.fromAccountId)?.name || 'حساب'} ← ${accountById(tx.toAccountId)?.name || 'حساب'}`;
    if (!tx.accountId && tx.isAccrued) return 'مستحق غير مدفوع';
    return accountById(tx.accountId)?.name || '—';
  }
  function categoryNames(kind) {
    return [...new Set([...state.categories.filter(item => item.kind === kind).map(item => item.name), ...state.transactions.filter(tx => tx.kind === kind && tx.category).map(tx => tx.category)])];
  }
  function categoryOptions(kind, selected = '') {
    const names = categoryNames(kind);
    if (selected && !names.includes(selected)) names.unshift(selected);
    return names.map(name => `<option value="${escapeHTML(name)}" ${name === selected ? 'selected' : ''}>${escapeHTML(name)}</option>`).join('');
  }
  function cashIncomeSum(currency, month = null) {
    return state.transactions.filter(tx => tx.currency === currency && ['income', 'debt_collection'].includes(tx.kind) && (!month || monthKey(tx.date) === month)).reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  }
  function cashExpenseSum(currency, month = null) {
    return state.transactions.filter(tx => tx.currency === currency && (tx.kind === 'debt_payment' || (tx.kind === 'expense' && !tx.isAccrued) || (tx.kind === 'exchange' && Number(tx.fee || 0) > 0)) && (!month || monthKey(tx.date) === month)).reduce((sum, tx) => sum + Number(tx.kind === 'exchange' ? tx.fee : tx.amount || 0), 0);
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
  function renderOnboarding() {
    const page = $('#pageContent');
    $('#appShell').classList.add('onboarding-mode');
    $('#pageTitle').textContent = 'إعداد مساحتك المالية';
    $('#demoPill').hidden = true;
    const progress = `<div class="setup-progress"><span class="${onboardingStep >= 1 ? 'complete' : ''}"></span><span class="${onboardingStep >= 2 ? 'complete' : ''}"></span></div><div class="setup-steps"><span class="${onboardingStep === 1 ? 'current' : ''}">١. الملف الشخصي</span><span class="${onboardingStep === 2 ? 'current' : ''}">٢. الحسابات والديون</span></div>`;
    if (onboardingStep === 1) return `<div class="onboarding-wrap"><div class="onboarding-brand"><span class="brand-mark">${icon('wallet')}</span><span>رَصيد</span></div><section class="onboarding-card"><div class="onboarding-intro"><span class="eyebrow">إعداد لمرة واحدة</span><h1>ابدأ بمساحتك المالية</h1><p>عرّف ملفك الشخصي وحدد عملة العرض الأساسية. بياناتك تبقى محفوظة على هذا الجهاز.</p></div>${progress}<form class="onboarding-form" id="onboardingProfileForm"><div class="form-field"><label for="ownerName">الاسم أو اسم النشاط</label><input id="ownerName" name="name" required maxlength="60" placeholder="مثال: خالد الرحماني" value="${escapeHTML(state.profile?.name || '')}" autocomplete="name"/></div><div class="form-field"><label for="baseCurrency">عملة العرض الأساسية</label><select id="baseCurrency" name="currency">${currencyOptions(state.profile?.currency || state.currency)}</select><span class="helper">يمكنك تسجيل حسابات بعملات مختلفة؛ لا يجري تحويل تلقائي بينها.</span></div><button class="button button-primary onboarding-next" type="submit">التالي: إضافة حساباتك ${icon('arrow')}</button></form><div class="onboarding-foot">لا يتطلب التطبيق كلمة مرور أو ربطًا مصرفيًا؛ الحساب هنا ملف محلي لتنظيم سجلاتك.</div></section></div>`;
    const accounts = onboardingAccounts.map((account, index) => `<div class="setup-record"><span class="setup-record-icon ${account.kind}">${escapeHTML(accountSymbol(account))}</span><div class="setup-record-main"><strong>${escapeHTML(account.name)}</strong><small>${accountTypeLabel(account)} · ${CURRENCY_NAMES[account.currency]}</small></div><b>${nfmt(account.openingBalance)} ${CURRENCIES[account.currency]}</b><button class="setup-remove" aria-label="إزالة الحساب" data-action="remove-setup-account" data-index="${index}">×</button></div>`).join('') || '<div class="setup-empty">أضف حسابًا واحدًا على الأقل لبدء استخدام رصيد.</div>';
    const debts = onboardingDebts.map((debt, index) => `<div class="setup-record"><span class="setup-record-icon ${debt.direction}">${debt.direction === 'receivable' ? '↑' : '↓'}</span><div class="setup-record-main"><strong>${escapeHTML(debt.person)}</strong><small>${debt.direction === 'receivable' ? 'مبلغ مستحق لك' : 'التزام عليك'}</small></div><b>${nfmt(debt.original)} ${CURRENCIES[debt.currency]}</b><button class="setup-remove" aria-label="إزالة الدين" data-action="remove-setup-debt" data-index="${index}">×</button></div>`).join('') || '<div class="setup-empty">يمكنك تسجيل ديونك الحالية الآن أو إضافتها لاحقًا.</div>';
    return `<div class="onboarding-wrap setup-wide"><div class="onboarding-brand"><span class="brand-mark">${icon('wallet')}</span><span>رَصيد</span></div><section class="onboarding-card"><div class="onboarding-intro"><span class="eyebrow">الخطوة الثانية</span><h1>أضف حساباتك وأرصدتك</h1><p>ابدأ بالنقد والبنوك والمحافظ والصرافين الذين تتعامل معهم، ثم سجّل أي مبالغ مستحقة لك أو عليك.</p></div>${progress}<div class="setup-columns"><section class="setup-panel"><div class="setup-panel-heading"><div><h2>الحسابات والمحافظ</h2><p>الرصيد الحالي عند بدء الاستخدام</p></div><span class="setup-count">${onboardingAccounts.length}</span></div><div class="setup-record-list">${accounts}</div><form class="setup-add-form" id="onboardingAccountForm"><div class="form-grid"><div class="form-field full"><label>اسم الحساب</label><input name="name" required maxlength="55" placeholder="مثال: كاش سعودي أو بنك الكريمي"/></div><div class="form-field"><label>نوع الحساب</label><select name="kind"><option value="cash">نقدي</option><option value="bank">حساب بنكي</option><option value="wallet">محفظة إلكترونية</option><option value="exchange">حساب صرّاف</option></select></div><div class="form-field"><label>الجهة / المزود</label><select name="provider">${providerOptions()}</select></div><div class="form-field"><label>العملة</label><select name="currency">${currencyOptions(state.currency)}</select></div><div class="form-field"><label>الرصيد الحالي</label><input name="openingBalance" type="number" step="any" inputmode="decimal" value="0" required/></div></div><button class="button button-secondary button-sm" type="submit">${icon('plus')} إضافة للحسابات</button></form></section><section class="setup-panel"><div class="setup-panel-heading"><div><h2>الديون والالتزامات</h2><p>أرصدة قائمة قبل بدء التسجيل</p></div><span class="setup-count">${onboardingDebts.length}</span></div><div class="setup-record-list">${debts}</div><form class="setup-add-form" id="onboardingDebtForm"><div class="form-grid"><div class="form-field"><label>نوع المبلغ</label><select name="direction"><option value="receivable">مستحق لي</option><option value="payable">التزام عليّ</option></select></div><div class="form-field"><label>الشخص أو الجهة</label><input name="person" required maxlength="70" placeholder="اسم الشخص أو العميل"/></div><div class="form-field"><label>المبلغ المتبقي</label><input name="amount" type="number" min="0.01" step="any" required/></div><div class="form-field"><label>العملة</label><select name="currency">${currencyOptions(state.currency)}</select></div><div class="form-field full"><label>التفاصيل (اختياري)</label><input name="description" maxlength="110" placeholder="سبب الدين أو تاريخ الاستحقاق"/></div></div><button class="button button-secondary button-sm" type="submit">${icon('plus')} إضافة سجل دين</button></form></section></div><div class="setup-footer"><button class="button button-quiet" data-action="setup-back">رجوع</button><span class="setup-hint">يمكنك إضافة أو تعديل الحسابات لاحقًا من صفحة الحسابات.</span><button class="button button-primary" data-action="finish-setup">إنهاء الإعداد والبدء</button></div></section></div>`;
  }
  function button(label, action, secondary = false, extra = '') {
    return `<button class="button ${secondary ? 'button-secondary' : 'button-primary'} ${extra}" data-action="${action}">${label}</button>`;
  }
  function metricCard(title, value, currency, kind, foot) {
    const icons = { income: 'up', expense: 'down', net: 'chart' };
    return `<article class="metric-card"><div class="metric-top"><span>${title}</span><span class="metric-icon ${kind}">${icon(icons[kind])}</span></div><div class="metric-value">${nfmt(value)} <small>${CURRENCIES[currency]}</small></div><div class="metric-foot">${foot}</div></article>`;
  }
  function dashboardProjectLines() {
    const active = state.projects.filter(project => project.status === 'in_progress').slice(0, 3);
    if (!active.length) return `<div class="empty-state compact-empty"><p>لا توجد مشاريع قيد التنفيذ.</p><button class="inline-link" data-action="new-project">إضافة مشروعك الأول</button></div>`;
    return active.map(project => {
      const totals = projectTotals(project);
      const ratio = project.amount > 0 ? Math.min(100, Math.round(totals.received / project.amount * 100)) : 0;
      return `<button class="dashboard-project" data-action="edit-project" data-id="${project.id}"><span class="dashboard-project-icon">${icon('briefcase')}</span><span class="dashboard-project-main"><b>${escapeHTML(project.name)}</b><small>${escapeHTML(clientById(project.clientId)?.name || 'بدون عميل مرتبط')}</small><i><span style="width:${ratio}%"></span></i></span><strong>${nfmt(totals.due)} ${CURRENCIES[project.currency]}</strong></button>`;
    }).join('');
  }
  function chartPath(values, width, height, padding = 7) {
    const max = Math.max(...values, 1) * 1.15;
    const step = width / Math.max(values.length - 1, 1);
    return values.map((value, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)},${(height - padding - (value / max) * (height - padding * 2)).toFixed(1)}`).join(' ');
  }
  function renderChart(currency) {
    const months = getMonthOptions().slice(0, 6).reverse();
    const income = months.map(month => cashIncomeSum(currency, month));
    const expenses = months.map(month => cashExpenseSum(currency, month));
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
    return accounts.map(account => `<div class="account-line"><span class="bank-icon ${accountClass(account)} ${escapeHTML(account.provider || '')}">${escapeHTML(accountSymbol(account))}</span><div><div class="account-line-name">${escapeHTML(account.name)}</div><div class="account-line-type">${accountTypeLabel(account)}</div></div><div class="account-line-balance">${nfmt(accountBalance(account.id))}<small>${CURRENCIES[currency]}</small></div></div>`).join('');
  }
  function dashboardAccountCards(currency) {
    const accounts = currencyAccounts(currency);
    if (!accounts.length) return `<div class="wallet-empty"><span>${icon('wallet')}</span><b>أضف أول حساب مالي</b><small>سجّل حسابك البنكي أو المحفظة أو الصراف النقدي.</small><button class="button button-light button-sm" data-action="new-account">إضافة حساب</button></div>`;
    return accounts.map(account => `<button class="wallet-slide ${accountClass(account)} ${escapeHTML(account.provider || '')}" data-action="edit-account" data-id="${account.id}"><span class="wallet-slide-top"><span class="wallet-brand ${escapeHTML(account.provider || '')}">${escapeHTML(accountSymbol(account))}</span><span class="wallet-slide-kind">${accountTypeLabel(account)}</span></span><b>${escapeHTML(account.name)}</b><strong class="balance-private">${nfmt(accountBalance(account.id))}<small>${CURRENCIES[currency]}</small></strong><span class="wallet-card-foot">الرصيد الحالي <i>${icon('arrow')}</i></span></button>`).join('');
  }
  function transactionSymbol(kind) { return `<span class="transaction-symbol ${kind}">${TYPE_SIGNS[kind] || '•'}</span>`; }
  function transactionRows(transactions, withActions = false) {
    const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || '').localeCompare(a.createdAt || ''));
    if (!sorted.length) return `<tr><td colspan="${withActions ? 6 : 5}" class="table-empty">لا توجد عمليات مطابقة. سجّل أول عملية لبدء ترتيب حساباتك.</td></tr>`;
    return sorted.map(tx => `<tr><td><div class="transaction-name">${transactionSymbol(tx.kind)}<div><div class="transaction-desc">${escapeHTML(tx.title || TYPE_NAMES[tx.kind])}</div><div class="transaction-sub">${escapeHTML(tx.category || TYPE_NAMES[tx.kind])}${tx.kind === 'income' && tx.sourceType ? ` · ${INCOME_SOURCE_NAMES[tx.sourceType] || ''}` : ''}${projectById(tx.projectId) ? ` · ${escapeHTML(projectById(tx.projectId).name)}` : ''}${tx.isAccrued ? ' · غير مدفوع' : ''}</div></div></div></td><td>${escapeHTML(transactionParty(tx))}</td><td>${escapeHTML(transactionAccountText(tx))}</td><td>${prettyDate(tx.date)}</td><td>${amountHTML(tx)}</td>${withActions ? `<td><button class="table-action" aria-label="خيارات العملية" data-action="transaction-menu" data-id="${tx.id}">⋯</button></td>` : ''}</tr>`).join('');
  }
  function kindFilterOptions(selected = 'all') {
    return `<option value="all" ${selected === 'all' ? 'selected' : ''}>كل الأنواع</option>${['income', 'expense', 'transfer', 'exchange', 'lend', 'borrow', 'debt_collection', 'debt_payment'].map(kind => `<option value="${kind}" ${selected === kind ? 'selected' : ''}>${TYPE_NAMES[kind]}</option>`).join('')}`;
  }
  function currencyOptions(selected = 'SAR') { return Object.keys(CURRENCIES).map(currency => `<option value="${currency}" ${selected === currency ? 'selected' : ''}>${CURRENCY_NAMES[currency]} (${CURRENCIES[currency]})</option>`).join(''); }
  function providerOptions(selected = 'other') {
    const providers = [['cash','نقدي'],['kuraimi','بنك الكريمي'],['qutaibi','بنك القطيبي'],['shailan','محفظة شيلن'],['qasimi','بنك القاسمي'],['jib','محفظة جيب'],['flousak','محفظة فلوسك'],['jawali','محفظة جوالي'],['rajhi','مصرف الراجحي'],['alinma','مصرف الإنماء'],['ahli','البنك الأهلي'],['exchange','صراف / محل صرافة'],['other','أخرى']];
    return providers.map(([id, name]) => `<option value="${id}" ${selected === id ? 'selected' : ''}>${name}</option>`).join('');
  }

  function renderDashboard() {
    const currency = state.currency;
    const month = state.dashboardMonth || toISO(Date.now()).slice(0, 7);
    const income = cashIncomeSum(currency, month);
    const expenses = cashExpenseSum(currency, month);
    const net = income - expenses;
    const previous = new Date(`${month}-15T12:00:00`);
    previous.setMonth(previous.getMonth() - 1);
    const previousMonth = toISO(previous).slice(0, 7);
    const prevIncome = cashIncomeSum(currency, previousMonth);
    const prevExpenses = cashExpenseSum(currency, previousMonth);
    const incomeDelta = prevIncome ? Math.round((income - prevIncome) / prevIncome * 100) : null;
    const expenseDelta = prevExpenses ? Math.round((expenses - prevExpenses) / prevExpenses * 100) : null;
    const months = getMonthOptions();
    const debtIn = state.debts.filter(d => d.direction === 'receivable' && d.currency === currency).reduce((s, d) => s + d.remaining, 0);
    const debtOut = state.debts.filter(d => d.direction === 'payable' && d.currency === currency).reduce((s, d) => s + d.remaining, 0);
    const currentTransactions = state.transactions.filter(tx => transactionTouchesCurrency(tx, currency) && monthKey(tx.date) === month);
    const recent = [...currentTransactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    const greeting = new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    return `${pageHead(`مرحبًا${state.profile?.name ? `، ${escapeHTML(state.profile.name)}` : ''}`, 'إدارتك المالية في مكان واحد.', `${state.demo ? '<button class="button button-quiet button-sm" data-action="clear-demo">ابدأ ببياناتي</button>' : ''}<button class="button button-secondary" data-action="print-report">${icon('file')} كشف PDF</button><button class="button button-primary" data-action="new-transaction">${icon('plus')} إضافة عملية</button>`)}
      <section class="balance-hero"><div class="balance-hero-head"><div><span class="balance-greeting">${escapeHTML(greeting)}</span><h2>رصيدك المتاح · ${CURRENCY_NAMES[currency]}</h2></div><button class="balance-eye" aria-label="إخفاء أو إظهار الأرصدة" data-action="toggle-balances">${icon('eye')}</button></div><div class="hero-total balance-private">${nfmt(sumAccounts(currency))}<small>${CURRENCIES[currency]}</small></div><div class="hero-meta"><span>${currencyAccounts(currency).length} حسابات نشطة</span><span>العملة لا تُحوّل تلقائيًا</span></div><div class="wallet-carousel">${dashboardAccountCards(currency)}</div></section>
      <div class="quick-actions"><button data-action="new-transaction" data-kind="income"><span class="quick-icon income">${icon('income')}</span><b>إضافة دخل</b></button><button data-action="new-transaction" data-kind="expense"><span class="quick-icon expense">${icon('expense')}</span><b>تسجيل مصروف</b></button><button data-action="new-transaction" data-kind="transfer"><span class="quick-icon transfer">${icon('exchange')}</span><b>تحويل بين حساباتي</b></button><button data-action="new-debt" data-direction="payable"><span class="quick-icon debt">${icon('people')}</span><b>إضافة مستحق</b></button></div>
      <div class="summary-strip"><div class="currency-switch"><span>ملخص الشهر</span><div class="segmented" role="group" aria-label="اختيار العملة">${Object.keys(CURRENCIES).map(code => `<button class="segment ${currency === code ? 'active' : ''}" data-action="set-currency" data-currency="${code}">${code}</button>`).join('')}</div><select class="period-select" id="dashboardMonth" aria-label="اختيار الشهر">${months.map(m => `<option value="${m}" ${m === month ? 'selected' : ''}>${monthName(m)}</option>`).join('')}</select><span class="period-label">${monthName(month)}</span></div><div></div></div>
      <div class="metric-grid">${metricCard('إجمالي الدخل', income, currency, 'income', `${incomeDelta === null ? '—' : `<span class="trend ${incomeDelta < 0 ? 'down' : ''}">${incomeDelta > 0 ? '+' : ''}${incomeDelta}%</span>`} <span>مقارنة بالشهر السابق</span>`)}${metricCard('إجمالي المصروفات', expenses, currency, 'expense', `${expenseDelta === null ? '—' : `<span class="trend ${expenseDelta > 0 ? 'down' : ''}">${expenseDelta > 0 ? '+' : ''}${expenseDelta}%</span>`} <span>مقارنة بالشهر السابق</span>`)}${metricCard('صافي التدفق النقدي', net, currency, 'net', `<span>${net >= 0 ? 'فائض هذا الشهر' : 'عجز هذا الشهر'}</span>`)}</div>
      <div class="overview-grid"><article class="card chart-card"><div class="card-header"><div><h2 class="card-title">الدخل والمصروفات</h2><div class="card-subtitle">ملخص آخر 6 أشهر · ${CURRENCY_NAMES[currency]}</div></div><div class="chart-legend"><span class="legend-key"><i></i> الدخل</span><span class="legend-key out"><i></i> المصروفات</span></div></div><div class="card-body">${renderChart(currency)}</div></article>
        <article class="card account-card"><div class="card-header"><div><h2 class="card-title">أرصدتي · ${currency}</h2><div class="card-subtitle">مجموع الحسابات بهذه العملة</div></div><button class="button button-quiet button-sm" data-page="accounts">كل الحسابات ${icon('arrow')}</button></div><div class="card-body"><div class="account-total-label">إجمالي الرصيد</div><div class="account-total">${nfmt(sumAccounts(currency))}<small>${CURRENCIES[currency]}</small></div><div class="account-subrow"><span>${currencyAccounts(currency).length} حسابات</span><span>محدّث الآن</span></div><div class="account-list">${miniAccountLines(currency)}</div></div></article></div>
      <div class="section-row"><h2>أحدث العمليات</h2><button data-page="transactions">عرض كل العمليات ${icon('arrow')}</button></div>
      <article class="card transaction-card"><table class="transaction-table"><thead><tr><th>العملية</th><th>الجهة</th><th>الحساب</th><th>التاريخ</th><th>المبلغ</th></tr></thead><tbody>${transactionRows(recent)}</tbody></table></article>
      <div class="lower-grid"><section><div class="section-row"><h2>الديون والالتزامات · ${currency}</h2><button data-page="debts">التفاصيل ${icon('arrow')}</button></div><article class="card"><div class="card-body" style="padding-top:15px"><div class="debt-summary"><div class="debt-box receivable"><span>مبالغ لي عند الآخرين</span><strong>${nfmt(debtIn)}<small>${CURRENCIES[currency]}</small></strong></div><div class="debt-box payable"><span>مبالغ عليّ للآخرين</span><strong>${nfmt(debtOut)}<small>${CURRENCIES[currency]}</small></strong></div></div></div></article></section>
        <section><div class="section-row"><h2>مشاريعي النشطة</h2><button data-page="projects">عرض الكل ${icon('arrow')}</button></div><article class="card"><div class="card-body"><div class="dashboard-project-list">${dashboardProjectLines()}</div></div></article></section></div>`;
  }

  function filteredTransactions() {
    const q = transactionFilters.query.trim().toLowerCase();
    return state.transactions.filter(tx => {
      const queryHit = !q || [tx.title, tx.category, tx.note, tx.party, transactionParty(tx), accountById(tx.accountId)?.name, accountById(tx.fromAccountId)?.name, accountById(tx.toAccountId)?.name, projectById(tx.projectId)?.name].some(value => String(value || '').toLowerCase().includes(q));
      const accountHit = transactionFilters.account === 'all' || [tx.accountId, tx.fromAccountId, tx.toAccountId].includes(transactionFilters.account);
      const currencyHit = transactionFilters.currency === 'all' || tx.currency === transactionFilters.currency || tx.toCurrency === transactionFilters.currency;
      return queryHit && accountHit && (transactionFilters.kind === 'all' || tx.kind === transactionFilters.kind) && currencyHit && (transactionFilters.month === 'all' || monthKey(tx.date) === transactionFilters.month);
    });
  }
  function renderTransactions() {
    const list = filteredTransactions();
    const monthOptions = [...new Set(state.transactions.map(tx => monthKey(tx.date)))].sort().reverse();
    return `${pageHead('العمليات', 'سجّل معاملاتك اليومية واعثر على أي عملية بسرعة.', `<button class="button button-secondary" data-action="export-transactions">${icon('download')} تنزيل CSV</button><button class="button button-primary" data-action="new-transaction">${icon('plus')} إضافة عملية</button>`)}
      <div class="filter-bar"><input class="filter-search" id="transactionSearch" type="search" placeholder="ابحث بالوصف أو التصنيف أو الشخص..." value="${escapeHTML(transactionFilters.query)}"/><select class="filter-select" id="transactionKind">${kindFilterOptions(transactionFilters.kind)}</select><select class="filter-select" id="transactionCurrency"><option value="all" ${transactionFilters.currency === 'all' ? 'selected' : ''}>كل العملات</option>${currencyOptions(transactionFilters.currency)}</select><select class="filter-select" id="transactionMonth"><option value="all" ${transactionFilters.month === 'all' ? 'selected' : ''}>كل الفترات</option>${monthOptions.map(month => `<option value="${month}" ${transactionFilters.month === month ? 'selected' : ''}>${monthName(month)}</option>`).join('')}</select><select class="filter-select" id="transactionAccount"><option value="all" ${transactionFilters.account === 'all' ? 'selected' : ''}>كل الحسابات</option>${state.accounts.map(item => `<option value="${item.id}" ${transactionFilters.account === item.id ? 'selected' : ''}>${escapeHTML(item.name)}</option>`).join('')}</select></div>
      <article class="card table-card"><table class="transaction-table"><thead><tr><th>العملية</th><th>الجهة</th><th>الحساب</th><th>التاريخ</th><th>المبلغ</th><th></th></tr></thead><tbody>${transactionRows(list, true)}</tbody></table><div class="table-footer"><span>عرض ${list.length} من ${state.transactions.length} عملية</span><span>الرصيد يتحدث تلقائيًا مع كل عملية جديدة</span></div></article>`;
  }

  function renderAccounts() {
    const grouped = ['SAR', 'YER', 'USD'];
    const html = grouped.map(currency => {
      const accounts = currencyAccounts(currency);
      return `<div class="account-group-heading"><h2>${CURRENCY_NAMES[currency]} <span style="font-weight:400;color:#8996a3">(${currency})</span></h2><span>${accounts.length} حسابات · الإجمالي ${nfmt(sumAccounts(currency))} ${CURRENCIES[currency]}</span></div><div class="account-grid">${accounts.map(account => `<article class="card account-tile"><div class="tile-top"><span class="tile-logo ${accountClass(account)} ${escapeHTML(account.provider || '')}">${escapeHTML(accountSymbol(account))}</span><div><div class="tile-name">${escapeHTML(account.name)}</div><div class="tile-kind">${accountTypeLabel(account)} · ${CURRENCY_NAMES[currency]}</div></div><button class="table-action account-edit-button" aria-label="تعديل الحساب" data-action="edit-account" data-id="${account.id}">⋯</button></div><div class="tile-balance">${nfmt(accountBalance(account.id))}<small>${CURRENCIES[currency]}</small></div><div class="tile-bottom"><span>الرصيد الحالي</span><span>تتبّع يدوي</span></div></article>`).join('')}<button class="add-account-tile" data-action="new-account">${icon('plusCircle')}<span>إضافة حساب جديد</span></button></div>`;
    }).join('');
    return `${pageHead('حساباتي', 'اجمع حساباتك البنكية والمحافظ والنقد في مكان واحد.', `<button class="button button-primary" data-action="new-account">${icon('plus')} إضافة حساب</button>`)}<div class="modal-note page-block">أضف الحسابات التي تريد تتبّعها يدويًا. رصيد البداية والعمليات المسجلة تبقى منفصلة لكل عملة؛ التطبيق لا يتصل بالبنوك أو المحافظ.</div>${html}`;
  }

  const PROJECT_STATUS = { in_progress: 'قيد التنفيذ', completed: 'مكتمل', paused: 'متوقف' };
  function projectTotals(project) {
    const txs = state.transactions.filter(tx => tx.projectId === project.id && tx.currency === project.currency);
    const received = txs.filter(tx => ['income', 'debt_collection'].includes(tx.kind)).reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = txs.filter(tx => tx.kind === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
    return { received, expenses, net: received - expenses, due: Math.max(0, Number(project.amount || 0) - received) };
  }
  function renderProjects() {
    const projects = [...state.projects].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    const total = projects.reduce((sum, project) => sum + (project.status === 'in_progress' ? 1 : 0), 0);
    const done = projects.filter(project => project.status === 'completed').length;
    const pending = Object.keys(CURRENCIES).map(currency => {
      const amount = projects.filter(project => project.currency === currency).reduce((sum, project) => sum + projectTotals(project).due, 0);
      return amount ? `${nfmt(amount)} ${CURRENCIES[currency]}` : '';
    }).filter(Boolean).join(' · ') || 'لا توجد مستحقات';
    const cards = projects.map(project => {
      const totals = projectTotals(project);
      const client = clientById(project.clientId);
      const progress = Number(project.amount) > 0 ? Math.min(100, Math.round(totals.received / project.amount * 100)) : 0;
      return `<article class="card project-card"><div class="project-card-top"><span class="project-mark">${icon('briefcase')}</span><span class="project-status ${project.status}">${PROJECT_STATUS[project.status] || 'قيد التنفيذ'}</span><button class="table-action" aria-label="إجراءات المشروع" data-action="edit-project" data-id="${project.id}">⋯</button></div><h2>${escapeHTML(project.name)}</h2><p class="project-client">${client ? `العميل: ${escapeHTML(client.name)}` : 'مشروع بدون عميل مرتبط'}${project.dueDate ? ` · موعد التسليم ${prettyDate(project.dueDate)}` : ''}</p><div class="project-progress-label"><span>التحصيل</span><strong>${progress}%</strong></div><div class="project-progress"><span style="width:${progress}%"></span></div><div class="project-metrics"><div><small>قيمة المشروع</small><strong>${nfmt(project.amount)} ${CURRENCIES[project.currency]}</strong></div><div><small>المحصّل</small><strong>${nfmt(totals.received)} ${CURRENCIES[project.currency]}</strong></div><div><small>المتبقي</small><strong>${nfmt(totals.due)} ${CURRENCIES[project.currency]}</strong></div></div><div class="project-card-foot"><span>مصروفات ${nfmt(totals.expenses)} ${CURRENCIES[project.currency]}</span><button data-action="new-transaction-for-project" data-id="${project.id}">تسجيل عملية ${icon('arrow')}</button></div></article>`;
    }).join('') || `<div class="card empty-state project-empty"><span class="empty-icon">${icon('briefcase')}</span><strong>ابدأ بإضافة أول مشروع</strong><p>اربط الدخل والمصروفات بالمشروع لتعرف ما تم تحصيله وما تبقى.</p><button class="button button-primary button-sm" data-action="new-project">إضافة مشروع</button></div>`;
    return `${pageHead('المشاريع', 'تابع قيمة كل مشروع ودفعاته ومصروفاته من البداية حتى التسليم.', `<button class="button button-primary" data-action="new-project">${icon('plus')} مشروع جديد</button>`)}<div class="project-summary"><article class="card"><span>مشاريع قيد التنفيذ</span><strong>${total}</strong></article><article class="card"><span>مشاريع مكتملة</span><strong>${done}</strong></article><article class="card"><span>مبالغ متبقية للتحصيل</span><strong class="multi-currency-value">${pending}</strong></article></div><div class="project-grid">${cards}</div>`;
  }
  function contactDebtTotal(contactId, direction, currency) {
    return state.debts.filter(debt => debt.contactId === contactId && debt.direction === direction && debt.currency === currency && debt.remaining > 0).reduce((total, debt) => total + debt.remaining, 0);
  }
  function renderClients() {
    const clients = [...state.clients].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    const cards = clients.map(client => {
      const projects = state.projects.filter(project => project.clientId === client.id);
      const activity = Object.keys(CURRENCIES).map(currency => {
        const agreed = projects.filter(project => project.currency === currency).reduce((sum, project) => sum + Number(project.amount || 0), 0);
        const received = state.transactions.filter(tx => tx.clientId === client.id && tx.currency === currency && ['income', 'debt_collection'].includes(tx.kind)).reduce((sum, tx) => sum + tx.amount, 0);
        return agreed || received ? `<span class="client-currency">${currency} <b>${nfmt(received)} / ${nfmt(agreed || received)}</b></span>` : '';
      }).filter(Boolean).join('') || '<span class="client-currency muted">لا توجد حركات مالية مرتبطة</span>';
      const openPayable = Object.keys(CURRENCIES).map(code => contactDebtTotal(client.id, 'payable', code) ? `${nfmt(contactDebtTotal(client.id, 'payable', code))} ${CURRENCIES[code]}` : '').filter(Boolean).join(' · ');
      const openReceivable = Object.keys(CURRENCIES).map(code => contactDebtTotal(client.id, 'receivable', code) ? `${nfmt(contactDebtTotal(client.id, 'receivable', code))} ${CURRENCIES[code]}` : '').filter(Boolean).join(' · ');
      return `<article class="card client-card"><div class="client-card-top"><span class="client-avatar">${escapeHTML(client.name.slice(0, 1))}</span><span class="contact-role">${ROLE_NAMES[client.role] || ROLE_NAMES.client}</span><button class="table-action" aria-label="إجراءات الجهة" data-action="edit-client" data-id="${client.id}">⋯</button></div><h2>${escapeHTML(client.name)}</h2><div class="client-contact">${client.phone ? `<span>${icon('phone')} ${escapeHTML(client.phone)}</span>` : ''}${client.email ? `<span>${icon('mail')} ${escapeHTML(client.email)}</span>` : ''}${!client.phone && !client.email ? '<span>أضف رقم الهاتف أو البريد للتواصل بسهولة.</span>' : ''}</div><div class="contact-open-balances">${openPayable ? `<span class="payable">عليك: ${openPayable}</span>` : ''}${openReceivable ? `<span class="receivable">لك: ${openReceivable}</span>` : ''}${!openPayable && !openReceivable ? '<span>لا توجد مستحقات مفتوحة</span>' : ''}</div><div class="client-card-foot"><span>${projects.length} ${projects.length === 1 ? 'مشروع' : 'مشاريع'}</span><button data-action="client-project" data-id="${client.id}">مشروع جديد ${icon('arrow')}</button></div><div class="client-money">${activity}</div><div class="contact-actions"><button data-action="new-debt-for-contact" data-id="${client.id}" data-direction="payable">إضافة مستحق له</button><button data-action="new-debt-for-contact" data-id="${client.id}" data-direction="receivable">إضافة مبلغ لي</button></div></article>`;
    }).join('') || `<div class="card empty-state client-empty"><span class="empty-icon">${icon('user')}</span><strong>سجّل عملاءك في مكان واحد</strong><p>اربط العميل بمشاريعه ودفعاته لتعرف قيمة التعامل معه.</p><button class="button button-primary button-sm" data-action="new-client">إضافة عميل</button></div>`;
    return `${pageHead('الجهات والأشخاص', 'سجل عملائك ووكالاتك ومتعاونيك ومورديك، وتابع المشاريع والمستحقات لكل جهة.', `<button class="button button-primary" data-action="new-client">${icon('plus')} إضافة جهة</button>`)}<div class="client-grid">${cards}</div>`;
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

  function scheduleRecorded(schedule, month) {
    return state.transactions.some(tx => tx.scheduleId === schedule.id && monthKey(tx.date) === month);
  }
  function renderSchedules() {
    const month = state.dashboardMonth || toISO(Date.now()).slice(0, 7);
    const cards = state.schedules.map(schedule => {
      const recorded = scheduleRecorded(schedule, month);
      const contact = clientById(schedule.contactId);
      const kindLabel = schedule.kind === 'income' ? 'دخل متكرر' : 'مصروف ثابت';
      return `<article class="card schedule-card ${schedule.kind}"><div class="schedule-card-head"><span class="schedule-mark ${schedule.kind}">${icon(schedule.kind === 'income' ? 'income' : 'receipt')}</span><div class="schedule-title"><span>${kindLabel}</span><h2>${escapeHTML(schedule.name)}</h2></div><button class="table-action" aria-label="إجراءات البند" data-action="edit-schedule" data-id="${schedule.id}">⋯</button></div><div class="schedule-amount">${nfmt(schedule.amount)} <small>${CURRENCIES[schedule.currency]}</small></div><div class="schedule-meta"><span>${escapeHTML(schedule.category || (schedule.kind === 'income' ? 'راتب وعقد' : 'اشتراكات'))}</span><span>يوم ${Number(schedule.day || 1)} من الشهر</span></div><div class="schedule-meta"><span>${contact ? escapeHTML(contact.name) : 'بدون جهة مرتبطة'}</span><span>${schedule.kind === 'income' ? 'يُسجل عند الاستلام' : 'يُسجل عند الدفع'}</span></div><div class="schedule-card-foot"><span class="schedule-status ${recorded ? 'done' : ''}">${recorded ? `تم تسجيل ${monthName(month)}` : `لم يُسجل بعد · ${monthName(month)}`}</span><button class="button ${recorded ? 'button-secondary' : 'button-primary'} button-sm" data-action="record-schedule" data-id="${schedule.id}" ${recorded ? 'disabled' : ''}>${recorded ? 'مكتمل' : 'تسجيل الحركة'}</button></div></article>`;
    }).join('') || `<div class="card empty-state project-empty"><span class="empty-icon">${icon('calendar')}</span><strong>رتّب البنود التي تتكرر كل شهر</strong><p>سجّل الراتب أو الإيجار أو الاشتراك هنا. لا تُنشأ حركة مالية حتى تضغط «تسجيل الحركة» بعد القبض أو الدفع.</p><button class="button button-primary button-sm" data-action="new-schedule">إضافة بند متكرر</button></div>`;
    const monthRows = state.schedules.filter(item => !scheduleRecorded(item, month));
    return `${pageHead('الدخل والمصروفات المتكررة', 'تذكير شهري بالرواتب والإيجارات والاشتراكات؛ سجّلها بعد حدوثها حتى لا تختلط الفواتير المستحقة بالحركات المدفوعة.', `<button class="button button-primary" data-action="new-schedule">${icon('plus')} إضافة بند</button>`)}<div class="schedule-summary"><article class="card"><span>بنود متكررة</span><strong>${state.schedules.length}</strong></article><article class="card"><span>لم تسجل لهذا الشهر</span><strong>${monthRows.length}</strong></article><article class="card"><span>الفترة الحالية</span><strong>${monthName(month)}</strong></article></div><div class="schedule-grid">${cards}</div>`;
  }
  function scheduleModal(schedule = null) {
    const data = schedule || { name: '', kind: 'expense', amount: '', currency: state.currency, category: 'اشتراكات', contactId: '', projectId: '', day: 1, sourceType: 'retainer' };
    const categoryList = [...new Set([...categoryNames('income'), ...categoryNames('expense')])];
    const body = `<form class="modal-form" id="scheduleForm"><input type="hidden" name="id" value="${schedule?.id || ''}"/><div class="form-grid"><div class="form-field full"><label>اسم البند <span class="required">*</span></label><input name="name" required maxlength="90" value="${escapeHTML(data.name)}" placeholder="راتب شهري، اشتراك برنامج، إيجار..."/></div><div class="form-field"><label>نوع البند</label><select name="kind"><option value="expense" ${data.kind === 'expense' ? 'selected' : ''}>مصروف ثابت</option><option value="income" ${data.kind === 'income' ? 'selected' : ''}>دخل متكرر</option></select></div><div class="form-field"><label>المبلغ المتوقع</label><input name="amount" type="number" min="0.01" step="any" required value="${data.amount}"/></div><div class="form-field"><label>العملة</label><select name="currency">${currencyOptions(data.currency)}</select></div><div class="form-field"><label>تصنيف</label><input name="category" list="scheduleCategories" value="${escapeHTML(data.category || '')}"/><datalist id="scheduleCategories">${categoryList.map(name => `<option value="${escapeHTML(name)}">`).join('')}</datalist></div><div class="form-field"><label>الجهة المرتبطة</label><select name="contactId">${clientOptions(data.contactId || '')}</select></div><div class="form-field"><label>يوم الاستحقاق المتوقع</label><input name="day" type="number" min="1" max="31" value="${data.day || 1}"/></div><div class="form-field" id="scheduleProjectField"><label>المشروع (اختياري)</label><select name="projectId">${projectOptions(data.projectId || '')}</select></div><div class="form-field" id="scheduleSourceField"><label>مصدر الدخل</label><select name="sourceType">${Object.entries(INCOME_SOURCE_NAMES).map(([key, value]) => `<option value="${key}" ${(data.sourceType || 'retainer') === key ? 'selected' : ''}>${value}</option>`).join('')}</select></div><div class="form-field full"><label>ملاحظة</label><textarea name="notes" maxlength="180">${escapeHTML(data.notes || '')}</textarea></div></div><div class="modal-actions">${schedule ? `<button type="button" class="button button-danger button-sm" data-action="delete-schedule" data-id="${schedule.id}">حذف البند</button>` : ''}<span style="flex:1"></span><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">${schedule ? 'حفظ التعديلات' : 'إضافة إلى التكرار الشهري'}</button></div></form>`;
    showModal(schedule ? 'تعديل بند متكرر' : 'إضافة دخل أو مصروف متكرر', 'لا يسجل التطبيق حركة أو يغير رصيدًا تلقائيًا؛ اختر تسجيلها بعد القبض أو الدفع.', body);
    const form = $('#scheduleForm');
    function sync() { const income = $('select[name=kind]', form).value === 'income'; $('#scheduleProjectField').hidden = income; $('#scheduleSourceField').hidden = !income; }
    form.addEventListener('change', event => { if (event.target.name === 'kind') sync(); });
    sync();
  }
  function saveSchedule(formData) {
    const id = String(formData.get('id') || '');
    const name = String(formData.get('name') || '').trim();
    const amount = safeNumber(formData.get('amount'));
    if (!name || amount <= 0) return toast('أدخل وصفًا ومبلغًا صالحًا للبند.', 'error');
    const kind = formData.get('kind');
    const currency = formData.get('currency');
    const projectId = kind === 'expense' ? String(formData.get('projectId') || '') : '';
    const project = projectById(projectId);
    if (project && project.currency !== currency) return toast('عملة المشروع لا تطابق عملة البند.', 'error');
    const values = { name, kind, amount, currency, category: String(formData.get('category') || (kind === 'income' ? 'راتب وعقد' : 'مصروف آخر')).trim(), contactId: String(formData.get('contactId') || ''), projectId, day: Math.min(31, Math.max(1, Number(formData.get('day') || 1))), sourceType: kind === 'income' ? String(formData.get('sourceType') || 'retainer') : '', notes: String(formData.get('notes') || '').trim(), active: true };
    ensureCategory(kind, values.category);
    if (id) Object.assign(state.schedules.find(item => item.id === id), values);
    else state.schedules.push({ id: uid('s'), ...values });
    saveState(); closeModal(); renderPage(); toast(id ? 'تم تحديث البند المتكرر.' : 'تمت إضافة البند إلى قائمتك الشهرية.');
  }
  function recordScheduleModal(schedule) {
    const accounts = currencyAccounts(schedule.currency);
    if (!accounts.length) return toast(`أضف حسابًا بعملة ${schedule.currency} قبل تسجيل هذا البند.`, 'error');
    const month = state.dashboardMonth || toISO(Date.now()).slice(0, 7);
    if (scheduleRecorded(schedule, month)) return toast('تم تسجيل هذا البند للشهر المحدد بالفعل.', 'error');
    const contact = clientById(schedule.contactId);
    const [year, monthNumber] = month.split('-').map(Number);
    const scheduleDay = Math.min(Math.max(Number(schedule.day || 1), 1), new Date(year, monthNumber, 0).getDate());
    const suggestedDate = `${month}-${String(scheduleDay).padStart(2, '0')}`;
    const body = `<form class="modal-form" id="scheduleRecordForm"><input type="hidden" name="id" value="${schedule.id}"/><div class="form-grid"><div class="form-field full"><label>البند</label><input value="${escapeHTML(schedule.name)} — ${nfmt(schedule.amount)} ${CURRENCIES[schedule.currency]}" disabled/></div><div class="form-field"><label>المبلغ الذي تم ${schedule.kind === 'income' ? 'استلامه' : 'دفعه'}</label><input name="amount" type="number" min="0.01" step="any" required value="${schedule.amount}"/></div><div class="form-field"><label>الحساب</label>${accountSelect('accountId', accounts)}</div><div class="form-field"><label>تاريخ الحركة</label><input name="date" type="date" value="${suggestedDate}" required/></div><div class="form-field full"><label>ملاحظة</label><input name="note" maxlength="160" value="${escapeHTML(schedule.notes || '')}"/></div></div><div class="modal-actions"><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">تسجيل ${schedule.kind === 'income' ? 'القبض' : 'الدفع'}</button></div></form>`;
    showModal('تسجيل الحركة لهذا الشهر', contact ? `الجهة: ${contact.name} · ${monthName(month)}` : monthName(month), body);
  }
  function recordSchedule(formData) {
    const schedule = state.schedules.find(item => item.id === formData.get('id'));
    const account = accountById(formData.get('accountId'));
    const amount = safeNumber(formData.get('amount'));
    const date = formData.get('date') || toISO(Date.now());
    if (!schedule || !account || amount <= 0 || account.currency !== schedule.currency) return toast('تحقق من البند والمبلغ والحساب.', 'error');
    if (scheduleRecorded(schedule, monthKey(date))) return toast('لديك حركة مسجلة لهذا البند في الشهر نفسه.', 'error');
    const contact = clientById(schedule.contactId);
    state.transactions.push({ id: uid('t'), scheduleId: schedule.id, date, kind: schedule.kind, amount, currency: schedule.currency, accountId: account.id, title: schedule.name, category: schedule.category, sourceType: schedule.kind === 'income' ? schedule.sourceType || 'retainer' : '', clientId: schedule.contactId || '', projectId: schedule.projectId || '', party: contact?.name || '', note: String(formData.get('note') || '').trim(), createdAt: new Date().toISOString() });
    saveState(); closeModal(); renderPage(); toast(`تم تسجيل ${schedule.kind === 'income' ? 'الدخل' : 'المصروف'} وتحديث الحساب.`);
  }
  function deleteSchedule(id) {
    const schedule = state.schedules.find(item => item.id === id);
    if (!schedule) return;
    if (!window.confirm(`حذف التذكير المتكرر «${schedule.name}»؟ ستبقى الحركات التي سجلتها محفوظة.`)) return;
    state.schedules = state.schedules.filter(item => item.id !== id);
    saveState(); closeModal(); renderPage(); toast('تم حذف البند؛ السجلات المالية محفوظة.');
  }
  function renderCategories() {
    const group = kind => state.categories.filter(item => item.kind === kind).map(item => {
      const count = state.transactions.filter(tx => tx.kind === kind && tx.category === item.name).length;
      return `<article class="category-row"><span class="category-dot ${kind}">${icon(kind === 'income' ? 'income' : 'expense')}</span><div class="category-copy"><b>${escapeHTML(item.name)}</b><small>${count} عمليات مسجلة</small></div><button class="table-action" aria-label="تعديل التصنيف" data-action="edit-category" data-id="${item.id}">⋯</button></article>`;
    }).join('') || '<div class="empty-state compact-empty"><p>لا توجد تصنيفات بعد.</p></div>';
    return `${pageHead('التصنيفات', 'رتّب دخلك ومصروفاتك بالطريقة التي تناسب عملك، وتظهر التصنيفات في التقارير تلقائيًا.', `<button class="button button-primary" data-action="new-category">${icon('plus')} إضافة تصنيف</button>`)}<div class="category-page-grid"><article class="card category-panel"><div class="card-header"><div><h2 class="card-title">تصنيفات الدخل</h2><div class="card-subtitle">رواتب، مشاريع، مبيعات ومصادر أخرى</div></div></div><div class="category-list">${group('income')}</div></article><article class="card category-panel"><div class="card-header"><div><h2 class="card-title">تصنيفات المصروف</h2><div class="card-subtitle">مصروفات شخصية وتشغيلية ومهنية</div></div></div><div class="category-list">${group('expense')}</div></article></div>`;
  }
  function categoryModal(category = null) {
    const data = category || { kind: 'expense', name: '' };
    const body = `<form class="modal-form" id="categoryForm"><input type="hidden" name="id" value="${category?.id || ''}"/><div class="form-grid"><div class="form-field"><label>نوع التصنيف</label><select name="kind"><option value="expense" ${data.kind === 'expense' ? 'selected' : ''}>مصروف</option><option value="income" ${data.kind === 'income' ? 'selected' : ''}>دخل</option></select></div><div class="form-field"><label>اسم التصنيف</label><input name="name" required maxlength="45" value="${escapeHTML(data.name)}" placeholder="مثال: رسوم تحويل، راتب"/></div></div><div class="modal-actions">${category ? `<button type="button" class="button button-danger button-sm" data-action="delete-category" data-id="${category.id}">حذف التصنيف</button>` : ''}<span style="flex:1"></span><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">حفظ التصنيف</button></div></form>`;
    showModal(category ? 'تعديل تصنيف' : 'إضافة تصنيف', 'تغيير الاسم يحدّث العمليات والبنود المتكررة المرتبطة به.', body);
  }
  function saveCategory(formData) {
    const id = String(formData.get('id') || '');
    const kind = String(formData.get('kind') || 'expense');
    const name = String(formData.get('name') || '').trim();
    if (!name) return toast('اكتب اسمًا للتصنيف.', 'error');
    if (state.categories.some(item => item.kind === kind && item.name.toLowerCase() === name.toLowerCase() && item.id !== id)) return toast('هذا التصنيف موجود بالفعل.', 'error');
    const category = state.categories.find(item => item.id === id);
    if (category) {
      const oldName = category.name; const oldKind = category.kind;
      Object.assign(category, { name, kind });
      state.transactions.forEach(tx => { if (tx.category === oldName && tx.kind === oldKind) tx.category = name; });
      state.schedules.forEach(item => { if (item.category === oldName && item.kind === oldKind) item.category = name; });
    } else state.categories.push({ id: uid('cat'), name, kind });
    saveState(); closeModal(); renderPage(); toast('تم حفظ التصنيف.');
  }
  function deleteCategory(id) {
    const category = state.categories.find(item => item.id === id);
    if (!category) return;
    const used = state.transactions.some(tx => tx.category === category.name) || state.schedules.some(item => item.category === category.name);
    if (used) return toast('هذا التصنيف مرتبط بسجلات محفوظة. غيّر اسمه بدل حذفه.', 'error');
    if (!window.confirm(`حذف تصنيف «${category.name}»؟`)) return;
    state.categories = state.categories.filter(item => item.id !== id);
    saveState(); closeModal(); renderPage(); toast('تم حذف التصنيف.');
  }

  function transactionTouchesCurrency(tx, currency) {
    return tx.currency === currency || (tx.kind === 'exchange' && tx.toCurrency === currency);
  }
  function transactionDelta(tx, accountId) {
    if (tx.kind === 'transfer') return tx.fromAccountId === accountId ? -Number(tx.amount || 0) : tx.toAccountId === accountId ? Number(tx.amount || 0) : 0;
    if (tx.kind === 'exchange') return tx.fromAccountId === accountId ? -Number(tx.amount || 0) - Number(tx.fee || 0) : tx.toAccountId === accountId ? Number(tx.receivedAmount || 0) : 0;
    if (tx.accountId !== accountId || tx.isAccrued) return 0;
    return ['income', 'borrow', 'debt_collection'].includes(tx.kind) ? Number(tx.amount || 0) : ['expense', 'lend', 'debt_payment'].includes(tx.kind) ? -Number(tx.amount || 0) : 0;
  }
  function accountBalanceBefore(accountId, date) {
    const account = accountById(accountId);
    if (!account) return 0;
    return state.transactions.filter(tx => tx.date < date).reduce((sum, tx) => sum + transactionDelta(tx, accountId), Number(account.openingBalance || 0));
  }
  function renderAccountStatement(account, txs, month) {
    const first = `${month}-01`;
    const [year, monthNumber] = month.split('-').map(Number);
    const next = toISO(new Date(year, monthNumber, 1, 12));
    const relevant = txs.filter(tx => [tx.accountId, tx.fromAccountId, tx.toAccountId].includes(account.id) && !tx.isAccrued).sort((a, b) => a.date.localeCompare(b.date) || (a.createdAt || '').localeCompare(b.createdAt || ''));
    let running = accountBalanceBefore(account.id, first);
    const start = running;
    const rows = relevant.map(tx => {
      const delta = transactionDelta(tx, account.id);
      running += delta;
      return `<tr><td><div class="transaction-name">${transactionSymbol(tx.kind)}<div><div class="transaction-desc">${escapeHTML(tx.title || TYPE_NAMES[tx.kind])}</div><div class="transaction-sub">${escapeHTML(tx.category || '')} · ${escapeHTML(transactionParty(tx))}</div></div></div></td><td>${prettyDate(tx.date)}</td><td class="${delta < 0 ? 'statement-out' : 'statement-in'}">${delta < 0 ? '−' : '+'}${nfmt(Math.abs(delta))} ${CURRENCIES[account.currency]}</td><td>${nfmt(running)} ${CURRENCIES[account.currency]}</td></tr>`;
    }).join('');
    const closing = accountBalanceBefore(account.id, next);
    return `<div class="statement-intro"><div><strong>كشف ${escapeHTML(account.name)}</strong><span>${CURRENCY_NAMES[account.currency]} · ${monthName(month)}</span></div><span>افتتاحي ${nfmt(start)} · ختامي ${nfmt(closing)} ${CURRENCIES[account.currency]}</span></div><table class="transaction-table statement-table"><thead><tr><th>العملية والجهة</th><th>التاريخ</th><th>الحركة</th><th>الرصيد بعد الحركة</th></tr></thead><tbody>${rows || `<tr><td colspan="4" class="table-empty">لا توجد حركة على هذا الحساب خلال ${monthName(month)}.</td></tr>`}</tbody></table>`;
  }
  function renderReports() {
    const currency = reportCurrency;
    const month = state.dashboardMonth || toISO(Date.now()).slice(0, 7);
    const account = accountById(reportAccount);
    const first = `${month}-01`;
    const [year, monthNumber] = month.split('-').map(Number);
    const next = toISO(new Date(year, monthNumber, 1, 12));
    const allMonth = state.transactions.filter(tx => monthKey(tx.date) === month && transactionTouchesCurrency(tx, currency));
    const txs = allMonth.filter(tx => !account || [tx.accountId, tx.fromAccountId, tx.toAccountId].includes(account.id));
    const income = txs.filter(tx => ['income', 'debt_collection'].includes(tx.kind) && tx.currency === currency).reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = txs.filter(tx => tx.currency === currency && (tx.kind === 'debt_payment' || tx.kind === 'expense' && !tx.isAccrued)).reduce((sum, tx) => sum + tx.amount, 0) + txs.filter(tx => tx.kind === 'exchange' && tx.currency === currency).reduce((sum, tx) => sum + Number(tx.fee || 0), 0);
    const accrued = allMonth.filter(tx => tx.kind === 'expense' && tx.isAccrued && tx.currency === currency).reduce((sum, tx) => sum + tx.amount, 0);
    const net = income - expenses;
    const categories = {};
    txs.filter(tx => tx.currency === currency && tx.kind === 'expense' && !tx.isAccrued).forEach(tx => { categories[tx.category || 'مصروف آخر'] = (categories[tx.category || 'مصروف آخر'] || 0) + tx.amount; });
    txs.filter(tx => tx.currency === currency && tx.kind === 'debt_payment').forEach(tx => { categories[tx.category || 'تسوية مستحق'] = (categories[tx.category || 'تسوية مستحق'] || 0) + tx.amount; });
    txs.filter(tx => tx.currency === currency && tx.kind === 'exchange' && tx.fee).forEach(tx => { categories['رسوم صرافة'] = (categories['رسوم صرافة'] || 0) + tx.fee; });
    const maxCategory = Math.max(1, ...Object.values(categories));
    const categoryRows = Object.entries(categories).sort((a, b) => b[1] - a[1]).map(([name, total]) => `<div class="bar-row"><span class="bar-label">${escapeHTML(name)}</span><span class="bar-rail"><span class="bar-fill expense" style="display:block;width:${Math.max(3, total / maxCategory * 100)}%"></span></span><span class="bar-amount">${nfmt(total)} ${CURRENCIES[currency]}</span></div>`).join('') || '<div class="empty-state"><p>لا توجد مصروفات مدفوعة مسجلة لهذا الشهر.</p></div>';
    const incomeBySource = {};
    txs.filter(tx => tx.currency === currency && tx.kind === 'income').forEach(tx => { const label = INCOME_SOURCE_NAMES[tx.sourceType] || tx.category || 'دخل آخر'; incomeBySource[label] = (incomeBySource[label] || 0) + tx.amount; });
    txs.filter(tx => tx.currency === currency && tx.kind === 'debt_collection').forEach(tx => { incomeBySource['تحصيل مستحق'] = (incomeBySource['تحصيل مستحق'] || 0) + tx.amount; });
    const sourceRows = Object.entries(incomeBySource).sort((a, b) => b[1] - a[1]).map(([label, total]) => `<div class="currency-report-row"><span>${escapeHTML(label)}</span><strong>${nfmt(total)} ${CURRENCIES[currency]}</strong></div>`).join('') || '<div class="empty-state"><p>لا توجد إيرادات في هذه الفترة.</p></div>';
    const incomeNetRows = txs.filter(tx => tx.currency === currency && ['income', 'debt_collection'].includes(tx.kind)).sort((a, b) => b.date.localeCompare(a.date)).map(tx => {
      const costs = state.transactions.filter(item => item.linkedIncomeId === tx.id && item.currency === currency && item.kind === 'expense').reduce((sum, item) => sum + Number(item.amount || 0), 0);
      return `<tr><td><div class="transaction-desc">${escapeHTML(tx.title || 'دخل')}</div><div class="transaction-sub">${INCOME_SOURCE_NAMES[tx.sourceType] || (tx.kind === 'debt_collection' ? 'تحصيل مستحق' : tx.category || 'دخل آخر')} · ${prettyDate(tx.date)}</div></td><td>${escapeHTML(transactionParty(tx))}</td><td>${nfmt(tx.amount)} ${CURRENCIES[currency]}</td><td>${nfmt(costs)} ${CURRENCIES[currency]}</td><td class="${tx.amount - costs < 0 ? 'statement-out' : 'statement-in'}">${nfmt(tx.amount - costs)} ${CURRENCIES[currency]}</td></tr>`;
    }).join('') || `<tr><td colspan="5" class="table-empty">سجّل الدخل ثم اربط مصروفاته به لتظهر قيمة صافي العائد.</td></tr>`;
    const months = [...new Set([month, ...state.transactions.map(tx => monthKey(tx.date))])].sort().reverse();
    const accountOptions = `<option value="all" ${reportAccount === 'all' ? 'selected' : ''}>كل الحسابات</option>${currencyAccounts(currency).map(item => `<option value="${item.id}" ${reportAccount === item.id ? 'selected' : ''}>${escapeHTML(item.name)}</option>`).join('')}`;
    const reportTable = account ? renderAccountStatement(account, txs, month) : `<div class="statement-intro"><div><strong>كشف ${CURRENCY_NAMES[currency]}</strong><span>عمليات الفترة المحددة · الأرصدة مستقلة حسب العملة</span></div><span>${txs.length} عملية</span></div><table class="transaction-table"><thead><tr><th>العملية</th><th>الجهة</th><th>الحساب</th><th>التاريخ</th><th>المبلغ</th></tr></thead><tbody>${transactionRows(txs)}</tbody></table>`;
    return `${pageHead('التقارير والكشوف', 'راجع الدخل والمصروف والالتزامات بحسب الشهر والعملة والحساب، ثم احفظ كشفًا منسقًا بصيغة PDF.', `<button class="button button-secondary" data-action="export-month">${icon('download')} تنزيل CSV</button><button class="button button-primary" data-action="print-report">${icon('file')} حفظ PDF</button>`)}
      <div class="filter-bar"><label>الشهر</label><select class="filter-select" id="reportMonth">${months.map(m => `<option value="${m}" ${m === month ? 'selected' : ''}>${monthName(m)}</option>`).join('')}</select><label>العملة</label><select class="filter-select" id="reportCurrency">${currencyOptions(currency)}</select><label>الحساب</label><select class="filter-select" id="reportAccount">${accountOptions}</select><span class="period-label">لا يوجد تحويل تلقائي للعملات</span></div>
      <div class="statement-summary"><article class="card statement-stat"><span>الدخل المقبوض</span><strong>${nfmt(income)}<small>${CURRENCIES[currency]}</small></strong></article><article class="card statement-stat"><span>المصروف المدفوع</span><strong>${nfmt(expenses)}<small>${CURRENCIES[currency]}</small></strong></article><article class="card statement-stat"><span>صافي الحركة النقدية</span><strong>${nfmt(net)}<small>${CURRENCIES[currency]}</small></strong></article></div>
      ${accrued ? `<div class="accrued-note"><span>${icon('receipt')}</span><div><b>مصروفات مثبتة لم تُدفع بعد</b><small>${nfmt(accrued)} ${CURRENCIES[currency]} · تظهر ضمن تكلفة المشروع ولا تُخصم من الحساب حتى السداد.</small></div></div>` : ''}
      <div class="reports-grid"><article class="card report-card"><h2>المصروفات حسب التصنيف</h2><p>${monthName(month)} · ${CURRENCY_NAMES[currency]}</p><div class="bar-list">${categoryRows}</div></article><article class="card report-card"><h2>الدخل حسب المصدر</h2><p>رواتب ومشاريع وعقود ومستحقات محصّلة</p>${sourceRows}</article></div>
      <div class="section-row"><h2>صافي الدخل بعد تكاليفه المباشرة</h2><span class="period-label">اربط المصروف بالدخل عند تسجيله</span></div><article class="card table-card"><table class="transaction-table income-net-table"><thead><tr><th>الدخل وتاريخه</th><th>الجهة</th><th>الإجمالي</th><th>التكلفة المرتبطة</th><th>الصافي</th></tr></thead><tbody>${incomeNetRows}</tbody></table></article>
      <div class="section-row"><h2>${account ? 'كشف الحساب الجاري' : `كشف العمليات · ${monthName(month)}`}</h2><span class="period-label">${account ? `${nfmt(accountBalance(account.id))} ${CURRENCIES[account.currency]} رصيد حالي` : `${txs.length} عملية`}</span></div><article class="card table-card">${reportTable}</article>
      <article class="card page-block report-balances"><div class="card-header"><div><h2 class="card-title">الأرصدة الحالية حسب العملة</h2><div class="card-subtitle">يتم عرض كل عملة مستقلة ولا يطبق التطبيق أسعار صرف.</div></div></div><div class="card-body">${['SAR', 'YER', 'USD'].map(code => `<div class="currency-report-row"><span class="currency-code"><i class="currency-dot ${code.toLowerCase()}"></i>${CURRENCY_NAMES[code]}</span><strong>${nfmt(sumAccounts(code))} ${CURRENCIES[code]}</strong></div>`).join('')}</div></article><article class="card backup-panel"><div><span class="backup-mark">${icon('shield')}</span><div><h2>نسخة احتياطية لسجلاتك</h2><p>احفظ نسخة JSON أو استعد نسخة سابقة على هذا الجهاز. لا تتم مزامنة البيانات تلقائيًا.</p></div></div><div class="backup-actions"><button class="button button-secondary" data-action="export-backup">${icon('download')} تنزيل نسخة احتياطية</button><button class="button button-primary" data-action="restore-backup">استعادة نسخة</button><input id="backupFile" type="file" accept="application/json,.json" hidden/></div></article>`;
  }

  function renderPage() {
    const content = $('#pageContent');
    if (!state.setupComplete) {
      content.innerHTML = renderOnboarding();
      $$('.nav-item, .mobile-nav-item').forEach(item => item.classList.remove('active'));
      $('#transactionCount').textContent = String(state.transactions.length);
      return;
    }
    $('#appShell').classList.remove('onboarding-mode');
    $('#pageTitle').textContent = PAGE_NAMES[activePage];
    content.innerHTML = ({ dashboard: renderDashboard, transactions: renderTransactions, accounts: renderAccounts, projects: renderProjects, clients: renderClients, debts: renderDebts, schedules: renderSchedules, categories: renderCategories, reports: renderReports })[activePage]();
    $$('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.page === activePage));
    $$('.mobile-nav-item').forEach(item => item.classList.toggle('active', item.dataset.page === activePage || (item.dataset.action === 'open-more-nav' && ['clients', 'debts', 'reports', 'schedules', 'categories', 'projects'].includes(activePage))));
    $('#appShell').classList.toggle('balances-hidden', Boolean(state.hideBalances));
    $('#transactionCount').textContent = String(state.transactions.length);
    $('#demoPill').hidden = !state.demo;
    const name = state.profile?.name || 'ملفي المالي';
    $('#profileName').textContent = name;
    $('#profileAvatar').textContent = name.slice(0, 1);
  }
  function navigate(page) {
    if (!PAGE_NAMES[page]) return;
    $('#mobileMenuRoot').innerHTML = '';
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
    modalReturnPage = activePage;
    $('#modalRoot').innerHTML = `<div class="modal-backdrop" data-action="backdrop-close"><section class="modal ${className}" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><header class="modal-header"><div><h2 id="modalTitle">${title}</h2><p>${subtitle}</p></div><button class="modal-close" aria-label="إغلاق" data-action="close-modal">×</button></header>${body}</section></div>`;
    $('.modal-backdrop').addEventListener('click', event => { if (event.target.classList.contains('modal-backdrop')) closeModal(); });
    const first = $('input:not([type=hidden]), select, textarea', $('.modal'));
    if (first) setTimeout(() => first.focus(), 30);
  }
  function closeModal() {
    $('#modalRoot').innerHTML = '';
    if (PAGE_NAMES[modalReturnPage]) activePage = modalReturnPage;
  }
  function openMobileMenu() {
    $('#mobileMenuRoot').innerHTML = `<div class="mobile-menu-backdrop" data-action="close-mobile-menu"><section class="mobile-more-panel" aria-label="المزيد من الصفحات"><div class="mobile-more-handle"></div><h2>إدارة رصيد</h2><p>صفحات المتابعة والإعداد</p><button data-page="projects"><span>${icon('briefcase')}</span><b>المشاريع والعملاء</b>${icon('arrow')}</button><button data-page="clients"><span>${icon('people')}</span><b>الجهات والأشخاص</b>${icon('arrow')}</button><button data-page="debts"><span>${icon('receipt')}</span><b>المستحقات والالتزامات</b>${icon('arrow')}</button><button data-page="schedules"><span>${icon('calendar')}</span><b>الدخل والمصروفات المتكررة</b>${icon('arrow')}</button><button data-page="categories"><span>${icon('tag')}</span><b>التصنيفات</b>${icon('arrow')}</button><button data-page="reports"><span>${icon('chart')}</span><b>التقارير والكشوف</b>${icon('arrow')}</button><button data-action="profile"><span>${icon('user')}</span><b>الملف الشخصي</b>${icon('arrow')}</button></section></div>`;
    $('.mobile-menu-backdrop').addEventListener('click', event => { if (event.target.classList.contains('mobile-menu-backdrop')) $('#mobileMenuRoot').innerHTML = ''; });
  }
  function openMobileQuickAdd() {
    $('#mobileMenuRoot').innerHTML = `<div class="mobile-menu-backdrop" data-action="close-mobile-menu"><section class="mobile-more-panel quick-add-panel" aria-label="إضافة عملية"><div class="mobile-more-handle"></div><h2>إضافة حركة</h2><p>اختر نوع العملية</p><div class="quick-add-grid"><button data-action="new-transaction" data-kind="income"><span>${icon('income')}</span><b>دخل</b></button><button data-action="new-transaction" data-kind="expense"><span>${icon('expense')}</span><b>مصروف</b></button><button data-action="new-transaction" data-kind="transfer"><span>${icon('exchange')}</span><b>تحويل</b></button><button data-action="new-transaction" data-kind="exchange"><span>${icon('exchange')}</span><b>مصارفة</b></button><button data-action="new-debt" data-direction="payable"><span>${icon('receipt')}</span><b>مستحق جديد</b></button><button data-action="new-schedule"><span>${icon('calendar')}</span><b>بند متكرر</b></button></div></section></div>`;
    $('.mobile-menu-backdrop').addEventListener('click', event => { if (event.target.classList.contains('mobile-menu-backdrop')) $('#mobileMenuRoot').innerHTML = ''; });
  }
  function matchingAccounts(currency) { return currencyAccounts(currency); }
  function accountSelect(name, accounts, selected = '') {
    return `<select name="${name}" required><option value="">اختر الحساب</option>${accounts.map(account => `<option value="${account.id}" ${account.id === selected ? 'selected' : ''}>${escapeHTML(account.name)} — ${account.currency}</option>`).join('')}</select>`;
  }
  function clientOptions(selected = '') {
    return `<option value="">بدون جهة مرتبطة</option>${state.clients.map(client => `<option value="${client.id}" ${client.id === selected ? 'selected' : ''}>${escapeHTML(client.name)} · ${ROLE_NAMES[client.role] || ROLE_NAMES.client}</option>`).join('')}`;
  }
  function projectOptions(selected = '', currency = '') {
    return `<option value="">بدون مشروع مرتبط</option>${state.projects.filter(project => !currency || project.currency === currency).map(project => `<option value="${project.id}" ${project.id === selected ? 'selected' : ''}>${escapeHTML(project.name)} · ${project.currency}</option>`).join('')}`;
  }

  function incomeOptions(selected = '', currency = '') {
    const incomes = state.transactions.filter(tx => ['income', 'debt_collection'].includes(tx.kind) && !tx.isAccrued && (!currency || tx.currency === currency)).sort((a, b) => b.date.localeCompare(a.date));
    return `<option value="">غير مرتبط بدخل معيّن</option>${incomes.map(tx => `<option value="${tx.id}" ${selected === tx.id ? 'selected' : ''}>${escapeHTML(tx.title || 'دخل')} · ${nfmt(tx.amount)} ${CURRENCIES[tx.currency]} · ${prettyDate(tx.date)}</option>`).join('')}`;
  }

  function ensureCategory(kind, name) {
    const value = String(name || '').trim();
    if (!['income', 'expense'].includes(kind) || !value) return;
    if (!state.categories.some(item => item.kind === kind && item.name.toLowerCase() === value.toLowerCase())) state.categories.push({ id: uid('cat'), kind, name: value });
  }
  function transactionModal(projectId = '', initialKind = 'income') {
    const accountGroups = state.accounts;
    if (!accountGroups.length) return toast('أضف حسابًا أولًا قبل تسجيل العمليات.', 'error');
    const categories = [...new Set([...categoryNames('income'), ...categoryNames('expense')])];
    const typeRadios = `<div class="radio-row"><label class="radio-option"><input type="radio" name="kind" value="income" ${initialKind === 'income' ? 'checked' : ''}><span>${icon('income')} دخل</span></label><label class="radio-option expense"><input type="radio" name="kind" value="expense" ${initialKind === 'expense' ? 'checked' : ''}><span>${icon('expense')} مصروف</span></label><label class="radio-option"><input type="radio" name="kind" value="transfer" ${initialKind === 'transfer' ? 'checked' : ''}><span>${icon('exchange')} تحويل</span></label><label class="radio-option"><input type="radio" name="kind" value="exchange" ${initialKind === 'exchange' ? 'checked' : ''}><span>مصارفة</span></label></div>`;
    const body = `<form class="modal-form" id="transactionForm"><div class="form-grid"><div class="form-field full"><label>نوع العملية</label>${typeRadios}</div><div class="form-field full"><label for="txTitle">وصف العملية <span class="required">*</span></label><input id="txTitle" name="title" required maxlength="90" placeholder="مثال: راتب سبتمبر أو دفعة تصميم شعار"/></div><div class="form-field" id="incomeSourceField"><label>مصدر الدخل</label><select name="sourceType">${Object.entries(INCOME_SOURCE_NAMES).map(([key, value]) => `<option value="${key}">${value}</option>`).join('')}</select></div><div class="form-field" id="accountField"><label>الحساب <span class="required">*</span></label>${accountSelect('accountId', accountGroups)}</div><div class="form-field" id="transferToField" hidden><label>إلى الحساب <span class="required">*</span></label>${accountSelect('toAccountId', accountGroups)}</div><div class="form-field" id="receivedAmountField" hidden><label>المبلغ المستلم <span class="required">*</span></label><input name="receivedAmount" type="number" min="0.01" step="any" inputmode="decimal" placeholder="0.00"/></div><div class="form-field" id="exchangeFeeField" hidden><label>رسوم الصراف (اختياري)</label><input name="fee" type="number" min="0" step="any" inputmode="decimal" value="0"/></div><div class="form-field"><label for="txAmount">${initialKind === 'transfer' || initialKind === 'exchange' ? 'المبلغ المرسل' : 'المبلغ'} <span class="required">*</span></label><input id="txAmount" name="amount" type="number" min="0.01" step="any" inputmode="decimal" required placeholder="0.00"/><span class="helper" id="txCurrencyHint">اختر الحساب أولًا لمعرفة العملة.</span></div><div class="form-field"><label id="txDateLabel" for="txDate">التاريخ</label><input id="txDate" name="date" type="date" value="${toISO(Date.now())}" required/></div><div class="form-field" id="categoryField"><label for="txCategory">التصنيف</label><input id="txCategory" name="category" list="txCategoryOptions" placeholder="اختر أو اكتب تصنيفًا" value="${escapeHTML(categoryNames(initialKind === 'income' ? 'income' : 'expense')[0] || '')}"/><datalist id="txCategoryOptions">${categories.map(name => `<option value="${escapeHTML(name)}">`).join('')}</datalist></div><div class="form-field" id="linkedIncomeField" hidden><label>مصروف مرتبط بهذا الدخل</label><select name="linkedIncomeId">${incomeOptions()}</select></div><div class="form-field" id="clientField"><label for="txClient">العميل أو الجهة</label><select id="txClient" name="clientId">${clientOptions()}</select></div><div class="form-field" id="projectField"><label for="txProject">المشروع (اختياري)</label><select id="txProject" name="projectId">${projectOptions(projectId)}</select></div><div class="form-field" id="txPartyField"><label for="txParty">المستفيد أو المورد (اختياري)</label><input id="txParty" name="party" maxlength="70" placeholder="من استلم المبلغ؟"/></div><div class="form-field full"><label for="txNote">ملاحظة (اختياري)</label><textarea id="txNote" name="note" maxlength="220" placeholder="تفاصيل تساعدك عند مراجعة العملية"></textarea></div></div><p class="modal-note" id="txFormHint" style="margin:13px 0 0"></p><div class="modal-actions"><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button id="txSubmitLabel" type="submit" class="button button-primary">حفظ العملية</button></div></form>`;
    showModal('إضافة عملية', 'سجّل دخلًا أو مصروفًا أو حركة بين الحسابات.', body);
    const form = $('#transactionForm');
    const presetProject = projectById(projectId);
    if (presetProject?.clientId) $('select[name=clientId]', form).value = presetProject.clientId;
    function setKind() {
      const kind = new FormData(form).get('kind');
      const paired = ['transfer', 'exchange'].includes(kind);
      $('#accountField').querySelector('label').textContent = paired ? 'من الحساب' : 'الحساب';
      $('#transferToField').hidden = !paired;
      $('#receivedAmountField').hidden = kind !== 'exchange';
      $('#exchangeFeeField').hidden = kind !== 'exchange';
      $('#incomeSourceField').hidden = kind !== 'income';
      $('#linkedIncomeField').hidden = kind !== 'expense';
      $('#categoryField').hidden = paired;
      $('#projectField').hidden = paired;
      $('#clientField').hidden = paired;
      $('#txPartyField').hidden = paired;
      $('#txParty').previousElementSibling.textContent = kind === 'income' ? 'جهة أخرى (اختياري)' : kind === 'expense' ? 'المستفيد أو المورد (اختياري)' : 'اسم الصراف (اختياري)';
      $('#txParty').placeholder = kind === 'income' ? 'جهة غير مسجلة' : kind === 'expense' ? 'من استلم المبلغ؟' : 'اسم محل الصرافة';
      $('#linkedIncomeField').querySelector('label').textContent = 'الدخل الذي يغطي تكلفة هذا المصروف (اختياري)';
      $('#txDateLabel').textContent = kind === 'income' ? 'تاريخ استلام الدخل' : kind === 'expense' ? 'تاريخ دفع المصروف' : 'تاريخ الحركة';
      $('#txTitle').placeholder = kind === 'income' ? 'مثال: راتب سبتمبر أو دفعة مشروع' : kind === 'expense' ? 'مثال: اشتراك برنامج أو أجرة تنفيذ' : kind === 'transfer' ? 'مثال: تحويل من الكريمي إلى كاش' : 'مثال: مصارفة من ريال سعودي إلى يمني';
      $('#txFormHint').textContent = kind === 'income' ? 'سجّل المبلغ الذي وصل فعليًا إلى الحساب، واربطه بعميل أو مشروع عند الحاجة.' : kind === 'expense' ? 'يسجل هذا مصروفًا مدفوعًا الآن. إذا لم تدفعه بعد، سجّله التزامًا من صفحة المستحقات.' : kind === 'transfer' ? 'ينقل المبلغ بين حسابين بالعملة نفسها، ولا يحتسب دخلًا أو مصروفًا.' : 'سجّل المبلغ المرسل والمبلغ المستلم والرسوم؛ لكل حساب عملته المستقلة.';
      $('#txSubmitLabel').textContent = kind === 'income' ? 'تسجيل الدخل' : kind === 'expense' ? 'تسجيل المصروف' : kind === 'transfer' ? 'تسجيل التحويل' : 'تسجيل المصارفة';
      $('select[name=accountId]', form).required = true;
      $('select[name=toAccountId]', form).required = paired;
      $('input[name=receivedAmount]', form).required = kind === 'exchange';
      $('#txAmount').previousElementSibling.textContent = kind === 'transfer' || kind === 'exchange' ? 'المبلغ المرسل *' : 'المبلغ *';
      const category = $('#txCategory');
      if (!paired) $('#txCategoryOptions').innerHTML = categoryNames(kind).map(name => `<option value="${escapeHTML(name)}">`).join('');
      if (kind === 'transfer' || kind === 'exchange') { category.value = kind === 'exchange' ? 'مصارفة عملات' : 'تحويل داخلي'; }
      else if (!category.value || !categoryNames(kind).includes(category.value)) category.value = categoryNames(kind)[0] || (kind === 'income' ? 'دخل آخر' : 'مصروف آخر');
      updateTxCurrencyHint();
    }
    function updateTxCurrencyHint() {
      const kind = new FormData(form).get('kind');
      const account = accountById($('select[name=accountId]', form).value);
      const to = accountById($('select[name=toAccountId]', form).value);
      $('#txCurrencyHint').textContent = account ? `المبلغ بعملة ${CURRENCY_NAMES[account.currency]}.` : 'اختر الحساب أولًا لمعرفة العملة.';
      if (kind === 'transfer' && account && to && account.currency !== to.currency) $('#txCurrencyHint').textContent = 'التحويل الداخلي يتطلب حسابين بالعملة نفسها.';
      if (kind === 'exchange' && account && to && account.currency === to.currency) $('#txCurrencyHint').textContent = 'اختر حسابًا بعملة مختلفة لتسجيل المصارفة.';
      const projectSelect = $('select[name=projectId]', form);
      const selectedProjectId = projectSelect.value;
      projectSelect.innerHTML = projectOptions(selectedProjectId, account?.currency || '');
      if (selectedProjectId && ![...projectSelect.options].some(option => option.value === selectedProjectId)) projectSelect.value = '';
      const project = projectById(projectSelect.value);
      if (project && account && project.currency !== account.currency) $('#txCurrencyHint').textContent = `عملة المشروع ${project.currency}; اختر حسابًا بالعملة نفسها.`;
      const incomeSelect = $('select[name=linkedIncomeId]', form);
      const selectedIncomeId = incomeSelect.value;
      incomeSelect.innerHTML = incomeOptions(selectedIncomeId, account?.currency || '');
      if (selectedIncomeId && !state.transactions.some(tx => tx.id === selectedIncomeId && tx.currency === account?.currency)) incomeSelect.value = '';
    }
    form.addEventListener('change', event => {
      if (event.target.name === 'kind') setKind();
      if (event.target.name === 'accountId' || event.target.name === 'toAccountId') updateTxCurrencyHint();
      if (event.target.name === 'projectId') { const project = projectById(event.target.value); if (project?.clientId) $('select[name=clientId]', form).value = project.clientId; updateTxCurrencyHint(); }
      if (event.target.name === 'clientId') { const project = projectById($('select[name=projectId]', form).value); if (project?.clientId && project.clientId !== event.target.value) $('select[name=projectId]', form).value = ''; updateTxCurrencyHint(); }
    });
    setKind();
  }

  function editTransactionModal(tx) {
    if (tx.debtId) return toast('عدّل هذه الحركة من سجل الدين المرتبط بها حتى تبقى الأرصدة متطابقة.', 'error');
    const categories = [...new Set([...categoryNames('income'), ...categoryNames('expense'), tx.category].filter(Boolean))];
    const body = `<form class="modal-form" id="transactionEditForm"><input type="hidden" name="id" value="${tx.id}"/><div class="form-grid"><div class="form-field full"><label>وصف العملية <span class="required">*</span></label><input name="title" required maxlength="90" value="${escapeHTML(tx.title)}"/></div><div class="form-field full"><label>نوع العملية</label><select name="kind"><option value="income" ${tx.kind === 'income' ? 'selected' : ''}>دخل</option><option value="expense" ${tx.kind === 'expense' ? 'selected' : ''}>مصروف</option><option value="transfer" ${tx.kind === 'transfer' ? 'selected' : ''}>تحويل داخلي</option><option value="exchange" ${tx.kind === 'exchange' ? 'selected' : ''}>مصارفة عملات</option></select></div><div class="form-field" id="editIncomeSourceField"><label>مصدر الدخل</label><select name="sourceType">${Object.entries(INCOME_SOURCE_NAMES).map(([key, value]) => `<option value="${key}" ${(tx.sourceType || 'project') === key ? 'selected' : ''}>${value}</option>`).join('')}</select></div><div class="form-field" id="editFromField"><label id="editFromLabel">الحساب</label>${accountSelect('accountId', state.accounts, tx.kind === 'transfer' || tx.kind === 'exchange' ? tx.fromAccountId : tx.accountId)}</div><div class="form-field" id="editToField" ${tx.kind === 'transfer' || tx.kind === 'exchange' ? '' : 'hidden'}><label>إلى الحساب</label>${accountSelect('toAccountId', state.accounts, tx.toAccountId || '')}</div><div class="form-field" id="editReceivedField" ${tx.kind === 'exchange' ? '' : 'hidden'}><label>المبلغ المستلم</label><input name="receivedAmount" type="number" min="0.01" step="any" value="${tx.receivedAmount || ''}"/></div><div class="form-field" id="editFeeField" ${tx.kind === 'exchange' ? '' : 'hidden'}><label>رسوم الصراف</label><input name="fee" type="number" min="0" step="any" value="${tx.fee || 0}"/></div><div class="form-field"><label id="editAmountLabel">المبلغ <span class="required">*</span></label><input name="amount" type="number" min="0.01" step="any" value="${tx.amount}" required/></div><div class="form-field"><label id="editDateLabel">التاريخ</label><input name="date" type="date" value="${tx.date}" required/></div><div class="form-field" id="editCategoryField"><label>التصنيف</label><input name="category" list="editCategoryOptions" value="${escapeHTML(tx.category || '')}"/><datalist id="editCategoryOptions">${categories.map(name => `<option value="${escapeHTML(name)}">`).join('')}</datalist></div><div class="form-field" id="editLinkedIncomeField" ${tx.kind === 'expense' ? '' : 'hidden'}><label>مصروف مرتبط بهذا الدخل</label><select name="linkedIncomeId">${incomeOptions(tx.linkedIncomeId || '')}</select></div><div class="form-field" id="editClientField"><label>العميل أو الجهة</label><select name="clientId">${clientOptions(tx.clientId || '')}</select></div><div class="form-field" id="editProjectField"><label>المشروع (اختياري)</label><select name="projectId">${projectOptions(tx.projectId || '')}</select></div><div class="form-field" id="editPartyField"><label>المستفيد أو المورد</label><input name="party" maxlength="70" value="${escapeHTML(tx.party || '')}"/></div><div class="form-field full"><label>ملاحظة</label><textarea name="note" maxlength="220">${escapeHTML(tx.note || '')}</textarea></div></div><div class="modal-actions"><button type="button" class="button button-danger button-sm" data-action="delete-transaction-modal" data-id="${tx.id}">حذف العملية</button><span style="flex:1"></span><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">حفظ التغييرات</button></div></form>`;
    showModal('تعديل العملية', 'حدّث التفاصيل؛ سيعاد احتساب الحساب والتقارير.', body);
    const form = $('#transactionEditForm');
    function setEditKind() {
      const kind = new FormData(form).get('kind');
      const paired = ['transfer', 'exchange'].includes(kind);
      $('#editToField').hidden = !paired; $('#editReceivedField').hidden = kind !== 'exchange'; $('#editFeeField').hidden = kind !== 'exchange';
      $('#editIncomeSourceField').hidden = kind !== 'income'; $('#editLinkedIncomeField').hidden = kind !== 'expense';
      $('#editCategoryField').hidden = paired;
      if (!paired) $('#editCategoryOptions').innerHTML = categoryNames(kind).map(name => `<option value="${escapeHTML(name)}">`).join('');
      $('#editProjectField').hidden = paired; $('#editClientField').hidden = paired;
      $('#editPartyField').hidden = paired;
      $('#editFromLabel').textContent = paired ? 'من الحساب' : 'الحساب';
      $('#editAmountLabel').textContent = paired ? 'المبلغ المرسل *' : 'المبلغ *';
      $('#editDateLabel').textContent = kind === 'income' ? 'تاريخ استلام الدخل' : kind === 'expense' ? 'تاريخ دفع المصروف' : 'تاريخ الحركة';
      $('select[name=toAccountId]', form).required = paired; $('input[name=receivedAmount]', form).required = kind === 'exchange';
      const categoryInput = $('input[name=category]', form);
      if (!paired && !categoryNames(kind).includes(categoryInput.value)) categoryInput.value = categoryNames(kind)[0] || (kind === 'income' ? 'دخل آخر' : 'مصروف آخر');
      syncEditRelations();
    }
    function syncEditRelations() {
      const account = accountById($('select[name=accountId]', form).value);
      const projectSelect = $('select[name=projectId]', form);
      const selectedProjectId = projectSelect.value;
      projectSelect.innerHTML = projectOptions(selectedProjectId, account?.currency || '');
      if (selectedProjectId && ![...projectSelect.options].some(option => option.value === selectedProjectId)) projectSelect.value = '';
      const incomeSelect = $('select[name=linkedIncomeId]', form);
      const selectedIncomeId = incomeSelect.value;
      incomeSelect.innerHTML = incomeOptions(selectedIncomeId, account?.currency || '');
      if (selectedIncomeId && !state.transactions.some(item => item.id === selectedIncomeId && item.currency === account?.currency)) incomeSelect.value = '';
    }
    form.addEventListener('change', event => {
      if (event.target.name === 'kind') setEditKind();
      else if (['accountId', 'projectId'].includes(event.target.name)) syncEditRelations();
      else if (event.target.name === 'clientId') { const project = projectById($('select[name=projectId]', form).value); if (project?.clientId && project.clientId !== event.target.value) $('select[name=projectId]', form).value = ''; syncEditRelations(); }
    });
    setEditKind();
  }

  function accountModal() {
    const body = `<form class="modal-form" id="accountForm"><div class="form-grid"><div class="form-field full"><label>اسم الحساب <span class="required">*</span></label><input name="name" required maxlength="55" placeholder="مثال: حساب بنك الكريمي"/></div><div class="form-field"><label>نوع الحساب</label><select name="kind"><option value="bank">حساب بنكي</option><option value="wallet">محفظة إلكترونية</option><option value="cash">نقدي</option><option value="exchange">حساب صرّاف</option></select></div><div class="form-field"><label>الجهة أو المزود</label><select name="provider">${providerOptions()}</select></div><div class="form-field"><label>العملة</label><select name="currency">${currencyOptions(state.currency)}</select></div><div class="form-field"><label>رصيد البداية</label><input name="openingBalance" type="number" step="any" value="0" placeholder="0"/></div></div><div class="modal-actions"><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">حفظ الحساب</button></div></form>`;
    showModal('إضافة حساب', 'أدخل رصيد البداية. سيبقى مستقلًا بعملته.', body);
  }

  function editAccountModal(account) {
    const body = `<form class="modal-form" id="accountEditForm"><input type="hidden" name="id" value="${account.id}"/><div class="form-grid"><div class="form-field full"><label>اسم الحساب <span class="required">*</span></label><input name="name" required maxlength="55" value="${escapeHTML(account.name)}"/></div><div class="form-field"><label>نوع الحساب</label><select name="kind"><option value="bank" ${account.kind === 'bank' ? 'selected' : ''}>حساب بنكي</option><option value="wallet" ${account.kind === 'wallet' ? 'selected' : ''}>محفظة إلكترونية</option><option value="cash" ${account.kind === 'cash' ? 'selected' : ''}>نقدي</option><option value="exchange" ${account.kind === 'exchange' ? 'selected' : ''}>حساب صرّاف</option></select></div><div class="form-field"><label>الجهة أو المزود</label><select name="provider">${providerOptions(account.provider)}</select></div><div class="form-field"><label>العملة</label><input value="${CURRENCY_NAMES[account.currency]} (${account.currency})" disabled/></div><div class="form-field"><label>رصيد البداية</label><input name="openingBalance" type="number" step="any" value="${account.openingBalance}"/><span class="helper">تغيير رصيد البداية يعيد احتساب الرصيد الحالي مع كل العمليات.</span></div></div><div class="modal-actions"><button type="button" class="button button-danger button-sm" data-action="delete-account" data-id="${account.id}">حذف الحساب</button><span style="flex:1"></span><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">حفظ التغييرات</button></div></form>`;
    showModal('تعديل الحساب', 'حدّث الاسم أو نوع الحساب أو رصيد البداية.', body);
  }

  function projectModal(project = null, clientId = '') {
    const data = project || { name: '', clientId, amount: '', currency: state.currency, status: 'in_progress', dueDate: '', notes: '' };
    const body = `<form class="modal-form" id="projectForm"><input type="hidden" name="id" value="${project?.id || ''}"/><div class="form-grid"><div class="form-field full"><label>اسم المشروع <span class="required">*</span></label><input name="name" required maxlength="80" value="${escapeHTML(data.name)}" placeholder="مثال: تصميم هوية بصرية"/></div><div class="form-field"><label>العميل</label><select name="clientId">${clientOptions(data.clientId || '')}</select><span class="helper">يمكنك إدارة العملاء من صفحة العملاء.</span></div><div class="form-field"><label>الحالة</label><select name="status">${Object.entries(PROJECT_STATUS).map(([key, value]) => `<option value="${key}" ${data.status === key ? 'selected' : ''}>${value}</option>`).join('')}</select></div><div class="form-field"><label>قيمة الاتفاق</label><input name="amount" type="number" min="0" step="any" value="${data.amount}" placeholder="0"/></div><div class="form-field"><label>العملة</label><select name="currency">${currencyOptions(data.currency || state.currency)}</select></div><div class="form-field full"><label>موعد التسليم (اختياري)</label><input name="dueDate" type="date" value="${data.dueDate || ''}"/></div><div class="form-field full"><label>ملاحظات</label><textarea name="notes" maxlength="220">${escapeHTML(data.notes || '')}</textarea></div></div><div class="modal-actions">${project ? `<button type="button" class="button button-danger button-sm" data-action="delete-project" data-id="${project.id}">حذف المشروع</button>` : ''}<span style="flex:1"></span><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">${project ? 'حفظ التعديلات' : 'حفظ المشروع'}</button></div></form>`;
    showModal(project ? 'تعديل المشروع' : 'مشروع جديد', 'اربط الدفعات والمصروفات بالمشروع لعرض أدائه المالي.', body);
  }
  function clientModal(client = null) {
    const data = client || { name: '', role: 'client', phone: '', email: '', notes: '' };
    const body = `<form class="modal-form" id="clientForm"><input type="hidden" name="id" value="${client?.id || ''}"/><div class="form-grid"><div class="form-field full"><label>اسم العميل أو الجهة <span class="required">*</span></label><input name="name" required maxlength="80" value="${escapeHTML(data.name)}" placeholder="الاسم أو اسم الشركة"/></div><div class="form-field"><label>نوع الجهة</label><select name="role">${Object.entries(ROLE_NAMES).map(([key, value]) => `<option value="${key}" ${(data.role || 'client') === key ? 'selected' : ''}>${value}</option>`).join('')}</select></div><div class="form-field"><label>رقم الهاتف</label><input name="phone" type="tel" maxlength="35" value="${escapeHTML(data.phone || '')}" placeholder="+967 أو +966"/></div><div class="form-field"><label>البريد الإلكتروني</label><input name="email" type="email" maxlength="90" value="${escapeHTML(data.email || '')}" placeholder="name@example.com"/></div><div class="form-field full"><label>ملاحظات</label><textarea name="notes" maxlength="220">${escapeHTML(data.notes || '')}</textarea></div></div><div class="modal-actions">${client ? `<button type="button" class="button button-danger button-sm" data-action="delete-client" data-id="${client.id}">حذف العميل</button>` : ''}<span style="flex:1"></span><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">${client ? 'حفظ التعديلات' : 'حفظ العميل'}</button></div></form>`;
    showModal(client ? 'تعديل بيانات العميل' : 'إضافة عميل', 'بيانات العميل تساعدك على ربط المشاريع والدفعات بشكل منظم.', body);
  }
  function profileModal() {
    const body = `<form class="modal-form" id="profileForm"><div class="form-grid"><div class="form-field full"><label>اسمك أو اسم نشاطك</label><input name="name" required maxlength="60" value="${escapeHTML(state.profile?.name || '')}"/></div><div class="form-field"><label>عملة العرض الافتراضية</label><select name="currency">${currencyOptions(state.profile?.currency || state.currency)}</select></div></div><p class="modal-note">الملف الشخصي محفوظ محليًا على هذا الجهاز ولا يمثل تسجيل دخول سحابيًا.</p><div class="modal-actions"><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">حفظ الملف</button></div></form>`;
    showModal('ملفي المالي', 'حدّث بيانات المساحة التي تظهر في التطبيق.', body);
  }

  function debtModal(direction = 'receivable', contactId = '') {
    const contact = clientById(contactId);
    const body = `<form class="modal-form" id="debtForm"><div class="form-grid"><div class="form-field full"><label>نوع السجل</label><div class="radio-row"><label class="radio-option"><input type="radio" name="direction" value="receivable" ${direction === 'receivable' ? 'checked' : ''}><span>مبلغ مستحق لي</span></label><label class="radio-option expense"><input type="radio" name="direction" value="payable" ${direction === 'payable' ? 'checked' : ''}><span>التزام عليّ</span></label></div></div><div class="form-field"><label>جهة مسجلة (اختياري)</label><select name="contactId"><option value="">إضافة جهة جديدة من الاسم</option>${state.clients.map(item => `<option value="${item.id}" ${item.id === contactId ? 'selected' : ''}>${escapeHTML(item.name)} · ${ROLE_NAMES[item.role] || ROLE_NAMES.client}</option>`).join('')}</select></div><div class="form-field"><label id="debtPersonLabel">${direction === 'payable' ? 'المتعاون أو المستفيد' : 'العميل أو الجهة'} <span class="required">*</span></label><input name="person" required maxlength="70" value="${escapeHTML(contact?.name || '')}" placeholder="اسم العميل أو المنفذ أو الوكالة"/></div><div class="form-field"><label>المبلغ الأصلي <span class="required">*</span></label><input name="amount" type="number" min="0.01" step="any" required placeholder="0.00"/></div><div class="form-field"><label>العملة</label><select name="currency">${currencyOptions(state.currency)}</select></div><div class="form-field"><label>تاريخ تسجيل المبلغ</label><input name="debtDate" type="date" value="${toISO(Date.now())}" required/></div><div class="form-field"><label>تاريخ الاستحقاق (اختياري)</label><input name="dueDate" type="date"/></div><div class="form-field"><label>المشروع (اختياري)</label><select name="projectId">${projectOptions('', state.currency)}</select></div><div class="form-field full"><label>سبب المبلغ أو تفاصيله</label><input name="description" maxlength="120" placeholder="مثال: دفعة متبقية من المشروع أو أجرة تنفيذ"/></div><div class="form-field full" id="debtLinkedIncomeField"><label>الدخل المرتبط بتكلفة هذا العمل</label><select name="linkedIncomeId">${incomeOptions('', state.currency)}</select></div><div class="form-field full" id="recognizeExpenseField"><label class="check-option"><input type="checkbox" name="recognizeExpense" checked/><span>احتساب الالتزام كمصروف على المشروع من تاريخ تسجيله</span></label><span class="helper">يظهر ضمن تكلفة المشروع والالتزامات، ولا يخصم من الحساب إلا عند تسجيل السداد.</span></div></div><div class="modal-actions"><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">حفظ السجل</button></div></form>`;
    showModal('إضافة مستحق أو التزام', 'اربطه بشخص أو شركة ومشروع، ثم سجّل الدفعات عند حدوثها.', body);
    const form = $('#debtForm');
    function syncDebtFields() {
      const payable = new FormData(form).get('direction') === 'payable';
      $('#recognizeExpenseField').hidden = !payable;
      $('#debtLinkedIncomeField').hidden = !payable;
      $('#debtPersonLabel').innerHTML = `${payable ? 'المتعاون أو المستفيد' : 'العميل أو الجهة'} <span class="required">*</span>`;
      const currency = $('select[name=currency]', form).value;
      const projectSelect = $('select[name=projectId]', form);
      const selectedProject = projectSelect.value;
      projectSelect.innerHTML = projectOptions(selectedProject, currency);
      if (selectedProject && ![...projectSelect.options].some(option => option.value === selectedProject)) projectSelect.value = '';
      const incomeSelect = $('select[name=linkedIncomeId]', form);
      const selectedIncome = incomeSelect.value;
      incomeSelect.innerHTML = incomeOptions(selectedIncome, currency);
      if (!payable || (selectedIncome && !state.transactions.some(item => item.id === selectedIncome && item.currency === currency))) incomeSelect.value = '';
    }
    form.addEventListener('change', event => {
      if (event.target.name === 'direction' || event.target.name === 'currency') syncDebtFields();
      if (event.target.name === 'contactId') { const contact = clientById(event.target.value); if (contact) $('input[name=person]', form).value = contact.name; }
      if (event.target.name === 'projectId') { const project = projectById(event.target.value); if (project?.clientId) $('select[name=contactId]', form).value = project.clientId; const contact = clientById($('select[name=contactId]', form).value); if (contact) $('input[name=person]', form).value = contact.name; }
    });
    syncDebtFields();
  }
  function accountGroupsOptions() { return ['SAR', 'YER', 'USD'].map(currency => currencyAccounts(currency).length ? `<optgroup label="${CURRENCY_NAMES[currency]}">${currencyAccounts(currency).map(a => `<option value="${a.id}">${escapeHTML(a.name)} — ${currency}</option>`).join('')}</optgroup>` : '').join(''); }

  function paymentModal(debt) {
    const collection = debt.direction === 'receivable';
    const accounts = matchingAccounts(debt.currency);
    const body = `<form class="modal-form" id="debtPaymentForm"><input type="hidden" name="debtId" value="${debt.id}"/><div class="form-grid"><div class="form-field full"><label>الجهة</label><input value="${escapeHTML(debt.person)} — متبقٍ ${nfmt(debt.remaining)} ${CURRENCIES[debt.currency]}" disabled/></div><div class="form-field"><label>مبلغ ${collection ? 'التحصيل' : 'السداد'} <span class="required">*</span></label><input name="amount" type="number" min="0.01" max="${debt.remaining}" step="any" required value="${debt.remaining}"/></div><div class="form-field"><label>الحساب <span class="required">*</span></label>${accountSelect('accountId', accounts)}</div><div class="form-field"><label>التاريخ</label><input name="date" type="date" value="${toISO(Date.now())}" required/></div><div class="form-field full"><label>ملاحظة (اختياري)</label><input name="note" maxlength="120" placeholder="دفعة أولى، سداد كامل..."/></div></div><p class="modal-note" style="margin-top:12px">سيُحدّث المبلغ المتبقي في سجل الدين ورصيد الحساب المختار.</p><div class="modal-actions"><button type="button" class="button button-secondary" data-action="close-modal">إلغاء</button><button type="submit" class="button button-primary">تأكيد ${collection ? 'التحصيل' : 'السداد'}</button></div></form>`;
    showModal(collection ? 'تسجيل تحصيل' : 'تسجيل سداد', 'سجّل دفعة على هذا الدين.', body);
  }

  function csvCell(value) { return `"${String(value ?? '').replace(/"/g, '""')}"`; }
  function downloadFile(filename, mime, content) {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    if (window.RaseedAndroid && typeof window.RaseedAndroid.saveFile === 'function') {
      const reader = new FileReader();
      reader.onload = () => window.RaseedAndroid.saveFile(filename, mime, String(reader.result).split(',')[1] || '');
      reader.onerror = () => toast('تعذر تجهيز الملف للتنزيل.', 'error');
      reader.readAsDataURL(blob);
      toast('اختر مكان حفظ الملف من النافذة التي ظهرت.');
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    toast('تم تنزيل الملف.');
  }
  function downloadCSV(rows, filename) {
    const csv = '\ufeff' + rows.map(row => row.map(csvCell).join(',')).join('\r\n');
    downloadFile(filename, 'text/csv', csv);
  }
  function exportBackup() {
    const backup = { application: 'raseed-finance', exportedAt: new Date().toISOString(), data: state };
    downloadFile(`raseed-backup-${toISO(Date.now())}.json`, 'application/json', JSON.stringify(backup, null, 2));
  }
  function importBackupFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onerror = () => toast('تعذر قراءة ملف النسخة الاحتياطية.', 'error');
    reader.onload = () => {
      try {
        const backup = JSON.parse(String(reader.result || ''));
        const imported = backup?.application === 'raseed-finance' ? backup.data : backup;
        if (!imported || ![1, 2, 3].includes(imported.version) || !Array.isArray(imported.accounts) || !Array.isArray(imported.transactions)) throw new Error('invalid backup');
        if (!window.confirm('سيتم استبدال السجلات الحالية بسجلات النسخة الاحتياطية. هل تريد المتابعة؟')) return;
        state = { ...emptyState(), ...imported, version: 3 };
        state.profile = { ...emptyState().profile, ...(imported.profile || {}) };
        state.projects = Array.isArray(imported.projects) ? imported.projects : [];
        state.clients = (Array.isArray(imported.clients) ? imported.clients : []).map(contact => ({ ...contact, role: contact.role || 'client' }));
        state.debts = (Array.isArray(imported.debts) ? imported.debts : []).map(debt => ({ ...debt, expenseRecognized: Boolean(debt.expenseRecognized) }));
        state.schedules = Array.isArray(imported.schedules) ? imported.schedules : [];
        state.categories = Array.isArray(imported.categories) && imported.categories.length ? imported.categories : DEFAULT_CATEGORIES.map(item => ({ ...item }));
        state.setupComplete = Boolean(imported.setupComplete || state.accounts.length);
        reportCurrency = state.currency || 'SAR'; reportAccount = 'all';
        saveState(); activePage = 'dashboard'; renderPage(); toast('تم استعادة السجلات من النسخة الاحتياطية.');
      } catch (error) { toast('الملف غير صالح أو ليس نسخة احتياطية من رصيد.', 'error'); }
    };
    reader.readAsText(file);
  }
  function exportTransactions(list = state.transactions, filename = 'raseed-transactions.csv') {
    const rows = [['التاريخ', 'النوع', 'الوصف', 'التصنيف', 'مصدر الدخل', 'الجهة', 'الحساب', 'المشروع', 'المبلغ المرسل', 'العملة', 'المبلغ المستلم', 'عملة الاستلام', 'رسوم الصراف', 'مرتبط بدخل', 'ملاحظة']];
    [...list].sort((a, b) => a.date.localeCompare(b.date)).forEach(tx => rows.push([tx.date, TYPE_NAMES[tx.kind], tx.title, tx.category, INCOME_SOURCE_NAMES[tx.sourceType] || '', transactionParty(tx), transactionAccountText(tx), projectById(tx.projectId)?.name || '', tx.amount, tx.currency, tx.receivedAmount || '', tx.toCurrency || '', tx.fee || '', state.transactions.find(item => item.id === tx.linkedIncomeId)?.title || '', tx.note]));
    downloadCSV(rows, filename);
  }
  function exportMonth() {
    const month = state.dashboardMonth || toISO(Date.now()).slice(0, 7);
    const currency = activePage === 'reports' ? reportCurrency : state.currency;
    const account = accountById(reportAccount);
    const list = state.transactions.filter(tx => monthKey(tx.date) === month && transactionTouchesCurrency(tx, currency) && (!account || [tx.accountId, tx.fromAccountId, tx.toAccountId].includes(account.id)));
    exportTransactions(list, `raseed-${month}-${currency}${account ? `-${account.id}` : ''}.csv`);
  }

  function buildReportPdfHtml() {
    const month = state.dashboardMonth || toISO(Date.now()).slice(0, 7);
    const currency = activePage === 'reports' ? reportCurrency : state.currency;
    const account = activePage === 'reports' ? accountById(reportAccount) : null;
    const first = `${month}-01`;
    const [year, monthNumber] = month.split('-').map(Number);
    const next = toISO(new Date(year, monthNumber, 1, 12));
    const allMonth = state.transactions.filter(tx => monthKey(tx.date) === month && transactionTouchesCurrency(tx, currency));
    const txs = allMonth.filter(tx => !account || [tx.accountId, tx.fromAccountId, tx.toAccountId].includes(account.id));
    const income = txs.filter(tx => ['income', 'debt_collection'].includes(tx.kind) && tx.currency === currency).reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const expenses = txs.filter(tx => tx.currency === currency && (tx.kind === 'debt_payment' || (tx.kind === 'expense' && !tx.isAccrued))).reduce((sum, tx) => sum + Number(tx.amount || 0), 0) + txs.filter(tx => tx.kind === 'exchange' && tx.currency === currency).reduce((sum, tx) => sum + Number(tx.fee || 0), 0);
    const accrued = allMonth.filter(tx => tx.kind === 'expense' && tx.isAccrued && tx.currency === currency).reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const fmt = value => `${nfmt(value)} ${CURRENCIES[currency]}`;
    const deltaLabel = delta => `${delta < 0 ? '−' : '+'}${nfmt(Math.abs(delta))} ${CURRENCIES[currency]}`;
    const categoryTotals = {};
    txs.filter(tx => tx.currency === currency && tx.kind === 'expense' && !tx.isAccrued).forEach(tx => { const category = tx.category || 'مصروف آخر'; categoryTotals[category] = (categoryTotals[category] || 0) + Number(tx.amount || 0); });
    txs.filter(tx => tx.currency === currency && tx.kind === 'debt_payment').forEach(tx => { const category = tx.category || 'تسوية مستحق'; categoryTotals[category] = (categoryTotals[category] || 0) + Number(tx.amount || 0); });
    txs.filter(tx => tx.kind === 'exchange' && tx.currency === currency && Number(tx.fee || 0) > 0).forEach(tx => { categoryTotals['رسوم صرافة'] = (categoryTotals['رسوم صرافة'] || 0) + Number(tx.fee || 0); });
    const categoryRows = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).map(([name, total]) => `<tr><td>${escapeHTML(name)}</td><td>${fmt(total)}</td></tr>`).join('') || '<tr><td colspan="2" class="empty">لا توجد مصروفات مسجلة خلال هذه الفترة.</td></tr>';
    const sorted = [...txs].sort((a, b) => a.date.localeCompare(b.date) || (a.createdAt || '').localeCompare(b.createdAt || ''));
    let running = account ? accountBalanceBefore(account.id, first) : 0;
    const opening = running;
    const ledgerRows = sorted.map(tx => {
      const party = transactionParty(tx);
      if (account) {
        const delta = transactionDelta(tx, account.id);
        running += delta;
        return `<tr><td>${prettyDate(tx.date)}</td><td><strong>${escapeHTML(tx.title || TYPE_NAMES[tx.kind])}</strong><small>${escapeHTML(TYPE_NAMES[tx.kind])} · ${escapeHTML(tx.category || '')} · ${escapeHTML(party)}</small></td><td>${deltaLabel(delta)}</td><td>${nfmt(running)} ${CURRENCIES[currency]}</td></tr>`;
      }
      let amountText = `${nfmt(tx.amount)} ${CURRENCIES[tx.currency]}`;
      let accountText = transactionAccountText(tx);
      if (tx.kind === 'exchange') amountText = `${nfmt(tx.amount)} ${CURRENCIES[tx.currency]} ← ${nfmt(tx.receivedAmount)} ${CURRENCIES[tx.toCurrency]}${tx.fee ? ` · رسوم ${nfmt(tx.fee)}` : ''}`;
      if (tx.kind === 'transfer') accountText = `${accountById(tx.fromAccountId)?.name || '—'} ← ${accountById(tx.toAccountId)?.name || '—'}`;
      if (tx.isAccrued) amountText += ' · غير مدفوع';
      return `<tr><td>${prettyDate(tx.date)}</td><td><strong>${escapeHTML(tx.title || TYPE_NAMES[tx.kind])}</strong><small>${escapeHTML(TYPE_NAMES[tx.kind])} · ${escapeHTML(tx.category || '')}</small></td><td>${escapeHTML(party)}</td><td>${escapeHTML(accountText)}</td><td>${escapeHTML(amountText)}</td></tr>`;
    }).join('') || `<tr><td colspan="${account ? 4 : 5}" class="empty">لا توجد عمليات مسجلة في ${monthName(month)}.</td></tr>`;
    const openingRow = account ? `<tr class="balance-row"><td colspan="2">الرصيد الافتتاحي في ${prettyDate(first)}</td><td colspan="2">${nfmt(opening)} ${CURRENCIES[currency]}</td></tr>` : '';
    const closing = account ? accountBalanceBefore(account.id, next) : 0;
    const closingRow = account ? `<tr class="balance-row closing"><td colspan="2">الرصيد الختامي في ${prettyDate(toISO(new Date(year, monthNumber + 1, 0, 12)))}</td><td colspan="2">${nfmt(closing)} ${CURRENCIES[currency]}</td></tr>` : '';
    const netIncomeRows = txs.filter(tx => tx.currency === currency && ['income', 'debt_collection'].includes(tx.kind)).sort((a, b) => a.date.localeCompare(b.date)).map(tx => {
      const costs = state.transactions.filter(item => item.linkedIncomeId === tx.id && item.currency === currency && item.kind === 'expense').reduce((sum, item) => sum + Number(item.amount || 0), 0);
      return `<tr><td>${prettyDate(tx.date)}</td><td>${escapeHTML(tx.title || 'دخل')}<small>${escapeHTML(transactionParty(tx))} · ${escapeHTML(projectById(tx.projectId)?.name || '')}</small></td><td>${fmt(tx.amount)}</td><td>${fmt(costs)}</td><td>${fmt(tx.amount - costs)}</td></tr>`;
    }).join('') || '<tr><td colspan="5" class="empty">لا توجد إيرادات مرتبطة بتكاليف في هذه الفترة.</td></tr>';
    const openDebts = state.debts.filter(debt => debt.currency === currency && Number(debt.remaining) > 0).sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999')).map(debt => `<tr><td>${escapeHTML(debt.person)}<small>${escapeHTML(debt.description || '—')} · ${escapeHTML(projectById(debt.projectId)?.name || '')}</small></td><td>${debt.direction === 'receivable' ? 'مستحق لي' : 'التزام عليّ'}</td><td>${nfmt(debt.remaining)} ${CURRENCIES[currency]}</td><td>${prettyDate(debt.dueDate)}</td><td>${Number(debt.remaining) > 0 && debt.dueDate && debt.dueDate < toISO(Date.now()) ? 'متأخر' : 'مفتوح'}</td></tr>`).join('') || '<tr><td colspan="5" class="empty">لا توجد مستحقات مفتوحة بهذه العملة.</td></tr>';
    const title = `كشف رصيد — ${monthName(month)} — ${currency}`;
    const ledgerHead = account ? '<tr><th>التاريخ</th><th>العملية والجهة</th><th>الحركة</th><th>الرصيد</th></tr>' : '<tr><th>التاريخ</th><th>العملية والتصنيف</th><th>الجهة</th><th>الحساب</th><th>المبلغ</th></tr>';
    return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(title)}</title><style>
      @page{size:A4;margin:13mm 12mm 15mm}*{box-sizing:border-box}html{direction:rtl}body{margin:0;color:#202a37;font-family:Arial,"Noto Naskh Arabic",sans-serif;font-size:10px;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact}.report{width:100%}.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #d71939;padding:0 0 12px;margin-bottom:16px}.brand{font-size:22px;font-weight:800;color:#d71939}.brand small{display:block;color:#596474;font-size:9px;font-weight:500}.meta{text-align:left;color:#697587;font-size:9px}.meta strong{display:block;color:#28364a;font-size:12px;margin-bottom:3px}.subhead{margin:0 0 12px;color:#596474;font-size:10px}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:10px 0 16px}.metric{border:1px solid #e2e7ed;border-radius:7px;padding:9px 10px;background:#f9fafc}.metric span{display:block;color:#6b7687;font-size:8px}.metric b{display:block;margin-top:3px;font-size:12px;color:#243247;direction:rtl}.metric.income b{color:#14815d}.metric.expense b{color:#bd4c50}.section{margin:15px 0 0;break-inside:auto}.section-title{margin:0 0 7px;border-right:3px solid #d71939;padding:2px 8px 2px 0;font-size:12px;color:#29384c;break-after:avoid}.note{margin:0 0 8px;color:#737f8f;font-size:8px}.table-wrap{width:100%;overflow:visible}table{width:100%;border-collapse:collapse;table-layout:auto;font-size:8.5px}thead{display:table-header-group}tr{break-inside:avoid}th{background:#f0f2f5;color:#465368;text-align:right;font-weight:700}th,td{padding:6px 7px;border-bottom:1px solid #e5e8ed;vertical-align:top}td{color:#344154}td strong{display:block;font-size:8.5px}td small{display:block;color:#7b8796;font-size:7.5px;line-height:1.45}.empty{text-align:center;color:#7a8593;padding:15px}.balance-row td{background:#f8f9fb;font-weight:700;color:#35445a}.closing td{background:#edf4f2;color:#136f55}.footer{border-top:1px solid #e1e5ea;margin-top:18px;padding-top:7px;display:flex;justify-content:space-between;color:#8a94a1;font-size:7.5px}.totals-line{display:flex;justify-content:space-between;padding:7px 9px;background:#f7f8fa;border:1px solid #e5e8ed;border-radius:6px;font-size:9px;margin-top:7px}.nowrap{white-space:nowrap}@media print{.section{break-inside:auto}button{display:none}}
      </style></head><body><main class="report"><header class="header"><div class="brand">رَصيد<small>كشف مالي منظم</small></div><div class="meta"><strong>${escapeHTML(state.profile?.name || 'ملفي المالي')}</strong>${escapeHTML(title)}<br>تاريخ الإصدار: ${prettyDate(toISO(Date.now()))}</div></header><p class="subhead">${account ? `كشف حساب ${escapeHTML(account.name)} · ${CURRENCY_NAMES[currency]}` : `ملخص جميع الحسابات بعملة ${CURRENCY_NAMES[currency]}`} · الفترة من ${prettyDate(first)} إلى ${prettyDate(toISO(new Date(year, monthNumber + 1, 0, 12)))}</p><section class="metrics"><div class="metric income"><span>الدخل المقبوض</span><b>${fmt(income)}</b></div><div class="metric expense"><span>المصروف المدفوع</span><b>${fmt(expenses)}</b></div><div class="metric"><span>صافي الحركة</span><b>${fmt(income - expenses)}</b></div><div class="metric"><span>مصروفات مستحقة غير مدفوعة</span><b>${fmt(accrued)}</b></div></section>${account ? `<div class="totals-line"><span>رصيد افتتاحي: <b>${nfmt(opening)} ${CURRENCIES[currency]}</b></span><span>رصيد ختامي: <b>${nfmt(closing)} ${CURRENCIES[currency]}</b></span></div>` : ''}<section class="section"><h2 class="section-title">كشف العمليات${account ? ` — ${escapeHTML(account.name)}` : ''}</h2><p class="note">${txs.length} حركة · المبالغ والعملات معروضة كما سُجلت، دون تحويل آلي بين العملات.</p><div class="table-wrap"><table><thead>${ledgerHead}</thead><tbody>${openingRow}${ledgerRows}${closingRow}</tbody></table></div></section><section class="section"><h2 class="section-title">المصروفات حسب التصنيف</h2><div class="table-wrap"><table><thead><tr><th>التصنيف</th><th>الإجمالي</th></tr></thead><tbody>${categoryRows}</tbody></table></div></section><section class="section"><h2 class="section-title">صافي الدخل بعد تكاليفه المرتبطة</h2><div class="table-wrap"><table><thead><tr><th>التاريخ</th><th>مصدر الدخل والجهة</th><th>الإجمالي</th><th>التكاليف</th><th>الصافي</th></tr></thead><tbody>${netIncomeRows}</tbody></table></div></section><section class="section"><h2 class="section-title">المستحقات المفتوحة حتى تاريخ الإصدار</h2><div class="table-wrap"><table><thead><tr><th>الجهة والتفاصيل</th><th>النوع</th><th>المتبقي</th><th>الاستحقاق</th><th>الحالة</th></tr></thead><tbody>${openDebts}</tbody></table></div></section><footer class="footer"><span>تم إنشاء هذا الكشف من سجلات رصيد على هذا الجهاز.</span><span>${escapeHTML(title)}</span></footer></main></body></html>`;
  }

  function exportReportPdf() {
    const html = buildReportPdfHtml();
    const month = state.dashboardMonth || toISO(Date.now()).slice(0, 7);
    const currency = activePage === 'reports' ? reportCurrency : state.currency;
    const filename = `raseed-statement-${month}-${currency}`;
    if (window.RaseedAndroid && typeof window.RaseedAndroid.printHtml === 'function') {
      window.RaseedAndroid.printHtml(html, filename);
      toast('اختر «حفظ كملف PDF» من نافذة الطباعة لحفظ الكشف.');
      return;
    }
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:1px;height:1px;border:0';
    document.body.append(frame);
    const printWindow = frame.contentWindow;
    printWindow.document.open(); printWindow.document.write(html); printWindow.document.close();
    printWindow.addEventListener('afterprint', () => frame.remove(), { once: true });
    setTimeout(() => { printWindow.focus(); printWindow.print(); }, 350);
  }

  function addTransaction(formData) {
    const kind = formData.get('kind');
    if (!['income', 'expense', 'transfer', 'exchange'].includes(kind)) return toast('اختر نوع عملية صحيحًا.', 'error');
    const amount = safeNumber(formData.get('amount'));
    const account = accountById(formData.get('accountId'));
    const toAccount = ['transfer', 'exchange'].includes(kind) ? accountById(formData.get('toAccountId')) : null;
    const receivedAmount = safeNumber(formData.get('receivedAmount'));
    const fee = safeNumber(formData.get('fee'));
    if (!amount || amount <= 0 || !account) return toast('تحقق من المبلغ والحساب.', 'error');
    if (kind === 'transfer' && (!toAccount || toAccount.id === account.id || toAccount.currency !== account.currency)) return toast('التحويل الداخلي يتطلب حساب وجهة مختلفًا بالعملة نفسها.', 'error');
    if (kind === 'exchange' && (!toAccount || toAccount.id === account.id || toAccount.currency === account.currency || receivedAmount <= 0 || fee < 0)) return toast('للمصارفة اختر حسابًا بعملة مختلفة وأدخل المبلغ المستلم.', 'error');
    const projectId = String(formData.get('projectId') || '');
    const project = projectById(projectId);
    if (project && project.currency !== account.currency) return toast('عملة المشروع لا تطابق عملة الحساب المختار.', 'error');
    const clientId = String(project?.clientId || formData.get('clientId') || '');
    const linkedIncomeId = String(formData.get('linkedIncomeId') || '');
    const linkedIncome = state.transactions.find(item => item.id === linkedIncomeId);
    if (linkedIncomeId && (kind !== 'expense' || !linkedIncome || !['income', 'debt_collection'].includes(linkedIncome.kind) || linkedIncome.currency !== account.currency)) return toast('اختر دخلًا مسجلًا بالعملة نفسها أو أزل الربط.', 'error');
    const title = String(formData.get('title') || '').trim();
    if (!title) return toast('أدخل وصفًا للعملية.', 'error');
    const tx = { id: uid('t'), date: formData.get('date') || toISO(Date.now()), kind, amount, currency: account.currency, accountId: account.id, fromAccountId: ['transfer', 'exchange'].includes(kind) ? account.id : '', toAccountId: toAccount?.id || '', toCurrency: kind === 'exchange' ? toAccount.currency : '', receivedAmount: kind === 'exchange' ? receivedAmount : 0, fee: kind === 'exchange' ? fee : 0, sourceType: kind === 'income' ? String(formData.get('sourceType') || 'other') : '', linkedIncomeId: kind === 'expense' ? linkedIncomeId : '', title, category: String(formData.get('category') || (kind === 'income' ? 'دخل آخر' : 'مصروف آخر')).trim(), clientId, projectId: ['transfer', 'exchange'].includes(kind) ? '' : projectId, party: String(formData.get('party') || '').trim() || clientById(clientId)?.name || '', note: String(formData.get('note') || '').trim(), createdAt: new Date().toISOString() };
    ensureCategory(kind, tx.category);
    state.transactions.push(tx);
    if (kind === 'income' && tx.sourceType === 'salary') tx.category = tx.category || 'راتب وعقد';
    saveState(); closeModal(); renderPage(); toast(kind === 'exchange' ? 'تم تسجيل المصارفة وتحديث رصيدي الحسابين.' : 'تم حفظ العملية وتحديث رصيد الحساب.');
  }
  function updateTransaction(formData) {
    const tx = state.transactions.find(item => item.id === formData.get('id'));
    const kind = formData.get('kind');
    if (!['income', 'expense', 'transfer', 'exchange'].includes(kind)) return toast('اختر نوع عملية صحيحًا.', 'error');
    const amount = safeNumber(formData.get('amount'));
    const account = accountById(formData.get('accountId'));
    const toAccount = ['transfer', 'exchange'].includes(kind) ? accountById(formData.get('toAccountId')) : null;
    const receivedAmount = safeNumber(formData.get('receivedAmount'));
    const fee = safeNumber(formData.get('fee'));
    if (!tx || !account || amount <= 0) return toast('تحقق من المبلغ والحساب.', 'error');
    if (kind === 'transfer' && (!toAccount || toAccount.id === account.id || toAccount.currency !== account.currency)) return toast('التحويل الداخلي يتطلب حساب وجهة مختلفًا بالعملة نفسها.', 'error');
    if (kind === 'exchange' && (!toAccount || toAccount.id === account.id || toAccount.currency === account.currency || receivedAmount <= 0 || fee < 0)) return toast('للمصارفة اختر حسابًا بعملة مختلفة وأدخل المبلغ المستلم.', 'error');
    const projectId = String(formData.get('projectId') || '');
    const project = projectById(projectId);
    if (project && project.currency !== account.currency) return toast('عملة المشروع لا تطابق عملة الحساب المختار.', 'error');
    const clientId = String(project?.clientId || formData.get('clientId') || '');
    const linkedIncomeId = String(formData.get('linkedIncomeId') || '');
    const linkedIncome = state.transactions.find(item => item.id === linkedIncomeId);
    if (linkedIncomeId && (kind !== 'expense' || !linkedIncome || !['income', 'debt_collection'].includes(linkedIncome.kind) || linkedIncome.currency !== account.currency || linkedIncome.id === tx.id)) return toast('اختر دخلًا مسجلًا بالعملة نفسها أو أزل الربط.', 'error');
    const incomeDependents = tx.kind === 'income' && (state.transactions.some(item => item.linkedIncomeId === tx.id) || state.debts.some(item => item.linkedIncomeId === tx.id));
    if (incomeDependents && (kind !== 'income' || account.currency !== tx.currency)) return toast('أزل روابط المصروفات والمستحقات أولًا قبل تغيير نوع أو عملة هذا الدخل.', 'error');
    const title = String(formData.get('title') || '').trim();
    const category = String(formData.get('category') || (kind === 'income' ? 'دخل آخر' : 'مصروف آخر')).trim();
    if (!title) return toast('أدخل وصفًا للعملية.', 'error');
    ensureCategory(kind, category);
    Object.assign(tx, { kind, amount, currency: account.currency, accountId: account.id, fromAccountId: ['transfer', 'exchange'].includes(kind) ? account.id : '', toAccountId: toAccount?.id || '', toCurrency: kind === 'exchange' ? toAccount.currency : '', receivedAmount: kind === 'exchange' ? receivedAmount : 0, fee: kind === 'exchange' ? fee : 0, sourceType: kind === 'income' ? String(formData.get('sourceType') || 'other') : '', linkedIncomeId: kind === 'expense' ? linkedIncomeId : '', title, date: formData.get('date') || tx.date || toISO(Date.now()), category, clientId, projectId: ['transfer', 'exchange'].includes(kind) ? '' : projectId, party: String(formData.get('party') || '').trim() || clientById(clientId)?.name || '', note: String(formData.get('note') || '').trim() });
    saveState(); closeModal(); renderPage(); toast('تم تحديث العملية وإعادة احتساب الأرصدة.');
  }
  function addAccount(formData) {
    const kind = formData.get('kind');
    const account = { id: uid('a'), name: String(formData.get('name') || '').trim(), kind, provider: normalizedProvider(kind, formData.get('provider')), currency: formData.get('currency'), openingBalance: safeNumber(formData.get('openingBalance')) };
    if (!account.name) return toast('أدخل اسم الحساب.', 'error');
    state.accounts.push(account); saveState(); closeModal(); renderPage(); toast('تمت إضافة الحساب.');
  }
  function saveProject(formData) {
    const id = String(formData.get('id') || '');
    const name = String(formData.get('name') || '').trim();
    const amount = safeNumber(formData.get('amount'));
    if (!name || amount < 0) return toast('تحقق من اسم المشروع وقيمته.', 'error');
    const values = { name, clientId: String(formData.get('clientId') || ''), amount, currency: formData.get('currency'), status: formData.get('status'), dueDate: formData.get('dueDate') || '', notes: String(formData.get('notes') || '').trim(), updatedAt: new Date().toISOString() };
    if (id) {
      const current = projectById(id);
      const hasLedgerItems = state.transactions.some(tx => tx.projectId === id) || state.debts.some(debt => debt.projectId === id) || state.schedules.some(item => item.projectId === id);
      if (current && current.currency !== values.currency && hasLedgerItems) return toast('لا يمكن تغيير عملة مشروع مرتبط بحركات أو مستحقات محفوظة.', 'error');
      Object.assign(current, values);
    } else state.projects.push({ id: uid('p'), ...values });
    const returnPage = modalReturnPage;
    saveState(); closeModal(); activePage = returnPage === 'dashboard' ? 'projects' : returnPage; renderPage(); toast(id ? 'تم تحديث المشروع.' : 'تمت إضافة المشروع.');
  }
  function deleteProject(id) {
    const project = projectById(id);
    if (!project || !window.confirm(`حذف المشروع «${project.name}»؟ ستبقى العمليات محفوظة دون ربط بالمشروع.`)) return;
    state.transactions.forEach(tx => { if (tx.projectId === id) tx.projectId = ''; });
    state.debts.forEach(debt => { if (debt.projectId === id) debt.projectId = ''; });
    state.schedules.forEach(schedule => { if (schedule.projectId === id) schedule.projectId = ''; });
    state.projects = state.projects.filter(item => item.id !== id);
    saveState(); closeModal(); renderPage(); toast('تم حذف المشروع مع الاحتفاظ بسجل العمليات.');
  }
  function saveClient(formData) {
    const id = String(formData.get('id') || '');
    const name = String(formData.get('name') || '').trim();
    if (!name) return toast('أدخل اسم العميل.', 'error');
    const values = { name, role: String(formData.get('role') || 'client'), phone: String(formData.get('phone') || '').trim(), email: String(formData.get('email') || '').trim(), notes: String(formData.get('notes') || '').trim() };
    if (id) Object.assign(clientById(id), values);
    else state.clients.push({ id: uid('c'), ...values });
    const returnPage = modalReturnPage;
    saveState(); closeModal(); activePage = returnPage === 'dashboard' ? 'clients' : returnPage; renderPage(); toast(id ? 'تم تحديث العميل.' : 'تمت إضافة العميل.');
  }
  function deleteClient(id) {
    const client = clientById(id);
    if (!client || !window.confirm(`حذف العميل «${client.name}»؟ ستبقى المشاريع والعمليات محفوظة دون ربط به.`)) return;
    state.projects.forEach(project => { if (project.clientId === id) project.clientId = ''; });
    state.transactions.forEach(tx => { if (tx.clientId === id) { tx.clientId = ''; tx.party ||= client.name; } });
    state.debts.forEach(debt => { if (debt.contactId === id) debt.contactId = ''; });
    state.schedules.forEach(schedule => { if (schedule.contactId === id) schedule.contactId = ''; });
    state.clients = state.clients.filter(item => item.id !== id);
    saveState(); closeModal(); renderPage(); toast('تم حذف العميل مع الاحتفاظ بالسجلات.');
  }
  function saveOnboardingAccount(formData) {
    const name = String(formData.get('name') || '').trim();
    if (!name) return toast('أدخل اسم الحساب.', 'error');
    const kind = formData.get('kind');
    onboardingAccounts.push({ id: uid('a'), name, kind, provider: normalizedProvider(kind, formData.get('provider')), currency: formData.get('currency'), openingBalance: safeNumber(formData.get('openingBalance')) });
    persistSetupDraft();
    renderPage(); toast('تمت إضافة الحساب إلى الإعداد.');
  }
  function saveOnboardingDebt(formData) {
    const person = String(formData.get('person') || '').trim();
    const amount = safeNumber(formData.get('amount'));
    if (!person || amount <= 0) return toast('أدخل الجهة والمبلغ المتبقي.', 'error');
    onboardingDebts.push({ id: uid('d'), direction: formData.get('direction'), person, original: amount, remaining: amount, currency: formData.get('currency'), dueDate: '', description: String(formData.get('description') || '').trim(), createdAt: toISO(Date.now()) });
    persistSetupDraft();
    renderPage(); toast('تمت إضافة سجل الدين إلى الإعداد.');
  }
  function finishSetup() {
    if (!onboardingAccounts.length) return toast('أضف حسابًا واحدًا على الأقل قبل البدء.', 'error');
    state.accounts = onboardingAccounts;
    state.debts = [...state.debts, ...onboardingDebts];
    state.setupDraft = null;
    state.setupComplete = true;
    state.demo = false;
    state.profile = { ...state.profile, currency: state.profile?.currency || state.currency };
    state.currency = state.profile.currency;
    saveState();
    activePage = 'dashboard';
    onboardingStep = 1; onboardingAccounts = []; onboardingDebts = [];
    renderPage(); toast('أصبحت مساحتك المالية جاهزة.');
  }
  function updateAccount(formData) {
    const account = accountById(formData.get('id'));
    const name = String(formData.get('name') || '').trim();
    if (!account || !name) return toast('أدخل اسمًا صالحًا للحساب.', 'error');
    account.name = name;
    account.kind = formData.get('kind');
    account.provider = normalizedProvider(account.kind, formData.get('provider'));
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
    const selectedContact = clientById(formData.get('contactId'));
    const person = selectedContact?.name || String(formData.get('person') || '').trim();
    const amount = safeNumber(formData.get('amount'));
    const currency = formData.get('currency');
    const debtDate = String(formData.get('debtDate') || toISO(Date.now()));
    const projectId = String(formData.get('projectId') || '');
    const project = projectById(projectId);
    const linkedIncomeId = String(formData.get('linkedIncomeId') || '');
    const linkedIncome = state.transactions.find(item => item.id === linkedIncomeId);
    if (!person || amount <= 0) return toast('تحقق من الاسم والمبلغ.', 'error');
    if (project && project.currency !== currency) return toast('عملة المشروع لا تطابق عملة المستحق.', 'error');
    if (linkedIncomeId && (!linkedIncome || !['income', 'debt_collection'].includes(linkedIncome.kind) || linkedIncome.currency !== currency || direction !== 'payable')) return toast('اختر دخلًا بالعملة نفسها أو أزل الربط.', 'error');
    let contact = selectedContact || state.clients.find(item => item.name.trim().toLowerCase() === person.toLowerCase());
    if (!contact) { contact = { id: uid('c'), name: person, role: direction === 'payable' ? 'collaborator' : 'client', phone: '', email: '', notes: '' }; state.clients.push(contact); }
    const expenseRecognized = direction === 'payable' && formData.get('recognizeExpense') === 'on';
    const debt = { id: uid('d'), direction, person, contactId: contact.id, projectId, description: String(formData.get('description') || '').trim(), currency, original: amount, remaining: amount, dueDate: formData.get('dueDate') || '', linkedIncomeId, expenseRecognized, createdAt: debtDate };
    state.debts.push(debt);
    if (expenseRecognized) state.transactions.push({ id: uid('t'), date: debtDate, kind: 'expense', amount, currency, accountId: '', title: debt.description || `تكلفة مستحقة إلى ${person}`, category: 'أجور ومتعاونون', clientId: contact.id, projectId, linkedIncomeId, party: person, note: 'تكلفة مسجلة كالتزام — لم تُدفع بعد', debtId: debt.id, isAccrued: true, createdAt: new Date().toISOString() });
    saveState(); closeModal(); renderPage(); toast(direction === 'payable' ? 'تم حفظ الالتزام وربطه بسجل الجهة.' : 'تم حفظ المبلغ المستحق وربطه بسجل الجهة.');
  }
  function recordDebtPayment(formData) {
    const debt = state.debts.find(item => item.id === formData.get('debtId'));
    const account = accountById(formData.get('accountId'));
    const amount = safeNumber(formData.get('amount'));
    if (!debt || !account || amount <= 0 || amount > debt.remaining || account.currency !== debt.currency) return toast('تحقق من المبلغ والحساب.', 'error');
    const collection = debt.direction === 'receivable';
    debt.remaining = Math.max(0, debt.remaining - amount);
    const paidExpense = !collection && !debt.expenseRecognized;
    state.transactions.push({ id: uid('t'), date: formData.get('date') || toISO(Date.now()), kind: collection ? 'debt_collection' : paidExpense ? 'expense' : 'debt_payment', amount, currency: debt.currency, accountId: account.id, title: `${collection ? 'تحصيل من' : 'سداد إلى'} ${debt.person}`, category: paidExpense ? 'أجور ومتعاونون' : 'تسوية مستحق', party: debt.person, clientId: debt.contactId || '', projectId: debt.projectId || '', linkedIncomeId: paidExpense ? debt.linkedIncomeId || '' : '', note: String(formData.get('note') || '').trim(), debtId: debt.id, createdAt: new Date().toISOString() });
    saveState(); closeModal(); renderPage(); toast(collection ? 'تم تسجيل التحصيل وتحديث المستحق.' : 'تم تسجيل السداد وتحديث رصيد الجهة والحساب.');
  }
  function deleteTransaction(id) {
    const tx = state.transactions.find(item => item.id === id);
    if (!tx) return;
    if (tx.debtId) return toast('هذه الحركة مرتبطة بسجل دين. راجع سجل الدين قبل حذفها.', 'error');
    if (tx.kind === 'income' && (state.transactions.some(item => item.linkedIncomeId === id) || state.debts.some(item => item.linkedIncomeId === id))) return toast('لا يمكن حذف دخل مرتبط بمصروفات أو التزامات. أزل الروابط أولًا للحفاظ على صافي الدخل.', 'error');
    const ok = window.confirm(`حذف عملية «${tx.title}»؟ سيُعاد احتساب رصيد الحساب.`);
    if (!ok) return;
    state.transactions = state.transactions.filter(item => item.id !== id); saveState(); closeModal(); renderPage(); toast('تم حذف العملية وإعادة احتساب الرصيد.');
  }
  function deleteDebt(id) {
    const debt = state.debts.find(item => item.id === id);
    if (!debt) return;
    const hasSettlements = state.transactions.some(tx => tx.debtId === debt.id && !tx.isAccrued);
    if (hasSettlements) return toast('لا يمكن حذف دين له دفعات مسجلة. تبقى الدفعات محفوظة في الكشف.', 'error');
    if (!window.confirm(`حذف سجل الدين الخاص بـ«${debt.person}»؟`)) return;
    state.transactions = state.transactions.filter(tx => tx.debtId !== debt.id);
    state.debts = state.debts.filter(item => item.id !== id); saveState(); renderPage(); toast('تم حذف سجل الدين.');
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-action], [data-page]');
    if (!target) return;
    if (target.dataset.page) { navigate(target.dataset.page); return; }
    const action = target.dataset.action;
    if (action === 'open-more-nav') { openMobileMenu(); return; }
    if (action === 'open-quick-add') { openMobileQuickAdd(); return; }
    else if (action === 'close-mobile-menu') { $('#mobileMenuRoot').innerHTML = ''; return; }
    if (action === 'new-transaction') { $('#mobileMenuRoot').innerHTML = ''; transactionModal('', target.dataset.kind || 'income'); }
    else if (action === 'new-transaction-for-project') transactionModal(target.dataset.id || '');
    else if (action === 'new-account') accountModal();
    else if (action === 'edit-account') { const account = accountById(target.dataset.id); if (account) editAccountModal(account); }
    else if (action === 'delete-account') deleteAccount(target.dataset.id);
    else if (action === 'delete-transaction-modal') deleteTransaction(target.dataset.id);
    else if (action === 'new-debt') debtModal(target.dataset.direction || 'receivable');
    else if (action === 'new-debt-for-contact') debtModal(target.dataset.direction || 'payable', target.dataset.id || '');
    else if (action === 'new-project') projectModal();
    else if (action === 'edit-project') { const project = projectById(target.dataset.id); if (project) projectModal(project); }
    else if (action === 'delete-project') deleteProject(target.dataset.id);
    else if (action === 'new-client') clientModal();
    else if (action === 'edit-client') { const client = clientById(target.dataset.id); if (client) clientModal(client); }
    else if (action === 'delete-client') deleteClient(target.dataset.id);
    else if (action === 'client-project') projectModal(null, target.dataset.id || '');
    else if (action === 'new-schedule') { $('#mobileMenuRoot').innerHTML = ''; scheduleModal(); }
    else if (action === 'edit-schedule') { const item = state.schedules.find(schedule => schedule.id === target.dataset.id); if (item) scheduleModal(item); }
    else if (action === 'record-schedule') { const item = state.schedules.find(schedule => schedule.id === target.dataset.id); if (item) recordScheduleModal(item); }
    else if (action === 'delete-schedule') deleteSchedule(target.dataset.id);
    else if (action === 'new-category') categoryModal();
    else if (action === 'edit-category') { const item = state.categories.find(category => category.id === target.dataset.id); if (item) categoryModal(item); }
    else if (action === 'delete-category') deleteCategory(target.dataset.id);
    else if (action === 'close-modal' || action === 'backdrop-close') { if (action === 'close-modal' || event.target === target) closeModal(); }
    else if (action === 'set-currency') { state.currency = target.dataset.currency; reportCurrency = state.currency; if (accountById(reportAccount)?.currency !== reportCurrency) reportAccount = 'all'; saveState(); renderPage(); }
    else if (action === 'toggle-balances') { state.hideBalances = !state.hideBalances; saveState(); $('#appShell').classList.toggle('balances-hidden', state.hideBalances); }
    else if (action === 'debt-payment') { const debt = state.debts.find(item => item.id === target.dataset.id); if (debt) paymentModal(debt); }
    else if (action === 'transaction-menu') {
      const tx = state.transactions.find(item => item.id === target.dataset.id);
      if (!tx) return;
      editTransactionModal(tx);
    } else if (action === 'debt-menu') deleteDebt(target.dataset.id);
    else if (action === 'export-month') exportMonth();
    else if (action === 'export-transactions') exportTransactions(filteredTransactions(), 'raseed-filtered-transactions.csv');
    else if (action === 'export-backup') exportBackup();
    else if (action === 'restore-backup') $('#backupFile')?.click();
    else if (action === 'print-report' || action === 'export-report-pdf') exportReportPdf();
    else if (action === 'reset-demo') {
      if (window.confirm('سيُحذف كل ما سجلته محليًا ويعاد تحميل البيانات التوضيحية. هل تريد المتابعة؟')) { state = demoState(); saveState(); activePage = 'dashboard'; renderPage(); toast('تمت إعادة بيانات العرض.'); }
    } else if (action === 'clear-demo') {
      if (window.confirm('سيُحذف كل سجل توضيحي، وستبدأ بحسابات وعمليات فارغة. نزّل أي بيانات تريد الاحتفاظ بها أولًا. هل تريد المتابعة؟')) {
        state = emptyState(); onboardingStep = 1; onboardingAccounts = []; onboardingDebts = [];
        saveState(); activePage = 'dashboard'; renderPage(); toast('تم مسح بيانات العرض. أكمل إعداد مساحتك.');
      }
    } else if (action === 'search') { navigate('transactions'); const input = $('#transactionSearch'); input?.focus(); input?.select(); }
    else if (action === 'notifications') toast(state.debts.some(d => d.remaining > 0 && d.dueDate && d.dueDate < toISO(Date.now())) ? 'لديك دين أو التزام متأخر. راجع صفحة الديون.' : 'لا توجد تذكيرات مستحقة حاليًا.');
    else if (action === 'profile') { $('#mobileMenuRoot').innerHTML = ''; profileModal(); }
    else if (action === 'setup-back') { onboardingStep = 1; persistSetupDraft(); renderPage(); }
    else if (action === 'finish-setup') finishSetup();
    else if (action === 'remove-setup-account') { onboardingAccounts.splice(Number(target.dataset.index), 1); persistSetupDraft(); renderPage(); }
    else if (action === 'remove-setup-debt') { onboardingDebts.splice(Number(target.dataset.index), 1); persistSetupDraft(); renderPage(); }
  });

  document.addEventListener('submit', event => {
    if (event.target.id === 'onboardingProfileForm') { event.preventDefault(); const data = new FormData(event.target); state.profile = { ...state.profile, name: String(data.get('name') || '').trim(), currency: data.get('currency') }; state.currency = state.profile.currency; onboardingStep = 2; persistSetupDraft(); renderPage(); }
    else if (event.target.id === 'onboardingAccountForm') { event.preventDefault(); saveOnboardingAccount(new FormData(event.target)); }
    else if (event.target.id === 'onboardingDebtForm') { event.preventDefault(); saveOnboardingDebt(new FormData(event.target)); }
    else if (event.target.id === 'transactionForm') { event.preventDefault(); addTransaction(new FormData(event.target)); }
    else if (event.target.id === 'transactionEditForm') { event.preventDefault(); updateTransaction(new FormData(event.target)); }
    else if (event.target.id === 'accountForm') { event.preventDefault(); addAccount(new FormData(event.target)); }
    else if (event.target.id === 'accountEditForm') { event.preventDefault(); updateAccount(new FormData(event.target)); }
    else if (event.target.id === 'projectForm') { event.preventDefault(); saveProject(new FormData(event.target)); }
    else if (event.target.id === 'clientForm') { event.preventDefault(); saveClient(new FormData(event.target)); }
    else if (event.target.id === 'profileForm') { event.preventDefault(); const data = new FormData(event.target); state.profile = { ...state.profile, name: String(data.get('name') || '').trim(), currency: data.get('currency') }; state.currency = state.profile.currency; saveState(); closeModal(); renderPage(); toast('تم حفظ الملف الشخصي.'); }
    else if (event.target.id === 'debtForm') { event.preventDefault(); addDebt(new FormData(event.target)); }
    else if (event.target.id === 'debtPaymentForm') { event.preventDefault(); recordDebtPayment(new FormData(event.target)); }
    else if (event.target.id === 'scheduleForm') { event.preventDefault(); saveSchedule(new FormData(event.target)); }
    else if (event.target.id === 'scheduleRecordForm') { event.preventDefault(); recordSchedule(new FormData(event.target)); }
    else if (event.target.id === 'categoryForm') { event.preventDefault(); saveCategory(new FormData(event.target)); }
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'transactionSearch') { transactionFilters.query = event.target.value; const cursor = event.target.selectionStart; renderPage(); const replacement = $('#transactionSearch'); replacement?.focus(); replacement?.setSelectionRange(cursor, cursor); }
  });
  document.addEventListener('change', event => {
    if (event.target.id === 'dashboardMonth') { state.dashboardMonth = event.target.value; saveState(); renderPage(); }
    else if (event.target.id === 'reportMonth') { state.dashboardMonth = event.target.value; saveState(); renderPage(); }
    else if (event.target.id === 'reportCurrency') { reportCurrency = event.target.value; if (accountById(reportAccount)?.currency !== reportCurrency) reportAccount = 'all'; renderPage(); }
    else if (event.target.id === 'reportAccount') { reportAccount = event.target.value; renderPage(); }
    else if (event.target.id === 'transactionKind') { transactionFilters.kind = event.target.value; renderPage(); }
    else if (event.target.id === 'transactionCurrency') { transactionFilters.currency = event.target.value; renderPage(); }
    else if (event.target.id === 'transactionMonth') { transactionFilters.month = event.target.value; renderPage(); }
    else if (event.target.id === 'transactionAccount') { transactionFilters.account = event.target.value; renderPage(); }
    else if (event.target.id === 'backupFile') { importBackupFile(event.target.files?.[0]); event.target.value = ''; }
  });

  $$('[data-icon]').forEach(node => { node.innerHTML = icon(node.dataset.icon); });
  $('#todayText').textContent = new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  renderPage();
  if (typeof window !== 'undefined' && window.isSecureContext && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {}));
  }
})();
