import { Select } from 'antd';
import React from 'react';
import { useTodoStore } from '@/store/todoStore';

function TodoStatusFilter() {
  const { filter, setFilter } = useTodoStore();
  return (
    <Select
      className="todo-filter"
      value={filter}
      onChange={setFilter}
      options={[
        { value: 'all', label: 'Tất cả' },
        { value: 'active', label: 'Chưa hoàn thành' },
        { value: 'completed', label: 'Đã hoàn thành' },
        { value: 'expired', label: 'Đã hết hạn' },
      ]}
    />
  );
}

export default TodoStatusFilter;
