import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('prepnova_current_user');
        if (!saved) return null;
        try {
            const u = JSON.parse(saved);
            // Force First Login Badge if missing on load
            if (u && (!u.earnedBadges || !u.earnedBadges.includes(1))) {
                u.earnedBadges = [1, ...(u.earnedBadges || [])];
                const db = JSON.parse(localStorage.getItem('prepnova_users_db') || '{}');
                if (u.email) db[u.email] = u;
                localStorage.setItem('prepnova_users_db', JSON.stringify(db));
                localStorage.setItem('prepnova_current_user', JSON.stringify(u));
            }
            return u;
        } catch (e) {
            return null;
        }
    });

    // Fail-safe: ensure badge 1 is ALWAYS present and sync Job Readiness status
    useEffect(() => {
        if (user) {
            let updates = {};

            // 1. Ensure First Login Badge
            if (!user.earnedBadges || !user.earnedBadges.includes(1)) {
                updates.earnedBadges = [1, ...(user.earnedBadges || [])];
            }

            // 2. Sync isJobReady based on current roadmap state
            if (user.personalRoadmap && user.personalRoadmap.length > 0) {
                const allDone = user.personalRoadmap.every(rm =>
                    (rm.topics || rm.modules || []).length > 0 &&
                    (rm.topics || rm.modules || []).every(t => t.done)
                );
                if (user.isJobReady !== allDone) {
                    updates.isJobReady = allDone;
                }
            }

            if (Object.keys(updates).length > 0) {
                setUser(prev => {
                    const updated = { ...prev, ...updates };
                    saveUserToDb(updated);
                    return updated;
                });
            }
        }
    }, [user?.personalRoadmap]); // Re-run if roadmap changes or user logs in

    const saveUserToDb = (userData) => {
        const db = JSON.parse(localStorage.getItem('prepnova_users_db') || '{}');
        db[userData.email] = userData;
        localStorage.setItem('prepnova_users_db', JSON.stringify(db));
        localStorage.setItem('prepnova_current_user', JSON.stringify(userData));
    };

    const login = (email, password) => {
        const db = JSON.parse(localStorage.getItem('prepnova_users_db') || '{}');
        let userData = db[email];

        if (!userData) {
            const mockName = email.split('@')[0].replace('.', ' ').replace(/\d+/g, '').trim();
            const name = mockName.charAt(0).toUpperCase() + mockName.slice(1) || 'Explorer';
            userData = {
                name,
                email,
                level: 1,
                xp: 0,
                xpToNext: 500,
                rank: 'Beginner',
                streak: 0,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                hasAnalyzed: false,
                earnedBadges: [1],
                personalRoadmap: null,
                personalSkillGaps: null,
                personalVideos: [],
                personalProjects: [],
                testStats: { mcq: 0, hr: 0, coding: 0 },
                dailyXp: {},
                testHistory: [],
            };
        } else {
            // Force badge for existing users
            if (!userData.earnedBadges) userData.earnedBadges = [];
            if (!userData.earnedBadges.includes(1)) {
                userData.earnedBadges = [1, ...userData.earnedBadges];
            }
        }

        setUser(userData);
        saveUserToDb(userData);
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
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            hasAnalyzed: false,
            earnedBadges: [1], // Re-enabled First Login badge
            personalRoadmap: null,
            personalSkillGaps: null,
            personalVideos: [],
            personalProjects: [],
            testStats: { mcq: 0, hr: 0, coding: 0 },
            dailyXp: {},
            testHistory: [],
        };
        setUser(userData);
        saveUserToDb(userData);
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('prepnova_current_user');
    };

    const setHasAnalyzed = (status) => {
        setUser(prev => {
            if (!prev) return prev;
            const updated = { ...prev, hasAnalyzed: status };
            saveUserToDb(updated);
            return updated;
        });
    };

    const setPersonalData = (roadmap, skillGaps, videos = [], projects = []) => {
        setUser(prev => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                personalRoadmap: roadmap,
                personalSkillGaps: skillGaps,
                personalVideos: videos,
                personalProjects: projects,
                hasAnalyzed: true
            };
            saveUserToDb(updated);
            return updated;
        });
    };

    const giveBadge = (badgeId) => {
        setUser(prev => {
            if (!prev || (prev.earnedBadges && prev.earnedBadges.includes(badgeId))) return prev;
            const updated = { ...prev, earnedBadges: [...(prev.earnedBadges || []), badgeId] };
            saveUserToDb(updated);
            return updated;
        });
    };

    const addXp = (amount) => {
        setUser(prev => {
            if (!prev) return prev;
            const today = new Date().toISOString().split('T')[0];
            const newXp = (prev.xp || 0) + amount;
            const leveledUp = newXp >= prev.xpToNext;

            // Track daily activity
            const updatedDailyXp = { ...(prev.dailyXp || {}) };
            updatedDailyXp[today] = (updatedDailyXp[today] || 0) + amount;

            const updated = {
                ...prev,
                xp: leveledUp ? newXp - prev.xpToNext : newXp,
                level: leveledUp ? prev.level + 1 : prev.level,
                xpToNext: leveledUp ? prev.xpToNext + 500 : prev.xpToNext,
                dailyXp: updatedDailyXp,
                streak: (prev.dailyXp?.[today]) ? prev.streak : (prev.streak + 1) // Simple streak increment on first activity of day
            };
            saveUserToDb(updated);
            return updated;
        });
    };

    const toggleTopic = (roadmapId, topicTitle) => {
        setUser(prev => {
            if (!prev || !prev.personalRoadmap) return prev;
            let xpToGain = 0;
            const updatedRoadmap = prev.personalRoadmap.map(rm => {
                if (rm.id === roadmapId || rm.title === roadmapId) {
                    const updatedTopics = (rm.topics || rm.modules || []).map(t => {
                        const title = typeof t === 'string' ? t : t.title;
                        const isDone = typeof t === 'string' ? false : (t.done || false);
                        if (title === topicTitle) {
                            const newDone = !isDone;
                            if (newDone) xpToGain = 50;
                            return { title, done: newDone };
                        }
                        return typeof t === 'string' ? { title, done: false } : t;
                    });
                    const doneCount = updatedTopics.filter(t => t.done).length;
                    const progress = Math.round((doneCount / updatedTopics.length) * 100);
                    return { ...rm, topics: updatedTopics, progress };
                }
                return rm;
            });

            // Final check for "Job Readiness" (all roadmap topics done)
            const allRoadmapsDone = updatedRoadmap.every(rm => (rm.topics || rm.modules || []).every(t => t.done));

            // Apply XP if earned
            if (xpToGain > 0) {
                const today = new Date().toISOString().split('T')[0];
                const newXp = (prev.xp || 0) + xpToGain;
                const leveledUp = newXp >= (prev.xpToNext || 500);
                const updatedDailyXp = { ...(prev.dailyXp || {}) };
                updatedDailyXp[today] = (updatedDailyXp[today] || 0) + xpToGain;

                const updated = {
                    ...prev,
                    personalRoadmap: updatedRoadmap,
                    isJobReady: allRoadmapsDone,
                    xp: leveledUp ? newXp - prev.xpToNext : newXp,
                    level: leveledUp ? prev.level + 1 : prev.level,
                    xpToNext: leveledUp ? prev.xpToNext + 500 : prev.xpToNext,
                    dailyXp: updatedDailyXp,
                    streak: (prev.dailyXp?.[today]) ? prev.streak : (prev.streak + 1)
                };
                saveUserToDb(updated);
                return updated;
            }

            const updated = { ...prev, personalRoadmap: updatedRoadmap, isJobReady: allRoadmapsDone };
            saveUserToDb(updated);
            return updated;
        });
    };

    const recordTestResult = (type, score) => {
        setUser(prev => {
            if (!prev) return prev;
            const today = new Date().toISOString().split('T')[0];
            const newStats = { ...(prev.testStats || {}), [type]: Math.max(prev.testStats?.[type] || 0, score) };
            let updatedBadges = [...(prev.earnedBadges || [])];

            // Badge logic
            if (score === 100 && !updatedBadges.includes(6)) updatedBadges.push(6);
            if (score >= 90 && !updatedBadges.includes(3)) updatedBadges.push(3);
            const isTripleThreat = newStats.mcq >= 70 && newStats.hr >= 70 && newStats.coding >= 70;
            if (isTripleThreat && !updatedBadges.includes(9)) updatedBadges.push(9);
            const avg = ((newStats.mcq || 0) + (newStats.hr || 0) + (newStats.coding || 0)) / 3;
            if (avg >= 90 && !updatedBadges.includes(8)) updatedBadges.push(8);

            const updated = {
                ...prev,
                testStats: newStats,
                earnedBadges: updatedBadges,
                testHistory: [...(prev.testHistory || []), { date: today, score, type }]
            };
            saveUserToDb(updated);
            return updated;
        });
    };

    const toggleProjectStep = (projectId, stepIndex) => {
        setUser(prev => {
            if (!prev || !prev.personalProjects) return prev;
            let xpToGain = 0;
            const updatedProjects = prev.personalProjects.map(proj => {
                if (proj.id === projectId) {
                    const updatedSteps = proj.steps.map((step, idx) => {
                        if (idx === stepIndex) {
                            const title = typeof step === 'string' ? step : step.title;
                            const isDone = typeof step === 'string' ? false : (step.done || false);

                            const newDone = !isDone;
                            if (newDone) xpToGain = 20; // 20 XP per project step

                            // If it was a string, convert to proper object. 
                            // If it was an object, preserve guide and title.
                            return {
                                title,
                                done: newDone,
                                guide: typeof step === 'string'
                                    ? "Follow this step to complete the project objective."
                                    : (step.guide || "Follow this step to complete the project objective.")
                            };
                        }
                        return step;
                    });
                    return { ...proj, steps: updatedSteps };
                }
                return proj;
            });

            if (xpToGain > 0) {
                const today = new Date().toISOString().split('T')[0];
                const newXp = (prev.xp || 0) + xpToGain;
                const leveledUp = newXp >= (prev.xpToNext || 500);
                const updatedDailyXp = { ...(prev.dailyXp || {}) };
                updatedDailyXp[today] = (updatedDailyXp[today] || 0) + xpToGain;

                const updated = {
                    ...prev,
                    personalProjects: updatedProjects,
                    xp: leveledUp ? newXp - prev.xpToNext : newXp,
                    level: leveledUp ? prev.level + 1 : prev.level,
                    xpToNext: leveledUp ? prev.xpToNext + 500 : prev.xpToNext,
                    dailyXp: updatedDailyXp,
                    streak: (prev.dailyXp?.[today]) ? prev.streak : (prev.streak + 1)
                };
                saveUserToDb(updated);
                return updated;
            }

            const updated = { ...prev, personalProjects: updatedProjects };
            saveUserToDb(updated);
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, addXp, setHasAnalyzed, giveBadge, recordTestResult, setPersonalData, toggleTopic, toggleProjectStep }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
