/**
 * State Manager Module
 * Handles application state, filtering logic, and state transitions.
 */

window.AppState = {
    selectedId: null,
    currentFilter: 'all',
    currentTechFilter: null,
    currentSort: { field: null, asc: true },
    searchQuery: '',
    selectedTech: null,
    currentDateFilter: null,
    currentReassignOrderId: null,
    selectedCheckboxes: new Set(),
    batchReassignIds: null
};

function getFilteredOrders() {
    let filtered = window.DETAILED_ORDERS || [];
    const { currentFilter, currentTechFilter, currentDateFilter, searchQuery, currentSort } = window.AppState;
    const nowTs = Date.now();
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0); const todayTimestamp = todayStart.getTime();

    if (currentFilter === 'delayed') {
        filtered = filtered.filter(o => 
            o.priority === 'urgent' || 
            o.stateClass === 'red'
        );
    } else if (currentFilter === 'active') {
        filtered = filtered.filter(o => ['blue', 'yellow'].includes(o.stateClass));
    } else if (currentFilter === 'technician' && currentTechFilter) {
        filtered = filtered.filter(o => o.tech === currentTechFilter);
    } else if (currentFilter === 'date' && currentDateFilter) {
        if (currentDateFilter === 'today') {
            filtered = filtered.filter(o => o.createdTs >= todayTimestamp && o.createdTs < todayTimestamp + 86400000);
        } else if (currentDateFilter === 'yesterday') {
            const yStart = todayTimestamp - 86400000;
            filtered = filtered.filter(o => o.createdTs >= yStart && o.createdTs < todayTimestamp);
        } else {
            const selDate = new Date(currentDateFilter); selDate.setHours(0, 0, 0, 0);
            const selTs = selDate.getTime();
            filtered = filtered.filter(o => o.createdTs >= selTs && o.createdTs < selTs + 86400000);
        }
    }

    if (currentTechFilter && currentFilter !== 'technician') {
        filtered = filtered.filter(o => o.tech === currentTechFilter);
    }

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(o => o.patient.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.tech.toLowerCase().includes(q));
    }

    if (currentSort.field) {
        const { field, asc } = currentSort;
        filtered = [...filtered].sort((a, b) => {
            let va, vb;
            switch (field) {
                case 'patient': va = a.patient.toLowerCase(); vb = b.patient.toLowerCase(); break;
                case 'state': va = a.state.toLowerCase(); vb = b.state.toLowerCase(); break;
                case 'tech': va = a.tech.toLowerCase(); vb = b.tech.toLowerCase(); break;
                case 'datetime': va = a.createdTs; vb = b.createdTs; break;
                case 'time': va = a.updatedMins; vb = b.updatedMins; break;
                default: return 0;
            }
            if (va < vb) return asc ? -1 : 1;
            if (va > vb) return asc ? 1 : -1;
            return 0;
        });
    }
    return filtered;
}

function updateStats() {
    const allOrders = window.DETAILED_ORDERS || [];
    
    // Logic must match getFilteredOrders 'delayed' filter
    const attention = allOrders.filter(o => 
        o.priority === 'urgent' ||
        o.stateClass === 'red'
    ).length;
    
    const active = allOrders.filter(o => ['blue', 'yellow'].includes(o.stateClass)).length;
    
    const urgentEl = document.getElementById('stat-urgent');
    const activeEl = document.getElementById('stat-active');
    if (urgentEl) urgentEl.textContent = attention;
    if (activeEl) activeEl.textContent = active;

    const pillDelayed = document.getElementById('pill-delayed');
    if (pillDelayed) {
        const delayedCount = filtered.filter(o => o.updatedMins > 30 && o.stateClass !== 'green').length;
        pillDelayed.textContent = `${delayedCount} Delayed`;
    }
}

function getStateClass(state) {
    const m = window.CONFIG?.STATE_COLOR_MAP || {};
    return m[state] || 'gray';
}

function changeOrderState(id, newState) {
    const orders = window.DETAILED_ORDERS || [];
    const o = orders.find(o => o.id === id);
    if (o && o.state !== newState) {
        o.state = newState; 
        o.stateClass = getStateClass(newState);
        o.updated = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        o.updatedMins = 0; 
        o.lastUpdateTs = Date.now();
        
        window.UI_TABLE?.renderRows(); 
        updateStats(); 
        if (window.AppState.selectedId === id) window.UI_DETAIL?.openDetail(id);
        window.UI_MODALS?.showToast(`State changed to "${newState}" for ${o.patient}.`);
    }
}

// Export to window for global access (compatible with legacy structure)
window.STATE_MANAGER = {
    getFilteredOrders,
    updateStats,
    getStateClass,
    changeOrderState
};
