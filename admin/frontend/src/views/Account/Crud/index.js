import React, { useEffect, useState } from 'react';
import {
	Card,
	Button,
	Form,
	Col,
	Row,
	Popover,
	Input
} from 'antd';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { CloseCircleOutlined ,EyeTwoTone,EyeInvisibleOutlined} from '@ant-design/icons';
import { connect } from 'dva';
import { FormInputRender, useIntl } from '@bmstravel/pro-table';
import FooterToolbar from '../../../components/FooterToolbar';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import Upload from '../../../components/Upload';
import * as enums from '../../../utils/enums';
import { formatNumber, camelCaseToDash } from '../../../utils/utils';
import styles from './style.less';

const RESOURCE = "account";
const fieldLabels = { "username": "Tài khoản", "password": "Mật khẩu" ,"firstName":"Tên"};
const AccountForm = ({ account: { formTitle, formData }, dispatch, submitting, match: { params } }) => {
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
		const data = _.cloneDeep(values);
		dispatch({
			type: 'account/submit',
			payload: data,
			callback: () => {
				// dispatch(routerRedux.push({ pathname: `/base/${camelCaseToDash(RESOURCE)}` }));
			}
		});
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
		setError(errorInfo.errorFields);
	};

	useEffect(() => {
		dispatch({
			type: 'account/loadForm',
			payload: {
				type: params.id !== 'add' ? 'E' : 'A',
				id: params.id !== 'add' ? params.id : null
			},
		});
	}, []);

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
	});

	if (params.id === 'add' || (formData && formData.id && formData.id !== 'add')) {
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
					title={formTitle}
					wrapperClassName={styles.advancedForm}
				>
					<Row>
						<Col xl={{ span: 20, offset: 2 }} lg={{ span: 20, offset: 2 }} md={12} sm={24} xs={24}>
							<Card title="Thông tin chính" className={styles.card} bordered={false}>
								<Row gutter={16}>
									<Col xxl={{ span: 18, offset: 3 }} xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={18} sm={24} xs={24}>
										<Form.Item
											label={fieldLabels['username']}
											name="username"
											rules={[{ "required": true, "message": "Câu hỏi không được trống" }]}
										>
											<FormInputRender
												item={{ "title": "Câu hỏi", "dataIndex": "description", "width": 200, "hasFilter": true, "hideInTable": false, "hideInSearch": false, "rules": [{ "required": true, "message": "Câu hỏi không được trống" }], "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
												intl={intl}
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row gutter={16}>
									<Col xxl={{ span: 18, offset: 3 }} xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={18} sm={24} xs={24}>
										<Form.Item
											label={fieldLabels['password']}
											name="password"
											rules={[{ "required": true, "message": "Câu trả lời không được trống" }]}
										>
											<Input.Password
												placeholder="input password"
												iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
											/>
										</Form.Item>
										<p>(*) Mật khẩu có ít nhất 8 ký tự</p>
									</Col>
								</Row>
								<Row gutter={16}>
									<Col xxl={{ span: 18, offset: 3 }} xl={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} md={18} sm={24} xs={24}>
										<Form.Item
											label={fieldLabels['firstName']}
											name="firstName"
											rules={[{ "required": true, "message": "Tên không được để trống" }]}
										>
											<FormInputRender
												item={{ "title": "Câu hỏi", "dataIndex": "description", "width": 200, "hasFilter": true, "hideInTable": false, "hideInSearch": false, "rules": [{ "required": true, "message": "Câu hỏi không được trống" }], "formPattern": { "card": "Thông tin chính", "row": 1, "col": 1 } }}
												intl={intl}
											/>
										</Form.Item>
									</Col>
								</Row>
							</Card>
						</Col>
					</Row>
					<FooterToolbar style={{ width }}>
						{getErrorInfo(error)}
						<Button type="primary" onClick={() => form.submit()} loading={submitting}>
							{params.id === 'add' ? "Thêm mới" : "Chỉnh sửa"}
						</Button>
					</FooterToolbar>
				</PageHeaderWrapper>
			</Form>
		);
	}
	return <></>;
};

export default connect(({ account, loading }) => ({
	submitting: loading.effects['account/submit'],
	account
}))(AccountForm);
