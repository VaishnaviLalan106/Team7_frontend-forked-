// Weekly progress data
export const weeklyProgress = [
    { day: 'Mon', progress: 45 },
    { day: 'Tue', progress: 62 },
    { day: 'Wed', progress: 58 },
    { day: 'Thu', progress: 75 },
    { day: 'Fri', progress: 70 },
    { day: 'Sat', progress: 85 },
    { day: 'Sun', progress: 80 },
];

// Skill radar data
export const skillRadarData = [
    { skill: 'DSA', current: 72 },
    { skill: 'System Design', current: 55 },
    { skill: 'React', current: 80 },
    { skill: 'Node.js', current: 60 },
    { skill: 'SQL', current: 65 },
    { skill: 'Behavioral', current: 78 },
];

// Test score trends
export const testScores = [
    { test: 'T1', score: 52 },
    { test: 'T2', score: 61 },
    { test: 'T3', score: 58 },
    { test: 'T4', score: 72 },
    { test: 'T5', score: 68 },
    { test: 'T6', score: 78 },
    { test: 'T7', score: 82 },
];

// Focus areas for dashboard
export const focusAreas = [
    { topic: 'Docker Containers', tag: 'DevOps', color: 'cyan' },
    { topic: 'System Design Patterns', tag: 'Architecture', color: 'indigo' },
    { topic: 'Dynamic Programming', tag: 'DSA', color: 'amber' },
    { topic: 'AWS Lambda', tag: 'Cloud', color: 'rose' },
];

// Resume skill analysis
export const skillAnalysis = {
    matched: ['React', 'JavaScript', 'Git', 'REST APIs', 'Node.js', 'TypeScript'],
    missing: ['Docker', 'Kubernetes', 'AWS', 'GraphQL'],
    priority: ['Docker', 'AWS'],
    radarData: [
        { skill: 'Frontend', level: 85 },
        { skill: 'Backend', level: 60 },
        { skill: 'DevOps', level: 30 },
        { skill: 'Database', level: 65 },
        { skill: 'Testing', level: 50 },
        { skill: 'Communication', level: 78 },
    ],
};

// Skill gaps
export const skillGaps = {
    strong: [
        { name: 'React', level: 85 },
        { name: 'JavaScript', level: 90 },
        { name: 'CSS/Tailwind', level: 80 },
        { name: 'Git', level: 78 },
        { name: 'REST APIs', level: 75 },
    ],
    moderate: [
        { name: 'Node.js', level: 60 },
        { name: 'TypeScript', level: 55 },
        { name: 'SQL', level: 58 },
        { name: 'System Design', level: 50 },
        { name: 'Testing', level: 52 },
    ],
    missing: [
        { name: 'Docker', level: 15 },
        { name: 'Kubernetes', level: 5 },
        { name: 'AWS/Cloud', level: 20 },
        { name: 'GraphQL', level: 10 },
        { name: 'CI/CD', level: 12 },
    ],
};

// Roadmaps
export const roadmaps = [
    {
        id: 'docker', title: 'Docker Fundamentals', progress: 35, xp: 200, weeks: 4,
        topics: [
            { title: 'Docker basics & installation', done: true },
            { title: 'Dockerfile creation', done: true },
            { title: 'Docker compose', done: false },
            { title: 'Networking & volumes', done: false },
        ],
    },
    {
        id: 'system-design', title: 'System Design', progress: 50, xp: 300, weeks: 6,
        topics: [
            { title: 'Scalability fundamentals', done: true },
            { title: 'Load balancing', done: true },
            { title: 'Caching strategies', done: true },
            { title: 'Database sharding', done: false },
            { title: 'Message queues', done: false },
            { title: 'Microservices patterns', done: false },
        ],
    },
    {
        id: 'aws', title: 'AWS Cloud Essentials', progress: 20, xp: 250, weeks: 4,
        topics: [
            { title: 'EC2 & S3 basics', done: true },
            { title: 'IAM & Security', done: false },
            { title: 'Lambda functions', done: false },
            { title: 'DynamoDB & API Gateway', done: false },
        ],
    },
    {
        id: 'dsa', title: 'DSA for Interviews', progress: 65, xp: 350, weeks: 6,
        topics: [
            { title: 'Arrays & Strings', done: true },
            { title: 'Linked Lists', done: true },
            { title: 'Stacks & Queues', done: true },
            { title: 'Trees & Graphs', done: true },
            { title: 'Dynamic Programming', done: false },
            { title: 'Greedy Algorithms', done: false },
        ],
    },
];

