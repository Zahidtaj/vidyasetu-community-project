import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Bell, 
  Activity, 
  BookOpen, 
  ToggleLeft, 
  ToggleRight,
  Shield,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { INITIAL_USER_ACCOUNTS, INITIAL_AUDIT_LOGS } from '../data/libraryData';

export function AdminConsole({ 
  lang, 
  currentUser, 
  resources, 
  onApproveResource, 
  onRejectResource, 
  onDeleteResource,
  announcements,
  onAddAnnouncement 
}) {
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'users' | 'announcements' | 'logs'
  const [usersList, setUsersList] = useState(INITIAL_USER_ACCOUNTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // New Announcement Form State
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceTitleKn, setAnnounceTitleKn] = useState('');
  const [announceMsg, setAnnounceMsg] = useState('');
  const [announceTarget, setAnnounceTarget] = useState('All Students and Faculty');
  const [announceSuccess, setAnnounceSuccess] = useState(false);

  // Reject Modal State
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingResources = resources.filter(r => r.status === 'pending');
  const approvedResources = resources.filter(r => r.status === 'approved');

  // Real calculations (zero fake metrics)
  const registeredStudentsCount = usersList.filter(u => u.role === 'student').length;
  const registeredTeachersCount = usersList.filter(u => u.role === 'teacher').length;

  const handleToggleUserStatus = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'inactive' : 'active';
        setAuditLogs(l => [
          {
            id: Date.now(),
            action: 'Account Status Updated',
            detail: `${u.name} status changed to ${nextStatus}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            role: 'admin'
          },
          ...l
        ]);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleConfirmReject = () => {
    if (!rejectingId) return;
    onRejectResource(rejectingId, rejectReason || 'Curriculum criteria revision needed.');
    setAuditLogs(l => [
      {
        id: Date.now(),
        action: 'Resource Rejected',
        detail: `Submission ID #${rejectingId} rejected: ${rejectReason || 'Curriculum revision needed'}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        role: 'admin'
      },
      ...l
    ]);
    setRejectingId(null);
    setRejectReason('');
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (!announceTitle.trim() || !announceMsg.trim()) return;

    const newObj = {
      id: Date.now(),
      title: announceTitle.trim(),
      titleKn: announceTitleKn.trim() || announceTitle.trim(),
      message: announceMsg.trim(),
      messageKn: announceMsg.trim(),
      date: new Date().toISOString().split('T')[0],
      target: announceTarget
    };

    onAddAnnouncement(newObj);
    setAuditLogs(l => [
      {
        id: Date.now(),
        action: 'Notice Broadcasted',
        detail: `New institutional notice: ${announceTitle}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        role: 'admin'
      },
      ...l
    ]);
    setAnnounceSuccess(true);
    setAnnounceTitle('');
    setAnnounceTitleKn('');
    setAnnounceMsg('');
    setTimeout(() => setAnnounceSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-800 dark:text-slate-200">
      
      {/* Admin Profile Banner */}
      <div className="academic-card p-6 sm:p-7 mb-6 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  {currentUser?.name || 'Dr. Nagaraj Bhat'}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Principal & Institutional Superadmin
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Karnataka State Secondary School Administration | Platform Governance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-xs bg-emerald-600"></span>
              <span>System Verification: Nominal</span>
            </span>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer border ${
              activeTab === 'approvals'
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'kn' ? 'ಅನುಮೋದನೆ ಸರತಿ ಸಾಲು' : 'Approvals Queue'} ({pendingResources.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer border ${
              activeTab === 'users'
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'kn' ? 'ಬಳಕೆದಾರರ ಖಾತೆಗಳು' : 'Account Management'} ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer border ${
              activeTab === 'announcements'
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'kn' ? 'ಶಾಲಾ ಪ್ರಕಟಣೆಗಳು' : 'Broadcast Notice'}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer border ${
              activeTab === 'logs'
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'kn' ? 'ಆಡಿಟ್ ಲಾಗ್‌ಗಳು' : 'Audit Logs'} ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Real KPI Cards (Calculated directly from actual database state) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="academic-card p-5">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {lang === 'kn' ? 'ನೋಂದಾಯಿತ ವಿದ್ಯಾರ್ಥಿಗಳು' : 'Active Students'}
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading tabular-nums">
            {registeredStudentsCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">Enrolled secondary sections</p>
        </div>

        <div className="academic-card p-5">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {lang === 'kn' ? 'ಬೋಧಕ ಸಿಬ್ಬಂದಿ' : 'Faculty Accounts'}
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading tabular-nums">
            {registeredTeachersCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">Verified department faculty</p>
        </div>

        <div className="academic-card p-5">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {lang === 'kn' ? 'ಪ್ರಕಟಿತ ಸಾಮಗ್ರಿಗಳು' : 'Published Documents'}
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading tabular-nums">
            {approvedResources.length}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">Live in student library</p>
        </div>

        <div className="academic-card p-5">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {lang === 'kn' ? 'ಅನುಮೋದನೆ ಬಾಕಿ' : 'Pending Approvals'}
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-heading tabular-nums">
            {pendingResources.length}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">Awaiting verification</p>
        </div>
      </div>

      {/* Tab 1: Approvals Queue */}
      {activeTab === 'approvals' && (
        <div className="academic-card p-6">
          <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {lang === 'kn' ? 'ಶಿಕ್ಷಕರು ಸಲ್ಲಿಸಿದ ಸಂಪನ್ಮೂಲಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ' : 'Curriculum Document Verification Queue'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verify syllabus alignment against DSERT blueprints prior to student body release.
            </p>
          </div>

          {pendingResources.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-70" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Queue Clear
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Zero pending curriculum documents requiring administrative inspection.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingResources.map((res) => (
                <div 
                  key={res.id}
                  className="p-4 rounded border border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-mono">
                        {res.className} | {res.subject}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">Author: {res.author} | Date: {res.uploadedOn}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                      {res.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                      {res.summary}
                    </p>
                    {res.chapters && res.chapters[0] && (
                      <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 text-[11px] font-mono text-slate-600 dark:text-slate-400 line-clamp-2">
                        {res.chapters[0].content}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onApproveResource(res.id)}
                      className="py-1.5 px-3 rounded text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                    <button
                      onClick={() => setRejectingId(res.id)}
                      className="py-1.5 px-3 rounded text-xs font-bold bg-red-50 text-red-700 hover:bg-red-700 hover:text-white border border-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#111827] rounded-lg p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-modal">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Record Rejection Reason</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              State the curriculum or formatting revision required for the faculty contributor.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Please append step-by-step numerical derivations for Question 3..."
              rows={3}
              className="inst-input w-full p-2.5 text-xs mb-3"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRejectingId(null)}
                className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-3 py-1.5 rounded bg-red-700 hover:bg-red-800 text-white font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Accounts */}
      {activeTab === 'users' && (
        <div className="academic-card p-6">
          <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {lang === 'kn' ? 'ಬಳಕೆದಾರರ ಖಾತೆಗಳ ಡೈರೆಕ್ಟರಿ' : 'Enrolled User Accounts Directory'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage student enrollment status and faculty role authorization.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-2">{lang === 'kn' ? 'ಹೆಸರು' : 'Name'}</th>
                  <th className="pb-2">{lang === 'kn' ? 'ಪಾತ್ರ' : 'Role'}</th>
                  <th className="pb-2">{lang === 'kn' ? 'ವಿವರ' : 'Designation / Section'}</th>
                  <th className="pb-2">{lang === 'kn' ? 'ಸ್ಥಿತಿ' : 'Status'}</th>
                  <th className="pb-2 text-right">{lang === 'kn' ? 'ಸ್ಥಿತಿ ಬದಲಾವಣೆ' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersList.map((user) => {
                  const isActive = user.status === 'active';
                  return (
                    <tr key={user.id} className="text-slate-700 dark:text-slate-300">
                      <td className="py-2.5">
                        <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                      </td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-500">{user.designation} | {user.assignedClass}</td>
                      <td className="py-2.5">
                        {isActive ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                            Deactivated
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className="p-1 rounded text-slate-500 hover:text-blue-700 transition-colors cursor-pointer"
                          title="Toggle active status"
                        >
                          {isActive ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Announcements */}
      {activeTab === 'announcements' && (
        <div className="academic-card p-6 sm:p-8 max-w-2xl mx-auto">
          <div className="mb-5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              {lang === 'kn' ? 'ಶಾಲಾ ಪ್ರಕಟಣೆ ಪ್ರಸಾರ ಮಾಡಿ' : 'Broadcast Institutional Notice'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Publish board examination timetables, workbook releases, or academic directives.
            </p>
          </div>

          {announceSuccess && (
            <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Notice broadcasted across student and faculty dashboards.</span>
            </div>
          )}

          <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notice Title (English) *
              </label>
              <input
                type="text"
                value={announceTitle}
                onChange={(e) => setAnnounceTitle(e.target.value)}
                placeholder="e.g. Class 10 SSLC Science Pre-Exam Revision Clinic"
                required
                className="inst-input w-full px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notice Title (Kannada)
              </label>
              <input
                type="text"
                value={announceTitleKn}
                onChange={(e) => setAnnounceTitleKn(e.target.value)}
                placeholder="ಉದಾ: ೧೦ನೇ ತರಗತಿ ಎಸ್‌ಎಸ್‌ಎಲ್‌ಸಿ ವಿಜ್ಞಾನ ಪುನರಾವರ್ತನಾ ತರಗತಿಗಳು"
                className="inst-input w-full px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Audience
              </label>
              <select
                value={announceTarget}
                onChange={(e) => setAnnounceTarget(e.target.value)}
                className="inst-input w-full px-3 py-2 text-xs"
              >
                <option value="All Students and Faculty">All Students and Faculty</option>
                <option value="Class 10 (SSLC) Only">Class 10 (SSLC) Only</option>
                <option value="Faculty Only">Faculty Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notice Statement *
              </label>
              <textarea
                value={announceMsg}
                onChange={(e) => setAnnounceMsg(e.target.value)}
                rows={3}
                placeholder="Detailed announcement content..."
                required
                className="inst-input w-full px-3 py-2 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Bell className="w-4 h-4" />
              <span>Broadcast Notice</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="academic-card p-6">
          <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {lang === 'kn' ? 'ವ್ಯವಸ್ಥೆಯ ಚಟುವಟಿಕೆಗಳ ಆಡಿಟ್ ಲಾಗ್‌ಗಳು' : 'Institutional System Audit and Verification Log'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chronological security record of document uploads, approvals, status modifications, and authentications.
            </p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div 
                key={log.id} 
                className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-xs ${
                    log.role === 'admin' ? 'bg-blue-600' : (log.role === 'teacher' ? 'bg-emerald-600' : 'bg-slate-500')
                  }`}></span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white mr-2">{log.action}:</span>
                    <span className="text-slate-600 dark:text-slate-300">{log.detail}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-mono shrink-0 ml-4">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
