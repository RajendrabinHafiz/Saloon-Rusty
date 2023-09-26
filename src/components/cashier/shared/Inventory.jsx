import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../../Socket";
import { Range } from "react-range";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from "../../Loader";


import {
  resetVars,
  setBalance,
  setItems,
  setBonusRatio,
  setFilterValue,
  addItems,
  removeItems,
  resetSelectedAssetIds,
  setItemsBusiness,
  filterItems,
  toggleItem,
  setTradeData,
  closeTradePopup
} from "../../../redux/ducks/inventory";



function SelectedItem({ keyv, item, id, handler, inNav }) {
  const dispatch = useDispatch();
  const _selectedAssetIds = useSelector((state) => state.inventory._selectedAssetIds);

  return (
    <button className={`inventory-item ${_selectedAssetIds.includes(item.assetid_cloned) ? 'inventory-item-selected ' : ''} ${!item.available || item.busy ? 'inventory-item-not-available' : ''}`}
      onClick={() => {
        if (!item.available || item.busy) return;
        dispatch(toggleItem(item));
      }}>
      <div
        className={"inventory-item__image-container"}
      >
        <img src={"https://steamcommunity-a.akamaihd.net/economy/image/" + item.image} alt={item.market_hash_name + " Image"} />
      </div>
      <div className={"inventory-item__color-bar"} style={{ background: item.name_color ? '#' + item.name_color : "#0aa847" }}></div>
      <div
        className="inventory-item__name"

      >
        {item.market_hash_name}
      </div>
      <div
        className="inventory-item__values"

      >

        <div style={{ display: "flex", alignItems: "flex-start", color: item.available && !item.busy ? '#fff' : '#CC4029' }}>
          {item.available && !item.busy ? <React.Fragment>
            <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />
            {(item.price / 100).toFixed(2)}
          </React.Fragment> : <React.Fragment>
            {item.busy ? 'Busy' : (item.denialReason || 'Unavailable')}
          </React.Fragment>}
        </div>
      </div>

    </button>

  );
}


function SelectedNavItem({ keyv, item, id, handler, inNav }) {
  const dispatch = useDispatch();
  const _selectedAssetIds = useSelector((state) => state.inventory._selectedAssetIds);

  return (
    <button className={"inventory-item-new " + (_selectedAssetIds.includes(item.assetid_cloned) ? 'inventory-item-selected ' : '')}
    >

      <div class="item-image" style={{ borderRight: `2px solid ${item.name_color ? '#' + item.name_color : "#0aa847"}` }}>
        <img src={"https://steamcommunity-a.akamaihd.net/economy/image/" + item.image} alt={item.market_hash_name + " Image"} />
      </div>
      <div class="inventory-item-desc">

        <div class="desc-area">
          <div class="desc-el">{item.market_hash_name}</div>
          <FontAwesomeIcon icon="trash" className="delete-icon" onClick={(e) => {
            dispatch(toggleItem(item));
          }} />
        </div>

        <div class="desc-el inventory-item-bottom">
          <div class>
            <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />
            {(item.price / 100).toFixed(2)}
          </div>

        </div>

      </div>

    </button>

  );
}



