
"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Scissors, Mic, MicOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Asset, Clip, Track } from "@/types/editor";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

interface WaveformProps {
    data: number[];
    width: number;
    height: number;
    color: string;
}

const Waveform: React.FC<WaveformProps> = ({ data, width, height, color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        const barWidth = width / data.length;
        ctx.fillStyle = color;

        data.forEach((value, i) => {
            const barHeight = (value / 100) * height;
            const y = (height - barHeight) / 2;
            ctx.fillRect(i * barWidth, y, barWidth - 1, barHeight);
        });

    }, [data, width, height, color]);

    return <canvas ref={canvasRef} width={width} height={height} className="pointer-events-none" />;
};


interface TimelineViewProps {
  selectedAsset: Asset | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  onTimeUpdate: () => void;
  onSeek: (time: number) => void;
  tracks: Track[];
  clips: Clip[];
  totalDuration: number;
  selectedClip: Clip | null;
  onClipSelected: (clip: Clip | null) => void;
  bladeMode: boolean;
  onSplitClip: (clip: Clip, time: number) => void;
  onUpdateClip: (clipId: string, updatedProps: Partial<Clip>) => void;
  assets: Asset[];
  onToggleTrackMute: (trackId: string) => void;
  onToggleTrackSolo: (trackId: string) => void;
}

