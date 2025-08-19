"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Film, Layers, PanelLeft, PanelRight, Search, Upload, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TooltipWrap } from "./ui-helpers";

function AssetsPane() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <Button variant="secondary" className="h-8"><Upload className="h-4 w-4 mr-2"/>Import</Button>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
          <Input placeholder="Search assets…" className="pl-8 h-8 bg-transparent border-input"/>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 grid grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-md bg-secondary border border-border overflow-hidden">
               <img src="https://placehold.co/300x200" alt={`Clip ${i+1}`} className="w-full h-full object-cover" data-ai-hint="video footage" />
            </div>
          ))}
        </div>
        <div className="px-3 pb-3">
          <h4 className="font-headline text-xs uppercase tracking-wide text-muted-foreground mt-2 mb-1">Smart Bins</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              "B‑roll wide",
              "Talking head",
              "Smiles",
              "Noisy audio",
              "Out of focus",
            ].map((b) => (
              <div key={b} className="px-2 py-1 rounded bg-secondary border border-border text-xs text-muted-foreground">{b}</div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function TemplatesPane() {
  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-3">
        {[
          { name: "TikTok 60s Punch‑Cut", desc: "Fast cuts, captions, beat sync", tag: "Reels/Shorts" },
          { name: "Talking‑Head Explainer", desc: "Jump cuts, lower‑thirds, denoise", tag: "YouTube" },
          { name: "Product Reel", desc: "Clean wipes, brand colors, hero shots", tag: "Ads" },
        ].map((t) => (
          <div key={t.name} className="p-3 rounded-lg bg-secondary border border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium font-headline">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </div>
              <Button size="sm">Use</Button>
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground/80">{t.tag}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function AgentsPane() {
  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-3">
        {[
          { name: "Auto‑Cut", desc: "Detect scenes and punch‑cut" },
          { name: "Auto‑Caption", desc: "ASR + styling presets" },
          { name: "Auto‑Color", desc: "LUT + exposure + curves" },
        ].map((a) => (
          <div key={a.name} className="p-3 rounded-lg bg-secondary border border-border flex items-center justify-between">
            <div>
              <div className="text-sm font-medium font-headline">{a.name}</div>
              <div className="text-xs text-muted-foreground">{a.desc}</div>
            </div>
            <Button size="sm" variant="secondary">Run</Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export function LeftRail({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const [tab, setTab] = useState<"assets" | "templates" | "agents">("assets");

  return (
    <div className="h-full flex flex-col bg-secondary/20">
      <div className="flex h-full">
        <div className="w-12 border-r border-border flex flex-col items-center py-2 gap-2 bg-background/20">
          <TooltipWrap label="Toggle Panel">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
              {collapsed ? <PanelRight className="h-4 w-4"/> : <PanelLeft className="h-4 w-4"/>}
            </Button>
          </TooltipWrap>
          <Separator className="mx-auto w-6 bg-border" />
          <TooltipWrap label="Assets">
            <Button variant={tab === "assets" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setTab("assets")}>
              <Film className="h-4 w-4"/>
            </Button>
          </TooltipWrap>
          <TooltipWrap label="Templates">
            <Button variant={tab === "templates" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setTab("templates")}>
              <Layers className="h-4 w-4"/>
            </Button>
          </TooltipWrap>
          <TooltipWrap label="Agents">
            <Button variant={tab === "agents" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setTab("agents")}>
              <Wand2 className="h-4 w-4"/>
            </Button>
          </TooltipWrap>
        </div>
        <div className="flex-1 min-w-0">
          {!collapsed && (
            <div className="h-full">
              {tab === "assets" && <AssetsPane />}
              {tab === "templates" && <TemplatesPane />}
              {tab === "agents" && <AgentsPane />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
