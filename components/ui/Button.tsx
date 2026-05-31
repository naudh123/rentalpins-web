import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: "rp-btn rp-btn-primary",
  secondary: "rp-btn rp-btn-secondary",
  ghost: "rp-btn rp-btn-ghost",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", fullWidth, className = "", children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`${variantClass[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
