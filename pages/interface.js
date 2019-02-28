import React, {Fragment} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {connect} from 'dva';
import Component from "components/Component";
import Tabs from "components/Tabs";

const namespace = 'interface';
const styles = {};

class Run extends Component {
  render() {
    return (
      <Fragment>
        <Tabs value='interface'/>
        <div>接口列表</div>
      </Fragment>
    );
  }
}

export default connect(state => ({
  data: state[namespace],
}))(withStyles(styles)(Run));
