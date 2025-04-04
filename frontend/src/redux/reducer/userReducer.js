import {
  FETCH_USER_LOGIN_SUCCESS,
  FETCH_USER_LOGOUT,
} from "../action/userAction";
const INITIAL_STATE = {
  account: {
    access_token: "",
    refresh_token: "",
    username: "",
    image: "",
    role: "",
  },
  isAuthenticated: false,
};
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_LOGIN_SUCCESS:
      console.log("check data>>>>>", action);
      return {
        ...state,
        account: {
          access_token: action?.payload?.DT?.access_token,
          refresh_token: action?.payload?.DT?.refresh_token,
          username: action?.payload?.DT?.username,
          image: action?.payload?.DT?.image,
          role: action?.payload?.DT?.admin,
        },
        isAuthenticated: true,
      };
    case FETCH_USER_LOGOUT:
      console.log("check data>>>>>", action);
      return {
        ...state,
        account: {
          access_token: "",
          refresh_token: "",
          username: "",
          image: "",
          role: "",
        },
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default userReducer;
