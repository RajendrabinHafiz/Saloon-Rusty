import React, { useEffect, useRef, useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";


import { setCreatePopupVisible, setFilterValue, orderRooms } from "../../../../../redux/ducks/slotbattles";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default (props) => {
  const dispatch = useDispatch();

  const defs = useSelector((state) => state.slotbattles.defs);
  const filter = useSelector((state) => state.slotbattles.filter);

  const [id, setId] = useState();

  useEffect(() => {
    setId("checkbox-" + (new Date().getTime() + Math.random()).toString().replace(".", ""));
  }, []);


  return (
    <div className="slotbattles-rooms-header-checkbox">
         <span 
         className={`${filter.status == 'ALL' ? 'selected' : ''}`}
         onClick={(e) => {
          dispatch(setFilterValue({ key: 'status', value: 'ALL'} ));
          dispatch(orderRooms());
        }}
         >Show All Rooms</span>

<div class="input-checkbox-container" onClick={(e) => {
  dispatch(setFilterValue({ key: 'status', value: filter.status == 'ALL' ? 'AVAILABLE' : 'ALL'} ));
  dispatch(orderRooms());
}}>
  <input name={id} id={id} type="checkbox" checked={filter.status == 'ALL' ? 'checked' : 0} />
  <label for={id} class></label>
</div>

<span
 className={`${filter.status == 'AVAILABLE' ? 'selected' : ''}`}
 onClick={(e) => {
  dispatch(setFilterValue({ key: 'status', value: 'AVAILABLE'} ));
  dispatch(orderRooms());
}}
 >Show Available Rooms</span>
    </div>
  );
};
