import { useEffect } from "react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

export const BetSectionContainer = ({
  setFairnessPanel,
  betStart,
  initTowerCards,
}) => {
  const betInput = useRef(null);
  const dispatch = useDispatch();
  const { beted, muted, beting, difficulty, towersMaxReward } = useSelector(
    (state) => state.towers,
  );

  useEffect(() => {
    let betAmount = parseFloat(betInput.current.value);
    betAmount !== beted && (betInput.current.value = beted);
    initTowerCards(beted);
  }, [beted]);

  const updateConstant = (type, data) => {
    dispatch({ type: "UPDATE_TOWERS_STATE", payload: { [type]: data } });
  };

  const setBetAmount = (amount) => {
    if (amount && String(amount).match(/^[0-9.]+$/)) {
      let amountInt = parseFloat(amount);
      if (beted !== amountInt || amountInt === 0) {
        updateConstant("beted", Math.max(amountInt, 0.01));
        initTowerCards(amountInt);
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
    <div className="details-container">
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
      </div>
      <div className="small-container">
        <div className="label">difficulty</div>

        <div className="difficulty">
          {["Easy", "Medium", "Hard"].map((text_def, index) => (
            <div
              className={"diff-item" + (difficulty === index ? " active" : "")}
              onClick={() => {
                if (beting) {
                  toast.error("You can't switch while beting");
                } else {
                  updateConstant("difficulty", index);
                  initTowerCards(beted, index);
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
        onClick={() => betStart()}
        className={"bet-button" + (!beted ? " disabled" : "")}
        // onClick={() => !beting && beted && addCard()}
      >
        {beting ? "Cash Out" : "Bet"}
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
