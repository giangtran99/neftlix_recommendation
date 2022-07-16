import React from 'react';
import { Link } from 'dva/router';
import { FormattedMessage } from 'react-intl';
import PageHeader from '../PageHeader';
import { connect } from 'dva';
import GridContent from './GridContent';
import styles from './index.less';
import MenuContext from '../../containers/DefaultLayout/MenuContext';

const PageHeaderWrapper = ({ children, contentWidth, wrapperClassName, top, noContent, ...restProps }) => (
	<div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    <MenuContext.Consumer>
      {value => (
        <PageHeader
          wide={contentWidth === 'Fixed'}
          home={<FormattedMessage id="menu.home" defaultMessage="Home" />}
          {...value}
          key="pageheader"
          {...restProps}
          linkElement={Link}
          itemRender={item => {
            if (item.locale) {
              return <FormattedMessage id={item.locale} defaultMessage={item.title} />;
            }
            return item.title;
          }}
        />
      )}
    </MenuContext.Consumer>
    {children ? (
			<div className={noContent ? '' : styles.content}>
        <GridContent>{children}</GridContent>
      </div>
    ) : null}
  </div>
);

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
