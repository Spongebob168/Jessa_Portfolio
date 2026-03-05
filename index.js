document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;

    // Apply saved theme or system preference
    let currentTheme = localStorage.getItem('theme');

    if (!currentTheme) {
        // First visit → follow system preference
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    }

    html.setAttribute('data-theme', currentTheme);

    // Toggle function
    function toggleTheme() {
        const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // Click handler
    if (toggle) {
        toggle.addEventListener('click', toggleTheme);
    }

    // Optional: highlight active page in navigation
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentFile || (currentFile === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});