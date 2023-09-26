import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// const BettingListItem = (props) => {
//   return (
//     <div className="betting-list-item">
//       <img
//         className="profile-pic"
//         src={props.player.avatar}
//         alt="profile pic"
//       />
//       <div className="name">{props.player.username}</div>
//       <FontAwesomeIcon icon="coins" className="balanceicon" />
//       {props.done &&
//         (props.player.winnings || props.color === props.winningColor
//           ? "+"
//           : "-")}
//       <div
//         style={{
//           color:
//             props.done || props.winningColor
//               ? props.player.winnings || props.color === props.winningColor
//                 ? "#0b923e"
//                 : "#CD412A"
//               : "white",
//         }}
//       >
//         {!props.done
//           ? (props.player.amount / 100).toFixed(2)
//           : props.player.winnings || props.color === props.winningColor
//           ? `${(
//               Math.floor(props.player.amount * props.multiplier * 100) /
//               100 /
//               100
//             ).toFixed(2)}`
//           : `${(props.player.amount / 100).toFixed(2)}`}
//       </div>
//     </div>
//   );
// };

const BettingListItem = ({ player }) => {
  return (
    <div className="bet-player-section active">
      <div className="player-details">
        <div className="circle-avatar">
          <img src={player.avatar} alt="" />
        </div>

        <div className="name">{player.username.slice(0, 20)}</div>
      </div>
      <div className="amount">
        <img src="/images/diamond.svg" alt="" />
        <span>{(player.amount / 100).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default BettingListItem;
