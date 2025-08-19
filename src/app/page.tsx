
"use client";

import React, { useEffect, useState, useRef } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TopBar } from "@/components/editor/TopBar";
import { LeftRail } from "@/components/editor/LeftRail";
import { CenterArea } from "@/components/editor/CenterArea";
import { Inspector } from "@/components/editor/Inspector";
import { Transport } from "@/components/editor/Transport";
import { CommandMenu } from "@/components/editor/CommandMenu";
import { ExportDialog } from "@/components/editor/ExportDialog";
import { Captions, Download, FolderOpen, Layers, MonitorDown, Wand2, Workflow } from "lucide-react";
import type { CommandAction, Asset, Track, Clip } from "@/types/editor";
import { autoCaption } from "@/ai/flows/auto-captioning";
import { autoSceneDetection } from "@/ai/flows/auto-scene-detection";
import { useToast } from "@/hooks/use-toast";

export default function AIVideoEditorUI() {
  const [mode, setMode] = useState<"workflow" | "edit">("workflow");
  const [collapsedLeft, setCollapsedLeft] = useState(false);
  const [collapsedRight, setCollapsedRight] = useState(false);
  const [draftQuality, setDraftQuality] = useState(true);
  const [proxy, setProxy] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timecode, setTimecode] = useState("00:00:00:00");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [projectName, setProjectName] = useState("AIVidFlow Project");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [totalDuration, setTotalDuration] = useState(20);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  const formatTime = (time: number) => {
    const fps = 25;
    const totalFrames = Math.floor(time * fps);
    const hours = Math.floor(totalFrames / (3600 * fps)).toString().padStart(2, '0');
    const minutes = Math.floor((totalFrames % (3600 * fps)) / (60 * fps)).toString().padStart(2, '0');
    const seconds = Math.floor((totalFrames % (60 * fps)) / fps).toString().padStart(2, '0');
    const frames = (totalFrames % fps).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}:${frames}`;
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
        return;
      }
      const target = e.target as HTMLElement;
      const isInput = ["INPUT", "TEXTAREA"].includes(target?.tagName || "");
      if (!isInput && e.key === " ") {
        e.preventDefault();
        handlePlayToggle();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "1") {
        e.preventDefault();
        setMode("workflow");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "2") {
        e.preventDefault();
        setMode("edit");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setTimecode(formatTime(videoRef.current.currentTime));
    }
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const videoUrl = e.target?.result as string;
        const videoEl = document.createElement('video');
        videoEl.src = videoUrl;
        videoEl.onloadedmetadata = () => {
          const newAsset: Asset = {
            id: `asset-${Date.now()}`,
            name: file.name,
            type: file.type.startsWith('video') ? 'video' : 'audio',
            url: videoUrl,
            duration: videoEl.duration,
          };
          setAssets((prevAssets) => [...prevAssets, newAsset]);
          setSelectedAsset(newAsset);
          setTotalDuration(videoEl.duration);

          const videoTrack: Track = { id: 'track-v1', name: 'V1', type: 'video' };
          const audioTrack: Track = { id: 'track-a1', name: 'A1', type: 'audio' };
          const captionTrack: Track = { id: 'track-cap1', name: 'CAP', type: 'caption' };
          setTracks([videoTrack, audioTrack, captionTrack]);

          const newClip: Clip = {
            id: `clip-${Date.now()}`,
            assetId: newAsset.id,
            trackId: videoTrack.id,
            start: 0,
            dur: videoEl.duration,
            inPoint: 0,
            label: newAsset.name,
            color: "bg-primary/50",
          };
          setClips([newClip]);
          
          toast({
            title: "✅ Asset Imported",
            description: `${file.name} has been added to your project.`,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoCaption = async () => {
    if (!selectedAsset || selectedAsset.type !== 'video') {
       toast({
        variant: "destructive",
        title: "🚫 No Video Selected",
        description: "Please import and select a video asset first.",
      });
      return;
    }
    
    toast({ title: "🤖 Starting Auto-Caption", description: "The AI is analyzing the audio track..." });
    try {
      const result = await autoCaption({ videoDataUri: selectedAsset.url });
      
      const captionTrack = tracks.find(t => t.type === 'caption');
      if (captionTrack) {
        const newCaptionClip: Clip = {
          id: `clip-${Date.now()}`,
          assetId: selectedAsset.id,
          trackId: captionTrack.id,
          start: 0,
          dur: selectedAsset.duration || totalDuration,
          inPoint: 0,
          label: result.captions.substring(0, 20) + '...',
          color: "bg-pink-500/50"
        }
        setClips(c => [...c, newCaptionClip]);
      }

      toast({
        title: "✅ Captions Generated",
        description: "The caption track has been added to your timeline.",
      });
    } catch (error) {
      console.error("Auto-caption failed:", error);
      toast({
        variant: "destructive",
        title: "🚫 Captioning Failed",
        description: "Could not generate captions. Please try again.",
      });
    }
  };

  const handleAutoSceneDetection = async () => {
    if (!selectedAsset || selectedAsset.type !== 'video') {
      toast({
        variant: "destructive",
        title: "🚫 No Video Selected",
        description: "Please import and select a video asset first.",
      });
      return;
    }

    toast({ title: "🤖 Detecting Scenes", description: "The AI is analyzing the video..." });
    try {
      const result = await autoSceneDetection({ videoDataUri: selectedAsset.url });
      
      const videoTrack = tracks.find(t => t.type === 'video');
      if (videoTrack && selectedAsset.duration) {
        const sceneTimestamps = [0, ...result.sceneTimestamps, selectedAsset.duration];
        const newClips: Clip[] = [];
        for (let i = 0; i < sceneTimestamps.length - 1; i++) {
          const start = sceneTimestamps[i];
          const end = sceneTimestamps[i + 1];
          const dur = end - start;
          newClips.push({
            id: `clip-${selectedAsset.id}-${i}`,
            assetId: selectedAsset.id,
            trackId: videoTrack.id,
            start: start,
            dur: dur,
            inPoint: start,
            label: `Scene ${i + 1}`,
            color: i % 2 === 0 ? "bg-primary/50" : "bg-accent/50",
          });
        }
        setClips(currentClips => [...currentClips.filter(c => c.trackId !== videoTrack.id), ...newClips]);
      }

      toast({
        title: "✅ Scene Detection Complete",
        description: `Found ${result.sceneTimestamps.length} scenes and created clips.`,
      });

    } catch (error) {
      console.error("Auto-scene detection failed:", error);
      toast({
        variant: "destructive",
        title: "🚫 Scene Detection Failed",
        description: "Could not detect scenes. Please try again.",
      });
    }
  };

  const actions: CommandAction[] = [
    { id: "import", label: "Import Media…", icon: <FolderOpen className="mr-2 h-4 w-4" />, run: handleImportClick },
    { id: "captrack", label: "Create Caption Track", icon: <Captions className="mr-2 h-4 w-4" />, run: handleAutoCaption },
    { id: "autocut", label: "Run Auto-Cut", icon: <Wand2 className="mr-2 h-4 w-4" />, run: handleAutoSceneDetection },
    { id: "recipe60", label: "Run Recipe: TikTok 60s Punch‑Cut", icon: <Wand2 className="mr-2 h-4 w-4" />, run: () => alert("Recipe") },
    { id: "draft", label: "Toggle Draft/Full Preview", icon: <MonitorDown className="mr-2 h-4 w-4" />, run: () => setDraftQuality((d) => !d) },
    { id: "export", label: "Open Export", icon: <Download className="mr-2 h-4 w-4" />, run: () => setExportOpen(true) },
    { id: "workflow", label: "Switch to Workflow", icon: <Workflow className="mr-2 h-4 w-4" />, run: () => setMode("workflow") },
    { id: "edit", label: "Switch to Edit", icon: <Layers className="mr-2 h-4 w-4" />, run: () => setMode("edit") },
  ];

  return (
    <TooltipProvider>
      <div className="h-screen w-full flex flex-col bg-background text-foreground font-body">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" />
        <TopBar
          projectName={projectName}
          onRename={setProjectName}
          draftQuality={draftQuality}
          setDraftQuality={setDraftQuality}
          proxy={proxy}
          setProxy={setProxy}
          onExport={() => setExportOpen(true)}
        />

        <main className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={collapsedLeft ? 4 : 18} minSize={4} maxSize={26}>
              <LeftRail 
                collapsed={collapsedLeft} 
                onToggle={() => setCollapsedLeft(!collapsedLeft)}
                onAutoCaption={handleAutoCaption}
                onAutoCut={handleAutoSceneDetection}
                onImport={handleImportClick}
                assets={assets}
                selectedAsset={selectedAsset}
                onAssetClick={setSelectedAsset}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={64} minSize={40}>
              <CenterArea 
                mode={mode} 
                setMode={setMode} 
                selectedAsset={selectedAsset}
                videoRef={videoRef}
                onTimeUpdate={handleTimeUpdate}
                tracks={tracks}
                clips={clips}
                totalDuration={totalDuration}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={collapsedRight ? 4 : 18} minSize={4} maxSize={28}>
              <Inspector collapsed={collapsedRight} onToggle={() => setCollapsedRight(!collapsedRight)} selectedAsset={selectedAsset} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>

        <Transport
          isPlaying={isPlaying}
          onPlayToggle={handlePlayToggle}
          timecode={timecode}
          setTimecode={setTimecode}
          mode={mode}
          setMode={setMode}
        />

        <CommandMenu
          open={cmdOpen}
          onOpenChange={setCmdOpen}
          actions={actions}
        />

        <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
      </div>
    </TooltipProvider>
  );
}
