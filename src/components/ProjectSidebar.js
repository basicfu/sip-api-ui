import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import Folder from '@material-ui/icons/Folder';
import FolderOpen from '@material-ui/icons/FolderOpen';
import ListItem from '@material-ui/core/ListItem';
import classNames from 'classnames';
import Collapse from '@material-ui/core/Collapse';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Router from 'next/router';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import CreateNewFolder from '@material-ui/icons/CreateNewFolderOutlined';
import dialog from 'utils/dialog';
import Input from 'components/Input';
import Component from "components/Component";
import {connect} from "dva-no-router";
import {breadcrumbOpen, getQueryString} from "utils";

const styles = theme => ({
  drawer: {
    width: '100%',
    height: '100%',
    flexShrink: 0,
  },
  drawerPaper: {
    width: '100%',
    position: 'inherit',
  },
  moreOperation: {
    position: 'absolute',
    right: 0,
  },
  listIcon: {
    margin: '0',
    '& svg:hover':{
      color: 'rgba(254, 169, 0, 0.9)'
    }
  },
  listText: {
    padding: '0 6px',
    '& span': {
      color: 'rgba(0, 0, 0, 0.65)',
      fontSize: '0.875rem',
      letterSpacing: '0.02857em',
    },
  },
  listSelected: {
    fontWeight: theme.typography.fontWeightMedium,
    borderRight: '3px solid #1890ff',
    '& span': {
      color: '#1890ff',
    },
    '& svg': {
      color: '#1890ff',
    },
    backgroundColor: '#e6f7ff!important',
  },
  input: {
    width: 'calc( 100% - 106px )',
    margin: '0 10px 0 0',
  },
  operationOption: {
    position: 'absolute',
    right: 0,
    top: 180,
    zIndex: 99999,
    backgroundColor: '#fff'
  },
  operationOptionItem: {
    paddingTop: '5px',
    paddingBottom: '5px',
  },
  operationOptionIcon: {
    marginRight: 0,
  },
  operationOptionText: {
    padding: '0 4px',
    '& span': {
      color: 'rgba(0, 0, 0, 0.65)',
      fontSize: '12px',
      letterSpacing: '0.02857em',
    },
  },
  method: {
    fontSize: '0.7rem',
    width: 28,
    textAlign: 'center',
  },
  methodGET: {
    color: 'rgba(24, 171, 105, 0.9)',
  },
  methodPOST: {
    color: 'rgba(254, 169, 0, 0.9)',
  },
  methodPUT: {
    color: 'rgba(34, 102, 242, 0.9)',
  },
  methodPATCH: {
    color: 'rgba(137, 137, 137, 0.9)',
  },
  methodDELETE: {
    color: 'rgba(236, 85, 86, 0.9)',
  },
  methodHEAD: {
    color: 'rgba(137, 137, 137, 0.9)',
  },
  methodOPTIONS: {
    color: 'rgba(137, 137, 137, 0.9)',
  },
});

