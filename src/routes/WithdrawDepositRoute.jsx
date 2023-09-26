import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Chat from "../components/ChatBar";
import MobileHeader from "../components/desktop/Header";
import DesktopHeader from "../components/mobile/Header";
import MobileNav from "../components/mobile/Nav";
import { socket } from "../Socket";
import { Range } from "react-range";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

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
  closeTradePopup,
} from "../redux/ducks/inventory";

function SelectedItem({ keyv, info, id, handler, inNav }) {
  const dispatch = useDispatch();
  const [currentValue, setValue] = useState(1);
  const _selectedAssetIds = useSelector(
    (state) => state.inventory._selectedAssetIds,
  );

  function adjust(color, amount) {
    return (
      "#" +
      color
        .replace(/^#/, "")
        .replace(/../g, (color) =>
          (
            "0" +
            Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
              16,
            )
          ).substr(-2),
        )
    );
  }

  function getBackground(price) {
    let color = "#fff";
    if (price >= 0 && price <= 500)
      return `radial-gradient(100% 100% at 50% 50%, rgba(75, 105, 255, 0.308) 0%, rgba(75, 105, 255, 0) 100%)`; //blue
    else if (price >= 501 && price <= 2500)
      return `radial-gradient(100% 100% at 50% 50%, rgba(136, 71, 255, 0.308) 0%, rgba(136, 71, 255, 0) 100%)`; //purple
    else if (price >= 2501 && price <= 10000)
      return `radial-gradient(100% 100% at 50% 50%, rgba(211, 46, 230, 0.308) 0%, rgba(211, 46, 230, 0) 100%)`; //pink
    else if (price >= 10001 && price <= 30000)
      return `radial-gradient(100% 100% at 50% 50%, rgba(235, 75, 75, 0.308) 0%, rgba(235, 75, 75, 0) 100%)`; //red
    else
      return `radial-gradient(100% 100% at 50% 50%, rgb(235 211 75 / 21%) 0%, rgb(217 199 42 / 0%) 100%)`;
  }

  function getBorderColor(price) {
    let color = "#fff";
    if (price >= 0 && price <= 500) return "rgb(75, 105, 255)"; //blue
    else if (price >= 501 && price <= 2500) return "rgb(136, 71, 255)"; //purple
    else if (price >= 2501 && price <= 10000) return "rgb(211, 46, 230)"; //pink
    else if (price >= 10001 && price <= 30000) return " rgb(235, 75, 75)"; //red
    else return "rgb(235 211 75)";
  }

  return (
    <button
      style={{ background: getBackground(info.price) }}
      className={`inventory-item ${
        !inNav && _selectedAssetIds.includes(info.assetid_cloned)
          ? "inventory-item-selected "
          : ""
      } ${
        !info.available || info.busy ? "inventory-item-not-available" : ""
      }  ${inNav ? "inventory-item-nav" : ""}`}
      onClick={() => {
        if (!info.available || info.busy) return;
        dispatch(toggleItem(info));
      }}
    >
      <div className={"inventory-item__image-container"}>
        <img
          src={
            "https://steamcommunity-a.akamaihd.net/economy/image/" + info.image
          }
          alt={info.market_hash_name + " Image"}
        />
      </div>
      <div
        className={"inventory-item__color-bar"}
        style={{ background: getBorderColor(info.price) }}
      ></div>
      <div className="inventory-item__name">{info.market_hash_name}</div>
      <div className="inventory-item__values">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            color: info.available && !info.busy ? "#fff" : "#CC4029",
          }}
        >
          {info.available && !info.busy ? (
            <React.Fragment>
              <FontAwesomeIcon
                icon="coins"
                className="balanceicon align-self-center"
              />
              {(info.price / 100).toFixed(2)}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {info.busy ? "Busy" : info.denialReason || "Unavailable"}
            </React.Fragment>
          )}
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
                    }%, #31353d ${
                      ((currentValue - 1) / (info.amount - 1)) * 100
                    }%, #31353d 100%)`,
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
  );
}

