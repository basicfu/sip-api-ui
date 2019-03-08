import {allProject, deleteProject, insertProject} from 'api';
import dialog from 'utils/dialog';

const modal = {
  state: {
    projectList: [],
    selected: {
      select: '',
      projectId: undefined,
      categoryId: undefined,
      interfaceId: undefined,
    },
    option: {
      open: false,
      top: 0,
      selectId: undefined,
    },
  },
  effects: {
    * all(_, {call, put,select}) {
      dialog.close();
      const response = yield call(allProject);
      if (response.success) {
        const projectList = yield select(state => state.project.projectList);
        const projectJson = {};
        projectList.forEach(item=>{
          projectJson[item.id]=item;
        });
        response.data.forEach(item=>{
            const obj=projectJson[item.id]||{};
            item.type='PROJECT';
            item.children=obj.children;
            item.open=obj.open;
        });
        console.log(response.data);
        // 每次需要平滑load，如果id一致，不改变children
        yield put({type: 'updateState', payload: {projectList:response.data}});
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
