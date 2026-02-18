import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('prepnova_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (email, password) => {
        const userData = {
            name: 'Alex Johnson',
            email,
            level: 12,
            xp: 2840,
            xpToNext: 4000,
            rank: 'Rising Star',
            streak: 7,
            avatar: null,
            hasAnalyzed: true,
            earnedBadges: [1, 2, 3, 4],
            personalRoadmap: null,
            personalSkillGaps: null,
            testStats: { mcq: 0, hr: 0, coding: 0 }
        };
        setUser(userData);
        localStorage.setItem('prepnova_user', JSON.stringify(userData));
        return true;
    };

    const signup = (name, email, password) => {
        const userData = {
            name,
            email,
            level: 1,
            xp: 0,
            xpToNext: 500,
            rank: 'Beginner',
            streak: 0,
            avatar: null,
            hasAnalyzed: false,
            earnedBadges: [1],
            personalRoadmap: null,
            personalSkillGaps: null,
            testStats: { mcq: 0, hr: 0, coding: 0 }
        };
        setUser(userData);
        localStorage.setItem('prepnova_user', JSON.stringify(userData));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('prepnova_user');
    };

    const setHasAnalyzed = (status) => {
        setUser(prev => {
            if (!prev) return prev;
            const updated = { ...prev, hasAnalyzed: status };
            localStorage.setItem('prepnova_user', JSON.stringify(updated));
            return updated;
        });
    };

    const setPersonalData = (roadmap, skillGaps) => {
        setUser(prev => {
            if (!prev) return prev;
            const updated = { ...prev, personalRoadmap: roadmap, personalSkillGaps: skillGaps, hasAnalyzed: true };
            localStorage.setItem('prepnova_user', JSON.stringify(updated));
            return updated;
        });
    };

    const giveBadge = (badgeId) => {
        setUser(prev => {
            if (!prev || prev.earnedBadges.includes(badgeId)) return prev;
            const updated = { ...prev, earnedBadges: [...prev.earnedBadges, badgeId] };
            localStorage.setItem('prepnova_user', JSON.stringify(updated));
            return updated;
        });
    };

    const recordTestResult = (type, score) => {
        setUser(prev => {
            if (!prev) return prev;
            const newStats = { ...prev.testStats, [type]: Math.max(prev.testStats?.[type] || 0, score) };

            let updatedBadges = [...(prev.earnedBadges || [])];

            // 1. Perfect Score Badge (ID 6) - 100%
            if (score === 100 && !updatedBadges.includes(6)) {
                updatedBadges.push(6);
            }

            // 2. Quiz Master Badge (ID 3) - 90%+
            if (score >= 90 && !updatedBadges.includes(3)) {
                updatedBadges.push(3);
            }

            // 3. Triple Threat Badge (ID 9) - 70%+ in all three
            const isTripleThreat = newStats.mcq >= 70 && newStats.hr >= 70 && newStats.coding >= 70;
            if (isTripleThreat && !updatedBadges.includes(9)) {
                updatedBadges.push(9);
            }

            // 4. Interview Ready Badge (ID 8) - Overall Avg >= 90%
            const avg = (newStats.mcq + newStats.hr + newStats.coding) / 3;
            if (avg >= 90 && !updatedBadges.includes(8)) {
                updatedBadges.push(8);
            }

            let updated = { ...prev, testStats: newStats, earnedBadges: updatedBadges };

            localStorage.setItem('prepnova_user', JSON.stringify(updated));
            return updated;
        });
    };

    const addXp = (amount) => {
        setUser(prev => {
            if (!prev) return prev;
            const newXp = (prev.xp || 0) + amount;
            const leveledUp = newXp >= prev.xpToNext;
            const updated = {
                ...prev,
                xp: leveledUp ? newXp - prev.xpToNext : newXp,
                level: leveledUp ? prev.level + 1 : prev.level,
                xpToNext: leveledUp ? prev.xpToNext + 500 : prev.xpToNext,
            };
            localStorage.setItem('prepnova_user', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, addXp, setHasAnalyzed, giveBadge, recordTestResult, setPersonalData }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
