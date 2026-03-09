import { useState } from 'react';
import { Lightbulb, Copy, Download, Send, ClipboardList, Hospital, Code, Clock } from 'lucide-react';

const TEMPLATES = [
  { key: 'auth',    icon: ClipboardList, label: 'Authorization Appeal',  claim: 'CLM-2026-45872', patient: 'Sarah Johnson', payer: 'UnitedHealthcare', reason: 0, ctx: 'Prior authorization PA-2026-78234 was obtained on Jan 15, 2026 and valid through March 31, 2026.' },
  { key: 'medical', icon: Hospital,      label: 'Medical Necessity',     claim: 'CLM-2026-31205', patient: 'Michael Chen',  payer: 'Aetna',             reason: 4, ctx: 'Procedure clinically indicated based on failed conservative treatment over 6 months. MRI confirmed Grade IV chondromalacia.' },
  { key: 'coding',  icon: Code,          label: 'Coding Correction',     claim: 'CLM-2026-52918', patient: 'Emily Rodriguez', payer: 'Blue Cross Blue Shield', reason: 1, ctx: 'Original code 99214 appropriate based on documented HPI, exam, and medical decision-making complexity.' },
  { key: 'timely',  icon: Clock,         label: 'Timely Filing',         claim: 'CLM-2026-67430', patient: 'James Williams', payer: 'Cigna',            reason: 2, ctx: 'Original claim submitted within 90 days. Delay due to coordination of benefits with secondary payer.' },
];

const REASONS = [
  'CO-4: Missing/Invalid Authorization',
  'CO-16: Coding Error',
  'CO-29: Timely Filing',
  'CO-18: Duplicate Claim',
  'CO-50: Medical Necessity',
  'CO-27: Patient Eligibility',
];

const PAYERS = ['UnitedHealthcare', 'Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Medicare'];

export default function AIWriter() {
  const [form, setForm] = useState({ claim: '', patient: '', payer: PAYERS[0], reason: 0, ctx: '' });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadTemplate = (t) => {
    setForm({ claim: t.claim, patient: t.patient, payer: t.payer, reason: t.reason, ctx: t.ctx });
    setOutput('');
  };

  const generate = () => {
    setLoading(true);
    setOutput('');
    setTimeout(() => {
      const reason = REASONS[form.reason];
      const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      setOutput(`APPEAL LETTER — ${reason.split(': ')[1]}

Date: ${today}
Re: Claim #${form.claim || 'CLM-2026-XXXXX'}
Patient: ${form.patient || '[Patient Name]'}
Payer: ${form.payer}

Dear ${form.payer} Claims Review Department,

I am writing on behalf of Promdix Medical Billing to formally appeal the denial of the above-referenced claim for patient ${form.patient || '[Patient Name]'}.

DENIAL REASON: ${reason}

CLINICAL JUSTIFICATION:

Upon thorough review of the medical records and supporting documentation, we believe this denial was issued in error. The services rendered were medically necessary and fully documented in the patient's chart.${form.ctx ? '\n\nADDITIONAL CONTEXT:\n' + form.ctx : ''}

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
AI Confidence Score: 94% | Similar appeals success rate: 78%`);
      setLoading(false);
    }, 2200);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="animate-fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          {/* Info Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <Lightbulb size={28} className="text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-900">AI Appeal Generator</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Generate professionally crafted appeal letters using AI analysis of denial reasons and payer requirements.
            </p>
            <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-slate-100">
              <Stat value="89%" label="Success" />
              <Stat value="2 min" label="Avg Time" />
              <Stat value="1,247" label="Generated" />
            </div>
          </div>

          {/* Templates */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h4 className="text-xs font-semibold text-slate-700 mb-3">Quick Templates</h4>
            <div className="space-y-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.key}
                  onClick={() => loadTemplate(t)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all text-left"
                >
                  <t.icon size={16} className="shrink-0 opacity-60" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-9 space-y-5">
          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-5">Appeal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <Field label="Claim ID" value={form.claim} onChange={v => setForm(f => ({ ...f, claim: v }))} placeholder="e.g., CLM-2026-08432" />
              <Field label="Patient Name" value={form.patient} onChange={v => setForm(f => ({ ...f, patient: v }))} placeholder="e.g., Sarah Johnson" />
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Payer</label>
                <select value={form.payer} onChange={e => setForm(f => ({ ...f, payer: e.target.value }))} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all">
                  {PAYERS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Denial Reason Code</label>
                <select value={form.reason} onChange={e => setForm(f => ({ ...f, reason: +e.target.value }))} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all">
                  {REASONS.map((r, i) => <option key={r} value={i}>{r}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Additional Context</label>
                <textarea value={form.ctx} onChange={e => setForm(f => ({ ...f, ctx: e.target.value }))} rows={3} placeholder="Provide clinical context, prior auth details..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-y" />
              </div>
            </div>
            <button onClick={generate} disabled={loading} className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                  Generating...
                </>
              ) : (
                <><Lightbulb size={16} /> Generate Appeal Letter</>
              )}
            </button>
          </div>

          {/* Output */}
          {output && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-fade-up">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-slate-900 text-sm">Generated Appeal Letter</h3>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-md">AI Generated</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <Download size={12} /> PDF
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors">
                    <Send size={12} /> Submit
                  </button>
                </div>
              </div>
              <pre className="p-6 text-[13px] leading-7 text-slate-700 whitespace-pre-wrap font-sans">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400" />
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-base font-bold text-indigo-600">{value}</div>
      <div className="text-[9px] text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}
