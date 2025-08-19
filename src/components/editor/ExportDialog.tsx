"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Download, Loader2 } from "lucide-react";
import { LabeledInput } from "./ui-helpers";
import { exportVideo } from "@/ai/flows/export-video";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";

interface ExportDialogProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [prompt, setPrompt] = useState("A majestic dragon soaring over a mystical forest at dawn.");
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const { toast } = useToast();

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-headline">Export Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            <div>
              <LabeledInput 
                label="Preset" 
                value="AI Generation (Veo)" 
                readOnly 
              />
            </div>
            
            <div>
              <div className="text-[10px] font-headline uppercase tracking-wider text-muted-foreground mb-1">Prompt</div>
              <Textarea 
                placeholder="Enter a prompt for video generation..." 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-transparent border-input"
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
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Download className="h-4 w-4 mr-2"/>}
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
