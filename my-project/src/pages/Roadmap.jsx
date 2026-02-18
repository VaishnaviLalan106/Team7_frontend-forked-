import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, ChevronDown, ChevronRight, CheckCircle2, Circle, Zap } from 'lucide-react';
import { roadmaps } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Roadmap() {
    const [expandedId, setExpandedId] = useState(null);
    const { user, addXp } = useAuth();
    const hasAnalyzed = user?.hasAnalyzed;

    const toggle = (id) => setExpandedId(expandedId === id ? null : id);

    // Use user-specific roadmap if available, else fallback to mock
    const roadmapData = user?.personalRoadmap || roadmaps;

    const displayRoadmaps = roadmapData.map((rm, idx) => ({
        ...rm,
        id: rm.id || `personal-${idx}`,
        weeks: rm.weeks || 4,
        progress: hasAnalyzed ? (rm.progress || 0) : 0,
        xp: rm.xp || 500,
        topics: (rm.topics || rm.modules || []).map((t, j) => ({
            title: typeof t === 'string' ? t : t.title,
            done: hasAnalyzed ? (t.done || false) : false
        }))
    }));

    return (
        <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Learning Roadmaps</h2>
            <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 28 }}>Personalized paths to close your skill gaps</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {hasAnalyzed ? (
                    displayRoadmaps.map((rm, i) => (
                        <motion.div key={rm.id} className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: i * 0.08 }}
                            style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Header */}
                            <button onClick={() => toggle(rm.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    width: '100%', padding: '20px 24px', background: 'none', border: 'none',
                                    cursor: 'pointer', textAlign: 'left', color: '#fff',
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,245,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Map size={18} color="#00f5ff" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{rm.title}</p>
                                        <p style={{ fontSize: 13, color: '#64748b' }}>{rm.weeks} weeks • {rm.progress}% complete</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#00f5ff', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Zap size={13} /> {rm.xp} XP
                                    </span>
                                    {expandedId === rm.id ? <ChevronDown size={18} color="#64748b" /> : <ChevronRight size={18} color="#64748b" />}
                                </div>
                            </button>

                            {/* Progress bar */}
                            <div style={{ padding: '0 24px', marginBottom: expandedId === rm.id ? 0 : 16 }}>
                                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
                                    <div style={{ width: `${rm.progress}%`, height: '100%', borderRadius: 6, background: 'linear-gradient(90deg, #00f5ff, #3b82f6)', transition: 'width 0.6s ease' }} />
                                </div>
                            </div>

                            {/* Expandable content */}
                            <AnimatePresence>
                                {expandedId === rm.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{ padding: '16px 24px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                            {rm.topics.map((topic, j) => (
                                                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: j < rm.topics.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                                                    {topic.done
                                                        ? <CheckCircle2 size={16} color="#10b981" />
                                                        : <Circle size={16} color="#334155" />}
                                                    <span style={{ fontSize: 14, color: topic.done ? '#94a3b8' : '#cbd5e1', textDecoration: topic.done ? 'line-through' : 'none' }}>
                                                        Week {j + 1}: {topic.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                ) : (
                    <motion.div className="dash-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                            <Map size={40} color="#334155" />
                        </div>
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Personalized Roadmap Locked</h3>
                        <p style={{ fontSize: 15, color: '#64748b', maxWidth: 400, lineHeight: 1.6, marginBottom: 28 }}>
                            To generate an AI-driven roadmap tailored to your specific skill gaps, please first analyze your resume against a target Job Description.
                        </p>
                        <a href="/resume-analyzer" className="btn-primary" style={{ padding: '12px 32px', textDecoration: 'none' }}>Go to Resume Analyzer</a>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
