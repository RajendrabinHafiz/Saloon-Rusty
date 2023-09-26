import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Activities from "../../../components/homepage/Activities";
import Footer from "../../Footer";
import { audio_handler } from "../../../utils/audio_handler";
import { useEffect } from "react";
import { FairnessPanel } from "../../FairnessPanel";

const HILO = () => {
  const dispatch = useDispatch();
  const betInput = useRef(null);
  const [muted, setMuted] = useState(false);
  const [beting, setBeting] = useState(false);
  const [fairnessPanel, setFairnessPanel] = useState(false);
  const { mobile } = useSelector((state) => state.main);
  const { cards, beted, round, upHandler, downHandler, loaded } = useSelector(
    (state) => state.hilo,
  );

  useEffect(() => {
    if (beting && betInput.current) {
      betInput.current.focus();
    }

    document.title = "RustySaloon | Hi-Lo";
  }, [beting]);

  const generateCard = (stringValue) => {
    let suits = ["C", "S", "H", "D"];
    let values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q"];

    let card = {
      suit: suits[~~(Math.random() * suits.length)],
      value: values[~~(Math.random() * values.length)],
    };

    return stringValue ? `${card.value}${card.suit}` : card;
  };

  const getImagePath = (wayb) => {
    switch (wayb) {
      case 1:
        return "skip-yellow";
      case 2:
        return "dash-up-green";
      case 3:
        return "dash-up-red";
      default:
        return null;
    }
  };

  const setCard = (card, way, index = null, profit = null, active = true) => {
    let fI = index ?? Object.keys(cards).length + 1;

    dispatch({
      type: "UPDATE_HILO_STATE",
      payload: {
        cards: Object.assign({}, fI <= 1 ? {} : cards, {
          [fI <= 1 ? 1 : fI]: {
            ...card,
            way,
            profit,
            active: active,
          },
        }),
      },
    });
  };

  const clearCards = () => {
    dispatch({
      type: "UPDATE_HILO_STATE",
      payload: {
        round: 1,
        cards: {},
      },
    });
  };

  const betStart = () => {
    if (beting) {
      return;
    }

    let cardsLength = Object.keys(cards).length;

    if (cardsLength !== 0) {
      clearCards();
      cardsLength = 0x0;
    }

    audio_handler.playSound("deal");

    setBeting(true);

    if (cardsLength === 0) {
      setCard(generateCard(), 0, 1);
    }
  };

  const skip = () => {
    if (!beting) {
      return;
    }

    audio_handler.playSound("flip");

    let cardsKeys = Object.keys(cards),
      lastIndex = cardsKeys[cardsKeys.length - 1],
      lastCard = cards[lastIndex];

    if (Object.keys(cards).length <= 1) {
      setCard(lastCard, 0, 1, null, false);
      setTimeout(() => {
        audio_handler.playSound("flip");
        setCard(generateCard(), 0, 1);
      }, 500);
    } else if (lastIndex !== 1) {
      setCard(generateCard(), 1, null, lastCard.profit);
    }
  };

  const lastCard = cards[Object.keys(cards)[Object.keys(cards).length - 1]];

  const handleCard = (isUp = null) => {
    if (!beting || isUp === null) {
      return;
    }

    let profit = parseFloat(
      ((lastCard.profit ?? 1) + (lastCard.profit ?? 1) * Math.random()).toFixed(
        2,
      ),
    );

    if (round >= 3 && Math.random() > 0.5) {
      profit -= profit;
    }

    if (profit === 0) {
      audio_handler.playSound("lose");
    } else {
      audio_handler.playSound("win");
    }

    let new_card = generateCard();

    setCard(new_card, profit === 0 ? 3 : 2, null, profit, profit !== 0);

    dispatch({
      type: "UPDATE_HILO_STATE",
      payload: {
        round: profit === 0 ? 1 : round + 1,
        gameover: profit === 0,
        upHandler: Object.assign({}, lastCard, {
          precentage: parseFloat((Math.random() * 100).toFixed(2)),
        }),
        downHandler: Object.assign({}, lastCard, {
          precentage: parseFloat((Math.random() * 100).toFixed(2)),
        }),
      },
    });

    if (profit === 0) {
      setBeting(false);
    }
  };

  const updateConstant = (type, data) => {
    dispatch({ type: "UPDATE_HILO_STATE", payload: { [type]: data } });
  };

  useEffect(() => {
    document.title = "RustySaloon ~ Hi-Lo";

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
  }, []);

  const GameContainer = () => (
    <div className="game-container">
      <div id="preview-cards" className="wrap-line">
        <div id="king-card" className="card-silence">
          <div className="square">
            <span>K</span>
            <img src="/images/arrow-up.svg" alt="" />
          </div>
          <div className="label-card">KING BEIGN THE HIGHEST</div>
        </div>
        <div className="center-cards-player">
          <div className="cards-behind">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={"main-card"}>
            <div
              className={"skip-button" + (!beting ? " diabled" : "")}
              onClick={() => skip()}
            >
              <img src="/images/new_form/skip.svg" alt="" />
            </div>
            <div
              className={
                "card-image" + (lastCard && lastCard.active ? " active" : "")
              }
            >
              <img
                className="card-poker"
                src={
                  lastCard
                    ? `/images/poker_cards/${lastCard.suit}${lastCard.value}.svg`
                    : ""
                }
                alt=""
              />
              <img
                draggable="false"
                className="default-card"
                src="/images/new_form/default-card.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div id="ace-card" className="card-silence">
          <div className="square">
            <span>A</span>
            <img src="/images/arrow-down.svg" alt="" />
          </div>
          <div className="label-card">ACE BEING THE LOWEST</div>
        </div>
      </div>
      <div className="bottom-content">
        <div
          className="cards-used"
          onLoad={(e) =>
            e.currentTarget.scrollTo(e.currentTarget.scrollWidth, 0)
          }
        >
          {cards &&
            Object.keys(cards).map((cardKey, index) => (
              <React.Fragment key={index}>
                {cards[cardKey].way > 0 && getImagePath(cards[cardKey].way) ? (
                  <div className="status-made">
                    <div className="wrap">
                      <img
                        src={`/images/new_form/${getImagePath(
                          cards[cardKey].way,
                        )}.svg`}
                        alt=""
                      />
                    </div>
                  </div>
                ) : null}
                <div
                  className={
                    "card-container" +
                    (index === Object.keys(cards).length - 1 ? " animate" : "")
                  }
                >
                  <div
                    className={
                      "card-poker" +
                      (cards[cardKey].way === 1 ? " skipped" : "")
                    }
                  >
                    <img
                      src={`/images/poker_cards/${cards[cardKey].suit}${cards[cardKey].value}.svg`}
                      alt=""
                    />
                  </div>
                  <div
                    className={
                      "status" +
                      (cards[cardKey].profit === 0
                        ? " lose"
                        : cards[cardKey].profit !== null
                        ? " win"
                        : "")
                    }
                  >
                    {cards[cardKey].profit !== null
                      ? `${cards[cardKey].profit
                          .toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })
                          .replace("$", "")}x`
                      : "Start Card"}
                  </div>
                </div>
              </React.Fragment>
            ))}
        </div>
        <div className="profit-details">
          <div className="form">
            <div className="label">Profit Higher (1.07x)</div>
            <div className="input">
              <div className="left">
                <img src="/images/arrow-up.svg" alt="" />
                <input type="text" readOnly={true} defaultValue={"15.43"} />
              </div>
              <img src="/images/diamond.svg" alt="" />
            </div>
          </div>
          <div className="form">
            <div className="label">Profit Lower (1.07x)</div>
            <div className="input">
              <div className="left">
                <img src="/images/arrow-down.svg" alt="" />
                <input type="text" readOnly={true} defaultValue={"10.43"} />
              </div>
              <img src="/images/diamond.svg" alt="" />
            </div>
          </div>
          <div className="form">
            <div className="label">Total Profit (1.00x)</div>
            <div className="input">
              <div className="left">
                <input type="text" readOnly={true} defaultValue={"10.43"} />
              </div>
              <img src="/images/diamond.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
      <div id="hilo" className={mobile ? "mobile" : ""}>
        <div className="container">
          <div className="wrap-styled">
            {loaded ? (
              <div className="wrap-line">
                {mobile ? <GameContainer /> : null}

                <div className="wrap-details-controller">
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
                            dispatch({
                              type: "UPDATE_HILO_STATE",
                              payload: {
                                beted:
                                  event.target.value &&
                                  String(event.target.value).match(
                                    /^[0-9]+$/,
                                  ) &&
                                  parseFloat(event.target.value) > 1
                                    ? parseFloat(event.target.value)
                                    : null,
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
                    className={"button" + (!beting ? " disabled" : "")}
                    onClick={() => handleCard(true)}
                  >
                    <span>
                      <span>Higher or Same</span>
                      <img
                        src="/images/new_form/arrow-bold-up-blue.svg"
                        alt=""
                      />
                      <span>({upHandler.precentage}%)</span>
                    </span>
                  </div>
                  <div
                    className={"button" + (!beting ? " disabled" : "")}
                    onClick={() => handleCard(false)}
                  >
                    <span>
                      <span>Lower or Same</span>
                      <img
                        src="/images/new_form/arrow-bold-up-purple.svg"
                        alt=""
                      />
                      <span>({downHandler.precentage}%)</span>
                    </span>
                  </div>
                  <div
                    className={"button" + (!beting ? " disabled" : "")}
                    onClick={() => beting && skip()}
                  >
                    <span>
                      <span>Skip Card</span>
                      <img src="/images/new_form/skip.svg" alt="" />
                    </span>
                  </div>
                  <div
                    className={
                      "button bet" + (beting || !beted ? " disabled" : "")
                    }
                    onClick={() => betStart()}
                  >
                    Bet
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
                {!mobile ? <GameContainer /> : null}
              </div>
            ) : (
              <div id="loader">
                <div className="looper"></div>
              </div>
            )}
          </div>
          <Activities />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HILO;
