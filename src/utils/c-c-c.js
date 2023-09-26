function curvePoints() {
  
}

class CrashCanvasHandler {
  constructor() {
    this.canvas = this.ctx = this.canvasSize = null;
    this.rockeyDistanceTrick = 0x0;
    this.viewBoxX = 0;
    this.viewBoxY = 0;
    this.fireTrick = 0x0;
    this.loaded = false;
    this.rocketImage = this.fireRocket = null;
    this.firstPlCurrentPayoutX = 0;
    this.firstPlCurrentPayoutY = 0;
    this.rocketX = 0;
    this.marginX = 50;
    this.marginY = 20;
    this.mobile = false;
    this.maxMargins = 9 * this.marginX;
    this.rocketY = 0;
    this.statusLabel = ""
    this.platX = [
      0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9,
      9.5,
    ];
    this.platY = [
      0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5,
    ];
  }

  init(mobile = false) {
    this.mobile = mobile;
    this.canvasSize = document
      .querySelector(".crash-canvas-screen .graph")
      .getBoundingClientRect();
    this.canvas = document.getElementById("crash-canvas");
    this.canvas.width = this.canvasSize.width;
    this.canvas.height = this.canvasSize.height;
    this.ctx = this.canvas.getContext("2d");

    this.rocketY = this.canvas.height - 30;
    // this.marginX -= Math.max(
    //   1,
    //   (2 * Math.pow(2, this.platX.length)) /
    //     (this.canvas.width - this.marginX * 2),
    // );

    // this.marginY -= Math.max(
    //   1,
    //   (2 * Math.pow(2, this.platY.length)) /
    //     (this.canvas.height - this.marginY * 2),
    // );

    // this.marginY < 18 && (this.marginY = 40);
    // this.marginX < 18 && (this.marginX = 40);

    requestAnimationFrame(this.loop.bind(this));
  }

