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
  const dispatch = useDispatch();
  const { cardsSlide, tX, currentMultiplier, nextRound, parcent, showUp } =
    useSelector((state) => state.slide);

  const updateConstant = (type, data) => {
    dispatch({ type: "UPDATE_SLIDE_STATE", payload: { [type]: data } });
  };

  const resetCards = () => {
    if (ulRef.current) {
      ulRef.current.style.transition = `transform 0ms`;
      ulRef.current.style.transform = `translateX(-165.9px)`;
    }
  };

  useEffect(() => {
    ulRef.current && ulRef.current.addEventListener("transitionend", (event) => {
      console.log("transitionend");
      updateConstant("showUp", true);
      updateConstant("nextRound", 10);
    });
    updateConstant("nextRound", 10);

    let intvl = setInterval(() => {
      let margin = 20;
      let width = 120;
      let state = store.getState().slide;
      var max_scroll = (width + margin) * (state.cardsSlide.length - 1) - width;

      let _tX = (state.tX + margin * margin) % max_scroll;

      if (_tX !== 0x0 && ulRef.current && state.spinning) {
        var current = parseInt(ulRef.current.dataset.current, 10);
        var card = document.getElementsByClassName("wrap-card-slide")[current];
        var new_card = card.cloneNode(true);
        ulRef.current.appendChild(new_card);
        ulRef.current.dataset.current = current + 1;
      }

      if (state.nextRound === null && !state.spinning) {
        updateConstant("showUp", false);
        updateConstant("spinning", true);

        let cardsLength =
          ((state.cardsSlide.length - 1) * (width + margin)) / width;

        let randomCard = ~~(Math.random() * cardsLength);

        console.log(
          state.cardsSlide[randomCard % state.cardsSlide.length],
          randomCard,
        );

        updateConstant(
          "currentMultiplier",
          randomCard % state.cardsSlide.length,
        );

        let anotherRotating = randomCard <= 30;

        resetCards();

        setTimeout(() => {
          ulRef.current &&
            (ulRef.current.style.transition = `transform 10000ms cubic-bezier(0.24, 0.78, 0.15, 1) 0s`);

          updateConstant(
            "tX",
            randomCard * width +
              randomCard * margin -
              cardsLength * 3.2 +
              (anotherRotating ? cardsLength * width + width : 0),
          );
        }, 100);
      }
    }, 10);

    let intvlCountDown = setInterval(() => {
      let _nextRound = store.getState().slide.nextRound;

      if (_nextRound !== null && _nextRound >= 0) {
        let yT = _nextRound - 0.01;

        if (yT <= 0) {
          yT = 0x0;
          updateConstant("spinning", false);
        }

        updateConstant("parcent", 100);

        updateConstant("nextRound", yT > 0 ? yT : null);
        updateConstant("parcent", ~~((yT / 10) * 100));
      }
    }, 1);

    return () => {
      clearInterval(intvl);
      clearInterval(intvlCountDown);
    };
  }, []);

  return (
    <Fragment>
      <FairnessPanel />
      <div id="slide-game">
        <div className="line-container">
          <BetSectionContainer />
          <div className="game-container">
            <div
              className="center-cards"
              // onScroll={(e) => onScrollContainer(e.currentTarget)}
            >
              <div className="gradient-fade"></div>
              <div
                className="wrap-cards"
                data-current="0"
                ref={ulRef}
                style={{ transform: `translateX(-${tX}px)` }}
              >
                {cardsSlide.map((card, index) => (
                  <div
                    className={
                      "wrap-card-slide" +
                      (currentMultiplier === index && showUp ? " active" : "")
                    }
                    key={index}
                  >
                    <div className="top">
                      <img src="/images/new_form/slide-card.svg" alt="" />
                      <div className="multiplier">{card}x</div>
                    </div>
                    <div className="hover"></div>
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
                    width: `${nextRound !== null ? parcent ?? 0 : 0}%`,
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
