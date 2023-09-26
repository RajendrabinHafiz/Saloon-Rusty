import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
let arrowRight = "/images/arrow-right.svg";
let arrowLeft = "/images/arrow-left.svg";

export const SwitcherPage = ({
  titlebar: { icon, title },
  cards,
  notReady,
  commingSoon,
}) => {
  const navigate = useNavigate();
  const { mobile } = useSelector((state) => state.main);
  const [viewX, setViewX] = useState(0);
  const nextButtonRef = useRef(null);
  const prevButtonRef = useRef(null);

  const [viewAll, setViewAll] = useState(false);
  const [swiper, setSwiper] = useState();

  const _title = (title || "").replace(/\s/, "").toLowerCase();

  useEffect(() => {
    if (swiper && !notReady && swiper.navigation) {
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [notReady, swiper]);

  const nextId = Date.now().toString(36).replace(/[0-9]/g, "");
  const prevId = Date.now().toString(36).replace(/[0-9]/g, "");

  return (
    <div id="switcher-page">
      <div className="cards-content">
        <div className="selector">
          <div className="title">
            <img draggable="false" src={icon} alt={title} />
            <span>{title}</span>
            {commingSoon ? (
              <span className={"coming" + (mobile ? " mobile" : "")}>
                COMING SOON
              </span>
            ) : null}
          </div>
          <div className="buttons-content">
            {!mobile ? (
              <div
                className="showall button"
                onClick={() => !notReady && setViewAll(!viewAll)}
              >
                {!viewAll ? "View All" : "View Less"}
              </div>
            ) : null}
            <div className="prv-new-buttons">
              <div
                id={prevId}
                className={
                  "prev" +
                  (notReady || viewAll ? " swiper-button-disabled" : "")
                }
                ref={prevButtonRef}
                onClick={() => !notReady && !viewAll && setViewX(viewX)}
              >
                <img draggable="false" src={arrowLeft} alt="" />
              </div>
              <div
                ref={nextButtonRef}
                id={nextId}
                className={
                  "next" +
                  (notReady || viewAll ? " swiper-button-disabled" : "")
                }
                onClick={() => !notReady && !viewAll && setViewX(-viewX)}
              >
                <img draggable="false" src={arrowRight} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            "cards-container-swiper" +
            (notReady ? " notactive" : viewAll ? " view-all" : "")
          }
        >
          {!viewAll ? (
            <Swiper
              slidesPerView="auto"
              spaceBetween={0}
              pagination={{
                clickable: true,
              }}
              onSwiper={setSwiper}
              modules={[Navigation, Pagination]}
              className="swiper-mine"
              navigation={{
                nextEl: notReady || viewAll ? null : nextButtonRef.current,
                prevEl: notReady || viewAll ? null : prevButtonRef.current,
              }}
              onSlideChange={({ realIndex }) => {
                setViewX(realIndex);
              }}
            >
              {cards.map((card, index) => (
                <SwiperSlide key={index}>
                  <div
                    onClick={() => !notReady && navigate(card.path)}
                    className="card-swiper"
                    title={card.title}
                    style={{ backgroundImage: `url(${card.background})` }}
                  >
                    <div className="hover-wrap">
                      <div className="card-title">{card.title}</div>
                      <div className="play-button">
                        <img draggable="false" src="/images/play.svg" alt="" />
                      </div>
                      <div className="game-type">{title}</div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            cards.map((card, index) => (
              <div
                className="card-swiper"
                title={card.title}
                style={{ backgroundImage: `url(${card.background})` }}
                key={index}
                onClick={() => !notReady && navigate(card.path)}
              >
                <div className="hover-wrap">
                  <div className="card-title">{card.title}</div>
                  <div className="play-button">
                    <img draggable="false" src="/images/play.svg" alt="" />
                  </div>
                  <div className="game-type">{title}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