// Mock test questions
export const mockQuestions = [
    { id: 1, type: 'mcq', question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 1 },
    { id: 2, type: 'mcq', question: 'Which React hook is used for side effects?', options: ['useState', 'useEffect', 'useRef', 'useMemo'], answer: 1 },
    { id: 3, type: 'mcq', question: 'What does REST stand for?', options: ['Remote Execution Standard Transfer', 'Representational State Transfer', 'Resource Endpoint Service Technology', 'Rapid Execution System Transfer'], answer: 1 },
    { id: 4, type: 'mcq', question: 'Which data structure uses FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 1 },
    { id: 5, type: 'mcq', question: 'What is the purpose of a virtual DOM?', options: ['Direct DOM manipulation', 'Minimize costly DOM operations', 'Server-side rendering', 'Database caching'], answer: 1 },
    { id: 9, type: 'mcq', question: 'What is the primary difference between let and var?', options: ['Scope', 'Hoisting', 'Re-assignment', 'Both Scope and Hoisting'], answer: 3 },
    { id: 10, type: 'mcq', question: 'How do you center a div in Flexbox?', options: ['align-items: center', 'justify-content: center', 'display: flex', 'Both justify-content and align-items center'], answer: 3 },

    // AI Driven HR Questions
    { id: 6, type: 'hr', question: 'Tell me about a time you handled a difficult conflict with a coworker.', options: ['I ignored it', 'I reported it immediately', 'I discussed it privately and found common ground', 'I asked to change teams'], answer: 2 },
    { id: 7, type: 'hr', question: 'What is your greatest weakness and how are you improving it?', options: ['I have no weaknesses', 'I work too hard', 'Public speaking, so I joined a local group', 'I am often late'], answer: 2 },
    { id: 11, type: 'hr', question: 'How do you handle working on multiple projects with tight deadlines?', options: ['I work faster', 'I prioritize tasks based on impact and urgency', 'I stay late every day', 'I ask for more time for everything'], answer: 1 },
    { id: 12, type: 'hr', question: 'Where do you see yourself in five years?', options: ['In your seat', 'Retired', 'Taking on more technical leadership and mastering cloud architecture', 'Still doing exactly this'], answer: 2 },

    // AI Driven Coding Questions
    { id: 8, type: 'coding', question: 'Write a function to find the maximum depth of a binary tree.', options: ['Recursive depth search', 'Breadth first search', 'Both', 'Neither'], answer: 2 },
    { id: 13, type: 'coding', question: 'What is the most efficient way to reverse a string in JavaScript?', options: ['For loop', 'split("").reverse().join("")', 'recursion', 'while loop'], answer: 1 },
    { id: 14, type: 'coding', question: 'Which algorithm is typically used for shortest path in a weighted graph?', options: ['BFS', 'DFS', 'Dijkstra', 'Merge Sort'], answer: 2 },

    // Expanded Pool MCQ
    { id: 15, type: 'mcq', question: 'What is the significance of "Keys" in React?', options: ['Styling', 'Performance/Identity in list reconciliation', 'Event handling', 'Data fetching'], answer: 1 },
    { id: 16, type: 'mcq', question: 'What does "useCallback" memoize?', options: ['A value', 'A function instance', 'A DOM node', 'State'], answer: 1 },
    { id: 17, type: 'mcq', question: 'What is a closure in JavaScript?', options: ['A way to close a bracket', 'A function with its lexical environment', 'An asynchronous callback', 'A private class member'], answer: 1 },
    { id: 22, type: 'mcq', question: 'What is the purpose of Redux in a React application?', options: ['To handle routing', 'To manage global state', 'To styling components', 'To handle API calls only'], answer: 1 },
    { id: 23, type: 'mcq', question: 'Which of the following is NOT a React Hook?', options: ['useEffect', 'useReducer', 'useClass', 'useContext'], answer: 2 },

    // Expanded Pool HR
    { id: 18, type: 'hr', question: 'How do you deal with ambiguity when requirements are not clear?', options: ['I wait for clarity', 'I make assumptions', 'I ask clarifying questions and propose a minimal viable solution', 'I work on other tasks'], answer: 2 },
    { id: 19, type: 'hr', question: 'Talk about a time you failed. What did you learn?', options: ['I never fail', 'I blamed my team', 'I analyzed the root cause and implemented a process to avoid it', 'I ignored it'], answer: 2 },
    { id: 24, type: 'hr', question: 'How do you handle a situation where a technical decision you made was wrong?', options: ['I hide it', 'I stick to it to save face', 'I admit the mistake early, communicate the impact, and work on a fix', 'I blame the requirements'], answer: 2 },
    { id: 25, type: 'hr', question: 'Why should we hire you over other candidates?', options: ['I am the best', 'I need a job', 'My unique blend of technical skills and passion for your company\'s mission', 'I have many certifications'], answer: 2 },

    // Expanded Pool Coding
    { id: 20, type: 'coding', question: 'How do you check if a linked list has a cycle?', options: ['Floyd\'s Cycle-Finding Algorithm (Two Pointers)', 'Hash Set tracking', 'Both', 'Neither'], answer: 2 },
    { id: 21, type: 'coding', question: 'What is the time complexity of QuickSort in the average case?', options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'], answer: 2 },
    { id: 26, type: 'coding', question: 'What is the space complexity of a recursive depth-first search on a tree?', options: ['O(1)', 'O(N) in worst case (height of tree)', 'O(N²)', 'O(log N) always'], answer: 1 },
    { id: 27, type: 'coding', question: 'How do you find the intersection of two sorted arrays efficiently?', options: ['Nested loops', 'Two pointers approach', 'Sorting them again', 'Binary search every element'], answer: 1 },
];

// Analytics data
export const analyticsData = {
    skillGrowth: [
        { month: 'Jan', skills: 35 }, { month: 'Feb', skills: 42 }, { month: 'Mar', skills: 50 },
        { month: 'Apr', skills: 58 }, { month: 'May', skills: 68 }, { month: 'Jun', skills: 75 },
    ],
    jdMatch: [
        { week: 'W1', match: 45 }, { week: 'W2', match: 52 }, { week: 'W3', match: 58 },
        { week: 'W4', match: 65 }, { week: 'W5', match: 70 }, { week: 'W6', match: 73 },
    ],
    consistency: [
        { day: 'Mon', hours: 2.0 }, { day: 'Tue', hours: 1.5 }, { day: 'Wed', hours: 2.5 },
        { day: 'Thu', hours: 1.0 }, { day: 'Fri', hours: 3.0 }, { day: 'Sat', hours: 2.0 }, { day: 'Sun', hours: 1.8 },
    ],
    performance: [
        { area: 'Frontend', score: 85 }, { area: 'Backend', score: 60 },
        { area: 'DevOps', score: 35 }, { area: 'DSA', score: 72 },
        { area: 'System Design', score: 55 }, { area: 'Behavioral', score: 78 },
    ],
};

// Achievements/badges
export const badges = [
    { id: 1, name: 'First Login', icon: '🎉', desc: 'Logged in for the first time' },
    { id: 2, name: '7-Day Streak', icon: '🔥', desc: 'Maintained a 7-day streak' },
    { id: 3, name: 'Quiz Master', icon: '🧠', desc: 'Scored 90%+ on a quiz' },
    { id: 4, name: 'Code Warrior', icon: '⚔️', desc: 'Completed 10 coding challenges' },
    { id: 5, name: 'Speed Demon', icon: '⚡', desc: 'Finished a test in under 5 min' },
    { id: 6, name: 'Perfect Score', icon: '💎', desc: 'Scored 100% on any test' },
    { id: 7, name: 'DSA King', icon: '👑', desc: 'Mastered all DSA topics' },
    { id: 8, name: 'Interview Ready', icon: '🏆', desc: 'Reached 90% overall readiness' },
    { id: 9, name: 'Triple Threat', icon: '🎯', desc: 'Scored 70%+ in MCQ, HR, and Coding' },
];
