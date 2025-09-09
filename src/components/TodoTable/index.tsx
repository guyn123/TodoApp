// "use client";

// import React, { useState } from "react";
// import { Table, Checkbox, Space, Input, Button, Typography, message } from "antd";
// import { EditOutlined, SaveOutlined, DeleteOutlined } from "@ant-design/icons";
// import { ITodo, useTodoStore } from "@/store/todoStore";
// import ConfirmModal from "../ComfirmModal";

// interface ITodoTableProps {
//     todos: ITodo[];
//     selectedIds: string[];
//     setSelectedIds: (ids: string[]) => void;
// }

// export default function TodoTable({ todos, selectedIds, setSelectedIds }: ITodoTableProps) {
//     const { editTodo, removeTodo } = useTodoStore();
//     const [editingId, setEditingId] = useState<string | null>(null);
//     const [inputValue, setInputValue] = useState<string>("");
//     const [modalSaveOpen, setModalSaveOpen] = useState(false);
//     const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
//     const [currentId, setCurrentId] = useState<string | null>(null);
//     const [confirmLoading, setConfirmLoading] = useState(false);

//     const [messageApi, contextHolder] = message.useMessage();

//     const handleSelect = (id: string) => {
//         setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((sid) => sid !== id) : [...selectedIds, id]);
//     };

//     const handleEdit = (todo: ITodo) => {
//         setEditingId(todo.id);
//         setInputValue(todo.text);
//     };

//     const handleSave = () => {
//         if (currentId) {
//             editTodo(currentId, inputValue);
//             messageApi.success("Bạn đã sửa công việc thành công!");
//             setEditingId(null);
//             setModalSaveOpen(false);
//         }
//         setConfirmLoading(false);
//     };

//     const handleDelete = () => {
//         if (currentId) {
//             removeTodo(currentId);
//             messageApi.success("Đã xóa công việc thành công!");
//             setModalDeleteOpen(false);
//         }
//         setConfirmLoading(false);
//     };

//     const columns = [
//         {
//             title: "Chọn",
//             dataIndex: "id",
//             width: 60,
//             render: (id: string) => (
//                 <Checkbox checked={selectedIds.includes(id)} onChange={() => handleSelect(id)} />
//             ),
//         },
//         {
//             title: "Công việc",
//             dataIndex: "text",
//             render: (_: string, todo: ITodo) =>
//                 editingId === todo.id ? (
//                     <Input
//                         value={inputValue}
//                         onChange={(e) => setInputValue(e.target.value)}
//                         onPressEnter={() => {
//                             setCurrentId(todo.id);
//                             setModalSaveOpen(true);
//                         }}
//                     />
//                 ) : (
//                     <Typography.Text delete={todo.completed} style={{ color: todo.completed ? "#999" : "#000" }}>
//                         {todo.text}
//                     </Typography.Text>
//                 ),
//         },
//         {
//             title: "Hành động",
//             dataIndex: "id",
//             width: 140,
//             render: (_: string, todo: ITodo) => (
//                 <Space>
//                     {editingId === todo.id ? (
//                         <Button
//                             type="link"
//                             icon={<SaveOutlined />}
//                             onClick={() => {
//                                 setCurrentId(todo.id);
//                                 setModalSaveOpen(true);
//                             }}
//                         />
//                     ) : (
//                         <Button
//                             type="link"
//                             icon={<EditOutlined />}
//                             onClick={() => handleEdit(todo)}
//                             disabled={todo.completed}
//                         />
//                     )}

//                     <Button
//                         type="link"
//                         danger
//                         icon={<DeleteOutlined />}
//                         onClick={() => {
//                             setCurrentId(todo.id);
//                             setModalDeleteOpen(true);
//                         }}
//                     />
//                 </Space>
//             ),
//         },
//     ];

//     return (
//         <>
//             {contextHolder}
//             <Table rowKey="id" columns={columns} dataSource={todos} pagination={false} />

//             <ConfirmModal
//                 open={modalSaveOpen}
//                 confirmLoading={confirmLoading}
//                 modalText="Bạn có muốn lưu công việc này không?"
//                 onConfirm={handleSave}
//                 onCancel={() => setModalSaveOpen(false)}
//             />

//             <ConfirmModal
//                 open={modalDeleteOpen}
//                 confirmLoading={confirmLoading}
//                 modalText="Bạn có chắc muốn xóa công việc này không?"
//                 onConfirm={handleDelete}
//                 onCancel={() => setModalDeleteOpen(false)}
//             />
//         </>
//     );
// }
