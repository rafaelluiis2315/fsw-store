import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Circle } from "lucide-react";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ",
  {
    variants: {
      variant: {
        default:
          "rounded-sm border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        cicle: "rounded-full bg-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface CheckboxProps
  extends Omit<
    React.ComponentProps<typeof CheckboxPrimitive.Root>,
    "ref"
  >,
    VariantProps<typeof checkboxVariants> {
  defaultChecked?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant, defaultChecked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant }), className)}
    defaultChecked={defaultChecked}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {variant === "cicle" ? (
        <Circle className="h-2 w-2 rounded-full bg-primary text-primary" />
      ) : (
        <Check className="h-4 w-4" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
