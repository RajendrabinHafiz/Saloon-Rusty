import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../Socket";
import { setCurrentTab, setEntries, setEntry, setTimers, setTopUsers } from "../redux/ducks/leaderboards";

import { store } from '../redux/store';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Loader from "./Loader";

export default (props) => {
  const dispatch = useDispatch();
  const entries = useSelector((state) => state.leaderboards.entries);
  const currentTab = useSelector((state) => state.leaderboards.currentTab);
  const timers = useSelector((state) => state.leaderboards.timers);
  const currentEntry = useSelector((state) => state.leaderboards.entries[state.leaderboards.currentTab]);
  const profileUserId = useSelector((state) => state.profile.id);

  const [loading, setLoading] = useState(true);

  function getRunners() {
    return currentEntry.topUsers ? currentEntry.topUsers.slice(3) : [];
  }

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

    var days = Math.floor(distance / _day);
    var hours = Math.floor( (distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);

    let timerStr = '';
    timerStr += (days < 10 ? '0' : '') + days + ':';
    timerStr += (hours < 10 ? '0' : '') + hours + ':';
    timerStr += (minutes < 10 ? '0' : '') + minutes + ':';
    timerStr += (seconds < 10 ? '0' : '') + seconds;

    return timerStr;
  }

  function refreshTimers() {
    var storeLeaderboardEntries = store.getState().leaderboards.entries;
    if (!storeLeaderboardEntries && !storeLeaderboardEntries.DAILY) return;
    if (!storeLeaderboardEntries.DAILY.endsAt) return;

    let timers = {
      DAILY: '00:24:00:00',
      WEEKLY: '07:00:00:00',
      //MONTHLY: '30:00:00:00'
    };

    let types = Object.keys(timers);
    for (let i in types) {
      const type = types[i];
      const entryEndsAt = new Date(storeLeaderboardEntries[type].endsAt * 1000);
      let entryEndsAtUTC = new Date(0);
      entryEndsAtUTC.setUTCSeconds(entryEndsAt.getTime() / 1000);
      timers[type] = getTimerLong(new Date(entryEndsAtUTC));
    }

    dispatch(setTimers(timers));
  }
  
  useEffect(() => {

    socket.on("leaderboards:info", (data) => {
      if (!data.entries.WEEKLY.createdAt) return window.location.reload();
      dispatch(setEntries(data.entries));
      setLoading(false);
    });

    socket.on("leaderboards:setTopUsers", (data) => {
      socket.emit("leaderboards:sub");
      //dispatch(setTopUsers(data));
    });

    socket.on("leaderboards:setEntry", (data) => {
      dispatch(setEntry(data));
    });


    socket.emit("leaderboards:sub");

    let timerInterval = setInterval(() => {
      refreshTimers();
    }, 250);

    return function cleanup() {
      clearInterval(timerInterval);
      socket.emit("leaderboards:unsub");
      socket.off("leaderboards:info");
      socket.off("leaderboards:setTopUsers");
      socket.off("leaderboards:setEntry");
     
    }
    
  }, []);


  function indexToWinnerPlace(index) {
    switch (index) {
      case 0: return 'first';
      case 1: return 'second';
      case 2: return 'third';
      default: return 'runner';
    }
  }

  return (
    <React.Fragment>
    <div className={'leaderboard bef ' + (loading ? 'blurred': 'noblur') }>
      <h1>Leaderboard</h1>
      <ul class="tabs">
        {Object.keys(entries).map((entryType, index) => <li class={` ${currentTab == entryType && 'tab-active'}`} onClick={(e) => { dispatch(setCurrentTab(entryType)) }}>
          {entryType}
        </li>)}
      </ul>
      <div class="desc">
        <p>Gain tickets by betting on our different gamemodes to compete with others users for rewards!</p>
      </div>
      <div class="entries">
        {[...new Array(3)].map((el, index) => <div class={`entry entry-${index + 1}`} style={{ order: index == 0 ? 2 : (index), backgroundImage: `url("/images/leaderboard/frame-${index + 1}.png")` }}>
          {/* currentEntry.prizes[indexToWinnerPlace(index)] */}
          <div class="prize-area">
            <div class="item-name">{ currentEntry.prizes && currentEntry.prizes[index].itemName}</div>
            <div class="prize-img">
              <img src="/images/leaderboard/prize-bg.png" class="prize-img-frame" />
            <img class="prize-img-act" src={ currentEntry.prizes ? `https://steamcommunity-a.akamaihd.net/economy/image/${currentEntry.prizes[index].itemIcon}` : "https://steamcommunity-a.akamaihd.net/economy/image/6TMcQ7eX6E0EZl2byXi7vaVKyDk_zQLX05x6eLCFM9neAckxGDf7qU2e2gu64OnAeQ7835df4WPEfCk4nReh8DEiv5dYPKs9qLY3SPC7drAdkLs"} />
            </div>
            <div class="prize-amount">
              <FontAwesomeIcon icon="coins" className="balanceicon" />{ (currentEntry.prizes ? (currentEntry.prizes[index].itemPrice / 100) : 0).toFixed(2)}
            </div>
          </div>

          <div class="bottom-area">
            <div class="user-avatar">
              <img src={currentEntry.topUsers && currentEntry.topUsers.length - 1 >= index ? currentEntry.topUsers[index].avatar : "/images/glowcowboy.jpg"} />
            </div>
            <div class="user-name">{currentEntry.topUsers && currentEntry.topUsers.length - 1 >= index ? currentEntry.topUsers[index].username : '~' }</div>
            <div class="user-wagered">
              <FontAwesomeIcon icon="ticket-alt" className="" />{currentEntry.topUsers && currentEntry.topUsers.length - 1 >= index ? (currentEntry.topUsers[index].wageredAmount / 100).toFixed(2) : '0.00' }
            </div>
          </div>

          {index == 0 && <div class="time-remaining">
            <span class="color-red">Time Remaining</span>
            <span>{timers[currentTab]}</span>
          </div>}

        </div>)}
      </div>

      {getRunners().length > 0 && <div class="runners">
        <div class="r-header">
          <span>User</span>
          <span>Tickets</span>
          <span>Prize</span>
        </div>

        {getRunners().map((el, index) => <div class={`entry ${el.id == profileUserId ? 'entry-user' : ''}`}>
          
          <div class="user runner-entry-width">
          <span class="place">{el.place}<sup>th</sup></span>
          <a href={`https://steamcommunity.com/profiles/${el.steamid}`} target="_blank"><img class="avatar" src={el.avatar} /></a>
          <a href={`https://steamcommunity.com/profiles/${el.steamid}`} target="_blank"><div class="name">{el.username}</div></a>
          </div>  
          <div class="wagered"><FontAwesomeIcon icon="ticket-alt" className="" />{(el.wageredAmount / 100).toFixed(2)}</div>  
          <div class="prize runner-entry-width">
          <div class="">
          {currentEntry.prizes.length >= el.place && <React.Fragment>
            <img src={`https://steamcommunity-a.akamaihd.net/economy/image/${currentEntry.prizes[index + 3].itemIcon}`} />
            <div class="item-desc">
              <span class="item-name">{currentEntry.prizes[index + 3].itemName}</span>
              <span class="item-price">
              <FontAwesomeIcon icon="coins" className="balanceicon" />{(currentEntry.prizes[index + 3].itemPrice / 100).toFixed(2)}
              </span>
            </div>
            </React.Fragment>}
          </div>
          </div>
        </div>)}
        

      </div>}

   
    </div>
    {loading && <div class="loaderpos">
          <Loader />
          </div>}
    </React.Fragment>
  );
};
