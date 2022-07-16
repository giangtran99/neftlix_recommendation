import React, { useState, useRef, useMemo } from 'react';
import { Input, Button, Space, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ProTable from '@bmstravel/pro-table';
import dayjs from 'dayjs';
import _ from 'lodash';
import { getValue } from '../../../utils/helpers';
import * as categoryServices from '../../../services/category';

const ListAgency = (props) => {
  const {
    value,
    onChange,
    language
  } = props;
  console.log("$$value",value)
  const searchInput = useRef();
  const [, setSelectedRows] = useState([]);
  const [, setSelectedRowKeys] = useState([]);
  // const [formValues, setFormValues] = useState({});
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

  const pagination = {
		...(data && data.pagination),
		pageSize: props.limit || 5,
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

		if (filter.name) {
			const nameFil = filter.name;
			delete filter.name;
			params = _.assign(params, {
				// skip: (Number(pagination.current) - 1) * Number(pagination.pageSize),
				page: Number(pagination.current),
				pageSize: Number(pagination.pageSize),
				search: `${nameFil}`,
				searchFields: ["name"]
			}, { query: { ...filter ,language:language} });
		} else {
			params = _.assign(params, {
				// skip: (Number(pagination.current) - 1) * Number(pagination.pageSize),
				page: Number(pagination.current),
				pageSize: Number(pagination.pageSize),
				// anchor
			}, { query: { ...filter ,language:language} });
		}


    const response = await categoryServices.getList(params);

    let list = [];
    if (response && response.rows) {
      list = response.rows.map(item => {
        if (item.createdAt) {
          const createdAt = item.createdAt;
          item.createdAt = dayjs(createdAt);
        }
        if (item.updatedAt) {
          const updatedAt = item.updatedAt;
          item.updatedAt = dayjs(updatedAt);
        }
        return item;
      });
    }

    setCurrent(current + 1)
    const dataRes = {
			// list,
			pagination: {
				total: response.total,
				pageSize: response.pageSize,
				totalPages: response.totalPages,
				anchor: response.anchor,
				current: params.current,
				listAnchor: _.assign(data.pagination.listAnchor, {
					[current + 1]: response.anchor
				})
			}
		};
		setData(dataRes);
		return {
			data: list,
			total: response.total,
			success: true
		};

  };

  const handleSelectRows = (keys, rows) => {
    setSelectedRows(rows);
    setSelectedRowKeys(keys);
    if (props.modeChoose === 'radio') {
      if (keys.length > 0) {
        triggerChange(keys[0], rows[0]);
      }
    } else {
      triggerChange(keys, rows);
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

  const triggerChange = (key, data) => {
    if (onChange) {
      onChange({ key, data });
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      width: 200,
      hideInSearch: true,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      width: 120,
      filters: true,
      valueEnum: {
        true: { "text": "Hoạt động", "status": "Processing", "color": "#ec3b3b", "isText": "true", },
        false: { "text": "Dừng", "status": "Default", "color": "#ec3b3b", "isText": "true", },
      },
      hideInSearch: true,
    },
  ];

  const getParams = useMemo(() => {
    let params = {};
    return params;
  }, [value]);

  return (
    <div className="nv-wrapper-select-table">
      <ProTable
        tableClassName="gx-table-responsive"
        request={fetchData}
        params={getParams}
        search={false}
        headerTitle={"Danh sách danh mục"}
        rowKey="id"
        toolBarRender={false}
        tableAlertRender={false}
        pagination={pagination}
        columns={columns}
        rowSelection={{
          type: props.modeChoose || 'checkbox',
          renderCell: (checked, record, index, originNode) => {
            return (
              <Tooltip title={"Chọn danh mục"}>
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

export default ListAgency;
