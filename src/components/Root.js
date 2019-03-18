import React from 'react';
import {withStyles} from '@material-ui/core';
import ProjectSidebar from 'components/ProjectSidebar';
import SplitPane from 'react-split-pane';

const styles = {
  bodySplitPane: {
    height: 'calc( 100% - 64px )!important',
  },
};

function Root({classes, children}) {
  return (
    <SplitPane
      split="vertical"
      defaultSize={280}
      minSize={200}
      maxSize={400}
      className={classes.bodySplitPane}>
      <ProjectSidebar/>
      {children}
    </SplitPane>
  );
}

export default (withStyles(styles)(Root));
