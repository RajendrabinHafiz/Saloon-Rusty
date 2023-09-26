import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const defs = useSelector((state) => state.slots.defs);

  return (
    <div class="slots__game-area-wrap">

     <div id="gameContainer" class="game-container">

    
       {/* index + 1 == ofset */}
       {/* defs.LINES */} 
     {[...new Array(3)].map((el, index) =>
      <div className={`slot-line-wrap ${!props.directAnimations ? `wrap-animation-${props.isFastSpin ? 'fast-' : ''}${index + 1}` : ''}`} style={{transform: props.lineTransforms[index + 1]}}>

{[...new Array(8)].map((dummyel, dummyindex) =>
          <div class="slot-line">
{defs.LINES[index + 1].map((el, lineElIndex) =>
        <div class="slot-line-entry">
          <img src={`/images/slots/${defs.LINES[index + 1][lineElIndex].toLowerCase()}.png`} />
        </div>

)}
      </div>

)}
      </div>
     )}

<div class="slot-line-indicator"></div>

  {props.lastGameData.time > 0 && props.canSpin && <div class="slot-winnings-wrap" key={props.lastGameData.time}>

    <div class="slot-winnings">
      <span className={`amount ${props.lastGameData.winnings > 0 ? 'color-green' : 'color-red'}`}>{props.lastGameData.winnings > 0 ? '+' : '-'} {((props.lastGameData.winnings > 0 ? props.lastGameData.winnings : props.lastGameData.betAmount) / 100).toFixed(2)}</span>
      <FontAwesomeIcon icon="coins" className="balanceicon rlicon" />
    </div>
  </div>}

     </div>
    </div>
  );
});

