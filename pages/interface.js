import React, {Fragment} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {connect} from 'dva';
import Component from "components/Component";
import Tabs from "components/Tabs";
import PanelHeader from "components/PanelHeader";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Router from 'next/router';
import ListItem from "@material-ui/core/ListItem";
import classNames from 'classnames';
import {breadcrumb} from "utils";

const namespace = 'interface';
const projectNamespace = 'project';
const styles = {
  title:{
    padding: '4px 16px',
  },
  description:{
    color: '#333',
    fontSize: '14px',
    margin: '8px 6px',
  },
  table:{
    tableLayout: 'fixed',
  },
  name:{
    color: '#2395f1',
    cursor: 'pointer'
  },
  path:{
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  method: {
    fontSize: '0.7rem',
    width: 34,
    display: 'inline-block',
    textAlign: 'center',
    marginRight: 4,
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
};

class Run extends Component {
  onRouter=({projectId,id})=>{
    const {project}=this.props;
    const projectList=project.projectList;
    const selected={...project.selected,projectId, interfaceId:id,select:`interface-${id}`};
    breadcrumb(projectList, `interface-${id}`);
    this.dispatch({type: `${projectNamespace}/updateState`, payload: {selected,projectList }});
    this.dispatch({type: `${namespace}/get`, payload: {id}});
    Router.push(`/run?project=${projectId}&interface=${id}`);
  };
  render() {
    const {classes,data}=this.props;
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
      <Fragment>
        <Tabs value='interface'/>
        <div className={classes.title}>
          <PanelHeader title='测试接口'/>
          <div className={classes.description}></div>
        </div>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{width:'25%'}}>接口名</TableCell>
              <TableCell style={{width:'75%'}}>接口路径</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.all.map((item,index)=>{
              return(
                <TableRow key={index}>
                  <TableCell className={classes.name} onClick={()=>this.onRouter(item)}>{item.name}</TableCell>
                  <TableCell className={classes.path}>
                    <span className={classNames(classes.method, classes[`method${item.method}`])}>{formatMethod(item.method)}</span>
                    {item.path}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Fragment>
    );
  }
}

export default connect(state => ({
  data: state[namespace],
  project: state[projectNamespace],
}))(withStyles(styles)(Run));
