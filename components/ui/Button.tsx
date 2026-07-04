import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "primary" | "gold" | "dark" | "ghost";
type Size = "xs" | "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-emerald text-white hover:bg-emerald-deep",
  gold: "bg-grad-gold text-navy hover:brightness-[1.03]",
  dark: "bg-navy text-white hover:bg-navy-light",
  ghost: "bg-white text-navy border border-line-input hover:bg-surface",
};

const SIZES: Record<Size, string> = {
  xs: "h-8 rounded-[8px] px-3.5 text-[12.5px]",
  sm: "h-[38px] rounded-[10px] px-[18px] text-[13.5px]",
  md: "h-10 rounded-[10px] px-5 text-[13.5px]",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = "Button";
