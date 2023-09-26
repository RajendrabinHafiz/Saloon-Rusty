import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import FullPopup from "../FullPopup";
import HeaderItem from "../HeaderItem";
import { socket } from "../../Socket";
import { balanceUpdate } from "../../redux/ducks/profile";
import { turnDropdownOff } from "../../utils/before";
import {
  setHelpVisible,
  setFaucetVisible,
  setRedeemVisible,
  setCaptchaVisible,
  setRedeemCode,
} from "../../redux/ducks/app";
import FakeCaptcha from "../Captcha";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { menuItems } from "./LeftSidebar";
import { ENDPOINT } from "../../AppEntry";
import toast from "react-hot-toast";
const classNames = require("classnames");

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownMoreRef = useRef(null);

  const [searchList, setSearchList] = useState(false);
  const [moreList, setMoreList] = useState(false);
  const [notifList, setNotifList] = useState(false);

  const profile = useSelector((state) => state.profile);
  const { sidebarHidden, notification, mobile, account } = useSelector(
    (state) => state.main,
  );
  const redeemVisible = useSelector((state) => state.app.redeemVisible);
  const faucetVisible = useSelector((state) => state.app.faucetVisible);
  const captchaVisible = useSelector((state) => state.app.captchaVisible);
  const redeemCode = useSelector((state) => state.app.redeemCode);

  const helpVisible = useSelector((state) => state.app.helpVisible);

  const [inputSearch, setInputSearch] = useState(null);

  let faucetRef = useRef(null);
  let inputRef = useRef(null);
  let dropdownContainerRef = useRef(null);
  let dropdownRef = useRef(null);
  let dropdownNotifRef = useRef(null);

  useEffect(() => {
    let value = inputRef.current?.value;

    if (value && !inputSearch && value.length > 0) {
      inputRef.current.value = "";
    }
  }, [inputSearch]);

  useEffect(() => {
    let intId = setInterval(() => {
      if (dropdownRef.current && dropdownContainerRef.current) {
        if (
          searchList &&
          !dropdownContainerRef.current.classList.contains("active")
        ) {
          setSearchList(false);
        }

        if (
          !dropdownRef.current.classList.contains("active") &&
          dropdownContainerRef.current.classList.contains("active")
        ) {
          dropdownContainerRef.current.classList.remove("active");
        }
      }

      if (dropdownMoreRef.current) {
        if (moreList && !dropdownMoreRef.current.classList.contains("active")) {
          setMoreList(false);
        }
      }

      if (dropdownNotifRef.current) {
        if (
          notifList &&
          !dropdownNotifRef.current.classList.contains("active")
        ) {
          setNotifList(false);
        }
      }
    }, 16);

    return () => {
      clearInterval(intId);
    };
  }, [searchList, moreList, notifList]);

  const [captchaTicker, setCaptchaTicker] = useState(0);

  function login() {
    const mainUrl = window.location.origin;
    const authUrl = mainUrl.endsWith(":3000")
      ? ENDPOINT + "/api/auth/steam"
      : mainUrl + "/auth/steam";
    const newWindow = global.openWindow(authUrl);
    let newWindowLoaded = false;
    newWindow.addEventListener("unload", function (event) {
      newWindowLoaded = true;
    });
    let locationCheckerInterval = {};
    locationCheckerInterval = setInterval(() => {
      let stop = false;
      try {
        const newWindowLocation = newWindow.location.href;
        const debugDomain = ENDPOINT;
        const expectedDomain = mainUrl;
        if (
          newWindowLoaded &&
          (newWindowLocation.includes(expectedDomain) ||
            newWindowLocation.includes(debugDomain)) &&
          !newWindowLocation.includes("auth/steam/return")
        ) {
          const hasAuthorization =
            newWindowLocation.includes("?authorization=");
          if (hasAuthorization) {
            const authToken = newWindowLocation.split("?authorization=")[1];
            window.localStorage.setItem("authToken", authToken);
          }
          newWindow.close();
          window.location.href = window.location.href;
          stop = true;
        }
      } catch (err) {
      } finally {
        if (newWindow.closed || stop) clearInterval(locationCheckerInterval);
      }
    }, 100);

    //document.location.replace("/auth/steam");
  }

  function handleAffCode() {
    const affCode = window.localStorage.getItem("affCode");
    if (!affCode || affCode === "undefined") return;
    dispatch(setRedeemCode(affCode.toUpperCase()));
    dispatch(setRedeemVisible(true));
    //setTimeout(() => { window.localStorage.removeItem("affCode") }, 10 * 1000)
    //window.localStorage.removeItem("affCode");
  }

  useEffect(() => {
    socket.on("balance", (data) => {
      dispatch(balanceUpdate(data));
      handleAffCode();
    });

    return function cleanup() {
      socket.off("balance");
    };
  }, []);

  const logout = () => {
    window.localStorage.removeItem("authorization");
    toast.success("Logged out successfully");
    window.location.reload();
  };
  
  let popupRes = (type, captcha, value) => {
    if (type === "referralCode") {
      const code = value;
      if (code !== "" && captcha !== "") {
        socket.emit("addReferralCode", { code: code, captcha: captcha });
        setCaptchaTicker(captchaTicker + 1);
      }
    } else if (type === "faucet") {
      if (captcha !== "") {
        socket.emit("claimFaucet", { captcha: captcha });
        setCaptchaTicker(captchaTicker + 1);
      }
    }
  };

  return (
    <React.Fragment>
      {faucetVisible && (
        <div ref={faucetRef}>
          <FullPopup
            title="Faucet"
            close={() => {
              dispatch(setFaucetVisible(false));
              dispatch(setCaptchaVisible(false));
            }}
            visible={faucetVisible}
          >
            <div className="faucet">
              <div className="faucet__title">
                Claim 3 Cents Every 15 Minutes!
              </div>
              <div className="">
                <strong>Requirement</strong>: Balance must be 0.00 and your
                steam name must include #rustysaloon
              </div>
              <button
                className="button button--green green"
                onClick={() => {
                  dispatch(setCaptchaVisible(true));
                }}
              >
                CLAIM NOW
              </button>
            </div>

            <div
              className={captchaVisible ? "redeem__captcha" : "hidden"}
              key={"captcha-" + captchaTicker}
            >
              <FakeCaptcha
                submit={(captcha) => {
                  popupRes("faucet", captcha, 0);
                }}
                key="6LdCXfkdAAAAACLaCEaFZvBRNyau410x0ibgx2l3"
              />
            </div>
          </FullPopup>
        </div>
      )}

      {helpVisible && (
        <div className={"modal " + (!helpVisible ? "hidden" : "")}>
          <div
            className="modal--bg"
            onClick={(e) => dispatch(setHelpVisible(false))}
          >
            <div
              className="modal--content helppop"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                draggable="false"
                onClick={(e) => dispatch(setHelpVisible(false))}
                className="modal__close"
                src={process.env.PUBLIC_URL + "/images/x.svg"}
                alt=""
              />
              <h3 className="wtit">How to Play</h3>

              <h4 className="wtit">Roulette</h4>
              <p>
                Place your bet on Red or Black to 2X your bet or test your luck
                by betting on Green to 14X your bet!
              </p>

              <h4 className="wtit">Crash</h4>
              <p>
                Place your bet before the crash begins. Then, choose to either
                cashout low for a higher chance to win, or cashout high at a
                chance to win a much bigger amount!
              </p>

              <h4 className="wtit">50x</h4>
              <p>
                Place your bet on a variety of multipliers, and wait for the
                wheel to spin for a chance to 50X your bet!
              </p>

              <h4 className="wtit">Towers</h4>
              <p>
                Choose the option of 3 different difficulties (Easy, Medium, or
                Hard). Climb the tower by guessing the correct button on each
                row of the tower. Keep in mind, the harder the difficulty, the
                more you win!
              </p>

              <h4 className="wtit">Dice</h4>
              <p>
                Set your own multiplier by using the slider to increase or
                decrease your multiplier. A lower multiplier gives the chance at
                a higher win!
              </p>
              <br></br>
              <p>
                For any other issues you may have experienced,
                <br />
                please visit our&nbsp;
                <a
                  href="https://discord.gg/sYRJaTF"
                  className="discord-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon
                    icon={["fab", "discord"]}
                    className={classNames({
                      "chat-bar-social-icon icon-discord": true,
                    })}
                    style={{ "font-size": "13px", "vertical-align": "middle" }}
                  />
                </a>{" "}
                discord!
              </p>
            </div>
          </div>
        </div>
      )}

      {
        <div className={!redeemVisible ? "hide" : ""}>
          <FullPopup
            title="Referral code"
            close={() => {
              dispatch(setRedeemVisible(false));
              dispatch(setCaptchaVisible(false));
              window.localStorage.removeItem("affCode");
            }}
            visible={redeemVisible}
          >
            <div className="redeem">
              <div>Use code Saloon for 50 free Cents</div>
              <div className="redeem__inputs">
                <input
                  placeholder="Enter code"
                  className="input"
                  type="text"
                  value={redeemCode}
                  onChange={(e) => {
                    dispatch(setRedeemCode(e.target.value));
                  }}
                />
                <button
                  className="button button--green green"
                  onClick={() => {
                    socket.emit("addReferralCode", {
                      code: "SCRIP",
                      captcha: "",
                    });
                    dispatch(setCaptchaVisible(true));
                  }}
                >
                  CLAIM
                </button>
              </div>

              <div
                className={captchaVisible ? "redeem__captcha" : "hidden"}
                key={"captcha-" + captchaTicker}
              >
                <FakeCaptcha
                  submit={(captcha) => {
                    popupRes("referralCode", captcha, redeemCode);
                  }}
                  key="6LdCXfkdAAAAACLaCEaFZvBRNyau410x0ibgx2l3"
                />
              </div>
            </div>
          </FullPopup>
        </div>
      }

      <header className="header header--desktop">
        <HeaderItem className="header__link--logo hidden-on-desktop">
          <Link className="header__link--logo" to="/">
            <img
              draggable="false"
              src={process.env.PUBLIC_URL + "/images/logo.png"}
              alt=""
            />
          </Link>
        </HeaderItem>
        {sidebarHidden ? (
          <img
            draggable="false"
            className="logo-sidebar"
            onClick={() => navigate("/")}
            src="/images/logo.png"
            alt=""
          />
        ) : (
          ""
        )}
        {!mobile ? (
          <div
            className={"search-container" + (searchList ? " active" : "")}
            style={!sidebarHidden ? { left: "50px" } : {}}
            ref={dropdownContainerRef}
          >
            <div className={"search-section-header"}>
              <img draggable="false" src="/images/new_form/search.svg" alt="" />
              <input
                type="text"
                ref={inputRef}
                onBlur={() => setInputSearch(null)}
                defaultValue={inputSearch}
                onChange={(e) =>
                  setInputSearch(
                    !e.target.value || e.target.value.length === 0x0
                      ? null
                      : e.target.value,
                  )
                }
                placeholder="Search for games"
                onFocus={() => setSearchList(true)}
              />
              {inputSearch && inputSearch.length >= 1 ? (
                <div className="clear" onClick={() => setInputSearch(null)}>
                  <img
                    draggable="false"
                    src="/images/new_form/close.svg"
                    alt=""
                  />
                </div>
              ) : null}
            </div>
            <div className="hr"></div>

            <div
              className={"drop-down" + (searchList ? " active" : "")}
              ref={dropdownRef}
            >
              {menuItems[0].routes.map(
                (item, index) =>
                  (inputSearch === null ||
                    item.label
                      .toLowerCase()
                      .indexOf(inputSearch.toLowerCase() ?? "") > -1) && (
                    <div
                      className="drop-down-item"
                      key={index}
                      onClick={() => {
                        navigate(`/${item.link}`);
                        setSearchList(false);
                      }}
                    >
                      <img
                        draggable="false"
                        src={`/images/${item.icon}.svg`}
                        alt=""
                      />
                      <span>{item.label}</span>
                    </div>
                  ),
              )}
            </div>
          </div>
        ) : null}

        {account ? (
          <div className="profile-section-details-header">
            {!mobile ? (
              <>
                <div className="balance">
                  <div className="amount">
                    <img draggable="false" src="/images/diamond.svg" alt="" />
                    <span>{account.balance.toFixed(2)}</span>
                  </div>
                  <div className="deposit-button">Deposit</div>
                </div>
                <div
                  className="withdraw circle-button-icon drop-down-button"
                  onClick={() => navigate("/withdraw")}
                >
                  <img
                    draggable="false"
                    src="/images/new_form/shoping.svg"
                    alt=""
                  />
                </div>
                <div className="hz"></div>
              </>
            ) : (
              <div
                className="balance mobile"
                onClick={() => navigate("/withdraw")}
              >
                <div className="amount">
                  <img draggable="false" src="/images/diamond.svg" alt="" />
                  <span>{account.balance.toFixed(2)}</span>
                </div>
              </div>
            )}
            <div className="profile-preview">
              <div className="profile-preview-avatar">
                <img draggable="false" src={account.avatar} alt="" />
                <div className="notificatios-count">12</div>
              </div>
              <div className="more">
                <img
                  draggable="false"
                  className="drop-down-button"
                  src="/images/chevron-down.svg"
                  alt=""
                  onClick={() => turnDropdownOff() && setMoreList(true)}
                />
                <div
                  className={"drop-down" + (moreList ? " active" : "")}
                  ref={dropdownMoreRef}
                >
                  <div
                    className="drop-down-item"
                    onClick={() => {
                      navigate("/profile");
                      setMoreList(false);
                    }}
                  >
                    <img src="/images/new_form/user.svg" alt="" />
                    <span>Profile</span>
                  </div>
                  <div
                    className="drop-down-item"
                    onClick={() => {
                      navigate("/affiliates");
                      setMoreList(false);
                    }}
                  >
                    <img src="/images/new_form/anouncement.svg" alt="" />
                    <span>Affiliates</span>
                  </div>

                  <div className="drop-down-item gems">
                    <img src="/images/diamond.svg" alt="" />
                    <span>Free Gems</span>
                  </div>

                  <div
                    className="drop-down-item logout"
                    onClick={() => logout()}
                  >
                    <img src="/images/new_form/logout.svg" alt="" />
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="alert circle-button-icon drop-down-button"
              onClick={() => turnDropdownOff() && setNotifList(true)}
            >
              <img
                draggable="false"
                src="/images/new_form/alert.svg"
                alt=""
                // className="drop-down-button"
              />
              <div className="point-count">
                {notification.length > 9 ? "+9" : notification.length}
              </div>
              <div
                id="notifications-container"
                className={"drop-down" + (notifList ? " active" : "")}
                ref={dropdownNotifRef}
                onClick={() => void 0}
              >
                {notification.map((item, index) => (
                  <div className="drop-down-item" key={index}>
                    <div className="wrap">
                      <div className="title">{item.title}</div>
                      <div className="time">
                        {
                          new Date(item.timestamp)
                            .toLocaleString()
                            .split(",")[0]
                        }
                      </div>
                    </div>
                    <div className="message">{item.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="profile-section-details-header">
            {/* onClick={(e) => { dispatch(setDepositVisible(true)) }} */}
            {/* {!mobile ? (
              <HeaderItem className="header__item--deposit">
                <div
                  onClick={() => navigate("/deposit-menu")}
                  className="button button--deposit deposit--notloggedin"
                  data-isfull="true"
                >
                  Deposit
                </div>
              </HeaderItem>
            ) : null} */}
            <div
              className="steam-login"
              style={mobile ? { marginRight: "5px" } : {}}
              onClick={() => navigate("/auth")}
            >
              <img
                draggable="false"
                className="login-icon"
                src={process.env.PUBLIC_URL + "/images/steam-icon.svg"}
                alt=""
              />
              <div className="login-text">Sign in via Steam</div>
            </div>
          </div>
        )}
      </header>
    </React.Fragment>
  );
};
export default Header;
