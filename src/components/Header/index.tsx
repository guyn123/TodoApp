'use client';

import { Layout, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import './index.scss';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const { Header: AntHeader } = Layout;

export default function Header() {
    const { isAuthenticated, clearToken } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        clearToken();
        router.push('/login');
    };

    return (
        <AntHeader className="app-header">
            <div className="logo">
                <img src="/images/logo1.png" alt="TodoApp Logo" />
            </div>
            <div className="auth">
                {isAuthenticated ? (
                    <Button icon={<LogoutOutlined />} onClick={handleLogout}>
                        Đăng xuất
                    </Button>
                ) : (
                    <Link href="/login">
                        <Button icon={<UserOutlined />}>Đăng nhập</Button>
                    </Link>
                )}
            </div>
        </AntHeader>
    );
}