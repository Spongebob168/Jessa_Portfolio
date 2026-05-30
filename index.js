// index.js — Portfolio main script

// ── Apply saved theme before first paint ──
(function () {
    var t = localStorage.getItem('theme');
    if (t) document.documentElement.setAttribute('data-theme', t);
})();

document.addEventListener('DOMContentLoaded', function () {

    var html = document.documentElement;
    var header = document.querySelector('header');

    // ════════════════════════════════════════
    // 1. Theme toggle
    // ════════════════════════════════════════
    var themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    // ════════════════════════════════════════
    // 2. Highlight active nav link (desktop + drawer)
    // ════════════════════════════════════════
    var page = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
    var allNavLinks = document.querySelectorAll('nav a, .nav-more-dropdown a, .drawer-nav a');
    allNavLinks.forEach(function (a) {
        if (decodeURIComponent(a.getAttribute('href')) === page) {
            a.classList.add('active');
        }
    });

    // ════════════════════════════════════════
    // 3. Body padding under fixed header
    // ════════════════════════════════════════
    function applyHeaderPadding() {
        if (header) document.body.style.paddingTop = header.offsetHeight + 'px';
    }
    applyHeaderPadding();
    window.addEventListener('resize', applyHeaderPadding, { passive: true });

    // ════════════════════════════════════════
    // 4. Hide header on scroll down, show on scroll up
    // ════════════════════════════════════════
    var lastY = window.scrollY, ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                var y = window.scrollY;
                if (y <= 10) {
                    header.classList.remove('header-hidden');
                } else if (y > lastY + 5) {
                    header.classList.add('header-hidden');
                    closeMoreDropdown();
                } else if (y < lastY - 5) {
                    header.classList.remove('header-hidden');
                }
                lastY = y;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ════════════════════════════════════════
    // 5. Desktop "More" dropdown
    // ════════════════════════════════════════
    var moreBtn = document.getElementById('navMoreBtn');
    var moreDropdown = document.getElementById('navMoreDropdown');
    var moreWrap = document.getElementById('navMoreWrap');

    function openMoreDropdown() {
        if (!moreDropdown || !moreBtn) return;
        var rect = moreBtn.getBoundingClientRect();
        moreDropdown.style.left = rect.left + 'px';
        moreDropdown.classList.add('open');
        moreBtn.textContent = 'More ▴';
    }

    function closeMoreDropdown() {
        if (!moreDropdown || !moreBtn) return;
        moreDropdown.classList.remove('open');
        moreBtn.textContent = 'More ▾';
    }

    if (moreBtn) {
        moreBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            moreDropdown.classList.contains('open') ? closeMoreDropdown() : openMoreDropdown();
        });
    }

    document.addEventListener('click', function (e) {
        if (moreWrap && !moreWrap.contains(e.target)) closeMoreDropdown();
    });

    if (moreDropdown) {
        moreDropdown.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', closeMoreDropdown);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMoreDropdown();
            closeDrawer();
            collapseSearch();
        }
    });

    // ════════════════════════════════════════
    // 6. Mobile hamburger drawer
    // ════════════════════════════════════════
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var mobileDrawer = document.getElementById('mobileDrawer');
    var drawerOverlay = document.getElementById('drawerOverlay');
    var drawerClose = document.getElementById('drawerClose');

    function openDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.add('open');
        drawerOverlay && drawerOverlay.classList.add('open');
        hamburgerBtn && hamburgerBtn.classList.add('open');
        hamburgerBtn && hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('open');
        drawerOverlay && drawerOverlay.classList.remove('open');
        hamburgerBtn && hamburgerBtn.classList.remove('open');
        hamburgerBtn && hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function () {
            mobileDrawer && mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
        });
    }

    if (drawerClose) {
        drawerClose.addEventListener('click', closeDrawer);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }

    // Close drawer on nav link click
    if (mobileDrawer) {
        mobileDrawer.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', closeDrawer);
        });
    }

    // ════════════════════════════════════════
    // 7. Mobile search — icon-only, tap to expand
    // ════════════════════════════════════════
    var searchInputBox = document.getElementById('searchInputBox');
    var searchIconSvg = searchInputBox ? searchInputBox.querySelector('svg') : null;

    function isNarrow() { return window.innerWidth <= 600; }

    function expandSearch() {
        if (!searchInputBox) return;
        searchInputBox.classList.add('expanded');
        var inp = document.getElementById('siteSearch');
        if (inp) { inp.focus(); }
    }

    function collapseSearch() {
        if (!searchInputBox) return;
        searchInputBox.classList.remove('expanded');
        var inp = document.getElementById('siteSearch');
        if (inp) { inp.blur(); inp.value = ''; }
        var drop = document.getElementById('searchDropdown');
        if (drop) { drop.classList.remove('open'); drop.innerHTML = ''; }
    }

    if (searchIconSvg) {
        searchIconSvg.style.cursor = 'pointer';
        searchIconSvg.addEventListener('click', function (e) {
            if (!isNarrow()) return;
            if (!searchInputBox.classList.contains('expanded')) {
                e.stopPropagation();
                expandSearch();
            }
        });
    }

    // Tap outside search to collapse
    document.addEventListener('click', function (e) {
        if (!isNarrow()) return;
        var sw = document.querySelector('.search-wrap');
        if (sw && !sw.contains(e.target)) {
            collapseSearch();
        }
    });

    // ════════════════════════════════════════
    // 8. Scroll-to-top button
    // ════════════════════════════════════════
    var scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 320) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ════════════════════════════════════════
    // 9. Auto-inject mobile drawer (works on ALL pages)
    // ════════════════════════════════════════
    (function injectDrawer() {
        if (document.getElementById('mobileDrawer')) {
            // Drawer already in page HTML — just re-wire hamburger if needed
            var existDrawer  = document.getElementById('mobileDrawer');
            var existOverlay = document.getElementById('drawerOverlay');
            var existClose   = document.getElementById('drawerClose');
            function openE()  { existDrawer.classList.add('open'); existOverlay && existOverlay.classList.add('open'); hamburgerBtn && hamburgerBtn.classList.add('open'); hamburgerBtn && hamburgerBtn.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; }
            function closeE() { existDrawer.classList.remove('open'); existOverlay && existOverlay.classList.remove('open'); hamburgerBtn && hamburgerBtn.classList.remove('open'); hamburgerBtn && hamburgerBtn.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
            if (hamburgerBtn) hamburgerBtn.addEventListener('click', function(){ existDrawer.classList.contains('open') ? closeE() : openE(); });
            if (existClose)   existClose.addEventListener('click', closeE);
            if (existOverlay) existOverlay.addEventListener('click', closeE);
            existDrawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeE); });
            return;
        }

        var curPage = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');

        var NAV = [
            { href: 'index.html',            icon: '🏠', label: 'Home',                  section: 'Main Pages' },
            { href: 'About_Me.html',         icon: '👤', label: 'About Me',              section: '' },
            { href: 'ict_policies.html',     icon: '🔒', label: 'ICT Policies & Safety', section: '' },
            { href: 'non_digital_tool.html', icon: '📌', label: 'Non-Digital Tool',       section: '' },
            { href: 'digital_Tool.html',     icon: '💻', label: 'Digital Tool',           section: '' },
            { href: 'collaborative_task.html',icon:'🤝', label: 'Collaborative Task',     section: 'More' },
            { href: 'flexible_learning.html', icon:'🔄', label: 'Flexible Learning',      section: '' },
            { href: 'final_reflection.html',  icon:'🌟', label: 'Final Reflection',       section: '' },
            { href: 'evaluation.html',        icon:'📋', label: 'Evaluation',             section: '' }
        ];

        var linksHTML = '';
        var lastSection = '';
        NAV.forEach(function (item) {
            if (item.section && item.section !== lastSection) {
                linksHTML += '<span class="drawer-section-label">' + item.section + '</span>';
                lastSection = item.section;
            }
            var active = (item.href === curPage) ? ' active' : '';
            linksHTML += '<a href="' + item.href + '" class="' + active.trim() + '">' +
                '<span class="drawer-nav-icon">' + item.icon + '</span>' +
                item.label + '</a>';
        });

        var tmp = document.createElement('div');
        tmp.innerHTML =
            '<div class="drawer-overlay" id="drawerOverlay"></div>' +
            '<nav class="mobile-drawer" id="mobileDrawer" aria-label="Mobile navigation">' +
            '<div class="drawer-header">' +
            '<span class="drawer-logo">Digital Teaching</span>' +
            '<button class="drawer-close" id="drawerClose" aria-label="Close menu">✕</button>' +
            '</div>' +
            '<div class="drawer-nav" id="drawerNav">' + linksHTML + '</div>' +
            '<div class="drawer-footer">© 2026 Jessa Paradiang</div>' +
            '</nav>';

        while (tmp.firstChild) document.body.appendChild(tmp.firstChild);

        var newOverlay = document.getElementById('drawerOverlay');
        var newDrawer  = document.getElementById('mobileDrawer');
        var newClose   = document.getElementById('drawerClose');

        function openD() {
            newDrawer.classList.add('open');
            newOverlay && newOverlay.classList.add('open');
            hamburgerBtn && hamburgerBtn.classList.add('open');
            hamburgerBtn && hamburgerBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        function closeD() {
            newDrawer.classList.remove('open');
            newOverlay && newOverlay.classList.remove('open');
            hamburgerBtn && hamburgerBtn.classList.remove('open');
            hamburgerBtn && hamburgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', function () {
                newDrawer.classList.contains('open') ? closeD() : openD();
            });
        }
        if (newClose)   newClose.addEventListener('click', closeD);
        if (newOverlay) newOverlay.addEventListener('click', closeD);
        newDrawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeD); });
    })();

});
