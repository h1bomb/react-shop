import {
    GET_CURUSER,
    NO_CURUSER,
    SET_AUTHSATAE
} from '../actions';


const rootReducer = (state = {
  authState: 0,
  curUser: {}
}, action) => {
  switch (action.type) {
    case SET_AUTHSATAE:
      return {
        ...state,
        authState: 0
      };
    case GET_CURUSER:
      return {
        ...state,
        curUser: action.curUser,
        authState: 1
      };
     case NO_CURUSER:
      return {
        ...state,
        authState: -1,
        curUser: {}
      };
   default:
      return state;
  }
}

export default rootReducer;
