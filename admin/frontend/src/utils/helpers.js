import { message } from 'antd';
import Config from './config';

export const RESOURCE = {
	'voucher': 'voucher',
	'partner': 'partner',
	'user': 'user',
	'store': 'store',
	'category': 'category',
	'banner': 'banner',
	'group': 'group',
	'voucher_hot': 'voucher_hot'
};

export const COLOR = [
	"magenta",
	"red",
	"volcano",
	"orange",
	"gold",
	"lime",
	"green",
	"cyan",
	"blue",
	"geekblue",
	"purple"
];

export const uploadImage = async (file) => {
	let formData = new FormData();
	formData.append('file', file);
	let uploadImage = await fetch(Config.API_URL + "/upload", {
		method: "POST",
		body: formData,
	});
	return uploadImage;
};

export const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

export const updateMe = async (data, token) => {
	let updateMe = await fetch(Config.API_URL + "/api/v1/accounts/update-me", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token,
		},
		body: JSON.stringify(data),
	});
	return updateMe.json();
};

export const errorMessage = (error, msg = '') => {
	if (error.response) {
		error.response.json().then(resError => {
			message.error(resError.message || msg || 'Đã xảy ra lỗi');
		});
	} else {
		message.error(error.message || msg || 'Đã xảy ra lỗi');
	}
};


