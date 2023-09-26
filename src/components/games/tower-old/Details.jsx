import React, { Fragment } from "react";
import BetAmount from "../../BetAmount";
import { socket } from "../../../Socket";
import { setMode, towersValues } from "../../../redux/ducks/towers";
import { useDispatch, useSelector } from "react-redux";

const Details = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const userBalance = useSelector((state) => state.profile.balance);

  function setBet() {
    if (ref.current !== undefined) {
      const bet = ref.current.value;

      if (bet !== "" && bet > 0) {
        socket.emit("createTowers", {
          level: props.mode,
          amount: parseFloat(bet) * 100,
        });
      }
    }
  }

  function cashout() {
    if (props.active) {
      socket.emit("towersCashout");
    }
  }

  return (
    <div className={"tower__details " + props.mode}>
      <DifficultyButtons mode={props.mode} betInput={ref} />
      <Board
        info={props.info}
        active={props.active}
        level={props.level}
        mode={props.mode}
      />

      <BetAmount
        ref={ref}
        gamemode={"towers"}
        handler={(val) => {
          dispatch(towersValues(parseFloat(val) * 100));
        }}
        userBalance={userBalance}
      />

      <button
        className="button button--green button--play"
        onClick={() => {
          !props.active ? setBet() : cashout();
        }}
      >
        {!props.active ? "Place Bet" : "Cash Out"}
      </button>
    </div>
  );
});

const DifficultyButtons = (props) => {
  const dispatch = useDispatch();

  return (
    <div className="difficulty-buttons">
      <DifficultyButton
        onClick={() => {
          dispatch(setMode("easy"));
          dispatch(towersValues(props.betInput.current.value));
        }}
        difficulty="easy"
        activeDifficulty={props.mode}
      />
      <DifficultyButton
        onClick={() => {
          dispatch(setMode("medium"));
          dispatch(towersValues(props.betInput.current.value));
        }}
        difficulty="medium"
        activeDifficulty={props.mode}
      />
      <DifficultyButton
        onClick={() => {
          dispatch(setMode("hard"));
          dispatch(towersValues(props.betInput.current.value));
        }}
        difficulty="hard"
        activeDifficulty={props.mode}
      />
    </div>
  );
};

const DifficultyButton = (props) => (
  <button
    onClick={() => props.onClick()}
    className={
      "button button--difficulty " +
      (props.difficulty === props.activeDifficulty ? "active" : "")
    }
  >
    {props.difficulty.toUpperCase()}
  </button>
);

const Board = (props) => {
  return (
    <div className="tower__board">
      {props.info !== undefined
        ? props.info
            .slice(0)
            .reverse()
            .map((info, index) => {
              return (
                <TowerNumbers
                  gameActive={props.active}
                  number={info.number}
                  answer={info.answer}
                  mode={props.mode}
                  index={props.info.slice(0).length - index - 1}
                  level={props.level}
                  active={props.level === props.info.length - 1 - index}
                  handler={(number) => {
                    socket.emit("towersCheckAlternative", {
                      alternative: number,
                    });
                  }}
                />
              );
            })
        : ""}
    </div>
  );
};

const TowerNumbers = ({
  number,
  answer,
  mode,
  active,
  index,
  level,
  handler,
  gameActive,
}) => {
  return (
    <Fragment>
      <div class="tower-area">
        <div
          onClick={() => {
            if (active) handler(1);
          }}
          style={{}}
          className={
            (!gameActive &&
              mode !== "hard" &&
              answer !== 1 &&
              answer !== undefined) ||
            (answer === 1 && (gameActive || mode === "hard"))
              ? "tower__board-value tower__board-value--green"
              : "tower__board-value tower__board-value--white" +
                (level == index ? " tower__board-current" : "") +
                ((answer > 0 && answer == 1) ||
                (answer !== undefined &&
                  !gameActive &&
                  mode == "hard" &&
                  answer !== 1)
                  ? " tower__board-notanswer"
                  : "")
          }
        >
          {number}
        </div>
        <div
          onClick={() => {
            if (active) handler(2);
          }}
          style={{}}
          className={
            (!gameActive &&
              mode !== "hard" &&
              answer !== 2 &&
              answer !== undefined) ||
            (answer === 2 && (gameActive || mode === "hard"))
              ? "tower__board-value tower__board-value--green"
              : "tower__board-value tower__board-value--white" +
                (level == index ? " tower__board-current" : "") +
                ((answer > 0 && answer == 2) ||
                (answer !== undefined &&
                  !gameActive &&
                  mode == "hard" &&
                  answer !== 2)
                  ? " tower__board-notanswer"
                  : "")
          }
        >
          {number}
        </div>
        <div
          onClick={() => {
            if (active) handler(3);
          }}
          style={{}}
          className={
            mode === "medium"
              ? "hidden"
              : (!gameActive &&
                  mode !== "hard" &&
                  answer !== 3 &&
                  answer !== undefined) ||
                (answer === 3 && (gameActive || mode === "hard"))
              ? "tower__board-value tower__board-value--green"
              : "tower__board-value tower__board-value--white" +
                (level == index ? " tower__board-current" : "") +
                ((answer > 0 && answer == 3) ||
                (answer !== undefined &&
                  !gameActive &&
                  mode == "hard" &&
                  answer !== 3)
                  ? " tower__board-notanswer"
                  : "")
          }
        >
          {number}
        </div>
      </div>
    </Fragment>
  );
};

export default Details;
