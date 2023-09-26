import { store } from "../../../../redux/store";
import { utilsPlinko } from "./calcs";
import { PlinkoCircle } from "./circle_game";
import { FixedCircle } from "./fixed_circle";

class PlinkoCanvas {
  constructor(mobile = false) {
    this.canvas = null;
    this.ctx = null;

    // this.canvas.width = mobile ? 300 : 500;
    // this.canvas.height = mobile ? 300 : 500;

    this.passed = false;

    this.automatically = false;
    this.ticker = 0x0;
    this.gf = 0;
    this.ballSize = 7; // Radius of the ball
    this.linesGame = 16; // Number of lines in the game
    this.circlesSize = 0x5; // Number of balls in the game
    this.fixedCircles = []; // Array of circles that are fixed
    this.circles = []; // Array of circles that are moving
    this.lastX = 0x0;
    this.bangCircle = [];
    this.colors = {
      darkOrange: "#FF8C00",
      coral: "#FF7F50",
      white: "#ffffff",
    };
  }

  initElement(packetId) {
    let element = document.querySelector(`#${packetId}`);

    if (element) {
      this.canvas = document.querySelector(`#${packetId} canvas`);
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = element.offsetWidth;
      this.canvas.height = element.offsetHeight;
    }
  }

  clearWorld() {
    this.passed = false;
    this.fixedCircles = [];
    this.circles = [];
    this.ticker = 0x0;
    if (this.ctx) {
      this.ctx.clearRect(0x0, 0x0, this.canvas.width, this.canvas.height);
    }
  }

  drawLines() {
    this.fixedCircles = [];

    const fixedBallsCoordinates = utilsPlinko.fixedCirclesCoordinates(
      this.canvas.width,
      this.canvas.height,
      this.linesGame,
    );

    for (let i = 0; i < fixedBallsCoordinates.length; i++) {
      let newFixedCircle = new FixedCircle(
        fixedBallsCoordinates[i].x,
        fixedBallsCoordinates[i].y,
        this.circlesSize,
        this.colors.white,
      );

      this.fixedCircles.push(newFixedCircle);
    }
  }

  initWorld() {
    this.passed = true;

    this.drawLines();

    requestAnimationFrame(this.draw.bind(this));
  }

  addCircle() {
    let uod = utilsPlinko.randomIntFromConcreteRange(
      this.canvas.width / 2,
      -this.canvas.width / 13,
      this.canvas.width / 13,
    );

    let newCircle = new PlinkoCircle(
      uod,
      25,
      this.ballSize,
      this.colors.darkOrange,
    );
    
    this.circles.push(newCircle);
  }


  draw() {
    if (!this.ctx || !this.passed) {
      return;
    }

    this.ctx.clearRect(0x0, 0x0, this.canvas.width, this.canvas.height);

    // this.ctx.fillStyle = backgroundGradient;
    // this.ctx.fillRect(0x0, 0x0, this.canvas.width, this.canvas.height);

    for (let i = 0x0; i < this.fixedCircles.length; i++) {
      let item = this.fixedCircles[i];
      item.update();
    }

    if (this.circles.length) {
      for (let i = 0x0; i < this.circles.length; i++) {
        let circle = this.circles[i];

        circle.update(this.fixedCircles, (nO) => {
          this.bangCircle.push(nO);
        });

        if (circle.radius === 0x0) {
          this.circles.splice(i, 0x1);
        }
      }
    }

    if (this.bangCircle.length) {
      for (let i = 0x0; i < this.bangCircle.length; i++) {
        let bang = this.bangCircle[i];

        bang.update();

        this.bangCircle[i].ttl -= 2;
        this.bangCircle[i].radius += 0.4;
        this.bangCircle[i].opacity -= 1 / bang.ttl;

        this.bangCircle[i].color = `rgba(255,255,255, ${bang.opacity * 0.2})`;

        if (bang.ttl === 0) {
          this.bangCircle.splice(i, 1);
        }
      }
    }

    if (this.automatically === true) {
      this.ticker++;
      if (this.ticker % 75 === 0) {
        this.addCircle();
      }
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}

export const plinkoCanvas = new PlinkoCanvas();
