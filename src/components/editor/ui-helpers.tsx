"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

export function LabeledInput({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <div>
      <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <Input placeholder={placeholder} className="bg-transparent border-input" />
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
