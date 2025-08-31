export function checkSquareCollision(shape1: any, shape2: any): boolean {
  // Simple AABB collision detection
  return !(
    shape1.x > shape2.x + shape2.width ||
    shape1.x + shape1.width < shape2.x ||
    shape1.y > shape2.y + shape2.height ||
    shape1.y + shape1.height < shape2.y
  );
}

export function checkCircleCollision(circle1: any, circle2: any): boolean {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circle1.radius + circle2.radius;
}

export function checkSquareWithinCircle(square: any, circle: any): boolean {
  const testX = circle.x < square.x ? square.x : circle.x;
  const testY = circle.y < square.y ? square.y : circle.y;
  const dx = circle.x - testX;
  const dy = circle.y - testY;
  return dx * dx + dy * dy < circle.radius * circle.radius;
}
