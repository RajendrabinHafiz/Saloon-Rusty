import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Chat from "../components/ChatBar";
import MobileHeader from "../components/desktop/Header";
import DesktopHeader from "../components/mobile/Header";
import MobileNav from "../components/mobile/Nav";
import { socket } from "../Socket";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  setCurrentWallet,
  walletUnshiftTransaction,
  walletUpdateTransactionStatus,
} from "../redux/ducks/depositmenu";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const classNames = require("classnames");

const Transaction = ({ el }) => {
  return (
    <div className="hdeposit">
      <div>{new Date(el.createdAt * 1000).toISOString()}</div>
      <div>${(el.fiatAmount / 100).toFixed(2)}</div>
      <div>{el.status >= 100 ? "Credited" : "Pending"}</div>
    </div>
  );
};

const CryptoDetails = ({ loading, currency, currentWallet }) => {
  return (
    <div className={"cdetails " + (loading ? "cdetails-loading" : "")}>
      <div className="text">{currency} DEPOSIT</div>
      <div className="cbox">
        <img
          src={
            "https://chart.googleapis.com/chart?cht=qr&chl=" +
            currentWallet.address +
            "&chs=250x250"
          }
          alt="QR Deposit Image"
        />
        <div className="texts">
          <div>
            Send the amount of crypto your choice to the following address to
            receive that amount in coins.
          </div>
          <div>
            Minimum 1 confirmation to get credited. Only deposit under{" "}
            {currency} network
          </div>
          <div className="grey">Permanent Deposit Address</div>
          <div className="inputted">
            <input disabled type="text" value={currentWallet.address} />
            <img
              src="/images/copy_btn.svg"
              alt="Copy Button"
              onClick={() => {
                try {
                  navigator.clipboard.writeText(currentWallet.address);
                } catch (err) {}

                toast.success(
                  "You have successfully copied wallet address to clipboard!",
                );
              }}
            />
          </div>
        </div>
        <div className="left">
          <div className="text">Last 5 Deposits</div>
          <div className="data">
            <div className="pheader">
              <div>Date/Time</div>
              <div>Amount</div>
              <div>Status</div>
            </div>
            {currentWallet.transactions.length > 0
              ? currentWallet.transactions.map((el) => {
                  return <Transaction el={el} />;
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

function PaydashInput() {
  var [paydashAmount, setPaydashAmount] = useState(1);
  var [email, setEmail] = useState("");

  function setPaydashAmountCb(e) {
    setPaydashAmount(e.target.value);
  }

  return (
    <div className="gctrans" style={{ marginLeft: "20px" }}>
      <div className="flex gc-area" style={{ flexDirection: "column" }}>
        <p>
          Deposit with Visa or Mastercard to receive a{" "}
          <span style={{ color: "var(--green)", fontWeight: "bold" }}>
            40% bonus
          </span>
          . We use paydash to process our deposits. You will be redirected to
          complete your checkout.
        </p>

        <div
          style={{ display: "flex", alignItems: "center", marginTop: "15px" }}
        >
          <div className="paydash-input-group" style={{ width: "100px" }}>
            <div className="icon">$</div>
            <input
              type="number"
              value={paydashAmount}
              onChange={setPaydashAmountCb}
            />
          </div>
          <div style={{ marginLeft: "15px" }}>
            You will get{" "}
            <FontAwesomeIcon icon="coins" className="balanceicon rlicon" />
            {((parseFloat(paydashAmount) || 0) * 1.4).toFixed(2)}
          </div>

          <div
            className="paydash-input-group"
            style={{ width: "260px", marginLeft: "15px" }}
          >
            <div className="icon">@</div>
            <input
              type="text"
              placeholder="Enter your e-mail address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className={"button button--green"}
            style={{ marginLeft: "15px" }}
            onClick={() => {
              socket.emit("paydash:createOrder", {
                amount: paydashAmount * 100,
                email,
              });
            }}
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
}

const Deposit_Menu = (props) => {
  const history = useNavigate();
  const dispatch = useDispatch();

  var [gcSelectedKey, setGcSelectedKey] = useState("");
  var [cryptoSel, setCryptoSel] = useState("");
  var [wallets, setWallets] = useState({});
  //var [currentWallet, setCurrentWallet] = useState({transactions: []});
  var [deposits5, setDeposits5] = useState([]);
  var [giftcardText, setGiftCardText] = useState("");

  var [linkName, setLinkName] = useState("");
  var [paydash, setPaydash] = useState(false);
  const isLoggedIn = useSelector((state) => state.profile.loggedIn);
  var [loading, setLoading] = useState(false);
  var [skinsbackRequesting, setSkinsbackRequesting] = useState(false);

  const currentWallet = useSelector((state) => state.depositmenu.currentWallet);

  useEffect(() => {
    document.title = "RustySaloon | Deposit Menu";

    socket.emit("balance");

    // Get Wallet Addresses
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

    socket.on("giftcards:setNull", (data) => {
      setGiftCardText("");
    });

    socket.on("skinsback:redirectToOrder", (data) => {
      window.location.href = data;
    });

    socket.on("paydash:redirectToOrder", (data) => {
      window.location.href = data;
    });

    return function cleanup() {
      socket.off("cryptocurrencies:walletInfo");
      socket.off("cryptocurrencies:walletUnshiftTransaction");
      socket.off("cryptocurrencies:walletUpdateTransactionStatus");
      socket.off("giftcards:setNull");
      socket.off("skinsback:redirectToOrder");
      socket.off("paydash:redirectToOrder");
    };
  }, []);

  const SkinMethods = {
    RUST: {
      name: "Rust Skins",
      extra: 5,
      logo: "rust_logo.png",
    },
    CSGO: {
      name: "CSGO Skins",
      extra: 30,
      logo: "csgo.png",
    },
    DOTA2: {
      name: "DOTA2 Skins",
      extra: 30,
      logo: "dota2.png",
    },
  };

  const CryptoMethods = {
    BTC: {
      name: "Bitcoin",
      extra: 40,
      logo: "btc_logo.svg",
    },
    ETH: {
      name: "Ethereum",
      extra: 40,
      logo: "eth_logo.svg",
    },
    LTC: {
      name: "Litecoin",
      extra: 40,
      logo: "ltc_logo.svg",
    },
    DOGE: {
      name: "Dogecoin",
      extra: 40,
      logo: "doge_logo.svg",
    },
  };

  const GCMethods = {
    VISA: {
      name: "Visa",
      logo: "visa_logo.svg",
      extra: 35,
    },
    PP: {
      name: "PayPal",
      logo: "pp_logo.svg",
      extra: 35,
    },
    MASTER: {
      name: "MasterCard",
      logo: "master_logo.svg",
      extra: 35,
    },
    GPAY: {
      name: "Google Play",
      logo: "gpay_logo.svg",
      extra: 35,
    },
    PCARD: {
      name: "Paysafecard",
      logo: "pcard_logo.svg",
      extra: 35,
    },
    TLY: {
      name: "Trustly",
      logo: "tly_logo.svg",
      extra: 35,
    },
  };

  const PaydashMethods = {
    CC: {
      name: "Credit Card",
      logo: "credit-card.png",
      extra: 40,
    },
  };

  const GCPrices = {
    5: {
      logo: "/images/deposit/giftcards/amount-5.png",
      link: "https://www.kinguin.net/category/96455/rusty-saloon-5-gift-card",
    },
    10: {
      logo: "/images/deposit/giftcards/amount-10.png",
      link: "https://www.kinguin.net/category/97054/rusty-saloon-10-gift-card",
    },
    25: {
      logo: "/images/deposit/giftcards/amount-25.png",
      link: "https://www.kinguin.net/category/97055/rusty-saloon-25-gift-card",
    },
    50: {
      logo: "/images/deposit/giftcards/amount-50.png",
      link: "https://www.kinguin.net/category/97056/rusty-saloon-50-gift-card",
    },
    100: {
      logo: "/images/deposit/giftcards/amount-100.png",
      link: "https://www.kinguin.net/category/97057/rusty-saloon-100-gift-card",
    },
    250: {
      logo: "/images/deposit/giftcards/amount-250.png",
      link: "https://www.kinguin.net/category/97058/rusty-saloon-250-gift-card",
    },
    500: {
      logo: "/images/deposit/giftcards/amount-500.png",
      link: "https://www.kinguin.net/category/97059/rusty-saloon-500-gift-card",
    },
  };

  function changeMethod(type, short, name) {
    if (name === linkName) return setLinkName("");
    if (short === cryptoSel) return setCryptoSel("");
    if (type === "skins") return (window.location.href = "/deposit");
    if (type === "crypto") {
      setCryptoSel(short);
      setLinkName("");
      setGcSelectedKey("");
      setPaydash(false);
    }
    if (type === "giftcards") {
      setCryptoSel("");
      setLinkName(name);
      setGcSelectedKey("");
      setPaydash(false);
    }
    if (type === "paydash") {
      setCryptoSel("");
      setLinkName("");
      setGcSelectedKey("");
      setPaydash(name);
    }
  }

  function Box({ short, name, logo, extra, type }) {
    return (
      <div
        style={{ minWidth: "140px" }}
        className={classNames({
          box: true,
          "deposit-box-selected":
            cryptoSel === short || linkName === name || paydash === name,
        })}
        data-type={short}
        onClick={() => {
          if (!isLoggedIn)
            return toast.error("You need to be logged in to deposit!");

          if (type === "skins" && short === "RUST")
            return history.push("/deposit");
          if (type === "skins") {
            if (skinsbackRequesting) return;
            setSkinsbackRequesting(true);
            return socket.emit("skinsback:createOrder");
          }

          if (loading) return;
          if (type === "crypto") {
            setLoading(true);
            socket.emit("cryptocurrencies:getWallet", { currency: short });
            setDeposits5([]);
          }
          changeMethod(type, short, name);
        }}
      >
        <img src={"/images/" + logo} alt={short + " Logo"} />
        <div className="line"></div>
        <div className="bottom">
          <div>{name}</div>
          <div>{extra > 0 ? <div>+{extra}%</div> : null}</div>
        </div>
      </div>
    );
  }

  function GCard({ gkey, price, link, image }) {
    return (
      <div
        className="card card-gc"
        onClick={() => {
          //setGcSelectedKey(gkey);
          window.open(link);
          //window.open(link);
        }}
      >
        <img
          src={image}
          alt={price + "USD Gift Card"}
          className={
            "gc-img " + (gkey === gcSelectedKey ? "card-gc-selected" : "")
          }
        />
        {gkey}$ Gift Card
      </div>
    );
  }

  function GCChoose() {
    return (
      <div className="gctrans">
        <div className="gctext">{linkName} Gift Card</div>

        <div className="flex gc-area">
          <div className="gcChoose">
            {Object.keys(GCPrices).map((key, y) => {
              let i = GCPrices[key];
              return (
                <GCard gkey={key} price={key} link={i.link} image={i.logo} />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function updateGCText(e) {
    setGiftCardText(e.target.value);
  }

  return (
    <React.Fragment>
      <DesktopHeader />
      <MobileHeader />
      <Chat />
      <MobileNav />

      <div className="page-content" style={props.styles}>
        <div className="deposit">
          <h2>DEPOSIT METHODS</h2>
          <h4 className="grey">Skin Deposits</h4>
          <div className="boxes">
            {Object.keys(SkinMethods).map((key, x) => {
              let i = SkinMethods[key];
              return (
                <Box
                  short={key}
                  name={i.name}
                  logo={i.logo}
                  extra={i.extra}
                  type="skins"
                />
              );
            })}
          </div>
          <div className="space"></div>
          <h4 className="grey">Crypto Deposits</h4>
          <div className="boxes">
            {Object.keys(CryptoMethods).map((key, x) => {
              let i = CryptoMethods[key];
              return (
                <Box
                  key={"crypto" + key}
                  short={key}
                  name={i.name}
                  logo={i.logo}
                  extra={i.extra}
                  type="crypto"
                  className={classNames({
                    "deposit-box-selected": cryptoSel === key,
                  })}
                />
              );
            })}
          </div>

          {cryptoSel != "" ? (
            <CryptoDetails
              key={cryptoSel}
              currency={cryptoSel}
              currentWallet={currentWallet}
              loading={loading}
            />
          ) : null}
          <h4 className="grey">Giftcard Deposits</h4>
          <div className="gcInput">
            <div className="gcText">Redeem Giftcard</div>
            <div className="gcRedeem">
              <div
                className="txt"
                onClick={() => {
                  socket.emit("giftcards:redeem", { code: giftcardText });
                }}
              >
                Claim
              </div>
            </div>
            <input
              className="gcinput"
              type="text"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              value={giftcardText}
              onChange={updateGCText}
            />
          </div>
          <div className="boxes">
            {Object.keys(GCMethods).map((key, x) => {
              let i = GCMethods[key];
              return (
                <Box
                  short={key}
                  name={i.name}
                  logo={i.logo}
                  extra={i.extra}
                  type="giftcards"
                />
              );
            })}
          </div>
          {linkName != "" ? <GCChoose key={linkName} /> : null}

          {/*
<h4 className="grey">Paydash</h4>
                    <div className="boxes" style={{alignItems: 'center', flexWrap: 'nowrap'}}>
                        {Object.keys(PaydashMethods).map((key, x) => {
                            let i = PaydashMethods[key];
                            return <Box short={key} name={i.name} logo={i.logo} extra={i.extra} type="paydash" />
                        })}
                        {
                           paydash ? <PaydashInput /> : null
                        }
                    </div>
                    */}
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Deposit_Menu;
