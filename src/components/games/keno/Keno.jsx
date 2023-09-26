import { useEffect, useRef, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { FairnessPanel } from "../../FairnessPanel";
import Footer from "../../Footer";
import Activities from "../../homepage/Activities";
import { BetSectionContainer } from "./BetSectionContainer";
import structuredClone from "@ungap/structured-clone";
import { store } from "../../../redux/store";
import { risksPayout, risksPs } from "./risk";
import toast from "react-hot-toast";
const charIndexes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

export const Keno = () => {
  const dispach = useDispatch();
  const parentCardsElement = useRef(null);
  const [profitPanel, setProfitPanel] = useState(false);
  const [fairnessPanel, setFairnessPanel] = useState(false);
  const {
    cards,
    difficulty,
    payoutWon,
    beting,
    betType,
    beted,
    lastBet,
    widthCard,
    numberOfbets,
    round,
  } = useSelector((state) => state.keno);

  const updateConstant = (type, data) => {
    dispach({
      type: "UPDATE_KENO_STATE",
      payload: {
        [type]: data,
      },
    });
  };

  const initKenoCards = (
    keepSelected = false,
    updateOne = null,
    useThiscards = null,
  ) => {
    let knar = [];

    for (let j = 0; j < 40; j++) {
      knar.push({
        id: j,
        selected:
          (useThiscards
            ? !!useThiscards[j] && useThiscards[j]
            : !!cards[j] && cards[j]
          )?.selected && keepSelected
            ? true
            : false,
        key: j,
        earned: 0x0,
      });
    }

    updateConstant("payoutWon", null);

    updateOne &&
      (knar[updateOne.id] = { ...knar[updateOne.id], ...updateOne.data });

    updateConstant("cards", knar);
  };

  useEffect(() => {
    document.title = "RustySaloon ~ Keno";
    initKenoCards();
  }, []);

  const kenoParts = () => {
    let cards_line = [];
    let cards_line_temp = [];

    let _icard = 0x1;

    for (let kcard of cards) {
      if (_icard >= cards.length / 5) {
        cards_line.push(cards_line_temp);
        cards_line_temp = [];
        _icard = 1;
      }

      cards_line_temp.push(kcard);

      _icard++;
    }

    return cards_line;
  };

  const updateKenoCard = (id, data) => {
    let _cards = structuredClone(cards);
    let changed = false;

    if (_cards && id in _cards) {
      _cards[id] = Object.assign({}, _cards[id] ?? {}, data);
      changed = true;
    }

    changed && updateConstant("cards", _cards);
  };

  const getSelectedCards = (lengthOnly = false, sorted = false) => {
    let selectedCards = [];
    cards.forEach((card) => {
      if (card.selected) {
        selectedCards.push(card);
      }
    });
    return lengthOnly
      ? selectedCards.length
      : sorted
      ? selectedCards.sort((a, b) => a.key - b.key)
      : selectedCards;
  };

  const checkCanSelect = () => {
    let selectedCards = getSelectedCards();
    return selectedCards.length < 10;
  };

  const clickKenoCard = (card) => {
    if (
      beting ||
      (getSelectedCards().length >= 10 && !cards[card.id].selected)
    ) {
      return;
    }

    initKenoCards(true, {
      id: card.id,
      data: { selected: !card.selected },
    });
  };

  const kenoStyle = {
    gridTemplateColumns: `repeat(${getSelectedCards(true) + 1}, 1fr)`,
  };

  const getShuffledArr = (arr) => {
    const newArr = arr.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr;
  };

  const StartRandom = (j, callback = null) => {
    let timestamp = Date.now();

    let intervel = setInterval(() => {
      if (Date.now() - timestamp >= 200) {
        let _cards = structuredClone(store.getState().keno.cards);
        let random_cards = getShuffledArr(_cards);
        let _selectedCardsIndexes = [];

        for (let i = 0; i < _cards.length; i++) {
          let card = _cards[i];
          if (card.selected) {
            _selectedCardsIndexes.push(i);
          }
        }

        timestamp = Date.now();

        let _card = random_cards[~~(Math.random() * random_cards.length)];

        if (_cards[_card.key - 1].earned === 0x0) {
          let earned = _selectedCardsIndexes.includes(_card.key - 1) ? 1 : 2;

          _cards[_card.key - 1] = Object.assign({}, _cards[_card.key - 1], {
            earned: earned,
          });

          if (earned === 1) {
            let totalEarned = 0x0;

            for (let __card of _cards) {
              if (__card.selected && __card.earned === 1) {
                totalEarned++;
              }
            }

            updateConstant("payoutWon", totalEarned);
          }

          updateConstant("cards", _cards);

          j++;
        }
      }

      if (j >= 10) {
        if (callback) {
          callback();
        } else {
          updateConstant("lastBet", null);
          updateConstant("beting", false);
        }

        clearInterval(intervel);
        return;
      }
    }, 16);
  };
  const betStart = () => {
    let j = 0x0;

    if (beting || getSelectedCards(true) < 1) {
      if (beted && beting && betType === 0x1) {
        j = 10;
        updateConstant("beting", false);
        return;
      } else {
        return;
      }
    }

    updateConstant("lastBet", Date.now());

    updateConstant("beting", true);

    initKenoCards(true);

    if (betType === 0x1) {
      return;
    }

    StartRandom(j);
  };

  const getRiskType = () => {
    if (difficulty === 0x0) {
      return "classic";
    } else if (difficulty === 0x1) {
      return "low";
    } else if (difficulty === 0x2) {
      return "medium";
    } else if (difficulty === 0x3) {
      return "high";
    }
  };

  const autoPick = () => {
    if (beting) {
      toast.error("You can't do auto pick while betting");
      return;
    }

    let j = 0x0,
      timestamp = Date.now();

    let intervel = setInterval(() => {
      if (Date.now() - timestamp >= 200) {
        let _cards = structuredClone(store.getState().keno.cards);
        let random_cards = getShuffledArr(_cards);

        timestamp = Date.now();

        let _card = random_cards[~~(Math.random() * random_cards.length)];

        if (j === 0x0 && getSelectedCards(true) !== 0x0) {
          for (let i = 0; i < _cards.length; i++) {
            let card = _cards[i];
            if (card.selected || card.earned !== 0x0) {
              _cards[i] = Object.assign({}, _cards[i], {
                selected: false,
                earned: 0,
              });
            }
          }
        }

        if (!_cards[_card.key - 1].selected) {
          _cards[_card.key - 1] = Object.assign({}, _cards[_card.key - 1], {
            selected: true,
          });

          updateConstant("cards", _cards);
          j++;
        }
      }

      if (j >= 10) {
        updateConstant("beting", false);
        clearInterval(intervel);
        return;
      }
    }, 16);
  };

  useEffect(() => {
    let betFinished = true;

    let intr = setInterval(() => {
      const state = store.getState().keno;

      if (
        betFinished &&
        state.beting &&
        state.betType === 1 &&
        state.lastBet &&
        Date.now() - state.lastBet >= 1000
      ) {
        if (state.numberOfbets !== 0x0 && state.round >= state.numberOfbets) {
          updateConstant("beting", false);
          updateConstant("round", 0x0);
          return;
        }

        updateConstant("round", state.round + 1);

        updateConstant("lastBet", Date.now());

        betFinished = false;

        StartRandom(0x0, () => {
          initKenoCards(true, null, state.cards);
          setTimeout(() => {
            betFinished = true;
          }, 500);
        });
      }

      try {
        let parentElements = parentCardsElement.current;

        if (parentElements) {
          let cardWidth = parentElements.getBoundingClientRect().width / 8 - 20;
          console.log(cardWidth);
          if (cardWidth !== widthCard) {
            updateConstant("widthCard", Math.abs(cardWidth));
          }
        }
      } catch (e) {
        console.log(e);
      }
    }, 16);

    return () => {
      clearInterval(intr);
    };
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
      <div className="page-content">
        <div id="keno-game">
          <div className="game-container">
            <div className="line-container">
              <BetSectionContainer
                selectedCards={getSelectedCards(true)}
                betStart={betStart}
                autoPick={autoPick}
                clearTable={initKenoCards}
                setFairnessPanel={setFairnessPanel}
              />
              <div className="game-content-inside" ref={parentCardsElement}>
                <div className="keno-cards">
                  <div
                    className="card-section"
                    
                  >
                    {cards.map((card, icard) => (
                      <div
                        className={
                          "card-keno" +
                          (card.selected
                            ? " selected"
                            : !checkCanSelect() || beting
                            ? " disabled"
                            : "") +
                          (card.earned === 0x1
                            ? " win"
                            : card.earned === 0x2
                            ? " lose"
                            : "")
                        }
                        key={icard}
                        onClick={() => clickKenoCard(card)}
                      >
                        <span className="count">{card.key + 1}</span>
                      </div>
                    ))}
                  </div>

                  {/* kenoParts() */}
                  {/* {cards.map(
                    (line, index) =>
                      index <= 40 && (
                        <div className="card-section" key={index}>
                          {line.map((card, icard) => (
                            <div
                              className={
                                "card-keno" +
                                (card.selected
                                  ? " selected"
                                  : !checkCanSelect() || beting
                                  ? " disabled"
                                  : "") +
                                (card.earned === 0x1
                                  ? " win"
                                  : card.earned === 0x2
                                  ? " lose"
                                  : "")
                              }
                              key={icard}
                              onClick={() => clickKenoCard(card)}
                            >
                              <span className="count">{card.key + 1}</span>
                            </div>
                          ))}
                        </div>
                      ),
                  )} */}
                </div>
                <div className="payout-details">
                  {getSelectedCards(true) === 0x0 ? (
                    <div className="non-selected">
                      <span>Select 1 - 10 numbers to play</span>
                    </div>
                  ) : (
                    <div className="bottom-section">
                      {profitPanel && typeof profitPanel === "object" ? (
                        <div className="payout-user">
                          <div className="input-form">
                            <div className="label">Payout</div>
                            <div className="input">
                              <input
                                type="text"
                                defaultValue={profitPanel[0x0].toFixed(2)}
                                readOnly={true}
                              />
                              <div className="right">X</div>
                            </div>
                          </div>

                          <div className="input-form">
                            <div className="label">Profit on Win</div>
                            <div className="input">
                              <input
                                type="text"
                                defaultValue={profitPanel[0x1].toFixed(2)}
                                readOnly={true}
                              />
                              <img
                                src="/images/diamond.svg"
                                alt=""
                                className="right"
                              />
                            </div>
                          </div>

                          <div className="input-form">
                            <div className="label">Chance</div>
                            <div className="input">
                              <input
                                type="text"
                                defaultValue={profitPanel[0x2].toFixed(8)}
                                readOnly={true}
                              />
                              <img
                                src="/images/new_form/parcent.svg"
                                alt=""
                                className="right"
                              />
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div className="line-wrap multipliers" style={kenoStyle}>
                        {risksPayout[getRiskType()][
                          getSelectedCards(true) - 1
                        ].map((payout, index) => (
                          <div className="multiplier-count" key={index}>
                            {payout.payout.toFixed(2)}x
                          </div>
                        ))}
                      </div>
                      <div className="line-wrap kenos" style={kenoStyle}>
                        {risksPayout[getRiskType()][
                          getSelectedCards(true) - 1
                        ].map((_p, index) => (
                          <div
                            onMouseLeave={() => setProfitPanel(false)}
                            onMouseEnter={() => {
                              setProfitPanel([
                                _p.payout,
                                beted * _p.payout,
                                Math.min(
                                  95,
                                  risksPs[getSelectedCards(true)][index] * 100,
                                ),
                              ]);
                            }}
                            className={
                              "keno-gem" +
                              (payoutWon !== null && index === payoutWon
                                ? " active"
                                : "")
                            }
                          >
                            <span>{index}x</span>
                            <img src="/images/new_form/keno-coin.svg" alt="" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Activities />
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Keno;
