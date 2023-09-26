import React from "react";

const PreviousRolls = (props) => {
  return (
    <div className="previous-rolls">
      <div className="previous-rolls-text hide-on-mobile">Pevious rolls</div>
      <div className="previous-circles">
        {props.rolls.slice(0, 10).map((data, i) => {
          return <HistoryCircle info={data.fairRound.ticket} key={i} />;
        })}
      </div>
    </div>
  );
};

const getRightIcon = (props) => {
  if (props.info === 0) {
    return "green-icon.svg";
  } else if (props.info <= 7) {
    return "red-icon.svg";
  } else {
    return "black-icon.svg";
  }
};

const HistoryCircle = (props) => {
  return (
    <div
      key={props.key}
      className={
        props.info === 0
          ? "roll-circle roll-circle--green"
          : props.info <= 7
          ? "roll-circle roll-circle--red"
          : "roll-circle roll-circle--black"
      }
    >
      <img
        className="roll-circle--img"
        src={process.env.PUBLIC_URL + "/images/" + getRightIcon(props)}
        alt=""
      />
    </div>
  );
};

export default PreviousRolls;
