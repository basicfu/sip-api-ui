/* eslint-disable jsx-a11y/no-autofocus */
import React, {Fragment, useContext, useEffect} from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import {withStyles} from '@material-ui/core';
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import CloudUploadOutlined from "@material-ui/icons/CloudUploadOutlined";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

const styles = {
  table: {
    font: '400 11px system-ui',
    tableLayout: 'fixed'
  },
  scrollbar: {
    overflowY: 'auto',
    overflowX: 'hidden',
    height: 'calc( 100% - 40px )'
  },
  bulk: {
    height: 'calc( 100% - 40px )'
  },
  textarea: {
    minWidth: '100%',
    maxWidth: '100%',
    outline: 'none',
    border: '1px solid #ddd',
    minHeight: '200px',
    height: 'calc( 100% - 32px )',
    resize: 'none',
  },
  headerRow: {
    height: 32,
  },
  tableRow: {
    height: 32,
  },
  tableHeaderCell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    borderLeft: 'none',
    padding: '4px 6px',
    height: 32,
    '&:last-child': {
      borderRight: 'none',
    },
  },
  tableCell: {
    borderBottom: '2px solid rgba(224, 224, 224, 0.4)',
    borderLeft: '2px solid rgba(224, 224, 224, 0.4)',
    borderRight: '2px solid rgba(224, 224, 224, 0.4)',
    padding: '4px 6px',
    height: 32,
    '&:first-child': {
      padding: 0,
    },
    // font: '400 11px system-ui',
  },
  contentPanel: {
    padding: 16,
  },
  panelHeader: {
    height: 30,
    fontSize: 16,
  },
  bulkDiv: {
    borderTop: '1px solid rgba(224, 224, 224, 1)',
    height: 32,
    textAlign: 'right',
  },
  keyValueEdit: {
    font: '400 12px system-ui',
    color: '#ff5300',
    cursor: 'pointer',
    verticalAlign: 'middle',
    lineHeight: '32px',
    position: 'absolute',
    right: '14px',
    '-moz-user-select': '-moz-none',
    '-khtml-user-select:': 'none',
    '-webkit-user-select': 'none',
  },
  bulkEdit: {
    font: '400 12px system-ui',
    color: '#ff5300',
    cursor: 'pointer',
    position: 'absolute',
    right: '14px',
    '-moz-user-select': '-moz-none',
    '-khtml-user-select:': 'none',
    '-webkit-user-select': 'none',
  },
  input: {
    width: '100%',
    height: '100%',
    outlineStyle: 'none',
    paddingBottom: '3px',
    // font: '400 11px system-ui',
    border: 'none',
  },
  selectInput: {
    width: '100%',
    height: '100%',
    outlineStyle: 'none',
    paddingBottom: '3px',
    // font: '400 11px system-ui',
    border: 'none',
    // border: '1px solid rgba(224, 224, 224, 0.8)',
  },
  tableHeaderFirstCell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    padding: '4px 6px',
    width: 42,
    minWidth: 42,
    maxWidth: 42,
    height: 32,
  },
  checkBox: {
    width: 24,
    height: 24,
  },
  queryDragIcon: {
    marginRight: '-6px',
    padding: '2px',
    float: 'left',
  },
  required: {
    width: '24px',
    height: '24px',
  },
  delete: {
    width: '24px',
    height: '24px',
    padding: 0,
    position: 'absolute',
    right: 10,
  },
  switchBase: {
    height: '100%',
  },
  fieldType:{
    width: 22,
    color: '#777',
    cursor: 'pointer',
    '-moz-user-select': '-moz-none',
    '-khtml-user-select:': 'none',
    '-webkit-user-select': 'none',
  },
  inputButton:{
    padding: '3px 2px',
    height:22,
    border:'none',
    fontSize:11,
    textTransform:'inherit',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block'
  }
};
const newItem = {key: '', value: '', description: '', enabled: true, required: false, type: 'Text'};
const columns = [
  {id: 'key', label: '参数名',width: '25%'},
  {id: 'value', label: '值',width: '35%'},
  {id: 'description', label: '描述',width: '35%'},
];

