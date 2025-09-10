import { Button, Input, Space, DatePicker, Select } from "antd";
import React, { useState } from "react";
import { useTodoStore } from "@/store/todoStore";
import dayjs from "dayjs";
import "./index.scss";

const { Option } = Select;

function AddTodoForm({ messageApi }: { messageApi: any }) {
  const [newTodo, setNewTodo] = useState("");
  const [deadline, setDeadline] = useState<dayjs.Dayjs | null>(null);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Low");
  const { addTodo } = useTodoStore();

  const handleAdd = () => {
    if (!newTodo.trim()) {
      messageApi.error("Vui lòng nhập thông tin!");
      return;
    }
    addTodo(newTodo, deadline ? deadline.toISOString() : null, priority);
    setNewTodo("");
    setDeadline(null);
    setPriority("Low");
    messageApi.success("Thêm công việc thành công!");
  };

  return (
    <Space.Compact className="todo-input-group" style={{ width: "100%" }}>
      <Input
        placeholder="Nhập công việc..."
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onPressEnter={handleAdd}
        style={{ width: "35%" }}
      />
      <DatePicker
        placeholder="Deadline"
        value={deadline}
        onChange={(val) => setDeadline(val)}
        style={{ width: "35%", }}
        showTime
      />
      <Select
        value={priority}
        onChange={(val) => setPriority(val)}
        style={{ width: "20%", }}
      >
        <Option value="Low">Thấp</Option>
        <Option value="Medium">Trung bình</Option>
        <Option value="High">Cao</Option>
        <Option value="Urgent">Khẩn cấp</Option>
      </Select>
      <Button type="primary" onClick={handleAdd}>
        Thêm
      </Button>
    </Space.Compact>
  );
}
<style jsx>{`
  .ant-select-selector {
    border-radius: 10px !important;
  }
`}</style>

export default AddTodoForm;
