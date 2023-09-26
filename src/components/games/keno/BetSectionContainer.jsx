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
  clearTable,
  autoPick,
  selectedCards,
}) => {
  const betInput = useRef(null);
  const dispatch = useDispatch();
  const { beted, betType, muted, beting, onAction, numberOfbets, difficulty } =
    useSelector((state) => state.keno);

  const updateConstant = (type, data) => {
    dispatch({ type: "UPDATE_KENO_STATE", payload: { [type]: data } });
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
        <div className="label">BET AMOUNT</div>
        <div className="input">
          <img src="/images/diamond.svg" alt="" className="coin" />
          <input
            type="number"
            disabled={beting}
            placeholder="Bet Amount"
            ref={betInput}
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

      {betType === 0x0 ? (
        <>
          <div className="small-container">
            <div className="label">RISK</div>

            <div className="difficulty">
              {["Classic", "Low", "Medium", "High"].map((text_def, index) => (
                <div
                  className={
                    "diff-item" + (difficulty === index ? " active" : "")
                  }
                  onClick={() => {
                    if (beting) {
                      toast.error("You can't switch while beting");
                    } else {
                      updateConstant("difficulty", index);
                      // initTowerCards(beted, index);
                    }
                  }}
                  key={index}
                >
                  {text_def}
                </div>
              ))}
            </div>
          </div>
          <div
            className={"primary-button" + (beting ? " disabled" : "")}
            onClick={() => autoPick()}
          >
            Auto pick
          </div>
          {selectedCards > 0 ? (
            <div
              className={"primary-button" + (beting ? " disabled" : "")}
              onClick={() => !beting && clearTable()}
            >
              Clear Table
            </div>
          ) : null}
        </>
      ) : null}
      <div
        onClick={() => betStart()}
        className={
          "bet-button" +
          ((beting && betType === 0x0) || !beted || selectedCards < 1
            ? " disabled"
            : "")
        }
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
