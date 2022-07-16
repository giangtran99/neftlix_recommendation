import React, { useState, useEffect, useMemo } from 'react';
import concat from 'lodash/concat';
import Select from '../index';
import districtData from '../../../dataMap/district.json';
import { fnKhongDau } from "../../../utils/utils";
const ProvinceSelect = (props) => {
  console.log('ProvinceSelect -> props', props);
  const { ...rest } = props;
  const [val, setVal] = useState([]);
  const data = useMemo(() => {
    console.log('useMemo -> ProvinceSelect -> props.province', props.province);
    if (props.province) {
      return districtData.RECORDS
        .filter(i => {
          if (i.province == props.province) {
            return true;
          }
          return false;
        })
        .map(i => ({ key: i.id, value: i.name, label: i.name }));
    }
    return districtData.RECORDS.map(i => ({ key: i.id, value: i.name, label: i.name }));
  }, [props.province]);

  useEffect(() => {
    if (props.value) {
      setVal(origin => {
        const iFind = (data || []).find(i => props.value == i.key);
        if (iFind) {
          return iFind;
        }
        return props.value;
      });
    } else { setVal([]); }
  }, [data, props.value]);

  return (
    <React.Fragment>
      {data && <Select
        data={data}
        {...rest}
        value={val}
        showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            fnKhongDau(option.children.toLowerCase()).indexOf(fnKhongDau(input.toLowerCase())) >= 0
          }
      />}
    </React.Fragment>
  );
};

export default ProvinceSelect;
