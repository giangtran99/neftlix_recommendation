/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Dropdown,
  Menu,
  Tooltip,
  Divider,
  Space
} from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { routerRedux } from 'dva/router';
import ProTable, { viVNIntl, IntlProvider } from '@bmstravel/pro-table';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import * as enums from '../../../utils/enums';
import { formatNumber } from '../../../utils/utils';
import styles from './TableList.less';

const RESOURCE = "";
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const TableList = (props) => {
  const [form] = Form.useForm();
  const searchInput = useRef();
  const actionRef = useRef();

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState((process.env.REACT_APP_PAGESIZE && !Number.isNaN(process.env.REACT_APP_PAGESIZE)) ? Number(process.env.REACT_APP_PAGESIZE) : 10);
  const [total, setTotal] = useState(0);
  const [anchor, setAnchor] = useState('');
  const [current, setCurrent] = useState(1);
  const [listSearch, setListSearch] = useState({});

  const {
    dispatch,
    [RESOURCE]: { data },
    loading
  } = props;

  const dispatchAction = (type, payload, callback) => {
    if(callback) {
      dispatch({
        type: `${RESOURCE}/${type}`,
        payload,
        callback
      })
    } else {
      dispatch({
        type: `${RESOURCE}/${type}`,
        payload,
      })
    }
  }

  useEffect(() => {
    dispatchAction('fetch', {
      current,
      skip,
      limit
    });
  }, []);

  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      if (filtersArg[key] !== null) newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    let anchor = '';
    if (pagination.current > 1) {
      anchor = pagination.current < current ? pagination.listAnchor[pagination.current] : pagination.anchor;
    }

    if (filters) {
      if (filters.category) {
        let filCate = filters.category;
        filters.categories = filCate;
        delete filters.category;
      }
    }

    const params = {
      ...formValues,
      ...filters,
      current: Number(pagination.current),
      skip: (Number(pagination.current) - 1) * Number(pagination.pageSize),
      limit: Number(pagination.pageSize),
      anchor
    };
    if (sorter.field) {
      //params.sorter = { [sorter.field]: sorter.order === 'ascend' ? "ASC" : "DESC" };
      params.sort = (!sorter.order || sorter.order == 'ascend') ? sorter.field : `-${sorter.field}`;
    }

    setCurrent(pagination.current);
    dispatchAction('fetch', {
      ...params
    });
  };

  const handleSelectRows = (keys, rows) => {
    setSelectedRows(rows)
    setSelectedRowKeys(keys)
    /* if (keys.length > 0) {
      triggerChange(rows.map(i => i.id));
    } */
  };

  const handleSearch = () => {
    form.current.validateFields().then(fieldsValue => {
      console.log('handleSearch -> fieldsValue', fieldsValue);
      const values = {
        current: 1,
        skip: 0,
        limit,
      };
      Object.keys(fieldsValue).forEach(key => {
        if (fieldsValue[key] !== null && fieldsValue[key] !== undefined) {
          values[key] = fieldsValue[key]
        }
      })

      if (fieldsValue.fromDate) {
        const fromDate = fieldsValue.fromDate.set({ 'hour': 0, 'minute': 0, 'second': 0 }).valueOf()
        values.start_at = [fromDate]
      }
      if (fieldsValue.toDate) {
        const toDate = fieldsValue.toDate.set({ 'hour': 23, 'minute': 59, 'second': 59 }).valueOf()
        values.end_at = toDate
      }
      delete values.fromDate;
      delete values.toDate;

      const quantity = values.quantity;
      delete values.quantity;
      if (fieldsValue.quantity) {
        values.typeQuantity = quantity.typeQuantity;
        if (quantity.typeQuantity !== 'range') {
          values.quantity = Number(quantity.fromQuantity)
        } else {
          values.quantity = [Number(quantity.fromQuantity), Number(quantity.toQuantity)]
        }
      }

      setFormValues(formValues);
      dispatchAction('fetch', {
        ...values
      });
    }).catch(err => {
      if (err) return;
    });
  };

  const handleSearchFilter = (selectedKeys, confirm, dataIndex) => {
    setListSearch({
      ...listSearch,
      [`search_${dataIndex}`]: selectedKeys[0],
    });
    confirm();
  }

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearchFilter(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearchFilter(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button onClick={() => handleReset(clearFilters, confirm, dataIndex)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current.select());
      }
    },
    onFilter: (value, record) => record
  });

  const handleReset = (clearFilters, confirm, dataIndex) => {
    clearFilters();
    setListSearch({
      ...listSearch,
      [`search_${dataIndex}`]: '',
    });
    confirm()
  };

  const handleAddClick = () => {
    dispatchAction('loadForm',{
      type: 'A'
    }, () => {
      dispatch(routerRedux.push({ pathname: `/base/${RESOURCE}/add` }));
    })
  };

  const handleUpdateClick = record => {
    dispatchAction('loadForm',{
      type: 'E',
      id: record.id
    }, () => {
      dispatch(routerRedux.push({ pathname: `/base/${RESOURCE}/${record.id}` }));
    })
  };

  const columns = [
  {
    title: 'STT',
    dataIndex: '',
    width: 60,
    align: 'center',
    fixed: 'left',
    render: (val, record, index) => {
      return index + 1;
    },
  },
{
  title: 'ID',
  dataIndex: 'id',
    width: 60,
    fixed: 'left',
    hideInSearch: true,
},
{
  title: 'Tên',
  dataIndex: 'fullname',
    width: 200,
  ...getColumnSearchProps('fullname'),
},
{
  title: 'Ảnh đại diện',
  dataIndex: 'avatar',
    valueType: 'avatar',
    width: 120,
},
{
  title: 'Email',
  dataIndex: 'email',
    width: 120,
    filters: true,
},
{
  title: 'Điện thoại',
  dataIndex: 'phone',
    width: 80,
  ...getColumnSearchProps('phone'),
},
{
  title: 'Tỉnh/thành phố',
  dataIndex: 'province',
    width: 120,
    hideInSearch: true,
    hideInTable: true,
  ...getColumnSearchProps('province'),
},
{
  title: 'Huyện/Xã',
  dataIndex: 'district',
    width: 120,
    hideInSearch: true,
    hideInTable: true,
  ...getColumnSearchProps('district'),
},
{
  title: 'Phường',
  dataIndex: 'ward',
    width: 120,
    hideInSearch: true,
    hideInTable: true,
  ...getColumnSearchProps('ward'),
},
{
  title: 'Địa chỉ',
  dataIndex: 'full_address',
    width: 200,
    hideInSearch: true,
  ...getColumnSearchProps('full_address'),
},
{
  title: 'Trạng thái',
  dataIndex: 'state',
  width: 120,
  filters: true,
  valueEnum: enums.statusEnum,
},
{
  title: 'Ngày tạo',
  dataIndex: 'created',
  valueType: 'dateTime',
  width: 150,
  sorter: true,
},
{
  title: 'Ngày sửa',
  dataIndex: 'updated_at',
  valueType: 'dateTime',
  width: 150,
  sorter: true,
},
  {
    title: 'Thao tác',
    width: 150,
    fixed: 'right',
    render: (text, record) => (
      <>
        <a onClick={() => handleUpdateClick(record)}>Sửa</a>
        <Divider type="vertical" />
        <a href="">Xóa</a>
      </>
    ),
  },
];

