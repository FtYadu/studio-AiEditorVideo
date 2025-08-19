"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelLeft, PanelRight } from "lucide-react";
import { LabeledInput, TooltipWrap } from "./ui-helpers";
import type { Asset } from "@/types/editor";

interface InspectorProps {
  collapsed: boolean;
  onToggle: () => void;
  selectedAsset: Asset | null;
}

export function Inspector({ collapsed, onToggle, selectedAsset }: InspectorProps) {
  const [tab, setTab] = useState("general");
  const [clipName, setClipName] = useState("Clip 001");

  useEffect(() => {
    if (selectedAsset) {
      setClipName(selectedAsset.name);
    }
  }, [selectedAsset]);

  return (
    <div className="h-full flex flex-col bg-secondary/20">
      <div className="h-10 border-b border-border flex items-center px-2 gap-2">
        <TooltipWrap label="Toggle Inspector">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggle}>
                {collapsed ? <PanelLeft className="h-4 w-4"/> : <PanelRight className="h-4 w-4"/>}
            </Button>
        </TooltipWrap>
        {!collapsed && <div className="text-xs text-muted-foreground font-headline">Inspector</div>}
      </div>
      {collapsed || !selectedAsset ? null : (
        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="m-2 bg-background/50 border-border">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="effect">Effect</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
            <TabsTrigger value="meta">Meta</TabsTrigger>
          </TabsList>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
                <div className="p-3 space-y-4">
                    <TabsContent value="general" className="mt-0 space-y-4">
                        <LabeledInput label="Name" placeholder="Clip 001" value={clipName} onChange={(e) => setClipName(e.target.value)} />
                        <LabeledInput label="In/Out" placeholder="00:00:02:12 – 00:00:08:14" />
                        <LabeledInput label="Transform" placeholder="X:0 Y:0 Scale:100%" />
                        <LabeledInput label="Opacity" placeholder="100%" />
                    </TabsContent>
                    <TabsContent value="effect" className="mt-0 space-y-4">
                        <LabeledInput label="LUT" placeholder="none" />
                        <LabeledInput label="Exposure" placeholder="0.0" />
                        <LabeledInput label="Contrast" placeholder="1.0" />
                        <LabeledInput label="Saturation" placeholder="1.0" />
                    </TabsContent>
                    <TabsContent value="audio" className="mt-0 space-y-4">
                        <LabeledInput label="Volume" placeholder="-3 dB" />
                        <LabeledInput label="Denoise" placeholder="Medium" />
                        <LabeledInput label="Duck Music" placeholder="-12 dB on speech" />
                    </TabsContent>
                    <TabsContent value="ai" className="mt-0 space-y-4">
                        <LabeledInput label="Recipe" placeholder="TikTok 60s Punch‑Cut" />
                        <LabeledInput label="Aggressiveness" placeholder="High" />
                        <LabeledInput label="Subtitle Style" placeholder="Reels Bold" />
                        <LabeledInput label="Brand Colors" placeholder="#6366F1 / #A855F7" />
                    </TabsContent>
                    <TabsContent value="meta" className="mt-0 space-y-4">
                        <LabeledInput label="Camera" placeholder="FX30 4K24" />
                        <LabeledInput label="Lens" placeholder="35mm" />
                        <LabeledInput label="Creator" placeholder="Yadu" />
                        <LabeledInput label="Asset ID" placeholder={selectedAsset.id} readOnly />
                        <LabeledInput label="Asset Type" placeholder={selectedAsset.type} readOnly />
                    </TabsContent>
                </div>
            </ScrollArea>
          </div>
        </Tabs>
      )}
    </div>
  );
}
