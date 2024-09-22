import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import VerificationPage from './components/VerificationPage';
import ProjectsPage from './components/ProjectsPage';
import NewProjectPage from './components/NewProjectPage';
import ProjectDetailsPage from './components/ProjectDetailsPage';
import ProjectEditPage from './components/ProjectEditPage';
import ModuleForm from './components/ModuleForm';
import ModuleEditPage from './components/ModuleEditPage';

function App() {
    return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/verify" element={<VerificationPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/new" element={<NewProjectPage />} />
                <Route path="/projects/:id" element={<ProjectDetailsPage/>} />
                <Route path="/projects/:id/edit" element={<ProjectEditPage />} />
                <Route path="/modules" element={<ModuleForm />} />
                <Route path="/projects/:projectId/modules/new" element={<ModuleForm />} />
                <Route path="/projects/:projectId/modules/:moduleId/edit" element={<ModuleEditPage />} />
            </Routes>
    );
}

export default App;
