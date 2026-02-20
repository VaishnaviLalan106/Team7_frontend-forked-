import { motion } from 'framer-motion';
import { Target, Zap, Flame, TrendingUp } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { weeklyProgress, skillRadarData, testScores, focusAreas } from '../data/mockData';
import ProgressCircle from '../components/ProgressCircle';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Dashboard() {
    const { user } = useAuth();

    // 1. Calculate Real Stats
    const jdMatch = user?.personalSkillGaps?.score || 0;

    // Calculate Skills Done % from Roadmap
    const roadmap = user?.personalRoadmap || [];
    const totalTopics = roadmap.reduce((acc, rm) => acc + (rm.topics?.length || 0), 0);
    const doneTopics = roadmap.reduce((acc, rm) => acc + (rm.topics?.filter(t => t.done)?.length || 0), 0);
    const skillsDone = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;

    const displayStats = [
        { label: 'JD Match', value: `${jdMatch}%`, icon: Target, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
        { label: 'Skills Done', value: `${skillsDone}%`, icon: TrendingUp, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
        { label: 'Total XP', value: user?.xp?.toLocaleString() || '0', icon: Zap, color: '#00f5ff', bg: 'rgba(0,245,255,0.08)' },
        { label: 'Day Streak', value: `${user?.streak || 0} 🔥`, icon: Flame, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    ];

    // 2. Generate Dynamic Chart Data (Weekly Progress)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const currentDayIdx = (today.getDay() + 6) % 7; // Convert to Mon=0...Sun=6

    const weeklyData = days.map((day, idx) => {
        // Find the date for this day in the current week
        const d = new Date();
        d.setDate(today.getDate() - (currentDayIdx - idx));
        const dateStr = d.toISOString().split('T')[0];
        const xp = user?.dailyXp?.[dateStr] || 0;

        // Strict Clipping: Only show progress for [today, yesterday] IF there is activity today.
        // If no activity today, show everything as 0.
        const todayStr = today.toISOString().split('T')[0];
        const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const hasTodayActivity = (user?.dailyXp?.[todayStr] || 0) > 0;
        const isTargetDay = (dateStr === todayStr || dateStr === yesterdayStr);

        const displayValue = (hasTodayActivity && isTargetDay) ? xp : 0;

        return { day, progress: displayValue };
    });

    // 3. Generate Test Score Trend
    const last5Tests = (user?.testHistory || [])
        .slice(-5)
        .map((t, i) => ({ test: `Test ${i + 1}`, score: t.score }));

    // Fallback to 5 zeros if no tests
    const testTrendData = last5Tests.length > 0 ? last5Tests : [
        { test: 'T1', score: 0 }, { test: 'T2', score: 0 }, { test: 'T3', score: 0 }, { test: 'T4', score: 0 }, { test: 'T5', score: 0 }
    ];

    const displayFocusAreas = user?.personalSkillGaps?.priority?.map(s => ({ topic: s, tag: 'High Priority', color: 'rose' })) || [];

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

            {/* Weekly Progress Chart */}
            <div style={{ marginBottom: 24 }}>
                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>Weekly Activity (XP)</h3>
                        {Math.max(...weeklyData.map(d => d.progress)) > 0 && (
                            <div style={{ fontSize: 13, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 8, fontWeight: 600 }}>
                                Active this week
                            </div>
                        )}
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={weeklyData}>
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
                        <LineChart data={testTrendData}>
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
                                    <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8, background: 'rgba(244,63,94,0.08)', color: '#f43f5e' }}>
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
            <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.7 }} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>Level {user?.level || 1} Progress</span>
                    <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{user?.xp?.toLocaleString() || 0} / {user?.xpToNext || 500} XP</span>
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
