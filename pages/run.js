import React, {Fragment} from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import EnvironmentAutosuggest from 'components/sapi/EnvironmentAutosuggest';
import Button from '@material-ui/core/Button';
import SplitPane from 'react-split-pane';
import Divider from '@material-ui/core/Divider';
import RequestBody from 'components/sapi/RequestBody';
import ResponseBody from 'components/sapi/ResponseBody';
import Tooltip from '@material-ui/core/Tooltip';
import Tabs from 'components/Tabs';
import {connect} from "dva-no-router";
import {getQueryString} from "utils";
import Component from "components/Component";
import InputBase from "@material-ui/core/InputBase";
import Input from "@material-ui/core/Input";
import ArrowRight from "@material-ui/icons/ArrowRight";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import IconButton from "@material-ui/core/IconButton";
import notify from "utils/notify";

const namespace = 'interface';
const projectNamespace = 'project';
const styles = theme => ({
  root: {
    height: 'calc( 100% - 48px )',
  },
  request: {
    padding: '0 8px 8px 8px',
    height: 48,
  },
  pathInput: {
    width: '100%',
    minWidth: 200,
  },
  select: {
    width: '100%',
  },
  buttonGroup: {
    display: 'flex',
  },
  button: {
    margin: '0 2px',
    width: 80,
    padding: '4px 0',
  },
  split: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc( 100% - 48px )',
  },
  paramSplitPane: {
    position: 'inherit!important',
  },
  bodySplitPane: {
    position: 'inherit!important',
    flex: 1,
  },
  grid: {
    flexWrap: 'inherit',
  },
  alertMessage: {
    width: '100%',
    backgroundColor: '#fffee6',
    border: '1px solid #fff07a',
    padding: '4px 8px',
    fontSize: '14px',
    '& a': {
      fontWeight: 'bold',
      color: '#4fb6ff',
      textDecoration: 'none',
    },
  },
  header:{
    padding: '4px 8px',
  },
  headerTitle:{
    display: 'flex',
  },
  arrowButton:{
    width:20,
    height:20,
    padding: 0,
    margin: '5px 0 7px 0',
  },
  name:{
    width: '100%',
    fontSize: 14,
    fontWeight: 500,
    '&:before':{
      border: 'none',
    },
  },
  description:{
    width: '100%',
    margin: '0 0 0 20px',
    fontSize: 12,
    fontWeight: 400,
    '&:before':{
      border: 'none',
    },
  }
});
const methodList = [
  {label: 'GET', value: 'GET'},
  {label: 'POST', value: 'POST'},
  {label: 'PUT', value: 'PUT'},
  {label: 'PATCH', value: 'PATCH'},
  {label: 'DELETE', value: 'DELETE'},
  {label: 'HEAD', value: 'HEAD'},
  {label: 'OPTIONS', value: 'OPTIONS'},
];
const initCrossRequest = (fn) => {
  let startTime = 0;
  const _crossRequest = setInterval(() => {
    startTime += 500;
    if (startTime > 5000) {
      clearInterval(_crossRequest);
    }
    if (window.crossRequest) {
      clearInterval(_crossRequest);
      fn(true);
    } else {
      fn(false);
    }
  }, 500);
  return _crossRequest;
};

class Run extends Component {
  state = {
    hasPlugin: true,
    responseData: {},
    envList: [
      {label: '本地', host: 'http://api-dev.dmka.cn'},
      {label: '开发', host: 'http://api-dev.dmka.cn'},
      {label: '测试', host: 'https://api-test.dmka.cn'},
    ],
    headerArrow: false,
  };

  componentDidMount() {
    this._crossRequestInterval = initCrossRequest((hasPlugin) => {
      this.setState({hasPlugin});
    });
  }

  componentWillUnmount() {
    clearInterval(this._crossRequestInterval);
  }

  handleRun = () => {
    const item = this.props.data.item;
    const {method, host, path,reqBodyType,reqBodyJson}=item;
    const reqData = {};
    reqData.method = method;
    reqData.url = host + path;
    if(reqBodyType==='json'){
      try {
        reqData.data = JSON.parse(reqBodyJson);
      }catch (e) {
        notify.error("JSON格式错误");
      }
    }
    reqData.success = (res) => {
      this.setState({responseData: res.body});
    };
    reqData.error = (res) => {
      this.setState({responseData: res.body});
    };
    window.crossRequest(reqData);
  };

  handleSave = () => {
    const item = this.props.data.item;
    if(item.id){
      this.dispatch({type: `${namespace}/update`, payload: item})
    }else{
      this.dispatch({type: `${namespace}/insert`, payload: item})
    }
  };

