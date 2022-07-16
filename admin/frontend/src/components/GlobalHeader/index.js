import React, { PureComponent } from 'react';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { Link } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    console.log("this.triggerResizeEvent ", this.triggerResizeEvent)
    // this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/

  triggerResizeEvent = Debounce(() => {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }, 600)

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    // this.triggerResizeEvent()
  };
  render() {
    const { collapsed, isMobile, logo } = this.props;
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <span className={styles.trigger} onClick={this.toggle}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          {/* <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} /> */}
        </span>
        <RightContent {...this.props} />
      </div>
    );
  }
}
