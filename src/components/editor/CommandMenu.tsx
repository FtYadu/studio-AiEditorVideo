"use client";

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CommandAction } from "@/types/editor";

interface CommandMenuProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    actions: CommandAction[];
}

export function CommandMenu({ open, onOpenChange, actions }: CommandMenuProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          {actions.map((a) => (
            <CommandItem key={a.id} onSelect={() => { a.run(); onOpenChange(false); }}>
              {a.icon} {a.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
