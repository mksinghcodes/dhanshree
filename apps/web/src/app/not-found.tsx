import React from 'react';
import Link from 'next/link';
import { Compass, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
          <Compass className="w-8 h-8" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
          404 - Not Found
        </span>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-4 mb-2">
          Page not found
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          The marketplace page or resource you are looking for does not exist or may have been relocated.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Storefront
          </Link>

          <Link
            href="/np"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl transition"
          >
            <Search className="w-4 h-4 mr-2" />
            Explore Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
