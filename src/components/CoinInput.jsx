import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ToastContainer, toast } from "react-toastify";

var countDecimals = function (value) {
  try {
  if(Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0; 
  } catch {
    return 0;
  }
}

function retoastr(type, msg) {
  if (toast[type]) {
    toast[type](msg, { position: toast.POSITION.BOTTOM_LEFT });
  }
}

const CoinInput = React.forwardRef((props, ref) => {

  function restrictChars ($event) {
    if (
      $event.charCode === 0 ||
      new RegExp(/^[0-9.-]*$/).test(String.fromCharCode($event.charCode))
    ) {
      return true;
    } else {
      $event.preventDefault();
      return false;
    }
  }
  return (
    <div className={"coin-input-container " + props.containerClass}>
       <img src={process.env.PUBLIC_URL + "/images/coins.svg"} className="balanceicon" />
      <input
        placeholder="0.00"
        id="betInput"
        type="text"
        step="0.01"
        min="0"
        className={"input coin-input " + props.inputClass}
        onKeyPress={restrictChars}
        onChange={(e) => {
          let val = e.target.value;
          //value={props.crashPlease ? (ref && ref.current && ref.current.value) : (props.betInput ? props.betInput : null)}
          if (parseFloat(val) > 1000) { retoastr('error', 'Max bet is 1000.00 coins!'); val = 1000; }
          if (ref && ref.current && !props.crashPlease) ref.current.value = val;
          else {
            console.log(val)
            props.setBetInput(val);
          }
          if (props.handler) props.handler(val);
          //ref ? (ref.current.value = e.target.value) : props.setBetInput(e.target.value);
        }}
        ref={ref}
      />
      <button
        className="button"
        onClick={() => {
          ref ? (ref.current.value = "") : props.setBetInput(0);
        }}
      >
        
      
      </button>
    </div>
  );
});
export default CoinInput;

/*
  <img id="button-clear-button" src={process.env.PUBLIC_URL + "/images/x.svg"} alt="" />
      
  */