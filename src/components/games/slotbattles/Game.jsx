import React, { useEffect, useRef, useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import Combinations from "./Game/Combinations";
import Spinner from "./Game/Spinner";
import { setSelectedRoomId } from "../../../redux/ducks/slotbattles";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { store } from '../../../redux/store';
import { socket } from "../../../Socket";

function loadSound(filename) {
  var audio = new Audio(filename);
}

export default (props) => {
  const dispatch = useDispatch();

  const defs = useSelector((state) => state.slotbattles.defs);
  const room = useSelector((state) => state.slotbattles.rooms.find(room => room.id == state.slotbattles.selectedRoomId));

  const profile = useSelector((state) => state.profile);
  //
  //const active = useSelector((state) => state.mines.active);


  function callBots() {
    socket.emit('slotbattles:callBots', {
      roomId: room.id
    });
  }

  return (
    <div className="slotbattles-game">
      
     <div class="back-button" onClick={(e) => {
       dispatch(setSelectedRoomId(null));
     }} >
       <span><FontAwesomeIcon icon="long-arrow-alt-left" /> Back to the Battles</span>
     </div>

     <div class="game-state-wrap">
       
       <div class="state-box">
       <span style={{userSelect: 'all', '-webkit-user-select': 'all', overflowWrap: 'break-word'}}>
          {room.state == 'ACTIVE' ? 'Waiting for players...' : ''}
          {room.state == 'STARTING' ? 'Starting, get ready!' : ''}
          {room.state == 'PLAYING' ? `Spin Amount ${room.currentSpinOffset}/${room.spinAmount}` : ''}
          {room.state == 'CLOSED' ? `Ended, server seed was ${room.serverSeed}` : ''}
        </span>
       </div>

       <div class="state-box spincost">
       <span>
       Spin Cost <FontAwesomeIcon icon="coins" className="balanceicon" />{ (room.spinCost / 100).toFixed(2)}
        </span>
       </div>

       
      { profile.id == room.owner.id  && room.state == 'ACTIVE' ? <button
        className="button button--green button--play"
        style={{marginLeft: '10px'}}
        onClick={() => {        
          callBots();
        }}
      >
        {<React.Fragment>
          CALL BOTS
          </React.Fragment>}
      </button> : '' }

     </div>


<div class={`spinners ${room.versusType.replaceAll('1', 'one').replaceAll('2', 'two')}`}>
     {[...new Array(room.teamCount)].map((el, teamIndex) =>
    <React.Fragment>
        {[...new Array(room.teamMemberCount)].map((el, teamSeatOffset) =>
       <Spinner team={teamIndex + 1} teamSeatOffset={teamSeatOffset} />
        )}

       { (room.teamCount - 1 !== teamIndex) ? <div class="vs">vs</div> : ''}
    </React.Fragment>
  )}
     </div>

     <div class="created-by">
       <span>Created By</span>
       <img src={room.owner.avatar} />
       <span>{room.owner.username}</span>
     </div>

     <Combinations />
      
    </div>
  );
};