export default ((props) => {
  const dispatch = useDispatch();

  const bonusRatio = useSelector((state) => state.inventory.bonusRatio);

  const items = useSelector((state) => state.inventory.items);
  const filteredItems = useSelector((state) => state.inventory.filteredItems);
  const filter = useSelector((state) => state.inventory.filter);
  const tradeData = useSelector((state) => state.inventory.tradeData);

  const _selectedAssetIds = useSelector((state) => state.inventory._selectedAssetIds);

  const totalItemsValue = useSelector((state) => state.inventory.totalItemsValue);
  const userBalance = useSelector((state) => state.profile.balance);
  const loggedIn = useSelector((state) => state.profile.loggedIn);

  const [loaded, setLoaded] = useState(false);
  const [wagerWithdraw, setwagerWithdraw] = useState(0);
  const [requesting, setRequesting] = useState(false);

  function request() {
    if (_selectedAssetIds.length == 0) return;


    const selectedAssetAmount = {};
    _selectedAssetIds.map(assetId_cloned => {
      const assetId = assetId_cloned.split('_')[0];
      if (selectedAssetAmount[assetId]) selectedAssetAmount[assetId]++;
      else selectedAssetAmount[assetId] = 1;
    });
    const assets = Object.keys(selectedAssetAmount).reduce((arr, key) => { arr.push({ assetid: key, amount: selectedAssetAmount[key]  }); return arr; }, []);

    setRequesting(true);
    socket.emit(props.name == 'Deposit' ? "steamTrader:requestDeposit" : "steamTrader:requestWithdraw", {
      assets,
      totalItemsValue,
      app: props.app
    });
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
      if (props.name == "Withdraw") {
        socket.off("steamTrader:market:info");
        socket.off("steamTrader:market:addItems");
        socket.off("steamTrader:market:removeItems");
        socket.off("steamTrader:market:setItemsBusiness");
        socket.emit("steamTrader:shop:unsub");
      } else {
        socket.off("steamTrader:requestInventoryResponse");
      }
      socket.off("steamTrader:requestResponse");
      socket.off("steamTrader:offerCallback");




    }

  }, [props.name, props.app]);



  function init() {
    const page = props.name;
    setLoaded(false);
    dispatch(resetVars(page));
    props.name === "Withdraw" ? socket.emit("steamTrader:shop:sub") : socket.emit("steamTrader:requestInventory", {app: props.app});
    socket.emit("balance");

    socket.on("balance", (withdraw) => {
      dispatch(setBalance(withdraw));
    });




    if (props.name == "Withdraw") {
      socket.on("steamTrader:market:info", (data) => {
        setwagerWithdraw(data.wagerWithdraw);
        dispatch(setItems(data.items));
        dispatch(filterItems());
        setLoaded(true);
      });

      socket.on("steamTrader:market:addItems", (data) => {
        dispatch(addItems(data));
        dispatch(filterItems());
      });
      socket.on("steamTrader:market:removeItems", (data) => {
        dispatch(removeItems(data));
        dispatch(filterItems());
      });
      socket.on("steamTrader:market:setItemsBusiness", (data) => {
        dispatch(setItemsBusiness(data));
        dispatch(filterItems());
      });
    } else {

      socket.on("steamTrader:requestInventoryResponse", (data) => {
        dispatch(setItems(data.items));
        dispatch(setBonusRatio(data.bonusRatio));
        dispatch(filterItems());
        setLoaded(true);
      });
    }

    socket.on("steamTrader:requestResponse", (data) => {
      setRequesting(false);
      if (data) dispatch(resetSelectedAssetIds());
    });

    socket.on("steamTrader:offerCallback", (data) => {
      dispatch(setTradeData(data));
    });

  }


  return (
    <React.Fragment>

      {tradeData.enabled && <div class="trade-popup flex">
        <div class="onclickWrapper" onClick={() => { dispatch(closeTradePopup()); }}>
          <div class="wrapper flexCol" onClick={(e) => { e.stopPropagation(); }}>
            <header class="flex flexBetween"><h2>Trade Offer</h2><h1 onClick={() => { dispatch(closeTradePopup()); }}>x</h1></header>

            <section class="flex">
              <article class="flexCol scrollY">


                {tradeData.items.map((item, i) => <div class="flex">
                  <img src={`https://steamcommunity-a.akamaihd.net/economy/image/${item.image}`} />
                  <div>
                    <p></p>
                    <b>{item.amount}x {(item.value / 100).toFixed(2)}</b>
                  </div>
                </div>
                )}

              </article>
              <section class="flexCol">
                <h3>Accept Tradeoffer</h3>
                <p class="">A steam tradeoffer has been sent to you.</p>
                {!tradeData.cost ? <p class="">Please verify that the <span>tracking id #{tradeData.trackingId}</span> matches the one on the trade that you recieved.</p>
                  : <React.Fragment>
                    <p class="">Congratulations on your winnings!</p>
                    <p class="">Please confirm the tradeoffer to recieve your winnings of a <span>total value of <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />&nbsp;{tradeData.cost}</span>!</p>

                  </React.Fragment>
                }
                 <a href="javascript: void(0)" onClick={() => {
                  global.openWindow(tradeData.link)
                }}>
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

        {!loaded ? <Loader /> : <React.Fragment>
          <div className="inventory__filters">
          {props.name == "Withdraw" && loggedIn && <button
          style={{ color: wagerWithdraw > 0 ? 'var(--red)' : 'auto'}}
              className="inventory__descending input"
              onClick={() => {
              }}
            >
              {wagerWithdraw == 0 ? <React.Fragment>
                <span style={{marginRight: 10}}>Balance</span>  <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />{(userBalance / 100).toFixed(2)}
                </React.Fragment> : <React.Fragment>
                <span style={{marginRight: 10}}>Wager</span>  <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />{(wagerWithdraw / 100).toFixed(2)}
                  </React.Fragment>}
            </button>}
            <input
              type="text"
              className="input"
              placeholder="Search"
              onChange={(e) => {
                dispatch(setFilterValue({ key: 'name', value: e.target.value }));
                dispatch(filterItems());
              }}
            />
            <input
              type="number"
              className="input"
              placeholder="Min Price"
              onChange={(e) => {
                dispatch(setFilterValue({ key: 'minAmount', value: e.target.value }));
                dispatch(filterItems());
              }}
            />
            <input
              type="number"
              className="input"
              placeholder="Max Price"
              onChange={(e) => {
                dispatch(setFilterValue({ key: 'maxAmount', value: e.target.value }));
                dispatch(filterItems());
              }}
            />
            <button
              className="inventory__descending input"
              onClick={() => {
                dispatch(setFilterValue({ key: 'orderByDescending', value: !filter.orderByDescending }));
                dispatch(filterItems());
              }}
            >
              {filter.orderByDescending ? "Descending 🡣" : "Ascending 🡡"}
            </button>
          </div>


          <div class="inventory-wrap">
            {filteredItems.length == 0 && <b>No Items - Make sure you have linked your trade url and that your account is public</b>}


            <div className={`inventory-items ${filteredItems.length === 0 ? 'no-items' : ''}`}>
              {filteredItems.length > 0 && (
                filteredItems.map((item, index) => {
                  return <SelectedItem item={item} inNav={false} />;
                })
              )}
            </div>


            <div class="withdraw-wrap">

              <h3>{props.name == "Deposit" ? "Your Deposited Items" : "Your Cart"}</h3>
              <div class="wrap">
                <div className="withdraw__items" >
                  {_selectedAssetIds.length === 0
                    ? ""
                    : _selectedAssetIds.map((assetid_cloned, index) => {
                      return <SelectedNavItem id="wide" key={'witem' + assetid_cloned} item={filteredItems.find(el => el.assetid_cloned == assetid_cloned)} inNav={true} />;
                    })}
                </div>

                <div className="withdraw__bottom">
                  <div className="key-value">
                    <div>Value</div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />
                      {(totalItemsValue / 100).toFixed(2)}
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
                            have <i>#rustysaloon</i> in your name at the time of the deposit, you will
                            receive an extra 5% bonus on your deposit!</div>
                        </div>
                        <div className="green bonusml">Bonus ({bonusRatio * 100}%)</div>
                      </div>
                      <div className="green" style={{ display: "flex", alignItems: "center" }}>
                        +{(bonusRatio ? (Math.floor(totalItemsValue * bonusRatio) / 100).toFixed(2) : 0.0)}
                      </div>

                    </div>
                  )}

                  {bonusRatio > 0 ? <div className="key-value key-value--total">
                    <div>Total</div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FontAwesomeIcon icon="coins" className="balanceicon align-self-center" />
                      {bonusRatio ? (Math.floor(totalItemsValue * (1 + bonusRatio)) / 100).toFixed(2) : (totalItemsValue / 100).toFixed(2)}
                    </div>
                  </div> : ''}

                  <button
                    className="button button--red"
                    onClick={() => request()}
                  >

                    {requesting ? <div class="inventory-request-loader"><Loader /></div> : props.name === "Withdraw" ? "Withdraw" : "Deposit"}

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

