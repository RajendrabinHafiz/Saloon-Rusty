import React, { createRef, useState } from "react";
import CrashDetails from "./CrashDetails";
import CrashMultipliers from "./CrashMultipliers";
import { socket } from "../../../Socket";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../Loader";

var col = {
  _stripHash: function (hex) {
    return hex.substr(0, 1) === "#" ? hex.substr(1) : hex;
  },

  _containsValidHexChars: function (hex) {
    return /^[0-9a-f]+$/i.test(hex);
  },
  _padWith0: function (hex) {
    return "000000".substr(0, 6 - hex.length) + hex;
  },
  _expandHex: function (hex) {
    if (hex.length === 3) {
      hex.split("");

      hex = [hex[0], hex[0], hex[1], hex[1], hex[2], hex[2]].join("");
    }

    return hex;
  },

  _validateHex: function (candidate) {
    var hex = col._stripHash(candidate.toString());

    if (col._containsValidHexChars(hex)) {
      if (hex.length === 3) {
        hex = col._expandHex(hex);
      } else if (hex.length < 6) {
        hex = col._padWith0(hex);
      } else if (hex.length > 6) {
        hex = hex.substr(0, 6);
      }

      return hex;
    }

    return "000000";
  },

  _decimalToHex: function (decimal) {
    return decimal.toString(16);
  },

  _hexToDecimal: function (hex) {
    return parseInt(hex, 16);
  },

  mix: function (color1, color2, weight) {
    // make sure the colors are 6 digit hex colors without leading #
    color1 = col._validateHex(color1);
    color2 = col._validateHex(color2);

    // if weight hasn't been set (undefined)
    // or outside allowed range (0-100)
    // well make it 50 (an equal mix of both colors)
    weight =
      typeof weight === "undefined" ||
      parseInt(weight) < 0 ||
      parseInt(weight) > 100
        ? 50
        : weight;

    // holding variable for new colour
    var newColor = "";

    // loop through hex
    // we want to extract each of the colour triplets (rr, gg, bb)
    // so we use a step of 2
    for (var i = 0; i < 6; i += 2) {
      // retrieve individual color triplet
      // and convert to decimal
      var color1triplet = col._hexToDecimal(color1.substr(i, 2));
      var color2triplet = col._hexToDecimal(color2.substr(i, 2));

      // blend colour triplets
      var calculatedTriplet = Math.floor(
        color1triplet + (color2triplet - color1triplet) * (weight / 100),
      );

      // convert decimal back to hex
      calculatedTriplet = col._decimalToHex(calculatedTriplet);

      // if only one digit prepend with 0
      // and add to newColor variable
      newColor +=
        calculatedTriplet.length === 1
          ? "0" + calculatedTriplet
          : calculatedTriplet;
    }
    return "#" + newColor;
  },

  blendRange: function (color1, color2, midpoints) {
    // make sure the colors are 6 digit hex colors without leading #
    color1 = col._validateHex(color1);
    color2 = col._validateHex(color2);

    // make sure that the number of midpoints is bigger than 0
    // and add 1 because we want to include the original colours
    midpoints = parseInt(midpoints) >= 1 ? parseInt(midpoints) + 1 : 2;

    // create array for the blended colours
    var blendArray = [];

    // loop through number of midpoints
    for (var i = 0, len = midpoints; i < len + 1; i++) {
      // mix the two colours with a weight calculated on the position in the blend
      // and add to blendArray
      blendArray.push(col.mix(color1, color2, (100 / len) * i));
    }

    // ... and ship back
    return blendArray;
  },
};

