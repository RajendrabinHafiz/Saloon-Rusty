import React, { useEffect } from "react";
import CoinInput from "./CoinInput";
import BettingButton from "./BettingButton";
import { socket } from "../Socket";

const BetAmount = React.forwardRef((props, ref) => {
  useEffect(() => {
    socket.on("maxButton", (bal) => {
      ref
        ? (ref.current.value = Number(bal > 1000 ? 1000 : bal))
        : props.setBetInput(Number(bal > 1000 ? 1000 : bal));
    });
  });

  /*
          betInput = {props.betInput} 
        setBetInput = {(num) => props.setBetInput(num)} 
        handler={() => {props.handler()}}
        */

  return (
    <div className={"bet-amount " + (props.alt ? "bet-amount--alt" : "")}>
      <div className="bet-amount__title">Bet Amount</div>
      <CoinInput
        crashPlease={props.crashPlease}
        betInput={props.betInput}
        setBetInput={(num) => props.setBetInput(num)}
        handler={(num) => {
          if (props.handler && typeof props.handler == "function")
            props.handler(num);
        }}
        ref={ref}
      />
      <div className="bet-amount__buttons hide-on-mobile">
        {!props.mobile ? (
          <BettingButton
            set={0}
            betInput={props.betInput}
            setBetInput={(num) => {
              props.setBetInput(num);
            }}
            ref={ref}
            handler={(val) => {
              if (props.handler && typeof props.handler == "function")
                props.handler(val);
            }}
            className="button bet-amount__button"
          >
            Clear
          </BettingButton>
        ) : null}

        <BettingButton
          multiply={0.5}
          betInput={props.betInput}
          setBetInput={(num) => {
            props.setBetInput(num);
          }}
          ref={ref}
          handler={(val) => {
            if (props.handler && typeof props.handler == "function")
              props.handler(val);
          }}
          className="button bet-amount__button"
        >
          1/2
        </BettingButton>
        <BettingButton
          multiply={2}
          betInput={props.betInput}
          setBetInput={(num) => {
            props.setBetInput(num);
          }}
          ref={ref}
          handler={(val) => {
            if (props.handler && typeof props.handler == "function")
              props.handler(val);
          }}
          className="button bet-amount__button"
        >
          x2
        </BettingButton>
        <BettingButton
          set={props.userBalance / 100 > 1000 ? 1000 : props.userBalance / 100}
          betInput={props.betInput}
          setBetInput={(num) => {
            props.setBetInput(num);
          }}
          ref={ref}
          handler={(val) => {
            if (props.handler && typeof props.handler == "function")
              props.handler(val);
          }}
          className="button bet-amount__button"
        >
          Max
        </BettingButton>
      </div>
    </div>
  );
});

export default BetAmount;
