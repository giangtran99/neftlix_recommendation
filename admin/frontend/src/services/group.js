import { stringify } from 'qs';
import request from '../utils/request';

export async function getList(params) {
  /* let queryStr = ''
  Object.keys(params).forEach(key => {
    if (key === 'sorter'){
      return queryStr += `${key}=${JSON.stringify(params[key])}&`
    }else {
      return queryStr += `${key}=${params[key]}&`;
    }
  })
  queryStr = queryStr.slice(0, queryStr.length - 1) */
  return request(`/perm/groups?${stringify(params)}`);
}

export async function addGroup(params) {
  return request('/perm/groups', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addResourceToGroup(params) {
  return request(`/perm/groups/${params.group_id}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addUserToGroup(params) {
  return request(`/perm/user-group/${params.group_id}/add`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addRoleToGroup(params) {
  return request('/perm/groups-roles/add-roles', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function removeRoleInGroup(params) {
  return request('/perm/groups-roles/remove-roles', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getRolesInGroup(params) {
  return request(`/perm/groups-roles?${stringify(params)}`);
}

export async function getUsersInGroup(params) {
  return request(`/perm/users-group?${stringify(params)}`);
}

export async function getUserInGroup(uId) {
  return request(`/perm/user-group/${uId}`);
}

export async function updateGroup(params) {
  return request(`/perm/groups/${params.group_id}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function removeUserGroup(params) {
  return request(`/perm/user-group/${params.user_id}/remove`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}