class Crash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      playersCashedOut: [],
      lastT: 0,
      bets: {},
      y: "Crashed",
      hash: "Not Found",
      crashed: false,
      active: false,
      balance: 0,
      sum: 0,
      betAmount: 0,
      counter: 0,
      crashPoint: 0,
      connected: false,
      initer: 0,
      animCashedOutXPos: 0,
      animCashedOutYPos: 0,
      currentTime: 0,
    };

    this.cordsList = {};

    this.betInput = React.createRef(0);
    this.betInputMobile = React.createRef(0);
    this.autocashoutInput = React.createRef(0);
    this.autocashoutInputMobile = React.createRef(0);
    this.colorPickerRef = React.createRef(0);
    this.colorPickerRefMobile = React.createRef(0);

    this.counterInterval = "";

    // VARIABLES
  }

  calcColors(color1, color2, midpoints) {
    return col.blendRange(color1, color2, midpoints); // Creates a animation mix of colors for the graph to use.
  }

  calcY = (x) => {
    var r = 0.00006;
    return Math.floor(100 * Math.pow(Math.E, r * x * 1000)) / 100;
  };

  initDefs = () => {
    this.canvasSize = document.getElementById("canvas").getBoundingClientRect();
    this.cashoutAnimXStart = this.canvasSize.width + 40;
    this.cashoutAnimYStart = this.canvasSize.height - 20;
    this.canvasWidth = this.colorPickerRef.current.width;
    this.canvasHeight = this.colorPickerRef.current.height;

    this.extraY = 5;
    this.plotWidth = this.canvasWidth - 45;
    this.plotHeight = this.canvasHeight - 40; //
    this.xStart = this.canvasWidth - (this.plotWidth + 5);
    this.yStart = this.canvasHeight - this.plotHeight;
    this.XAxisPlotMinValue = 10000; //10 Seconds
    this.YAxisSizeMultiplier = 2; //YAxis is x times
  };

  onResize() {}

  componentDidMount() {
    document.title = "RustySaloon | Crash";
    this.ctx = this.colorPickerRef.current.getContext("2d");

    this.initDefs();
    window.addEventListener("resize", this.initDefs, false);

    this.colors = this.calcColors("#FD5674", "#41CC68", 10000).concat(
      this.calcColors("#41CC68", "#DEC15A", 40000),
    );

    socket.emit("crashConnected");

    socket.on("crashConnect", (data) => {
      this.setState({
        history: data.history,
        hash: data.hash,
        bets: data.bets,
        connected: true,
        initer: 1,
      });
    });

    socket.on("cashoutResponse", (data) => {
      //this.setState({ active: false });
    });

    socket.on("crashPlayer", (data) => {
      //this.autocashoutInput.current.value = data.autocashout;
      //this.setState({ active: true, betAmount: data.betValue });
    });

    socket.on("crashPlayer", (data) => {
      //this.autocashoutInput.current.value = data.autocashout;
      //this.setState({ active: true, betAmount: data.betValue });
    });

    socket.on("crashPlayers", (bets) => {
      let sum = 0;
      for (var bet in bets) {
        sum += bets[bet].amount;
      }
      this.setState({ bets, sum });
    });

    socket.on("crashGraph", (coords) => {
      clearInterval(this.counterInterval);

      this.setState({
        crashPoint: coords.y,
        y: Number(coords.y).toFixed(2) + "x",
      });
      this.calcGameData(Math.round(coords.x * 1000));
      this.calculatePlotValues(Math.round(coords.x * 1000));
      this.clean(Math.round(coords.x * 1000));
      this.drawAxes(Math.round(coords.x * 1000));
      this.drawGraph(
        Math.round(coords.x * 1000),
        Math.round(coords.x * 100) >= this.colors.length - 1
          ? "#DEC15A"
          : this.colors[Math.round(coords.x * 100)],
      );

      let i = 0;
      this.counterInterval = setInterval(() => {
        if (i % 100 === 0) {
          console.log(Date.now());
        }

        let currentX = Number(coords.x) + i / 100;
        this.setState({ y: Number(this.calcY(currentX)).toFixed(2) + "x" });
        this.calcGameData(Math.round(currentX * 1000));
        this.calculatePlotValues(Math.round(currentX * 1000));
        this.clean(Math.round(currentX * 1000));
        this.drawAxes(Math.round(currentX * 1000));
        this.drawGraph(
          Math.round(currentX * 1000),
          Math.round(currentX * 100) >= this.colors.length - 1
            ? "#41CC68"
            : this.colors[Math.round(currentX * 100)],
        );

        i++;
      }, 10);
    });

    socket.on("crashPlayerCashedOut", (data) => {
      /*
      console.log('There is a cashedout')
      console.log(this.state.animCashedOutXPos)
      console.log(this.state.animCashedOutYPos)
      */
      const sameCount = this.state.playersCashedOut.filter(
        (el) => el.cashedOut === data.cashedOut,
      );
      data.t = this.state.lastT;
      data.index = sameCount;
      /*
      data.currentTime = this.state.currentTime;
      data.x = this.state.animCashedOutXPos;
      data.y = this.state.animCashedOutYPos - (sameCount * 61);
      */
      this.setState({
        playersCashedOut: [...this.state.playersCashedOut, data],
      }); //another arra
      console.log(this.state.playersCashedOut);
    });

    socket.on("crashCounter", (info) => {
      clearInterval(this.counterInterval);

      if (info.counter === 10) {
        this.cordsList = {};
        this.setState({ bets: {}, playersCashedOut: [] });
        this.clean();
        // this.drawAxes(0);
      }

      this.counterInterval = setInterval(() => {
        let counter = this.state.counter - 0.1;
        if (counter < 0) counter = 0;
        this.setState({ counter });
      }, 100);

      this.setState({
        crashed: false,
        hash: info.hash,
        y: "Counting",
        counter: info.counter,
      });
    });
    socket.on("crashCrashed", (coords) => {
      clearInterval(this.counterInterval);
      this.setState({
        active: false,
        crashed: true,
        crashPoint: coords.y,
        y: `Crashed @${coords.y}x`,
        betAmount: 0,
        sum: 0,
      });
    });

    socket.on("crashHistory", (history) => {
      this.setState({ history: history });
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.initDefs, false);
    socket.off("crashGraph");
    socket.off("crashCounter");
    socket.off("crashCrashed");
    socket.off("crashHistory");
    socket.off("crashConnect");
    socket.off("crashPlayers");
    socket.off("crashPlayer");
    socket.off("crashPlayerCashedOut");
    socket.off("cashoutResponse");
    clearInterval(this.counterInterval);
  }

  calcY(x) {
    return (Math.E ** (0.0167 * x)).toFixed(2);
    // return (Math.E ** (0.065 * x)).toFixed(2);
  }

  growthFunc(ms) {
    var r = 0.00006;
    // return (Math.E ** (0.0167 * ms / 1000)).toFixed(2);
    return (100 * Math.pow(Math.E, r * ms)) / 100; // math.floor for ridges!
  }
  calcGamePayout(ms) {
    var gamePayout = this.growthFunc(ms);
    return gamePayout;
  }

  drawGraph(currentTime, color) {
    // currentTime in milisec
    const lineWidth = 6;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    let y = 0;
    let x = 0;
    for (var t = 0, i = 0; t <= currentTime; t += 10, i++) {
      // T is update frequency
      /* Graph */
      var payout = this.calcGamePayout(t) - 1; //We start counting from one x

      //const gap = 5;
      y = this.plotHeight - payout * this.heightIncrement;
      y += this.extraY;
      //if (y < gap) y = gap;
      x = t * this.widthIncrement;
      if (x > this.plotWidth) x = this.plotWidth;

      const animPosX = t * this.widthIncrementForAnim;
      const animPosY = this.cashoutAnimYStart - payout * this.heightIncrement;
      this.cordsList[t] = { x: animPosX, y: animPosY };
      if (t + 10 > currentTime) {
        this.setState({ lastT: t });
      }

      this.ctx.lineTo(x + this.xStart, y);
      if (i > 50000) {
        break;
      }
    }
    // var payout2 = this.calcGamePayout(currentTime) - 1;

    this.ctx.stroke();

    const arcWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.fillStyle = this.ctx.strokeStyle;
    this.ctx.arc(x + this.xStart, y, arcWidth, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
  }

  stepValues(x) {
    var c = 0.4;
    var r = 0.1;
    while (true) {
      if (x < c) return r;

      c *= 5;
      r *= 2;

      if (x < c) return r;
      c *= 2;
      r *= 5;
    }
  }

  drawAxes() {
    //Function to calculate the plotting values of the Axes

    //Calculate Y Axis
    this.YAxisPlotMaxValue = this.YAxisPlotMinValue;
    this.payoutSeparation = this.stepValues(this.currentGamePayout);

    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "White";
    this.ctx.font = "12px Verdana";
    this.ctx.fillStyle = "White";
    this.ctx.textAlign = "center";

    //Draw Y Axis Values
    var heightIncrement = this.plotHeight / this.YAxisPlotValue;
    for (
      var payout = this.payoutSeparation, i = 0;
      payout < this.YAxisPlotValue;
      payout += this.payoutSeparation, i++
    ) {
      var y = this.plotHeight - payout * heightIncrement;
      y += this.extraY;
      this.ctx.fillText(payout + 1 + "x", 20, y);
      /* X axis lines
      this.ctx.strokeStyle = "Grey";
      this.ctx.beginPath();
      this.ctx.moveTo(this.xStart, y);
      this.ctx.lineTo(this.xStart + this.plotWidth, y);
      this.ctx.stroke();
      */

      if (i > 100) {
        console.log("For 3 too long");
        break;
      }
    }

    //Calculate X Axis
    this.milisecondsSeparation = this.stepValues(this.XAxisPlotValue);
    this.XAxisValuesSeparation =
      this.plotWidth / (this.XAxisPlotValue / this.milisecondsSeparation);

    //Draw X Axis Values
    for (
      var miliseconds = 0, counter = 0, i = 0;
      miliseconds < this.XAxisPlotValue;
      miliseconds += this.milisecondsSeparation, counter++, i++
    ) {
      var seconds = miliseconds / 1000;
      var textWidth = this.ctx.measureText(seconds).width;
      var x = counter * this.XAxisValuesSeparation + this.xStart;
      this.ctx.fillText(
        seconds + "s",
        x - textWidth / 2,
        this.plotHeight + 15 + this.extraY,
      );

      /* Y axis lines
      this.ctx.strokeStyle = "Grey";
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvasHeight - this.yStart);
      this.ctx.lineTo(this.canvasWidth, this.canvasHeight - this.yStart);
      this.ctx.stroke();
      */

      if (i > 100) {
        console.log("For 4 too long");
        break;
      }
    }

    this.ctx.strokeStyle = "White";
    //Draw background Axis
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(this.xStart, 0);
    this.ctx.lineTo(this.xStart, this.canvasHeight - this.yStart + this.extraY);
    this.ctx.lineTo(
      this.canvasWidth,
      this.canvasHeight - this.yStart + this.extraY,
    );
    this.ctx.stroke();
  }

  clean() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
  calcGameData(currentTime) {
    this.currentGamePayout = this.calcGamePayout(currentTime);
  }

  calculatePlotValues(currentTime) {
    //Plot variables
    this.YAxisPlotMinValue = this.YAxisSizeMultiplier;
    this.YAxisPlotValue = this.YAxisPlotMinValue;

    this.XAxisPlotValue = this.XAxisPlotMinValue;

    //Adjust X Plot's Axis
    if (currentTime > this.XAxisPlotMinValue) this.XAxisPlotValue = currentTime;

    //Adjust Y Plot's Axis
    if (this.currentGamePayout > this.YAxisPlotMinValue) {
      this.YAxisPlotValue = this.currentGamePayout;
    }

    //We start counting from zero to plot
    this.YAxisPlotValue -= 1;

    //Graph values
    this.widthIncrementForAnim = this.cashoutAnimXStart / this.XAxisPlotValue;
    this.widthIncrement = this.plotWidth / this.XAxisPlotValue;
    this.heightIncrement = this.plotHeight / this.YAxisPlotValue;
    this.currentX = currentTime * this.widthIncrement;
  }

  placeBet() {
    let bet = 0;
    try {
      bet =
        window.screen.width > 1375
          ? this.betInput.current.value
          : this.betInputMobile.current.value;
      /*
      const betAmount = parseFloat(document.getElementById('betInput').getAttribute('value'));
      console.log(betAmount)
      if (betAmount > 0) bet = betAmount;
      */
    } catch (err) {
      console.log("Bet err", err);
    }

    const autoCashout =
      window.screen.width >= 1375
        ? this.autocashoutInput.current.value
        : this.autocashoutInputMobile.current.value;
    if (Number(bet) > 0) {
      socket.emit("crashPlaceBet", {
        amount: parseFloat(bet) * 100,
        autocashout: Number(autoCashout),
      });
    }
  }

  cashout() {
    if (this.state.y[this.state.y.length - 1] === "x") {
      this.setState({
        active: false,
      });
      socket.emit("crashCashout");
    }
  }

  cloneCanvas(oldCanvas, width, height) {
    //create a new canvas
    var newCanvas = document.createElement("canvas");
    var context = newCanvas.getContext("2d");

    //set dimensions
    newCanvas.width = width;
    newCanvas.height = height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
  }

  render() {
    if (
      this.colorPickerRef.current != null &&
      this.colorPickerRef.current.value != null
    ) {
      this.colorPickerRefMobile.current = this.cloneCanvas(
        this.colorPickerRef.current,
        850,
        650,
      );
    }

    return (
      <React.Fragment>
        <div className={"crash bef"}>
          {/*       <div className={'crash bef ' + (!this.state.connected ? 'blurred': 'noblur') }> */}

          <div
            className={`crash__details-screen ${
              this.state.crashed ? "crash__screen_notactive" : ""
            }`}
          >
            <div className="hide-on-mobile">
              {/*
              key={parseFloat(this.state.y) >= 1 ? "cdstarteddesktop" : "cdnotstarteddesktop"}
          */}

              <CrashDetails
                ref={{
                  betInputRef: this.betInput,
                  cashoutInputRef: this.autocashoutInput,
                }}
                setBetInput={(val) => {
                  this.betInput.current.value = val;
                }}
                bets={this.state.bets}
                crashed={this.state.crashed}
                handler={(val) => {}}
                placeBet={() => {
                  this.placeBet();
                }}
                active={this.state.active}
                yEndsWithX={this.state.y.toString().endsWith("x")}
                yEqualsTo1OrHigher={
                  parseFloat(this.state.y) >= 1 ? true : false
                }
                y={this.state.y}
                cashout={() => this.cashout()}
                crashPoint={this.state.crashPoint}
                sum={this.state.sum}
              />
            </div>
            <div
              className="crash__screen"
              style={{
                border: `1px solid ${
                  this.state.crashed ? "var(--red)" : "rgba(255, 255, 255, 0.1)"
                }`,
              }}
            >
              <h1
                style={{ color: this.state.crashed ? "#a72d19" : "" }}
                className="crash__screen-details"
              >
                {this.state.y === "Counting"
                  ? "Next round in " + this.state.counter.toFixed(1)
                  : this.state.y}
              </h1>
              <canvas
                id="canvas"
                width={850}
                height={650}
                ref={this.colorPickerRef}
              ></canvas>

              <div class="cashouts">
                {this.state.playersCashedOut.map((user) => (
                  <div
                    class="user"
                    style={{
                      top: this.cordsList[user.t].y - user.index * 61,
                      left: this.cordsList[user.t].x,
                    }}
                  >
                    <img src={user.avatar} />
                    {/*<div class="name">{user.username}</div>*/}
                    <div class="multiplier">@{user.cashedOut}x</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <CrashMultipliers
            history={this.state.history}
            bets={this.state.bets}
          />

          <div className="show-on-mobile">
            {/*<CrashMultipliers history = {this.state.history} bets = {this.state.bets}/>*/}

            {/*
         key={parseFloat(this.state.y) >= 1 ? "cdstartedmob" : "cdnotstartedmob"}
         */}
            <CrashDetails
              ref={{
                betInputRef: this.betInputMobile,
                cashoutInputRef: this.autocashoutInputMobile,
              }}
              setBetInput={(val) => {
                this.betInputMobile.current.value = val;
              }}
              bets={this.state.bets}
              crashed={this.crashed}
              handler={(val) => {}}
              placeBet={() => {
                this.placeBet();
              }}
              yEndsWithX={this.state.y.toString().endsWith("x")}
              yEqualsTo1OrHigher={parseFloat(this.state.y) >= 1 ? true : false}
              active={this.state.active}
              y={this.state.y}
              cashout={() => this.cashout()}
              crashPoint={this.state.crashPoint}
              sum={this.state.sum}
            />
          </div>

          {/*
      <div className={'fscr '  + (!this.state.connected ? 'fcsr-active': 'fscr-hide') }>
      </div>
      */}
        </div>

        {!this.state.connected && (
          <div class="loaderpos">
            <Loader />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Crash;
