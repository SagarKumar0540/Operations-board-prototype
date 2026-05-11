/**
 * UI Detail Module
 * Handles the order detail panel and timeline rendering.
 */

function openDetail(id) {
    window.AppState.selectedId = id;
    const orders = window.DETAILED_ORDERS || [];
    const o = orders.find(x => x.id === id);
    if (!o) return;

    window.UI_TABLE.renderRows();
    
    // Focus Detail: Open Detail Panel, Hide Alert Panel
    const detailPanel = document.getElementById('detail-panel');
    const alertPanel = document.getElementById('activity-panel');
    const alertToggle = document.getElementById('activity-toggle');
    
    if (detailPanel) detailPanel.classList.remove('hidden');
    if (alertPanel) alertPanel.classList.add('hidden');
    if (alertToggle) alertToggle.classList.remove('active');

    const body = document.getElementById('detail-body');
    if (!body) return;

    const situationRoomHeader = renderSituationRoom(o);
    const tlHtml = renderTimeline(o);
    const actionsHtml = renderActions(o);

    body.innerHTML = `
        ${situationRoomHeader}
        <div class="detail-section">
            <div class="section-header" onclick="window.UI_DETAIL.toggleDetailSection(this)">
                <span class="section-label">Encounter Timeline</span>
                <span class="section-toggle">▼</span>
            </div>
            <div class="section-content"><div class="timeline">${tlHtml}</div></div>
        </div>
        <div class="detail-section">
            <div class="section-header" onclick="window.UI_DETAIL.toggleDetailSection(this)">
                <span class="section-label">Operational Actions</span>
                <span class="section-toggle">▼</span>
            </div>
            <div class="section-content">${actionsHtml}</div>
        </div>
        ${renderLocationAndPatient(o)}
    `;
    window.EVENT_LISTENERS?.updateLiveTimes();
}

function renderSituationRoom(o) {
    const sClass = window.STATE_MANAGER.getStateClass(o.state);
    const isCompleted = o.stateClass === 'green';
    
    // CALIBRATED RISK LOGIC (Purely State & Exception Based)
    let riskLevel = 'LOW';
    if (isCompleted) riskLevel = 'NONE';
    else if (o.stateClass === 'red') riskLevel = 'CRITICAL';
    else if (o.priority === 'urgent' && !['En Route', 'Arrived', 'Imaging In Progress'].includes(o.state)) riskLevel = 'HIGH';
    else if (o.priority === 'urgent') riskLevel = 'MEDIUM'; 
    else if (o.priority === 'high') riskLevel = 'MEDIUM';

    const riskColor = isCompleted ? 'var(--green)' : riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'var(--red)' : riskLevel === 'MEDIUM' ? 'var(--yellow)' : 'var(--gray)';
    
    // Momentum Logic (State Based)
    let momentumHtml = '';
    if (isCompleted) {
        momentumHtml = `<span class="snap-val" style="color: var(--text-mute)">Finalized</span>`;
    } else {
        momentumHtml = `<span class="snap-val active"><span class="momentum-pulse"></span> Moving</span>`;
    }

    // Confidence Logic
    const confidenceLabel = isCompleted ? '100% VERIFIED' : 'SYSTEM ESTIMATED';

    // Extract Latest Exception/Reason
    const latestException = [...o.timeline].reverse().find(t => t.reason)?.reason;

    return `
        <div class="situation-header" style="border-left: 6px solid ${riskColor};">
            <div class="situation-identity">
                <div class="sit-patient">${o.patient}</div>
                <div class="sit-id mono">${o.id}</div>
            </div>
            <div class="situation-top">
                <div class="situation-main">
                    <div class="situation-state-label">Current State</div>
                    <div class="situation-state-val">${o.state}</div>
                </div>
                <div class="situation-risk">
                    <div class="risk-label">Operational Risk</div>
                    <div class="risk-val" style="color:${riskColor}">${riskLevel}</div>
                </div>
            </div>
            ${latestException && o.stateClass === 'red' ? `
                <div class="situation-exception">
                    <div class="exception-label">Exception Context</div>
                    <div class="exception-val">${latestException}</div>
                </div>
            ` : ''}
            <div class="situation-snapshot">
                <div class="snapshot-item">
                    <span class="snap-label">Momentum:</span>
                    ${momentumHtml}
                </div>
                <div class="snapshot-item">
                    <span class="snap-label">Confidence:</span>
                    <span class="confidence-badge" style="${isCompleted ? 'border-color: var(--green); color: var(--green);' : ''}">${confidenceLabel}</span>
                </div>
            </div>
        </div>
    `;
}

