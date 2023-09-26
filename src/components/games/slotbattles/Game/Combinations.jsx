import React, { Fragment } from "react";

import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



function SlotCombination(props) {
  const defs = useSelector((state) => state.slots.defs || state.slotbattles.defs);
  return (
    <div className={`slots__combinations-list-el list-el-${Math.floor(props.index / 3) + 0} ${props.multiplierKey == props.lastMultiplierKey && props.canSpin ? 'active' : ''}`}
    style={{ gridColumn: `${props.lastElement ? '3 / 2' : 'initial'}` }}
    >

    <div class={`multiplier`}>{props.multiplier}x</div>
    <div class="sequence">
    {[...new Array(3)].map((el, index) =>
      <div class="sequence-entry">
        {props.combationItems.length - 1 >= index ? <React.Fragment>
          <img src={`/images/slots/${props.combationItems[index].toLowerCase()}.png`} />
        </React.Fragment> : 
        <React.Fragment>
          <div class="any"></div>
        </React.Fragment>
        }
      </div>
    )}
    </div>
  </div>
  )
}

export default React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const defs = useSelector((state) => state.slotbattles.defs);

  return (
    <div class="slots__game-combinations">

      <div class="combinations-header">

        <img src="/images/slots/combinations.png" />
        <span>COMBINATIONS</span>
      </div>

      
      <div class="slots__combinations-list">

        {Object.keys(defs.COMBINATIONS).map( (combationKey, index) => 
          <SlotCombination lastElement={Object.keys(defs.COMBINATIONS).length - 1 == index} canSpin={props.canSpin} multiplierKey={combationKey} lastMultiplierKey={props.lastMultiplierKey} index={index} elIndex={Math.floor(index / 3) + 1} multiplier={defs.COMBINATIONS[combationKey]} combationItems={combationKey.split(':')} />
        )}

      </div>



    </div>
  );
});

