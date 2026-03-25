// Staff Home Dashboard JavaScript
// Matches the style of home.html

// Mobile sidebar toggle
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
    }
}

// Close sidebar when clicking on a nav item (mobile)
function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
    }
}

// Sample staff data
const staffData = {
    id: 'STAFF-001',
    name: 'John Smith',
    status: 'online',
    clockedIn: false,
    clockInTime: null,
    onBreak: false,
    breakStartTime: null,
    currentJob: null
};

// Sample jobs assigned to this staff member
const assignedJobs = [
    {
        id: 'JOB-2024-124',
        title: 'Garden Maintenance',
        customer: 'Michael Chen',
        customerEmail: 'michael@email.com',
        time: '9:00 AM',
        duration: '2.5 hrs',
        address: '456 Oak Ave, Melbourne',
        priority: 'normal',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        dueDate: new Date().toISOString().split('T')[0]
    },
    {
        id: 'JOB-2024-125',
        title: 'Pool Cleaning',
        customer: 'Emma Wilson',
        customerEmail: 'emma@email.com',
        time: '11:30 AM',
        duration: '1.5 hrs',
        address: '789 Beach Rd, Melbourne',
        priority: 'normal',
        status: 'pending',
        assignedTo: 'STAFF-001',
        dueDate: new Date().toISOString().split('T')[0]
    },
    {
        id: 'JOB-2024-126',
        title: 'Emergency Repair',
        customer: 'David Brown',
        customerEmail: 'david@email.com',
        time: '2:00 PM',
        duration: '1 hr',
        address: '321 Hill St, Melbourne',
        priority: 'urgent',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        dueDate: new Date().toISOString().split('T')[0]
    },
    {
        id: 'JOB-2024-127',
        title: 'Home Cleaning Service',
        customer: 'Lisa Anderson',
        customerEmail: 'lisa@email.com',
        time: '3:30 PM',
        duration: '2 hrs',
        address: '555 Park Lane, Melbourne',
        priority: 'high',
        status: 'pending',
        assignedTo: 'STAFF-001',
        dueDate: new Date().toISOString().split('T')[0]
    },
    {
        id: 'JOB-2024-123',
        title: 'Lawn Mowing',
        customer: 'Robert Smith',
        customerEmail: 'robert@email.com',
        time: '8:00 AM',
        duration: '1 hr',
        address: '222 Green St, Melbourne',
        priority: 'low',
        status: 'completed',
        assignedTo: 'STAFF-001',
        dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0]
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Close sidebar when clicking nav items on mobile
    const navItems = document.querySelectorAll('.sidebar .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            setTimeout(() => closeMobileSidebar(), 100);
        });
    });
    initializeDashboard();
    updateTime();
    setInterval(updateTime, 1000);
    updateActiveTime();
    setInterval(updateActiveTime, 1000);
    
    // Load jobs assigned to this staff
    loadAssignedJobs();
    updateJobCounts();
    
    // Initialize banner close
    initializeBanner();
});

function initializeDashboard() {
    // Load staff name
    document.getElementById('staffName').textContent = staffData.name;
    document.getElementById('staffNameHeader').textContent = staffData.name.split(' ')[0];
    
    // Set current date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    
    // Set status
    updateStatus(staffData.status);
}

function initializeBanner() {
    const banner = document.querySelector('.limited-offer-banner');
    const closeBtn = document.querySelector('.banner-close-btn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            banner.style.display = 'none';
        });
    }
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('currentTime').textContent = timeString;
}

function updateActiveTime() {
    if (staffData.clockedIn && staffData.clockInTime) {
        const now = new Date();
        const diff = now - staffData.clockInTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('activeTime').textContent = timeString;
    }
}

function updateStatus(status) {
    staffData.status = status;
    const statusDot = document.getElementById('statusDot');
    const statusSelect = document.getElementById('statusSelect');
    
    // Remove all status classes
    statusDot.classList.remove('online', 'busy', 'offline');
    
    // Add current status class
    statusDot.classList.add(status);
    statusSelect.value = status;
}

// Status select change handler
document.getElementById('statusSelect').addEventListener('change', function(e) {
    updateStatus(e.target.value);
    showNotification(`Status updated to ${e.target.value}`, 'success');
});

