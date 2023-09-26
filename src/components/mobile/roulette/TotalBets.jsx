import React, { useState } from "react";
import BettingListItem from "../../BettingListItem";
import { socket } from "../../../Socket";

const TotalBets = React.forwardRef((props, ref) => {
  return (
    <React.Fragment>
      <div className="win-bet-container">
        <div className="win-bet-display">
          <div
            className="projected-win projected-win--red"
            onClick={() => {
              socket.emit("roulettePlaceBet", {
                color: "red",
                amount: parseFloat(ref.current.value) * 100,
              });
            }}
          >
            <div>Place Bet</div>
            <div>&nbsp;| 2x</div>
          </div>
        </div>

        <div className="win-bet-display">
          <div
            className="projected-win projected-win--green"
            onClick={() => {
              socket.emit("roulettePlaceBet", {
                color: "green",
                amount: parseFloat(ref.current.value) * 100,
              });
            }}
          >
            <div>Place Bet</div>
            <div>&nbsp;| 14x</div>
          </div>
        </div>

        <div className="win-bet-display">
          <div
            className="projected-win projected-win--black"
            onClick={() => {
              socket.emit("roulettePlaceBet", {
                color: "black",
                amount: parseFloat(ref.current.value) * 100,
              });
            }}
          >
            <div>Place Bet</div>
            <div>&nbsp;| 2x</div>
          </div>
        </div>
      </div>

      <ShowAllBetsContainer
        color="red"
        players={props.players.red}
        totalAmount={props.total.red}
        done={props.done}
      />
      <ShowAllBetsContainer
        color="green"
        players={props.players.green}
        totalAmount={props.total.green}
        done={props.done}
      />
      <ShowAllBetsContainer
        color="black"
        players={props.players.black}
        totalAmount={props.total.black}
        done={props.done}
      />
    </React.Fragment>
  );
});

const ShowAllBetsContainer = (props) => {
  const [betsVisible, setBetsVisible] = useState(false);
  return (
    <div className="win-bet-display__footer">
      <div className={`roll-circle roll-circle--${props.color}`}></div>
      <div className="win-bet-display__container">
        <div className="win-bet-display__label-value-container">
          <div className="win-bet-display__label">
            {props.players !== undefined
              ? Object.keys(props.players).length
              : 0}{" "}
            Bets
          </div>
          <div className="win-bet-display__value">
            <img src={process.env.PUBLIC_URL + "/images/coins.svg"} alt="" />
            {props.totalAmount ? (props.totalAmount / 100).toFixed(2) : "0.00"}
          </div>
        </div>
        <div onClick={() => setBetsVisible(!betsVisible)}>Show all bets</div>
        <div className={betsVisible ? "" : "hidden"}>
          {props.players !== undefined
            ? Object.keys(props.players)
                .sort((a, b) => {
                  return (
                    Number(props.players[b].amount) -
                    Number(props.players[a].amount)
                  );
                })
                .map((player, i) => {
                  return (
                    <BettingListItem
                      player={props.players[player]}
                      done={props.done}
                    />
                  );
                })
            : null}
        </div>
      </div>
    </div>
  );
};

export default TotalBets;
