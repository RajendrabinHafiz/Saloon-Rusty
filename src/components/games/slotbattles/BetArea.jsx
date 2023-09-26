import React, { Fragment, useEffect  } from "react";
import BetAmount from "../../BetAmount";

import { socket } from "../../../Socket";

import { setSlotsSoundsMuted, setHistory } from "../../../redux/ducks/slots";

import { useDispatch, useSelector } from "react-redux";
import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function retoastr(type, msg) {
  if (toast[type]) {
    toast[type](msg, { position: toast.POSITION.BOTTOM_LEFT });
  }
}

function restrictChars ($event) {

  if ($event.charCode === 190 || $event.charCode === 110 || $event.charCode === 44 || $event.charCode === 46) {
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
  const userBalance = useSelector((state) => state.profile.balance);
  //const isActive = useSelector((state) => state.landslots.isActive);

  const betInput = useRef();
  const [betAmount, setBetAmount] = useState(0);

  const spinAmountInput = useRef();
  const [spinAmount, setSpinAmount] = useState(1);

  const [fastSpin, setFastSpin] = useState(false);

  const [inputFocused, setInputFocused] = useState(false);

  
  function placeBet(fromEffect) {
    if (!props.canSpin) return;
    socket.emit("slots:play", { betAmount: betInput.current.value, fastSpin });
    if (!fromEffect) {
      setTimeout(() => { props.setSpinAmount(spinAmount); }, 500);
    }
  }

  useEffect(() => {
    if (!props.canSpin) return;
    console.log('THERE spin amo', props.spinAmount)
    if (props.spinAmount > 0 && userBalance >= (parseFloat(betInput.current.value) * 100)) {
      setTimeout(() => { placeBet(true) }, 500);
    }

  }, [props.spinAmount]);



  return (
    <div className={"slots__bet-area "}>
      
      <div class="area-top">
      <img src="/images/cowboy.png" />
      <span>SLOTS</span>
      </div>
      <div>


      <div class="bet-amount-text">Bet Amount</div>
      <BetAmount
        ref={betInput}
        gamemode={"slots"}
        handler={(val) => {
          setBetAmount(parseFloat(val));
          //dispatch(towersValues(val));
        }}
        userBalance={userBalance}
      />
      </div>

      <div class="bet-amount-text">Spin Amount</div>
      <div class="bet-amount">
      <div class="coin-input-container">
      <FontAwesomeIcon icon="hashtag" className="" style={{width: '1em', marginRight: '5px'}} />
      <input type="number" value={spinAmount} onChange={(e) => { setSpinAmount(e.target.value) }} class="input coin-input"></input>
      </div>
      </div>


      <button
        className="button button--green button--play"
        onClick={() => {        

          /*
          if (isActive && !game.isCompleted) {
            //cashout function there
            if (isDemo) return props.finalizeGame({won: true});
            else return socket.emit("slots:cashout");
          }

          if (isDemoAvailable()) return dispatch(createDemoGame());
          if (userBalance < betAmount) return retoastr('error', `Insufficient balance!`);
          */
          placeBet();
        }}
      >
        {<React.Fragment>
          SPIN
          </React.Fragment>}
      </button>


        <div class="button-area">


        <div className={`slots_button`} onClick={(e) => { 
props.setIsPopupVisible(true);

}}><FontAwesomeIcon icon="balance-scale" className="" />Seed</div>

        <div className={`slots_button ${!fastSpin && 'button-off'}`} onClick={(e) => { 
setFastSpin(!fastSpin);
}}><FontAwesomeIcon icon="bolt" className="" />Fast Spin</div>

        </div>

   
   
    </div>
  );
});

