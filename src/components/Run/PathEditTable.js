import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import {withStyles} from '@material-ui/core';

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
    // font: '400 11px system-ui',
  },
  input: {
    width: '100%',
    height: '100%',
    outlineStyle: 'none',
    paddingBottom: '3px',
    border: 'none',
  },
  selectInput: {
    width: '100%',
    height: '100%',
    outlineStyle: 'none',
    paddingBottom: '3px',
    border: 'none',
  },
};
const columns = [
  { id: 'key', label: '参数名' },
  { id: 'value', label: '值' },
  { id: 'description', label: '描述' },
];
function PathEditTable(props) {
  const [selectRow, setSelectRow] = React.useState(0);
  const [selectId, setSelectId] = React.useState(0);
  const {classes, data, onChange} = props;
  const updateValue = (index, id, newValue) => {
    const newData = [...data];
    newData[index][id] = newValue;
    onChange('pathParams',newData);
  };
  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow className={classes.headerRow}>
          {columns.map(item=>{
            return(<TableCell key={item.id} className={classes.tableHeaderCell}>{item.label}</TableCell>);
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {
          data && data.map((item, index) =>
            <TableRow key={index} className={classes.tableRow} style={{backgroundColor: selectRow === index ? '#efefef' : '#fff'}}>
              {columns.map(col =>
                <TableCell
                  key={col.id}
                  className={classes.tableCell}
                  onClick={() => {setSelectRow(index);setSelectId(col.id)}}
                >
                  <input
                    disabled={col.id==='key'}
                    style={{backgroundColor: selectRow === index ? '#efefef' : '#fff'}}
                    onFocus={() => setSelectRow(index)}
                    className={`${selectRow}${selectId}` === `${index}${col.id}` ? classes.selectInput : classes.input}
                    value={item[col.id]}
                    spellCheck={false}
                    onChange={(e) => updateValue(index, col.id, e.target.value)}
                  />
                </TableCell>,
              )}
            </TableRow>,
          )
        }
      </TableBody>
    </Table>
  );
}

export default withStyles(styles)(PathEditTable);
