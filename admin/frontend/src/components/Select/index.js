import React, { Component } from 'react';
import { Select, Tooltip, Spin, Tag } from 'antd';
import { COLOR } from '../../utils/helpers';
import { fnKhongDau, getRandomInt } from '../../utils/utils';
import styles from './index.less';

export default class SelectAntd extends Component {
  state = {
    selectedItems: [],
  };

  filterOption = (value, option) => {
    const {
      props: { children },
    } = option;
    if (fnKhongDau(children).indexOf(fnKhongDau(value)) !== -1) {
      return true;
    }
    return false;
  };

  handleChange = selectedItems => {
    this.setState({ selectedItems });
    const { onChange } = this.props;
    if (onChange)
      onChange(selectedItems)
  };

  renderOptions = data => (data || []).map(item => (
    <Select.Option value={`${item.key}`} key={item.key}>
      {item.value}
    </Select.Option>
  ));

  dropdownRender = (menuNode/* , props */) => {
    return menuNode;
  }

  tagPlaceHolder = (choices) => (<span>{(choices || []).length} được chọn</span>)

  tagRender = (props) => {
    const { label, closable, onClose } = props;

    return (
      <Tag color={COLOR[getRandomInt(0, 10)]} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    );
  }

  render() {
    const { title,
      loading,
      showArrow,
			mode = 'multiple',
      labelInValue,
      value,
      maxTagTextLength,
      maxTagCount,
      maxTagPlaceholder,
      onChange,
      placeholder,
      data,
      style,
      ...rest
    } = this.props;

    let { allowClear } = this.props;
    if (allowClear) {
      allowClear = true;
    } else if (allowClear === null || allowClear === undefined || allowClear === 'undefined') {
      allowClear = true;
    } else {
      allowClear = false;
    }

    const { selectedItems } = this.state;
    let filteredOptions = data;
    if (mode === 'multiple')
      filteredOptions = data.filter(o => !selectedItems.map(e => e.key).includes(o.key));

    return (
      <Tooltip title={title}>
        <Select
          showArrow={showArrow || true}
          allowClear={allowClear}
          mode={mode || "multiple"}
          labelInValue={labelInValue || true}
          value={value}
          maxTagTextLength={maxTagTextLength || 20}
          maxTagCount={maxTagCount || 3}
          maxTagPlaceholder={maxTagPlaceholder || this.tagPlaceHolder}
          notFoundContent={loading ? <Spin size="small" /> : null}
          onChange={this.handleChange}
          // onKeyPress={e => this.handleKeyPress(e, record.key)}
          placeholder={placeholder}
          className={styles.SelectAtnd}
          style={style}
          loading={loading}
          filterOption={this.filterOption}
          dropdownRender={this.dropdownRender}
          tagRender={this.tagRender}
          {...rest}
        >
          {this.renderOptions(filteredOptions)}
        </Select>
      </Tooltip>
    );
  }
}
