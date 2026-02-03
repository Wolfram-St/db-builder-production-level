import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import WorkStation from './components/WorkStation';
import { Home } from './components/Home';
import { NotFound } from './components/NotFound';

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path='/' element={<Home />} />
                
                {/* Direct access to workstation - no authentication */}
                <Route path='/workstation' element={<WorkStation />} />
                <Route path='/workstation/:projectId' element={<WorkStation />} />

                {/* --- Catch-all / 404 --- */}
                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}