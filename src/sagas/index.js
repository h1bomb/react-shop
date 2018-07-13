import { put,take,call } from 'redux-saga/effects';
import { REQ_CURUSER, GET_CURUSER, NO_CURUSER } from '../actions';
import client from "../util/client";
import gql from "graphql-tag";

const CURUSER = gql`
  {
    curUser {
      email
      id
    }
  }
`;

export default function* rootSaga() {
    while (true) {
        yield take(REQ_CURUSER);
        try {
            const {data} = yield call(client.query, {
                query: CURUSER,
                fetchPolicy: "no-cache"
            });
            if(data.curUser && data.curUser.id) {
                console.log(data.curUser)
                yield put({type: GET_CURUSER, curUser: data.curUser});
            } else {
                console.log('no user')
                yield put({type: NO_CURUSER});
            }
        } catch(err) {
            yield put({type: NO_CURUSER});
        }
    }
}
  