/* eslint-disable */
import {
  login,
  logout,
  listUser,
  insertUser,
  updateUser,
  deleteUser,
} from 'api';
import Router from 'next/router';
import dialog from "utils/dialog";

const modal = {
  effects: {
    * login({ payload }, { call, put }) {
      //防止登录时是其他code
      window.localStorage.removeItem('appCode');
      const { success, data } = yield call(login, payload);
      if (success) {
        window.localStorage.setItem('auth', JSON.stringify(data));
        yield put({ type: 'global/user' });
        yield put({ type: 'global/updateState', payload: { auth: data } });
        // noinspection JSUnresolvedFunction
        Router.push('/');
      }
    },
    * logout(_, { call, put }) {
      const { success } = yield call(logout);
      if (success) {
        window.localStorage.removeItem('auth');
        window.localStorage.removeItem('appCode');
        // noinspection JSUnresolvedFunction
        Router.push('/login');
      }
    },
  },
};
export default modal;
