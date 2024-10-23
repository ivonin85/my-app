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
import ModuleFormModal from './pages/module/ModuleFormModal';
import ModuleDetailsPage from './pages/module/ModuleDetailsPage';
import TestCaseForm from './pages/test_case/TestCaseForm';
import CreateTestPlan from './pages/test_plan/CreateTestPlan';
import TestPlansPage from './pages/test_plan/TestPlansPage';

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
            <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/projects/:id/edit" element={<ProjectEditPage />} />
            <Route path="/modules" element={<ModuleFormModal />} />
            <Route path="/projects/:projectId/modules" element={<ModuleFormModal />} />
            <Route path="/projects/:projectId/modules/:moduleId" element={<ModuleDetailsPage />} />
            <Route path="/projects/:projectId/modules/:moduleId/edit" element={<ModuleFormModal />} />
            <Route path="/testcases/create" element={<TestCaseForm />} />
            <Route path="/testcases/:testCaseId" element={<TestCaseForm />} />
            <Route path="/projects/:projectId/modules/:moduleId/testcases/:testCaseId/edit" element={<TestCaseForm />} />
            <Route path="/create_test_plan" element={<CreateTestPlan />} />
            <Route path="/test_plans" element={<TestPlansPage />} />
        </Routes>
    );
}

export default App;