  cleanup() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.rocketX = 0;
    this.rocketY = Math.max(
      (this.canvas && this.canvas.height ? this.canvas.height : 0x0) - 30,
      0,
    );
    this.marginX = 50;
    this.marginY = 20;
    this.canvas = this.ctx = null;
  }

  drawCurveLine() {
    console.log("drawCurveLine");
    let xLine = 0;
    let yLine = this.canvas.height - 30;
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = "round";
    // this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = "#686F78";
    this.ctx.setLineDash([0x5, 10]);
    this.ctx.beginPath();

    this.ctx.moveTo(xLine, yLine);

    this.ctx.lineTo(this.rocketX, this.rocketY);

    this.ctx.stroke();
  }

  rotate(rad, context, size) {
    if (context) {
      size && context.translate(size.width, size.height);
      context.rotate(rad);
      size && context.translate(-size.width, -size.height);
    }
  }

  drawRocket() {
    console.log("drawRocket");
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

      if (this.rockeyDistanceTrick > 2) {
        this.rockeyDistanceTrick = 0x0;
        resetor = true;
        ctx.rotate((1.5 * Math.PI) / 180);
      }
      
      this.fireTrick++;
      this.rockeyDistanceTrick++;

      ctx.drawImage(
        this.rocketImage,
        this.mobile ? 35 : 30,
        this.mobile ? 20 : -5,
        this.rocketImage.width,
        this.rocketImage.height,
      );

      resetor && ctx.rotate((-2 * Math.PI) / 180);

      ctx.save();

      this.rotate((68.93 * Math.PI) / 180, ctx, {
        width: this.fireRocket.width,
        height: this.fireRocket.height,
      });

      ctx.drawImage(
        this.fireRocket,
        this.mobile ? 52 : 37,
        this.mobile ? 20 : 37,
        this.fireRocket.width,
        this.fireRocket.height,
      );

      ctx.restore();

      this.ctx.drawImage(
        canvas,
        this.rocketX - 30,
        this.rocketY - 75,
        canvas.width,
        canvas.height,
      );
    }
  }

  drawGraphY() {
    console.log("drawGraphY");
    this.ctx.save();
    let platYx = this.canvas.width - 60;

    this.ctx.fillStyle = "#686F78";

    let squarePathY = new Path2D();

    let platHeight = this.canvas.height - this.marginX;

    squarePathY.rect(
      platYx,
      this.canvas.height / 2 - platHeight / 2,
      50,
      platHeight,
    );

    this.ctx.clip(squarePathY, "evenodd");

    let payoutPlaceY = this.platY.indexOf(this.firstPlCurrentPayoutY);

    if (payoutPlaceY >= this.platY.length - 9) {
      let lastP = this.platY[payoutPlaceY];
      for (let i = 0; i < 8; i++) {
        this.platY.push((lastP = lastP + 0.5));
      }
    }

    payoutPlaceY++;

    payoutPlaceY <= 0x0 && (payoutPlaceY = 1);

    let plYy = (this.marginY * payoutPlaceY + 200) * 2;

    for (let j = 0; j < this.platY.length; j++) {
      this.ctx.fillStyle = this.rocketY <= plYy ? "#fff" : "#686F78";

      this.ctx.fillRect(platYx, plYy, 8, 2);

      let text = this.platY[j].toString();

      text += text.length === 1 ? ".0x" : "x";

      this.ctx.font = "13px Karla";

      this.ctx.fillText(text, platYx + 17, plYy + 4);

      plYy -= this.marginY * 2;
    }

    squarePathY.closePath();

    this.ctx.restore();
  }
  drawGraphX() {
    console.log("drawGraphX");
    this.ctx.save();

    let platXy = this.canvas.height - 50;
    let squarePathX = new Path2D();

    let platWidth = this.canvas.width - this.marginX;

    squarePathX.rect(
      this.marginX,
      platXy,
      platWidth - this.marginX - 10,
      this.marginX,
    );

    this.ctx.clip(squarePathX, "evenodd");

    let payoutPlaceX = this.platX.indexOf(this.firstPlCurrentPayoutX);

    if (payoutPlaceX >= this.platX.length - 9) {
      let lastP = this.platX[payoutPlaceX];
      for (let i = 0; i < 8; i++) {
        this.platX.push((lastP = lastP + 0.5));
      }
    }

    payoutPlaceX++;
    payoutPlaceX <= 0x0 && (payoutPlaceX = 1);

    let plXx = -(this.marginX * payoutPlaceX * 2) + 200;

    for (let i = 0; i < this.platX.length; i++) {
      this.ctx.fillStyle = this.rocketX >= plXx ? "#fff" : "#686F78";

      this.ctx.fillRect(plXx, platXy, 2, 8);

      let text = this.platX[i].toString();

      text += text.length === 1 ? ".0s" : "s";

      this.ctx.font = "13px Karla";

      let xText = plXx - this.ctx.measureText(text).width / 2;

      this.ctx.fillText(text, xText + 3, platXy + 25);

      plXx += this.marginX * (10000 / this.elapsed );
      this.ctx.fillStyle = "#686F78";
    }

    squarePathX.closePath();
    this.ctx.restore();
  }

  drawStatusText() {
    this.ctx.save();
    // console.log("ratio: w/h - " + this.canvas.width / this.canvas.height);
    this.ctx.font = "96px Karla";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = this.status === 'crashed' ? "#F87171" : "#686F78";
    this.ctx.fillText(this.statusLabel, this.canvas.width / 2, this.canvas.height / 2);
    
    this.ctx.fillStyle = "#686F78";
    this.ctx.restore()
  }

  loop() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // this.drawGraphX();
      // this.drawGraphY();
       //this.drawCurveLine();
       //this.drawRocket();
      this.drawStatusText();
    }

    requestAnimationFrame(this.loop.bind(this));
  }
}

export const crashCanvas = new CrashCanvasHandler();

setInterval(() => {
  if (crashCanvas.canvas && crashCanvas.active) {
    crashCanvas.rocketX = crashCanvas.rocketX > crashCanvas.canvas.width - 200 
        ? crashCanvas.rocketX
        : crashCanvas.rocketX + 3;

    crashCanvas.rocketY =
      crashCanvas.rocketX < 0 ||
      crashCanvas.rocketY < 0 ||
      crashCanvas.rocketX > crashCanvas.canvas.width - 200
        ? crashCanvas.rocketY
        : crashCanvas.rocketY - 0.5;
  }
}, 50);
