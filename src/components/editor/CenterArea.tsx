
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, Layers, Workflow } from "lucide-react";
import { NodeCanvas } from "./NodeCanvas";
import { TimelineView } from "./TimelineView";
import type { Asset, Clip, Track, NodeItem, EdgeItem } from "@/types/editor";
import React from "react";

interface CenterAreaProps {
  mode: "workflow" | "edit";
  setMode: (m: "workflow" | "edit") => void;
  selectedAsset: Asset | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  onTimeUpdate: () => void;
  tracks: Track[];
  clips: Clip[];
  totalDuration: number;
  nodes: NodeItem[];
  setNodes: React.Dispatch<React.SetStateAction<NodeItem[]>>;
  edges: EdgeItem[];
}

export function CenterArea({ 
  mode, 
  setMode, 
  selectedAsset, 
  videoRef,
  onTimeUpdate,
  tracks,
  clips,
  totalDuration,
  nodes,
  setNodes,
  edges
}: CenterAreaProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="h-12 border-b border-border flex items-center px-3 gap-3 bg-secondary/20">
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="workflow"><Workflow className="h-4 w-4 mr-2"/>Workflow</TabsTrigger>
            <TabsTrigger value="edit"><Layers className="h-4 w-4 mr-2"/>Edit</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Cpu className="h-4 w-4"/> Cached: 72%
          <Separator orientation="vertical" className="h-5 bg-border mx-2"/>
          Dropped frames: 0
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {mode === "workflow" ? (
          <NodeCanvas nodes={nodes} setNodes={setNodes} edges={edges} /> 
        ) : (
          <TimelineView 
            selectedAsset={selectedAsset} 
            videoRef={videoRef}
            onTimeUpdate={onTimeUpdate}
            tracks={tracks}
            clips={clips}
            totalDuration={totalDuration}
          />
        )}
      </div>
    </div>
  );
}