const WithdrawDepositRoute = (props) => {
  const dispatch = useDispatch();

  const bonusRatio = useSelector((state) => state.inventory.bonusRatio);
  const { mobile } = useSelector((state) => state.main);
  const items = useSelector((state) => state.inventory.items);
  const filteredItems = useSelector((state) => state.inventory.filteredItems);
  const filter = useSelector((state) => state.inventory.filter);
  const tradeData = useSelector((state) => state.inventory.tradeData);

  const _selectedAssetIds = useSelector(
    (state) => state.inventory._selectedAssetIds,
  );

  const totalItemsValue = useSelector(
    (state) => state.inventory.totalItemsValue,
  );
  const userBalance = useSelector((state) => state.profile.balance);
  const loggedIn = useSelector((state) => state.profile.loggedIn);

  const [loaded, setLoaded] = useState(false);
  const [wagerWithdraw, setwagerWithdraw] = useState(0);
  const [requesting, setRequesting] = useState(false);

  function request() {
    if (_selectedAssetIds.length === 0) return;

    const selectedAssetAmount = {};
    _selectedAssetIds.map((assetId_cloned) => {
      const assetId = assetId_cloned.split("_")[0];
      if (selectedAssetAmount[assetId]) selectedAssetAmount[assetId]++;
      else selectedAssetAmount[assetId] = 1;
    });
    const assets = Object.keys(selectedAssetAmount).reduce((arr, key) => {
      arr.push({ assetid: key, amount: selectedAssetAmount[key] });
      return arr;
    }, []);

    setRequesting(true);
    socket.emit(
      props.name === "Deposit"
        ? "steamTrader:requestDeposit"
        : "steamTrader:requestWithdraw",
      {
        assets,
        totalItemsValue,
        app: "RUST",
      },
    );
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
      if (props.name === "Withdraw") {
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
    };
  }, [props.name, props.app]);

  function init() {
    const page = props.name;
    setLoaded(false);
    dispatch(resetVars(page));
    props.name === "Withdraw"
      ? socket.emit("steamTrader:shop:sub")
      : socket.emit("steamTrader:requestInventory", { app: "RUST" });
    socket.emit("balance");

    socket.on("balance", (withdraw) => {
      dispatch(setBalance(withdraw));
    });

    if (props.name === "Withdraw") {
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

  const MemoizedItem = React.memo(SelectedItem, (prev, next) => {
    return prev.info.amount === next.info.amount;
  });

  return (
    <React.Fragment>
      {tradeData.enabled && (
        <div class="trade-popup flex">
          <div
            class="onclickWrapper"
            onClick={() => {
              dispatch(closeTradePopup());
            }}
          >
            <div
              class="wrapper flexCol"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <header class="flex flexBetween">
                <h2>Trade Offer</h2>
                <h1
                  onClick={() => {
                    dispatch(closeTradePopup());
                  }}
                >
                  x
                </h1>
              </header>

              <section class="flex">
                <article class="flexCol scrollY">
                  {tradeData.items.map((item, i) => (
                    <div class="flex">
                      <img
                        src={`https://steamcommunity-a.akamaihd.net/economy/image/${item.image}`}
                        alt=""
                      />
                      <div>
                        <p></p>
                        <b>
                          {item.amount}x {(item.value / 100).toFixed(2)}
                        </b>
                      </div>
                    </div>
                  ))}
                </article>
                <section class="flexCol">
                  <h3>Accept Tradeoffer</h3>
                  <p class="">A steam tradeoffer has been sent to you.</p>
                  {!tradeData.cost ? (
                    <p class="">
                      Please verify that the{" "}
                      <span>tracking id #{tradeData.trackingId}</span> matches
                      the one on the trade that you recieved.
                    </p>
                  ) : (
                    <React.Fragment>
                      <p class="">Congratulations on your winnings!</p>
                      <p class="">
                        Please confirm the tradeoffer to recieve your winnings
                        of a{" "}
                        <span>
                          total value of{" "}
                          <FontAwesomeIcon
                            icon="coins"
                            className="balanceicon align-self-center"
                          />
                          &nbsp;{tradeData.cost}
                        </span>
                        !
                      </p>
                    </React.Fragment>
                  )}
                  <a
                    href={tradeData.link}
                    target="_blank"
                    onClick={() => {
                      //global.openWindow(tradeData.link)
                    }}
                    rel="noreferrer"
                  >
                    <div class="flex button hover">
                      <p>OPEN OFFER</p>
                    </div>
                  </a>
                </section>
              </section>
            </div>
          </div>
        </div>
      )}

      <div className="page-content">
        <div
          className="withdraw-deposit tower"
          style={mobile ? { display: "block" } : {}}
        >
          <div class="withdraw-wrap">
            <div className="withdraw">
              <div className="main-label">
                {_selectedAssetIds.length} Items Selected
              </div>
              <div className="withdraw__items" style={{ textAlign: "center" }}>
                {_selectedAssetIds.length === 0
                  ? ""
                  : _selectedAssetIds.map((assetid_cloned, index) => {
                      return (
                        <SelectedItem
                          id="wide"
                          key={"witem" + assetid_cloned}
                          info={filteredItems.find(
                            (el) => el.assetid_cloned === assetid_cloned,
                          )}
                          inNav={true}
                        />
                      );
                    })}
              </div>

              <div className="withdraw__bottom">
                <div className="key-value">
                  <div>Value</div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="/images/diamond.svg" alt="" />
                    <span>{(totalItemsValue / 100).toFixed(2)}</span>
                  </div>
                </div>

                {props.name === "Withdraw" ? (
                  ""
                ) : (
                  <div className="key-value green">
                    <div className="flex">
                      <div className="qc">
                        <FontAwesomeIcon
                          icon="question-circle"
                          className="green qc"
                        />
                        <div className="gtooltip">
                          If you have <i>#rustysaloon</i> in your name at the
                          time of the deposit, you will receive an extra 5%
                          bonus on your deposit!
                        </div>
                      </div>
                      <div className="green bonusml">Bonus (5%)</div>
                    </div>
                    <div
                      className="green"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      +
                      {bonusRatio
                        ? (
                            Math.floor(totalItemsValue * bonusRatio) / 100
                          ).toFixed(2)
                        : 0.0}
                    </div>
                  </div>
                )}

                <div className="key-value key-value--total">
                  <div>Total</div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="/images/diamond.svg" alt="" />
                    <span>
                      {bonusRatio
                        ? (
                            Math.floor(totalItemsValue * (1 + bonusRatio)) / 100
                          ).toFixed(2)
                        : (totalItemsValue / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="button button--red" onClick={() => request()}>
                  {requesting ? (
                    <div class="inventory-request-loader">
                      <Loader />
                    </div>
                  ) : props.name === "Withdraw" ? (
                    "Withdraw"
                  ) : (
                    "Deposit"
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="inventory" style={{ textAlign: "center" }}>
            {!loaded ? (
              <Loader />
            ) : (
              <React.Fragment>
                <div
                  className="inventory__filters"
                  style={{ justifyContent: "space-between" }}
                >
                  {props.name === "Withdraw" && loggedIn && (
                    <button
                      style={{
                        color: wagerWithdraw > 0 ? "var(--red)" : "auto",
                      }}
                      className="inventory__descending input"
                      onClick={() => {}}
                    >
                      {wagerWithdraw === 0 ? (
                        <React.Fragment>
                          <span style={{ marginRight: 10 }}>Balance</span>{" "}
                          <FontAwesomeIcon
                            icon="coins"
                            className="balanceicon align-self-center"
                          />
                          {(userBalance / 100).toFixed(2)}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <span style={{ marginRight: 10 }}>Wager</span>{" "}
                          <FontAwesomeIcon
                            icon="coins"
                            className="balanceicon align-self-center"
                          />
                          {(wagerWithdraw / 100).toFixed(2)}
                        </React.Fragment>
                      )}
                    </button>
                  )}
                  <input
                    type="text"
                    className="input"
                    placeholder="Search"
                    onChange={(e) => {
                      dispatch(
                        setFilterValue({ key: "name", value: e.target.value }),
                      );
                      dispatch(filterItems());
                    }}
                  />
                  <input
                    type="number"
                    className="input"
                    placeholder="Min Price"
                    onChange={(e) => {
                      dispatch(
                        setFilterValue({
                          key: "minAmount",
                          value: e.target.value,
                        }),
                      );
                      dispatch(filterItems());
                    }}
                  />
                  <input
                    type="number"
                    className="input"
                    placeholder="Max Price"
                    onChange={(e) => {
                      dispatch(
                        setFilterValue({
                          key: "maxAmount",
                          value: e.target.value,
                        }),
                      );
                      dispatch(filterItems());
                    }}
                  />
                  <button
                    className="inventory__descending input"
                    onClick={() => {
                      dispatch(
                        setFilterValue({
                          key: "orderByDescending",
                          value: !filter.orderByDescending,
                        }),
                      );
                      dispatch(filterItems());
                    }}
                  >
                    {filter.orderByDescending ? "Descending 🡣" : "Ascending 🡡"}
                  </button>
                </div>

                <div
                  className={`inventory-items ${
                    filteredItems.length === 0 ? "no-items" : ""
                  }`}
                >
                  {filteredItems.length > 0 &&
                    filteredItems.map((item, index) => {
                      return <SelectedItem info={item} inNav={false} />;
                    })}
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default WithdrawDepositRoute;
