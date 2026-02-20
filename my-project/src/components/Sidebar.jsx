import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, FileText, Brain, Map, ClipboardList,
    BarChart3, User, LogOut, Sparkles, X, Swords, GitBranch
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/resume', label: 'Resume Analyzer', icon: FileText },
    { path: '/dashboard/skills', label: 'Skill Gaps', icon: Brain },
    { path: '/dashboard/roadmap', label: 'Roadmap', icon: Map },
    { path: '/dashboard/mocktest', label: 'Mock Tests', icon: ClipboardList },
    { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/dashboard/profile', label: 'Profile', icon: User },
];

const sidebarStyle = {
    background: 'rgba(10, 20, 40, 0.8)',
    backdropFilter: 'blur(40px) saturate(1.6)',
    WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
};

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/'); };
    const handleNavClick = () => { if (window.innerWidth < 768) onClose(); };

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen && window.innerWidth < 768) {
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
        }
        return () => document.body.classList.remove('sidebar-open');
    }, [isOpen]);

    const content = (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Logo + Close */}
            <div style={{ padding: '20px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <NavLink to="/dashboard" onClick={handleNavClick} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #00f5ff, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={14} color="#050a15" />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Poppins, sans-serif' }} className="text-gradient-cyan">PrepNova</span>
                </NavLink>
                <button onClick={onClose} className="md:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
                    <X size={20} />
                </button>
            </div>

            {/* Job Readiness Badge */}
            {user?.isJobReady && !isCollapsed && (
                <div style={{ padding: '4px 12px 12px' }}>
                    <div style={{
                        background: 'rgba(0, 245, 255, 0.1)',
                        border: '1px solid rgba(0, 245, 255, 0.2)',
                        borderRadius: 8,
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 4px 15px -5px rgba(0, 245, 255, 0.3)'
                    }}>
                        <Sparkles size={12} color="#00f5ff" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#00f5ff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Job Ready</span>
                    </div>
                </div>
            )}
            {user?.isJobReady && isCollapsed && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }} title="Job Ready!">
                    <Sparkles size={16} color="#00f5ff" />
                </div>
            )}

            {/* Nav links */}
            <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto', overflowX: 'hidden' }}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard'}
                            onClick={handleNavClick}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            style={{
                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                padding: isCollapsed ? '10px 0' : '10px 14px',
                                minWidth: isCollapsed ? 0 : 'auto',
                            }}
                            title={isCollapsed ? item.label : ''}
                        >
                            <Icon size={18} style={{ minWidth: 18 }} />
                            {!isCollapsed && <span>{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout */}
            <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                    onClick={handleLogout}
                    className="sidebar-link"
                    style={{
                        color: '#f43f5e',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        padding: isCollapsed ? '10px 0' : '10px 14px',
                    }}
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <LogOut size={18} style={{ minWidth: 18 }} /> {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden md:block" style={{
                position: 'fixed', left: 0, top: 0, bottom: 0,
                width: isCollapsed ? 80 : 240,
                zIndex: 40,
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
                <div style={{ margin: 10, height: 'calc(100% - 20px)', borderRadius: 16, overflow: 'hidden', ...sidebarStyle }}>
                    {content}
                </div>
            </aside>

            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="md:hidden"
                            style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        />
                        <motion.aside
                            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="md:hidden"
                            style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 260, zIndex: 50 }}
                        >
                            <div style={{ margin: 10, height: 'calc(100% - 20px)', borderRadius: 16, overflow: 'hidden', ...sidebarStyle, background: 'rgba(10, 20, 40, 0.95)' }}>
                                {content}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
