import React, { useEffect, useState, Fragment } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../../redux/store";
import { socket } from "../../../Socket";
import { audio_handler } from "../../../utils/audio_handler";
import { FairnessPanel } from "../../FairnessPanel";
import Footer from "../../Footer";
import Activities from "../../homepage/Activities";
import { BetSectionContainer } from "./BetSectionContainer";
import { spinWof, updateLastBetsWof } from "./game_actions";

export const Wof = () => {
  const dispatch = useDispatch();
  const wofRef = useRef(null);
  const betInput = useRef(null);
  const [beting, setBeting] = useState(false);
  const {
    cards,
    beted,
    loaded,
    muted,
    remainingTime,
    connected,
    animation,
    r_connect,
    GAME_TIMER_INTERVAL,
  } = useSelector((state) => state.wof);
  const [fairnessPanel, setFairnessPanel] = useState(false);

  const updateConstant = (type, data) => {
    dispatch({ type: "UPDATE_WOF_STATE", payload: { [type]: data } });
  };
  const updateConstants = (data) => {
    let payload = {};
    for (let key in data) {
      payload[key] = data[key];
    }
    dispatch({ type: "UPDATE_WOF_STATE", payload });
  };

  let timerStartedAt = Date.now();

  useEffect(() => {
    let timerInterval;
    document.title = "RustySaloon ~ 50x";
    (async () => {
      if (!loaded) {
        const loadAudios = await audio_handler.loadSounds(["flip", "deal"]);
        if (loadAudios) {
          updateConstant("loaded", true);
        }
      } else {
        timerInterval = setInterval(() => {
          if (!r_connect) return;
          const wof = store.getState().wof;
          const now = Date.now();
          let newRemainingTime = GAME_TIMER_INTERVAL - (now - timerStartedAt);
          if (wof.spinning) newRemainingTime = 0;
          updateConstant("remainingTime", newRemainingTime);
        }, 50);

        socket.on("WOFCounter", (data) => {
          let diff = Math.abs(data.remainingTime - remainingTime);
          if (diff > 1000)
            timerStartedAt =
              Date.now() - (GAME_TIMER_INTERVAL - data.remainingTime);

          const state = store.getState().wof;
          updateConstants({
            counter: state.counter,
            spinnerActive: false,
            hash: state.hash,
            winningColor: false,
          });
        });

        socket.on("WOFSpin", (data) => {
          try {
            updateConstant("spinnerActive", true);
            wofRef.current &&
              (wofRef.current.style = `transform 0ms cubic-bezier(0, 0, 0.28, 1) 0s`);
            spinWof(data.fairRound.ticket, data.color);
          } catch (err) {
            console.error(err);
          }
        });

        socket.on("WOFStart", (data) => {
          updateConstant("spinning", false);
          timerStartedAt = Date.now();
          updateConstant("remainingTime", data.remainingTime);
        });

        socket.on("WOFPlayers", (players) => {
          const state = store.getState().wof;
          let temp = {
            red: 0,
            black: 0,
            green: 0,
            yellow: 0,
          };
          let projected = {
            red: 0,
            black: 0,
            green: 0,
            yellow: 0,
          };
          for (var color in players) {
            for (var player in players[color]) {
              temp[color] += players[color][player].amount;
              if (player === state.userId) {
                projected[color] +=
                  players[color][player].amount *
                  (color === "red"
                    ? 2
                    : color === "black"
                    ? 3
                    : color === "green"
                    ? 5
                    : 50);
              }
            }
          }

          updateConstants({
            players: players,
            projected: projected,
            betTotals: temp,
          });
        });

        socket.on("WOFHistory", (history, fairRound) => {
          if (history !== null) {
            updateConstants({
              history,
              lastBets: updateLastBetsWof(history),
            });
          }

          if (wofRef.current) {
            wofRef.current.style.transform = `rotate(-${
              2 + ((fairRound.ticket - 1) / 54) * 360
            }deg)`;
            wofRef.current.style.transition = `transform 0ms cubic-bezier(0, 0, 0.28, 1) 0s`;
          }
        });

        socket.emit("WOFConnect");

        socket.on("WOFConnect", (data) => {
          const state = store.getState().wof;

          let temp = {
            red: 0,
            black: 0,
            green: 0,
            yellow: 0,
          };
          let projected = {
            red: 0,
            black: 0,
            green: 0,
            yellow: 0,
          };
          for (var color in data.players) {
            for (var player in data.players[color]) {
              temp[color] += data.players[color][player].amount;
              if (player === state.userId) {
                projected[color] +=
                  data.players[color][player].amount *
                  (color === "red"
                    ? 2
                    : color === "black"
                    ? 3
                    : color === "green"
                    ? 5
                    : 50);
              }
            }
          }

          updateConstants({
            players: data.players,
            projected: projected,
            betTotals: temp,
            hash: data.hash,
            counter: data.counter,
            userId: data.userId,
            history: data.history,
            remainingTime: data.remainingTime,
            GAME_TIMER_INTERVAL: data.GAME_TIMER_INTERVAL,
            balance: data.balance,
            spinnerActive: data.end ? true : state.spinnerActive,
          });

          timerStartedAt = Date.now();

          if (data.end) {
            if (wofRef.current) {
              wofRef.current.style.transform = `rotate(-${
                2 + 360 * 4 + ((data.fairRound.ticket - 1) / 54) * 360
              }deg)`;
              wofRef.current.style.transition = `transform ${
                data.end - Date.now()
              }ms cubic-bezier(0, 0, 0.28, 1) 0s`;
            }

            setTimeout(() => {
              updateConstant("winningColor", data.color);
            }, data.end - Date.now());
          }

          updateConstants({
            history: data.history,
            lastBets: updateLastBetsWof(data.history),
            remainingTime: data.remainingTime,
            r_connect: true,
            connected: true,
          });
        });
      }

      return function cleanup() {
        clearInterval(timerInterval);
        socket.off("WOFConnect");
        socket.off("WOFHistory");
        socket.off("WOFPlayers");
        socket.off("WOFStart");
        socket.off("WOFSpin");
        socket.off("WOFCounter");
      };
    })();
  }, [loaded]);

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
      <div id="wof-game">
        <div className="game-container">
          <div className="line-container">
            {loaded ? (
              <>
                <BetSectionContainer setFairnessPanel={setFairnessPanel} />
                <div className="game-content-inside">
                  <div className="wheel-content">
                    <div className="wheel-circle-content">
                      <div className="selector">
                        <img src="/images/wheel-spin-select.svg" alt="" />
                      </div>
                      <img
                        className="wheel-circle"
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
                </div>
              </>
            ) : (
              <div id="loader">
                <div className="looper"></div>
              </div>
            )}
          </div>
        </div>

        <Activities />
      </div>
      <Footer />
    </div>
  );
};