// Clock In/Out
function toggleClockInOut() {
    if (!staffData.clockedIn) {
        // Clock In
        staffData.clockedIn = true;
        staffData.clockInTime = new Date();
        document.getElementById('clockButtonText').textContent = 'Clock Out';
        document.getElementById('activeTime').textContent = '00:00:00';
        updateStatus('online');
        showNotification('Clocked in successfully!', 'success');
    } else {
        // Clock Out
        if (confirm('Are you sure you want to clock out?')) {
            staffData.clockedIn = false;
            staffData.clockInTime = null;
            document.getElementById('clockButtonText').textContent = 'Clock In';
            document.getElementById('activeTime').textContent = '00:00:00';
            updateStatus('offline');
            showNotification('Clocked out successfully!', 'info');
        }
    }
}

// Break functionality
let breakInterval = null;

function startBreak() {
    if (!staffData.onBreak) {
        staffData.onBreak = true;
        staffData.breakStartTime = new Date();
        updateStatus('busy');
        
        breakInterval = setInterval(updateBreakTimer, 1000);
        showNotification('Break started', 'info');
    } else {
        staffData.onBreak = false;
        staffData.breakStartTime = null;
        clearInterval(breakInterval);
        document.getElementById('breakTimer').textContent = '00:00';
        updateStatus('online');
        showNotification('Break ended', 'success');
    }
}

function updateBreakTimer() {
    if (staffData.onBreak && staffData.breakStartTime) {
        const now = new Date();
        const diff = now - staffData.breakStartTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('breakTimer').textContent = timeString;
    }
}

// Check In to Job
function showCheckInModal() {
    const jobId = prompt('Enter Job ID to check in:');
    if (jobId) {
        const job = assignedJobs.find(j => j.id === jobId);
        if (job) {
            showNotification(`Checked in to ${job.title}`, 'success');
            updateStatus('busy');
            showCurrentJob(job);
        } else {
            showNotification('Job not found or not assigned to you', 'error');
        }
    }
}

// Show current job
function showCurrentJob(job) {
    const section = document.getElementById('currentJobSection');
    section.style.display = 'block';
    // Update the job details in the section
    staffData.currentJob = job;
}

// Update Job Status
function showUpdateModal() {
    const updates = ['Started', 'In Progress', 'Waiting for Parts', 'Almost Done'];
    const status = prompt('Job status update:\n1. Started\n2. In Progress\n3. Waiting for Parts\n4. Almost Done\n\nSelect 1-4:');
    
    if (status && status >= 1 && status <= 4) {
        showNotification(`Job status updated to: ${updates[status - 1]}`, 'success');
    }
}

// Complete Job
function completeJob() {
    if (confirm('Mark this job as complete?')) {
        const section = document.getElementById('currentJobSection');
        section.style.display = 'none';
        
        // Update completed jobs count
        const completed = parseInt(document.getElementById('completedJobs').textContent) + 1;
        document.getElementById('completedJobs').textContent = completed;
        
        // Update completion rate
        const total = parseInt(document.getElementById('totalJobs').textContent);
        const rate = Math.round((completed / total) * 100);
        document.getElementById('completionRate').textContent = `${rate}% completion`;
        
        // Update earnings
        const currentEarnings = parseInt(document.getElementById('todayEarnings').textContent);
        document.getElementById('todayEarnings').textContent = currentEarnings + 50;
        
        showNotification('Job completed successfully! 🎉', 'success');
        updateStatus('online');
        staffData.currentJob = null;
        
        // Reload jobs list
        loadAssignedJobs();
        updateJobCounts();
    }
}

// Pause Job
function pauseJob() {
    if (confirm('Pause this job?')) {
        showNotification('Job paused. You can resume it anytime.', 'info');
        updateStatus('online');
    }
}

// Load jobs assigned to this staff member
function loadAssignedJobs(filter = 'all') {
    const jobsList = document.getElementById('jobsList');
    const emptyState = document.getElementById('emptyState');
    
    // Filter jobs by status
    let filteredJobs = assignedJobs.filter(job => job.assignedTo === staffData.id);
    
    if (filter !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.status === filter);
    }
    
    if (filteredJobs.length === 0) {
        jobsList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    jobsList.style.display = 'flex';
    emptyState.style.display = 'none';
    
    // Sort by time
    filteredJobs.sort((a, b) => {
        const timeA = a.time.split(':')[0];
        const timeB = b.time.split(':')[0];
        return parseInt(timeA) - parseInt(timeB);
    });
    
    // Generate HTML for each job
    jobsList.innerHTML = filteredJobs.map(job => createJobCard(job)).join('');
}

