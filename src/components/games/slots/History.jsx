import React, { useEffect } from "react";
import { socket } from "../../../Socket";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function padLeadingZeros(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

export default () => {
  const history = useSelector((state) => state.slots.history);
  const dispatch = useDispatch();

  return (
    <div class="slots-history">
      {history
          ? history.map((data, i) => {
              return <Row data={data} combationItems={data.lines} key={data.id} />;
            })
          : ""}
    </div>
  );
};

const Row = (props) => {
  //let date = new Date(props.data.timestamp);

  function getMultiplierColor() {
    const multiplier = props.data.multiplier;
    if (multiplier == 0) return 'gray';
    else if (multiplier <= 1.5) return '#354291';
    else if (multiplier <= 2) return '#791A74';
    else if (multiplier <= 4) return '#592E8A';
    else return '#FAC035';
  }

  return (
    <div class="history-element">
      <div class="user-avatar">
        <img src={props.data.user.avatar} alt="" />
      </div>
      <div class="combinations">
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
   <div class="bottom">
   <div class="multiplier" style={{ color: getMultiplierColor() }} >{props.data.multiplier}x</div>
   &nbsp;~&nbsp;
   <div class="amount" style={{color: `var(--${props.data.winnings > 0 ? 'green' : 'red'})`}}>
   <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />{ (props.data.winnings / 100).toFixed(2)}
   </div>
   </div>
    </div>
    </div>
  );
};
