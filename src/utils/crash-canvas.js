class CrashCanvasHandler {
  constructor() {
    this.rafID = null;
    this.canvas = this.ctx = this.canvasSize = null;
    this.rockeyDistanceTrick = 0x0;
    this.marginX = 50;
    this.marginY = 50;
    this.fireTrick = 0x0;
    this.rocketImage = this.fireRocket = null;
    this.rocketX = 200;
    this.rocketY = 200;
    this.platX = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
    this.platY = [
      1, 1.2, 1.4, 1.8, 2, 2.2, 2.4, 2.8, 3, 3.2, 3.9, 4, 5, 6, 7, 8, 9,
    ];
    this.loop();
  }

  init() {
    if (this.canvas) this.cleanup();
    this.canvasSize = document
      .querySelector(".crash-canvas-screen .graph")
      .getBoundingClientRect();
    this.canvas = document.getElementById("crash-canvas");

    if (this.canvas) {
      this.canvas.width = this.canvasSize.width;
      this.canvas.height = this.canvasSize.height;
      this.ctx = this.canvas.getContext("2d");
      this.marginX -= Math.max(
        1,
        (2 * Math.pow(2, this.platX.length)) /
          (this.canvas.width - this.marginX * 2),
      );

      this.marginY -= Math.max(
        1,
        (2 * Math.pow(2, this.platY.length)) /
          (this.canvas.height - this.marginY * 2),
      );

      this.marginY < 18 && (this.marginY = 40);
      this.marginX < 18 && (this.marginX = 40);
    }
  }

  cleanup() {
    if (this.canvas) {
      this.ctx.save();

      // Use the identity matrix while clearing the canvas
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Restore the transform
      this.ctx.restore();
    }
    this.canvas = this.ctx = null;
    this.marginX = this.marginY = 50;
  }

  bezier(t, p0, p1, p2, p3) {
    var cX = 3 * (p1.x - p0.x),
      bX = 3 * (p2.x - p1.x) - cX,
      aX = p3.x - p0.x - cX - bX;

    var cY = 3 * (p1.y - p0.y),
      bY = 3 * (p2.y - p1.y) - cY,
      aY = p3.y - p0.y - cY - bY;

    var x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x;
    var y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y;

    return { x: x, y: y };
  }

  drawCurveLine() {
    let xLine = 10;
    let yLine = this.canvas.height;

    this.ctx.lineWidth = 4;
    this.ctx.lineCap = "round";
    // this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = "#686F78";
    this.ctx.setLineDash([0x5, 0x5]);
    this.ctx.beginPath();

    var accuracy = 0.01,
      p0 = { x: xLine, y: yLine },
      p1 = {
        x: this.rocketX + 100,
        y: this.rocketY + 100,
      },
      p2 = { x: this.rocketX + 20, y: this.rocketY + 20 },
      p3 = { x: this.rocketX + 20, y: this.rocketY + 80 };

    this.ctx.moveTo(xLine, yLine);
    for (var i = 0; i < 1; i += accuracy) {
      var p = this.bezier(i, p0, p1, p2, p3);
      this.ctx.lineTo(p.x, p.y);
    }
    this.ctx.stroke();
  }

  rotate(rad, context, size) {
    if (context) {
      context.rotate(rad);
    }
  }

  drawRocket() {
    if (this.rocketImage && this.fireRocket) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      canvas.width = 300;
      canvas.height = 200;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let resetor = false;
      if (this.fireTrick > 5) {
        this.fireTrick = 0x0;
        ctx.globalAlpha = 0.5;
      }

      ctx.globalAlpha = 1;

      if (this.rockeyDistanceTrick > 1) {
        this.rockeyDistanceTrick = 0x0;
        resetor = true;
        ctx.rotate((2 * Math.PI) / 180);
      }

      this.fireTrick++;
      this.rockeyDistanceTrick++;

      ctx.drawImage(
        this.fireRocket,
        0,
        50,
        this.fireRocket.width,
        this.fireRocket.height,
      );

      ctx.drawImage(
        this.rocketImage,
        25,
        -20,
        this.rocketImage.width + 20,
        this.rocketImage.height + 20,
      );

      resetor && ctx.rotate((-2 * Math.PI) / 180);

      this.ctx.drawImage(
        canvas,
        this.rocketX - 20,
        this.rocketY,
        canvas.width,
        canvas.height,
      );
    }
  }

  drawGraph() {
    let plXx = this.marginX + this.marginX / 2;
    let plXy = this.canvas.height - 50;
    let plYx = this.canvas.width - 50;
    let plYy = this.canvas.height - this.marginY;

    for (let j = 0; j < this.platY.length; j++) {
      j === 0x0 && this.platY.length >= 11 && (plYy = 455);

      if (j < 11) {
        this.ctx.fillStyle = this.rocketY <= plYy + 3 ? "#fff" : "#686F78";

        this.ctx.fillRect(plYx - 10, plYy, 8, 2);

        let text = this.platY[j >= 11 ? this.platY.length - 1 : j].toString();

        text += text.length === 1 ? ".0x" : "x";

        this.ctx.font = "13px Karla";

        this.ctx.fillText(text, plYx + 10, plYy + 3);

        plYy -= this.marginY;
      }
    }

    this.ctx.fillStyle = "#686F78";

    for (let i = 0; i < this.platX.length; i++) {
      if (plXx < this.canvas.width) {
        this.ctx.fillRect(plXx, plXy, 2, 8);

        let text = this.platX[i].toString();

        text += text.length === 1 ? ".0s" : "s";

        this.ctx.font = "13px Karla";

        let xText = plXx - this.ctx.measureText(text).width / 2;

        this.ctx.fillText(text, xText + 3, plXy + 25);

        plXx += this.marginX * 2;
      }
    }
  }

  loop() {
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawGraph();
      this.drawCurveLine();
      this.drawRocket();
    }

    requestAnimationFrame(this.loop.bind(this));
  }
}

export const crashCanvas = new CrashCanvasHandler();

setInterval(() => {
  if (crashCanvas.canvas) {
    crashCanvas.rocketX =
      crashCanvas.rocketY < 0 ||
      crashCanvas.rocketX < 0 ||
      crashCanvas.rocketX > crashCanvas.canvas.width - 200
        ? 200
        : crashCanvas.rocketX + 3;

    crashCanvas.rocketY =
      crashCanvas.rocketY < 0 ||
      crashCanvas.rocketX > 0 ||
      crashCanvas.rocketY > crashCanvas.canvas.height - 200
        ? 200
        : crashCanvas.rocketY - 2;
  }
}, 50);
