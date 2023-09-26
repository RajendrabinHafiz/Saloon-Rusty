import React from "react";
import { useSelector, useDispatch } from "react-redux";

const SpinnerFT = (props) => {
  const animation = useSelector((state) => state.wof.animation);

  function getSpinnerTransform() {
    return "rotate(-" + animation.offsetX + "deg)";
  }

  return (
    <div className="FT__spinner-container">
      <img
        className="FT__spinner-img"
        src={process.env.PUBLIC_URL + "/images/spin-wheel.png"}
        style={{ transform: getSpinnerTransform() }}
        id="FT__spinner-img"
        alt=""
      />
      <div class="FT__indicator"></div>
      <div className="FT__spinner-inner">
        {props.remainingTime <= 0
          ? "Spinning"
          : `${(props.remainingTime / 1000).toFixed(1)}s`}
      </div>
    </div>
  );
};

export default SpinnerFT;
