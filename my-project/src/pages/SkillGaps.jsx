import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, AlertTriangle, XCircle, Lightbulb, AlertCircle } from 'lucide-react';
import { skillGaps } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const ProgressBar = ({ value, color }) => (
    <div style={{ position: 'relative', height: 12, display: 'flex', gap: 2, marginTop: 10 }}>
        {[...Array(10)].map((_, i) => (
            <div
                key={i}
                style={{
                    flex: 1,
                    borderRadius: 2,
                    background: (i + 1) * 10 <= value ? color : 'rgba(255,255,255,0.04)',
                    boxShadow: (i + 1) * 10 <= value ? `0 0 10px ${color}44` : 'none',
                    transition: 'all 0.3s ease'
                }}
            />
        ))}
    </div>
);

export default function SkillGaps() {
    const { user } = useAuth();
    const hasAnalyzed = user?.hasAnalyzed;
    const personalGaps = user?.personalSkillGaps;

    const displayColumns = [
        {
            title: 'Strong Skills',
            icon: TrendingUp,
            color: '#10b981',
            data: hasAnalyzed
                ? (personalGaps?.matched?.map(s => ({ name: s, level: 90 })) || skillGaps.strong)
                : []
        },
        {
            title: 'Moderate Skills',
            icon: AlertTriangle,
            color: '#f59e0b',
            data: hasAnalyzed
                ? (personalGaps?.moderate?.map(s => ({ name: s, level: 65 })) || skillGaps.moderate || [])
                : []
        },
        {
            title: 'Missing Skills',
            icon: XCircle,
            color: '#f43f5e',
            data: hasAnalyzed
                ? (personalGaps?.missing?.map(s => ({ name: s, level: 30 })) || skillGaps.missing)
                : []
        },
    ];

    return (
        <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Skill Gap Analysis</h2>
            <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 28 }}>Understand where you stand and what to improve</p>

            {hasAnalyzed ? (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
                        {displayColumns.map((col, i) => {
                            const Icon = col.icon;
                            return (
                                <motion.div key={i} className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: i * 0.1 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 600, color: col.color, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Icon size={18} /> {col.title}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {col.data.length > 0 ? (
                                            col.data.map((skill, j) => (
                                                <div key={j} className="glass-card" style={{ padding: 16, border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                        <span style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{skill.name}</span>
                                                        <span style={{ fontSize: 12, color: col.color, fontWeight: 700, background: `${col.color}11`, padding: '2px 8px', borderRadius: 6 }}>{skill.level}%</span>
                                                    </div>
                                                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Estimated Mastery: <span style={{ color: '#94a3b8' }}>{skill.level > 80 ? 'Expert' : skill.level > 50 ? 'Intermediate' : 'Beginner'}</span></div>
                                                    <ProgressBar value={skill.level} color={col.color} />
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '40px 0', textAlign: 'center' }}>
                                                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>No skills identified yet</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }} style={{ borderLeft: '4px solid #f59e0b' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Lightbulb size={18} color="#f59e0b" /> Skill Improvement Roadmap
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                            {[
                                { tip: 'Focus on System Design patterns', label: 'High Impact' },
                                { tip: 'Practice Docker & Kubernetes', label: 'Recommended' },
                                { tip: 'Build 2-3 projects with AWS', label: 'Project Task' },
                                { tip: 'Study Dynamic Programming', label: 'Interview Prep' }
                            ].map((item, i) => (
                                <div key={i} style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                                    <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{item.tip}</div>
                                </div>
                            ))}
                            <div style={{ gridColumn: '1 / -1', marginTop: 12, display: 'flex', justifyContent: 'center' }}>
                                <Link to="/dashboard/roadmap" className="btn-primary" style={{ padding: '10px 24px', fontSize: 14, textDecoration: 'none', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                                    View Full Interactive Roadmap →
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            ) : (
                <motion.div className="dash-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                        <AlertTriangle size={40} color="#334155" />
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Skill Analysis Locked</h3>
                    <p style={{ fontSize: 15, color: '#64748b', maxWidth: 400, lineHeight: 1.6, marginBottom: 28 }}>
                        To identify your skill gaps and strengths, please first analyze your resume against a target Job Description.
                    </p>
                    <Link to="/dashboard/resume" className="btn-primary" style={{ padding: '12px 32px', textDecoration: 'none' }}>Go to Resume Analyzer</Link>
                </motion.div>
            )}
        </div>
    );
}
