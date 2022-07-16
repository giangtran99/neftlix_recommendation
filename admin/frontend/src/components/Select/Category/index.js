import React, { useEffect, useState } from 'react';
import { Dropdown, Tag } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import intersectionBy from 'lodash/intersectionBy';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import ListCategory from './ListCategory';
import * as categoryServices from '../../../services/category';

const resolveData = (origin, value) => {
  if (isObject(value) && !Array.isArray(value)) {
    value = [value];
  }
  if (isObject(origin) && !Array.isArray(origin)) {
    origin = [origin];
  }
  if (!origin) {
    origin = [];
  }
  if (!value) {
    value = [];
  }
  let interIds = intersectionBy(origin, value || [], 'id');
  if (interIds.length === 0 && value && value.length > 0) {
    // interIds = cloneDeep(value);
    interIds = [...origin, ...value];
  }
  const filValue = (value || []).filter(i => !interIds.map(j => j.id).includes(i.id));
  const filOrigin = (origin || []).filter(i => !interIds.map(j => j.id).includes(i.id));
  return [...filOrigin, ...filValue, ...interIds];
};

const ListCategorySelect = ({ value,language, onChange, limit, modeChoose = 'radio', ...rest }) => {
  const [visible, setVisible] = useState(false);
  const [dataValue, setDataValue] = useState(() => {
    if (modeChoose === 'checkbox') {
      return [];
    } else {
      return {};
    }
  });

  useEffect(() => {
    (async function anyNameFunction() {
      let category = [];
      if (value && value !== '') {
        try {
          const resData = await categoryServices.getList({
            query: {
              id: value,
              language:language
            }
          }, false);
          if (resData) {
						category = resData.rows;
					}
        } catch (error) {
          console.log('🚀 ~ file: index.js ~ line 38 ~ anyNameFunction ~ error', error);
        }
      }
      if (modeChoose === 'checkbox') {
        setDataValue(category);
      } else if (category.length > 0) {
        setDataValue(category[0] || {});
      }
    })();
  }, []);

  useEffect(() => {
    try {
      if (value && typeof value === 'object') {
        if (modeChoose === 'checkbox') {
          setDataValue(origin => {
            return resolveData(origin, value);
          });
        } else {
          setDataValue(value || {});
        }
      }
    } catch (error) {
      console.log('🚀 ~ file: index.js ~ line 63 ~ useEffect ~ error', error);
    }
  }, [value, modeChoose]);

  const handleClick = e => {
    return e.preventDefault();
  };

  const handleVisibleChange = flag => {
    setVisible(flag);
  };

  const handleChange = ({ key, data }) => {
    if (modeChoose === 'radio') {
      setDataValue(data || {});
      if (onChange) {
        onChange(data);
      }
    } else {
      const newDataValue = resolveData(dataValue, data);
      setDataValue(newDataValue);
      if (onChange) {
        onChange(newDataValue);
      }
    }
  };
  const menu = (<ListCategory language={language} modeChoose={modeChoose} onChange={handleChange} limit={limit || 5} />);

  const getCategoryIdentity = (r) => {
    // const id = get(r, "id", "");
    const name = get(r, "name", "");
    return <Tag key={r.id} closable={!rest.disabled} onClose={() => {
      setDataValue(origin => {
        let newValue;
        if (modeChoose === 'radio') {
          newValue = null;
        } else {
          newValue = origin.filter(i => i.id !== r.id);
        }
        if (onChange) {
          onChange(newValue);
        }
        return newValue;
      });

    }}>{name}</Tag>;
  };

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      placement="bottomCenter"
      onVisibleChange={handleVisibleChange}
      visible={visible}
      {...rest}
    >
      <div style={{ border: "1px solid #cfcfcf", padding: "5px" }}>
        {modeChoose === 'checkbox'
          ? (dataValue && dataValue.length > 0 ? dataValue.map(i => getCategoryIdentity(i)) : "Chọn danh mục")
          : (dataValue && Object.keys(dataValue).length > 0 && getCategoryIdentity(dataValue)) || "Chọn danh mục"
        }
        &nbsp;<a className="ant-dropdown-link" onClick={handleClick}><DownOutlined color="#1DA57A" /></a>
      </div>
    </Dropdown>
  );
};

export default ListCategorySelect;
