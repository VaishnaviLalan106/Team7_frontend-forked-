import { create } from 'zustand';

const useStore = create((set, get) => ({
    // User data
    user: {
        name: 'Alex Rivera',
        title: 'Full Stack Developer',
        avatar: null,
        level: 12,
        rank: 'Rising Star',
    },

    // XP
    xp: 2450,
    xpToNext: 3000,
    addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

    // Streak
    streak: 5,
    incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),

    // Career Map Progress
    zones: [
        { id: 'resume', name: 'Resume City', progress: 85, unlocked: true, icon: 'FileText', color: '#FF6B6B' },
        { id: 'concept', name: 'Concept Valley', progress: 60, unlocked: true, icon: 'Brain', color: '#8B5CF6' },
        { id: 'interview', name: 'Interview Arena', progress: 35, unlocked: true, icon: 'Mic', color: '#10B981' },
        { id: 'skill', name: 'Skill Tree', progress: 20, unlocked: true, icon: 'GitBranch', color: '#F59E0B' },
        { id: 'offer', name: 'Final Offer Gate', progress: 0, unlocked: false, icon: 'Trophy', color: '#EC4899' },
    ],

    // Skills
    skills: [
        {
            id: 'frontend',
            name: 'Frontend',
            mastery: 72,
            children: [
                {
                    id: 'react', name: 'React', mastery: 80, unlocked: true,
                    children: [
                        { id: 'hooks', name: 'Hooks', mastery: 90, unlocked: true, children: [] },
                        { id: 'perf', name: 'Performance', mastery: 60, unlocked: true, children: [] },
                        { id: 'patterns', name: 'Advanced Patterns', mastery: 30, unlocked: false, children: [] },
                    ]
                },
                {
                    id: 'css', name: 'CSS', mastery: 65, unlocked: true,
                    children: [
                        { id: 'flexbox', name: 'Flexbox/Grid', mastery: 85, unlocked: true, children: [] },
                        { id: 'animations', name: 'Animations', mastery: 45, unlocked: true, children: [] },
                    ]
                },
            ]
        },
        {
            id: 'backend',
            name: 'Backend',
            mastery: 55,
            children: [
                {
                    id: 'nodejs', name: 'Node.js', mastery: 60, unlocked: true,
                    children: [
                        { id: 'express', name: 'Express', mastery: 70, unlocked: true, children: [] },
                        { id: 'auth', name: 'Authentication', mastery: 40, unlocked: true, children: [] },
                    ]
                },
                {
                    id: 'databases', name: 'Databases', mastery: 50, unlocked: true,
                    children: [
                        { id: 'sql', name: 'SQL', mastery: 65, unlocked: true, children: [] },
                        { id: 'nosql', name: 'NoSQL', mastery: 35, unlocked: false, children: [] },
                    ]
                },
            ]
        },
        {
            id: 'dsa',
            name: 'DSA',
            mastery: 40,
            children: [
                {
                    id: 'arrays', name: 'Arrays & Strings', mastery: 75, unlocked: true,
                    children: [
                        { id: 'sorting', name: 'Sorting', mastery: 80, unlocked: true, children: [] },
                        { id: 'searching', name: 'Searching', mastery: 70, unlocked: true, children: [] },
                    ]
                },
                {
                    id: 'trees', name: 'Trees & Graphs', mastery: 25, unlocked: true,
                    children: [
                        { id: 'bst', name: 'BST', mastery: 40, unlocked: true, children: [] },
                        { id: 'graph-algo', name: 'Graph Algorithms', mastery: 10, unlocked: false, children: [] },
                    ]
                },
            ]
        },
    ],

    // Achievements
    achievements: [
        { id: 1, name: 'First Steps', desc: 'Complete your first challenge', earned: true, icon: '🏅' },
        { id: 2, name: 'Streak Master', desc: '7-day streak', earned: true, icon: '🔥' },
        { id: 3, name: 'Bug Squasher', desc: 'Fix 10 bugs', earned: true, icon: '🐛' },
        { id: 4, name: 'Speed Demon', desc: 'Complete Rapid Fire in <30s', earned: false, icon: '⚡' },
        { id: 5, name: 'Interview Ready', desc: 'Score 90% on mock', earned: false, icon: '🎯' },
        { id: 6, name: 'Full Stack Hero', desc: 'Master all skill trees', earned: false, icon: '🦸' },
        { id: 7, name: 'Concept King', desc: 'Win 50 concept combats', earned: true, icon: '👑' },
        { id: 8, name: 'Unstoppable', desc: '30-day streak', earned: false, icon: '💎' },
    ],

    // XP popup
    showXpPopup: false,
    xpPopupAmount: 0,
    triggerXpPopup: (amount) => {
        set({ showXpPopup: true, xpPopupAmount: amount });
        get().addXp(amount);
        setTimeout(() => set({ showXpPopup: false }), 1200);
    },

    // Navigation
    currentPage: 'home',
    setCurrentPage: (page) => set({ currentPage: page }),
}));

export default useStore;