  handleChangeValue = (key, value) => {
    const item = {...this.props.data.item};
    item[key] = value;
    this.dispatch({type: `${namespace}/updateState`, payload: {item}})
  };
  render() {
    const {classes,data:{item}} = this.props;
    const { envList, hasPlugin, responseData,headerArrow} = this.state;
    const {name,description,method, host, path} = item;
    return (
      <Fragment>
        <Tabs value="run"/>
        <div className={classes.root}>
          <div className={classes.alertMessage} style={{display: hasPlugin ? 'none' : undefined}}>
            <div>当前的接口请求服务需浏览器安装免费sip-cross跨域请求插件，选择下面任意一种安装方式，安装成功后请刷新浏览器：</div>
            <div>
              <a target="_blank"
                 href="https://chrome.google.com/webstore/detail/sip-cross/lbcdcjdjhlangdpkckoocobhfmnhhehb?hl=en-US">[Google商店获取]</a>
              需翻墙
            </div>
            <div>
              <a target="_blank" href="http://tmp.static.dmka.cn/sip-cross.crx">[手动下载]</a>
              将crx文件拖入到chrome://extensions/中
            </div>
          </div>
          <div className={classes.header}>
            <div className={classes.headerTitle}>
              <IconButton className={classes.arrowButton} onClick={()=>this.setState({headerArrow:!headerArrow})}>
                {headerArrow===true?<ArrowDropDown fontSize="small"/>:<ArrowRight fontSize="small"/>}
              </IconButton>
              <Input
                className={classes.name}
                value={name}
                onChange={e => this.handleChangeValue('name', e.target.value)}
              />
            </div>
            {headerArrow===true&&
              <Input
                placeholder="描述"
                className={classes.description}
                multiline
                value={description}
                onChange={e => this.handleChangeValue('description', e.target.value)}
              />
            }
          </div>
          <div className={classes.request}>
            <Grid className={classes.grid} container spacing={8}>
              <Grid item xs={2}>
                <Select
                  className={classes.select}
                  displayEmpty
                  value={method}
                  onChange={e => this.handleChangeValue('method', e.target.value)}
                >
                  {methodList.map(it => <MenuItem key={it.value} value={it.value}>{it.label}</MenuItem>)}
                </Select>
              </Grid>
              <Grid item xs={8}>
                <EnvironmentAutosuggest
                  onChange={value => this.handleChangeValue('host', value)}
                  value={host}
                  list={envList}
                  placeholder="http://127.0.0.1:80"
                />
              </Grid>
              <Grid item xs={10}>
                <Input
                  className={classes.pathInput}
                  value={path}
                  onChange={e => this.handleChangeValue('path', e.target.value)}
                />
              </Grid>
              <Grid item className={classes.buttonGroup}>
                <Tooltip title={hasPlugin ? '' : '请先安装sip-cross插件'}>
                  <span><Button onClick={this.handleRun} variant="contained" className={classes.button} disabled={!hasPlugin}>发 送</Button></span>
                </Tooltip>
                <Button onClick={this.handleSave} color="primary" variant="contained" className={classes.button}>保 存</Button>
              </Grid>
            </Grid>
          </div>
          <div className={classes.split}>
            <Divider/>
            <SplitPane split="vertical" defaultSize="50%" className={classes.bodySplitPane}>
              <RequestBody
                item={item}
                onChange={this.handleChangeValue}
              />
              <ResponseBody
                responseData={responseData}
              />
            </SplitPane>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(state => ({
  data: state[namespace],
  project: state[projectNamespace],
}))(withStyles(styles)(Run));


//
// const pathColumns = [
//   { id: 'key', label: '参数名' },
//   { id: 'value', label: '值' },
//   { id: 'description', label: '描述' },
// ];
// const headerColumns = [
//   { id: 'key', label: '参数名' },
//   { id: 'value', label: '值' },
//   { id: 'require', label: '必选', render: formatFlag },
//   { id: 'description', label: '描述' },
// ];
// const queryColumns = [
//   { id: 'key', label: '参数名称' },
//   { id: 'value', label: '值' },
//   { id: 'require', label: '必选', render: formatFlag },
//   { id: 'description', label: '描述' },
// ];
// {/* <div> */}
// {/* <SplitPane split="vertical" defaultSize="50%" className={classes.paramSplitPane}> */}
// {/* <PathEditTable value={path1} setValue={setPath} columns={pathColumns} /> */}
// {/* <QueryEditTable value={query} setValue={setQuery} columns={queryColumns} /> */}
// {/* </SplitPane> */}
// {/* </div> */}
// const pathData = [
//   { key: 'id', value: 3, description: '用户ID' },
//   { key: 'name', value: 'xiaoming', description: '姓名' },
// ];
// const headerData = [
//   {
//     key: 'Content-Type', value: 'application/json', require: true, description: '请求头类型',
//   },
//   {
//     key: 'token', value: 'adak231489fadkjfahs', require: false, description: 'token',
//   },
// ];
// const queryData = [
//   {
//     key: 'nickname', value: '小明', require: true, description: '昵称',
//   },
//   {
//     key: 'test', value: '', require: false, description: '',
//   },
// ];
