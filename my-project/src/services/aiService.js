import api from './api';

export const aiService = {
    /**
     * Analyzes resume against a JD
     */
    analyzeResume: async (resumeFile, jdText) => {
        console.log("AI Analyzing Resume...");

        try {
            // 1. Upload Resume (Optional)
            if (resumeFile) {
                const resumeFormData = new FormData();
                resumeFormData.append('file', resumeFile);
                console.log("Step 1: Uploading Resume...");
                await api.post('/resume/upload', resumeFormData).catch(err => {
                    const detail = err.response?.data?.detail;
                    const msg = typeof detail === 'object' ? JSON.stringify(detail) : (detail || err.response?.statusText || 'Unknown error');
                    throw new Error(`Resume upload failed: ${msg}`);
                });
            } else {
                console.log("Step 1: (Skipped) No new resume provided, using existing one on server.");
            }

            // 2. Save JD — this triggers the backend AI analysis
            console.log("Step 2: Saving Job Description...");
            await api.post('/analysis/jd', {
                company_name: "Target Company",
                jd_text: jdText
            }).catch(err => {
                const detail = err.response?.data?.detail;
                const msg = typeof detail === 'object' ? JSON.stringify(detail) : (detail || err.response?.statusText || 'Unknown error');
                throw new Error(`JD upload failed: ${msg}`);
            });

            // 3. Poll for Analysis Results — backend may process asynchronously
            console.log("Step 3: Waiting for AI analysis to complete...");

            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            const MAX_RETRIES = 15;       // 15 attempts
            const RETRY_DELAY_MS = 3000;  // 3 seconds between attempts
            const INITIAL_DELAY_MS = 4000; // 4 second initial wait

            // Give the backend time to start processing
            await delay(INITIAL_DELAY_MS);

            let data = null;
            let lastError = null;

            for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                try {
                    console.log(`📊 Polling attempt ${attempt}/${MAX_RETRIES}...`);
                    const response = await api.get('/analysis/skill-gap');
                    data = response.data;
                    console.log(`📊 Attempt ${attempt} Response:`, JSON.stringify(data, null, 2));

                    // Check if the backend has finished processing
                    const hasResults = (data.matched_skills?.length > 0 || data.missing_skills?.length > 0 || data.match_percentage > 0);
                    if (hasResults) {
                        console.log(`✅ Analysis complete on attempt ${attempt}!`);
                        break;
                    }

                    // If no results yet and we have more retries, wait and try again
                    if (attempt < MAX_RETRIES) {
                        console.log(`⏳ No results yet, retrying in ${RETRY_DELAY_MS / 1000}s...`);
                        await delay(RETRY_DELAY_MS);
                    }
                } catch (err) {
                    lastError = err;
                    console.warn(`📊 Attempt ${attempt} failed:`, err.message || err);
                    if (attempt < MAX_RETRIES) {
                        await delay(RETRY_DELAY_MS);
                    }
                }
            }

            // If all retries failed with errors, throw
            if (!data && lastError) {
                const detail = lastError.response?.data?.detail;
                const msg = typeof detail === 'object' ? JSON.stringify(detail) : (detail || 'Analysis timed out');
                throw new Error(`Skill gap analysis failed: ${msg}`);
            }

            // Use whatever data we have (even if still empty after all retries)
            data = data || {};

            // Map backend response to frontend format
            const matched = data.matched_skills || [];
            const missing = data.missing_skills || [];
            const score = data.match_percentage || 0;
            console.log(`📊 FINAL: score=${score}, matched=${matched.length} skills, missing=${missing.length} skills`);

            if (matched.length === 0 && missing.length === 0 && score === 0) {
                console.warn("⚠️ Backend returned empty analysis after all retries. The AI may not have processed the resume+JD correctly.");
            }

            return {
                score: score,
                matched: matched,
                missing: missing,
                moderate: [],
                priority: missing.slice(0, 3),
                radarData: aiService.calculateRadarData(score)
            };
        } catch (error) {
            console.error("AI Service Error:", error);
            throw error;
        }
    },

    /**
     * Consistently calculates radar data from a score
     */
    calculateRadarData: (score) => {
        return [
            { skill: 'Matched', level: score },
            { skill: 'Gap', level: 100 - score },
            { skill: 'Overall', level: score },
        ];
    },

    /**
     * Data Transformation Utilities
     */
    transformRoadmap: (roadmapArr) => {
        return (roadmapArr || []).map((week) => ({
            id: `week-${week.week}`,
            title: week.title,
            progress: 0,
            topics: week.skills || [], // Map backend 'skills' to frontend 'topics'
            notes: week.notes,
            resources: week.resources, // contains {skill, url}
            flashcards: week.flashcards || [] // Include AI-generated flashcards
        }));
    },

    /**
     * Extracts YouTube videos from roadmap resources
     */
    extractVideos: (roadmapArr) => {
        const videos = [];
        (roadmapArr || []).forEach(week => {
            (week.resources || []).forEach(res => {
                const url = res.url;
                if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
                    let videoId = '';
                    if (url.includes('v=')) {
                        videoId = url.split('v=')[1]?.split('&')[0];
                    } else if (url.includes('youtu.be/')) {
                        videoId = url.split('youtu.be/')[1]?.split('?')[0];
                    }

                    if (videoId) {
                        videos.push({
                            id: videoId,
                            url: url,
                            title: res.skill || "Skill Tutorial",
                            thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                            channel: "AI Recommendation"
                        });
                    }
                }
            });
        });
        // Remove duplicates and limit
        const unique = Array.from(new Map(videos.map(v => [v.id, v])).values());
        return unique.slice(0, 4);
    },

    /**
     * Extracts YouTube videos from already-transformed roadmap data
     * (which still retains 'resources' from the transform step)
     */
    extractVideosFromTransformed: (transformedRoadmap) => {
        const videos = [];
        (transformedRoadmap || []).forEach(week => {
            (week.resources || []).forEach(res => {
                const url = res.url;
                if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
                    let videoId = '';
                    if (url.includes('v=')) {
                        videoId = url.split('v=')[1]?.split('&')[0];
                    } else if (url.includes('youtu.be/')) {
                        videoId = url.split('youtu.be/')[1]?.split('?')[0];
                    }
                    if (videoId) {
                        videos.push({
                            id: videoId,
                            url: url,
                            title: res.skill || "Skill Tutorial",
                            thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                            channel: "AI Recommendation"
                        });
                    }
                }
            });
        });
        const unique = Array.from(new Map(videos.map(v => [v.id, v])).values());
        return unique.slice(0, 4);
    },

    transformProjects: (projectsArr, progressArr = []) => {
        return (projectsArr || []).map(p => {
            const prog = (progressArr || []).find(pr => String(pr.project_id) === String(p.id));
            const completed = prog?.completed_steps || [];

            return {
                id: p.id,
                title: p.title,
                difficulty: p.difficulty,
                description: p.description,
                steps: (p.features || []).map((f, i) => ({
                    title: f,
                    done: completed.includes(i),
                    guide: "Follow the project objectives to complete this step."
                })) // Map 'features' to 'steps' objects for UI
            };
        });
    },

    /**
     * Generates a personalized roadmap
     */
    generateRoadmap: async () => {
        console.log("AI Generating Roadmap...");
        const response = await api.get('/roadmap/');
        const data = response.data;

        return {
            roadmap: aiService.transformRoadmap(data.roadmap),
            projects: aiService.transformProjects(data.mini_projects)
        };
    },

    /**
     * Gets recommended YouTube videos based on skill gaps
     */
    getRecommendedVideos: async (missingSkills) => {
        // Backend roadmap already includes resources (URLs)
        // This can be used to extract YouTube links
        return [];
    },

    /**
     * Generates step-by-step mini projects
     */
    generateMiniProjects: async (missingSkills) => {
        // AI Roadmap notes often contain projects
        return [];
    },


    /**
     * AI-Driven Mock Tests
     */
    async generateTest(skillName, testType = 'mcq') {
        const res = await api.request('/test/generate', {
            method: 'POST',
            body: { skill_name: skillName, test_type: testType, num_questions: 5 }
        });
        return res.data;
    },

    async submitTest(testId, skillName, answers) {
        const res = await api.request('/test/check', {
            method: 'POST',
            body: { test_id: testId, skill_name: skillName, answers }
        });
        return res.data;
    },

    async gradeTest(testId, skillName, testType, answers) {
        const res = await api.request('/test/grade', {
            method: 'POST',
            body: { test_id: testId, skill_name: skillName, test_type: testType, answers }
        });
        return res.data;
    },

    /**
     * Chatbot logic — Connected to AI Interview Coach
     */
    getChatbotResponse: async (history, userInput, userEmail) => {
        try {
            const response = await api.post('/voice/chat-text', {
                message: userInput,
                user_email: userEmail || "user@example.com"
            });

            // Backend returns AI text in X-AI-Response header
            const aiText = response.headers.get('X-AI-Response');
            if (aiText) {
                return decodeURIComponent(aiText);
            }

            return "I'm processing your request. Please check the dashboard for updates!";
        } catch (error) {
            console.error("Chat error:", error);
            return "I'm having trouble connecting to my central brain. Please check your connection.";
        }
    },

    /**
     * Award XP for general activities
     */
    awardXp: async (amount) => {
        const response = await api.post('/gamification/add-xp', { amount });
        return response.data;
    }
};
