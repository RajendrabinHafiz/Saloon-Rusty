export const crashReducer = (
  state = {
    currentActivities: 0x0,
    activities: {
      latest_drops: [],
      high_rollers: [],
      Luckywins: [],
    },
  },
  action,
) => {
  switch (action.type) {
    case "UPDATE_HOME_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
