import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Briefcase, LogOut, Hexagon } from 'lucide-react';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <Hexagon size={28} />
                    <span>HRMS Pro</span>
                </div>

                <nav style={{ flex: 1 }}>
                    <Link to="/" className={`nav-link ${isActive('/')}`}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link to="/employees" className={`nav-link ${isActive('/employees')}`}>
                        <Users size={20} />
                        Employees
                    </Link>
                    <Link to="/teams" className={`nav-link ${isActive('/teams')}`}>
                        <Briefcase size={20} />
                        Teams
                    </Link>
                </nav>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {user?.name}
                    </div>
                    <button onClick={handleLogout} className="nav-link" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
