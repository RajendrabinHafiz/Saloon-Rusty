import React, { useState } from "react";
import { useSelector } from "react-redux";

import { socket } from "../Socket";
import { setJoinData } from "../redux/ducks/chat";
import StringTools from "../utils/StringTools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const classNames = require("classnames");

const ChatBar = (props) => {
  return (
    <div className="chat-bar">
      {/* <FontAwesomeIcon icon={["fab", "discord"]} className={classNames({
    'chat-bar-social-icon icon-discord': true,
  })} onClick={() => {
          window.open("https://discord.gg/sYRJaTF");
        }} />


<FontAwesomeIcon icon={["fab", "twitter"]} className={classNames({
    'chat-bar-social-icon icon-twitter': true,
  })} onClick={() => {
          window.open("https://twitter.com/RustySaloon");
        }} />

<FontAwesomeIcon icon={["fab", "steam"]} className={classNames({
    'chat-bar-social-icon icon-steam': true,
  })} onClick={() => {
          window.open("https://steamcommunity.com/groups/RustySaloon");
        }} /> */}

      {/*
      <img
        className="chat-bar-social"
        src={process.env.PUBLIC_URL + "/images/twitter.svg"}
        style={{ "border-radius": "16px" }}
        alt="twit"
        onClick={() => {
          window.open("https://twitter.com/RustySaloon");
        }}
      />
      <img
        className="chat-bar-social"
        src={process.env.PUBLIC_URL + "/images/discord.svg"}
        style={{ "border-radius": "16px" }}
        alt="disc"
        onClick={() => {
          window.open("https://discord.gg/sYRJaTF");
        }}
      />
      */}

      <Langs />
    </div>
  );
};

const Langs = (props) => {
  const [open, setOpen] = useState(false);

  const playersOnline = useSelector((state) => state.chat.playersOnline);
  const regionPlayers = useSelector((state) => state.chat.regionPlayers);
  const activeChat = useSelector((state) => state.chat.activeChat);
  const isLoggedIn = useSelector((state) => state.profile.loggedIn);

  const regions = ["english", "russian", "spanish"];

  /**
   * Changes activeChat
   * @param {*} lang
   */
  function changeLang(lang) {
    socket.emit("switchChat", {
      type: lang,
    });
  }

  return (
    <React.Fragment>
      <div className="chat-langs__active-lang" onClick={(e) => setOpen(!open)}>
        <img
          className="chat-img"
          src={process.env.PUBLIC_URL + `/images/${activeChat}.svg`}
          alt=""
        />
        <div>
          <div>{StringTools.capitalizeFirstLetter(activeChat)} Chat </div>
        </div>
        <div className="right">
          <FontAwesomeIcon icon="caret-down" />
          {/* <div class="chat-red-dot"></div>
          {playersOnline}
          {
            /* {regionPlayers[activeChat]} */}
        </div>
        <div
          className={
            "chat-langs__other-langs " +
            (!open ? "chat-langs__other-lang-hidden" : "")
          }
        >
          {regions.map((region, i) => {
            if (region !== activeChat) {
              return (
                <div
                  className="chat-langs__other-lang"
                  key={i}
                  onClick={() => {
                    if (!isLoggedIn)
                      return global.retoastr("error", "Please login first!");
                    changeLang(region);
                  }}
                >
                  <img
                    className="chat-img"
                    src={process.env.PUBLIC_URL + `/images/${region}.svg`}
                    alt=""
                  />
                  <div>
                    <div>{StringTools.capitalizeFirstLetter(region)} Chat</div>
                  </div>
                  <div>{regionPlayers[region]}</div>
                </div>
              );
            }
            return "";
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ChatBar;
