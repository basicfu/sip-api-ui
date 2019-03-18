/* eslint-disable jsx-a11y/no-autofocus */
import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormEditTable from './FormEditTable';
import {formatFlag} from "utils";
import {Controlled as CodeMirror} from "react-codemirror2";
import NoSsr from "@material-ui/core/NoSsr";
import PathEditTable from "components/Run/PathEditTable";
import QueryEditTable from "components/Run/QueryEditTable";
import HeaderEditTable from "components/Run/HeaderEditTable";

const styles = {
  tabs: {
    minHeight: 0,
  },
  tab: {
    minWidth: 90,
    minHeight: 40,
    textTransform: 'none',
  },
  radioGroup: {
    margin: '4px 0 4px 24px',
  },
  radio:{
    // width: 32,
    height:32,
  },
  codeMirror:{
    height: 'calc( 100% - 80px )',
    margin: '0 0 10px 0',
    '& .CodeMirror':{
      height: '100%',
    }
  },
  binary:{
    margin: '0 0 0 10px',
  }
};
if (process.browser) {
  // 引用js
  require('codemirror/mode/javascript/javascript');
  require('codemirror/mode/xml/xml');
  // 引用css
  const codemirror = require('codemirror/lib/codemirror.css');
  // 注入
  const styleNode = document.createElement('style');
  styleNode.setAttribute('data-prism', 'true');
  styleNode.textContent = codemirror;
  document.head.appendChild(styleNode);
}
function RequestBody(props) {
  const { classes,item,onChange } = props;
  const {path,pathParams,queryParams,reqHeaders,reqBodyType,reqBodyJson,reqBodyForm,reqBodyRaw}=item;
  const [tabValue, setTabValue] = React.useState('params');
  const queryParamsCount=queryParams&&queryParams.length!==0?`  (${queryParams.length})`:'';
  const pathParamsCount=pathParams&&pathParams.length!==0?`  (${pathParams.length})`:'';
  const reqHeadersCount=reqHeaders&&reqHeaders.length!==0?`  (${reqHeaders.length})`:'';
  const title=(name,count)=><div>{name}<label style={{color:'rgb(45,180,120,1)'}}>{count}</label></div>;
  return (
    <Fragment>
      <Tabs className={classes.tabs} value={tabValue} indicatorColor="primary" textColor="primary" onChange={(e, v) => setTabValue(v)}>
        <Tab value='params' className={classes.tab} label={title('Params',queryParamsCount)} />
        <Tab value='path' className={classes.tab} label={title('Path',pathParamsCount)} />
        <Tab value='header' className={classes.tab} label={title('Header',reqHeadersCount)} />
        <Tab value='body' className={classes.tab} label="Body" />
      </Tabs>
      {tabValue === 'body' &&
      <Fragment>
        <RadioGroup value={reqBodyType} row className={classes.radioGroup}>
          <FormControlLabel value="json" control={<Radio className={classes.radio}/>} label="json" onClick={()=>onChange('reqBodyType','json')}/>
          <FormControlLabel value="form" control={<Radio className={classes.radio}/>} label="form"  onClick={()=>onChange('reqBodyType','form')}/>
          <FormControlLabel value="binary" control={<Radio className={classes.radio}/>} label="binary"  onClick={()=>onChange('reqBodyType','binary')}/>
          <FormControlLabel value="raw" control={<Radio className={classes.radio}/>} label="raw"  onClick={()=>onChange('reqBodyType','raw')}/>
        </RadioGroup>
        {reqBodyType === 'form' &&
          <FormEditTable data={reqBodyForm} onChange={onChange}/>
        }
        {reqBodyType==='binary'&&<input className={classes.binary} type="file"/>}
        {reqBodyType === 'json' &&
        <NoSsr>
          <CodeMirror
            className={classes.codeMirror}
            value={reqBodyJson}
            onBeforeChange={(editor, data, value)=>onChange('reqBodyJson',value)}
            options={
              {
                mode: 'javascript',
                lineWrapping: true,
                foldGutter: true,
                // gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                lineNumbers: true,
                matchBrackets: true,
                autofocus: true,
              }
            }
          />
        </NoSsr>
        }
        {reqBodyType==='raw'&&
        <NoSsr>
          <CodeMirror
            className={classes.codeMirror}
            value={reqBodyRaw}
            onBeforeChange={(editor, data, value)=>onChange('reqBodyRaw',value)}
            options={
              {
                // mode: 'xml',
                lineWrapping: true,
                foldGutter: true,
                // gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                lineNumbers: true,
                matchBrackets: true,
                autofocus: true,
              }
            }
          />
        </NoSsr>
        }
      </Fragment>
      }
      {tabValue==='header'&&
        <HeaderEditTable data={reqHeaders} onChange={onChange}/>
      }
      {tabValue==='params'&&
        <QueryEditTable path={path} data={queryParams} onChange={onChange}/>
      }
      {tabValue==='path'&&
        <PathEditTable data={pathParams} onChange={onChange}/>
      }
    </Fragment>
  );
}

export default withStyles(styles)(RequestBody);
