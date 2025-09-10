// "use client";

// import React, { useState } from "react";
// import { Table, Checkbox, Input, Button, Space, message as Message } from "antd";
// import { EditOutlined, SaveOutlined, DeleteOutlined } from "@ant-design/icons";
// import ConfirmModal from "./ComfirmModal";
// import { ITodo } from "@/store/todoStore";

// interface TodoTableProps {
//   todos: ITodo[];
//   selectedIds: string[];
//   setSelectedIds: (ids: string[]) => void;
//   searchTerm: string;
//   pageSize: number;
//   setPageSize: (size: number) => void;
//   messageApi: Message;
//   removeTodo: (id: string) => void;
// }

// const TodoTable: React.FC<TodoTableProps> = ({
//   todos,
//   selectedIds,
//   setSelectedIds,
//   searchTerm,
//   pageSize,
//   setPageSize,
//   messageApi,
//   removeTodo,
// }) => {
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [inputValue, setInputValue] = useState<string>("");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState<"save" | "delete" | null>(null);
//   const [currentId, setCurrentId] = useState<string | null>(null);
//   const [deleteIds, setDeleteIds] = useState<string[] | null>(null);

//   const filteredTodos = todos.filter((todo) =>
//     todo.text.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Toggle chọn
//   const handleSelect = (id: string) => {
//     setSelectedIds((prev: string[]) =>
//       prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
//     );
//   };

//   // Edit
//   const handleEdit = (todo: ITodo) => {
//     setEditingId(todo.id);
//     setInputValue(todo.text);
//   };

//   // Mở modal lưu
//   const openSaveModal = (id: string) => {
//     if (!inputValue.trim()) {
//       messageApi.error("Vui lòng nhập thông tin!");
//       return;
//     }
//     setCurrentId(id);
//     setModalType("save");
//     setModalOpen(true);
//   };

//   // Mở modal xóa
//   const openDeleteModal = (idOrIds: string | string[]) => {
//     setDeleteIds(Array.isArray(idOrIds) ? idOrIds : [idOrIds]);
//     setModalType("delete");
//     setModalOpen(true);
//   };

//   const handleSaveConfirm = () => {
//     if (!currentId) return;
//     // editTodo phải được truyền từ parent nếu dùng store
//     // Ví dụ: editTodo(currentId, inputValue)
//     setEditingId(null);
//     setModalOpen(false);
//     setCurrentId(null);
//     setModalType(null);
//     messageApi.success("Sửa công việc thành công!");
//   };

//   const handleDeleteConfirm = () => {
//     if (!deleteIds) return;
//     deleteIds.forEach((id) => removeTodo(id));
//     setSelectedIds((prev) => prev.filter((id) => !deleteIds.includes(id)));
//     setDeleteIds(null);
//     setModalOpen(false);
//     setModalType(null);
//     messageApi.success("Xóa công việc thành công!");
//   };

//   const priorityOrder: Record<string, number> = {
//     Low: 1,
//     Medium: 2,
//     High: 3,
//     Urgent: 4,
//   };

//   const columns = [
//     {
//       title: (
//         <Checkbox
//           checked={selectedIds.length === filteredTodos.length && filteredTodos.length > 0}
//           indeterminate={selectedIds.length > 0 && selectedIds.length < filteredTodos.length}
//           onChange={(e) =>
//             e.target.checked
//               ? setSelectedIds(filteredTodos.map((t) => t.id))
//               : setSelectedIds([])
//           }
//         >
//           Chọn
//         </Checkbox>
//       ),
//       dataIndex: "id",
//       width: 60,
//       render: (id: string) => (
//         <Checkbox checked={selectedIds.includes(id)} onChange={() => handleSelect(id)} />
//       ),
//     },
//     {
//       title: "Công việc",
//       dataIndex: "text",
//       render: (_: string, todo: ITodo) =>
//         editingId === todo.id ? (
//           <Input
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onPressEnter={() => openSaveModal(todo.id)}
//           />
//         ) : (
//           <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
//             {todo.text}
//           </span>
//         ),
//     },
//     {
//       title: "Hành động",
//       dataIndex: "id",
//       width: 120,
//       render: (_: string, todo: ITodo) => (
//         <Space>
//           {editingId === todo.id ? (
//             <Button type="link" icon={<SaveOutlined />} onClick={() => openSaveModal(todo.id)} />
//           ) : (
//             <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(todo)} disabled={todo.completed} />
//           )}
//           <Button type="link" danger icon={<DeleteOutlined />} onClick={() => openDeleteModal(todo.id)} />
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Table
//         bordered
//         rowKey="id"
//         columns={columns}
//         dataSource={filteredTodos}
//         pagination={{
//           pageSize,
//           showSizeChanger: true,
//           pageSizeOptions: ["5", "10", "20"],
//           showQuickJumper: true,
//           onShowSizeChange: (_current, size) => setPageSize(size),
//         }}
//       />
//       <ConfirmModal
//         open={modalOpen}
//         confirmLoading={false}
//         modalText={
//           modalType === "save"
//             ? "Bạn có muốn lưu công việc này không?"
//             : `Bạn có chắc muốn xóa ${deleteIds?.length || 0} công việc không?`
//         }
//         onConfirm={modalType === "save" ? handleSaveConfirm : handleDeleteConfirm}
//         onCancel={() => {
//           setModalOpen(false);
//           setModalType(null);
//           setCurrentId(null);
//           setDeleteIds(null);
//         }}
//       />
//     </>
//   );
// };

// export default TodoTable;
