// 'use client';

// import { Table, Checkbox, Input, Button, Space } from 'antd';
// import { EditOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
// import { ITodo } from '@/store/todoStore'; // Import type nếu cần

// interface TodoTableProps {
//     filteredTodos: ITodo[];
//     selectedIds: number[];
//     onSelectTodo: (id: number) => void;
//     onSelectAllFiltered: () => void;
//     onDeselectAll: () => void;
//     editingId: number | null;
//     inputValue: string;
//     onInputChange: (value: string) => void;
//     onEditTodo: (todo: ITodo) => void;
//     onOpenSaveModal: (id: number) => void;
//     onOpenDeleteModal: (id: number | number[]) => void;
//     pageSize: number;
//     onPageSizeChange: (size: number) => void;
// }

// export default function TodoTable({
//     filteredTodos,
//     selectedIds,
//     onSelectTodo,
//     onSelectAllFiltered,
//     onDeselectAll,
//     editingId,
//     inputValue,
//     onInputChange,
//     onEditTodo,
//     onOpenSaveModal,
//     onOpenDeleteModal,
//     pageSize,
//     onPageSizeChange,
// }: TodoTableProps) {
//     const priorityOrder: Record<string, number> = {
//         Low: 1,
//         Medium: 2,
//         High: 3,
//         Urgent: 4,
//     };

//     const columns = [
//         {
//             title: (
//                 <Checkbox
//                     checked={selectedIds.length === filteredTodos.length && filteredTodos.length > 0}
//                     indeterminate={selectedIds.length > 0 && selectedIds.length < filteredTodos.length}
//                     onChange={(e) => {
//                         if (e.target.checked) {
//                             onSelectAllFiltered();
//                         } else {
//                             onDeselectAll();
//                         }
//                     }}
//                 >
//                     Chọn
//                 </Checkbox>
//             ),
//             dataIndex: 'id',
//             width: 60,
//             render: (id: number) => (
//                 <Checkbox checked={selectedIds.includes(id)} onChange={() => onSelectTodo(id)} />
//             ),
//         },
//         {
//             title: 'Công việc',
//             dataIndex: 'text',
//             className: 'todo-text',
//             render: (_: string, todo: ITodo) =>
//                 editingId === todo.id ? (
//                     <Input
//                         value={inputValue}
//                         onChange={(e) => onInputChange(e.target.value)}
//                         onPressEnter={() => onOpenSaveModal(todo.id)}
//                     />
//                 ) : (
//                     <span
//                         style={{
//                             color:
//                                 todo.deadline && new Date(todo.deadline) < new Date() && !todo.completed
//                                     ? 'red'
//                                     : todo.completed
//                                         ? '#999'
//                                         : '#000',
//                             textDecoration: todo.completed ? 'line-through' : 'none',
//                         }}
//                     >
//                         {todo.text}
//                     </span>
//                 ),
//         },
//         {
//             title: 'Ngày tạo',
//             dataIndex: 'createdAt',
//             sorter: (a: ITodo, b: ITodo) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
//             render: (date: string) => new Date(date).toLocaleString('vi-VN'),
//         },
//         {
//             title: 'Deadline',
//             dataIndex: 'deadline',
//             render: (date: string | null, todo: ITodo) => {
//                 if (!date) return '.  .  .';
//                 const isExpired = new Date(date) < new Date() && !todo.completed;
//                 return <span style={{ color: isExpired ? 'red' : '#000' }}>{new Date(date).toLocaleString('vi-VN')}</span>;
//             },
//         },
//         {
//             title: 'Ưu tiên',
//             dataIndex: 'priority',
//             sorter: (a: ITodo, b: ITodo) => priorityOrder[a.priority] - priorityOrder[b.priority],
//             render: (priority: ITodo['priority']) => {
//                 const colorMap: Record<ITodo['priority'], string> = {
//                     Low: '#52c41a',
//                     Medium: '#1890ff',
//                     High: '#faad14',
//                     Urgent: '#f5222d',
//                 };
//                 return (
//                     <span style={{ color: colorMap[priority], fontWeight: 'bold' }}>
//                         {priority === 'Low' ? 'Thấp' : priority === 'Medium' ? 'Trung bình' : priority === 'High' ? 'Cao' : 'Khẩn cấp'}
//                     </span>
//                 );
//             },
//         },
//         {
//             title: 'Hành động',
//             dataIndex: 'id',
//             width: 120,
//             render: (_: string, todo: ITodo) => (
//                 <Space>
//                     {editingId === todo.id ? (
//                         <Button type="link" icon={<SaveOutlined />} onClick={() => onOpenSaveModal(todo.id)} />
//                     ) : (
//                         <Button
//                             type="link"
//                             icon={<EditOutlined />}
//                             onClick={() => onEditTodo(todo)}
//                             disabled={todo.completed}
//                         />
//                     )}
//                     <Button type="link" danger icon={<DeleteOutlined />} onClick={() => onOpenDeleteModal(todo.id)} />
//                 </Space>
//             ),
//         },
//     ];

//     return (
//         <Table
//             bordered
//             rowKey="id"
//             className="todo-table"
//             columns={columns}
//             dataSource={filteredTodos}
//             pagination={{
//                 pageSize,
//                 showSizeChanger: true,
//                 pageSizeOptions: ['5', '10', '20'],
//                 showQuickJumper: true,
//                 position: ['bottomCenter'],
//                 onShowSizeChange: (_current, size) => {
//                     onPageSizeChange(size);
//                 },
//             }}
//         />
//     );
// }

