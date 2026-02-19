import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Activity, Target } from 'lucide-react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar,
    PolarGrid, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { analyticsData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const tooltipStyle = { background: 'rgba(10,20,40,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 13 };

export default function Analytics() {
    const { user } = useAuth();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // THE MASTER TOGGLE: Only show ANY progress if user studied TODAY
    const hasTodayActivity = (user?.dailyXp?.[todayStr] || 0) > 0;
    const hasAnyActivity = (user?.xp || 0) > 0;

    // 1. Skill Growth (Monthly) - Only show current month if active
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentMonthIdx = today.getMonth(); // 0-indexed
    const skillGrowthData = months.map((m, idx) => {
        // Only show value for current month index (approx), else 0
        // We use Jun as the "current" in mockup for simplicity, or match actual month name
        const isCurrent = idx === 5; // June in mockup
        return { month: m, skills: (hasTodayActivity && isCurrent) ? (user?.xp || 0) / 10 : 0 };
    });

    // 2. JD Match Over Time (Weekly) - Only show current week if active
    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
    const jdMatchData = weeks.map((w, idx) => {
        const isCurrent = idx === 5; // W6 in mockup
        const score = user?.personalSkillGaps?.score || 0;
        return { week: w, match: (hasTodayActivity && isCurrent) ? score : 0 };
    });

    // 3. Consistency (Daily) - Today and Yesterday only
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDayIdx = (today.getDay() + 6) % 7; // Mon=0
    const consistencyData = days.map((day, idx) => {
        const d = new Date();
        d.setDate(today.getDate() - (currentDayIdx - idx));
        const dateStr = d.toISOString().split('T')[0];
        const xp = user?.dailyXp?.[dateStr] || 0;
        const isTargetDay = (dateStr === todayStr || dateStr === yesterdayStr);
        return { day, hours: (hasTodayActivity && isTargetDay) ? (xp / 100) : 0 };
    });

    // 4. Performance Radar - Only show if active
    const performanceData = analyticsData.performance.map(p => ({
        ...p,
        score: hasTodayActivity ? p.score : 0
    }));

    const displayAnalyticsData = {
        skillGrowth: skillGrowthData,
        jdMatch: jdMatchData,
        consistency: consistencyData,
        performance: performanceData,
    };

    return (
        <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Analytics</h2>
            <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 28 }}>Track your overall progress and performance trends</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(40%, 1fr))', gap: 20 }}>
                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <TrendingUp size={16} color="#10b981" /> Skill Growth
                        </h3>
                        {hasTodayActivity && <span style={{ fontSize: 10, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 4 }}>UPDATED</span>}
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={displayAnalyticsData.skillGrowth}>
                            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={false} contentStyle={tooltipStyle} />
                            <Line type="monotone" dataKey="skills" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Target size={16} color="#00f5ff" /> JD Match Over Time
                        </h3>
                        {hasTodayActivity && <span style={{ fontSize: 10, color: '#00f5ff', background: 'rgba(0,245,255,0.1)', padding: '2px 8px', borderRadius: 4 }}>LIVE</span>}
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={displayAnalyticsData.jdMatch}>
                            <defs>
                                <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00f5ff" stopOpacity={0.25} />
                                    <stop offset="100%" stopColor="#00f5ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={false} contentStyle={tooltipStyle} />
                            <Area type="monotone" dataKey="match" stroke="#00f5ff" strokeWidth={3} fill="url(#matchGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <BarChart3 size={16} color="#6366f1" /> Study Consistency
                        </h3>
                        {hasTodayActivity && (
                            <div style={{ fontSize: 11, color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '20px 8px', borderRadius: 6, fontWeight: 700, lineHeight: 1 }}>
                                ACTIVE
                            </div>
                        )}
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={displayAnalyticsData.consistency}>
                            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={tooltipStyle} />
                            <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <p style={{ fontSize: 11, color: '#475569', marginTop: 12, textAlign: 'center' }}>
                        * Based on XP earned today and yesterday
                    </p>
                </motion.div>

                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Activity size={16} color="#f59e0b" /> Performance Radar
                    </h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <RadarChart data={displayAnalyticsData.performance}>
                            <PolarGrid stroke="rgba(255,255,255,0.08)" />
                            <PolarAngleAxis dataKey="area" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <Radar dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={3} />
                        </RadarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
}
