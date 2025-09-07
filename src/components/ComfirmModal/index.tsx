"use client";

import React from "react";
import { Modal } from "antd";

interface IConfirmModal {
  open: boolean;
  confirmLoading: boolean;
  modalText: string;
  onConfirm: () => void; // gọi khi bấm "Có"
  onCancel: () => void;  // gọi khi bấm "Không"
  title?: string;
  okText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<IConfirmModal> = ({
  open,
  confirmLoading,
  modalText,
  onConfirm,
  onCancel,
  title = "Xác nhận",
  okText = "Có",
  cancelText = "Không",
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onConfirm}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
    >
      <p>{modalText}</p>
    </Modal>
  );
};

export default ConfirmModal;
