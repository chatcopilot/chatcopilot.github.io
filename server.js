require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const connectDB = require('./config/db');

// 连接数据库
connectDB();

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());

// 设置静态文件目录
app.use(express.static(__dirname));

// 路由处理
app.get('/', (req, res) => {
    console.log('Accessing root path');
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/insights.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'insights.html'));
});

app.get('/recommendations.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'recommendations.html'));
});

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// 处理聊天请求
app.post('/api/chat', async (req, res) => {
    try {
        const { message, chatHistory } = req.body;
        
        console.log('Received message:', message);

        // 构建发送给DeepSeek的消息历史
        const messages = [
            {
                role: "system",
                content: "你是一个专注于能源科技领域的AI助手，擅长回答关于电力、新能源、储能、碳电交易等方面的问题。请用简洁专业的语言回答用户的问题。"
            },
            ...chatHistory,
            {
                role: "user",
                content: message
            }
        ];

        console.log('Sending request to DeepSeek...');

        // 调用DeepSeek API
        const response = await axios({
            method: 'post',
            url: DEEPSEEK_API_URL,
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                model: "deepseek-chat",
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000,
                stream: false
            }
        });

        console.log('DeepSeek API response received');

        res.json({
            reply: response.data.choices[0].message.content,
            success: true
        });

    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        res.status(500).json({
            error: '抱歉，服务器出现错误',
            success: false,
            details: error.response?.data || error.message
        });
    }
});

// 路由
app.use('/api/log', require('./routes/logs'));

// 简单的前端页面用于查看日志
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>聊天日志</title>
            <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>聊天日志</h1>
            <table id="logTable">
                <thead>
                    <tr>
                        <th>时间</th>
                        <th>IP地址</th>
                        <th>页面</th>
                        <th>问题</th>
                        <th>回答</th>
                    </tr>
                </thead>
                <tbody id="logBody"></tbody>
            </table>
            <script>
                fetch('/api/log')
                    .then(res => res.json())
                    .then(data => {
                        const tbody = document.getElementById('logBody');
                        data.data.forEach(log => {
                            tbody.innerHTML += \`
                                <tr>
                                    <td>\${new Date(log.timestamp).toLocaleString()}</td>
                                    <td>\${log.ipAddress}</td>
                                    <td>\${log.page}</td>
                                    <td>\${log.question}</td>
                                    <td>\${log.answer}</td>
                                </tr>
                            \`;
                        });
                    });
            </script>
        </body>
        </html>
    `);
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Server Error');
});

// 处理 404
app.use((req, res) => {
    console.log('404 - Not Found:', req.url);
    res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 