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

const namespace = 'interface';
const styles = {
  title:{
    padding: '4px 16px',
  },
  description:{
    color: '#333',
    fontSize: '14px',
    margin: '8px 6px',
  }
};

class Run extends Component {
  render() {
    const {classes,data}=this.props;
    const {data:{list,page}}=data;
    return (
      <Fragment>
        <Tabs value='interface'/>
        <div className={classes.title}>
          <PanelHeader title='测试接口'/>
          <div className={classes.description}>这里是描述这里是描述这里是描述这里是描述这里是描述</div>
        </div>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>接口名</TableCell>
              <TableCell>接口路径</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item,index)=>{
              return(
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.path}</TableCell>
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
}))(withStyles(styles)(Run));
