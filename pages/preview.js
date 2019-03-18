import React, { Fragment } from 'react';
import { connect } from 'dva';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ParamPreviewTable from 'components/sapi/ParamPreviewTable';
import withStyles from '@material-ui/core/styles/withStyles';
import {formatDateTime, formatFlag} from 'utils';
import Component from 'components/Component';
import Tabs from "components/Tabs";


const namespace = 'interface';
const styles = {
  root:{
    height: 'calc( 100% - 48px )',
    overflowY: 'auto',
    paddingBottom: 50,
  },
  contentPanel: {
    padding: 16,
  },
  title: {
    display: 'inline-block',
    height: 40,
    lineHeight: '40px',
    fontSize: 14,
    marginRight: 10,
  },
  titleBar: {
    display: 'inline-block',
    marginTop: 3,
    borderLeft: '3px solid #1890ff',
    paddingLeft: 5,
  },
  panelHeader: {
    height: 30,
    fontSize: 18,
  },
};

class Preview extends Component {
  render() {
    const { classes,data:{item} } = this.props;
    const {pathParams,reqHeaders,queryParams}=item;
    const pathColumns = [
      { id: 'key', label: '参数名' },
      { id: 'value', label: '示例' },
      { id: 'description', label: '描述' },
    ];
    const headerColumns = [
      { id: 'key', label: '参数名' },
      { id: 'value', label: '示例' },
      { id: 'require', label: '必选', render: formatFlag },
      { id: 'description', label: '描述' },
    ];
    const queryColumns = [
      { id: 'key', label: '参数名称' },
      { id: 'value', label: '示例' },
      { id: 'require', label: '必选', render: formatFlag },
      { id: 'description', label: '描述' },
    ];
    const PanelHeader = ({ title }) => <Typography className={classes.panelHeader}>
      <span className={classes.titleBar}>{title}</span>
                                       </Typography>;
    return (
      <Fragment>
        <Tabs value='preview'/>
        <div className={classes.root}>
          <div>
            <PanelHeader title={'基本信息'} />
            <div className={classes.contentPanel}>
              <Grid container spacing={8}>
                <Grid item xs={6}>
                  <Typography
                    style={{ minWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'noWrap' }}>
                    <span className={classes.title}>接口名称：</span>
                    {item.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><span className={classes.title}>创&nbsp;建&nbsp;人：</span>basicfu</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><span className={classes.title}>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</span>
                    未完成
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><span className={classes.title}>更新时间：</span>{formatDateTime(item.udate)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><span className={classes.title}>接口路径：</span>{item.path}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <span className={classes.title}>Mock地址：</span>
                    <a
                      style={{ color: '#1890ff', textDecoration: 'none' }}
                      href={'http://xxx.xxx.xxx.xx/projec/1/interface/1/mock'}>http://xxx.xxx.xxx.xx/projec/1/interface/1/mock
                    </a>
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </div>
          {(pathParams&&pathParams.length>0||reqHeaders&&reqHeaders.length>0||queryParams&&queryParams.length>0)&&
            <div>
              <PanelHeader title={'请求参数'} />
              {pathParams&&pathParams.length>0&&<ParamPreviewTable title={'路径参数:'} columns={pathColumns} data={pathParams} />}
              {reqHeaders&&reqHeaders.length>0&&<ParamPreviewTable title={'Headers:'} columns={headerColumns} data={reqHeaders} />}
              {queryParams&&queryParams.length>0&&<ParamPreviewTable title={'Querys:'} columns={queryColumns} data={queryParams} />}
            </div>
          }
          {/*<div>*/}
            {/*<PanelHeader title={'返回数据'} />*/}
          {/*</div>*/}
        </div>
      </Fragment>
    );
  }
}

export default connect(state => ({
  data: state[namespace],
}))(withStyles(styles)(Preview));
