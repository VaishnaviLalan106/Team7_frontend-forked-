import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
            padding: scrolled ? '8px 24px' : '14px 24px',
            transition: 'padding 0.3s ease',
        }}>
            <div style={{ maxWidth: 1120, margin: '0 auto' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 24px',
                    background: scrolled ? 'rgba(10,20,40,0.9)' : 'rgba(10,20,40,0.5)',
                    backdropFilter: 'blur(40px) saturate(1.6)',
                    WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16,
                    boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
                    transition: 'all 0.3s ease',
                }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'linear-gradient(135deg, #00f5ff, #3b82f6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Sparkles size={17} color="#050a15" />
                        </div>
                        <span style={{
                            fontSize: 20, fontWeight: 700, fontFamily: 'Poppins, sans-serif',
                            background: 'linear-gradient(135deg, #00f5ff, #00dde6)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>PrepNova</span>
                    </Link>

                    {/* Desktop nav */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="hidden md:flex">
                        <Link to="/" style={{ fontSize: 15, color: scrolled ? '#fff' : '#cbd5e1', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
                        <a href="/#features" style={{ fontSize: 15, color: '#94a3b8', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseOver={e => e.target.style.color = '#fff'}
                            onMouseOut={e => e.target.style.color = '#94a3b8'}>Features</a>
                        <a href="/#how-it-works" style={{ fontSize: 15, color: '#94a3b8', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseOver={e => e.target.style.color = '#fff'}
                            onMouseOut={e => e.target.style.color = '#94a3b8'}>How It Works</a>
                    </div>

                    {/* Desktop buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hidden md:flex">
                        <Link to="/login" className="btn-outline-sm" style={{ textDecoration: 'none' }}>Login</Link>
                        <Link to="/signup" className="btn-primary-sm" style={{ textDecoration: 'none' }}>Sign Up</Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden"
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                marginTop: 8, padding: 16, borderRadius: 16,
                                background: 'rgba(10,20,40,0.98)',
                                backdropFilter: 'blur(40px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                            className="md:hidden"
                        >
                            <Link to="/" onClick={() => setMobileOpen(false)}
                                style={{ display: 'block', padding: '12px 16px', fontSize: 15, color: '#fff', fontWeight: 600, textDecoration: 'none', borderRadius: 10 }}>Home</Link>
                            <a href="/#features" onClick={() => setMobileOpen(false)}
                                style={{ display: 'block', padding: '12px 16px', fontSize: 15, color: '#cbd5e1', textDecoration: 'none', borderRadius: 10 }}>Features</a>
                            <a href="/#how-it-works" onClick={() => setMobileOpen(false)}
                                style={{ display: 'block', padding: '12px 16px', fontSize: 15, color: '#cbd5e1', textDecoration: 'none', borderRadius: 10 }}>How It Works</a>
                            <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline-sm" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Login</Link>
                                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary-sm" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Sign Up</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
