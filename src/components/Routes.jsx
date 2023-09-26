import MainHeader from "./desktop/Header";
import StateTestRoute from "../routes/StateTestRoute";
import WithdrawDepositRoute from "../routes/WithdrawDepositRoute";
import { useEffect, useState, Suspense, lazy, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ENDPOINT } from "../AppEntry";
import { toast } from "react-hot-toast";
import { OverallyLoader } from "./Overallyloader";
import { store } from "../redux/store";

const pages = [
  {
    name: "home",
    route: "/",
    component: lazy(() => import("../routes/HomePage")),
  },
  {
    name: "roulette",
    route: "/roulette",
    component: lazy(() => import("../routes/RouletteRoute")),
  },
  {
    name: "crash",
    route: "/crash",
    component: lazy(() => import("../routes/CrashRoute")),
  },
  {
    name: "50x",
    route: "/50x",
    component: lazy(() => import("./games/50x/Wof")),
  },
  {
    name: "dice",
    route: "/dice",
    component: lazy(() => import("../routes/DiceRoute")),
  },
  {
    name: "tower",
    route: "/tower",
    component: lazy(() => import("../routes/TowerRoute")),
  },
  {
    name: "keno",

    route: "/keno",
    component: lazy(() => import("./games/keno/Keno")),
  },
  {
    name: "mines",

    route: "/mines",
    component: lazy(() => import("../routes/MinesRoute")),
  },
  {
    name: "slots",
    route: "/slots",
    component: lazy(() => import("../routes/SlotsRoute")),
  },
  {
    name: "plinko",
    route: "/plinko",
    component: lazy(() => import("./games/plinko/PlinkoGame")),
  },
  {
    name: "video-poker",
    route: "/video-poker",
    component: lazy(() => import("./games/video_poker/VideoPoker")),
  },
  {
    name: "slide",
    route: "/slide",
    component: lazy(() => import("./games/slides/Slides")),
  },
  {
    name: "slot-battles",
    route: "/slot-battles",
    component: lazy(() => import("../routes/SlotBattlesRoute")),
  },
  {
    name: "tos",
    route: "/tos",
    component: lazy(() => import("../routes/TermsOfServiceRoute")),
  },
  {
    name: "faq",
    route: "/faq",
    component: lazy(() => import("../routes/FAQRoute")),
  },

  {
    name: "leaderboard",
    route: "/leaderboard",
    component: lazy(() => import("../routes/LeaderboardRoute")),
  },
  {
    name: "provably-fair",
    route: "/provably-fair",
    component: lazy(() => import("../routes/ProvablyFairRoute")),
  },
  {
    name: "profile",
    route: "/profile",
    component: lazy(() => import("../routes/ProfileRoute")),
  },
  {
    name: "affiliates",
    route: "/affiliates",
    component: lazy(() => import("../routes/AffiliatesRoute")),
  },
  {
    name: "deposit-menu",
    route: "/deposit-menu",
    component: lazy(() => import("../routes/DepositMenu")),
  },
  {
    name: "hilo",
    route: "/hilo",
    component: lazy(() => import("./games/hilo/HILO")),
  },
  {
    name: "blackjack",
    route: "/blackjack",
    component: lazy(() => import("./games/blackjack/Blackjack")),
  },
  {
    name: "baccarat",
    route: "/baccarat",
    component: lazy(() => import("./games/baccarat/BaccaratGame")),
  },
  {
    name: "mobilesearch",
    route: "/mobilesearch",
    component: lazy(() => import("../routes/SearchRoute")),
  },
  {
    name: "admin",
    route: "/admin",
    component: lazy(() => import("../routes/AdminRoute")),
  },
];

const AuthRedirect = () => {
  useEffect(() => {
    store.dispatch({
      type: "UPDATE_MAIN_STATE",
      payload: {
        overallyLoading: true,
      },
    });

    window.location.href = `${ENDPOINT}/api/auth/steam`;
  }, []);

  return null;
};

export const RoutesComp = () => {
  const dispatch = useDispatch();
  const mainContainerRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState(0);
  const { sidebarHidden, mobile } = useSelector((state) => state.main);

  useEffect(() => {
    let ints = setInterval(() => {
      let edited = false;
      let _w = document.body.getBoundingClientRect().width;
      let _wE = _w - (553 + (sidebarHidden ? -240 : 0));

      if ((_w <= 1020 && !mobile) || (_w > 1020 && mobile)) {
        edited = {
          mobile: !!(_w <= 1020 && !mobile),
        };
      }

      let widthContainer = (mainContainerRef.current?.getBoundingClientRect().width) ?? 0x0;
      let lastWidth = store.getState().main.containerWidth;

      if (widthContainer > 0 && widthContainer !== lastWidth) {
        edited = {
          ...(edited ?? {}),
          containerWidth: widthContainer,
        }
      }

      if (edited) {
        dispatch({
          type: "UPDATE_MAIN_STATE",
          payload: edited,
        });
      }

      setMaxWidth(_wE);
    }, 2);
    return () => {
      clearInterval(ints);
    };
  }, []);

  return (
    <div
      className="main-content"
      ref={mainContainerRef}
      style={{ maxWidth: `${maxWidth}px`, minWidth: `100%` }}
    >
      <MainHeader />
      <div className="stay-away"></div>
      <Suspense
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

          <Route exact path="/auth" element={<AuthRedirect />} />

          {/* <Route exact path="/admin" element={<AdminRoute />} /> */}
          {/* <Route exact path="*" render={() => saveAffCode()} /> */}
        </Routes>
      </Suspense>
    </div>
  );
};
