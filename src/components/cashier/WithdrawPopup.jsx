
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from 'react-router-dom';
import { setVisible } from "../../redux/ducks/withdrawpopup";
import { useSelector, useDispatch } from "react-redux";

import Inventory from "./shared/Inventory";

var classNames = require('classnames');

const ComponentSelector = (props) => {
  const components = {
    Inventory
  };

  const Component = components[props.componentName]
  return <Component name={"Withdraw"}  />

}

export default (props) => {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.withdrawpopup.visible);
  const [methods, setMethods] = useState([
    {
      name: 'Rust Skins',
      image: 'skin-rust.png',
      componentName: 'Inventory',
      bonus: 5,
    }
  ]);
  const [currentMethodIndex, setCurrentMethodIndex] = useState(0);
  return (
    <React.Fragment>


      {visible && <div className={"modal " + (!visible ? "hidden" : "")}>
        <div className="modal--bg" onClick={(e) => dispatch(setVisible(false))}>
          <div className="modal--content deposit-modal withdraw-modal" onClick={(e) => e.stopPropagation()}>
            <img
              onClick={(e) => dispatch(setVisible(false))}
              className="modal__close"
              src={process.env.PUBLIC_URL + "/images/x.svg"}
              alt=""
            />
            <h3 className="wtit">Withdraw</h3>

            <div class="container">

              <div class="modal-n-content">
                <ComponentSelector componentName={methods[currentMethodIndex].componentName} />
              </div>
              
            </div>

          </div>
        </div>
      </div>
      }

    </React.Fragment>
  );

};
