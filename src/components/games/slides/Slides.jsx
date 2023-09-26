import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { store } from "../../../redux/store";
import { FairnessPanel } from "../../FairnessPanel";
import Footer from "../../Footer";
import Activities from "../../homepage/Activities";
import { BetSectionContainer } from "./BetSectionContainer";

export const SlidesGame = () => {
  const ulRef = useRef(null);
  const itemref = useRef(null);
  const dispatch = useDispatch();
  const {
    cardsSlide,
    tX,
    currentMultiplier,
    nextRound,
    showUp,
    spinning,
    pickedItemIndex,
    historyMultiplier,
    animationX,
  } = useSelector((state) => state.slide);

  const updateConstant = (type, data) => {
    dispatch({ type: "UPDATE_SLIDE_STATE", payload: { [type]: data } });
  };

  const randomCard = () => {
    updateConstant(
      "pickedItemIndex",
      Math.max(5, ~~(Math.random() * cardsSlide.length)),
    );
  };

  const resetAnimationCollcetor = () => {
    if (ulRef.current) {
      ulRef.current.style.transition = `0ms`;
      ulRef.current.style.transform = `translateX(0px)`;
      updateConstant("cardsSlide", cardsSlide);
      updateConstant("animationX", 0);
    }
  };

  const getColorByMultiplier = (multiplier, withdash = false) => {
    if (multiplier) {
      if (multiplier >= 2 && multiplier < 5) {
        return (withdash ? "-" : "") + "white";
      } else if (multiplier >= 5 && multiplier < 10) {
        return (withdash ? "-" : "") + "blue";
      } else if (multiplier >= 10 && multiplier < 100) {
        return (withdash ? "-" : "") + "yellow";
      } else if (multiplier >= 100) {
        return (withdash ? "-" : "") + "green";
      }
    }
    return "";
  };
  const setLineX = () => {
    const state = store.getState().slide;

    updateConstant("showUp", false);
    updateConstant("spinning", true);
    updateConstant("nextRound", null);
    updateConstant("spinningTime", Date.now());

    resetAnimationCollcetor();

    let parentWidth = ulRef.current?.parentElement.offsetWidth;
    let itemOffset = itemref.current?.offsetLeft;
    let itemWidth = itemref.current?.offsetWidth;

    let lineX = itemOffset + itemWidth / 2 - parentWidth / 2;

    console.log(cardsSlide[state.pickedItemIndex]);

    ulRef.current &&
      (ulRef.current.style.transition = `7s cubic-bezier(0.24, 0.78, 0.15, 1)`);

    // let randomOffset =
    //   ~~((parentWidth / 2 - itemWidth / 2) * 2) % (parentWidth - itemWidth * 2);
    let randomOffset = ~~(Math.random() * (itemWidth / 3 + itemWidth * 0.1));

    if (Math.random() > 0.5) {
      lineX = lineX + randomOffset;
    } else {
      lineX = lineX - randomOffset;
    }


    updateConstant("animationX", lineX);
  };

  useEffect(() => {
    document.title = "RustySaloon ~ Slide";

    randomCard();

    let intrvl = setInterval(() => {
      let state = store.getState().slide;

      let _nextRound = state.nextRound;

      if (_nextRound !== null && _nextRound >= 0 && !state.spinning) {
        let yT = _nextRound - 0.01;

        updateConstant("nextRound", yT > 0 ? yT : null);

        if (yT <= 0) {
          yT = 0x0;
          randomCard();
          setLineX();
        }
      }

      if (
        state.spinning &&
        _nextRound === null &&
        Date.now() - state.spinningTime >= 7100
      ) {
        updateConstant("showUp", true);
        updateConstant("spinning", false);
        updateConstant(
          "historyMultiplier",
          (state.historyMultiplier ?? []).concat([state.pickedItemIndex]),
        );
        setTimeout(() => {
          updateConstant("nextRound", 15);
        }, 1000);
      }
    }, 10);

    return () => {
      clearInterval(intrvl);
    };
  }, []);

  return (
    <Fragment>
      <FairnessPanel />
      <div id="slide-game">
        <div className="line-container">
          <BetSectionContainer />
          <div className="game-container">
            <div className="history-up">
              {historyMultiplier &&
                historyMultiplier.map((item, index) => (
                  <div
                    className={
                      "item" +
                      getColorByMultiplier(cardsSlide[item], true).replace(
                        /^-/,
                        " ",
                      )
                    }
                    key={index}
                  >
                    {cardsSlide[item].toFixed(2)}x
                  </div>
                ))}
            </div>
            <div
              className="center-cards"
              // onScroll={(e) => onScrollContainer(e.currentTarget)}
            >
              <div className="gradient-fade"></div>
              <div
                className="wrap-cards"
                data-current="0"
                ref={ulRef}
                style={{ transform: `translateX(-${animationX}px)` }}
              >
                {cardsSlide.map((card, index) => (
                  <div
                    ref={index === pickedItemIndex ? itemref : null}
                    className={
                      "wrap-card-slide" +
                      (index === pickedItemIndex && showUp ? " active" : "") +
                      (showUp
                        ? getColorByMultiplier(card, true).replace(/^-/, " ")
                        : "")
                    }
                    key={index}
                  >
                    <div className="top">
                      <img
                        src={`/images/new_form/slide-card${
                          index === pickedItemIndex && showUp
                            ? getColorByMultiplier(card, true)
                            : ""
                        }.svg`}
                        alt=""
                      />
                      <div className="multiplier">{card}x</div>
                    </div>
                    <div
                      className={
                        "hover" +
                        getColorByMultiplier(card, true).replace(/^-/, " ")
                      }
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="selector-slide">
              <img src="/images/new_form/slide-selector.svg" alt="" />
            </div>
            <div className="game-status">
              <div className="bets-count">
                <div className="status-circle"></div>
                <span className="count">Bets: 34</span>
              </div>

              <div className="count-down">
                {nextRound !== null
                  ? `Next round in: ${nextRound.toFixed(1)}s`
                  : "Starting..."}
              </div>
              <div className="progress-bar">
                <div
                  className="fill"
                  style={{
                    opacity: nextRound !== null ? 1 : 0,
                    width: `${
                      nextRound !== null ? ~~((nextRound / 15) * 100) : 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <Activities />
      </div>
      <Footer />
    </Fragment>
  );
};

export default SlidesGame;
