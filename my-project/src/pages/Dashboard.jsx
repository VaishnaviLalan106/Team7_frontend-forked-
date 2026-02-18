import { motion } from 'framer-motion';
import { Target, Zap, Flame, TrendingUp } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { weeklyProgress, skillRadarData, testScores, focusAreas } from '../data/mockData';
import ProgressCircle from '../components/ProgressCircle';

const stats = [
    { label: 'JD Match', value: '82%', icon: Target, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    { label: 'Skills Done', value: '62%', icon: TrendingUp, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
    { label: 'Total XP', value: '2,840', icon: Zap, color: '#00f5ff', bg: 'rgba(0,245,255,0.08)' },
    { label: 'Day Streak', value: '7 🔥', icon: Flame, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Dashboard() {
    const { user } = useAuth();
    const hasAnalyzed = user?.hasAnalyzed;

    // Zero-state data overrides
    const displayStats = stats.map(s => ({
        ...s,
        value: hasAnalyzed ? s.value : (s.label === 'Day Streak' ? '0 🔥' : (s.label === 'Total XP' ? '0' : '0%'))
    }));

    const displayWeeklyProgress = hasAnalyzed ? weeklyProgress : weeklyProgress.map(d => ({ ...d, progress: 0 }));
    const displayTestScores = hasAnalyzed ? testScores : testScores.map(t => ({ ...t, score: 0 }));
    const displayFocusAreas = hasAnalyzed ? focusAreas : [];

    return (
        <div>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                {displayStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: i * 0.08 }}
                            className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={20} color={stat.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{stat.label}</p>
                                <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>{stat.value}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Weekly Progress Chart — now full width */}
            <div style={{ marginBottom: 24 }}>
                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>Weekly Progress</h3>
                        <div style={{ fontSize: 13, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 8, fontWeight: 600 }}>
                            +12.5% this week
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={displayWeeklyProgress}>
                            <defs>
                                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00f5ff" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#00f5ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={false} contentStyle={{ background: 'rgba(10,20,40,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13 }} />
                            <Area type="monotone" dataKey="progress" stroke="#00f5ff" strokeWidth={3} fill="url(#cyanGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Test Score + Focus Areas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 24 }} className="md:grid-cols-2">
                {/* Test Score Trend */}
                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.5 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Test Score Trend</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={displayTestScores}>
                            <XAxis dataKey="test" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={false} contentStyle={{ background: 'rgba(10,20,40,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13 }} />
                            <Line type="monotone" dataKey="score" stroke="#00f5ff" strokeWidth={2} dot={{ fill: '#00f5ff', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Focus Areas */}
                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.6 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 16 }}>
                        <Target size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} color="#00f5ff" />
                        Focus Areas
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {displayFocusAreas.length > 0 ? (
                            displayFocusAreas.map((area, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 14, color: '#cbd5e1' }}>{area.topic}</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8, background: area.color === 'cyan' ? 'rgba(0,245,255,0.08)' : area.color === 'amber' ? 'rgba(245,158,11,0.08)' : area.color === 'rose' ? 'rgba(244,63,94,0.08)' : 'rgba(99,102,241,0.08)', color: area.color === 'cyan' ? '#00f5ff' : area.color === 'amber' ? '#f59e0b' : area.color === 'rose' ? '#f43f5e' : '#6366f1' }}>
                                        {area.tag}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '20px 0', textAlign: 'center' }}>
                                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Analyze your resume to identify focus areas</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* XP Progress Bar */}
            <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>Level {user?.level || 1} Progress</span>
                    <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{user?.xp?.toLocaleString() || 0} / {user?.xpToNext?.toLocaleString() || 500} XP</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, height: 12, overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((user?.xp || 0) / (user?.xpToNext || 500)) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: 8, background: 'linear-gradient(90deg, #00f5ff, #3b82f6)', boxShadow: '0 0 12px rgba(0,245,255,0.3)' }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
