import React from "react";
import BettingListItem from "./BettingListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WinBetDisplay = (props) => {
  return (
    <div className="win-bet-display">
      <div
        className={`projected-win__dark projected-win__dark--${props.color}`}
      >
        <div
          className={`projected-win__outline projected-win__outline--${props.color}`}
        >
          <div
            className={`projected-win projected-win--${props.color}`}
            onClick={props.onClick}
          >
            <div class="flex">
              <img
                class={`projected-win__icon projected-win__icon--${props.color}`}
                src={
                  process.env.PUBLIC_URL +
                  `/images/${
                    props.color === "yellow" ? "wild" : props.color
                  }-icon.svg`
                }
              />
              <div class="capitalize bet-color">Bet {props.color}</div>
            </div>
            <div
              className={`win-bet__button-multiplier win-bet__button-multiplier--${props.color}`}
            >
              WIN {props.multiplier}x
            </div>
          </div>
        </div>
      </div>

      <div className="win-bet-display__footer">
        <div class="flex">
          <img
            class="win-bet-display-icon"
            src={process.env.PUBLIC_URL + "/images/user-transparent.svg"}
          />
          <div className="win-bet-display__label">
            {props.players !== undefined
              ? Object.keys(props.players).length
              : 0}{" "}
            Bets
          </div>
        </div>
        <div className="win-bet-display__value">
          <img
            src="http://144.91.93.36/images/coins.svg"
            className="balanceicon"
            alt=""
          />
          {props.totalAmount ? (props.totalAmount / 100).toFixed(2) : "0.00"}
        </div>
      </div>

      <div className="win-bet-display__betting-list"> 
          
        {props.players !== undefined &&
          Object.keys(props.players)
            .sort((a, b) => {
              console.log(props.players);
              return (
                Number(props.players[b].amount) -
                Number(props.players[a].amount)
              );
            })
            .map((player, i) => {
              return (
                <BettingListItem
                  multiplier={props.multiplier}
                  color={props.color}
                  winningColor={props.winningColor}
                  player={props.players[player]}
                  done={props.done}
                />
              );
            })}
      </div>
    </div>
  );
};

export default WinBetDisplay;
