import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  Button,
  Space,
  Tooltip
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ProTable from '@bmstravel/pro-table';
import moment from 'moment';
import _ from 'lodash';
import * as enums from '../../../../utils/enums';
import * as partnersServices from '../../../../services/partners';

import styles from './TableList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const ListPartner = (props) => {
  console.log('ListPartner -> props', props);
  const {
    type, valueType, onChange, resource
  } = props;

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
      // [type]: valueType,
      anchor
    }, filter);

    const response = await partnersServices.getList(params);
    let list = [];
    if (response.partners) {
      list = response.partners.map(item => {
        if (item.created) {
          const created = item.created;
          item.created = moment(created / 1e6);
        }
        if (item.updated_at) {
          const updated_at = item.updated_at;
          item.updated_at = moment(updated_at / 1e6);
        }
        item.resource = getResourseRole(item.id);
        return item;
      });
    }
    setCurrent(current + 1);
    const dataUsers = {
      // list,
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
    };
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

  const getResourseRole = (partnerId) => {
    return valueType.filter(i => i.partner_id === partnerId).map(i => i.resource).join(',');
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
    /* {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      fixed: 'left',
      hideInSearch: true,
    }, */
    {
      title: 'Tên',
      dataIndex: 'name',
      width: 200,
      hideInSearch: true,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      width: 200,
      hideInSearch: true,
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

  const getParams = () => {
    let params = {};
    switch (type) {
      case 'partner_ids':
        let ids = valueType.map(i => i.partner_id).join(',');
        if(resource && resource !== ''){
          ids = valueType.filter(i => i.resource === resource).map(i => i.partner_id).join(',')
        }
        params = {
          ids
        };
        break;
      case 'not_partner_ids':
        let not_ids = valueType.map(i => i.partner_id).join(',');
        if (resource && resource !== '') {
          not_ids = valueType.filter(i => i.resource === resource).map(i => i.partner_id).join(',');
        }
        params = {
          not_ids
        };
        break;
      default:
        break;
    }
    return params;
  };

  return (
    <div className={styles.tableList}>
      <ProTable
        request={fetchData}
        params={getParams()}
        search={false}
        headerTitle="Đối tác"
        rowKey="id"
        toolBarRender={false}
        tableAlertRender={false}
        pagination={pagination}
        columns={columns}
        rowSelection={{
          type: 'checkbox',
          renderCell: (checked, record, index, originNode) => {
            return (
              <Tooltip title={type === "partner_ids" ? "Chọn để xóa quyền" : "Chọn để thêm quyền"}>
                {originNode}
              </Tooltip>
            );
          },
          onChange: handleSelectRows
        }}
        // onChange={handleStandardTableChange}
        dateFormatter="string"
        type="table"
      />
    </div>
  );
};

export default ListPartner;
