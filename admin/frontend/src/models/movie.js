import moment from 'moment';
import { message } from 'antd';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import get from 'lodash/get';
import * as movieServices from '../services/movie';

const RESOURCE = 'movie';
const transfromDocument = (record) => {

	if (record.createdAt) {
		const createdAt = record.createdAt;
		record.createdAt = moment(createdAt);
	}
	if (record.updatedAt) {
		const updatedAt = record.updatedAt;
		record.updatedAt = moment(updatedAt);
	}

	return record;
};

export default {
  namespace: `${RESOURCE}`,

  state: {
    data: {
      list: [],
      pagination: {
				total: 0,
				totalPages: 0,
				page: 1,
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
    *fetch({ payload, callback }, { call, put }) {
			let payloadRet = {};
			let list = [];
			try{
				const response = yield call(movieServices.getList, payload);
				const count = yield call(movieServices.count, payload);
				if (response) {
					let list = [];
					if(response) {
						list = response.map(item => {
							transfromDocument(item);
							return item;
						})
					}
					payloadRet = {
						list,
						pagination: {
							pageSize: get(payload, ["pageSize"], 10),
							total: count,
							totalPages: response.totalPages,
							page: response.page,
							listAnchor: {
								[((payload && payload.current) || 1) + 1]: get(response, ["anchor"], "")
							}
						}
					};
					yield put({
						type: 'save',
						payload: payloadRet
					});
				}
			} catch (error) {
        console.log('*fetch -> error', error);
			}
			if (callback) {
				callback(list);
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
          type: 'saveFormID',
          payload: '',
        })
      ];
			if (payload.type === 'A') {
				yield [
					put({
						type: 'saveFormTitle',
						payload: 'Thêm mới',
					}),
					put({
						type: 'saveFormData',
						payload: {
							status: '1'
						},
					}),
				];
			}
      else if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitle',
            payload: `Chỉnh sửa ${payload.id}`,
          }),
          put({
            type: 'saveFormID',
            payload: payload.id,
          }),
          put({
            type: 'fetchForm',
            payload: {
              id: payload.id
            },
          }),
        ];
      }
      if(callback){
        callback();
      }
    },
    *fetchForm({ payload, callback }, { call, put }) {
			let response;
			try {
				response = yield call(movieServices.get, payload.id, payload);
				if (response)
					transfromDocument(response);
				yield [
					put({
						type: 'saveFormData',
						payload: response,
					}),
				];
			} catch (error) {
        console.log('*fetch -> error', error);
			}
			if(callback) {
        callback(response);
      }
    },
    *submit({ payload, callback }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state[`${RESOURCE}`].formType);

      let success = false;
			let response;
      try {
        if (formType === 'E') {
          const id = yield select(state => state[`${RESOURCE}`].formID);
          if(!params.id) {
            params._id = +id ;
          }
          response = yield call(movieServices.update, id, params, false);
          if (response && response._id) {
            success = true;
          }
        } else {
		  params._id = parseInt(Math.random() * (10000000 - 5000) + 5000)
          response = yield call(movieServices.create, params, false);
          if (response && response._id) {
            success = true;
          }
        }
      } catch (error) {
        success = false;
				let errMsg = 'Đã có lỗi xảy ra';
				if (error.response) {
					const ret = yield call([error.response, 'json']);
					if (ret.errors && Array.isArray(ret.errors)) {
						errMsg = `${ret.errors.map(i => i.message).toString()}`;
					} else if (ret.data && Array.isArray(ret.data)) {
						errMsg = `${ret.data.map(i => i.message).toString()}`;
					} else if (ret.message) {
						errMsg = ret.message;
					}
					response = {
						error: {
							message: errMsg
						}
					};
				} else {
					response = {
						error: {
							message: error.message || errMsg
						}
					};
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
        // yield put({
        //   type: 'fetch',
        // });
      }
			if (callback) {
				callback(response);
			}
    },
		*find({ payload, callback }, { call, put }) {
			let list = [];
			try {
				const response = yield call(movieServices.find, payload);
				if (response) {
					list = response.map(item => {
						transfromDocument(item);
						return item;
					});
					yield put({
						type: 'save',
						payload: {
							list
						}
					});
				}
			} catch (error) {
			 console.log('*fetch -> error', error);
			}
			if (callback) {
				callback(list);
			}
		},
  },

  reducers: {
    save(state, action) {
			let pagi = get(action.payload, ["pagination"], {});
			pagi = omit(pagi, ["listAnchor"]);
			const aPagi = get(action.payload, "pagination", {});
			const sPagi = get(state.data, "pagination", {});
			const listAnchor = Object.assign({},
				get(aPagi, "listAnchor", {}),
				get(sPagi, "listAnchor", {})
			);
			const pagination = Object.assign({},
				sPagi,
				{ listAnchor },
				pagi
			);
			return {
				...state,
				data: {
					...state.data,
					list: action.payload.list,
					pagination
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
