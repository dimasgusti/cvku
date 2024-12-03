import { ReactNode } from "react";
import clsx from "clsx";

interface TextProps {
  variant?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  children: ReactNode;
}

const Text = ({ variant = "p", className, children }: TextProps) => {
  const baseStyles = "text-gray-900";
  const variants = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-semibold",
    h3: "text-2xl font-medium",
    p: "text-base text-black/70",
    span: "text-sm",
  };

  const Component = variant;

  return (
    <Component className={clsx(baseStyles, variants[variant], className)}>
      {children}
    </Component>
  );
};

export default Text;