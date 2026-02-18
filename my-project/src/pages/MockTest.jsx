import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, CheckCircle2, XCircle, BarChart3, ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { mockQuestions } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function MockTest() {
    const [mode, setMode] = useState('select');
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600);
    const [results, setResults] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [testType, setTestType] = useState(null);
    const [activeQuestions, setActiveQuestions] = useState([]);
    const { addXp, user, recordTestResult } = useAuth();
    const hasAnalyzed = user?.hasAnalyzed;

    const testTypes = [
        { id: 'mcq', label: 'MCQ Quiz', desc: 'Multiple choice questions across topics', icon: ClipboardList, color: '#00f5ff' },
        { id: 'hr', label: 'HR Interview', desc: 'Behavioral & situational questions', icon: ClipboardList, color: '#10b981' },
        { id: 'coding', label: 'Coding Challenge', desc: 'Solve algorithmic problems', icon: ClipboardList, color: '#6366f1' },
    ];

    useEffect(() => {
        if (mode !== 'test') return;
        if (timeLeft <= 0) { handleSubmit(); return; }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [mode, timeLeft]);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const startTest = (type) => {
        setTestType(type);
        setIsGenerating(true);

        // Filter and Shuffle Questions
        const pool = mockQuestions.filter(q => q.type === type);
        const count = Math.min(pool.length, 5);
        const shuffled = shuffleArray(pool).slice(0, count);
        setActiveQuestions(shuffled);

        // Simulate AI tailoring
        setTimeout(() => {
            setIsGenerating(false);
            if (shuffled.length > 0) {
                setMode('test');
                setCurrentQ(0);
                setAnswers({});
                setTimeLeft(600);
            } else {
                alert("No questions found for this category yet. We're adding more soon!");
            }
        }, 1500);
    };

    const handleSubmit = () => {
        if (activeQuestions.length === 0) return;

        let correct = 0;
        const breakdown = [];
        activeQuestions.forEach((q, i) => {
            const isCorrect = answers[i] === q.answer;
            if (isCorrect) correct++;
            breakdown.push({ q: `Q${i + 1}`, score: isCorrect ? 1 : 0 });
        });
        const score = Math.round((correct / activeQuestions.length) * 100);

        // Record results for badges and history
        if (recordTestResult) {
            recordTestResult(testType, score);
        }

        if (score >= 70) addXp(50);
        setResults({ score, correct, total: activeQuestions.length, breakdown });
        setMode('results');
    };

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    // Select Mode
    if (mode === 'select') {
        return (
            <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Mock Tests</h2>
                <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 28 }}>Practice with AI-powered tests</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                    {testTypes.map((t, i) => {
                        const Icon = t.icon;
                        return (
                            <motion.div key={i} className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: i * 0.08 }}
                                style={{
                                    cursor: 'pointer',
                                    opacity: 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    gridColumn: t.id === 'coding' ? '1 / -1' : 'span 1'
                                }}
                                onClick={() => startTest(t.id)}>

                                <div style={{
                                    position: 'absolute', top: 12, right: 12,
                                    background: 'rgba(0,245,255,0.1)', color: '#00f5ff',
                                    fontSize: 10, fontWeight: 700, padding: '4px 8px',
                                    borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4
                                }}>
                                    <Sparkles size={10} /> AI DRIVEN
                                </div>

                                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${t.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                    <Icon size={20} color={t.color} />
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {t.label}
                                </h3>
                                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.5 }}>{t.desc}</p>

                                <div style={{ marginTop: 16 }}>
                                    <p style={{ fontSize: 13, color: t.color, fontWeight: 600, margin: 0 }}>Start {t.id === 'mcq' ? 'Quiz' : 'AI Interview'} →</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 100,
                            background: 'rgba(10,20,40,0.8)', backdropFilter: 'blur(8px)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <div className="pulse-glow" style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,245,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                            <Sparkles size={32} color="#00f5ff" />
                        </div>
                        <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Generating AI Questions</h3>
                        <p style={{ color: '#94a3b8', fontSize: 14 }}>Tailoring interview to your missing skills...</p>
                    </motion.div>
                )}
            </div>
        );
    }

    // Test Mode
    if (mode === 'test' && activeQuestions.length > 0) {
        const q = activeQuestions[currentQ];
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => setMode('select')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                            <ArrowLeft size={20} />
                        </button>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>
                            {testType === 'mcq' ? 'MCQ Quiz' : (testType === 'hr' ? 'HR Interview' : 'Coding Challenge')}
                        </h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: timeLeft < 60 ? '#f43f5e' : '#00f5ff' }}>
                        <Clock size={16} /> {formatTime(timeLeft)}
                    </div>
                </div>

                <div style={{ marginBottom: 12, fontSize: 13, color: '#64748b' }}>
                    Question {currentQ + 1} of {activeQuestions.length}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, height: 4, overflow: 'hidden', marginBottom: 24 }}>
                    <div style={{ width: `${((currentQ + 1) / activeQuestions.length) * 100}%`, height: '100%', background: '#00f5ff', borderRadius: 6, transition: 'width 0.3s' }} />
                </div>

                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 20, lineHeight: 1.5 }}>{q.question}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {q.options.map((opt, i) => (
                            <button key={i} onClick={() => setAnswers({ ...answers, [currentQ]: i })}
                                style={{
                                    padding: '14px 18px', borderRadius: 12, fontSize: 15, textAlign: 'left',
                                    background: answers[currentQ] === i ? 'rgba(0,245,255,0.08)' : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${answers[currentQ] === i ? 'rgba(0,245,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
                                    color: answers[currentQ] === i ? '#00f5ff' : '#cbd5e1',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                }}>
                                {opt}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                    <button onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)} className="btn-secondary"
                        style={{ opacity: currentQ === 0 ? 0.4 : 1, padding: '10px 20px' }}>Previous</button>
                    {currentQ < activeQuestions.length - 1
                        ? <button onClick={() => setCurrentQ(currentQ + 1)} className="btn-primary" style={{ padding: '10px 24px' }}>Next</button>
                        : <button onClick={handleSubmit} className="btn-primary" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #10b981, #059669)' }}>Submit</button>}
                </div>
            </div>
        );
    }

    // Results Mode
    if (mode === 'results' && results) {
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                    <button onClick={() => { setMode('select'); setResults(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: 0 }}>Test Results</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }} className="md:grid-cols-4">
                    <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp}
                        style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 4 }}
                            className={results.score >= 70 ? 'text-gradient-cyan' : ''}
                            {...(results.score < 70 ? { style: { fontSize: 48, fontWeight: 800, marginBottom: 4, color: '#f43f5e' } } : {})}>
                            {results.score}%
                        </div>
                        <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Final Score</p>
                    </motion.div>

                    <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}
                        style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: results.score >= 70 ? '#10b981' : '#f43f5e', marginBottom: 16 }}>
                            {results.score >= 70 ? 'PASSED' : 'FAILED'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            {results.score >= 70 ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="#f43f5e" />}
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>Threshold: 70%</span>
                        </div>
                    </motion.div>

                    <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
                        style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: results.score >= 70 ? '#00f5ff' : '#64748b', marginBottom: 10 }}>
                            {results.score >= 70 ? '+50 XP' : '0 XP'}
                        </div>
                        <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>
                            {results.score >= 70 ? 'Rewards earned for excellence!' : 'Score 70%+ to earn rewards'}
                        </p>
                    </motion.div>

                    <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}
                        style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: '#6366f1', marginBottom: 10 }}>{results.correct}/{results.total}</div>
                        <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>ACCURACY</p>
                    </motion.div>
                </div>

                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}
                    style={{ marginTop: 24, padding: '32px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <BarChart3 size={18} color="#6366f1" /> Performance Breakdown
                        </h3>
                        <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 20 }}>
                            By Question
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={results.breakdown}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="q" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={8} />
                            <YAxis
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                axisLine={false} tickLine={false}
                                domain={[0, 1]}
                                ticks={[0, 1]}
                                hide
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                contentStyle={{ background: 'rgba(10,20,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', color: '#fff' }}
                            />
                            <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={40}>
                                {results.breakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.score === 1 ? '#10b981' : '#f43f5e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} /> Correct
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f43f5e' }} /> Wrong
                        </div>
                    </div>
                </motion.div>

                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button onClick={() => { setMode('select'); setResults(null); }} className="btn-secondary" style={{ padding: '12px 24px' }}>Back to Tests</button>
                    <button onClick={() => startTest(testType)} className="btn-primary" style={{ padding: '12px 24px' }}>Retry</button>
                </div>
            </div>
        );
    }

    return null;
}
