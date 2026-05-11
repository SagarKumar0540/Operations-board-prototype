(function() {
  const now = Date.now();
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0); const todayTimestamp = todayStart.getTime();

  window.SIMPLE_ORDERS = [
    {
      id: 'VIS-0001', patient: 'Jane Smith', state: 'Awaiting Departure', stateClass: 'yellow', tech: 'Sam R.', window: 'Morning', updated: 'Just now', updatedMins: 5, alert: false, priority: 'normal', lastUpdateTs: now - 5 * 60 * 1000, createdTs: todayTimestamp + 8 * 3600000, timeline: [
        { event: 'Order Received', time: '8:00 AM', status: 'done' },
        { event: 'Scheduled', time: '9:10 AM', status: 'done' },
        { event: 'Technician Assigned', time: '9:15 AM', status: 'done', reason: 'Assigned to Sam R.' },
        { event: 'Awaiting Departure', time: '10:45 AM', status: 'active', reason: 'Technician is preparing vehicle and equipment' }
      ]
    },
    {
      id: 'VIS-0002', patient: 'Alex Brown', state: 'Patient Unreachable', stateClass: 'red', tech: '—', window: 'Afternoon', updated: '1 hour ago', updatedMins: 72, alert: true, priority: 'high', lastUpdateTs: now - 72 * 60 * 1000, createdTs: todayTimestamp + 8 * 3600000, timeline: [
        { event: 'Order Received', time: '8:30 AM', status: 'done' },
        { event: 'Patient Contact Initiated', time: '9:00 AM', status: 'done' },
        { event: 'Patient Unreachable', time: '9:38 AM', status: 'active', reason: 'Exception: NO_ANSWER. Attempted to call patient 3 times; voicemail box is full.' }
      ]
    },
    {
      id: 'VIS-0003', patient: 'Mike Taylor', state: 'En Route', stateClass: 'blue', tech: 'Mike T.', window: 'Morning', updated: '15 min ago', updatedMins: 15, alert: false, priority: 'urgent', lastUpdateTs: now - 15 * 60 * 1000, createdTs: todayTimestamp + 7 * 3600000, timeline: [
        { event: 'Order Received', time: '7:00 AM', status: 'done' },
        { event: 'Scheduled', time: '9:05 AM', status: 'done' },
        { event: 'Awaiting Departure', time: '10:00 AM', status: 'done' },
        { event: 'En Route', time: '10:35 AM', status: 'active', reason: 'On track for 11:00 AM arrival.' }
      ]
    },
    {
      id: 'VIS-0004', patient: 'Mary Lee', state: 'Completed', stateClass: 'green', tech: 'John S.', window: 'Afternoon', updated: '2 hours ago', updatedMins: 120, alert: false, priority: 'normal', lastUpdateTs: now - 120 * 60 * 1000, createdTs: todayTimestamp + 5 * 3600000, timeline: [
        { event: 'Arrived', time: '7:30 AM', status: 'done' },
        { event: 'Imaging Completed', time: '8:15 AM', status: 'done' },
        { event: 'Completed', time: '8:30 AM', status: 'done', reason: 'All images uploaded and verified.' }
      ]
    }
  ];

  window.DETAILED_ORDERS = [
    ...window.SIMPLE_ORDERS,
    {
      id: 'VIS-0005', patient: 'Robert Wilson', state: 'Delayed', stateClass: 'red', tech: 'Tom K.', window: 'Morning', updated: '45 min ago', updatedMins: 45, alert: true, priority: 'urgent', lastUpdateTs: now - 45 * 60 * 1000, createdTs: todayTimestamp + 6 * 3600000, timeline: [
        { event: 'Scheduled', time: '7:30 AM', status: 'done' },
        { event: 'En Route', time: '9:00 AM', status: 'done' },
        { event: 'Delayed', time: '10:05 AM', status: 'active', reason: 'Exception: VEHICLE_ISSUE. Flat tire reported on highway. Tow truck requested.' }
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
