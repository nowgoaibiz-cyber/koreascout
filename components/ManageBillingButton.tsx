"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function ManageBillingButton({
  className,
  children = "Manage Billing",
  accessibleProductCount = 0,
}: {
  className?: string;
  children?: React.ReactNode;
  accessibleProductCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    if (open) setIsAgreed(false);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="churn-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 backdrop-blur-sm bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close modal"
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 text-center">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 cursor-pointer transition-colors p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
            <h2
              id="churn-modal-title"
              className="text-3xl font-black text-gray-900 tracking-tighter text-center text-balance"
            >
              Wait! Are you sure you want to abandon your vault?
            </h2>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center mt-6 mb-6">
              <p className="text-red-700 font-black text-xl text-balance">
                You will permanently lose access to {accessibleProductCount} unlocked K-Product{"\u00A0"}
                reports.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-gray-800 text-lg font-medium px-4 text-left">
              <p>💥 All accumulated research assets will be permanently locked.</p>
              <p>🚫 Your past data will NOT be restored even if you resubscribe.</p>
              <p>⏱️ You will reset to only the latest 3 weeks of data.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mt-6 border border-gray-200 text-left">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1A1916] focus:ring-[#1A1916]"
                />
                <span className="text-sm font-bold text-gray-700 ml-3 leading-snug text-balance">
                  I understand that I am permanently forfeiting access to my {accessibleProductCount}
                  {"\u00A0"}unlocked{"\u00A0"}reports.
                </span>
              </label>
            </div>

            <div className="flex flex-col items-center mt-6 w-full">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-[#1A1916] text-white py-4 rounded-xl font-black text-xl w-full hover:bg-black scale-100 hover:scale-[1.02] transition-transform"
              >
                KEEP MY VAULT
              </button>
              {!isAgreed ? (
                <span className="text-base text-gray-400 font-medium mt-8 text-center block opacity-30 cursor-not-allowed pb-6">
                  Proceed to cancel (Phase 4).
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-gray-400 hover:text-gray-600 hover:underline transition-all mt-8 text-center block cursor-pointer pb-6"
                >
                  Proceed to cancel (Phase 4).
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
