import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Cascader } from 'antd';

const RcCascader = (props) => {
	const {
		placeholder = "Chọn bản ghi"
	} = props;

	return (
		<Cascader
			{...props}
			placeholder={placeholder}
		/>
	);
};

export default RcCascader;
