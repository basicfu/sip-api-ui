import App from 'next/app';
import React from 'react';
import {Provider} from 'react-redux';
import withRedux from 'next-redux-wrapper';
import {getOrCreateStore} from '../src/utils/store';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import compose from 'recompose/compose';
import getPageContext from '../src/utils/getPageContext';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import Notifications from '../src/components/Notifications';
import NProgress from 'nprogress';
import Navbar from 'components/Navbar';
import Router from 'next/router';
import Head from 'next/head'
import styles from 'styles/app';
import Root from 'components/Root';
import config from "config";

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};
// Inject the insertion-point-jss after docssearch
if (process.browser && !global.__INSERTION_POINT__) {
  global.__INSERTION_POINT__ = true;
  const styleNode = document.createComment('insertion-point-jss');
  const docsearchStylesSheet = document.querySelector('#insertion-point-jss');
  if (document.head && docsearchStylesSheet) {
    document.head.insertBefore(styleNode, docsearchStylesSheet.nextSibling);
  }
}

class MyApp extends App {
  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
  }

  state = {
    mobileOpen: false,
    disablePermanent: false,
    open: true,
  };

  handleDrawerOpen = () => {
    this.setState({ mobileOpen: true, disablePermanent: true });
  };

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
        <Provider store={store}>
          <JssProvider
            jss={this.pageContext.jss}
            registry={this.pageContext.sheetsRegistry}
            generateClassName={this.pageContext.generateClassName}
          >
            <MuiThemeProvider
              theme={this.pageContext.theme}
              sheetsManager={this.pageContext.sheetsManager}
            >
              <CssBaseline />
              <Notifications />
              <Navbar />
              <Head>
                <title>{config.title}</title>
              </Head>
              <main style={{ height: 'calc(100% - 64px)', display: 'flex' }}>
                <Root>
                  <MuiThemeProvider
                    theme={this.pageContext.theme}
                    sheetsManager={this.pageContext.sheetsManager}
                  >
                    <div style={{ width: '100%', height: '100%' }}>
                      <Component pageContext={this.pageContext} {...pageProps} />
                    </div>
                  </MuiThemeProvider>
                </Root>
              </main>
            </MuiThemeProvider>
          </JssProvider>
        </Provider>
    );
  }
}
export default compose(
  withStyles(styles),
  withRedux(getOrCreateStore),
)(MyApp);
