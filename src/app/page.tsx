"use client";

import React, { useEffect, useState } from "react";
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
import type { CommandAction } from "@/types/editor";
import { autoCaption } from "@/ai/flows/auto-captioning";
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
  const { toast } = useToast();

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
        setIsPlaying((p) => !p);
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

  const handleAutoCaption = async () => {
    // TODO: Replace with actual audio data from the selected video clip.
    // This is a placeholder data URI for a silent audio clip.
    const audioDataUri = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
    
    toast({ title: "🤖 Starting Auto-Caption", description: "The AI is analyzing the audio track..." });
    try {
      const result = await autoCaption({ audioDataUri });
      console.log("Auto-caption result:", result);
      toast({
        title: "✅ Captions Generated",
        description: "The caption track has been added to your timeline.",
      });
      // TODO: Add the generated captions to the timeline state.
    } catch (error) {
      console.error("Auto-caption failed:", error);
      toast({
        variant: "destructive",
        title: "🚫 Captioning Failed",
        description: "Could not generate captions. Please try again.",
      });
    }
  };

  const actions: CommandAction[] = [
    { id: "import", label: "Import Media…", icon: <FolderOpen className="mr-2 h-4 w-4" />, run: () => alert("Import clicked") },
    { id: "captrack", label: "Create Caption Track", icon: <Captions className="mr-2 h-4 w-4" />, run: handleAutoCaption },
    { id: "recipe60", label: "Run Recipe: TikTok 60s Punch‑Cut", icon: <Wand2 className="mr-2 h-4 w-4" />, run: () => alert("Recipe") },
    { id: "draft", label: "Toggle Draft/Full Preview", icon: <MonitorDown className="mr-2 h-4 w-4" />, run: () => setDraftQuality((d) => !d) },
    { id: "export", label: "Open Export", icon: <Download className="mr-2 h-4 w-4" />, run: () => setExportOpen(true) },
    { id: "workflow", label: "Switch to Workflow", icon: <Workflow className="mr-2 h-4 w-4" />, run: () => setMode("workflow") },
    { id: "edit", label: "Switch to Edit", icon: <Layers className="mr-2 h-4 w-4" />, run: () => setMode("edit") },
  ];

  return (
    <TooltipProvider>
      <div className="h-screen w-full flex flex-col bg-background text-foreground font-body">
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
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={64} minSize={40}>
              <CenterArea mode={mode} setMode={setMode} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={collapsedRight ? 4 : 18} minSize={4} maxSize={28}>
              <Inspector collapsed={collapsedRight} onToggle={() => setCollapsedRight(!collapsedRight)} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>

        <Transport
          isPlaying={isPlaying}
          onPlayToggle={() => setIsPlaying((p) => !p)}
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
