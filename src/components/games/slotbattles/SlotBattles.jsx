import React, { useEffect, useRef, useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";


import CreateBattlePopup from "./CreateBattlePopup";

import { init, pushRoom, pushPlayer, updateRoom, destroyRoom, setCreatePopupVisible, setSelectedRoomId, orderRooms, updateSlotVariables, updateRoomState } from "../../../redux/ducks/slotbattles";

import { socket } from "../../../Socket";
import { store } from '../../../redux/store';

import Rooms from "./Rooms";
import Game from "./Game";

export default (props) => {
  const dispatch = useDispatch();


  const defs = useSelector((state) => state.slotbattles.defs);
  const selectedRoomId = useSelector((state) => state.slotbattles.selectedRoomId);


  useEffect(() => {
    document.title = "RustySaloon | Slot Battles";

    socket.on("slotbattles:info", (data) => {
      dispatch(init(data));
      dispatch(orderRooms());
    });

    socket.on("slotbattles:pushRoom", (data) => {
      dispatch(pushRoom(data));
      dispatch(orderRooms());
    });

    socket.on("slotbattles:pushPlayer", (data) => {
      dispatch(pushPlayer(data));
      dispatch(orderRooms());
    });

    socket.on("slotbattles:updateRoom", (data) => {
      dispatch(updateRoom(data));
    });

    socket.on("slotbattles:destroyRoom", (data) => {
      dispatch(destroyRoom(data));
      dispatch(orderRooms());
    });

    socket.on("slotbattles:redirectToRoom", (data) => {
      dispatch(setSelectedRoomId(data.roomId));
      dispatch(setCreatePopupVisible(false));
    });

    socket.on("slotbattles:updateSlotVariables", (data) => {
      dispatch(updateSlotVariables(data));

    });

    socket.on("slotbattles:updateRoomState", (data) => {
      dispatch(updateRoomState(data));
      dispatch(orderRooms());
    });

  socket.emit('slotbattles:info');

    return function cleanup() {
      dispatch(setSelectedRoomId(null));
      socket.off("slotbattles:info");
      socket.off("slotbattles:pushRoom");
      socket.off("slotbattles:pushPlayer");
      socket.off("slotbattles:updateRoom");
      socket.off("slotbattles:destroyRoom");
      socket.off("slotbattles:redirectToRoom");
      socket.off("slotbattles:updateSlotVariables");
      socket.off("slotbattles:updateRoomState");
    };

  }, []);


  return (
    <div className="slotbattles">
      
      { !selectedRoomId ? <Rooms /> : <Game /> }
      <CreateBattlePopup />

    </div>
  );
};
