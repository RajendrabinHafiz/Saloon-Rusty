import React from "react";
import AutoInput from "../../AutoInput";
import BetAmount from "../../BetAmount";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector, useDispatch } from "react-redux";

const CrashDetails = React.forwardRef((props, ref) => {
  const { betInputRef, cashoutInputRef } = ref;

  const userId = useSelector((state) => state.profile.id);
  const userBalance = useSelector((state) => state.profile.balance);

  function getMyBetAmount() {
    if (!props.bets[`${userId}`]) return 0;
    return parseInt(props.bets[`${userId}`].amount);
    //Object.keys(props.bets).find(bet => bet.steamid);
  }
  function haveICashedOut() {
    if (!props.bets[`${userId}`]) return 0;
    return parseFloat(props.bets[`${userId}`].cashedOut) > 0;
  }
  
  return (
    <div className="crash__details">
      <BetAmount alt crashPlease={true} ref={betInputRef} betInput={props.betInput} handler={(val) => {
        props.handler(val);
      }} userBalance = {userBalance}   setBetInput = {(num) => props.setBetInput(num)}  />
      <div className="crash__auto-cashout">
        <div className="crash__auto-cashout-title">Auto Cashout</div>
        <AutoInput ref={cashoutInputRef} />
      </div>

      <button
      key={ (parseFloat(props.y) >= 1 ? 'btstarted' : 'btnotstarted') }
        className={"button button--green crash__place-bet-button"}
        onClick={() => {
          ( getMyBetAmount() > 0 && props.yEndsWithX && props.yEqualsTo1OrHigher && !haveICashedOut() ) ? props.cashout() : props.placeBet();
        }}
      >
        {/*   
        {props.y}<br />
      {getMyBetAmount()} <br />
      */
      }

        { (getMyBetAmount() > 0 && props.yEndsWithX && props.yEqualsTo1OrHigher && !haveICashedOut() ) ? <React.Fragment>
        <div class="flex flexBetween">
        <span>Cash Out</span>
        <span><FontAwesomeIcon icon="coins" className="balanceicon" />{ (Math.floor(parseFloat(props.y) * getMyBetAmount()) / 100).toFixed(2)}</span>
        </div>
        </React.Fragment> : "Place Bet"}
      </button>

      <div className="crash__players">
        <div className="crash__player">
          <div>{props.bets ? Object.keys(props.bets).length : 0} Players {props.bets[userId] ? <React.Fragment>~ My Bet { (props.bets[userId].amount / 100).toFixed(2)}</React.Fragment> : ''}  {parseFloat(props.y) >= 1 ? <React.Fragment>~ {parseFloat(props.y)}x</React.Fragment> : ''}</div>
          <div className="crash__total-bets">
          <FontAwesomeIcon icon="coins" className="balanceicon" /> {parseFloat(props.sum / 100).toFixed(2)}
          </div>
        </div>

        {props.bets
          ? Object.keys(props.bets)
              .sort((a, b) => {
                return props.bets[b].amount - props.bets[a].amount;
              })
              .map((bet) => {
      
                return (
                  <div className="crash__player">
                    <div class="flex">
                      <img src={props.bets[bet].avatar} className="crash__player__pic" />
                     <div class="crash__player__name">{props.bets[bet].username}</div>
                      </div>
                    <div>
         
                     {!props.crashed && 
                    <React.Fragment>
                      { props.bets[bet].cashedOut && <span style={{ color: '#0b923e' }}>
                        {props.bets[bet].cashedOut + 'x +'}&nbsp;
                        </span>
                      }
                      <FontAwesomeIcon icon="coins" className="balanceicon cricon" />
                      <span style={{ color: props.bets[bet].cashedOut ? '#0b923e' : 'white' }}>
                      {(props.bets[bet].cashedOut ? Math.floor(props.bets[bet].amount * props.bets[bet].cashedOut) / 100 : props.bets[bet].amount / 100).toFixed(2)}
                      </span>
                    </React.Fragment>}
                    { props.crashed &&
                    <React.Fragment>
                      <div style={{ color: props.bets[bet].cashedOut ? '#0b923e' : '#CD412A' }}>
                      {props.bets[bet].cashedOut ? `${props.bets[bet].cashedOut}x + ` : '-'}
                      <FontAwesomeIcon icon="coins" className="balanceicon cricon" />
                      {(props.bets[bet].cashedOut ? Math.floor(props.bets[bet].amount * props.bets[bet].cashedOut) / 100 : props.bets[bet].amount / 100).toFixed(2)}
                      </div>
                    </React.Fragment>
                    }
                    </div>
                  </div>
                );
              })
          : ""}
      </div>
    </div>
  );
});

export default CrashDetails;
