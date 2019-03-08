import {deleteProjectCategory, getProjectCategory, insertProjectCategory} from 'api';
import dialog from 'utils/dialog';
import {breadcrumb} from "utils";

const modal = {
  effects: {
    * get({payload}, {call, put, select}) {
      const {success, data} = yield call(getProjectCategory, payload);
      if (success) {
        const project = yield select(state => state.project);
        const projectList = project.projectList;
        for (const key in projectList) {
          if (projectList[key].id === payload.projectId) {
            projectList[key].children = data;
            break;
          }
        }
        breadcrumb(projectList, project.selected.select);
        yield put({
          type: 'project/updateState', payload: {projectList}
        });
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
