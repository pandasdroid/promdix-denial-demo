import { useState } from 'react';

const TABS = ['General', 'Payer Rules', 'Notifications', 'Integrations', 'Users & Roles', 'Billing'];

export default function Settings() {
  const [tab, setTab] = useState('General');

  return (
    <div className="animate-fade-up">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Nav */}
        <div className="md:col-span-3 lg:col-span-2">
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap text-left
                  ${t === tab ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-9 lg:col-span-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">{tab}</h3>

            {/* Organization */}
            <section className="mb-8 pb-6 border-b border-slate-100">
              <h4 className="text-xs font-semibold text-slate-700 mb-4 uppercase tracking-wider">Organization</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SettingsField label="Organization Name" value="Promdix Medical Billing" />
                <SettingsField label="NPI Number" value="1234567890" />
                <SettingsField label="Tax ID" value="XX-XXXXXXX" />
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Default Timezone</label>
                  <select defaultValue="ET" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all">
                    <option value="ET">Eastern (ET)</option>
                    <option value="CT">Central (CT)</option>
                    <option value="MT">Mountain (MT)</option>
                    <option value="PT">Pacific (PT)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Toggles */}
            <section className="mb-8">
              <h4 className="text-xs font-semibold text-slate-700 mb-4 uppercase tracking-wider">Appeal Automation</h4>
              <div className="space-y-0 divide-y divide-slate-100">
                <Toggle label="Auto-generate appeals for common denial codes" desc="AI will automatically draft appeal letters for denials matching known patterns" defaultOn />
                <Toggle label="Send daily denial digest via email" desc="Receive a summary of new denials and appeal statuses each morning" defaultOn />
                <Toggle label="Auto-escalate high-value denials" desc="Claims over $5,000 are automatically flagged for senior review" />
                <Toggle label="Enable HIPAA audit logging" desc="Log all access and modifications to patient denial data" defaultOn />
              </div>
            </section>

            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsField({ label, value }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">{label}</label>
      <input type="text" defaultValue={value} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
    </div>
  );
}

function Toggle({ label, desc, defaultOn }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between py-4 gap-4">
      <div>
        <div className="text-sm font-medium text-slate-800">{label}</div>
        <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? 'bg-indigo-500' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}
