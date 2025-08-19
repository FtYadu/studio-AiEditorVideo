
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Download, Loader2 } from "lucide-react";
import { LabeledInput } from "./ui-helpers";
import { exportVideo } from "@/ai/flows/export-video";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { Clip } from "@/types/editor";

interface ExportDialogProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    clips: Clip[];
}

function generateTimelinePrompt(clips: Clip[]): string {
    if (clips.length === 0) {
        return "An empty timeline, resulting in a short, silent, black video.";
    }

    const sortedClips = [...clips].sort((a, b) => a.start - b.start);
    const descriptions = sortedClips.map(clip => {
        let desc = `a scene of '${clip.label}'`;
        if (clip.opacity < 100) desc += ` at ${clip.opacity}% opacity`;
        if (clip.transform.scale !== 100) desc += ` zoomed to ${clip.transform.scale}%`;
        if (clip.effects.saturation < 0.8) desc += " in black and white";
        if (clip.effects.contrast > 1.2) desc += " with high contrast";
        if (clip.effects.exposure !== 1.0) desc += ` with an exposure of ${clip.effects.exposure}`;
        if (clip.effects.lut) desc += ` with a ${clip.effects.lut} color grade`;
        return desc;
    });

    return `A video that starts with ${descriptions.join(", then ")}.`;
}


export function ExportDialog({ open, onOpenChange, clips }: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const { toast } = useToast();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      const generatedPrompt = generateTimelinePrompt(clips);
      setPrompt(generatedPrompt);
    }
    onOpenChange(isOpen);
  }

  const handleExport = async () => {
    setIsExporting(true);
    setGeneratedVideo(null);
    toast({
      title: "🚀 Starting Video Export",
      description: "The AI is generating your video. This may take a moment...",
    });

    try {
      const result = await exportVideo({ prompt });
      setGeneratedVideo(result.videoDataUri);
      toast({
        title: "✅ Export Complete",
        description: "Your video has been generated successfully.",
      });
    } catch (error) {
      console.error("Video export failed:", error);
      toast({
        variant: "destructive",
        title: "🚫 Export Failed",
        description: "Could not generate the video. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-headline">Export Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            <div>
              <LabeledInput 
                label="Preset" 
                value="AI Generation (Timeline)" 
                readOnly 
              />
            </div>
            
            <div>
              <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Generated Prompt</div>
              <Textarea 
                placeholder="Timeline prompt will be generated here..." 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-transparent border-input h-32"
              />
            </div>
          
            {generatedVideo && (
              <div>
                <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Preview</div>
                <video src={generatedVideo} controls className="w-full rounded-md border border-border" />
              </div>
            )}

        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isExporting}>Close</Button>
          <Button onClick={handleExport} disabled={isExporting || !prompt}>
            {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Download className="h-4 w-4 mr-2"/>}
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
