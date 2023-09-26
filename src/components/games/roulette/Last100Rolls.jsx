import React from "react";

const Last100Rolls = props => {
  return (
    <div className="last-100">
      <div className="last-100-text hide-on-mobile">Last 100</div>
      <div className="last-100__data">
        <div className="flex">
          <div className="roll-circle roll-circle--red flex-center">
           <img className="roll-circle--img" src={process.env.PUBLIC_URL + "/images/red-icon.svg"}/>
          </div>
          {props.red}
        </div>
        <div className="flex">
          <div className="roll-circle roll-circle--black flex-center">
           <img className="roll-circle--img" src={process.env.PUBLIC_URL + "/images/black-icon.svg"}/>
          </div>
          {props.black}
        </div>
        <div className="flex">
          <div className="roll-circle roll-circle--green flex-center">
            <img className="roll-circle--img" src={process.env.PUBLIC_URL + "/images/green-icon.svg"}/>
          </div>
          {props.green}
        </div>
        <div className="flex">
          <div className="roll-circle roll-circle--wild flex-center">
           <img className="roll-circle--img" src={process.env.PUBLIC_URL + "/images/wild-icon.svg"}/>
          </div>
          {props.wild}
        </div>
      </div>
    </div>
  );
};

export default Last100Rolls;
