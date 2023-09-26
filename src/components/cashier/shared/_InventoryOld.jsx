import React, { useEffect, useState, useCallback, useMemo  } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../../Socket";
import { Range } from "react-range";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from "../../Loader";


import {
  resetVars,
  setBalance,
  searchForItem,
  updateInventory,
  setSelected,
  removeSelected,
  toggleDescending,
  setMinAmount,
  setMaxAmount,
  setBonus,
  setTradeData,
  closeTradePopup
} from "../../../redux/ducks/shop";



function  SelectedItem ({keyv, info, id, handler, inNav }) {
  const [currentValue, setValue] = useState(1);

  const selected = useSelector((state) => state.shop.selected);

  return (
    <button className={ "inventory-item " + (info.market_hash_name && selected[info.market_hash_name] ? 'inventory-item-selected ' : '') } 
    onClick={() => {
      handler(info);
    }}>
      <div
        className={"inventory-item__image-container"}
      >
        <img src={"https://steamcommunity-a.akamaihd.net/economy/image/" + info.image} alt={info.market_hash_name + " Image"} />
      </div>
      <div className={"inventory-item__color-bar"} style={{ background: info.color ? info.color : "#0aa847" }}></div>
      <div
        className="inventory-item__name"

      >
        {info.market_hash_name}
      </div>
      <div
        className="inventory-item__values"

      >
        <div>{id === "wide" ? currentValue : info.amount}x</div>

        <div style={{ display: "flex", alignItems: "flex-start" }}>
        <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />
          {(currentValue * info.price).toFixed(2)}
        </div>
      </div>

    </button>
    
  );
}


function  SelectedNavItem ({keyv, info, id, handler, inNav }) {
  const [currentValue, setValue] = useState(1);

  const selected = useSelector((state) => state.shop.selected);

  return (
    <button className={ "inventory-item-new " + (info.market_hash_name && selected[info.market_hash_name] ? 'inventory-item-selected ' : '') } 
    >

      <div class="item-image" style={{ borderRight: `2px solid ${info.color ? info.color.replace(/##/, "#") : "#0aa847"}` }}>
      <img src={"https://steamcommunity-a.akamaihd.net/economy/image/" + info.image} alt={info.market_hash_name + " Image"} />
      </div>
      <div class="inventory-item-desc">

        <div class="desc-area">
        <div class="desc-el">{info.market_hash_name}</div>
        <FontAwesomeIcon icon="trash" className="delete-icon" onClick={(e) => {
  handler(info);
        }} />
        </div>

        <div class="desc-el inventory-item-bottom">
          <div class>
          <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />
          {(currentValue * info.price).toFixed(2)}
          </div>

        <div class="desc-quantity">
          <div class="minus" onClick={(e) => {
            if (info.selectedAmount <= 1) return;
            const newValue = info.selectedAmount - 1;
            setValue(newValue);
                handler(info, newValue);
          }}>-</div>
          <input type="number" value={currentValue} readonly="readonly" />
          <div class="plus" onClick={(e) => {
            if (info.selectedAmount >= info.amount || info.selectedAmount >= 20) return;
            const newValue = info.selectedAmount + 1;
            setValue(newValue);
                handler(info, newValue);
          }}
          > +</div>
        </div>

        </div>
      </div>
      {/*
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
              step={currentValue}
              min={1}
              max={info.amount}
              values={[currentValue]}
              onChange={(values) => {
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
      */}
    </button>
    
  );
}



