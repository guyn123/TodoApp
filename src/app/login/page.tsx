'use client';

import { Card, Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './page.scss';
import { login } from '@/api/backend/auth';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function Login() {
    const [messageApi, contextHolder] = message.useMessage();
    const { setToken } = useAuthStore();
    const router = useRouter();

    const onFinish = async (values: any) => {
        try {
            const response = await login({ email: values.email, password: values.password });
            setToken(response.token);
            messageApi.success('Đăng nhập thành công!');
            router.push('/');
        } catch (error: any) {
            messageApi.error(error.message || 'Email hoặc mật khẩu không đúng!');
        }
    };

    return (
        <div className="login-container">
            {contextHolder}
            <Card className="login-card" bordered={false}>
                <div className="logo">
                    <img src="/images/logo1.png" alt="App Logo" />
                </div>
                <Title level={3}>Đăng nhập</Title>
                <Text type="secondary">Để tiếp tục truy cập tài khoản của bạn</Text>

                <Form name="login" onFinish={onFinish} layout="vertical" className="login-form">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Nhập email" />
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

                    <div className="form-options">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Duy trì đăng nhập</Checkbox>
                        </Form.Item>
                        <Link href="#">Quên mật khẩu?</Link>
                    </div>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            ĐĂNG NHẬP
                        </Button>
                    </Form.Item>
                </Form>

                <div className="footer-text">
                    Chưa có tài khoản? <Link href="/register">Tạo tài khoản</Link> /{' '}
                    <Link href="/">Trang chủ</Link>
                </div>
            </Card>
        </div>
    );
}