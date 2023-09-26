import { useRef } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

const betTypes = [
  {
    t: "text",
    v: "Manual",
  },
  {
    t: "text",
    v: "Auto",
  },
];

export const bet_amounts = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];

export const abbreviateNumber = (n) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};

export const BetSectionContainer = ({ setFairnessPanel, betStart }) => {
  const betInput = useRef(null);
  const pokerCirclesContainer = useRef(null);
  const dispatch = useDispatch();
  const {
    beted,
    betType,
    muted,
    beting,
    onAction,
    numberOfbets,
    currentPokerCircle,
    pokerCirclesX,
  } = useSelector((state) => state.baccarat);

  const updateConstant = (type, data) => {
    dispatch({ type: "UPDATE_BACCARAT_STATE", payload: { [type]: data } });
  };

  const switchBetType = (index) => {
    if (beting) {
      return toast.error("You can't change bet type while beting");
    }
    index !== betType && updateConstant("betType", index);
  };

  const setBetAmount = (amount) => {
    if (amount && String(amount).match(/^[0-9.]+$/)) {
      let amountInt = Math.max(parseFloat(amount), 0.01);
      if (beted !== amountInt) {
        updateConstant("beted", amountInt);
      }
    }
  };

  const changeInputValue = (amount, ref) => {
    if (ref.current && typeof amount === "number" && !beting) {
      setBetAmount(amount);
      ref.current.value = amount;
    }
  };

  const changePokerAmountsPage = (action = 0x0) => {
    if (!pokerCirclesContainer.current) return;
    let lineHeart = null,
      parentWidth = pokerCirclesContainer.current.getBoundingClientRect().width;

    if (parentWidth) {
      lineHeart = action === 0x1 ? parentWidth - parentWidth * 2 + 5 : 0; // Plus 5px for the margin
    }

    if (
      (action === 0x0 && pokerCirclesX === 0x0) ||
      pokerCirclesX === lineHeart
    ) {
      return;
    }

    updateConstant("pokerCirclesX", lineHeart);
  };

  return (
    <div className="bet-section-container">
      <div className="type-betting">
        {betTypes.map((bet, index) => (
          <div
            onClick={() => switchBetType(index)}
            className={"betting-type" + (index === betType ? " active" : "")}
            key={index}
          >
            {bet.t === "text" ? (
              <span>{bet.v}</span>
            ) : (
              <img src={bet.v} alt="" />
            )}
          </div>
        ))}
      </div>
      <div className="betting">
        <div className="label">SELECT AMOUNT</div>
        <div className="switcher-input">
          <div
            className="button-control"
            onClick={() => changePokerAmountsPage()}
          >
            <img src="/images/chevron-left.svg" alt="" />
          </div>
          <div className="contnet-cards" ref={pokerCirclesContainer}>
            <div
              className="container-circles"
              style={{ transform: `translateX(${pokerCirclesX}px)` }}
            >
              {bet_amounts.map((amount, index) => (
                <div
                  className={
                    "amount-circle-poker" +
                    (index === currentPokerCircle ? " active" : "")
                  }
                  onClick={() => updateConstant("currentPokerCircle", index)}
                  key={index}
                >
                  <img src="/images/new_form/hover-circle-poker.svg" alt="" />
                  <span>{abbreviateNumber(amount)}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="button-control"
            onClick={() => changePokerAmountsPage(1)}
          >
            <img src="/images/chevron-right.svg" alt="" />
          </div>
        </div>
        {betType === 1 ? (
          <>
            <div className="label">Number of bets</div>
            <div className="input prts">
              <input
                type="number"
                defaultValue={numberOfbets}
                onChange={(event) =>
                  event.target.value &&
                  String(event.target.value).match(/^[0-9]+$/) &&
                  parseFloat(event.target.value) >= 0 &&
                  updateConstant(
                    "numberOfbets",
                    parseFloat(event.target.value ?? 0x0),
                  )
                }
              />
              <img
                className="right"
                src="/images/new_form/infinity.svg"
                alt=""
              />
            </div>

            <div className="label">On Win</div>
            <div
              className={
                "partittwo" + (onAction.onWin === 0x0 ? " disabled" : "")
              }
            >
              <div className="left-buttons">
                {["Reset", "Increase By:"].map((item, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      updateConstant("onAction", { ...onAction, onWin: index })
                    }
                    className={
                      "button" + (index === onAction.onWin ? " active" : "")
                    }
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="input prts">
                <input
                  type="number"
                  defaultValue={0}
                  disabled={onAction.onWin === 0x0}
                />
                <img
                  className="right"
                  src="/images/new_form/parcent.svg"
                  alt=""
                />
              </div>
            </div>
            <div className="label">On Loss</div>
            <div
              className={
                "partittwo" + (onAction.onLoss === 0x0 ? " disabled" : "")
              }
            >
              <div className="left-buttons">
                {["Reset", "Increase By:"].map((item, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      updateConstant("onAction", { ...onAction, onLoss: index })
                    }
                    className={
                      "button" + (index === onAction.onLoss ? " active" : "")
                    }
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="input prts">
                <input
                  type="number"
                  defaultValue={0}
                  disabled={onAction.onLoss === 0x0}
                />
                <img
                  className="right"
                  src="/images/new_form/parcent.svg"
                  alt=""
                />
              </div>
            </div>
            <div className="label">Stop on Profit</div>
            <div className="input">
              <img className="" src="/images/diamond.svg" alt="" />
              <input type="number" defaultValue={0} />
            </div>
            <div className="label">Stop on Loss</div>
            <div className="input">
              <img className="" src="/images/diamond.svg" alt="" />
              <input type="number" defaultValue={0} />
            </div>
          </>
        ) : (
          <>
            <div className="label">Total Bet</div>
            <div className="input prts">
              <input
                type="number"
                defaultValue={numberOfbets}
                onChange={(event) =>
                  event.target.value &&
                  String(event.target.value).match(/^[0-9]+$/) &&
                  parseFloat(event.target.value) >= 0 &&
                  updateConstant(
                    "numberOfbets",
                    parseFloat(event.target.value ?? 0x0),
                  )
                }
              />
              <img
                className="right"
                src="/images/diamond.svg"
                alt=""
              />
            </div>
          </>
        )}
      </div>

      <div
        onClick={() => betStart()}
        className={
          "bet-button" +
          ((beting && betType === 0x0) || !beted ? " disabled" : "")
        }
        // onClick={() => !beting && beted && addCard()}
      >
        {betType === 0 ? "Bet" : beting ? "Stop AutoBet" : "Start AutoBet"}
      </div>

      <div className="end-bar">
        <div
          className="fairness button-bar"
          onClick={() => setFairnessPanel(true)}
        >
          Fairness
        </div>
        <div
          className={"button-bar " + (!muted ? "unmute" : "mute")}
          onClick={() => updateConstant("muted", !muted)}
        >
          <img
            src={`/images/new_form/speaker${!muted ? "-mute" : ""}.svg`}
            alt=""
          />
          <span>{muted ? "Unmute" : "Mute"}</span>
        </div>
      </div>
    </div>
  );
};
