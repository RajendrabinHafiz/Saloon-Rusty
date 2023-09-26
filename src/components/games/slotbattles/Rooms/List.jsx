import React, { useEffect, useRef, useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { setSelectedRoomId } from "../../../../redux/ducks/slotbattles";
import { socket } from "../../../../Socket";

const Room = React.forwardRef((props) => {
  const dispatch = useDispatch();

  function getStateText() {
    switch (props.roomData.state) {
      case 'ACTIVE': return 'Active Battle';
      case 'STARTING': return 'Starting';
      case 'PLAYING': return 'In Progress';
      case 'CLOSED': return 'Closed';
    }
  }


  function getSeats() {
    let seats = [];
    for (let team = 1; team <= props.roomData.teamCount;team++) {
      for (let teamSeatOffset = 0; teamSeatOffset < props.roomData.teamMemberCount;teamSeatOffset++) {

          const seat = props.roomData.teams[team].members[teamSeatOffset]
          if (seat.user) seats.push(seat)
          else seats.push(null);
      }
    }
    return seats;
  }

  function getJoinedPlayerCount() {
    let count = 0;
    for (let team = 1; team <= props.roomData.teamCount;team++) {
      for (let teamSeatOffset = 0; teamSeatOffset < props.roomData.teamMemberCount;teamSeatOffset++) {
          const seat = props.roomData.teams[team].members[teamSeatOffset]
          if (seat.user) count++;
      }
    }
    return count;
  }

  function getEmptySeat() {
    for (let team = 1; team <= props.roomData.teamCount;team++) {
      for (let teamSeatOffset = 0; teamSeatOffset < props.roomData.teamMemberCount;teamSeatOffset++) {
        const seat = props.roomData.teams[team].members[teamSeatOffset]
        if (!seat.user) return { team, teamSeatOffset };
      }
    }
    return null;
  }

  function joinEmptySeat() {
      const emptySeat = getEmptySeat();
      if (!emptySeat) return null;
    

      socket.emit('slotbattles:joinRoom', {
        roomId: props.roomData.id,
        team: emptySeat.team,
        teamSeatOffset: emptySeat.teamSeatOffset
      });
    
  }

  function getTotalPot() {
    return Math.floor(props.roomData.betAmount * getJoinedPlayerCount());
  }

  return (
    <div class="slotbattles-room">
      
        <div class="left-area">
          <div class="state">
          <div className={`icon ${props.roomData.state == 'PLAYING' ? 'icon-playing' : ''} ${props.roomData.state == 'CLOSED' ? 'icon-closed' : ''}`}></div>
          <span class="text">{getStateText()}</span>
          </div>
          <div class="creator">
          <span>Created By</span>
          <img src={props.roomData.owner.avatar} />
          <span>{props.roomData.owner.username}</span>
          </div>
        </div>


        <div class="right-area">

          <div class="players">


          {getSeats().map( (seat, index) => <div class="wrap" style={{marginLeft: `${index !== 0 ? '-6px' : '0'}`, zIndex: 100 - index}}>
            {seat && seat.user ? <img src={seat.user.avatar} /> : <div class="empty-seat"></div>}
            </div>)}

          </div>

          <div class="player-count">
              <span class="title">Players</span>
              <span class="count">{getJoinedPlayerCount()}/{props.roomData.teamCount * props.roomData.teamMemberCount}</span>
          </div>

          <div class="player-count">
              <span class="title">Spins</span>
              <span class="count">{props.roomData.spinAmount}</span>
          </div>

          <div class="action-buttons">

              <div class="spectate-button" onClick={(e) => {
                dispatch(setSelectedRoomId(props.roomData.id));
              }}>
                  <span>Spectate</span>
              </div>

             { getJoinedPlayerCount() < (props.roomData.teamCount * props.roomData.teamMemberCount) ? <div class="join-button" onClick={(e) => {
                dispatch(setSelectedRoomId(props.roomData.id));
                joinEmptySeat();

              }}>
                  <span>Join  <FontAwesomeIcon icon="coins" className="balanceicon rlicon" />{ (props.roomData.betAmount / 100).toFixed(2)}</span>
                </div> : ''}
                
                { props.roomData.state !== 'ACTIVE' ? <div class="join-button" onClick={(e) => {
                     dispatch(setSelectedRoomId(props.roomData.id));
                }}>
                     <span>Total Pot <FontAwesomeIcon icon="coins" className="balanceicon rlicon" />{ (getTotalPot() / 100).toFixed(2)}</span>
                </div> : ''
                 }

          </div>

        </div>

    </div>
  )
});


export default (props) => {
  const dispatch = useDispatch();

  const defs = useSelector((state) => state.slotbattles.defs);
  const rooms = useSelector((state) => state.slotbattles.roomsOrdered);

  //
  //const active = useSelector((state) => state.mines.active);



  return (
    <div className="slotbattles-rooms-list">
      

    {rooms.map((room, index) => 
      <Room key={'room-' + room.id} roomData={room} />
    )}


    </div>
  );
};
