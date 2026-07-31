import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, UserCheck } from 'lucide-react';
import { firebaseConfig, testFirestoreConnection } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export const FirebaseStatusBanner: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    const result = await testFirestoreConnection();
    setTestResult(result);
    setTesting(false);
  };

  return (
    <div className="bg-teal-950 border-b border-teal-900 text-slate-200 text-xs py-2 px-4 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Project & Database Info */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-teal-950 bg-yellow-500 px-2 py-0.5 rounded-full">
            <Database className="w-3.5 h-3.5" />
            <span>Firebase Active</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-300">
            <span>Project: <strong className="text-white">{firebaseConfig.projectId}</strong></span>
            <span>•</span>
            <span className="hidden sm:inline">DB ID: <code className="bg-teal-900/90 px-2 py-0.5 rounded text-yellow-400 font-mono text-[11px] border border-teal-800">{firebaseConfig.firestoreDatabaseId}</code></span>
          </div>
        </div>

        {/* Right: Auth Status & Connection Test */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-1.5 text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {user.isAnonymous ? 'Guest User' : user.email || user.displayName}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-yellow-400/90 bg-yellow-950/30 px-2.5 py-0.5 rounded-full border border-yellow-900/40">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Not Authenticated</span>
            </div>
          )}

          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="flex items-center space-x-1.5 bg-teal-900 hover:bg-teal-800 text-slate-200 hover:text-white px-3 py-1 rounded-full transition border border-teal-800 disabled:opacity-50 text-xs font-semibold"
            title="Run testConnection to validate backend connectivity"
          >
            <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin text-yellow-400' : 'text-slate-300'}`} />
            <span>{testing ? 'Testing...' : 'Test Sync'}</span>
          </button>
        </div>
      </div>

      {/* Test Result Toast Banner if triggered */}
      {testResult && (
        <div className={`mt-2 p-2 rounded text-xs flex items-center justify-between ${
          testResult.success 
            ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200' 
            : 'bg-rose-950/80 border border-rose-800 text-rose-200'
        }`}>
          <div className="flex items-center space-x-2">
            {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span><strong>Connection Status:</strong> {testResult.message}</span>
          </div>
          <button 
            onClick={() => setTestResult(null)} 
            className="text-slate-400 hover:text-slate-200 font-bold ml-4"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
