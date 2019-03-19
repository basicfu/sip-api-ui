import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Router from 'next/router';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import CreateNewFolder from '@material-ui/icons/CreateNewFolderOutlined';
import Component from "components/Component";
import styles from "styles/projectSidebar";
import {connect} from "dva-no-router";
import {breadcrumbOpen, getQueryString} from "utils";
import ListItems from "components/ProjectSidebar/ListItems";
import OperationOption from "./OperationOption";
import dialog from "utils/dialog";
import Input from "components/Input";

const namespace = 'project';
const categoryNamespace = 'category';
const interfaceNamespace = 'interface';

class Index extends Component {
  componentDidMount() {
    let projectId=getQueryString('project');
    let categoryId=getQueryString('category');
    let interfaceId=getQueryString('interface');
    let select='';
    if(projectId){
      projectId=parseInt(getQueryString('project'),10);
      select=`project-${projectId}`
    }
    if(categoryId){
      categoryId=parseInt(getQueryString('category'),10);
      select=`category-${categoryId}`
    }
    if(interfaceId){
      interfaceId=parseInt(getQueryString('interface'),10);
      select=`interface-${interfaceId}`
    }
    this.dispatch({type: `${namespace}/updateState`, payload: {selected: { projectId,categoryId,interfaceId,select}}});
    this.dispatch({type: `${namespace}/all`});
    if(projectId){
      this.dispatch({type: `${categoryNamespace}/get`, payload: {projectId}});
    }
    if(interfaceId){
      this.dispatch({type: `${interfaceNamespace}/get`, payload: {id:interfaceId}})
    }
  }

  /**
   * 树是否open修改
   */
  handleOpen = (breadcrumb,open) => {
    const {projectList} = this.props.data;
    breadcrumbOpen(projectList,breadcrumb,0,open);
    this.dispatch({type: `${namespace}/updateState`, payload: {projectList}});
  };

  handleOptionOpen = (open,props) => {
    this.dispatch({type: `${namespace}/updateState`, payload: {option:{...props,open}}});
  };

  createProject = () => {
    const project ={name: '', basePath: '', projectType: 'PRIVATE'};
    this.handleOptionOpen(false);
    const onChange=(id,value)=>{
      project[id] = value;
    };
    const onOk = () => {
      this.dispatch({type: `${namespace}/insert`, payload: project})
    };
    dialog.confirm({
      top: 200,
      title: '添加项目',
      content: <Fragment>
        <Input onChange={e => onChange('name', e.target.value)} column={{label: '项目名'}}/>
        <Input onChange={e => onChange('basePath', e.target.value)} column={{label: '基础路径'}}/>
      </Fragment>,
      onOk
    });
  };

  /**
   * 改变项目时，分类置空
   * 如果分类不是undefined，则查询一次接口列表
   */
  changeProject = (projectId) => {
    const {selected} = this.props.data;
    Router.push(`/interface?project=${projectId}`);
    if(selected.categoryId!==undefined||(projectId !== selected.projectId)){
      this.dispatch({type: `${interfaceNamespace}/list`, payload: {projectId}})
    }
    if(projectId !== selected.projectId){
      this.dispatch({type: `${categoryNamespace}/get`, payload: {projectId}});
    }
    this.dispatch({type: `${namespace}/updateState`, payload: {selected: {...selected,projectId,categoryId:undefined,interfaceId:undefined,select:`project-${projectId}`}}});
  };

  /**
   * 如果是跨项目更改分类要同时更改项目
   */
  changeCategory = (projectId,categoryId) => {
    const {selected} = this.props.data;
    Router.push(`/interface?project=${projectId}&category=${categoryId}`);
    if (categoryId !== selected.categoryId||selected.interfaceId!==undefined) {
      this.dispatch({type: `${namespace}/updateState`, payload: {selected: {...selected,projectId, categoryId,interfaceId:undefined,select:`category-${categoryId}`}}});
      this.dispatch({type: `${interfaceNamespace}/list`, payload: {projectId,categoryId}})
    }
  };

  /**
   * 接口改变
   */
  changeInterface = (projectId,interfaceId) => {
    const {selected} = this.props.data;
    let path=window.location.pathname;
    if(['/run','/preview'].indexOf(path)===-1){
      path='/run';
    }
    this.dispatch({type: `${interfaceNamespace}/updateState`, payload: {responseData: {}}});
    Router.push(`${path}?project=${projectId}&interface=${interfaceId}`);
    if (interfaceId !== selected.interfaceId) {
      this.dispatch({type: `${namespace}/updateState`, payload: {selected: {...selected,projectId, interfaceId,select:`interface-${interfaceId}`}}});
      if(path==='/run'||path==='/preview'){
        this.dispatch({type: `${interfaceNamespace}/get`, payload: {id:interfaceId}})
      }
    }
  };

  render() {
    const {classes, data: {projectList,selected,option}} = this.props;
    return (
      <Fragment>
        <OperationOption/>
        <Paper elevation={1}>
          <IconButton>
            <SearchIcon/>
          </IconButton>
          <InputBase type="search" className={classes.input}/>
          <IconButton onClick={() => this.createProject()}>
            <CreateNewFolder/>
          </IconButton>
        </Paper>
        <Divider/>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {ListItems({
            items:projectList,
            handleOpen: this.handleOpen,
            operation:{
              option,
              handleOptionOpen:this.handleOptionOpen
            },
            project: {
              selected,
              changeProject: this.changeProject,
              changeCategory: this.changeCategory,
              changeInterface: this.changeInterface,
            }
          })}
        </Drawer>
      </Fragment>
    );
  }
}

export default connect(state => ({
  data: state[namespace],
}))(withStyles(styles)(Index));
