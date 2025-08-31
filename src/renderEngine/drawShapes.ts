export function drawRectangle(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

export function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function drawPolygon(ctx: CanvasRenderingContext2D, points: { x: number; y: number }[], color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fill();
}

// common polygon shortcuts 

export function drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  const height = (Math.sqrt(3) / 2) * size;
  drawPolygon(ctx, [
    { x: x, y: y - height / 3 },
    { x: x - size / 2, y: y + height / 3 },
    { x: x + size / 2, y: y + height / 3 },
  ], color);
}

export function drawSquare(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  drawRectangle(ctx, x, y, size, size, color);
}

export function drawPentagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  const angle = (2 * Math.PI) / 5;
  const points = [];
  for (let i = 0; i < 5; i++) {
    points.push({
      x: x + size * Math.cos(i * angle),
      y: y + size * Math.sin(i * angle),
    });
  }
  drawPolygon(ctx, points, color);
}

export function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  const angle = (2 * Math.PI) / 6;
  const points = [];
  for (let i = 0; i < 6; i++) {
    points.push({
      x: x + size * Math.cos(i * angle),
      y: y + size * Math.sin(i * angle),
    });
  }
  drawPolygon(ctx, points, color);
}