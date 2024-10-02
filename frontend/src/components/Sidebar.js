import React, { useEffect, useState } from 'react';
import { Menu, Spin, Alert } from 'antd';
import ModuleService from '../services/ModuleService';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;

const ModuleNavigation = ({ projectId }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Получение модулей для проекта
  const fetchModules = async (projectId) => {
    try {
      const response = await ModuleService.getModulesByProjectId(projectId);
      setModules(response.data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке модулей');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules(projectId);
  }, [projectId]);

  // Функция для создания структуры дерева модулей
  const buildModuleTree = (modules) => {
    const moduleMap = {};

    // Создаем карту модулей
    modules.forEach((module) => {
      moduleMap[module.id] = { ...module, children: [] };
    });

    const rootModules = [];

    // Проходим по модулям и распределяем дочерние по родителям
    modules.forEach((module) => {
      // Проверяем, не является ли модуль родителем сам себе
      if (module.parentId === module.id) {
        return;
      }

      if (module.parentId === null) {
        // Это корневой модуль
        rootModules.push(moduleMap[module.id]);
      } else if (moduleMap[module.parentId]) {
        // Это дочерний модуль
        moduleMap[module.parentId].children.push(moduleMap[module.id]);
      }
    });

    return rootModules;
  };

  // Рендеринг пунктов меню
  const renderMenuItems = (modules) => {
    return modules.map((module) => {
      if (module.children.length > 0) {
        return (
          <SubMenu key={module.id} title={module.name}>
            {renderMenuItems(module.children)}
          </SubMenu>
        );
      } else {
        // Отображаем модуль, даже если у него нет детей
        return (
          <Menu.Item key={module.id}>
            <Link to={`/projects/${projectId}/modules/${module.id}`}>
              {module.name}
            </Link>
          </Menu.Item>
        );
      }
    });
  };

  if (loading) {
    return <Spin tip="Загрузка модулей..." />;
  }

  if (error) {
    return <Alert message="Ошибка" description={error} type="error" showIcon />;
  }

  const moduleTree = buildModuleTree(modules);

  return (
    <Menu
      mode="inline"
      style={{ width: 256, height: '100%', position: 'fixed', left: 0 }}
    >
      {moduleTree.map((module) => (
        module.children.length > 0 ? (
          <SubMenu key={module.id} title={module.name}>
            {renderMenuItems(module.children)}
          </SubMenu>
        ) : (
          <Menu.Item key={module.id}>
            <Link to={`/projects/${projectId}/modules/${module.id}`}>
              {module.name}
            </Link>
          </Menu.Item>
        )
      ))}
    </Menu>
  );
};

export default ModuleNavigation;
