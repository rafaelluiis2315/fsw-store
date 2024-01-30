import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

const SectionTitle = ({
  children,
  className,
  ...props
}: ComponentProps<"p">) => {
  return (
    <p className={cn("mb-3 pl-5 font-bold uppercase", className)} {...props}>
      {children}
    </p>
  );
};

export default SectionTitle;
