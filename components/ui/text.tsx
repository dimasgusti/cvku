import { ReactNode } from "react";
import clsx from "clsx";

interface TextProps {
  variant?:
    | "heading1"
    | "heading2"
    | "heading3"
    | "subheading"
    | "body"
    | "caption"
    | "small";
  className?: string;
  children: ReactNode;
}

const Text = ({ variant = "body", className, children }: TextProps) => {
  const baseStyles = "text-gray-900"; 

  const variants = {
    heading1:
      "text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl", 
    heading2:
      "text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl", 
    heading3:
      "text-xl font-medium sm:text-2xl md:text-3xl lg:text-4xl", 
    subheading:
      "text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl", 
    body: "text-base sm:text-lg md:text-xl text-black/70", 
    caption: "text-sm sm:text-base", 
    small: "text-xs sm:text-sm", 
  };

  const Component = variant.startsWith("heading") ? "h1" : variant.startsWith("subheading") ? "h2" : "p";

  return (
    <Component className={clsx(baseStyles, variants[variant], className)}>
      {children}
    </Component>
  );
};

export default Text;