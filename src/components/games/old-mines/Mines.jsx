import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import BetArea from "./BetArea";
import GameArea from "./GameArea";
import History from "./History";
import ChangeSeedsPopup from "./ChangeSeedsPopup";
import {
  setSeedData,
  setServerSeed,
  setNonce,
  setGameData,
  openAllSquares,
  setHistory,
  pushHistory,
  setEmojiForce,
  completeGame,
  setPlayable,
  finalizeGame,
  setSquareData,
  setPayoutRate,
} from "../../../redux/ducks/landmines";
import { balanceUpdate } from "../../../redux/ducks/profile";

import { socket } from "../../../Socket";
import { setMinesSoundsMuted } from "../../../redux/ducks/landmines";

function loadSound(filename) {
  var audio = new Audio(filename);
}

const Mines = (props) => {
  const dispatch = useDispatch();
  const betInput = useRef();

  const soundsMuted = useSelector((state) => state.app.soundsMuted);
  const { mobile } = useSelector((state) => state.main);
  const seedData = useSelector((state) => state.landmines.seedData);

  //
  //const active = useSelector((state) => state.mines.active);

  useEffect(() => {
    document.title = "RustySaloon | Mines";

    loadSound("/audio/mines/achievement.mp3");
    loadSound("/audio/mines/explosion.mp3");
    loadSound("/audio/trade/withdraw.mp3");

    dispatch(setMinesSoundsMuted(soundsMuted));

    socket.on("mines:info", (data) => {
      dispatch(setHistory(data.history));
      if (data.game) dispatch(setGameData(data.game));
      dispatch(setSeedData(data.seedData));
    });

    socket.on("mines:setGame", (data) => {
      dispatch(setGameData(data.gameData));
      if (data.newBalance >= 0) dispatch(balanceUpdate(data.newBalance / 100));
      if (data.gameData.spacesCleared == 0) dispatch(setEmojiForce("happy"));
      dispatch(setNonce(data.gameData.nonce));
      if (data.newServerSeed) dispatch(setServerSeed(data.newServerSeed));
      if (
        !soundsMuted &&
        data.gameData.isCompleted &&
        data.gameData.squares.filter((el) => el.isMine && el.openByUser)
          .length == 0
      ) {
        var audio = new Audio("/audio/trade/withdraw.mp3");
        audio.play();
      }
    });

    socket.on("mines:setSquare", (data) => {
      dispatch(setSquareData({ offset: data.offset, data: data.square }));
      dispatch(setPayoutRate(data.payoutRate));
      setTimeout(() => {
        dispatch(setEmojiForce(data.square.isMine ? "dead" : "sunglasses"));
      }, 750);
    });

    socket.on("mines:pushHistory", (data) => {
      dispatch(pushHistory(data));
    });

    socket.on("mines:setServerSeed", (data) => {
      dispatch(setServerSeed(data));
    });

    socket.emit("mines:info");

    return function cleanup() {
      socket.off("mines:info");
      socket.off("mines:setGame");
      socket.off("mines:setSquare");
      socket.off("mines:pushHistory");
      socket.off("mines:setServerSeed");
    };
  }, []);

  useEffect(() => {
    dispatch(setMinesSoundsMuted(soundsMuted));
  }, [soundsMuted]);

  function finalizeGame({ won }) {
    dispatch(setPlayable(false));
    dispatch(openAllSquares());
    dispatch(completeGame());
    dispatch(setEmojiForce(won ? "sunglasses" : "dead"));
    if (won && !soundsMuted) {
      var audio = new Audio("/audio/trade/withdraw.mp3");
      audio.play();
    }
  }

  return (
    <div className={"mines" + (mobile ? " mobile" : "")}>
      <div class="mineswrap">
        <BetArea finalizeGame={finalizeGame} />
        <GameArea finalizeGame={finalizeGame} />
      </div>
      <History />
      <ChangeSeedsPopup key={seedData.nonce + seedData.serverSeed} />
    </div>
  );
};

export default Mines;
