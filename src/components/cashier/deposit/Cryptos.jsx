import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../../Socket";
import { Range } from "react-range";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from "../../Loader";
import { setCurrentWallet, walletUnshiftTransaction, walletUpdateTransactionStatus } from "../../../redux/ducks/depositmenu";


const classNames = require('classnames');


const currencies = {
  BTC: {
    name: "Bitcoin",
    extra: 40,
    logo: "btc_logo.svg"
  },
  ETH: {
    name: "Ethereum",
    extra: 40,
    logo: "eth_logo.svg"
  },
  LTC: {
    name: "Litecoin",
    extra: 40,
    logo: "ltc_logo.svg"
  },
  DOGE: {
    name: "Dogecoin",
    extra: 40,
    logo: "doge_logo.svg"
  }
};



function getShortTime(unixTime) {
  const date = new Date(unixTime * 1000);
  return  (date.getMonth() + 1) + '.' + (date.getDate() <= 9 ? '0' : '') + date.getDate() + "." + date.getFullYear();
}
const Transaction = ({ el }) => {
  return (
    <div className="hdeposit">
      <div>{getShortTime(el.createdAt)}</div>
      <div>${(el.fiatAmount / 100).toFixed(2)}</div>
      <div>{el.status >= 100 ? "Credited" : "Pending"}</div>
    </div>
  );
}


const CryptoDetails = ({ loading, currency, currentWallet }) => {
  return (
    <div className={"cdetails " + (loading ? 'cdetails-loading' : '')}>
      <input id="codeLink" value={currentWallet.address} class="" />
      <div className="text grey">{currencies[currency].name} Deposit</div>
      <div className="cbox">
        <div>
        <img src={"https://chart.googleapis.com/chart?cht=qr&chl=" + currentWallet.address + "&chs=250x250"} alt="QR Deposit Image" />
        </div>
        <div className="texts exp">
          <div>
            This is your own {currencies[currency].name} address.<br />
            Send any amount to this address. You will receive your coins and<br />a <span class="color-green">40% bonus</span> after transaction gets confirmed.
          </div>

          <div class="color-red">
          Only deposit under {currency} network
          </div>
          <div className="grey">
            Permanent Deposit Address
          </div>
          <div className="inputted">
            <input disabled type="text" value={currentWallet.address} />
            <img src="/images/copy_btn.svg" alt="Copy Button" onClick={() => {
                           var copyText = document.getElementById("codeLink");
                           copyText.focus();
                           copyText.select();
                           copyText.setSelectionRange(0, 99999);
                           document.execCommand('copy');
              try { navigator.clipboard.writeText(currentWallet.address); } catch (err) { }
              global.retoastr("success", "You have successfully copied wallet address to clipboard!")

            }} />
          </div>
        </div>
        <div className="left">
          <div className="text">
            <h5>Last 5 Deposits</h5>
          </div>
          <div className="data">
            <div className="pheader">
              <div>
                Date
              </div>
              <div>
                Amount
              </div>
              <div>
                Status
              </div>
            </div>
            {
              currentWallet.transactions.length > 0 ?
                currentWallet.transactions.map(el => {
                  return <Transaction el={el} />
                })
                : null
            }
          </div>
        </div>
      </div>
    </div>
  );
}




function Box({ selected, onClickEvent, short, name, logo, extra, type }) {
  return (
    <div data-type={short} className={`box ${selected ? 'deposit-box-selected' : ''}`} onClick={onClickEvent}>
      <img src={"/images/" + logo} alt={short + " Logo"} />
      <div className="line"></div>
      <div className="bottom">
        <div>{name}</div>
        <div>
          {
            extra > 0 ? <div>+{extra}%</div> : null
          }
        </div>
      </div>
    </div>
  )
}

export default (props) => {
  const dispatch = useDispatch();

  var [selectedCurrency, setSelectedCurrency] = useState("");
  const isLoggedIn = useSelector((state) => state.profile.loggedIn);
  var [loading, setLoading] = useState(false);
  const currentWallet = useSelector((state) => state.depositmenu.currentWallet);




  useEffect(() => {

    socket.emit("balance");

    socket.on("cryptocurrencies:walletInfo", (data) => {
      dispatch(setCurrentWallet(data));
      setLoading(false);
    });

    socket.on("cryptocurrencies:walletUnshiftTransaction", (data) => {
      dispatch(walletUnshiftTransaction(data));
    });

    socket.on("cryptocurrencies:walletUpdateTransactionStatus", (data) => {
      dispatch(walletUpdateTransactionStatus(data));
    });

    return function cleanup() {
      socket.off("cryptocurrencies:walletInfo");
      socket.off("cryptocurrencies:walletUnshiftTransaction");
      socket.off("cryptocurrencies:walletUpdateTransactionStatus");
    }


  }, []);


  return (
    <React.Fragment>
      <div className="deposit">

        <h4 className="grey">Crypto Deposits</h4>
        <div className="boxes">
          {Object.keys(currencies).map((key, x) => {
            let i = currencies[key];
            return <Box selected={key == selectedCurrency} key={'crypto' + key} short={key} name={i.name} logo={i.logo} extra={i.extra} type="crypto"

              onClickEvent={(e) => {
                console.log(key)
                if (!isLoggedIn) return global.retoastr("error", "Please login first!");
                if (loading) return;
                setLoading(true);
                socket.emit("cryptocurrencies:getWallet", { currency: key });
                setSelectedCurrency(key);

              }}
            />
          })}
        </div>

        {selectedCurrency != "" ? <CryptoDetails key={selectedCurrency} currency={selectedCurrency} currentWallet={currentWallet} loading={loading} /> : null}

      </div>

    </React.Fragment>
  );

};
