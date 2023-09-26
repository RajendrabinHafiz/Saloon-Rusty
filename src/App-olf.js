import React, { createRef, useEffect, useState } from "react";
import { socket } from "./Socket";
import { Routes, Route, HashRouter } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { setInited } from "./redux/ducks/app";
import { updateBalance } from "./redux/ducks/profile";
import { TaskBarMobile } from "./components/desktop/TaskBarMobile";
import classnames from "classnames";
import WithdrawDepositRoute from "./routes/WithdrawDepositRoute";
import StateTestRoute from "./routes/StateTestRoute";
import Chat from "./components/ChatBar";
import Ban from "./components/Ban";
import Loader from "./components/Loader";

import MainHeader from "./components/desktop/Header";
import { LeftSidebar } from "./components/desktop/LeftSidebar";

import DepositPopup from "./components/cashier/DepositPopup";
import WithdrawPopup from "./components/cashier/WithdrawPopup";

import { setWithdrawOk } from "./redux/ducks/profile";
import { useSelector, useDispatch } from "react-redux";

import { LoaderScreen } from "./components/LoaderScreen";

import "./styles/main.scss";

export const ENDPOINT = "http://144.91.93.36:3009";

function retoastr(type, msg) {
  if (toast[type]) {
    toast[type](msg, { position: toast.POSITION.BOTTOM_LEFT });
  }
}

global.retoastr = retoastr;

const pages = [
  {
    name: "home",
    route: "/",
    component: React.lazy(() => import("./routes/HomePage")),
  },
  {
    name: "roulette",
    route: "/roulette",
    component: React.lazy(() => import("./routes/RouletteRoute")),
  },
  {
    name: "crash",
    route: "/crash",
    component: React.lazy(() => import("./routes/CrashRoute")),
  },
  {
    name: "50x",
    route: "/50x",
    component: React.lazy(() => import("./components/games/50x/Wof")),
  },
  {
    name: "dice",
    route: "/dice",
    component: React.lazy(() => import("./routes/DiceRoute")),
  },
  {
    name: "tower",
    route: "/tower",
    component: React.lazy(() => import("./routes/TowerRoute")),
  },
  {
    name: "keno",

    route: "/keno",
    component: React.lazy(() => import("./components/games/keno/Keno")),
  },
  {
    name: "mines",

    route: "/mines",
    component: React.lazy(() => import("./routes/MinesRoute")),
  },
  {
    name: "slots",
    route: "/slots",
    component: React.lazy(() => import("./routes/SlotsRoute")),
  },
  {
    name: "plinko",
    route: "/plinko",
    component: React.lazy(() => import("./components/games/plinko/PlinkoGame")),
  },
  {
    name: "video-poker",
    route: "/video-poker",
    component: React.lazy(() =>
      import("./components/games/video_poker/VideoPoker"),
    ),
  },
  {
    name: "slide",
    route: "/slide",
    component: React.lazy(() => import("./components/games/slides/Slides")),
  },
  {
    name: "slot-battles",
    route: "/slot-battles",
    component: React.lazy(() => import("./routes/SlotBattlesRoute")),
  },
  {
    name: "tos",
    route: "/tos",
    component: React.lazy(() => import("./routes/TermsOfServiceRoute")),
  },
  {
    name: "faq",
    route: "/faq",
    component: React.lazy(() => import("./routes/FAQRoute")),
  },

  {
    name: "leaderboard",
    route: "/leaderboard",
    component: React.lazy(() => import("./routes/LeaderboardRoute")),
  },
  {
    name: "provably-fair",
    route: "/provably-fair",
    component: React.lazy(() => import("./routes/ProvablyFairRoute")),
  },
  {
    name: "profile",
    route: "/profile",
    component: React.lazy(() => import("./routes/ProfileRoute")),
  },
  {
    name: "affiliates",
    route: "/affiliates",
    component: React.lazy(() => import("./routes/AffiliatesRoute")),
  },
  {
    name: "deposit-menu",
    route: "/deposit-menu",
    component: React.lazy(() => import("./routes/DepositMenu")),
  },
  {
    name: "hilo",
    route: "/hilo",
    component: React.lazy(() => import("./components/games/hilo/HILO")),
  },
  {
    name: "blackjack",
    route: "/blackjack",
    component: React.lazy(() =>
      import("./components/games/blackjack/Blackjack"),
    ),
  },
  {
    name: "mobilesearch",
    route: "/mobilesearch",
    component: React.lazy(() => import("./routes/SearchRoute")),
  },
  {
    name: "admin",
    route: "/admin",
    component: React.lazy(() => import("./routes/AdminRoute")),
  },
];

