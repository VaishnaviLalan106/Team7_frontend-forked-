import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Search, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { skillAnalysis } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function ResumeAnalyzer() {
    const [Analyzed, setAnalyzed] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [jdText, setJdText] = useState('');
    const { setPersonalData, user } = useAuth();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = () => {
        if (!resumeFile && !jdText) return;

        setIsAnalyzing(true);

        // Simulate Deep AI Analysis
        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalyzed(true);

            // Generate Unique Personalization Data based on JD/Context
            const generatedRoadmap = [
                { title: `Mastering ${jdText.slice(0, 15) || 'Modern Tech'}`, level: 'Advanced', modules: ['Advanced Patterns', 'Performance Tuning', 'Cloud Deployment'] },
                { title: 'Project Implementation', level: 'Practical', modules: ['Full-stack Integration', 'Security Best Practices'] },
                { title: 'Interview Readiness', level: 'Expert', modules: ['System Design Prep', 'Mock Culture Fit'] }
            ];

            const generatedSkillGaps = {
                matched: ['JavaScript', 'React', 'Git', 'Problem Solving'],
                missing: [jdText.slice(0, 10).trim() || 'System Design', 'Docker', 'AWS', 'GraphQL'],
                priority: ['Cloud Architecture', 'Unit Testing']
            };

            setPersonalData(generatedRoadmap, generatedSkillGaps);
        }, 2000);
    };

    return (
        <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Resume & JD Analyzer</h2>
            <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 28 }}>Upload your resume and paste the job description for AI analysis</p>

            {/* Upload Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 28 }} className="md:grid-cols-2">
                {/* Resume Upload */}
                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Upload size={18} color="#00f5ff" /> Upload Resume
                    </h3>
                    <label style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: 32, borderRadius: 12, border: '2px dashed rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                        <FileText size={32} color="#64748b" style={{ marginBottom: 12 }} />
                        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 4 }}>{resumeFile ? resumeFile.name : 'Click to upload or drag & drop'}</p>
                        <p style={{ fontSize: 12, color: '#475569' }}>PDF, DOCX up to 5MB</p>
                        <input type="file" accept=".pdf,.docx" onChange={e => setResumeFile(e.target.files[0])} style={{ display: 'none' }} />
                    </label>
                </motion.div>

                {/* JD Input */}
                <motion.div className="dash-card" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Search size={18} color="#00f5ff" /> Job Description
                    </h3>
                    <textarea
                        value={jdText}
                        onChange={e => setJdText(e.target.value)}
                        placeholder="Paste the full job description here..."
                        rows={6}
                        style={{
                            width: '100%', padding: 14, borderRadius: 12, fontSize: 14, color: '#e2e8f0',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                            outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
                        }}
                    />
                </motion.div>
            </div>

            <button onClick={handleAnalyze} className="btn-primary" disabled={isAnalyzing} style={{ marginBottom: 32, padding: '14px 36px', opacity: isAnalyzing ? 0.7 : 1 }}>
                {isAnalyzing ? 'Analyzing Resume...' : <><Search size={18} /> Analyze Match</>}
            </button>

            {/* Results */}
            {Analyzed && (
                <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                    {/* Score + Radar Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 24 }}>
                        <div className="dash-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{
                                    width: 84, height: 84, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(16,185,129,0.15))',
                                    border: '3px solid rgba(0,245,255,0.4)',
                                    boxShadow: '0 0 20px rgba(0,245,255,0.15)',
                                }}>
                                    <span style={{ fontSize: 30, fontWeight: 800, color: '#00f5ff' }}>82%</span>
                                </div>
                                <div>
                                    <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Overall Match Score</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                                        <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>Good match for this role</p>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="md:grid-cols-2">
                                <div>
                                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#10b981', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <CheckCircle2 size={15} /> Matched Skills
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {skillAnalysis.matched.map((s, i) => (
                                            <span key={i} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.15)' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#f43f5e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <XCircle size={15} /> Missing Skills
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {skillAnalysis.missing.map((s, i) => (
                                            <span key={i} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(244,63,94,0.08)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.15)' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <AlertTriangle size={15} /> Priority Skills
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {skillAnalysis.priority.map((s, i) => (
                                            <span key={i} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.15)' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Radar Chart Card */}
                        <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 24, textAlign: 'center' }}>Skill Performance</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart data={skillAnalysis.radarData}>
                                    <PolarGrid stroke="rgba(0,245,255,0.1)" />
                                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                                    <Radar dataKey="level" stroke="#00f5ff" fill="#3b82f6" fillOpacity={0.2} strokeWidth={3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
