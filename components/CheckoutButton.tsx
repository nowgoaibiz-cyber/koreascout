"use client";

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
}: CheckoutButtonProps) {
  const handleClick = () => {
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
