// Timesheet Details JavaScript - Individual Session Entries with Approval (service_job_v3)

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
    const staffList = normalizeSessionAssignedStaff(session);
    const matchById = staffList.find(s => s.id && staffData.some(sd => sd.id === s.id));
    if (matchById) return matchById.id;

    const matchByName = staffList.find(s => {
        const name = (s.name || '').trim().toLowerCase();
        return staffData.some(sd => `${sd.firstName} ${sd.lastName}`.toLowerCase() === name);
    });
    if (matchByName) {
        const staff = staffData.find(sd => `${sd.firstName} ${sd.lastName}`.toLowerCase() === matchByName.name.trim().toLowerCase());
        return staff?.id || null;
    }

    const completedBy = session?.completionData?.completedBy;
    if (completedBy && staffData.some(sd => sd.id === completedBy)) return completedBy;

    return null;
}

function ensureSessionCompletionData(session) {
    const estimatedMinutes = getSessionEstimatedMinutes(session);
    const existing = session.completionData || null;
    if (existing && existing.timeSpent) return session;

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
document.addEventListener('DOMContentLoaded', function() {
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


// Get staff completed sessions
function getStaffCompletedSessions(staffId, startDate, endDate, statusFilter) {
    const sessions = loadSessions();

    return sessions.filter(session => {
        const status = (session.status || '').toLowerCase();
        const isCompleted = status === 'completed' || !!session.completionData?.completedAt || !!session.completionData?.approvalStatus;
        if (!isCompleted) return false;

        const sessionStaffId = getStaffIdFromSession(session);
        if (staffId && sessionStaffId !== staffId) return false;

        const completedAt = session.completionData?.completedAt;
        const sessionDate = completedAt ? new Date(completedAt) : new Date(`${session.date}T00:00:00`);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (sessionDate < start || sessionDate > end) return false;

        if (statusFilter && statusFilter !== 'all') {
            const approvalStatus = session.completionData?.approvalStatus || 'pending';
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

// Get estimated hours from job duration string (legacy helper)
function getEstimatedHours(duration) {
    if (!duration) return 0;
    
    // Parse "2 hrs" or "1.5 hrs" or "2h"
    const match = duration.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
}

function getEstimatedHoursFromSession(session) {
    const minutes = getSessionEstimatedMinutes(session);
    return minutes / 60;
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
    
    // Get sessions
    let sessions = getStaffCompletedSessions(staffId, startDate, endDate, statusFilter);
    
    // Filter by search text
    if (filterText) {
        sessions = sessions.filter(session => 
            (session.id || '').toLowerCase().includes(filterText) ||
            (session.learningServiceName || '').toLowerCase().includes(filterText) ||
            (session.title || '').toLowerCase().includes(filterText)
        );
    }
    
    // Render table
    renderTimesheetDetailTable(sessions);
}

// Render timesheet detail table
function renderTimesheetDetailTable(sessions) {
    const tbody = document.getElementById('timesheetDetailTableBody');
    const emptyState = document.getElementById('emptyState');
    
    // Clear table
    tbody.innerHTML = '';
    
    if (sessions.length === 0) {
        document.getElementById('timesheetDetailTable').style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    document.getElementById('timesheetDetailTable').style.display = 'table';
    emptyState.style.display = 'none';
    
    // Sort by completion date (newest first)
    sessions.sort((a, b) => {
        const dateA = new Date(a.completionData?.completedAt || `${a.date}T00:00:00`);
        const dateB = new Date(b.completionData?.completedAt || `${b.date}T00:00:00`);
        return dateB - dateA;
    });
    
    // Render rows
    sessions.forEach((session) => {
        const row = document.createElement('tr');
        row.dataset.sessionId = session.id;
        
        const completionData = session.completionData || {};
        const timeSpent = completionData.timeSpent || { hours: 0, minutes: 0 };
        const actualHours = formatHours(timeSpent.hours, timeSpent.minutes);
        const estimatedHours = getEstimatedHoursFromSession(session);
        
        // Get start/end times
        const startTime = completionData.startTime || session.startTime || '';
        const endTime = completionData.endTime || session.endTime || (startTime ? calculateEndTime(startTime, timeSpent.hours, timeSpent.minutes) : '');
        
        // Get date
        const completedDate = completionData.completedAt
            ? new Date(completionData.completedAt).toISOString().split('T')[0]
            : (session.date || '');
        
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
                <input type="checkbox" class="row-checkbox" data-session-id="${session.id}" onchange="updateBulkActions()">
            </td>
            <td>
                <span class="job-id-cell">${session.id}</span>
                <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">${session.learningServiceName || session.title || ''}</div>
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
                        data-session-id="${session.id}"
                        onchange="updateManagerApprove('${session.id}', this.value)"
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
                            <button class="status-action-btn approve" onclick="approveSession('${session.id}')">
                                <i class="fas fa-check"></i> Approved
                            </button>
                            <button class="status-action-btn decline" onclick="declineSession('${session.id}')">
                                <i class="fas fa-times"></i> Decline
                            </button>
                        </div>
                    ` : ''}
                </div>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="action-icon-btn" onclick="viewSessionDetails('${session.id}')" title="View Session">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-icon-btn" onclick="editSessionTime('${session.id}')" title="Edit Time" ${approvalStatus === 'approved' ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
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
function updateManagerApprove(sessionId, hours) {
    const sessions = loadSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return;
    
    const hoursValue = parseFloat(hours) || 0;
    sessions[sessionIndex].completionData = sessions[sessionIndex].completionData || {};
    sessions[sessionIndex].completionData.managerApproveHours = hoursValue;
    saveSessions(sessions);
    
    showNotification(`Manager approve hours updated to ${hoursValue.toFixed(2)}`, 'success');
}

// Approve session
function approveSession(sessionId) {
    const sessions = loadSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return;
    const session = sessions[sessionIndex];
    session.completionData = session.completionData || {};
    
    const managerApproveHours = session.completionData.managerApproveHours !== null
        ? session.completionData.managerApproveHours
        : parseFloat(formatHours(session.completionData.timeSpent?.hours || 0, session.completionData.timeSpent?.minutes || 0));
    
    session.completionData.approvalStatus = 'approved';
    session.completionData.managerApproveHours = managerApproveHours;
    session.completionData.approvedAt = new Date().toISOString();
    session.completionData.approvedBy = 'MANAGER-001';
    sessions[sessionIndex] = session;
    saveSessions(sessions);
    
    loadTimesheetDetails();
    showNotification(`Session ${sessionId} approved`, 'success');
}

// Decline session
function declineSession(sessionId) {
    const sessions = loadSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return;
    const session = sessions[sessionIndex];
    session.completionData = session.completionData || {};
    
    if (!confirm(`Are you sure you want to decline session ${sessionId}?`)) {
        return;
    }
    
    session.completionData.approvalStatus = 'declined';
    session.completionData.managerApproveHours = 0;
    session.completionData.declinedAt = new Date().toISOString();
    session.completionData.declinedBy = 'MANAGER-001';
    sessions[sessionIndex] = session;
    saveSessions(sessions);
    
    loadTimesheetDetails();
    showNotification(`Session ${sessionId} declined`, 'success');
}

// Bulk approve
function bulkApprove() {
    const selectedSessions = getSelectedSessions();
    if (selectedSessions.length === 0) {
        showNotification('Please select at least one session', 'error');
        return;
    }
    
    if (!confirm(`Approve ${selectedSessions.length} session(s)?`)) {
        return;
    }

    const sessions = loadSessions();
    selectedSessions.forEach(sessionId => {
        const idx = sessions.findIndex(s => s.id === sessionId);
        if (idx === -1) return;
        sessions[idx].completionData = sessions[idx].completionData || {};
        if ((sessions[idx].completionData.approvalStatus || 'pending') !== 'pending') return;
        const managerApproveHours = sessions[idx].completionData.managerApproveHours !== null
            ? sessions[idx].completionData.managerApproveHours
            : parseFloat(formatHours(sessions[idx].completionData.timeSpent?.hours || 0, sessions[idx].completionData.timeSpent?.minutes || 0));
        sessions[idx].completionData.approvalStatus = 'approved';
        sessions[idx].completionData.managerApproveHours = managerApproveHours;
        sessions[idx].completionData.approvedAt = new Date().toISOString();
        sessions[idx].completionData.approvedBy = 'MANAGER-001';
    });
    saveSessions(sessions);
    
    clearSelection();
    loadTimesheetDetails();
    showNotification(`${selectedSessions.length} session(s) approved`, 'success');
}

// Bulk decline
function bulkDecline() {
    const selectedSessions = getSelectedSessions();
    if (selectedSessions.length === 0) {
        showNotification('Please select at least one session', 'error');
        return;
    }
    
    if (!confirm(`Decline ${selectedSessions.length} session(s)?`)) {
        return;
    }

    const sessions = loadSessions();
    selectedSessions.forEach(sessionId => {
        const idx = sessions.findIndex(s => s.id === sessionId);
        if (idx === -1) return;
        sessions[idx].completionData = sessions[idx].completionData || {};
        if ((sessions[idx].completionData.approvalStatus || 'pending') !== 'pending') return;
        sessions[idx].completionData.approvalStatus = 'declined';
        sessions[idx].completionData.managerApproveHours = 0;
        sessions[idx].completionData.declinedAt = new Date().toISOString();
        sessions[idx].completionData.declinedBy = 'MANAGER-001';
    });
    saveSessions(sessions);
    
    clearSelection();
    loadTimesheetDetails();
    showNotification(`${selectedSessions.length} session(s) declined`, 'success');
}

// Get selected sessions
function getSelectedSessions() {
    const checkboxes = document.querySelectorAll('.row-checkbox[data-session-id]:checked');
    return Array.from(checkboxes).map(cb => cb.dataset.sessionId);
}

// Update bulk actions bar
function updateBulkActions() {
    const selectedJobs = getSelectedSessions();
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
    const checkboxes = document.querySelectorAll('.row-checkbox[data-session-id]');
    
    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
    });
    
    updateBulkActions();
}

// Clear selection
function clearSelection() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.row-checkbox[data-session-id]');
    
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

// View session details
function viewSessionDetails(sessionId) {
    // Navigate to service_job_v3 session detail page
    window.location.href = `../[v2] Jobs/service_job_v3/session_detail.html?id=${sessionId}`;
}

// Edit session time
function editSessionTime(sessionId) {
    const sessions = loadSessions();
    const idx = sessions.findIndex(s => s.id === sessionId);
    if (idx === -1) return;
    const session = sessions[idx];
    session.completionData = session.completionData || {};
    
    // In production, this would open a modal to edit time
    const current = formatHours(session.completionData.timeSpent?.hours || 0, session.completionData.timeSpent?.minutes || 0);
    const newHours = prompt(`Edit actual hours for ${sessionId}:\n\nCurrent: ${current} hours`, current);
    
    if (newHours && !isNaN(newHours)) {
        const hours = parseFloat(newHours);
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        
        session.completionData.timeSpent = { hours: wholeHours, minutes: minutes };
        session.completionData.managerApproveHours = null; // Reset to default
        // If session doesn't have completedAt, set it now for reporting
        if (!session.completionData.completedAt) {
            session.completionData.completedAt = new Date().toISOString();
        }
        if (!session.completionData.completedBy) {
            session.completionData.completedBy = getStaffIdFromSession(session);
        }
        if (!session.completionData.approvalStatus) {
            session.completionData.approvalStatus = 'pending';
        }
        sessions[idx] = session;
        saveSessions(sessions);
        
        loadTimesheetDetails();
        showNotification(`Time updated for ${sessionId}`, 'success');
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
    
    const sessions = getStaffCompletedSessions(staffId, startDate, endDate, 'all');
    const staffName = getStaffName(staffId);
    
    // Create CSV
    let csv = 'Timesheet Details Export\n';
    csv += `Staff: ${staffName}\n`;
    csv += `Period: ${startDate} to ${endDate}\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    csv += 'Session ID,Learning Service,Date,Start Time,End Time,Estimated Hours,Actual Hours,Manager Approve Hours,Status\n';
    
    sessions.forEach(session => {
        const completionData = session.completionData || {};
        const timeSpent = completionData.timeSpent || { hours: 0, minutes: 0 };
        const actualHours = formatHours(timeSpent.hours, timeSpent.minutes);
        const estimatedHours = getEstimatedHoursFromSession(session);
        const managerApproveHours = completionData.managerApproveHours !== null 
            ? completionData.managerApproveHours 
            : parseFloat(actualHours);
        const approvalStatus = completionData.approvalStatus || 'pending';
        const completedDate = completionData.completedAt 
            ? new Date(completionData.completedAt).toISOString().split('T')[0]
            : (session.date || '');
        const startTime = completionData.startTime || session.startTime || '';
        const endTime = completionData.endTime || session.endTime || '';
        
        csv += `"${session.id}","${session.learningServiceName || ''}","${completedDate}","${startTime}","${endTime}",${estimatedHours.toFixed(2)},${actualHours},${managerApproveHours.toFixed(2)},"${approvalStatus}"\n`;
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

