import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from "@material-ui/core/Typography";

const styles = {
  title: {
    display: 'inline-block',
    marginTop: 3,
    borderLeft: '3px solid #1890ff',
    paddingLeft: 5,
  },
  panel: {
    height: 30,
    fontSize: 18,
  },
};

function PanelHeader({ classes, title }) {
  return(
    <Typography className={classes.panel}>
      <span className={classes.title}>{title}</span>
    </Typography>
  )
}

export default (withStyles(styles)(PanelHeader));
