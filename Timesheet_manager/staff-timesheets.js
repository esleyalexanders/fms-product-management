// Manager Staff Timesheets JavaScript - Approval Workflow

// Sample staff data (in production, this would come from API)
const staffData = [
    { id: 'STAFF-001', firstName: 'John', lastName: 'Smith', role: 'Technician', status: 'active' },
    { id: 'STAFF-002', firstName: 'Sarah', lastName: 'Johnson', role: 'Technician', status: 'active' },
    { id: 'STAFF-003', firstName: 'Mike', lastName: 'Davis', role: 'Technician', status: 'active' },
    { id: 'STAFF-004', firstName: 'Emily', lastName: 'Wilson', role: 'Receptionist', status: 'active' }
];

// Sample jobs data with approval status
// approvalStatus: 'pending', 'approved', 'declined'
const allJobs = [
    {
        id: 'JOB-2024-123',
        title: 'Lawn Mowing Service',
        customer: 'Robert Smith',
        status: 'completed',
        assignedTo: 'STAFF-001',
        completionData: {
            timeSpent: { hours: 1, minutes: 0 },
            completedAt: new Date(Date.now() - 86400000).toISOString(),
            completedBy: 'STAFF-001',
            approvalStatus: 'pending' // pending, approved, declined
        }
    },
    {
        id: 'JOB-2024-121',
        title: 'Pressure Washing - Driveway',
        customer: 'Sarah Mitchell',
        status: 'completed',
        assignedTo: 'STAFF-001',
        completionData: {
            timeSpent: { hours: 2, minutes: 15 },
            completedAt: new Date(Date.now() - 172800000).toISOString(),
            completedBy: 'STAFF-001',
            approvalStatus: 'approved'
        }
    },
    {
        id: 'JOB-2024-122',
        title: 'Air Conditioning Service',
        customer: 'Tom Harris',
        status: 'completed',
        assignedTo: 'STAFF-002',
        completionData: {
            timeSpent: { hours: 1, minutes: 30 },
            completedAt: new Date(Date.now() - 259200000).toISOString(),
            completedBy: 'STAFF-002',
            approvalStatus: 'approved'
        }
    },
    {
        id: 'JOB-2024-124',
        title: 'Garden Maintenance',
        customer: 'Michael Chen',
        status: 'completed',
        assignedTo: 'STAFF-001',
        completionData: {
            timeSpent: { hours: 2, minutes: 30 },
            completedAt: new Date().toISOString(),
            completedBy: 'STAFF-001',
            approvalStatus: 'pending'
        }
    },
    {
        id: 'JOB-2024-125',
        title: 'Pool Cleaning',
        customer: 'Emma Wilson',
        status: 'completed',
        assignedTo: 'STAFF-002',
        completionData: {
            timeSpent: { hours: 1, minutes: 45 },
            completedAt: new Date().toISOString(),
            completedBy: 'STAFF-002',
            approvalStatus: 'declined'
        }
    },
    {
        id: 'JOB-2024-126',
        title: 'Emergency Plumbing Repair',
        customer: 'David Brown',
        status: 'completed',
        assignedTo: 'STAFF-003',
        completionData: {
            timeSpent: { hours: 3, minutes: 0 },
            completedAt: new Date().toISOString(),
            completedBy: 'STAFF-003',
            approvalStatus: 'pending'
        }
    },
    {
        id: 'JOB-2024-127',
        title: 'Window Cleaning',
        customer: 'Alice Johnson',
        status: 'completed',
        assignedTo: 'STAFF-001',
        completionData: {
            timeSpent: { hours: 2, minutes: 0 },
            completedAt: new Date().toISOString(),
            completedBy: 'STAFF-001',
            approvalStatus: 'approved'
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

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set default date range to current month
    const { start, end } = getMonthStartEnd();
    
    document.getElementById('startDate').value = start.toISOString().split('T')[0];
    document.getElementById('endDate').value = end.toISOString().split('T')[0];
    
    // Load timesheet data
    loadTimesheets();
});

// Get staff completed jobs
function getStaffCompletedJobs(staffId, startDate, endDate) {
    return allJobs.filter(job => {
        // Must be completed
        if (job.status !== 'completed') return false;
        
        // Must have completion data with time
        if (!job.completionData || !job.completionData.timeSpent) return false;
        
        // Must be assigned to this staff (or all staff if staffId is 'all')
        if (staffId !== 'all' && job.assignedTo !== staffId) return false;
        
        // Must be within date range
        if (job.completionData.completedAt) {
            const completedDate = new Date(job.completionData.completedAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include full end date
            
            if (completedDate < start || completedDate > end) return false;
        }
        
        return true;
    });
}

// Calculate hours by approval status
function calculateHoursByStatus(jobs) {
    let pendingMinutes = 0;
    let approvedMinutes = 0;
    let declinedMinutes = 0;
    
    jobs.forEach(job => {
        const time = job.completionData.timeSpent;
        const minutes = (time.hours * 60) + time.minutes;
        const approvalStatus = job.completionData.approvalStatus || 'pending';
        
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
        const jobs = getStaffCompletedJobs(staff.id, startDate, endDate);
        const hoursByStatus = calculateHoursByStatus(jobs);
        
        return {
            staffId: staff.id,
            staffName: getStaffName(staff.id),
            staffRole: staff.role,
            jobs: jobs,
            hours: hoursByStatus,
            jobCount: jobs.length
        };
    });
    
    // Filter by search text
    const filteredData = filterText 
        ? timesheetData.filter(data => 
            data.staffName.toLowerCase().includes(filterText) ||
            data.staffRole.toLowerCase().includes(filterText)
        )
        : timesheetData;
    
    // Filter out staff with no jobs
    const timesheetDataWithJobs = filteredData.filter(data => data.jobCount > 0);
    
    // Update summary cards
    updateSummaryCards(timesheetDataWithJobs);
    
    // Render table
    renderTimesheetTable(timesheetDataWithJobs);
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
    
    // Collect all jobs
    let allJobsToExport = [];
    staffData.forEach(staff => {
        const jobs = getStaffCompletedJobs(staff.id, startDate, endDate);
        jobs.forEach(job => {
            allJobsToExport.push({
                ...job,
                staffName: getStaffName(job.assignedTo)
            });
        });
    });
    
    exportToCSV('all', 'All Staff', allJobsToExport, startDate, endDate);
}

// Export to CSV
function exportToCSV(staffId, staffName, jobs, startDate, endDate) {
    // Create CSV content
    let csv = 'Staff Timesheet Export\n';
    csv += `Staff: ${staffName}\n`;
    csv += `Period: ${startDate} to ${endDate}\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    csv += 'Job ID,Title,Customer,Date Completed,Time Spent (Hours),Approval Status\n';
    
    jobs.forEach(job => {
        const time = job.completionData.timeSpent;
        const totalHours = (time.hours + time.minutes / 60).toFixed(2);
        const completedDate = job.completionData.completedAt 
            ? new Date(job.completionData.completedAt).toLocaleDateString()
            : 'N/A';
        const approvalStatus = job.completionData.approvalStatus || 'pending';
        
        csv += `"${job.id}","${job.title}","${job.customer}","${completedDate}",${totalHours},"${approvalStatus}"\n`;
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
