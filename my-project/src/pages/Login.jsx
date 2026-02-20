import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (email && password) {
            const result = await login(email, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error);
            }
        }
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
            <AnimatedBackground />
            <div style={{ position: 'relative', zIndex: 100, width: '100%' }}>
                <Navbar />
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', position: 'relative', zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ width: '100%', maxWidth: 440 }}
                >
                    <div className="glass-strong" style={{ padding: '32px 32px', borderRadius: 24 }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #00f5ff, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkles size={16} color="#050a15" />
                            </div>
                            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Poppins, sans-serif' }} className="text-gradient-cyan">PrepNova</span>
                        </Link>

                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 4 }}>Welcome Back</h2>
                        <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 24 }}>Sign in to continue your preparation</p>

                        {error && (
                            <div style={{ padding: 12, borderRadius: 12, fontSize: 14, color: '#f43f5e', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)', textAlign: 'center', marginBottom: 20 }}>
                                {typeof error === 'string' ? error : 'An unexpected error occurred'}
                            </div>
                        )}


                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                        placeholder="you@example.com" className="input-glass" required />
                                </div>
                            </div>

                            <div style={{ marginBottom: 28 }}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter your password" className="input-glass" style={{ paddingRight: 44 }} required />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0 }}>
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px 24px' }}>
                                Sign In <ArrowRight size={18} />
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b', marginTop: 28 }}>
                            Don&apos;t have an account?{' '}
                            <Link to="/signup" style={{ color: '#00f5ff', fontWeight: 600 }}>Sign Up</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
                <Footer />
            </div>
        </div>
    );
}
