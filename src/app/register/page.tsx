'use client';

import { Card, Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import './page.scss';
import { register } from '@/api/backend/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title } = Typography;

export default function Register() {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    const onFinish = async (values: any) => {
        try {
            await register({ email: values.email, password: values.password });
            messageApi.success('Đăng ký thành công! Vui lòng đăng nhập.');
            router.push('/login');
        } catch (error: any) {
            messageApi.error(error.message || 'Email đã tồn tại hoặc lỗi khi đăng ký!');
        }
    };

    return (
        <div className="register-container">
            {contextHolder}
            <Card className="register-card" bordered={false}>
                <div className="logo">
                    <img src="/images/logo1.png" alt="App Logo" />
                </div>
                <Title level={3}>Tạo tài khoản</Title>

                <Form form={form} name="register" layout="vertical" onFinish={onFinish} className="register-form">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            ĐĂNG KÝ
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