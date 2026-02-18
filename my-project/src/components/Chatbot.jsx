import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Minus } from 'lucide-react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your PrepNova AI assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { id: messages.length + 1, text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Mock AI response
        setTimeout(() => {
            const botResponse = getMockResponse(input);
            setMessages(prev => [...prev, { id: prev.length + 1, text: botResponse, sender: 'bot' }]);
            setIsTyping(false);
        }, 1500);
    };

    const getMockResponse = (text) => {
        const t = text.toLowerCase();
        if (t.includes('roadmap')) return "You can unlock your personalized roadmap by analyzing your resume in the Resume Analyzer tab!";
        if (t.includes('badge') || t.includes('achievement')) return "Badges are earned as you complete tasks like your first login, maintaining streaks, or acing mock tests.";
        if (t.includes('xp')) return "You earn XP by completing mock tests and finishing roadmap topics. Level up to become a 'Rising Star'!";
        if (t.includes('hello') || t.includes('hi')) return "Hello! I'm here to help you navigate PrepNova. What's on your mind?";
        return "That's a great question! I'm currently in beta, but I can help you with understanding your dashboard, roadmaps, and mock tests.";
    };

    return (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, fontFamily: 'Inter, sans-serif' }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-card"
                        style={{
                            width: 360,
                            height: 500,
                            marginBottom: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,245,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Bot size={18} color="#00f5ff" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>PrepNova AI</div>
                                    <div style={{ fontSize: 10, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Online
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
                                    <Minus size={18} />
                                </button>
                                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {messages.map(msg => (
                                <div key={msg.id} style={{
                                    alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                                    maxWidth: '85%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4
                                }}>
                                    <div style={{
                                        padding: '10px 14px',
                                        borderRadius: msg.sender === 'bot' ? '0 16px 16px 16px' : '16px 16px 0 16px',
                                        background: msg.sender === 'bot' ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #00f5ff, #6366f1)',
                                        color: msg.sender === 'bot' ? '#cbd5e1' : '#fff',
                                        fontSize: 13,
                                        lineHeight: 1.5,
                                        border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                    }}>
                                        {msg.text}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#475569', alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end' }}>
                                        {msg.sender === 'bot' ? 'AI Assistant' : 'You'}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '12px 16px', borderRadius: '0 16px 16px 16px', background: 'rgba(255,255,255,0.03)' }}>
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748b' }} />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748b' }} />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748b' }} />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    style={{
                                        flex: 1,
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 12,
                                        padding: '12px 14px',
                                        color: '#fff',
                                        fontSize: 13,
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    style={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 10,
                                        background: 'linear-gradient(135deg, #00f5ff, #6366f1)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        boxShadow: '0 4px 12px rgba(0,245,255,0.2)',
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00f5ff, #6366f1)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 8px 32px rgba(0,245,255,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                }}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
}
