import React from 'react';
import {withStyles} from '@material-ui/core';
import ProjectSidebar from 'components/sapi/ProjectSidebar';
import SplitPane from 'react-split-pane';

const styles = {
  tab: {
    minWidth: 100,
  },
  content: {
    height: '100%',
  },
};

function Root({ classes, children }) {
  return (
    <div id="sip-cross" className={classes.root}>
      <SplitPane split="vertical" defaultSize={280} minSize={200} maxSize={400} className={classes.bodySplitPane}>
        <ProjectSidebar />
        <div className={classes.content}>
          {children}
        </div>
      </SplitPane>
    </div>
  );
}
export default (withStyles(styles)(Root));
