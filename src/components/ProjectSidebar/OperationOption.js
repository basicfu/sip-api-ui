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

const namespace = 'project';
const categoryNamespace = 'category';
const interfaceNamespace = 'interface';

class OperationOption extends Component {
  state = {
    project: {name: '', basePath: '', projectType: 'PRIVATE'},
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

  handleOptionOpen = (open,props) => {
    this.dispatch({type: `${namespace}/updateState`, payload: {option:{...props,open}}});
  };

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
  handleCategory = (operation) => {
    const {projectId, categoryId} = this.props.data.option;
    this.handleOptionOpen(false);
    if(operation==='add'){
      const category = {name: ''};
      const onChange = (id, value) => {
        category[id] = value;
      };
      const onOk = () => {
        this.dispatch({type: `${categoryNamespace}/insert`, payload: {...category, pid: categoryId || 0, projectId}})
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
    }else if(operation==='delete'){
      const onOk = () => this.dispatch({type: `${categoryNamespace}/delete`, payload: [categoryId]});
      dialog.confirm({title: "确定要删除分类吗？", onOk});
    }
  };

  handleProject = (operation) => {
    const item=this.props.data.option.item;
    this.handleOptionOpen(false);
    if(operation==='edit'){
      this.handleOptionOpen(false);
      const onChange=(id,value)=>{
        item[id] = value;
      };
      const onOk = () => {
        this.dispatch({type: `${namespace}/update`, payload: item})
      };
      dialog.confirm({
        top: 200,
        title: '修改项目',
        content: <Fragment>
          <Input defaultValue={item.name} onChange={e => onChange('name', e.target.value)} column={{label: '项目名'}}/>
          <Input defaultValue={item.basePath} onChange={e => onChange('basePath', e.target.value)} column={{label: '基础路径'}}/>
        </Fragment>,
        onOk
      });
    }else if(operation==='delete'){
      const onOk = () => this.dispatch({type: `${namespace}/delete`, payload: [item.id]});
      dialog.confirm({title: "确定要删除项目吗？", onOk});
    }
  };

  handleHover = (flag) => {
    document.body.onclick = flag === true ? () => {
    } : () => this.handleOptionOpen(false);
  };

  render() {
    const {classes, data: {option}} = this.props;
    const {open, top,item} = option;
    const optionList = [
      {visible: 'project', name: '添加分类', icon: <CreateNewFolder/>, onClick: ()=>this.handleCategory('add')},
      // {visible: 'project', name: '添加接口', icon: <CreateNewFolder/>, onClick: ()=>this.handleCategory},
      {visible: 'project', name: '修改项目', icon: <CreateNewFolder/>, onClick: ()=>this.handleProject('edit')},
      // {visible: 'project', name: '复制项目', icon: <CreateNewFolder/>, onClick: ()=>this.handleProject},
      {visible: 'project', name: '删除项目', icon: <CreateNewFolder/>, onClick: ()=>this.handleProject('delete')},

      {visible: 'category', name: '添加分类', icon: <CreateNewFolder/>, onClick: ()=>this.handleCategory('add')},
      // {visible: 'category', name: '添加接口', icon: <CreateNewFolder/>, onClick: ()=>this.handleCategory},
      // {visible: 'category', name: '修改分类', icon: <CreateNewFolder/>, onClick: ()=>this.handleCategory},
      // {visible: 'category', name: '复制分类', icon: <CreateNewFolder/>, onClick: ()=>this.handleCategory},
      {visible: 'category', name: '删除分类', icon: <CreateNewFolder/>, onClick: ()=>this.handleCategory('delete')},

      {visible: 'interface', name: '修改', icon: <CreateNewFolder/>, onClick: ()=>this.handleCategory},
      {visible: 'interface', name: '复制', icon: <CreateNewFolder/>, onClick: ()=>this.handleCategory},
      {visible: 'interface', name: '删除', icon: <CreateNewFolder/>, onClick: ()=>this.handleCategory},
    ];
    return (
      <Paper
        onMouseEnter={() => this.handleHover(true)}
        onMouseLeave={() => this.handleHover(false)}
        style={{display: !open && 'none', top: `${top - 40}px`}}
        className={classes.operationOption}
        elevation={24}>
        <List component="nav">
          {item&&optionList.filter(it => it.visible.toUpperCase() === item.type).map((it, index) => {
            return (
              <ListItem key={index} className={classes.operationOptionItem} button onClick={it.onClick}>
                <ListItemIcon className={classes.operationOptionIcon}>
                  {it.icon}
                </ListItemIcon>
                <ListItemText className={classes.operationOptionText} primary={it.name}/>
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
