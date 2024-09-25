import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import VerificationPage from './components/VerificationPage';
import ProjectsPage from './components/ProjectsPage';
import ProjectCreatePage from './components/ProjectCreatePage';
import ProjectDetailsPage from './components/ProjectDetailsPage';
import ProjectEditPage from './components/ProjectEditPage';
import ModuleForm from './components/ModuleForm';
import ModuleEditPage from './components/ModuleEditPage';
import ModuleDetailsPage from './components/ModuleDetailsPage';
import TestCaseForm from './components/TestCaseForm'; // Импорт компонента формы тест-кейса

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/verify" element={<VerificationPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/new" element={<ProjectCreatePage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/projects/:id/edit" element={<ProjectEditPage />} />
            <Route path="/modules" element={<ModuleForm />} />
            <Route path="/projects/:projectId/modules" element={<ModuleForm />} />
            <Route path="/projects/:projectId/modules/:moduleId" element={<ModuleDetailsPage />} />
            <Route path="/projects/:projectId/modules/:moduleId/edit" element={<ModuleEditPage />} />
            <Route path="/testcases/create" element={<TestCaseForm />} />
            <Route path="/projects/:projectId/modules/:moduleId/testcases/:testCaseId/edit" element={<TestCaseForm />} />
        </Routes>
    );
}

export default App;
