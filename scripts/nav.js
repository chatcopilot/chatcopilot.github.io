document.addEventListener('DOMContentLoaded', function() {
    // 确保元素存在后再添加事件监听
    const languageToggle = document.querySelector('.language-toggle');
    const languageDropdown = document.querySelector('.language-dropdown');

    if (languageToggle && languageDropdown) {
        languageToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
    }

    // 其他导航相关代码...
}); 