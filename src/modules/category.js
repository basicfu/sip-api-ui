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
    * insert({payload}, {call, put, select}) {
      dialog.close();
      const {success} = yield call(insertProjectCategory, payload);
      if (success) {
        const projectId=yield select(state => state.project.selected.projectId);
        yield put({type: 'get', payload: {projectId}});
      }
    },
    * delete({payload}, {call, put,select}) {
      dialog.close();
      const {success} = yield call(deleteProjectCategory, payload);
      if (success) {
        const projectId=yield select(state => state.project.selected.projectId);
        yield put({type: 'get', payload: {projectId}});
      }
    },
  },
};
export default modal;
