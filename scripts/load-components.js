async function loadComponent(componentPath, targetId) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error('Failed to load component');
        const html = await response.text();
        
        if (targetId) {
            document.getElementById(targetId).innerHTML = html;
        } else {
            document.body.insertAdjacentHTML('beforeend', html);
        }
        
        initChatWidget();
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('components/chat-widget.html');
}); 