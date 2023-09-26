import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { FairnessPanel } from "../../FairnessPanel";
import Footer from "../../Footer";
import Activities from "../../homepage/Activities";
import structuredClone from "@ungap/structured-clone";
import {
  abbreviateNumber,
  BetSectionContainer,
  bet_amounts,
} from "./BetSection";
import { store } from "../../../redux/store";
export const BaccaratGame = () => {
  const dispach = useDispatch();
  const [fairnessPanel, setFairnessPanel] = useState(false);
  const [multiplierWidth, setMultiplierWidth] = useState(0);
  const {
    tableCards,
    beting,
    betType,
    currentMultiplier,
    multipliersHistory,
    difficulty,
    betAmountCards,
    historyCircles,
    currentPokerCircle,
  } = useSelector((state) => state.baccarat);

  const updateConstant = (type, data) => {
    dispach({ type: "UPDATE_BACCARAT_STATE", payload: { [type]: data } });
  };

  useEffect(() => {
    document.title = "RustySaloon ~ Baccarat";

    let intr = setInterval(() => {
      const state = store.getState().baccarat;
      if (state.beting && state.betType === 1 && state.passAuto) {
        if (state.numberOfbets !== 0x0 && state.round >= state.numberOfbets) {
          updateConstant("beting", false);
          updateConstant("passAuto", false);
          updateConstant("round", 0x0);
          return;
        }

        updateConstant("passAuto", false);
        updateConstant("round", state.round + 0x1);

        randomDemo();
      }
    }, 16);

    return () => {
      clearInterval(intr);
    };
  }, []);

  const addorUpdateCard = (
    collection,
    details,
    animation = false,
    callBack = null,
  ) => {
    let key = details.suit + details.value + (details.key ?? 0);

    let objectUser = {};
    let state = structuredClone(store.getState().baccarat);
    updateConstant("tableCards", {
      ...state.tableCards,
      [collection]: {
        ...state.tableCards[collection],
        [key]: (objectUser = Object.assign(
          key in state.tableCards[collection]
            ? state.tableCards[collection][key] ?? {}
            : {},
          {
            active: false,
          },
          details,
        )),
      },
    });

    if (animation) {
      setTimeout(() => {
        console.log(Object.assign({}, objectUser, { active: true }));
        try {
          let _state = structuredClone(store.getState().baccarat);

          _state.tableCards[collection][key].active = true;

          store.dispatch({
            type: "UPDATE_BACCARAT_STATE",
            payload: {
              tableCards: _state.tableCards,
            },
          });
        } catch (error) {
          console.log(error);
        }

        // updateConstant("tableCards", {
        //   ..._state.tableCards,
        //   [collection]: {
        //     ..._state.tableCards[collection],
        //     [key]: Object.assign({}, objectUser, { active: true }),
        //   },
        // });
        callBack && callBack();
      }, 1000);
    } else {
      callBack && callBack();
    }
  };

  const pushCirclePoker = (type) => {
    if (beting) {
      return;
    }

    let amountAdd = bet_amounts[currentPokerCircle];

    let cardCirclesPoker = structuredClone(betAmountCards[type]) ?? [];

    let shouldAdd =
      historyCircles.length === 0x0 ||
      historyCircles[historyCircles.length - 1].type === type;

    if (cardCirclesPoker.length >= 5) {
      cardCirclesPoker[4] = (shouldAdd ? cardCirclesPoker[4] : 0) + amountAdd;
    } else {
      cardCirclesPoker.push(
        (shouldAdd ? cardCirclesPoker[cardCirclesPoker.length - 1] ?? 0 : 0) +
          amountAdd,
      );
    }

    updateConstant("beted", cardCirclesPoker[cardCirclesPoker.length - 1]);

    updateConstant(
      "historyCircles",
      (historyCircles ?? []).concat([
        {
          type,
          amountAdd,
          total: cardCirclesPoker[cardCirclesPoker.length - 1],
        },
      ]),
    );

    updateConstant("betAmountCards", {
      ...betAmountCards,
      [type]: cardCirclesPoker,
    });
  };

  const undoCircle = () => {
    if (beting) {
      return;
    }

    const state = store.getState().baccarat;
    let _historyCircles = structuredClone(state.historyCircles);
    let lastHistory = _historyCircles[_historyCircles.length - 1];

    if (!lastHistory) {
      return;
    }

    let cardCirclesPoker =
      structuredClone(state.betAmountCards[lastHistory.type]) ?? [];
    let amountAdd = lastHistory.amountAdd;

    if (cardCirclesPoker.length >= 5) {
      let rTy = ~~((lastHistory.total - amountAdd * 4) / amountAdd);

      if (rTy <= 1) {
        cardCirclesPoker.pop();
        _historyCircles = _historyCircles.slice(0, -1);
      } else {
        cardCirclesPoker[cardCirclesPoker.length - 1] =
          cardCirclesPoker[cardCirclesPoker.length - 1] - amountAdd;
        _historyCircles = _historyCircles.slice(0, -1);
      }
    } else {
      cardCirclesPoker.pop();
      _historyCircles = _historyCircles.slice(0, -1);
    }

    updateConstant("historyCircles", _historyCircles);

    updateConstant("betAmountCards", {
      ...state.betAmountCards,
      [lastHistory.type]: cardCirclesPoker,
    });
  };

  const randomDemo = () => {
    addorUpdateCard(
      "player",
      { count: 12, suit: "C", value: 6, key: ~~(Math.random() * 0xffffffff) },
      true,
      () => {
        addorUpdateCard(
          "banker",
          {
            count: 13,
            suit: "C",
            value: 4,
            key: ~~(Math.random() * 0xffffffff),
          },
          true,
          () => {
            addorUpdateCard(
              "player",
              {
                count: 12,
                suit: "C",
                value: 6,
                key: ~~(Math.random() * 0xffffffff),
              },
              true,
              () => {
                addorUpdateCard(
                  "banker",
                  {
                    count: 13,
                    suit: "C",
                    value: 4,
                    key: ~~(Math.random() * 0xffffffff),
                  },
                  true,
                  () => {
                    addorUpdateCard(
                      "player",
                      {
                        count: 12,
                        suit: "C",
                        value: 6,
                        key: ~~(Math.random() * 0xffffffff),
                      },
                      true,
                      () => {
                        addorUpdateCard(
                          "banker",
                          {
                            count: 13,
                            suit: "C",
                            value: 4,
                            key: ~~(Math.random() * 0xffffffff),
                          },
                          true,
                          () => {
                            setTimeout(() => {
                              if (store.getState().baccarat.betType === 0x0) {
                                updateConstant("beting", false);
                              } else {
                                clearCards();
                                updateConstant("passAuto", true);
                              }
                            }, 500);
                          },
                        );
                      },
                    );
                  },
                );
              },
            );
          },
        );
      },
    );
  };
  const clearCards = () => {
    updateConstant("tableCards", {
      player: {},
      banker: {},
    });
  };

  const betStart = () => {
    if (beting) {
      if (betType === 0x1) {
        updateConstant("beting", false);
        updateConstant("passAuto", false);
      }
      return;
    }

    if (
      Object.keys(tableCards.player).length >= 3 ||
      Object.keys(tableCards.banker).length >= 3
    ) {
      clearCards();
    }

    if (betType === 0x0) {
      updateConstant("beting", true);
      randomDemo();
    } else {
      updateConstant("beting", true);
      updateConstant("passAuto", true);
    }
  };

  const clearCircles = () => {
    if (beting) {
      return;
    }

    updateConstant("betAmountCards", {
      player: [],
      banker: [],
      tie: [],
    });
    updateConstant("historyCircles", []);
  };

  return (
    <>
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
      <div id="baccarat-game">
        <div className="game-container">
          <div className="line-container">
            <BetSectionContainer
              betStart={betStart}
              setFairnessPanel={setFairnessPanel}
            />
            <div className="game-content-inside">
              <div className="silence-card">
                <div className="hover-cards">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div className="default-card">
                  <img src="/images/new_form/default-card.png" alt="" />
                </div>
              </div>

              <div className="image-tie-pays">
                <img src="/images/new_form/tie-pays.svg" alt="" />
              </div>

              <div className="poker-cards">
                {Object.keys(tableCards.player).length > 0 && (
                  <div className="left player-cards">
                    <div className="score">20</div>
                    <div className="cards">
                      {Object.keys(tableCards.player).map((card, index) => (
                        <div
                          className={
                            "card" +
                            (tableCards.player[card].active ? " active" : "")
                          }
                          key={index}
                        >
                          <img
                            className="poker-card"
                            src={`/images/poker_cards/${tableCards.player[card].suit}${tableCards.player[card].value}.svg`}
                            alt=""
                          />
                          <img
                            className="default-card"
                            src="/images/new_form/default-card.png"
                            alt=""
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(tableCards.banker).length > 0 && (
                  <div className="right player-cards">
                    <div className="score">20</div>
                    <div className="cards">
                      {Object.keys(tableCards.banker).map((card, index) => (
                        <div
                          className={
                            "card" +
                            (tableCards.banker[card].active ? " active" : "")
                          }
                          key={index}
                        >
                          <img
                            className="poker-card"
                            src={`/images/poker_cards/${tableCards.banker[card].suit}${tableCards.banker[card].value}.svg`}
                            alt=""
                          />
                          <img
                            className="default-card"
                            src="/images/new_form/default-card.png"
                            alt=""
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="down-section">
                <div className="bet-section-cards">
                  <div
                    className="bet-section-card"
                    onClick={() => pushCirclePoker("player")}
                  >
                    <div className="title">Player</div>
                    <div className="amount">
                      <img src="/images/diamond.svg" alt="" />
                      <span>23.00</span>
                    </div>
                    <div className="circles-poker">
                      {betAmountCards["player"].map((amount, index) => (
                        <div className={"circle-poker"} key={index}>
                          <img
                            src="/images/new_form/hover-circle-poker.svg"
                            alt=""
                          />
                          <span>{abbreviateNumber(amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="bet-section-card"
                    onClick={() => pushCirclePoker("tie")}
                  >
                    <div className="title">Tie</div>
                    <div className="amount">
                      <img src="/images/diamond.svg" alt="" />
                      <span>23.00</span>
                    </div>
                    <div className="circles-poker">
                      {betAmountCards["tie"].map((amount, index) => (
                        <div className={"circle-poker"} key={index}>
                          <img
                            src="/images/new_form/hover-circle-poker.svg"
                            alt=""
                          />
                          <span>{abbreviateNumber(amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="bet-section-card"
                    onClick={() => pushCirclePoker("banker")}
                  >
                    <div className="title">Banker</div>
                    <div className="amount">
                      <img src="/images/diamond.svg" alt="" />
                      <span>23.00</span>
                    </div>
                    <div className="circles-poker">
                      {betAmountCards["banker"].map((amount, index) => (
                        <div className={"circle-poker"} key={index}>
                          <img
                            src="/images/new_form/hover-circle-poker.svg"
                            alt=""
                          />
                          <span>{abbreviateNumber(amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="controll-buttons">
                  <div className="button" onClick={() => undoCircle()}>
                    <img src="/images/arrow-left.svg" alt="" />
                    <span>Undo</span>
                  </div>
                  <div className="button" onClick={() => clearCircles()}>
                    <img src="/images/new_form/refresh.svg" alt="" />
                    <span>Clear</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Activities />
      </div>
      <Footer />
    </>
  );
};

export default BaccaratGame;
