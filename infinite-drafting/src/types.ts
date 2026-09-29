export type Point = { x: number; y: number; p?: number };

export type Stroke = {
  id: string;
  type: 'pen' | 'line' | 'box-grid';
  points: Point[];
  color?: string;
  boxData?: {
    size: number;
    startNumber: number;
    showNumber?: boolean;
    shape?: 'square' | 'line';
  };
};

export type Layer = {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  strokes: Stroke[];
};

export type Camera = {
  x: number;
  y: number;
  zoom: number;
};

export type Tool = 'pen' | 'line' | 'erase' | 'move' | 'select' | 'box-grid';
