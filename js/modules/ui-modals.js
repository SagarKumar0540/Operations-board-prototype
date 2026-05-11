/**
 * UI Modals Module
 * Handles modal dialogs and toast notifications.
 */

function showToast(msg, dur = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">✕</button>`;
    container.appendChild(toast);
    if (dur > 0) setTimeout(() => { if (toast.parentNode) toast.remove(); }, dur);
}

function openNoteModal(id) {
    window.AppState.currentReassignOrderId = id;
    const modal = document.getElementById('note-modal');
    const textarea = document.getElementById('note-textarea');
    if (modal) modal.classList.add('open');
    if (textarea) {
        textarea.value = '';
        textarea.focus();
    }
}

function closeNoteModal() {
    const modal = document.getElementById('note-modal');
    if (modal) modal.classList.remove('open');
    window.AppState.currentReassignOrderId = null;
}

function saveNote() {
    const textarea = document.getElementById('note-textarea');
    const note = textarea ? textarea.value.trim() : '';
    const id = window.AppState.currentReassignOrderId;
    if (note && id) {
        const orders = window.DETAILED_ORDERS || [];
        const order = orders.find(o => o.id === id);
        if (order) {
            order.notes = order.notes ? order.notes + '\n\n' + note : note;
            window.UI_DETAIL.openDetail(id);
            showToast('Note saved.');
        }
    }
    closeNoteModal();
}

function openReassignModal(id) {
    window.AppState.currentReassignOrderId = id;
    const orders = window.DETAILED_ORDERS || [];
    const o = orders.find(o => o.id === id);
    if (!o) return;
    window.AppState.selectedTech = o.tech;
    window.AppState.batchReassignIds = null;
    populateReassignTechList(o.tech);
    const modal = document.getElementById('reassign-modal');
    if (modal) modal.classList.add('open');
}

function populateReassignTechList(selected) {
    const container = document.getElementById('tech-list');
    if (!container) return;
    const technicians = window.TECHNICIANS || [];
    container.innerHTML = technicians.map(t => `
        <div class="reassign-option ${t.name === selected ? 'selected' : ''}" onclick="window.UI_MODALS.selectTech('${t.name}')">
            <div class="reassign-tech-info">
                <span class="reassign-tech-name">${t.name}</span>
                <span class="reassign-tech-status">${t.load} active</span>
            </div>
            ${t.name === selected ? '<span class="reassign-check">✓</span>' : ''}
        </div>`).join('');
}

function selectTech(name) {
    window.AppState.selectedTech = name;
    document.querySelectorAll('.reassign-option').forEach(opt => {
        const techName = opt.querySelector('.reassign-tech-name')?.textContent;
        opt.classList.toggle('selected', techName === name);
    });
}

function confirmReassign() {
    const tech = window.AppState.selectedTech;
    if (tech) {
        const ids = window.AppState.batchReassignIds || [window.AppState.currentReassignOrderId];
        const orders = window.DETAILED_ORDERS || [];
        ids.forEach(id => {
            const o = orders.find(o => o.id === id);
            if (o) o.tech = tech;
        });
        window.UI_TABLE.renderRows();
        window.STATE_MANAGER.updateStats();
        if (window.AppState.selectedId && ids.includes(window.AppState.selectedId)) window.UI_DETAIL.openDetail(window.AppState.selectedId);
        showToast(`Reassigned ${ids.length} order(s) to ${tech}.`);
        if (window.AppState.batchReassignIds) window.UI_TABLE.clearSelection();
    }
    closeReassignModal();
}

function closeReassignModal() {
    const modal = document.getElementById('reassign-modal');
    if (modal) modal.classList.remove('open');
    window.AppState.currentReassignOrderId = null;
    window.AppState.selectedTech = null;
}

function showCartoonModal(msg, onConfirm) {
    const msgEl = document.getElementById('cartoon-message');
    const yesBtn = document.getElementById('cartoon-yes');
    const modal = document.getElementById('cartoon-modal');
    if (msgEl) msgEl.textContent = msg;
    if (yesBtn) yesBtn.onclick = () => { closeCartoonModal(); onConfirm(); };
    if (modal) modal.classList.add('open');
}

function closeCartoonModal() {
    const modal = document.getElementById('cartoon-modal');
    if (modal) modal.classList.remove('open');
}

window.UI_MODALS = {
    showToast,
    openNoteModal,
    closeNoteModal,
    saveNote,
    openReassignModal,
    closeReassignModal,
    selectTech,
    confirmReassign,
    showCartoonModal,
    closeCartoonModal
};
