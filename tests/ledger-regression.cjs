const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('app.js', 'utf8');
const bootMarker = '  renderPage();\n  if (typeof window !== \'undefined\' && window.isSecureContext';
assert.ok(source.includes(bootMarker), 'test seam still matches the application bootstrap');

function createApp(savedState = null) {
  const elements = new Map();
  const element = () => ({
    innerHTML: '', textContent: '', hidden: false, value: '', dataset: {}, style: {},
    classList: { add() {}, remove() {}, toggle() {} },
    append() {}, remove() {}, addEventListener() {}, setAttribute() {}, focus() {},
    setSelectionRange() {}, querySelector() { return element(); },
    get options() { return []; }
  });
  const document = {
    querySelector(selector) { if (!elements.has(selector)) elements.set(selector, element()); return elements.get(selector); },
    querySelectorAll() { return []; },
    addEventListener() {},
    createElement() { return element(); },
    body: { append() {} }
  };
  const localStorage = { value: savedState ? JSON.stringify(savedState) : null,
    getItem() { return this.value; }, setItem(_key, value) { this.value = value; } };
  const window = { isSecureContext: false, scrollTo() {}, confirm() { return true; } };
  let instrumented = source.replace(bootMarker, `  window.__raseedTest = {
    getState: () => state,
    getPage: () => activePage,
    setPage: page => { activePage = page; modalReturnPage = page; },
    setReport: (month, currency, account = 'all') => { state.dashboardMonth = month; reportCurrency = currency; reportAccount = account; activePage = 'reports'; },
    saveClient, saveProject, saveSchedule, recordSchedule, addTransaction, addDebt, recordDebtPayment,
    accountBalance, buildReportPdfHtml
  };
  if (!window.__skipInitialRender) renderPage();
  if (typeof window !== 'undefined' && window.isSecureContext`);
  const context = { window, document, localStorage, Date, Intl, Math, JSON, String, Number, Boolean, Array, Object, RegExp, Set, Map, Promise, console, setTimeout() {}, clearTimeout() {} };
  vm.runInNewContext(instrumented, context, { filename: 'app.js' });
  return { app: window.__raseedTest, storage: localStorage };
}

const seed = {
  version: 3, setupComplete: true, demo: false, profile: { name: 'اختبار رصيد', currency: 'SAR' }, currency: 'SAR',
  dashboardMonth: '2026-09', hideBalances: false,
  accounts: [
    { id: 'sar-main', name: 'كاش سعودي', kind: 'cash', currency: 'SAR', openingBalance: 1000 },
    { id: 'sar-bank', name: 'بنك سعودي', kind: 'bank', currency: 'SAR', openingBalance: 500 },
    { id: 'yer-wallet', name: 'محفظة يمنية', kind: 'wallet', currency: 'YER', openingBalance: 200000 },
    { id: 'usd-cash', name: 'كاش دولار', kind: 'cash', currency: 'USD', openingBalance: 100 }
  ],
  transactions: [], debts: [], projects: [], clients: [], schedules: [],
  categories: [
    { id: 'income-default', kind: 'income', name: 'عمل ومشاريع' },
    { id: 'expense-default', kind: 'expense', name: 'تشغيل' },
    { id: 'expense-team', kind: 'expense', name: 'أجور ومتعاونون' }
  ]
};
const { app, storage } = createApp(seed);
const data = values => ({ get: key => values[key] ?? '' });

app.setPage('clients');
app.saveClient(data({ name: 'وكالة النور', role: 'employer', phone: '770000000', email: '', notes: '' }));
const agency = app.getState().clients.find(item => item.name === 'وكالة النور');
assert.ok(agency, 'new client/entity is saved');
assert.equal(app.getPage(), 'clients', 'client save returns to the client list');

