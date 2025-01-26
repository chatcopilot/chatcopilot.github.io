// 文章数据管理
const articlesData = {
    // 所有文章的集合
    allArticles: [
        {
            id: 'rec4',
            title: '虚拟电厂在中国的发展',
            excerpt: '这份白皮书详细介绍了虚拟电厂在中国的发展情况，包括虚拟电厂的定义、应用场景、技术特点以及在中国的发展现状...',
            date: '2024-11-12',
            category: '研究报告',
            url: 'pdfs/VPP\'s developments in China.pdf',
            fileInfo: '艾瑞咨询',
            type: 'pdf',
            featured: true  // 添加featured标记表示是否在首页显示
        },
        {
            id: 'rec1',
            title: '储能六大核心环节',
            excerpt: '国内电化学储能产业链上游为原材料，中游为核心部件制造及系统集成商，下游是系统运营与应用...',
            date: '2024-10-24',
            category: '新能源',
            url: 'https://ner.jgvogel.cn/c/1454/1454020.shtml',
            type: 'link',
            featured: true
        },
        {
            id: 'rec2',
            title: '固态电池技术全方位解读',
            excerpt: '预期未来电动汽车续航里程有望突破1000公里门槛，这一目标仰赖于提升能量密度...',
            date: '2024-04-04',
            category: '研究报告',
            url: 'https://ner.jgvogel.cn/c/1387/1387655.shtml',
            type: 'link',
            featured: true
        },
        {
            id: 'rec3',
            title: '固态锂电池技术发展白皮书',
            excerpt: '这份白皮书详细介绍了半固态电池、全固态电池技术，以及国内外固态电池技术发展路线图...',
            date: '2025-01-26',
            category: '技术文档',
            url: 'pdfs/White Paper on Solid State Lithium Battery Technology Development 2024.pdf',
            fileInfo: '10.1 MB',
            type: 'pdf',
            featured: false
        }
    ],

    // 获取最新的n篇文章（优先显示featured文章）
    getLatestArticles(n = 3) {
        return this.allArticles
            .sort((a, b) => {
                // 首先按照featured排序
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                // 然后按照日期排序
                return new Date(b.date) - new Date(a.date);
            })
            .slice(0, n);
    },

    // 搜索文章
    searchArticles(searchTerm) {
        if (!searchTerm.trim()) {
            return this.allArticles;
        }
        
        searchTerm = searchTerm.toLowerCase().trim();
        return this.allArticles.filter(article => 
            article.title.toLowerCase().includes(searchTerm) ||
            article.excerpt.toLowerCase().includes(searchTerm) ||
            article.category.toLowerCase().includes(searchTerm)
        );
    },

    // 生成文章卡片HTML（推荐页面使用）
    generateRecommendationCard(article) {
        return `
            <article class="article-card">
                <div class="article-meta">
                    <span class="article-tag">${article.category}</span>
                    <span class="article-date">
                        <i class="far fa-calendar"></i>
                        ${article.date}
                    </span>
                </div>
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="article-footer">
                    ${article.type === 'pdf' ? 
                        `<a href="${article.url}" class="download-pdf" download>
                            <i class="fas fa-file-pdf"></i> 下载PDF
                            ${article.fileInfo ? `<span class="file-info">(${article.fileInfo})</span>` : ''}
                        </a>` :
                        `<a href="${article.url}" class="read-more" target="_blank">
                            阅读全文 <i class="fas fa-arrow-right"></i>
                        </a>`
                    }
                </div>
            </article>
        `;
    },

    // 生成文章卡片HTML（首页使用）
    generateArticleCard(article) {
        const isDownloadable = article.type === 'pdf';
        return `
            <article class="post-card">
                <div class="post-content">
                    <div class="article-meta">
                        <span class="article-date">${article.date}</span>
                        <span class="article-category">${article.category}</span>
                        ${isDownloadable ? '<span class="file-type"><i class="far fa-file-pdf"></i> PDF</span>' : ''}
                    </div>
                    <h3>${article.title}</h3>
                    <p class="post-excerpt">${article.excerpt}</p>
                    <div class="post-meta">
                        ${isDownloadable ? 
                            `<span class="file-info"><i class="far fa-file"></i> ${article.fileInfo}</span>
                             <a href="${article.url}" class="download-link" download>
                                <i class="fas fa-download"></i> 下载PDF
                             </a>` : 
                            `<a href="${article.url}" class="read-more" target="_blank">
                                阅读全文 <i class="fas fa-arrow-right"></i>
                             </a>`
                        }
                    </div>
                </div>
            </article>
        `;
    }
};

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 更新首页最新文章
    const featuredContent = document.querySelector('.content-grid');
    if (featuredContent) {
        const latestArticles = articlesData.getLatestArticles(3);
        // 主要文章（第一篇）
        const primaryArticle = latestArticles[0];
        // 次要文章（第二、三篇）
        const secondaryArticles = latestArticles.slice(1);

        let html = `
            <article class="feature-card primary">
                <div class="card-image">
                    <img src="images/${primaryArticle.id}.jpg" alt="${primaryArticle.title}" 
                         onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
                </div>
                <div class="card-content">
                    <span class="card-tag">${primaryArticle.category}</span>
                    <h3>${primaryArticle.title}</h3>
                    <p>${primaryArticle.excerpt}</p>
                    <div class="card-footer">
                        ${primaryArticle.type === 'pdf' ? 
                            `<a href="${primaryArticle.url}" class="download-link" download>
                                <i class="fas fa-download"></i> 下载PDF
                            </a>` : 
                            `<a href="${primaryArticle.url}" class="read-more" target="_blank">
                                阅读全文 <i class="fas fa-arrow-right"></i>
                            </a>`
                        }
                    </div>
                </div>
            </article>
            <div class="secondary-features">
                ${secondaryArticles.map(article => `
                    <article class="feature-card secondary">
                        <div class="card-content">
                            <span class="card-tag">${article.category}</span>
                            <h3>${article.title}</h3>
                            <p>${article.excerpt}</p>
                            <div class="card-footer">
                                ${article.type === 'pdf' ? 
                                    `<a href="${article.url}" class="download-link" download>
                                        <i class="fas fa-download"></i> 下载PDF
                                    </a>` : 
                                    `<a href="${article.url}" class="read-more" target="_blank">
                                        阅读全文 <i class="fas fa-arrow-right"></i>
                                    </a>`
                                }
                            </div>
                        </div>
                    </article>
                `).join('')}
            </div>
        `;
        
        featuredContent.innerHTML = html;
    }

    // 初始化推荐页面
    const articleList = document.querySelector('.article-list');
    if (articleList && window.location.pathname.includes('recommendations.html')) {
        // 显示所有文章
        displayArticles(articlesData.allArticles);
        
        // 添加搜索功
        const searchInput = document.getElementById('articleSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const searchResults = articlesData.searchArticles(searchInput.value);
                displayArticles(searchResults);
            });
        }
    }
});

// 显示文章列表
function displayArticles(articles) {
    const articleList = document.querySelector('.article-list');
    if (!articleList) return;

    if (articles.length === 0) {
        articleList.innerHTML = '<p class="no-results">未找到相关文章</p>';
        return;
    }

    articleList.innerHTML = articles
        .map(article => articlesData.generateRecommendationCard(article))
        .join('');
} 