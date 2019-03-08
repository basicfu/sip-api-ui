import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import CreateNewFolder from '@material-ui/icons/CreateNewFolderOutlined';
import dialog from 'utils/dialog';
import Input from 'components/Input';
import Component from "components/Component";
import styles from "styles/projectSidebar";
import {connect} from "dva-no-router";

function NewProject({onChange}) {
  return (
    <Fragment>
      <Input onChange={e => onChange('name', e.target.value)} column={{label: '项目名'}}/>
      <Input onChange={e => onChange('basePath', e.target.value)} column={{label: '基础路径'}}/>
    </Fragment>
  );
}

function Category({onChange}) {
  return (
    <Fragment>
      <Input onChange={e => onChange('name', e.target.value)} column={{label: '分类名'}}/>
      <Input onChange={e => onChange('description', e.target.value)} column={{label: '备注'}}/>
    </Fragment>
  );
}

const namespace = 'project';
const categoryNamespace = 'category';
const interfaceNamespace = 'interface';

class OperationOption extends Component {
  state = {
    project: {name: '', basePath: '', projectType: 'PRIVATE'},
  };
  handleOptionOpen = (open,props) => {
    const option=this.props.data.option;
    this.dispatch({type: `${namespace}/updateState`, payload: {option:{...option,...props,open}}});
  };

  handleDone = () => {
    this.dispatch({type: `${namespace}/insert`, payload: this.state.project})
  };


  //
  // handleChange = (id, value) => {
  //   const project = this.state.project;
  //   project[id] = value;
  //   this.setState({project})
  // };
  //
  // handleCategoryChange = (id, value) => {
  //   const category = this.state.category;
  //   category[id] = value;
  //   this.setState({category})
  // };
  //
  // handleOptionOpen = ({open, top, selectId}) => {
  //   const newOpen = open !== undefined ? open : !this.state.option.open;
  //   this.setState({option: {open: newOpen, top, selectId}})
  // };
  //
  // createProject = () => {
  //   this.handleOptionOpen({...this.state.option, open: false});
  //   dialog.confirm({
  //     top: 200,
  //     title: '添加项目',
  //     content: <NewProject onChange={this.handleChange}/>,
  //     onOk: this.handleDone,
  //   });
  // };
  //
  createCategory = () => {
    const category = {name: ''};
    const {projectId,categoryId} = this.props.data.option;
    this.handleOptionOpen(false);
    const onChange=(id,value)=>{
        category[id] = value;
    };
    const onOk = () => {
      this.dispatch({type: `${categoryNamespace}/insert`, payload: {...category, pid: categoryId||0, projectId}})
    };
    dialog.confirm({
      top: 200,
      title: '添加分类',
      content: <Fragment>
        <Input onChange={e => onChange('name', e.target.value)} column={{label: '分类名'}}/>
        <Input onChange={e => onChange('description', e.target.value)} column={{label: '备注'}}/>
      </Fragment>,
      onOk
    });
  };
  //
  // deleteCategory = () => {
  //   const {projectId} = this.props.data.selected;
  //   const onOk = () => this.dispatch({type: `${namespace}/delete`, payload: [projectId]});
  //   this.handleOptionOpen({...this.state.option, open: false});
  //   dialog.confirm({title: "确定要删除吗？", onOk});
  // };

  render() {
    const {classes,data:{option}} = this.props;
    const {open, top,projectId,categoryId,interfaceId,type} = option;
    const optionList = [
      {visible: 'project', name: '添加分类', icon: <CreateNewFolder/>, onClick: this.createCategory},
      {visible: 'project', name: '添加接口', icon: <CreateNewFolder/>, onClick: this.createCategory},
      {visible: 'project', name: '修改', icon: <CreateNewFolder/>, onClick: this.createCategory},
      {visible: 'project', name: '复制', icon: <CreateNewFolder/>, onClick: this.createCategory},
      {visible: 'project', name: '删除', icon: <CreateNewFolder/>, onClick: this.createCategory},

      {visible: 'category', name: '添加分类', icon: <CreateNewFolder/>, onClick: this.createCategory},
      {visible: 'category', name: '添加接口', icon: <CreateNewFolder/>, onClick: this.createCategory},
      {visible: 'category', name: '修改', icon: <CreateNewFolder/>, onClick: this.createCategory},
      {visible: 'category', name: '复制', icon: <CreateNewFolder/>, onClick: this.createCategory},
      {visible: 'category', name: '删除', icon: <CreateNewFolder/>, onClick: this.createCategory},

      {visible: 'interface', name: '修改', icon: <CreateNewFolder/>, onClick: this.createCategory},
      {visible: 'interface', name: '复制', icon: <CreateNewFolder/>, onClick: this.createCategory},
      {visible: 'interface', name: '删除', icon: <CreateNewFolder/>, onClick: this.createCategory},
    ];
    return (
      <Paper style={{display: !open && 'none', top: `${top - 40}px`}} className={classes.operationOption}
             elevation={24}>
        <List component="nav">
          {optionList.filter(item=>item.visible.toUpperCase()===type).map((item, index) => {
            return (
              <ListItem key={index} className={classes.operationOptionItem} button onClick={item.onClick}>
                <ListItemIcon className={classes.operationOptionIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText className={classes.operationOptionText} primary={item.name}/>
              </ListItem>
            )
          })}
        </List>
      </Paper>
    );
  }
}

export default connect(state => ({
  data: state[namespace],
}))(withStyles(styles)(OperationOption));
