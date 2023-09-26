import { plinkoCanvas } from "./core";
import { utilsPlinko } from "./calcs";
import { BangCircle } from "./bang_circle";
import { hxc } from "./historyXCircles";
import { store } from "../../../../redux/store";
import { risksPayout } from "./risks";
import { clearAllAnimations, getTypeOfDifficulty } from "../PlinkoGame";

/*
  Idea to get the ball goes to the right place:
  1. make an array container each multiplier card {StartX, EndX, StartY, width (EndX - StartX) + 2px as margin}
  2. control the ball x,y by Distance multiplier card
  I hope this idea will work as well.
  @author: cairbyte71
*/
export class PlinkoCircle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: 0,
      y: 5,
    };
    this.mass = 1;
    this.gravity = 1;
    this.friction = 0.8;
    this.scrambleId = (Math.random() * 0xffffffff) >>> 0;
  }
  draw() {
    plinkoCanvas.ctx.beginPath();
    plinkoCanvas.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    plinkoCanvas.ctx.fillStyle = this.color;
    plinkoCanvas.ctx.fill();
    plinkoCanvas.ctx.closePath();
  }
  update(fixedCircles, bangCircle) {
    this.draw();

    let startX =
      plinkoCanvas.canvas.width - (plinkoCanvas.canvas.width - 200 / 2);
    let endX = plinkoCanvas.canvas.width - 200 / 2;
    let exactWidthX = endX - startX;
    let widthPerMulti =
      exactWidthX /
      (plinkoCanvas.linesGame +
        (this.x > plinkoCanvas.canvas.width / 2 ? 1 : 2));
    let leftEdge = (plinkoCanvas.canvas.width - exactWidthX) / 2;

    if (this.y + this.radius + this.velocity.y > plinkoCanvas.canvas.height) {
      clearAllAnimations();

      this.radius = 0;
      this.y = 20;

      let multiIndex = ~~((this.x - leftEdge) / widthPerMulti) + 1;

      if (multiIndex >= 0x0) {
        let state = store.getState().plinko;
        const setMultiplier = (m) =>
          store.dispatch({
            type: "UPDATE_PLINKO_STATE",
            payload: {
              beting:
                state.betType === 0x0 && plinkoCanvas.circles.length <= 1
                  ? false
                  : state.beting,
              roundEnded: plinkoCanvas.circles.length <= 1 ? true : false,
              currentMultiplier: m,
              multipliersHistory: [
                risksPayout[getTypeOfDifficulty(state.difficulty)][
                  plinkoCanvas.linesGame
                ][Math.abs(~~m - 1)],
              ].concat(state.multipliersHistory),
            },
          });

        setMultiplier(multiIndex + Math.random());
      }
    }

    for (let i = 0; i < fixedCircles.length; i++) {
      let change = utilsPlinko.distance(
        this.x + this.velocity.x,
        this.y + this.velocity.y,
        fixedCircles[i].x,
        fixedCircles[i].y,
      );

      if (change - this.radius - fixedCircles[i].radius < 0) {
        bangCircle(
          new BangCircle(
            fixedCircles[i].x,
            fixedCircles[i].y,
            0,
            "rgba(255,255,255, 0.5)",
          ),
        );

        utilsPlinko.resolveCollision(this, fixedCircles[i]);
      }
    }

    if (this.velocity.y < 0) {
      this.velocity.y = -this.velocity.y;
    } else {
      this.velocity.y += 0.2;
    }

    this.y += this.velocity.y;

    if (startX > this.x || this.x > endX) {
      this.x -= startX > this.x ? -this.velocity.x : this.velocity.x;
    } else {
      this.x += this.velocity.x;
    }

    if (!(this.scrambleId in hxc.circles)) {
      hxc.circles[this.scrambleId] = {
        x: this.x,
        y: this.y,
        trick: 0,
      };
    }

    if (
      hxc.update(this.scrambleId, parseFloat(this.x.toFixed(3)), this.y) ||
      plinkoCanvas.canvas / 2 === this.x
    ) {
      this.x -= Math.random() > 0.5 ? 1 : -1;
    }
  }
}
