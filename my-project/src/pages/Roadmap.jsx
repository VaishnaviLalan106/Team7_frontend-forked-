import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Map, ChevronDown, ChevronRight, CheckCircle2, Circle, Zap, PlayCircle, BookOpen, CheckCircle, Brain, Layout, ArrowRight, ArrowLeft, RotateCw } from 'lucide-react';
import { roadmaps } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { aiService } from '../services/aiService';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
        // Handle bolding
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formattedLine = parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} style={{ color: '#fff', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });

        return (
            <p key={i} style={{ marginBottom: line.trim() === '' ? 12 : 8, minHeight: line.trim() === '' ? 4 : 'auto' }}>
                {formattedLine}
            </p>
        );
    });
};

export default function Roadmap() {
    const [expandedId, setExpandedId] = useState(null);
    const [studyTopic, setStudyTopic] = useState(null);
    const [studyStep, setStudyStep] = useState(0); // 0: Tutorial, 1: Flashcards, 2: Final Check
    const [flashcards, setFlashcards] = useState([]);
    const [flippedCards, setFlippedCards] = useState({});
    const [tutorialNotes, setTutorialNotes] = useState(null);
    const [isLoadingNotes, setIsLoadingNotes] = useState(false);
    const { user, toggleTopic } = useAuth();
    const hasAnalyzed = user?.hasAnalyzed;

    useEffect(() => {
        if (studyTopic) {
            console.log("Study Topic Selected:", studyTopic); // Debug log
            setStudyStep(0);
            setFlippedCards({});

            // Map resources to a cleaner format
            const takeaways = studyTopic.resources?.map(r => ({
                t: r.skill,
                d: r.url,
                isLink: true
            })) || [];

            setTutorialNotes({
                intro: studyTopic.notes || `This module focuses on ${studyTopic.title}.`,
                keyTakeaways: takeaways.length > 0 ? takeaways : [
                    { t: 'Foundational Theory', d: 'Master the underlying principles and terminology.' },
                    { t: 'Live Examples', d: 'Break down real-world code snippets and usage.' },
                    { t: 'Common Pitfalls', d: 'Learn what to avoid during implementation.' }
                ]
            });

            setFlashcards(studyTopic.flashcards || []);
        }
    }, [studyTopic]);

    const toggle = (id) => setExpandedId(expandedId === id ? null : id);

    // Use user-specific roadmap if available, else fallback to mock
    const roadmapData = user?.personalRoadmap || roadmaps;

    const displayRoadmaps = roadmapData.map((rm, idx) => {
        const id = rm.id || `personal-${idx}`;
        const topics = (rm.topics || rm.modules || []).map((t, j) => ({
            title: typeof t === 'string' ? t : t.title,
            done: user?.completedSkills?.includes(typeof t === 'string' ? t : t.title)
        }));

        const weekProgress = topics.length > 0
            ? Math.round((topics.filter(t => t.done).length / topics.length) * 100)
            : 0;

        return {
            ...rm,
            id,
            weeks: rm.weeks || 1,
            progress: id.startsWith('personal-') || id.startsWith('week-') || id.startsWith('rm-')
                ? weekProgress
                : (rm.progress || 0),
            xp: rm.xp || 500,
            topics
        };
    });

    const handleStudyCompletion = (roadmapId, topicTitle) => {
        // Instant close for premium feel
        setStudyTopic(null);
        // Trigger update in background
        toggleTopic(roadmapId, topicTitle);
    };

    const toggleCard = (idx) => {
        setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Learning Roadmaps</h2>
            <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 28 }}>Personalized paths to close your skill gaps</p>

            {user?.isJobReady && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.08), rgba(99, 102, 241, 0.08))',
                        border: '1px solid rgba(0, 245, 255, 0.15)',
                        borderRadius: 24,
                        padding: '30px',
                        marginBottom: 40,
                        textAlign: 'center',
                        boxShadow: '0 10px 30px -10px rgba(0, 245, 255, 0.2)'
                    }}
                >
                    <div style={{ display: 'inline-flex', padding: 12, borderRadius: '50%', background: 'rgba(0, 245, 255, 0.1)', marginBottom: 16 }}>
                        <Zap size={32} color="#00f5ff" />
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>You're Officially Job Ready! 🚀</h2>
                    <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 600, margin: '0 auto' }}>
                        Congratulations {user?.name}! You've mastered every skill in your roadmap.
                        Your profile is now optimized for top-tier roles. Time to crush those interviews!
                    </p>
                </motion.div>
            )}

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
                                            {rm.topics.map((topic, j) => {
                                                const isUnlocked = j === 0 || rm.topics[j - 1].done;
                                                const isDone = topic.done;

                                                return (
                                                    <div key={j}
                                                        style={{
                                                            padding: '16px 0',
                                                            borderBottom: j < rm.topics.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                                                            opacity: isUnlocked ? 1 : 0.5,
                                                            pointerEvents: isUnlocked ? 'auto' : 'none'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isUnlocked && !isDone ? 12 : 0 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                                {isDone
                                                                    ? <CheckCircle2 size={18} color="#10b981" />
                                                                    : (isUnlocked ? <Circle size={18} color="#00f5ff" /> : <Circle size={18} color="#334155" />)}
                                                                <span style={{ fontSize: 15, color: isDone ? '#64748b' : '#cbd5e1', textDecoration: isDone ? 'line-through' : 'none', fontWeight: isUnlocked && !isDone ? 600 : 400 }}>
                                                                    Week {j + 1}: {topic.title}
                                                                </span>
                                                            </div>
                                                            {!isDone && isUnlocked && (
                                                                <button
                                                                    onClick={() => setStudyTopic({
                                                                        ...rm,
                                                                        roadmapId: rm.id,
                                                                        roadmapTitle: rm.title,
                                                                        title: topic.title,
                                                                        week: j + 1,
                                                                        flashcards: rm.flashcards
                                                                    })}
                                                                    className="btn-primary"
                                                                    style={{ padding: '6px 16px', fontSize: 12, borderRadius: 8 }}
                                                                >
                                                                    Start Studying
                                                                </button>
                                                            )}
                                                            {!isUnlocked && <span style={{ fontSize: 11, color: '#334155', fontWeight: 700 }}>LOCKED</span>}
                                                            {isDone && <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>COMPLETED</span>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
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
                        <Link to="/dashboard/resume" className="btn-primary" style={{ padding: '12px 32px', textDecoration: 'none' }}>Go to Resume Analyzer</Link>
                    </motion.div>
                )}
            </div>

            {/* Advanced Study Modal */}
            <AnimatePresence>
                {studyTopic && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 100,
                            background: 'rgba(5, 10, 20, 0.85)', backdropFilter: 'blur(16px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                            className="dash-card"
                            style={{
                                maxWidth: 850, width: '100%', padding: '0',
                                position: 'relative', border: '1px solid rgba(0,245,255,0.2)',
                                overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column'
                            }}
                        >
                            {/* Modal Header/Tabs */}
                            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                                {['Tutorial', 'Flashcards', 'Final Check'].map((name, i) => (
                                    <div key={i}
                                        onClick={() => setStudyStep(i)}
                                        style={{
                                            flex: 1, padding: '16px', textAlign: 'center', fontSize: 13, fontWeight: 600,
                                            color: studyStep === i ? '#00f5ff' : '#64748b',
                                            borderBottom: `2px solid ${studyStep === i ? '#00f5ff' : 'transparent'}`,
                                            background: studyStep === i ? 'rgba(0,245,255,0.03)' : 'none',
                                            transition: 'all 0.3s',
                                            cursor: 'pointer'
                                        }}
                                        className="hover-tab"
                                    >
                                        {name}
                                    </div>
                                ))}
                            </div>

                            {/* Scrollable Body */}
                            <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {studyStep === 0 && (
                                        <motion.div key="step-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,245,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <BookOpen size={20} color="#00f5ff" />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 13, color: '#00f5ff', fontWeight: 700, margin: 0 }}>WEEK {studyTopic.week} MODULE</p>
                                                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>{studyTopic.title}</h3>
                                                </div>
                                            </div>

                                            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '24px 28px', border: '1px solid rgba(255,255,255,0.05)', minHeight: 180 }}>
                                                {isLoadingNotes ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 140, gap: 12 }}>
                                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><RotateCw size={24} color="#00f5ff" /></motion.div>
                                                        <p style={{ fontSize: 13, color: '#64748b' }}>AI generating your weekly notes...</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: 28 }}>
                                                            {renderMarkdown(tutorialNotes?.intro)}
                                                        </div>
                                                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <Zap size={14} color="#00f5ff" /> Learning Resources & Takeaways:
                                                        </h4>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                                                            {tutorialNotes?.keyTakeaways?.map((item, idx) => (
                                                                <div key={idx} style={{
                                                                    display: 'flex', gap: 12, padding: 16, borderRadius: 12,
                                                                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)'
                                                                }}>
                                                                    <div style={{ marginTop: 2 }}><Layout size={14} color="#00f5ff" /></div>
                                                                    <div>
                                                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{item.t}</div>
                                                                        {item.isLink ? (
                                                                            <a href={item.d} target="_blank" rel="noopener noreferrer"
                                                                                style={{ fontSize: 12, color: '#00f5ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                                                                View Resource <PlayCircle size={12} />
                                                                            </a>
                                                                        ) : (
                                                                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{item.d}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {studyStep === 1 && (
                                        <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Brain size={20} color="#818cf8" />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 13, color: '#818cf8', fontWeight: 700, margin: 0 }}>ACTIVE RECALL</p>
                                                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>Knowledge Flashcards</h3>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, padding: 4 }}>
                                                {flashcards.map((card, i) => (
                                                    <motion.div key={i}
                                                        onClick={() => toggleCard(i)}
                                                        style={{
                                                            height: 140, cursor: 'pointer', perspective: '1000px',
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        <motion.div
                                                            animate={{ rotateY: flippedCards[i] ? 180 : 0 }}
                                                            transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                                                            style={{
                                                                width: '100%', height: '100%', position: 'relative',
                                                                transformStyle: 'preserve-3d',
                                                            }}
                                                        >
                                                            {/* Front */}
                                                            <div style={{
                                                                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                                                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                                                borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column',
                                                                alignItems: 'center', justifyContent: 'center', textAlign: 'center'
                                                            }}>
                                                                <div style={{ fontSize: 11, color: '#818cf8', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>Question</div>
                                                                <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{card.q}</div>
                                                                <div style={{ marginTop: 'auto', fontSize: 10, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                    <RotateCw size={10} /> Click to flip
                                                                </div>
                                                            </div>
                                                            {/* Back */}
                                                            <div style={{
                                                                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                                                                background: 'rgba(129, 140, 248, 0.08)', border: '1px solid rgba(129, 140, 248, 0.2)',
                                                                borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column',
                                                                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                                                                transform: 'rotateY(180deg)'
                                                            }}>
                                                                <div style={{ fontSize: 11, color: '#818cf8', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase' }}>Answer</div>
                                                                <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.4 }}>{card.a}</div>
                                                            </div>
                                                        </motion.div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {studyStep === 2 && (
                                        <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                                    <CheckCircle2 size={40} color="#10b981" />
                                                </div>
                                                <h3 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Ready for Certification?</h3>
                                                <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 450, margin: '0 auto 32px', lineHeight: 1.6 }}>
                                                    You've completed the tutorials and flashcard drills. Mark this module as done to earn your XP and unlock the next stage.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Fixed Footer */}
                            <div style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                                {studyStep === 0 && (
                                    <button onClick={() => setStudyStep(1)} className="btn-primary" style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                        Next Component: Flashcard Study <ArrowRight size={18} />
                                    </button>
                                )}
                                {studyStep === 1 && (
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button onClick={() => setStudyStep(0)} className="btn-secondary" style={{ flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                            <ArrowLeft size={18} /> Back
                                        </button>
                                        <button onClick={() => setStudyStep(2)} className="btn-primary" style={{ flex: 2, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                            Final Confirmation <ArrowRight size={18} />
                                        </button>
                                    </div>
                                )}
                                {studyStep === 2 && (
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button onClick={() => setStudyStep(1)} className="btn-secondary" style={{ flex: 1, padding: '14px' }}>Review Cards</button>
                                        <button
                                            onClick={() => handleStudyCompletion(studyTopic.roadmapId, studyTopic.title)}
                                            className="btn-primary"
                                            style={{ flex: 2, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg, #10b981, #059669)' }}
                                        >
                                            <CheckCircle size={18} /> Mark Module as Complete
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setStudyTopic(null)}
                                style={{
                                    position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#475569', fontSize: 24
                                }}
                            >
                                &times;
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
