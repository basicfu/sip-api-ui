import {allProject, deleteProject, insertProject} from 'api';
import dialog from 'utils/dialog';

const modal = {
  state: {
    projectList: [],
    projectList1: [],
    breadcrumb: [],
    selected: {
      select: '',
      projectId: undefined,
      categoryId: undefined,
      interfaceId: undefined,
    },
  },
  effects: {
    * all(_, {call, put}) {
      dialog.close();
      const response = yield call(allProject);
      if (response.success) {
        const projectList=[];
        response.data.map(item=>{
          projectList.push({...item,type:'PROJECT'})
        });
        yield put({type: 'updateState', payload: {projectList,projectList1:projectList}});
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
