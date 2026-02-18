import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import FloatingLines from './FloatingLines';
import useStore from '../store/useStore';

const XpPopup = () => {
    const { showXpPopup, xpPopupAmount } = useStore();
    return (
        <AnimatePresence>
            {showXpPopup && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 0 }}
                    animate={{ opacity: 1, scale: 1.2, y: -30 }}
                    exit={{ opacity: 0, scale: 1, y: -60 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="fixed top-24 right-8 z-[100] pointer-events-none"
                >
                    <div className="px-4 py-2 rounded-full bg-gradient-to-r from-lavender to-coral text-white font-bold text-lg shadow-lg shadow-lavender/30">
                        +{xpPopupAmount} XP ✨
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default function Layout({ children }) {
    const currentPage = useStore((s) => s.currentPage);

    return (
        <div className="min-h-screen relative">
            {/* Background Animation */}
            <div className="floating-lines-bg">
                <FloatingLines
                    enabledWaves={['middle', 'bottom', 'top']}
                    lineCount={5}
                    lineDistance={5}
                    bendRadius={5}
                    bendStrength={-0.5}
                    interactive={true}
                    parallax={true}
                />
            </div>

            {/* Overlay for readability */}
            <div className="fixed inset-0 z-0 bg-navy-dark/70 pointer-events-none" />

            {/* Navbar */}
            <Navbar />

            {/* XP Popup */}
            <XpPopup />

            {/* Page Content */}
            <main className="relative z-10 pt-20 pb-24 md:pb-8 min-h-screen">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
