"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Download, ListVideo, MonitorDown, Save, User } from "lucide-react";

interface TopBarProps {
  projectName: string;
  onRename: (v: string) => void;
  draftQuality: boolean;
  setDraftQuality: (v: boolean | ((p: boolean) => boolean)) => void;
  proxy: number;
  setProxy: (v: number) => void;
  onExport: () => void;
}

export function TopBar({
  projectName,
  onRename,
  draftQuality,
  setDraftQuality,
  proxy,
  setProxy,
  onExport,
}: TopBarProps) {
  return (
    <div className="h-14 flex items-center gap-3 px-4 border-b border-border bg-background/30 backdrop-blur-sm">
      <ListVideo className="h-5 w-5 text-foreground/90" />
      <div className="flex items-center gap-2">
        <Input
          className="h-8 w-[240px] bg-transparent border-input focus-visible:ring-ring focus-visible:ring-offset-background font-headline text-lg"
          value={projectName}
          onChange={(e) => onRename(e.target.value)}
        />
        <Badge variant="secondary" className="border-border text-xs">Saved</Badge>
      </div>
      <Separator orientation="vertical" className="h-6 bg-border" />

      <div className="hidden md:flex items-center gap-3">
        <Button variant="secondary" className="h-8" onClick={() => setDraftQuality((d: boolean) => !d)}>
          <MonitorDown className="h-4 w-4 mr-2" /> {draftQuality ? "Draft" : "Full"}
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Proxy</span>
          <Slider value={[proxy]} onValueChange={(v) => setProxy(v[0])} className="w-28" />
          <span className="text-xs w-8 text-right text-muted-foreground">{proxy}%</span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="secondary" className="h-8"><Save className="h-4 w-4 mr-2"/>Save</Button>
        <Button className="h-8" onClick={onExport}><Download className="h-4 w-4 mr-2"/>Export</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full border border-border">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Switch Workspace</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
