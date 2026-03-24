const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const systemPrompt = `You are PortfolioBot for Ashutosh Yadav. Answer concisely about experience, projects, technologies. Always mention the relevant part in portfolio.`;

        const KNOWLEDGE_BASE = `
About Ashutosh: Full Stack Developer with MERN focus, strong in backend and frontend, experienced in secure web systems.
Project 1: Exam Anti-Impersonation System - real-time identity validation, analytics, security.
Project 2: Chalo Seekhein - e-learning platform with role-based access, content management, analytics.
Other: BikeNest, College Confessions, etc.
Skills: JavaScript, React, Node, Express, MongoDB, PostgreSQL, Git, Docker, AWS, C/C++, Kotlin, PHP, Laravel, Next.js.
Soft: Problem Solving, Communication, Teamwork, Leadership.
`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `${KNOWLEDGE_BASE}\nUser: ${message}` }
                ],
                temperature: 0.55,
                max_tokens: 200
            })
        });

        if (!response.ok) {
            throw new Error('OpenAI API error');
        }

        const data = await response.json();
        const aiReply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

        res.json({ reply: aiReply.trim() });
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ error: 'Sorry, I could not get a response right now. Please try again shortly.' });
    }
});

app.listen(PORT, () => {
    console.log(`Chatbot proxy server running on port ${PORT}`);
});