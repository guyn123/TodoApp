"use client";

import { useState } from "react";
import { Card, List, Typography, Divider, Button, message, Space, } from "antd";
import "./index.scss";
import TodoItem from "@/components/TodoItem";
import AddTodoForm from "@/components/AddTodoForm";
import { useTodoStore } from "@/store/todoStore";
import TodoStatusFilter from "@/components/TodoStatusFilter";
import ConfirmModal from "@/components/ComfirmModal";

const { Title } = Typography;

export default function TodoApp() {
  const { todos, filter, completeMany, removeMany } = useTodoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // modal state
  const [open, setOpen] = useState(false);

  // thông báo thành công
  const [messageApi, contextHolder] = message.useMessage();

  // lọc công việc theo trạng thái
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // chọn / bỏ chọn công việc
  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // bấm Hoàn thành
  const handleComplete = () => {
    if (selectedIds.length === 0) return;
    completeMany(selectedIds);
    messageApi.success("Các công việc đã được hoàn thành!");
    setSelectedIds([]);
  };

  // bấm Xóa → mở modal
  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    setOpen(true);
  };

  // xác nhận Xóa
  const confirmDelete = () => {
    removeMany(selectedIds);
    messageApi.success("Đã xóa công việc thành công!");
    setSelectedIds([]);
    setOpen(false);
  };

  return (
    <div className="todo-container">
      {contextHolder}
      <Card className="todo-card">
        <Title level={2} className="todo-title">📝 Todo App</Title>
        <Divider />

        {/* Form thêm công việc */}
        <AddTodoForm />
        {/* Bộ lọc trạng thái */}
        <TodoStatusFilter />
        {/* 2 nút Hoàn thành + Xóa */}
        <Space style={{ margin: "16px 0" }}>
          <Button
            type="primary"
            disabled={selectedIds.length === 0}
            onClick={handleComplete}
          >
            Hoàn thành
          </Button>
          <Button
            danger
            disabled={selectedIds.length === 0}
            onClick={handleDelete}
          >
            Xóa
          </Button>
        </Space>

        {/* Danh sách công việc */}
        <List
          className="todo-list"
          bordered
          dataSource={filteredTodos}
          renderItem={(todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              editingId={editingId}
              setEditingId={setEditingId}
              messageApi={messageApi}
              selected={selectedIds.includes(todo.id)}
              onSelect={handleSelect}
            />
          )}
        />
      </Card>

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        open={open}
        confirmLoading={false}
        modalText="Bạn có chắc muốn xóa các công việc đã chọn không?"
        onConfirm={confirmDelete}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
