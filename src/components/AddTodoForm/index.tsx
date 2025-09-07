import { Button, Input, Space } from 'antd'
import React, { useState } from 'react'
import { useTodoStore } from '@/store/todoStore';
function AddTodoForm() {
  const [newTodo, setNewTodo] = useState('');
  const { addTodo } = useTodoStore();
  const handleAdd = () => {
    if (!newTodo.trim()) return;
    addTodo(newTodo);
    setNewTodo('');
  };
  
  return (
    <Space.Compact className="todo-input-group">
      <Input
        placeholder="Nhập công việc..."
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onPressEnter={handleAdd}
      />
      <Button type="primary" onClick={handleAdd}>Thêm</Button>
    </Space.Compact>
  )
}

export default AddTodoForm