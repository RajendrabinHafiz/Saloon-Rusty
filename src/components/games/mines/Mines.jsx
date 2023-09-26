import { useState } from "react";
import { useEffect } from "react";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { FairnessPanel } from "../../FairnessPanel";
import Activities from "../../homepage/Activities";
import { BetSectionContainer } from "./BetSectionContainer";
import structuredClone from "@ungap/structured-clone";
import { audio_handler } from "../../../utils/audio_handler";

const suits = ["a", "b", "c", "d", "e"];

export const Mines = () => {
  const dispatch = useDispatch();
  const { mobile } = useSelector((state) => state.main);
  const [fairnessPanel, setFairnessPanel] = useState(false);
  const {
    cards,
    betType,
    minesCount,
    numberOfbets,
    round,
    beting,
    lastStar,
    loaded,
    starsEarned,
    muted,
    cardsSelected,
    lastBet,
  } = useSelector((state) => state.mines);

  const updateConstant = (type, data) => {
    dispatch({ type: "UPDATE_MINES_STATE", payload: { [type]: data } });
  };

  const getById = (id) => {
    let idxs = getIndexes(id);
    return cards[idxs[0x0]][[idxs[0x1]]];
  };

  const getIndexes = (id) => {
    let iF = suits.indexOf(id[0x0]);
    return [iF, parseInt(id[1])];
  };

  const updateById = (id, data) => {
    let idxs = getIndexes(id);
    let mines_cards = structuredClone(cards);

    mines_cards[idxs[0x0]][idxs[0x1]] = Object.assign({}, getById(id), data);

    updateConstant("cards", mines_cards);

    return mines_cards;
  };

  const initCardsMines = () => {
    let output = [];

    for (let i = 0; i < 5; i++) {
      let row = [];

      for (let j = 0; j < 5; j++) {
        row.push({
          selectedBefore: false,
          multiplier: 0,
          earned: 0x0,
        });
      }

      output.push(row);
    }

    updateConstant("cards", output);
  };

  const openMinesCard = (id) => {
    // It should be connected with socket connection to update, but I'm goin to make it localy for now.
    if (getById(id).earned !== 0x0) {
      return;
    }

    let earned = Math.random() > 0.5 ? 0x1 : 0x2;

    let updates = updateById(id, {
      earned: earned,
      selectedBefore: earned === 0x1,
      multiplier:
        earned === 0x1 ? calculatePayoutRate(minesCount, starsEarned + 1) : 0,
    });

    !muted &&
      audio_handler.playSound(earned === 0x1 ? "mines_win" : "mines_loss");

    if (earned === 0x2) {
      updateConstant("beting", false);
      updateConstant("starsEarned", 0);
      updateConstant("round", 0x1);
      fillEmptyCards(updates);
    } else {
      updateConstant("lastStar", id);
      updateConstant("starsEarned", (starsEarned ?? 0) + 1);
    }
  };

  const calculatePayoutRate = (_mineCount, spacesCleared) => {
    if (!spacesCleared) return 0;
    let rate = 1;
    for (let i = 0; i < spacesCleared; i++) {
      let remainingSquareCount = 25 - i;
      let winProbability =
        (remainingSquareCount - _mineCount) / remainingSquareCount;
      rate *= 1 / winProbability;
    }
    const houseEdgeMultiplier = 1 - 5 / 100;
    rate *= houseEdgeMultiplier;
    return Math.floor(rate * 100) / 100;
  };

  const fillEmptyCards = (_cards = null) => {
    let mines_cards = structuredClone(_cards ?? cards);
    let _minesCount = Math.max(minesCount - 1, 0);
    let defaultCards = [];

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (mines_cards[i][j].earned === 0x0) {
          defaultCards.push([i, j]);
        }
      }
    }

    for (let i = 0; i < _minesCount; i++) {
      let randomIdx = Math.floor(Math.random() * defaultCards.length);
      let randomCard = defaultCards[randomIdx];
      mines_cards[randomCard[0]][randomCard[1]].earned = 0x2;
    }

    for (let j = 0x0; j < defaultCards.length; j++) {
      let defaultCard = defaultCards[j],
        data = mines_cards[defaultCard[0]][defaultCard[1]];

      data.earned === 0x0 &&
        (mines_cards[defaultCard[0]][defaultCard[1]].earned = 0x1);
    }
    updateConstant("cards", mines_cards);
  };

  useEffect(() => {
    document.title = "RustySaloon ~ Mines";

    let intr = setInterval(() => {
      if (beting && betType === 1 && lastBet && Date.now() - lastBet >= 1500) {
        if (numberOfbets !== 0x0 && round >= numberOfbets) {
          updateConstant("beting", false);
          updateConstant("starsEarned", 0);
          updateConstant("round", 0x1);
          return;
        }

        updateConstant("lastBet", Date.now());

        updateConstant("round", round + 0x1);

        let mines_cards = structuredClone(cards),
          failed = false;

        for (let selectedCard of cardsSelected) {
          let idxs = getIndexes(selectedCard);
          let earned = Math.random() < 0.5 ? 0x1 : 0x2;

          mines_cards[idxs[0x0]][idxs[0x1]].earned = earned;

          mines_cards[idxs[0x0]][idxs[0x1]].multiplier =
            earned === 0x1
              ? calculatePayoutRate(minesCount, starsEarned + 1)
              : 0;

          earned === 0x1 && updateConstant("lastStar", selectedCard);

          updateConstant(
            "starsEarned",
            earned === 0x1 ? (starsEarned ?? 0x0) + 1 : 0,
          );

          if (earned === 0x2) {
            failed = true;
          }
        }

        updateConstant("cards", mines_cards);

        !muted && audio_handler.playSound(!failed ? "mines_win" : "mines_loss");

        setTimeout(() => {
          initCardsMines();
        }, 1000);
      }
    }, 16);

    return () => {
      clearInterval(intr);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [betType, beting, cardsSelected, lastBet, numberOfbets, round]);

  useEffect(() => {
    (async () => {
      const loadAudios = await audio_handler.loadSounds([
        "mines_win",
        "mines_loss",
      ]);
      if (loadAudios) {
        updateConstant("loaded", true);
        initCardsMines();
      }
    })();
  }, []);

  const betStart = () => {
    if (beting) {
      updateConstant("round", 0x1);
      updateConstant("beting", false);
      updateConstant("starsEarned", 0);
      initCardsMines();
      return;
    }

    if (betType === 0x1 && cardsSelected.length === 0x0) {
      return;
    }

    initCardsMines();
    updateConstant("lastBet", Date.now());
    updateConstant("beting", true);
  };

  const cardClick = (id) => {
    if (!beting && betType === 0x1) {
      if (cardsSelected.includes(id)) {
        updateConstant(
          "cardsSelected",
          cardsSelected.filter((c) => c !== id),
        );
      } else {
        updateConstant("cardsSelected", [...cardsSelected, id]);
      }
    }

    if (beting && betType === 0x0) {
      openMinesCard(id);
    }
  };

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
      <div id="mines-game" className={mobile ? "mobile" : ""}>
        <div className="line-container">
          {loaded ? (
            <Fragment>
              <BetSectionContainer
                setFairnessPanel={setFairnessPanel}
                betStart={betStart}
                initCardsMines={initCardsMines}
                profit={lastStar ? getById(lastStar).multiplier : 0x1}
              />
              <div className="game-container">
                <div className="center-content">
                  {cards.map((wrap, index) => (
                    <div className="wrap-line-game" key={index}>
                      {wrap.map((row, irow) => (
                        <div
                          id={`${suits[index]}${irow}`}
                          onClick={() => cardClick(`${suits[index]}${irow}`)}
                          className={
                            "game-card-mines" +
                            (row.earned === 0x1
                              ? " win"
                              : row.earned === 0x2
                              ? " loss"
                              : "") +
                            (betType === 0x1 &&
                            cardsSelected.indexOf(`${suits[index]}${irow}`) >= 0
                              ? " selected"
                              : "")
                          }
                          key={irow}
                        >
                          <img
                            className={
                              "star-mines" +
                              (row.selectedBefore ? " active" : "")
                            }
                            src="/images/new_form/star-mines.svg"
                            alt=""
                          />
                          <img
                            className={"bomb-mines"}
                            src="/images/new_form/bomb.svg"
                            alt=""
                          />
                          <div
                            className={
                              "multiplier" +
                              (row.earned === 0x1 &&
                              lastStar === `${suits[index]}${irow}` &&
                              row.multiplier
                                ? " active"
                                : "")
                            }
                          >
                            {betType === 0x0 ? <>{row.multiplier}x</> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Fragment>
          ) : (
            <div id="loader">
              <div className="looper"></div>
            </div>
          )}
        </div>
        <Activities />
      </div>
    </Fragment>
  );
};

export default Mines;
