import React, { Fragment } from "react";
import BetAmount from "../../BetAmount";
import { socket } from "../../../Socket";
import {
  createDemoGame,
  setChangeSeedsPopupVisible,
  setMineCount,
  openAllSquares,
  setEmojiForce,
  completeGame,
  setPlayable,
  finalizeGame,
} from "../../../redux/ducks/landmines";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function retoastr(type, msg) {
  if (toast[type]) {
    toast[type](msg, { position: toast.POSITION.BOTTOM_LEFT });
  }
}

function restrictChars($event) {
  if (
    $event.charCode === 190 ||
    $event.charCode === 110 ||
    $event.charCode === 44 ||
    $event.charCode === 46
  ) {
    $event.preventDefault();
    return false;
  }

  if (
    $event.charCode === 0 ||
    new RegExp(/[0-9]|\./).test(String.fromCharCode($event.charCode))
  ) {
    return true;
  } else {
    $event.preventDefault();
    return false;
  }
}

export default React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const { mobile } = useSelector((state) => state.main);
  const userBalance = useSelector((state) => state.profile.balance);
  const isActive = useSelector((state) => state.landmines.isActive);
  const isDemo = useSelector((state) => state.landmines.isDemo);
  const game = useSelector((state) => state.landmines.game);
  const mineCount = useSelector((state) => state.landmines.mineCount);

  const betInput = useRef();
  const [betAmount, setBetAmount] = useState(0);

  const [inputFocused, setInputFocused] = useState(false);

  function placeBet() {
    socket.emit("mines:create", {
      betAmount: betInput.current.value,
      mineCount,
    });
  }

  function cashout() {
    if (props.active) {
      socket.emit("towersCashout");
    }
  }

  function isDemoAvailable() {
    return isNaN(betAmount) || betAmount === 0 || !profile.loggedIn;
  }

  return (
    <div className={"mines__bet-area"}>
      <div>
        <div class="">Bet Amount</div>
        <BetAmount
          ref={betInput}
          mobile={mobile}
          gamemode={"mines"}
          handler={(val) => {
            setBetAmount(parseFloat(val));
            //dispatch(towersValues(val));
          }}
          userBalance={userBalance}
        />
      </div>

      <div class="mines__num-wrap">
        <div class="">Number of Mines</div>
        <div class="mines__num">
          {[1, 3, 5, 10].map((el) => (
            <div
              onClick={(e) => {
                dispatch(setMineCount(el));
                setInputFocused(false);
              }}
              className={
                el === mineCount && !inputFocused ? "mines__num-selected" : ""
              }
            >
              {el}
            </div>
          ))}

          <input
            type="number"
            placeholder="Custom"
            className={inputFocused ? "mines__num-selected" : ""}
            onKeyPress={restrictChars}
            onFocus={() => {
              setInputFocused(true);
            }}
            onChange={(e) => {
              let val = parseInt(e.target.value);
              if (val > 24) {
                val = 24;
                e.target.value = 24;
              }
              dispatch(setMineCount(val));
            }}
          />
        </div>
      </div>

      <button
        className="button button--green button--play"
        onClick={() => {
          if (isActive && !game.isCompleted) {
            //cashout function there
            if (isDemo) return props.finalizeGame({ won: true });
            else return socket.emit("mines:cashout");
          }

          if (isDemoAvailable()) return dispatch(createDemoGame());
          if (userBalance < betAmount)
            return retoastr("error", `Insufficient balance!`);

          placeBet();
        }}
      >
        {isActive && !game.isCompleted ? (
          <React.Fragment>
            {!isDemo ? (
              <React.Fragment>
                <div class="flex flexBetween">
                  <span>Cash Out</span>
                  <span>
                    <FontAwesomeIcon icon="coins" className="balanceicon" />
                    {(
                      Math.floor(game.betAmount * game.payoutRate) / 100
                    ).toFixed(2)}
                  </span>
                </div>
              </React.Fragment>
            ) : (
              "Cashout"
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {isDemoAvailable() ? "Play Demo" : "Place Bet"}
          </React.Fragment>
        )}
      </button>

      <div
        class="mines__change-seed"
        onClick={(e) => {
          dispatch(setChangeSeedsPopupVisible(true));
        }}
      >
        <FontAwesomeIcon icon="balance-scale" className="" />
        Change Seeds
      </div>
    </div>
  );
});
