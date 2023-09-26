import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

export const TaskBarMobile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { mobileContent } = useSelector((state) => state.main);

  const handleButtonClick = (index) => {
    switch (index) {
      case 0x0:
        dispatch({
          type: "UPDATE_MAIN_STATE",
          payload: {
            sidebarHidden: false,
            chatbarHidden: true,
          },
        });
        break;
      case 0x1:
        navigate("/mobilesearch");
        break;
      case 0x2:
        navigate("/");
        break;
      case 0x3:
        navigate("/withdraw");
        break;
      case 0x5:
        dispatch({
          type: "UPDATE_MAIN_STATE",
          payload: {
            chatbarHidden: false,
            sidebarHidden: true,
          },
        });
        break;
      default:
        break;
    }
  };

  const setCurrentButton = (index) => {
    dispatch({
      type: "UPDATE_MAIN_STATE",
      payload: {
        mobileContent: index,
        sidebarHidden: true,
        chatbarHidden: true,
      },
    });
  };

  useEffect(() => {
    let pid = null;
    if (location.pathname === "/withdraw" && mobileContent !== 0x3) {
      pid = 3;
    }
    if (location.pathname === "/mobilesearch" && mobileContent !== 0x1) {
      pid = 1;
    }

    if (pid !== null) {
      dispatch({
        type: "UPDATE_MAIN_STATE",
        payload: {
          mobileContent: pid,
        },
      });
    }
  }, [location.pathname, mobileContent]);

  return (
    <div id="taskbar-mobile">
      <div className="buttons">
        {["menu-icon", "search", "home", "shoping", "wallet", "chat-icon"].map(
          (icon, index) => (
            <div
              id={icon}
              className={"button" + (mobileContent === index ? " active" : "")}
              key={index}
              onClick={() => {
                setCurrentButton(index);
                handleButtonClick(index);
              }}
            >
              <img src={`/images/new_form/${icon}.svg`} alt="" />
            </div>
          ),
        )}
      </div>
    </div>
  );
};
