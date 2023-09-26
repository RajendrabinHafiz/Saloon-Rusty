/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BetAmount from "../../BetAmount";
import WinBetDisplay from "../../WinBetDisplay";
import Bars from "./Bars";
import Last100 from "./Last100";
import SpinnerFT from "./Spinner";
import { socket } from "../../../Socket";
import Loader from "../../Loader";

import {
  WOFCounter,
  countDown,
  setWinningColor,
  setPlayers,
  WOFHistory,
  WOFConnect,
  setSpinnerActive,
  setRemainingTime,
  setOffsetX,
  setLOGR,
  setDist,
  setViAndTF,
  setStartTime,
  setSpinning,
} from "../../../redux/ducks/wof";
import { store } from "../../../redux/store";

const FiftyTimes = (props) => {
  const dispatch = useDispatch();
  const ref = useRef();

  const GAME_TIMER_INTERVAL = Number(
    useSelector((state) => state.wof.GAME_TIMER_INTERVAL),
  );
  const { mobile } = useSelector((state) => state.main);
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

      if (roundId != currentRoundId) return;

      if (t < maxTf) {
        requestAnimationFrame(() => {
          update(currentRoundId, color);
        });
      } else {
        dispatch(setWinningColor({ color }));
      }
    } catch (err) {}
  }

  useEffect(() => {
    document.title = "RustySaloon | 50x";

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
      /*
      if (!document.getElementById('FT__spinner-img')) return;
      document.getElementById('FT__spinner-img').style.transform = `rotate(-${2 + 360 * 4 + (((data.fairRound.ticket - 1) / 54) * 360)}deg)`;
      document.getElementById('FT__spinner-img').style.transition = `transform 4500ms cubic-bezier(0, 0, 0.28, 1) 0s`;
      setTimeout(() => {
        dispatch(setWinningColor(data));
      }, 4500);
      */
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

  return (
    <React.Fragment>
      <div
        id={mobile ? "ft-mobile" : "desktop-ft"}
        className={"FT bef " + (!connected ? "blurred" : "noblur")}
      >
        <SpinnerFT
          spinnerActive={spinnerActive}
          counter={counter}
          remainingTime={remainingTime}
        />

        <div className="FT__top">
          <Last100 lastBets={lastBets} />
          <Bars history={history} />
          <BetAmount ref={ref} handler={null} userBalance={userBalance} />
        </div>

        <div className="win-bet-container">
          <WinBetDisplay
            color="red"
            multiplier={Number(2)}
            players={players ? players.red : undefined}
            winningColor={winningColor}
            totalAmount={total.red}
            projected={projected.red}
            onClick={() => {
              socket.emit("WOFPlacebet", {
                color: "red",
                amount: parseFloat(ref.current.value) * 100,
              });
            }}
            done={done}
          />
          <WinBetDisplay
            color="black"
            multiplier={Number(3)}
            players={players ? players.black : undefined}
            winningColor={winningColor}
            totalAmount={total.black}
            projected={projected.black}
            onClick={() => {
              socket.emit("WOFPlacebet", {
                color: "black",
                amount: parseFloat(ref.current.value) * 100,
              });
            }}
            done={done}
          />
          <WinBetDisplay
            color="green"
            multiplier={Number(5)}
            players={players ? players.green : undefined}
            winningColor={winningColor}
            totalAmount={total.green}
            projected={projected.green}
            onClick={() => {
              socket.emit("WOFPlacebet", {
                color: "green",
                amount: parseFloat(ref.current.value) * 100,
              });
            }}
            done={done}
          />

          <WinBetDisplay
            color="yellow"
            multiplier={Number(50)}
            players={players ? players.yellow : undefined}
            winningColor={winningColor}
            totalAmount={total.yellow}
            projected={projected.yellow}
            onClick={() => {
              socket.emit("WOFPlacebet", {
                color: "yellow",
                amount: parseFloat(ref.current.value) * 100,
              });
            }}
            done={done}
          />
        </div>
      </div>
      {!connected && (
        <div class="loaderpos">
          <Loader />
        </div>
      )}
    </React.Fragment>
  );
};

export default FiftyTimes;
