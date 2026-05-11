/**
 * UI Filters Module
 * Handles dropdown interactions and selection logic for Technician and Date filters.
 */

function populateTechDropdown() {
    const dropdown = document.getElementById('tech-dropdown');
    if (!dropdown) return;
    const technicians = window.TECHNICIANS || [];
    dropdown.querySelectorAll('.dropdown-item:not(.reset)').forEach(el => el.remove());
    technicians.forEach((t, i) => {
        const item = document.createElement('div');
        const isSelected = window.AppState.currentTechFilter === t.name;
        item.className = 'dropdown-item' + (isSelected ? ' selected' : '');
        item.onclick = () => selectTechFilter(t.name);
        item.innerHTML = `
            <input type="radio" name="tech-filter" id="tech-opt-${i}" ${isSelected ? 'checked' : ''}>
            <span>${t.name}</span>
        `;
        dropdown.insertBefore(item, dropdown.querySelector('.reset'));
    });
}

function selectTechFilter(techName) {
    window.AppState.currentTechFilter = techName;
    window.AppState.currentFilter = 'technician';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('tech-filter-btn');
    if (btn) {
        btn.classList.add('active');
        btn.innerHTML = `Tech: <strong>${techName}</strong>`;
    }
    const resetLink = document.getElementById('reset-tech-link');
    if (resetLink) resetLink.classList.remove('hidden');
    
    const dropdown = document.getElementById('tech-dropdown');
    if (dropdown) dropdown.classList.remove('active');
    
    window.UI_TABLE.renderRows();
    window.STATE_MANAGER.updateStats();
}

function resetTechFilter() {
    window.AppState.currentTechFilter = null;
    window.AppState.currentFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('tech-filter-btn');
    if (btn) {
        btn.classList.remove('active');
        btn.innerHTML = 'Technician';
    }
    const resetLink = document.getElementById('reset-tech-link');
    if (resetLink) resetLink.classList.add('hidden');
    
    const allBtn = document.querySelector('.filter-btn[onclick*="all"]');
    if (allBtn) allBtn.classList.add('active');
    
    const dropdown = document.getElementById('tech-dropdown');
    if (dropdown) dropdown.classList.remove('active');
    
    window.UI_TABLE.renderRows();
    window.STATE_MANAGER.updateStats();
}

function setDateFilter(val) {
    window.AppState.currentDateFilter = val;
    window.AppState.currentFilter = 'date';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('date-filter-btn');
    if (btn) {
        btn.classList.add('active');
        const label = val === 'today' ? 'Today' : val === 'yesterday' ? 'Yesterday' : val;
        btn.innerHTML = `Date: <strong>${label}</strong>`;
    }
    const resetLink = document.getElementById('reset-date-link');
    if (resetLink) resetLink.classList.remove('hidden');
    const dropdown = document.getElementById('date-dropdown');
    if (dropdown) dropdown.classList.remove('active');
    
    window.UI_TABLE.renderRows();
    window.STATE_MANAGER.updateStats();
}

function resetDateFilter() {
    window.AppState.currentDateFilter = null;
    window.AppState.currentFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('date-filter-btn');
    if (btn) {
        btn.classList.remove('active');
        btn.innerHTML = 'Sort by Date';
    }
    const resetLink = document.getElementById('reset-date-link');
    if (resetLink) resetLink.classList.add('hidden');
    const allBtn = document.querySelector('.filter-btn[onclick*="all"]');
    if (allBtn) allBtn.classList.add('active');
    const dropdown = document.getElementById('date-dropdown');
    if (dropdown) dropdown.classList.remove('active');
    
    window.UI_TABLE.renderRows();
    window.STATE_MANAGER.updateStats();
}

window.UI_FILTERS = {
    populateTechDropdown,
    selectTechFilter,
    resetTechFilter,
    setDateFilter,
    resetDateFilter
};
