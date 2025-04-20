import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import LoginPage from '../pages/Auth/Login';
import RegisterPage from '../pages/Auth/Register';
import OAuthSuccess from '../pages/Auth/OAuthSuccess';
import WorkspacePage from '../pages/Workspace/Workspace';
import CollaborativeEditorPage from '../pages/CollaborativeEditor/CollaborativeEditor';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/oauth-success" element={<OAuthSuccess />} />

                <Route
                    path="/workspace"
                    element={
                        <ProtectedRoute>
                            <WorkspacePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/collaborative-editor"
                    element={
                        <ProtectedRoute>
                            <CollaborativeEditorPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default AppRoutes;