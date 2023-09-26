
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from 'react-router-dom';
import { setVisible } from "../../redux/ducks/depositpopup";
import { useSelector, useDispatch } from "react-redux";

import Inventory from "./shared/Inventory";
import Giftcards from "./deposit/Giftcards";
import Cryptos from "./deposit/Cryptos";

import { socket } from "../../Socket";

var classNames = require('classnames');

const ComponentSelector = (props) => {
  const components = {
    Inventory,
    Giftcards,
    Cryptos
  };

  const Component = components[props.componentName]
  return <Component name={"Deposit"} app={props.componentProps && props.componentProps.app}  />

}

export default (props) => {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.depositpopup.visible);
  const [methods, setMethods] = useState([
    {
      name: 'Rust Skins',
      image: 'skin-rust.png',
      componentName: 'Inventory',
      bonus: 5,
      disabled: true,
      componentProps: {
        app: 'RUST'
      }
    },
    {
      name: 'Credit Card',
      image: 'giftcard-cc.png',
      componentName: 'Giftcards',
      bonus: 35,
    },
    {
      name: 'PayPal',
      image: 'giftcard-paypal.png',
      componentName: 'Giftcards',
      bonus: 35,
    },
    {
      name: 'Crypto',
      image: 'crypto-btc.png',
      componentName: 'Cryptos',
      bonus: 40,
    },
    {
      name: 'CSGO',
      image: 'skin-csgo.png',
      componentName: 'Inventory',
      bonus: 30,
      disabled: false,
      componentProps: {
        app: 'CSGO'
      },
      onClick: function() {
        socket.emit('skinsback:createOrder')
      }
    },
    {
      name: 'DOTA2',
      image: 'skin-dota2.png',
      componentName: 'Inventory',
      bonus: 30,
      disabled: false,
      componentProps: {
        app: 'DOTA2'
      },
      onClick: function() {
        socket.emit('skinsback:createOrder')
      }
    }
  ]);


  useEffect(() => {

    socket.on("skinsback:redirectToOrder", (data) => {
      window.location.href = data;
    });

    return function cleanup() {
      socket.off("skinsback:redirectToOrder");
    }

  }, [])
;
  const [currentMethodIndex, setCurrentMethodIndex] = useState(0);
  return (
    <React.Fragment>


      {visible && <div className={"modal " + (!visible ? "hidden" : "")}>
        <div className="modal--bg" onClick={(e) => dispatch(setVisible(false))}>
          <div className="modal--content deposit-modal" onClick={(e) => e.stopPropagation()}>
            <img
              onClick={(e) => dispatch(setVisible(false))}
              className="modal__close"
              src={process.env.PUBLIC_URL + "/images/x.svg"}
              alt=""
            />
            <h3 className="wtit">Deposit Methods</h3>

            <div class="container">
              <div class="methods">
                {methods.map((el, index) => <div key={'method' + index} className={`method ${index == currentMethodIndex ? 'method-selected' : ''}`}
                  onClick={(e) => {
                    if (el.hasOwnProperty('onClick')) return el.onClick();
                    if (el.disabled) return global.retoastr("error", "This method is disabled at the moment!");
                    setCurrentMethodIndex(index);
                  }}
                >
                  <img src={'/images/deposit/' + el.image} class="method-img" />
                  <div class="method-desc">
                    <div class="name">{el.name}</div>
                    {!el.disabled ? <div class="bonus">{el.bonus}%</div>
                    : <div class="disabled">Coming Soon</div>
                }
                  </div>
                </div>)}
              </div>

              <div class="modal-n-content">
                <ComponentSelector componentName={methods[currentMethodIndex].componentName} componentProps={methods[currentMethodIndex].componentProps} />
              </div>
            </div>

          </div>
        </div>
      </div>
      }

    </React.Fragment>
  );

};
