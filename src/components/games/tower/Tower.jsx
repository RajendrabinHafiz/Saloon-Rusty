import { useEffect } from "react";
import { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FairnessPanel } from "../../FairnessPanel";
import Activities from "../../homepage/Activities";
import { BetSectionContainer } from "./BetSectionContainer";
import toast from "react-hot-toast";
import { audio_handler } from "../../../utils/audio_handler";
import structuredClone from "@ungap/structured-clone";

export const TowerGame = () => {
  const dispatch = useDispatch();
  const { mobile } = useSelector((state) => state.main);
  const {
    cards,
    activeLine,
    beted,
    beting,
    difficulty,
    muted,
    loaded,
    towersMaxReward,
  } = useSelector((state) => state.towers);
  const [fairnessPanel, setFairnessPanel] = useState(false);

  const getCents = (price) => {
    let price_string = String(price);
    return `.${price_string.split(/\./)[0x1] ?? "00"}`;
  };

  const updateConstant = (type, data) => {
    dispatch({ type: "UPDATE_TOWERS_STATE", payload: { [type]: data } });
  };

  const calcReward = (towersLevel, level) => {
    return (1 / towersLevel ** level) * (1 - 0.03 * level);
  };

  const initTowerCards = (_betAmount, _difficulty = difficulty) => {
    if (typeof _betAmount !== "number") {
      return;
    }

    let betAmount = Math.max(_betAmount, 0.01);

    let output = [];

    for (let i = 1; i < 9; i++) {
      let towersLevel = null;

      if (_difficulty === 0x0) {
        towersLevel = 2 / 3;
      } else if (_difficulty === 0x1) {
        towersLevel = 1 / 2;
      } else if (_difficulty === 0x2) {
        towersLevel = 1 / 3;
      }

      let reward = parseFloat(
        (betAmount * calcReward(towersLevel, i)).toFixed(2),
      );

      if (reward > towersMaxReward) {
        break;
      } else {
        let insideArray = [
          { count: reward, action: 0x0 },
          { count: reward, action: 0x0 },
        ];

        if (_difficulty !== 0x1) {
          insideArray.push({ count: reward, action: 0x0 });
        }

        output.push(insideArray);
      }
    }
    updateConstant("cards", output.reverse());
  };

  const betStart = () => {
    if (beting) {
      // temp
      updateConstant("beting", false);
      updateConstant("beted", beted);
      updateConstant("activeLine", null);
      toast.error("Cashout not ready yet!");
      return;
    }

    if (beted < 0.01) {
      toast.error("Bet Amount must be 0.01 or more");
      return;
    }

    updateConstant("beting", true);
    updateConstant("activeLine", cards.length - 1);
  };

  const setTowerCard = (iline, icard) => {
    if (beting && activeLine === iline) {
      let towers = structuredClone(cards);
      let action = Math.random() > 0.3 ? 0x1 : 0x2;

      towers[iline][icard] = {
        count: towers[iline][icard].count,
        action: action,
      };

      updateConstant("cards", towers);

      action !== 0x0 &&
        !muted &&
        audio_handler.playSound(action === 0x1 ? "towers_win" : "towers_loss");

      let iactive = activeLine - 1;

      if (iactive < 0 || action === 0x2) {
        updateConstant("beting", false);
        updateConstant("beted", beted);
        updateConstant("activeLine", null);
        initTowerCards(beted);
      } else {
        updateConstant("activeLine", iactive);
      }
    }
  };

  useEffect(() => {
    document.title = "RustySaloon ~ Tower";

    (async () => {
      const loadAudios = await audio_handler.loadSounds([
        "towers_loss",
        "towers_win",
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
      <div id="tower-game" className={mobile ? " mobile" : ""}>
        <div className="line-container">
          {loaded ? (
            <>
              <BetSectionContainer
                setFairnessPanel={setFairnessPanel}
                betStart={betStart}
                initTowerCards={initTowerCards}
              />
              <div className="game-container">
                <div className="center-content">
                  {cards.map((tower, index) => (
                    <div
                      className={`wrap-line-game${
                        activeLine === index ? " active" : ""
                      }${difficulty === 0x1 ? " only-two" : ""}`}
                      key={index}
                    >
                      {tower.map((cardTower, itower) => (
                        <div
                          className={`card-inside${!beting ? " disabled" : ""}${
                            cardTower.action === 0x1 ? " active" : ""
                          }${cardTower.action === 0x2 ? " loss" : ""}`}
                          key={itower}
                          onClick={() =>
                            cardTower.action === 0x0 &&
                            setTowerCard(index, itower)
                          }
                        >
                          <div className="center">
                            <img src="/images/diamond.svg" alt="" />
                            <span>
                              {~~cardTower.count}
                              <span className="cent">
                                {getCents(cardTower.count)}
                              </span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
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

export default TowerGame;
