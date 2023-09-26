import React, { useEffect, useState, useCallback, useMemo  } from "react";
import { useSelector, useDispatch } from "react-redux";
import Chat from "../components/ChatBar";
import MobileHeader from "../components/desktop/Header";
import DesktopHeader from "../components/mobile/Header";
import MobileNav from "../components/mobile/Nav";
import { socket } from "../Socket";
import { Range } from "react-range";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from "../components/Loader";
import Footer from "../components/Footer";

import {
increment,
toggleItem,
resetVars,
setTradeData,
closeTradePopup,
setBonus,
updateInventory
} from "../redux/ducks/statetest";



const Item = ({data, handler, inNav }) => {
  const selectedItems = useSelector((state) => state.statetest.selectedItems);
  return (
    <button className={ "inventory-item " + (!inNav && data.market_hash_name && selectedItems.find(el=> el.market_hash_name == data.market_hash_name) ? 'inventory-item-selected ' : '') + (inNav ? 'inventory-item-nav' : '') }
      onClick={() => {
        handler();
    }}>
      {data.market_hash_name}
    </button>
    /*
    <button className={ "inventory-item " + (!inNav && info.market_hash_name && selected[info.market_hash_name] ? 'inventory-item-selected ' : '') + (inNav ? 'inventory-item-nav' : '') } >
      <div
        className={"inventory-item__image-container"}
        onClick={() => {
          handler(info);
        }}
      >
        <img src={"https://steamcommunity-a.akamaihd.net/economy/image/" + info.image} alt={info.market_hash_name + " Image"} />
      </div>
      <div className={"inventory-item__color-bar"} style={{ background: info.color ? info.color : "#0aa847" }}></div>
      <div
        className="inventory-item__name"
        onClick={() => {
          handler(info);
        }}
      >
        {info.market_hash_name}
      </div>
      <div
        className="inventory-item__values"
        onClick={() => {
          handler(info);
        }}
      >
        <div>{id === "wide" ? currentValue : info.amount}x</div>

        <div style={{ display: "flex", alignItems: "flex-start" }}>
        <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />
          {(currentValue * info.price).toFixed(2)}
        </div>
      </div>

      {id === "wide" && info.amount > 1 ? (
        <div className="inventory-item__slider">
          <div className="flex">
            <Range
              step={1}
              min={1}
              max={info.amount}
              values={[currentValue]}
              onChange={(values) => {
                console.log(values)
                setValue(values[0]);
                handler(info, values[0]);
              }}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "4px",
                    width: "100%",
                    background: `linear-gradient(to right, #cd412a 0%, #cd412a ${
                      ((currentValue - 1) / (info.amount - 1)) * 100
                    }%, #31353d ${((currentValue - 1) / (info.amount - 1)) * 100}%, #31353d 100%)`,
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "10px",
                    width: "10px",
                    borderRadius: "3px",
                    backgroundColor: "white",
                  }}
                />
              )}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </button>
    */
  );
}



