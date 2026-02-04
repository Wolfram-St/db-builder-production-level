import './css/home.css';
import GlassButton from '../components/ui/GlassButton.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';

export function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    
    const handleStartClick = () => {
        if (isAuthenticated) {
            navigate('/workstation');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="page-wrapper">
            {/* Sign In Button for unauthenticated users */}
            {!isAuthenticated && (
                <div className="absolute top-6 right-6 z-20">
                    <Link to="/login">
                        <Button 
                            variant="outline"
                            className="bg-white/5 hover:bg-white/10 border-white/20 text-white backdrop-blur-sm"
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign in
                        </Button>
                    </Link>
                </div>
            )}

            {/* LAYER 1: The Content (Text + Button) */}
            <div className="content-layer">
                <div className="hero-text-container">
                    <h1 className="hero-title">DB-builder</h1>
                    <p className="hero-subtitle">Build databases faster.</p>
                    
                    <div className="button-wrapper">
                        <div onClick={handleStartClick} style={{ cursor: 'pointer' }}>
                            <GlassButton>Start now!</GlassButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* LAYER 2: The 3D Scene (Background) - Removed temporarily to fix white screen */}
            {/* The Spline component can be added back later when needed */}
        </div>
    );
}