      /*
      // Clock
      function updateClock() {
        document.getElementById('clock').textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
      setInterval(updateClock, 1000);
      updateClock();
      */

      const now = Date.now();
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0); const todayTimestamp = todayStart.getTime();

      const SIMPLE_ORDERS = [
        {
          id: 'VIS-0001', patient: 'Jane Smith', state: 'Awaiting Departure', stateClass: 'yellow', tech: 'Sam R.', window: 'Morning', updated: '10:05 AM', updatedMins: 5, alert: false, priority: 'normal', notes: 'Gate code: 1234', lastUpdateTs: now - 5 * 60 * 1000, createdTs: todayTimestamp + 8 * 3600000, timeline: [
            { event: 'Order Received', time: '8:00 AM', status: 'done', reason: 'Order initiated from portal' },
            { event: 'Order Under Review', time: '8:10 AM', status: 'done' },
            { event: 'Order Complete', time: '8:15 AM', status: 'done' },
            { event: 'Insurance Verification Required', time: '8:16 AM', status: 'done' },
            { event: 'Insurance Verified', time: '8:30 AM', status: 'done' },
            { event: 'Patient Contact Initiated', time: '8:35 AM', status: 'done' },
            { event: 'Patient Contacted', time: '8:40 AM', status: 'done' },
            { event: 'Patient Confirmed', time: '8:45 AM', status: 'done' },
            { event: 'Scheduling Required', time: '8:46 AM', status: 'done' },
            { event: 'Scheduling In Progress', time: '8:50 AM', status: 'done' },
            { event: 'Time Proposed', time: '9:00 AM', status: 'done' },
            { event: 'Awaiting Patient Confirmation', time: '9:05 AM', status: 'done' },
            { event: 'Scheduled', time: '9:10 AM', status: 'done' },
            { event: 'Technician Assigned', time: '9:15 AM', status: 'done', reason: 'Assigned to Sam R.' },
            { event: 'Technician Accepted', time: '9:20 AM', status: 'done' },
            { event: 'Awaiting Departure', time: '10:05 AM', status: 'active', reason: 'Technician is preparing vehicle and equipment' }
          ]
        },
        {
          id: 'VIS-0002', patient: 'Alex Brown', state: 'Patient Unreachable', stateClass: 'red', tech: '—', window: 'Afternoon', updated: '9:48 AM', updatedMins: 22, alert: true, priority: 'high', notes: 'Needs afternoon appointment.', lastUpdateTs: now - 22 * 60 * 1000, createdTs: todayTimestamp + 8 * 3600000, timeline: [
            { event: 'Order Received', time: '8:30 AM', status: 'done' },
            { event: 'Order Under Review', time: '8:35 AM', status: 'done' },
            { event: 'Order Complete', time: '8:40 AM', status: 'done' },
            { event: 'Insurance Verification Required', time: '8:41 AM', status: 'done' },
            { event: 'Insurance Verified', time: '8:55 AM', status: 'done' },
            { event: 'Patient Contact Initiated', time: '9:00 AM', status: 'done' },
            { event: 'Patient Unreachable', time: '9:48 AM', status: 'active', reason: 'Exception: NO_ANSWER. Attempted to call patient but voicemail was full.' }
          ]
        },
        {
          id: 'VIS-0003', patient: 'Mike Taylor', state: 'En Route', stateClass: 'blue', tech: 'Mike T.', window: 'Morning', updated: '10:30 AM', updatedMins: 15, alert: false, priority: 'urgent', notes: 'ASAP requested by referring physician.', lastUpdateTs: now - 15 * 60 * 1000, createdTs: todayTimestamp + 7 * 3600000, timeline: [
            { event: 'Order Received', time: '7:00 AM', status: 'done' },
            { event: 'Order Under Review', time: '7:05 AM', status: 'done' },
            { event: 'Order Incomplete', time: '7:10 AM', status: 'done', reason: 'Exception: MISSING_DOCUMENTS. Requested clinical notes.' },
            { event: 'Order Under Review', time: '7:30 AM', status: 'done', reason: 'Documents received.' },
            { event: 'Order Complete', time: '7:35 AM', status: 'done' },
            { event: 'Insurance Verification Required', time: '7:36 AM', status: 'done' },
            { event: 'Authorization Required', time: '7:45 AM', status: 'done' },
            { event: 'Authorization In Progress', time: '7:50 AM', status: 'done' },
            { event: 'Authorization Approved', time: '8:30 AM', status: 'done' },
            { event: 'Patient Contact Initiated', time: '8:35 AM', status: 'done' },
            { event: 'Patient Contacted', time: '8:40 AM', status: 'done' },
            { event: 'Patient Confirmed', time: '8:45 AM', status: 'done' },
            { event: 'Scheduling Required', time: '8:46 AM', status: 'done' },
            { event: 'Scheduling In Progress', time: '8:50 AM', status: 'done' },
            { event: 'Time Proposed', time: '8:55 AM', status: 'done' },
            { event: 'Awaiting Patient Confirmation', time: '9:00 AM', status: 'done' },
            { event: 'Scheduled', time: '9:05 AM', status: 'done' },
            { event: 'Technician Assigned', time: '9:10 AM', status: 'done', reason: 'Assigned to Mike T.' },
            { event: 'Technician Accepted', time: '9:15 AM', status: 'done' },
            { event: 'Awaiting Departure', time: '10:00 AM', status: 'done' },
            { event: 'No Movement Detected', time: '10:15 AM', status: 'done', reason: 'Exception: VEHICLE_ISSUE. Flat tire reported.' },
            { event: 'En Route', time: '10:30 AM', status: 'active', reason: 'Tire replaced, currently driving to patient location.' }
          ]
        },
        {
          id: 'VIS-0004', patient: 'Mary Lee', state: 'Completed', stateClass: 'green', tech: 'John S.', window: 'Afternoon', updated: '8:50 AM', updatedMins: 80, alert: false, priority: 'normal', notes: 'Successful completion.', lastUpdateTs: now - 80 * 60 * 1000, createdTs: todayTimestamp + 5 * 3600000, timeline: [
            { event: 'Order Received', time: '5:00 AM', status: 'done' },
            { event: 'Order Under Review', time: '5:10 AM', status: 'done' },
            { event: 'Order Complete', time: '5:15 AM', status: 'done' },
            { event: 'Insurance Verification Required', time: '5:16 AM', status: 'done' },
            { event: 'Insurance Verified', time: '5:30 AM', status: 'done' },
            { event: 'Patient Contact Initiated', time: '5:35 AM', status: 'done' },
            { event: 'Patient Contacted', time: '5:40 AM', status: 'done' },
            { event: 'Patient Confirmed', time: '5:45 AM', status: 'done' },
            { event: 'Scheduling Required', time: '5:46 AM', status: 'done' },
            { event: 'Scheduling In Progress', time: '5:50 AM', status: 'done' },
            { event: 'Time Proposed', time: '6:00 AM', status: 'done' },
            { event: 'Awaiting Patient Confirmation', time: '6:05 AM', status: 'done' },
            { event: 'Scheduled', time: '6:10 AM', status: 'done' },
            { event: 'Technician Assigned', time: '6:15 AM', status: 'done' },
            { event: 'Technician Accepted', time: '6:20 AM', status: 'done' },
            { event: 'Awaiting Departure', time: '6:30 AM', status: 'done' },
            { event: 'En Route', time: '6:45 AM', status: 'done' },
            { event: 'Technician Delayed', time: '7:00 AM', status: 'done', reason: 'Exception: TRAFFIC_DELAY.' },
            { event: 'En Route', time: '7:15 AM', status: 'done' },
            { event: 'Arrived', time: '7:30 AM', status: 'done' },
            { event: 'Patient Not Ready', time: '7:35 AM', status: 'done', reason: 'Exception: PATIENT_EATING.' },
            { event: 'Imaging In Progress', time: '8:00 AM', status: 'done' },
            { event: 'Imaging Completed', time: '8:45 AM', status: 'done' },
            { event: 'Completed', time: '8:50 AM', status: 'done', reason: 'Images uploaded, patient discharge confirmed.' }
          ]
        }
      ];

      const DETAILED_ORDERS = [
        {
          id: 'VIS-0001', patient: 'Jane Smith', state: 'Awaiting Departure', stateClass: 'yellow', tech: 'Sam R.', window: 'Morning', updated: '10:05 AM', updatedMins: 5, alert: false, priority: 'normal', notes: 'Gate code: 1234', lastUpdateTs: now - 5 * 60 * 1000, createdTs: todayTimestamp + 8 * 3600000, timeline: [
            { event: 'Order Received', time: '8:00 AM', status: 'done', reason: 'Initial intake completed via physician portal.' },
            { event: 'Order Under Review', time: '8:10 AM', status: 'done', reason: 'Staff reviewing clinical documentation and ICD-10 codes.' },
            { event: 'Order Complete', time: '8:15 AM', status: 'done', reason: 'All required documents verified and order finalized.' },
            { event: 'Insurance Verification Required', time: '8:16 AM', status: 'done', reason: 'Triggered automated eligibility check.' },
            { event: 'Insurance Verified', time: '8:30 AM', status: 'done', reason: 'Coverage confirmed; co-pay estimated at $20.' },
            { event: 'Patient Contact Initiated', time: '8:35 AM', status: 'done', reason: 'Outreach team started call sequence.' },
            { event: 'Patient Contacted', time: '8:40 AM', status: 'done', reason: 'Spoke with patient; verified address and safety protocols.' },
            { event: 'Patient Confirmed', time: '8:45 AM', status: 'done', reason: 'Patient agreed to the procedure and morning window.' },
            { event: 'Scheduling Required', time: '8:46 AM', status: 'done', reason: 'Routing to dispatch for technician allocation.' },
            { event: 'Scheduling In Progress', time: '8:50 AM', status: 'done', reason: 'Optimizer calculating best route for Morning slot.' },
            { event: 'Time Proposed', time: '9:00 AM', status: 'done', reason: '10:00 AM - 12:00 PM window suggested.' },
            { event: 'Awaiting Patient Confirmation', time: '9:05 AM', status: 'done', reason: 'SMS sent to patient for time approval.' },
            { event: 'Scheduled', time: '9:10 AM', status: 'done', reason: 'Patient confirmed time; technician Sam R. identified.' },
            { event: 'Technician Assigned', time: '9:15 AM', status: 'done', reason: 'Order dispatched to Sam R.\'s mobile app.' },
            { event: 'Technician Accepted', time: '9:20 AM', status: 'done', reason: 'Technician acknowledged the assignment and travel time.' },
            { event: 'Awaiting Departure', time: '10:05 AM', status: 'active', reason: 'Technician performing pre-trip vehicle safety check.' }
          ]
        },
        {
          id: 'VIS-0002', patient: 'Alex Brown', state: 'Patient Unreachable', stateClass: 'red', tech: '—', window: 'Afternoon', updated: '9:48 AM', updatedMins: 22, alert: true, priority: 'high', notes: 'Needs afternoon appointment.', lastUpdateTs: now - 22 * 60 * 1000, createdTs: todayTimestamp + 8 * 3600000, timeline: [
            { event: 'Order Received', time: '8:30 AM', status: 'done', reason: 'New referral received via fax.' },
            { event: 'Order Under Review', time: '8:35 AM', status: 'done', reason: 'Verifying patient demographics and insurance info.' },
            { event: 'Order Complete', time: '8:40 AM', status: 'done', reason: 'Review finished; order ready for contact phase.' },
            { event: 'Insurance Verification Required', time: '8:41 AM', status: 'done', reason: 'Manual verification initiated with Payer.' },
            { event: 'Insurance Verified', time: '8:55 AM', status: 'done', reason: 'Payer confirmed active status for outpatient services.' },
            { event: 'Patient Contact Initiated', time: '9:00 AM', status: 'done', reason: 'First call attempt initiated.' },
            { event: 'Patient Unreachable', time: '9:48 AM', status: 'active', reason: 'Exception: NO_ANSWER. Voicemail is full; sent SMS and email follow-up.' }
          ]
        },
        {
          id: 'VIS-0003', patient: 'Mike Taylor', state: 'En Route', stateClass: 'blue', tech: 'Mike T.', window: 'Morning', updated: '10:30 AM', updatedMins: 15, alert: false, priority: 'urgent', notes: 'ASAP requested by referring physician.', lastUpdateTs: now - 15 * 60 * 1000, createdTs: todayTimestamp + 7 * 3600000, timeline: [
            { event: 'Order Received', time: '7:00 AM', status: 'done', reason: 'Emergency referral received; marked as Priority 1.' },
            { event: 'Order Under Review', time: '7:05 AM', status: 'done', reason: 'Fast-track review by senior coordinator.' },
            { event: 'Order Incomplete', time: '7:10 AM', status: 'done', reason: 'Exception: MISSING_DOCUMENTS. Physician signature missing on Rx.' },
            { event: 'Order Under Review', time: '7:30 AM', status: 'done', reason: 'Signature received; resuming review process.' },
            { event: 'Order Complete', time: '7:35 AM', status: 'done', reason: 'Order fully validated for urgent dispatch.' },
            { event: 'Insurance Verification Required', time: '7:36 AM', status: 'done', reason: 'Automated verification successful.' },
            { event: 'Authorization Required', time: '7:45 AM', status: 'done', reason: 'Payer requires prior auth for high-complexity imaging.' },
            { event: 'Authorization In Progress', time: '7:50 AM', status: 'done', reason: 'Auth request submitted to clinical review team.' },
            { event: 'Authorization Approved', time: '8:30 AM', status: 'done', reason: 'Prior auth #88219-X granted by payer.' },
            { event: 'Patient Contact Initiated', time: '8:35 AM', status: 'done', reason: 'Urgent contact attempt started.' },
            { event: 'Patient Contacted', time: '8:40 AM', status: 'done', reason: 'Spoke with caregiver; confirmed access details.' },
            { event: 'Patient Confirmed', time: '8:45 AM', status: 'done', reason: 'Procedure confirmed for immediate dispatch.' },
            { event: 'Scheduling Required', time: '8:46 AM', status: 'done', reason: 'Prioritizing in current day\'s queue.' },
            { event: 'Scheduling In Progress', time: '8:50 AM', status: 'done', reason: 'Re-routing Mike T. for emergency pickup.' },
            { event: 'Time Proposed', time: '8:55 AM', status: 'done', reason: 'Arrival estimated within 90 minutes.' },
            { event: 'Awaiting Patient Confirmation', time: '9:00 AM', status: 'done', reason: 'Verbal confirmation received over phone.' },
            { event: 'Scheduled', time: '9:05 AM', status: 'done', reason: 'Slot locked in for technician Mike T.' },
            { event: 'Technician Assigned', time: '9:10 AM', status: 'done', reason: 'Urgent alert sent to technician device.' },
            { event: 'Technician Accepted', time: '9:15 AM', status: 'done', reason: 'Technician diverted from non-urgent route.' },
            { event: 'Awaiting Departure', time: '10:00 AM', status: 'done', reason: 'Technician loading specialized equipment.' },
            { event: 'No Movement Detected', time: '10:15 AM', status: 'done', reason: 'Exception: VEHICLE_ISSUE. Flat tire detected during prep.' },
            { event: 'En Route', time: '10:30 AM', status: 'active', reason: 'Tire replaced; technician now traveling to patient.' }
          ]
        },
        {
          id: 'VIS-0004', patient: 'Mary Lee', state: 'Completed', stateClass: 'green', tech: 'John S.', window: 'Afternoon', updated: '8:50 AM', updatedMins: 80, alert: false, priority: 'normal', notes: 'Successful completion.', lastUpdateTs: now - 80 * 60 * 1000, createdTs: todayTimestamp + 5 * 3600000, timeline: [
            { event: 'Order Received', time: '5:00 AM', status: 'done', reason: 'Routine order received from community clinic.' },
            { event: 'Order Under Review', time: '5:10 AM', status: 'done', reason: 'Reviewing for procedural compatibility.' },
            { event: 'Order Complete', time: '5:15 AM', status: 'done', reason: 'Clinical review passed.' },
            { event: 'Insurance Verification Required', time: '5:16 AM', status: 'done', reason: 'Eligibility check completed.' },
            { event: 'Insurance Verified', time: '5:30 AM', status: 'done', reason: 'Verified; no prior auth required.' },
            { event: 'Patient Contact Initiated', time: '5:35 AM', status: 'done', reason: 'Outreach started.' },
            { event: 'Patient Contacted', time: '5:40 AM', status: 'done', reason: 'Patient contacted via phone.' },
            { event: 'Patient Confirmed', time: '5:45 AM', status: 'done', reason: 'Patient confirmed afternoon availability.' },
            { event: 'Scheduling Required', time: '5:46 AM', status: 'done', reason: 'Added to afternoon dispatch block.' },
            { event: 'Scheduling In Progress', time: '5:50 AM', status: 'done', reason: 'Scheduling with John S.' },
            { event: 'Time Proposed', time: '6:00 AM', status: 'done', reason: '2:00 PM window proposed.' },
            { event: 'Awaiting Patient Confirmation', time: '6:05 AM', status: 'done', reason: 'Confirmed via patient portal.' },
            { event: 'Scheduled', time: '6:10 AM', status: 'done', reason: 'Locked in schedule.' },
            { event: 'Technician Assigned', time: '6:15 AM', status: 'done', reason: 'Dispatched to John S.' },
            { event: 'Technician Accepted', time: '6:20 AM', status: 'done', reason: 'Accepted by technician.' },
            { event: 'Awaiting Departure', time: '6:30 AM', status: 'done', reason: 'Departure prep completed.' },
            { event: 'En Route', time: '6:45 AM', status: 'done', reason: 'Technician left depot.' },
            { event: 'Technician Delayed', time: '7:00 AM', status: 'done', reason: 'Exception: TRAFFIC_DELAY. Significant congestion on Main St.' },
            { event: 'En Route', time: '7:15 AM', status: 'done', reason: 'Traffic cleared; resuming travel.' },
            { event: 'Arrived', time: '7:30 AM', status: 'done', reason: 'Technician arrived at patient residence.' },
            { event: 'Patient Not Ready', time: '7:35 AM', status: 'done', reason: 'Exception: PATIENT_EATING. Technician waiting 15 mins.' },
            { event: 'Imaging In Progress', time: '8:00 AM', status: 'done', reason: 'Procedure started; patient positioned.' },
            { event: 'Imaging Completed', time: '8:45 AM', status: 'done', reason: 'All views captured and quality checked.' },
            { event: 'Completed', time: '8:50 AM', status: 'done', reason: 'Final report signed off; visit marked successful.' }
          ]
        },
        {
          id: 'VIS-0005', patient: 'Robert Wilson', state: 'Technician Assigned', stateClass: 'blue', tech: 'Tom K.', window: 'Morning', updated: 'Just now', updatedMins: 5, alert: false, priority: 'normal', notes: 'Patient requires extra assistance.', lastUpdateTs: now - 5 * 60 * 1000, createdTs: todayTimestamp + 6 * 3600000, timeline: [
            { event: 'Order Received', time: '6:00 AM', status: 'done', reason: 'Routine order.' },
            { event: 'Order Under Review', time: '6:10 AM', status: 'done' },
            { event: 'Order Complete', time: '6:15 AM', status: 'done' },
            { event: 'Insurance Verified', time: '6:30 AM', status: 'done' },
            { event: 'Patient Contacted', time: '7:00 AM', status: 'done' },
            { event: 'Scheduled', time: '7:30 AM', status: 'done' },
            { event: 'Technician Assigned', time: '9:00 AM', status: 'active', reason: 'Assigned to Tom K. No movement since assignment.' }
          ]
        }
      ];

      const orders = DETAILED_ORDERS;

      const technicians = [
        { name: 'Mike T.', load: 2 },
        { name: 'Sam R.', load: 2 },
        { name: 'Tom K.', load: 2 },
        { name: 'John S.', load: 1 }
      ];

      const STALE_THRESHOLD = 60; // Minutes

      let selectedId = null;
      let currentFilter = 'all';
      let currentTechFilter = null;
      let currentSort = { field: null, asc: true };
      let searchQuery = '';
      let selectedTech = null;
      let currentDateFilter = null; // 'today', 'yesterday' or 'YYYY-MM-DD'
      let currentReassignOrderId = null;
      let selectedCheckboxes = new Set();
      let activities = [
        { id: 1, type: 'info', msg: 'New patient message from Robert Williams', time: '5 min ago', ts: now - 5 * 60000 },
        { id: 2, type: 'error', msg: 'Technician delay reported for Order #VIS-0002', time: '15 min ago', ts: now - 15 * 60000 },
        { id: 3, type: 'info', msg: 'New patient message from Jennifer Brown', time: '22 min ago', ts: now - 22 * 60000 },
        { id: 4, type: 'success', msg: 'Order #VIS-0004 marked as completed by John S.', time: '45 min ago', ts: now - 45 * 60000 },
        { id: 5, type: 'warning', msg: 'Technician Sam R. reported heavy traffic on route', time: '1 hour ago', ts: now - 60 * 60000 }
      ];
      let batchReassignIds = null;

      const stateOptions = ['Order Received', 'Order Ready', 'Patient Confirmed', 'Scheduled', 'Technician Assigned', 'Awaiting Departure', 'En Route', 'Arrived', 'Completed', 'Patient Unreachable', 'Cancelled'];

      function stateClass(state) {
        const m = { 'Order Received': 'gray', 'Order Ready': 'blue', 'Patient Confirmed': 'blue', 'Scheduled': 'gray', 'Technician Assigned': 'blue', 'Awaiting Departure': 'yellow', 'En Route': 'blue', 'Arrived': 'green', 'Completed': 'green', 'Patient Unreachable': 'red', 'Cancelled': 'red' };
        return 'state-' + (m[state] || 'gray');
      }
      function getStateClass(state) { return stateClass(state).replace('state-', ''); }

      function updateStats() {
        const filtered = getFilteredOrders();
        const attention = filtered.filter(o => 
          o.priority === 'urgent' || 
          (o.updatedMins > 30 && o.stateClass !== 'green') ||
          (o.updatedMins >= STALE_THRESHOLD && o.stateClass !== 'green')
        ).length;
        const active = filtered.filter(o => ['blue', 'yellow'].includes(o.stateClass)).length;
        
        const urgentEl = document.getElementById('stat-urgent');
        const activeEl = document.getElementById('stat-active');
        
        if (urgentEl) urgentEl.textContent = attention;
        if (activeEl) activeEl.textContent = active;

        // Update pills if they exist
        const pillDelayed = document.getElementById('pill-delayed');
        if (pillDelayed) {
          const delayedCount = filtered.filter(o => o.updatedMins > 30 && o.stateClass !== 'green').length;
          pillDelayed.textContent = `${delayedCount} Delayed`;
        }
      }

      function getFilteredOrders() {
        let filtered = orders;
        if (currentFilter === 'delayed') {
          filtered = filtered.filter(o => o.updatedMins > 30 && o.stateClass !== 'green');
        } else if (currentFilter === 'stale') {
          filtered = filtered.filter(o => o.updatedMins >= STALE_THRESHOLD && o.stateClass !== 'green');
        } else if (currentFilter === 'technician' && currentTechFilter) {
          filtered = filtered.filter(o => o.tech === currentTechFilter);
        } else if (currentFilter === 'today') {
          filtered = filtered.filter(o => o.createdTs >= todayTimestamp && o.createdTs < todayTimestamp + 86400000);
        } else if (currentFilter === 'date' && currentDateFilter) {
          if (currentDateFilter === 'today') {
            filtered = filtered.filter(o => o.createdTs >= todayTimestamp && o.createdTs < todayTimestamp + 86400000);
          } else if (currentDateFilter === 'yesterday') {
            const yStart = todayTimestamp - 86400000;
            filtered = filtered.filter(o => o.createdTs >= yStart && o.createdTs < todayTimestamp);
          } else {
            const selDate = new Date(currentDateFilter);
            selDate.setHours(0, 0, 0, 0);
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
          const field = currentSort.field; const asc = currentSort.asc;
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

      window.handleSearch = function () { searchQuery = document.getElementById('search-input').value; renderRows(); updateStats(); };

      window.toggleSort = function (field, fromHeader) {
        if (currentSort.field === field) {
          if (currentSort.asc) currentSort.asc = false; else { currentSort.field = null; currentSort.asc = true; }
        } else { currentSort.field = field; currentSort.asc = true; }
        document.querySelectorAll('thead th').forEach(th => th.classList.remove('sorted', 'desc'));
        if (currentSort.field) {
          const th = document.querySelector(`thead th[data-sort="${currentSort.field}"]`);
          if (th) { th.classList.add('sorted'); if (!currentSort.asc) th.classList.add('desc'); }
        }
        renderRows();
      };

      function showToast(msg, dur = 3000) {
        const c = document.getElementById('toast-container');
        const t = document.createElement('div'); t.className = 'toast';
        t.innerHTML = `<span>${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">✕</button>`;
        c.appendChild(t);
        if (dur > 0) setTimeout(() => { if (t.parentNode) t.remove(); }, dur);
      }

      window.changeOrderState = function (id, newState) {
        const o = orders.find(o => o.id === id);
        if (o && o.state !== newState) {
          o.state = newState; o.stateClass = getStateClass(newState);
          o.updated = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          o.updatedMins = 0; o.lastUpdateTs = Date.now();
          renderRows(); updateStats(); if (selectedId === id) openDetail(id);
          showToast(`State changed to "${newState}" for ${o.patient}.`);
        }
      };

      function updateLiveTimes() {
        const nowTs = Date.now();
        document.querySelectorAll('.live-age').forEach(el => { const ts = parseInt(el.dataset.ts); if (ts) el.textContent = Math.floor((nowTs - ts) / 60000) + 'm'; });
        document.querySelectorAll('.rel-time').forEach(el => { const ts = parseInt(el.dataset.ts); if (ts) { const d = Math.floor((nowTs - ts) / 60000); if (d < 1) el.textContent = 'Just now'; else if (d === 1) el.textContent = '1 min ago'; else el.textContent = `${d} mins ago`; } });
      }
