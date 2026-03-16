"use client";
import { createClient } from "@/lib/supabase/client";

interface CheckoutButtonProps {
  checkoutUrl: string;
  children: React.ReactNode;
  className?: string;
}

export default function CheckoutButton({ checkoutUrl, children, className }: CheckoutButtonProps) {
  const handleClick = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const email = user?.email;
    const url = email
      ? `${checkoutUrl}?checkout[email]=${encodeURIComponent(email)}`
      : checkoutUrl;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