function closeDetail() {
    window.AppState.selectedId = null;
    const detailPanel = document.getElementById('detail-panel');
    const alertPanel = document.getElementById('activity-panel');
    const alertToggle = document.getElementById('activity-toggle');
    
    if (detailPanel) detailPanel.classList.add('hidden');
    if (alertPanel) alertPanel.classList.remove('hidden');
    if (alertToggle) alertToggle.classList.add('active');
    
    window.UI_TABLE.renderRows();
    window.UI_ALERTS?.renderActivities();
}

function renderTimeline(o) {
    let html = '';
    let doneGroup = [];

    function getTlItemHtml(t, i, isLastItem) {
        const metaHtml = t.reason ? `<div class="tl-meta">${t.reason}</div>` : '';
        const isFuture = t.status !== 'done' && t.status !== 'active';
        const lineClass = isFuture || t.status === 'active' ? 'future-line' : 'done-line';
        const lineHtml = !isLastItem ? `<div class="tl-line ${lineClass}"></div>` : '';
        return `
            <div class="tl-item">
                <div class="tl-left"><div class="tl-dot ${t.status}"></div>${lineHtml}</div>
                <div class="tl-content">
                    <div class="tl-event ${t.status}">${t.event}</div>
                    <div class="tl-time mono">${t.time}</div>
                    ${metaHtml}
                </div>
            </div>`;
    }

    for (let i = 0; i < o.timeline.length; i++) {
        const t = o.timeline[i];
        const isLast = i === o.timeline.length - 1;
        if (t.status === 'done' && !isLast && o.timeline.length > 8) {
            doneGroup.push({ t, i });
            if (doneGroup.length === 5) {
                const groupHtml = doneGroup.map(g => getTlItemHtml(g.t, g.i, false)).join('');
                html += `
                    <div class="tl-group-wrapper">
                        <div class="tl-group-toggle" onclick="this.nextElementSibling.classList.toggle('expanded'); this.classList.toggle('expanded')">
                            <div class="tl-left"><div class="tl-dot group-dot">✓</div><div class="tl-line done-line"></div></div>
                            <div class="tl-content"><div class="tl-event done">${doneGroup[0].t.event} & ${doneGroup.length - 1} more steps <span class="expand-icon">▼</span></div></div>
                        </div>
                        <div class="tl-group-content">${groupHtml}</div>
                    </div>`;
                doneGroup = [];
            }
        } else {
            if (doneGroup.length > 0) { doneGroup.forEach(g => { html += getTlItemHtml(g.t, g.i, false); }); doneGroup = []; }
            html += getTlItemHtml(t, i, isLast);
        }
    }
    return html;
}

function renderActions(o) {
    return `
        <div class="action-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <button class="action-btn-solid" onclick="window.UI_DETAIL.showNextSteps()">Advance Step</button>
            <button class="action-btn-ghost" onclick="window.UI_DETAIL.showExceptionActions()">Report Exception</button>
        </div>
        <div id="next-steps-container" class="action-sub-steps"></div>
        <div id="exceptions-container" class="action-sub-steps"></div>
        <div style="height: 1px; background: var(--border); margin: 16px 0;"></div>
        <button class="action-btn-ghost" style="width: 100%;" onclick="window.UI_MODALS.openNoteModal('${o.id}')">Add Operational Note</button>
    `;
}

function renderStalenessWarning(o) {
    return ''; // Deprecated, now in Situation Room header
}

