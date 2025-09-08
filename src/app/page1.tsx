"use client";

import { useState } from "react";
import { Card, List, Typography, Divider, message } from "antd";
import "./index.scss";
import TodoItem from "@/components/TodoItem/index1";
import AddTodoForm from "@/components/AddTodoForm";
import { useTodoStore } from "@/store/todoStore1";
import TodoStatusFilter from "@/components/TodoStatusFilter";

const { Title } = Typography;

export default function TodoApp() {
    const { todos, filter } = useTodoStore();
    const [editingId, setEditingId] = useState<string | null>(null);


    const filteredTodos = todos.filter((todo) => {
        if (filter === "active") return !todo.completed;
        if (filter === "completed") return todo.completed;
        return true;
    });

    // thông báo thành công
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <div className="todo-container">
            {contextHolder}
            <Card className="todo-card">
                <Title level={2} className="todo-title">📝 Todo App</Title>
                <Divider />
                <AddTodoForm />
                <TodoStatusFilter />
                <List
                    className="todo-list"
                    bordered
                    dataSource={filteredTodos}
                    renderItem={(todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            editingId={editingId}
                            setEditingId={setEditingId}
                            messageApi={messageApi}
                        />
                    )}
                />
            </Card>
        </div>
    );
}
