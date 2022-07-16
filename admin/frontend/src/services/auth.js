// import { stringify } from 'qs';
import request from '../utils/request';

export async function accountLogin(params) {
	return request('/v1/accounts/login', {
    method: 'POST',
    body: params,
  });
}

export async function register(params) {
	return request('/v1/accounts/register', {
    method: 'POST',
    body: params,
  });
}

export async function getCaptcha(mobile) {
  return request(`/captcha?mobile=${mobile}`);
}
