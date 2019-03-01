import {deleteProjectCategory, getProjectCategory, insertProjectCategory} from 'api';
import dialog from 'utils/dialog';

const modal = {
  effects: {
    * get({payload}, {call, put, select}) {
      const {success, data} = yield call(getProjectCategory, payload);
      if (success) {
        const projectList = yield select(state => state.project.projectList);
        for (const key in projectList) {
          if (projectList[key].id === payload.projectId) {
            projectList[key].children = data;
            break;
          }
        }
        yield put({type: 'project/updateState', payload: {projectList}});
      }
    },
    * insert({payload}, {call, put}) {
      dialog.close();
      const {success} = yield call(insertProjectCategory, payload);
      if (success) {
        // yield put({type: 'all'});
      }
    },
    * delete({payload}, {call, put}) {
      const {success} = yield call(deleteProjectCategory, payload);
      if (success) {
        // yield put({type: 'all'});
      }
    },
  },
};
export default modal;
