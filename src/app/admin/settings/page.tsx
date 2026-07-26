'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Settings {
  siteName: string;
  siteDescription: string;
  whatsappNumber: string;
  maintenanceMode: boolean;
  payment: { phoneNumber: string; minimumAmount: number };
  theme: { primaryColor: string; secondaryColor: string; accentColor: string };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/settings').then((res) => setSettings(res.data.settings)).finally(() => setLoading(false));
  }, []);

  function update(path: string[], value: any) {
    setSettings((s) => {
      if (!s) return s;
      const copy: any = JSON.parse(JSON.stringify(s));
      let obj = copy;
      for (let i = 0; i < path.length - 1; i += 1) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return copy;
    });
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await api.patch('/settings', settings);
      setSettings(res.data.settings);
      setMessage('Settings saved.');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-black/40">Loading...</p>;
  if (!settings) return <p className="text-sm text-red-500">Failed to load settings.</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="section-title mb-6">Site Settings</h1>

      {message && <div className="mb-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-600">{message}</div>}

      <div className="space-y-6 rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-navy-800">
        <div>
          <label className="mb-1 block text-sm font-medium">Site Name</label>
          <input
            value={settings.siteName}
            onChange={(e) => update(['siteName'], e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Site Description</label>
          <textarea
            rows={2}
            value={settings.siteDescription}
            onChange={(e) => update(['siteDescription'], e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">WhatsApp Support Number</label>
            <input
              value={settings.whatsappNumber}
              onChange={(e) => update(['whatsappNumber'], e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Payment Phone Number</label>
            <input
              value={settings.payment.phoneNumber}
              onChange={(e) => update(['payment', 'phoneNumber'], e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Minimum Payment (RWF)</label>
          <input
            type="number"
            value={settings.payment.minimumAmount}
            onChange={(e) => update(['payment', 'minimumAmount'], Number(e.target.value))}
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/20"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {(['primaryColor', 'secondaryColor', 'accentColor'] as const).map((key) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium capitalize">{key.replace('Color', '')}</label>
              <input
                type="color"
                value={settings.theme[key]}
                onChange={(e) => update(['theme', key], e.target.value)}
                className="h-10 w-full rounded-xl border border-black/10 dark:border-white/20"
              />
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => update(['maintenanceMode'], e.target.checked)} />
          Maintenance mode (shows a maintenance page to visitors)
        </label>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
