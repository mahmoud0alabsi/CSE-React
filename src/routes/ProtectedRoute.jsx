import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
};

export default function ProtectedRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
}