const Directory = withStyles(styles)((props) => {
  const {classes, id,rootId, depth, title,breadcrumb, children, handleOptionOpen, option, project,open,handleOpen}=props;
  const [hover, setHover] = React.useState(false);
  const {selected, changeProject, changeCategory} = project;
  const {categoryId, select} = selected;
  const listItemSelected = depth === 0 ? select === `project-${id}` : select === `category-${id}`;
  const style = {paddingLeft: 8 * (2 + 2 * depth)};
  const openChange=(e)=>{
    handleOpen(breadcrumb,!open);
    e.stopPropagation();
  };
  const directoryChange = () => {
    handleOptionOpen({open: false, selectId: categoryId});
    handleOpen(breadcrumb,true);
    // 是项目
    if (depth === 0) {
      changeProject(id);
    } else {
      changeCategory(rootId,id);
    }
  };
  const handleOption = (e) => {
    const rect = e.target.getBoundingClientRect();
    const newOpen = option.selectId === categoryId ? !option.open : true;
    handleOptionOpen({open: newOpen, top: rect.height / 2 + rect.top, selectId: categoryId});
    e.stopPropagation();
  };
  const handleHover = (flag) => {
    const newOption = {...option};
    newOption.open = false;
    document.body.onclick = flag === true ? () => {
    } : () => handleOptionOpen(newOption);
    setHover(flag);
  };
  return (
    <Fragment>
      <ListItem
        selected={listItemSelected}
        className={listItemSelected ? classes.listSelected : undefined}
        onMouseEnter={() => handleHover(true)}
        onMouseLeave={() => handleHover(false)}
        onClick={() => directoryChange()}
        button
        style={style}
      >
        <ListItemIcon onClick={openChange} className={classes.listIcon}>
          {open ? <FolderOpen /> : <Folder/>}
        </ListItemIcon>
        <ListItemText className={classes.listText} primary={title}/>
        <IconButton
          style={{display: hover ? undefined : 'none'}}
          className={classes.moreOperation}
          onClick={handleOption}
        >
          <MoreHoriz/>
        </IconButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Fragment>

  );
});
const Interface = withStyles(styles)((props) => {
  const {classes, id,rootId, depth, title, handleOptionOpen, option, project,method}=props;
  const [hover, setHover] = React.useState(false);
  const {selected, changeInterface} = project;
  const {categoryId, select} = selected;
  const style = {paddingLeft: 8 * (2 + 2 * depth)};
  const handleOption = (e) => {
    const rect = e.target.getBoundingClientRect();
    const newOpen = option.selectId === categoryId ? !option.open : true;
    handleOptionOpen({open: newOpen, top: rect.height / 2 + rect.top, selectId: categoryId});
    e.stopPropagation();
  };
  const handleHover = (e,flag) => {
    const newOption = {...option};
    newOption.open = false;
    document.body.onclick = flag === true ? () => {
    } : () => handleOptionOpen(newOption);
    setHover(flag);
  };
  const interfaceChange = () => {
    handleOptionOpen({open: false, selectId: categoryId});
    changeInterface(rootId,id);
  };
  const formatMethod = (method) => {
    switch (method.toUpperCase()) {
      case 'PATCH':
        return 'PAT';
      case 'DELETE':
        return 'DEL';
      case 'OPTIONS':
        return 'OPT';
      default:
        return method;
    }
  };
  return (
    <ListItem
      selected={select === `interface-${id}`}
      className={select === `interface-${id}` ? classes.listSelected : undefined}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onClick={() => interfaceChange()}
      button
      style={style}
    >
      <span className={classNames(classes.method, classes[`method${method}`])}>{formatMethod(method)}</span>
      <ListItemText className={classes.listText} primary={title}/>
      <IconButton
        style={{display: hover ? undefined : 'none'}}
        className={classes.moreOperation}
        onClick={handleOption}
      >
        <MoreHoriz/>
      </IconButton>
    </ListItem>
  );
});

// eslint-disable-next-line react/prop-types
function renderNavItems({items,handleOpen, depth,breadcrumb, rootId, option, handleOptionOpen, project}) {
  return (
    <List style={{padding: 0}}>
      {items.reduce((children, item) => {
          rootId = depth === 0 ? item.id : rootId;
          let newBreadcrumb=[...(breadcrumb||[])];
          if(depth===0){
            newBreadcrumb=[item.id]
          }else{
            newBreadcrumb.push(item.id)
          }
          const haveChildren = item.children && item.children.length > 0;
          if (depth === 0 || item.type === 'CATEGORY') {
            children.push(
              <Directory
                key={item.id}
                id={item.id}
                depth={depth}
                title={item.name}
                option={option}
                handleOptionOpen={handleOptionOpen}
                project={project}
                open={item.open}
                rootId={rootId}
                breadcrumb={newBreadcrumb}
                handleOpen={handleOpen}
              >
                {haveChildren && renderNavItems({
                  items: item.children,
                  handleOpen,
                  depth: depth + 1,
                  breadcrumb: newBreadcrumb,
                  rootId,
                  option,
                  handleOptionOpen,
                  project
                })}
              </Directory>,
            );
          } else {
            children.push(
              <Interface
                key={item.id}
                id={item.id}
                rootId={rootId}
                interfaceId={item.id}
                depth={depth}
                title={item.name}
                option={option}
                method={item.method}
                breadcrumb={newBreadcrumb}
                handleOptionOpen={handleOptionOpen}
                handleOpen={handleOpen}
                project={project}
              />,
            );
          }
          return children;
        },
        [],
      )}
    </List>
  );
}

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

