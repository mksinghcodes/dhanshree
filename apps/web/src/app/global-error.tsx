'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Dhanshree Global Root Error Caught]:', {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-slate-200 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            System Unavailable
          </h1>

          <p className="text-sm text-slate-600 mb-6">
            A critical system error occurred. We are actively working to restore service.
          </p>

          {error.digest && (
            <p className="text-xs text-slate-400 font-mono mb-6">
              Incident ID: {error.digest}
            </p>
          )}

          <button
            onClick={() => reset()}
            className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
