"use client";

import React, { useState } from "react";
import { List, Button, Input, Typography, Checkbox } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./style.scss";
import { ITodo, useTodoStore } from "@/store/todoStore";
import ConfirmModal from "../ComfirmModal";

interface ITodoItemProps {
  todo: ITodo;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  messageApi: any;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function TodoItem({
  todo,
  editingId,
  setEditingId,
  messageApi,
  selected,
  onSelect,
}: ITodoItemProps) {
  const { editTodo } = useTodoStore();
  const [inputValue, setInputValue] = useState(todo.text);

  // modal state (chỉ cho lưu)
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showSaveModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    editTodo(todo.id, inputValue);
    setEditingId(null);
    messageApi.success("Bạn đã sửa công việc thành công!");
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 100);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <List.Item className={`todo-item ${todo.completed ? "completed" : ""}`}>
        <div className="todo-left">
          <Checkbox
            checked={selected}
            onChange={() => onSelect(todo.id)}
            style={{ marginRight: 9 }}
          />
          {editingId === todo.id ? (
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={showSaveModal}
            />
          ) : (
            <Typography.Text className="todo-text">{todo.text}</Typography.Text>
          )}
        </div>

        <div className="todo-actions">
          {editingId === todo.id ? (
            <Button type="link" onClick={showSaveModal}>
              Lưu
            </Button>
          ) : (
            !todo.completed && (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => setEditingId(todo.id)}
              />
            )
          )}
        </div>
      </List.Item>

      {/* ConfirmModal cho lưu */}
      <ConfirmModal
        open={open}
        confirmLoading={confirmLoading}
        modalText="Bạn có muốn lưu công việc này không?"
        onConfirm={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
}
