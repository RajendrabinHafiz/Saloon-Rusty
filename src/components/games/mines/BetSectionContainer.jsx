import { useEffect } from "react";
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

export const BetSectionContainer = ({
  setFairnessPanel,
  betStart,
  profit,
  initCardsMines,
}) => {
  const betInput = useRef(null);
  const minesCountInput = useRef(null);
  const dispatch = useDispatch();
  const {
    beted,
    muted,
    beting,
    betType,
    lastStar,
    cards,
    minesCount,
    onAction,
    numberOfbets,
    cardsSelected,
  } = useSelector((state) => state.mines);

  const updateConstant = (type, data) => {
    dispatch({ type: "UPDATE_MINES_STATE", payload: { [type]: data } });
  };

  const setBetAmount = (amount) => {
    if (amount && String(amount).match(/^[0-9.]+$/)) {
      let amountInt = parseFloat(amount);
      if (beted !== amountInt || amountInt === 0) {
        updateConstant("beted", Math.max(amountInt, 0.01));
      }
    }
  };

  const setMinesCount = (count) => {
    if (count && String(count).match(/^[0-9.]+$/)) {
      let countInt = parseInt(count);
      updateConstant("minesCount", Math.max(countInt, 1));
      minesCountInput.current && (minesCountInput.current.value = countInt);
    } else {
      toast.error("Invalid mines count");
    }
  };

  const changeInputValue = (amount, ref) => {
    if (ref.current && typeof amount === "number" && !beting) {
      setBetAmount(amount);
      ref.current.value = amount;
    }
  };

  const switchBetType = (index) => {
    if (beting) {
      return toast.error("You can't change bet type while beting");
    }
    if (index !== betType) {
      updateConstant("betType", index);
      initCardsMines();
    }
  };

  return (
    <div className="details-container">
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
        <div className="label">BET AMOUNT</div>
        <div className="input">
          <img src="/images/diamond.svg" alt="" className="coin" />
          <input
            type="number"
            placeholder="Bet Amount"
            disabled={beting}
            ref={betInput}
            defaultValue={0}
            onChange={(event) => setBetAmount(event.target.value)}
          />
          <div className="duplicate-buttons">
            <div
              className="button"
              onClick={() => {
                beted &&
                  betInput.current &&
                  changeInputValue(
                    Math.max(
                      0.01,
                      (parseFloat(betInput.current.value) / 2).toFixed(2),
                    ),
                    betInput,
                  );
              }}
            >
              1/2
            </div>
            <div
              className="button"
              onClick={() => {
                beted &&
                  betInput.current &&
                  changeInputValue(
                    parseFloat(betInput.current.value) * 2,
                    betInput,
                  );
              }}
            >
              2x
            </div>
            <div
              className="button"
              onClick={() => {
                beted && betInput.current && betInput(0, betInput);
              }}
            >
              MAX
            </div>
          </div>
        </div>

        {beting && betType === 0 ? (
          <>
            <div className="inputs-two">
              <div className="input-form">
                <div className="label">Mines</div>
                <div className="input-side">
                  <img src="/images/new_form/bomb-gray.svg" alt="" />
                  <input
                    type="number"
                    readOnly={true}
                    defaultValue={minesCount}
                  />
                </div>
              </div>
              <div className="input-form">
                <div className="label">Gems</div>
                <div className="input-side">
                  <img src="/images/new_form/star-mines.svg" alt="" />
                  <input
                    type="number"
                    readOnly={true}
                    defaultValue={25 - (minesCount ?? 0)}
                  />
                </div>
              </div>
            </div>
            <div className="label">
              TOTAL PROFIT ({(profit || 0x1).toFixed(2)}x)
            </div>
            <div className="input prts">
              <input type="number" defaultValue={"0.00"} readOnly={true} />
              <img className="right" src="/images/diamond.svg" alt="" />
            </div>
          </>
        ) : (
          <>
            <div className="label">Mines</div>
            <div className="input mines-input">
              <img src="/images/new_form/bomb-gray.svg" alt="" />
              <div className="right">
                <input
                  type="number"
                  min={1}
                  defaultValue={minesCount}
                  ref={minesCountInput}
                  onChange={(e) => setMinesCount(e.target.value)}
                />
                <div className="suggestions">
                  <div className="sugg" onClick={() => setMinesCount(5)}>
                    5
                  </div>
                  <div className="sugg" onClick={() => setMinesCount(10)}>
                    10
                  </div>
                  <div className="sugg" onClick={() => setMinesCount(20)}>
                    20
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
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
        ) : null}
      </div>

      <div
        onClick={() => betStart()}
        className={
          "bet-button" +
          (!beted ||
          (!beting && betType === 0x1 && cardsSelected.length === 0x0)
            ? " disabled"
            : "")
        }
        // onClick={() => !beting && beted && addCard()}
      >
        {beting
          ? betType === 0x1
            ? "Stop AutoBet"
            : "Cash Out"
          : betType === 0x1
          ? "Start AutoBet"
          : "Bet"}
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
