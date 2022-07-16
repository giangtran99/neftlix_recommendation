import React from 'react';
import {
  Spin
} from 'antd';
import styles from './Spin.less';

const Loading = () => {
  return (
    <div className={styles.mySpin}>
      <Spin />
    </div>
  );
}

export default Loading;
