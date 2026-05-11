/**
 * UI Table Module
 * Handles rendering the main order grid and batch action bar.
 */

function renderRows() {
    const tbody = document.getElementById('order-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const filtered = window.STATE_MANAGER.getFilteredOrders();
    const { selectedId, selectedCheckboxes, currentSort } = window.AppState;
    const staleThreshold = window.CONFIG?.STALE_THRESHOLD || 60;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding: 80px 20px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 16px; opacity: 0.3;">🔍</div>
                    <div style="font-size: 16px; font-weight: 600; color: var(--text-dim); margin-bottom: 8px;">No data found for this filter</div>
                    <div style="font-size: 13px; color: var(--text-mute); margin-bottom: 24px;">Try adjusting your filters or search terms.</div>
                    <button class="action-btn primary" style="width: auto; padding: 10px 24px;" onclick="setFilter(document.querySelector('.filter-btn[onclick*=\\'all\\']'), 'all')">Switch to All Orders</button>
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(o => {
        const tr = document.createElement('tr');
        if (o.id === selectedId) tr.classList.add('selected');
        if (o.priority === 'urgent') tr.classList.add('priority-urgent');
        if (o.priority === 'high') tr.classList.add('priority-high');

        const sClass = window.STATE_MANAGER.getStateClass(o.state);
        if (['red', 'yellow', 'blue', 'green'].includes(sClass)) {
            tr.classList.add(`row-state-${sClass}`);
        }

        const isStale = o.updatedMins >= staleThreshold && sClass !== 'green';
        if (isStale) tr.classList.add('is-stale');

        const stuckHtml = (o.updatedMins > 30 && sClass !== 'green') ? `<span class="stuck-timer">⏱ ${o.updatedMins}m</span>` : '';
        const staleHtml = isStale ? `<span class="stale-indicator">⏳ STALE</span>` : '';

        const checked = selectedCheckboxes.has(o.id) ? 'checked' : '';
        const checkHtml = `<input type="checkbox" ${checked} onclick="event.stopPropagation(); window.UI_TABLE.toggleCheckbox('${o.id}', this.checked)" />`;

        const lastReason = (() => {
            for (let i = o.timeline.length - 1; i >= 0; i--) {
                if (o.timeline[i].reason) return o.timeline[i].reason;
            }
            return '';
        })();
        const reasonHtml = lastReason ? `<div class="state-reason">${lastReason}</div>` : '';

        tr.innerHTML = `
            <td class="col-checkbox">${checkHtml}</td>
            <td><span class="priority-indicator"></span><div class="patient-name">${o.patient}</div><div class="visit-id">${o.id}</div></td>
            <td>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="state-badge state-${sClass}"><span class="state-dot"></span>${o.state}</span>${stuckHtml}${staleHtml}
                </div>
                ${reasonHtml}
            </td>
            <td class="tech-cell">${o.tech}</td>
            <td class="time-cell">${new Date(o.createdTs).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
            <td class="updated-cell ${isStale ? 'stale' : ''}"><span class="rel-time" data-ts="${o.lastUpdateTs}">${o.updated}</span></td>
        `;
        tr.onclick = (e) => { if (e.target.tagName === 'INPUT') return; window.UI_DETAIL.openDetail(o.id); };
        tbody.appendChild(tr);
    });

    const selectAll = document.getElementById('select-all');
    if (selectAll) {
        const ids = filtered.map(o => o.id);
        selectAll.checked = ids.length > 0 && ids.every(id => selectedCheckboxes.has(id));
    }
    
    updateBatchBar();
    window.EVENT_LISTENERS?.updateLiveTimes();
    
    document.querySelectorAll('thead th').forEach(th => th.classList.remove('sorted', 'desc'));
    if (currentSort.field) {
        const th = document.querySelector(`thead th[data-sort="${currentSort.field}"]`);
        if (th) { th.classList.add('sorted'); if (!currentSort.asc) th.classList.add('desc'); }
    }
    const techBtn = document.getElementById('tech-filter-btn');
    if (techBtn) techBtn.classList.toggle('active', window.AppState.currentTechFilter !== null);
}

function updateBatchBar() {
    const bar = document.getElementById('batch-bar');
    if (!bar) return;
    const cnt = window.AppState.selectedCheckboxes.size;
    const cntEl = document.getElementById('batch-count');
    if (cntEl) cntEl.textContent = cnt;
    bar.classList.toggle('active', cnt > 0);
}

function toggleCheckbox(id, checked) {
    if (checked) window.AppState.selectedCheckboxes.add(id);
    else window.AppState.selectedCheckboxes.delete(id);
    updateBatchBar();
    renderRows();
}

function toggleSelectAll(cb) {
    const filtered = window.STATE_MANAGER.getFilteredOrders();
    if (cb.checked) filtered.forEach(o => window.AppState.selectedCheckboxes.add(o.id));
    else filtered.forEach(o => window.AppState.selectedCheckboxes.delete(o.id));
    updateBatchBar();
    renderRows();
}

window.UI_TABLE = {
    renderRows,
    updateBatchBar,
    toggleCheckbox,
    toggleSelectAll
};
