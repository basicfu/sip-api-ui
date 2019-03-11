import {deleteInterface, getInterface, insertInterface, listInterface, updateInterface,} from 'api';
import dialog from 'utils/dialog';

const modal = {
  // 受控组件value赋值为undefined会发生警告，传入空字符串
  state:{
    item: {
      name: 'Untitled Request',
      description: '',
      method: '',
      host: '',
      path: '',
      reqHeaders: [],
      reqBodyType: 'json',
      reqBodyJson: '',
    },
  },
  effects: {
    * get({payload}, {call, put}) {
      const response = yield call(getInterface, payload);
      if (response.success) {
        yield put({type: 'updateState', payload: {item:response.data}});
      }
    },
    * list({payload}, {call, put}) {
      const data = payload;
      dialog.close();
      yield put({type: 'updateState', payload: {table: {}}});
      const response = yield call(listInterface, data);
      if (response.success) {
        yield put({type: 'updateState', payload: {...response}});
      }
    },
    * insert({payload}, {call, put, select}) {
      dialog.close();
      const {success} = yield call(insertInterface, payload);
      if (success) {
        const projectId = yield select(state => state.project.selected.projectId);
        yield put({type: 'category/get', payload: {projectId}});
      }
    },
    * update({payload}, {call, put, select}) {
      dialog.close();
      const {success} = yield call(updateInterface, payload);
      if (success) {
        const projectId = yield select(state => state.project.selected.projectId);
        yield put({type: 'category/get', payload: {projectId}});
      }
    },
    * delete({payload}, {call, put, select}) {
      dialog.close();
      const {success} = yield call(deleteInterface, payload);
      if (success) {
        const projectId = yield select(state => state.project.selected.projectId);
        yield put({type: 'category/get', payload: {projectId}});
      }
    },
  },
};
export default modal;
