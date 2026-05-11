/**
 * Event Listeners Module
 * Handles global browser events, keyboard shortcuts, and timer-based updates.
 */

function init() {
    // Global Click Handler for Dropdowns
    document.addEventListener('click', function (e) {
        const techDropdown = document.getElementById('tech-dropdown');
        const techBtn = document.getElementById('tech-filter-btn');
        if (techDropdown && techBtn && !techBtn.contains(e.target) && !techDropdown.contains(e.target)) {
            techDropdown.classList.remove('active');
            techBtn.classList.remove('active');
        }

        const dateDropdown = document.getElementById('date-dropdown');
        const dateBtn = document.getElementById('date-filter-btn');
        if (dateDropdown && dateBtn && !dateBtn.contains(e.target) && !dateDropdown.contains(e.target)) {
            dateDropdown.classList.remove('active');
            if (window.AppState.currentFilter !== 'date') dateBtn.classList.remove('active');
        }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', function (e) {
        const noteModal = document.getElementById('note-modal');
        const reassignModal = document.getElementById('reassign-modal');
        const cartoonModal = document.getElementById('cartoon-modal');
        const detailPanel = document.getElementById('detail-panel');

        if (e.key === 'Escape') {
            if (noteModal?.classList.contains('open')) window.UI_MODALS.closeNoteModal();
            else if (reassignModal?.classList.contains('open')) window.UI_MODALS.closeReassignModal();
            else if (cartoonModal?.classList.contains('open')) window.UI_MODALS.closeCartoonModal();
            else if (detailPanel && !detailPanel.classList.contains('hidden')) window.UI_DETAIL.closeDetail();
        }
        if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            document.getElementById('search-input')?.focus();
        }
        if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            alert('Shortcuts: / Search, ESC Close, ↑↓ Navigate');
        }
    });

    // Table Keyboard Navigation
    const tableWrap = document.getElementById('table-wrap');
    if (tableWrap) {
        tableWrap.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); updateKeyboardSelection(1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); updateKeyboardSelection(-1); }
            else if (e.key === 'Enter') {
                const sel = document.querySelector('#order-tbody tr.selected');
                if (sel) sel.click();
            }
        });
    }

    // Table Sorting Listeners
    document.querySelectorAll('thead th[data-sort]').forEach(th => {
        th.addEventListener('click', function () { toggleSort(this.dataset.sort); });
    });

    // Live Time Updates
    setInterval(updateLiveTimes, 15000);
}

let keyboardRowIndex = -1;
function updateKeyboardSelection(delta) {
    const rows = document.querySelectorAll('#order-tbody tr');
    if (!rows.length) return;
    keyboardRowIndex = Math.min(Math.max(keyboardRowIndex + delta, 0), rows.length - 1);
    rows.forEach(r => r.classList.remove('selected'));
    const newRow = rows[keyboardRowIndex];
    if (newRow) {
        newRow.classList.add('selected');
        newRow.scrollIntoView({ block: 'nearest' });
        const idEl = newRow.querySelector('.visit-id');
        if (idEl) window.UI_DETAIL.openDetail(idEl.textContent);
    }
}

function toggleSort(field) {
    const { currentSort } = window.AppState;
    if (currentSort.field === field) {
        if (currentSort.asc) currentSort.asc = false;
        else { currentSort.field = null; currentSort.asc = true; }
    } else {
        currentSort.field = field;
        currentSort.asc = true;
    }
    window.UI_TABLE.renderRows();
}

function updateLiveTimes() {
    const nowTs = Date.now();
    document.querySelectorAll('.live-age').forEach(el => {
        const ts = parseInt(el.dataset.ts);
        if (ts) el.textContent = Math.floor((nowTs - ts) / 60000) + 'm';
    });
    document.querySelectorAll('.rel-time').forEach(el => {
        const ts = parseInt(el.dataset.ts);
        if (ts) {
            const d = Math.floor((nowTs - ts) / 60000);
            if (d < 1) el.textContent = 'Just now';
            else if (d === 1) el.textContent = '1 min ago';
            else el.textContent = `${d} mins ago`;
        }
    });
}

window.EVENT_LISTENERS = {
    init,
    updateLiveTimes
};
