import React, { useEffect, useState } from 'react';
import { Menu, Spin, Alert } from 'antd';
import ModuleService from '../services/ModuleService';
import { Link } from 'react-router-dom';

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
      if (module.parentId === module.id) {
        return;
      }

      if (module.parentId === null) {
        rootModules.push(moduleMap[module.id]);
      } else if (moduleMap[module.parentId]) {
        moduleMap[module.parentId].children.push(moduleMap[module.id]);
      }
    });

    return rootModules;
  };

  // Рекурсивная функция для рендеринга пунктов меню
  const renderMenuItems = (modules, level = 0) => {
    return modules.map((module) => (
      <React.Fragment key={module.id}>
        <Menu.Item
          key={module.id}
          style={{ paddingLeft: 24 + level * 16 }} // Отступ в зависимости от уровня
        >
          <Link to={`/projects/${projectId}/modules/${module.id}`}>
            {module.name}
          </Link>
        </Menu.Item>
        {/* Рекурсивно отображаем дочерние модули */}
        {module.children.length > 0 && renderMenuItems(module.children, level + 1)}
      </React.Fragment>
    ));
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
      {renderMenuItems(moduleTree)}
    </Menu>
  );
};

export default ModuleNavigation;
