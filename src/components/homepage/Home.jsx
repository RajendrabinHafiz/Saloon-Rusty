import React, { useEffect, useState } from "react";

import { SwitcherPage } from "../SwiperPage";

import Activities from "./Activities";

import hourGlass from "../../assets/img/hourglass.svg";
import cloudRaining from "../../assets/img/cloud-raining.svg";
import manwithdiamonds from "../../assets/img/manwithdiamonds.svg";
import { useSelector } from "react-redux";

const PageContent = () => {
  const cardRef = React.useRef(null);
  const textRef = React.useRef(null);
  const [hideText, setHideText] = useState(false);
  const [diamondMan, setDiamondMan] = useState(true);
  const { mobile } = useSelector((state) => state.main);

  useEffect(() => {
    let inteval = setInterval(() => {
      const text = textRef.current;

      if (text) {
        let cardWidth = cardRef.current.getBoundingClientRect().width ?? 0x0,
          textWidth = text.getBoundingClientRect().width ?? 0x0;
        if (cardWidth < 702 && diamondMan) {
          setDiamondMan(false);
        } else if (cardWidth > 702 && !diamondMan) {
          setDiamondMan(true);
        }

        if (textWidth <= 226 && !hideText) {
          setHideText(true);
        } else if (textWidth > 226 && hideText) {
          setHideText(false);
        }
      }
    }, 16);

    return () => {
      clearInterval(inteval);
    };
  }, [hideText, diamondMan]);

  const TimeCountDown = () => (
    <div className="timer-wrap mdl">
      <div className="text">
        <img draggable="false" src={hourGlass} alt="" />
        <span>4min 34sec</span>
      </div>
    </div>
  );

  return (
    <div className="home-page">
      <div id="rain-card-stl" className={mobile ? "mobile" : ""} ref={cardRef}>
        <div className="left-side">
          <div className="icon-wrap mdl">
            <div className="circle">
              <img draggable="false" src={cloudRaining} alt="cloud-raining" />
            </div>
          </div>
          {hideText ? null : (
            <div
              className="text-wrap mdl"
              ref={textRef}
              style={{ display: hideText ? "none" : "block" }}
            >
              <div className="title">RAIN - Bet to earn free money!</div>
              <div className="description">
                You must be at least level 5 to join rain. Half the pot is
                distributed by level, and the other half distributed equally.
              </div>
            </div>
          )}
        </div>
        <div className="right-side">
          {mobile ? <TimeCountDown /> : null}
          <div className="swip-wrap mdl">
            <div className="amount">
              <img draggable="false" src="/images/diamond.svg" alt="" />
              <div className="amount-text">2,500.00</div>
            </div>
            <div className="button">Tip Rain</div>
          </div>

          {!mobile ? <TimeCountDown /> : null}

          <div className="man-wrap" style={!diamondMan ? { width: "5px" } : {}}>
            {diamondMan ? (
              <img draggable="false" src={manwithdiamonds} alt="" />
            ) : null}
          </div>
        </div>
      </div>
      <SwitcherPage
        titlebar={{
          title: "House Games",
          icon: "/images/House-games-icon.svg",
        }}
        cards={[
          {
            title: "Roulette",
            background: "/images/frontroulette.png",
            path: "/roulette",
          },
          {
            title: "Dice",
            background: "/images/frontdice.png",
            path: "/dice",
          },
          {
            title: "Crash",
            background: "/images/frontcrash.png",
            path: "/crash",
          },
          {
            title: "Mines",
            background: "/images/mines.png",
            icon: "",
            path: "/mines",
          },
          {
            title: "Keno",
            background: "/images/keno.png",
            icon: "",
            path: "/keno",
          },
          {
            title: "Blackjack",
            background: "/images/Blackjack.png",
            icon: "",
            path: "/blackjack",
          },
          {
            title: "Slide",
            background: "/images/Slide.png",
            icon: "",
            path: "/slide",
          },
          {
            title: "Video Poker",
            background: "/images/Video-Poker.png",
            icon: "",
            path: "/videopoker",
          },
          {
            title: "Upgrader",
            background: "/images/Upgrader.png",
            icon: "",
            path: "/upgrader",
          },
          {
            title: "Andar Bahar",
            background: "/images/Andar-Bahar.png",
            icon: "",
            path: "/andarbahar",
          },
          {
            title: "Baccarat",
            background: "/images/Baccarat.png",
            icon: "",
            path: "/slide",
          },
          {
            title: "Plinko",
            background: "/images/Plinko.png",
            icon: "",
            path: "/plinko",
          },
          {
            title: "50x",
            background: "/images/Wheel-of-fortune.png",
            icon: "",
            path: "/50x",
          },
          {
            title: "Tower",
            background: "/images/towers-card.svg",
            icon: "",
            path: "/towers",
          },
          {
            title: "",
            background: "/images/real-slots-card.svg",
            icon: "",
            path: "/real-slots",
          },
        ]}
        notReady={false}
      />

      <SwitcherPage
        notReady={true}
        commingSoon={true}
        titlebar={{
          title: "Slots",
          icon: "/images/slots-icon.svg",
        }}
        cards={[
          {
            title: "",
            background: "/images/sweet.png",
            path: "/sweet",
          },
          {
            title: "",
            background: "/images/dork.png",
            path: "/dork",
          },
          {
            title: "",
            background: "/images/uglydragon.png",
            path: "/uglydragon",
          },
          {
            title: "",
            background: "/images/emo.png",
            icon: "",
            path: "/bookofshadow",
          },
          {
            title: "",
            background: "/images/gates.png",
            icon: "",
            path: "/gatesolympus",
          },
          {
            title: "",
            background: "/images/monkey.png",
            icon: "",
            path: "/outlaws",
          },
        ]}
      />

      <Activities />
    </div>
  );
};
export default PageContent;
