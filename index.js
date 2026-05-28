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

});
