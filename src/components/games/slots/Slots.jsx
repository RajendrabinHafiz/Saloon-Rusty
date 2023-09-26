import React, { useEffect, useRef, useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import History from "./History";
import BetArea from "./BetArea";
import GameArea from "./GameArea";
import Combinations from "./Combinations";
/*
import History from "./History";
import ChangeSeedsPopup from "./ChangeSeedsPopup";
import {  setSeedData, setServerSeed, setNonce, setGameData, openAllSquares, setHistory, pushHistory, setEmojiForce, completeGame, setPlayable, finalizeGame, setSquareData, setPayoutRate } from "../../../redux/ducks/landmines";
*/
import ChangeSeedsPopup from "./ChangeSeedsPopup";
import { setSlotsSoundsMuted, init, pushHistory } from "../../../redux/ducks/slots";

import { socket } from "../../../Socket";
import { store } from '../../../redux/store';

function loadSound(filename) {
  var audio = new Audio(filename);
}

export default (props) => {
  const dispatch = useDispatch();
  const betInput = useRef();

  const betAreaRef = useRef();

  const soundsMuted = useSelector((state) => state.app.soundsMuted);
  const defs = useSelector((state) => state.slots.defs);

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const [publicSeedData, setPublicSeedData] = useState({
    serverSeed: '',
    userSeed: '',
    nonce: 0
  });

  function setPublicSeedDataKey(keyName, keyValue) {

    setPublicSeedData((prev) => {
      prev[keyName] = keyValue;
      return { ...prev }
  });
  }

  const [lastGameData, setLastGameData] = useState({
    time: 0,
    winnings: 1000,
    betAmount: 1000,
    multiplier: 1,
    multiplierKey: ''
  });
  
  const [spinAmount, setSpinAmount] = useState(0);

  const [canSpin, setCanSpin] = useState(true);
  const [isFastSpin, setIsFastSpin] = useState(true);
  const [directAnimations, setDirectAnimations] = useState(false);
  const [lineTransforms, setLineTransforms] = useState({
    1: 'translateY(0px)',
    2: 'translateY(0px)',
    3: 'translateY(0px)'
  });

  //
  //const active = useSelector((state) => state.mines.active);

  function spin(lineIndexes, won, fastSpin, multiplierKey) {
    var appStore = store.getState().app;
    var slotsStore = store.getState().slots;
    var defsInside = slotsStore.defs;

    const gameContainerEl = document.getElementById('gameContainer');
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

      if (won && !appStore.soundsMuted) {
        var audio = new Audio(multiplierKey == 'Saloon:Saloon:Saloon' ? '/audio/slots/jackpot.mp3' : '/audio/slots/payout.wav');
        audio.play();
      }
    }, !fastSpin ? 5000 : 1500);
    
  }

  useEffect(() => {
    document.title = "RustySaloon | Slots";
    
    loadSound("/audio/slots/payout.wav")
    loadSound("/audio/slots/jackpot.mp3")
    

    dispatch(setSlotsSoundsMuted(soundsMuted));

    
    socket.on("slots:info", (data) => {
      dispatch(init(data));
      setPublicSeedData(data.publicSeedData);
    });

    socket.on("slots:game", (data) => {
      setCanSpin(false);
      setIsFastSpin(data.fastSpin);
      setPublicSeedData(data.publicSeedData);
      spin(data.offsets, data.winnings > 0, data.fastSpin, data.multiplierKey);
      setLastGameData({
        time: data.time,
        multiplier: data.multiplier,
        winnings: data.winnings,
        betAmount: data.betAmount,
        multiplierKey: data.multiplierKey
      });
    });

    socket.on("slots:end", (data) => {
      setCanSpin(true)
    });

    socket.on("slots:pushHistory", (data) => {
      dispatch(pushHistory(data));
    });

    socket.on("slots:setServerSeed", (data) => {
      setPublicSeedDataKey('serverSeed', data);
    });

    socket.emit("slots:info");

    return function cleanup() {
      socket.off("slots:info");
      socket.off("slots:game");
      socket.off("slots:pushHistory");
      socket.off("slots:setServerSeed");
    };


  }, []);

  useEffect(() => {
  
    if (!canSpin || lastGameData.time == 0) return;
    setSpinAmount(spinAmount - 1);
    if (spinAmount > 0) {
   
    }

  }, [canSpin])

  useEffect(() => {
    dispatch(setSlotsSoundsMuted(soundsMuted));
  },[soundsMuted]);

  return (
    <React.Fragment>

<History />

    <div className="slots">


 <div class="slotswrap">
 <BetArea spinAmount={spinAmount} setSpinAmount={setSpinAmount} canSpin={canSpin} setCanSpin={setCanSpin}  setIsPopupVisible={setIsPopupVisible}/>
    <GameArea  lastGameData={lastGameData} canSpin={canSpin} isFastSpin={isFastSpin} lineTransforms={lineTransforms} directAnimations={directAnimations} />

  {/*
 <BetArea />
  <GameArea />
  */}

 </div>

 <Combinations canSpin={canSpin} lastMultiplierKey={lastGameData.multiplierKey} />
 <ChangeSeedsPopup setPublicSeedDataKey={setPublicSeedDataKey} canSpin={canSpin} time={lastGameData.time} publicSeedData={publicSeedData} setIsPopupVisible={setIsPopupVisible} isPopupVisible={isPopupVisible} />

 { /* <History /> */ }
</div>
    </React.Fragment>

  );
};
