import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GitBranch, Lock, CheckCircle2, ChevronRight, X,
    BookOpen, Video, ClipboardCheck, Code2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { roadmaps as mockRoadmaps } from '../data/mockData';

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

const colors = ['#FF6B6B', '#8B5CF6', '#10B981', '#F59E0B', '#06B6D4', '#EC4899'];

function SkillNode({ skill, depth = 0, colorIndex = 0, onSelect }) {
    const [expanded, setExpanded] = useState(depth < 1);
    const color = colors[colorIndex % colors.length];
    const hasChildren = skill.children && skill.children.length > 0;

    return (
        <div className={`${depth > 0 ? 'ml-6 md:ml-10' : ''}`}>
            {/* Connector line */}
            {depth > 0 && (
                <div
                    className="absolute left-3 md:left-5 w-px"
                    style={{
                        height: '24px',
                        background: `linear-gradient(to bottom, ${color}30, transparent)`,
                        transform: 'translateY(-24px)',
                    }}
                />
            )}

            <motion.div
                {...fadeUp}
                transition={{ delay: depth * 0.05 }}
                className="relative"
            >
                <button
                    onClick={() => {
                        if (hasChildren) setExpanded(!expanded);
                        if (skill.unlocked) onSelect(skill);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border-none text-left mb-1 ${skill.unlocked
                        ? 'hover:bg-white/5 bg-transparent'
                        : 'opacity-40 cursor-not-allowed bg-transparent'
                        }`}
                >
                    {/* Node dot */}
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
                        style={{
                            background: skill.unlocked
                                ? `linear-gradient(135deg, ${color}20, ${color}08)`
                                : 'rgba(255,255,255,0.03)',
                            border: `2px solid ${skill.unlocked ? color + '40' : 'rgba(255,255,255,0.05)'}`,
                            boxShadow: skill.unlocked && skill.mastery > 70
                                ? `0 0 15px ${color}20`
                                : 'none',
                        }}
                    >
                        {skill.unlocked ? (
                            skill.mastery >= 100 ? (
                                <CheckCircle2 size={18} style={{ color }} />
                            ) : (
                                <GitBranch size={16} style={{ color }} />
                            )
                        ) : (
                            <Lock size={14} className="text-slate-600" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{skill.name}</p>
                        {skill.unlocked && (
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden max-w-[120px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.mastery}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className="h-full rounded-full"
                                        style={{ background: `linear-gradient(90deg, ${color}, ${color}AA)` }}
                                    />
                                </div>
                                <span className="text-xs font-medium" style={{ color }}>{skill.mastery}%</span>
                            </div>
                        )}
                    </div>

                    {/* Expand toggle */}
                    {hasChildren && (
                        <motion.div
                            animate={{ rotate: expanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-slate-500"
                        >
                            <ChevronRight size={16} />
                        </motion.div>
                    )}
                </button>

                {/* Children */}
                <AnimatePresence>
                    {expanded && hasChildren && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden relative"
                        >
                            {/* Vertical connector line */}
                            <div
                                className="absolute left-5 md:left-5 top-0 bottom-4 w-px"
                                style={{ background: `${color}15` }}
                            />
                            {skill.children.map((child, i) => (
                                <SkillNode
                                    key={child.id}
                                    skill={child}
                                    depth={depth + 1}
                                    colorIndex={colorIndex + i + 1}
                                    onSelect={onSelect}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function SkillDetail({ skill, onClose }) {
    const { addXp } = useAuth();

    const tabs = [
        { id: 'theory', label: 'Theory Notes', icon: BookOpen },
        { id: 'video', label: 'Video Resources', icon: Video },
        { id: 'test', label: 'Mini Test', icon: ClipboardCheck },
        { id: 'practice', label: 'Practice', icon: Code2 },
    ];
    const [activeTab, setActiveTab] = useState('theory');

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
                className="glass-card-static w-full max-w-lg max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-white">{skill.name}</h2>
                        <p className="text-sm text-slate-400 mt-0.5">Mastery: {skill.mastery}%</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer border-none"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 px-6">
                    {tabs.map((tab) => {
                        const TabIcon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer bg-transparent border-x-0 border-t-0 ${activeTab === tab.id
                                    ? 'text-coral border-coral'
                                    : 'text-slate-500 border-transparent hover:text-white'
                                    }`}
                            >
                                <TabIcon size={14} />
                                <span className="hidden md:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'theory' && (
                        <div className="space-y-3">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {skill.notes || `Master the fundamentals of ${skill.name}. Understanding core concepts is essential for interview success.`}
                            </p>
                            {!skill.notes && (
                                <div className="glass-card-static p-4 text-sm text-slate-400">
                                    <p className="font-medium text-slate-300 mb-2">Key Concepts:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Core principles and best practices</li>
                                        <li>Common patterns and anti-patterns</li>
                                        <li>Performance considerations</li>
                                        <li>Real-world applications</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'video' && (
                        <div className="space-y-3">
                            {(skill.resources && skill.resources.length > 0 ? skill.resources : [
                                { title: 'Introduction & Overview', url: '#' },
                                { title: 'Deep Dive Workshop', url: '#' }
                            ]).map((res, i) => (
                                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <div className="glass-card-static p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-lavender/10 flex items-center justify-center shrink-0">
                                            <Video size={20} className="text-lavender" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">{res.skill || res.title || 'Learning Resource'}</p>
                                            <p className="text-xs text-slate-500">Video Lesson</p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                    {activeTab === 'test' && (
                        <div className="text-center py-8">
                            <ClipboardCheck size={48} className="text-emerald mx-auto mb-4 opacity-40" />
                            <p className="text-sm text-slate-400 mb-4">
                                Test your knowledge of {skill.name}
                            </p>
                            <button
                                onClick={() => addXp(25)}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald to-emerald-light text-white font-semibold text-sm cursor-pointer border-none"
                            >
                                Start Mini Test
                            </button>
                        </div>
                    )}
                    {activeTab === 'practice' && (
                        <div className="text-center py-8">
                            <Code2 size={48} className="text-coral mx-auto mb-4 opacity-40" />
                            <p className="text-sm text-slate-400 mb-4">
                                Hands-on practice challenge for {skill.name}
                            </p>
                            <button
                                onClick={() => addXp(40)}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-coral to-coral-light text-white font-semibold text-sm cursor-pointer border-none"
                            >
                                Start Practice
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function SkillTree() {
    const { user } = useAuth();
    const [selectedSkill, setSelectedSkill] = useState(null);

    // Map backend roadmap to skill tree format
    // Fallback to mock roadmaps if user has no personal roadmap yet
    const roadmap = (user?.personalRoadmap && user.personalRoadmap.length > 0)
        ? user.personalRoadmap
        : mockRoadmaps;

    const transformedSkills = roadmap.map((rm, i) => ({
        id: rm.id || `rm-${i}`,
        name: rm.title,
        mastery: rm.progress || 0,
        unlocked: i === 0 || roadmap[i - 1].progress === 100,
        children: (rm.modules || []).map((m, j) => ({
            id: `m-${i}-${j}`,
            name: typeof m === 'string' ? m : m.title,
            mastery: user?.completedSkills?.includes(typeof m === 'string' ? m : m.title) ? 100 : 0,
            unlocked: i === 0 || roadmap[i - 1].progress === 100,
            notes: typeof m === 'object' ? m.notes : '',
            resources: typeof m === 'object' ? m.resources : [],
            children: []
        }))
    }));

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-6">
            <motion.div {...fadeUp} className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold font-[Poppins] mb-2">
                    <span className="text-gradient-mixed">Skill Roadmap</span>
                </h1>
                <p className="text-slate-400 text-sm">
                    Unlock skills, complete modules, and build your mastery tree.
                </p>
            </motion.div>

            <div className="glass-card p-4 md:p-6">
                {transformedSkills.length > 0 ? (
                    transformedSkills.map((skill, i) => (
                        <SkillNode
                            key={skill.id}
                            skill={skill}
                            colorIndex={i}
                            onSelect={setSelectedSkill}
                        />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <p style={{ color: '#64748b', fontSize: 15 }}>No roadmap generated yet. Analyze your resume to begin!</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedSkill && (
                    <SkillDetail skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}
