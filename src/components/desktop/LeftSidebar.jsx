import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderItem from "../HeaderItem";
var classNames = require("classnames");

export const menuItems = [
  {
    title: "House Games",
    icon: "/images/House-games-icon.svg",
    routes: [
      {
        icon: "roulette",
        label: "Roulette",
        link: "roulette",
      },
      {
        icon: "crash",
        label: "Crash",
        link: "crash",
      },
      {
        icon: "50x",
        label: "50X",
        link: "50x",
      },
      {
        icon: "towers",
        label: "Towers",
        link: "tower",
      },
      {
        icon: "dice",
        label: "Dice",
        link: "dice",
      },
      {
        icon: "mines",
        label: "Mines",
        link: "mines",
      },
      {
        icon: "plinko",
        label: "Plinko",
        link: "plinko",
      },
      {
        icon: "blackjack",
        label: "Blackjack",
        link: "blackjack",
      },
      {
        icon: "hilo",
        label: "Hi-Lo",
        link: "hilo",
      },
      {
        icon: "keno",
        label: "Keno",
        link: "keno",
      },
      {
        icon: "baccarat",
        label: "Baccarat",
        link: "baccarat",
      },
      {
        icon: "video-poker",
        label: "Video Poker",
        link: "video-poker",
      },
      {
        icon: "slide",
        label: "Slide",
        link: "slide",
      },
    ],
  },
];

export const LeftSidebar = () => {
  const dispatch = useDispatch();
  const { sidebarHidden, mobile } = useSelector((state) => state.main);
  // const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [tasksHidden, setHiddenTask] = useState(
    Object.assign(
      {},
      ...menuItems.map((_, i) => {
        return { [i]: false };
      }),
    ),
  );

  const setIsExpanded = (hidden) => {
    localStorage.setItem("sidebarHidden", hidden);
    dispatch({
      type: "UPDATE_MAIN_STATE",
      payload: {
        sidebarHidden: hidden,
      },
    });
  };

  return (
    <div
      id="lsidebar"
      className={
        (mobile ? "mobile " : "") +
        (!sidebarHidden ? "active" : "hide-elements")
      }
    >
      {!mobile && sidebarHidden ? (
        <div
          className="section-bring-back"
          onClick={() => setIsExpanded(false)}
        >
          <img
            draggable="false"
            src="/images/new_form/arrow-right.svg"
            alt=""
          />
        </div>
      ) : null}

      <div className="sidebar-container">
        <div className="header-container">
          <div className="logo-siebar" onClick={() => navigate("/")}>
            <img
              draggable="false"
              className="header___link--logo--img"
              src={process.env.PUBLIC_URL + "/images/logo.png"}
              alt="logo"
            />
          </div>
          <button
            id="sidebar-hider"
            className="lsidebar-hider header-button"
            onClick={() => setIsExpanded(!sidebarHidden)}
          >
            <img
              draggable="false"
              src={
                sidebarHidden
                  ? "/images/chevron-right.svg"
                  : "/images/left-carrot.svg"
              }
              alt=""
            />
          </button>
        </div>
        <div className="lsidebar-divider">
          <div className="divider"></div>
        </div>

        {menuItems.map((item, index) => (
          <div className="games-container" key={index}>
            <div
              className="house-games"
              onClick={() =>
                setHiddenTask(
                  Object.assign({}, tasksHidden, {
                    [index]: !tasksHidden[index],
                  }),
                )
              }
            >
              <div className="games__title">
                <img
                  draggable="false"
                  className="menuimg-title"
                  alt=""
                  src={item.icon}
                />
                {item.title}
              </div>
              <img
                draggable="false"
                className="down-arrow"
                alt=""
                src={
                  tasksHidden[index]
                    ? "/images/chevron-down.svg"
                    : "/images/left-carrot.svg"
                }
              />
            </div>

            <ul className="sitems">
              {item.routes.map(
                (obj, i) =>
                  !tasksHidden[index] && (
                    <li key={i} id={`mel${i}`}>
                      <div
                        onClick={() => {
                          navigate("/" + obj.link);
                          mobile && setIsExpanded(true);
                        }}
                      >
                        <div
                          className={classNames({
                            icon: true,
                            "micon-active":
                              location.pathname === "/" + obj.link ||
                              (obj.link === "roulette" &&
                                location.pathname === "/"),
                          })}
                        >
                          <img
                            draggable="false"
                            className="menuimg"
                            src={`/images/${obj.icon}.svg`}
                            alt=""
                          />
                          <div className="label">{obj.label}</div>
                        </div>
                      </div>
                    </li>
                  ),
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
