'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { getTodos, updateTodo, deleteTodo, deleteManyTodos, PagedResponse, TodoResponse, TodoRequest } from '@/api/TodoApi';
import { jwtDecode } from 'jwt-decode';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS, MUTATION_KEYS } from '@/constants/queryKeys';

const { Title } = Typography;

interface DecodedToken {
  exp: number;
}

export default function TodoApp() {
  const { todos, filter, setTodos, editTodo, removeTodo, completeMany } = useTodoStore();
  const { token, isAuthenticated, clearToken } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();

  // State cho modal, edit, select
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'save' | 'delete' | null>(null);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [deleteIds, setDeleteIds] = useState<number[] | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  // State phân trang, tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: todosData, isLoading: todosLoading } = useQuery<PagedResponse<TodoResponse>>({
    queryKey: [QUERY_KEYS.TODOS, { page, pageSize, searchTerm, filter }],
    queryFn: () => getTodos(page, pageSize, searchTerm, filter, undefined),
    enabled: !!token && isAuthenticated,
  });

  useEffect(() => {
    if (todosData) {
      let result = todosData.content;
      if (filter === 'expired') {
        result = result.filter(
          (todo) =>
            todo.deadline &&
            new Date(todo.deadline) < new Date() &&
            !todo.completed
        );
        setTodos(result);
        setTotalElements(result.length);
      } else {
        setTodos(result);
        setTotalElements(todosData.totalElements);
      }
    }
  }, [todosData, filter, setTodos]);

  // Kiểm tra token hết hạn
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setTodos([]);
      return;
    }

    const checkToken = () => {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        clearToken();
        router.push('/login');
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 10 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, token, clearToken, router, setTodos]);

  // Mutations
  const updateMutation = useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_TODO],
    mutationFn: ({ id, data }: { id: number; data: TodoRequest }) => updateTodo(id, data),
    onSuccess: (updatedTodo) => {
      editTodo(currentId!, updatedTodo.text, updatedTodo.deadline, updatedTodo.priority);
      setEditingId(null);
      setModalOpen(false);
      setCurrentId(null);
      setModalType(null);
      messageApi.success('Sửa công việc thành công!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
    },
    onError: (error: any) => {
      messageApi.error(error.message || 'Không thể cập nhật công việc');
    },
  });

  const deleteMutation = useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_TODO],
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => {
      removeTodo(deleteIds![0]);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteIds![0]));
      setDeleteIds(null);
      setModalOpen(false);
      setModalType(null);
      messageApi.success('Xóa công việc thành công!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
    },
    onError: (error: any) => {
      messageApi.error(error.message || 'Không thể xóa công việc');
    },
  });

  const deleteManyMutation = useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_MANY_TODOS],
    mutationFn: (ids: number[]) => deleteManyTodos(ids),
    onSuccess: () => {
      deleteIds!.forEach((id) => removeTodo(id));
      setSelectedIds((prev) => prev.filter((id) => !deleteIds!.includes(id)));
      setDeleteIds(null);
      setModalOpen(false);
      setModalType(null);
      messageApi.success('Xóa công việc thành công!');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
    },
    onError: (error: any) => {
      messageApi.error(error.message || 'Không thể xóa nhiều công việc');
    },
  });

  // Chọn/ bỏ chọn todo
  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Bắt đầu edit
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

  // Xác nhận lưu edit
  const handleSaveConfirm = () => {
    if (!currentId) return;
    updateMutation.mutate({ id: currentId, data: { text: inputValue } });
  };

  // Xác nhận xóa
  const handleDeleteConfirm = () => {
    if (!deleteIds) return;
    if (deleteIds.length === 1) {
      deleteMutation.mutate(deleteIds[0]);
    } else {
      deleteManyMutation.mutate(deleteIds);
    }
  };

  // Map màu priority
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
          checked={selectedIds.length === todos.length && todos.length > 0}
          indeterminate={selectedIds.length > 0 && selectedIds.length < todos.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(todos.map((todo) => todo.id));
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
      sorter: (a: ITodo, b: ITodo) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      render: (date: string | null, todo: ITodo) => {
        if (!date) return '.  .  .';
        const isExpired = new Date(date) < new Date() && !todo.completed;
        return (
          <span style={{ color: isExpired ? 'red' : '#000' }}>
            {new Date(date).toLocaleString('vi-VN')}
          </span>
        );
      },
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      sorter: (a: ITodo, b: ITodo) =>
        priorityOrder[a.priority] - priorityOrder[b.priority],
      render: (priority: ITodo['priority']) => {
        const colorMap: Record<ITodo['priority'], string> = {
          Low: '#52c41a',
          Medium: '#1890ff',
          High: '#faad14',
          Urgent: '#f5222d',
        };
        return (
          <span style={{ color: colorMap[priority], fontWeight: 'bold' }}>
            {priority === 'Low'
              ? 'Thấp'
              : priority === 'Medium'
                ? 'Trung bình'
                : priority === 'High'
                  ? 'Cao'
                  : 'Khẩn cấp'}
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
            <Button
              type="link"
              icon={<SaveOutlined />}
              onClick={() => openSaveModal(todo.id)}
              loading={updateMutation.isPending}
            />
          ) : (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(todo)}
              disabled={todo.completed}
            />
          )}
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => openDeleteModal(todo.id)}
            loading={deleteMutation.isPending || deleteManyMutation.isPending}
          />
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
          dataSource={todos}
          loading={todosLoading}
          pagination={{
            current: page + 1,
            pageSize,
            total: totalElements,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showQuickJumper: true,
            position: ['bottomCenter'],
            onChange: (p, size) => {
              setPage(p - 1);
              setPageSize(size);
            },
          }}
        />
        <ConfirmModal
          open={modalOpen}
          confirmLoading={updateMutation.isPending || deleteMutation.isPending || deleteManyMutation.isPending}
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