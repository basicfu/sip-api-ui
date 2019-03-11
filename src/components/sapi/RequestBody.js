/* eslint-disable jsx-a11y/no-autofocus */
import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormEditTable from 'components/sapi/FormEditTable';
import PathEditTable from "components/sapi/PathEditTable";
import {formatFlag} from "utils";
import {Controlled as CodeMirror} from "react-codemirror2";
import NoSsr from "@material-ui/core/NoSsr";

const styles = {
  tabs: {
    minHeight: 0,
  },
  tab: {
    minWidth: 90,
    minHeight: 40,
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
  const {reqHeaders,reqBodyType,reqBodyJson}=item;
  const [tabValue, setTabValue] = React.useState(0);
  const formData=[
    { key: 'nickname', value: '小明', require: true, description: '昵称' },
    { key: 'test', value: '', require: false, description: '' },
  ];
  const formColumns=[
    { id: 'key', label: '参数名称' },
    { id: 'type', label: '类型' },
    { id: 'value', label: '值' },
    { id: 'require', label: '必选', render: formatFlag },
    { id: 'description', label: '描述' },
  ];
  const [form, setForm] = React.useState({bulk:false,data:formData});
  return (
    <Fragment>
      <Tabs className={classes.tabs} value={tabValue} indicatorColor="primary" textColor="primary" onChange={(e, v) => setTabValue(v)}>
        {/*<Tab className={classes.tab} label="Path" />*/}
        {/*<Tab className={classes.tab} label="Params" />*/}
        <Tab className={classes.tab} label="Body" />
        <Tab className={classes.tab} label="Header" />
      </Tabs>
      {tabValue === 0 &&
      <Fragment>
        <RadioGroup value={reqBodyType} onChange={(e, v) => onChange('reqBodyType',v)} row className={classes.radioGroup}>
          <FormControlLabel value="json" control={<Radio className={classes.radio}/>} label="json" />
          <FormControlLabel value="form" control={<Radio className={classes.radio}/>} label="form" />
          <FormControlLabel value="binary" control={<Radio className={classes.radio}/>} label="binary" />
          <FormControlLabel value="raw" control={<Radio className={classes.radio}/>} label="raw" />
        </RadioGroup>
        {reqBodyType === 'form' && <FormEditTable value={form} setValue={setForm} columns={formColumns}/>}
        {reqBodyType === 'json' && <NoSsr>
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
        {reqBodyType==='binary'&&<input type="file"/>}
        {reqBodyType==='raw'&&<input />}
      </Fragment>
      }
    </Fragment>
  );
}

export default withStyles(styles)(RequestBody);
