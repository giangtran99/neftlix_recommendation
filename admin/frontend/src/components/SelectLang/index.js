import React, { PureComponent } from 'react';
// import { formatMessage, setLocale, getLocale } from 'umi/locale';
import { Menu } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
// import { Icon } from '@ant-design/compatible';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export default class SelectLang extends PureComponent {
  changeLang = ({ key }) => {
    // setLocale(key);
  };

  render() {
    const { className } = this.props;
    const selectedLang = "vi-VN" // getLocale();
    const locales = ['vi-VN', 'en-US'];
    const languageLabels = {
      'vi-VN': 'Tiếng Việt',
      'en-US': 'English',
    };
    const languageIcons = {
      'vi-VN': '🇻🇳',
      'en-US': '🇬🇧',
    };
    const langMenu = (
      <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={this.changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <HeaderDropdown overlay={langMenu} placement="bottomRight">
        <span className={classNames(styles.dropDown, className)}>
          <GlobalOutlined title={'ngôn ngữ'} />
        </span>
      </HeaderDropdown>
    );
  }
}
