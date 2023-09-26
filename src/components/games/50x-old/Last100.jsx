import React from "react";
import ColorBar from "../../ColorBar";

const Last100 = props => {
  return (
    <div className="last-100-bar">
      <div class="bar-wrap">
      <div className="last-100-bar__title hide-on-mobile">LAST 100 ROLLS</div>
      <div clas="bar-items">
      <ColorBar color="red" />
      {props.lastBets.red}
      <ColorBar color="black" />
      {props.lastBets.black}
      <ColorBar color="green" />
      {props.lastBets.green}
      <ColorBar color="yellow" />
      {props.lastBets.yellow}
      </div>
      </div>
    </div>
  );
};

export default Last100;
