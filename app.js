// ============================================
// DenialIQ — Mock Data & Interactive Dashboard
// ============================================

// ============ Mock Data ============
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
    'Humana', 'Anthem', 'Kaiser Permanente', 'Molina Healthcare', 'Centene'
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
const STATUS_LABELS = {
    pending: 'Pending Review',
    appealed: 'Appealed',
    under_review: 'Under Review',
    recovered: 'Recovered',
    written_off: 'Written Off'
};

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function formatCurrency(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 }); }
function formatDate(d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

function generateClaimId() {
    return 'CLM-2026-' + String(randomBetween(10000, 99999));
}

function generateDenials(count) {
    const denials = [];
    for (let i = 0; i < count; i++) {
        const denied = new Date(2026, randomBetween(0, 2), randomBetween(1, 28));
        denials.push({
            claim_id: generateClaimId(),
            patient: randomFrom(PATIENTS),
            payer: randomFrom(PAYERS),
            cpt_code: randomFrom(CPT_CODES),
            amount: randomBetween(150, 18500),
            reason: randomFrom(DENIAL_REASONS),
            status: randomFrom(STATUSES),
            date: denied
        });
    }
    return denials.sort((a, b) => b.date - a.date);
}

const ALL_DENIALS = generateDenials(892);

// ============ Navigation ============
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initKPICounters();
    initCharts();
    renderRecentDenials();
    renderDenialsTable();
    renderAppealsCards();
    initMenuToggle();
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const viewAllLinks = document.querySelectorAll('.view-all-link[data-page]');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(item.dataset.page);
        });
    });

    viewAllLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });
}

function navigateTo(page) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const activePage = document.getElementById(`page-${page}`);
    if (activePage) {
        activePage.classList.add('active');
        // Re-trigger animation
        activePage.style.animation = 'none';
        activePage.offsetHeight;
        activePage.style.animation = '';
    }

    // Update header
    const titles = {
        dashboard: ['Dashboard', 'Real-time denial management overview'],
        denials: ['Denial Tracker', 'Track, filter, and manage all denied claims'],
        appeals: ['Appeal Management', 'Appeal pipeline and workflow management'],
        analytics: ['Analytics', 'Comprehensive denial and recovery analytics'],
        'ai-appeals': ['AI Appeal Writer', 'Generate professional appeal letters with AI'],
        reports: ['Reports', 'Generate and download management reports'],
        settings: ['Settings', 'Configure your denial management platform']
    };

    const [title, subtitle] = titles[page] || ['Dashboard', ''];
    document.getElementById('pageTitle').textContent = title;
    document.getElementById('pageSubtitle').textContent = subtitle;

    // Initialize analytics charts if navigating to analytics
    if (page === 'analytics') {
        setTimeout(initAnalyticsCharts, 100);
    }

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
}

function initMenuToggle() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
}

// ============ KPI Counter Animation ============
function initKPICounters() {
    const kpiValues = document.querySelectorAll('.kpi-value[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    kpiValues.forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1200;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = target * eased;

        if (isDecimal) {
            el.textContent = prefix + current.toFixed(1) + suffix;
        } else {
            el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
        }

        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// ============ Dashboard Charts ============
function initCharts() {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#6b7280';
    Chart.defaults.plugins.legend.display = false;

    createDenialTrendChart();
    createDenialReasonsChart();
    createPayerDenialsChart();
}

function createDenialTrendChart() {
    const ctx = document.getElementById('denialTrendChart').getContext('2d');
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const claims = [980, 1020, 1085, 1050, 1120, 1060, 1140, 1090, 1180, 1100, 1050, 1072];
    const denials = [112, 108, 98, 95, 102, 88, 92, 85, 96, 82, 78, 86];
    const recovered = [72, 68, 65, 62, 70, 60, 64, 58, 68, 58, 56, 58];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Total Claims',
                    data: claims,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#3b82f6'
                },
                {
                    label: 'Denials',
                    data: denials,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#ef4444'
                },
                {
                    label: 'Recovered',
                    data: recovered,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#10b981'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { font: { size: 11 } },
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    backgroundColor: '#1f2937',
                    titleFont: { weight: '600' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    boxPadding: 4
                }
            }
        }
    });
}

