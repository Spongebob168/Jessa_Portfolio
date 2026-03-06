// search.js — site-wide search

const SITE_PAGES = [
    {
        page: "Home", url: "index.html", icon: "🏠", sections: [
            { title: "Welcome", content: "This portfolio presents my journey, learning experiences and achievements as a BPED student. Growth, skills, and reflections as I prepare to become a future Physical Education teacher." },
            { title: "Mission", content: "Guide and inspire students to develop a healthy lifestyle, discipline, teamwork, and confidence through physical activities, sports, and dance." },
            { title: "Philosophy in Teaching", content: "Teaching is inspiring growth, confidence, and lifelong learning. Physical Education teaches discipline, teamwork, respect, and perseverance." }
        ]
    },
    {
        page: "About Me", url: "About Me.html", icon: "👤", sections: [
            { title: "About Me", content: "2nd year BPED student passionate about movement, wellness, and lifelong learning. Developing knowledge, skills, and values as a future educator." },
            { title: "Skills & Goals", content: "Sports, athletics, dance, movement, fitness training, lesson planning, teaching strategies, team leadership, classroom management, sportsmanship." }
        ]
    },
    {
        page: "ICT Policies and Safety", url: "ict_policies.html", icon: "🔒", sections: [
            { title: "ICT Policies and Safety", content: "Information and Communication Technology policies, internet safety, digital citizenship, responsible use of technology in education, online safety." },
            { title: "Digital Citizenship", content: "Responsible use of technology, cyber safety, privacy, copyright, ethical use of digital tools and resources in the classroom." }
        ]
    },
    {
        page: "Non-Digital Teaching Tool", url: "non_digital_tool.html", icon: "📌", sections: [
            { title: "Non-Digital Teaching Tool", content: "Traditional teaching tools, physical materials, cones, hoops, task cards, charts, printed worksheets, hands-on learning without technology." }
        ]
    },
    {
        page: "Digital Teaching Tool", url: "digital_tool.html", icon: "💻", sections: [
            { title: "Digital Teaching Tool", content: "Technology tools for teaching, educational apps, software, multimedia, interactive presentations, digital assessments, online platforms for PE." }
        ]
    },
    {
        page: "Collaborative Task", url: "collaborative_task.html", icon: "🤝", sections: [
            { title: "Collaborative Task", content: "Group work, cooperative learning, team activities, collaborative projects, peer learning, group assignments in Physical Education." }
        ]
    },
    {
        page: "Flexible Learning Design", url: "flexible_learning.html", icon: "🔄", sections: [
            { title: "Flexible Learning Design", content: "Blended learning, differentiated instruction, adaptive teaching, modular distance learning, online and face-to-face integration for Physical Education." }
        ]
    },
    {
        page: "Final Reflection", url: "final_reflection.html", icon: "🌟", sections: [
            { title: "Final Reflection", content: "Personal reflection on learning journey, growth as a BPED student, insights gained, challenges overcome, and aspirations for becoming a Physical Education teacher." }
        ]
    }
];

function highlight(text, query) {
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${safe})`, 'gi'), '<mark>$1</mark>');
}

function searchSite(query) {
    if (!query || query.trim().length < 2) return [];
    const q = query.trim().toLowerCase();
    const results = [];
    for (const pg of SITE_PAGES) {
        for (const sec of pg.sections) {
            const haystack = (sec.title + ' ' + sec.content).toLowerCase();
            if (haystack.includes(q)) {
                const idx = haystack.indexOf(q);
                const start = Math.max(0, idx - 35);
                const snippet = sec.content.substring(start, start + 90).trim();
                results.push({ page: pg.page, url: pg.url, icon: pg.icon, title: sec.title, snippet: (start > 0 ? '…' : '') + snippet + '…' });
            }
        }
    }
    return results.slice(0, 8);
}

function initSearch() {
    const input = document.getElementById('siteSearch');
    const dropdown = document.getElementById('searchDropdown');
    if (!input || !dropdown) return;

    input.addEventListener('input', () => {
        const q = input.value.trim();
        if (q.length < 2) { dropdown.classList.remove('open'); dropdown.innerHTML = ''; return; }

        const results = searchSite(q);
        if (!results.length) {
            dropdown.innerHTML = `<div class="search-empty">No results for "<strong>${q}</strong>"</div>`;
            dropdown.classList.add('open');
            return;
        }

        const grouped = {};
        for (const r of results) {
            if (!grouped[r.page]) grouped[r.page] = { icon: r.icon, items: [] };
            grouped[r.page].items.push(r);
        }

        let html = '';
        for (const [name, g] of Object.entries(grouped)) {
            html += `<div class="search-page-label">${g.icon} ${name}</div>`;
            for (const item of g.items) {
                html += `<a class="search-result-item" href="${item.url}">
                    <div class="search-result-icon">${g.icon}</div>
                    <div class="search-result-text">
                        <strong>${highlight(item.title, q)}</strong>
                        <span>${highlight(item.snippet, q)}</span>
                    </div></a>`;
            }
        }
        dropdown.innerHTML = html;
        dropdown.classList.add('open');
    });

    document.addEventListener('click', e => { if (!e.target.closest('.search-wrap')) dropdown.classList.remove('open'); });
    input.addEventListener('keydown', e => { if (e.key === 'Escape') { dropdown.classList.remove('open'); input.blur(); } });
}

document.addEventListener('DOMContentLoaded', initSearch);