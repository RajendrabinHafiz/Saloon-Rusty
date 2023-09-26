import { useDispatch, useSelector } from "react-redux";
import { HashRouter } from "react-router-dom";
import { socket } from "./Socket";
import toast, { Toaster } from "react-hot-toast";
import Chat from "./components/ChatBar";
import { LeftSidebar } from "./components/desktop/LeftSidebar";
import { RoutesComp } from "./components/Routes";
import { TaskBarMobile } from "./components/desktop/TaskBarMobile";
import DepositPopup from "./components/cashier/DepositPopup";
import WithdrawPopup from "./components/cashier/WithdrawPopup";
import { useEffect } from "react";

import "./styles/main.scss";
import { OverallyLoader } from "./components/Overallyloader";
import { LoaderScreen } from "./components/LoaderScreen";

export const ENDPOINT = "http://localhost:3009";

export const AppEntry = () => {
  const dispatch = useDispatch();
  const { loaded, sidebarHidden, chatbarHidden, mobile, overallyLoading } =
    useSelector((state) => state.main);

  

    const handleSession = async () => {
      let token = localStorage.getItem("authorization");
      let accountObject = null;

      const url = window.location.href;

      const queriesRemoved = url.replace(/\?.*/, "");
      const authorization = new URL(url).searchParams.get("authorization");


      if (authorization) {
        window.localStorage.setItem("authorization", (token = authorization));

        if (url !== queriesRemoved) {
          window
            .location
            .href = queriesRemoved;
        }
      }


      if (token) {
        const res = await fetch(`${ENDPOINT}/api/getUser`, {
          headers: {
            token,
          },
        });
        
        const data = await res.json();


        if (!data.status) {
          localStorage.removeItem("authorization");
          toast.error("Session expired or Authorization token is invalid");
        } else {
          console.log(data);
          accountObject = data;
        }


      } else {
        toast.error("Authorization token is missing");

      }

      dispatch({
        type: "UPDATE_MAIN_STATE",
        payload: {
          account: accountObject ?? null,
          loaded: true,
        },
      });
    };


    

  useEffect(() => {
    (async () => {
      let token = localStorage.getItem("authorization");
      let accountObject = null;

      const url = window.location.href;

      const queriesRemoved = url.replace(/\?.*/, "");
      const authorization = new URL(url).searchParams.get("authorization");

      if (authorization) {
        window.localStorage.setItem("authorization", (token = authorization));

        if (url !== queriesRemoved) {
          window.location.href = queriesRemoved;
        }
      }

      if (token) {
        const res = await fetch(`${ENDPOINT}/api/getUser`, {
          headers: {
            token,
          },
        });

        const data = await res.json();

        if (!data.status) {
          localStorage.removeItem("authorization");
          toast.error("Session expired or Authorization token is invalid");
        } else {
          console.log(data);
          accountObject = data;
        }
      }

      dispatch({
        type: "UPDATE_MAIN_STATE",
        payload: {
          account: accountObject ?? null,
          loaded: true,
        },
      });
    })();
  }, []);

  
    
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
  
      
  
      socket.on("redirect", (data) => {
        window.open(data.url);
      });
  
      socket.on("message", function (data) {
      });
  
      
  
      socket.on("inited", (data) => {
        
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

  return !loaded ? (
    <LoaderScreen />
  ) : (
    <div className="App">
      <HashRouter>
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          containerStyle={{ zIndex: "999999999999" }}
        />

        <>
          <OverallyLoader active={overallyLoading} />

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
        </>
      </HashRouter>
    </div>
  );
};
