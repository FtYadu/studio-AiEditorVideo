
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelLeft, PanelRight, Trash2 } from "lucide-react";
import { LabeledInput, TooltipWrap } from "./ui-helpers";
import type { Asset, Clip } from "@/types/editor";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";

interface InspectorProps {
  collapsed: boolean;
  onToggle: () => void;
  selectedAsset: Asset | null;
  selectedClip: Clip | null;
  onUpdateAsset: (assetId: string, updatedProps: Partial<Asset>) => void;
  onUpdateClip: (clipId: string, updatedProps: Partial<Clip>) => void;
  onDeleteClip: () => void;
}

export function Inspector({ collapsed, onToggle, selectedAsset, selectedClip, onUpdateAsset, onUpdateClip, onDeleteClip }: InspectorProps) {
  const [tab, setTab] = useState("general");
  const [itemName, setItemName] = useState("");
  
  // General states
  const [opacity, setOpacity] = useState(100);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 100 });
  const [volume, setVolume] = useState(100);
  const [captionText, setCaptionText] = useState("");
  
  // Effect states
  const [saturation, setSaturation] = useState(1.0);
  const [contrast, setContrast] = useState(1.0);
  const [exposure, setExposure] = useState(1.0);
  const [lut, setLut] = useState<string | null>(null);

  const item = selectedClip || selectedAsset;
  const isCaption = selectedClip?.trackId.includes('cap');

  useEffect(() => {
    if (selectedClip) {
      setItemName(selectedClip.label);
      setOpacity(selectedClip.opacity);
      setTransform(selectedClip.transform);
      setVolume(selectedClip.volume);
      setSaturation(selectedClip.effects.saturation);
      setContrast(selectedClip.effects.contrast);
      setExposure(selectedClip.effects.exposure);
      setLut(selectedClip.effects.lut);
      setCaptionText(selectedClip.text || "");
      if (isCaption) {
        setTab("general");
      }
    } else if (selectedAsset) {
      setItemName(selectedAsset.name);
      // Reset states when only an asset is selected
      setOpacity(100);
      setTransform({ x: 0, y: 0, scale: 100 });
      setVolume(100);
      setSaturation(1.0);
      setContrast(1.0);
      setExposure(1.0);
      setLut(null);
      setCaptionText("");
    } else {
      setItemName("");
    }
  }, [selectedAsset, selectedClip, isCaption]);

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

  const handleUpdate = (type: 'clip' | 'asset', update: Partial<Clip>) => {
     if (type === 'clip' && selectedClip) {
      onUpdateClip(selectedClip.id, update);
    }
  }

  const handleTransformChange = (field: 'x' | 'y' | 'scale', value: string) => {
    const newTransform = { ...transform, [field]: parseInt(value, 10) || 0 };
    setTransform(newTransform);
    handleUpdate('clip', { transform: newTransform });
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    handleUpdate('clip', { volume: newVolume });
  };
  
  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCaptionText(e.target.value);
      handleUpdate('clip', { text: e.target.value });
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
            {!isCaption && <TabsTrigger value="effect">Effect</TabsTrigger>}
            {!isCaption && <TabsTrigger value="audio">Audio</TabsTrigger>}
          </TabsList>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
                <div className="p-3 space-y-4">
                    <TabsContent value="general" className="mt-0 space-y-4">
                        
                        <LabeledInput label="Name" placeholder="Item Name" value={itemName} onChange={handleNameChange} onBlur={handleNameBlur} className="flex-1" />
                          
                        {isCaption ? (
                            <div>
                                <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Caption Text</div>
                                <Textarea value={captionText} onChange={handleCaptionChange} className="bg-transparent border-input h-40" />
                            </div>
                        ) : (
                        <>
                          <div>
                            <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Transform</div>
                            <div className="grid grid-cols-3 gap-2">
                              <Input type="number" className="bg-transparent border-input" placeholder="X" value={transform.x} onChange={(e) => handleTransformChange('x', e.target.value)} disabled={!selectedClip} />
                              <Input type="number" className="bg-transparent border-input" placeholder="Y" value={transform.y} onChange={(e) => handleTransformChange('y', e.target.value)} disabled={!selectedClip} />
                              <Input type="number" className="bg-transparent border-input" placeholder="Scale" value={transform.scale} onChange={(e) => handleTransformChange('scale', e.target.value)} disabled={!selectedClip} />
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Opacity</div>
                            <Input type="number" min="0" max="100" className="bg-transparent border-input" placeholder="100" value={opacity} onChange={(e) => { const val = parseInt(e.target.value, 10); setOpacity(val); handleUpdate('clip', { opacity: val }); }} disabled={!selectedClip} />
                          </div>
                        </>
                        )}
                    </TabsContent>
                    <TabsContent value="effect" className="mt-0 space-y-4">
                        <LabeledInput label="LUT" placeholder="none" value={lut || 'none'} readOnly disabled={!selectedClip} />
                        <div>
                          <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Exposure</div>
                          <Input type="number" min="0" max="2" step="0.05" className="bg-transparent border-input" placeholder="1.0" value={exposure} onChange={(e) => { const val = parseFloat(e.target.value); setExposure(val); handleUpdate('clip', { effects: { ...selectedClip!.effects, exposure: val } }); }} disabled={!selectedClip} />
                        </div>
                         <div>
                          <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Contrast</div>
                          <Input type="number" min="0" max="2" step="0.05" className="bg-transparent border-input" placeholder="1.0" value={contrast} onChange={(e) => { const val = parseFloat(e.target.value); setContrast(val); handleUpdate('clip', { effects: { ...selectedClip!.effects, contrast: val } }); }} disabled={!selectedClip} />
                        </div>
                        <div>
                          <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Saturation</div>
                          <Input type="number" min="0" max="2" step="0.05" className="bg-transparent border-input" placeholder="1.0" value={saturation} onChange={(e) => { const val = parseFloat(e.target.value); setSaturation(val); handleUpdate('clip', { effects: { ...selectedClip!.effects, saturation: val } }); }} disabled={!selectedClip} />
                        </div>
                    </TabsContent>
                    <TabsContent value="audio" className="mt-0 space-y-4">
                      <div>
                        <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Volume</div>
                        <div className="flex items-center gap-2">
                           <Slider value={[volume]} onValueChange={handleVolumeChange} max={100} step={1} disabled={!selectedClip} />
                           <span className="text-xs w-12 text-right text-muted-foreground">{volume}%</span>
                        </div>
                      </div>
                    </TabsContent>
                    {selectedClip && (
                        <Button variant="destructive" className="w-full" onClick={onDeleteClip}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Clip
                        </Button>
                    )}
                </div>
            </ScrollArea>
          </div>
        </Tabs>
      )}
    </div>
  );
}
