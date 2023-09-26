import React, { useEffect, useRef, useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import Checkbox from "./Header/Checkbox";

import { setCreatePopupVisible, setFilterValue, orderRooms } from "../../../../redux/ducks/slotbattles";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default (props) => {
  const dispatch = useDispatch();

  const defs = useSelector((state) => state.slotbattles.defs);
  const filter = useSelector((state) => state.slotbattles.filter);

  //
  //const active = useSelector((state) => state.mines.active);



  return (
    <div className="slotbattles-rooms-header">
      
      <div class="header-row top">
     <div class="header-title">
      Slot Battles
      </div>

      <div class="create-button" onClick={(e) => {
        dispatch(setCreatePopupVisible(true));
      }}>
        <span>+ Create Battle</span>
      </div>
     </div>

     <div class="header-row filter">

    <Checkbox />

      <div class="order-type">


      <div onClick={(e) => {
        dispatch(setFilterValue({ key: 'orderByDescending', value: !filter.orderByDescending }));
        dispatch(orderRooms());
      }}>
      <span class="color-white">
        Price:&nbsp;
      </span>
      <span>{filter.orderByDescending ? 'Descending' : 'Ascending'}</span>

      </div>

      <FontAwesomeIcon icon="sort" />
        </div>
    


     </div>

    </div>
  );
};
