import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { aiService } from '../services/aiService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const verifySession = useCallback(async () => {
        const token = localStorage.getItem('prepnova_token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // 1. Get User Profile
            const profileRes = await api.get('/auth/me');

            // 2. Get Comprehensive Dashboard Data (XP, Skills, Progress)
            const dashRes = await api.get('/dashboard/');
            const d = dashRes.data;

            // 3. Get Roadmap and Projects
            let personalRoadmap = [];
            let personalProjects = [];
            let personalVideos = [];
            try {
                const roadmapRes = await api.get('/roadmap/');
                personalRoadmap = aiService.transformRoadmap(roadmapRes.data.roadmap);
                personalProjects = aiService.transformProjects(roadmapRes.data.mini_projects, d.project_progress);
                personalVideos = aiService.extractVideos(roadmapRes.data.roadmap);
            } catch (err) {
                console.warn("Could not fetch roadmap, might not be generated yet.");
            }

            // map backend structure to frontend state
            const fullUser = {
                ...profileRes.data,
                xp: d.xp,
                level: d.level,
                xpToNext: d.xp_to_next,
                streak: d.streak,
                earnedBadges: d.earned_badges || [],
                dailyXp: d.daily_xp || {},
                personalSkillGaps: {
                    score: d.match_percentage || 0,
                    matched: d.matched_skills || [],
                    missing: d.missing_skills || [],
                    priority: d.missing_skills?.slice(0, 3) || [],
                    radarData: aiService.calculateRadarData(d.match_percentage || 0)
                },
                personalRoadmap,
                personalProjects,
                personalVideos,
                completedSkills: d.completed_skills || [],
                totalProgress: d.total_progress_percentage || 0,
                projectProgress: d.project_progress || [],
                testHistory: d.recent_test_scores || [],
                testStats: (d.recent_test_scores || []).reduce((acc, t) => {
                    const type = t.test_type?.toLowerCase() || 'mcq';
                    if (!acc[type] || t.score > acc[type]) {
                        acc[type] = t.score;
                    }
                    return acc;
                }, { mcq: 0, hr: 0, coding: 0 }),
                hasAnalyzed: d.match_percentage !== null && d.match_percentage !== undefined,
                isJobReady: d.total_progress_percentage >= 100,
                // Add default "Cool Avatar" logic
                avatar: profileRes.data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${profileRes.data.name}&backgroundColor=00f5ff,6366f1`
            };

            setUser(fullUser);
            localStorage.setItem('prepnova_current_user', JSON.stringify(fullUser));

            // Award First Login Badge if missing
            if (!fullUser.earnedBadges.includes(1)) {
                try {
                    await api.post('/gamification/badge', { badge_id: 1 });
                    // Refresh user data after awarding badge
                    const refreshResponse = await api.get('/auth/me');
                    const refreshedData = refreshResponse.data;
                    const refreshedUser = {
                        ...fullUser,
                        earnedBadges: JSON.parse(refreshedData.earned_badges || '[]')
                    };
                    setUser(refreshedUser);
                    localStorage.setItem('prepnova_current_user', JSON.stringify(refreshedUser));
                } catch (err) {
                    console.error("Failed to award first login badge:", err);
                }
            }
        } catch (error) {
            console.error("Session verification failed:", error);
            setUser(null);
            localStorage.removeItem('prepnova_token');
            localStorage.removeItem('prepnova_current_user');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial session check
    useEffect(() => {
        verifySession();
    }, [verifySession]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            localStorage.setItem('prepnova_token', response.data.access_token);
            await verifySession();
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                return { success: false, error: "Server is unreachable. Please ensure the backend is running." };
            }
            const detail = error.response?.data?.detail;
            const msg = typeof detail === 'object' ? JSON.stringify(detail) : (detail || "Login failed. Please check your credentials.");
            return { success: false, error: msg };
        }
    };

    const signup = async (name, email, password) => {
        try {
            await api.post('/auth/signup', { name, email, password });
            return await login(email, password);
        } catch (error) {
            console.error("Signup failed:", error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                return { success: false, error: "Server is unreachable. Please ensure the backend is running." };
            }
            const detail = error.response?.data?.detail;
            const msg = typeof detail === 'object' ? JSON.stringify(detail) : (detail || "Signup failed");
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('prepnova_token');
        localStorage.removeItem('prepnova_current_user');
    };

    const refreshUser = async () => {
        await verifySession();
    };

    const giveBadge = async (badgeId) => {
        try {
            await api.post('/gamification/badge', { badge_id: badgeId });
            await verifySession();
        } catch (error) {
            console.error("Failed to award badge:", error);
        }
    };

    const toggleTopic = async (roadmapId, topicTitle) => {
        if (!user) return;
        const isDone = user.completedSkills.includes(topicTitle);
        const newCompletedSkills = isDone
            ? user.completedSkills.filter(s => s !== topicTitle)
            : [...user.completedSkills, topicTitle];

        // 1. Optimistic UI Update
        const previousUser = { ...user };
        setUser(prev => ({
            ...prev,
            completedSkills: newCompletedSkills,
            // Simple approximation of progress for instant feedback
            totalProgress: prev.personalRoadmap ? Math.round((newCompletedSkills.length / prev.personalRoadmap.reduce((acc, w) => acc + (w.topics?.length || 0), 0)) * 100) : prev.totalProgress
        }));

        try {
            await api.request('/progress/update', {
                method: 'PATCH',
                body: JSON.stringify({ completed_skills: newCompletedSkills })
            });
            // 2. Background Refresh (don't await this if we want it to feel instant)
            verifySession();
        } catch (error) {
            console.error("Failed to update progress:", error);
            setUser(previousUser); // Rollback on error
        }
    };

    const toggleProjectStep = async (projectId, stepIndex) => {
        if (!user) return;

        const projIdStr = String(projectId);
        const project = user.projectProgress?.find(p => String(p.project_id) === projIdStr);
        const currentSteps = project?.completed_steps || [];

        const newSteps = currentSteps.includes(stepIndex)
            ? currentSteps.filter(s => s !== stepIndex)
            : [...currentSteps, stepIndex];

        try {
            await api.post('/gamification/project/step', {
                project_id: projIdStr,
                completed_steps: newSteps
            });
            await verifySession();
        } catch (error) {
            console.error("Failed to update project progress:", error);
        }
    };

    const addXp = async (amount) => {
        try {
            await aiService.awardXp(amount);
            await verifySession();
            return { success: true };
        } catch (error) {
            console.error("Add XP failed:", error);
            return { success: false };
        }
    };

    const setPersonalData = (roadmap, skillGaps, videos, projects) => {
        setUser(prev => {
            const updated = {
                ...prev,
                personalRoadmap: roadmap,
                personalSkillGaps: skillGaps,
                personalProjects: projects,
                hasAnalyzed: true
            };
            localStorage.setItem('prepnova_current_user', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            signup,
            logout,
            refreshUser,
            giveBadge,
            toggleProjectStep,
            addXp,
            setPersonalData,
            toggleTopic
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
