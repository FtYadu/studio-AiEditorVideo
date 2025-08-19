"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Scissors } from "lucide-react";
import { useState } from "react";

export function TimelineView() {
  const [zoom, setZoom] = useState(80);
  const tracks = [
    { name: "V1", type: "video" },
    { name: "V2", type: "video" },
    { name: "A1", type: "audio" },
    { name: "A2", type: "audio" },
    { name: "CAP", type: "caption" },
  ];
  const clips = [
    { track: 0, start: 2, dur: 6, label: "Intro", color: "bg-primary/50" },
    { track: 0, start: 9, dur: 4, label: "Cutaway", color: "bg-accent/50" },
    { track: 1, start: 3, dur: 4, label: "B‑roll", color: "bg-blue-500/50" },
    { track: 2, start: 2, dur: 12, label: "Music", color: "bg-green-500/50" },
    { track: 4, start: 2.2, dur: 6.5, label: "Captions", color: "bg-pink-500/50" },
  ];
  const total = 20;

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 flex min-h-0">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60}>
            <div className="h-full flex">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={75}>
                  <div className="h-full flex items-center justify-center p-4">
                    <div className="aspect-video w-full max-w-full h-auto max-h-full rounded-lg border-2 border-primary bg-black relative overflow-hidden">
                      <img src="https://placehold.co/1280x720" alt="Video Preview" className="w-full h-full object-contain" data-ai-hint="video preview screen" />
                      <div className="absolute inset-0 border-8 border-black/30"></div>
                      <div className="absolute inset-8 border border-white/10 rounded"></div>
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

              <div className="flex-1 overflow-auto relative">
                <div className="h-8 sticky top-0 z-10 bg-secondary/80 backdrop-blur-sm text-[10px] text-muted-foreground flex items-end pl-16 border-b border-border">
                  {Array.from({ length: total + 1 }).map((_, i) => (
                    <div key={i} className="w-24 border-l border-border h-full flex items-end pb-1">{i}s</div>
                  ))}
                </div>
                
                <div className="relative">
                  {tracks.map((t, ti) => (
                    <div key={ti} className="h-12 flex border-b border-border/50">
                      <div className="w-16 shrink-0 grid place-items-center text-xs text-muted-foreground bg-secondary/50 border-r border-border font-headline">{t.name}</div>
                      <div className="flex-1 relative">
                        {clips.filter((c) => c.track === ti).map((c, ci) => (
                          <div key={ci} className={`absolute h-8 rounded-md border border-black/20 ${c.color} flex items-center px-2 text-xs text-white backdrop-blur-sm shadow-md`}
                              style={{ left: `${(c.start / total) * (zoom/10 + 100)}%`, width: `${(c.dur / total) * (zoom/10 + 100)}%`, top: 8 }}>
                            {c.label}
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

// Dummy Resizable components to avoid errors if not present
const ResizablePanelGroup = ({ direction, children }: { direction: "vertical" | "horizontal", children: React.ReactNode }) => <div className={`flex ${direction === 'vertical' ? 'flex-col' : ''} h-full w-full`}>{children}</div>;
const ResizablePanel = ({ defaultSize, minSize, children }: { defaultSize: number, minSize?: number, children: React.ReactNode }) => <div style={{ flexGrow: defaultSize, flexShrink: 0, flexBasis: 0 }}>{children}</div>;
const ResizableHandle = ({ withHandle }: { withHandle?: boolean }) => <div className="w-1 h-full bg-border cursor-col-resize hover:bg-primary" />;

