import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../Socket";

import { setCaptchaEnabled, setGiveawaysData, setParticipatedData, attend, setWinner, setGiveaway, setDiscordUserTag, setTimers, setPopupActive, setJoinData,setJoinedCount } from "../../redux/ducks/giveaways";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { store } from '../../redux/store';

import FakeCaptcha from "../Captcha";



const classNames = require('classnames');

export default (props) => {

  const dispatch = useDispatch();

  const joinActive = useSelector((state) => state.giveaways.joinActive);
  const joinType = useSelector((state) => state.giveaways.joinType);
  const discordUserTag = useSelector((state) => state.giveaways.discordUserTag);
  const giveaways = useSelector((state) => state.giveaways.giveaways);
  const isLoggedIn = useSelector((state) => state.profile.loggedIn);
  const popupActive = useSelector((state) => state.giveaways.popupActive);
  const participated = useSelector((state) => state.giveaways.participated);
  const captchaEnabled = useSelector((state) => state.giveaways.captchaEnabled);
  const timers = useSelector((state) => state.giveaways.timers);
  const [newGiveaway, setNewGiveaway] = useState(false);

  function getTimerLong(endTime) {
    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;

    var now = new Date();
    var distance = endTime - now;
    
    if (distance < 0) {
      return '00:00:00';
    }

    var hours = Math.floor(distance / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);

    let timerStr = '';
    timerStr += (hours < 10 ? '0' : '') + hours + ':';
    timerStr += (minutes < 10 ? '0' : '') + minutes + ':';
    timerStr += (seconds < 10 ? '0' : '') + seconds;

    return timerStr;
  }

  function refreshTimers() {
    var storeGiveaways = store.getState().giveaways.giveaways;
    if (!storeGiveaways && !storeGiveaways.DAILY) return;
    if (!storeGiveaways.DAILY.endsAt) return;

    let timers = {
      HOURLY: '00:00:00',
      DAILY: '00:00:00',
      WEEKLY: '00:00:00'
    };

    let types = Object.keys(timers);
    for (let i in types) {
      const type = types[i];
      const giveawayEndsAt = new Date(storeGiveaways[type].endsAt * 1000);
      let giveawayEndsAtUTC = new Date(0);
      giveawayEndsAtUTC.setUTCSeconds(giveawayEndsAt.getTime() / 1000);
      timers[type] = getTimerLong(new Date(giveawayEndsAtUTC));
    }

    dispatch(setTimers(timers));
  }

  useEffect(() => {

    socket.on("giveaways:info", (data) => {
      if (!data.giveaways.WEEKLY.createdAt) return window.location.reload();
      dispatch(setGiveawaysData(data.giveaways));
      dispatch(setParticipatedData(data.participated));
    });

    socket.on("giveaways:attend", (data) => {
      dispatch(setJoinData({ active: false, type: data.type}));
      dispatch(attend(data.type));
    });
    socket.on("giveaways:setJoinedCount", (data) => {
      dispatch(setJoinedCount(data));
    });
    socket.on("giveaways:setWinner", (data) => {
      dispatch(setWinner(data));
    });

    socket.on("giveaways:setGiveaway", (data) => {
      setNewGiveaway(true);
      dispatch(setGiveaway(data));
    });

    var popupWindow;
    socket.on("giveaways:authDiscord", (data) => {

      try {
        const w = 800;
        const h = 800;
        var left = (window.screen.width/2)-(w/2);
        var top = (window.screen.height/2)-(h/2);
      popupWindow = window.open('about:blank', '', `width=800,height=800,resizeable,scrollbars,top=${top},left=${left}`);
      popupWindow.document.write(`<script>window.location.href = "${data.redirectUrl}";</script>`);
      } catch(err) {

      }
    });

    socket.on("giveaways:closeDiscordAuthPopup", (data) => {

      try {
        popupWindow.close();
      } catch(err) {

      }
    });

    let timerInterval = setInterval(() => {
      refreshTimers();
    }, 250);

    return function cleanup() {
      clearInterval(timerInterval);
      socket.off("giveaways:info");
      socket.off("giveaways:attend");
      socket.off("giveaways:setJoinedCount");
      socket.off("giveaways:setWinner");
      socket.off("giveaways:setGiveaway");
      socket.off("giveaways:authDiscord");
      socket.off("giveaways:closeDiscordAuthPopup");
    }
    
  }, []);

  return (
    <React.Fragment>
      <div class="giveaways-container">
        <h3 class>CURRENT GIVEAWAYS<FontAwesomeIcon icon="chevron-down" className={ ' ' + (popupActive ? 'giveaways-container-active' : '')} onClick={(e) => {
          dispatch(setPopupActive(!popupActive));
        }}/></h3>


        <div className={"giveaways " + (!popupActive ? 'giveaways-disabled' : '') }>
          {Object.keys(giveaways).map((key) => giveaways[key].createdAt && <div class="giveaway" key={'ga' + giveaways[key].id}>
            <div class="giveaway-title">
              <div class="giveaway-ellipsis-shape"></div>
              <div class="giveaway-time">{key}</div>

            </div>

            <div className={"item-container " + (newGiveaway && giveaways[key].new ? 'new-giveaway' : '')}>
              <div class="item-name">{giveaways[key].item.name}</div>
              <div className={"item-image " + ("giveaway-" + key)}><img src={"https://steamcommunity-a.akamaihd.net/economy/image/" + giveaways[key].item.icon} /></div>
              <div class="item-price"><FontAwesomeIcon icon="coins" className="balanceicon" />{giveaways[key].prize / 100}</div>

              <button
                className={"button button--green button--play " + (!participated[key] ? 'button-active' : '')}
                onClick={() => {
                  if (!isLoggedIn) return global.retoastr("error", "Please login first!")
                  dispatch(setJoinData({ type: key, active: true }));
                  //socket.emit("giveaways:join", { type: key });
                }}
              >
                     <div>Join</div>
              <div><FontAwesomeIcon icon="user" className="color-green" />{giveaways[key].joinedCount}</div>
              </button>
            
            <div className={"timer " + (participated[key] ? 'timer-active' : '')}>
              <div><FontAwesomeIcon icon="clock" className="timer-clock" />{timers[key]}</div>
              <div><FontAwesomeIcon icon="user" className="color-greenx" />{giveaways[key].joinedCount}</div>
              </div>
              

              { giveaways[key].winner &&<div class="giveaway-winner-container">
               <div class="wrap">
               <div class="giveaway-winner">
                  <img class="winner-avatar" src={giveaways[key].winner.avatar} />
                  <img src="/images/giveaways/thug-glasses.png" class="thug-glasses" />
                </div>
                <div class="typewriter">
  <h1>Congratz!</h1>
</div>
               </div>
              </div>}

            </div>


          </div>)}

              
              <div className={ "giveaway-join " + (joinActive ? 'giveaway-join-active' : '') }>
                <div class="wrap">
               <div class="giveaway-join-close" onClick={(e) => { dispatch(setJoinData({ active: false, type: joinType})) }}>
               <FontAwesomeIcon icon="times" />
               </div>
                <div class="giveaway-join-elements">
                <h4>{joinType} GIVEAWAY RULES</h4>


                <div>
                  { joinType == "HOURLY" && !captchaEnabled && <React.Fragment>
                <p>- Have "#rustysaloon" in your username</p>
                <p>- Join our Steam group</p>
                <p>- Make our Steam group favorite</p>
                <p>- Join our Discord group</p>
                </React.Fragment>}
                { joinType !== "HOURLY" && <p>- Win at least <FontAwesomeIcon icon="coins" className="balanceicon" />{joinType == "DAILY" ? '25.00' : '150.00'} {joinType == "DAILY" ? 'past day' : 'past week'}</p> }
               
                {captchaEnabled && <FakeCaptcha
                submit={(captcha) => {

                  socket.emit("giveaways:join", { type: joinType, captcha });
                }}
                key="6LdCXfkdAAAAACLaCEaFZvBRNyau410x0ibgx2l3" 
              />}

                </div>

                <div class="flex justify-content-center w-100 hourly-join">
                  {1 == 2 && <input type="text" value={discordUserTag} onChange={(e) => {
                    dispatch(setDiscordUserTag(e.target.value));
                  }}
                   class="discord-join-input" placeholder="Discord Tag (John#1234)" />}
                <button
                className={"button button--green button--play "}
                onClick={() => {
                  if (joinType == 'HOURLY' && !captchaEnabled) return dispatch(setCaptchaEnabled(true));
                  socket.emit("giveaways:join", { type: joinType, discordUserTag });
                }}
              >Join</button>
                </div>

                </div>
                </div>
              </div>

        </div>
      </div>
    </React.Fragment>
  );
};
