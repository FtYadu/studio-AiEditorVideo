
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Film, Layers, PanelLeft, PanelRight, Search, Upload, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TooltipWrap } from "./ui-helpers";
import type { Asset, Template } from "@/types/editor";
import { cn } from "@/lib/utils";

interface AssetsPaneProps {
  onImport: () => void;
  assets: Asset[];
  selectedAsset: Asset | null;
  onAssetClick: (asset: Asset) => void;
}

function AssetsPane({ onImport, assets, selectedAsset, onAssetClick }: AssetsPaneProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <Button variant="secondary" className="h-8" onClick={onImport}><Upload className="h-4 w-4 mr-2"/>Import</Button>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
          <Input placeholder="Search assets…" className="pl-8 h-8 bg-transparent border-input"/>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 grid grid-cols-2 xl:grid-cols-3 gap-3">
          {assets.map((asset) => (
            <div 
              key={asset.id} 
              className={cn(
                "aspect-video rounded-md bg-secondary border border-border overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-primary/50",
                selectedAsset?.id === asset.id && "ring-primary"
              )}
              onClick={() => onAssetClick(asset)}
            >
               {asset.type === 'video' ? (
                  <video src={asset.url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full object-cover bg-secondary grid place-content-center text-xs text-muted-foreground">{asset.name}</div>
                )}
            </div>
          ))}
          {assets.length === 0 && Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-video rounded-md bg-secondary border border-border overflow-hidden">
               <img src="https://placehold.co/300x200.png" alt={`Clip ${i+1}`} className="w-full h-full object-cover" data-ai-hint="video footage" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface TemplatesPaneProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
}

function TemplatesPane({ templates, onTemplateSelect }: TemplatesPaneProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-3">
        {templates.map((t) => (
          <div key={t.name} className="p-3 rounded-lg bg-secondary border border-border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium font-headline">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.description}</div>
              </div>
              <Button size="sm" onClick={() => onTemplateSelect(t)}>Use</Button>
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground/80">{t.tag}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

interface AgentsPaneProps {
  onAutoCaption: () => void;
  onAutoCut: () => void;
  onAutoColor: () => void;
}

function AgentsPane({ onAutoCaption, onAutoCut, onAutoColor }: AgentsPaneProps) {
  const agents = [
    { name: "Auto‑Cut", desc: "Detect scenes and punch‑cut", action: onAutoCut },
    { name: "Auto‑Caption", desc: "ASR + styling presets", action: onAutoCaption },
    { name: "Auto‑Color", desc: "LUT + exposure + curves", action: onAutoColor },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-3">
        {agents.map((a) => (
          <div key={a.name} className="p-3 rounded-lg bg-secondary border border-border flex items-center justify-between">
            <div>
              <div className="text-sm font-medium font-headline">{a.name}</div>
              <div className="text-xs text-muted-foreground">{a.desc}</div>
            </div>
            <Button size="sm" variant="secondary" onClick={a.action}>Run</Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

interface LeftRailProps {
  collapsed: boolean;
  onToggle: () => void;
  onAutoCaption: () => void;
  onAutoCut: () => void;
  onAutoColor: () => void;
  onImport: () => void;
  assets: Asset[];
  selectedAsset: Asset | null;
  onAssetClick: (asset: Asset) => void;
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
}

export function LeftRail({ 
  collapsed, 
  onToggle, 
  onAutoCaption, 
  onAutoCut,
  onAutoColor,
  onImport, 
  assets, 
  selectedAsset, 
  onAssetClick,
  templates,
  onTemplateSelect
}: LeftRailProps) {
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
              {tab === "assets" && <AssetsPane onImport={onImport} assets={assets} selectedAsset={selectedAsset} onAssetClick={onAssetClick} />}
              {tab === "templates" && <TemplatesPane templates={templates} onTemplateSelect={onTemplateSelect} />}
              {tab === "agents" && <AgentsPane onAutoCaption={onAutoCaption} onAutoCut={onAutoCut} onAutoColor={onAutoColor} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
