import React from "react";
import {socket} from '../Socket';

const BettingButton = React.forwardRef((props, ref) => {

    return (
      <button 
        className={props.className}
        onClick={ () => {

          let newVal = -1;
            if(props.add){
              newVal = Math.round(eval( (ref ? ref.current.value : props.betInput) + "+" + props.add) * 100) / 100;
            } else if(props.multiply){
              newVal = Math.round(eval( (ref ? ref.current.value : props.betInput) + "*" + props.multiply) * 100) / 100;
            } else if(props.set === 0 || props.set) {
              newVal = props.set;
            } 
            if (newVal !== -1) {
              ref ? ref.current.value = newVal : props.setBetInput(newVal);
            }
            if(props.max){
              socket.emit("maxButton");
            }

            
          if (props.handler && typeof props.handler == "function") {
            props.handler(newVal)
          }
          }

        }
      >
        {props.children}
      </button>
    )
});

  export default BettingButton;