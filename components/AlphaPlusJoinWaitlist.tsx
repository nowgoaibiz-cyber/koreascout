"use client";

import { useState } from "react";
import AlphaPlusWaitlistModal from "@/components/AlphaPlusWaitlistModal";

const DEFAULT_CLASSNAME =
  "block w-full border-2 border-gray-400 bg-white hover:bg-gray-50 text-gray-800 text-center px-8 py-4 rounded-lg font-semibold text-lg transition-colors relative z-20 mt-8";

interface AlphaPlusJoinWaitlistProps {
  className?: string;
  children?: React.ReactNode;
}

export default function AlphaPlusJoinWaitlist({
  className = DEFAULT_CLASSNAME,
  children = "Join Waitlist",
}: AlphaPlusJoinWaitlistProps) {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsWaitlistOpen(true)} className={className}>
        {children}
      </button>
      <AlphaPlusWaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </>
  );
}
