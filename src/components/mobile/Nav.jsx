import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import MeBar from "../MeBar";
import { socket } from "../../Socket";
import { toggleNavCollapsed } from "../../redux/ducks/app";
import { setVisible as setDepositVisible } from "../../redux/ducks/depositpopup";
import { setVisible as setWithdrawVisible } from "../../redux/ducks/withdrawpopup";

import { setHelpVisible, setFaucetVisible, setRedeemVisible, setCaptchaVisible } from "../../redux/ducks/app";


const Nav = props => {
  const dispatch = useDispatch();
  const navCollapsed = useSelector(state => state.app.navCollapsed);
  const loggedIn = useSelector(state => state.profile.loggedIn);

  let popupRes = (type, captcha, value) => {
    if (type === "referralCode") {
      const code = value;
      if (code !== "" && captcha !== "") {
        socket.emit("addReferralCode", { code: code, captcha: captcha });
      }
    } else if (type === "faucet") {
      if (captcha !== "") {
        socket.emit("claimFaucet", { captcha: captcha });
      }
    }
  };

  return (
    <div
      className={
        "nav nav--mobile hidden-on-desktop " + (!navCollapsed ? "visible" : "")
      }
    >
      <MeBar />

      
      <div className="nav__footer">
        <Link className="button button--deposit" onClick={ () => { dispatch(setDepositVisible(true)); dispatch(toggleNavCollapsed(false)); } }>Deposit</Link>
        <Link className="button button--withdraw" onClick={ () => { dispatch(setWithdrawVisible(true)); dispatch(toggleNavCollapsed(false)); } }>
          Withdraw
        </Link>
      </div>

      <div className="nav__links">
        <Link to="/" className="nav-item nav-item--game nav-item-spec" onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
          <img src={process.env.PUBLIC_URL + "/images/roulette-black.svg"} />
          Roulette
        </Link>
        <Link to="/crash" className="nav-item nav-item--game " onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
          <img src={process.env.PUBLIC_URL + "/images/crash.svg"} />
          Crash
        </Link>
        <Link to="/50x" className="nav-item nav-item--game nav-item-spec" onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
          <img src={process.env.PUBLIC_URL + "/images/50x-black.svg"} />
          50x
        </Link>
        <Link to="/tower" className="nav-item nav-item--game" onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
          <img src={process.env.PUBLIC_URL + "/images/towers.svg"} />
          Towers
        </Link>
        <Link to="/dice" className="nav-item nav-item--game" onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
          <img src={process.env.PUBLIC_URL + "/images/dice.svg"} />
          Dice
        </Link>
        <Link to="/mines" className="nav-item nav-item--game nav-item-spec" onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
          <img src={process.env.PUBLIC_URL + "/images/mines-black.svg"} />
          Mines
        </Link>

        <Link to="/slots" className="nav-item nav-item--game nav-item-spec" onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
          <img src={process.env.PUBLIC_URL + "/images/slots-black.svg"} />
          Slots
        </Link>
 
        <Link to="/slot-battles" className="nav-item nav-item--game nav-item-spec" onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
          <img src={process.env.PUBLIC_URL + "/images/slot-battles-black.svg"} />
          Slot Battles
        </Link>
       
        <Link to="/affiliates" className="nav-item" onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
          Affiliates
        </Link>
   
        <div className="nav-item" onClick={() => { dispatch(setRedeemVisible(true)); dispatch(toggleNavCollapsed(false)); } } /* onClick={() => alert("You must be on a desktop to access this!")} */>
          Redeem Code
        </div>
        <Link to="/leaderboard" className="nav-item" onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
        Leaderboard
        </Link>
        <div className="nav-item" onClick={() => { dispatch(setFaucetVisible(true)); dispatch(toggleNavCollapsed(false)); } } /* onClick={() => alert("You must be on a desktop to access this!")} */>
          Faucet
        </div>
        <Link to="/tos" className="nav-item" onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
          Terms of Service
        </Link>
        <Link to="/faq" className="nav-item" onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
          FAQ
        </Link>
        <Link to="/provably-fair" className="nav-item" onClick={ () => { dispatch(toggleNavCollapsed(false)); } }>
          Provably Fair
        </Link>
        { loggedIn && <Link
          to=""
          className="nav-item"
          onClick={() => {
            window.localStorage.removeItem('authToken');
            window.location.href = window.location.href;
          }}
        >
          <img src={process.env.PUBLIC_URL + "/images/logout.svg"} />
          Logout
        </Link>
        }
      </div>

    </div>
  );
};
export default Nav;