export default ((props) => {
  const dispatch = useDispatch();

  const searched = useSelector((state) => state.shop.searched);
  const k = useSelector((state) => state.shop.k);
  const displayIv = useSelector((state) => state.shop.displayIv);
  const sortedIv = useSelector((state) => state.shop.sortedIv);
  const invArr = useSelector((state) => state.shop.invArr);
  const selected = useSelector((state) => state.shop.selected);
  const selectedValue = useSelector((state) => state.shop.selectedValue);
  const bonus = useSelector((state) => state.shop.bonus);
  const descending = useSelector((state) => state.shop.descending);
  const tradeData = useSelector((state) => state.shop.tradeData);


  const userBalance = useSelector((state) => state.profile.balance);

  const [loaded, setLoaded] = useState(false);
  
  const displayItem = (info, selectedAmount) => {


   
    //dispatch(setSelected({ info, selectedAmount: selectedValue }));
    
    if (selectedAmount !== undefined) {
      if (selected[info.market_hash_name]) {
        selectedAmount = selectedAmount || 1;
        dispatch(setSelected({ info: info, selectedAmount: selectedAmount }));
      }
    } else {
      if (selected[info.market_hash_name]) {
        dispatch(removeSelected({ info: info, selectedAmount: selectedAmount }));
      } else {
        dispatch(setSelected({ info: info, selectedAmount: selectedValue }));
      }
    }
    
  };

  function depositItems() {
    if (Object.keys(selected).length > 0) {
      socket.emit("depositItems", {
        items: selected,
      });
    }
  }

  function withdrawItems() {
    if (Object.keys(selected).length > 0) {
      socket.emit("withdrawItems", selected);
    }
  }

  /*
  useEffect(() => {
    init();
  }, []);
  */

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
      dispatch(setBalance(withdraw));
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
        dispatch(searchForItem(searched));
        dispatch(updateInventory(stackedItems));
        setLoaded(true);
      }
    });
  }


return (
    <React.Fragment>
      
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

   
              
          <div className="inventory-popup">
       
              
              {!loaded ?  <Loader /> : <React.Fragment>
              <div className="inventory__filters">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  onChange={(e) => dispatch(searchForItem(e))}
                />
                <input
                  type="number"
                  className="input"
                  placeholder="Min Price"
                  onChange={(e) => {
                    dispatch(setMinAmount(e.target.value));
                    dispatch(searchForItem(searched));
                  }}
                />
                <input
                  type="number"
                  className="input"
                  placeholder="Max Price"
                  onChange={(e) => {
                    dispatch(setMaxAmount(e.target.value));
                    dispatch(searchForItem(searched));
                  }}
                />
                <button
                  className="inventory__descending input"
                  onClick={() => {
                    dispatch(toggleDescending());
                  }}
                >
                  {descending ? "Descending 🡣" : "Ascending 🡡"}
                </button>
              </div>

                  
                  <div class="inventory-wrap">
                  {invArr.length == 0 && <b>No Items - Make sure you have linked your trade url and that your account is public</b>}


              <div className={`inventory-items ${invArr.length === 0 ? 'no-items' : ''}`}>
                {invArr.length > 0 && (
                  invArr.map((item, index) => {
                      return <SelectedItem info={item} handler={displayItem} inNav={false}/>;
                    })
                )}
              </div>
            

              <div class="withdraw-wrap">
      
                    <h3>{props.name == "Deposit" ? "Your Deposited Items" : "Your Cart"}</h3>
            <div class="wrap">
            <div className="withdraw__items" >
              {Object.keys(selected).length === 0
                ? ""
                : Object.keys(selected)
                    .map((item, index) => {
                      return <SelectedNavItem id="wide" key={'witem' + item} info={selected[item]} handler={displayItem} inNav={true} />;
                    })}
            </div>

            <div className="withdraw__bottom">
              <div className="key-value">
                <div>Value</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />
                  {selectedValue.toFixed(2)}
                </div>
              </div>

              {props.name === "Withdraw" ? (
                ""
              ) : (
                <div className="key-value green">
                  <div className="flex">
                  <div className="qc">
                  <FontAwesomeIcon icon="question-circle" className="green qc" />
                  <div className="gtooltip">If you
have <i>rustysaloon.com</i> in your name at the time of the deposit, you will
receive an extra 5% bonus on your deposit!</div>
                  </div>
                  <div className="green bonusml">Bonus (5%)</div>
                  </div>
                  <div className="green" style={{ display: "flex", alignItems: "center" }}>
                    +{(bonus ? selectedValue * 0.05 : 0.0).toFixed(2)}
                  </div>
            
                </div>
              )}

              {bonus && <div className="key-value key-value--total">
                <div>Total</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />
                  {bonus ? (selectedValue * 1.05).toFixed(2) : selectedValue.toFixed(2)}
                </div>
              </div>}

              <button
                className="button button--red"
                onClick={() => (props.name === "Withdraw" ? withdrawItems() : depositItems())}
              >
                {props.name === "Withdraw" ? "Withdraw" : "Deposit"}
              </button>
            </div>
            </div>
     
          </div>
          






              </div>



            </React.Fragment>
            }

         
          </div>


      


    </React.Fragment>
  );
});

