import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Form,
  Col,
  Row,
  Popover,
  Input,
  Switch
} from 'antd';
import _ from 'lodash';
import { CloseCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { FormInputRender, useIntl } from '@bmstravel/pro-table';
import * as enums from '../../../utils/enums';
import CategorySelect from '../../../components/Select/Category'
import TopicSelect from '../../../components/Select/Topic'
import Upload from '../../../components/Upload';
import RichText from '../../../components/RichTextEditor';
import styles from './style.less';


const { TextArea } = Input
const RESOURCE = "voucher";
const fieldLabels = {"isHotDeal":"Deal hot","nameAlias":"nameAlias","content": "Nội dung", "name": "Tên", "status": "Trạng thái", "topicId": "Chủ đề", "categoryId": "Danh mục", "description": "Mô tả", "thumbnail": "Thumbnail" };
const VoucherForm = ({ voucher: { formTitle, formData }, refForm, fetchData, language, indentity, submit, setIsSubmit, dispatch, submitting }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [error, setError] = useState([]);
  const [width, setWidth] = useState('100%')
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
    const data = _.cloneDeep(values);
    if (data.topicId) {
      data.topicId = data.topicId.id
    }
    if (data.categoryId) {
      data.categoryId = data.categoryId.id
    }
    if (data.thumbnail && typeof data.thumbnail == 'object') {
      data.thumbnail = _.map(data.thumbnail, (item) => {
        return _.pick(item, ["id", "uid", "path", "url"]);
      });
    }
    if (language) {
      data.language = language
    }
    dispatch({
      type: 'voucher/submit',
      payload: data,
      callback: (res) => {
        fetchData()
      }
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    setError(errorInfo.errorFields);
  };

  useEffect(() => {
    dispatch({
      type: 'voucher/loadForm',
      payload: {
        type: indentity !== 'add' ? 'E' : 'A',
        id: indentity !== 'add' ? indentity : null
      },
    });
  }, [indentity])

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...formData
    });
  }, [formData]);

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
  })


  if (indentity === 'add' || (formData && formData.id && formData.id !== 'add')) {
    return (
      <>
        <Form
          form={form}
          ref={refForm}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          hideRequiredMark
          initialValues={{ ...formData }}
        >
          <Card title="Thông tin chính" className={styles.card} bordered={false}>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={12}>
                <Form.Item
                  label={fieldLabels['name']}
                  name="name"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <Form.Item
                  label={fieldLabels['status']}
                  name="status"
                >
                  <FormInputRender
                    item={{ "valueEnum": enums.statusEnums, "title": fieldLabels['status'], "dataIndex": "status", "width": 100, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 2, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item
                  label={fieldLabels['nameAlias']}
                  name="nameAlias"
                >
                  <FormInputRender
                    item={{ "title": "Tên", "dataIndex": "name", "width": 200, "hasFilter": true, "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
                    intl={intl}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={12}>
                <Form.Item
                  label={fieldLabels['categoryId']}
                  name="categoryId"
                >
                  <CategorySelect language={language} modeChoose="radio" />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <Form.Item
                  label={fieldLabels['topicId']}
                  name="topicId"
                >
                  <TopicSelect language={language} modeChoose="radio" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={12}>
                <Form.Item
                  label={fieldLabels['thumbnail']}
                  name="thumbnail"
                >
                  <Upload modeChoose="radio" />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <Form.Item
                  label={fieldLabels['isHotDeal']}
                  name="isHotDeal"
                >
                  <Switch defaultChecked={formData.isHotDeal}></Switch>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item
                  label={fieldLabels['description']}
                  name="description"
                >
                  <TextArea />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item
                  label={fieldLabels['content']}
                  name="content"
                >
                  <RichText />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </>
    );
  }
  return <></>;
}

export default connect(({ voucher, loading }) => ({
  submitting: loading.effects['voucher/submit'],
  voucher
}))(VoucherForm);
