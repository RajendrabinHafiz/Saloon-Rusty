import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Details from "./Details";
import Table from "./Table";

import { socket } from "../../../Socket";
import {
  towersHistory,
  towersConnect,
  createTowersResponse,
  towersCheckAlternativeResponse,
  towersValues,
  towerSounds,
  setTowerSoundsMuted,
} from "../../../redux/ducks/towers";

const Tower = (props) => {
  const dispatch = useDispatch();
  const betInput = useRef();

  const soundsMuted = useSelector((state) => state.app.soundsMuted);
  const { mobile } = useSelector((state) => state.main);

  const active = useSelector((state) => state.towers.active);
  const level = useSelector((state) => state.towers.level);
  const info = useSelector((state) => state.towers.info);
  const history = useSelector((state) => state.towers.history);
  const mode = useSelector((state) => state.towers.mode);

  useEffect(() => {
    document.title = "RustySaloon | Towers";

    dispatch(setTowerSoundsMuted(soundsMuted));

    socket.on("towersHistory", (history) => {
      dispatch(towersHistory(history));
    });

    socket.emit("towersConnect");

    socket.on("createTowersResponse", (data) => {
      dispatch(createTowersResponse(data));
      dispatch(
        towersValues(betInput.current ? betInput.current.value * 100 : 0),
      );
    });

    socket.on("towersConnect", (data) => {
      dispatch(towersConnect(data.balance));
    });

    const towerSoundHandler = (data) => {
      console.log("sound there!he");
      dispatch(towerSounds(data));
    };
    socket.on("towersSound", (data) => towerSoundHandler(data));

    dispatch(towersValues(betInput.current ? betInput.current.value * 100 : 0));

    socket.on("towersCheckAlternativeResponse", (data) => {
      if (betInput && betInput.current) betInput.current.value = data.bet / 100;
      dispatch(towersValues(data.bet));
      dispatch(towersCheckAlternativeResponse(data));
    });

    return function cleanup() {
      socket.off("towersSound");
      socket.off("towersCheckAlternativeResponse");
      socket.off("towersConnect");
      socket.off("createTowersResponse");
      socket.off("towersHistory");
    };
  }, []);

  useEffect(() => {
    dispatch(setTowerSoundsMuted(soundsMuted));
  }, [soundsMuted]);

  return (
    <div className={"tower" + (mobile ? " mobile" : "")}>
      <div>
        <Details
          ref={betInput}
          info={info}
          active={active}
          level={level}
          mode={mode}
        />
        <Table history={history} />
      </div>
    </div>
  );
};

export default Tower;
