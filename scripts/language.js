document.addEventListener('DOMContentLoaded', function() {
    console.log('Language script loaded');

    // 获取DOM元素
    const languageSelector = document.querySelector('.language-selector');
    const languageToggle = document.querySelector('.language-toggle');
    const languageDropdown = document.querySelector('.language-dropdown');
    const languageLinks = document.querySelectorAll('.language-dropdown a');

    // 当前语言
    let currentLang = localStorage.getItem('preferred-language') || 'zh-CN';

    console.log('Language elements:', {
        selector: languageSelector,
        toggle: languageToggle,
        dropdown: languageDropdown,
        links: languageLinks
    });

    // 语言配置
    const LANGUAGES = {
        'zh-CN': {
            'home': '首页',
            'insights': '知识与洞见',
            'recommendations': '好文推荐',
            'search-placeholder': '站内搜索...',
            'language': '选择语言',
            'welcome': '欢迎来到我的加油站',
            'welcome-subtitle': '在这里，与我一起探索能源科技的无限可能',
            'featured': '精选内容',
            'latest-insights': '最新洞见'
        },
        'en': {
            'home': 'Home',
            'insights': 'Insights',
            'recommendations': 'Recommendations',
            'search-placeholder': 'Search...',
            'language': 'Language',
            'welcome': 'Welcome to My Refueling Station',
            'welcome-subtitle': 'Explore the infinite possibilities of energy technology with me',
            'featured': 'Featured',
            'latest-insights': 'Latest Insights'
        },
        'ar': {
            'home': 'الصفحة الرئيسية',
            'insights': 'رؤى ومعرفة',
            'recommendations': 'توصيات',
            'search-placeholder': 'بحث...',
            'language': 'اللغة',
            'welcome': 'مرحبا بكم في محطتي',
            'welcome-subtitle': 'اكتشف معي الإمكانيات اللامتناهية لتكنولوجيا الطاقة',
            'featured': 'مميز',
            'latest-insights': 'أحدث الرؤى'
        },
        'ja': {
            'home': 'ホーム',
            'insights': '知見',
            'recommendations': 'おすすめ',
            'search-placeholder': '検索...',
            'language': '言語',
            'welcome': '私のステーションへようこそ',
            'welcome-subtitle': 'エネルギー技術の無限の可能性を一緒に探求しましょう',
            'featured': '特集',
            'latest-insights': '最新の洞察'
        },
        'ko': {
            'home': '홈',
            'insights': '인사이트',
            'recommendations': '추천',
            'search-placeholder': '검색...',
            'language': '언어',
            'welcome': '내 스테이션에 오신 것을 환영합니다',
            'welcome-subtitle': '저와 함께 에너지 기술의 무한한 가능성을 탐구하세요',
            'featured': '주요 콘텐츠',
            'latest-insights': '최신 인사이트'
        }
    };

    // 设置语言
    function setLanguage(lang) {
        if (!LANGUAGES[lang]) {
            console.error(`Language ${lang} not supported`);
            return;
        }

        // 更新所有需要翻译的元素
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (LANGUAGES[lang][key]) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = LANGUAGES[lang][key];
                } else {
                    element.textContent = LANGUAGES[lang][key];
                }
            }
        });

        // 更新文档方向（针对阿拉伯语）
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        // 触发自定义事件
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
    }

    // 更新活动语言显示
    function updateActiveLanguage() {
        languageLinks.forEach(link => {
            const lang = link.getAttribute('data-lang');
            if (lang === currentLang) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // 更新语言选择器显示文本
        const languageText = document.querySelector('.language-toggle span');
        if (languageText) {
            languageText.textContent = LANGUAGES[currentLang]['language'];
        }
    }

    // 切换下拉菜单显示
    if (languageToggle) {
        languageToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Toggle clicked');
            
            // 直接操作 display 样式
            if (languageDropdown.style.display === 'block') {
                languageDropdown.style.display = 'none';
            } else {
                languageDropdown.style.display = 'block';
            }
        });
    }

    // 语言选择
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const lang = this.getAttribute('data-lang');
            console.log('Language selected:', lang);
            if (lang) {
                currentLang = lang;
                localStorage.setItem('preferred-language', lang);
                setLanguage(lang);
                updateActiveLanguage();
                languageDropdown.style.display = 'none';
            }
        });
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', function(e) {
        if (!languageSelector.contains(e.target)) {
            languageDropdown.style.display = 'none';
        }
    });

    // 初始化语言
    setLanguage(currentLang);
    updateActiveLanguage();
}); 