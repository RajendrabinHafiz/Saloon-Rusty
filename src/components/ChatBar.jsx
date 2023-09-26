import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { turnDropdownOff } from "../utils/before";
import { emojiesPath } from "../utils/emojies";
import { Parser } from "simple-text-parser";

const languages = {
  english: "/images/flags/uk.png",
  russian: "/images/flags/ru.png",
  spanish: "/images/flags/sp.png",
};

const ChatBox = () => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const messageInputRef = useRef(null);
  const dropdownEmojisRef = useRef(null);
  const searchInputEmojisRef = useRef(null);
  const [searchEmojyValue, setSearchEmojyValue] = useState("");
  const [rulesList, setRulesList] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState(false);
  const { lang } = useSelector((state) => state.chatbox);
  const { chatbarHidden, mobile } = useSelector((state) => state.main);

  const [langList, setLangList] = useState(false);
  const [emojisList, setEmojisList] = useState(false);

  const setExpand = (hidden, isMobile = false) => {
    localStorage.setItem("chatHidden", hidden);
    dispatch({
      type: "UPDATE_MAIN_STATE",
      payload: Object.assign(
        {},
        {
          chatbarHidden: hidden,
        },
        isMobile && hidden ? { mobileContent: 0x2 } : {},
      ),
    });
  };

  const setLanguage = (lang) => {
    dispatch({
      type: "UPDATE_CHAT_STATE",
      payload: {
        lang: lang,
      },
    });
  };

  useEffect(() => {
    try {
      let recentEmojisParsed = JSON.parse(localStorage.getItem("recentEmojis")),
        emojiesCollection = [];
      if (recentEmojisParsed && Array.isArray(recentEmojisParsed)) {
        for (let emoji of recentEmojisParsed) {
          if (emoji && emojiesPath.indexOf(emoji) !== -1) {
            emojiesCollection.push(emoji);
          }
        }

        if (emojiesCollection.length) {
          setRecentEmojis(emojiesCollection);
        }
      }
    } catch (e) {
      console.log(`CHATBAR_REFRESH_SET_RECENT_MESSAGE: ${e}`);
    }

    let intId = setInterval(() => {
      if (dropdownRef.current) {
        if (langList && !dropdownRef.current.classList.contains("active")) {
          setLangList(false);
        }
      }
      if (dropdownEmojisRef.current) {
        if (
          emojisList &&
          !dropdownEmojisRef.current.classList.contains("active")
        ) {
          setEmojisList(false);
        }
      }
    }, 16);

    return () => {
      clearInterval(intId);
    };
  }, [langList, emojisList]);

  const MessageContent = ({ message, children }) => {
    let parser = new Parser();

    parser.addRule(/:+[A-Za-z0-9-]+:/g, (emojiPath) => {
      if (emojiPath) {
        for (let i = 0; i < emojiesPath.length; i++) {
          let emojiPathConfirmed = emojiesPath[i];
          let emoji = emojiPath.replace(/:/g, "");
          if (emojiPathConfirmed.indexOf(emoji) !== -1) {
            return `<img src="/images/emojis/${emojiPathConfirmed}" alt="${emoji}" />`;
          }
        }
      }
      return "";
    });

    return (
      <div
        className="msg"
        dangerouslySetInnerHTML={{
          __html: parser.render((message ?? children).trim()),
        }}
      />
    );
  };

  const setEmoji = (emoji) => {
    if (messageInputRef.current) {
      setEmojisList(false);

      messageInputRef.current.value = (
        messageInputRef.current.value ?? ""
      ).trim();
      messageInputRef.current.value += ` :${emoji.split(/\./)[0x0].trim()}: `;

      try {
        let recentEmojisParsed = JSON.parse(
          localStorage.getItem("recentEmojis"),
        );

        if (!recentEmojisParsed) {
          recentEmojisParsed = [];
        }

        if (Array.isArray(recentEmojisParsed)) {
          if (recentEmojisParsed.indexOf(emoji) === -1) {
            recentEmojisParsed.push(emoji);
          }

          localStorage.setItem(
            "recentEmojis",
            JSON.stringify(recentEmojisParsed),
          );
        }
      } catch (e) {
        console.log(`CHATBAR_SET_RECENT_MESSAGE: ${e}`);
      }
    }
  };

  return (
    <div
      id="chat-box"
      className={(mobile ? "mobile " : "") + (!chatbarHidden ? "active" : "")}
    >
      {rulesList ? (
        <div className="rules-box">
          <div className="panel-center">
            <div className="line-title">
              <div className="title">Chat Rules</div>
              <div className="close" onClick={() => setRulesList(false)}>
                <img
                  draggable="false"
                  src="/images/new_form/close.svg"
                  alt=""
                />
              </div>
            </div>
            <div className="rules">
              <div className="description">
                While RustySaloon believes in an open chat, we have a few
                general rules for everyones safety and best interest.
              </div>
              <p>- No spam or harassment of any kind.</p>
              <p>- No continuous spam of game predictions.</p>
              <p>- No promoting other sites or referral codes.</p>
              <p>- Please refer to and use the chat of your region.</p>
            </div>
          </div>
        </div>
      ) : null}
      {!mobile ? (
        <div className="expand" onClick={() => setExpand(!chatbarHidden)}>
          {chatbarHidden ? (
            <img draggable="false" src="/images/arrow-left.svg" alt="" />
          ) : (
            <img draggable="false" src="/images/arrow-right.svg" alt="" />
          )}
        </div>
      ) : null}
      <div className={"language-section" + (mobile ? " mobile" : "")}>
        {mobile ? (
          <div className="back-button" onClick={() => setExpand(true, true)}>
            <img draggable="false" src="/images/chevron-left.svg" alt="" />
          </div>
        ) : null}
        <div
          className="language-section-dropdown-button drop-down-button"
          onClick={() => turnDropdownOff() && setLangList(true)}
        >
          <div className="left">
            <img draggable="false" src={languages[lang]} alt="" />
            <span>{lang} Room</span>
          </div>
          <div className="right">
            <img draggable="false" src="/images/chevron-down.svg" alt="" />
          </div>
        </div>
        <div
          className={"drop-down" + (langList ? " active" : "")}
          ref={dropdownRef}
        >
          {Object.keys(languages).map(
            (language, i) =>
              language !== lang && (
                <div
                  className="drop-down-item"
                  key={i}
                  onClick={() => {
                    setLanguage(language);
                    setLangList(false);
                  }}
                >
                  <img draggable="false" src={languages[language]} alt="" />
                  <span>{language}</span>
                </div>
              ),
          )}
        </div>
      </div>
      <div className="content">
        <div className="fade-flow"></div>
        <div className="messages">
          <div className="message">
            <div className="profile-circle"></div>
            <div className="plt">
              <div className="text-section">
                <div className="role">MOD</div>
                <div className="name">cairbyte72:</div>
                <div className="msg">
                  Lessssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                  go x2
                </div>
              </div>
            </div>
          </div>
          <div className="message">
            <div className="profile-circle"></div>
            <div className="plt">
              <div className="text-section">
                <div className="role">MOD</div>
                <div className="name">cairbyte72:</div>
                <MessageContent>
                  Lessssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                  go x2
                </MessageContent>
              </div>
            </div>
          </div>
          <div className="message">
            <div className="profile-circle"></div>
            <div className="plt">
              <div className="text-section">
                <div className="role">MOD</div>
                <div className="name">cairbyte72:</div>
                <div className="msg">
                  Lessssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                  go x2
                </div>
              </div>
            </div>
          </div>
          <div className="message">
            <div className="profile-circle"></div>
            <div className="plt">
              <div className="text-section">
                <div className="role">MOD</div>
                <div className="name">cairbyte72:</div>
                <MessageContent>
                  Lesssssssssss:stfu:sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                  go x2
                </MessageContent>
              </div>
            </div>
          </div>
          <div className="message">
            <div className="profile-circle"></div>
            <div className="plt">
              <div className="text-section">
                <div className="role">MOD</div>
                <div className="name">cairbyte72:</div>
                <div className="msg">
                  Lesssssssssssssssssssssssssss:dollar:sssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                  go x2
                </div>
              </div>
            </div>
          </div>
          <div className="message">
            <div className="profile-circle"></div>
            <div className="plt">
              <div className="text-section">
                <div className="name">cairbyte72:</div>
                <div className="msg">Lesssssssss go x2</div>
              </div>
            </div>
          </div>
          <div className="message">
            <div className="profile-circle"></div>
            <div className="plt">
              <div className="text-section">
                <div className="name">cairbyte72:</div>
                <MessageContent message="Lesssssssss :hehe:go x2 dddddddddddddd:dollar:" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="controller">
        <div className="input-chat">
          <input
            type="text"
            placeholder="Type message..."
            ref={messageInputRef}
          />
          <img
            draggable="false"
            className="drop-down-button"
            src="/images/new_form/emojy-icon.svg"
            alt=""
            onClick={() =>
              emojiesPath.length === 0
                ? toast.error("There'are no emojis yet")
                : setEmojisList(true)
            }
          />
          <div
            id="emojies-container"
            className={"drop-down" + (emojisList ? " active" : "")}
            ref={dropdownEmojisRef}
          >
            <div className="search-section">
              <div className="input">
                <input
                  type="text"
                  ref={searchInputEmojisRef}
                  placeholder="Search for emojis"
                  onChange={(e) => setSearchEmojyValue(e.target.value)}
                />

                <img
                  src={`/images/new_form/${
                    searchEmojyValue ? "close" : "search"
                  }.svg`}
                  onClick={() => {
                    searchEmojyValue && setSearchEmojyValue("");
                    searchEmojyValue &&
                      searchInputEmojisRef.current &&
                      (searchInputEmojisRef.current.value = "");
                  }}
                  alt=""
                />
              </div>
            </div>
            <div className="emojies-all">
              {!searchEmojyValue && recentEmojis.length ? (
                <div className="form">
                  <div className="label">Frequently Used</div>
                  <div className="container">
                    {recentEmojis.map(
                      (emoji, i) =>
                        i < 4 && (
                          <div
                            className="emoji"
                            key={i}
                            title={emoji.split(/\./)[0]}
                            onClick={() => setEmoji(emoji)}
                          >
                            <img src={"/images/emojis/" + emoji} alt="" />
                          </div>
                        ),
                    )}
                  </div>
                </div>
              ) : null}
              <div className="form">
                <div className="label">All EMOJIS</div>
                <div className="container">
                  {emojiesPath.map(
                    (emoji, i) =>
                      (!searchEmojyValue ||
                        searchEmojyValue.length === 0x0 ||
                        emoji.indexOf(searchEmojyValue) !== -1) && (
                        <div
                          className="emoji"
                          key={i}
                          title={emoji.split(/\./)[0]}
                          onClick={() => setEmoji(emoji)}
                        >
                          <img src={"/images/emojis/" + emoji} alt="" />
                        </div>
                      ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="line">
          <div className="left">
            <div className="dot"></div>
            <span>2,435 Users</span>
          </div>
          <div className="right">
            <div className="button" onClick={() => setRulesList(true)}>
              Chat Rules
            </div>
            <div className="button send">Send</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
