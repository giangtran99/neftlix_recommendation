import React, { } from 'react';
import { Modal } from 'antd';

const ModalCustom = (props) => {
  const {
    destroyOnClose = true,
    width = 800,
    maskClosable = false,
    title = "",
    visible = false,
    confirmLoading,
    onOk = () => { },
    onCancel,
    okText = "Thực hiện",
    cancelText = "Hủy",
    style,
    bodyStyle,
    ...rest
  } = props;
  return (
    <Modal
      destroyOnClose={destroyOnClose}
      width={width}
      maskClosable={maskClosable}
      title={title}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      {...rest}
    >
    </Modal>
  );
}

export default ModalCustom;