function renderLocationAndPatient(o) {
    const distance = Math.floor(Math.random() * 15) + 2; const eta = Math.floor(distance * 2.5);
    const sClass = window.STATE_MANAGER.getStateClass(o.state);
    return `
        <div class="detail-section">
            <div class="section-header" onclick="window.UI_DETAIL.toggleDetailSection(this)">
                <span class="section-label">Location & ETA</span>
                <span class="section-toggle collapsed">▼</span>
            </div>
            <div class="section-content collapsed">
                <div class="location-preview">
                    <div class="location-address">📍 123 Main St, Unit 2<br/>New York, NY 10001</div>
                    <div class="location-distance">Distance: ${distance}km | ETA: ${eta}min</div>
                </div>
            </div>
        </div>
        <div class="detail-section">
            <div class="section-header" onclick="window.UI_DETAIL.toggleDetailSection(this)">
                <span class="section-label">Patient & Assignment</span>
                <span class="section-toggle collapsed">▼</span>
            </div>
            <div class="section-content collapsed">
                <div class="detail-grid">
                    <div class="detail-field"><label>Patient</label><div class="val">${o.patient}</div></div>
                    <div class="detail-field"><label>Visit ID</label><div class="val mono">${o.id}</div></div>
                    <div class="detail-field"><label>Technician</label><div class="val">${o.tech}</div></div>
                    <div class="detail-field"><label>Time Window</label><div class="val">${o.window}</div></div>
                    <div class="detail-field"><label>Priority</label><div class="val" style="text-transform:uppercase;color:${o.priority === 'urgent' ? 'var(--red)' : o.priority === 'high' ? 'var(--yellow)' : 'var(--text)'}">${o.priority}</div></div>
                    <div class="detail-field"><label>Current State</label><div class="val"><span class="state-badge state-${sClass}" style="font-size:10px"><span class="state-dot"></span>${o.state}</span></div></div>
                </div>
            </div>
        </div>`;
}

