import { motion } from 'framer-motion';

export default function ProgressCircle({ value, size = 120, strokeWidth = 8, color = '#00f5ff', label, subLabel }) {
    const radius = (size - strokeWidth * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        strokeDasharray={circumference}
                        style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{value}%</span>
                </div>
            </div>
            {label && (
                <div className="text-center">
                    <p className="text-sm font-semibold text-white">{label}</p>
                    {subLabel && <p className="text-xs text-slate-400">{subLabel}</p>}
                </div>
            )}
        </div>
    );
}
