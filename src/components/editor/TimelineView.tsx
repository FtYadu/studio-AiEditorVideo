
"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Scissors } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Asset, Clip, Track } from "@/types/editor";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

interface TimelineViewProps {
  selectedAsset: Asset | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  onTimeUpdate: () => void;
  tracks: Track[];
  clips: Clip[];
  totalDuration: number;
}

export function TimelineView({ 
  selectedAsset, 
  videoRef, 
  onTimeUpdate, 
  tracks, 
  clips, 
  totalDuration 
}: TimelineViewProps) {
  const [zoom, setZoom] = useState(80);
  const timelineRulerRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updatePlayhead = () => {
      if (video && playheadRef.current && timelineRulerRef.current) {
        const percentage = (video.currentTime / totalDuration) * 100;
        playheadRef.current.style.left = `${percentage}%`;
      }
      onTimeUpdate();
    };

    video.addEventListener("timeupdate", updatePlayhead);
    return () => video.removeEventListener("timeupdate", updatePlayhead);
  }, [videoRef, totalDuration, onTimeUpdate]);
  

  const timelineWidth = `calc(${totalDuration * (zoom / 2)}px)`;

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 flex min-h-0">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60}>
            <div className="h-full flex">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={75}>
                  <div className="h-full flex items-center justify-center p-4 bg-black">
                    <div className="aspect-video w-full max-w-full h-auto max-h-full rounded-lg border-2 border-primary bg-black relative overflow-hidden">
                      {selectedAsset && selectedAsset.type === 'video' ? (
                        <video 
                          ref={videoRef}
                          src={selectedAsset.url} 
                          onTimeUpdate={onTimeUpdate}
                          onLoadedMetadata={onTimeUpdate}
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <div className="w-full h-full bg-black grid place-content-center">
                          <img src="https://placehold.co/1280x720" alt="Video Preview" className="w-full h-full object-contain" data-ai-hint="video preview screen" />
                        </div>
                      )}
                      <div className="absolute inset-0 border-8 border-black/30 pointer-events-none"></div>
                      <div className="absolute inset-8 border border-white/10 rounded pointer-events-none"></div>
                      <div className="absolute bottom-4 left-4 text-xs bg-black/50 px-2 py-1 rounded">Preview (Draft)</div>
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={25} minSize={20}>
                  <div className="w-full h-full p-3 space-y-2 overflow-y-auto">
                    <div className="font-headline text-sm text-muted-foreground mb-2">Scopes</div>
                    <div className="h-32 rounded bg-secondary border border-border mb-2 grid place-items-center text-[10px] text-muted-foreground">Vectorscope</div>
                    <div className="h-32 rounded bg-secondary border border-border grid place-items-center text-[10px] text-muted-foreground">Waveform</div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={25}>
            <div className="h-full flex flex-col">
              <div className="h-10 border-y border-border flex items-center gap-3 px-3">
                <Button variant="secondary" className="h-7"><Scissors className="h-3.5 w-3.5 mr-2"/>Blade</Button>
                <Button variant="secondary" className="h-7">Snap</Button>
                <div className="ml-auto flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Zoom</span>
                  <Slider value={[zoom]} onValueChange={(v) => setZoom(v[0])} className="w-40" />
                </div>
              </div>

              <div className="flex-1 overflow-auto relative" ref={timelineRulerRef}>
                 <div ref={playheadRef} className="absolute top-0 z-20 w-0.5 h-full bg-red-500 pointer-events-none" />

                <div className="h-8 sticky top-0 z-10 bg-secondary/80 backdrop-blur-sm text-[10px] text-muted-foreground flex items-end pl-16 border-b border-border" style={{ width: timelineWidth }}>
                  {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
                    <div key={i} className="border-l border-border h-full flex items-end pb-1" style={{width: `${1 * (zoom/2)}px`}}>{i}s</div>
                  ))}
                </div>
                
                <div className="relative" style={{ width: timelineWidth }}>
                  {tracks.map((t) => (
                    <div key={t.id} className="h-12 flex border-b border-border/50">
                      <div className="w-16 shrink-0 grid place-items-center text-xs text-muted-foreground bg-secondary/50 border-r border-border font-headline sticky left-0">{t.name}</div>
                      <div className="flex-1 relative">
                        {clips.filter((c) => c.trackId === t.id).map((c) => (
                          <div key={c.id} className={`absolute h-8 rounded-md border border-black/20 ${c.color} flex items-center px-2 text-xs text-white backdrop-blur-sm shadow-md overflow-hidden`}
                              style={{ 
                                left: `${(c.start / totalDuration) * 100}%`, 
                                width: `${(c.dur / totalDuration) * 100}%`, 
                                top: 8 
                              }}>
                            <span className="truncate">{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
