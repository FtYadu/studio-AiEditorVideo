
"use client";

import React, { useMemo, useRef, useState } from 'react';
import type { EdgeItem, NodeItem, NodeType } from '@/types/editor';
import { Badge } from '@/components/ui/badge';
import { Captions, Download, FolderOpen, Music2, Scissors, Settings, Wand2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function typeColor(t: NodeType): string {
  switch (t) {
    case "import": return "hsl(var(--primary))";
    case "scene": return "hsl(var(--chart-2))";
    case "beat": return "hsl(var(--chart-1))";
    case "transcript": return "hsl(var(--chart-4))";
    case "caption": return "hsl(var(--accent))";
    case "color": return "hsl(210 92% 65%)";
    case "fx": return "hsl(262 84% 78%)";
    case "export": return "hsl(var(--destructive))";
    default: return "hsl(var(--muted-foreground))";
  }
}

function NodeIcon({ type }: { type: NodeType }) {
  const Icon = {
    import: FolderOpen,
    scene: Scissors,
    beat: Music2,
    transcript: Captions,
    caption: Captions,
    color: Settings,
    fx: Wand2,
    export: Download,
  }[type];
  if (!Icon) return null;
  return <Icon className="h-4 w-4" style={{ color: typeColor(type) }} />;
}

function StatusBadge({ status }: { status: NodeItem['status'] }) {
    switch (status) {
        case 'running':
            return <Badge variant="outline" className="text-yellow-400 border-yellow-400/50"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Running</Badge>;
        case 'completed':
            return <Badge variant="outline" className="text-green-400 border-green-400/50"><CheckCircle2 className="h-3 w-3 mr-1" />OK</Badge>;
        case 'error':
            return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Error</Badge>;
        default:
            return <Badge variant="secondary">Idle</Badge>;
    }
}


interface NodeCanvasProps {
  nodes: NodeItem[];
  setNodes: React.Dispatch<React.SetStateAction<NodeItem[]>>;
  edges: EdgeItem[];
  setEdges: React.Dispatch<React.SetStateAction<EdgeItem[]>>;
  onNodeClick: (node: NodeItem) => void;
}

export function NodeCanvas({ nodes, setNodes, edges, setEdges, onNodeClick }: NodeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent, id: string) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    dragOffset.current = { x: e.clientX - node.x, y: e.clientY - node.y };
    setDragId(id);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragId || !containerRef.current) return;
    const nx = e.clientX - dragOffset.current.x;
    const ny = e.clientY - dragOffset.current.y;
    setNodes((prev) => prev.map((n) => (n.id === dragId ? { ...n, x: nx, y: ny } : n)));
  };
  const onMouseUp = () => setDragId(null);
  
  const handleNodeClick = (e: React.MouseEvent, node: NodeItem) => {
    e.stopPropagation(); // prevent canvas click from firing
    if(dragId) return; // don't fire click if we just finished dragging
    onNodeClick(node);
  }

  return (
    <div 
        ref={containerRef} 
        onMouseMove={onMouseMove} 
        onMouseUp={onMouseUp} 
        onMouseLeave={onMouseUp}
        className="h-full w-full relative overflow-hidden" 
        style={{ background: `radial-gradient(circle at 20% 20%, hsla(239, 84%, 68%, 0.1), transparent 40%), radial-gradient(circle at 80% 80%, hsla(262, 92%, 65%, 0.1), transparent 40%)` }}
    >
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="hsl(var(--border) / 0.5)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <svg className="absolute inset-0 pointer-events-none">
        {edges.map((e, i) => {
          const a = nodes.find((n) => n.id === e.from);
          const b = nodes.find((n) => n.id === e.to);
          if (!a || !b) return null;
          const x1 = a.x + 80; const y1 = a.y;
          const x2 = b.x - 80; const y2 = b.y;
          const dx = Math.max(60, Math.abs(x2 - x1) / 2);
          const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
          return <path key={i} d={path} fill="none" stroke={typeColor(a.type)} strokeOpacity={0.6} strokeWidth={2} />;
        })}
      </svg>

      {nodes.map((n) => (
        <div
          key={n.id}
          className="absolute w-[160px] h-[64px] rounded-xl border bg-background/80 backdrop-blur shadow-2xl cursor-grab active:cursor-grabbing flex items-center justify-between px-3 transition-all"
          style={{ left: n.x, top: n.y, transform: `translate(-50%, -50%)`, borderColor: typeColor(n.type) }}
          onMouseDown={(e) => onMouseDown(e, n.id)}
          onClick={(e) => handleNodeClick(e, n)}
        >
          <div className="flex items-center gap-2">
            <NodeIcon type={n.type} />
            <div>
              <div className="text-sm font-medium leading-none font-headline">{n.label}</div>
              <div className="text-[10px] text-muted-foreground capitalize">{n.type}</div>
            </div>
          </div>
          <StatusBadge status={n.status} />
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background bg-card" style={{ borderColor: typeColor(n.type) }} />
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background bg-card" style={{ borderColor: typeColor(n.type) }} />
        </div>
      ))}
    </div>
  );
}
