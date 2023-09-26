import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleChatCollapsed, toggleNavCollapsed } from "../../redux/ducks/app";
import HeaderItem from "../HeaderItem";
import { useNavigate ,useLocation } from 'react-router-dom';
import { setVisible as setDepositVisible } from "../../redux/ducks/depositpopup";
import { setVisible as setWithdrawVisible } from "../../redux/ducks/withdrawpopup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Header = (props) => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const balance = useSelector((state) => state.profile.balance);

  useEffect(() => {}, []);

  return (
    <header className="header header--mobile">
      <HeaderItem>
        <img
          className="button"
          onClick={() => dispatch(toggleNavCollapsed())}
          src={process.env.PUBLIC_URL + "/images/burger.svg"}
          alt=""
        />
      </HeaderItem>

      <HeaderItem>
        <img
          className="button"
          onClick={() => dispatch(toggleChatCollapsed())}
          src={process.env.PUBLIC_URL + "/images/chat.svg"}
          alt=""
        />
      </HeaderItem>

      <HeaderItem className="header__link--logo">
        <Link className="header__link--logo" to="">
          <img src={process.env.PUBLIC_URL + "/images/logo-icon.png"} alt="" />
        </Link>
      </HeaderItem>
      <HeaderItem>
        <div className="coin-container">
          <button className="button button--deposit" id="mobile" onClick={(e) => {  history.push('/deposit-menu'); }}>
            <div>+</div>
          </button>
          <div>
          <FontAwesomeIcon icon="coins" className="balanceicon" />
            {(balance / 100).toFixed(2)}
          </div>
        </div>
      </HeaderItem>
    </header>
  );
};
export default Header;