function createDenialReasonsChart() {
    const ctx = document.getElementById('denialReasonsChart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Authorization', 'Coding Error', 'Timely Filing', 'Duplicate', 'Medical Necessity', 'Eligibility'],
            datasets: [{
                data: [28, 22, 15, 12, 10, 8],
                backgroundColor: [
                    '#6366f1', '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'
                ],
                borderWidth: 0,
                hoverOffset: 6,
                borderRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 8,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    backgroundColor: '#1f2937',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
                    }
                }
            }
        }
    });
}

function createPayerDenialsChart() {
    const ctx = document.getElementById('payerDenialsChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['UnitedHealthcare', 'Aetna', 'BCBS', 'Cigna', 'Medicare', 'Humana'],
            datasets: [{
                label: 'Denied Claims',
                data: [234, 189, 156, 128, 98, 87],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderRadius: 6,
                borderSkipped: false,
                maxBarThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { font: { size: 11 } }
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            },
            plugins: {
                tooltip: {
                    backgroundColor: '#1f2937',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => ` ${ctx.parsed.x} denied claims`
                    }
                }
            }
        }
    });
}

// ============ Analytics Charts ============
let analyticsInitialized = false;

function initAnalyticsCharts() {
    if (analyticsInitialized) return;
    analyticsInitialized = true;

    createRecoveryByPayerChart();
    createDenialBySpecialtyChart();
    createAppealSuccessChart();
    createRevenueTimelineChart();
}

function createRecoveryByPayerChart() {
    const ctx = document.getElementById('recoveryByPayerChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['UnitedHealthcare', 'Aetna', 'BCBS', 'Cigna', 'Medicare', 'Humana', 'Anthem', 'Kaiser'],
            datasets: [
                {
                    label: 'Recovered',
                    data: [72, 65, 78, 58, 82, 61, 69, 74],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Written Off',
                    data: [28, 35, 22, 42, 18, 39, 31, 26],
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: 4,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false }, stacked: true },
                y: {
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    stacked: true,
                    max: 100,
                    ticks: { callback: v => v + '%' }
                }
            },
            plugins: {
                legend: { display: true, position: 'top', labels: { usePointStyle: true, pointStyleWidth: 8, padding: 20 } },
                tooltip: {
                    backgroundColor: '#1f2937', padding: 12, cornerRadius: 8,
                    callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` }
                }
            }
        }
    });
}

function createDenialBySpecialtyChart() {
    const ctx = document.getElementById('denialBySpecialtyChart').getContext('2d');

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Cardiology', 'Orthopedics', 'Radiology', 'Lab Services', 'Emergency', 'Surgery'],
            datasets: [{
                data: [156, 134, 118, 98, 87, 72],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(236, 72, 153, 0.7)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'bottom', labels: { usePointStyle: true, pointStyleWidth: 8, padding: 14, font: { size: 11 } } },
                tooltip: { backgroundColor: '#1f2937', padding: 12, cornerRadius: 8 }
            },
            scales: {
                r: {
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { display: false }
                }
            }
        }
    });
}

function createAppealSuccessChart() {
    const ctx = document.getElementById('appealSuccessChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Authorization', 'Coding Error', 'Timely Filing', 'Duplicate', 'Medical Necessity', 'Eligibility'],
            datasets: [{
                label: 'Win Rate',
                data: [74, 82, 45, 68, 56, 71],
                backgroundColor: (ctx) => {
                    const val = ctx.parsed.y;
                    if (val >= 70) return 'rgba(16, 185, 129, 0.8)';
                    if (val >= 50) return 'rgba(245, 158, 11, 0.8)';
                    return 'rgba(239, 68, 68, 0.8)';
                },
                borderRadius: 6,
                borderSkipped: false,
                maxBarThickness: 36
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                y: {
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    max: 100,
                    ticks: { callback: v => v + '%' }
                }
            },
            plugins: {
                tooltip: {
                    backgroundColor: '#1f2937', padding: 12, cornerRadius: 8,
                    callbacks: { label: ctx => ` Win Rate: ${ctx.parsed.y}%` }
                }
            }
        }
    });
}

function createRevenueTimelineChart() {
    const ctx = document.getElementById('revenueTimelineChart').getContext('2d');
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

    // Cumulative revenue data (in thousands)
    const cumulative = [98, 210, 335, 468, 612, 748, 892, 1028, 1178, 1324, 1456, 1580];
    const monthly = [98, 112, 125, 133, 144, 136, 144, 136, 150, 146, 132, 124];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Cumulative Recovered ($K)',
                    data: cumulative,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    yAxisID: 'y'
                },
                {
                    label: 'Monthly Recovered ($K)',
                    data: monthly,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    type: 'bar',
                    borderRadius: 4,
                    borderSkipped: false,
                    maxBarThickness: 28,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: { grid: { display: false } },
                y: {
                    position: 'left',
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { callback: v => '$' + v + 'K' }
                },
                y1: {
                    position: 'right',
                    grid: { display: false },
                    ticks: { callback: v => '$' + v + 'K' }
                }
            },
            plugins: {
                legend: { display: true, position: 'top', labels: { usePointStyle: true, pointStyleWidth: 8, padding: 20 } },
                tooltip: {
                    backgroundColor: '#1f2937', padding: 12, cornerRadius: 8,
                    callbacks: { label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y}K` }
                }
            }
        }
    });
}

