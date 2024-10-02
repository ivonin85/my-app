import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <Menu mode="horizontal" style={{ marginBottom: '16px' }}>
            <Menu.Item key="profile">
                <Link to="/profile">Профиль</Link>
            </Menu.Item>
            <Menu.Item key="projects">
                <Link to="/projects">Проекты</Link>
            </Menu.Item>
        </Menu>
    );
};

export default Navbar;
