// Manager Staff Timesheets JavaScript - Session approval workflow (service_job_v3)

// Sample staff data aligned with service_job_v3 schedule_calendar_script.js
const staffData = [
    { id: 'STAFF-001', firstName: 'Daniel', lastName: 'Davis', role: 'Instructor', status: 'active' },
    { id: 'STAFF-002', firstName: 'Sarah', lastName: 'Johnson', role: 'Instructor', status: 'active' },
    { id: 'STAFF-003', firstName: 'Michael', lastName: 'Chen', role: 'Instructor', status: 'active' },
    { id: 'STAFF-004', firstName: 'Emily', lastName: 'Rodriguez', role: 'Instructor', status: 'active' },
    { id: 'STAFF-005', firstName: 'James', lastName: 'Wilson', role: 'Instructor', status: 'active' }
];

function safeJsonParse(value, fallback) {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function minutesToTimeSpent(totalMinutes) {
    const mins = Math.max(0, parseInt(totalMinutes || 0, 10));
    return { hours: Math.floor(mins / 60), minutes: mins % 60 };
}

function getSessionEstimatedMinutes(session) {
    const duration = session?.duration;
    const durationNum = typeof duration === 'string' ? parseInt(duration, 10) : duration;
    if (Number.isFinite(durationNum) && durationNum > 0) return durationNum;
    // If no duration, infer from start/end time when possible
    const start = session?.startTime;
    const end = session?.endTime;
    if (start && end && start.includes(':') && end.includes(':')) {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const mins = (eh * 60 + em) - (sh * 60 + sm);
        return mins > 0 ? mins : 0;
    }
    return 0;
}

function isSessionInPast(session) {
    if (!session?.date) return false;
    const time = session.endTime || session.startTime || '00:00';
    const dt = new Date(`${session.date}T${time}:00`);
    return Number.isFinite(dt.getTime()) && dt.getTime() < Date.now();
}

function normalizeSessionAssignedStaff(session) {
    const assigned = session?.assignedStaff;
    if (!assigned) return [];

    // Schedule calendar sometimes stores ['Daniel Davis'] and sometimes [{id,name}]
    if (Array.isArray(assigned)) {
        return assigned.map(s => {
            if (typeof s === 'string') return { id: null, name: s };
            if (s && typeof s === 'object') return { id: s.id || null, name: s.name || s.fullName || 'Unknown' };
            return { id: null, name: 'Unknown' };
        });
    }

    if (typeof assigned === 'string') return [{ id: null, name: assigned }];
    return [];
}

function getStaffIdFromSession(session) {
    // Prefer explicit staff id on assignedStaff objects
    const staffList = normalizeSessionAssignedStaff(session);
    const matchById = staffList.find(s => s.id && staffData.some(sd => sd.id === s.id));
    if (matchById) return matchById.id;

    // Fallback: match by staff full name
    const matchByName = staffList.find(s => {
        const name = (s.name || '').trim().toLowerCase();
        return staffData.some(sd => `${sd.firstName} ${sd.lastName}`.toLowerCase() === name);
    });
    if (matchByName) {
        const staff = staffData.find(sd => `${sd.firstName} ${sd.lastName}`.toLowerCase() === matchByName.name.trim().toLowerCase());
        return staff?.id || null;
    }

    // Or session.completedBy might contain staff id
    const completedBy = session?.completionData?.completedBy;
    if (completedBy && staffData.some(sd => sd.id === completedBy)) return completedBy;

    return null;
}

function ensureSessionCompletionData(session) {
    const estimatedMinutes = getSessionEstimatedMinutes(session);
    const existing = session.completionData || null;

    // Keep existing completionData if present
    if (existing && existing.timeSpent) return session;

    // Default behavior:
    // - If session is in the past, assume staff submitted time = estimated (so manager has something to approve)
    // - If session explicitly marked completed, also do the same
    const isCompleted = (session.status || '').toLowerCase() === 'completed';
    const isPast = isSessionInPast(session);
    const shouldCreateTimesheet = isCompleted || isPast;
    const timeSpent = shouldCreateTimesheet ? minutesToTimeSpent(estimatedMinutes) : minutesToTimeSpent(0);

    session.completionData = {
        ...(existing || {}),
        timeSpent,
        completedAt: existing?.completedAt || (shouldCreateTimesheet ? new Date(`${session.date}T${session.endTime || session.startTime || '00:00'}:00`).toISOString() : null),
        completedBy: existing?.completedBy || getStaffIdFromSession(session),
        approvalStatus: existing?.approvalStatus || (shouldCreateTimesheet ? 'pending' : null),
        managerApproveHours: existing?.managerApproveHours ?? null,
        startTime: existing?.startTime || session.startTime || '',
        endTime: existing?.endTime || session.endTime || ''
    };
    return session;
}

function loadSessions() {
    const sessions = safeJsonParse(localStorage.getItem('fms_sessions'), []);
    let changed = false;
    const normalized = sessions.map(s => {
        const before = !!(s && s.completionData && s.completionData.timeSpent);
        const next = ensureSessionCompletionData({ ...s });
        const after = !!(next && next.completionData && next.completionData.timeSpent);
        if (!before && after && (next.completionData?.approvalStatus || next.completionData?.completedAt)) {
            changed = true;
        }
        return next;
    });
    if (changed) saveSessions(normalized);
    return normalized;
}

function saveSessions(sessions) {
    localStorage.setItem('fms_sessions', JSON.stringify(sessions));
}

// Get start and end of current month
function getMonthStartEnd() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set default date range to current month
    const { start, end } = getMonthStartEnd();
    
    document.getElementById('startDate').value = start.toISOString().split('T')[0];
    document.getElementById('endDate').value = end.toISOString().split('T')[0];
    
    // Load timesheet data
    loadTimesheets();
});

