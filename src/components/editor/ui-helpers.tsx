"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import React from "react";

export function LabeledInput({ label, ...props }: { label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div>
      <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <Input className="bg-transparent border-input" {...props} />
    </div>
  );
}

export function TooltipWrap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right"><span className="text-xs">{label}</span></TooltipContent>
    </Tooltip>
  );
}
