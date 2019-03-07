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
import {getQueryString} from "utils";

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
  const {classes, id,rootId, depth, title, children, handleOptionOpen, option, project}=props;
  const [open, setOpen] = React.useState(props.open);
  // 暂时找不到优雅的解决方案
  // React.useEffect(() => {
  //   setOpen(props.open);
  // });
  const [hover, setHover] = React.useState(false);
  const {selected, changeProject, changeCategory} = project;
  const {projectId, categoryId, select} = selected;
  const listItemSelected = depth === 0 ? select === `project-${id}` : select === `category-${id}`;
  const style = {paddingLeft: 8 * (2 + 2 * depth)};
  const openChange=(e)=>{
    setOpen(!open);
    e.stopPropagation();
  };
  const directoryChange = () => {
    handleOptionOpen({open: false, selectId: categoryId});
    setOpen(true);
    let asUrl;
    // 是项目
    if (depth === 0) {
      changeProject(id, !open);
      asUrl = `/interface?project=${id}`;
    } else {
      changeCategory(rootId,id);
      asUrl = `/interface?project=${rootId}&category=${id}`;
    };
    Router.push(asUrl);
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
        // classes={{selected:classes.list}}
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
          style={{display: depth === 0 && hover ? undefined : 'none'}}
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
const Interface = withStyles(styles)(({classes, projectId, interfaceId, depth, title, method}) => {
  const [hover, setHover] = React.useState(false);
  const style = {
    paddingLeft: 8 * (2 + 2 * depth),
  };
  const interfaceChange = () => {
    Router.push(`/run?project=${projectId}&interface=${interfaceId}`);
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
      // selected={projectSelectd}
      className={classes.list}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => interfaceChange()}
      button
      style={style}
    >
      <span className={classNames(classes.method, classes[`method${method}`])}>{formatMethod(method)}</span>
      <ListItemText className={classes.listText} primary={title}/>
      <IconButton
        style={{display: depth === 0 && hover ? undefined : 'none'}}
        className={classes.moreOperation}
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHoriz/>
      </IconButton>
    </ListItem>
  );
});

// eslint-disable-next-line react/prop-types
function renderNavItems({items, depth,breadcrumb, rootId, option, handleOptionOpen, project}) {
  // let projectId = 0;
  // if (process.browser && depth === 0) {
  //   const split = Router.asPath.split('/');
  //   if (split.length === 4) {
  //     projectId = parseInt(split[3], 10);
  //   }
  // }
  return (
    <List style={{padding: 0}}>
      {items.reduce((children, item) => {
          rootId = depth === 0 ? item.id : rootId;
          const haveChildren = item.children && item.children.length > 0;
          const open = breadcrumb[depth] === item.id;
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
                open={open}
                rootId={rootId}
              >
                {haveChildren && renderNavItems({
                  items: item.children,
                  depth: depth + 1,
                  breadcrumb,
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
                rootId={rootId}
                interfaceId={item.id}
                depth={depth}
                title={item.name}
                option={option}
                method={item.method}
                handleOptionOpen={handleOptionOpen}
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
    this.dispatch({type: `${namespace}/all`});
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
      this.dispatch({type: `${namespace}/updateState`, payload: {selected: { projectId,categoryId,interfaceId,select}}});
      this.dispatch({type: `${categoryNamespace}/get`, payload: {projectId}});
      this.dispatch({type: `${interfaceNamespace}/list`, payload: {projectId,categoryId}})
    }
  }
  handleDone = () => {
    this.dispatch({type: `${namespace}/insert`, payload: this.state.project})
  };

  handleCategoryDone = () => {
    const {selected: {projectId, categoryId}, category} = this.state;
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
   * 改变项目时，分类置空
   * 如果分类不是undefined，则查询一次接口列表
   */
  changeProject = (projectId) => {
    const {selected} = this.props.data;
    if(selected.categoryId!==undefined){
      this.dispatch({type: `${interfaceNamespace}/list`, payload: {projectId}})
    }
    if(projectId !== selected.projectId){
      this.dispatch({type: `${categoryNamespace}/get`, payload: {projectId}});
    }
    this.dispatch({type: `${namespace}/updateState`, payload: {selected: {...selected,categoryId:undefined, projectId,select:`project-${projectId}`}}});
  };

  /**
   * 如果是跨项目更改分类要同时更改项目
   */
  changeCategory = (projectId,categoryId) => {
    const {selected} = this.props.data;
    if (categoryId !== selected.categoryId) {
      this.dispatch({type: `${namespace}/updateState`, payload: {selected: {...selected,projectId, categoryId,select:`category-${categoryId}`}}});
      this.dispatch({type: `${interfaceNamespace}/list`, payload: {projectId,categoryId}})
    }
  };

  render() {
    const {classes, data: {projectList,projectList1,selected,breadcrumb}} = this.props;
    const items=selected.projectId!==undefined?projectList:projectList1;
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
            depth: 0,
            breadcrumb,
            option,
            handleOptionOpen: this.handleOptionOpen,
            project: {
              selected,
              changeProject: this.changeProject,
              changeCategory: this.changeCategory,
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
