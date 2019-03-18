import React, {Fragment} from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import EnvironmentAutosuggest from 'components/Run/EnvironmentAutosuggest';
import Button from '@material-ui/core/Button';
import SplitPane from 'react-split-pane';
import Divider from '@material-ui/core/Divider';
import RequestBody from 'components/Run/RequestBody';
import ResponseBody from 'components/Run/ResponseBody';
import Tooltip from '@material-ui/core/Tooltip';
import Tabs from 'components/Tabs';
import {connect} from "dva-no-router";
import Component from "components/Component";
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
    height: 'calc( 100% - 88px )',
  },
  paramSplitPane: {
    position: 'inherit!important',
  },
  bodySplitPane: {
    height: 'calc( 100% - 137px )!important',
    '& .Pane1':{

    },
    '& .Pane2':{
      minWidth: '35%',
      maxWidth: '65%',
    }
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
  header: {
    padding: '4px 8px',
  },
  headerTitle: {
    display: 'flex',
  },
  arrowButton: {
    width: 20,
    height: 20,
    padding: 0,
    margin: '5px 0 7px 0',
  },
  name: {
    width: '100%',
    fontSize: 14,
    fontWeight: 500,
    '&:before': {
      border: 'none',
    },
  },
  description: {
    width: '100%',
    margin: '0 0 0 20px',
    fontSize: 12,
    fontWeight: 400,
    '&:before': {
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
function getDomWidth(text) {
  if (typeof window !== 'undefined') {
    const span = document.createElement('span');
    const result = {};
    result.width = span.offsetWidth;
    result.height = span.offsetHeight;
    span.style.visibility = 'hidden';
    span.style.fontSize = '1rem';
    span.style.fontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
    span.style.display = 'inline-block';
    document.body.appendChild(span);
    if (typeof span.textContent !== 'undefined') {
      span.textContent = text;
    } else {
      span.innerText = text;
    }
    const width = parseFloat(window.getComputedStyle(span).width) - result.width;
    document.body.removeChild(span);
    return width+40;
  }
  return 0;
}
class Run extends Component {
  state = {
    hasPlugin: true,
    responseData: {},
    envList: [
      {label: '本地', host: 'http://api-dev.dmka.cn/ceshide/api'},
      {label: '开发', host: 'http://api-dev.dmka.cn'},
      {label: '测试', host: 'https://api-test.dmka.cn'},
    ],
    headerArrow: false,
    hostStyle:{minWidth:250,maxWidth:250},
  };

  componentDidMount() {
    this._crossRequestInterval = initCrossRequest((hasPlugin) => {
      this.setState({hasPlugin});
    });
  }

  componentWillReceiveProps(nextProps, nextContext){
    const host=nextProps.data.item.host;
    let domWidth=0;
    if(host&&host.length!==0){
      domWidth=getDomWidth(host);
    }
    if(domWidth<250)domWidth=250;
    if(domWidth>400)domWidth=400;
    this.setState({hostStyle:{minWidth:domWidth,maxWidth:domWidth}})
  }

  componentWillUnmount() {
    clearInterval(this._crossRequestInterval);
  }

  handleRun = () => {
    const item = this.props.data.item;
    const {method, host, path, reqBodyType, reqBodyJson, reqBodyForm} = item;
    const reqData = {};
    reqData.method = method;
    reqData.url = host + path;
    if (reqBodyType === 'json') {
      try {
        reqData.data = JSON.parse(reqBodyJson);
      } catch (e) {
        notify.error("JSON格式错误");
      }
    }else if(reqBodyType==='form'){
      console.log(reqBodyForm);
    }
    reqData.success = (res) => {
      this.setState({responseData: res});
    };
    reqData.error = (res) => {
      this.setState({responseData: res});
    };
    window.crossRequest(reqData);
  };

  handleSave = () => {
    const item = this.props.data.item;
    if (item.id) {
      this.dispatch({type: `${namespace}/update`, payload: item})
    } else {
      this.dispatch({type: `${namespace}/insert`, payload: item})
    }
  };

  handleChangeValue = (key, value) => {
    const item = {...this.props.data.item};
    if(key==='path'){
      const indexOf=value.indexOf('?');
      const path=indexOf!==-1?value.substring(0,indexOf):value;
      const query= indexOf!==-1?value.substring(indexOf+1):'';
      const pathParams=[];
      const queryParams=[];
      const pathMap={};
      const queryKey=[];
      const allQueryParams=[...(item.queryParams||[])];
      (item.pathParams||[]).forEach(it=>{
        pathMap[it.key]=it;
      });
      (item.queryParams||[]).forEach(it=>{
        queryKey.push(it.key);
      });
      const reg=/(?<=\{)[\w]{1,}(?=\})/g;
      let match;
      while (match = reg.exec(path)) {
        const pathMapElement = pathMap[match[0]];
        if(pathMapElement){
          pathParams.push({key:match[0],value:pathMapElement.value,description:pathMapElement.description});
          delete pathMap[match[0]];
        }else{
          pathParams.push({key:match[0],value:'',description:''});
        }
      }
      query.split('&').forEach(it=>{
        if(it.length!==0){
          const split = it.split("=");
          const paramKey=split[0]||'';
          const paramValue=split[1]||'';
          const paramIndex=queryKey.indexOf(paramKey);
          if(paramIndex!==-1){
            const queryMapElement=item.queryParams[paramIndex];
            queryParams.push({key:paramKey,value:paramValue,description:queryMapElement.description,enabled:true,required:queryMapElement.required});
            queryKey.splice(paramIndex,1,undefined);
            allQueryParams.splice(paramIndex,1,undefined);
          }else{
            queryParams.push({key:paramKey,value:paramValue,description:'',enabled:true,required:false});
          }
        }
      });
      // 还可以优化：禁用的不再最后排序
      allQueryParams.forEach(it=>{
        if(it&&it.enabled===false){
          queryParams.push(it)
        }
      });
      item[key]=value;
      item.pathParams=pathParams;
      item.queryParams=queryParams;
      this.dispatch({type: `${namespace}/updateState`, payload: {item}});
    }else if(key==='updatePath'){
      // 特殊处理，表格更新path时不要反向更新
      item.path=value.path;
      item.queryParams=value.queryParams;
      this.dispatch({type: `${namespace}/updateState`, payload: {item}});
    }else {
      item[key] = value;
      this.dispatch({type: `${namespace}/updateState`, payload: {item}});
    }
  };

  render() {
    const {classes, data: {item}} = this.props;
    const {envList, hasPlugin, responseData, headerArrow,hostStyle} = this.state;
    const {name, description, method, host, path} = item;
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
              <IconButton className={classes.arrowButton} onClick={() => this.setState({headerArrow: !headerArrow})}>
                {headerArrow === true ? <ArrowDropDown fontSize="small"/> : <ArrowRight fontSize="small"/>}
              </IconButton>
              <Input
                className={classes.name}
                value={name}
                onChange={e => this.handleChangeValue('name', e.target.value)}
              />
            </div>
            {headerArrow === true &&
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
              <Grid item xs={2} style={{minWidth:112,maxWidth:112}}>
                <Select
                  className={classes.select}
                  displayEmpty
                  value={method}
                  onChange={e => this.handleChangeValue('method', e.target.value)}
                >
                  {methodList.map(it => <MenuItem key={it.value} value={it.value}>{it.label}</MenuItem>)}
                </Select>
              </Grid>
              <Grid item xs={6} style={hostStyle}>
                <EnvironmentAutosuggest
                  onChange={value => this.handleChangeValue('host', value)}
                  value={host}
                  list={envList}
                  placeholder="http://127.0.0.1:80"
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  placeholder='/'
                  className={classes.pathInput}
                  value={path}
                  onChange={e => this.handleChangeValue('path', e.target.value)}
                />
              </Grid>
              <Grid item className={classes.buttonGroup}>
                <Tooltip title={hasPlugin ? '' : '请先安装sip-cross插件'}>
                  <span><Button onClick={this.handleRun} variant="contained" className={classes.button}
                                disabled={!hasPlugin}>发 送</Button></span>
                </Tooltip>
                <Button onClick={this.handleSave} color="primary" variant="contained" className={classes.button}>保
                  存</Button>
              </Grid>
            </Grid>
          </div>
          <div className={classes.split}>
            <Divider/>
            <SplitPane split="vertical" defaultSize='50%' primary="second" className={classes.bodySplitPane}>
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
