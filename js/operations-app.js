/**
 * Main Application Entry Point
 * Initializes modules and handles the application lifecycle.
 */

async function bootstrap() {
    try {
        // 1. Load Configuration
        const response = await fetch('config.json');
        window.CONFIG = await response.json();

        // 2. Map Global Actions (for HTML onclick handlers)
        mapGlobalActions();

        // 3. Initialize Modules
        window.UI_FILTERS.populateTechDropdown();
        window.STATE_MANAGER.updateStats();
        window.UI_TABLE.renderRows();
        window.UI_ALERTS.renderActivities();
        window.EVENT_LISTENERS.init();

        // 4. Set Initial State
        const alertToggle = document.getElementById('activity-toggle');
        if (alertToggle) alertToggle.classList.add('active');

        console.log('Zaren Operations Board initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

function mapGlobalActions() {
    // These functions are called directly from HTML onclick attributes
    window.toggleActivityPanel = window.UI_ALERTS.toggleActivityPanel;
    window.handleSearch = window.STATE_MANAGER.handleSearch || function() {
        window.AppState.searchQuery = document.getElementById('search-input').value;
        window.UI_TABLE.renderRows();
        window.STATE_MANAGER.updateStats();
    };
    window.setFilter = function(btn, filter) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        window.AppState.currentFilter = filter;
        if (filter !== 'technician') {
            window.AppState.currentTechFilter = null;
            const techBtn = document.getElementById('tech-filter-btn');
            if (techBtn) techBtn.classList.remove('active');
        }
        const techDropdown = document.getElementById('tech-dropdown');
        if (filter === 'technician') {
            if (techDropdown) techDropdown.classList.add('active');
        } else {
            if (techDropdown) techDropdown.classList.remove('active');
        }
        window.UI_TABLE.renderRows();
        window.STATE_MANAGER.updateStats();
    };
    
    window.toggleTechDropdown = function(e) {
        e.stopPropagation();
        const techDropdown = document.getElementById('tech-dropdown');
        const dateDropdown = document.getElementById('date-dropdown');
        const techBtn = document.getElementById('tech-filter-btn');
        const dateBtn = document.getElementById('date-filter-btn');

        if (dateDropdown) dateDropdown.classList.remove('active');
        if (dateBtn) dateBtn.classList.toggle('active', window.AppState.currentDateFilter !== null);

        if (techDropdown) techDropdown.classList.toggle('active');
        if (techBtn) techBtn.classList.toggle('active', techDropdown.classList.contains('active') || window.AppState.currentTechFilter !== null);
    };

    window.toggleDateDropdown = function(e) {
        e.stopPropagation();
        const dateDropdown = document.getElementById('date-dropdown');
        const techDropdown = document.getElementById('tech-dropdown');
        const techBtn = document.getElementById('tech-filter-btn');
        const dateBtn = document.getElementById('date-filter-btn');

        if (techDropdown) techDropdown.classList.remove('active');
        if (techBtn) techBtn.classList.toggle('active', window.AppState.currentTechFilter !== null);

        if (dateDropdown) dateDropdown.classList.toggle('active');
        if (dateBtn) dateBtn.classList.toggle('active', dateDropdown.classList.contains('active') || window.AppState.currentDateFilter !== null);
    };

    window.closeDetail = window.UI_DETAIL.closeDetail;
    window.toggleSelectAll = window.UI_TABLE.toggleSelectAll;
    window.batchReassign = function() {
        if (window.AppState.selectedCheckboxes.size === 0) return;
        const ids = Array.from(window.AppState.selectedCheckboxes);
        window.UI_MODALS.openReassignModal(ids[0]);
        window.AppState.batchReassignIds = ids;
    };
    window.batchMarkCompleteAsk = function() {
        if (window.AppState.selectedCheckboxes.size === 0) return;
        window.UI_MODALS.showCartoonModal(`Mark ${window.AppState.selectedCheckboxes.size} order(s) as completed?`, () => {
            window.AppState.selectedCheckboxes.forEach(id => {
                window.STATE_MANAGER.changeOrderState(id, 'Completed');
            });
            window.AppState.selectedCheckboxes.clear();
            window.UI_TABLE.updateBatchBar();
            window.UI_TABLE.renderRows();
            window.STATE_MANAGER.updateStats();
        });
    };
    window.batchAddNote = function() {
        if (window.AppState.selectedCheckboxes.size === 0) return;
        window.UI_MODALS.openNoteModal(Array.from(window.AppState.selectedCheckboxes)[0]);
    };
    
    window.setDateFilter = window.UI_FILTERS.setDateFilter;
    window.resetDateFilter = window.UI_FILTERS.resetDateFilter;
    window.resetTechFilter = window.UI_FILTERS.resetTechFilter;
    window.closeNoteModal = window.UI_MODALS.closeNoteModal;
    window.saveNote = window.UI_MODALS.saveNote;
    window.closeReassignModal = window.UI_MODALS.closeReassignModal;
    window.confirmReassign = window.UI_MODALS.confirmReassign;
    window.closeCartoonModal = window.UI_MODALS.closeCartoonModal;
}

// Start the application
bootstrap();
