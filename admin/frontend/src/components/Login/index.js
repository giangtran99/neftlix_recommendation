import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Tabs } from 'antd';
import classNames from 'classnames';
import LoginItem from './LoginItem';
import LoginTab from './LoginTab';
import LoginSubmit from './LoginSubmit';
import styles from './index.less';
import LoginContext from './loginContext';

class Login extends Component {
  form = React.createRef();

  static propTypes = {
    className: PropTypes.string,
    defaultActiveKey: PropTypes.string,
    onTabChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onTabChange: () => { },
    onSubmit: () => { },
  };

  constructor(props) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

  onSwitch = type => {
    this.setState({
      type,
    });
    const { onTabChange } = this.props;
    onTabChange(type);
  };

  getContext = () => {
    const { tabs } = this.state;
    return {
      tabUtil: {
        addTab: id => {
          this.setState({
            tabs: [...tabs, id],
          });
        },
        removeTab: id => {
          this.setState({
            tabs: tabs.filter(currentId => currentId !== id),
          });
        },
      },
      form: this.form.current,
      updateActive: activeItem => {
        const { type, active } = this.state;
        if (active[type]) {
          active[type].push(activeItem);
        } else {
          active[type] = [activeItem];
        }
        this.setState({
          active,
        });
      },
    };
  };

  handleSubmit = values => {
    console.log('Login -> handleSubmit', this.form);
    // e.preventDefault();
    const { active, type } = this.state;
    const { onSubmit } = this.props;
    const activeFileds = active[type];
    this.form.current.validateFields(activeFileds).then(values => {
        onSubmit(null, values);
    }).catch(errorInfo => {
      console.log('Login -> errorInfo', errorInfo);
      const { values, errorFields } = errorInfo;
      onSubmit(errorFields, values);
    })
  };

  render() {
    const { className, children } = this.props;
    const { type, tabs } = this.state;
    const TabChildren = [];
    const otherChildren = [];
    React.Children.forEach(children, item => {
      if (!item) {
        return;
      }
      // eslint-disable-next-line
      if (item.type.typeName === 'LoginTab') {
        TabChildren.push(item);
      } else {
        otherChildren.push(item);
      }
    });
    return (
      <LoginContext.Provider value={this.getContext()}>
        <div className={classNames(className, styles.login)}>
          <Form ref={this.form} onFinish={this.handleSubmit}>
            {tabs.length ? (
              <React.Fragment>
                <Tabs
                  animated={false}
                  className={styles.tabs}
                  activeKey={type}
                  onChange={this.onSwitch}
                >
                  {TabChildren}
                </Tabs>
                {otherChildren}
              </React.Fragment>
            ) : (
                children
              )}
          </Form>
        </div>
      </LoginContext.Provider>
    );
  }
}

Login.Tab = LoginTab;
Login.Submit = LoginSubmit;
Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});

export default Login;
