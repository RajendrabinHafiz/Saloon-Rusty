import React, { useEffect, useRef, useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import Header from "./Rooms/Header";
import List from "./Rooms/List";


import { socket } from "../../../Socket";


function loadSound(filename) {
  var audio = new Audio(filename);
}

export default (props) => {
  const dispatch = useDispatch();

  const defs = useSelector((state) => state.slotbattles.defs);

  //
  //const active = useSelector((state) => state.mines.active);



  return (
    <div className="slotbattles-rooms">
      
      <Header />
      <List />
      
    </div>
  );
};