// Get staff completed sessions
function getStaffCompletedSessions(staffId, startDate, endDate) {
    const allSessions = loadSessions();

    return allSessions.filter(session => {
        const status = (session.status || '').toLowerCase();
        const isCompleted = status === 'completed' || !!session.completionData?.completedAt || !!session.completionData?.approvalStatus;
        if (!isCompleted) return false;

        const sessionStaffId = getStaffIdFromSession(session);
        if (staffId !== 'all' && sessionStaffId !== staffId) return false;

        const completedAt = session.completionData?.completedAt;
        const sessionDate = completedAt ? new Date(completedAt) : new Date(`${session.date}T00:00:00`);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (sessionDate < start || sessionDate > end) return false;

        return true;
    });
}

// Calculate hours by approval status
function calculateHoursByStatus(sessions) {
    let pendingMinutes = 0;
    let approvedMinutes = 0;
    let declinedMinutes = 0;
    
    sessions.forEach(session => {
        const time = session.completionData?.timeSpent || { hours: 0, minutes: 0 };
        const minutes = (time.hours * 60) + time.minutes;
        const approvalStatus = session.completionData?.approvalStatus || 'pending';
        
        if (approvalStatus === 'approved') {
            approvedMinutes += minutes;
        } else if (approvalStatus === 'declined') {
            declinedMinutes += minutes;
        } else {
            pendingMinutes += minutes;
        }
    });
    
    return {
        pending: {
            hours: Math.floor(pendingMinutes / 60),
            minutes: pendingMinutes % 60,
            totalHours: (pendingMinutes / 60).toFixed(2),
            totalMinutes: pendingMinutes
        },
        approved: {
            hours: Math.floor(approvedMinutes / 60),
            minutes: approvedMinutes % 60,
            totalHours: (approvedMinutes / 60).toFixed(2),
            totalMinutes: approvedMinutes
        },
        declined: {
            hours: Math.floor(declinedMinutes / 60),
            minutes: declinedMinutes % 60,
            totalHours: (declinedMinutes / 60).toFixed(2),
            totalMinutes: declinedMinutes
        },
        total: {
            hours: Math.floor((pendingMinutes + approvedMinutes + declinedMinutes) / 60),
            minutes: (pendingMinutes + approvedMinutes + declinedMinutes) % 60,
            totalHours: ((pendingMinutes + approvedMinutes + declinedMinutes) / 60).toFixed(2),
            totalMinutes: pendingMinutes + approvedMinutes + declinedMinutes
        }
    };
}

// Format time display (just hours as number)
function formatHours(hours, minutes) {
    const totalHours = hours + (minutes / 60);
    return totalHours.toFixed(1);
}

// Get staff name
function getStaffName(staffId) {
    const staff = staffData.find(s => s.id === staffId);
    return staff ? `${staff.firstName} ${staff.lastName}` : 'Unknown';
}

// Get staff initials
function getStaffInitials(staffId) {
    const staff = staffData.find(s => s.id === staffId);
    if (!staff) return '??';
    return `${staff.firstName[0]}${staff.lastName[0]}`.toUpperCase();
}

// Load and display timesheets
function loadTimesheets() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const filterText = document.getElementById('filterInput').value.toLowerCase();
    
    if (!startDate || !endDate) {
        return;
    }
    
    // Get all active staff
    const activeStaff = staffData.filter(s => s.status === 'active');
    
    // Aggregate timesheet data by staff
    const timesheetData = activeStaff.map(staff => {
        const sessions = getStaffCompletedSessions(staff.id, startDate, endDate);
        const hoursByStatus = calculateHoursByStatus(sessions);
        
        return {
            staffId: staff.id,
            staffName: getStaffName(staff.id),
            staffRole: staff.role,
            sessions: sessions,
            hours: hoursByStatus,
            sessionCount: sessions.length
        };
    });
    
    // Filter by search text
    const filteredData = filterText 
        ? timesheetData.filter(data => 
            data.staffName.toLowerCase().includes(filterText) ||
            data.staffRole.toLowerCase().includes(filterText)
        )
        : timesheetData;
    
    // Filter out staff with no sessions
    const timesheetDataWithSessions = filteredData.filter(data => data.sessionCount > 0);
    
    // Update summary cards
    updateSummaryCards(timesheetDataWithSessions);
    
    // Render table
    renderTimesheetTable(timesheetDataWithSessions);
}

