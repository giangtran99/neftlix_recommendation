import React, { Component } from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Checkbox, Alert } from 'antd';
import { CodeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import Login from '../../components/Login';
import { injectIntl } from 'react-intl';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () => new Promise((resolve, reject) => {
    console.log('this.loginForm ', this.loginForm)
    this.loginForm.validateFields(['mobile'], {}).then(values => {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/getCaptcha',
        payload: values.mobile,
      })
        .then(resolve)
        .catch(reject);
    }
    ).catch(err => {
      reject(err);
    });
  });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'auth/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <div>
            <UserName
              name="email"
              placeholder={`tên đăng nhập: admin or user`}
              rules={[
                {
                  required: true,
                  message: 'tên đăng nhập không đúng',
                },
              ]}
              prefix={<UserOutlined className={styles.prefixIcon} />}
            />
            <Password
              name="password"
              placeholder={`mật khẩu: ...`}
              rules={[
                {
                  required: true,
                  message: 'mật khẩu không đúng',
                },
              ]}
              onPressEnter={() => {
								if (this.loginForm && this.loginForm.form && this.loginForm.form.current) {
									this.loginForm.form.current.validateFields().then(values => {
										this.handleSubmit(null, values);
									}).catch(err => {
										this.handleSubmit(err, {});
									});
								}
							}}
              prefix={<LockOutlined className={styles.prefixIcon} />}
            />
          </div>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              Ghi nhớ
            </Checkbox>
            <a href="/#" style={{ float: 'right' }} onClick={() => { console.log('a') }}>
              Quên mật khẩu
            </a>
          </div>
          <Submit>
            Đăng nhập
          </Submit>
        </Login>
      </div>
    );
  }
}

export default connect(({ login, loading }) => ({
  login,
  // submitting: loading.effects['login/login'],
}))(LoginPage);
