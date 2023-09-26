import { plinkoCanvas } from "./core";

export class BangCircle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.opacity = 0.8;
    this.ttl = 80;
  }
  draw() {
    plinkoCanvas.ctx.beginPath();
    plinkoCanvas.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    plinkoCanvas.ctx.fillStyle = this.color;
    plinkoCanvas.ctx.fill();
    plinkoCanvas.ctx.closePath();
  }
  update() {
    this.draw();
  }
}