// Create job card HTML
function createJobCard(job) {
    const priorityClass = `priority-${job.priority}`;
    const statusColors = {
        'scheduled': { bg: '#dbeafe', text: '#1e40af' },
        'pending': { bg: '#fef3c7', text: '#92400e' },
        'completed': { bg: '#d1fae5', text: '#065f46' },
        'in_progress': { bg: '#e9d5ff', text: '#6b21a8' }
    };
    const statusColor = statusColors[job.status] || statusColors.pending;
    
    const priorityLabels = {
        'urgent': { text: 'URGENT', color: '#ef4444' },
        'high': { text: 'High', color: '#f59e0b' },
        'normal': { text: 'Normal', color: '#3b82f6' },
        'low': { text: 'Low', color: '#10b981' }
    };
    const priority = priorityLabels[job.priority] || priorityLabels.normal;
    
    return `
        <div class="job-card ${priorityClass}" style="background: white; border-radius: 12px; padding: 20px; cursor: pointer; border: 1px solid #e5e7eb;" onclick="viewJobDetails('${job.id}')">
            <div style="display: flex; justify-between; align-items: start; margin-bottom: 12px;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <span style="padding: 4px 8px; background: ${statusColor.bg}; color: ${statusColor.text}; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase;">${job.status.replace('_', ' ')}</span>
                        <span style="padding: 4px 8px; background: ${priority.color}20; color: ${priority.color}; border-radius: 6px; font-size: 11px; font-weight: 600;">${priority.text}</span>
                        <span style="color: #6b7280; font-size: 12px; font-weight: 500;">
                            <i class="fas fa-clock"></i> ${job.time}
                        </span>
                    </div>
                    <h4 style="font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 4px;">${job.title}</h4>
                    <p style="color: #6b7280; font-size: 14px;">${job.customer} • ${job.id}</p>
                </div>
                <i class="fas fa-chevron-right" style="color: #9ca3af;"></i>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; padding-top: 12px; border-top: 1px solid #f3f4f6;">
                <div style="display: flex; align-items: center; gap: 6px; color: #6b7280; font-size: 13px;">
                    <i class="fas fa-map-marker-alt" style="color: ${priority.color};"></i>
                    <span>${job.address}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; color: #6b7280; font-size: 13px;">
                    <i class="fas fa-hourglass-half" style="color: ${priority.color};"></i>
                    <span>${job.duration}</span>
                </div>
            </div>
        </div>
    `;
}

// View job details
function viewJobDetails(jobId) {
    const job = assignedJobs.find(j => j.id === jobId);
    if (job) {
        alert(`Job Details:\n\nID: ${job.id}\nTitle: ${job.title}\nCustomer: ${job.customer}\nAddress: ${job.address}\nTime: ${job.time}\nDuration: ${job.duration}\nStatus: ${job.status}\nPriority: ${job.priority}`);
    }
}

// Filter jobs
function filterJobs(status) {
    // Update active tab
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if ((status === 'all' && tab.textContent.includes('All')) ||
            tab.textContent.toLowerCase().includes(status)) {
            tab.classList.add('active');
        }
    });
    
    // Load filtered jobs
    loadAssignedJobs(status);
}

// Update job counts
function updateJobCounts() {
    const myJobs = assignedJobs.filter(job => job.assignedTo === staffData.id);
    
    document.getElementById('countAll').textContent = myJobs.length;
    document.getElementById('countPending').textContent = myJobs.filter(j => j.status === 'pending').length;
    document.getElementById('countScheduled').textContent = myJobs.filter(j => j.status === 'scheduled').length;
    document.getElementById('countCompleted').textContent = myJobs.filter(j => j.status === 'completed').length;
}

// Notification System
function showNotification(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}" style="font-size: 20px;"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(20px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Export functions for HTML onclick handlers
window.toggleMobileSidebar = toggleMobileSidebar;
window.toggleClockInOut = toggleClockInOut;
window.showCheckInModal = showCheckInModal;
window.showUpdateModal = showUpdateModal;
window.startBreak = startBreak;
window.completeJob = completeJob;
window.pauseJob = pauseJob;
window.filterJobs = filterJobs;
window.viewJobDetails = viewJobDetails;
