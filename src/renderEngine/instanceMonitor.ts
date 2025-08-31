import type { InstanceMonitor,Shape } from './types';


export function createInstanceMonitor(): InstanceMonitor {
  const shapes: Shape[] = [];

  return {
    shapes,
    addShape: (shape: Shape) => {
      shapes.push(shape);
    },
    removeShape: (shape: Shape) => {
      const index = shapes.indexOf(shape);
      if (index > -1) {
        shapes.splice(index, 1);
      }
    },
  };
}
