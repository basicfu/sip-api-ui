import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Folder from '@material-ui/icons/Folder';
import FolderOpen from '@material-ui/icons/FolderOpen';
import ListItem from '@material-ui/core/ListItem';
import classNames from 'classnames';
import Collapse from '@material-ui/core/Collapse';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import styles from "styles/projectSidebar";

const Directory = withStyles(styles)((props) => {
  const [hover, setHover] = React.useState(false);
  const {classes, item, depth,breadcrumb, children, operation, project,handleOpen,levelInfo}=props;
  const {selected, changeProject, changeCategory} = project;
  const {id,name,open}=item;
  const {option,handleOptionOpen}=operation;
  const listItemSelected = depth === 0 ? selected.select === `project-${id}` : selected.select === `category-${id}`;
  const style = {paddingLeft: 8 * (2 + 2 * depth)};
  const openChange=(e)=>{
    handleOpen(breadcrumb,!open);
    e.stopPropagation();
  };
  const directoryChange = () => {
    handleOptionOpen(false);
    handleOpen(breadcrumb,true);
    // 是项目
    if (depth === 0) {
      changeProject(id);
    } else {
      changeCategory(breadcrumb[0],id);
    }
  };
  const handleOption = (e) => {
    const rect = e.target.getBoundingClientRect();
    let newOpen;
    if(depth===0){
      newOpen=option.selectId===levelInfo.projectId?!option.open:true;
    }else{
      newOpen=option.selectId===levelInfo.categoryId?!option.open:true;
    }
    handleOptionOpen(newOpen,{top: rect.height / 2 + rect.top,selectId:id, ...levelInfo,item});
    e.stopPropagation();
  };
  const handleHover = (flag) => {
    document.body.onclick = flag === true ? () => {
    } : () => handleOptionOpen(false);
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
        <ListItemText className={classes.listText} primary={name}/>
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
  const [hover, setHover] = React.useState(false);
  const {classes,item, depth, breadcrumb,operation, project,levelInfo}=props;
  const {id,name,method}=item;
  const {option,handleOptionOpen}=operation;
  const {selected, changeInterface} = project;
  const style = {paddingLeft: 8 * (2 + 2 * depth)};
  const handleOption = (e) => {
    const rect = e.target.getBoundingClientRect();
    const newOpen=option.selectId===levelInfo.interfaceId?!option.open:true;
    handleOptionOpen(newOpen,{top: rect.height / 2 + rect.top,selectId:id, ...levelInfo,item});
    e.stopPropagation();
  };
  const handleHover = (flag) => {
    document.body.onclick = flag === true ? () => {
    } : () => handleOptionOpen(false);
    setHover(flag);
  };
  const interfaceChange = () => {
    handleOptionOpen(false);
    changeInterface(breadcrumb[0],id);
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
      selected={selected.select === `interface-${id}`}
      className={selected.select === `interface-${id}` ? classes.listSelected : undefined}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onClick={() => interfaceChange()}
      button
      style={style}
    >
      <span className={classNames(classes.method, classes[`method${method}`])}>{formatMethod(method)}</span>
      <ListItemText className={classes.listText} primary={name}/>
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

export default function ListItems(props) {
  const {items,handleOpen, operation, project}=props;
  const depth=props.depth||0;
  const breadcrumb=props.breadcrumb||[];
  const levelInfo=props.levelInfo||{};
  return (
    <List style={{padding: 0}}>
      {items.reduce((children, item) => {
          const newLevelInfo={...levelInfo};
          let newBreadcrumb=[...breadcrumb];
          if(item.type==='PROJECT'){
            newBreadcrumb=[item.id];
            newLevelInfo.projectId=item.id;
          }else if(item.type==='CATEGORY'){
            newBreadcrumb.push(item.id);
            newLevelInfo.categoryId=item.id;
          }else if(item.type==='INTERFACE'){
            newBreadcrumb.push(item.id);
            newLevelInfo.interfaceId=item.id;
          }
          const haveChildren = item.children && item.children.length > 0;
          if (item.type === 'PROJECT' || item.type === 'CATEGORY') {
            children.push(
              <Directory
                key={item.id}
                item={item}
                depth={depth}
                operation={operation}
                project={project}
                levelInfo={newLevelInfo}
                breadcrumb={newBreadcrumb}
                handleOpen={handleOpen}
              >
                {haveChildren && ListItems({
                  items: item.children,
                  handleOpen,
                  depth: depth + 1,
                  breadcrumb: newBreadcrumb,
                  operation,
                  project,
                  levelInfo: newLevelInfo
                })}
              </Directory>,
            );
          } else {
            children.push(
              <Interface
                key={item.id}
                item={item}
                depth={depth}
                operation={operation}
                project={project}
                levelInfo={newLevelInfo}
                breadcrumb={newBreadcrumb}
                handleOpen={handleOpen}
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
