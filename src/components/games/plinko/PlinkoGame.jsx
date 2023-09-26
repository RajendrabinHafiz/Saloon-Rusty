import Footer from "../../Footer";
import Activities from "../../homepage/Activities";
import { BetSectionContainer } from "./BetSectionGame";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { plinkoCanvas } from "./utils/core";
import { risksPayout } from "./utils/risks";
import { FairnessPanel } from "../../FairnessPanel";
import { store } from "../../../redux/store";
import toast from "react-hot-toast";

export const getTypeOfDifficulty = (index) => {
  switch (index) {
    case 0x0:
      return "low";
    case 0x1:
      return "medium";
    case 0x2:
      return "high";
    default:
      return "low";
  }
};

export const clearAllAnimations = () => {
  let elementsCards = document.getElementsByClassName("multiplier-small-card");

  for (let i = 0; i < elementsCards.length; i++) {
    elementsCards[i].style.animation = "";
  }
};

export const PlinkoGame = () => {
  const dispach = useDispatch();
  const [fairnessPanel, setFairnessPanel] = useState(false);
  const [multiplierWidth, setMultiplierWidth] = useState(0);
  const { beting, betType, currentMultiplier, multipliersHistory, difficulty } =
    useSelector((state) => state.plinko);

  const updateConstant = (type, data) => {
    dispach({
      type: "UPDATE_PLINKO_STATE",
      payload: {
        [type]: data,
      },
    });
  };

  useEffect(() => {
    plinkoCanvas.initElement("plinko-canvas-container");
    plinkoCanvas.initWorld();

    setMultiplierWidth(
      Math.max(
        (plinkoCanvas.canvas.width - 200) / (plinkoCanvas.linesGame + 2),
        0,
      ),
    );

    return () => {
      clearAllAnimations();
      plinkoCanvas.clearWorld();
    };
  }, []);

  const linesChange = (lines) => {
    if (beting) {
      return toast.error("You can't change lines while beting");
    }
    plinkoCanvas.passed = false;
    plinkoCanvas.clearWorld();
    setTimeout(() => {
      plinkoCanvas.linesGame = parseInt(lines) ?? 0x0;

      if (plinkoCanvas.linesGame >= 8 && plinkoCanvas.linesGame <= 11) {
        plinkoCanvas.circlesSize = 8;
        plinkoCanvas.ballSize = 10;
      } else {
        plinkoCanvas.circlesSize = 5;
        plinkoCanvas.ballSize = 7;
      }

      setMultiplierWidth(
        Math.max(
          (plinkoCanvas.canvas.width - 200) / (plinkoCanvas.linesGame + 2),
          0,
        ),
      );

      plinkoCanvas.initWorld();
    }, 10);
  };

  const getColorByMultiplier = (multiplier, withdash = false) => {
    if (multiplier) {
      if (multiplier < 2) {
        return (withdash ? "-" : "") + "hidden-color";
      } else if (multiplier >= 2 && multiplier < 5) {
        return (withdash ? "-" : "") + "blue";
      } else if (multiplier >= 5 && multiplier < 10) {
        return (withdash ? "-" : "") + "green";
      } else if (multiplier >= 10 && multiplier < 100) {
        return (withdash ? "-" : "") + "red";
      } else if (multiplier >= 100) {
        return (withdash ? "-" : "") + "yellow";
      }
    }
    return "";
  };

  useEffect(() => {
    let element = document.getElementById(
      "multiplier-" + Math.abs(~~currentMultiplier - 1),
    );

    if (element) {
      element.style.animation = "bomb 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)";
    }
  }, [currentMultiplier]);

  const betStart = () => {
    if (betType === 1) {
      if (!beting) {
        updateConstant("roundEnded", true);
        updateConstant("beting", true);
      } else {
        updateConstant("beting", false);
      }
      return;
    }

    updateConstant("beting", true);

    setTimeout(() => {
      plinkoCanvas.addCircle();
    }, 500);
  };

  useEffect(() => {
    document.title = "RustySaloon ~ Plinko";
    let intr = setInterval(() => {
      let state = store.getState().plinko;

      if (state.beting && state.betType === 1 && state.roundEnded) {
        if (state.numberOfbets !== 0x0 && state.round >= state.numberOfbets) {
          updateConstant("roundEnded", false);
          updateConstant("beting", false);
          updateConstant("round", 0);
          return;
        }

        updateConstant("round", state.round + 0x1);
        updateConstant("roundEnded", false);

        plinkoCanvas.addCircle();
      }
    }, 16);

    return () => {
      clearInterval(intr);
    };
  }, []);

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
      <div id="plinko-game">
        <div className="game-container">
          <div className="line-container">
            <BetSectionContainer
              betStart={betStart}
              linesChange={linesChange}
              setFairnessPanel={setFairnessPanel}
            />
            <div className="game-content-inside">
              <div id="multiplier-history">
                {multipliersHistory.map((multiplier, index) => (
                  <div
                    className={
                      "multiplier-history-item" +
                      getColorByMultiplier(multiplier, true).replace(/^-/, " ")
                    }
                    key={index}
                  >
                    {multiplier}x
                  </div>
                ))}
              </div>
              <div id="plinko-canvas-container">
                <canvas id="plinko-canvas"></canvas>
                <div className="multiplier-section">
                  {risksPayout[getTypeOfDifficulty(difficulty)][
                    plinkoCanvas.linesGame
                  ].map((multiplier, index) => (
                    <div
                      key={index + difficulty}
                      id={`multiplier-${index}`}
                      className={
                        "multiplier-small-card" +
                        getColorByMultiplier(multiplier, true).replace(
                          /^-/,
                          " ",
                        )
                      }
                      style={{
                        width: multiplierWidth + "px",
                      }}
                    >
                      {multiplier}x
                    </div>
                  ))}
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

export default PlinkoGame;
