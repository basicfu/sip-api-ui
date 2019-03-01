import {allProject, deleteProject, insertProject} from 'api';
import dialog from 'utils/dialog';

const modal = {
  state: {
    projectList: [],
  },
  effects: {
    * all(_, {call, put}) {
      dialog.close();
      const response = yield call(allProject);
      if (response.success) {
        yield put({type: 'updateState', payload: {projectList: response.data}});
      }
    },
    * insert({payload}, {call, put}) {
      const {success} = yield call(insertProject, payload);
      if (success) {
        yield put({type: 'all'});
      }
    },
    * delete({payload}, {call, put}) {
      const {success} = yield call(deleteProject, payload);
      if (success) {
        yield put({type: 'all'});
      }
    },
  },
};
export default modal;