function showNextSteps() {
    const o = (window.DETAILED_ORDERS || []).find(x => x.id === window.AppState.selectedId);
    if (!o) return;
    const container = document.getElementById('next-steps-container');
    const exceptions = document.getElementById('exceptions-container');
    if (exceptions) exceptions.classList.remove('active');
    
    const STATE_TO_KEY_MAP = {
        'Order Received': 'ORDER_RECEIVED', 'Order Under Review': 'ORDER_UNDER_REVIEW', 'Order Complete': 'ORDER_COMPLETE',
        'Order Incomplete': 'ORDER_INCOMPLETE', 'Insurance Verification Required': 'INSURANCE_VERIFICATION_REQUIRED',
        'Insurance Verified': 'INSURANCE_VERIFIED', 'Authorization Required': 'AUTHORIZATION_REQUIRED',
        'Authorization In Progress': 'AUTHORIZATION_IN_PROGRESS', 'Authorization Approved': 'AUTHORIZATION_APPROVED',
        'Authorization Denied': 'AUTHORIZATION_DENIED', 'Patient Contact Initiated': 'PATIENT_CONTACT_INITIATED',
        'Patient Contacted': 'PATIENT_CONTACTED', 'Patient Unreachable': 'PATIENT_UNREACHABLE',
        'Patient Requested Callback': 'PATIENT_REQUESTED_CALLBACK', 'Patient Declined': 'PATIENT_DECLINED',
        'Patient Confirmed': 'PATIENT_CONFIRMED', 'Scheduling Required': 'SCHEDULING_REQUIRED',
        'Scheduling In Progress': 'SCHEDULING_IN_PROGRESS', 'Time Proposed': 'TIME_PROPOSED',
        'Awaiting Patient Confirmation': 'AWAITING_PATIENT_CONFIRMATION', 'Scheduled': 'SCHEDULED',
        'Rescheduled': 'RESCHEDULED', 'Technician Assigned': 'TECHNICIAN_ASSIGNED',
        'Technician Accepted': 'TECHNICIAN_ACCEPTED', 'Technician Declined': 'TECHNICIAN_DECLINED',
        'Technician Reassigned': 'TECHNICIAN_REASSIGNED', 'Awaiting Departure': 'AWAITING_DEPARTURE',
        'No Movement Detected': 'NO_MOVEMENT_DETECTED', 'En Route': 'TECHNICIAN_EN_ROUTE',
        'Technician En Route': 'TECHNICIAN_EN_ROUTE', 'Technician Delayed': 'TECHNICIAN_DELAYED',
        'Arrived': 'ARRIVED', 'Patient Not Ready': 'PATIENT_NOT_READY', 'Patient Not Home': 'PATIENT_NOT_HOME',
        'Address Issue': 'ADDRESS_ISSUE', 'Access Issue': 'ACCESS_ISSUE', 'Imaging In Progress': 'IMAGING_IN_PROGRESS',
        'Imaging Completed': 'IMAGING_COMPLETED', 'Patient Refused Exam': 'PATIENT_REFUSED_EXAM',
        'Equipment Issue': 'EQUIPMENT_ISSUE', 'Safety Concern': 'SAFETY_CONCERN', 'Unable to Complete Exam': 'UNABLE_TO_COMPLETE_EXAM',
        'Completed': 'VISIT_COMPLETED_SUCCESSFULLY', 'Visit Completed Successfully': 'VISIT_COMPLETED_SUCCESSFULLY',
        'Visit Failed': 'VISIT_FAILED', 'Visit Cancelled by Patient': 'VISIT_CANCELLED_PATIENT', 'Visit Cancelled — Safety': 'VISIT_CANCELLED_SAFETY'
    };

    const stateKey = STATE_TO_KEY_MAP[o.state];
    const config = window.ORDER_FLOW_CONFIG?.[stateKey];

    if (!config || !config.next_steps || config.next_steps.length === 0) {
        container.innerHTML = '<div class="sub-step-item" style="opacity:0.5; cursor:default;">No further steps</div>';
        container.classList.add('active');
        return;
    }

    container.classList.toggle('active');
    container.innerHTML = config.next_steps.slice(0, 3).map(s => `
        <div class="sub-step-item" onclick="window.UI_DETAIL.handleOrderAction('${o.id}', ${JSON.stringify(s).replace(/"/g, '&quot;')})" style="color: var(--blue); border-color: rgba(32, 107, 196, 0.3);">
            <span>${s.label}</span>
        </div>`).join('');
}

function showExceptionActions() {
    const o = (window.DETAILED_ORDERS || []).find(x => x.id === window.AppState.selectedId);
    if (!o) return;
    const container = document.getElementById('exceptions-container');
    const nextSteps = document.getElementById('next-steps-container');
    if (nextSteps) nextSteps.classList.remove('active');

    const stateKey = window.UI_DETAIL.STATE_TO_KEY_MAP[o.state];
    const config = window.ORDER_FLOW_CONFIG?.[stateKey];

    if (!config || !config.exceptions || config.exceptions.length === 0) {
        container.innerHTML = '<div class="sub-step-item" style="opacity:0.5; cursor:default;">No common exceptions</div>';
        container.classList.add('active');
        return;
    }

    container.classList.toggle('active');
    // Only show top 3 exceptions
    container.innerHTML = config.exceptions.slice(0, 3).map(s => `
        <div class="sub-step-item" onclick="window.UI_DETAIL.handleOrderAction('${o.id}', ${JSON.stringify(s).replace(/"/g, '&quot;')})" style="border-color: rgba(220, 53, 69, 0.3); color: var(--red);">
            <span>${s.label}</span>
        </div>`).join('');
}

function handleOrderAction(id, action) {
    if (action.state === 'TECHNICIAN_REASSIGNED' || action.label === 'Reassign Technician') {
        window.UI_MODALS.openReassignModal(id);
        return;
    }
    const terminalStates = ['VISIT_COMPLETED_SUCCESSFULLY', 'VISIT_FAILED', 'VISIT_CANCELLED_PATIENT', 'VISIT_CANCELLED_SAFETY'];
    if (terminalStates.includes(action.state)) {
        window.UI_MODALS.showCartoonModal(`Are you sure you want to mark this visit as ${action.label}?`, () => {
            window.STATE_MANAGER.changeOrderState(id, action.label);
        });
        return;
    }
    window.STATE_MANAGER.changeOrderState(id, action.label);
}

