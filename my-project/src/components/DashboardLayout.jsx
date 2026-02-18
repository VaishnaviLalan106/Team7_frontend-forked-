import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Flame, Zap, Sparkles } from 'lucide-react';
import Sidebar from './Sidebar';
import Chatbot from './Chatbot';
import AnimatedBackground from './AnimatedBackground';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <AnimatedBackground />
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main content — offset on desktop */}
            <div
                style={{
                    position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column',
                    marginLeft: sidebarCollapsed ? 80 : 240,
                    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                className="dash-content-wrapper"
            >
                {/* Top bar */}
                <header style={{ position: 'sticky', top: 0, zIndex: 20, padding: '10px 16px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 20px', borderRadius: 16,
                        background: 'rgba(10, 20, 40, 0.75)',
                        backdropFilter: 'blur(40px) saturate(1.6)',
                        WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>


                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1.5px solid rgba(255,255,255,0.1)',
                                    fontSize: 13, fontWeight: 700, color: '#fff',
                                    textTransform: 'uppercase'
                                }}>
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <p style={{ fontSize: 15, color: '#94a3b8', margin: 0 }}>
                                    Welcome, <span style={{ color: '#fff', fontWeight: 600 }}>{user?.name?.split(' ')[0] || 'User'}</span>
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: 13, fontWeight: 700 }}>
                                <Flame size={14} /> {user?.streak || 0}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.3)', color: '#00f5ff', fontSize: 13, fontWeight: 700, boxShadow: '0 0 15px rgba(0,245,255,0.1)' }}>
                                <Zap size={14} /> {user?.xp?.toLocaleString() || 0} XP
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1', fontSize: 13, fontWeight: 800, boxShadow: '0 0 15px rgba(99,102,241,0.2)' }} className="dash-level-badge pulse-glow">
                                <Sparkles size={14} /> Lvl {user?.level || 1}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ padding: '16px 16px 40px', flex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                        <Outlet />
                    </motion.div>
                </main>

                {/* Footer at bottom */}
                <Footer />
            </div>
            <Chatbot />
        </div>
    );
}
