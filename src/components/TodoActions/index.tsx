'use client';

import { FC } from 'react';
import { Button, Space, message } from 'antd';
import { ITodo } from '@/store/todoStore';
import { useAuthStore } from '@/store/authStore';
import { updateTodo, TodoRequest } from '@/api/TodoApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MUTATION_KEYS, QUERY_KEYS } from '@/constants/queryKeys';

interface TodoActionsProps {
    todos: ITodo[];
    selectedIds: number[];
    setSelectedIds: (ids: number[]) => void;
    completeMany: (ids: number[]) => void;
    openDeleteModal: (id: number | number[]) => void;
}

const TodoActions: FC<TodoActionsProps> = ({
    todos,
    selectedIds,
    setSelectedIds,
    completeMany,
    openDeleteModal,
}) => {
    const { token } = useAuthStore();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();

    const completeManyMutation = useMutation({
        mutationKey: [MUTATION_KEYS.COMPLETE_MANY_TODOS],
        mutationFn: (incompleteIds: number[]) =>
            Promise.all(
                incompleteIds.map((id) => {
                    const todo = todos.find((t) => t.id === id);
                    if (!todo) return Promise.resolve();
                    return updateTodo(id, {
                        text: todo.text,
                        completed: true,
                        deadline: todo.deadline,
                        priority: todo.priority,
                    } as TodoRequest);
                })
            ),
        onSuccess: (_, incompleteIds) => {
            completeMany(incompleteIds);
            setSelectedIds([]);
            messageApi.success('Hoàn thành công việc thành công!');
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
        },
        onError: (error: any) => {
            messageApi.error(error.message || 'Không thể hoàn thành công việc!');
        },
    });

    const handleCompleteMany = () => {
        if (!token) {
            messageApi.error('Vui lòng đăng nhập!');
            return;
        }
        const incompleteIds = selectedIds.filter((id) => {
            const todo = todos.find((t) => t.id === id);
            return todo && !todo.completed;
        });
        if (incompleteIds.length === 0) {
            messageApi.info('Không có công việc nào để hoàn thành!');
            return;
        }
        completeManyMutation.mutate(incompleteIds);
    };

    const handleDeleteMany = () => {
        if (selectedIds.length === 1) {
            openDeleteModal(selectedIds[0]);
        } else {
            openDeleteModal(selectedIds);
        }
    };

    const canComplete = selectedIds.some((id) => todos.find((todo) => todo.id === id && !todo.completed));

    return (
        <>
            {contextHolder}
            <Space style={{ display: 'flex', justifyContent: 'flex-end', margin: '16px 0' }}>
                <Button type="primary" disabled={!canComplete} onClick={handleCompleteMany} loading={completeManyMutation.isPending}>
                    Hoàn thành
                </Button>
                <Button danger disabled={selectedIds.length === 0} onClick={handleDeleteMany}>
                    Xóa
                </Button>
            </Space>
        </>
    );
};

export default TodoActions;