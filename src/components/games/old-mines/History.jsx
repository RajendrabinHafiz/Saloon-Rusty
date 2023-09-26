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
  const history = useSelector((state) => state.landmines.history);
  const dispatch = useDispatch();

  return (
    <table className="table dice__table mines__history">
      <thead>
        <tr>
          <th>User</th>
          <th>Time</th>
          <th>Amount</th>
          <th>Mines</th>
          <th>Last Step</th>
          <th>Multiplier</th>
          <th>Payout</th>
        </tr>
      </thead>
      <tbody>
        {history
          ? history.map((info, i) => {
              return <Row info={info} />;
            })
          : ""}
      </tbody>
    </table>
  );
};

const Row = (props) => {
  let date = new Date(props.info.timestamp);

  return (
    <tr>
      <td>{props.info.user.name}</td>
       <td>
        {padLeadingZeros(date.getHours(), 2) +
          ":" +
          padLeadingZeros(date.getMinutes(), 2) +
          ":" +
          padLeadingZeros(date.getSeconds(), 2)}
      </td>
      <td><FontAwesomeIcon icon="coins" className="balanceicon" />{Number(props.info.betAmount / 100).toFixed(2)}</td>
      <td style={{ color: '#CD412A'}}><FontAwesomeIcon  icon="bomb" />{props.info.minesCount}</td>
      <td>{props.info.spacesCleared}</td>
      <td style={{ color: props.info.won ? '#11A347' : '#CD412A'}}>{props.info.won ? (props.info.payoutRate.toFixed(2)) : 0}x</td>
      <td style={{ color: props.info.won ? '#11A347' : '#CD412A'}}>
      <FontAwesomeIcon icon="coins" className="balanceicon" />
        {props.info.won ? '+' : '-'}{ ((props.info.won ? (props.info.winnings) : (props.info.betAmount)) / 100).toFixed(2)}</td>
      {/*
      <td>{props.info.username}</td>
      <td>
        {date.getHours() +
          ":" +
          (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
          ":" +
          date.getSeconds()}
      </td>
      <td>{Number(props.info.betValue).toFixed(2)}</td>
      <td>
        {props.info.betType === "over" ? "<" : ">"}
        {Number(props.info.multiplier).toFixed(2)}x
      </td>
      <td className={Number(props.info.winnings) > 0 ? "green" : "red"}>
        {(Math.floor(Number(props.info.winnings) * 100) / 100).toFixed(2)}
      </td>
        */}
    </tr>
  );
};
