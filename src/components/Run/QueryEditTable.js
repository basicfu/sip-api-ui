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

const styles = {
  table: {
    font: '400 11px system-ui',
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
  bulk: {
    font: '400 11px system-ui',
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
    right: '4px',
    '-moz-user-select': '-moz-none',
    '-khtml-user-select:': 'none',
    '-webkit-user-select': 'none',
  },
  bulkEdit: {
    font: '400 12px system-ui',
    color: '#ff5300',
    cursor: 'pointer',
    position: 'absolute',
    right: '4px',
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
  required:{
    width: '24px',
    height: '24px',
  },
  delete:{
    width: '24px',
    height: '24px',
    padding: 0,
    position: 'absolute',
    right: 10,
  },
  switchBase:{
    height: '100%',
  }
};
const newItem={key:'',value:'',description:'',enabled:true,required:false};
const columns = [
  { id: 'key', label: '参数名' },
  { id: 'value', label: '值' },
  { id: 'description', label: '描述' },
  { id: 'required', label: '必选'},
];
function calcPath(path,queryParams) {
  const indexOf=path.indexOf('?');
  let newPath=indexOf!==-1?path.substring(0,indexOf):path;
  const params=[];
  queryParams.forEach(item=>{
    if(item.enabled===true&&item.key!==''&&item.value!==''){
      params.push(`${item.key}=${item.value}`)
    }else if(item.enabled===true&&item.key!==''&&item.value===''){
      params.push(item.key)
    }
  });
  if(params.length!==0){
    newPath+=`?${params.join('&')}`;
  }
  return newPath;
}
function QueryEditTable(props) {
  const [table, setTable] = React.useState({selectRow:-1,selectId:-1,hoverRow:-1,bulk:false});
  const {selectRow,selectId,hoverRow,bulk}=table;
  const {classes, path, data, onChange} = props;
  let realData;
  if(!data||data.length===0){
    realData=[{...newItem,tmp:true}];
  }else if(!data[data.length-1].tmp){
    realData=[...data,{...newItem,tmp:true}];
  }else{
    realData=[...data];
  }
  const updateValue = (index, id, newValue) => {
    const newData = [...(data||[])];
    if(id!=='enabled'&&(newData.length===0||index===realData.length-1)){
      // 空值处理 || 编辑的最后一样则新加一行
      // 如果正编辑的realData是tmp行并且data的最后一行不是tmp行，则新加一行
      if(realData[index].tmp&&(newData.length!==0&&!newData[newData.length-1].tmp)){
        const addItem={...newItem};
        addItem[id]=newValue;
        newData.push(addItem);
      }else{
        newData[index][id] = newValue;
        delete newData[index].tmp;
      }
    }else{
      newData[index][id] = newValue;
    }
    const newPath=calcPath(path,newData);
    onChange('updatePath',{path:newPath,queryParams:newData});
  };
  const deleteRow = (index) => {
    const newData = [...(data||[])];
    newData.splice(index,1);
    const newPath=calcPath(path,newData);
    onChange('updatePath',{path:newPath,queryParams:newData});
  };
  return (
    <Fragment>
      {bulk ?
        <div className={classes.bulk}>
          <div className={classes.bulkDiv}>
            <span className={classes.keyValueEdit} onClick={() => setTable({...table, bulk: !bulk})}>Key-Value Edit</span>
          </div>
          <textarea
            placeholder={'key:value'}
            style={{minWidth: '100%', maxWidth: '100%', outline: 'none', border: '1px solid #ddd', minHeight: '150px'}}
            // value={queryParamsBulk}
            // onChange={event => onBulkEditChange(event, 'queryParamsBulk')}
          />
        </div>
        :
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.headerRow}>
              <TableCell className={classes.tableHeaderFirstCell}/>
              {columns && columns.map(item =>
                <TableCell
                  key={item.id}
                  className={classes.tableHeaderCell}
                >
                  {item.label}
                  {item.id === 'description' &&
                  <span className={classes.bulkEdit} onClick={() => setTable({...table, bulk: !bulk})}>Bulk Edit</span>
                  }
                </TableCell>,
              )}
            </TableRow>
          </TableHead>
          <TableBody>
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
                    {!item.tmp&&
                      <Fragment>
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="24"
                             fill="rgba(190, 190, 190, 1)" className={classes.queryDragIcon}>
                          <path d="M256 710h482v108H286v-108z m0-242h482v108H286v-108z m0-242h482v108H286v-108z"></path>
                        </svg>
                        <Checkbox
                          onChange={(e) => updateValue(index, 'enabled', e.target.checked)}
                          checked={item.enabled}
                          className={classes.checkBox}
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                          checkedIcon={<CheckBoxIcon fontSize="small" />}
                        />
                      </Fragment>
                    }
                  </TableCell>
                  {columns.map(col =>
                    <TableCell
                      key={col.id}
                      style={{width:col.id==='required'?'20%':undefined}}
                      className={classes.tableCell}
                      onClick={() => setTable({...table, selectRow: index, selectId: col.id})}
                    >
                      {col.id==='required'?
                        <Fragment>
                          <Checkbox
                            onChange={(e) => updateValue(index, 'required', e.target.checked)}
                            checked={item.required}
                            color='primary'
                            className={classes.required}
                            // classes={{switchBase:classes.switchBase}}
                          />
                          {!item.tmp && <IconButton
                            onClick={() => deleteRow(index)}
                            className={classes.delete}
                            style={{display: hoverRow === index ? undefined : 'none'}}
                          >
                            <ClearIcon/>
                          </IconButton>
                          }
                        </Fragment>
                        :
                        <input
                          style={{backgroundColor: selectRow === index ? '#efefef' : '#fff'}}
                          onFocus={() => setTable({...table, selectRow: index})}
                          className={`${selectRow}${selectId}` === `${index}${col.id}` ? classes.selectInput : classes.input}
                          value={item[col.id]||''}
                          spellCheck={false}
                          onChange={(e) => updateValue(index, col.id, e.target.value)}
                        />
                      }
                    </TableCell>,
                  )}
                </TableRow>,
              )
            }
          </TableBody>
        </Table>
      }
    </Fragment>
  );
}

export default (withStyles(styles)(QueryEditTable));
