import { useEffect } from "react";
import { Fragment, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { audio_handler } from "../../../utils/audio_handler";
import { FairnessPanel } from "../../FairnessPanel";
import Activities from "../../homepage/Activities";
import Range from "../../Range";
import { BetSectionContainer } from "./BetSectionContainer";

const Dice = () => {
  const dispatch = useDispatch();
  const [fairnessPanel, setFairnessPanel] = useState(false);
  const [classicDice, setClassicDice] = useState(false);
  const rollRef = useRef(null);
  const multiRef = useRef(null);
  const chanceRef = useRef(null);
  const {
    beted,
    betType,
    muted,
    beting,
    lastBet,
    dices,
    loaded,
    type,
    diced,
    round,
    numberOfbets,
    lastDice,
  } = useSelector((state) => state.dice);
  const { mobile, containerWidth } = useSelector((state) => state.main);
  const calcs = () => {
    multiRef.current &&
      (multiRef.current.value = `${Math.min(
        Math.max(1.01, (100 / (type === 0x0 ? 100 - diced : diced)) * 0.95),
        95,
      ).toFixed(2)}`);

    rollRef.current && (rollRef.current.value = `${(diced || 0x0).toFixed(2)}`);

    chanceRef.current &&
      (chanceRef.current.value =
        type === 0x0
          ? `${Math.min(95, Math.max(100 - diced, 1))}.00`
          : `${Math.min(95, diced)}.00`);
  };

  useEffect(() => {
    document.title = "RustySaloon ~ Dice";
  }, []);

  useEffect(() => {
    calcs();
  }, [diced]);

  useEffect(() => {
    let intr = setInterval(() => {
      if (classicDice && lastDice && Date.now() - lastDice >= 3000) {
        setClassicDice(false);
      }

      if (beting && betType === 1 && lastBet && Date.now() - lastBet >= 1500) {
        if (numberOfbets !== 0x0 && round >= numberOfbets) {
          updateConstant("beting", false);
          updateConstant("round", 0x0);
          return;
        }

        updateConstant("lastBet", Date.now());

        setRandomDice();
      }
    }, 16);

    return () => {
      clearInterval(intr);
    };
  }, [lastDice, classicDice, beting, lastBet, numberOfbets, round, betType]);

  const updateConstant = (type, data) => {
    dispatch({ type: "UPDATE_DICE_STATE", payload: { [type]: data } });
  };

  const setDice = (count, earned = false) => {
    dispatch({
      type: "UPDATE_DICE_STATE",
      payload: {
        dices: dices.concat([
          {
            count,
            earned,
          },
        ]),
      },
    });
  };

  const setRandomDice = () => {
    let countbeNext = parseFloat((100 * Math.random()).toFixed(2));

    let earned = false;

    if (
      (type === 0 && countbeNext > diced) ||
      (type === 1 && countbeNext < diced)
    ) {
      earned = true;
    }

    setDice(countbeNext, earned);
    updateConstant("round", round + 1);
    updateConstant("lastDice", Date.now());

    !muted && audio_handler.playSound(earned ? "dice_win" : "dice_loose");

    setClassicDice(true);
  };

  // const autoBet = () => {
  //   setRandomDice();
  //   let jRound = 0x1,
  //     intr = setInterval(() => {
  //       console.log((numberOfbets !== 0x0 && jRound >= numberOfbets))
  //       console.log(beting)
  //       if ((numberOfbets !== 0x0 && jRound >= numberOfbets) || !beting) {
  //         alert("Auto bet stopped");
  //         clearInterval(intr);
  //         return;
  //       }
  //       setRandomDice();
  //       jRound++;
  //     }, 2000);
  // };

  const betStart = () => {
    if (!beted) {
      return;
    }

    if (beting) {
      if (betType === 0x1) {
        updateConstant("beting", false);
      }
      return;
    } else if (betType === 0x1) {
      updateConstant("lastBet", Date.now());
      updateConstant("beting", true);
      return;
    }

    updateConstant("beting", true);

    let countbeNext = parseFloat((100 * Math.random()).toFixed(2));

    let earned = false;

    if (
      (type === 0 && countbeNext > diced) ||
      (type === 1 && countbeNext < diced)
    ) {
      earned = true;
    }

    setDice(countbeNext, earned);
    updateConstant("round", round + 1);
    updateConstant("lastDice", Date.now());

    !muted && audio_handler.playSound(earned ? "dice_win" : "dice_loose");

    setClassicDice(true);

    updateConstant("beting", false);
  };

  useEffect(() => {
    (async () => {
      const loadAudios = await audio_handler.loadSounds([
        "dice_win",
        "dice_loose",
      ]);
      if (loadAudios) {
        updateConstant("loaded", true);
      }
    })();
  }, []);

  return (
    <Fragment>
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
        id="dice-game"
        className={
          mobile || containerWidth < 900
            ? mobile
              ? " mobile"
              : " optimize-screen"
            : ""
        }
      >
        <div className="game-container">
          <div className="line-container">
            {loaded ? (
              <>
                <BetSectionContainer
                  setFairnessPanel={setFairnessPanel}
                  betStart={betStart}
                />
                <div className="game-content-inside">
                  <div className="game-content">
                    <div
                      className="right-dices-history"
                      onLoad={(e) =>
                        e.currentTarget.scrollTo(e.currentTarget.scrollWidth, 0)
                      }
                    >
                      {dices.map((dice, index) => (
                        <div
                          key={index}
                          className={
                            "dice-card" + (dice.earned ? " active" : "")
                          }
                        >
                          {dice.count}
                        </div>
                      ))}
                    </div>
                    <div className="center-content">
                      <div className="text-section">
                        <div className="tip">
                          <span>0</span>
                        </div>
                        <div className="tip">
                          <span>25</span>
                        </div>
                        <div className="tip">
                          <span>50</span>
                        </div>
                        <div className="tip">
                          <span>75</span>
                        </div>
                        <div className="tip">
                          <span>100</span>
                        </div>
                      </div>
                      <div className="range-container">
                        <div
                          className={
                            "wrap-inside" + (type !== 0x0 ? " mirror" : "")
                          }
                        >
                          <div className="current-count-container">
                            {dices.length ? (
                              <div
                                style={{
                                  left: `${
                                    dices[dices.length - 1].count ?? 0x0
                                  }%`,
                                }}
                                className={
                                  "current-count" +
                                  (classicDice ? " active" : "")
                                }
                              >
                                <img
                                  src="/images/new_form/classic-dice.svg"
                                  alt=""
                                />
                                <div
                                  className={
                                    "count-text" +
                                    (dices[dices.length - 1].earned
                                      ? " active"
                                      : "")
                                  }
                                >
                                  {dices[dices.length - 1].count ?? "0.00"}
                                </div>
                              </div>
                            ) : null}
                          </div>
                          <Range
                            defaultValue={diced}
                            max={99}
                            min={0}
                            disabled={beting}
                            onSelect={(count) =>
                              !beting && updateConstant("diced", Number(count))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="game-details-section">
                    <div className="form">
                      <div className="label">Multiplier</div>
                      <div className="input">
                        <input
                          type="text"
                          readOnly={true}
                          ref={multiRef}
                          defaultValue={"0.00"}
                        />
                        <div className="right">X</div>
                      </div>
                    </div>
                    <div className="form">
                      <div className="label">
                        Roll {type === 0x0 ? "Over" : "Under"}
                      </div>
                      <div className="input">
                        <input
                          type="text"
                          readOnly={true}
                          ref={rollRef}
                          defaultValue={"0.00"}
                        />
                        <div
                          className={"right clickable"}
                          onClick={() => {
                            if (!beting) {
                              updateConstant("type", type !== 0x0 ? 0 : 1);
                              updateConstant("diced", parseFloat(100 - diced));
                            } else {
                              toast.error(
                                "You can't change Roll type while betting",
                              );
                            }
                          }}
                        >
                          <img
                            src="/images/new_form/refresh.svg"
                            alt=""
                            style={
                              type !== 0x0
                                ? { transform: "rotate(180deg)" }
                                : {}
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form">
                      <div className="label">Win Chance</div>
                      <div className="input">
                        <input
                          type="text"
                          readOnly={true}
                          ref={chanceRef}
                          defaultValue={"0.00"}
                        />
                        <div className="right">
                          <img src="/images/new_form/parcent.svg" alt="" />
                        </div>
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
    </Fragment>
  );
};

export default Dice;
