/**
 * UI Alerts Module
 * Handles the real-time alert panel rendering.
 */

function toggleActivityPanel() {
    const panel = document.getElementById('activity-panel');
    const toggle = document.getElementById('activity-toggle');
    if (!panel || !toggle) return;
    
    panel.classList.toggle('hidden');
    toggle.classList.toggle('active');
    
    if (!panel.classList.contains('hidden')) {
        renderActivities();
    }
}

function renderActivities() {
    const container = document.getElementById('activity-list');
    if (!container) return;
    const activities = window.ACTIVITIES || [];
    container.innerHTML = activities.map(a => `
        <div class="activity-card" onclick="window.UI_MODALS.showToast('Alert: ${a.msg}')">
            <div class="activity-icon ${a.type}">
                ${a.type === 'info' ? 'ℹ' : a.type === 'error' ? '⚠' : a.type === 'success' ? '✓' : a.type === 'warning' ? '!' : '!'}
            </div>
            <div class="activity-content">
                <div class="activity-msg">${a.msg}</div>
                <div class="activity-meta">
                    <span class="rel-time" data-ts="${a.ts}">${a.time}</span>
                </div>
            </div>
        </div>`).join('');
}

window.UI_ALERTS = {
    toggleActivityPanel,
    renderActivities
};
