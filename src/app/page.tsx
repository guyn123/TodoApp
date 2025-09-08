"use client";

import { useState } from "react";
import { Card, List, Typography, Divider, Button, message, Space } from "antd";
import "./index.scss";
import TodoItem from "@/components/TodoItem";
import AddTodoForm from "@/components/AddTodoForm";
import { useTodoStore } from "@/store/todoStore";
import TodoStatusFilter from "@/components/TodoStatusFilter";
import ConfirmModal from "@/components/ComfirmModal";

const { Title } = Typography;

export default function TodoApp() {
  const { todos, filter, toggleTodo, removeTodo } = useTodoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { completeMany } = useTodoStore();

  // modal state
  const [open, setOpen] = useState(false);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const [messageApi, contextHolder] = message.useMessage();

  // chọn / bỏ chọn 1 công việc
  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // bấm Hoàn thành
  // const handleComplete = () => {
  //   selectedIds.forEach((id) => toggleTodo(id));
  //   messageApi.success("Các công việc đã được hoàn thành!");
  //   setSelectedIds([]);
  // };

  const handleComplete = () => {
    completeMany(selectedIds);
    setSelectedIds([]);
    messageApi.success("Đã hoàn thành công việc được chọn!");
  };

  // bấm Xóa → mở modal
  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    setOpen(true);
  };

  // xác nhận Xóa
  const confirmDelete = () => {
    selectedIds.forEach((id) => removeTodo(id));
    messageApi.success("Đã xóa công việc thành công!");
    setSelectedIds([]);
    setOpen(false);
  };

  const hasIncompleteSelected = selectedIds.some(
    (id) => !todos.find((t) => t.id === id)?.completed
  );

  return (
    <div className="todo-container">
      {contextHolder}
      <Card className="todo-card">
        <Title level={2} className="todo-title">📝 Todo App</Title>
        <Divider />
        <AddTodoForm />
        <TodoStatusFilter />
        <Space style={{ display: "flex", justifyContent: "flex-end", margin: "16px 0" }}>
          {/* {hasIncompleteSelected && ( */}
          <Button
            type="primary"
            disabled={!hasIncompleteSelected}
            onClick={handleComplete}
          >
            Hoàn thành
          </Button>
          {/* )} */}
          <Button
            danger
            disabled={selectedIds.length === 0}
            onClick={handleDelete}
          >
            Xóa
          </Button>
        </Space>

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
