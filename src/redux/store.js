import { configureStore } from "@reduxjs/toolkit";
import { compose, applyMiddleware } from "redux";
import appReducer from "./ducks/app";
import rouletteReducer from "./ducks/roulette";
import chatReducer from "./ducks/chat";
import giveawaysReducer from "./ducks/giveaways";
import profileReducer from "./ducks/profile";
import towersReducer from "./ducks/towers";
// import diceReducer from "./ducks/dice";
import landminesReducer from "./ducks/landmines";
import slotsReducer from "./ducks/slots";
import slotbattlesReducer from "./ducks/slotbattles";
import wofReducer from "./ducks/wof";
// import {wofReducer} from "./reducers/games/wof.reducer";
import inventoryReducer from "./ducks/inventory";
import depositmenuReducer from "./ducks/depositmenu";
import depositpopupReducer from "./ducks/depositpopup";
import withdrawpopupReducer from "./ducks/withdrawpopup";
import leaderboardsReducer from "./ducks/leaderboards";
import pfReducer from "./ducks/pf";
import adminReducer from "./ducks/admin";
import { homeReducer } from "./reducers/home.reducer";
import thunk from "redux-thunk";
import { chatBoxReducer } from "./reducers/chat.reducer";
import { mainReducer } from "./reducers/main.reducer";
import { hiloReducer } from "./reducers/games/hilo.reducer";
import { videopokerReducer } from "./reducers/games/videopoker.reducer";
import { blackjackReducer } from "./reducers/games/blackjack.reducer";
import { diceReducer } from "./reducers/games/dice.reducer";
import { towerReducer } from "./reducers/games/towers.reducer";
import { minesReducer } from "./reducers/games/mines.reducer";
import { kenoReducer } from "./reducers/games/keno.reducer";
import { slideReducer } from "./reducers/games/slide.reducer";
import { plinkoReducer } from "./reducers/games/plinko.reducer";
import { baccaratReducer } from "./reducers/games/baccarat.reducer";

export const store = configureStore(
  {
    reducer: {
      home: homeReducer,
      app: appReducer,
      hilo: hiloReducer,
      blackjack: blackjackReducer,
      main: mainReducer,
      videopoker: videopokerReducer,
      roulette: rouletteReducer,
      chat: chatReducer,
      chatbox: chatBoxReducer,
      giveaways: giveawaysReducer,
      profile: profileReducer,
      towers: towerReducer,
      dice: diceReducer,
      landmines: landminesReducer,
      mines: minesReducer,
      slots: slotsReducer,
      slotbattles: slotbattlesReducer,
      keno: kenoReducer,
      slide: slideReducer,
      // wof: wofReducer,
      plinko: plinkoReducer,
      wof: wofReducer,
      inventory: inventoryReducer,
      depositmenu: depositmenuReducer,
      depositpopup: depositpopupReducer,
      withdrawpopup: withdrawpopupReducer,
      leaderboards: leaderboardsReducer,
      pf: pfReducer,
      admin: adminReducer,
      baccarat: baccaratReducer,
    },
  },
  compose(applyMiddleware(thunk)),
);
