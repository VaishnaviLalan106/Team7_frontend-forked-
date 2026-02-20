import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, XCircle, BarChart3, ArrowLeft, Lock, Sparkles, Zap, CheckCircle } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { mockQuestions } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/aiService';

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
    const [activeProject, setActiveProject] = useState(null);
    const [testId, setTestId] = useState(null);
    const { user, refreshUser, toggleProjectStep } = useAuth();
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

    const startTest = async (type) => {
        setTestType(type);
        setIsGenerating(true);

        try {
            // Generate test from backend (defaults to first missing skill for now)
            const skillToTest = user?.personalSkillGaps?.missing?.[0] || "General Tech";
            const test = await aiService.generateTest(skillToTest, type);

            setActiveQuestions(test.questions.map(q => ({
                id: q.id,
                question: q.question, // Backend uses "question" in QuestionOut
                options: q.options || [],
                ideal: q.ideal_answer_concept || "" // for HR/Coding
            })));

            setTestId(test.test_id);
            setMode('test');
            setCurrentQ(0);
            setAnswers({});
            setTimeLeft(600);
        } catch (error) {
            console.error("Test generation failed:", error);
            alert("Failed to generate test. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async () => {
        if (isGenerating || activeQuestions.length === 0) return;

        setIsGenerating(true);
        try {
            const skillToTest = user?.personalSkillGaps?.missing?.[0] || "General Tech";
            let result;

            if (testType === 'mcq' || testType === 'hr' || testType === 'coding') {
                const submission = activeQuestions.map((q, i) => ({
                    question_id: q.id,
                    selected_answer: activeQuestions[i].options[answers[i]] || ""
                }));
                result = await aiService.submitTest(testId, skillToTest, submission);

                setResults({
                    score: result.score,
                    correct: result.correct_count,
                    total: result.total_questions,
                    breakdown: result.results.map((res, i) => ({
                        q: `Q${i + 1}`,
                        score: res.is_correct ? 1 : 0
                    }))
                });
            } else {
                // HR or Coding
                const submission = activeQuestions.map((q, i) => ({
                    question_id: q.id,
                    answer: answers[i] || ""
                }));
                result = await aiService.gradeTest(testId, skillToTest, testType, submission);

                setResults({
                    score: result.total_score,
                    correct: result.results.filter(r => r.score >= 70).length,
                    total: result.results.length,
                    breakdown: result.results.map((res, i) => ({
                        q: `Q${i + 1}`,
                        score: res.score >= 70 ? 1 : 0,
                        feedback: res.feedback
                    })),
                    details: result.results
                });
            }

            await refreshUser();
            setMode('results');
        } catch (error) {
            console.error("Test submission failed:", error);
            alert("Failed to submit test results.");
        } finally {
            setIsGenerating(false);
        }
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
                        const isLocked = !hasAnalyzed;
                        return (
                            <motion.div key={i} className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: i * 0.08 }}
                                style={{
                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                    opacity: isLocked ? 0.6 : 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    gridColumn: t.id === 'coding' ? '1 / -1' : 'span 1'
                                }}
                                onClick={() => !isLocked && startTest(t.id)}>

                                <div style={{
                                    position: 'absolute', top: 12, right: 12,
                                    background: isLocked ? 'rgba(244,63,94,0.1)' : 'rgba(0,245,255,0.1)',
                                    color: isLocked ? '#f43f5e' : '#00f5ff',
                                    fontSize: 10, fontWeight: 700, padding: '4px 8px',
                                    borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4
                                }}>
                                    {isLocked ? <Lock size={10} /> : <Sparkles size={10} />}
                                    {isLocked ? 'LOCKED' : 'AI DRIVEN'}
                                </div>

                                <div style={{ width: 44, height: 44, borderRadius: 12, background: isLocked ? 'rgba(255,255,255,0.05)' : `${t.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                    {isLocked ? <Lock size={20} color="#64748b" /> : <Icon size={20} color={t.color} />}
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 600, color: isLocked ? '#64748b' : '#fff', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {t.label}
                                </h3>
                                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.5 }}>
                                    {isLocked ? 'Unlock by analyzing your resume' : t.desc}
                                </p>

                                <div style={{ marginTop: 16 }}>
                                    {!isLocked && <p style={{ fontSize: 13, color: t.color, fontWeight: 600, margin: 0 }}>Start {t.id === 'mcq' ? 'Quiz' : 'AI Interview'} →</p>}
                                    {isLocked && <p style={{ fontSize: 12, color: '#f43f5e', fontWeight: 600, margin: 0 }}>Resume Analysis Required</p>}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* AI Recommended Learning Section */}
                {(user?.personalVideos?.length > 0 || user?.personalProjects?.length > 0) ? (
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
                        style={{
                            marginTop: 40, padding: 24, borderRadius: 20,
                            background: 'rgba(10, 20, 40, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(0, 245, 255, 0.15)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,245,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkles size={18} color="#00f5ff" />
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>AI Recommended Learning</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            {/* Videos */}
                            <div>
                                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Sparkles size={14} color="#00f5ff" /> Recommended Videos
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {(user.personalVideos || []).map(vid => (
                                        <a key={vid.id} href={vid.url} target="_blank" rel="noopener noreferrer"
                                            style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}>
                                            <img
                                                src={vid.thumbnail}
                                                alt={vid.title}
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=112&fit=crop';
                                                    e.target.onerror = null;
                                                }}
                                                style={{ width: 80, height: 45, borderRadius: 6, objectFit: 'cover' }}
                                            />
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{vid.title}</div>
                                                <div style={{ fontSize: 11, color: '#64748b' }}>{vid.channel}</div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Projects */}
                            <div>
                                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Sparkles size={14} color="#6366f1" /> Mini Projects
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {(user.personalProjects || []).map(proj => {
                                        const doneCount = proj.steps.filter(s => s.done).length;
                                        const progress = (doneCount / proj.steps.length) * 100;
                                        return (
                                            <div key={proj.id}
                                                onClick={() => setActiveProject(proj)}
                                                style={{ padding: 16, borderRadius: 12, background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', cursor: 'pointer', transition: 'all 0.2s' }}
                                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#818cf8' }}>{proj.title}</div>
                                                    <div style={{ fontSize: 10, color: '#818cf8', fontWeight: 600 }}>{Math.round(progress)}%</div>
                                                </div>
                                                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', marginBottom: 12 }}>
                                                    <div style={{ width: `${progress}%`, height: '100%', background: '#6366f1' }} />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                    {proj.steps.slice(0, 2).map((step, idx) => {
                                                        const title = typeof step === 'string' ? step : step.title;
                                                        const isDone = typeof step === 'string' ? false : step.done;
                                                        return (
                                                            <div key={idx} style={{ fontSize: 11, color: isDone ? '#475569' : '#94a3b8', display: 'flex', gap: 6, alignItems: 'center' }}>
                                                                {isDone ? <CheckCircle size={10} color="#10b981" /> : <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid currentColor' }} />}
                                                                <span style={{ textDecoration: isDone ? 'line-through' : 'none' }}>{title}</span>
                                                            </div>
                                                        );
                                                    })}
                                                    {proj.steps.length > 2 && <div style={{ fontSize: 10, color: '#6366f1', marginTop: 4 }}>+ {proj.steps.length - 2} more steps. Tap to start →</div>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
                        style={{ marginTop: 40, padding: 32, textAlign: 'center', borderRadius: 20, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <div style={{ color: '#00f5ff', marginBottom: 16 }}><Sparkles size={32} /></div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Unlock AI Recommendations</h3>
                        <p style={{ fontSize: 14, color: '#64748b', maxWidth: 400, margin: '0 auto 24px' }}>
                            Upload your resume for analysis to get personalized YouTube videos and step-by-step mini projects here!
                        </p>
                        <Link to="/dashboard/resume" className="btn-primary" style={{ padding: '10px 24px', textDecoration: 'none', fontSize: 14 }}>Go to Resume Analyzer</Link>
                    </motion.div>
                )}

                {/* Project Interaction Modal */}
                <AnimatePresence>
                    {activeProject && (() => {
                        const currentProj = (user?.personalProjects || []).find(p => String(p.id) === String(activeProject.id)) || activeProject;
                        return (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{
                                    position: 'fixed', inset: 0, zIndex: 200,
                                    background: 'rgba(5, 10, 20, 0.9)', backdropFilter: 'blur(16px)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                                    className="dash-card"
                                    style={{
                                        maxWidth: 700, width: '100%', padding: '32px',
                                        position: 'relative', border: '1px solid rgba(99, 102, 241, 0.3)',
                                        maxHeight: '85vh', overflowY: 'auto'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Sparkles size={24} color="#6366f1" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', marginBottom: 4 }}>PROJECT IMPLEMENTATION</div>
                                            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>{currentProj.title}</h3>
                                        </div>
                                        <button onClick={() => setActiveProject(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 24 }}>&times;</button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        {currentProj.steps.map((step, idx) => (
                                            <div key={idx} style={{
                                                padding: '20px', borderRadius: 16,
                                                background: step.done ? 'rgba(16,185,129,0.03)' : 'rgba(255,255,255,0.02)',
                                                border: `1px solid ${step.done ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)'}`,
                                                position: 'relative'
                                            }}>
                                                <div style={{ display: 'flex', gap: 16 }}>
                                                    <div style={{
                                                        width: 24, height: 24, borderRadius: '50%',
                                                        background: step.done ? '#10b981' : 'rgba(255,255,255,0.05)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 12, fontWeight: 700, color: step.done ? '#fff' : '#64748b',
                                                        marginTop: 2
                                                    }}>
                                                        {step.done ? <CheckCircle size={14} /> : idx + 1}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: 16, fontWeight: 600, color: (typeof step === 'object' && step.done) ? '#64748b' : '#fff', marginBottom: 8, textDecoration: (typeof step === 'object' && step.done) ? 'line-through' : 'none' }}>
                                                            {typeof step === 'string' ? step : (step.title || "Project Milestone")}
                                                        </div>
                                                        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
                                                            {typeof step === 'string' ? "Follow this step to complete the project objective." : (step.guide || "Complete this phase of the project to move forward.")}
                                                        </div>
                                                        <button
                                                            onClick={() => toggleProjectStep(currentProj.id, idx)}
                                                            className={(typeof step === 'object' && step.done) ? "btn-secondary" : "btn-primary"}
                                                            style={{
                                                                padding: '6px 16px', fontSize: 12,
                                                                background: (typeof step === 'object' && step.done) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #10b981, #059669)',
                                                                borderColor: (typeof step === 'object' && step.done) ? 'rgba(255,255,255,0.1)' : 'transparent'
                                                            }}
                                                        >
                                                            {(typeof step === 'object' && step.done) ? 'Completed' : 'Mark as Done'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginTop: 32, padding: 20, background: 'rgba(99, 102, 241, 0.05)', borderRadius: 12, border: '1px dashed rgba(99, 102, 241, 0.2)', textAlign: 'center' }}>
                                        <p style={{ fontSize: 14, color: '#818cf8', margin: 0 }}>
                                            Complete all steps to earn <Zap size={13} style={{ display: 'inline' }} /> 100 XP total!
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })()}
                </AnimatePresence>

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
                    <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 20, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{q.question}</h3>

                    {(testType === 'mcq' || testType === 'hr' || testType === 'coding') ? (
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
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <textarea
                                value={answers[currentQ] || ""}
                                onChange={(e) => setAnswers({ ...answers, [currentQ]: e.target.value })}
                                placeholder={testType === 'coding' ? "// Write your implementation here..." : "Type your answer using the STAR method..."}
                                style={{
                                    width: '100%', minHeight: 240, background: 'rgba(5, 10, 20, 0.4)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#fff', padding: 20, fontSize: 15, lineHeight: 1.6, resize: 'vertical',
                                    fontFamily: testType === 'coding' ? 'monospace' : 'inherit'
                                }}
                            />
                            <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Sparkles size={12} /> AI will evaluate your answer upon submission.
                            </div>
                        </div>
                    )}
                </motion.div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                    <button onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)} className="btn-secondary"
                        style={{ opacity: currentQ === 0 ? 0.4 : 1, padding: '10px 20px' }}>Previous</button>
                    {currentQ < activeQuestions.length - 1
                        ? <button onClick={() => setCurrentQ(currentQ + 1)} className="btn-primary" style={{ padding: '10px 24px' }}>Next</button>
                        : <button
                            onClick={handleSubmit}
                            disabled={isGenerating}
                            className="btn-primary"
                            style={{
                                padding: '10px 24px',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                opacity: isGenerating ? 0.7 : 1,
                                cursor: isGenerating ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}
                        >
                            {isGenerating ? <Zap size={16} className="animate-pulse" /> : null}
                            {isGenerating ? 'Submitting...' : 'Submit'}
                        </button>}
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
                                labelStyle={{ color: '#fff', fontWeight: 700, marginBottom: 4 }}
                                formatter={(val, name, props) => {
                                    const fb = props.payload.feedback;
                                    return [fb ? fb : (val === 1 ? 'Correct' : 'Incorrect'), 'Status'];
                                }}
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
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} /> {testType === 'mcq' ? 'Correct' : 'Score 70%+'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f43f5e' }} /> {testType === 'mcq' ? 'Wrong' : 'Needs Improvement'}
                        </div>
                    </div>
                </motion.div>

                {results.details && (
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }} style={{ marginTop: 24 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Detailed AI Feedback</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {results.details.map((res, i) => (
                                <div key={i} className="dash-card" style={{ padding: 20, borderLeft: `4px solid ${res.score >= 70 ? '#10b981' : '#f43f5e'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Question {i + 1}</div>
                                        <div style={{ fontSize: 14, fontWeight: 800, color: res.score >= 70 ? '#10b981' : '#f43f5e' }}>{res.score}/100</div>
                                    </div>
                                    <div style={{ fontSize: 14, color: '#cbd5e1', marginBottom: 12, fontWeight: 600 }}>{res.question}</div>
                                    <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.03)', fontSize: 13, color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span style={{ color: '#00f5ff', fontWeight: 700, fontSize: 11, display: 'block', marginBottom: 4 }}>💡 AI FEEDBACK</span>
                                        {res.feedback}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button onClick={() => { setMode('select'); setResults(null); }} className="btn-secondary" style={{ padding: '12px 24px' }}>Back to Tests</button>
                    <button onClick={() => startTest(testType)} className="btn-primary" style={{ padding: '12px 24px' }}>Retry</button>
                </div>
            </div>
        );
    }

    return null;
}
