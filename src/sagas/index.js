import { put, take, call } from 'redux-saga/effects';
import gql from 'graphql-tag';
import { REQ_CURUSER, GET_CURUSER, NO_CURUSER } from '../actions';
import client from '../util/client';

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
      const { data } = yield call(client.query, {
        query: CURUSER,
        fetchPolicy: 'no-cache',
      });
      if (data.curUser && data.curUser.id) {
        yield put({ type: GET_CURUSER, curUser: data.curUser });
      } else {
        yield put({ type: NO_CURUSER });
      }
    } catch (err) {
      yield put({ type: NO_CURUSER });
    }
  }
}
