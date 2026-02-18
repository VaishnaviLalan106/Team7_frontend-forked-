import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList, Brain, Building2, Settings, Timer,
    ChevronRight, X, CheckCircle2, Star,
    MessageSquare
} from 'lucide-react';
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip
} from 'recharts';
import useStore from '../store/useStore';

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

const tests = [
    {
        id: 'technical',
        name: 'Technical Mock',
        desc: 'Data structures, algorithms, and system design questions',
        icon: ClipboardList,
        color: '#FF6B6B',
        duration: '45 min',
        sections: 4,
        difficulty: 'Hard',
    },
    {
        id: 'behavioral',
        name: 'Behavioral Mock',
        desc: 'STAR method, leadership, and situational questions',
        icon: Brain,
        color: '#8B5CF6',
        duration: '30 min',
        sections: 3,
        difficulty: 'Medium',
    },
    {
        id: 'company',
        name: 'Company-Specific',
        desc: 'Tailored questions for FAANG, startups, and more',
        icon: Building2,
        color: '#10B981',
        duration: '60 min',
        sections: 5,
        difficulty: 'Expert',
    },
    {
        id: 'custom',
        name: 'Custom Builder',
        desc: 'Build your own test from question pools',
        icon: Settings,
        color: '#F59E0B',
        duration: 'Custom',
        sections: 0,
        difficulty: 'Any',
    },
];

const radarData = [
    { subject: 'DSA', score: 72, fullMark: 100 },
    { subject: 'System Design', score: 58, fullMark: 100 },
    { subject: 'Behavioral', score: 85, fullMark: 100 },
    { subject: 'Coding', score: 67, fullMark: 100 },
    { subject: 'Communication', score: 78, fullMark: 100 },
    { subject: 'Problem Solving', score: 70, fullMark: 100 },
];

const scoreBreakdown = [
    { section: 'Arrays', score: 85 },
    { section: 'Trees', score: 62 },
    { section: 'DP', score: 45 },
    { section: 'System', score: 70 },
];

function TestCard({ test, onClick, index }) {
    const Icon = test.icon;
    return (
        <motion.div
            {...fadeUp}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 cursor-pointer group"
            onClick={() => onClick(test)}
            whileHover={{ y: -4 }}
        >
            <div className="flex items-start justify-between mb-4">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                        background: `linear-gradient(135deg, ${test.color}20, ${test.color}08)`,
                        border: `1px solid ${test.color}30`,
                    }}
                >
                    <Icon size={26} style={{ color: test.color }} />
                </div>
                <span
                    className="px-2 py-1 rounded-full text-[10px] font-semibold uppercase"
                    style={{ background: `${test.color}15`, color: test.color }}
                >
                    {test.difficulty}
                </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{test.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{test.desc}</p>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Timer size={12} /> {test.duration}
                    </span>
                    {test.sections > 0 && (
                        <span>{test.sections} sections</span>
                    )}
                </div>
                <ChevronRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
            </div>
        </motion.div>
    );
}

function ResultsModal({ test, onClose }) {
    const { triggerXpPopup } = useStore();
    const overallScore = 72;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card-static w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <test.icon size={24} style={{ color: test.color }} />
                            <h2 className="text-xl font-bold text-white">{test.name} — Results</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer border-none"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Score */}
                    <div className="text-center mb-6">
                        <div className="relative w-32 h-32 mx-auto mb-3">
                            <svg width="128" height="128" className="-rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                                <motion.circle
                                    cx="64" cy="64" r="56"
                                    stroke={test.color}
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ strokeDashoffset: 352 }}
                                    animate={{ strokeDashoffset: 352 - (overallScore / 100) * 352 }}
                                    transition={{ duration: 1.5 }}
                                    strokeDasharray="352"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold text-white">{overallScore}%</span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm">Overall Score</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    size={18}
                                    className={s <= 4 ? 'text-amber fill-amber' : 'text-slate-600'}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {/* Radar Chart */}
                        <div className="glass-card-static p-4">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Skill Radar
                            </h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                                        <Radar
                                            dataKey="score"
                                            stroke={test.color}
                                            fill={test.color}
                                            fillOpacity={0.15}
                                            strokeWidth={2}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="glass-card-static p-4">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Section Breakdown
                            </h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={scoreBreakdown}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="section" stroke="#64748B" fontSize={10} tickLine={false} />
                                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'rgba(30,41,59,0.9)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 12,
                                                color: '#fff',
                                            }}
                                        />
                                        <Bar dataKey="score" fill={test.color} radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="glass-card-static p-5 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare size={16} className="text-lavender" />
                            <h4 className="text-sm font-semibold text-white">AI Feedback Summary</h4>
                        </div>
                        <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
                            <p>
                                <strong className="text-emerald">Strengths:</strong> Strong understanding of array manipulation
                                and behavioral responses. Communication was clear and structured.
                            </p>
                            <p>
                                <strong className="text-amber">Areas for Improvement:</strong> Dynamic programming concepts
                                need more practice. Consider working through more tree-based problems.
                            </p>
                            <p>
                                <strong className="text-coral">Confidence Rating:</strong> 7/10 — You showed solid
                                confidence but hesitated on advanced topics.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                triggerXpPopup(80);
                                onClose();
                            }}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-lavender to-coral text-white font-semibold text-sm cursor-pointer border-none"
                        >
                            Claim XP Reward
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function MockTests() {
    const [selectedTest, setSelectedTest] = useState(null);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6">
            <motion.div {...fadeUp} className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold font-[Poppins] mb-2">
                    <span className="text-gradient-coral">Mock Tests</span>
                </h1>
                <p className="text-slate-400 text-sm">
                    Simulate real interviews. Get AI-powered feedback and detailed score breakdowns.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
                {tests.map((test, i) => (
                    <TestCard key={test.id} test={test} index={i} onClick={setSelectedTest} />
                ))}
            </div>

            <AnimatePresence>
                {selectedTest && (
                    <ResultsModal test={selectedTest} onClose={() => setSelectedTest(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}
