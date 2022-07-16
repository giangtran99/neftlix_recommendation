import React, { Fragment, Suspense } from 'react';
import { Link, Route, Switch } from 'dva/router';
import { Icon } from '@ant-design/compatible';
import GlobalFooter from '../../components/GlobalFooter';
// import SelectLang from '../../components/SelectLang';
import PageLoading from '../../components/PageLoading';
import styles from './UserLayout.less';
import logo from '../../assets/img/logo_landscape.png';

const Login = React.lazy(() => import('../../views/Pages/Login'));

const links = [];

const copyright = (
  <Fragment>
    Copyright MediaOne <Icon type="copyright" /> 2020
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
       {/*  <div className={styles.lang}>
          <SelectLang />
        </div> */}
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>admin</span>
              </Link>
            </div>
            <div className={styles.desc}>Đăng nhập</div>
          </div>
          <Suspense fallback={<PageLoading />}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
              {/* <Redirect from="/" to="/dashboard" /> */}
            </Switch>
          </Suspense>
        </div>
        <GlobalFooter links={links} copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
