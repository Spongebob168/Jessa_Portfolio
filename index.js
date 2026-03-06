// index.js

// Apply saved theme before first paint
(function () {
    var t = localStorage.getItem('theme');
    if (t) document.documentElement.setAttribute('data-theme', t);
})();

document.addEventListener('DOMContentLoaded', function () {

    var html = document.documentElement;
    var header = document.querySelector('header');

    // ── 1. Theme toggle ──
    var themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    // ── 2. Highlight active nav link ──
    var page = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('nav a, .nav-more-dropdown a').forEach(function (a) {
        if (decodeURIComponent(a.getAttribute('href')) === page) a.classList.add('active');
    });

    // ── 3. Body padding under fixed header ──
    if (header) document.body.style.paddingTop = header.offsetHeight + 'px';

    // ── 4. Hide header on scroll down, show on scroll up ──
    var lastY = window.scrollY, ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                var y = window.scrollY;
                if (y <= 10) header.classList.remove('header-hidden');
                else if (y > lastY + 5) { header.classList.add('header-hidden'); closeDropdown(); }
                else if (y < lastY - 5) header.classList.remove('header-hidden');
                lastY = y;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ── 5. More dropdown ──
    var moreBtn = document.getElementById('navMoreBtn');
    var moreDropdown = document.getElementById('navMoreDropdown');
    var moreWrap = document.getElementById('navMoreWrap');

    function openDropdown() {
        if (!moreDropdown || !moreBtn) return;
        var rect = moreBtn.getBoundingClientRect();
        moreDropdown.style.left = rect.left + 'px';
        moreDropdown.classList.add('open');
        moreBtn.textContent = 'More ▴';
    }

    function closeDropdown() {
        if (!moreDropdown || !moreBtn) return;
        moreDropdown.classList.remove('open');
        moreBtn.textContent = 'More ▾';
    }

    if (moreBtn) {
        moreBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            moreDropdown.classList.contains('open') ? closeDropdown() : openDropdown();
        });
    }

    document.addEventListener('click', function (e) {
        if (moreWrap && !moreWrap.contains(e.target)) closeDropdown();
    });

    if (moreDropdown) {
        moreDropdown.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', closeDropdown);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDropdown();
    });

});
