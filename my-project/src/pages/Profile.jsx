import { motion } from 'framer-motion';
import { User, Mail, Award, Zap, Flame, Star, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { badges } from '../data/mockData';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Profile() {
    const { user } = useAuth();

    const statItems = [
        { icon: Zap, label: 'Total XP', value: user?.xp?.toLocaleString() || '0', color: '#00f5ff', bg: 'rgba(0,245,255,0.08)' },
        { icon: Flame, label: 'Day Streak', value: user?.streak || 0, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
        { icon: Star, label: 'Level', value: user?.level || 1, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
        { icon: Trophy, label: 'Rank', value: user?.rank || 'Beginner', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    ];

    return (
        <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 28 }}>Profile</h2>

            {/* User Info Card */}
            <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp}
                style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                {user?.avatar ? (
                    <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2.5px solid rgba(0,245,255,0.4)', boxShadow: '0 0 20px rgba(0,245,255,0.2)' }}>
                        <img
                            src={user.avatar}
                            alt="Avatar"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                ) : (
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(99,102,241,0.15))',
                        border: '2px solid rgba(0,245,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <User size={28} color="#00f5ff" />
                    </div>
                )}
                <div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{user?.name || 'User'}</h3>
                    <p style={{ fontSize: 14, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Mail size={14} /> {user?.email || 'user@example.com'}
                    </p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div className="dash-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#00f5ff' }}>{user?.level || 1}</div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Level</p>
                </div>
                <div className="dash-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>{user?.xp || 0}</div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>XP</p>
                </div>
                <div className="dash-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{user?.streak || 0}d</div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Streak</p>
                </div>
                <div className="dash-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}>{user?.rank || 'Newbie'}</div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Rank</p>
                </div>
            </div>

            {/* Interview Stats */}
            <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Mock Test High Scores</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                        { label: 'MCQ Quiz', key: 'mcq', color: '#00f5ff' },
                        { label: 'HR Interview', key: 'hr', color: '#10b981' },
                        { label: 'Coding Challenge', key: 'coding', color: '#6366f1' }
                    ].map(stat => (
                        <div key={stat.key} style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{stat.label}</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: stat.color }}>{user?.testStats?.[stat.key] || 0}%</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* XP Progress */}
            <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}
                style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Level {user?.level || 1} → Level {(user?.level || 1) + 1}</span>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{user?.xp?.toLocaleString() || 0} / {user?.xpToNext?.toLocaleString() || 500} XP</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, height: 12, overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((user?.xp || 0) / (user?.xpToNext || 500)) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: 8, background: 'linear-gradient(90deg, #00f5ff, #6366f1)', boxShadow: '0 0 12px rgba(0,245,255,0.3)' }}
                    />
                </div>
            </motion.div>

            {/* Badges */}
            <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Award size={18} color="#f59e0b" /> Achievement Badges
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    {badges.map((badge, i) => {
                        const isEarned = user?.earnedBadges?.includes(badge.id);
                        const isFirstBadge = badge.id === 1;

                        return (
                            <div key={i} style={{
                                textAlign: 'center', padding: 16, borderRadius: 12,
                                background: isEarned
                                    ? (isFirstBadge ? 'rgba(245,158,11,0.08)' : 'rgba(0,245,255,0.04)')
                                    : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isEarned
                                    ? (isFirstBadge ? 'rgba(245,158,11,0.3)' : 'rgba(0,245,255,0.1)')
                                    : 'rgba(255,255,255,0.04)'}`,
                                opacity: isEarned ? 1 : 0.4,
                                filter: isEarned ? 'none' : 'grayscale(1)',
                                boxShadow: isEarned && isFirstBadge ? '0 0 15px rgba(245,158,11,0.1)' : 'none',
                                transform: isEarned && isFirstBadge ? 'scale(1.02)' : 'none',
                            }}>
                                <div style={{
                                    fontSize: 28, marginBottom: 8,
                                    filter: isEarned ? 'none' : 'blur(1px)',
                                    textShadow: isEarned && isFirstBadge ? '0 0 10px rgba(245,158,11,0.5)' : 'none'
                                }}>
                                    {badge.icon}
                                </div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: isEarned ? (isFirstBadge ? '#f59e0b' : '#fff') : '#475569', marginBottom: 2 }}>
                                    {badge.name}
                                </p>
                                <p style={{ fontSize: 11, color: isEarned ? (isFirstBadge ? '#d97706' : '#94a3b8') : '#334155' }}>
                                    {badge.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