const App = () => {
  const dispatch = useDispatch();
  const withdrawOk = useSelector((state) => state.profile.withdrawOk);
  const { loaded, sidebarHidden, chatbarHidden, mobile } = useSelector(
    (state) => state.main,
  );

  function handleSession(wn = window) {
    console.log(wn.location.href);
    const authorization = new URL(wn.location.href).searchParams.get(
      "authorization",
    );

    if (!authorization) {
      window.localStorage.setItem("authToken", authorization);
      window.history.pushState({}, document.title, "/");
    }
  }

  const authHandler = () => {
    const wnd = window.open(ENDPOINT + "/auth/steam");
  };

  const RoutesComp = () => {
    const [maxWidth, setMaxWidth] = useState(0);

    useEffect(() => {
      let ints = setInterval(() => {
        let _w = document.body.getBoundingClientRect().width;
        let _wE = _w - (553 + (sidebarHidden ? -240 : 0));

        if ((_w <= 1020 && !mobile) || (_w > 1020 && mobile)) {
          let isMobile = !!(_w <= 1020 && !mobile);

          dispatch({
            type: "UPDATE_MAIN_STATE",
            payload: {
              mobile: isMobile,
            },
          });
        }

        setMaxWidth(_wE);
      }, 2);
      return () => {
        clearInterval(ints);
      };
    }, []);

    function saveAffCode() {
      const urlParams = window.location.href.split("/");
      const affCode = urlParams[urlParams.length - 1];
      window.localStorage.setItem("affCode", affCode);
      document.location.replace("/");
      return (
        <div className="page-content text-center">
          <Loader />
        </div>
      );
    }

    return (
      <div
        className="main-content"
        style={{ maxWidth: `${maxWidth}px`, minWidth: `100%` }}
      >
        <MainHeader />
        <div className="stay-away"></div>
        <React.Suspense
          fallback={
            <div id="loading-screen-off">
              <div></div>
            </div>
          }
        >
          <Routes>
            {pages.map((page, i) => (
              <Route path={page.route} element={<page.component />} key={i} />
            ))}
            <Route
              exact
              path="/deposit"
              element={<WithdrawDepositRoute name={"Deposit"} />}
            />
            <Route
              exact
              path="/withdraw"
              element={<WithdrawDepositRoute name={"Withdraw"} />}
            />
            <Route
              exact
              path="/state-test"
              component={() => <StateTestRoute name="Deposit" />}
            />
            <Route exact path="/auth" render={() => authHandler()} />
            {/* <Route exact path="/admin" element={<AdminRoute />} /> */}
            <Route exact path="*" render={() => saveAffCode()} />
          </Routes>
        </React.Suspense>
      </div>
    );
  };

  useEffect(() => {
    try {
      let dataWillChange = {};

      let chatHidden = localStorage.getItem("chatHidden");
      let sidebarHidden = localStorage.getItem("sidebarHidden");

      if (chatHidden && (chatHidden === "true") | (chatHidden === "false")) {
        dataWillChange["chatbarHidden"] = JSON.parse(chatHidden);
      }

      if (
        sidebarHidden &&
        (sidebarHidden === "true") | (sidebarHidden === "false")
      ) {
        dataWillChange["sidebarHidden"] = JSON.parse(sidebarHidden);
      }

      dispatch({
        type: "UPDATE_MAIN_STATE",
        payload: dataWillChange,
      });
    } catch (e) {
      console.log(`Failed to fetch browser data`, e);
    }

    handleSession();

    socket.on("user:updateBalance", (data) => {
      dispatch(updateBalance(data));
    });

    socket.on("redirect", (data) => {
      window.open(data.url);
    });

    socket.on("message", function (data) {
      retoastr(data.type, data.msg);
    });

    socket.on("depositCompleted", (data) => {
      let audio = new Audio("/audio/trade/deposit.mp3");
      audio.play();
      retoastr(
        "success",
        `Your deposit has been completed and you got ${(
          data.amount / 100
        ).toFixed(2)} coins`,
      );
    });

    socket.on("inited", (data) => {
      dispatch(setInited(true));
      // setFirstAuthInited(true);
      /*
      if (process.env.NODE_ENV === 'development') dispatch(setInited(true));
      else {
        setTimeout(() =>{
          dispatch(setInited(true));
        }, 2000)
      }
      */
    });

    socket.on("disconnect", (data) => {
      dispatch(setInited(false));
    });

    socket.on("setWithdrawOk", function (data) {
      dispatch(setWithdrawOk(data));
    });

    socket.on("authPlease", (data) => {
      socket.emit("authorization", {
        authToken: window.localStorage.getItem("authorization"),
      });
    });

    setTimeout(() => {
      dispatch({
        type: "UPDATE_MAIN_STATE",
        payload: {
          loaded: true,
        },
      });
    }, 2000);

    return function cleanup() {
      socket.off("redirect");
      socket.off("message");
      socket.off("depositCompleted");
      socket.off("inited");
      socket.off("setWithdrawOk");
    };
  }, []);

  let classAppEntry = "";

  if (chatbarHidden && sidebarHidden) {
    classAppEntry = "both";
  } else if (chatbarHidden) {
    classAppEntry = "chat-hidden";
  } else if (sidebarHidden) {
    classAppEntry = "side-hidden";
  }

  return loaded ? (
    <div className={classnames({ App: true })}>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        containerStyle={{ zIndex: "999999999999" }}
      />

      {withdrawOk ? (
        <HashRouter>
          <div
            id={"app-entry"}
            className={`${mobile ? "mobile" : ""}${
              mobile && classAppEntry.length > 0 ? " " : ""
            }${classAppEntry}`}
          >
            <LeftSidebar />
            <RoutesComp />
            <Chat />
          </div>
          {mobile ? <TaskBarMobile /> : null}
          <DepositPopup />
          <WithdrawPopup />
        </HashRouter>
      ) : (
        <Ban />
      )}
    </div>
  ) : (
    <LoaderScreen />
  );
};

export default App;
