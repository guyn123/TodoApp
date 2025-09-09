"use client";

import { FC } from "react";
import { Button, Space } from "antd";
import { ITodo } from "@/store/todoStore";

interface TodoActionsProps {
    todos: ITodo[];
    selectedIds: string[];
    setSelectedIds: (ids: string[]) => void;
    completeMany: (ids: string[]) => void;
    removeTodo: (id: string) => void;
    openDeleteModal: (id: string | string[]) => void;
}

const TodoActions: FC<TodoActionsProps> = ({
    todos,
    selectedIds,
    setSelectedIds,
    completeMany,
    openDeleteModal,
}) => {
    const handleCompleteMany = () => {
        const incompleteIds = selectedIds.filter((id) => {
            const todo = todos.find((t) => t.id === id);
            return todo && !todo.completed;
        });
        if (incompleteIds.length === 0) return;
        completeMany(incompleteIds);
        setSelectedIds([]);
    };

    const handleDeleteMany = () => {
        if (selectedIds.length === 1) {
            openDeleteModal(selectedIds[0]);
        } else if (selectedIds.length > 1) {
            openDeleteModal(selectedIds);
        }
    };

    const canComplete = selectedIds.some(
        (id) => todos.find((todo) => todo.id === id && !todo.completed)
    );

    return (
        <Space style={{ display: "flex", justifyContent: "flex-end", margin: "16px 0" }}>
            <Button type="primary" disabled={!canComplete} onClick={handleCompleteMany}>
                Hoàn thành
            </Button>
            <Button danger disabled={selectedIds.length === 0} onClick={handleDeleteMany}>
                Xóa
            </Button>
        </Space>
    );
};

export default TodoActions;
