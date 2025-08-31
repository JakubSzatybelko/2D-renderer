export function drawSprite(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  ctx.drawImage(image, x, y, width, height);
}
