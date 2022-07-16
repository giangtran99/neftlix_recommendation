import { stringify } from 'qs';
import request from '../utils/request';

export async function getList(params) {
  return request(`/user/users?${stringify(params)}`);
}

export async function get(id, params = {}) {
  return request(`/user/users/${id}`, { params });
}

export async function create(body) {
  return request(`/user/users`, {
    method: 'POST',
    body,
  });
}

export async function update(id, body) {
  return request(`/user/users/${id}`, {
    method: 'POST',
    body,
  });
}