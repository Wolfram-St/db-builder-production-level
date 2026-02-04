import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components
import WorkStation from './components/WorkStation';
import { Home } from './components/Home';
import { NotFound } from './components/NotFound';
import { Login } from './components/auth/Login';
import { SignUp } from './components/auth/SignUp';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function RootRedirect() {
    const { isAuthenticated, isLoading } = useAuthStore();
    
    if (isLoading) {
        return null; // Or a loading spinner
    }
    
    return isAuthenticated ? <Navigate to="/workstation" replace /> : <Home />;
}

export function App() {
    const initialize = useAuthStore((state) => state.initialize);
    
    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <BrowserRouter>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path='/' element={<RootRedirect />} />
                
                {/* --- Auth Routes --- */}
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                
                {/* --- Protected Routes --- */}
                <Route path='/workstation' element={
                    <ProtectedRoute>
                        <WorkStation />
                    </ProtectedRoute>
                } />
                <Route path='/workstation/:projectId' element={
                    <ProtectedRoute>
                        <WorkStation />
                    </ProtectedRoute>
                } />

                {/* --- Catch-all / 404 --- */}
                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}