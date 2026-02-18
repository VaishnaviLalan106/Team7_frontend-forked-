import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Swords, Zap, Bug, UserCheck, Timer, Star, Trophy,
    X, Play, ChevronRight
} from 'lucide-react';
import useStore from '../store/useStore';

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

const games = [
    {
        id: 'concept-combat',
        name: 'Concept Combat',
        desc: 'Q&A battle style challenge. Answer quickly, score multipliers build up!',
        icon: Swords,
        color: '#FF6B6B',
        xpReward: 75,
        difficulty: 'Medium',
        duration: '5 min',
        questions: [
            { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1 },
            { q: 'Which hook is used for side effects in React?', options: ['useState', 'useEffect', 'useRef', 'useMemo'], correct: 1 },
            { q: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Logic', 'System Query Language', 'Standard Query Lib'], correct: 0 },
        ],
    },
    {
        id: 'rapid-fire',
        name: 'Rapid Fire 60',
        desc: '60-second speed challenge. 10 rapid questions, think fast!',
        icon: Zap,
        color: '#8B5CF6',
        xpReward: 50,
        difficulty: 'Hard',
        duration: '60 sec',
        questions: [
            { q: 'Is JavaScript single-threaded?', options: ['Yes', 'No'], correct: 0 },
            { q: 'CSS Grid or Flexbox for 2D layouts?', options: ['Grid', 'Flexbox'], correct: 0 },
            { q: 'Default port for HTTP?', options: ['80', '443', '3000', '8080'], correct: 0 },
        ],
    },
    {
        id: 'fix-the-bug',
        name: 'Fix The Bug',
        desc: 'Find and fix code snippets. Debug faster, earn more points.',
        icon: Bug,
        color: '#10B981',
        xpReward: 60,
        difficulty: 'Medium',
        duration: '3 min',
        questions: [
            { q: 'const x = [1,2,3]; x.push(4); console.log(x.lenght); — What\'s wrong?', options: ['lenght → length', 'push → append', 'const → let', 'Nothing wrong'], correct: 0 },
        ],
    },
    {
        id: 'boss-mode',
        name: 'Interview Boss Mode',
        desc: 'Face different interviewer personas. Adapt your strategy!',
        icon: UserCheck,
        color: '#F59E0B',
        xpReward: 100,
        difficulty: 'Expert',
        duration: '10 min',
        personas: ['Strict Interviewer', 'Startup Founder', 'Corporate HR'],
        questions: [
            { q: 'Tell me about a time you handled a difficult deadline.', options: ['Great answer', 'Good answer', 'Okay answer', 'Poor answer'], correct: 0 },
        ],
    },
];

function GameCard({ game, onClick, index }) {
    const Icon = game.icon;
    return (
        <motion.div
            {...fadeUp}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 cursor-pointer group"
            onClick={() => onClick(game)}
            whileHover={{ y: -4 }}
        >
            <div className="flex items-start justify-between mb-4">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                        background: `linear-gradient(135deg, ${game.color}20, ${game.color}08)`,
                        border: `1px solid ${game.color}30`,
                    }}
                >
                    <Icon size={26} style={{ color: game.color }} />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 text-xs font-medium text-slate-400">
                    <Star size={12} className="text-amber" />
                    {game.xpReward} XP
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-gradient-coral transition-colors">
                {game.name}
            </h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">{game.desc}</p>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Timer size={12} /> {game.duration}
                    </span>
                    <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                        style={{
                            background: `${game.color}15`,
                            color: game.color,
                        }}
                    >
                        {game.difficulty}
                    </span>
                </div>
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                    style={{ background: `${game.color}20` }}
                >
                    <Play size={14} style={{ color: game.color }} />
                </div>
            </div>
        </motion.div>
    );
}

function GameModal({ game, onClose }) {
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState(null);
    const [finished, setFinished] = useState(false);
    const { triggerXpPopup } = useStore();

    const questions = game.questions;

    const handleAnswer = (optIndex) => {
        if (answered) return;
        setSelectedOpt(optIndex);
        setAnswered(true);
        if (optIndex === questions[currentQ].correct) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQ + 1 >= questions.length) {
            setFinished(true);
            triggerXpPopup(game.xpReward);
        } else {
            setCurrentQ(currentQ + 1);
            setAnswered(false);
            setSelectedOpt(null);
        }
    };

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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card-static p-6 md:p-8 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <game.icon size={24} style={{ color: game.color }} />
                        <h2 className="text-xl font-bold text-white">{game.name}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer border-none"
                    >
                        <X size={16} />
                    </button>
                </div>

                {!finished ? (
                    <>
                        {/* Progress */}
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                            <span>Question {currentQ + 1}/{questions.length}</span>
                            <span className="flex items-center gap-1">
                                <Trophy size={12} className="text-amber" />
                                Score: {score}
                            </span>
                        </div>
                        <div className="h-1 rounded-full bg-white/5 mb-6">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-lavender to-coral transition-all"
                                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        {/* Question */}
                        <h3 className="text-base font-semibold text-white mb-5 leading-relaxed">
                            {questions[currentQ].q}
                        </h3>

                        {/* Options */}
                        <div className="space-y-2 mb-6">
                            {questions[currentQ].options.map((opt, i) => {
                                let optStyle = 'border-white/5 hover:border-white/15 hover:bg-white/5';
                                if (answered) {
                                    if (i === questions[currentQ].correct) {
                                        optStyle = 'border-emerald/50 bg-emerald/10 text-emerald';
                                    } else if (i === selectedOpt) {
                                        optStyle = 'border-coral/50 bg-coral/10 text-coral';
                                    }
                                }
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(i)}
                                        disabled={answered}
                                        className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer bg-transparent ${optStyle} ${answered ? 'cursor-default' : ''
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {answered && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleNext}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-lavender to-coral text-white font-semibold text-sm cursor-pointer border-none flex items-center justify-center gap-2"
                            >
                                {currentQ + 1 >= questions.length ? 'See Results' : 'Next Question'}
                                <ChevronRight size={16} />
                            </motion.button>
                        )}
                    </>
                ) : (
                    /* Results */
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-center py-4"
                    >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lavender to-coral flex items-center justify-center mx-auto mb-4">
                            <Trophy size={36} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Challenge Complete!</h3>
                        <p className="text-slate-400 mb-1">
                            You scored <span className="text-white font-bold">{score}/{questions.length}</span>
                        </p>
                        <p className="text-sm text-lavender font-semibold mb-6">+{game.xpReward} XP Earned</p>
                        <button
                            onClick={onClose}
                            className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}

export default function Games() {
    const [selectedGame, setSelectedGame] = useState(null);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6">
            {/* Header */}
            <motion.div {...fadeUp} className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold font-[Poppins] mb-2">
                    <span className="text-gradient-lavender">Game Arena</span>
                </h1>
                <p className="text-slate-400 text-sm">
                    Challenge yourself. Earn XP. Level up your interview skills.
                </p>
            </motion.div>

            {/* Game Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                {games.map((game, i) => (
                    <GameCard key={game.id} game={game} index={i} onClick={setSelectedGame} />
                ))}
            </div>

            {/* Game Modal */}
            <AnimatePresence>
                {selectedGame && (
                    <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}