function FormEditTable(props) {
  const [table, setTable] = React.useState({selectRow: -1, selectId: -1, hoverRow: -1, bulk: false});
  const [fileName, setFileName] = React.useState({});
  const {selectRow, selectId, hoverRow, bulk} = table;
  const {classes, path, data, onChange} = props;
  let realData;
  if (!data || data.length === 0) {
    realData = [{...newItem, tmp: true}];
  } else if (!data[data.length - 1].tmp) {
    realData = [...data, {...newItem, tmp: true}];
  } else {
    realData = [...data];
  }
  const updateValue = (index, id, newValue) => {
    const newData = [...(data || [])];
    if (id !== 'enabled' && (newData.length === 0 || index === realData.length - 1)) {
      // 如果data没有值或者正编辑的realData是tmp行并且data的最后一行不是tmp行，则新加一行
      if (newData.length === 0 || (realData[index].tmp && (newData.length !== 0 && !newData[newData.length - 1].tmp))) {
        const addItem = {...newItem};
        addItem[id] = newValue;
        newData.push(addItem);
      } else {
        newData[index][id] = newValue;
        delete newData[index].tmp;
      }
    } else {
      newData[index][id] = newValue;
    }
    if(id==='type'){
      if(newValue==='Text'){
        const fileId=`form-file-${index}`;
        document.getElementById(fileId).value='';
        setFileName({...fileName,[fileId]:undefined});
        newData[index].value = '';
      }
      newData[index].value = '';
    }
    onChange('reqBodyForm', newData);
  };
  const deleteRow = (index) => {
    const newData = [...(data || [])];
    newData.splice(index, 1);
    onChange('reqBodyForm', newData);
  };
  const bulkChange=(value)=>{
  };
  return (
    <Fragment>
      {bulk ?
        <div className={classes.bulk}>
          <div className={classes.bulkDiv}>
            <span className={classes.keyValueEdit}
                  onClick={() => setTable({...table, bulk: !bulk})}>Key-Value Edit</span>
          </div>
          <textarea
            placeholder={'key:value'}
            className={classes.textarea}
            // value={queryParamsBulk}
            onChange={e => bulkChange(e.target.value)}
          />
        </div>
        :
        <div className={classes.bulk}>
          <Table className={classes.table}>
            <TableHead className={classes.thead}>
              <TableRow className={classes.headerRow}>
                <TableCell className={classes.tableHeaderFirstCell}/>
                {columns && columns.map(item =>
                  <TableCell
                    style={{width:item.width}}
                    key={item.id}
                    className={classes.tableHeaderCell}
                  >
                    {item.label}
                    {item.id === 'description' &&
                    <span className={classes.bulkEdit}
                          onClick={() => setTable({...table, bulk: !bulk})}>Bulk Edit</span>
                    }
                  </TableCell>,
                )}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tbody}>
              {
                realData.map((item, index) =>
                  <TableRow
                    key={index}
                    className={classes.tableRow}
                    style={{backgroundColor: selectRow === index ? '#efefef' : '#fff'}}
                    onMouseOver={() => setTable({...table, hoverRow: index})}
                    onMouseLeave={() => setTable({...table, hoverRow: -1})}
                  >
                    <TableCell className={classes.tableCell}>
                      {!item.tmp &&
                      <Fragment>
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20"
                             height="24"
                             fill="rgba(190, 190, 190, 1)" className={classes.queryDragIcon}>
                          <path d="M256 710h482v108H286v-108z m0-242h482v108H286v-108z m0-242h482v108H286v-108z"></path>
                        </svg>
                        <Checkbox
                          onChange={(e) => updateValue(index, 'enabled', e.target.checked)}
                          defaultChecked={item.enabled}
                          className={classes.checkBox}
                          icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                          checkedIcon={<CheckBoxIcon fontSize="small"/>}
                        />
                        <IconButton
                          onClick={() => deleteRow(index)}
                          className={classes.delete}
                          style={{display: hoverRow === index ? undefined : 'none'}}
                        >
                          <ClearIcon/>
                        </IconButton>
                      </Fragment>
                      }
                    </TableCell>
                    {columns.map(col =>{
                      const fileId=`form-file-${index}`;
                      return(
                        <TableCell
                          key={col.id}
                          style={{width: col.id === 'required' ? '20%' : undefined}}
                          className={classes.tableCell}
                          onClick={() => setTable({...table, selectRow: index, selectId: col.id})}
                        >
                          {col.id === 'required' ?
                            (!item.tmp &&
                              <Checkbox
                                onChange={(e) => updateValue(index, 'required', e.target.checked)}
                                defaultChecked={item.required}
                                color='primary'
                                className={classes.checkBox}
                                icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                                checkedIcon={<CheckBoxIcon fontSize="small"/>}
                              />)
                            :
                            <Fragment>
                              {col.id === 'key' ?
                                <Fragment>
                                  <div style={{display:'flex'}}>
                                    <input
                                      style={{backgroundColor: selectRow === index ? '#efefef' : '#fff'}}
                                      onFocus={() => setTable({...table, selectRow: index})}
                                      className={`${selectRow}${selectId}` === `${index}${col.id}` ? classes.selectInput : classes.input}
                                      value={item[col.id] || ''}
                                      spellCheck={false}
                                      onChange={(e) => updateValue(index, col.id, e.target.value)}
                                    />
                                    <label
                                      className={classes.fieldType}
                                      onClick={(e) => updateValue(index, 'type', e.target.innerText==='Text'?'File':'Text')}>
                                      {item.type||'Text'}
                                    </label>
                                  </div>
                                </Fragment>
                                :
                                (item.type==='File'&&col.id==='value'?
                                    <Fragment>
                                      <input
                                        id={fileId}
                                        type='file'
                                        style={{backgroundColor: selectRow === index ? '#efefef' : '#fff',display:'none'}}
                                        onFocus={() => setTable({...table, selectRow: index})}
                                        className={`${selectRow}${selectId}` === `${index}${col.id}` ? classes.selectInput : classes.input}
                                        onChange={(e) => {
                                          updateValue(index, col.id, e.target.files.length>0?fileId:'');
                                          setFileName({...fileName,[fileId]:e.target.files.length>0?e.target.files[0]:{}})
                                        }}
                                      />
                                      <label htmlFor={fileId} title={fileName[fileId]?`${fileName[fileId].name}(type:"${fileName[fileId].type}";size:${fileName[fileId].size}bytes)`:''}>
                                        <Button variant="outlined" component="span" size="small" className={classes.inputButton}>
                                          {fileName[fileId]&&fileName[fileId].name||'Choose File'}
                                        </Button>
                                      </label>
                                    </Fragment>
                                    :
                                    <input
                                      style={{backgroundColor: selectRow === index ? '#efefef' : '#fff'}}
                                      onFocus={() => setTable({...table, selectRow: index})}
                                      className={`${selectRow}${selectId}` === `${index}${col.id}` ? classes.selectInput : classes.input}
                                      value={item[col.id] || ''}
                                      spellCheck={false}
                                      onChange={(e) => updateValue(index, col.id, e.target.value)}
                                    />
                                )
                              }
                            </Fragment>
                          }
                        </TableCell>
                      );
                    })}
                  </TableRow>,
                )
              }
            </TableBody>
          </Table>
        </div>
      }
    </Fragment>
  );
}

export default (withStyles(styles)(FormEditTable));
