import { stringify } from 'qs';
import request from '../utils/request';

export async function getList(params, notification) {
  return request(`/v1/accounts?${stringify(params)}`, null, notification);
}

export async function find(params, notification) {
	return request(`/v1/accounts/find?${stringify(params)}`, null, notification);
}

export async function get(id, params = {}, notification) {
  if(params !== null && Object.keys(params).length > 0){
    return request(`/v1/accounts/${id}?${stringify(params)}`, null, notification);
  }
  return request(`/v1/accounts/${id}`, null, notification);
}

export async function create(body, notification) {
  return request(`/v1/accounts/register`, {
    method: 'POST',
    body,
  }, notification);
}

export async function update(id, body, notification) {
  return request(`//accounts/${id}`, {
    method: 'PUT',
    body,
  }, notification);
}
