// 存储所有文章的数组
let allArticles = [];

// 初始化函数
async function initRecommendations() {
    try {
        // 这里假设你的文章数据是从某个API或静态文件加载的
        // 实际使用时需要替换为真实的数据源
        allArticles = [
            {
                title: "虚拟电厂技术解析",
                content: "深入探讨虚拟电厂的核心技术和应用场景...",
                tags: ["技术", "虚拟电厂", "能源互联网"],
                date: "2024-03-15"
            },
            // 添加更多文章...
        ];
        
        // 初始显示所有文章
        displayArticles(allArticles);
    } catch (error) {
        console.error('Failed to load articles:', error);
    }
}

// 搜索文章函数
function searchArticles() {
    const searchInput = document.getElementById('articleSearch');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayArticles(allArticles);
        return;
    }
    
    const filteredArticles = allArticles.filter(article => {
        return article.title.toLowerCase().includes(searchTerm) ||
               article.content.toLowerCase().includes(searchTerm) ||
               article.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    });
    
    displayArticles(filteredArticles);
}

// 显示文章列表
function displayArticles(articles) {
    const articleList = document.querySelector('.article-list');
    
    if (articles.length === 0) {
        articleList.innerHTML = '<p class="no-results">未找到相关文章</p>';
        return;
    }
    
    const articlesHTML = articles.map(article => `
        <article class="article-card">
            <div class="article-meta">
                <span class="article-tag">${article.tags[0]}</span>
                <span class="article-date">
                    <i class="far fa-calendar"></i>
                    ${article.date}
                </span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.content}</p>
            <div class="article-footer">
                <a href="#" class="read-more">阅读更多 →</a>
                <div class="article-tags">
                    ${article.tags.slice(1).map(tag => `
                        <span class="tag">${tag}</span>
                    `).join('')}
                </div>
            </div>
        </article>
    `).join('');
    
    articleList.innerHTML = articlesHTML;
}

// 添加搜索框的键盘事件监听
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('articleSearch');
    if (searchInput) {
        searchInput.addEventListener('input', searchArticles);
        
        // 初始化文章列表
        initRecommendations();
    }
}); 