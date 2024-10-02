import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import VerificationPage from './pages/VerificationPage';
import ProjectsPage from './pages/project/ProjectsPage';
import ProjectCreatePage from './pages/project/ProjectCreatePage';
import ProjectDetailsPage from './pages/project/ProjectDetailsPage';
import ProjectEditPage from './pages/project/ProjectEditPage';
import ModuleForm from './pages/module/ModuleForm';
import ModuleEditPage from './pages/module/ModuleEditPage';
import ModuleDetailsPage from './pages/module/ModuleDetailsPage';
import TestCaseForm from './pages/test_case/TestCaseForm';

import AppLayout from './components/Layout';


function App() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}></Route>
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
            <Route path="/testcases/:testCaseId" element={<TestCaseForm />} />
            <Route path="/projects/:projectId/modules/:moduleId/testcases/:testCaseId/edit" element={<TestCaseForm />} />
        </Routes>
    );
}

export default App;
