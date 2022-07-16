import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Form, Input, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { textToDash, copyToClipboard } from '../../utils/utils';
import * as articleServices from '../../services/article';

const schema = {
	"jsonSchema": {
		"title": "RcLink",
		"description": "",
		"type": "object",
		"required": [],
		"properties": {
			"url": {
				"type": "string",
				"title": "Đường dẫn publish",
				"default": "",
				"maxLength": 100000
			},
		}
	},
	"uiSchema": {
		"url": {
			"ui:placeholder": "Please input",
			"ui:help": "",
			"ui:disabled": false
		},
		"pageTitle": {
			"ui:placeholder": "Please input",
			"ui:help": "",
			"ui:disabled": false
		},
		"target": {
			"ui:widget": "select",
			"ui:placeholder": "Please select",
			"ui:help": "",
			"ui:disabled": false
		}
	},
	"formData": {
		"url": "",
		"pageTitle": "",
		"target": "",
		"status": true
	},
	"bizData": {},
	"sequence": [
		"url",
		"pageTitle",
		"target"
	]
};

const RCInputAlias = ({ value, valueTarget, name, formItemProps, setFieldsValue, getFieldValue, template, params, ...rest }) => {
	const [data, setData] = useState(null);
	const [preValueTarget, setPreValueTargets] = useState(valueTarget);
	const [validateStatus, setValidateStatus] = useState(null);
	const [help, setHelp] = useState('');
	const [extra,] = useState(<>
		<span> (*) Đường dẫn thể hiện trên link url của bài viết.</span>
		<div>(*) Sao chép(click icon bên phải ở trên) đường dẫn này vào bài viết tiếng việt hoặc tiếng anh tương ứng để link các bài viết với nhau.</div>
		<div>(*) Trong cùng ngôn ngữ, định danh này phải là duy nhất.</div>
	</>);

	/* useEffect(() => {
		setData(value || {});
	}, [value]); */

	const findByAlias = (query) => {
		if (typeof query.id == "undefined") {
			delete query.id;
		} else {
			query.id = {
				"$not": [query.id]
			};
		}
		return articleServices.find({
			query: {
				language: params.language,
				template,
				status: 1,
				...query
			},
			fields: "id,name,nameAlias"
		});
	};

	useEffect(() => {
		console.log(`🚀 ~ file: InputAlias.js ~ line 56 ~ RCInputAlias ~ preValueTarget`, preValueTarget);
		console.log(`🚀 ~ file: InputAlias.js ~ line 61 ~ useEffect ~ valueTarget`, valueTarget);
		if (valueTarget && valueTarget != "") {
			const nameAlias = textToDash(valueTarget);
			if (!data) {
				// init or not onChange
				if (preValueTarget != valueTarget) {
					setPreValueTargets(valueTarget);
					setFieldsValue({ [name]: nameAlias });
				}
			} else {
				// onChange
				setData(nameAlias);
				setFieldsValue({ [name]: nameAlias });
				// }
			}
		}
	}, [valueTarget]);

	useEffect(() => {
		(async function anyNameFuntion() {
			setValidateStatus('validating');
			const id = getFieldValue("id");
			console.log(`🚀 ~ file: InputAlias.js ~ line 74 ~ anyNameFuntion ~ id`, id);
			const language = params.language;
			console.log(`🚀 ~ file: InputAlias.js ~ line 73 ~ useEffect ~ language`, params.language);
			console.log(`🚀 ~ file: InputAlias.js ~ line 75 ~ useEffect ~ template`, template);
			let existAlias = await findByAlias({
				id, nameAlias: data
			});
			if (existAlias && existAlias.length <= 0) {
				setValidateStatus('success');
				setHelp('');
			} else {
				setValidateStatus('error');
				setHelp('Đường dẫn đã tồn tại');
			}
			console.log(`🚀 ~ file: InputAlias.js ~ line 97 ~ anyNameFuntion ~ existAlias`, existAlias);
		})();
	}, [data]);

	const handleChange = (e) => {
		// const curName = e.target.name;
		const curVal = e.target.value;
		setData(curVal);
		setFieldsValue({ [name]: curVal });
	};

	return (
		<Form.Item name={name} {...formItemProps} validateStatus={validateStatus} help={help} extra={extra} hasFeedback>
			<Input
				onChange={e => handleChange(e)}
				{...rest}
				suffix={
					<Tooltip title="Sao chép">
						<CopyOutlined
							onClick={() => {
								copyToClipboard(getFieldValue(name));
							}}
							style={{ color: '#169e7c' }}

						/>
					</Tooltip>
				}
			/>
		</Form.Item>
	);
};

export default RCInputAlias;
