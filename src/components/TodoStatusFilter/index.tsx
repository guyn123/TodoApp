import { Select } from 'antd';
import React from 'react';
import { useTodoStore } from '@/store/todoStore';
import { useTranslation } from 'react-i18next';

function TodoStatusFilter() {
  const { filter, setFilter } = useTodoStore();
  const { t } = useTranslation();

  return (
    <div>
      <label>{t('filter.title')}</label>
      <Select
        className="todo-filter"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: t('filter.all') },
          { value: 'active', label: t('filter.active') },
          { value: 'completed', label: t('filter.completed') },
          { value: 'expired', label: t('filter.expired') },
        ]}
      />
    </div>
  );
}

export default TodoStatusFilter;
