import moment from 'moment';
import React from 'react';
import { parse, stringify } from 'qs';

export function fixedZero(val) {
	return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
	const now = new Date();
	const oneDay = 1000 * 60 * 60 * 24;

	if (type === 'today') {
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		return [moment(now), moment(now.getTime() + (oneDay - 1000))];
	}

	if (type === 'week') {
		let day = now.getDay();
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);

		if (day === 0) {
			day = 6;
		} else {
			day -= 1;
		}

		const beginTime = now.getTime() - day * oneDay;

		return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
	}

	if (type === 'month') {
		const year = now.getFullYear();
		const month = now.getMonth();
		const nextDate = moment(now).add(1, 'months');
		const nextYear = nextDate.year();
		const nextMonth = nextDate.month();

		return [
			moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
			moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
		];
	}

	const year = now.getFullYear();
	return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
	const arr = [];
	nodeList.forEach(node => {
		const item = node;
		item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
		item.exact = true;
		if (item.children && !item.component) {
			arr.push(...getPlainNode(item.children, item.path));
		} else {
			if (item.children && item.component) {
				item.exact = false;
			}
			arr.push(item);
		}
	});
	return arr;
}

/* export function digitUppercase(n) {
	return nzh.toMoney(n);
} */

function getRelation(str1, str2) {
	if (str1 === str2) {
		console.warn('Two path are equal!'); // eslint-disable-line
	}
	const arr1 = str1.split('/');
	const arr2 = str2.split('/');
	if (arr2.every((item, index) => item === arr1[index])) {
		return 1;
	}
	if (arr1.every((item, index) => item === arr2[index])) {
		return 2;
	}
	return 3;
}

function getRenderArr(routes) {
	let renderArr = [];
	renderArr.push(routes[0]);
	for (let i = 1; i < routes.length; i += 1) {
		// 去重
		renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
		// 是否包含
		const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
		if (isAdd) {
			renderArr.push(routes[i]);
		}
	}
	return renderArr;
}
export const toDot = (money) => {
	if (money !== 0 && !money) return '0';
	return `${money}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
	let routes = Object.keys(routerData).filter(
		routePath => routePath.indexOf(path) === 0 && routePath !== path
	);
	// Replace path to '' eg. path='user' /user/name => name
	routes = routes.map(item => item.replace(path, ''));
	// Get the route to be rendered to remove the deep rendering
	const renderArr = getRenderArr(routes);
	// Conversion and stitching parameters
	const renderRoutes = renderArr.map(item => {
		const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
		return {
			exact,
			...routerData[`${path}${item}`],
			key: `${path}${item}`,
			path: `${path}${item}`,
		};
	});
	return renderRoutes;
}

export function getPageQuery() {
	return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
	const search = stringify(query);
	if (search.length) {
		return `${path}?${search}`;
	}
	return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
	return reg.test(path);
}

export function formatWan(val) {
	const v = val * 1;
	if (!v || Number.isNaN(v)) return '';

	let result = val;
	if (val > 10000) {
		result = Math.floor(val / 10000);
		result = (
			<span>
				{result}
				<span
					style={{
						position: 'relative',
						top: -2,
						fontSize: 14,
						fontStyle: 'normal',
						marginLeft: 2,
					}}
				>
					万
        </span>
			</span>
		);
	}
	return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
	return window.location.hostname === 'preview.pro.ant.design';
}

export const formatNumber = (value) => {
	// eslint-disable-next-line no-param-reassign
	if (Number.isNaN(value)) return 0;
	value += '';
	const list = value.split('.');
	const prefix = list[0].charAt(0) === '-' ? '-' : '';
	let num = prefix ? list[0].slice(1) : list[0];
	let result = '';
	while (num.length > 3) {
		result = `,${num.slice(-3)}${result}`;
		num = num.slice(0, num.length - 3);
	}
	if (num) {
		result = num + result;
	}
	return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
};

export const fnKhongDau = (str) => {
	let strReturn = str;
	strReturn = strReturn.toLowerCase();
	strReturn = strReturn.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	strReturn = strReturn.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	strReturn = strReturn.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	strReturn = strReturn.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	strReturn = strReturn.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	strReturn = strReturn.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	strReturn = strReturn.replace(/đ/g, "d");
	// strReturn = strReturn.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, "-");
	// strReturn = strReturn.replace(/-+-/g, " ");
	// strReturn = strReturn.replace(/^\-+|\-+$/g, "");
	// strReturn = strReturn.replace('-', ' ');
	return strReturn;
};

export const textToDash = (str) => {
	let strReturn = str;
	strReturn = strReturn.toLowerCase();
	strReturn = strReturn.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	strReturn = strReturn.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	strReturn = strReturn.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	strReturn = strReturn.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	strReturn = strReturn.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	strReturn = strReturn.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	strReturn = strReturn.replace(/đ/g, "d");
	strReturn = strReturn.replace(/!|@|\$|%|\”|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, "-");
	// strReturn = strReturn.replace(/-+-/g, "-");
	strReturn = strReturn.replace(/^\-+|\-+$/g, "-");
	strReturn = strReturn.replace(/-+/, '-');
	return strReturn;
};

export const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min;
};

export const camelCaseToDash = (v) => {
	let ret = '', prevLowercase = false, prevIsNumber = false;
	for (let s of v) {
		const isUppercase = s.toUpperCase() === s;
		const isNumber = !isNaN(s);
		if (isNumber) {
			if (prevLowercase) {
				ret += '-';
			}
		} else {
			if (isUppercase && (prevLowercase || prevIsNumber)) {
				ret += '-';
			}
		}
		ret += s;
		prevLowercase = !isUppercase;
		prevIsNumber = isNumber;
	}
	return ret.replace(/-+/g, '-').toLowerCase();
};

export const camelToPascalCase = (v) => {
	let ret = '';
	let i = 0;
	for (let s of v) {
		s = i === 0 ? s.toUpperCase() : s;
		ret += s;
		i += 1;
	}
	return ret;
};

export const toMinutes = (date) => {
	return date.hours() * 60 + date.minutes();
};

export const fromMinutes = (data) => {
	let c = (data / 60).toFixed(2);
	let hours = parseInt(c);
	let minutes = parseInt((data - (hours * 60)));
	return moment().hours(hours).minutes(minutes);
};

export const daytimeToDate = (data = []) => {
	const format = 'MM/DD/YYYY HH:mm';
	return data.map(i => (
		moment(i * 86400 * 1000).format(format)
	));
}

export const reduceWidth = (width, widthSub = 32) => {
	if (width === undefined) {
		return width;
	}
	if (typeof width === 'string') {
		if (!width.includes('calc')) {
			return `calc(100% - ${width})`;
		}
		return width;
	}
	if (typeof width === 'number') {
		return width - widthSub;
	}
	return width;
};
export const copyToClipboard = (text) => {
	// navigator.clipboard.writeText(window.location.host + '/' + ptype + "/" + text).then(function () {
	navigator.clipboard.writeText(text).then(function () {
		console.log('Async: Copying to clipboard was successful!');
	}, function (err) {
		console.error('Async: Could not copy text: ', err);
	});
};
