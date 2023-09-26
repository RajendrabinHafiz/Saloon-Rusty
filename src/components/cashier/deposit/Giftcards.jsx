import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../../Socket";
import { Range } from "react-range";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from "../../Loader";



const Product = ({ product }) => {
  return (
    <div class="product" onClick={(e) => {
      window.open(product.url)
    }}>
      <div class="product-image">
        <img src={"/images/deposit/giftcards/amount-" + product.price + '.png'} />
      </div>

    </div>
  )
}


export default (props) => {
  const dispatch = useDispatch();

  const products = [
    {
      price: 5,
      url: 'https://www.kinguin.net/category/96455/rusty-saloon-5-gift-card'
    },
    {
      price: 10,
      url: 'https://www.kinguin.net/category/97054/rusty-saloon-10-gift-card'
    },
    {
      price: 25,
      url: 'https://www.kinguin.net/category/97055/rusty-saloon-25-gift-card'
    },
    {
      price: 50,
      url: 'https://www.kinguin.net/category/97056/rusty-saloon-50-gift-card'
    },
    {
      price: 100,
      url: 'https://www.kinguin.net/category/97057/rusty-saloon-100-gift-card'
    },
    {
      price: 250,
      url: 'https://www.kinguin.net/category/97058/rusty-saloon-250-gift-card'
    },
    {
      price: 500,
      url: 'https://www.kinguin.net/category/97059/rusty-saloon-500-gift-card'
    },

  ];

  const paymentProviders = [ 'visa', 'mastercard', 'paypal', 'gpay', 'paysafe', 'trustly' ];

  var [giftcardText, setGiftCardText] = useState("");
  function updateGCText(e) {
    setGiftCardText(e.target.value);
  }


  useEffect(() => {
    socket.emit("balance");
    socket.on("giftcards:setNull", (data) => {
      setGiftCardText("");
    });
    return function cleanup() {
      socket.off("giftcards:setNull");
    }

  }, []);

  return (
    <React.Fragment>
      <div className="popup-giftcards">

        <div class="products-wrap">
          <h3>Gift Cards</h3>

          <div class="small-products">
            {products.slice(0, 4).map(el => <Product product={el} />)}

          </div>

          <div class="big-products">
            {products.slice(4, 7).map(el => <Product product={el} />)}

          </div>

        </div>

        <div class="redeem-wrap">

          <div class="inputwrap">
            <label htmlFor="">Redeem Giftcard</label>
            <input className="gcinput" type="text" placeholder="XXXX-XXXX-XXXX-XXXX" value={giftcardText} onChange={updateGCText} />
          </div>

          <div
            className="button button--green"
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "5px",
            }}
            onClick={() => {
              socket.emit("giftcards:redeem", { code: giftcardText });
            }}
          >
            <b>Claim</b>
          </div>

        </div>

        <div class="payment-providers">
            {paymentProviders.map((el) => <img src={`/images/deposit/giftcards/${el}.svg`} />)}
        </div>

      </div>

    </React.Fragment>
  );

};
