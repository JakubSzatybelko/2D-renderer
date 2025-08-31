
import { checkSquareCollision } from './colisions';
import type { InstanceMonitor } from './types';

const calculateMovement = (targetShape: any, instanceMonitor: InstanceMonitor, movementStrategy: (shape: any, collision: any) => void, collisionStrategy: any=null,options:any = {}) => {
  let collisionPoint;
  instanceMonitor.shapes.forEach(shape => {
    if(shape.id === targetShape.id) return;
    const collision = checkSquareCollision(targetShape, shape);
    if (collision) {
      //get point of collision, overlapping square area
      const x1 = Math.max(shape.x, targetShape.x);
      const y1 = Math.max(shape.y, targetShape.y);
      const x2 = Math.min(shape.x + shape.width, targetShape.x + targetShape.width);
      const y2 = Math.min(shape.y + shape.height, targetShape.y + targetShape.height);
      collisionPoint = {
        x1,x2,
        y1,y2
      };
    }
  });

  movementStrategy(targetShape, { collisionPoint });
  calculateMovementVector(targetShape, { collisionPoint }, collisionStrategy, options);
  //update position if colliding
  if(collisionPoint) {
    targetShape.y = collisionPoint.y2 - targetShape.height;
  }

  targetShape.x += targetShape.movementVector.x;
  targetShape.y += targetShape.movementVector.y;
};

const calculateMovementVector = (shape: any, collision: any, collisionStrategy: any, options: any) => {
  if (collisionStrategy && collision) {
    collisionStrategy(shape, collision, options);
  }
};

const gravityMovementStrategy = (shape: any, { collisionPoint }: { collisionPoint: { x1: number; x2: number; y1: number; y2: number; } }) => {
  const gravity = 0.5;
  shape.movementVector = { x: 0, y: shape.movementVector.y + gravity };
};

const bounceMovementStrategy = (shape: any, { collisionPoint }: { collisionPoint: { x1: number; x2: number; y1: number; y2: number; } }, options: any) => {
  if(!collisionPoint) return;
  shape.movementVector.y = -shape.movementVector.y * options.bounceFactor;
  shape.y = collisionPoint.y1 - shape.height;
};

export { calculateMovement, gravityMovementStrategy, bounceMovementStrategy };