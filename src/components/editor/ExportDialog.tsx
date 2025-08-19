"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Download } from "lucide-react";
import { LabeledInput } from "./ui-helpers";

interface ExportDialogProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-headline">Export</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Preset</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="w-full justify-between">Reels (1080×1920) <ChevronDown className="h-4 w-4"/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Social</DropdownMenuLabel>
                  <DropdownMenuItem>Reels / TikTok (1080×1920)</DropdownMenuItem>
                  <DropdownMenuItem>YouTube Shorts (1080×1920)</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Standard</DropdownMenuLabel>
                  <DropdownMenuItem>1080p 25fps</DropdownMenuItem>
                  <DropdownMenuItem>4K 25fps</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <LabeledInput label="Bitrate" placeholder="12 Mbps" />
            <LabeledInput label="Audio" placeholder="AAC 320 kbps" />
            <LabeledInput label="File Name" placeholder="final_export.mp4" />
          </div>
          <Separator/>
          <div className="text-xs text-muted-foreground font-headline">Queue</div>
          <div className="rounded-lg border border-border bg-secondary p-3 text-xs">
            <div className="flex items-center justify-between">
              <div>Job #1 — Reels 1080×1920 — <span className="text-green-400">Ready</span></div>
              <Button size="sm" variant="secondary">Start</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
          <Button><Download className="h-4 w-4 mr-2"/>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
