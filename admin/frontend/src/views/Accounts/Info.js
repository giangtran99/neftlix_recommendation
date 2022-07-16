import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux as router, Router, Route, Switch, Redirect } from 'dva/router';
import { FormattedMessage } from 'react-intl';
import { Menu } from 'antd';
import GridContent from '../../components/PageHeaderWrapper/GridContent';
import BaseView from './BaseView';
import SecurityView from './SecurityView';
import styles from './Info.less';

const { Item } = Menu;
class Info extends Component {
  constructor(props) {
    super(props);
    const { match, location } = props;
    const menuMap = {
      base: <FormattedMessage id="app.settings.menuMap.basic" defaultMessage="Thông tin" />,
      security: (
        <FormattedMessage id="app.settings.menuMap.security" defaultMessage="Bảo mật" />
      ),
    };
    const key = location.pathname.replace(`${match.path}/`, '');
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: menuMap[key] ? key : 'base',
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { match, location } = props;
    let selectKey = location.pathname.replace(`${match.path}/`, '');
    selectKey = state.menuMap[selectKey] ? selectKey : 'base';
    if (selectKey !== state.selectKey) {
      return { selectKey };
    }
    return null;
  }

  componentDidMount() {
    console.log("alo alo" ,this.props)
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getmenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = ({ key }) => {
    const { dispatch } = this.props;
    dispatch(router.push({ pathname: `/account/settings/${key}` }));
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      let mode = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  render() {
  
    const { children, currentUser } = this.props;
    console.log("render account ",currentUser)
    if (!currentUser.id) {
      return '';
    }
    const { mode, selectKey } = this.state;
    return (
  
      <GridContent>
        <div
          className={styles.main}
          ref={ref => {
            this.main = ref;
          }}
        >
          <div className={styles.leftmenu}>
            <Menu mode={mode} selectedKeys={[selectKey]} onClick={this.selectKey}>
              {this.getmenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            <Switch>
              <Route exact path="/account/settings" name="settings_base" render={props => <BaseView {...props} />} />
              <Route exact path="/account/settings/base" name="settings_base" render={props => <BaseView {...props} />} />
              <Route exact path="/account/settings/security" name="settings_security" render={props => <SecurityView {...props} />} />
            </Switch>
          </div>
        </div>
      </GridContent>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(Info);
