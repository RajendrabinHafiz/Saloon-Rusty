import React, { useEffect, useState, Fragment } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDist,
  setLOGR,
  setOffsetX,
  setPlayers,
  setRemainingTime,
  setSpinnerActive,
  setSpinning,
  setStartTime,
  setViAndTF,
  setWinningColor,
  updateConstantsWof,
  WOFConnect,
  WOFCounter,
  WOFHistory,
} from "../../../redux/ducks/wof";
import { store } from "../../../redux/store";
import { socket } from "../../../Socket";
import { audio_handler } from "../../../utils/audio_handler";
import { FairnessPanel } from "../../FairnessPanel";
import Footer from "../../Footer";
import Activities from "../../homepage/Activities";
import BettingBar from "../roulette/BettingBar";
import TotalBets from "../roulette/TotalBets";
import { BetSectionContainer } from "./BetSectionContainer";
import { spinWof, updateLastBetsWof } from "./game_actions";

var lastSpinMov = 0;

export const Wof = () => {
  const dispatch = useDispatch();
  const wofRef = useRef(null);
  const betInput = useRef(null);
  const tickerRef = useRef(null);
  const [smallScreen, setSmallScreen] = useState(false);
  const [MXTF, setMXTF] = useState(0);
  const { cards, beted, loaded, muted, animation, r_connect } = useSelector(
    (state) => state.wof,
  );
  const [fairnessPanel, setFairnessPanel] = useState(false);

  const ref = useRef();
  const updateConstant = (type, data) => {
    dispatch(updateConstantsWof({ [type]: data }));
  };
  const GAME_TIMER_INTERVAL = Number(
    useSelector((state) => state.wof.GAME_TIMER_INTERVAL),
  );
  const { mobile, containerWidth } = useSelector((state) => state.main);
  const remainingTime = Number(useSelector((state) => state.wof.remainingTime));
  let timerStartedAt = new Date().getTime();

  const projected = useSelector((state) => state.wof.projected);
  const total = useSelector((state) => state.wof.betTotals);
  const players = useSelector((state) => state.wof.players);
  const done = useSelector((state) => state.wof.winningColor);
  const counter = useSelector((state) => state.wof.counter);
  const lastBets = useSelector((state) => state.wof.lastBets);
  const history = useSelector((state) => state.wof.history);
  const spinnerActive = useSelector((state) => state.wof.spinnerActive);
  const winningColor = useSelector((state) => state.wof.winningColor);
  const userBalance = useSelector((state) => state.profile.balance);

  var rConnected = false;
  const [connected, setConnected] = useState(false);

  var counterInterval = "";

  function d_mod(vi, t) {
    const animation = store.getState().wof.animation;
    return (vi * (Math.pow(animation.R, t) - 1)) / animation.LOGR;
  }

  function getTf(vi) {
    const animation = store.getState().wof.animation;
    return (Math.log(animation.S) - Math.log(vi)) / animation.LOGR;
  }

  function getVi(df) {
    const animation = store.getState().wof.animation;
    return animation.S - df * animation.LOGR;
  }

  function calculateDist(ticket) {
    const animation = store.getState().wof.animation;
    const LOGR = Math.log(animation.R);
    dispatch(setLOGR(LOGR));
    const dist = 2 + 360 * 4 + ((ticket - 1) / 54) * 360;
    dispatch(setDist(dist));
  }

  function spin(ticket, color, startTime) {
    calculateDist(ticket);

    const roundId = store.getState().wof.id;
    const animation = store.getState().wof.animation;

    const vi = getVi(animation.dist);
    const tf = getTf(vi);

    dispatch(setViAndTF({ vi, tf }));

    startTime = startTime ? startTime : Date.now();

    dispatch(setStartTime(startTime));

    dispatch(setSpinning(true));
    update(roundId, color);
  }

  function update(currentRoundId, color) {
    try {
      const roundId = store.getState().wof.id;
      const animation = store.getState().wof.animation;

      let t = Date.now() - animation.startTime;

      if (t > animation.tf) {
        t = animation.tf;
      }

      const deg = d_mod(animation.vi, t);

      dispatch(setOffsetX(deg));

      let maxTf = -1;
      maxTf = Math.max(maxTf, animation.tf);

      if (roundId !== currentRoundId) return;

      setMXTF(maxTf / t);

      if (t < maxTf) {
        requestAnimationFrame(() => {
          update(currentRoundId, color);
        });
      } else {
        setMXTF(0);

        dispatch(setWinningColor({ color }));
      }
    } catch (err) {}
  }

  useEffect(() => {
    let intervalWidth = setInterval(() => {
      let el = document.querySelector("#wof-game .game-container");
      if (el) {
        let width = el.getBoundingClientRect().width;
        if (width <= 871 && !smallScreen) {
          setSmallScreen(true);
        } else if (smallScreen && width > 871) {
          setSmallScreen(false);
        }
      }
    }, 16);

    return () => {
      clearInterval(intervalWidth);
    };
  }, [smallScreen]);

  useEffect(() => {
    document.title = "RustySaloon | 50x";

    (async () => {
      const loadAudios = await audio_handler.loadSounds(["flip", "deal"]);
      if (loadAudios) {
        updateConstant("loaded", true);
      }
    })();

    let timerInterval = setInterval(() => {
      if (!rConnected) return;
      const wof = store.getState().wof;
      const now = new Date().getTime();
      let newRemainingTime = GAME_TIMER_INTERVAL - (now - timerStartedAt);
      if (wof.spinning) newRemainingTime = 0;
      dispatch(setRemainingTime(newRemainingTime));
    }, 50);

    socket.on("WOFCounter", (data) => {
      let diff = Math.abs(data.remainingTime - remainingTime);
      if (diff > 1000)
        timerStartedAt =
          new Date().getTime() - (GAME_TIMER_INTERVAL - data.remainingTime);

      dispatch(WOFCounter(data));
      //dispatch(WOFHistory(data.history));
    });

    /*
    socket.on("WOFCounter", (data) => {

      clearInterval(counterInterval);

      dispatch(WOFCounter(data));

      counterInterval = setInterval(() => {
        dispatch(countDown());
      }, 10);

      dispatch(WOFHistory(data.history));
    })
    */

    socket.on("WOFSpin", (data) => {
      try {
        dispatch(setSpinnerActive());
        if (!document.getElementById("FT__spinner-img")) return;
        document.getElementById(
          "FT__spinner-img",
        ).style.transition = `transform 0ms cubic-bezier(0, 0, 0.28, 1) 0s`;
        spin(data.fairRound.ticket, data.color);
      } catch (err) {}
    });
    socket.on("WOFStart", (data) => {
      dispatch(setSpinning(false));
      timerStartedAt = new Date().getTime();
      dispatch(setRemainingTime(data.remainingTime));
    });
    socket.on("WOFPlayers", (players) => {
      dispatch(setPlayers(players));
    });
    socket.on("WOFHistory", (history, fairRound) => {
      dispatch(WOFHistory(history));
      if (!document.getElementById("FT__spinner-img")) return;
      setTickerMov(false);
      document.getElementById("FT__spinner-img").style.transform = `rotate(-${
        2 + ((fairRound.ticket - 1) / 54) * 360
      }deg)`;
      document.getElementById(
        "FT__spinner-img",
      ).style.transition = `transform 0ms cubic-bezier(0, 0, 0.28, 1) 0s`;
    });

    socket.emit("WOFConnect");

    socket.on("WOFConnect", (data) => {
      dispatch(WOFConnect(data));
      timerStartedAt = new Date().getTime();

      if (data.end) {
        document.getElementById("FT__spinner-img").style.transform = `rotate(-${
          2 + 360 * 4 + ((data.fairRound.ticket - 1) / 54) * 360
        }deg)`;
        document.getElementById(
          "FT__spinner-img",
        ).style.transition = `transform ${
          data.end - Date.now()
        }ms cubic-bezier(0, 0, 0.28, 1) 0s`;

        setTimeout(() => {
          dispatch(setWinningColor(data));
        }, data.end - Date.now());
      }

      dispatch(WOFHistory(data.history));
      dispatch(setRemainingTime(data.remainingTime));
      rConnected = true;
      setConnected(true);
    });

    return function cleanup() {
      clearInterval(timerInterval);
      socket.off("WOFConnect");
      socket.off("WOFHistory");
      socket.off("WOFPlayers");
      socket.off("WOFStart");
      socket.off("WOFSpin");
      socket.off("WOFCounter");
      // Anything in here is fired on component unmount.
    };
  }, []);

  useEffect(() => {
    if (spinnerActive) {
      setTickerMov(true);
    } else {
      setTickerMov(false);
    }
  }, [spinnerActive]);

  const setTickerMov = (tmv) => {
    if (!tickerRef.current) return;
    if (tmv) {
      tickerRef.current.style.transform = `translateX(-50%) rotate(20deg)`;
    } else {
      tickerRef.current.style.transform = `translateX(-50%) rotate(0deg)`;
    }
  };

  const getRightIcon = (color) => {
    switch (color) {
      case "red":
        return "red-icon.svg";
      case "green":
        return "green-icon.svg";
      case "yellow":
        return "wild-icon.svg";
      case "blue":
      case "black":
        return "black-icon.svg";
      default:
        return null;
    }
  };

  return (
    <div className="page-content">
      <FairnessPanel
        active={fairnessPanel}
        roundId="6b5c1-29371-fa925-71a9b-b6a0b"
        clientSeed={"gm1e5H6I3t"}
        id="fairness-panel"
        serverSeed={
          "6b5c129371fa92571a9b6a0b48489b96d0ba85589ead4a6f6c61cf0b88613d41"
        }
        onClose={() => setFairnessPanel(false)}
      />
      <div
        id="wof-game"
        className={mobile || containerWidth < 900 ? " mobile" : ""}
      >
        <div className="game-container">
          {loaded ? (
            <div className="line-container">
              <div className="game-content-inside ntpd">
                <div className="wheel-content">
                  <div className="last-rolls">
                    {!smallScreen ? (
                      <div className="label">Last 100</div>
                    ) : null}

                    <div className="rolls-cards">
                      <div className="roll-card">
                        <div className="circle-card black">
                          <img
                            className="roll-circle--img"
                            src={
                              process.env.PUBLIC_URL +
                              "/images/" +
                              getRightIcon("black")
                            }
                            alt=""
                          />
                        </div>
                        <span>{lastBets.black ?? 0x0}</span>
                      </div>

                      <div className="roll-card">
                        <div className="circle-card red">
                          <img
                            className="roll-circle--img"
                            src={
                              process.env.PUBLIC_URL +
                              "/images/" +
                              getRightIcon("red")
                            }
                            alt=""
                          />
                        </div>
                        <span>{lastBets.red ?? 0x0}</span>
                      </div>

                      <div className="roll-card">
                        <div className="circle-card green">
                          <img
                            className="roll-circle--img"
                            src={
                              process.env.PUBLIC_URL +
                              "/images/" +
                              getRightIcon("green")
                            }
                            alt=""
                          />
                        </div>
                        <span>{lastBets.green ?? 0x0}</span>
                      </div>

                      <div className="roll-card">
                        <div className="circle-card yellow">
                          <img
                            className="roll-circle--img"
                            src={
                              process.env.PUBLIC_URL +
                              "/images/" +
                              getRightIcon("yellow")
                            }
                            alt=""
                          />
                        </div>
                        <span>{lastBets.yellow ?? 0x0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="previous-rolls">
                    {!smallScreen ? (
                      <div className="label">Previous rolls</div>
                    ) : null}
                    <div className="previous-rolls-circles">
                      {history
                        ? history.slice(0, 10).map((item, index) => (
                            <div
                              className={
                                "circle-card " +
                                (item.fairRound.color ?? "black")
                              }
                              key={index}
                            >
                              <img
                                className="roll-circle--img"
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/" +
                                  getRightIcon(item.fairRound.color)
                                }
                                alt=""
                              />
                            </div>
                          ))
                        : null}
                    </div>
                  </div>

                  <div className="content-game-center-align">
                    <div className="wheel-circle-content">
                      <div className="selector" ref={tickerRef}>
                        <img src="/images/wheel-spin-select.svg" alt="" />
                      </div>
                      <img
                        className="wheel-circle"
                        id="FT__spinner-img"
                        src="/images/spin-wheel.svg"
                        ref={wofRef}
                        style={{
                          transform: "rotate(-" + animation.offsetX + "deg)",
                        }}
                        alt=""
                      />
                      <div className="center-content-wheel">
                        <span>
                          {remainingTime <= 0
                            ? "Spinning"
                            : `${(remainingTime / 1000).toFixed(1)}s`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <BettingBar bal={0x0} ref={betInput} userBalance={0x0} />

                  <TotalBets
                    players={players}
                    total={total}
                    projected={projected}
                    ref={betInput}
                    done={done}
                    emitPacket={"WOFPlacebet"}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div id="loader">
              <div className="looper"></div>
            </div>
          )}
        </div>

        <Activities />
      </div>
      <Footer />
    </div>
  );
};

export default Wof;
