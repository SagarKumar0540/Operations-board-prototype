(function() {
  const now = Date.now();
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0); const todayTimestamp = todayStart.getTime();

  window.SIMPLE_ORDERS = [
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

  window.DETAILED_ORDERS = [
    ...window.SIMPLE_ORDERS,
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

  window.TECHNICIANS = [
    { name: 'Mike T.', load: 2 },
    { name: 'Sam R.', load: 2 },
    { name: 'Tom K.', load: 2 },
    { name: 'John S.', load: 1 }
  ];

  window.ACTIVITIES = [
    { id: 1, type: 'info', msg: 'New patient message from Robert Williams', time: '5 min ago', ts: now - 5 * 60000 },
    { id: 2, type: 'error', msg: 'Technician delay reported for Order #VIS-0002', time: '15 min ago', ts: now - 15 * 60000 },
    { id: 3, type: 'info', msg: 'New patient message from Jennifer Brown', time: '22 min ago', ts: now - 22 * 60000 },
    { id: 4, type: 'success', msg: 'Order #VIS-0004 marked as completed by John S.', time: '45 min ago', ts: now - 45 * 60000 },
    { id: 5, type: 'warning', msg: 'Technician Sam R. reported heavy traffic on route', time: '1 hour ago', ts: now - 60 * 60000 }
  ];
})();
