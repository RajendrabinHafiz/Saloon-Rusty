import { useState, useEffect, useRef } from "react";
import { Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { audio_handler } from "../../../utils/audio_handler";
import { FairnessPanel } from "../../FairnessPanel";
import Footer from "../../Footer";
import Activities from "../../homepage/Activities";
import structuredClone from "@ungap/structured-clone";

export const Blakcjack = () => {
  const dispatch = useDispatch();
  const [muted, setMuted] = useState(false);

  const betInput = useRef(null);
  const tableRef = useRef(null);
  const [beting, setBeting] = useState(false);
  const { cards, beted, loaded } = useSelector((state) => state.blackjack);
  const [fairnessPanel, setFairnessPanel] = useState(false);
  const { mobile, containerWidth } = useSelector((state) => state.main);

  useEffect(() => {
    document.title = "RustySaloon - Blackjack";

    const updateConstant = (type, data) => {
      dispatch({ type: "UPDATE_BLACKJACK_STATE", payload: { [type]: data } });
    };

    (async () => {
      const loadAudios = await audio_handler.loadSounds(["flip", "deal"]);

      if (loadAudios) {
        updateConstant("loaded", true);
      }
    })();
  }, []);

  const updateCards = (type, data, concat = true) => {
    dispatch({
      type: "UPDATE_BLACKJACK_STATE",
      payload: {
        cards: Object.assign({}, cards, {
          [type]: concat ? (cards[type] ?? []).concat(data) : data,
        }),
      },
    });
  };

  const addCard = () => {
    let cards_poker = structuredClone(cards["dealer"]);

    if (cards_poker.length >= 8) {
      return dispatch({
        type: "UPDATE_BLACKJACK_STATE",
        payload: {
          cards: Object.assign({}, cards, {
            dealer: [],
          }),
        },
      });
    }

    audio_handler.playSound("deal");

    setBeting(true);

    cards_poker.push({
      suit: "S",
      value: "K",
      selected: false,
      active: false,
    });

    updateCards("dealer", [
      {
        suit: "S",
        value: "K",
        selected: false,
        active: false,
      },
    ]);

    setTimeout(() => {
      audio_handler.playSound("flip");
      cards_poker[Math.max(0, cards_poker.length - 1)].active = true;
      updateCards("dealer", cards_poker, false);
      setBeting(false);
    }, 500);
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
        id="blackjack"
        className={
          mobile || containerWidth < 900
            ? mobile
              ? " mobile"
              : " optimize-screen"
            : ""
        }
      >
        <div className="game-container">
          {loaded ? (
            <div className="line-container">
              <div className="bet-section-container">
                <div className="betting">
                  <div className="label">BET AMOUNT</div>
                  <div className="input">
                    <img src="/images/diamond.svg" alt="" className="coin" />
                    <input
                      type="text"
                      placeholder="Bet Amount"
                      ref={betInput}
                      onChange={(event) =>
                        dispatch({
                          type: "UPDATE_BLACKJACK_STATE",
                          payload: {
                            beted:
                              event.target.value &&
                              String(event.target.value).match(/^[0-9]+$/) &&
                              parseFloat(event.target.value) > 1
                                ? parseFloat(event.target.value)
                                : null,
                          },
                        })
                      }
                    />
                    <div className="duplicate-buttons">
                      <div
                        className="button"
                        onClick={() => {
                          beted &&
                            betInput.current &&
                            (betInput.current.value = Math.max(
                              1,
                              (parseFloat(betInput.current.value) / 2).toFixed(
                                2,
                              ),
                            ));
                        }}
                      >
                        1/2
                      </div>
                      <div
                        className="button"
                        onClick={() => {
                          beted &&
                            betInput.current &&
                            (betInput.current.value =
                              parseFloat(betInput.current.value) * 2);
                        }}
                      >
                        2x
                      </div>
                      <div
                        className="button"
                        onClick={() => {
                          beted &&
                            betInput.current &&
                            (betInput.current.value = 0);
                        }}
                      >
                        MAX
                      </div>
                    </div>
                  </div>
                </div>
                <div className="decision">
                  <div className="label">Make your decision</div>
                  <div className="wrap-line-buttons">
                    <div className="button">
                      <span>
                        <span>HIT</span>
                        <img
                          src="/images/new_form/chevron-up-circle-green.svg"
                          alt=""
                        />
                      </span>
                    </div>
                    <div className="button">
                      <span>
                        <span>STAND</span>
                        <img
                          src="/images/new_form/chevron-down-circle-red.svg"
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                  <div className="wrap-line-buttons">
                    <div className="button">
                      <span>
                        <span>SPLIT</span>
                        <img src="/images/new_form/diving.svg" alt="" />
                      </span>
                    </div>
                    <div className="button">
                      <span>
                        <span>DOUBLE</span>
                        <img
                          src="/images/new_form/chevrons-up-yellow.svg"
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                  <div className="end-bar">
                    <div
                      className="fairness button-bar"
                      onClick={() => setFairnessPanel(true)}
                    >
                      Fairness
                    </div>
                    <div
                      className={"button-bar " + (!muted ? "unmute" : "mute")}
                      onClick={() => setMuted(!muted)}
                    >
                      <img
                        src={`/images/new_form/speaker${
                          !muted ? "-mute" : ""
                        }.svg`}
                        alt=""
                      />
                      <span>{muted ? "Unmute" : "Mute"}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={
                    "bet-button" + (beting || !beted ? " disabled" : "")
                  }
                  onClick={() => !beting && beted && addCard()}
                >
                  Bet
                </div>
              </div>
              <div className="game-content-inside">
                <div className="game-table" ref={tableRef}>
                  <div className="hoover-border-in">
                    <div className="text">BLACKJACK PAYS 3 TO 2</div>
                  </div>

                  <div className="game-content">
                    <div className="static-cards">
                      <div className="silenced-cards">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                      <div className="default-card">
                        <img src="/images/new_form/default-card.png" alt="" />
                      </div>
                    </div>
                    <div
                      className="game-cards"
                      style={
                        Math.max(cards.dealer.length, cards.player.length) >= 5
                          ? { width: "300px" }
                          : {}
                      }
                    >
                      <div className="top-content content-topup">
                        <div className="top-cards">
                          {cards.dealer.map((card, index) => (
                            <div
                              className={
                                "poker-card" + (card.active ? " active" : "")
                              }
                              key={index}
                            >
                              <Image
                                src={`/images/poker_cards/${card.suit}${card.value}.svg`}
                                alt=""
                                className="card-poker"
                              />
                              <img
                                className="default-card"
                                src="/images/new_form/default-card.png"
                                alt=""
                              />
                            </div>
                          ))}
                        </div>
                        {cards.dealer.length ? (
                          <div className="card-counter">20</div>
                        ) : null}
                      </div>
                      <div className="bottom-content content-topup">
                        <div className="bottom-cards">
                          {cards.dealer.map((card, index) => (
                            <div
                              className={
                                "poker-card" + (card.active ? " active" : "")
                              }
                              key={index}
                            >
                              <Image
                                src={`/images/poker_cards/${card.suit}${card.value}.svg`}
                                alt=""
                                className="card-poker"
                              />
                              <img
                                className="default-card"
                                src="/images/new_form/default-card.png"
                                alt=""
                              />
                            </div>
                          ))}
                        </div>
                        {cards.dealer.length ? (
                          <div className="card-counter">20</div>
                        ) : null}
                      </div>
                    </div>
                  </div>
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

export default Blakcjack;
