import React from "react";
import { socket } from "../../../Socket";
import WinBetDisplay from "../../WinBetDisplay";

const TotalBets = React.forwardRef((props, ref) => {
  return (
    <div className="win-bet-container">
      <WinBetDisplay
        color="red"
        multiplier={Number(2)}
        players={props.players ? props.players.red : undefined}
        totalAmount={props.total.red}
        projected={props.projected.red}
        onClick={() => {
          socket.emit(props.emitPacket ?? "roulettePlaceBet", {
            color: "red",
            amount: parseFloat(ref.current.value) * 100,
          });
        }}
        done={props.done}
      />
      <WinBetDisplay
        color="black"
        multiplier={Number(2)}
        players={props.players ? props.players.black : undefined}
        totalAmount={props.total.black}
        projected={props.projected.black}
        onClick={() => {
          socket.emit(props.emitPacket ?? "roulettePlaceBet", {
            color: "black",
            amount: parseFloat(ref.current.value) * 100,
          });
        }}
        done={props.done}
      />
      <WinBetDisplay
        color="green"
        multiplier={Number(14)}
        players={props.players ? props.players.green : undefined}
        totalAmount={props.total.green}
        projected={props.projected.green}
        onClick={() => {
          socket.emit(props.emitPacket ?? "roulettePlaceBet", {
            color: "green",
            amount: parseFloat(ref.current.value) * 100,
          });
        }}
        done={props.done}
      />
      <WinBetDisplay
        color="wild"
        multiplier={Number(7)}
        players={props.players ? props.players.green : undefined}
        totalAmount={props.total.green}
        projected={props.projected.green}
        onClick={() => {
          socket.emit(props.emitPacket ?? "roulettePlaceBet", {
            color: "green",
            amount: parseFloat(ref.current.value) * 100,
          });
        }}
        done={props.done}
      />
    </div>
  );
});

export default TotalBets;
