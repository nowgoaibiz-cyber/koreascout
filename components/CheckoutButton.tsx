"use client";
import { createClient } from "@/lib/supabase/client";

interface CheckoutButtonProps {
  checkoutUrl: string;
  children: React.ReactNode;
  className?: string;
  discountCode?: string;
}

export default function CheckoutButton({
  checkoutUrl,
  children,
  className,
  discountCode,
}: CheckoutButtonProps) {
  const handleClick = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    const email = user?.email;
    const [base, existingQuery] = checkoutUrl.split("?");
    const params = new URLSearchParams(existingQuery ?? "");
    if (discountCode) params.set("discount", discountCode);
    if (email) params.set("checkout[email]", email);
    if (userId) params.set("checkout[custom][user_id]", userId);
    const qs = params.toString();
    const url = qs ? `${base}?${qs}` : base;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
