import React, { useState, useEffect, useMemo } from "react";
import concat from "lodash/concat";
import Select from "../index";
import provinceData from "../../../dataMap/province.json";
import { fnKhongDau } from "../../../utils/utils";
const ProvinceSelect = (props) => {
  const { ...rest } = props;
  const [val, setVal] = useState([]);
  // const [data, setData] = useState(provinceData.RECORDS.map(i => ({ key: i.id, value: i.name, label: i.name })));
  const data = useMemo(() => {
    return provinceData.RECORDS.map((i) => ({
      key: i.id,
      value: i.name,
      label: i.name,
    }));
  }, []);

  useEffect(() => {
    if (props.value) {
      setVal((origin) => {
        const iFind = (data || []).find((i) => props.value == i.key);
        if (iFind) {
          return iFind;
        }
        return props.value;
      });
    } else {
      setVal([]);
    }
  }, [data, props.value]);

  return (
    <React.Fragment>
      {data && (
        <Select
          data={data}
          {...rest}
          value={val}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            fnKhongDau(option.children.toLowerCase()).indexOf(fnKhongDau(input.toLowerCase())) >= 0
          }
        />
      )}
    </React.Fragment>
  );
};

export default ProvinceSelect;
