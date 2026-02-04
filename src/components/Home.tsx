import { useRef } from 'react';
import './css/home.css';
import GlassButton from '../components/ui/GlassButton.jsx';
import { Link } from 'react-router-dom';

export function Home() {
    return (
        <div className="page-wrapper">
            {/* LAYER 1: The Content (Text + Button) */}
            <div className="content-layer">
                <div className="hero-text-container">
                    <h1 className="hero-title">DB-builder</h1>
                    <p className="hero-subtitle">Build databases faster.</p>
                    
                    <div className="button-wrapper">
                        <Link to='/workstation'>
                            <GlassButton>Start now!</GlassButton>
                        </Link>
                    </div>
                </div>
            </div>

            {/* LAYER 2: The 3D Scene (Background) - Removed temporarily to fix white screen */}
            {/* The Spline component can be added back later when needed */}
        </div>
    );
}