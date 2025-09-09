import { Button, Input, Space, DatePicker } from 'antd';
import React, { useState } from 'react';
import { useTodoStore } from '@/store/todoStore';
import dayjs from 'dayjs';

function AddTodoForm() {
  const [newTodo, setNewTodo] = useState('');
  const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);
  const { addTodo } = useTodoStore();

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    addTodo(newTodo, deadline ? deadline.toISOString() : null);
    setNewTodo('');
    setDeadline(null);
  };

  return (
    <Space.Compact className="todo-input-group" style={{ width: '100%' }}>
      <Input
        placeholder="Nhập công việc..."
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onPressEnter={handleAdd}
        style={{ width: '50%' }}
      />
      <DatePicker
        placeholder="Deadline"
        value={deadline}
        onChange={(val) => setDeadline(val)}
        style={{ width: '50%' }}
        showTime
      />
      <Button type="primary" onClick={handleAdd}>
        Thêm
      </Button>
    </Space.Compact>
  );
}

export default AddTodoForm;