const StateTestRoute = ((props) => {
  const dispatch = useDispatch();

  const k = useSelector((state) => state.statetest.k);
  const items = useSelector((state) => state.statetest.items);
  const sortedItemsArr = useSelector((state) => state.statetest.sortedItemsArr);
  const selectedItems = useSelector((state) => state.statetest.selectedItems);


  const bonus = useSelector((state) => state.shop.bonus);
  const descending = useSelector((state) => state.shop.descending);
  const tradeData = useSelector((state) => state.shop.tradeData);

  const [loaded, setLoaded] = useState(false);
  

  useEffect(() => {
    init();

    return function cleanup() {
      socket.off("balance");
      socket.off("depositOfferCallback");
      socket.off("withdrawResponse");
      socket.off("requestInventoryResponse");
  }
  
  }, props.name);

  
  function init() {
    dispatch(resetVars(props.name));

    props.name === "Withdraw" ? socket.emit("requestBotInventory") : socket.emit("requestInventory");
    socket.emit("balance");

    document.title = props.name === "Withdraw" ? "RustySaloon | Withdraw" : "RustySaloon | Deposit";

    socket.on("balance", (withdraw) => {
      //dispatch(setBalance(withdraw));
    });

    socket.on("depositOfferCallback", (data) => {
      dispatch(setTradeData(data));
    });

    
    socket.on("withdrawResponse", (data) => {
      dispatch(setTradeData(data));
    });

    const page = props.name;

    socket.on("requestInventoryResponse", (data) => {
      if (data.type === undefined || (data.type === "bot" && page === "Withdraw")) {
        
        let stackedItems = {};
        data.pending = data.pending ? data.pending : [];

        for (var i = 0; i < data.iv.length; i++) {
          if (!data.pending.includes(data.iv[i].assetid)) {
            if (!stackedItems[data.iv[i].market_hash_name]) {
              stackedItems[data.iv[i].market_hash_name] = {
                amount: 0,
                selectedAmount: 1,
                color: data.iv[i].color,
                image: data.iv[i].image,
                price: data.iv[i].price,
                market_hash_name: data.iv[i].market_hash_name,
                assetIds: [],
                steamIds: [],
              };
            }
            stackedItems[data.iv[i].market_hash_name].amount += 1;
            stackedItems[data.iv[i].market_hash_name].assetIds.push(data.iv[i].assetid);
            stackedItems[data.iv[i].market_hash_name].steamIds.push(data.iv[i].steamid);
          }
        }

        dispatch(setBonus(data.bonus));
        //dispatch(searchForItem(searched));
        dispatch(updateInventory(stackedItems));
        setLoaded(true);
      }
    });
  }


  
 return (
    <React.Fragment>
      <DesktopHeader />
      <MobileHeader />
      <Chat />
      <MobileNav />


       
      { tradeData.enabled && <div class="trade-popup flex">
        <div class="onclickWrapper" onClick={() => { dispatch(closeTradePopup()); }}>
        <div class="wrapper flexCol" onClick={(e) =>{ e.stopPropagation(); }}>
        <header class="flex flexBetween"><h2>Trade Offer</h2><h1 onClick={() => { dispatch(closeTradePopup()); } }>x</h1></header>
        
        <section class="flex">
          <article class="flexCol scrollY">


            {tradeData.items.map((item, i) => <div class="flex">
              <img src={`https://steamcommunity-a.akamaihd.net/economy/image/${item.image}`} />
                <div>
                  <p></p>
                  <b>{item.price}</b>
                  </div>
                </div>
)}

              </article>
              <section class="flexCol">
                <h3>Accept Tradeoffer</h3>
                <p class="">A steam tradeoffer has been sent to you.</p>
                {!tradeData.cost ? <p class="">Please verify that the <span>Security code: {tradeData.securityCode}</span> matches the one on the trade that you recieved.</p>
                : <React.Fragment>
                  <p class="">Congratulations on your winnings!</p>
                <p class="">Please confirm the tradeoffer to recieve your winnings of a <span>total value of <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />&nbsp;{tradeData.cost}</span>!</p>
                
                </React.Fragment>
                }
                <a href={tradeData.link} target="_blank">
                <div class="flex button hover">
                  <p>OPEN OFFER</p>
                  </div>
                  </a>
          </section>
        </section>
        </div>
        </div>

      </div>
      }


      <div class="page-content">
      <div className="withdraw-deposit">





      <span onClick={(e) => {
        dispatch(increment()); 
      }
        }>Click me to increment {k}</span>
     



        {/*
     <div key={'item' + i} onClick={(e) => { dispatch(toggleItem(item)) }}>
       {item.market_hash_name} {i} {selectedItems.find(el=> el.market_hash_name == item.market_hash_name) ? 'selected' : 'not-selected'}
       </div>
        */}

     {sortedItemsArr.map( (item, i) => <Item key={'item' + i} data={item} handler={(e) => dispatch(toggleItem(item))} inNav={false} />)}




      </div>
      </div>

   
    </React.Fragment>
  );
});


export default StateTestRoute;
