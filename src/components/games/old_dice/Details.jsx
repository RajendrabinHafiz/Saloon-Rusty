/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-eval */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import BetAmount from "../../BetAmount";
import Slider from "./Slider";

import {socket} from '../../../Socket';
import { setValue, setBalance, diceResponse, diceSound, setType, setDiceSoundsMuted } from "../../../redux/ducks/dice";
//setWinnings


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Details = props => {

  const dispatch = useDispatch();
  const soundsMuted = useSelector((state) => state.app.soundsMuted);
  const userBalance = useSelector((state) => state.profile.balance);

  const type = useSelector(state => state.dice.type);
  const balance = useSelector(state => state.dice.balance);
  //const winnings = useSelector(state => state.dice.winnings);
  const winningNumber = useSelector(state => state.dice.winningNr);

  const [betInput, setBetInput] = useState(0);
  const [numberInput, setNumberInput] = useState(5000);
  const [winnings, setWinnings] = useState(0);
  const [multInput, setMultInput] = useState(0);
  const [chanceInput, setChanceInput] = useState(0);
  
  function calcMultiplier(betInp) {
    let number = Number(numberInput);
    
    let mult = Number(((10000 / ((type == "over" ? 10000 - number : number))) * 0.95).toFixed(2));
    setMultInput(mult);
    setWinnings( ( (mult * (betInp || betInput)) || 0).toFixed(2));
    setChanceInput(((type == "under" ? number : (10000 - number)) / 100));
  } 

  function calcNumber() {
    let mult = Number(multInput);
    if(type == "under") {
        let number = Math.round(10000 / (mult / 0.95));
        setNumberInput(number);
        setChanceInput((number / 100));
    } else {
        let number = Math.round(10000 - 10000 / (mult / 0.95));
        setNumberInput(number);
        setChanceInput((number / 100));
    }

    dispatch(setValue([numberInput]));
  }
  
  function funcTester() {
    console.log(soundsMuted)
  }
  useEffect(() => {
    document.title = "RustySaloon | Dice";


    dispatch(setDiceSoundsMuted(soundsMuted));

    socket.on("diceResponse", (data) => {
      dispatch(diceResponse(data));
    });

    socket.on("diceSound", (data) => {

      /*
      var audio = new Audio(
        data.type === "winning"
          ? "/audio/dice_win.mp3"
          : "/audio/dice_loose.mp3"
      );
      audio.play();
      */

      //dispatch(diceSound(data));
    })
    
    socket.emit("diceConnect");

    socket.on("diceConnect", (data) => {
        dispatch(setBalance(Number(data.balance).toFixed(2)));
    })

    //numberInput = 5000;
    calcMultiplier();

    return function cleanup() {
      socket.off("diceConnect");
      socket.off("diceSound");
      socket.off("diceResponse");
    };

  }, []);

  useEffect(() => {
    calcMultiplier();
},[type]) // <-- here put the parameter to listen

useEffect(() => {
  dispatch(setDiceSoundsMuted(soundsMuted));
},[soundsMuted]);

  function value(value) {
      if(value == "clear") {
          setBetInput(0);
      } else if(value == "max") {
        setBetInput((balance > 1000 ? 1000 : balance));
      } else {
          if(betInput == "") setBetInput(0);
          setBetInput(Math.round(eval(betInput+value) * 100) / 100);
      }
      calcMultiplier();
      dispatch(setValue([numberInput]));
  }

  return (
    <div className="dice__details">
      <div className="dice__detail-row">
        <div className="dice__label-container">
          <div className="dice__label">Bet Amount</div>
          <BetAmount 
          crashPlease = {false}
            betInput = {betInput} 
            setBetInput = {num => { setBetInput(num); calcMultiplier(num);}} 
            handler={(num) => {calcMultiplier(num); console.log('handled! ' + num)}}
            ref = {null}
            userBalance = {userBalance}
            />
        </div>

        <div className="dice__label-container ">
          <div className="dice__label">Winnings</div>
            <div className={"coin-input-containerx dice__details-winnings " + props.containerClass}>
            <FontAwesomeIcon icon="coins" className="balanceicon" />
              {winnings}
            </div>
        </div>
      </div>

      <div className="dice__detail-row">
        <div className="dice__label-container">
          <div className="dice__label">Roll</div>
          <div class="dice__details-inputs">
          <input
            type="number"
            className=""
            placeholder="0.00"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
          />
          <div class="dice__details-icon" onClick={ () => { dispatch(setType(type == "over" ? 'under' : 'over')) } }>
          <FontAwesomeIcon icon="arrow-up" className={ 'dice__details-roll-arrow ' + (type == "under" ? 'arrow-roll-under': '') } />  
          </div>
          </div>
          
        </div>

        <div className="dice__label-container">
          <div className="dice__label">Multiplier</div>
          <div class="dice__details-inputs">
          <input
            type="number"
            className="input dice__input--multiplier"
            placeholder="0.00"
            value={multInput}
            onChange={(e) => {setMultInput(e.target.value); calcNumber();}}
          />
          <div class="dice__details-icon">X</div>
          </div>
       
        </div>



        <div className="dice__label-container">
          <div className="dice__label">Chance</div>
          <div class="dice__details-inputs">
          <input
            type="number"
            className="input dice__input--chance"
            placeholder="0.00"
            value={chanceInput}
            readonly="readonly"
            onChange={(e) => setChanceInput(e.target.value)}
          />
          <div class="dice__details-icon">%</div>
          </div>
      
        </div>
      </div>

      <div class = "dice__columns-container">
        <div class={winningNumber ? ( (type == 'over' ? (winningNumber > numberInput) : (winningNumber < numberInput)) ? "dice__rolled color-bar--green" : "dice__rolled color-bar--red") : " dice__rolled hidden"} style={{"left": "calc(" + (winningNumber/100).toString() + "% - 50px)"}}> 
          {winningNumber}
        </div>
        <Slider key={ 'r' + type} type = {type} val = {numberInput} handler={num => {setNumberInput(num); calcMultiplier();}} />
      </div>
      <button className="button button--green dice__play-button" onClick={
        () => {
          const bet = betInput;
          const number = numberInput;
          if(Number(bet) > 0) {
              if(number > 0 && number < 10000) {
                  socket.emit("diceStart", {
                      amount: parseFloat(bet) * 100,
                      number: number,
                      type: type,
                  });
              }
          }
        }
      }>Play</button>
    </div>
  );
};

export default Details;
