
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Modal, Input, Form, message } from 'antd';
import concat from 'lodash/concat';
import cloneDeep from 'lodash/cloneDeep';
import { PlusCircleOutlined } from '@ant-design/icons';
import { errorMessage } from '../../../utils/helpers';
import Cascader from '../index';
import * as categoryServices from '../../../services/category';

const options = [
	{
		value: 'zhejiang',
		label: 'Zhejiang',
		children: [
			{
				value: 'hangzhou',
				label: 'Hangzhou',
				children: [
					{
						value: 'xihu',
						label: 'West Lake',
					},
				],
			},
		],
	},
	{
		value: 'jiangsu',
		label: 'Jiangsu',
		children: [
			{
				value: 'nanjing',
				label: 'Nanjing',
				children: [
					{
						value: 'zhonghuamen',
						label: 'Zhong Hua Men',
					},
				],
			},
		],
	},
];

const CategoryCascader = (props) => {
	const {
		value: initValue,
		...rest
	} = props;
	const [value, setValue] = useState(props.value || []);
	const [form] = Form.useForm();
	const [data, setData] = useState([]);
	const [visibleModal, setVisibleModal] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);

	const onChange = (val, opts) => {
		console.log(`🚀 ~ file: index.js ~ line 59 ~ onChange ~ opts`, opts);
		console.log(`🚀 ~ file: index.js ~ line 59 ~ onChange ~ val`, val);
		setValue(val);
		if (props.onChange) {
			props.onChange(val);
		}
	};

	const handleAddCategory = async (e) => {
		let values;
		try {
			setConfirmLoading(true);
			values = await form.validateFields();
			const res = await categoryServices.create({
				...values,
				parentId: value[value.length - 1]
			}, false);
			if (res && res.id) {
				setTimeout(async () => {
					await fetchData(callbackBrand);
					setValue(origin => {
						let nextValue = [...origin, res.id];
						if (props.onChange) {
							props.onChange(nextValue);
						}
						return nextValue;
					});

					setVisibleModal(false);
					setConfirmLoading(false);
				}, 5000);
			}
		} catch (error) {
			errorMessage(error);
			setConfirmLoading(false);
		}
	};

	const fetchData = async (callback) => {
		try {
			const resBrand = await categoryServices.findCategories({
				sort: "-id",
				fields: "id,name,parentId,status",
				query: { "status": "active" },
				noCache: true,
			}, false);
			if (resBrand) {
				if (callback) {
					callback(resBrand);
				}
			}
		} catch (error) {
			console.log(`🚀 ~ file: category cascader ~ fetchData ~ error`, error);
		}
	};

	const callbackBrand = (data) => {
		function rescurseItem(data1, item = {}) {
			if (data1.length > 0) {
				let children = data1.map(item1 => {
					return rescurseItem(item1.children, item1);
				});
				return {
					value: item.id,
					label: item.name,
					children: children
				};
			}
			return ({
				value: item.id,
				label: item.name
			});
		}
		data = data.map(item => {
			return rescurseItem(item.children, item);
		});
		setData(data);
	};

	useEffect(() => {
		(async function anyNameFunction() {
			await fetchData(callbackBrand);
			return () => undefined;
		})();

		return () => undefined;
	}, []);

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Cascader
				{...rest}
				onChange={onChange}
				value={value}
				options={data}
				changeOnSelect
			/>
			<div style={{ marginLeft: '5px' }}>
				<PlusCircleOutlined
					style={{ fontSize: '20px', color: '#faad14' }}
					onClick={() => { setVisibleModal(true); }}
				/>
				{/* {value.length <= 0 ? <PlusCircleOutlined
					style={{ fontSize: '20px', color: '#91908d', cursor: 'not-allowed' }}
				/> : <PlusCircleOutlined
					style={{ fontSize: '20px', color: '#faad14' }}
					onClick={() => { setVisibleModal(true); }}
				/>} */}
			</div>
			<Modal
				title={`Thêm danh mục`}
				visible={visibleModal}
				onOk={handleAddCategory}
				confirmLoading={confirmLoading}
				onCancel={() => { setVisibleModal(false); }}
				okText={`Thực hiện`}
				cancelText={`Hủy`}
			>
				<Form
					form={form}
				>
					<Form.Item
						rules={[
							{
								"required": true,
								"message": "Tên không được trống"
							}
						]}
						name={`name`}
					>
						<Input
							placeHolder={`Tên danh mục`}
							onPressEnter={handleAddCategory}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default CategoryCascader;
