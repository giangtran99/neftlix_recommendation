import React from 'react';
import moment from 'moment';
import { message } from 'antd';
import _ from 'lodash';
import {
  getList,
  addGroup,
  updateGroup,
  addResourceToGroup,
  addUserToGroup,
  addRoleToGroup,
  getUsersInGroup,
  getUserInGroup,
  removeUserGroup,
  getRolesInGroup,
  removeRoleInGroup
} from '../services/group';

export default {
  namespace: 'group',

  state: {
    data: {
      list: [],
      pagination: {
        anchor: '',
        listAnchor: {
          1: ''
        }
      },
    },
    submitting: false,
    formTitle: '',
    formID: '',
    formVisible: false,
    formData: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      // console.log('*fetch -> response %o', response);
      if (response) {
        let list = [];
        if (response.groups) {
          list = response.groups.map(item => {
            if (item.created) {
              const created = item.created;
              item.created = moment(created / 1e6);
            }
            if (item.updated_at) {
              const updated_at = item.updated_at;
              item.updated_at = moment(updated_at / 1e6);
            }
            return item;
          });
        }
        yield put({
          type: 'save',
          payload: {
            list,
            pagination: {
              total: response.total,
              anchor: response.anchor,
              listAnchor: {
                [((payload && payload.current) || 0) + 1]: response.anchor
              }
            }
          },
        });
      }
    },
    *loadForm({ payload }, { put, all }) {
      if (payload.type !== 'RESET') {
        yield put({
          type: 'changeFormVisible',
          payload: true,
        });
      }

      yield [
        put({
          type: 'saveFormType',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitle',
          payload: 'Tạo mới nhóm quyền',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveFormData',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitle',
            payload: 'Chỉnh sửa nhóm quyền',
          }),
          put({
            type: 'saveFormID',
            payload: payload.id,
          }),
          put({
            type: 'saveFormData',
            payload: payload.item,
          }),
        ];
      }
      else if (payload.type === 'USER_TO_GROUP') {
        yield all([
          put({
            type: 'saveFormTitle',
            payload: 'Thêm người dùng vào nhóm quyền',
          }),
          put({
            type: 'saveFormID',
            payload: payload.id,
          }),
          put({
            type: 'fetchUserInGroup',
            payload: payload.item,
          }),
        ]);
      }
      else if (payload.type === 'ROLE_TO_GROUP') {
        yield [
          put({
            type: 'saveFormTitle',
            payload: 'Thêm quyền',
          }),
          put({
            type: 'saveFormID',
            payload: payload.id,
          }),
          put({
            type: 'fetchRolesInGroup',
            payload: payload.item,
          }),
        ];
      }
    },
    *fetchUserInGroup({ payload }, { call, put }) {
      const response = yield call(getUsersInGroup, { group_id: payload.group_id });

      yield put({
        type: 'saveFormData',
        payload: {
          ...payload,
          user_ids: (response && response.user_ids) || []
        },
      });
    },
    *fetchRolesInGroup({ payload }, { call, put }) {
      const response = yield call(getRolesInGroup, { group_id: payload.group_id });
      console.log('*fetchRolesInGroup -> response', response);

      yield put({
        type: 'saveFormData',
        payload: {
          ...payload,
          partner_ids: (
            response
            && response.roles
            && response.roles.map(i => ({
              resource: i.split('$$')[1],
              partner_id: i.split('$$')[2]
            }))) || []
        },
      });
    },
    *submit({ payload }, effects) {
      const { all, call, put, select } = effects;
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      let params = { ...payload };
      const formType = yield select(state => state.group.formType);
      const formID = yield select(state => state.group.formID);

      let success = false;
      let userExistGroup = [];
      let usersToGroup = [];
      switch (formType) {
        case 'E':
          params.group_id = formID;
          if (params.menus && params.menus.length > 0) {
            params.menus = params.menus.map(i => i.key);
          }
          delete params.name;
          console.log('E *submit -> params', params);
          const response = yield call(updateGroup, params);
          if (response && response.group_id !== null && response.group_id !== '') {
            success = true;
          }
          break;
        case 'USER_TO_GROUP':
          try {
            const resUserExist = yield all(
              (payload.user_ids || []).map(uId => call(getUserInGroup, uId))
            );
            console.log('*submit -> resUserExist', resUserExist);
            if (resUserExist) {
              userExistGroup = _.filter(resUserExist, (u) => u.group && u.group.group_id !== null && u.group.group_id !== '') || [];
              usersToGroup = _.filter(resUserExist, (u) => !u.group);

              console.log('*submit -> userExistGroup %o \n usersToGroup %o', userExistGroup, usersToGroup);
              yield all(
                (usersToGroup || [])
                  .map(u => u.user_id)
                  .map(uId => call(addUserToGroup, { user_id: uId, group_id: formID }))
              );
            }
            yield all(
              (payload.in_user_ids || []).map(uId => call(removeUserGroup, { user_id: uId, group_id: formID }))
            );
            success = true;
          } catch (error) {
            console.log('*submit -> error', error);
            success = false;
          }
          break;
        case 'ROLE_TO_GROUP':
          if (params.resource) {
            params.resource = params.resource.key;
          }
          if (params.not_partner_ids && params.not_partner_ids.length > 0) {
            yield call(addRoleToGroup, {
              resource: params.resource,
              partner_ids: params.not_partner_ids,
              group_id: formID
            });
          } else if (params.in_partner_ids && params.in_partner_ids.length > 0) {
            yield call(removeRoleInGroup, {
              resource: params.resource,
              partner_ids: params.in_partner_ids,
              group_id: formID
            });
          }
          success = true;
          break;
        default:
          const resAddGroup = yield call(addGroup, { name: params.name, partner_id: params.partner_id });
          delete params.partner_id;
          delete params.name;
          if (params.menus) {
            params.menus = params.menus.map(i => i.key);
          }
          if (resAddGroup && resAddGroup.group_id !== 0 && resAddGroup.group_id !== null) {
            params.group_id = resAddGroup.group_id;
            yield call(addResourceToGroup, params);
          }
          success = true;
          break;
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (success) {
        if (formType === 'USER_TO_GROUP' && userExistGroup.length > 0) {
          message.warning({
            content: (<div>
              <p>Thêm thành công {usersToGroup.length} quyền.</p>
              <p>Người dùng mã {(userExistGroup || []).map(u => u.user_id).join(',')} trong nhóm quyền khác.</p>
            </div>),
            duration: 10
          });
        } else {
          message.success('Thành công');
        }

        yield put({
          type: 'changeFormVisible',
          payload: false,
        });
        yield put({
          type: 'fetch',
        });

      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          list: action.payload.list,
          pagination: {
            ...state.data.pagination,
            anchor: action.payload.pagination.anchor,
            total: action.payload.pagination.total,
            listAnchor: {
              ...action.payload.pagination.listAnchor,
              ...state.data.pagination.listAnchor,
            }
          },
        },
      };
    },
    changeFormVisible(state, { payload }) {
      return { ...state, formVisible: payload };
    },
    saveFormTitle(state, { payload }) {
      return { ...state, formTitle: payload };
    },
    saveFormType(state, { payload }) {
      return { ...state, formType: payload };
    },
    saveFormID(state, { payload }) {
      return { ...state, formID: payload };
    },
    saveFormData(state, { payload }) {
      return { ...state, formData: payload };
    },
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
  },
};
