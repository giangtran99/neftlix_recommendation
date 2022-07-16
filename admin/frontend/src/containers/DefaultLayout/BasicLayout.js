import React, { Suspense } from 'react';
import { Layout } from 'antd';
import { IntlProvider } from 'react-intl';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { Redirect, Route, Switch } from 'dva/router';
import PageLoading from '../../components/PageLoading';
import logo from "../../assets/logo.jfif";
import logoUncollapsed from "../../assets/logo_uncollapse.jpg";
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import nav from '../../_nav';
import routes from '../../routes';
import SiderMenu from '../../components/SiderMenu';
import translations from '../../locales';
import local from '../../utils/local';
import styles from './BasicLayout.less';

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  componentDidMount() {
  
    if (!local.get('token')) {
      this.props.history.replace('/dashboard');
    } else {
      const {
        dispatch,
        // route: { routes, authority },
      } = this.props;
      // dispatch({
      //   type: 'user/fetchCurrent',
      // });
      dispatch({
        type: 'setting/getSetting',
      });
      dispatch({
        type: 'menu/getMenuData',
        payload: { routes: nav },
      });
    }
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path && pathToRegexp(route.path).test(key)) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);
    // console.log('BasicLayout -> getPageTitle -> currRouterData', currRouterData);

    if (!currRouterData) {
			return `${this.props.adminName} Netflix` || 'Netflix';
    }
    /* const pageName = this.props.intl.formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `${pageName} - MPoint Admin`; */
		return `${this.props.adminName} Netflix` || 'Netflix';
  };

  getLayoutStyle = () => {
    const {
      fixSiderbar, isMobile, collapsed, layout,
      collapsedWidth = '80px',
      uncollapsedWidth = '256px'
    } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? collapsedWidth : uncollapsedWidth,
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      locale,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      fixedHeader,
    } = this.props;
    local.set('token',"hello")
    const isAuthenticated = local.get('token');
    const messages = translations[locale];
    const isTop = PropsLayout === 'topmenu';
    // const routerConfig = this.getRouterAuthority(pathname, routes);
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logoUncollapsed={logoUncollapsed}
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className={styles.content} style={contentStyle}>
            <Suspense fallback={<PageLoading />}>
              <Switch>
                {routes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={props => (
                        <route.component {...props} />
                      )}>
                      {route.childrens && <Switch>
                        {route.childrens && route.childrens.map((route1, idx1) => <Route
                          key={idx1}
                          path={route1.path}
                          exact={route1.exact}
                          name={route1.name}
                          render={props => (
                            <route1.component {...props} />
                          )} />)}
                      </Switch>}
                    </Route>
                  ) : (null);
                })}
                {isAuthenticated ? <Redirect from="/" to="/dashboard" /> : <Redirect from="/" to="/login" />}
              </Switch>
            </Suspense>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );

    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <IntlProvider locale={locale} key={locale} messages={messages}>
                  <div className={classNames(params)}>{layout}</div>
                </IntlProvider>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu, auth }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => {
      return <BasicLayout {...props} isMobile={isMobile} />;
    }}
  </Media>
));
