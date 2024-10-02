import { useNavigate } from 'react-router-dom';
import ModuleService from '../services/ModuleService';

export const ModuleActions = (projectId, refreshModules) => {
    const navigate = useNavigate();

    const moduleEdit = (moduleId) => {
        navigate(`/projects/${projectId}/modules/${moduleId}/edit`);
    };

    const moduleDelete = (moduleId) => {
        if (window.confirm("Вы уверены, что хотите удалить этот модуль?")) {
            ModuleService.deleteModule(moduleId)
                .then(() => {
                    alert("Модуль удален!");
                    if (refreshModules) {
                        refreshModules(); // Обновляем список модулей после удаления
                    }
                })
                .catch(error => console.error('Ошибка при удалении модуля', error));
        }
    };

    return {
        moduleEdit,
        moduleDelete,
    };
};
