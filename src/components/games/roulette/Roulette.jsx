import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BettingBar from "./BettingBar";
import Last100Rolls from "./Last100Rolls";
import PreviousRolls from "./PreviousRolls";
import ProgressBar from "./ProgressBar";
import Spinner from "./Spinner";
import TotalBets from "./TotalBets";
import TotalBetsMobile from "../../mobile/roulette/TotalBets";
import Loader from "../../Loader";

import { socket } from "../../../Socket";
import {
  rouletteTimer,
  countDown,
  rouletteConnect,
  setRemainingTime,
  reset,
  roulettePlayers,
  roulettePlaceBetRes,
  rouletteDone,
  setSpinnerTotalWidth,
  setSpinnerViewWidth,
  setOffsetX,
  setLOGR,
  setDist,
  setViAndTF,
  setStartTime,
  setSpinning,
} from "../../../redux/ducks/roulette";
import { store } from "../../../redux/store";

const Roulette = (props) => {
  const dispatch = useDispatch();
  const ref = useRef();

  const counter = Number(useSelector((state) => state.roulette.counter));

  const ROULETTE_TIMER_INTERVAL = Number(
    useSelector((state) => state.roulette.ROULETTE_TIMER_INTERVAL),
  );

  const remainingTime = Number(
    useSelector((state) => state.roulette.remainingTime),
  );
  const rouletteNumbers = useSelector((state) => state.roulette.numbers);
  const { mobile } = useSelector((state) => state.main);
  const spinnerActive = useSelector((state) => state.roulette.spinnerActive);
  const lastBets = useSelector((state) => state.roulette.lastBets);
  const history = useSelector((state) => state.roulette.history);
  const projected = useSelector((state) => state.roulette.projected);
  const total = useSelector((state) => state.roulette.total);
  const players = useSelector((state) => state.roulette.players);
  const balance = Number(useSelector((state) => state.roulette.balance));
  const done = useSelector((state) => state.roulette.done);

  const userBalance = useSelector((state) => state.profile.balance);

  var rConnected = false;
  const [connected, setConnected] = useState(false);
  var timerStartedAt = new Date().getTime();
  var counterInterval = "";
  var start = -162;

  const winnerPosition = {
    1: 7,
    14: 6,
    2: 5,
    13: 4,
    3: 3,
    12: 2,
    4: 1,
    0: 0,
    11: -1,
    5: -2,
    10: -3,
    6: -4,
    9: -5,
    7: -6,
    8: -7,
  };

  function getRouletteNumberPos(number) {
    for (let i = 0; i < rouletteNumbers.length; i++) {
      if (rouletteNumbers[i] == number) return i;
    }
  }

  function getScreenSizes() {
    let spinnerEl = document.getElementById("spinner__items");
    const rect = spinnerEl.getBoundingClientRect();
    const SPINNER_VIEW_WIDTH = rect.width;
    const newOffsetX = SPINNER_VIEW_WIDTH * 2;
    dispatch(setSpinnerViewWidth(SPINNER_VIEW_WIDTH));
    dispatch(setOffsetX(newOffsetX));
  }

  function d_mod(vi, t) {
    const animation = store.getState().roulette.animation;
    return (vi * (Math.pow(animation.R, t) - 1)) / animation.LOGR;
  }

  function getTf(vi) {
    const animation = store.getState().roulette.animation;
    return (Math.log(animation.S) - Math.log(vi)) / animation.LOGR;
  }

  function getVi(df) {
    const animation = store.getState().roulette.animation;
    return animation.S - df * animation.LOGR;
  }

  function calculateDist(index, wobble) {
    const animation = store.getState().roulette.animation;
    const LOGR = Math.log(animation.R);
    dispatch(setLOGR(LOGR));

    var max = animation.EL_SIZE / 2 - 10;
    var min = -(animation.EL_SIZE / 2) + 10;
    var w = Math.floor(wobble * (max - min + 1) + min);

    let dist = index * animation.EL_SIZE + w;

    const SPINNER_TOTAL_WIDTH = rouletteNumbers.length * animation.EL_SIZE;
    dispatch(setSpinnerTotalWidth(SPINNER_TOTAL_WIDTH));

    let distMax = 7;
    let distMin = 5;
    let rndDist = Math.round(wobble * (distMax - distMin + 1) + distMin);
    dist += SPINNER_TOTAL_WIDTH * rndDist;
    dispatch(setDist(dist));

    //.animation.distWithoutWobble = animation.dist - w;
  }

  function spin(roll, wobble, startTime) {
    const index = getRouletteNumberPos(roll);
    calculateDist(index, wobble);
    const roundId = store.getState().roulette.id;
    const animation = store.getState().roulette.animation;

    const vi = getVi(animation.dist);
    const tf = getTf(vi);
    dispatch(setViAndTF({ vi, tf }));

    startTime = startTime ? startTime : Date.now();
    dispatch(setStartTime(startTime));

    dispatch(setSpinning(true));
    update(roundId);
  }

  function update(currentRoundId) {
    try {
      getScreenSizes();
      const roundId = store.getState().roulette.id;
      const animation = store.getState().roulette.animation;

      let t = Date.now() - animation.startTime;
      if (t > animation.tf) {
        t = animation.tf;
      }

      const deg = d_mod(animation.vi, t);
      dispatch(setOffsetX(deg));

      let maxTf = -1;
      maxTf = Math.max(maxTf, animation.tf);

      /* For page freezing problem */

      if (roundId != currentRoundId) {
        return;
      }

      if (t < maxTf) {
        requestAnimationFrame(() => {
          update(currentRoundId);
        });
      } else {
      }
    } catch (err) {}
  }

  /* DEPRECATED */
  /*
  function spin(winningNumber, indicator, direct) {
    try {
      let spinnerEl = document.getElementById("spinner__items");
      if (!spinnerEl) return;

      const rectWidth = 95;
      const numPos = getRouletteNumberPos(winningNumber);
      const spinnerAreaWidth = rectWidth * 15;
      let translateX = -(spinnerAreaWidth) + (spinnerEl.getBoundingClientRect().width / 2) - (rectWidth / 2);
      translateX -= (numPos * rectWidth);
      translateX -= (indicator - 0.5) * (rectWidth / 2);
      if (!direct) translateX -= (spinnerAreaWidth * 5);

      spinnerEl.style.transition = direct ? `none` : `transform 8000ms cubic-bezier(0, 0, 0.28, 1) 0s`;
      spinnerEl.style.transform = `translateX(${translateX}px)`;


    } catch (err) { }
  }
  */

  useEffect(() => {
    document.title = "RustySaloon | Roulette";
    let timerInterval = setInterval(() => {
      if (!rConnected) return;
      const animation = store.getState().roulette.animation;

      const now = new Date().getTime();
      let newRemainingTime = ROULETTE_TIMER_INTERVAL - (now - timerStartedAt);
      dispatch(setRemainingTime(newRemainingTime));
    }, 50);
    socket.emit("rouletteConnected");

    /*
    socket.on("rouletteTimer", (data) => {

      
      clearInterval(counterInterval);
      dispatch(rouletteTimer(data));
      counterInterval = setInterval(() => {
        dispatch(countDown());
      }, 10);
    });
    */

    socket.on("rouletteConnect", (data) => {
      dispatch(rouletteConnect(data));
      timerStartedAt =
        new Date().getTime() - (ROULETTE_TIMER_INTERVAL - remainingTime);
      /*
      counterInterval = setInterval(() => {
        dispatch(countDown());
      }, 10);
      */
      if (data.spinnerActive) {
        spin(
          data.fairRound.ticket,
          data.fairRound.indicator,
          data.spinnerActive,
        );
      }
      dispatch(setRemainingTime(data.remainingTime));
      rConnected = true;
      setConnected(true);
    });

    socket.on("rouletteTimer", (data) => {
      let diff = Math.abs(data.remainingTime - remainingTime);
      if (diff > 1000)
        timerStartedAt =
          new Date().getTime() - (ROULETTE_TIMER_INTERVAL - data.remainingTime);
    });

    socket.on("rouletteSpin", (data) => {
      // data.ticket, data.secret, data.hash, data.type, data.indicator
      spin(data.round.ticket, data.round.indicator, Date.now());
    });
    socket.on("rouletteReset", (data) => {
      dispatch(setSpinning(false));
      spin(data.info.ticket, data.info.indicator, true);
      dispatch(reset(data));
    });
    socket.on("rouletteStart", (data) => {
      dispatch(setSpinning(false));
      timerStartedAt = new Date().getTime();
      dispatch(setRemainingTime(data.remainingTime));
    });
    socket.on("roulettePlayers", (players) => {
      dispatch(roulettePlayers(players));
    });
    socket.on("roulettePlaceBetRes", (data) => {
      dispatch(roulettePlaceBetRes(data));
    });
    socket.on("rouletteDone", () => {
      dispatch(rouletteDone());
    });

    return function cleanup() {
      clearInterval(timerInterval);
      socket.off("rouletteDone");
      socket.off("roulettePlaceBetRes");
      socket.off("roulettePlayers");
      socket.off("rouletteStart");
      socket.off("rouletteReset");
      socket.off("rouletteSpin");
      socket.off("rouletteTimer");
      socket.off("rouletteConnect");
      // Anything in here is fired on component unmount.
    };
  }, []);

  return (
    <React.Fragment>
      <div className={"roulette" + (mobile ? " mobile" : "")}>
        <div>{JSON.parse(JSON.stringify(connected))}</div>
        <div className="past-rolls hide-on-mobile">
          <PreviousRolls rolls={history} />
          <Last100Rolls
            red={lastBets.red}
            black={lastBets.black}
            green={lastBets.green}
          />
        </div>
        <h1 className="rolling timer">
          {remainingTime > 0
            ? "Rolling in " + (remainingTime / 1000).toFixed(1) + " seconds"
            : "Spinning"}
        </h1>
        <ProgressBar
          percent={Number(
            remainingTime > 0
              ? (remainingTime / ROULETTE_TIMER_INTERVAL) * 100
              : 0,
          )}
        />
        <Spinner rouletteNumbers={rouletteNumbers} />

        <div className="past-rolls show-on-mobile--flex">
          <Last100Rolls
            red={lastBets.red}
            black={lastBets.black}
            green={lastBets.green}
          />
          <PreviousRolls rolls={history} />
        </div>

        <BettingBar bal={balance} ref={ref} userBalance={userBalance} />

        <div className="past-rolls hide-on-mobile">
          <TotalBets
            players={players}
            total={total}
            projected={projected}
            ref={ref}
            done={done}
          />
        </div>

        <div className="past-rolls show-on-mobile--flex">
          <TotalBetsMobile
            players={players}
            total={total}
            ref={ref}
            done={done}
          />
        </div>
      </div>

      {!connected && (
        <div className="loaderpos">
          <Loader />
        </div>
      )}
    </React.Fragment>
  );
};

export default Roulette;
