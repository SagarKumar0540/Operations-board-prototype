      const orderFlowConfig = window.ORDER_FLOW_CONFIG || {};

      const STATE_TO_KEY_MAP = {
        'Order Received': 'ORDER_RECEIVED',
        'Order Under Review': 'ORDER_UNDER_REVIEW',
        'Order Complete': 'ORDER_COMPLETE',
        'Order Incomplete': 'ORDER_INCOMPLETE',
        'Insurance Verification Required': 'INSURANCE_VERIFICATION_REQUIRED',
        'Insurance Verified': 'INSURANCE_VERIFIED',
        'Authorization Required': 'AUTHORIZATION_REQUIRED',
        'Authorization In Progress': 'AUTHORIZATION_IN_PROGRESS',
        'Authorization Approved': 'AUTHORIZATION_APPROVED',
        'Authorization Denied': 'AUTHORIZATION_DENIED',
        'Patient Contact Initiated': 'PATIENT_CONTACT_INITIATED',
        'Patient Contacted': 'PATIENT_CONTACTED',
        'Patient Unreachable': 'PATIENT_UNREACHABLE',
        'Patient Requested Callback': 'PATIENT_REQUESTED_CALLBACK',
        'Patient Declined': 'PATIENT_DECLINED',
        'Patient Confirmed': 'PATIENT_CONFIRMED',
        'Scheduling Required': 'SCHEDULING_REQUIRED',
        'Scheduling In Progress': 'SCHEDULING_IN_PROGRESS',
        'Time Proposed': 'TIME_PROPOSED',
        'Awaiting Patient Confirmation': 'AWAITING_PATIENT_CONFIRMATION',
        'Scheduled': 'SCHEDULED',
        'Rescheduled': 'RESCHEDULED',
        'Technician Assigned': 'TECHNICIAN_ASSIGNED',
        'Technician Accepted': 'TECHNICIAN_ACCEPTED',
        'Technician Declined': 'TECHNICIAN_DECLINED',
        'Technician Reassigned': 'TECHNICIAN_REASSIGNED',
        'Awaiting Departure': 'AWAITING_DEPARTURE',
        'No Movement Detected': 'NO_MOVEMENT_DETECTED',
        'En Route': 'TECHNICIAN_EN_ROUTE',
        'Technician En Route': 'TECHNICIAN_EN_ROUTE',
        'Technician Delayed': 'TECHNICIAN_DELAYED',
        'Arrived': 'ARRIVED',
        'Patient Not Ready': 'PATIENT_NOT_READY',
        'Patient Not Home': 'PATIENT_NOT_HOME',
        'Address Issue': 'ADDRESS_ISSUE',
        'Access Issue': 'ACCESS_ISSUE',
        'Imaging In Progress': 'IMAGING_IN_PROGRESS',
        'Imaging Completed': 'IMAGING_COMPLETED',
        'Patient Refused Exam': 'PATIENT_REFUSED_EXAM',
        'Equipment Issue': 'EQUIPMENT_ISSUE',
        'Safety Concern': 'SAFETY_CONCERN',
        'Unable to Complete Exam': 'UNABLE_TO_COMPLETE_EXAM',
        'Completed': 'VISIT_COMPLETED_SUCCESSFULLY',
        'Visit Completed Successfully': 'VISIT_COMPLETED_SUCCESSFULLY',
        'Visit Failed': 'VISIT_FAILED',
        'Visit Cancelled by Patient': 'VISIT_CANCELLED_PATIENT',
        'Visit Cancelled — Safety': 'VISIT_CANCELLED_SAFETY'
      };

      setInterval(updateLiveTimes, 15000);

      function renderRows() {
        const tbody = document.getElementById('order-tbody'); tbody.innerHTML = '';
        const filtered = getFilteredOrders();
        const selectAll = document.getElementById('select-all');

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

          if (['red', 'yellow', 'blue', 'green'].includes(o.stateClass)) {
            tr.classList.add(`row-state-${o.stateClass}`);
          }

          const isStale = o.updatedMins >= STALE_THRESHOLD && o.stateClass !== 'green';
          if (isStale) tr.classList.add('is-stale');

          const stuckHtml = (o.updatedMins > 30 && o.stateClass !== 'green') ? `<span class="stuck-timer">⏱ ${o.updatedMins}m</span>` : '';
          const staleHtml = isStale ? `<span class="stale-indicator">⏳ STALE</span>` : '';

          const checked = selectedCheckboxes.has(o.id) ? 'checked' : '';
          const checkHtml = `<input type="checkbox" ${checked} onclick="event.stopPropagation(); window.toggleCheckbox('${o.id}', this.checked)" />`;

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
              <span class="state-badge ${stateClass(o.state)}"><span class="state-dot"></span>${o.state}</span>${stuckHtml}${staleHtml}
            </div>
            ${reasonHtml}
          </td>
          <td class="tech-cell">${o.tech}</td>
          <td class="time-cell">${new Date(o.createdTs).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
          <td class="updated-cell ${isStale ? 'stale' : ''}"><span class="rel-time" data-ts="${o.lastUpdateTs}">${o.updated}</span></td>
        `;
          tr.onclick = (e) => { if (e.target.tagName === 'INPUT') return; openDetail(o.id); };
          tbody.appendChild(tr);
        });

        if (selectAll) {
          const ids = filtered.map(o => o.id);
          selectAll.checked = ids.length > 0 && ids.every(id => selectedCheckboxes.has(id));
        }
        updateLiveTimes(); updateBatchBar();
        document.querySelectorAll('thead th').forEach(th => th.classList.remove('sorted', 'desc'));
        if (currentSort.field) {
          const th = document.querySelector(`thead th[data-sort="${currentSort.field}"]`);
          if (th) { th.classList.add('sorted'); if (!currentSort.asc) th.classList.add('desc'); }
        }
        document.getElementById('tech-filter-btn').classList.toggle('active', currentTechFilter !== null);
      }

      window.toggleCheckbox = function (id, checked) {
        if (checked) selectedCheckboxes.add(id); else selectedCheckboxes.delete(id);
        updateBatchBar(); renderRows();
      };
      window.toggleSelectAll = function (cb) {
        const filtered = getFilteredOrders();
        if (cb.checked) filtered.forEach(o => selectedCheckboxes.add(o.id));
        else filtered.forEach(o => selectedCheckboxes.delete(o.id));
        updateBatchBar(); renderRows();
      };
      function updateBatchBar() {
        const bar = document.getElementById('batch-bar');
        const cnt = selectedCheckboxes.size;
        document.getElementById('batch-count').textContent = cnt;
        bar.classList.toggle('active', cnt > 0);
      }
      function clearSelection() { selectedCheckboxes.clear(); updateBatchBar(); renderRows(); }

      window.batchReassign = function () {
        if (selectedCheckboxes.size === 0) return;
        const ids = Array.from(selectedCheckboxes);
        currentReassignOrderId = ids[0];
        selectedTech = orders.find(o => o.id === ids[0]).tech;
        batchReassignIds = ids;
        populateTechList(selectedTech);
        document.getElementById('reassign-modal').classList.add('open');
      };

      window.batchMarkCompleteAsk = function () {
        if (selectedCheckboxes.size === 0) return;
        showCartoonModal(`Mark ${selectedCheckboxes.size} order(s) as completed?`, () => {
          selectedCheckboxes.forEach(id => {
            const o = orders.find(o => o.id === id);
            if (o && o.stateClass !== 'green') {
              o.state = 'Completed'; o.stateClass = 'green';
              o.updated = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              o.updatedMins = 0; o.lastUpdateTs = Date.now();
            }
          });
          showToast(`${selectedCheckboxes.size} order(s) marked as completed.`);
          clearSelection(); renderRows(); updateStats();
          if (selectedId && selectedCheckboxes.has(selectedId)) { selectedId = null; closeDetail(); }
        });
      };

      window.batchAddNote = function () {
        if (selectedCheckboxes.size === 0) return;
        currentReassignOrderId = Array.from(selectedCheckboxes)[0];
        document.getElementById('note-modal').classList.add('open');
        document.getElementById('note-textarea').value = '';
        document.getElementById('note-textarea').focus();
      };

      function openDetail(id) {
        selectedId = id; const o = orders.find(x => x.id === id);
        renderRows();
        
        // Focus Detail: Open Detail Panel, Hide Alert Panel
        document.getElementById('detail-panel').classList.remove('hidden');
        document.getElementById('activity-panel').classList.add('hidden');
        document.getElementById('activity-toggle').classList.remove('active');

        const body = document.getElementById('detail-body');
        const tlHtml = (() => {
          let html = '';
          let doneGroup = [];

          function renderTlItem(t, i, isLastItem) {
            const metaHtml = t.reason ? `<div class="tl-meta">${t.reason}</div>` : '';
            const isFuture = t.status !== 'done' && t.status !== 'active';
            const lineClass = isFuture || t.status === 'active' ? 'future-line' : 'done-line';
            const lineHtml = !isLastItem ? `<div class="tl-line ${lineClass}"></div>` : '';
            return `
              <div class="tl-item">
                <div class="tl-left"><div class="tl-dot ${t.status}"></div>${lineHtml}</div>
                <div class="tl-content">
                  <div class="tl-event ${t.status}">${t.event}</div>
                  <div class="tl-time">${t.time}</div>
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
                const groupHtml = doneGroup.map(g => renderTlItem(g.t, g.i, false)).join('');
                html += `
                  <div class="tl-group-wrapper">
                    <div class="tl-group-toggle" onclick="this.nextElementSibling.classList.toggle('expanded'); this.classList.toggle('expanded')">
                      <div class="tl-left"><div class="tl-dot group-dot">✓</div><div class="tl-line done-line"></div></div>
                      <div class="tl-content"><div class="tl-event done">${doneGroup[0].t.event} & ${doneGroup.length - 1} more steps <span class="expand-icon">▼</span></div></div>
                    </div>
                    <div class="tl-group-content">${groupHtml}</div>
                  </div>
                `;
                doneGroup = [];
              }
            } else {
              if (doneGroup.length > 0) {
                doneGroup.forEach(g => { html += renderTlItem(g.t, g.i, false); });
                doneGroup = [];
              }
              html += renderTlItem(t, i, isLast);
            }
          }
          return html;
        })();

        const slaMinutes = o.priority === 'urgent' ? 60 : o.priority === 'high' ? 120 : 240;
        const slaRemaining = slaMinutes - o.updatedMins;
        const slaPercent = Math.max(0, Math.round((slaRemaining / slaMinutes) * 100));
        const slaClass = slaRemaining < 15 ? 'critical' : slaRemaining < 30 ? 'warning' : '';
        const completionPercent = Math.round((o.timeline.filter(t => t.status === 'done').length / o.timeline.length) * 100);
        const remainingSteps = o.timeline.filter(t => t.status !== 'done').length;
        const riskLevel = o.priority === 'urgent' ? 'high' : o.priority === 'high' ? 'medium' : 'low';
        const riskIcon = riskLevel === 'high' ? '⚠' : riskLevel === 'medium' ? '!' : '✓';
        const distance = Math.floor(Math.random() * 15) + 2; const eta = Math.floor(distance * 2.5);
        const nextSteps = [];
        if (o.stateClass === 'gray') nextSteps.push('Assign technician');
        if (o.stateClass === 'blue' && o.updatedMins > 5) nextSteps.push('Check technician location');
        if (o.updatedMins >= STALE_THRESHOLD && o.stateClass !== 'green') nextSteps.push('Escalate due to staleness');
        if (o.stateClass === 'yellow') nextSteps.push('Prepare for departure');
        if (o.stateClass === 'red') nextSteps.push('Escalate to supervisor');
        if (o.stateClass === 'green') nextSteps.push('Archive order');
        if (nextSteps.length === 0) nextSteps.push('Monitor progress');

        const isStaleDetail = o.updatedMins >= STALE_THRESHOLD && o.stateClass !== 'green';
        const stalenessWarning = isStaleDetail ? `
          <div style="background:var(--orange-bg); border:1px solid var(--orange); padding:10px; border-radius:4px; margin-bottom:12px; display:flex; gap:10px; align-items:center;">
            <div style="font-size:20px;">⏳</div>
            <div>
              <div style="font-weight:600; color:var(--orange); font-size:12px; text-transform:uppercase;">Information Staleness Risk</div>
              <div style="font-size:11px; color:var(--text-dim);">No update for ${o.updatedMins}m. High operational uncertainty. Recommend contacting technician.</div>
            </div>
          </div>
        ` : '';

        window.handleOrderAction = function(id, action) {
          if (action.state === 'TECHNICIAN_REASSIGNED' || action.label === 'Reassign Technician') {
            openReassignModal(id);
            return;
          }

          const terminalStates = ['VISIT_COMPLETED_SUCCESSFULLY', 'VISIT_FAILED', 'VISIT_CANCELLED_PATIENT', 'VISIT_CANCELLED_SAFETY'];
          if (terminalStates.includes(action.state)) {
            showCartoonModal(`Are you sure you want to mark this visit as ${action.label}?`, () => {
              changeOrderState(id, action.label);
            });
            return;
          }

          changeOrderState(id, action.label);
        };

        window.showNextSteps = function() {
          const container = document.getElementById('next-steps-container');
          const other = document.getElementById('exceptions-container');
          if (other) other.classList.remove('active');
          
          const o = orders.find(x => x.id === selectedId);
          const stateKey = STATE_TO_KEY_MAP[o.state];
          const config = orderFlowConfig[stateKey];

          if (!config || !config.next_steps || config.next_steps.length === 0) {
            container.innerHTML = '<div class="sub-step-item" style="opacity:0.5; cursor:default;">No further steps</div>';
            container.classList.add('active');
            return;
          }

          container.classList.toggle('active');
          // Only show top 3 next steps
          container.innerHTML = config.next_steps.slice(0, 3).map(s => `
            <div class="sub-step-item" onclick="handleOrderAction('${o.id}', ${JSON.stringify(s).replace(/"/g, '&quot;')})" style="color: var(--blue); border-color: rgba(32, 107, 196, 0.3);">
              <span>${s.label}</span>
            </div>
          `).join('');
        };

        window.showExceptionActions = function() {
          const container = document.getElementById('exceptions-container');
          const other = document.getElementById('next-steps-container');
          if (other) other.classList.remove('active');

          const o = orders.find(x => x.id === selectedId);
          const stateKey = STATE_TO_KEY_MAP[o.state];
          const config = orderFlowConfig[stateKey];

          if (!config || !config.exceptions || config.exceptions.length === 0) {
            container.innerHTML = '<div class="sub-step-item" style="opacity:0.5; cursor:default;">No common exceptions</div>';
            container.classList.add('active');
            return;
          }

          container.classList.toggle('active');
          // Only show top 3 exceptions
          container.innerHTML = config.exceptions.slice(0, 3).map(s => `
            <div class="sub-step-item" onclick="handleOrderAction('${o.id}', ${JSON.stringify(s).replace(/"/g, '&quot;')})" style="border-color: rgba(220, 53, 69, 0.3); color: var(--red);">
              <span>${s.label}</span>
            </div>
          `).join('');
        };

        const actionsHtml = `
          <div class="action-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <button class="action-btn primary" onclick="showNextSteps()">Next Step</button>
            <button class="action-btn warn" onclick="showExceptionActions()">Exceptions</button>
          </div>
          <div id="next-steps-container" class="action-sub-steps"></div>
          <div id="exceptions-container" class="action-sub-steps"></div>
          <div style="height: 1px; background: var(--border2); margin: 12px 0;"></div>
          <button class="action-btn" style="width: 100%; border: 1px dashed var(--blue); color: var(--blue); opacity: 0.9;" onclick="openNoteModal('${o.id}')">Add Notes</button>
        `;

        body.innerHTML = `
        <div class="detail-section">
          <div class="section-header" onclick="toggleDetailSection(this)">
            <span class="section-label">Actions</span>
            <span class="section-toggle">▼</span>
          </div>
          <div class="section-content">${stalenessWarning}${actionsHtml}</div>
        </div>
        <div class="detail-section">
          <div class="section-header" onclick="toggleDetailSection(this)">
            <span class="section-label">Time & Timeline</span>
            <span class="section-toggle">▼</span>
          </div>
          <div class="section-content"><div class="timeline">${tlHtml}</div></div>
        </div>
        <div class="detail-section">
          <div class="section-header" onclick="toggleDetailSection(this)">
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
          <div class="section-header" onclick="toggleDetailSection(this)">
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
              <div class="detail-field"><label>Current State</label><div class="val"><span class="state-badge ${stateClass(o.state)}" style="font-size:10px"><span class="state-dot"></span>${o.state}</span></div></div>
            </div>
          </div>
        </div>
      `;
        updateLiveTimes();
      }

      window.closeDetail = function () { 
        selectedId = null; 
        document.getElementById('detail-panel').classList.add('hidden'); 
        renderRows(); 
        
        // Restore Alerts: Open Alert Panel
        document.getElementById('activity-panel').classList.remove('hidden');
        document.getElementById('activity-toggle').classList.add('active');
        renderActivities();
      };

      window.toggleDetailSection = function (header) {
        const content = header.nextElementSibling; const toggle = header.querySelector('.section-toggle');
        content.classList.toggle('collapsed'); toggle.classList.toggle('collapsed');
      };


      // Filter handling
      window.setFilter = function (btn, filter) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = filter;
        if (filter !== 'technician') {
          currentTechFilter = null;
          document.getElementById('tech-filter-btn').classList.remove('active');
        }
        if (filter === 'technician') {
          document.getElementById('tech-dropdown').classList.add('active');
        } else {
          document.getElementById('tech-dropdown').classList.remove('active');
        }
        renderRows(); updateStats();
      };

      function populateTechDropdown() {
        const dropdown = document.getElementById('tech-dropdown');
        dropdown.querySelectorAll('.dropdown-item:not(.reset)').forEach(el => el.remove());
        technicians.forEach((t, i) => {
          const item = document.createElement('div');
          const isSelected = currentTechFilter === t.name;
          item.className = 'dropdown-item' + (isSelected ? ' selected' : '');
          item.onclick = () => selectTechFilter(t.name);
          item.innerHTML = `
            <input type="radio" name="tech-filter" id="tech-opt-${i}" ${isSelected ? 'checked' : ''}>
            <span>${t.name}</span>
          `;
          dropdown.insertBefore(item, dropdown.querySelector('.reset'));
        });
      }

      window.toggleTechDropdown = function (e) {
        e.stopPropagation();
        const techDropdown = document.getElementById('tech-dropdown');
        const dateDropdown = document.getElementById('date-dropdown');
        
        dateDropdown.classList.remove('active'); // Exclusive close
        document.getElementById('date-filter-btn').classList.toggle('active', currentDateFilter !== null);

        techDropdown.classList.toggle('active');
        document.getElementById('tech-filter-btn').classList.toggle('active', techDropdown.classList.contains('active') || currentTechFilter !== null);
      };

      window.selectTechFilter = function (techName) {
        currentTechFilter = techName;
        currentFilter = 'technician';
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const btn = document.getElementById('tech-filter-btn');
        btn.classList.add('active');
        btn.innerHTML = `Tech: <strong>${techName}</strong>`;
        document.getElementById('reset-tech-link').classList.remove('hidden');
        
        document.getElementById('tech-dropdown').classList.remove('active');
        
        // Dynamic update instead of repopulate
        const items = document.querySelectorAll('#tech-dropdown .dropdown-item:not(.reset)');
        items.forEach(item => {
          const span = item.querySelector('span');
          const isMatch = (span && span.textContent === techName);
          item.classList.toggle('selected', isMatch);
          const radio = item.querySelector('input[type="radio"]');
          if (radio) radio.checked = isMatch;
        });

        renderRows(); updateStats();
      };

      window.resetTechFilter = function () {
        currentTechFilter = null;
        currentFilter = 'all';
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const btn = document.getElementById('tech-filter-btn');
        btn.classList.remove('active');
        btn.innerHTML = 'Technician';
        document.getElementById('reset-tech-link').classList.add('hidden');
        
        document.querySelector('.filter-btn[onclick*="all"]').classList.add('active');
        document.getElementById('tech-dropdown').classList.remove('active');
        
        const items = document.querySelectorAll('#tech-dropdown .dropdown-item:not(.reset)');
        items.forEach(item => {
          item.classList.remove('selected');
          const radio = item.querySelector('input[type="radio"]');
          if (radio) radio.checked = false;
        });

        renderRows(); updateStats();
      };

      // Date Filter Functions
      window.toggleDateDropdown = function (e) {
        e.stopPropagation();
        const dateDropdown = document.getElementById('date-dropdown');
        const techDropdown = document.getElementById('tech-dropdown');

        techDropdown.classList.remove('active'); // Exclusive close
        document.getElementById('tech-filter-btn').classList.toggle('active', currentTechFilter !== null);

        dateDropdown.classList.toggle('active');
        document.getElementById('date-filter-btn').classList.toggle('active', dateDropdown.classList.contains('active') || currentDateFilter !== null);
      };

      window.setDateFilter = function (val) {
        currentDateFilter = val;
        currentFilter = 'date';
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const btn = document.getElementById('date-filter-btn');
        btn.classList.add('active');
        
        const label = val === 'today' ? 'Today' : val === 'yesterday' ? 'Yesterday' : val;
        btn.innerHTML = `Date: <strong>${label}</strong>`;
        document.getElementById('reset-date-link').classList.remove('hidden');

        document.getElementById('date-dropdown').classList.remove('active');
        
        // Update radio & background state
        const items = document.querySelectorAll('#date-dropdown .dropdown-item');
        items.forEach(item => {
          const radio = item.querySelector('input');
          const isMatch = (radio && radio.id === 'date-' + val);
          item.classList.toggle('selected', isMatch);
          if (radio) radio.checked = isMatch;
        });
        
        renderRows(); updateStats();
      };

      window.resetDateFilter = function () {
        currentDateFilter = null;
        currentFilter = 'all';
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const btn = document.getElementById('date-filter-btn');
        btn.classList.remove('active');
        btn.innerHTML = 'Sort by Date';
        document.getElementById('reset-date-link').classList.add('hidden');

        document.querySelector('.filter-btn[onclick*="all"]').classList.add('active');
        document.getElementById('date-dropdown').classList.remove('active');

        const todayRadio = document.getElementById('date-today');
        const yesterdayRadio = document.getElementById('date-yesterday');
        if (todayRadio) todayRadio.checked = false;
        if (yesterdayRadio) yesterdayRadio.checked = false;

        renderRows(); updateStats();
      };

      // Activity Feed Functions (Now static Real-Time Alerts)
      window.toggleActivityPanel = function () {
        const panel = document.getElementById('activity-panel');
        const toggle = document.getElementById('activity-toggle');
        panel.classList.toggle('hidden');
        toggle.classList.toggle('active');
        if (!panel.classList.contains('hidden')) {
          renderActivities();
        }
      };

      function renderActivities() {
        const container = document.getElementById('activity-list');
        container.innerHTML = activities.map(a => `
          <div class="activity-card" onclick="showToast('Alert: ${a.msg}')">
            <div class="activity-icon ${a.type}">
              ${a.type === 'info' ? 'ℹ' : a.type === 'error' ? '⚠' : a.type === 'success' ? '✓' : a.type === 'warning' ? '!' : '!'}
            </div>
            <div class="activity-content">
              <div class="activity-msg">${a.msg}</div>
              <div class="activity-meta">
                <span class="rel-time" data-ts="${a.ts}">${a.time}</span>
              </div>
            </div>
          </div>
        `).join('');
      }

      function addActivity(type, msg) {
        // Function kept for compatibility but dynamic updates disabled
      }

      /*
      // Mock Live Updates
      setInterval(() => {
        if (Math.random() > 0.7) {
          const types = ['info', 'warning', 'success', 'error'];
          const type = types[Math.floor(Math.random() * types.length)];
          const msgs = [
            'New message from Patient Jane Smith',
            'Order #VIS-0003 technician reported en-route',
            'Clinician updated notes for VIS-0001',
            'System: Backup completed successfully',
            'Alert: High volume of morning orders'
          ];
          addActivity(type, msgs[Math.floor(Math.random() * msgs.length)]);
        }
      }, 10000);
      */

      document.addEventListener('click', function (e) {
        const dropdown = document.getElementById('tech-dropdown');
        const techBtn = document.getElementById('tech-filter-btn');
        if (dropdown && techBtn && !techBtn.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.remove('active');
          techBtn.classList.remove('active');
        }

        const dateDropdown = document.getElementById('date-dropdown');
        const dateBtn = document.getElementById('date-filter-btn');
        if (dateDropdown && dateBtn && !dateBtn.contains(e.target) && !dateDropdown.contains(e.target)) {
          dateDropdown.classList.remove('active');
          if (currentFilter !== 'date') dateBtn.classList.remove('active');
        }
      });

      // Modals
      window.openNoteModal = function (id) {
        currentReassignOrderId = id;
        document.getElementById('note-modal').classList.add('open');
        document.getElementById('note-textarea').value = '';
        document.getElementById('note-textarea').focus();
      };
      window.closeNoteModal = function () { document.getElementById('note-modal').classList.remove('open'); currentReassignOrderId = null; };

      window.saveNote = function () {
        const note = document.getElementById('note-textarea').value.trim();
        if (note && currentReassignOrderId) {
          const order = orders.find(o => o.id === currentReassignOrderId);
          if (order) { order.notes = order.notes ? order.notes + '\n\n' + note : note; openDetail(currentReassignOrderId); showToast('Note saved.'); }
        }
        closeNoteModal();
      };

      function populateTechList(selected) {
        const container = document.getElementById('tech-list');
        container.innerHTML = technicians.map(t => `
        <div class="reassign-option ${t.name === selected ? 'selected' : ''}" onclick="selectTech('${t.name}')">
          <div class="reassign-tech-info">
            <span class="reassign-tech-name">${t.name}</span>
            <span class="reassign-tech-status">${t.load} active</span>
          </div>
          ${t.name === selected ? '<span class="reassign-check">✓</span>' : ''}
        </div>
      `).join('');
      }

      window.openReassignModal = function (id) {
        currentReassignOrderId = id; const o = orders.find(o => o.id === id);
        selectedTech = o.tech; batchReassignIds = null;
        populateTechList(selectedTech);
        document.getElementById('reassign-modal').classList.add('open');
      };
      window.closeReassignModal = function () { document.getElementById('reassign-modal').classList.remove('open'); currentReassignOrderId = null; selectedTech = null; };

      window.selectTech = function (name) {
        selectedTech = name;
        document.querySelectorAll('.reassign-option').forEach(opt => opt.classList.toggle('selected', opt.querySelector('span').textContent === name));
      };

      window.confirmReassign = function () {
        if (selectedTech) {
          const ids = batchReassignIds || [currentReassignOrderId];
          ids.forEach(id => { const o = orders.find(o => o.id === id); if (o) o.tech = selectedTech; });
          renderRows(); updateStats(); if (selectedId && ids.includes(selectedId)) openDetail(selectedId);
          showToast(`Reassigned ${ids.length} order(s) to ${selectedTech}.`); if (batchReassignIds) clearSelection();
        }
        closeReassignModal();
      };

      window.showCartoonModal = function (msg, onConfirm) {
        document.getElementById('cartoon-message').textContent = msg;
        document.getElementById('cartoon-yes').onclick = () => { closeCartoonModal(); onConfirm(); };
        document.getElementById('cartoon-modal').classList.add('open');
      };
      window.closeCartoonModal = function () { document.getElementById('cartoon-modal').classList.remove('open'); };

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          if (document.getElementById('note-modal').classList.contains('open')) closeNoteModal();
          else if (document.getElementById('reassign-modal').classList.contains('open')) closeReassignModal();
          else if (document.getElementById('cartoon-modal').classList.contains('open')) closeCartoonModal();
          else if (!document.getElementById('detail-panel').classList.contains('hidden')) closeDetail();
        }
        if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); document.getElementById('search-input').focus(); }
        if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { alert('Shortcuts: / Search, ESC Close, ↑↓ Navigate'); }
      });

      document.getElementById('table-wrap').addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); updateKeyboardSelection(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); updateKeyboardSelection(-1); }
        else if (e.key === 'Enter') { const sel = document.querySelector('#order-tbody tr.selected'); if (sel) sel.click(); }
      });

      let keyboardRowIndex = -1;
      function updateKeyboardSelection(delta) {
        const rows = document.querySelectorAll('#order-tbody tr');
        if (!rows.length) return;
        keyboardRowIndex = Math.min(Math.max(keyboardRowIndex + delta, 0), rows.length - 1);
        rows.forEach(r => r.classList.remove('selected'));
        const newRow = rows[keyboardRowIndex]; newRow.classList.add('selected'); newRow.scrollIntoView({ block: 'nearest' });
        const idEl = newRow.querySelector('.visit-id'); if (idEl) openDetail(idEl.textContent);
      }

      document.querySelectorAll('thead th[data-sort]').forEach(th => {
        th.addEventListener('click', function () { toggleSort(this.dataset.sort, true); });
      });

      document.getElementById('note-modal').addEventListener('click', function (e) { if (e.target === this) closeNoteModal(); });
      document.getElementById('reassign-modal').addEventListener('click', function (e) { if (e.target === this) closeReassignModal(); });
      document.getElementById('cartoon-modal').addEventListener('click', function (e) { if (e.target === this) closeCartoonModal(); });

      // Initialize
      populateTechDropdown();
      renderRows();
      updateStats();
      renderActivities();
      const toggle = document.getElementById('activity-toggle');
      toggle.classList.add('active');

      const initialOrders = getFilteredOrders();
      // Detail panel remains hidden by default.
