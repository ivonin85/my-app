import React from 'react';
import { Menu, Divider } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_150.PNG';

const Navbar = () => {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        zIndex: 1000, 
        background: '#fff' 
        }}>
      <div className="logo" style={{ padding: '8px' }}>
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