export function TimelineView({ 
  selectedAsset, 
  videoRef, 
  onTimeUpdate, 
  onSeek,
  tracks, 
  clips, 
  totalDuration,
  selectedClip,
  onClipSelected,
  bladeMode,
  onSplitClip,
  onUpdateClip,
  assets,
  onToggleTrackMute,
  onToggleTrackSolo,
}: TimelineViewProps) {
  const [zoom, setZoom] = useState(80);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const [draggingClip, setDraggingClip] = useState<{ clipId: string,startX: number, originalStart: number, originalTrackId: string, mode: 'move' | 'trim-start' | 'trim-end', originalDur: number, originalInPoint: number } | null>(null);

  const pixelsPerSecond = (zoom / 2);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updatePlayhead = () => {
      if (video && playheadRef.current && timelineContainerRef.current) {
        const percentage = (video.currentTime / totalDuration) * 100;
        playheadRef.current.style.left = `${percentage}%`;
      }
      onTimeUpdate();
    };

    video.addEventListener("timeupdate", updatePlayhead);
    
    // Set initial playhead position
    updatePlayhead();

    return () => video.removeEventListener("timeupdate", updatePlayhead);
  }, [videoRef, totalDuration, onTimeUpdate]);
  
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineContainerRef.current) return;
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width);
    const newTime = percentage * totalDuration;

    if (bladeMode) {
      // Find which clip was clicked
      const clickedClip = clips.find(c => {
        const clipStartPos = (c.start / totalDuration) * rect.width;
        const clipEndPos = ((c.start + c.dur) / totalDuration) * rect.width;
        return clickX >= clipStartPos && clickX <= clipEndPos;
      });
      if (clickedClip) {
        onSplitClip(clickedClip, newTime);
      }
    } else {
       onSeek(newTime);
    }
  };
  
  const handleClipMouseDown = (e: React.MouseEvent, clip: Clip) => {
    e.stopPropagation();
    if (bladeMode) {
      const rect = (e.currentTarget as HTMLDivElement).parentElement?.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const clickX = e.clientX - rect.left;
      const percentage = (clickX / rect.width);
      const newTime = percentage * totalDuration;
      onSplitClip(clip, newTime);
    } else {
      onClipSelected(clip);
      setDraggingClip({
        clipId: clip.id,
        startX: e.clientX,
        originalStart: clip.start,
        originalTrackId: clip.trackId,
        mode: 'move',
        originalDur: clip.dur,
        originalInPoint: clip.inPoint,
      });
    }
  };
  
  const handleTrimHandleMouseDown = (e: React.MouseEvent, clip: Clip, mode: 'trim-start' | 'trim-end') => {
    e.stopPropagation();
    onClipSelected(clip);
    setDraggingClip({
        clipId: clip.id,
        startX: e.clientX,
        originalStart: clip.start,
        originalTrackId: clip.trackId,
        mode,
        originalDur: clip.dur,
        originalInPoint: clip.inPoint,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingClip || !timelineContainerRef.current) return;

    const deltaX = e.clientX - draggingClip.startX;
    const timeOffset = deltaX / pixelsPerSecond;
    
    const clip = clips.find(c => c.id === draggingClip.clipId);
    if(!clip) return;
    const asset = assets.find(a => a.id === clip.assetId);
    if (!asset || asset.duration === undefined) return;

    if(draggingClip.mode === 'move') {
        let newStart = draggingClip.originalStart + timeOffset;
        // Clamp to timeline boundaries
        newStart = Math.max(0, newStart);
        newStart = Math.min(totalDuration - clip.dur, newStart);

        const rect = timelineContainerRef.current.getBoundingClientRect();
        const trackElements = Array.from(timelineContainerRef.current.querySelectorAll('[data-track-id]'));
        const dropTargetTrack = trackElements.find(el => {
            const trackRect = el.getBoundingClientRect();
            return e.clientY >= trackRect.top && e.clientY <= trackRect.bottom;
        });
        const newTrackId = dropTargetTrack ? dropTargetTrack.getAttribute('data-track-id')! : draggingClip.originalTrackId;
        onUpdateClip(draggingClip.clipId, { start: newStart, trackId: newTrackId });

    } else if (draggingClip.mode === 'trim-start') {
        let newStart = draggingClip.originalStart + timeOffset;
        let newInPoint = draggingClip.originalInPoint + timeOffset;
        let newDur = draggingClip.originalDur - timeOffset;

        if (newInPoint < 0) {
            newStart += -newInPoint;
            newDur -= -newInPoint;
            newInPoint = 0;
        }
        if (newDur < 0.1) {
            newDur = 0.1;
            newStart = clip.start;
            newInPoint = clip.inPoint;
        }

        onUpdateClip(draggingClip.clipId, { start: newStart, dur: newDur, inPoint: newInPoint, outPoint: newInPoint + newDur });
    
    } else if (draggingClip.mode === 'trim-end') {
        let newDur = draggingClip.originalDur + timeOffset;
        if (clip.start + newDur > totalDuration) {
            newDur = totalDuration - clip.start;
        }
        if (clip.inPoint + newDur > asset.duration) {
            newDur = asset.duration - clip.inPoint;
        }
        if (newDur < 0.1) {
            newDur = 0.1;
        }
        onUpdateClip(draggingClip.clipId, { dur: newDur, outPoint: clip.inPoint + newDur });
    }
  };

  const handleMouseUp = () => {
    setDraggingClip(null);
  };
  
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
     e.stopPropagation();
    if (bladeMode) {
        const rect = timelineContainerRef.current?.getBoundingClientRect();
        if(!rect) return;
        const clickX = e.clientX - rect.left;
        
        const trackElement = (e.target as HTMLElement).closest('[data-track-id]');
        if (!trackElement) return;

        const trackId = trackElement.getAttribute('data-track-id');
        const trackClips = clips.filter(c => c.trackId === trackId);
        
        const newTime = (clickX / rect.width) * totalDuration;

        const clickedClip = trackClips.find(c => {
            const clipStartPos = (c.start / totalDuration) * rect.width;
            const clipEndPos = ((c.start + c.dur) / totalDuration) * rect.width;
            return clickX >= clipStartPos && clickX <= clipEndPos;
        });

        if (clickedClip) {
            onSplitClip(clickedClip, newTime);
        }
    } else {
        onClipSelected(null);
    }
  }
  

  const timelineWidth = `${totalDuration * pixelsPerSecond}px`;

  return (
    <div className="h-full flex flex-col bg-background" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
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
                          onLoadedMetadata={onTimeUpdate}
                          className="w-full h-full object-contain transition-all duration-200" 
                        />
                      ) : (
                        <div className="w-full h-full bg-black grid place-content-center">
                          <img src="https://placehold.co/1280x720/000000/FFFFFF.png&text=AIVidFlow" alt="Video Preview" className="w-full h-full object-contain" data-ai-hint="video preview screen" />
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

              <div className={cn("flex-1 overflow-auto relative", bladeMode && "cursor-crosshair")} onClick={(e) => e.stopPropagation()}>
                <div 
                  className="h-8 sticky top-0 z-10 bg-secondary/80 backdrop-blur-sm text-[10px] text-muted-foreground flex items-end border-b border-border cursor-pointer" 
                  style={{ width: timelineWidth, paddingLeft: '112px' }}
                  onClick={handleTimelineClick}
                >
                  {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
                    <div key={i} className="border-l border-border h-full flex items-end pb-1" style={{width: `${pixelsPerSecond}px`}}>{i}s</div>
                  ))}
                </div>
                
                <div className="relative" style={{ width: timelineWidth }} ref={timelineContainerRef} onClick={handleTimelineClick}>
                   <div ref={playheadRef} className="absolute top-0 z-20 w-0.5 h-full bg-red-500 pointer-events-none" />
                  {tracks.map((t) => (
                    <div key={t.id} data-track-id={t.id} className={cn("h-12 flex border-b border-border/50", bladeMode && "cursor-crosshair")} onClick={handleTrackClick}>
                      <div className="w-28 shrink-0 flex items-center justify-between text-xs text-muted-foreground bg-secondary/50 border-r border-border font-headline sticky left-0 px-2">
                        <span>{t.name}</span>
                        {t.type === 'audio' && (
                            <div className="flex gap-1">
                                <Button variant={t.isMuted ? "secondary" : "ghost"} size="icon" className="h-5 w-5" onClick={() => onToggleTrackMute(t.id)}>M</Button>
                                <Button variant={t.isSoloed ? "secondary" : "ghost"} size="icon" className="h-5 w-5" onClick={() => onToggleTrackSolo(t.id)}>S</Button>
                            </div>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        {clips.filter((c) => c.trackId === t.id).map((clip) => {
                          const asset = assets.find(a => a.id === clip.assetId);
                          return (
                            <div 
                                key={clip.id} 
                                onMouseDown={(e) => handleClipMouseDown(e, clip)}
                                className={cn(
                                  "absolute h-8 rounded-md border flex items-center px-2 text-xs text-white backdrop-blur-sm shadow-md overflow-hidden",
                                  bladeMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing',
                                  clip.color,
                                  selectedClip?.id === clip.id ? "border-yellow-400 ring-2 ring-yellow-400 z-10" : "border-black/20"
                                )}
                                style={{ 
                                  left: `${(clip.start / totalDuration) * 100}%`, 
                                  width: `${(clip.dur / totalDuration) * 100}%`, 
                                  top: 8 
                                }}>
                              <div className="absolute inset-0 z-0">
                                {asset?.waveform && asset.waveform.length > 0 && (
                                    <Waveform 
                                        data={asset.waveform}
                                        width={(clip.dur * pixelsPerSecond)}
                                        height={32}
                                        color="rgba(255, 255, 255, 0.3)"
                                    />
                                )}
                              </div>
                              <div className="relative z-10">
                                <div 
                                    className="absolute left-0 top-0 h-full w-2 cursor-ew-resize z-20"
                                    style={{left: -8}}
                                    onMouseDown={(e) => handleTrimHandleMouseDown(e, clip, 'trim-start')}
                                 />
                                <span className="truncate pointer-events-none">{clip.label}</span>
                                <div 
                                    className="absolute right-0 top-0 h-full w-2 cursor-ew-resize z-20"
                                    style={{right: -8}}
                                    onMouseDown={(e) => handleTrimHandleMouseDown(e, clip, 'trim-end')}
                                />
                              </div>
                            </div>
                          )
                        })}
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

    