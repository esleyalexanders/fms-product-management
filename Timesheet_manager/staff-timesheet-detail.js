// Timesheet Details JavaScript - Individual Job Entries with Approval

// Sample staff data
const staffData = [
    { id: 'STAFF-001', firstName: 'John', lastName: 'Smith', role: 'Technician', status: 'active' },
    { id: 'STAFF-002', firstName: 'Sarah', lastName: 'Johnson', role: 'Technician', status: 'active' },
    { id: 'STAFF-003', firstName: 'Mike', lastName: 'Davis', role: 'Technician', status: 'active' },
    { id: 'STAFF-004', firstName: 'Emily', lastName: 'Wilson', role: 'Receptionist', status: 'active' },
    { id: 'STAFF-005', firstName: 'Alice', lastName: 'Brown', role: 'Technician', status: 'active' }
];

// Sample jobs data with completion details
const allJobs = [
    // Alice's Jobs (STAFF-005)
    {
        id: 'AD231',
        title: 'Garden Maintenance',
        customer: 'Michael Chen',
        status: 'completed',
        assignedTo: 'STAFF-005', // Alice
        time: '1:00 PM',
        duration: '2 hrs',
        dueDate: new Date().toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 3, minutes: 0 },
            completedAt: new Date().toISOString(),
            completedBy: 'STAFF-005',
            approvalStatus: 'pending',
            managerApproveHours: null,
            startTime: '13:00',
            endTime: '16:00'
        }
    },
    {
        id: 'JOB-2024-123',
        title: 'Lawn Mowing Service',
        customer: 'Robert Smith',
        status: 'completed',
        assignedTo: 'STAFF-005', // Alice
        time: '9:00 AM',
        duration: '2 hrs',
        dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 1, minutes: 0 },
            completedAt: new Date(Date.now() - 86400000).toISOString(),
            completedBy: 'STAFF-005',
            approvalStatus: 'pending',
            managerApproveHours: null,
            startTime: '09:00',
            endTime: '10:00'
        }
    },
    {
        id: 'JOB-2024-124',
        title: 'Pool Cleaning',
        customer: 'Emma Wilson',
        status: 'completed',
        assignedTo: 'STAFF-005', // Alice
        time: '10:00 AM',
        duration: '1.5 hrs',
        dueDate: new Date().toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 1, minutes: 45 },
            completedAt: new Date().toISOString(),
            completedBy: 'STAFF-005',
            approvalStatus: 'approved',
            managerApproveHours: 1.75,
            startTime: '10:00',
            endTime: '11:45'
        }
    },
    {
        id: 'JOB-2024-125',
        title: 'Window Cleaning',
        customer: 'David Brown',
        status: 'completed',
        assignedTo: 'STAFF-005', // Alice
        time: '2:00 PM',
        duration: '2 hrs',
        dueDate: new Date().toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 2, minutes: 30 },
            completedAt: new Date().toISOString(),
            completedBy: 'STAFF-005',
            approvalStatus: 'declined',
            managerApproveHours: 0,
            startTime: '14:00',
            endTime: '16:30'
        }
    },
    {
        id: 'JOB-2024-127',
        title: 'Fence Repair',
        customer: 'Jennifer Lee',
        status: 'completed',
        assignedTo: 'STAFF-005', // Alice
        time: '8:00 AM',
        duration: '3 hrs',
        dueDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 2, minutes: 45 },
            completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            completedBy: 'STAFF-005',
            approvalStatus: 'approved',
            managerApproveHours: 2.75,
            startTime: '08:00',
            endTime: '10:45'
        }
    },
    {
        id: 'JOB-2024-128',
        title: 'Carpet Steam Cleaning',
        customer: 'James Wilson',
        status: 'completed',
        assignedTo: 'STAFF-005', // Alice
        time: '11:00 AM',
        duration: '2 hrs',
        dueDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 2, minutes: 15 },
            completedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
            completedBy: 'STAFF-005',
            approvalStatus: 'pending',
            managerApproveHours: null,
            startTime: '11:00',
            endTime: '13:15'
        }
    },
    {
        id: 'JOB-2024-129',
        title: 'Gutter Cleaning',
        customer: 'Patricia Taylor',
        status: 'completed',
        assignedTo: 'STAFF-005', // Alice
        time: '3:00 PM',
        duration: '1.5 hrs',
        dueDate: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 1, minutes: 30 },
            completedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
            completedBy: 'STAFF-005',
            approvalStatus: 'approved',
            managerApproveHours: 1.5,
            startTime: '15:00',
            endTime: '16:30'
        }
    },
    {
        id: 'JOB-2024-130',
        title: 'Pressure Washing - Driveway',
        customer: 'Sarah Mitchell',
        status: 'completed',
        assignedTo: 'STAFF-005', // Alice
        time: '9:30 AM',
        duration: '2 hrs',
        dueDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 2, minutes: 0 },
            completedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
            completedBy: 'STAFF-005',
            approvalStatus: 'declined',
            managerApproveHours: 0,
            startTime: '09:30',
            endTime: '11:30'
        }
    },
    {
        id: 'JOB-2024-131',
        title: 'Air Conditioning Service',
        customer: 'Tom Harris',
        status: 'completed',
        assignedTo: 'STAFF-005', // Alice
        time: '2:30 PM',
        duration: '1 hr',
        dueDate: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 1, minutes: 15 },
            completedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
            completedBy: 'STAFF-005',
            approvalStatus: 'approved',
            managerApproveHours: 1.25,
            startTime: '14:30',
            endTime: '15:45'
        }
    },
    {
        id: 'JOB-2024-132',
        title: 'Office Cleaning',
        customer: 'XYZ Business',
        status: 'completed',
        assignedTo: 'STAFF-005', // Alice
        time: '6:00 PM',
        duration: '2 hrs',
        dueDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 2, minutes: 30 },
            completedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
            completedBy: 'STAFF-005',
            approvalStatus: 'pending',
            managerApproveHours: null,
            startTime: '18:00',
            endTime: '20:30'
        }
    },
    {
        id: 'JOB-2024-133',
        title: 'Home Deep Cleaning',
        customer: 'Lisa Anderson',
        status: 'completed',
        assignedTo: 'STAFF-005', // Alice
        time: '8:00 AM',
        duration: '3 hrs',
        dueDate: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 3, minutes: 30 },
            completedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
            completedBy: 'STAFF-005',
            approvalStatus: 'approved',
            managerApproveHours: 3.5,
            startTime: '08:00',
            endTime: '11:30'
        }
    },
    {
        id: 'JOB-2024-134',
        title: 'Window Cleaning - Commercial',
        customer: 'ABC Corporation',
        status: 'completed',
        assignedTo: 'STAFF-005', // Alice
        time: '1:00 PM',
        duration: '2 hrs',
        dueDate: new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 1, minutes: 45 },
            completedAt: new Date(Date.now() - 9 * 86400000).toISOString(),
            completedBy: 'STAFF-005',
            approvalStatus: 'pending',
            managerApproveHours: null,
            startTime: '13:00',
            endTime: '14:45'
        }
    },

    // John's Jobs (STAFF-001)
    {
        id: 'JOB-2024-126',
        title: 'Pressure Washing',
        customer: 'Sarah Mitchell',
        status: 'completed',
        assignedTo: 'STAFF-001', // John
        time: '8:00 AM',
        duration: '2 hrs',
        dueDate: new Date().toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 2, minutes: 15 },
            completedAt: new Date().toISOString(),
            completedBy: 'STAFF-001',
            approvalStatus: 'pending',
            managerApproveHours: null,
            startTime: '08:00',
            endTime: '10:15'
        }
    },
    {
        id: 'JOB-2024-135',
        title: 'Emergency Plumbing Repair',
        customer: 'David Brown',
        status: 'completed',
        assignedTo: 'STAFF-001', // John
        time: '10:00 AM',
        duration: '1 hr',
        dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 1, minutes: 30 },
            completedAt: new Date(Date.now() - 86400000).toISOString(),
            completedBy: 'STAFF-001',
            approvalStatus: 'approved',
            managerApproveHours: 1.5,
            startTime: '10:00',
            endTime: '11:30'
        }
    },
    {
        id: 'JOB-2024-136',
        title: 'HVAC Maintenance',
        customer: 'Robert Johnson',
        status: 'completed',
        assignedTo: 'STAFF-001', // John
        time: '2:00 PM',
        duration: '2 hrs',
        dueDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 2, minutes: 0 },
            completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            completedBy: 'STAFF-001',
            approvalStatus: 'approved',
            managerApproveHours: 2.0,
            startTime: '14:00',
            endTime: '16:00'
        }
    },
    {
        id: 'JOB-2024-137',
        title: 'Electrical Repair',
        customer: 'Mary Williams',
        status: 'completed',
        assignedTo: 'STAFF-001', // John
        time: '9:00 AM',
        duration: '1.5 hrs',
        dueDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 1, minutes: 45 },
            completedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
            completedBy: 'STAFF-001',
            approvalStatus: 'pending',
            managerApproveHours: null,
            startTime: '09:00',
            endTime: '10:45'
        }
    },

    // Sarah's Jobs (STAFF-002)
    {
        id: 'JOB-2024-138',
        title: 'Landscaping Service',
        customer: 'Peter Anderson',
        status: 'completed',
        assignedTo: 'STAFF-002', // Sarah
        time: '7:00 AM',
        duration: '3 hrs',
        dueDate: new Date().toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 3, minutes: 15 },
            completedAt: new Date().toISOString(),
            completedBy: 'STAFF-002',
            approvalStatus: 'pending',
            managerApproveHours: null,
            startTime: '07:00',
            endTime: '10:15'
        }
    },
    {
        id: 'JOB-2024-139',
        title: 'Tree Trimming',
        customer: 'Linda Martinez',
        status: 'completed',
        assignedTo: 'STAFF-002', // Sarah
        time: '11:00 AM',
        duration: '2 hrs',
        dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 2, minutes: 30 },
            completedAt: new Date(Date.now() - 86400000).toISOString(),
            completedBy: 'STAFF-002',
            approvalStatus: 'approved',
            managerApproveHours: 2.5,
            startTime: '11:00',
            endTime: '13:30'
        }
    },
    {
        id: 'JOB-2024-140',
        title: 'Sprinkler System Repair',
        customer: 'Kevin White',
        status: 'completed',
        assignedTo: 'STAFF-002', // Sarah
        time: '3:00 PM',
        duration: '1.5 hrs',
        dueDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 1, minutes: 20 },
            completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            completedBy: 'STAFF-002',
            approvalStatus: 'declined',
            managerApproveHours: 0,
            startTime: '15:00',
            endTime: '16:20'
        }
    },

    // Mike's Jobs (STAFF-003)
    {
        id: 'JOB-2024-141',
        title: 'Roof Inspection',
        customer: 'Nancy Davis',
        status: 'completed',
        assignedTo: 'STAFF-003', // Mike
        time: '9:00 AM',
        duration: '2 hrs',
        dueDate: new Date().toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 1, minutes: 45 },
            completedAt: new Date().toISOString(),
            completedBy: 'STAFF-003',
            approvalStatus: 'pending',
            managerApproveHours: null,
            startTime: '09:00',
            endTime: '10:45'
        }
    },
    {
        id: 'JOB-2024-142',
        title: 'Deck Staining',
        customer: 'Chris Thompson',
        status: 'completed',
        assignedTo: 'STAFF-003', // Mike
        time: '10:00 AM',
        duration: '3 hrs',
        dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 3, minutes: 30 },
            completedAt: new Date(Date.now() - 86400000).toISOString(),
            completedBy: 'STAFF-003',
            approvalStatus: 'approved',
            managerApproveHours: 3.5,
            startTime: '10:00',
            endTime: '13:30'
        }
    },
    {
        id: 'JOB-2024-143',
        title: 'Paint Touch-up',
        customer: 'Amanda Garcia',
        status: 'completed',
        assignedTo: 'STAFF-003', // Mike
        time: '1:00 PM',
        duration: '1 hr',
        dueDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        completionData: {
            timeSpent: { hours: 0, minutes: 50 },
            completedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
            completedBy: 'STAFF-003',
            approvalStatus: 'approved',
            managerApproveHours: 0.83,
            startTime: '13:00',
            endTime: '13:50'
        }
    }
];

