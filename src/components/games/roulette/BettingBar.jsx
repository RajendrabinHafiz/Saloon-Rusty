import React, { useEffect } from "react";
import { socket } from "../../../Socket";
import CoinInput from "../../CoinInput";
import BettingButton from "../../BettingButton";
import { useSelector } from "react-redux";

const BettingBar = React.forwardRef((props, ref) => {
  const { mobile } = useSelector((state) => state.main);

  useEffect(() => {
    socket.on("maxButton", (bal) => {
      ref.current.value = Number(bal > 1000 ? 1000 : bal);
    });

    return () => {
      socket.off("maxButton");
    };
  }, [ref]);

  return (
    <div className="betting-bar">
      <div>
        <CoinInput containerClass="betting-bar-input-container" ref={ref} />
      </div>

      <div className="hide-on-mobile">
        {!mobile ? (
          <>
            <BettingButton
              set={0}
              ref={ref}
              className="button betting-bar__betting-button  clear__button"
            >
              CLEAR
            </BettingButton>
            <BettingButton
              add={0.01}
              ref={ref}
              className="button betting-bar__betting-button"
            >
              +0.01
            </BettingButton>
            <BettingButton
              add={0.1}
              ref={ref}
              className="button betting-bar__betting-button"
            >
              +0.1
            </BettingButton>
            <BettingButton
              add={1}
              ref={ref}
              className="button betting-bar__betting-button"
            >
              +1
            </BettingButton>
            <BettingButton
              add={10}
              ref={ref}
              className="button betting-bar__betting-button"
            >
              +10
            </BettingButton>
            <BettingButton
              add={100}
              ref={ref}
              className="button betting-bar__betting-button"
            >
              +100
            </BettingButton>
          </>
        ) : null}
        <BettingButton
          multiply={0.5}
          ref={ref}
          className="button betting-bar__betting-button"
        >
          1/2
        </BettingButton>
        <BettingButton
          multiply={2}
          ref={ref}
          className="button betting-bar__betting-button"
        >
          x2
        </BettingButton>
        <BettingButton
          set={props.userBalance / 100 > 1000 ? 1000 : props.userBalance / 100}
          ref={ref}
          className="button betting-bar__betting-button"
        >
          Max
        </BettingButton>
      </div>
    </div>
  );
});

export default BettingBar;
