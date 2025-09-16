"use client";

import { Card, Form, Input, Button, Checkbox, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./page.scss";

const { Title, Text, Link } = Typography;

export default function Login() {
    // Xử lý khi submit form
    const onFinish = (values: any) => {
        console.log("Login form values:", values);
    };

    return (
        <div className="login-container">
            <Card className="login-card" bordered={false}>

                <div className="logo">
                    <img src="/images/logo1.png" alt="App Logo" />
                </div>

                <Title level={3}>Sign in</Title>
                <Text type="secondary">to continue to your account</Text>


                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    className="login-form"
                >

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Please enter a valid email address" }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter your email"
                        />
                    </Form.Item>


                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: "Password is required" },
                            { min: 6, message: "Password must be at least 6 characters" }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                        />
                    </Form.Item>


                    <div className="form-options">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Keep me signed in</Checkbox>
                        </Form.Item>
                        <Link href="#">Forgot password?</Link>
                    </div>


                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            SIGN IN
                        </Button>
                    </Form.Item>
                </Form>


                <div className="footer-text">
                    Chưa có tài khoản?
                    <Link href="/register">Tạo tài khoản</Link>/
                    <Link href="/">Home</Link>
                </div>

            </Card>
        </div>
    );
}
