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
    const userId = user?.id;
    const email = user?.email;
    const params = new URLSearchParams();
    if (email) params.set("checkout[email]", email);
    if (userId) params.set("checkout[custom][user_id]", userId);
    const qs = params.toString();
    const url = qs ? `${checkoutUrl}?${qs}` : checkoutUrl;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
