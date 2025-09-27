'use client';

import { Button, Input, Space, DatePicker, Select } from 'antd';
import React, { useState } from 'react';
import { useTodoStore } from '@/store/todoStore';
import { useAuthStore } from '@/store/authStore';
import dayjs from 'dayjs';
import './index.scss';
import { createTodo, TodoRequest } from '@/api/TodoApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MUTATION_KEYS, QUERY_KEYS } from '@/constants/queryKeys';

const { Option } = Select;

function AddTodoForm({ messageApi }: { messageApi: any }) {
  const [newTodo, setNewTodo] = useState('');
  const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Low');
  const { addTodo } = useTodoStore();
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_TODO],
    mutationFn: (data: TodoRequest) => createTodo(data),
    onSuccess: (todo) => {
      addTodo(todo);
      setNewTodo('');
      setDeadline(null);
      setPriority('Low');
      messageApi.success('Thêm công việc thành công!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
    },
    onError: (error: any) => {
      messageApi.error(error.message || 'Không thể thêm công việc');
    },
  });

  const handleAdd = () => {
    if (!newTodo.trim()) {
      messageApi.error('Vui lòng nhập thông tin!');
      return;
    }
    if (!token) {
      messageApi.error('Vui lòng đăng nhập!');
      return;
    }
    createMutation.mutate({ text: newTodo, deadline: deadline ? deadline.toISOString() : null, priority });
  };

  return (
    <Space.Compact className="todo-input-group" style={{ width: '100%' }}>
      <Input
        placeholder="Nhập công việc..."
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onPressEnter={handleAdd}
        style={{ width: '35%' }}
      />
      <DatePicker
        placeholder="Deadline"
        value={deadline}
        onChange={(val) => setDeadline(val)}
        style={{ width: '35%' }}
        showTime
        format="DD/MM/YYYY HH:mm"
      />
      <Select
        value={priority}
        onChange={(val) => setPriority(val)}
        style={{ width: '20%' }}
      >
        <Option value="Low">Thấp</Option>
        <Option value="Medium">Trung bình</Option>
        <Option value="High">Cao</Option>
        <Option value="Urgent">Khẩn cấp</Option>
      </Select>
      <Button type="primary" onClick={handleAdd} loading={createMutation.isPending}>
        Thêm
      </Button>
    </Space.Compact>
  );
}

export default AddTodoForm;