app.setPage('dashboard');
app.saveProject(data({ name: 'تصميم المتجر', clientId: agency.id, amount: '500', currency: 'SAR', status: 'in_progress', dueDate: '', notes: '' }));
const project = app.getState().projects.find(item => item.name === 'تصميم المتجر');
assert.ok(project, 'new project is saved');
assert.equal(project.clientId, agency.id, 'project stays linked to its client');
assert.equal(app.getPage(), 'projects', 'a project created from home opens the project list');
app.setPage('projects');
app.saveProject(data({ name: 'مشروع يمني', clientId: agency.id, amount: '250000', currency: 'YER', status: 'in_progress', dueDate: '', notes: '' }));
const yerProject = app.getState().projects.find(item => item.name === 'مشروع يمني');

app.setPage('projects');
app.addTransaction(data({ kind: 'income', amount: '250', accountId: 'sar-main', toAccountId: '', receivedAmount: '', fee: '0', projectId: project.id, clientId: '', linkedIncomeId: '', title: 'دفعة أولى', category: 'دفعات عميل جديدة', sourceType: 'project', date: '2026-09-10', party: '', note: '' }));
const income = app.getState().transactions.find(item => item.title === 'دفعة أولى');
assert.equal(income.clientId, agency.id, 'income inherits the selected project client');
assert.ok(app.getState().categories.some(item => item.kind === 'income' && item.name === 'دفعات عميل جديدة'), 'typed category becomes manageable');
assert.equal(app.accountBalance('sar-main'), 1250, 'income increases only its chosen account');

app.addTransaction(data({ kind: 'expense', amount: '50', accountId: 'sar-main', toAccountId: '', receivedAmount: '', fee: '0', projectId: project.id, clientId: '', linkedIncomeId: income.id, title: 'استضافة المتجر', category: 'استضافة', sourceType: '', date: '2026-09-12', party: 'مزود الخدمة', note: '' }));
const linkedExpense = app.getState().transactions.find(item => item.title === 'استضافة المتجر');
assert.equal(linkedExpense.linkedIncomeId, income.id, 'expense remains linked to matching income');
assert.equal(app.accountBalance('sar-main'), 1200, 'expense reduces the selected account');
assert.ok(app.getState().categories.some(item => item.kind === 'expense' && item.name === 'استضافة'), 'custom expense category is saved');

app.addTransaction(data({ kind: 'transfer', amount: '75', accountId: 'sar-main', toAccountId: 'sar-bank', receivedAmount: '', fee: '0', projectId: '', clientId: '', linkedIncomeId: '', title: 'نقل بين حسابين', category: 'تحويل داخلي', sourceType: '', date: '2026-09-13', party: '', note: '' }));
assert.equal(app.accountBalance('sar-main'), 1125, 'transfer debits its source');
assert.equal(app.accountBalance('sar-bank'), 575, 'transfer credits its destination');

app.addTransaction(data({ kind: 'exchange', amount: '100000', accountId: 'yer-wallet', toAccountId: 'usd-cash', receivedAmount: '20', fee: '100', projectId: '', clientId: '', linkedIncomeId: '', title: 'مصارفة', category: 'مصارفة عملات', sourceType: '', date: '2026-09-14', party: '', note: '' }));
assert.equal(app.accountBalance('yer-wallet'), 99900, 'exchange subtracts amount and fee from source');
assert.equal(app.accountBalance('usd-cash'), 120, 'exchange credits received amount in destination currency');

const yerIncome = { id: 'yer-income', kind: 'income', amount: 100000, currency: 'YER', accountId: 'yer-wallet', title: 'دخل يمني', date: '2026-09-09', category: 'عمل ومشاريع', projectId: yerProject.id, clientId: agency.id, party: agency.name, createdAt: '2026-09-09T10:00:00.000Z' };
app.getState().transactions.push(yerIncome);
app.addDebt(data({ direction: 'payable', contactId: '', person: 'اسم متجاوز لا يجب اعتماده', amount: '50000', currency: 'YER', debtDate: '2026-09-11', dueDate: '2026-09-20', projectId: yerProject.id, description: 'أجرة تنفيذ', linkedIncomeId: yerIncome.id, recognizeExpense: 'on' }));
const payable = app.getState().debts[0];
const accrued = app.getState().transactions.find(item => item.debtId === payable.id && item.isAccrued);
assert.equal(payable.person, agency.name, 'selected contact is the authoritative debt party');
assert.equal(payable.contactId, agency.id, 'project customer is authoritative for a linked debt');
assert.equal(payable.projectId, yerProject.id, 'debt remains linked to the project');
assert.equal(payable.createdAt, '2026-09-11', 'debt registration date is stored');
assert.equal(accrued.date, '2026-09-11', 'unpaid cost uses the debt registration date');
assert.equal(app.accountBalance('yer-wallet'), 199900, 'an unpaid obligation does not affect a cash balance');

