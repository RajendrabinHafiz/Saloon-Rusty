import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../Footer";
import { audio_handler } from "../../../utils/audio_handler";
import { poker_suits, proker_cards } from "../../../utils/poker_cards";
import { toast } from "react-hot-toast";
import Activities from "../../../components/homepage/Activities";
import { FairnessPanel } from "../../FairnessPanel";
import { socket } from "../../../Socket";

const VideoPoker = () => {
  const dispatch = useDispatch();
  const betInput = useRef(null);
  const [dealing, setDealing] = React.useState(false);
  const [fairnessPanel, setFairnessPanel] = useState(false);
  const [beting, setBeting] = React.useState(false);
  const { mobile } = useSelector((state) => state.main);
  const { cards, beted, round, loaded, muted } = useSelector(
    (state) => state.videopoker,
  );

  const refCards = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
    4: useRef(null),
    5: useRef(null),
  };

  const updateConstant = (type, data) => {
    dispatch({ type: "UPDATE_VIDEOPOKER_STATE", payload: { [type]: data } });
  };

  const switchtoDefault = (_cards) => {
    let cards_fixed = {};

    if (_cards) {
      let clean_object = _cards.filter((card) => card !== null);

      for (let i = 0; i < clean_object.length; i++) {
        let key = clean_object[i].indexKey;

        cards_fixed[key] = Object.assign({}, clean_object[i], {
          active: false,
          selected: false,
        });
      }
    } else {
      cards_fixed = Object.assign(
        {},
        ...Object.keys(cards).map((key) => {
          return { [key]: { ...cards[key], selected: false, active: false } };
        }),
      );
    }

    dispatch({
      type: "UPDATE_VIDEOPOKER_STATE",
      payload: {
        cards: Object.assign({}, cards, cards_fixed),
      },
    });
  };

  const setDOMCards = () => {
    setDealing(true);

    switchtoDefault(
      Object.keys(cards).map((cardkey) =>
        cards[cardkey].active && !cards[cardkey].selected
          ? { indexKey: cardkey, ...cards[cardkey] }
          : null,
      ),
    );

    let deck = [];

    const createDeck = (dontMatch = false) => {
      for (const card in proker_cards) {
        for (const suit of poker_suits) {
          if (dontMatch) {
            for (const cardkey in cards) {
              if (
                cards[cardkey].card === proker_cards[card] &&
                cards[cardkey].suit === poker_suits[suit]
              ) {
                continue;
              }
            }
          }

          deck.push({ v: card, s: suit });
        }
      }
      return deck;
    };

    createDeck(true);

    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    deck = shuffle(deck);

    setTimeout(() => {
      !muted && audio_handler.playSound("flip");

      let { v, s } = deck.pop();

      // !cards[cardkey].active && !cards[cardkey].selected
      //     ? {
      //         [cardkey]: {
      //           ...cards[cardkey],
      //           active: true,
      //           value: v,
      //           suit: s,
      //         },
      //       }
      //     : {},

      dispatch({
        type: "UPDATE_VIDEOPOKER_STATE",
        payload: {
          cards: Object.assign({}, cards),
        },
      });

      setDealing(false);
    }, 2000);
  };

  const clickCard = (card_key) => {
    dispatch({
      type: "UPDATE_VIDEOPOKER_STATE",
      payload: {
        cards: Object.assign({}, cards, {
          [card_key]: {
            ...cards[card_key],
            selected: !cards[card_key].selected,
          },
        }),
      },
    });
  };

  const dealCore = () => {
    !muted && audio_handler.playSound("deal");

    setDealing(true);

    let cardsNotSelected = Object.keys(cards).map((cardkey) =>
        cards[cardkey].active && !cards[cardkey].selected
          ? { indexKey: cardkey, ...cards[cardkey] }
          : null,
      ),
      clean_cards = cardsNotSelected.filter((card) => card !== null);

    switchtoDefault(cardsNotSelected);

    let deck = [];

    const createDeck = (dontMatch = false) => {
      for (const card in proker_cards) {
        for (const suit of poker_suits) {
          if (dontMatch) {
            for (const cardkey in cards) {
              if (
                cards[cardkey].card === proker_cards[card] &&
                cards[cardkey].suit === poker_suits[suit]
              ) {
                continue;
              }
            }
          }

          deck.push({ value: card, suit: suit });
        }
      }
      return deck;
    };

    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    deck = shuffle(createDeck(true));

    setTimeout(() => {
      !muted && audio_handler.playSound("flip");

      let cards_fixed = {},
        i = 0x0;

      for (let _card of clean_cards) {
        let index = _card.indexKey;

        cards_fixed[index] = Object.assign({}, _card, { ...deck[i++] });
      }

      dispatch({
        type: "UPDATE_VIDEOPOKER_STATE",
        payload: {
          cards: Object.assign({}, cards, cards_fixed),
          round: 2,
        },
      });

      setDealing(false);
    }, 2000);
  };

  const betCore = () => {
    if (beted <= 0) {
      return toast.error("You can't bet with that amount!");
    }

    socket.emit("playpoker:start", {
      bet: beted,
      userid: "76561199225286637",
    });
    
    setBeting(true);

    switchtoDefault();

    let deck = [];

    const createDeck = () => {
      for (const card in proker_cards) {
        for (const suit of poker_suits) {
          deck.push({ value: card, suit: suit });
        }
      }
      return deck;
    };

    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    deck = shuffle(createDeck());

    setTimeout(() => {
      let cards_fixed = {};

      for (let i = 0; i < 5; i++) {
        cards_fixed[i + 1] = Object.assign({}, cards[i + 1], deck.pop(), {
          active: true,
          selected: false,
        });
      }

      !muted && audio_handler.playSound("flip");

      dispatch({
        type: "UPDATE_VIDEOPOKER_STATE",
        payload: {
          cards: cards_fixed,
        },
      });
    }, 1000);
  };

  useEffect(() => {
    document.title = "RustySaloon ~ Video Poker";

    

    socket.on("playpoker:cards", (data) => {console.log(data)});
    // setTimeout(() => {
    //   dispatch({
    //     type: "UPDATE_VIDEOPOKER_STATE",
    //     payload: {
    //       cards: Object.keys(cards).map((key) => {
    //         return { ...cards[key], selected: false, active: true };
    //       }),
    //     },
    //   });
    //   setDealing(false);
    // }, 2000);

    (async () => {
      const loadAudios = await audio_handler.loadSounds([
        "flip",
        "deal",
        "lose",
        "win",
      ]);
      if (loadAudios) {
        updateConstant("loaded", true);
      }
    })();
    return () => {
      socket.off("poker:game");
    };
  }, []);

  let cards_selected = [];

  for (let _cardIndex in cards) {
    let _card = cards[_cardIndex];
    _card.active && _card.selected && cards_selected.push(_card);
  }

  const canDeal = !!(
    !dealing &&
    beted &&
    beted > 0 &&
    beting &&
    cards_selected.length !== 0x0
  );

  return (
    <React.Fragment>
      <FairnessPanel
        active={fairnessPanel}
        roundId="6b5c1-29371-fa925-71a9b-b6a0b"
        clientSeed={"gm1e5H6I3t"}
        id="fairness-videopoker-panel"
        serverSeed={
          "6b5c129371fa92571a9b6a0b48489b96d0ba85589ead4a6f6c61cf0b88613d41"
        }
        onClose={() => setFairnessPanel(false)}
      />
      <div className="page-content">
        <div id="video-poker" className={mobile ? "mobile" : ""}>
          <div className="container">
            {loaded ? (
              <div className="wrap">
                <div className="bet-section">
                  <div className="form-input">
                    <div className="label">Bet Amount</div>
                    <div className="input">
                      <div className="left">
                        <img
                          draggable="false"
                          src="/images/diamond.svg"
                          alt=""
                        />
                        <input
                          type="number"
                          placeholder="Bet Amount"
                          ref={betInput}
                          onChange={(event) =>
                            event.target.value &&
                            String(event.target.value).match(/^[0-9]+$/) &&
                            dispatch({
                              type: "UPDATE_VIDEOPOKER_STATE",
                              payload: {
                                beted: parseFloat(event.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div className="duplicate-buttons">
                        <div
                          className="button"
                          onClick={() => {
                            betInput.current &&
                              (betInput.current.value = Math.max(
                                1,
                                parseFloat(betInput.current.value) / 2,
                              ));
                          }}
                        >
                          1/2
                        </div>
                        <div
                          className="button"
                          onClick={() => {
                            betInput.current &&
                              (betInput.current.value =
                                parseFloat(betInput.current.value) * 2);
                          }}
                        >
                          2x
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="bet-button"
                    onClick={() =>
                      beted !== null
                        ? beting
                          ? canDeal && dealCore()
                          : betCore()
                        : null
                    }
                    style={
                      beted === null
                        ? { opacity: "0.3", cursor: "not-allowed" }
                        : {}
                    }
                  >
                    {beting ? "Deal" : "Bet"}
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
                      onClick={() => updateConstant("muted", !muted)}
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
                <div className="game-content">
                  <div className="payout-table">
                    <div className="wrap-line">
                      <div className="nickname-payout-tr">
                        <div className="left">
                          <div className="payout-called">
                            <span>ROYAL FLUSH</span>
                          </div>
                          <div className="duplicated">250x</div>
                        </div>
                        <div className="balance-become">
                          <span>
                            <span className="amount">0.00</span>
                            <img
                              draggable="false"
                              src="/images/diamond.svg"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="wrap-line">
                      <div className="nickname-payout-tr">
                        <div className="left">
                          <div className="payout-called">
                            <span>STRAIGHT FLUSH</span>
                          </div>
                          <div className="duplicated">50x</div>
                        </div>
                        <div className="balance-become">
                          <span>
                            <span className="amount">0.00</span>
                            <img
                              draggable="false"
                              src="/images/diamond.svg"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="wrap-line">
                      <div className="nickname-payout-tr">
                        <div className="left">
                          <div className="payout-called">
                            <span>4 OF A KIND</span>
                          </div>
                          <div className="duplicated">22x</div>
                        </div>
                        <div className="balance-become">
                          <span>
                            <span className="amount">0.00</span>
                            <img
                              draggable="false"
                              src="/images/diamond.svg"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="wrap-line">
                      <div className="nickname-payout-tr">
                        <div className="left">
                          <div className="payout-called">
                            <span>FULL HOUSE</span>
                          </div>
                          <div className="duplicated">9.00x</div>
                        </div>
                        <div className="balance-become">
                          <span>
                            <span className="amount">0.00</span>
                            <img
                              draggable="false"
                              src="/images/diamond.svg"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="wrap-line">
                      <div className="nickname-payout-tr">
                        <div className="left">
                          <div className="payout-called">
                            <span>FLUSH</span>
                          </div>
                          <div className="duplicated">6.00x</div>
                        </div>
                        <div className="balance-become">
                          <span>
                            <span className="amount">0.00</span>
                            <img
                              draggable="false"
                              src="/images/diamond.svg"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="wrap-line">
                      <div className="nickname-payout-tr">
                        <div className="left">
                          <div className="payout-called">
                            <span>STRAIGHT</span>
                          </div>
                          <div className="duplicated">4.00x</div>
                        </div>
                        <div className="balance-become">
                          <span>
                            <span className="amount">0.00</span>
                            <img
                              draggable="false"
                              src="/images/diamond.svg"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="wrap-line">
                      <div className="nickname-payout-tr">
                        <div className="left">
                          <div className="payout-called">
                            <span>3 OF A KIND</span>
                          </div>
                          <div className="duplicated">3.00x</div>
                        </div>
                        <div className="balance-become">
                          <span>
                            <span className="amount">0.00</span>
                            <img
                              draggable="false"
                              src="/images/diamond.svg"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="wrap-line">
                      <div className="nickname-payout-tr">
                        <div className="left">
                          <div className="payout-called">
                            <span>2 PAIR</span>
                          </div>
                          <div className="duplicated">2.00x</div>
                        </div>
                        <div className="balance-become">
                          <span>
                            <span className="amount">0.00</span>
                            <img
                              draggable="false"
                              src="/images/diamond.svg"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="wrap-line">
                      <div className="nickname-payout-tr">
                        <div className="left">
                          <div className="payout-called">
                            <span>PAIR OF JACKS OR BETTER</span>
                          </div>
                          <div className="duplicated">1.00x</div>
                        </div>
                        <div className="balance-become">
                          <span>
                            <span className="amount">0.00</span>
                            <img
                              draggable="false"
                              src="/images/diamond.svg"
                              alt=""
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="cards-poker">
                    {Object.keys(cards).map((card_key, index) => (
                      <div
                        className={
                          "card" +
                          (cards[card_key].active
                            ? cards[card_key].selected
                              ? " active-selected"
                              : " active"
                            : "")
                        }
                        ref={refCards[index + 1]}
                        onClick={() =>
                          cards[card_key].active && clickCard(card_key)
                        }
                        key={index}
                      >
                        <img
                          draggable="false"
                          src={`/images/poker_cards/${cards[card_key].suit}${cards[card_key].value}.svg`}
                          alt=""
                          className="card-poker"
                        />
                        <img
                          draggable="false"
                          className="default-card"
                          src="/images/new_form/default-card.png"
                          alt=""
                        />
                        <div className="hold-wrap">
                          <span>HOLD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div id="loader">
                <div className="looper"></div>
              </div>
            )}
            {/* <div className="control-section-bar">
              <div className="left"></div>
              <div className="right">
                <div
                  className="fairness button"
                  onClick={() => setFairnessPanel(true)}
                >
                  Fairness
                </div>
                <div
                  style={
                    !canDeal ? { opacity: "0.3", cursor: "not-allowed" } : {}
                  }
                  className="deal button"
                  onClick={() => canDeal && dealCore()}
                >
                  Deal
                </div>
              </div>
            </div> */}
          </div>

          <Activities />
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default VideoPoker;
