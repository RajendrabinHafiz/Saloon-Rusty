import React, { useRef, useEffect, useState } from "react";

const Slider = props => {
  
  const max = 10000;
  const min = 1;
  const ref = useRef();


  useEffect(() => {
    
    calcColors();
  }, [props.val]);

  function calcColors() {

    var value = ((ref.current.value - min) / (max - min)) * 100;

    ref.current.style.background = props.type == 'over' ?
    ("linear-gradient(to right, #cd412a 0%, #cd412a " +
      value +
      "%, #0b933e " +
      value +
      "%, #0b933e 100%)") : 
      ("linear-gradient(to right, #0b933e 0%, #0b933e " +
        value +
        "%, #cd412a " +
        value +
        "%, #cd412a 100%)"
      );
  }

  return (
    <div className="dice__slider-container">
      0% 
      <input
        type="range"
        min="0"
        max="10000"
        value={props.val}
        onChange={e => {
          if (e.target.value < 600) e.target.value = 600;
          if (e.target.value > 9900) e.target.value = 9900;
          props.handler(e.target.value);
          if (props.onChange) props.onChange(e);
        }}
        className="slider dice__slider"
        //onInput={calcColors()}
        ref={ref}
      />
      100%
    </div>
  );
};

export default Slider;