const OperationOption = withStyles(styles)(({classes, option, handleOptionOpen, createCategory, deleteCategory}) => {
  const {open, top} = option;
  const optionList = [
    {name: '添加分类', icon: <CreateNewFolder/>, onClick: createCategory},
    {
      name: '添加接口', icon: <CreateNewFolder/>, onClick: () => {
        console.log('a')
      }
    },
    {
      name: '修改', icon: <CreateNewFolder/>, onClick: () => {
        console.log('a')
      }
    },
    {
      name: '复制', icon: <CreateNewFolder/>, onClick: () => {
        console.log('a')
      }
    },
    {
      name: '删除', icon: <CreateNewFolder/>, onClick: deleteCategory
    },
  ];
  return (
    <Paper style={{display: !open && 'none', top: `${top - 40}px`}} className={classes.operationOption} elevation={24}>
      <List component="nav">
        {optionList.map((item, index) => {
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
});
const namespace = 'project';
const categoryNamespace = 'category';
const interfaceNamespace = 'interface';

class ProjectSidebar extends Component {
  state = {
    project: {name: '', basePath: '', projectType: 'PRIVATE'},
    category: {name: ''},
    option: {
      open: false,
      top: 0,
      selectId: undefined,
    },
  };

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
    if(projectId){
      this.dispatch({type: `${namespace}/all`});
      this.dispatch({type: `${namespace}/updateState`, payload: {selected: { projectId,categoryId,interfaceId,select}}});
      this.dispatch({type: `${categoryNamespace}/get`, payload: {projectId}});
      this.dispatch({type: `${interfaceNamespace}/list`, payload: {projectId,categoryId}})
    }else{
      this.dispatch({type: `${namespace}/all`, payload: {projectListReady:true}});
    }
  }

  handleDone = () => {
    this.dispatch({type: `${namespace}/insert`, payload: this.state.project})
  };

  handleCategoryDone = () => {
    const {selected: {projectId, categoryId}, category} = this.props.data;
    this.dispatch({type: `${categoryNamespace}/insert`, payload: {...category, pid: categoryId, projectId}})
  };

  handleChange = (id, value) => {
    const project = this.state.project;
    project[id] = value;
    this.setState({project})
  };

  handleCategoryChange = (id, value) => {
    const category = this.state.category;
    category[id] = value;
    this.setState({category})
  };

  handleOptionOpen = ({open, top, selectId}) => {
    const newOpen = open !== undefined ? open : !this.state.option.open;
    this.setState({option: {open: newOpen, top, selectId}})
  };

  createProject = () => {
    this.handleOptionOpen({...this.state.option, open: false});
    dialog.confirm({
      top: 200,
      title: '添加项目',
      content: <NewProject onChange={this.handleChange}/>,
      onOk: this.handleDone,
    });
  };

  createCategory = () => {
    this.handleOptionOpen({...this.state.option, open: false});
    dialog.confirm({
      top: 200,
      title: '添加分类',
      content: <Category onChange={this.handleCategoryChange}/>,
      onOk: this.handleCategoryDone,
    });
  };

  deleteCategory = () => {
    const {projectId} = this.props.data.selected;
    const onOk = () => this.dispatch({type: `${namespace}/delete`, payload: [projectId]});
    this.handleOptionOpen({...this.state.option, open: false});
    dialog.confirm({title: "确定要删除吗？", onOk});
  };

  /**
   * 树是否open修改
   */
  handleOpen = (breadcrumb,open) => {
    const {projectList} = this.props.data;
    breadcrumbOpen(projectList,breadcrumb,0,open);
    this.dispatch({type: `${namespace}/updateState`, payload: {projectList}});
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
    Router.push(`/run?project=${projectId}&interface=${interfaceId}`);
    if (interfaceId !== selected.interfaceId) {
      this.dispatch({type: `${namespace}/updateState`, payload: {selected: {...selected,projectId, interfaceId,select:`interface-${interfaceId}`}}});
      // TODO 获取接口数据详情
      // this.dispatch({type: `${interfaceNamespace}/list`, payload: {projectId,categoryId}})
    }
  };

  render() {
    const {classes, data: {projectList,selected}} = this.props;
    const items=projectList;
    const {option} = this.state;
    return (
      <Fragment>
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
        <OperationOption
          option={option}
          handleOptionOpen={this.handleOptionOpen}
          createCategory={this.createCategory}
          deleteCategory={this.deleteCategory}
        />
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {renderNavItems({
            items,
            handleOpen: this.handleOpen,
            depth: 0,
            option,
            handleOptionOpen: this.handleOptionOpen,
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
}))(withStyles(styles)(ProjectSidebar));
