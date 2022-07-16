import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Form,
  Col,
  Row,
  Popover,
} from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { FormInputRender, useIntl } from '@bmstravel/pro-table';
import FooterToolbar from '../../../components/FooterToolbar';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import Upload from '../../../components/Upload';
import * as enums from '../../../utils/enums';
import styles from './style.less';
import RichTextEditor from '../../../components/RichTextEditor';
import dataFake from '../../../components/RichTextEditor/data.json';

const fieldLabels = { "fullname": "Tên", "avatar": "Ảnh đại diện", "email": "Email", "phone": "Điện thoại", "province": "Tỉnh/thành phố", "district": "Huyện/Xã", "ward": "Phường", "full_address": "Địa chỉ", "state": "Trạng thái" };
const UsersForm = ({ users: { formTitle, formData }, dispatch, submitting }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [error, setError] = useState([]);
  const [width, setWidth] = useState('100%');
  const getErrorInfo = (errors) => {
    console.log('getErrorInfo -> errors', errors);
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="Thông tin lỗi"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined /> &nbsp;{errorCount || 0} lỗi
        </Popover>
      </span>
    );
  };

  const onFinish = (values) => {
    setError([]);
    dispatch({
      type: 'users/submit',
      payload: values,
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    setError(errorInfo.errorFields);
  };

  useEffect(() => {
    function resizeFooterToolbar() {
      requestAnimationFrame(() => {
        const sider = document.querySelectorAll('.ant-layout-sider')[0];
        if (sider) {
          const widthCur = `calc(100% - ${sider.style.width})`;
          if (width !== widthCur) {
            setWidth(width);
          }
        }
      });
    };
    window.addEventListener('resize', resizeFooterToolbar, { passive: true });
    return function cleanup() {
      window.removeEventListener('resize', resizeFooterToolbar);
    };
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      hideRequiredMark
      initialValues={{ ...formData }}
    >
      <PageHeaderWrapper
        title="Tạo mới"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="card1" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels['fullname']}
                name="fullname"
                rules={[{ "required": true, "message": "Tên không được trống" }]}
              >
                <FormInputRender
                  item={{ "title": "Tên", "dataIndex": "fullname", "width": 200, "hasFilter": "true", "hideInTable": false, "hideInSearch": false, "rules": [{ "required": true, "message": "Tên không được trống" }], "formPattern": { "card": "card1", "row": 1, "col": 1 } }}
                  intl={intl}
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={fieldLabels['avatar']}
                name="avatar"
              >
                <Upload />
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item
                label={fieldLabels['email']}
                name="email"
                rules={[{ "required": true, "pattern": "/^$/g", "message": "Email không được trống" }]}
              >
                <FormInputRender
                  item={{ "title": "Email", "dataIndex": "email", "width": 120, "filters": "true", "hideInTable": false, "hideInSearch": false, "rules": [{ "required": true, "pattern": "/^$/g", "message": "Email không được trống" }], "formPattern": { "card": "card1", "row": 1, "col": 3 } }}
                  intl={intl}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels['phone']}
                name="phone"
              >
                <FormInputRender
                  item={{ "title": "Điện thoại", "dataIndex": "phone", "width": 80, "hasFilter": "true", "hideInTable": false, "hideInSearch": false, "formPattern": { "card": "card1", "row": 2, "col": 1 } }}
                  intl={intl}
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={fieldLabels['province']}
                name="province"
              >
                <FormInputRender
                  item={{ "title": "Tỉnh/thành phố", "dataIndex": "province", "width": 120, "hasFilter": "true", "hideInTable": true, "hideInSearch": true, "formPattern": { "card": "card1", "row": 2, "col": 2 } }}
                  intl={intl}
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
              <Form.Item
                label={fieldLabels['district']}
                name="district"
              >
                <FormInputRender
                  item={{ "title": "Huyện/Xã", "dataIndex": "district", "width": 120, "hasFilter": "true", "hideInTable": true, "hideInSearch": true, "formPattern": { "card": "card1", "row": 2, "col": 3 } }}
                  intl={intl}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels['ward']}
                name="ward"
              >
                <FormInputRender
                  item={{ "title": "Phường", "dataIndex": "ward", "width": 120, "hasFilter": "true", "hideInTable": true, "hideInSearch": true, "formPattern": { "card": "card1", "row": 3, "col": 1 } }}
                  intl={intl}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="card2" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item
                label={fieldLabels['full_address']}
                name="full_address"
              >
                <FormInputRender
                  item={{ "title": "Địa chỉ", "dataIndex": "full_address", "width": 200, "hasFilter": "true", "hideInTable": false, "hideInSearch": true, "formPattern": { "card": "card2", "row": 1, "col": 1 } }}
                  intl={intl}
                />
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item
                label={fieldLabels['state']}
                name="state"
              >
                <FormInputRender
                  item={{
                    "title": "Trạng thái", "dataIndex": "state", "width": 120, "filters": "true", "valueEnum": enums.statusEnum, "hideInTable": false, "hideInSearch": false, "formPattern": { "card": "card2", "row": 1, "col": 2 }
                  }}
                  intl={intl}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xl={{ span: 24, offset: 0 }} lg={{ span: 24 }} md={{ span: 24 }} sm={24}>
              <Form.Item
                label={'description'}
                name="description"
                initialValue={dataFake.value}
              >
                <RichTextEditor />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <FooterToolbar style={{ width }}>
          {getErrorInfo(error)}
          <Button type="primary" onClick={() => form.submit()} loading={submitting}>
            Thêm mới
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    </Form>
  );

};

export default connect(({ users, loading }) => ({
  submitting: loading.effects['users/submit'],
  users
}))(UsersForm);
