"use client";

import { Layout, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./index.scss";
import Link from "next/link";

const { Header: AntHeader } = Layout;

export default function Header() {
    return (
        <AntHeader className="app-header">
            <div className="logo">
                <img src="/images/logo1.png" alt="TodoApp Logo" />
            </div>
            <div className="auth">
                <Link href="/login">
                    <Button icon={<UserOutlined />}>
                        Đăng nhập
                    </Button>
                </Link>
            </div>
        </AntHeader>
    );
}