app.recordDebtPayment(data({ debtId: payable.id, accountId: 'yer-wallet', amount: '20000', date: '2026-09-18', note: 'دفعة جزئية' }));
assert.equal(app.getState().debts[0].remaining, 30000, 'partial settlement updates outstanding debt');
assert.equal(app.accountBalance('yer-wallet'), 179900, 'partial payment reduces the selected account once');

app.saveSchedule(data({ id: '', name: 'اشتراك خدمة المشروع', kind: 'expense', amount: '15000', currency: 'YER', category: 'خدمات', contactId: '', projectId: yerProject.id, day: '22', sourceType: '', notes: '' }));
const schedule = app.getState().schedules[0];
assert.equal(schedule.contactId, agency.id, 'recurring item inherits its project customer');
app.recordSchedule(data({ id: schedule.id, accountId: 'yer-wallet', amount: '15000', date: '2026-09-22', note: '' }));
assert.equal(app.accountBalance('yer-wallet'), 164900, 'recorded recurring expense affects the balance once');
const ledgerCountAfterSchedule = app.getState().transactions.length;
app.recordSchedule(data({ id: schedule.id, accountId: 'yer-wallet', amount: '15000', date: '2026-09-23', note: '' }));
assert.equal(app.getState().transactions.length, ledgerCountAfterSchedule, 'the same recurring item cannot be recorded twice in one month');

app.addDebt(data({ direction: 'receivable', contactId: '', person: 'عميل جديد', amount: '10', currency: 'USD', debtDate: '2026-09-15', dueDate: '', projectId: '', description: 'دفعة أخيرة', linkedIncomeId: '', recognizeExpense: '' }));
const receivable = app.getState().debts.find(item => item.direction === 'receivable');
app.recordDebtPayment(data({ debtId: receivable.id, accountId: 'usd-cash', amount: '4', date: '2026-09-19', note: '' }));
assert.equal(receivable.remaining, 6, 'receivable balance updates after partial collection');
assert.equal(app.accountBalance('usd-cash'), 124, 'collection credits the chosen account');

app.setReport('2026-09', 'SAR');
const summaryPdf = app.buildReportPdfHtml();
assert.ok(summaryPdf.includes('كشف مالي منظم') && summaryPdf.includes('صافي الدخل بعد تكاليفه المرتبطة'), 'PDF includes a complete Arabic summary');
assert.ok(summaryPdf.includes('استضافة المتجر') && summaryPdf.includes('المستحقات المفتوحة حتى تاريخ الإصدار'), 'PDF includes transactions and open obligations');
assert.ok(summaryPdf.includes('دفعات عميل جديدة'), 'PDF retains custom categorization');
app.setReport('2026-09', 'SAR', 'sar-main');
const statementPdf = app.buildReportPdfHtml();
assert.ok(statementPdf.includes('الرصيد الافتتاحي') && statementPdf.includes('الرصيد الختامي'), 'account PDF includes opening and closing balances');

const restored = createApp(JSON.parse(storage.value)).app.getState();
assert.equal(restored.clients.length, 2, 'saved client records reload from local storage');
assert.equal(restored.projects.length, 2, 'saved projects reload from local storage');
assert.equal(restored.debts.length, 2, 'saved debt and receivable records reload from local storage');
assert.equal(restored.schedules.length, 1, 'saved monthly reminders reload from local storage');
assert.equal(restored.transactions.length, app.getState().transactions.length, 'ledger records reload from local storage');

console.log('Passed: entity/project persistence, client/project links across transactions and recurring items, custom categories, income/expenses, transfers, exchange, dated debt accrual, partial settlement/collection, PDF statements, and local restore.');