// Update summary cards
function updateSummaryCards(timesheetData) {
    let totalHours = 0;
    let pendingHours = 0;
    let approvedHours = 0;
    let totalMinutes = 0;
    let pendingMinutes = 0;
    let approvedMinutes = 0;
    
    timesheetData.forEach(data => {
        totalMinutes += data.hours.total.totalMinutes;
        pendingMinutes += data.hours.pending.totalMinutes;
        approvedMinutes += data.hours.approved.totalMinutes;
    });
    
    // Convert to hours
    totalHours = Math.floor(totalMinutes / 60);
    pendingHours = Math.floor(pendingMinutes / 60);
    approvedHours = Math.floor(approvedMinutes / 60);
    
    const totalRemainingMinutes = totalMinutes % 60;
    const pendingRemainingMinutes = pendingMinutes % 60;
    const approvedRemainingMinutes = approvedMinutes % 60;
    
    // Update cards
    document.getElementById('totalHours').textContent = totalHours > 0 || totalRemainingMinutes > 0 
        ? `${totalHours}h ${totalRemainingMinutes}m` 
        : '0h';
    document.getElementById('pendingHours').textContent = pendingHours > 0 || pendingRemainingMinutes > 0
        ? `${pendingHours}h ${pendingRemainingMinutes}m`
        : '0h';
    document.getElementById('approvedHours').textContent = approvedHours > 0 || approvedRemainingMinutes > 0
        ? `${approvedHours}h ${approvedRemainingMinutes}m`
        : '0h';
    document.getElementById('activeStaff').textContent = timesheetData.length;
}

// Render timesheet table
function renderTimesheetTable(timesheetData) {
    const tbody = document.getElementById('timesheetTableBody');
    const emptyState = document.getElementById('emptyState');
    
    // Clear table
    tbody.innerHTML = '';
    
    if (timesheetData.length === 0) {
        document.getElementById('timesheetTable').style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    document.getElementById('timesheetTable').style.display = 'table';
    emptyState.style.display = 'none';
    
    // Render rows
    timesheetData.forEach(data => {
        const row = document.createElement('tr');
        
        const initials = getStaffInitials(data.staffId);
        const pendingHours = formatHours(data.hours.pending.hours, data.hours.pending.minutes);
        const approvedHours = formatHours(data.hours.approved.hours, data.hours.approved.minutes);
        const declinedHours = formatHours(data.hours.declined.hours, data.hours.declined.minutes);
        const totalHours = formatHours(data.hours.total.hours, data.hours.total.minutes);
        
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const detailUrl = `staff-timesheet-detail.html?staffId=${data.staffId}&startDate=${startDate}&endDate=${endDate}`;
        
        row.innerHTML = `
            <td>
                <div class="staff-name-cell" style="cursor: pointer;" onclick="window.location.href='${detailUrl}'">
                    <div class="staff-avatar">${initials}</div>
                    <div class="staff-info">
                        <div class="staff-name">${data.staffName}</div>
                        <div class="staff-role">${data.staffRole}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="time-display hours-pending">${pendingHours}</span>
            </td>
            <td>
                <span class="time-display hours-approved">${approvedHours}</span>
            </td>
            <td>
                <span class="time-display hours-declined">${declinedHours}</span>
            </td>
            <td>
                <span class="time-display hours-total">${totalHours}</span>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Apply filters
function applyFilters() {
    loadTimesheets();
}

// Export all timesheets
function exportAllTimesheets() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Collect all sessions
    let allSessionsToExport = [];
    staffData.forEach(staff => {
        const sessions = getStaffCompletedSessions(staff.id, startDate, endDate);
        sessions.forEach(session => {
            allSessionsToExport.push({
                ...session,
                staffName: getStaffName(staff.id)
            });
        });
    });
    
    exportToCSV('all', 'All Staff', allSessionsToExport, startDate, endDate);
}

// Export to CSV
function exportToCSV(staffId, staffName, sessions, startDate, endDate) {
    // Create CSV content
    let csv = 'Staff Timesheet Export\n';
    csv += `Staff: ${staffName}\n`;
    csv += `Period: ${startDate} to ${endDate}\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    csv += 'Session ID,Learning Service,Date,Start Time,End Time,Time Spent (Hours),Approval Status\n';
    
    sessions.forEach(session => {
        const time = session.completionData?.timeSpent || { hours: 0, minutes: 0 };
        const totalHours = (time.hours + time.minutes / 60).toFixed(2);
        const completedDate = session.completionData?.completedAt
            ? new Date(session.completionData.completedAt).toLocaleDateString()
            : (session.date || 'N/A');
        const approvalStatus = session.completionData?.approvalStatus || 'pending';
        
        csv += `"${session.id}","${session.learningServiceName || ''}","${completedDate}","${session.startTime || session.completionData?.startTime || ''}","${session.endTime || session.completionData?.endTime || ''}",${totalHours},"${approvalStatus}"\n`;
    });
    
    // Create download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `timesheet_${staffId}_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Timesheet exported successfully!', 'success');
}

// Refresh timesheets
function refreshTimesheets() {
    loadTimesheets();
    showNotification('Timesheet data refreshed', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Simple notification - in production, use a proper notification system
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
