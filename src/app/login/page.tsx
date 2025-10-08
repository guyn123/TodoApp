'use client';

import { Card, Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './page.scss';
import { login, LoginRequest } from '@/api/AuthApi';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { MUTATION_KEYS } from '@/constants/queryKeys';
import { useTranslation } from 'react-i18next';


const { Title, Text } = Typography;

export default function Login() {
    const [messageApi, contextHolder] = message.useMessage();
    const { setToken } = useAuthStore();
    const router = useRouter();
    const { t } = useTranslation();

    const loginMutation = useMutation({
        mutationKey: [MUTATION_KEYS.LOGIN],
        mutationFn: (data: LoginRequest) => login(data),
        onSuccess: (response) => {
            setToken(response.token);
            messageApi.success(t("auth.login.success"));
            router.push('/');
        },
        onError: (error: any) => {
            messageApi.error(error.message || t("auth.login.error"));
        },
    });

    const onFinish = (values: any) => {
        loginMutation.mutate({ email: values.email, password: values.password });
    };

    return (
        <div className="login-container">
            {contextHolder}
            <Card className="login-card" bordered={false}>
                <div className="logo">
                    <img src="/images/logo1.png" alt="App Logo" />
                </div>
                <Title level={3}>{t("auth.login.title")}</Title>
                <Text type="secondary">{t("auth.login.subtitle")}</Text>

                <Form name="login" onFinish={onFinish} layout="vertical" className="login-form">
                    <Form.Item
                        name="email"
                        label={t("auth.login.email")}
                        rules={[
                            { required: true, message: t("auth.login.emailRequired") },
                            { type: 'email', message: t("auth.login.emailInvalid") },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder={t("auth.login.emailPlaceholder")} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={t("auth.login.password")}
                        rules={[
                            { required: true, message: t("auth.login.passwordRequired") },
                            { min: 6, message: t("auth.login.passwordMin") },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder={t("auth.login.passwordPlaceholder")} />
                    </Form.Item>

                    <div className="form-options">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>{t("auth.login.remember")}</Checkbox>
                        </Form.Item>
                        <Link href="#">{t("auth.login.forgotPassword")}</Link>
                    </div>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loginMutation.isPending}>
                            {t("auth.login.submit")}
                        </Button>
                    </Form.Item>
                </Form>

                <div className="footer-text">
                    {t("auth.login.registerPrompt")} <Link href="/register">{t("auth.login.register")}</Link> /{' '}
                    <Link href="/">{t("auth.login.home")}</Link>
                </div>
            </Card>
        </div>
    );
}
