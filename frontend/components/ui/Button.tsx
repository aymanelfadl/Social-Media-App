import { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base = "inline-flex items-center justify-center font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-3",
};
const variants: Record<Variant, string> = {
  primary: "bg-sky-500 text-white hover:bg-sky-600",
  outline: "border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900",
  ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-900",
};

type Props = ComponentPropsWithoutRef<"button"> & { variant?: Variant; size?: Size };

export default function Button({ className = "", variant = "primary", size = "md", ...props }: Props) {
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />;
}