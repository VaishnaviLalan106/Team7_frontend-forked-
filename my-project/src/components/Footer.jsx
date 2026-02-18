import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer style={{ padding: '0 0 32px', position: 'relative', zIndex: 10 }}>
            <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.08), transparent)', marginBottom: 28 }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: 'linear-gradient(135deg, #00f5ff, #3b82f6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Sparkles size={13} color="#050a15" />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(135deg, #00f5ff, #00dde6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            PrepNova
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                        <a href="#features" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>Features</a>
                        <a href="#" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>Privacy</a>
                        <a href="#" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>Terms</a>
                    </div>

                    <p style={{ fontSize: 12, color: '#1e293b', margin: 0 }}>© 2026 PrepNova. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