// Get start and end of current month
function getMonthStartEnd() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
}

// Get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        staffId: params.get('staffId') || '',
        startDate: params.get('startDate') || '',
        endDate: params.get('endDate') || ''
    };
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = getUrlParams();

    // Set default date range to current month
    const { start, end } = getMonthStartEnd();

    document.getElementById('startDate').value = urlParams.startDate || start.toISOString().split('T')[0];
    document.getElementById('endDate').value = urlParams.endDate || end.toISOString().split('T')[0];

    // Populate staff selector
    populateStaffSelector();

    // Set staff from URL or default to first staff
    if (urlParams.staffId) {
        document.getElementById('staffSelect').value = urlParams.staffId;
    } else if (staffData.length > 0) {
        document.getElementById('staffSelect').value = staffData[0].id;
    }

    // Load timesheet details
    loadTimesheetDetails();
});

// Populate staff selector
function populateStaffSelector() {
    const staffSelect = document.getElementById('staffSelect');

    // Clear existing options except "Select staff..."
    staffSelect.innerHTML = '<option value="">Select staff...</option>';

    // Add staff options
    staffData.forEach(staff => {
        if (staff.status === 'active') {
            const option = document.createElement('option');
            option.value = staff.id;
            option.textContent = `${staff.firstName} ${staff.lastName}`;
            staffSelect.appendChild(option);
        }
    });
}


