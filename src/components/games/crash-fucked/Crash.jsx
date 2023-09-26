import sortBy from "lodash/sortBy";
import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

import Activities from "../../homepage/Activities";
import { crashCanvas } from "../../../utils/c-c-c";
import { loadImage } from "../../../utils/loadImage";
import { socket } from "../../../Socket";
import Players from "./Players";
import { set } from "lodash";

const Crash = () => {
     
  const profile = useSelector((state) => state.main.account);
  const { sidebarHidden, mobile } = useSelector((state) => state.main);
  const [betInput, setBetInput] = useState(0);
  const [aco, setAco] = useState(0); // Auto CashOut
  const [isAuto, setAuto] = useState(false);
  const [autoRunning, setAutoRunning] = useState(false);
  const [isResetLoss, setResetLoss] = useState(true);
  const [isResetWin, setResetWin] = useState(true);
  const [history, setHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState("ready"); // active, crashed, ready
  const [multiplier, setMultiplier] = useState(null);
  const [crashPlayers, setCrashPlayers] = useState([]);
  const [crashPlayersObject, setCrashPlayersObject] = useState({});
  const [actionsDisabled, setActionsDisabled] = useState(false);
  const [betNo, setBetNo] = useState(""); // null -> infinity, number -> limited
  const [onLoss, setOnLoss] = useState(0); // null -> reset, number -> increase %
  const [onWin, setOnWin] = useState(0); // null -> reset, number -> increase %
  const [cashOutType, setCashOutType] = useState(1);
  const [chartData, setChartData] = useState([]);
  const [chartElapsed, setChartElapsed] = useState(Array.from(Array(240).keys()));
  const [suggestedMax, setSuggestedMax] = useState(3);
  const [xMax, setXMax] = useState(220);
  const [angle, setAngle] = useState(0);
  const [frame, setFrame] = useState(0);
  const [prevBet, setPrevBet] = useState(null);
  const [nbet, setNbet] = useState(0);

  function resetChart() {
    setChartData([]);
    setChartElapsed(Array.from(Array(240).keys()));
    setSuggestedMax(3);
    setAngle(-2)
  }

  const RocketImage = new Image()
  RocketImage.src = "/images/new_form/rocket.svg"

  const plugins = [
    // {
    //   afterUpdate: function (canvas) {
    //     console.log(canvas)
    //   }
    // }
  ]

  const labels = chartElapsed;
  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First Dataset",
        data: chartData,
        fill: false,
        borderColor: gameStatus === "crashed" ? "#F87171" : "#686F78",
        borderDash: [10, 5],
        pointStyle: chartData.slice(0, -1).map(el => false).concat(RocketImage),
        rotation: angle
      },
    ],
  };

  const options = {
    scales: {
      y: {
        position: "right",
        max: suggestedMax,
        min: 1,
        ticks: {
          color: (val) => {
            if (multiplier) {
              let y = parseFloat(multiplier.replace("x", ""));
              if (val.tick.value <= y) {
                return "#fff";
              }
            }
            return "#666";
          },
        },
      },
      x: {
        display: true,
        min: 0,
      },
    },
    animation: {
      duration: 0,
    },
    numbers: {
      properties: ["x", "y"],
    },
    elements: {
      point: {
        // pointStyle: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: false,
  };
  let i = 0;
  let initChart = ({x, y}) => {
    resetChart()
    let elapsed = x * 1000
    let data = []
    let labels = Array.from(Array(240).keys())
    for (let i = 0; i < elapsed; i += 50) {
      data.push(calcY(i))
      
      if (i > 10663) {
        labels.push(labels.length)
      }
    }

    setChartData(data);
    setChartElapsed(labels)
    setMultiplier(`${parseFloat(y).toFixed(2)}x`);
  }

  let calcY = (ms) => {
    // return (Math.E ** (0.065 * x)).toFixed(2);
    var r = 0.000065;
    return Math.pow(Math.E, r * ms);
  };

  let calcAngle = (ms) => {
    var r = 0.000065;
    var y = r * Math.pow(Math.E, r * ms);
    return Math.atan(y) * (180 / Math.PI);
  };

  let crashdata = [];
  let preAngle = 0;
  let elapsed = 0;
  function tick(start) {
    let elapsed = Date.now() - start;
    let y = calcY(elapsed);
    elapsed += 100;
    let prevy1 = crashdata[crashdata.length - 3];
    let prevy2 = crashdata[crashdata.length - 4];
    crashdata.push(y);
    let angle = Math.atan((prevy1 - prevy2) * crashCanvas.canvas.height / 2.0 / crashCanvas.canvas.width * 240.0) * 180 / Math.PI;

    if (angle < preAngle) {
      angle = preAngle;
    }
    // else {
    //   preAngle = angle;
    // }
    preAngle = angle;
    setAngle(30-angle);//-angle);
    let label = y.toFixed(2) + "x";
    crashCanvas.statusLabel = label;
    crashCanvas.elapsed = elapsed;
    let tick = Math.floor(elapsed / 50);
    setMultiplier(label);
    setChartData((d) => d.concat(y));

    setChartElapsed((el) => {
      let n = [...el];
      if (elapsed > 10663) {
        // n.splice(n.length - 20, 0, n.length);
        n.push(el.length)
      }
      return n;
    });
    setSuggestedMax(y * 1.1 >= 3 ? y * 1.1 : 3);
  }

  function updateCrashPlayers(playersObject) {
    setCrashPlayersObject(playersObject);
    let arr = Object.entries(playersObject).map(([id, player]) => ({ id, ...player }));
    let sorted = arr.sort((a, b) => {
      if (a.cashedOut && b.cashedOut) {
        return b.cashedOut - a.cashedOut;
      }

      if (a.cashedOut) {
        return -1;
      }

      if (b.cashedOut) {
        return 1;
      }

      return b.amount - a.amount;
    });
    setCrashPlayers(sorted);
  }

  useEffect(() => {
    (async () => {
      try {
        const rocketImage = await loadImage("/images/new_form/rocket.svg");
        const fireRocketImage = await loadImage("/images/new_form/fire-rocket.png");

        if (mobile) {
          rocketImage.width = rocketImage.width / 1.5;
          rocketImage.height = rocketImage.height / 1.5;
        }

        fireRocketImage.width = mobile ? 29.67 / 1.5 : 29.67;
        fireRocketImage.height = mobile ? 51.35 / 1.5 : 51.35;

        crashCanvas.rocketImage = rocketImage;
        crashCanvas.fireRocket = fireRocketImage;
        crashCanvas.loaded = true;
        crashCanvas.init(!!mobile);
      } catch (e) {
        toast.error("Error loading Crash images");
      }
    })();

    return () => {
      crashCanvas.cleanup();
    };
  }, [sidebarHidden, mobile]);

  // connect to websocket for crash and listen to events
  useEffect(() => {
    let runTick;
    let timeleft = 0;
    let status = "ready";

    let countdownInterval = setInterval(() => {
      if (timeleft > 0) {
        timeleft -= 250;
        crashCanvas.statusLabel = `${Math.ceil(timeleft / 1000)}s`;
      }
    }, 250);

    socket.emit("crashConnected");
    socket.on("crashConnect", (event) => {
      setHistory(event?.history || []);
      updateCrashPlayers(event?.bets || {});
      console.log("CrashPlayers: " + event.bets);
    });

    socket.on("crashHistory", (e) => {
      setHistory(e);
    });

    socket.on("crashGraph", ({ x, y }) => {
      if (crashCanvas.canvas) {
        crashCanvas.active = true;
        crashCanvas.status = "active";
        // crashCanvas.rocketY = crashCanvas.canvas.height - 30 - y
        // crashCanvas.rocketX = x
      }

      if (status !== "active") {
        crashdata = [];
        initChart({x, y})
        status = "active";
        let start = Date.now() - Math.floor(x * 1000);
        setMultiplier(y.toFixed(2) + "x");
        if (runTick) clearInterval(runTick) // make sure we don't have 2 intervals
        runTick = setInterval(tick, 50, start);
      }

      setGameStatus("active");
      timeleft = 0;
    });

    socket.on("crashCrashed", ({ x, y }) => {
      let multiplier = y.toFixed(2) + "x";

      if (runTick) clearInterval(runTick);
      if (crashCanvas.canvas) {
        crashCanvas.active = false;
        crashCanvas.statusLabel = multiplier;
        crashCanvas.status = "crashed";
      }

      setMultiplier(multiplier);
      setGameStatus("crashed");
      timeleft = 0;
    });

    socket.on("crashCounter", (e) => {
      if (status !== "ready") {
        updateCrashPlayers({}); // reset all players
        resetChart();
      }

      crashCanvas.active = false;
      crashCanvas.rocketX = 0;
      crashCanvas.rocketY = crashCanvas.canvas.height - 30;
      status = "ready";
      crashCanvas.status = status;
      setGameStatus(status);
      setMultiplier(null);
      timeleft = e.counter * 1000;
    });

    socket.on("crashPlayers", (e) => {
      updateCrashPlayers(e);
    });

    return () => {
      socket.off("crashConnect");
      socket.off("crashHistory");
      socket.off("crashGraph");
      socket.off("crashCrashed");
      socket.off("crashCounter");
      socket.off("crashPlayers");
      if (runTick) clearInterval(runTick);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, []);

  useEffect(() => {
    setActionsDisabled(["crashed"].includes(gameStatus) || (gameStatus === "active" && (!crashPlayersObject[profile?.id.toString()] || crashPlayersObject[profile?.id.toString()].cashedOut !== false)));
  }, [gameStatus, crashPlayersObject]);

  socket.on("betinfo", (e) => {
    setBetInput(Math.floor(e.amount));
    if(e.betnum != -10)
      setNbet(e.betnum);
    if(e.betnum == 0)
      setAutoRunning(false);
  });

  socket.on("finished", (e) => {
      setAutoRunning(false);
  });

  useEffect(() => {
    let betAmount = betInput;    
    //placedBet = true;
    // if (gameStatus === 'crashed' && placedBet) {
    //   let betInfo = crashPlayersObject[profile?.id?.toString()]
    //   console.log(betInfo)
    // }

    //   let betInfo = crashPlayersObject
    //   console.log("betInfo length: " + betInfo.length);
    //   if (betInfo.length > 0 && gameStatus === 'crashed') {
    //     let won = !!betInfo[0].cashedout
    //     console.log("won: " + won);

    //     if (won) {
    //       if (onWin) {
    //         setPrevBet(betInfo.amount * parseFloat(onWin) / 100)
    //       } else {
    //         setPrevBet(betAmount)
    //       }
    //     } else {
    //       if (onLoss) {
    //         setPrevBet(betInfo.amount * parseFloat(onLoss) / 100)
    //       } else {
    //         setPrevBet(betAmount)
    //       }
    //     }
    // }
    
    console.log(autoRunning, gameStatus, crashPlayersObject, multiplier, aco)
    if (gameStatus !== 'ready' || !autoRunning || !multiplier) return
    console.log("OK");
    console.log("betamount: " + betAmount + " aco: " + aco + " betnum: " + nbet);
    socket.emit("crashPlaceBet", 
    { amount: betAmount, autocashout: aco, betnum: nbet,
      resetloss: isResetLoss, resetwin: isResetWin,  win: onWin, loss: onLoss});
  }, [
    autoRunning, 
    gameStatus, 
    // crashPlayersObject,
    // multiplier,
    // aco,
    // nbet,
    // prevBet, 
    // onLoss,
    // onWin
  ])

  function handleAOCFocus() {}

  function handleAOCBlur() {}

  function handleACOChange(c) {
    let val = c.target.value;
    setAco(val);
  }
  function handleNBETChange(c) {
    let val = c.target.value;
    setNbet(val);
  }
  function handlePlaceBet() {
    if (actionsDisabled) return;

    if (gameStatus === "active") {
      // cash out
      socket.emit("crashCashout");
      return;
    }

    // place bet
    let betAmount = betInput;
    if (isNaN(betAmount)) return; // TODO: maybe show error
    socket.emit("crashPlaceBet", { amount: betAmount, autocashout: cashOutType && (aco || false) });
  }

  function handleChangeIncreaseLoss(e) {
    setOnLoss(e.target.value);
  }

  function handleChangeIncreaseWin(e) {
    setOnWin(e.target.value);
  }

  function handlePlaceAuto() {
    setAutoRunning(!autoRunning);
  }

  function handleChangeAmount(e) {
    setBetInput(e.target.value);
  }
  return (
    <div id="crash-game" className={mobile ? "mobile" : ""}>
      {prevBet}
      <div className={"main-container-crash" + (sidebarHidden ? " sidebarhidden" : "")}>
        <div className="crash-details">
          <div className="buttons-header">
            <div className={"button" + (!isAuto ? " active" : "")} onClick={() => setAuto(false)}>
              Manual
            </div>
            <div className={"button" + (isAuto ? " active" : "")} onClick={() => setAuto(true)}>
              Auto
            </div>
          </div>
          <div className="content">
            {isAuto ? (
              <>
                <div className="form-input">
                  <div className="label-input">Bet Amount</div>
                  <div className="input">
                    <img draggable="false" src="/images/diamond.svg" alt="" />
                    <input type="number" placeholder="10.00" value={betInput}  onChange={handleChangeAmount}/>
                    <div className="calc-buttons">
                      <div
                        className="button"
                        onClick={() => {
                          // betInput && (betInput = Math.max(parseFloat(betInput) / 2, 1));
                        }}
                      >
                        1/2
                      </div>
                      <div
                        className="button"
                        onClick={() => {
                          // betInput && (betInput = parseFloat(betInput) * 2);
                        }}
                      >
                        2x
                      </div>
                      <div
                        className="button"
                        onClick={() => {
                          // console.log(profile);
                          // betInput && (betInput = profile?.balance || 0);
                        }}
                      >
                        Max
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-input multi">
                  <div className="form">
                    <div className="label-input">Auto Cashout</div>
                    <div className="input">
                      <input type="number" onChange={handleACOChange} onFocus={handleAOCFocus} onBlur={handleAOCBlur} value={aco} placeholder="2.00x" />
                    </div>
                  </div>
                  <div className="form">
                    <div className="label-input">Number of Bets</div>

                    <div className="input sp-t">
                      <input type="number" onChange={handleNBETChange} value={nbet}  placeholder="0" />
                      <img draggable="false" src="/images/new_form/infinity.svg" alt="" />
                    </div>
                  </div>
                </div>

                <div className="form-input">
                  <div className="label-input">On Loss</div>

                  <div className="input sp-t">
                    <div className="increase-buttons">
                      <div className={"button" + (isResetLoss ? " active" : "")} onClick={() => setResetLoss(true)}>
                        Reset
                      </div>
                      <div className={"button" + (!isResetLoss ? " active" : "")} onClick={() => setResetLoss(false)}>
                        Increase by
                      </div>
                    </div>
                    <div className="content-inside">
                      <input type="number" placeholder="0" className="increase" value={onLoss} onChange={handleChangeIncreaseLoss} />
                      <span style={{ color: 'gray' }}>x</span>
                    </div>
                  </div>
                </div>
 
                <div className="form-input">
                  <div className="label-input">On Win</div>

                  <div className="input sp-t">
                    <div className="increase-buttons">
                      <div className={"button" + (isResetWin ? " active" : "")} onClick={() => setResetWin(true)}>
                        Reset
                      </div>
                      <div className={"button" + (!isResetWin ? " active" : "")} onClick={() => setResetWin(false)}>
                        Increase by
                      </div>
                    </div>
                    <div className="content-inside">
                      <input type="number" placeholder="0" className="increase" value={onWin} onChange={handleChangeIncreaseWin} />
                      <span style={{ color: 'gray' }}>x</span>
                    </div>
                  </div>
                </div>
                <div className="button-bet" onClick={handlePlaceAuto} disabled={false}>
                  {autoRunning ? "Stop Auto" : "Start Auto"}
                </div>
              </>
            ) : (
              <>
                <div className="form-input">
                  <div className="label-input">Bet Amount</div>
                  <div className="input">
                    <img draggable="false" src="/images/diamond.svg" alt="" />
                    <input type="number" placeholder="10.00" value={betInput} onChange={handleChangeAmount} />
                    <div className="calc-buttons">
                      <div
                        className="button"
                        onClick={() => {
                          // betInput && (betInput = Math.max(parseFloat(betInput) / 2, 1));
                        }}
                      >
                        1/2
                      </div>
                      <div
                        className="button"
                        onClick={() => {
                          // betInput && (betInput = parseFloat(betInput) * 2);
                        }}
                      >
                        2x
                      </div>
                      <div
                        className="button"
                        onClick={() => {
                          // betInput && (betInput = profile?.balance || 0);
                        }}
                      >
                        Max
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-input">
                  <div className="label-input">Auto Cashout</div>
                  <div className="input sp-t">
                    <input type="number" onChange={handleACOChange} onFocus={handleAOCFocus} onBlur={handleAOCBlur} placeholder="2.00x" />
                    <div className="calc-buttons">
                      {["Off", "Custom"].map((item, index) => (
                        <div onClick={() => setCashOutType(index)} className={"button" + (index === cashOutType ? " active" : "")} key={index}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* <div className="form-input">
                  <div className="label-input">Profit on Win</div>
                  <div className="input sp-t">
                    <input type="number" disabled placeholder="10.00" />
                    <img draggable="false" src="/images/diamond.svg" alt="" />
                  </div>
                </div> */}
                <div className="button-bet" disabled={actionsDisabled} onClick={handlePlaceBet}>
                  {gameStatus === "ready" ? "Place Bet" : gameStatus === "crashed" ? `Crashed ${multiplier}` : `Cash Out ${multiplier}`}
                </div>
              </>
            )}
            <div className="hr"></div>
            <Players players={crashPlayers} />
            <div className="fade-shadow"></div>
          </div>
        </div>
        <div className="crash-canvas-screen">
          <div className="graph">
            <div className="bg" style={{ backgroundImage: "url(/images/new_form/crash-bg.svg)" }}></div>
            <canvas id="crash-canvas"></canvas>
            <Line className="canvas-overlay" data={data} options={options} plugins={plugins} style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="previous-games">
            <div className="title-br">
              <div className="title">Previous Games</div>
              <div className="right">
                <img draggable="false" src="/images/new_form/history.svg" alt="" />
                <span>History</span>
              </div>
            </div>
            <div className="small-cards">
              {history.map((roll) => (
                <div key={roll.info.fairRound.hash} className="card">
                  {roll.coords.y.toFixed(2)}x
                </div>
              ))}
              {/*
                TODO: IMPLEMENT NEG-POS CARDS
              <div className="card pos">2.76x</div>
              <div className="card neg">9.26x</div>
              <div className="card">4.79x</div>
              <div className="card warn">1.36x</div> */}
            </div>
          </div>
        </div>
      </div>
      <Activities width="90%" />
    </div>
  );
};

export default Crash;
