import React, { useState } from 'react';
import { Form, Input, Card, Row, Col, message } from 'antd';
import { connect } from 'dva';
import { useIntl } from 'react-intl';
import ListPartner from './ListPartner';
import ListUser from './ListUser';
import { RESOURCE } from '../../../utils/helpers';
import Select from '../../../components/Select';
import Modal from '../../../components/Modal';

export const FORM_TYPE = {
  USER_TO_GROUP: 'USER_TO_GROUP',
  ROLE_TO_GROUP: 'ROLE_TO_GROUP',
  EDIT: 'E',
  ADD: 'A'
};
const FormItem = Form.Item;
const CreateForm = (props) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const {
    group: { formType, formVisible, formData, formTitle, submitting },
    onSubmit: handleAdd,
    onCancel
  } = props;

  const [resource, setResource] = useState();

  console.log('CreateForm -> formType %o \n formData %o', formType, formData);
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    console.log('okHandle -> fieldsValue', fieldsValue);
    if (formType === FORM_TYPE.USER_TO_GROUP && !fieldsValue.in_user_ids && !fieldsValue.user_ids) {
      message.warn(intl.formatMessage({ id: 'Bạn cần chọn người dùng để thực hiện' }));
      return;
    }
    if (formType === FORM_TYPE.ROLE_TO_GROUP && (!fieldsValue.in_partner_ids && !fieldsValue.not_partner_ids)) {
      message.warn(intl.formatMessage({ id: 'Bạn cần chọn đối tác để thực hiện' }));
      return;
    }
    if (formType === FORM_TYPE.ROLE_TO_GROUP && !fieldsValue.resource) {
      message.warn(intl.formatMessage({ id: 'Bạn cần chọn resource để thực hiện' }));
      return;
    }
    form.resetFields();
    handleAdd(fieldsValue);
  };

  switch (formType) {
    case FORM_TYPE.USER_TO_GROUP:
      if (formData && formData.group_id) {
        return (
          <Modal
            title={formTitle}
            visible={formVisible}
            confirmLoading={submitting}
            onOk={okHandle}
            onCancel={() => onCancel()}
            okText={intl.formatMessage({ id: "Thực hiện" })}
            cancelText={intl.formatMessage({ id: "Đóng" })}
          // afterClose={destroyFormData}
          >
            <Form
              form={form}
              preserve={false}
            >
              <Card title={intl.formatMessage({ id: "Người dùng trong nhóm quyền" })} bordered={false}>
                <FormItem
                  name="in_user_ids"
                >
                  <ListUser type="ids" valueType={formData.user_ids.join(',')} />
                </FormItem>
              </Card>
              <Card title={intl.formatMessage({ id: "Người dùng không thuộc nhóm quyền" })} bordered={false}>
                <FormItem
                  name="user_ids"
                /* rules={[{
                  required: true,
                  message: `${intl.formatMessage({ id: "Bạn phải chọn người dùng" })}`
                }]} */
                >
                  <ListUser type="not_ids" valueType={formData.user_ids.join(',')} />
                </FormItem>
              </Card>
            </Form>
          </Modal>
        );
      } else {
        return <></>;
      }
    case FORM_TYPE.ROLE_TO_GROUP:
      if (formData && formData.group_id) {
        return (
          <Modal
            title={formTitle}
            visible={formVisible}
            confirmLoading={submitting}
            onOk={okHandle}
            onCancel={() => onCancel()}
            okText={intl.formatMessage({ id: "Thực hiện" })}
            cancelText={intl.formatMessage({ id: "Đóng" })}
          >
            <Form
              form={form}
              // initialValues={{
              //   name: formData.name,
              //   partner_id: formData.partner_id
              // }}
            >
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label={intl.formatMessage({ id: "Resource" })}
                name="resource"
                rules={[{
                  required: true,
                  message: `${intl.formatMessage({ id: "Bạn phải chọn resource" })}`
                }]}
                colon={false}
              >
                <Select
                  placeholder={intl.formatMessage({ id: "Resource" })}
                  mode="simple"
                  data={Object.keys(RESOURCE).map(re => ({ key: re, value: RESOURCE[re] }))}
                  onChange={(values) => {
                    setResource(values.key)
                    console.log('CreateForm -> values', values);
                  }}
                />
              </FormItem>
              <Card title={intl.formatMessage({ id: "Đối tác trong nhóm quyền" })} bordered={false}>
                <FormItem
                  name="in_partner_ids"
                  // rules={[{
                  //   required: true,
                  //   message: `${intl.formatMessage({ id: "Bạn phải chọn đối tác" })}`
                  // }]}
                >
                  <ListPartner type="partner_ids" valueType={formData.partner_ids} resource={resource || ''} />
                </FormItem>
              </Card>
              <Card title={intl.formatMessage({ id: "Đối tác chưa có quyền" })} bordered={false}>
                <FormItem
                  name="not_partner_ids"
                  // rules={[{
                  //   required: true,
                  //   message: `${intl.formatMessage({ id: "Bạn phải chọn đối tác" })}`
                  // }]}
                >
                  <ListPartner type="not_partner_ids" valueType={formData.partner_ids} resource={resource || ''} />
                </FormItem>
              </Card>
            </Form>
          </Modal>
        );
      } else {
        return <></>;
      }
    case FORM_TYPE.EDIT:
      return (
        <Modal
          title={formTitle}
          visible={formVisible}
          confirmLoading={submitting}
          onOk={okHandle}
          onCancel={() => onCancel()}
          okText={intl.formatMessage({ id: "Thực hiện" })}
          cancelText={intl.formatMessage({ id: "Đóng" })}
        >
          <Form
            form={form}
            initialValues={{
              name: formData.name,
              menus: (formData.menus || []).map(i => ({ key: i }))
            }}
          >
            <Row>
              <Col span={12}>
                <FormItem
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 15 }}
                  label={intl.formatMessage({ id: "Tên nhóm quyền" })}
                  name="name"
                  rules={[{
                    required: true,
                    min: 5,
                    pattern: /^[a-z]{1}[a-zA-Z0-9_-]{1,20}[a-zA-Z0-9]{1}$/,
                    message: `${intl.formatMessage({ id: "Tên ít nhất 3 kí tự, bắt đầu phải là chữ thường" })}`
                  }]}
                >
                  <Input disabled placeholder={intl.formatMessage({ id: "Tên nhóm quyền" })} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label={intl.formatMessage({ id: "Resource" })}
                  name="menus"
                  rules={[{
                    required: true,
                    message: `${intl.formatMessage({ id: "Bạn phải chọn resource" })}`
                  }]}
                  colon={false}
                >
                  <Select
                    placeholder={intl.formatMessage({ id: "Resource" })}
                    data={Object.keys(RESOURCE).map(re => ({ key: re, value: RESOURCE[re] }))}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    case FORM_TYPE.ADD:
      return (
        <Modal
          title={formTitle}
          visible={formVisible}
          confirmLoading={submitting}
          onOk={okHandle}
          onCancel={() => onCancel()}
          okText={intl.formatMessage({ id: "Thực hiện" })}
          cancelText={intl.formatMessage({ id: "Đóng" })}
        >
          <Form
            form={form}
            initialValues={{
              name: formData.name,
              partner_id: formData.partner_id
            }}
          >
            <Row>
              <Col span={12}>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label={intl.formatMessage({ id: "Tên nhóm quyền" })}
                  name="name"
                  rules={[{
                    required: true,
                    min: 5,
                    pattern: /^[a-z]{1}[a-zA-Z0-9_-]{1,20}[a-zA-Z0-9]{1}$/,
                    message: `${intl.formatMessage({ id: "Tên ít nhất 3 kí tự, bắt đầu phải là chữ thường" })}`
                  }]}
                >
                  <Input placeholder={intl.formatMessage({ id: "Tên nhóm quyền" })} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label={intl.formatMessage({ id: "Resource" })}
                  name="menus"
                  rules={[{
                    required: true,
                    message: `${intl.formatMessage({ id: "Bạn phải chọn resource" })}`
                  }]}
                  colon={false}
                >
                  <Select
                    placeholder={intl.formatMessage({ id: "Resource" })}
                    data={Object.keys(RESOURCE).map(re => ({ key: re, value: RESOURCE[re] }))}
                  />
                </FormItem>
              </Col>
            </Row>
            <Card title={intl.formatMessage({ id: "Đối tác" })} bordered={false}>
              <FormItem
                name="partner_id"
                rules={[{
                  required: true,
                  message: `${intl.formatMessage({ id: "Bạn phải chọn đối tác" })}`
                }]}
              >
                <ListPartner />
              </FormItem>
            </Card>
          </Form>
        </Modal>
      );
    default:
      return <></>;
  }
};

export default connect(state => ({ group: state.group }))(CreateForm);
