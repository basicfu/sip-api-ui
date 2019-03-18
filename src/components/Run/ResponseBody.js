/* eslint-disable jsx-a11y/no-autofocus */
import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import {UnControlled as CodeMirror} from 'react-codemirror2';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/material.css';
import JsonFormat from "./JsonFormat";


const styles = theme => ({
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
  radio: {
    // width: 32,
    height: 32,
  },
  toggleContainer: {
    height: 56,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: `${theme.spacing.unit}px 0`,
    background: theme.palette.background.default,
    '& span': {
      textTransform: 'none',
    }
  },
  responseBody:{
    height: 'calc( 100% - 40px )',
  },
  responseHeader:{
    overflow: 'auto',
    padding: '2px 10px 2px 10px',
    height: 'calc( 100% - 40px )',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    '& p':{
      margin: '8px 0',
      color: '#444',
      fontSize: '14px',
    },
    '& label':{
      fontWeight: 'bold'
    }
  },
  pre:{
    color: '#333',
    height: '100%',
    overflowY: 'auto',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    padding: 0,
    margin: 0,
  }
});

function ResponseBody(props) {
  const {classes,responseData:{body,headers}} = props;
  const [tabValue, setTabValue] = React.useState(0);
  const [radioValue, setRadioValue] = React.useState('pretty');
  let isJson=false;
  try{
    JSON.parse(body);
    isJson=true;
  }catch (e) {
    isJson=false;
  }
  if (process.browser) {
    // 引用js
    // require('codemirror/mode/javascript/javascript');
    // require('codemirror/mode/xml/xml');
    // // 引用css
    // const codemirror = require('codemirror/lib/codemirror.css');
    // // 注入
    // const styleNode = document.createElement('style');
    // styleNode.setAttribute('data-prism', 'true');
    // styleNode.textContent = codemirror;
    // document.head.appendChild(styleNode);
  }
  return (
    <Fragment>
      <Tabs className={classes.tabs} value={tabValue} indicatorColor="primary" textColor="primary"
            onChange={(e, v) => setTabValue(v)}>
        <Tab className={classes.tab} label="Body"/>
        <Tab className={classes.tab} label="Header"/>
      </Tabs>
      {tabValue === 0 &&
      <div className={classes.responseBody}>
        {isJson ?
          <JsonFormat data={body}/>
          :
          <pre className={classes.pre}>{body}</pre>
        }
      </div>
      }
      {tabValue === 1 &&
      <div className={classes.responseHeader}>
        {headers&&Object.keys(headers).map((key,index)=>{
          return(<p key={index}><label>{key}: </label>{headers[key]}</p>)
        })}
      </div>
      }
    </Fragment>
  );
}

export default withStyles(styles)(ResponseBody);
