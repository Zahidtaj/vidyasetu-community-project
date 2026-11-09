import React, { useState } from 'react';
import { Globe, X, CheckCircle2, Copy, ExternalLink, ShieldCheck, Server } from 'lucide-react';

export function CustomDomainModal({ isOpen, onClose, lang }) {
  const [copiedRecord, setCopiedRecord] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [verifiedDomain, setVerifiedDomain] = useState(
    localStorage.getItem('vidyasetu_custom_domain') || 'vidyasetu.netlify.app'
  );
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(key);
    setTimeout(() => setCopiedRecord(''), 2000);
  };

  const handleSaveDomain = (e) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    const clean = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    localStorage.setItem('vidyasetu_custom_domain', clean);
    setVerifiedDomain(clean);
    setStatusMsg(`Domain '${clean}' mapped. Ensure DNS records below are configured with your registrar.`);
    setDomainInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-slate-800 dark:text-slate-200">
      <div className="w-full max-w-xl rounded-lg p-6 relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl animate-modal">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              {lang === 'kn' ? 'ಕಸ್ಟಮ್ ಡೊಮೇನ್ ಕಾನ್ಫಿಗರೇಶನ್' : 'Production Custom Domain Configuration'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Karnataka High School Digital Platform (VTU Course 1BCP308)
            </p>
          </div>
        </div>

        {/* Current Active Domain Banner */}
        <div className="my-4 p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Active Production Hostname:</span>
            <span className="font-mono font-bold text-blue-700 dark:text-blue-400 text-sm">
              https://{verifiedDomain}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            SSL Enabled
          </span>
        </div>

        {statusMsg && (
          <div className="mb-4 p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded text-xs">
            {statusMsg}
          </div>
        )}

        {/* Form to Set Custom Domain */}
        <form onSubmit={handleSaveDomain} className="mb-6">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Map Custom Domain or Subdomain
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="e.g. vidyasetu.org or vidyasetu.netlify.app"
              className="inst-input flex-1 px-3 py-2 text-xs font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Update Host
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            You can enter your custom domain or your clean Netlify site alias.
          </p>
        </form>

        {/* DNS Configuration Table */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-slate-500" />
            <span>Authoritative DNS Records (Point to Netlify)</span>
          </h3>

          <div className="border border-slate-200 dark:border-slate-800 rounded overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5">Host</th>
                  <th className="p-2.5">Target Value</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-blue-600">A</td>
                  <td className="p-2.5">@</td>
                  <td className="p-2.5">75.2.60.5</td>
                  <td className="p-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleCopy('75.2.60.5', 'a')}
                      className="text-slate-500 hover:text-blue-600 font-sans"
                    >
                      {copiedRecord === 'a' ? 'Copied' : 'Copy'}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-blue-600">CNAME</td>
                  <td className="p-2.5">www</td>
                  <td className="p-2.5">{verifiedDomain}</td>
                  <td className="p-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleCopy(verifiedDomain, 'cname')}
                      className="text-slate-500 hover:text-blue-600 font-sans"
                    >
                      {copiedRecord === 'cname' ? 'Copied' : 'Copy'}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Direct Netlify instructions link */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-300">
            Configuring on Netlify Drop Dashboard?
          </span>
          <a
            href="https://app.netlify.com"
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Open Netlify Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
