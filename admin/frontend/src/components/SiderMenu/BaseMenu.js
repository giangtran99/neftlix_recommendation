import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Menu } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
// import Icon1 from '@ant-design/icons';
import { Icon } from '@ant-design/compatible';

import { /* Icon, */ InlineIcon } from '@iconify/react';
import handshakeIcon from '@iconify/icons-fa-solid/handshake';
import storeIcon from '@iconify/icons-fa-solid/store';
import seedlingIcon from '@iconify/icons-fa-solid/seedling';
import fileIcon from '@iconify/icons-fa-solid/file';
import awardIcon from '@iconify/icons-fa-solid/award';
import clinicMedicalIcon from '@iconify-icons/fa-solid/clinic-medical';
import giftIcon from '@iconify-icons/fa-solid/gift';
import giftsIcon from '@iconify-icons/fa-solid/gifts';
import cartIcon from '@iconify-icons/fa-solid/cart-arrow-down';

import { Link } from 'dva/router';
import { urlToList } from '../_utils/pathTools';
import { getMenuMatches } from './SiderMenuUtils';
import { isUrl } from '../../utils/utils';
import styles from './index.less';

// import { ReactComponent as SettingSvg } from '../../assets/img/menu/setting.svg';

const { SubMenu } = Menu;
let IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js', // 在 iconfont.cn 上生成
  // scriptUrl: '//at.alicdn.com/t/font_1039637_btcrd5co4w.js',
});

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon)) {
      return (
        <Icon
          component={() => (
            <img src={icon} alt="icon" /* className="ant-pro-sider-menu-icon" */ className={styles.icon} />
          )}
        />
      );
    }
    if (icon.startsWith('icon-store')) {
      return <InlineIcon icon={storeIcon} className={styles.icon} />
    }
    if (icon.startsWith('icon-seedling')) {
      return <InlineIcon icon={seedlingIcon} className={styles.icon} />
    }
    if (icon.startsWith('icon-partner')) {
      return <InlineIcon icon={handshakeIcon} className={styles.icon} />
    }
    if (icon.startsWith('icon-file')) {
      return <InlineIcon icon={fileIcon} className={styles.icon} />
    }
		if (icon.startsWith('icon-award')) {
			return <InlineIcon icon={awardIcon} className={styles.icon} />;
		}
		if (icon.startsWith('icon-clinicMedical')) {
			return <InlineIcon icon={clinicMedicalIcon} className={styles.icon} />;
		}
		if (icon.startsWith('icon-giftIcon')) {
			return <InlineIcon icon={giftIcon} className={styles.icon} />;
		}
		if (icon.startsWith('icon-giftsIcon')) {
			return <InlineIcon icon={giftsIcon} className={styles.icon} />;
		}
		if (icon.startsWith('icon-cartIcon')) {
			return <InlineIcon icon={cartIcon} className={styles.icon} />;
		}
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    }

    return <Icon type={icon} />;
  }
  return icon;
};

export default class BaseMenu extends PureComponent {

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item, parent))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
                name
              )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    // console.log("BaseMenu getMenuItemPath item: ", item)
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    // console.log('BaseMenu -> itemPath', itemPath);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      // console.log('BaseMenu -> /^https?:\/\//.test(itemPath)', /^https?:\/\//.test(itemPath));
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    // console.log('return link icon ', icon);

    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
              onCollapse(true);
            }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
      className,
      collapsed,
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys && !collapsed) {
      props = {
        openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys,
      };
    }
    const { handleOpenChange, style, menuData } = this.props;
    const cls = classNames(className, {
      'top-nav-menu': mode === 'horizontal',
    });
    console.log("$$className",theme)
    // console.log("BASE MENU props: %o \ncls: %o", this.props, cls)
    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        className={cls}
        {...props}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
