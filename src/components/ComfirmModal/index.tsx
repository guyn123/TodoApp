"use client";

import React from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";

interface IConfirmModal {
  open: boolean;
  confirmLoading: boolean;
  modalText: string;
  onConfirm: () => void;
  onCancel: () => void;
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
  title,
  okText,
  cancelText,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={title || t("confirmModal.title")}
      open={open}
      onOk={onConfirm}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      okText={okText || t("confirmModal.ok")}
      cancelText={cancelText || t("confirmModal.cancel")}
    >
      <p>{modalText}</p>
    </Modal>
  );
};

export default ConfirmModal;
