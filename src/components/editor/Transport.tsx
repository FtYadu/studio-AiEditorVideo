
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Layers, Pause, Play, Rocket, Share2, SkipBack, SkipForward, Square, Workflow, Scissors } from "lucide-react";
import { TooltipWrap } from "./ui-helpers";

interface TransportProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  timecode: string;
  setTimecode: (v: string) => void;
  mode: "workflow" | "edit";
  setMode: (m: "workflow" | "edit") => void;
  bladeMode: boolean;
  onBladeToggle: () => void;
}

export function Transport({ isPlaying, onPlayToggle, timecode, setTimecode, mode, setMode, bladeMode, onBladeToggle }: TransportProps) {
  return (
    <div className="h-14 border-t border-border bg-background/30 flex items-center px-3 gap-3">
      <Button variant="secondary" className="h-9 w-9" onClick={() => setMode(mode === "workflow" ? "edit" : "workflow")}>
        {mode === "workflow" ? <Layers className="h-4 w-4"/> : <Workflow className="h-4 w-4"/>}
      </Button>
      <Separator orientation="vertical" className="h-6 bg-border" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9"><SkipBack className="h-4 w-4"/></Button>
        <Button variant="secondary" className="h-9 w-9" onClick={onPlayToggle}>{isPlaying ? <Pause className="h-5 w-5"/> : <Play className="h-5 w-5"/>}</Button>
        <Button variant="ghost" size="icon" className="h-9 w-9"><SkipForward className="h-4 w-4"/></Button>
        <Button variant="ghost" size="icon" className="h-9 w-9"><Square className="h-4 w-4"/></Button>
      </div>
      <Separator orientation="vertical" className="h-6 bg-border" />
      <TooltipWrap label="Blade Tool (B)">
        <Button variant={bladeMode ? "default" : "secondary"} className="h-9 w-9" onClick={onBladeToggle}>
            <Scissors className="h-4 w-4"/>
        </Button>
      </TooltipWrap>
      <div className="ml-2 flex items-center gap-2">
        <Input value={timecode} onChange={(e) => setTimecode(e.target.value)} className="h-9 w-32 bg-transparent border-input text-center font-mono" />
        <Badge variant="outline">25 fps</Badge>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="secondary" className="h-9"><Share2 className="h-4 w-4 mr-2"/>Share Preview</Button>
        <Button className="h-9"><Rocket className="h-4 w-4 mr-2"/>Render</Button>
      </div>
    </div>
  );
}

