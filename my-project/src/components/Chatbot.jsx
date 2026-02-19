import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Minus } from 'lucide-react';
import { aiService } from '../services/aiService';

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

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: messages.length + 1, text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Get AI response
            const botResponse = await aiService.getChatbotResponse(messages, input);
            setMessages(prev => [...prev, { id: prev.length + 1, text: botResponse, sender: 'bot' }]);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { id: prev.length + 1, text: "I'm having trouble connecting right now. Please try again later!", sender: 'bot' }]);
        } finally {
            setIsTyping(false);
        }
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
                        <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }} className="chatbot-messages">
                            {messages.map(msg => (
                                <div key={msg.id} style={{
                                    alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                                    maxWidth: '85%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4
                                }}>
                                    <div style={{
                                        padding: '12px 16px',
                                        borderRadius: msg.sender === 'bot' ? '4px 16px 16px 16px' : '16px 16px 4px 16px',
                                        background: msg.sender === 'bot' ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #00f5ff, #6366f1)',
                                        color: msg.sender === 'bot' ? '#cbd5e1' : '#fff',
                                        fontSize: 13,
                                        lineHeight: 1.6,
                                        border: msg.sender === 'bot' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                        boxShadow: msg.sender === 'bot' ? 'none' : '0 4px 12px rgba(0,245,255,0.15)',
                                    }}>
                                        {msg.text}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#475569', alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end', padding: '0 4px' }}>
                                        {msg.sender === 'bot' ? 'PrepNova AI' : 'You'}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: 'rgba(255,255,255,0.03)' }}>
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f5ff' }} />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f5ff' }} />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f5ff' }} />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
                            {[
                                { label: 'Analyze Resume', icon: '📄' },
                                { label: 'My Roadmap', icon: '🗺️' },
                                { label: 'Start Mock Test', icon: '⚡' },
                                { label: 'Skill Gaps', icon: '🎯' }
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setInput(action.label); }}
                                    style={{
                                        whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: 20,
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                                        color: '#94a3b8', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                                    }}
                                >
                                    <span>{action.icon}</span> {action.label}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div style={{ padding: '0 20px 20px', background: 'transparent' }}>
                            <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask anything..."
                                    style={{
                                        flex: 1,
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 14,
                                        padding: '12px 16px',
                                        color: '#fff',
                                        fontSize: 13,
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
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
