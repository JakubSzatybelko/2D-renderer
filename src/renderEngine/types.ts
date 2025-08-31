type Shape = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  movementVector: { x: number; y: number; };
};

type InstanceMonitor = {
  shapes: Shape[];
  addShape: (shape: Shape) => void;
  removeShape: (shape: Shape) => void;
};
export type { Shape, InstanceMonitor };