// ============ Recent Denials Table (Dashboard) ============
function renderRecentDenials() {
    const tbody = document.getElementById('recentDenialsBody');
    const recent = ALL_DENIALS.slice(0, 6);

    tbody.innerHTML = recent.map(d => `
        <tr>
            <td><span class="claim-id">${d.claim_id}</span></td>
            <td>${d.patient}</td>
            <td>${d.payer}</td>
            <td><span class="amount">${formatCurrency(d.amount)}</span></td>
            <td>${d.reason}</td>
            <td><span class="status-badge ${d.status}">${STATUS_LABELS[d.status]}</span></td>
        </tr>
    `).join('');
}

// ============ Full Denials Table ============
function renderDenialsTable() {
    const tbody = document.getElementById('denialsTableBody');
    const denials = ALL_DENIALS.slice(0, 20);

    tbody.innerHTML = denials.map(d => `
        <tr>
            <td><input type="checkbox"></td>
            <td><span class="claim-id">${d.claim_id}</span></td>
            <td>${d.patient}</td>
            <td>${d.payer}</td>
            <td><span style="font-family: var(--font-mono); font-size: 0.82rem;">${d.cpt_code}</span></td>
            <td><span class="amount">${formatCurrency(d.amount)}</span></td>
            <td>${d.reason}</td>
            <td>${formatDate(d.date)}</td>
            <td><span class="status-badge ${d.status}">${STATUS_LABELS[d.status]}</span></td>
            <td>
                <div class="row-actions">
                    <button class="row-action-btn" title="View Details">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button class="row-action-btn" title="Generate Appeal" onclick="showAIAppealModal()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ============ Appeals Cards ============
function renderAppealsCards() {
    const grid = document.getElementById('appealsGrid');
    const appeals = ALL_DENIALS.filter(d => ['appealed', 'under_review', 'pending'].includes(d.status)).slice(0, 9);

    grid.innerHTML = appeals.map(d => {
        const deadline = new Date(d.date);
        deadline.setDate(deadline.getDate() + 30);
        const daysLeft = Math.max(0, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)));

        return `
            <div class="appeal-card">
                <div class="appeal-card-header">
                    <div>
                        <span class="appeal-claim-id">${d.claim_id}</span>
                        <div class="appeal-patient">${d.patient}</div>
                    </div>
                    <span class="status-badge ${d.status}">${STATUS_LABELS[d.status]}</span>
                </div>
                <div class="appeal-meta">
                    <div class="appeal-meta-item">
                        <label>Payer</label>
                        <span>${d.payer}</span>
                    </div>
                    <div class="appeal-meta-item">
                        <label>Amount</label>
                        <span class="amount">${formatCurrency(d.amount)}</span>
                    </div>
                    <div class="appeal-meta-item">
                        <label>Denial Reason</label>
                        <span>${d.reason}</span>
                    </div>
                    <div class="appeal-meta-item">
                        <label>Deadline</label>
                        <span style="color: ${daysLeft < 10 ? '#ef4444' : daysLeft < 20 ? '#f59e0b' : '#10b981'}">${daysLeft} days left</span>
                    </div>
                </div>
                <div class="appeal-actions">
                    <button class="btn btn-sm btn-primary" onclick="showAIAppealModal()">AI Draft</button>
                    <button class="btn btn-sm btn-outline">View Details</button>
                </div>
            </div>
        `;
    }).join('');
}

// ============ AI Appeal Generator ============
function showAIAppealModal() {
    const modal = document.getElementById('aiModal');
    modal.classList.add('show');

    // Simulate AI generation
    setTimeout(() => {
        document.getElementById('modalBody').innerHTML = `
            <div style="padding: 8px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                    <span style="background: #d1fae5; color: #065f46; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">AI Generated</span>
                    <span style="color: #6b7280; font-size: 0.78rem;">Confidence: 94%</span>
                </div>
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; font-size: 0.88rem; line-height: 1.8; color: #374151; white-space: pre-wrap; font-family: var(--font-sans);">
<strong>APPEAL LETTER — Prior Authorization Denial</strong>

Date: March 9, 2026
Re: Claim #CLM-2026-45872

Dear Claims Review Department,

I am writing to formally appeal the denial of the above-referenced claim for patient Sarah Johnson (DOB: 04/15/1978, Member ID: UHC-892745123).

<strong>Reason for Denial:</strong> CO-4 — Missing/Invalid Prior Authorization

<strong>Basis for Appeal:</strong>

The prior authorization for this procedure (CPT 27447 — Total Knee Arthroplasty) was obtained on January 15, 2026, under authorization number PA-2026-78234. The authorization was valid through March 31, 2026, and the procedure was performed on February 12, 2026, well within the approved timeframe.

We believe this denial was issued in error, as the authorization was active and properly documented at the time of service. Enclosed please find:

1. Copy of the original prior authorization approval (PA-2026-78234)
2. Operative report confirming date of service
3. Clinical documentation supporting medical necessity
4. Provider credentialing verification

We respectfully request that this claim be reprocessed with the attached authorization documentation. Per your appeals policy, we expect a response within 30 business days.

Thank you for your prompt attention to this matter.

Sincerely,
Promdix Medical Billing
On behalf of [Provider Name]
Phone: (555) 123-4567
Fax: (555) 123-4568</div>
                <div style="display: flex; gap: 8px; margin-top: 16px; justify-content: flex-end;">
                    <button class="btn btn-sm btn-outline" onclick="copyAppealText()">Copy to Clipboard</button>
                    <button class="btn btn-sm btn-outline">Download PDF</button>
                    <button class="btn btn-sm btn-primary" onclick="closeModal()">Submit Appeal</button>
                </div>
            </div>
        `;
    }, 2000);
}

function closeModal() {
    const modal = document.getElementById('aiModal');
    modal.classList.remove('show');
    // Reset modal content
    document.getElementById('modalBody').innerHTML = `
        <div class="ai-loading">
            <div class="ai-spinner"></div>
            <p>Analyzing denial data and generating appeal...</p>
        </div>
    `;
}

// ============ AI Appeal Writer Page ============
function generateAppeal() {
    const outputCard = document.getElementById('aiOutputCard');
    const outputBody = document.getElementById('aiOutputBody');

    const claimId = document.getElementById('aiClaimId').value || 'CLM-2026-45872';
    const patient = document.getElementById('aiPatientName').value || 'Sarah Johnson';
    const payer = document.getElementById('aiPayer').value;
    const reasonCode = document.getElementById('aiReasonCode').value;
    const context = document.getElementById('aiContext').value;

    // Show loading state
    outputCard.style.display = 'block';
    outputBody.innerHTML = `
        <div class="ai-loading">
            <div class="ai-spinner"></div>
            <p>Analyzing denial code, clinical data, and payer-specific requirements...</p>
        </div>
    `;

    // Simulate AI generation
    setTimeout(() => {
        outputBody.innerHTML = generateAppealLetter(claimId, patient, payer, reasonCode, context);
        outputCard.style.animation = 'none';
        outputCard.offsetHeight;
        outputCard.style.animation = '';
    }, 2500);
}

function generateAppealLetter(claimId, patient, payer, reasonCode, context) {
    const reason = reasonCode.split(' — ')[1] || reasonCode;
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return `APPEAL LETTER — ${reason}

Date: ${today}
Re: Claim #${claimId}
Patient: ${patient}
Payer: ${payer}

Dear ${payer} Claims Review Department,

I am writing on behalf of Promdix Medical Billing to formally appeal the denial of the above-referenced claim for patient ${patient}.

DENIAL REASON: ${reasonCode}

CLINICAL JUSTIFICATION:

Upon thorough review of the medical records and supporting documentation, we believe this denial was issued in error. The services rendered were medically necessary and fully documented in the patient's chart.${context ? '\n\nADDITIONAL CONTEXT:\n' + context : ''}

SUPPORTING DOCUMENTATION ENCLOSED:

1. Complete medical records for dates of service
2. Physician's attestation of medical necessity
3. Relevant lab results and diagnostic imaging
4. Prior authorization documentation (if applicable)
5. Applicable clinical guidelines and peer-reviewed literature

We respectfully request a full review and reconsideration of this claim. Per applicable state and federal regulations, we expect a written determination within 30 business days of receipt.

If additional information is needed, please contact our office immediately.

Respectfully submitted,

Promdix Medical Billing Services
Appeals Department
Phone: (555) 123-4567 | Fax: (555) 123-4568
Email: appeals@promdix.com

---
This appeal was generated with AI assistance and reviewed for accuracy.
Confidence Score: 92% | Similar appeals success rate: 78%`;
}

function loadTemplate(type) {
    const templates = {
        auth: { claimId: 'CLM-2026-45872', patient: 'Sarah Johnson', payer: 'UnitedHealthcare', reason: 0, context: 'Prior authorization PA-2026-78234 was obtained on Jan 15, 2026 and valid through March 31, 2026.' },
        medical: { claimId: 'CLM-2026-31205', patient: 'Michael Chen', payer: 'Aetna', reason: 4, context: 'Procedure was clinically indicated based on failed conservative treatment over 6 months. MRI confirmed Grade IV chondromalacia.' },
        coding: { claimId: 'CLM-2026-52918', patient: 'Emily Rodriguez', payer: 'Blue Cross Blue Shield', reason: 1, context: 'Original code 99214 was appropriate based on documented HPI, exam, and medical decision-making complexity.' },
        timely: { claimId: 'CLM-2026-67430', patient: 'James Williams', payer: 'Cigna', reason: 2, context: 'Original claim was submitted within 90 days. Delay due to coordination of benefits with secondary payer.' }
    };

    const t = templates[type];
    if (t) {
        document.getElementById('aiClaimId').value = t.claimId;
        document.getElementById('aiPatientName').value = t.patient;
        document.getElementById('aiPayer').value = t.payer;
        document.getElementById('aiReasonCode').selectedIndex = t.reason;
        document.getElementById('aiContext').value = t.context;
    }
}

function copyAppeal() {
    const text = document.getElementById('aiOutputBody').textContent;
    navigator.clipboard.writeText(text).then(() => {
        // Brief visual feedback
        const btn = event.target;
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = original, 1500);
    });
}

function copyAppealText() {
    const modal = document.getElementById('modalBody');
    const text = modal.querySelector('div[style*="pre-wrap"]')?.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = original, 1500);
    });
}

function exportTable() {
    // Simulate CSV export
    const btn = event.target.closest('.btn');
    const original = btn.innerHTML;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg> Exported!';
    setTimeout(() => btn.innerHTML = original, 2000);
}
