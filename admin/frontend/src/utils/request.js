import fetch from 'dva/fetch';
import { notification } from 'antd';
import router, { routerRedux } from 'dva/router';
import isArray from 'lodash/isArray';
import appInstance from '../index';
import Config from './config';

import local from './local';

const isProd = process.env.NODE_ENV === 'production';
const codeMessage = {
	200: 'The server successfully returned the requested data.',
	201: 'New or modified data is successful.',
	202: 'A request has entered the background queue (asynchronous task).',
	204: 'The data was deleted successfully.',
	400: 'The request was made with an error and the server did not perform any new or modified data operations.',
	401: 'User does not have permission (token, username, password is incorrect).',
	403: 'The user is authorized, but access is forbidden.',
	404: 'The request is made for a record that does not exist and the server does not operate.',
	406: 'The format of the request is not available.',
	410: 'The requested resource is permanently deleted and will not be retrieved.',
	422: 'A validation error occurred when creating an object.',
	500: 'An error occurred on the server. Please check the server.',
	502: 'Gateway error.',
	503: 'The service is unavailable and the server is temporarily overloaded or maintained.',
	504: 'The gateway timed out.',
};

const checkStatus = (response, noti) => {
	if (response.status >= 200 && response.status < 300) {
		console.log(
			"%c----------------[ GET RESPONSE ]---------------- \n",
			"color:green;font-size:10px",
			response.url
		);
		return response;
	}

	console.log(
		"%c----------------[ GET RESPONSE ]---------------- \n",
		"color:red;font-size:10px",
		response
	);
	const errortext = codeMessage[response.status] || response.statusText;
	console.log(`🚀 ~ file: request.js ~ line 44 ~ checkStatus ~ errortext`, errortext);
	if (noti) {
		response.json().then(err => {
			let errMsg;
			if (err && err.errors && isArray(err.errors)) {
				errMsg = `${err.errors.map(i => i.message).toString()}`;
			}
			notification.error({
				// message: `Lỗi ${response.status}: ${response.url}`,
				description: err.message,
				duration: process.env.REACT_APP_NOTIFICATION_ERROR ? Number(process.env.REACT_APP_NOTIFICATION_ERROR) : 30
			});
		})
			.catch(err => {
				notification.error({
					// message: `Lỗi ${response.status}: ${response.url}`,
					description: err.message,
					duration: process.env.REACT_APP_NOTIFICATION_ERROR ? Number(process.env.REACT_APP_NOTIFICATION_ERROR) : 30
				});
			});
	}
	const error = new Error(errortext);
	error.name = response.status;
	error.response = response;
	throw error;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option, noti = true) {
	let API_URL = `${Config.API_URL}/api/${url}`;
	if (isProd) {
		API_URL = `${Config.API_URL}/api/${url}`;
		if (url.startsWith('/')) {
			API_URL = `${Config.API_URL}/api${url}`;
		}
	} else {
		API_URL = `${process.env.REACT_APP_URL}/api/${url}`;
		if (url.startsWith('/')) {
			API_URL = `${process.env.REACT_APP_URL}/api${url}`;
		}
	}
	const options = {
		...option,
	};

	const token = local.get('token');
	let tokenHeaders = {};
	if (token && token !== undefined) {
		// tokenHeaders['USER_TOKEN'] = token;
		tokenHeaders['Authorization'] = `Bearer ${token}`;
	}

	const defaultOptions = {
		// credentials: 'include',
		headers: {
			...tokenHeaders,
		}
	};
	const newOptions = { ...defaultOptions, ...options };
	if (
		newOptions.method === 'POST' ||
		newOptions.method === 'PUT' ||
		newOptions.method === 'DELETE'
	) {
		if (!(newOptions.body instanceof FormData)) {
			newOptions.headers = {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
				...newOptions.headers,
			};
			newOptions.body = JSON.stringify(newOptions.body);
		} else {
			// newOptions.body is FormData
			newOptions.headers = {
				Accept: 'application/json',
				...newOptions.headers,
			};
		}
	}

	return fetch(API_URL, newOptions)
		.then((res) => checkStatus(res, noti))
		.then(response => {
			// DELETE and 204 do not return data by default
			// using .json will report an error.
			if (newOptions.method === 'DELETE' || response.status === 204) {
				return response.text();
			}
			return response.json();
		})
		.catch(e => {
			const status = e.name;
			if (status === 401) {
				console.log('request -> catch error -> status', status);
				// @HACK
				/* eslint-disable no-underscore-dangle */
				/* window.g_app._store.dispatch({
					type: 'login/logout',
				}); */
				appInstance._store.dispatch({
					type: 'auth/logout',
				});
				return;
			}
			// environment should not be used
			if (process.env.NODE_ENV === 'production') {
				if (status === 403) {
					appInstance._store.dispatch(routerRedux.replace({ pathname: '/exception/403' }));
					return;
				}
				if (status <= 504 && status > 500) {
					console.log('request -> appInstance', appInstance);
					appInstance._store.dispatch(routerRedux.replace({ pathname: '/exception/500' }));
					return;
				}
				if (status >= 404 && status < 422) {
					appInstance._store.dispatch(routerRedux.replace({ pathname: '/exception/404' }));
					return;
				}
			}
			throw e;
		});
}