function toggleDetailSection(header) {
    const content = header.nextElementSibling; const toggle = header.querySelector('.section-toggle');
    if (content) content.classList.toggle('collapsed'); 
    if (toggle) toggle.classList.toggle('collapsed');
}

window.UI_DETAIL = {
    openDetail,
    closeDetail,
    toggleDetailSection,
    showNextSteps,
    showExceptionActions,
    handleOrderAction,
    STATE_TO_KEY_MAP: {
        'Order Received': 'ORDER_RECEIVED', 'Order Under Review': 'ORDER_UNDER_REVIEW', 'Order Complete': 'ORDER_COMPLETE',
        'Order Incomplete': 'ORDER_INCOMPLETE', 'Insurance Verification Required': 'INSURANCE_VERIFICATION_REQUIRED',
        'Insurance Verified': 'INSURANCE_VERIFIED', 'Authorization Required': 'AUTHORIZATION_REQUIRED',
        'Authorization In Progress': 'AUTHORIZATION_IN_PROGRESS', 'Authorization Approved': 'AUTHORIZATION_APPROVED',
        'Authorization Denied': 'AUTHORIZATION_DENIED', 'Patient Contact Initiated': 'PATIENT_CONTACT_INITIATED',
        'Patient Contacted': 'PATIENT_CONTACTED', 'Patient Unreachable': 'PATIENT_UNREACHABLE',
        'Patient Requested Callback': 'PATIENT_REQUESTED_CALLBACK', 'Patient Declined': 'PATIENT_DECLINED',
        'Patient Confirmed': 'PATIENT_CONFIRMED', 'Scheduling Required': 'SCHEDULING_REQUIRED',
        'Scheduling In Progress': 'SCHEDULING_IN_PROGRESS', 'Time Proposed': 'TIME_PROPOSED',
        'Awaiting Patient Confirmation': 'AWAITING_PATIENT_CONFIRMATION', 'Scheduled': 'SCHEDULED',
        'Rescheduled': 'RESCHEDULED', 'Technician Assigned': 'TECHNICIAN_ASSIGNED',
        'Technician Accepted': 'TECHNICIAN_ACCEPTED', 'Technician Declined': 'TECHNICIAN_DECLINED',
        'Technician Reassigned': 'TECHNICIAN_REASSIGNED', 'Awaiting Departure': 'AWAITING_DEPARTURE',
        'No Movement Detected': 'NO_MOVEMENT_DETECTED', 'En Route': 'TECHNICIAN_EN_ROUTE',
        'Technician En Route': 'TECHNICIAN_EN_ROUTE', 'Technician Delayed': 'TECHNICIAN_DELAYED',
        'Arrived': 'ARRIVED', 'Patient Not Ready': 'PATIENT_NOT_READY', 'Patient Not Home': 'PATIENT_NOT_HOME',
        'Address Issue': 'ADDRESS_ISSUE', 'Access Issue': 'ACCESS_ISSUE', 'Imaging In Progress': 'IMAGING_IN_PROGRESS',
        'Imaging Completed': 'IMAGING_COMPLETED', 'Patient Refused Exam': 'PATIENT_REFUSED_EXAM',
        'Equipment Issue': 'EQUIPMENT_ISSUE', 'Safety Concern': 'SAFETY_CONCERN', 'Unable to Complete Exam': 'UNABLE_TO_COMPLETE_EXAM',
        'Completed': 'VISIT_COMPLETED_SUCCESSFULLY', 'Visit Completed Successfully': 'VISIT_COMPLETED_SUCCESSFULLY',
        'Visit Failed': 'VISIT_FAILED', 'Visit Cancelled by Patient': 'VISIT_CANCELLED_PATIENT', 'Visit Cancelled — Safety': 'VISIT_CANCELLED_SAFETY'
    }
};
