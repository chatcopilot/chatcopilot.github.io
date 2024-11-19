import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// 中间件
app.use(cors({
    origin: '*',  // 在开发环境中允许所有来源
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// DeepSeek API 配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// 存储对话历史
const conversations = new Map();

// AI 对话路由
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        
        // 获取或创建会话历史
        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, [{
                role: 'system',
                content: `你是一个专注于新能源领域的AI助手，擅长解答关于新能源、储能、智能电网等方面的问题。
                         你应该：
                         1. 用简洁专业的语言回答用户的问题
                         2. 在适当的时候引用网站上的相关文章
                         3. 对于复杂的问题，可以分步骤解释
                         4. 在回答中提供可靠的数据来源
                         5. 如果不确定，要诚实地表示不确定`
            }]);
        }
        
        const conversation = conversations.get(sessionId);
        conversation.push({ role: 'user', content: message });

        // 调用 DeepSeek API
        const response = await axios.post(DEEPSEEK_API_URL, {
            model: 'deepseek-chat',
            messages: conversation,
            stream: false
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            }
        });

        const reply = response.data.choices[0].message.content;
        conversation.push({ role: 'assistant', content: reply });

        // 限制对话历史长度
        if (conversation.length > 10) {
            conversation.splice(1, 2); // 保留系统提示，删除最早的一组对话
        }

        res.json({ reply });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ 
            error: '服务器错误，请稍后再试',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 