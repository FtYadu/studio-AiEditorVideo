export type NodeType = "import" | "scene" | "beat" | "transcript" | "caption" | "color" | "fx" | "export" | "waveform";

export interface NodeItem {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  status?: 'idle' | 'running' | 'completed' | 'error';
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

export type AssetCategory = "Talking Head" | "B-Roll" | "Music" | "Sound Effects" | "Images" | "General";


export interface Asset {
  id: string;
  name: string;
  type: 'video' | 'audio';
  url: string;
  duration?: number;
  category: AssetCategory;
  waveform?: number[];
}

export type TrackType = 'video' | 'audio' | 'caption';

export interface Clip {
  id: string;
  assetId: string;
  trackId: string;
  start: number;
  dur: number;
  inPoint: number;
  outPoint: number;
  label: string;
  color: string;
  opacity: number;
  volume: number;
  transform: {
    x: number;
    y: number;
    scale: number;
  };
  effects: {
    saturation: number;
    contrast: number;
    exposure: number;
    lut: string | null;
  };
  text?: string;
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  isMuted?: boolean;
  isSoloed?: boolean;
}

export interface Template {
  name: string;
  description: string;
  instructions: string;
  tag: string;
}

export interface EditDecision {
  start: number;
  end: number;
}
