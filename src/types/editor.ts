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
  id: string;
  label: string;
  icon?: React.ReactNode;
  run: () => void;
}
