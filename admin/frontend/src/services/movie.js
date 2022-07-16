import { stringify } from 'qs';
import request from '../utils/request';

export async function getList(params, notification) {
  return request(`/movies?${stringify(params)}`, null, notification);
}
export async function count(params, notification) {
  return request(`/movies/count?${stringify(params)}`, null, notification);
}
export async function count2(params, notification) {
  return request(`/movies/count2`, null, notification);
}



export async function find(params, notification) {
	return request(`//movie/find?${stringify(params)}`, null, notification);
}

export async function get(id, params = {}, notification) {
  return request(`/movie/${id}`, null, notification);
}

export async function create(body, notification) {
  return request(`/movie`, {
    method: 'POST',
    body,
  }, notification);
}

export async function update(id, body, notification) {
  return request(`/movie/${id}`, {
    method: 'POST',
    body,
  }, notification);
}

export async function _delete(id, notification) {
  return request(`/movie/${id}`, {
    method: 'DELETE',
  }, notification);
}

