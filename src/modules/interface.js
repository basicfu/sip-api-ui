import {insertProject, listInterface,} from 'api';
import dialog from 'utils/dialog';

const modal = {
  state: {
    projectList: [],
  },
  effects: {
    * list({ payload }, { call, put }) {
      const data = payload;
      dialog.close();
      yield put({ type: 'updateState', payload: { table: {} } });
      const response = yield call(listInterface, data);
      if (response.success) {
        yield put({ type: 'updateState', payload: { ...response } });
      }
    },
    * insert({ payload }, { call, put }) {
      const { success } = yield call(insertProject, payload);
      if (success) {
        yield put({ type: 'all' });
      }
    },
  },
};
export default modal;
