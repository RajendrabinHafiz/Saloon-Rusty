import React, { createRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChatBar from "./o-ChatBar";
import MeBar from "./MeBar";
import { socket } from "../Socket";
import {
  chat,
  clearUserMessages,
  playersOnline,
  changedLan,
  setTriviaVar,
  completeTrivia,
} from "../redux/ducks/chat";
import { setSoundsMuted, toggleChatCollapsed } from "../redux/ducks/app";

import { userData } from "../redux/ducks/profile";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Giveaways from "./chat/Giveaways";

const chatInput = createRef();

const classNames = require("classnames");

const Chat = (props) => {
  const dispatch = useDispatch();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [rulesVisible, setRulesVisible] = useState(false);
  const giveawaysPopupActive = useSelector(
    (state) => state.giveaways.popupActive,
  );
  const soundsMuted = useSelector((state) => state.app.soundsMuted);
  const chatCollapsed = useSelector((state) => state.app.chatCollapsed);

  const playersOnline = useSelector((state) => state.chat.playersOnline);
  const regionPlayers = useSelector((state) => state.chat.regionPlayers);
  const activeChat = useSelector((state) => state.chat.activeChat);

  const messages = useSelector((state) => state.chat.messages);
  const trivia = useSelector((state) => state.chat.trivia);

  function scrollToBottom() {
    const messages = document.getElementsByClassName("chat__messages");
    messages.scrollTop = messages.scrollHeight;
  }

  function sendMsg() {
    const msg = chatInput.current.value;

    if (msg !== "") {
      socket.emit("sendMessage", { msg: msg });
      chatInput.current.value = null;
    }
  }

  function enterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      sendMsg();
    }
  }

  useEffect(() => {
    socket.on("userData", (data) => {
      dispatch(userData(data));
    });

    socket.on("chat", (data) => {
      dispatch(chat(data));
      scrollToBottom();
    });

    socket.on("chat:clearUserMessages", (data) => {
      dispatch(clearUserMessages(data));
      scrollToBottom();
    });

    socket.on("playersOnline", (data) => {
      dispatch(playersOnline(data));
    });

    socket.on("changedLan", (data) => {
      dispatch(changedLan(data));
    });

    socket.on("trivia:set", (data) => {
      dispatch(setTriviaVar(data));
    });

    socket.on("trivia:complete", (data) => {
      dispatch(completeTrivia(data));
    });

    return function cleanup() {
      socket.off("userData");
      socket.off("chat");
      socket.off("chat:clearUserMessages");
      socket.off("playersOnline");
      socket.off("changedLan");
      socket.off("trivia:set");
      socket.off("trivia:complete");
    };
  }, []);

  return (
    <React.Fragment>
      <div className={"chat " + (!chatCollapsed ? "visible" : "collapsed")}>
        {/* <Giveaways /> */}

        {/*
        <div className="hide-on-mobile">
          <MeBar />
        </div>
        */}

        {trivia.enabled && (
          <div
            className={
              "chat-trivia " +
              (giveawaysPopupActive ? "chat-trivia-with-giveaways" : "")
            }
          >
            <div className="chat-trivia-left">
              <div className="miditem">
                <img src="/images/books.png" />
                <div className="trivia-time">TRIVIA TIME!</div>
              </div>
            </div>
            <div className="chat-trivia-right">
              <div className="chat-trivia-right-top">Q: {trivia.question}</div>

              <div className="chat-trivia-right-bot">
                <div className="ctflexie">
                  <div>Winners | {trivia.winners}</div>
                  <div>Letters | {trivia.answerLetterCount}</div>
                </div>
                <div className="ctprize">
                  Prize |{" "}
                  <FontAwesomeIcon icon="coins" className="balanceicon" />
                  {parseFloat(trivia.prize / 100).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {!trivia.enabled && trivia.completed && (
          <div
            className={
              "chat-trivia " +
              (giveawaysPopupActive ? "chat-trivia-with-giveaways" : "")
            }
          >
            <div className="chat-trivia-left nobr">
              <div className="miditem">
                <img src="/images/confetti.png" />
                <div className="trivia-time">Congratz!</div>
              </div>
            </div>
            <div className="chat-trivia-right">
              <div className="chat-trivia-right-top trivia-congratz ">
                <div>
                  Congratulations to
                  {trivia.$winnersn.map((winner, i) => {
                    return (
                      <React.Fragment>
                        &nbsp;{winner}&nbsp;
                        {i !== trivia.$winnersn.length - 1
                          ? ","
                          : trivia.$winnersn.length > 1
                          ? "&"
                          : ""}
                      </React.Fragment>
                    );
                  })}{" "}
                  for winning the Trivia!
                </div>
              </div>
            </div>
          </div>
        )}

        <ChatBar />

        <div
          className={"chat__messages " + (rulesVisible ? "blurredchat" : "")}
        >
          <div>
            {messages
              ? messages.map((msg) => {
                  return (
                    <Message
                      username={msg.username}
                      avatar={msg.avatar}
                      steamid={msg.steamid}
                      rank={msg.rank}
                      chatId={msg.chatId}
                      timestamp={msg.timestamp}
                      id={msg.id}
                    >
                      {msg.msg}
                    </Message>
                  );
                })
              : ""}
          </div>
        </div>
        <div className="chat__input-container">
          <div className="chat__user-message">
            <input
              className="chat__messages-input"
              type="text"
              placeholder="Type Message..."
              onKeyPress={enterPressed.bind(this)}
              ref={chatInput}
            />
            <img
              className="chat__emoji-icon"
              src={process.env.PUBLIC_URL + `/images/emoji-icon.svg`}
              onClick={(e) => setSettingsVisible(!settingsVisible)}
              alt=""
            />
          </div>

          <div
            className={"chat__settings " + (!settingsVisible ? "hidden" : "")}
          >
            <div
              className="chat__setting"
              onClick={(e) => {
                dispatch(toggleChatCollapsed());
                setSettingsVisible(false);
              }}
            >
              <div className="img-container">
                <img
                  className="img--chat"
                  src={process.env.PUBLIC_URL + `/images/hide-chat.svg`}
                  alt=""
                />
              </div>
              Hide Chat
            </div>
            <div
              className="chat__setting"
              onClick={(e) => {
                setRulesVisible(!rulesVisible);
                setSettingsVisible(false);
              }}
            >
              <div className="img-container">
                <img
                  className="img--rules"
                  src={process.env.PUBLIC_URL + `/images/rules.svg`}
                  alt=""
                />
              </div>
              Chat Rules
            </div>
            <div
              className="chat__setting"
              onClick={(e) => {
                dispatch(setSoundsMuted(!soundsMuted));
                setSettingsVisible(false);
              }}
            >
              <div className="img-container">
                {soundsMuted ? (
                  <FontAwesomeIcon icon="volume-mute" />
                ) : (
                  <img
                    className="img--sound"
                    src={process.env.PUBLIC_URL + `/images/sound.svg`}
                    alt=""
                  />
                )}
              </div>
              {soundsMuted ? "Unmute Sound" : "Mute Sound"}
            </div>
          </div>

          <div className="chat__extras-container">
            <div className="chat__player-count">
              <div className="chat__green-dot"></div>
              <div className="chat__player-count-text">
                {playersOnline} users
              </div>
            </div>
            <div className="flex">
              <div className="chat-rules">Chat Rules</div>
              <div className="send-button">Send</div>
            </div>
          </div>
        </div>
      </div>

      <div className={"modal modal--rules " + (!rulesVisible ? "hidden" : "")}>
        <div className="modal--bg">
          <div className="modal--content">
            <img
              onClick={(e) => setRulesVisible(false)}
              className="modal__close"
              src={process.env.PUBLIC_URL + "/images/x.svg"}
              alt=""
            />
            <h3>Chat Rules</h3>
            <p>
              While RustySaloon believes in an open chat, we have a few general
              rules for everyones safety and best interest.
            </p>
            <p>1. No spam or harassment of any kind. </p>
            <p>2. No continuous spam of game predictions.</p>
            <p>3. No promoting other sites or referral codes.</p>
            <p>4. Please refer to and use the chat of your region.</p>
          </div>
        </div>
      </div>

      <div
        onClick={(e) => dispatch(toggleChatCollapsed())}
        className={classNames({
          "show-chat hide-on-mobile": true,
          "show-chat-vis": chatCollapsed,
          "show-chat-invis": !chatCollapsed,
        })}
      >
        <img
          className="show-chat__icon"
          src={process.env.PUBLIC_URL + "/images/chat.svg"}
        />
      </div>
    </React.Fragment>
  );
};

function rankToTag(rank) {
  switch (rank) {
    case 1:
      return "mod";
    case 9:
      return "owner";
    case "Server":
      return "Server";
    default:
      return "";
  }
}
const Message = (props) => (
  <div className="chat__message">
    <img
      src={
        rankToTag(props.rank) === "Server" ? "/images/cowboy.png" : props.avatar
      }
      className="message__pic profile-pic"
      onClick={() => {
        chatInput.current.value += String(props.id);
      }}
      alt=""
    />
    <div className="message__body">
      <div className="flex">
        {props.rank > 0 && (
          <div className={"levelBox rank" + props.rank}>
            {rankToTag(props.rank)}
          </div>
        )}
        <div
          className="message__name"
          onClick={() =>
            window.open(`https://steamcommunity.com/profiles/${props.steamid}`)
          }
        >
          {rankToTag(props.rank) !== "Server" && props.username}
        </div>
      </div>
      <div className={"message__text m" + rankToTag(props.rank)}>
        {props.children}
      </div>
    </div>
  </div>
);

Message.defaultProps = {
  username: "Name",
  avatar: process.env.PUBLIC_URL + "/images/profile-pic-blank.png",
  children: "Message",
};

export default Chat;