// Get staff completed jobs
function getStaffCompletedJobs(staffId, startDate, endDate, statusFilter) {
    return allJobs.filter(job => {
        // Must be completed
        if (job.status !== 'completed') return false;

        // Must have completion data with time
        if (!job.completionData || !job.completionData.timeSpent) return false;

        // Must be assigned to this staff
        if (staffId && job.assignedTo !== staffId) return false;

        // Must be within date range
        if (job.completionData.completedAt) {
            const completedDate = new Date(job.completionData.completedAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            if (completedDate < start || completedDate > end) return false;
        }

        // Filter by approval status
        if (statusFilter && statusFilter !== 'all') {
            const approvalStatus = job.completionData.approvalStatus || 'pending';
            if (approvalStatus !== statusFilter) return false;
        }

        return true;
    });
}

// Parse time string (e.g., "9:00 AM" or "13:00")
function parseTime(timeStr) {
    if (!timeStr) return null;

    // Handle 24-hour format (HH:MM)
    if (timeStr.includes(':')) {
        const parts = timeStr.split(':');
        let hours = parseInt(parts[0]);
        const minutes = parts[1] ? parseInt(parts[1].split(' ')[0]) : 0;

        // Handle AM/PM
        const timePart = timeStr.toUpperCase();
        if (timePart.includes('PM') && hours !== 12) {
            hours += 12;
        } else if (timePart.includes('AM') && hours === 12) {
            hours = 0;
        }

        return { hours, minutes };
    }

    return null;
}

// Format time (HH:MM)
function formatTime(hours, minutes) {
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    return `${h}:${m}`;
}

// Calculate end time from start time and duration
function calculateEndTime(startTime, hours, minutes) {
    if (!startTime) return null;

    const start = parseTime(startTime);
    if (!start) return null;

    let endHours = start.hours + hours;
    let endMinutes = start.minutes + minutes;

    if (endMinutes >= 60) {
        endHours += Math.floor(endMinutes / 60);
        endMinutes = endMinutes % 60;
    }

    return formatTime(endHours, endMinutes);
}

// Get estimated hours from job duration string
function getEstimatedHours(duration) {
    if (!duration) return 0;

    // Parse "2 hrs" or "1.5 hrs" or "2h"
    const match = duration.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
}

// Format hours display
function formatHours(hours, minutes) {
    const total = hours + (minutes / 60);
    return total.toFixed(2);
}

// Get staff name
function getStaffName(staffId) {
    const staff = staffData.find(s => s.id === staffId);
    return staff ? `${staff.firstName} ${staff.lastName}` : 'Unknown';
}

// Load timesheet details
function loadTimesheetDetails() {
    const staffId = document.getElementById('staffSelect').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const filterText = document.getElementById('filterInput').value.toLowerCase();

    if (!staffId) {
        renderEmptyState('Please select a staff member');
        return;
    }

    if (!startDate || !endDate) {
        return;
    }

    // Get jobs
    let jobs = getStaffCompletedJobs(staffId, startDate, endDate, statusFilter);

    // Filter by search text
    if (filterText) {
        jobs = jobs.filter(job =>
            job.id.toLowerCase().includes(filterText) ||
            job.title.toLowerCase().includes(filterText) ||
            job.customer.toLowerCase().includes(filterText)
        );
    }

    // Render table
    renderTimesheetDetailTable(jobs);
}

// Render timesheet detail table
function renderTimesheetDetailTable(jobs) {
    const tbody = document.getElementById('timesheetDetailTableBody');
    const emptyState = document.getElementById('emptyState');

    // Clear table
    tbody.innerHTML = '';

    if (jobs.length === 0) {
        document.getElementById('timesheetDetailTable').style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    document.getElementById('timesheetDetailTable').style.display = 'table';
    emptyState.style.display = 'none';

    // Sort by date (newest first)
    jobs.sort((a, b) => {
        const dateA = new Date(a.completionData.completedAt);
        const dateB = new Date(b.completionData.completedAt);
        return dateB - dateA;
    });

    // Render rows
    jobs.forEach((job, index) => {
        const row = document.createElement('tr');
        row.dataset.jobId = job.id;

        const completionData = job.completionData;
        const timeSpent = completionData.timeSpent;
        const actualHours = formatHours(timeSpent.hours, timeSpent.minutes);
        const estimatedHours = getEstimatedHours(job.duration);

        // Get start/end times
        const parsedStartTime = parseTime(job.time);
        const startTime = completionData.startTime || (parsedStartTime ? formatTime(parsedStartTime.hours, parsedStartTime.minutes) : '');
        const endTime = completionData.endTime || (startTime ? calculateEndTime(startTime, timeSpent.hours, timeSpent.minutes) : '');

        // Get date
        const completedDate = completionData.completedAt
            ? new Date(completionData.completedAt).toISOString().split('T')[0]
            : job.dueDate;

        // Manager approve hours (default to actual hours)
        const managerApproveHours = completionData.managerApproveHours !== null
            ? completionData.managerApproveHours
            : parseFloat(actualHours);

        // Approval status
        const approvalStatus = completionData.approvalStatus || 'pending';
        const statusClass = approvalStatus === 'approved' ? 'approved' : approvalStatus === 'declined' ? 'declined' : 'pending';
        const statusText = approvalStatus === 'approved' ? 'Approved' : approvalStatus === 'declined' ? 'Declined' : 'Waiting approve';

        // Hours difference
        const hoursDiff = parseFloat(actualHours) - estimatedHours;
        const diffClass = hoursDiff > 0 ? 'over' : hoursDiff < 0 ? 'under' : '';
        const diffText = hoursDiff > 0 ? `+${hoursDiff.toFixed(2)}h` : hoursDiff < 0 ? `${hoursDiff.toFixed(2)}h` : '';

        row.innerHTML = `
            <td>
                <input type="checkbox" class="row-checkbox" data-job-id="${job.id}" onchange="updateBulkActions()">
            </td>
            <td>
                <span class="job-id-cell">${job.id}</span>
            </td>
            <td>
                <span class="time-cell">${completedDate || ''}</span>
            </td>
            <td>
                <span class="time-cell">${startTime || ''}</span>
            </td>
            <td>
                <span class="time-cell">${endTime || ''}</span>
            </td>
            <td>
                <span class="hours-cell estimated-hours">${estimatedHours.toFixed(2)}</span>
            </td>
            <td>
                <div>
                    <span class="hours-cell actual-hours">${actualHours}</span>
                    ${diffText ? `<div class="hours-difference ${diffClass}">${diffText}</div>` : ''}
                </div>
            </td>
            <td>
                <div class="approve-cell">
                    <input 
                        type="number" 
                        step="0.25" 
                        min="0" 
                        class="approve-input" 
                        value="${managerApproveHours.toFixed(2)}"
                        data-job-id="${job.id}"
                        onchange="updateManagerApprove('${job.id}', this.value)"
                        ${approvalStatus === 'approved' || approvalStatus === 'declined' ? 'readonly' : ''}
                    >
                    <span class="approve-note">Default = Actual hours</span>
                </div>
            </td>
            <td>
                <div class="status-cell">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    ${approvalStatus === 'pending' ? `
                        <div class="status-actions">
                            <button class="status-action-btn approve" onclick="approveJob('${job.id}')">
                                <i class="fas fa-check"></i> Approved
                            </button>
                            <button class="status-action-btn decline" onclick="declineJob('${job.id}')">
                                <i class="fas fa-times"></i> Decline
                            </button>
                        </div>
                    ` : ''}
                </div>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="action-icon-btn" onclick="viewJobDetails('${job.id}')" title="View Job">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-icon-btn" onclick="editJobTime('${job.id}')" title="Edit Time" ${approvalStatus === 'approved' ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Update bulk actions
    updateBulkActions();
}

// Update manager approve hours
function updateManagerApprove(jobId, hours) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job || !job.completionData) return;

    const hoursValue = parseFloat(hours) || 0;
    job.completionData.managerApproveHours = hoursValue;

    showNotification(`Manager approve hours updated to ${hoursValue.toFixed(2)}`, 'success');
}

// Approve job
function approveJob(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job || !job.completionData) return;

    const managerApproveHours = job.completionData.managerApproveHours !== null
        ? job.completionData.managerApproveHours
        : parseFloat(formatHours(job.completionData.timeSpent.hours, job.completionData.timeSpent.minutes));

    job.completionData.approvalStatus = 'approved';
    job.completionData.managerApproveHours = managerApproveHours;
    job.completionData.approvedAt = new Date().toISOString();
    job.completionData.approvedBy = 'MANAGER-001'; // Current manager

    loadTimesheetDetails();
    showNotification(`Job ${jobId} approved`, 'success');
}

// Decline job
function declineJob(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job || !job.completionData) return;

    if (!confirm(`Are you sure you want to decline job ${jobId}?`)) {
        return;
    }

    job.completionData.approvalStatus = 'declined';
    job.completionData.managerApproveHours = 0;
    job.completionData.declinedAt = new Date().toISOString();
    job.completionData.declinedBy = 'MANAGER-001'; // Current manager

    loadTimesheetDetails();
    showNotification(`Job ${jobId} declined`, 'success');
}

// Bulk approve
function bulkApprove() {
    const selectedJobs = getSelectedJobs();
    if (selectedJobs.length === 0) {
        showNotification('Please select at least one job', 'error');
        return;
    }

    if (!confirm(`Approve ${selectedJobs.length} job(s)?`)) {
        return;
    }

    selectedJobs.forEach(jobId => {
        const job = allJobs.find(j => j.id === jobId);
        if (job && job.completionData && job.completionData.approvalStatus === 'pending') {
            const managerApproveHours = job.completionData.managerApproveHours !== null
                ? job.completionData.managerApproveHours
                : parseFloat(formatHours(job.completionData.timeSpent.hours, job.completionData.timeSpent.minutes));

            job.completionData.approvalStatus = 'approved';
            job.completionData.managerApproveHours = managerApproveHours;
            job.completionData.approvedAt = new Date().toISOString();
            job.completionData.approvedBy = 'MANAGER-001';
        }
    });

    clearSelection();
    loadTimesheetDetails();
    showNotification(`${selectedJobs.length} job(s) approved`, 'success');
}

// Bulk decline
function bulkDecline() {
    const selectedJobs = getSelectedJobs();
    if (selectedJobs.length === 0) {
        showNotification('Please select at least one job', 'error');
        return;
    }

    if (!confirm(`Decline ${selectedJobs.length} job(s)?`)) {
        return;
    }

    selectedJobs.forEach(jobId => {
        const job = allJobs.find(j => j.id === jobId);
        if (job && job.completionData && job.completionData.approvalStatus === 'pending') {
            job.completionData.approvalStatus = 'declined';
            job.completionData.managerApproveHours = 0;
            job.completionData.declinedAt = new Date().toISOString();
            job.completionData.declinedBy = 'MANAGER-001';
        }
    });

    clearSelection();
    loadTimesheetDetails();
    showNotification(`${selectedJobs.length} job(s) declined`, 'success');
}

// Get selected jobs
function getSelectedJobs() {
    const checkboxes = document.querySelectorAll('.row-checkbox[data-job-id]:checked');
    return Array.from(checkboxes).map(cb => cb.dataset.jobId);
}

// Update bulk actions bar
function updateBulkActions() {
    const selectedJobs = getSelectedJobs();
    const bulkBar = document.getElementById('bulkActionsBar');
    const countSpan = document.getElementById('selectedCount');

    if (selectedJobs.length > 0) {
        bulkBar.classList.add('active');
        countSpan.textContent = selectedJobs.length;
    } else {
        bulkBar.classList.remove('active');
    }
}

// Toggle select all
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.row-checkbox[data-job-id]');

    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
    });

    updateBulkActions();
}

// Clear selection
function clearSelection() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.row-checkbox[data-job-id]');

    selectAll.checked = false;
    checkboxes.forEach(cb => {
        cb.checked = false;
    });

    updateBulkActions();
}

// Load staff timesheet
function loadStaffTimesheet() {
    loadTimesheetDetails();
}

// Apply filters
function applyFilters() {
    loadTimesheetDetails();
}

// View job details
function viewJobDetails(jobId) {
    // Navigate to job detail page
    window.location.href = `../Staff/job_detail.html?jobId=${jobId}`;
}

// Edit job time
function editJobTime(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;

    // In production, this would open a modal to edit time
    const newHours = prompt(`Edit actual hours for ${jobId}:\n\nCurrent: ${formatHours(job.completionData.timeSpent.hours, job.completionData.timeSpent.minutes)} hours`,
        formatHours(job.completionData.timeSpent.hours, job.completionData.timeSpent.minutes));

    if (newHours && !isNaN(newHours)) {
        const hours = parseFloat(newHours);
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);

        job.completionData.timeSpent = { hours: wholeHours, minutes: minutes };
        job.completionData.managerApproveHours = null; // Reset to default

        loadTimesheetDetails();
        showNotification(`Time updated for ${jobId}`, 'success');
    }
}

// Export timesheet details
function exportTimesheetDetails() {
    const staffId = document.getElementById('staffSelect').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!staffId) {
        showNotification('Please select a staff member', 'error');
        return;
    }

    const jobs = getStaffCompletedJobs(staffId, startDate, endDate, 'all');
    const staffName = getStaffName(staffId);

    // Create CSV
    let csv = 'Timesheet Details Export\n';
    csv += `Staff: ${staffName}\n`;
    csv += `Period: ${startDate} to ${endDate}\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;

    csv += 'Job ID,Date,Start Time,End Time,Estimated Hours,Actual Hours,Manager Approve Hours,Status\n';

    jobs.forEach(job => {
        const completionData = job.completionData;
        const timeSpent = completionData.timeSpent;
        const actualHours = formatHours(timeSpent.hours, timeSpent.minutes);
        const estimatedHours = getEstimatedHours(job.duration);
        const managerApproveHours = completionData.managerApproveHours !== null
            ? completionData.managerApproveHours
            : parseFloat(actualHours);
        const approvalStatus = completionData.approvalStatus || 'pending';
        const completedDate = completionData.completedAt
            ? new Date(completionData.completedAt).toISOString().split('T')[0]
            : job.dueDate;
        const startTime = completionData.startTime || '';
        const endTime = completionData.endTime || '';

        csv += `"${job.id}","${completedDate}","${startTime}","${endTime}",${estimatedHours.toFixed(2)},${actualHours},${managerApproveHours.toFixed(2)},"${approvalStatus}"\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `timesheet_details_${staffId}_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Timesheet details exported successfully!', 'success');
}

// Refresh details
function refreshDetails() {
    loadTimesheetDetails();
    showNotification('Timesheet details refreshed', 'success');
}

// Render empty state
function renderEmptyState(message) {
    const emptyState = document.getElementById('emptyState');
    const table = document.getElementById('timesheetDetailTable');

    table.style.display = 'none';
    emptyState.style.display = 'block';
    emptyState.querySelector('p').textContent = message || 'No timesheet entries found';
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

