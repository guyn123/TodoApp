"use client";

import { Card, Form, Input, Button, Typography, DatePicker, Radio } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import "./page.scss";
import GenderSelector from "@/components/GenderSelector";
import Link from "next/link";

const { Title } = Typography;

export default function Register() {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log("Register values:", values);
    };

    return (
        <div className="register-container">
            <Card className="register-card" bordered={false}>
                <div className="logo">
                    <img src="/images/logo1.png" alt="App Logo" />
                </div>

                <Title level={3}>Create Account</Title>

                <Form
                    form={form}
                    name="register"
                    layout="vertical"
                    onFinish={onFinish}
                    className="register-form"
                >
                    {/* Họ tên */}
                    <Form.Item
                        name="fullName"
                        label="Họ tên"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                    </Form.Item>

                    {/* Số điện thoại */}
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
                            { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải đủ 10 số" },
                        ]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    {/* Mật khẩu */}
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    {/* Xác nhận mật khẩu */}
                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={["password"]}
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu không khớp"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
                    </Form.Item>

                    {/* Giới tính */}
                    <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                    >
                        <GenderSelector />
                    </Form.Item>

                    {/* Ngày sinh */}
                    <Form.Item
                        name="dob"
                        label="Ngày sinh"
                        rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
                    >
                        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                    </Form.Item>

                    {/* Địa chỉ */}
                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                    >
                        <Input prefix={<HomeOutlined />} placeholder="Nhập địa chỉ" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
                <div className="footer-text">
                    Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
                </div>
            </Card>
        </div>
    );
}
