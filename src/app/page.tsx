'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Divider, Table, Input, Checkbox, Button, Space, message } from 'antd';
import { EditOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import './index.scss';
import AddTodoForm from '@/components/AddTodoForm';
import { useTodoStore, ITodo } from '@/store/todoStore';
import TodoStatusFilter from '@/components/TodoStatusFilter';
import TodoActions from '@/components/TodoActions';
import ConfirmModal from '@/components/ComfirmModal';
import SearchTodo from '@/components/SearchTodo';
import Weather from '@/components/Weather';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { getTodos, updateTodo, deleteTodo } from '@/api/backend/todo';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function TodoApp() {
  const { todos, filter, setTodos, editTodo, removeTodo, completeMany } = useTodoStore();
  const { token, isAuthenticated } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'save' | 'delete' | null>(null);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [deleteIds, setDeleteIds] = useState<number[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const router = useRouter();


  useEffect(() => {
    if (isAuthenticated && token) {
      getTodos(token)
        .then((data) => setTodos(data))
        .catch((error) => messageApi.error(error.message));
    } else {
      setTodos([]);

    }
  }, [isAuthenticated, token, setTodos, messageApi]);

  // if (!isAuthenticated) {
  //   return (
  //     <div className="todo-container">
  //       {contextHolder}
  //       <Header />
  //       <Weather />
  //     </div>
  //   );
  // }

  const filteredTodos = todos
    .filter((todo) => {
      const now = new Date();
      const isExpired = todo.deadline && new Date(todo.deadline) < now && !todo.completed;
      if (filter === 'active') return !todo.completed && !isExpired;
      if (filter === 'completed') return todo.completed;
      if (filter === 'expired') return isExpired;
      return true;
    })
    .filter((todo) => todo.text.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleEdit = (todo: ITodo) => {
    setEditingId(todo.id);
    setInputValue(todo.text);
  };

  const openSaveModal = (id: number) => {
    if (!inputValue.trim()) {
      messageApi.error('Vui lòng nhập thông tin!');
      return;
    }
    setCurrentId(id);
    setModalType('save');
    setModalOpen(true);
  };

  const openDeleteModal = (idOrIds: number | number[]) => {
    if (Array.isArray(idOrIds)) setDeleteIds(idOrIds);
    else setDeleteIds([idOrIds]);
    setModalType('delete');
    setModalOpen(true);
  };

  const handleSaveConfirm = async () => {
    if (!currentId || !token) return;
    try {
      const updatedTodo = await updateTodo(currentId, { text: inputValue }, token);
      editTodo(currentId, updatedTodo.text, updatedTodo.deadline, updatedTodo.priority);
      setEditingId(null);
      setModalOpen(false);
      setCurrentId(null);
      setModalType(null);
      messageApi.success('Sửa công việc thành công!');
    } catch (error: any) {
      messageApi.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteIds || !token) return;
    try {
      await Promise.all(deleteIds.map((id) => deleteTodo(id, token)));
      deleteIds.forEach((id) => removeTodo(id));
      setSelectedIds((prev) => prev.filter((id) => !deleteIds.includes(id)));
      setDeleteIds(null);
      setModalOpen(false);
      setModalType(null);
      messageApi.success('Xóa công việc thành công!');
    } catch (error: any) {
      messageApi.error(error.message);
    }
  };

  const priorityOrder: Record<string, number> = {
    Low: 1,
    Medium: 2,
    High: 3,
    Urgent: 4,
  };

  const columns = [
    {
      title: (
        <Checkbox
          checked={selectedIds.length === filteredTodos.length && filteredTodos.length > 0}
          indeterminate={selectedIds.length > 0 && selectedIds.length < filteredTodos.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(filteredTodos.map((todo) => todo.id));
            } else {
              setSelectedIds([]);
            }
          }}
        >
          Chọn
        </Checkbox>
      ),
      dataIndex: 'id',
      width: 60,
      render: (id: number) => (
        <Checkbox checked={selectedIds.includes(id)} onChange={() => handleSelect(id)} />
      ),
    },
    {
      title: 'Công việc',
      dataIndex: 'text',
      className: 'todo-text',
      render: (_: string, todo: ITodo) =>
        editingId === todo.id ? (
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={() => openSaveModal(todo.id)}
          />
        ) : (
          <span
            style={{
              color:
                todo.deadline && new Date(todo.deadline) < new Date() && !todo.completed
                  ? 'red'
                  : todo.completed
                    ? '#999'
                    : '#000',
              textDecoration: todo.completed ? 'line-through' : 'none',
            }}
          >
            {todo.text}
          </span>
        ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: (a: ITodo, b: ITodo) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      render: (date: string | null, todo: ITodo) => {
        if (!date) return '.  .  .';
        const isExpired = new Date(date) < new Date() && !todo.completed;
        return <span style={{ color: isExpired ? 'red' : '#000' }}>{new Date(date).toLocaleString('vi-VN')}</span>;
      },
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      sorter: (a: ITodo, b: ITodo) => priorityOrder[a.priority] - priorityOrder[b.priority],
      render: (priority: ITodo['priority']) => {
        const colorMap: Record<ITodo['priority'], string> = {
          Low: '#52c41a',
          Medium: '#1890ff',
          High: '#faad14',
          Urgent: '#f5222d',
        };
        return (
          <span style={{ color: colorMap[priority], fontWeight: 'bold' }}>
            {priority === 'Low' ? 'Thấp' : priority === 'Medium' ? 'Trung bình' : priority === 'High' ? 'Cao' : 'Khẩn cấp'}
          </span>
        );
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      width: 120,
      render: (_: string, todo: ITodo) => (
        <Space>
          {editingId === todo.id ? (
            <Button type="link" icon={<SaveOutlined />} onClick={() => openSaveModal(todo.id)} />
          ) : (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(todo)}
              disabled={todo.completed}
            />
          )}
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => openDeleteModal(todo.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="todo-container">
      {contextHolder}
      <Header />
      <Card className="todo-card">
        <Title level={2} className="todo-title">
          📝 Todo App
        </Title>
        <Weather />
        <Divider />
        <AddTodoForm messageApi={messageApi} />
        <SearchTodo onSearch={setSearchTerm} />
        <TodoStatusFilter />
        <TodoActions
          todos={todos}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          completeMany={completeMany}
          openDeleteModal={openDeleteModal}
        />
        <Table
          bordered
          rowKey="id"
          className="todo-table"
          columns={columns}
          dataSource={filteredTodos}
          pagination={{
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showQuickJumper: true,
            position: ['bottomCenter'],
            onShowSizeChange: (current, size) => {
              setPageSize(size);
            },
          }}
        />
        <ConfirmModal
          open={modalOpen}
          confirmLoading={false}
          modalText={
            modalType === 'save'
              ? 'Bạn có muốn lưu công việc này không?'
              : `Bạn có chắc muốn xóa ${deleteIds?.length || 0} công việc không?`
          }
          onConfirm={modalType === 'save' ? handleSaveConfirm : handleDeleteConfirm}
          onCancel={() => {
            setModalOpen(false);
            setModalType(null);
            setCurrentId(null);
            setDeleteIds(null);
          }}
        />
      </Card>
    </div>
  );
}