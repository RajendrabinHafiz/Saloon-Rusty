import React from "react";

const Table = props => {
  return (
    <table className="table tower__table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Time</th>
          <th>Value</th>
          <th>Payout</th>
        </tr>
      </thead>
      <tbody>
        {
          props.history ? props.history.map((info, i) => {
            return <Row info = {info}/>
          }): ""
        }
      </tbody>
    </table>
  );
};

const Row = props => {
  let date = new Date(props.info.timestamp);

  return (
    <tr>
      <td>{props.info.username}</td>
      <td>{(date.getHours())+":"+(date.getMinutes() < 10 ? ("0"+date.getMinutes()) : date.getMinutes())+":"+date.getSeconds()}</td>
      <td>{(props.info.betValue / 100).toFixed(2)}</td>
      <td style={{ color: (props.info.winnings) > 0 ? "green" : "#CD412A"}}>{(props.info.winnings / 100).toFixed(2)}</td>
    </tr>
  )
};

export default Table;
