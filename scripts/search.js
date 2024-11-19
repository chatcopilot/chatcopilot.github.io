// 搜索功能实现
class SearchHandler {
    constructor() {
        this.searchToggle = document.querySelector('.search-toggle');
        this.searchBox = document.querySelector('.search-box');
        this.searchInput = document.querySelector('.search-box input');
        this.searchButton = document.querySelector('.search-box button');
        this.searchResults = [];
        
        this.initSearchPanel();
        this.bindEvents();
    }

    initSearchPanel() {
        // 创建搜索面板
        const searchPanel = document.createElement('div');
        searchPanel.className = 'search-panel';
        searchPanel.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <h3 data-translate="search">站内搜索</h3>
                    <button class="close-search">×</button>
                </div>
                <div class="search-form">
                    <input type="text" data-translate="search-placeholder" placeholder="搜索...">
                    <button data-translate="search-button">搜索</button>
                </div>
                <div class="search-results"></div>
            </div>
        `;
        document.body.appendChild(searchPanel);
        
        this.panel = searchPanel;
        this.panelInput = searchPanel.querySelector('input');
        this.panelButton = searchPanel.querySelector('button');
        this.resultsContainer = searchPanel.querySelector('.search-results');
        this.closeButton = searchPanel.querySelector('.close-search');
    }

    bindEvents() {
        // 点击搜索图标时打开搜索面板
        this.searchToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.openSearchPanel();
        });

        // 关闭搜索面板
        this.closeButton.addEventListener('click', () => {
            this.closeSearchPanel();
        });

        // ESC键关闭搜索面板
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearchPanel();
            }
        });

        // 点击面板外部关闭
        this.panel.addEventListener('click', (e) => {
            if (e.target === this.panel) {
                this.closeSearchPanel();
            }
        });

        // 搜索按钮点击事件
        this.panelButton.addEventListener('click', () => {
            this.performSearch();
        });

        // 输入框回车事件
        this.panelInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    }

    openSearchPanel() {
        this.panel.classList.add('active');
        this.panelInput.focus();
    }

    closeSearchPanel() {
        this.panel.classList.remove('active');
        this.panelInput.value = '';
        this.resultsContainer.innerHTML = '';
    }

    async performSearch() {
        const searchTerm = this.panelInput.value.trim();
        if (!searchTerm) return;

        // 从文章数据中搜索
        const results = articlesData.allArticles.filter(article => 
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.displayResults(results, searchTerm);
    }

    displayResults(results, searchTerm) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>未找到与 "${searchTerm}" 相关的内容</p>
                </div>
            `;
            return;
        }

        this.resultsContainer.innerHTML = results.map(article => `
            <div class="search-result-item">
                <div class="result-meta">
                    <span class="result-date">${article.date}</span>
                    <span class="result-category">${article.category}</span>
                </div>
                <h4>
                    <a href="${article.url}" ${article.type === 'link' ? 'target="_blank"' : 'download'}>
                        ${article.title}
                    </a>
                </h4>
                <p>${article.excerpt}</p>
            </div>
        `).join('');
    }
}

// 页面加载完成后初始化搜索功能
document.addEventListener('DOMContentLoaded', () => {
    new SearchHandler();
}); 