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
import { useTranslation } from 'react-i18next';

const { Option } = Select;

function AddTodoForm({ messageApi }: { messageApi: any }) {
  const [newTodo, setNewTodo] = useState('');
  const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Low');
  const { addTodo } = useTodoStore();
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const createMutation = useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_TODO],
    mutationFn: (data: TodoRequest) => createTodo(data),
    onSuccess: (todo) => {
      addTodo(todo);
      setNewTodo('');
      setDeadline(null);
      setPriority('Low');
      messageApi.success(t('todo.addSuccess'));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
    },
    onError: (error: any) => {
      messageApi.error(error.message || t('todo.addError'));
    },
  });

  const handleAdd = () => {
    if (!newTodo.trim()) {
      messageApi.error(t('todo.required'));
      return;
    }
    if (!token) {
      messageApi.error(t('todo.loginRequired'));
      return;
    }
    createMutation.mutate({ text: newTodo, deadline: deadline ? deadline.toISOString() : null, priority });
  };

  return (
    <Space.Compact className="todo-input-group" style={{ width: '100%' }}>
      <Input
        placeholder={t('todo.inputPlaceholder')}
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onPressEnter={handleAdd}
        style={{ width: '35%' }}
      />
      <DatePicker
        placeholder={t('todo.deadline')}
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
        <Option value="Low">{t('todo.priority.low')}</Option>
        <Option value="Medium">{t('todo.priority.medium')}</Option>
        <Option value="High">{t('todo.priority.high')}</Option>
        <Option value="Urgent">{t('todo.priority.urgent')}</Option>
      </Select>
      <Button type="primary" onClick={handleAdd} loading={createMutation.isPending}>
        {t('todo.addButton')}
      </Button>
    </Space.Compact>
  );
}

export default AddTodoForm;
