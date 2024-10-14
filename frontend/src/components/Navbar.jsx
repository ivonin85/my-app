import React from 'react';
import { Menu, Divider } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_150.PNG';

const Navbar = () => {
    return (
        <div>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <Divider style={{ margin: '1px 0' }} />
      <Menu mode="horizontal" style={{ marginBottom: '16px' }}>
        <Menu.Item key="profile">
          <Link to="/profile">Профиль</Link>
        </Menu.Item>
        <Menu.Item key="projects">
          <Link to="/projects">Проекты</Link>
        </Menu.Item>
      </Menu>
    </div>
    );
};

export default Navbar;
