import React, { useEffect, Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { socket } from "../../../../Socket";
import { store } from '../../../../redux/store';

export default React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const defs = useSelector((state) => state.slotbattles.defs);
  const room = useSelector((state) => state.slotbattles.rooms.find(room => room.id == state.slotbattles.selectedRoomId));
  const seat = useSelector((state) => state.slotbattles.rooms.find(room => room.id == state.slotbattles.selectedRoomId).teams[props.team].members[props.teamSeatOffset]);

  const profile = useSelector((state) => state.profile);
  const userBalance = useSelector((state) => state.profile.balance);

  function join() {
    socket.emit('slotbattles:joinRoom', {
      roomId: room.id,
      team: props.team,
      teamSeatOffset: props.teamSeatOffset
    });
  }

  function callBot() {
    socket.emit('slotbattles:callBot', {
      roomId: room.id,
      team: props.team,
      teamSeatOffset: props.teamSeatOffset
    });
  }

  
  const [animInited, setAnimInited] = useState(false);
  const [isFastSpin, setIsFastSpin] = useState(true);
  const [directAnimations, setDirectAnimations] = useState(false);

  const [isSpinned, setIsSpinned] = useState(true);

  const [lineTransforms, setLineTransforms] = useState({
    1: 'translateY(0px)',
    2: 'translateY(0px)',
    3: 'translateY(0px)'
  });


  function spin(lineIndexes, won, fastSpin) {
    setIsSpinned(false);

    var appStore = store.getState().app;
    var slotsStore = store.getState().slotbattles;
    var defsInside = slotsStore.defs;

    const gameContainerEl = document.getElementById(`gameContainer_${props.team}_${props.teamSeatOffset}`);
    const gameContainerSizes = gameContainerEl.getBoundingClientRect();
    const CONTAINER_SIZE = gameContainerSizes.height;

    const entryEl = document.querySelector('.slot-line-entry');
    const entrySizes = entryEl.getBoundingClientRect();
    const ENTRY_HEIGHT = entrySizes.height; //add margins

    const lineTransforms = {};
    const lineTransformsWithoutSTH = {};
    for (let i = 0;i < 3;i++) {

      const lineNumber = i + 1;
      const lineIndex = lineIndexes[i];

      const SPINNER_TOTAL_HEIGHT = defsInside.LINES[lineNumber].length * ENTRY_HEIGHT;


      let amount = -lineIndex * ENTRY_HEIGHT;
      amount += (CONTAINER_SIZE / 2);
      amount -= (ENTRY_HEIGHT / 2);
      amount -= SPINNER_TOTAL_HEIGHT;

      lineTransformsWithoutSTH[lineNumber] = `translateY(${amount.toFixed(4)}px)`;

      amount -= SPINNER_TOTAL_HEIGHT * (3 + i);

      lineTransforms[lineNumber] = `translateY(${amount.toFixed(4)}px)`;
    }

    setDirectAnimations(false);
    setLineTransforms(lineTransforms);

    setTimeout(() => {
      setDirectAnimations(true);
      setLineTransforms(lineTransformsWithoutSTH);
      setIsSpinned(true);

      /*
      if (won && !appStore.soundsMuted) {
        var audio = new Audio('/audio/slots/payout.wav');
        audio.play();
      }
      */
    }, !fastSpin ? 5000 : 1500);
    
  }

  useEffect(() => {
    if (!animInited) return setAnimInited(true);
    const { lastOffsets, lastSpinWon } = seat.slots;
    spin(lastOffsets, lastSpinWon, room.fastSpin);
  }, [room.lastUpdate]);



  return (
    <div className={`slots__game-area-wrap`}>

      <div class="seat">

      <div class="uprofile">

          {!seat.user ? <React.Fragment>
            <span>Waiting...</span>
          </React.Fragment> : <React.Fragment>
          <img src={seat.user.avatar} />
       <span className={`${props.team == room.winnerTeam && room.winnerTeam > 0 ? `color-green` : ''} ${props.team !== room.winnerTeam && room.winnerTeam > 0 ? `color-red` : ''}`}>{seat.user.username}</span>
            </React.Fragment>}

        </div>

        <div class="amount-winnings">
        <FontAwesomeIcon icon="coins" className="balanceicon rlicon" />
        { room.winnerTeam > 0 ?<React.Fragment>
          <span className={`${props.team == room.winnerTeam && room.winnerTeam > 0 ? `color-green` : ''} ${props.team !== room.winnerTeam && room.winnerTeam > 0 ? `color-red` : ''}`}>{((props.team == room.winnerTeam ? room.prizePerPlayer : 0) / 100).toFixed(2)}</span>
        </React.Fragment> : <React.Fragment>
          { ((isSpinned ? seat.slots.totalWinnings : seat.slots.previousTotalWinnings) / 100).toFixed(2) }
        </React.Fragment> }
        
        </div>

      </div>

     <div id={`gameContainer_${props.team}_${props.teamSeatOffset}`} class="game-container">

    
       {/* index + 1 == ofset */}
       {/* defs.LINES */} 

      {/* props.lineTransforms[index + 1] */}

     {[...new Array(3)].map((el, index) =>

      <div className={`slot-line-wrap ${!directAnimations ? `wrap-animation-${room.fastSpin ? 'fast-' : ''}${index + 1}` : ''}`} style={{transform: lineTransforms[index + 1] }}>

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

  {seat.slots.lastSpinWon && isSpinned && room.state == 'PLAYING' && <div class="slot-winnings-wrap" key={room.lastUpdate}>

    <div class="slot-winnings">
      <span className={`amount ${seat.slots.lastWinnings > 0 ? 'color-green' : 'color-red'}`}>{seat.slots.lastWinnings > 0 ? '+' : '-'} {((seat.slots.lastWinnings > 0 ? seat.slots.lastWinnings : room.spinCost) / 100).toFixed(2)}</span>
      <FontAwesomeIcon icon="coins" className="balanceicon rlicon" />
    </div>
  </div>}


      { !seat.user ? <div class="join-container">
      
      <button
        className="button button--green button--play"
        onClick={() => {        
          join()
        }}
      >
        {<React.Fragment>
          JOIN&nbsp;&nbsp;<FontAwesomeIcon icon="coins" className="balanceicon rlicon" />{ (room.betAmount / 100).toFixed(2)}
          </React.Fragment>}
      </button>

      { profile.id == room.owner.id ? <button
        className="button button--green button--play"
        onClick={() => {        
          callBot();
        }}
      >
        {<React.Fragment>
          CALL BOT
          </React.Fragment>}
      </button> : '' }


      </div> : ''}

     </div>




    </div>
  );
});

