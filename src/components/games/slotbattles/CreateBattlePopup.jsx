import React, { useEffect, useState, useRef } from "react";
import { socket } from "../../../Socket";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import BetAmount from "../../BetAmount";

import { setCreatePopupVisible } from "../../../redux/ducks/slotbattles";

import FullPopup from "../../FullPopup";

export default React.forwardRef((props, ref) => {

  const dispatch = useDispatch();
  const isPopupVisible = useSelector((state) => state.slotbattles.createPopupVisible);
  const betInput = useRef();
  
  const versusTypes = [ '1v1', '2v2', '1v1v1', '1v1v1v1' ];


  const userBalance = useSelector((state) => state.profile.balance);
  const [betAmount, setBetAmount] = useState(0);
  const [spinAmount, setSpinAmount] = useState(1);
  const [versusType, setVersusType] = useState('1v1');
  const [fastSpin, setFastSpin] = useState(false);

  return (
    <React.Fragment>
      
       { isPopupVisible && <div>
        <FullPopup
          title="Create New Battle"
          close={() => { dispatch(setCreatePopupVisible(false)); }}
          visible={isPopupVisible}
        >
          <div class="popup-slotbattles-createbattle">
         
         
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
     

      <div class="bet-amount-text spin-top">Spin Amount</div>
      <div class="bet-amount">
      <div class="coin-input-container">
      <FontAwesomeIcon icon="hashtag" className="" style={{width: '1em', marginRight: '5px'}} />
      <input type="number" value={spinAmount} onChange={(e) => { setSpinAmount(e.target.value) }} class="input coin-input"></input>
      </div>
      </div>

      
      <div class="bet-amount-text spin-top">Spin Cost <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />{ ( (Math.floor(betAmount / spinAmount * 100) / 100) || 0).toFixed(2)}</div>

      <div class="versus-types">
        {versusTypes.map((entry, index) => <div 
        className={`versus-type ${entry == versusType && 'active'}`} 
        onClick={(e) => {
          setVersusType(entry);
        }}
        >
      <span>{entry}</span>
        </div>)}
      </div>


        <div class="fastspin-selector">
          <div class="left-area">Fast Spin</div>

          <div class="right-area">
            {[true, false].map(entry => <div 
            className={`${entry == fastSpin && 'active'}`}
            onClick={(e) => { setFastSpin(entry); }}
            >
                {entry ? 'ON' : 'OFF'}
              </div>)}
          </div>

        </div>

              <div class="create-button" onClick={(e) => {
                socket.emit('slotbattles:createRoom', {
                  betAmount,
                  spinAmount,
                  versusType,
                  fastSpin
                });
              }}>
                <span>Create</span>
              </div>
          </div>
       
        </FullPopup>
      </div>
      }

    </React.Fragment>
  );
});
