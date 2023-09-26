export const mainReducer = (
  state = {
    account: null,
    mobile: false,
    socketConnected: false,
    sidebarHidden: false,
    loaded: false,
    chatbarHidden: false,
    cuurentSlide: {},
    mobileContent: 0x0,
    overallyLoading: false,
    containerWidth: 0,
    notification: [
      {
        title: "Deposit",
        timestamp: Date.now(),
        message: "You've deposited $40 successfully",
      },
      {
        title: "Withdraw",
        timestamp: Date.now(),
        message: "You've deposited $40 successfully",
      },
      {
        title: "Deposit",
        timestamp: Date.now(),
        message: "You've deposited $40 successfully",
      },
    ],
    dropdownHidden: {
      activities: false,
      chat_lang: false,
    },
  },
  action,
) => {
  switch (action.type) {
    case "UPDATE_MAIN_STATE":
      return Object.assign({}, state, action.payload);
    case "SET_SLIDE":
      return Object.assign({}, state, {
        cuurentSlide: {
          ...state.cuurentSlide,
          ...action.payload,
        },
      });
    case "UPDATE_DROPDOWN_STATE":
      return Object.assign({}, state, {
        dropdownHidden: {
          ...state.dropdownHidden,
          ...action.payload,
        },
      });
    default:
      return state;
  }
};
