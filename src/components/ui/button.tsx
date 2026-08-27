import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display font-semibold tracking-wide uppercase transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper",
        secondary: "border border-ink bg-transparent text-ink",
        ghost: "bg-transparent text-ink",
        closed: "bg-closed text-closed-fg",
      },
      size: {
        field: "h-14 w-full px-4 text-lg rounded-md",
        row: "h-12 px-4 text-base rounded-md",
        icon: "size-14 shrink-0 rounded-md",
        chip: "h-9 px-3 text-stamp rounded-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "field",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
