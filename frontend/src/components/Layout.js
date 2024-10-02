import React from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const AppLayout = () => {
    return (
        <Layout>
            <Header>
                <Navbar /> {/* Ваш общий компонент навигации */}
            </Header>
            <Content style={{ padding: '24px', minHeight: '280px' }}>
                <Outlet /> {/* Содержимое текущей страницы */}
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©2024 Created by Your Name
            </Footer>
        </Layout>
    );
};

export default AppLayout;
