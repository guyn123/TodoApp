"use client";

import React, { useEffect, useState } from "react";
import { List, Typography, Checkbox, Input, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./style.scss";
import { ITodo } from "@/store/todoStore";

interface ITodoItemProps {
  todo: ITodo;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function TodoItem({
  todo,
  editingId,
  setEditingId,
  selected,
  onSelect,
}: ITodoItemProps) {
  const [inputValue, setInputValue] = useState(todo.text);

  useEffect(() => {
    if (editingId !== todo.id) {
      setInputValue(todo.text);
    }
  }, [editingId, todo.id, todo.text]);

  const isExpired = todo.deadline
    ? new Date(todo.deadline) < new Date() && !todo.completed
    : false;

  return (
    <List.Item className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-left">
        <Checkbox
          checked={selected}
          onChange={() => onSelect(todo.id)}
          style={{ marginRight: 9 }}
          disabled={todo.completed}
        />
        {editingId === todo.id ? (
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={todo.completed}
          />
        ) : (
          <Typography.Text
            delete={todo.completed}
            style={{
              color: isExpired ? "red" : todo.completed ? "#999" : "#000",
            }}
          >
            {todo.text}
          </Typography.Text>
        )}
      </div>

      <div className="todo-actions">
        {!todo.completed && editingId !== todo.id && (
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => setEditingId(todo.id)}
          />
        )}
      </div>
    </List.Item>
  );
}
