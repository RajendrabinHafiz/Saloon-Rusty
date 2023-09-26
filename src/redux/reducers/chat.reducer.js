export const chatBoxReducer = (
  state = {
    active: true,
    lang: "english",
  },
  action,
) => {
  switch (action.type) {
    case "UPDATE_CHAT_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
