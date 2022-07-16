import moment from 'moment';
import { message } from 'antd';
import * as usersServices from '../services/users';

export default {
  namespace: 'users',

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
      const response = yield call(usersServices.getList, payload);
      // console.log('*fetch -> response %o', response);
      if (response) {
        let list = [];
        if(response.users){
          list = response.users.map(item => {
            if(item.created){
              const created = item.created;
              item.created = moment(created / 1e6);
            }
            if (item.updated_at) {
              const updated_at = item.updated_at;
              item.updated_at = moment(updated_at / 1e6);
            }
            return item;
          })
        }
        yield put({
          type: 'save',
          payload: {
            list,
            pagination: {
              total: response.total,
              anchor: response.anchor,
              listAnchor: {
                [payload.current + 1]: response.anchor
              }
            }
          },
        });
      }
    },
    *loadForm({ payload, callback }, { put }) {
      yield put({
        type: 'changeFormVisible',
        payload: true,
      });

      yield [
        put({
          type: 'saveFormType',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitle',
          payload: 'Thêm mới',
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
            payload: 'Chỉnh sửa',
          }),
          put({
            type: 'saveFormID',
            payload: payload.id,
          }),
          put({
            type: 'fetchForm',
            payload: { id: payload.id },
          }),
        ];
      }
      if(callback){
        callback();
      }
    },
    *fetchForm({ payload }, { call, put }) {
      const response = yield call(usersServices.get, payload.id);

      yield [
        put({
          type: 'saveFormData',
          payload: response,
        }),
      ];
    },
    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.users.formType);

      let success = false;
      if (formType === 'E') {
        const id = yield select(state => state.users.formID);
        const response = yield call(usersServices.update, id, params);
        if (response && response.id) {
          success = true;
        }
      } else {
        const response = yield call(usersServices.create, params);
        if (response && response.id) {
          success = true;
        }
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (success) {
        message.success('Thành công');
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
