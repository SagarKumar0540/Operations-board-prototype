window.ORDER_FLOW_CONFIG = {
  "ORDER_RECEIVED": {
    "label": "Order Received",
    "next_steps": [
      { "label": "Order Under Review", "state": "ORDER_UNDER_REVIEW" },
      { "label": "Order Complete", "state": "ORDER_COMPLETE" }
    ],
    "exceptions": [
      { "label": "Order Incomplete", "state": "ORDER_INCOMPLETE" }
    ]
  },
  "ORDER_UNDER_REVIEW": {
    "label": "Order Under Review",
    "next_steps": [
      { "label": "Order Complete", "state": "ORDER_COMPLETE" }
    ],
    "exceptions": [
      { "label": "Order Incomplete", "state": "ORDER_INCOMPLETE" }
    ]
  },
  "ORDER_INCOMPLETE": {
    "label": "Order Incomplete",
    "next_steps": [
      { "label": "Order Under Review", "state": "ORDER_UNDER_REVIEW" }
    ],
    "exceptions": []
  },
  "ORDER_COMPLETE": {
    "label": "Order Complete",
    "next_steps": [
      { "label": "Insurance Verification Required", "state": "INSURANCE_VERIFICATION_REQUIRED" },
      { "label": "Patient Contact Initiated", "state": "PATIENT_CONTACT_INITIATED" }
    ],
    "exceptions": []
  },
  "INSURANCE_VERIFICATION_REQUIRED": {
    "label": "Insurance Verification Required",
    "next_steps": [
      { "label": "Insurance Verified", "state": "INSURANCE_VERIFIED" },
      { "label": "Authorization Required", "state": "AUTHORIZATION_REQUIRED" }
    ],
    "exceptions": []
  },
  "INSURANCE_VERIFIED": {
    "label": "Insurance Verified",
    "next_steps": [
      { "label": "Patient Contact Initiated", "state": "PATIENT_CONTACT_INITIATED" }
    ],
    "exceptions": []
  },
  "AUTHORIZATION_REQUIRED": {
    "label": "Authorization Required",
    "next_steps": [
      { "label": "Authorization In Progress", "state": "AUTHORIZATION_IN_PROGRESS" }
    ],
    "exceptions": []
  },
  "AUTHORIZATION_IN_PROGRESS": {
    "label": "Authorization In Progress",
    "next_steps": [
      { "label": "Authorization Approved", "state": "AUTHORIZATION_APPROVED" }
    ],
    "exceptions": [
      { "label": "Authorization Denied", "state": "AUTHORIZATION_DENIED" }
    ]
  },
  "AUTHORIZATION_APPROVED": {
    "label": "Authorization Approved",
    "next_steps": [
      { "label": "Patient Contact Initiated", "state": "PATIENT_CONTACT_INITIATED" }
    ],
    "exceptions": []
  },
  "AUTHORIZATION_DENIED": {
    "label": "Authorization Denied",
    "next_steps": [
      { "label": "Retry Authorization", "state": "AUTHORIZATION_IN_PROGRESS" }
    ],
    "exceptions": [
      { "label": "Cancel Visit", "state": "VISIT_CANCELLED_PATIENT" }
    ]
  },
  "PATIENT_CONTACT_INITIATED": {
    "label": "Patient Contact Initiated",
    "next_steps": [
      { "label": "Patient Contacted", "state": "PATIENT_CONTACTED" }
    ],
    "exceptions": [
      { "label": "Patient Unreachable", "state": "PATIENT_UNREACHABLE" }
    ]
  },
  "PATIENT_CONTACTED": {
    "label": "Patient Contacted",
    "next_steps": [
      { "label": "Patient Confirmed", "state": "PATIENT_CONFIRMED" }
    ],
    "exceptions": [
      { "label": "Patient Declined", "state": "PATIENT_DECLINED" },
      { "label": "Requested Callback", "state": "PATIENT_REQUESTED_CALLBACK" }
    ]
  },
  "PATIENT_UNREACHABLE": {
    "label": "Patient Unreachable",
    "next_steps": [
      { "label": "Retry Contact", "state": "PATIENT_CONTACT_INITIATED" }
    ],
    "exceptions": [
      { "label": "Requested Callback", "state": "PATIENT_REQUESTED_CALLBACK" }
    ]
  },
  "PATIENT_REQUESTED_CALLBACK": {
    "label": "Patient Requested Callback",
    "next_steps": [
      { "label": "Initiate Callback", "state": "PATIENT_CONTACT_INITIATED" }
    ],
    "exceptions": []
  },
  "PATIENT_DECLINED": {
    "label": "Patient Declined",
    "next_steps": [
      { "label": "Retry Contact", "state": "PATIENT_CONTACT_INITIATED" }
    ],
    "exceptions": [
      { "label": "Cancel Visit", "state": "VISIT_CANCELLED_PATIENT" }
    ]
  },
  "PATIENT_CONFIRMED": {
    "label": "Patient Confirmed",
    "next_steps": [
      { "label": "Scheduling Required", "state": "SCHEDULING_REQUIRED" }
    ],
    "exceptions": []
  },
  "SCHEDULING_REQUIRED": {
    "label": "Scheduling Required",
    "next_steps": [
      { "label": "Start Scheduling", "state": "SCHEDULING_IN_PROGRESS" }
    ],
    "exceptions": []
  },
  "SCHEDULING_IN_PROGRESS": {
    "label": "Scheduling In Progress",
    "next_steps": [
      { "label": "Propose Time", "state": "TIME_PROPOSED" }
    ],
    "exceptions": []
  },
  "TIME_PROPOSED": {
    "label": "Time Proposed",
    "next_steps": [
      { "label": "Awaiting Confirmation", "state": "AWAITING_PATIENT_CONFIRMATION" }
    ],
    "exceptions": []
  },
  "AWAITING_PATIENT_CONFIRMATION": {
    "label": "Awaiting Patient Confirmation",
    "next_steps": [
      { "label": "Confirm Schedule", "state": "SCHEDULED" }
    ],
    "exceptions": [
      { "label": "Patient Declined", "state": "PATIENT_DECLINED" },
      { "label": "Reschedule", "state": "RESCHEDULED" }
    ]
  },
  "SCHEDULED": {
    "label": "Scheduled",
    "next_steps": [
      { "label": "Assign Technician", "state": "TECHNICIAN_ASSIGNED" }
    ],
    "exceptions": [
      { "label": "Reschedule", "state": "RESCHEDULED" }
    ]
  },
  "RESCHEDULED": {
    "label": "Rescheduled",
    "next_steps": [
      { "label": "Awaiting Confirmation", "state": "AWAITING_PATIENT_CONFIRMATION" },
      { "label": "Assign Technician", "state": "TECHNICIAN_ASSIGNED" }
    ],
    "exceptions": []
  },
  "TECHNICIAN_ASSIGNED": {
    "label": "Technician Assigned",
    "next_steps": [
      { "label": "Technician Accepted", "state": "TECHNICIAN_ACCEPTED" },
      { "label": "Awaiting Departure", "state": "AWAITING_DEPARTURE" },
      { "label": "En Route", "state": "TECHNICIAN_EN_ROUTE" },
      { "label": "Arrived", "state": "ARRIVED" }
    ],
    "exceptions": [
      { "label": "Technician Declined", "state": "TECHNICIAN_DECLINED" },
      { "label": "Reassign Technician", "state": "TECHNICIAN_REASSIGNED" }
    ]
  },
  "TECHNICIAN_ACCEPTED": {
    "label": "Technician Accepted",
    "next_steps": [
      { "label": "Awaiting Departure", "state": "AWAITING_DEPARTURE" },
      { "label": "En Route", "state": "TECHNICIAN_EN_ROUTE" },
      { "label": "Arrived", "state": "ARRIVED" }
    ],
    "exceptions": []
  },
  "TECHNICIAN_DECLINED": {
    "label": "Technician Declined",
    "next_steps": [
      { "label": "Reassign Technician", "state": "TECHNICIAN_REASSIGNED" }
    ],
    "exceptions": []
  },
  "TECHNICIAN_REASSIGNED": {
    "label": "Technician Reassigned",
    "next_steps": [
      { "label": "Assign Technician", "state": "TECHNICIAN_ASSIGNED" }
    ],
    "exceptions": []
  },
  "AWAITING_DEPARTURE": {
    "label": "Awaiting Departure",
    "next_steps": [
      { "label": "En Route", "state": "TECHNICIAN_EN_ROUTE" },
      { "label": "Arrived", "state": "ARRIVED" }
    ],
    "exceptions": [
      { "label": "No Movement Detected", "state": "NO_MOVEMENT_DETECTED" }
    ]
  },
  "NO_MOVEMENT_DETECTED": {
    "label": "No Movement Detected",
    "next_steps": [
      { "label": "En Route", "state": "TECHNICIAN_EN_ROUTE" },
      { "label": "Awaiting Departure", "state": "AWAITING_DEPARTURE" }
    ],
    "exceptions": [
      { "label": "Reschedule", "state": "RESCHEDULED" }
    ]
  },
  "TECHNICIAN_EN_ROUTE": {
    "label": "Technician En Route",
    "next_steps": [
      { "label": "Arrived", "state": "ARRIVED" }
    ],
    "exceptions": [
      { "label": "Technician Delayed", "state": "TECHNICIAN_DELAYED" }
    ]
  },
  "TECHNICIAN_DELAYED": {
    "label": "Technician Delayed",
    "next_steps": [
      { "label": "En Route", "state": "TECHNICIAN_EN_ROUTE" }
    ],
    "exceptions": [
      { "label": "Reschedule", "state": "RESCHEDULED" }
    ]
  },
  "ARRIVED": {
    "label": "Arrived",
    "next_steps": [
      { "label": "Start Imaging", "state": "IMAGING_IN_PROGRESS" }
    ],
    "exceptions": [
      { "label": "Patient Not Ready", "state": "PATIENT_NOT_READY" },
      { "label": "Patient Not Home", "state": "PATIENT_NOT_HOME" },
      { "label": "Address Issue", "state": "ADDRESS_ISSUE" },
      { "label": "Access Issue", "state": "ACCESS_ISSUE" }
    ]
  },
  "PATIENT_NOT_READY": {
    "label": "Patient Not Ready",
    "next_steps": [
      { "label": "Start Imaging", "state": "IMAGING_IN_PROGRESS" }
    ],
    "exceptions": [
      { "label": "Reschedule", "state": "RESCHEDULED" }
    ]
  },
  "PATIENT_NOT_HOME": {
    "label": "Patient Not Home",
    "next_steps": [],
    "exceptions": [
      { "label": "Reschedule", "state": "RESCHEDULED" },
      { "label": "Visit Failed", "state": "VISIT_FAILED" }
    ]
  },
  "ADDRESS_ISSUE": {
    "label": "Address Issue",
    "next_steps": [
      { "label": "Mark Arrived", "state": "ARRIVED" }
    ],
    "exceptions": [
      { "label": "Visit Failed", "state": "VISIT_FAILED" }
    ]
  },
  "ACCESS_ISSUE": {
    "label": "Access Issue",
    "next_steps": [
      { "label": "Mark Arrived", "state": "ARRIVED" }
    ],
    "exceptions": [
      { "label": "Reschedule", "state": "RESCHEDULED" },
      { "label": "Visit Failed", "state": "VISIT_FAILED" }
    ]
  },
  "IMAGING_IN_PROGRESS": {
    "label": "Imaging In Progress",
    "next_steps": [
      { "label": "Complete Imaging", "state": "IMAGING_COMPLETED" }
    ],
    "exceptions": [
      { "label": "Patient Refused", "state": "PATIENT_REFUSED_EXAM" },
      { "label": "Equipment Issue", "state": "EQUIPMENT_ISSUE" },
      { "label": "Safety Concern", "state": "SAFETY_CONCERN" },
      { "label": "Unable to Complete", "state": "UNABLE_TO_COMPLETE_EXAM" }
    ]
  },
  "IMAGING_COMPLETED": {
    "label": "Imaging Completed",
    "next_steps": [
      { "label": "Visit Successful", "state": "VISIT_COMPLETED_SUCCESSFULLY" }
    ],
    "exceptions": []
  },
  "PATIENT_REFUSED_EXAM": {
    "label": "Patient Refused Exam",
    "next_steps": [
      { "label": "Retry Contact", "state": "PATIENT_CONTACT_INITIATED" }
    ],
    "exceptions": [
      { "label": "Cancel Visit", "state": "VISIT_CANCELLED_PATIENT" }
    ]
  },
  "EQUIPMENT_ISSUE": {
    "label": "Equipment Issue",
    "next_steps": [
      { "label": "Retry Imaging", "state": "IMAGING_IN_PROGRESS" }
    ],
    "exceptions": [
      { "label": "Reschedule", "state": "RESCHEDULED" },
      { "label": "Visit Failed", "state": "VISIT_FAILED" }
    ]
  },
  "SAFETY_CONCERN": {
    "label": "Safety Concern",
    "next_steps": [],
    "exceptions": [
      { "label": "Cancel Visit (Safety)", "state": "VISIT_CANCELLED_SAFETY" }
    ]
  },
  "UNABLE_TO_COMPLETE_EXAM": {
    "label": "Unable to Complete Exam",
    "next_steps": [],
    "exceptions": [
      { "label": "Reschedule", "state": "RESCHEDULED" },
      { "label": "Visit Failed", "state": "VISIT_FAILED" }
    ]
  },
  "VISIT_COMPLETED_SUCCESSFULLY": {
    "label": "Visit Completed Successfully",
    "next_steps": [],
    "exceptions": []
  },
  "VISIT_FAILED": {
    "label": "Visit Failed",
    "next_steps": [],
    "exceptions": []
  },
  "VISIT_CANCELLED_PATIENT": {
    "label": "Visit Cancelled by Patient",
    "next_steps": [],
    "exceptions": []
  },
  "VISIT_CANCELLED_SAFETY": {
    "label": "Visit Cancelled — Safety",
    "next_steps": [],
    "exceptions": []
  }
};
