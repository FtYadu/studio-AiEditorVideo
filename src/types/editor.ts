
export type NodeType = "import" | "scene" | "beat" | "transcript" | "caption" | "color" | "fx" | "export";

export interface NodeItem {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
}

export interface EdgeItem {
  from: string;
  to: string;
}

export interface CommandAction {
  id:string;
  label: string;
  icon?: React.ReactNode;
  run: () => void;
}

export interface Asset {
  id: string;
  name: string;
  type: 'video' | 'audio';
  url: string;
  duration?: number;
}

export type TrackType = 'video' | 'audio' | 'caption';

export interface Clip {
  id: string;
  assetId: string;
  trackId: string;
  start: number;
  dur: number;
  inPoint: number;
  label: string;
  color: string;
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
}
