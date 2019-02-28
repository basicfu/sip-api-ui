import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import MuiTabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Router from 'next/dist/client/router';

const styles = {
  tab: {
    minWidth: 100,
  },
};

function Tabs({ classes, value }) {
  const handleTabChange = (event, v) => {
    Router.push(`/${v}`);
  };
  const projectTabs = {
    interface: '接口',
    setting: '设置',
    members: '成员',
  };
  const interfaceTabs = {
    run: '运行',
    preview: '预览',
    version: '版本',
    history: '历史',
  };
  const tabs = Object.keys(projectTabs).indexOf(value) !== -1 ? projectTabs : interfaceTabs;
  return (
    <MuiTabs value={value} indicatorColor="primary" textColor="primary" onChange={handleTabChange}>
      {Object.keys(tabs).map((key) => {
        return <Tab key={key} value={key} className={classes.tab} label={tabs[key]} />;
      })}
    </MuiTabs>
  );
}

export default (withStyles(styles)(Tabs));
