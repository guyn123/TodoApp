'use client';

import { Card, Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import './page.scss';
import { register, RegisterRequest } from '@/api/AuthApi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { MUTATION_KEYS } from '@/constants/queryKeys';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

export default function Register() {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const { t } = useTranslation();

    const registerMutation = useMutation({
        mutationKey: [MUTATION_KEYS.REGISTER],
        mutationFn: (data: RegisterRequest) => register(data),
        onSuccess: () => {
            messageApi.success(t('auth.register.success'));
            router.push('/login');
        },
        onError: () => {
            messageApi.error(t('auth.register.error'));
        },
    });

    const onFinish = (values: any) => {
        registerMutation.mutate({ email: values.email, password: values.password });
    };

    return (
        <div className="register-container">
            {contextHolder}
            <Card className="register-card" bordered={false}>
                <div className="logo">
                    <img src="/images/logo1.png" alt="App Logo" />
                </div>
                <Title level={3}>{t('auth.register.title')}</Title>

                <Form form={form} name="register" layout="vertical" onFinish={onFinish} className="register-form">
                    <Form.Item
                        name="email"
                        label={t('auth.register.email')}
                        rules={[
                            { required: true, message: t('auth.register.emailRequired') },
                            { type: 'email', message: t('auth.register.emailInvalid') },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder={t('auth.register.emailPlaceholder')} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={t('auth.register.password')}
                        rules={[
                            { required: true, message: t('auth.register.passwordRequired') },
                            { min: 6, message: t('auth.register.passwordMin') },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder={t('auth.register.passwordPlaceholder')} />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label={t('auth.register.confirmPassword')}
                        dependencies={['password']}
                        rules={[
                            { required: true, message: t('auth.register.confirmPasswordRequired') },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t('auth.register.confirmPasswordMismatch')));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder={t('auth.register.confirmPasswordPlaceholder')} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={registerMutation.isPending}>
                            {t('auth.register.submit')}
                        </Button>
                    </Form.Item>
                </Form>
                <div className="footer-text">
                    {t('auth.register.alreadyHaveAccount')} <Link href="/login">{t('auth.register.login')}</Link>
                </div>
            </Card>
        </div>
    );
}
