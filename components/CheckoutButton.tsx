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
    if (email) {
      const confirmed = window.confirm(
        `Your KoreaScout subscription will be registered under:\n\n${email}\n\nPlease make sure this is the correct email before proceeding.\nIf you are logged in with the wrong account, please log out and sign in with the correct email first.`
      );
      if (!confirmed) return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
