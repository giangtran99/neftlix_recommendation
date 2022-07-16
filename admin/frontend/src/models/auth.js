import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { accountLogin } from '../services/auth';
import local from '../utils/local';
// import { setAuthority } from '../utils/authority';
import { getPageQuery } from '../utils/utils';
// import { reloadAuthorized } from '../utils/Authorized';

export default {
	namespace: 'auth',

	state: {
		token: undefined,
		id: undefined,
		username: undefined
	},

	effects: {
		*login({ payload }, { call, put }) {
			try {
				const response = yield call(accountLogin, payload);
				// console.log('*login -> response', response);

				// Login successfully
				if (response && response.token) {
					yield put({
						type: 'changeLoginStatus',
						payload: response,
					});
					// reloadAuthorized();
					local.set('token', response.token);
					local.set('auth', JSON.stringify({ username: payload.username }));

					const urlParams = new URL(window.location.href);
					const params = getPageQuery();
					let { redirect } = params;
					if (redirect) {
						const redirectUrlParams = new URL(redirect);
						if (redirectUrlParams.origin === urlParams.origin) {
							redirect = redirect.substr(urlParams.origin.length);
							if (redirect.match(/^\/.*#/)) {
								redirect = redirect.substr(redirect.indexOf('#') + 1);
							}
						} else {
							window.location.href = redirect;
							return;
						}
					}
					// console.log("routerRedux: %o | routerRedux.replace: %o", routerRedux, routerRedux.replace(redirect || '/'))
					yield put(routerRedux.replace(redirect || '/'));
				}
			} catch (error) {
				console.log(`🚀 ~ file: auth.js ~ line 67 ~ *login ~ error`, error);
			}
		},

		/* *getCaptcha({ payload }, { call }) {
			yield call(getFakeCaptcha, payload);
		}, */

		*logout(_, { put }) {
			local.clear();
			yield put({
				type: 'changeLoginStatus',
				payload: {
					token: undefined,
					id: undefined,
					username: undefined
				},
			});
			// reloadAuthorized();
			yield put(
				routerRedux.push({
					pathname: '/user/login',
					search: stringify({
						redirect: window.location.href,
					}),
				})
			);
		},
	},

	reducers: {
		changeLoginStatus(state, { payload }) {
			// setAuthority(payload.currentAuthority);
			return {
				...state,
				token: payload.token,
				id: payload.id,
				username: payload.username
			};
		},
	},
};
