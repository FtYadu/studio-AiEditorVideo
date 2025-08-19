
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelLeft, PanelRight } from "lucide-react";
import { LabeledInput, TooltipWrap } from "./ui-helpers";
import type { Asset, Clip } from "@/types/editor";
import { Input } from "../ui/input";

interface InspectorProps {
  collapsed: boolean;
  onToggle: () => void;
  selectedAsset: Asset | null;
  selectedClip: Clip | null;
  onUpdateAsset: (assetId: string, updatedProps: Partial<Asset>) => void;
  onUpdateClip: (clipId: string, updatedProps: Partial<Clip>) => void;
}

export function Inspector({ collapsed, onToggle, selectedAsset, selectedClip, onUpdateAsset, onUpdateClip }: InspectorProps) {
  const [tab, setTab] = useState("general");
  const [itemName, setItemName] = useState("");
  
  // Effect states
  const [opacity, setOpacity] = useState(100);
  const [saturation, setSaturation] = useState(1.0);
  const [contrast, setContrast] = useState(1.0);
  const [exposure, setExposure] = useState(1.0);
  const [lut, setLut] = useState<string | null>(null);

  const item = selectedClip || selectedAsset;
  const itemType = selectedClip ? 'Clip' : (selectedAsset ? 'Asset' : null);

  useEffect(() => {
    if (selectedClip) {
      setItemName(selectedClip.label);
      setOpacity(selectedClip.opacity);
      setSaturation(selectedClip.effects.saturation);
      setContrast(selectedClip.effects.contrast);
      setExposure(selectedClip.effects.exposure);
      setLut(selectedClip.effects.lut);
    } else if (selectedAsset) {
      setItemName(selectedAsset.name);
      // Reset effect states when only an asset is selected
      setOpacity(100);
      setSaturation(1.0);
      setContrast(1.0);
      setExposure(1.0);
      setLut(null);
    } else {
      setItemName("");
    }
  }, [selectedAsset, selectedClip]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value);
  };
  
  const handleNameBlur = () => {
    if (selectedClip && itemName !== selectedClip.label) {
      onUpdateClip(selectedClip.id, { label: itemName });
    } else if (selectedAsset && !selectedClip && itemName !== selectedAsset.name) {
      onUpdateAsset(selectedAsset.id, { name: itemName });
    }
  };

  const handleEffectChange = (effect: string, value: any) => {
    if (selectedClip) {
      const currentEffects = selectedClip.effects;
      onUpdateClip(selectedClip.id, {
        effects: { ...currentEffects, [effect]: value },
      });
    }
  };
  
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
      {collapsed || !item ? null : (
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
                        <LabeledInput label="Name" placeholder="Item Name" value={itemName} onChange={handleNameChange} onBlur={handleNameBlur} />
                        <LabeledInput label="In/Out" placeholder="00:00:02:12 – 00:00:08:14" />
                        <LabeledInput label="Transform" placeholder="X:0 Y:0 Scale:100%" />
                        <div>
                          <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Opacity</div>
                          <Input type="number" min="0" max="100" className="bg-transparent border-input" placeholder="100" value={opacity} onChange={(e) => { const val = parseInt(e.target.value, 10); setOpacity(val); handleEffectChange('opacity', val); }} disabled={!selectedClip} />
                        </div>
                    </TabsContent>
                    <TabsContent value="effect" className="mt-0 space-y-4">
                        <LabeledInput label="LUT" placeholder="none" value={lut || 'none'} readOnly disabled={!selectedClip} />
                        <div>
                          <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Exposure</div>
                          <Input type="number" min="0" max="2" step="0.05" className="bg-transparent border-input" placeholder="1.0" value={exposure} onChange={(e) => { const val = parseFloat(e.target.value); setExposure(val); handleEffectChange('exposure', val); }} disabled={!selectedClip} />
                        </div>
                         <div>
                          <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Contrast</div>
                          <Input type="number" min="0" max="2" step="0.05" className="bg-transparent border-input" placeholder="1.0" value={contrast} onChange={(e) => { const val = parseFloat(e.target.value); setContrast(val); handleEffectChange('contrast', val); }} disabled={!selectedClip} />
                        </div>
                        <div>
                          <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Saturation</div>
                          <Input type="number" min="0" max="2" step="0.05" className="bg-transparent border-input" placeholder="1.0" value={saturation} onChange={(e) => { const val = parseFloat(e.target.value); setSaturation(val); handleEffectChange('saturation', val); }} disabled={!selectedClip} />
                        </div>
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
                        {itemType && <LabeledInput label="Type" placeholder={itemType} value={itemType} readOnly />}
                        {selectedAsset && !selectedClip && (
                          <>
                            <LabeledInput label="Camera" placeholder="FX30 4K24" />
                            <LabeledInput label="Lens" placeholder="35mm" />
                            <LabeledInput label="Creator" placeholder="Yadu" />
                            <LabeledInput label="Asset ID" placeholder={selectedAsset.id} value={selectedAsset.id} readOnly />
                            <LabeledInput label="Asset Type" placeholder={selectedAsset.type} value={selectedAsset.type} readOnly />
                          </>
                        )}
                         {selectedClip && (
                          <>
                             <LabeledInput label="Clip ID" placeholder={selectedClip.id} value={selectedClip.id} readOnly />
                             <LabeledInput label="Asset ID" placeholder={selectedClip.assetId} value={selectedClip.assetId} readOnly />
                          </>
                        )}
                    </TabsContent>
                </div>
            </ScrollArea>
          </div>
        </Tabs>
      )}
    </div>
  );
}

    