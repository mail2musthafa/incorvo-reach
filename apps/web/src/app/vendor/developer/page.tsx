"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Key, Webhook, CheckCircle2, Copy, ShieldCheck, Plus, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function VendorDeveloperPage() {
  const [keys, setKeys] = useState<any[]>([
    { id: "k-1", name: "Production Backend Service", key_prefix: "inc_9f82a1", is_active: true, created_at: "2026-08-20T10:00:00Z" }
  ]);
  const [webhooks, setWebhooks] = useState<any[]>([
    { id: "wh-1", target_url: "https://api.novahealth.in/webhooks/incorvo", event_types: ["submission.approved", "lead.generated"], is_active: true }
  ]);

  const [newKeyName, setNewKeyName] = useState("");
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);

  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [creatingWebhook, setCreatingWebhook] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [kRes, wRes] = await Promise.allSettled([
          apiRequest("/developer/keys"),
          apiRequest("/developer/webhooks")
        ]);
        if (kRes.status === "fulfilled" && Array.isArray(kRes.value)) setKeys(kRes.value);
        if (wRes.status === "fulfilled" && Array.isArray(wRes.value)) setWebhooks(wRes.value);
      } catch (err) {
        // fallback
      }
    }
    load();
  }, []);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingKey(true);
    try {
      const res = await apiRequest("/developer/keys", {
        method: "POST",
        body: JSON.stringify({ name: newKeyName })
      });
      setGeneratedSecret(res.plain_secret_key);
      setKeys((prev) => [...prev, { id: res.id, name: res.name, key_prefix: res.key_prefix, is_active: true, created_at: new Date().toISOString() }]);
      setNewKeyName("");
    } catch (err) {
      // fallback
    } finally {
      setCreatingKey(false);
    }
  };

  const handleAddWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingWebhook(true);
    try {
      const res = await apiRequest("/developer/webhooks", {
        method: "POST",
        body: JSON.stringify({
          target_url: newWebhookUrl,
          event_types: ["submission.approved", "lead.generated"]
        })
      });
      setWebhooks((prev) => [...prev, { id: res.id, target_url: res.target_url, event_types: res.event_types, is_active: true }]);
      setNewWebhookUrl("");
    } catch (err) {
      // fallback
    } finally {
      setCreatingWebhook(false);
    }
  };

  return (
    <DashboardLayout portalType="vendor">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Developer Platform & Webhook Subscriptions</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Integrate Incorvo Reach with Incorvo One, Shopify, Zoho CRM, Salesforce, or your custom API
          </p>
        </div>

        {/* API Key Modal / Alert */}
        {generatedSecret && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
              <Key className="w-4 h-4 text-amber-700" />
              <span>Copy Your Secret API Key (Shown only once)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-amber-300 font-mono text-xs text-brand-navy">
              <span>{generatedSecret}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(generatedSecret); alert("API Key copied!"); }}
                className="px-3 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px]"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* API Keys Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-brand-navy">REST API Keys</h2>
              <p className="text-xs text-brand-muted">Authenticate server-to-server requests with Bearer tokens</p>
            </div>

            <form onSubmit={handleGenerateKey} className="flex items-center gap-2">
              <input
                type="text"
                required
                placeholder="Key label (e.g., Zapier CRM Sync)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="px-3 py-2 rounded-xl border border-brand-border text-xs focus:outline-none"
              />
              <button
                type="submit"
                disabled={creatingKey}
                className="px-4 py-2 rounded-xl gradient-brand text-white font-bold text-xs shadow-xs hover:brightness-105"
              >
                Create Key
              </button>
            </form>
          </div>

          <div className="divide-y divide-slate-100 border-t border-slate-100 pt-2 text-xs">
            {keys.map((k) => (
              <div key={k.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-brand-navy block">{k.name}</span>
                  <span className="font-mono text-slate-500 text-[11px]">{k.key_prefix}••••••••••••••••</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Webhooks Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-brand-navy">Webhook Subscriptions</h2>
              <p className="text-xs text-brand-muted">Receive cryptographic real-time HTTP POST event notifications</p>
            </div>

            <form onSubmit={handleAddWebhook} className="flex items-center gap-2">
              <input
                type="url"
                required
                placeholder="https://your-domain.com/webhooks"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                className="px-3 py-2 rounded-xl border border-brand-border text-xs focus:outline-none w-64"
              />
              <button
                type="submit"
                disabled={creatingWebhook}
                className="px-4 py-2 rounded-xl bg-brand-navy text-white font-bold text-xs shadow-xs hover:brightness-110"
              >
                Add Webhook
              </button>
            </form>
          </div>

          <div className="divide-y divide-slate-100 border-t border-slate-100 pt-2 text-xs">
            {webhooks.map((w) => (
              <div key={w.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-brand-navy block truncate max-w-md">{w.target_url}</span>
                  <span className="text-[11px] text-slate-500">
                    Events: {Array.isArray(w.event_types) ? w.event_types.join(", ") : "All Events"}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-brand-blue">
                  ENABLED
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
