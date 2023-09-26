export const wofReducer = (
  state = {
    round: 1,
    beted: null,
    betType: 0x0,
    gameover: false,
    beting: false,
    numberOfbets: 0,
    lastBet: null,
    GAME_TIMER_INTERVAL: 20 * 1000,
    remainingTime: 20 * 1000,
    hash: "Loading",
    counter: 0,
    spinnerActive: false,
    winningColor: false,
    history: [],

    betTotals: {
      red: 0,
      black: 0,
      green: 0,
      yellow: 0,
    },
    projected: {
      red: 0,
      black: 0,
      green: 0,
      yellow: 0,
    },
    players: { red: {}, black: {}, green: {}, yellow: {} },
    lastBets: {
      red: 0,
      green: 0,
      black: 0,
      yellow: 0,
    },
    animation: {
      EL_SIZE: 95,
      SPINNER_VIEW_WIDTH: 450,
      SPINNER_TOTAL_WIDTH: 0,

      R: 0.999,
      S: 0.01,
      tf: 0,
      vi: 0,
      LOGR: 0,

      dist: 0,
      distWithoutWobble: 0,
      offsetIndex: 0,
      offsetX: 1000,

      startTime: 0,
    },
    loaded: false,
    r_connect: false,
    connected: false,
    type: 0x0,
    spinning: false,
    muted: false,
    onAction: {
      onWin: 0x0,
      onLoss: 0x0,
    },
  },
  action,
) => {
  switch (action.type) {
    case "UPDATE_WOF_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
