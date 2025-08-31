/// import all logic and export it here as a global module

import { drawRectangle, drawCircle,drawLine,drawPolygon,drawTriangle,drawSquare,drawPentagon,drawHexagon } from './drawShapes';
import {drawSprite} from './drawSprite';
import {checkSquareCollision,checkCircleCollision,checkSquareWithinCircle} from './colisions';
import {createInstanceMonitor} from './instanceMonitor';

import type { InstanceMonitor } from './types';
import { bounceMovementStrategy, calculateMovement, gravityMovementStrategy } from './movement';

const masterObject ={
  drawRectangle,
  drawCircle,
  drawLine,
  drawPolygon,
  drawTriangle,
  drawSquare,
  drawPentagon,
  drawHexagon,
  drawSprite,
  checkSquareCollision,
  checkCircleCollision,
  checkSquareWithinCircle,
  createInstanceMonitor
}


const render = (ctx: CanvasRenderingContext2D, instanceMonitor: InstanceMonitor) => {
  // Render all shapes
  instanceMonitor.shapes.forEach(shape => {
    if (shape.radius) {
      drawCircle(ctx, shape.x, shape.y, shape.radius, 'red');
    } else {
      drawRectangle(ctx, shape.x, shape.y, shape.width, shape.height, 'blue');
    }
  });
  instanceMonitor.shapes.forEach(shape => {
    if (shape.id === "rect1") {
      calculateMovement(shape, instanceMonitor, gravityMovementStrategy,bounceMovementStrategy,{ bounceFactor: 0.4 });
    }
  });
  ///// draw all shapes info on top right corner
  ctx.fillStyle = 'black';
  ctx.font = '12px Arial';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  instanceMonitor.shapes.forEach(shape => {
    if(shape.id!=="rect1") return;
    ctx.fillText(`ID: ${shape.id}`, ctx.canvas.width - 10, 10 + shape.id.length * 15);
    ctx.fillText(`X: ${shape.x}`, ctx.canvas.width - 10, 10 + shape.id.length * 15 + 15);
    ctx.fillText(`Y: ${shape.y}`, ctx.canvas.width - 10, 10 + shape.id.length * 15 + 30);
    ctx.fillText(`Width: ${shape.width}`, ctx.canvas.width - 10, 10 + shape.id.length * 15 + 45);
    ctx.fillText(`Height: ${shape.height}`, ctx.canvas.width - 10, 10 + shape.id.length * 15 + 60);
    ctx.fillText(`Velocity X: ${shape.movementVector.x}`, ctx.canvas.width - 10, 10 + shape.id.length * 15 + 75);
    ctx.fillText(`Velocity Y: ${shape.movementVector.y}`, ctx.canvas.width - 10, 10 + shape.id.length * 15 + 90);
  });
};
const animate = (ctx: CanvasRenderingContext2D, instanceMonitor: InstanceMonitor) => {
  requestAnimationFrame(() => animate(ctx, instanceMonitor));
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  render(ctx, instanceMonitor);
};

export { masterObject, animate };