import FloatingLines from './FloatingLines';

export default function AnimatedBackground() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            background: '#050a15',
            overflow: 'hidden',
        }}>
            <FloatingLines
                linesGradient={['#00f5ff', '#0ea5e9', '#3b82f6', '#6366f1']}
                enabledWaves={['top', 'middle', 'bottom']}
                lineCount={5}
                lineDistance={5}
                bendRadius={5}
                bendStrength={-0.5}
                interactive={true}
                parallax={true}
            />
        </div>
    );
}
