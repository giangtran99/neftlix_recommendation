import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  Button,
  Space,
  Tooltip,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ProTable from '@bmstravel/pro-table';
import moment from 'moment';
import _ from 'lodash';
import * as enums from '../../../../utils/enums';
import * as usersServices from '../../../../services/users';

import styles from './TableList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const ListUser = (props) => {
  const searchInput = useRef();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [limit, setLimit] = useState((process.env.REACT_APP_PAGESIZE && !Number.isNaN(process.env.REACT_APP_PAGESIZE)) ? Number(process.env.REACT_APP_PAGESIZE) : 10);
  const [current, setCurrent] = useState(1);
  const [listSearch, setListSearch] = useState({});
  const [data, setData] = useState({
    list: [],
    pagination: {
      total: 0,
      anchor: '',
      current: 1,
      listAnchor: {
        1: ''
      }
    },
  });

  const {
    type, valueType, onChange
  } = props;

  const fetchData = async (params, sort, filter) => {
    console.log('fetchData -> params, sort, filter', params, sort, filter);
    filter = Object.keys(filter).reduce((obj, key) => {
      const newObj = { ...obj };
      if (filter[key] !== null) newObj[key] = getValue(filter[key]);
      return newObj;
    }, {});
    let anchor = '';
    if (params.current > 1) {
      anchor = params.current < current ? data.pagination.listAnchor[params.current] : data.pagination.anchor;
    }
    params = _.assign(params, {
      limit: params.pageSize,
      [type]: valueType,
      anchor
    }, filter);
    const response = await usersServices.getList(params);
    let list = [];
    if (response.users) {
      list = response.users.map(item => {
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
    setCurrent(current + 1);
    const dataUsers = {
      list,
      pagination: {
        total: response.total,
        anchor: response.anchor,
        current: params.current,
        listAnchor: _.assign(data.pagination.listAnchor, {
          [current + 1]: response.anchor
        })
      }
    };
    setData(dataUsers);
    return {
      data: list,
      total: response.total,
      success: true
    }
  };

  const handleSelectRows = (keys, rows) => {
    setSelectedRows(rows);
    setSelectedRowKeys(keys);
    if (keys.length > 0) {
      triggerChange(rows.map(i => i.id));
    }
  };

  const handleSearchFilter = (selectedKeys, confirm, dataIndex) => {
    setListSearch({
      ...listSearch,
      [`search_${dataIndex}`]: selectedKeys[0],
    });
    confirm();
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearchFilter(selectedKeys, confirm, dataIndex)}
          /* onKeyDown={e => {
            if (e.key === 'Enter') {
              onChange(e.target.value)
            }
          }} */
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
    /* onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ), */
  });

  const handleReset = (clearFilters, confirm, dataIndex) => {
    clearFilters();
    setListSearch({
      ...listSearch,
      [`search_${dataIndex}`]: '',
    });
    confirm();
  };

  const triggerChange = data => {
    if (onChange) {
      onChange(data);
    }
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
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      width: 80,
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'state',
      width: 120,
      filters: true,
      valueEnum: enums.partnersEnum,
      hideInSearch: true,
    },
  ];

  const pagination = {
    ...(data && data.pagination),
    simple: true,
    itemRender: (current, type, originalElement) => {
      // console.log('render -> current, type, originalElement', current, type, originalElement);
      if (type === 'prev') {
        return <a>Trước&nbsp;&nbsp;</a>;
      }
      if (type === 'next') {
        return <a>Sau</a>;
      }
      return originalElement;
    },
  };
  return (
    <div className={styles.tableList}>
      <ProTable
        request={fetchData}
        search={false}
        headerTitle="Người dùng"
        rowKey="id"
        toolBarRender={false}
        tableAlertRender={false}
        pagination={pagination}
        columns={columns}
        rowSelection={{
          // type: 'radio',
          renderCell: (checked, record, index, originNode) => {
            return (
              <Tooltip title={type === "ids" ? "Chọn để xóa trong nhóm quyền" : "Chọn để thêm vào nhóm quyền"}>
                {originNode}
              </Tooltip>
            );
          },
          onChange: handleSelectRows
        }}
        dateFormatter="string"
        type="table"
      />
    </div>
  );
};

export default ListUser;
