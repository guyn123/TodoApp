// "use client";

// import React, { useState } from "react";
// import { List, Button, Input, Typography, Checkbox, Modal } from "antd";
// import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import "./style.scss";
// import { ITodo, useTodoStore } from "@/store/todoStore";
// import ConfirmModal from "../ComfirmModal";

// interface ITodoItemProps {
//   todo: ITodo;
//   editingId: string | null;
//   setEditingId: (id: string | null) => void;
//   messageApi: any;
// }

// export default function TodoItem({
//   todo,
//   editingId,
//   setEditingId,
//   messageApi,
// }: ITodoItemProps) {
//   const { toggleTodo, removeTodo, editTodo } = useTodoStore();
//   const [inputValue, setInputValue] = useState(todo.text);

//   //modal state
//   const [open, setOpen] = useState(false);
//   const [confirmLoading, setConfirmLoading] = useState(false);
//   const [modalText, setModalText] = useState("");
//   const [actionType, setActionType] = useState<"save" | "delete" | null>(null);

//   // mởmodal lưu
//   const showSaveModal = () => {
//     setModalText("Bạn có muốn lưu công việc này không?");
//     setActionType("save");
//     setOpen(true);
//   };

//   // mở modal xóa
//   const showDeleteModal = () => {
//     setModalText("Bạn có chắc muốn xóa công việc này không?");
//     setActionType("delete");
//     setOpen(true);
//   };

//   // bấm Có
//   const handleOk = () => {
//     setConfirmLoading(true);

//     if (actionType === "save") {
//       editTodo(todo.id, inputValue);
//       setEditingId(null);
//       messageApi.success("Bạn đã sửa công việc thành công!");
//     }
//     if (actionType === "delete") {
//       removeTodo(todo.id);
//       messageApi.success("Bạn đã xóa công việc thành công!");
//     }

//     setTimeout(() => {
//       setOpen(false);
//       setConfirmLoading(false);
//       setActionType(null);
//     }, 100);
//   };

//   // bấm Không
//   const handleCancel = () => {
//     setOpen(false);
//     setActionType(null);
//   };

//   return (
//     <>
//       <List.Item className={`todo-item ${todo.completed ? "completed" : ""}`}>
//         <div className="todo-left">
//           <Checkbox
//             checked={todo.completed}
//             onChange={() => toggleTodo(todo.id)}
//             style={{ marginRight: 9 }}
//           />
//           {editingId === todo.id ? (
//             <Input
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onPressEnter={showSaveModal}
//             />
//           ) : (
//             <Typography.Text className="todo-text">{todo.text}</Typography.Text>
//           )}
//         </div>

//         <div className="todo-actions">
//           {editingId === todo.id ? (
//             <Button type="link" onClick={showSaveModal}>
//               Lưu
//             </Button>
//           ) : (
//             !todo.completed && (
//               <Button
//                 type="link"
//                 icon={<EditOutlined />}
//                 onClick={() => setEditingId(todo.id)}
//               />
//             )
//           )}

//           {/* {editingId === todo.id ? null : <Button
//             type="link"
//             danger
//             icon={<DeleteOutlined />}
//             onClick={showDeleteModal}
//           />} */}
//           {editingId !== todo.id && <Button
//             type="link"
//             danger
//             icon={<DeleteOutlined />}
//             onClick={showDeleteModal}
//           />}

//         </div>
//       </List.Item>


//       {/* Sử dụng ConfirmModal */}
//       <ConfirmModal
//         open={open}
//         confirmLoading={confirmLoading}
//         modalText={modalText}
//         onConfirm={handleOk}
//         onCancel={handleCancel}
//       />
//     </>
//   );
// }
