import * as LabelPrimitive from "@radix-ui/react-label";
import type { LabelHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "grid gap-1.5 text-sm font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
