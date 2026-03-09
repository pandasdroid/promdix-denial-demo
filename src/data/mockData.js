const PATIENTS = [
  'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'James Williams', 'Maria Garcia',
  'Robert Brown', 'Jennifer Davis', 'David Wilson', 'Lisa Anderson', 'Thomas Martinez',
  'Patricia Taylor', 'Christopher Lee', 'Amanda Harris', 'Daniel Clark', 'Jessica Lewis',
  'Matthew Walker', 'Ashley Hall', 'Andrew Allen', 'Stephanie Young', 'Joshua King',
  'Nicole Wright', 'Ryan Lopez', 'Megan Hill', 'Kevin Scott', 'Rebecca Green',
  'Brandon Adams', 'Lauren Baker', 'Justin Nelson', 'Kayla Carter', 'Tyler Mitchell'
];

const PAYERS = [
  'UnitedHealthcare', 'Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Medicare',
  'Humana', 'Anthem', 'Kaiser Permanente'
];

const DENIAL_REASONS = [
  'Missing Authorization', 'Coding Error (ICD-10)', 'Timely Filing',
  'Duplicate Claim', 'Medical Necessity', 'Patient Eligibility',
  'Bundling Issue', 'Non-Covered Service'
];

const CPT_CODES = [
  '99213', '99214', '99215', '99232', '99233', '99291',
  '27447', '43239', '70553', '73721', '77067', '93000',
  '99283', '99284', '36415', '80053', '85025', '81001'
];

const STATUSES = ['pending', 'appealed', 'under_review', 'recovered', 'written_off'];

export const STATUS_CONFIG = {
  pending:      { label: 'Pending Review', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  appealed:     { label: 'Appealed',       color: 'bg-blue-50 text-blue-700',   dot: 'bg-blue-400' },
  under_review: { label: 'Under Review',   color: 'bg-indigo-50 text-indigo-700', dot: 'bg-indigo-400' },
  recovered:    { label: 'Recovered',      color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-400' },
  written_off:  { label: 'Written Off',    color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
};

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function generateDenials(count = 892) {
  const denials = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(2026, rand(0, 2), rand(1, 28));
    denials.push({
      id: i + 1,
      claim_id: `CLM-2026-${String(rand(10000, 99999))}`,
      patient: pick(PATIENTS),
      payer: pick(PAYERS),
      cpt_code: pick(CPT_CODES),
      amount: rand(150, 18500),
      reason: pick(DENIAL_REASONS),
      status: pick(STATUSES),
      date: d,
    });
  }
  return denials.sort((a, b) => b.date - a.date);
}

export const ALL_DENIALS = generateDenials();

export const CHART_MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

export const TREND_DATA = {
  claims:    [980, 1020, 1085, 1050, 1120, 1060, 1140, 1090, 1180, 1100, 1050, 1072],
  denials:   [112, 108, 98, 95, 102, 88, 92, 85, 96, 82, 78, 86],
  recovered: [72, 68, 65, 62, 70, 60, 64, 58, 68, 58, 56, 58],
};

export const REASON_DATA = {
  labels: ['Authorization', 'Coding Error', 'Timely Filing', 'Duplicate', 'Medical Necessity', 'Eligibility'],
  values: [28, 22, 15, 12, 10, 8],
  colors: ['#6366f1', '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'],
};

export const PAYER_DENIALS = {
  labels: ['UnitedHealthcare', 'Aetna', 'BCBS', 'Cigna', 'Medicare', 'Humana'],
  values: [234, 189, 156, 128, 98, 87],
  colors: ['rgba(99,102,241,.8)','rgba(59,130,246,.8)','rgba(139,92,246,.8)','rgba(245,158,11,.8)','rgba(16,185,129,.8)','rgba(236,72,153,.8)'],
};

export const PAYER_LIST = PAYERS;
export const REASON_LIST = DENIAL_REASONS;

export function formatCurrency(n) {
  return '$' + n.toLocaleString('en-US');
}

export function formatDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
