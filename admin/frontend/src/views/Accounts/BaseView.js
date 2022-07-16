import React, { Component, Fragment,useState, useEffect } from 'react';
import { formatMessage, FormattedMessage, injectIntl } from 'react-intl';
import { Form, Input, Upload, Select, Button } from 'antd';
import { connect } from 'dva';
import { UploadOutlined } from '@ant-design/icons';
import styles from './BaseView.less';
import {updateMe} from '../../utils/helpers'
import { uploadImage } from "../../utils/helpers";
import Config from '../../utils/config';
// import GeographicView from './GeographicView';
// import PhoneView from './PhoneView';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能

const AvatarView = (props) => {
  const { onChange: handeChange, action, headers, multiple, ...rest } = props;
  const [previewImage, setPreviewImage] = useState(props.avatar);


  const onChange = ({ fileList: newFileList }) => {
    console.log("prop avartar ",props)
		setPreviewImage(Config.API_URL+"/uploads/"+newFileList[0].name);
		props.receiveAvatar(Config.API_URL+"/uploads/"+newFileList[0].name)
  };

  const customRequest = ({ onSuccess, file, onError }) => {
    uploadImage(file)
      .then((ret) => {
        const arrImg = [
          {
            status: "done",
            url:ret.url
          }
        ];
        onSuccess(arrImg, file);
        // if (props.onChange) {
        //   props.onChange(arrImg);
        // }
      })
      .catch(onError);
  };

  return (
    <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={previewImage} alt="avatar" />
    </div>
    <Upload fileList={[]}
          {...rest}
          multiple={multiple || false}
          action={action}
          headers={headers}
          onChange={onChange}
          customRequest={customRequest}
    >
      <div className={styles.button_view}>
        <Button icon={<UploadOutlined />}>
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Thay avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
  )
}



const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

class BaseView extends Component {
  form = React.createRef();
  constructor(props){
    super(props)
    this.state = {
      avatar:this.props.avatar
    }


  }
  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser } = this.props;
    Object.keys(this.form.current.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      this.form.current.setFieldsValue(obj);
    });
  };

  receiveAvatar = (avatar) =>{
   this.setState({avatar:avatar})
  }

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    const _currentUser = Object.assign(this.form.current.getFieldsValue(), {avatar:this.state.avatar})
    updateMe(_currentUser,localStorage.getItem("token"))
    .then((data)=>{
      dispatch({
        type: 'user/saveCurrentUser',
        payload:data
      });
    })
  }

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form ref={this.form} layout="vertical" hideRequiredMark>
            <FormItem
              label={formatMessage({ id: 'app.settings.basic.firstname' })}
              name="firstName"
              rules={[
                {
                  required: false,
                  message: formatMessage({ id: 'app.settings.basic.firstname-message' }, {}),
                },
              ]}
            >
              <Input />
            </FormItem>

            <FormItem
              label={formatMessage({ id: 'app.settings.basic.lastname' })}
              name="lastName"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input />
            </FormItem>

            <FormItem
              label={formatMessage({ id: 'app.settings.basic.email' })}
              name="email"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input />
            </FormItem>

            <FormItem
              label={formatMessage({ id: 'app.settings.basic.phone' })}
              name="phone"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input />
            </FormItem>

            <FormItem
              label={formatMessage({ id: 'app.settings.basic.gender' })}
              name="gender"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input />
            </FormItem>



            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}
              name="address"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                },
                { validator: validatorPhone },
              ]}
            >
              <Input />
            </FormItem> */}
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}
              name="phone"
              rule={[
                {
                  required: true,
                  message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                },
                { validator: validatorPhone },
              ]}
            >
             <PhoneView />
            </FormItem> */}
            <Button type="primary" onClick={this.handleSubmit} >
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Cập nhật"

              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} receiveAvatar={this.receiveAvatar}/>
        </div>
      </div>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(injectIntl(BaseView));