const pagination = {
    ...(data && data.pagination),
    simple: true,
    itemRender: (current, type, originalElement) => {
      if (type === 'prev') {
        return <a>Trước&nbsp;&nbsp;</a>;
      }
      if (type === 'next') {
        return <a>Sau</a>;
      }
      return originalElement;
    },
  }

  return (
    <PageHeaderWrapper>
      <div className={styles.tableList}>
        <IntlProvider value={viVNIntl}>
          <ProTable
            type="table"
            rowKey="id"
            search={true}
            headerTitle="users"
            actionRef={actionRef}
            formRef={form}
            dataSource={data && data.list}
            pagination={pagination}
            columns={columns}
            loading={loading}
            scroll={{ x: 1500, y: 300 }}
            onChange={handleStandardTableChange}
            onSubmit={handleSearch}
            toolBarRender={(action, { selectedRows }) => [
              <Button icon={<PlusOutlined />} type="primary" onClick={() => handleAddClick()}>
                Thêm mới
                </Button>,
              selectedRows && selectedRows.length > 0 && (
                <Dropdown
                  overlay={
                    <Menu
                      onClick={async (e) => {
                        if (e.key === 'remove') {
                          // await handleRemove(selectedRows);
                          action.reload();
                        }
                      }}
                      selectedKeys={[]}
                    >
                      <Menu.Item key="remove">Xóa</Menu.Item>
                      <Menu.Item key="approval">Duyệt</Menu.Item>
                    </Menu>
                  }
                >
                  <Button>
                    Thao tác <DownOutlined />
                  </Button>
                </Dropdown>
              ),
            ]}
            tableAlertRender={({ selectedRowKeys, selectedRows }) => (
              <div>
                Đã chọn <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> bản ghi&nbsp;&nbsp;
              </div>
            )}
            // rowSelection={{
            //   // type: 'radio',
            //   onChange: handleSelectRows,
            //   renderCell: (checked, record, index, originNode) => {
            //     return (
            //       <Tooltip title={"Chọn users"}>
            //         {originNode}
            //       </Tooltip>
            //     )
            //   }
            // }}
          />
        </IntlProvider>
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ users, loading }) => ({
  users,
  loading: loading.models.users
}))(TableList);