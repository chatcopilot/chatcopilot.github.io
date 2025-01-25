document.addEventListener('componentLoaded', function(e) {
    if (e.detail === 'chat-widget') {
        initChatWidget();
    }
});

function initChatWidget() {
    const chatToggle = document.getElementById('chatToggle');
    const chatContainer = document.getElementById('chatContainer');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    const expandChat = document.getElementById('expandChat');

    // 存储聊天历史
    let chatHistory = [];

    // 添加欢迎消息
    addMessage('bot', '你好！我是AI助手，专注于能源科技领域。有什么可以帮你的吗？');

    // 切换聊天窗口显示/隐藏
    chatToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('hidden');
        chatContainer.classList.toggle('show');
    });

    // 关闭聊天窗口
    closeChat.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        chatContainer.classList.remove('show');
    });

    // 添加放大缩小功能
    expandChat.addEventListener('click', () => {
        chatContainer.classList.toggle('expanded');
        const icon = expandChat.querySelector('i');
        if (chatContainer.classList.contains('expanded')) {
            icon.classList.remove('fa-expand');
            icon.classList.add('fa-compress');
        } else {
            icon.classList.remove('fa-compress');
            icon.classList.add('fa-expand');
        }
    });

    // 发送消息
    async function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // 添加用户消息
        addMessage('user', message);
        chatInput.value = '';

        // 显示加载状态
        const loadingMessage = addMessage('bot', '<i class="fas fa-spinner fa-spin"></i> AI正在思考...');

        const url = process.env.NODE_ENV !== 'production'  ?     'http://localhost:3000/api/chat' : 'https://www.chatsmart.fun/api/chat'

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    chatHistory: chatHistory
                })
            });

            const data = await response.json();

            if (data.success) {
                // 更新聊天历史
                chatHistory.push(
                    { role: "user", content: message },
                    { role: "assistant", content: data.reply }
                );

                // 移除加载消息
                loadingMessage.remove();
                // 添加AI回复
                addMessage('bot', data.reply);
            } else {
                throw new Error(data.error);
            }

        } catch (error) {
            console.error('Error details:', error);
            loadingMessage.remove();
            addMessage('bot', `抱歉，我遇到了一些问题：${error.message || '请稍后再试'}`);
        }
    }

    // 发送按钮点击事件
    sendMessage.addEventListener('click', sendChatMessage);

    // 输入框回车事件
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });

    // 添加消息到聊天窗口
    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    }

    // 移除自动调整高度的事件监听器
    chatInput.removeEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });
} 