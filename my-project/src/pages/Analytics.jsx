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
    const hasAnalyzed = user?.hasAnalyzed;

    // Zero-state data overrides
    const displayAnalyticsData = {
        skillGrowth: hasAnalyzed ? analyticsData.skillGrowth : analyticsData.skillGrowth.map(d => ({ ...d, skills: 0 })),
        jdMatch: hasAnalyzed ? analyticsData.jdMatch : analyticsData.jdMatch.map(d => ({ ...d, match: 0 })),
        consistency: hasAnalyzed ? analyticsData.consistency : analyticsData.consistency.map(d => ({ ...d, hours: 0 })),
        performance: hasAnalyzed ? analyticsData.performance : analyticsData.performance.map(d => ({ ...d, score: 0 })),
    };

    return (
        <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Analytics</h2>
            <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 28 }}>Track your overall progress and performance trends</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(40%, 1fr))', gap: 20 }}>
                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TrendingUp size={16} color="#10b981" /> Skill Growth
                    </h3>
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
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Target size={16} color="#00f5ff" /> JD Match Over Time
                    </h3>
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
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <BarChart3 size={16} color="#6366f1" /> Study Consistency
                    </h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={displayAnalyticsData.consistency}>
                            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={tooltipStyle} />
                            <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
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
