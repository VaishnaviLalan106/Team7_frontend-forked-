import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileText, Brain, Map, Mic, BarChart3, Gamepad2,
    ArrowRight, ChevronRight, Sparkles, Zap, Star, Users, CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';

const features = [
    { icon: FileText, title: 'Resume & JD Analyzer', desc: 'AI-powered resume analysis against job descriptions with intelligent match scoring and gap identification.' },
    { icon: Brain, title: 'Skill Gap Engine', desc: 'Identify gaps between your profile and target roles with detailed, actionable improvement insights.' },
    { icon: Map, title: 'AI Roadmaps', desc: 'Personalized learning paths with week-by-week plans, milestone tracking, and XP rewards.' },
    { icon: Mic, title: 'Mock Interviews', desc: 'Practice MCQs, coding challenges, and behavioral questions with real-time AI feedback.' },
    { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track your progress with detailed charts, performance trends, and growth insights.' },
    { icon: Gamepad2, title: 'Gamified Progress', desc: 'Earn XP, unlock achievement badges, build streaks, and level up your career readiness.' },
];

const steps = [
    { num: '01', title: 'Upload & Analyze', desc: 'Upload your resume and paste the job description. Our AI identifies skill matches and gaps instantly.', icon: FileText },
    { num: '02', title: 'Learn & Build', desc: 'Follow personalized AI roadmaps and practice with mock tests tailored to your weak areas.', icon: Map },
    { num: '03', title: 'Track & Ace', desc: 'Monitor progress with analytics, earn XP badges, and walk into interviews with full confidence.', icon: CheckCircle2 },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
            <AnimatedBackground />

            <div style={{ position: 'relative', zIndex: 10 }}>
                <Navbar />

                {/* ===== HERO ===== */}
                <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '120px 24px 80px', textAlign: 'center', width: '100%' }}>
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
                            <span className="glass" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '10px 22px', fontSize: 13, fontWeight: 600, color: '#00f5ff',
                                letterSpacing: '0.05em',
                            }}>
                                <Sparkles size={15} /> AI-Powered Interview Intelligence
                            </span>
                        </motion.div>

                        <motion.h1
                            initial="hidden" animate="visible" variants={fadeUp}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{
                                fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(36px, 5vw, 64px)',
                                fontWeight: 800, lineHeight: 1.1, marginTop: 32, marginBottom: 24,
                                color: '#fff', letterSpacing: '-0.02em',
                            }}
                        >
                            Master Interviews with<br />
                            <span className="text-gradient-cyan text-glow">AI-Powered</span>{' '}
                            <span className="text-gradient-blue">Skill Intelligence</span>
                        </motion.h1>

                        <motion.p
                            initial="hidden" animate="visible" variants={fadeUp}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            style={{
                                fontSize: 20, color: '#f8fafc', maxWidth: 580, margin: '0 auto 48px',
                                lineHeight: 1.8, fontWeight: 500,
                                textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                            }}
                        >
                            Analyze your resume, close skill gaps, follow AI roadmaps, and ace mock
                            interviews — all in one beautifully gamified platform.
                        </motion.p>

                        <motion.div
                            initial="hidden" animate="visible" variants={fadeUp}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}
                        >
                            <button onClick={() => navigate('/signup')} className="btn-primary" style={{ padding: '16px 36px', fontSize: 17 }}>
                                Get Started Free <ArrowRight size={20} />
                            </button>
                            <a href="#features" className="btn-secondary" style={{ padding: '16px 36px', fontSize: 17, textDecoration: 'none' }}>
                                Learn More <ChevronRight size={20} />
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* ===== FEATURES ===== */}
                <section id="features" className="section">
                    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
                        <div className="section-header">
                            <div className="section-label">Features</div>
                            <h2 className="section-title">
                                Everything You Need to <span className="text-gradient-cyan">Ace Interviews</span>
                            </h2>
                            <p className="section-desc">
                                A complete AI-powered toolkit covering every stage of your interview preparation journey.
                            </p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: 20,
                        }}>
                            {features.map((feature, i) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial="hidden" whileInView="visible" viewport={{ once: true }}
                                        variants={fadeUp} transition={{ delay: i * 0.08 }}
                                        className="glass-card"
                                        style={{ padding: 28, background: 'rgba(10, 20, 40, 0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
                                    >
                                        <div style={{
                                            width: 48, height: 48, borderRadius: 12,
                                            background: 'rgba(0,245,255,0.12)', border: '1px solid rgba(0,245,255,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            marginBottom: 20,
                                        }}>
                                            <Icon size={22} color="#00f5ff" />
                                        </div>
                                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{feature.title}</h3>
                                        <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.7, fontWeight: 500 }}>{feature.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ===== HOW IT WORKS ===== */}
                <section id="how-it-works" className="section">
                    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
                        <div className="section-header">
                            <div className="section-label" style={{ color: '#00f5ff', fontWeight: 700 }}>How It Works</div>
                            <h2 className="section-title">
                                Three Steps to <span className="text-gradient-cyan">Interview Success</span>
                            </h2>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 24,
                        }}>
                            {steps.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial="hidden" whileInView="visible" viewport={{ once: true }}
                                        variants={fadeUp} transition={{ delay: i * 0.12 }}
                                        className="glass-card"
                                        style={{ padding: 32, textAlign: 'center', position: 'relative', overflow: 'hidden', background: 'rgba(10, 20, 40, 0.7)' }}
                                    >
                                        <div style={{
                                            position: 'absolute', top: 8, right: 16,
                                            fontSize: 64, fontWeight: 800, fontFamily: 'Poppins, sans-serif',
                                            color: 'rgba(255,255,255,0.03)', pointerEvents: 'none',
                                        }}>{item.num}</div>
                                        <div style={{
                                            width: 52, height: 52, borderRadius: 14,
                                            background: 'linear-gradient(135deg, rgba(0,245,255,0.12), rgba(99,102,241,0.12))',
                                            border: '1px solid rgba(0,245,255,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 16px',
                                        }}>
                                            <Icon size={24} color="#00f5ff" />
                                        </div>
                                        <div style={{ fontSize: 12, fontWeight: 800, color: '#00f5ff', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                                            Step {item.num}
                                        </div>
                                        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{item.title}</h3>
                                        <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.7, fontWeight: 500 }}>{item.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ===== FOOTER ===== */}
                <Footer />
            </div>
        </div>
    );
}
