// Staff Jobs List JavaScript

// Current staff member
const currentStaff = {
    id: 'STAFF-001',
    name: 'John Smith'
};

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

// Sample jobs data - in production, this would come from API filtered by assignedTo
const allJobs = [
    {
        id: 'JOB-2024-124',
        title: 'Garden Maintenance',
        description: 'Regular garden maintenance including mowing, trimming, and weeding',
        customer: 'Michael Chen',
        customerPhone: '+61 400 123 456',
        customerEmail: 'michael@email.com',
        time: '9:00 AM',
        duration: '2.5 hrs',
        address: '456 Oak Ave, Melbourne VIC 3000',
        priority: 'normal',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        dueDate: new Date().toISOString().split('T')[0],
        estimatedPay: 75,
        notes: 'Customer requests front yard focus'
    },
    {
        id: 'JOB-2024-125',
        title: 'Pool Cleaning & Maintenance',
        description: 'Complete pool cleaning, chemical balance check, and filter maintenance',
        customer: 'Emma Wilson',
        customerPhone: '+61 400 234 567',
        customerEmail: 'emma@email.com',
        time: '11:30 AM',
        duration: '1.5 hrs',
        address: '789 Beach Rd, Brighton VIC 3186',
        priority: 'normal',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        dueDate: new Date().toISOString().split('T')[0],
        estimatedPay: 85,
        notes: 'Pool equipment in garage'
    },
    {
        id: 'JOB-2024-126',
        title: 'Emergency Plumbing Repair',
        description: 'Fix leaking pipe in kitchen',
        customer: 'David Brown',
        customerPhone: '+61 400 345 678',
        customerEmail: 'david@email.com',
        time: '2:00 PM',
        duration: '1 hr',
        address: '321 Hill St, Richmond VIC 3121',
        priority: 'urgent',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        dueDate: new Date().toISOString().split('T')[0],
        estimatedPay: 120,
        notes: 'URGENT - Water leak active'
    },
    {
        id: 'JOB-2024-127',
        title: 'Home Deep Cleaning',
        description: '3-bedroom house deep clean',
        customer: 'Lisa Anderson',
        customerPhone: '+61 400 456 789',
        customerEmail: 'lisa@email.com',
        time: '8:00 AM',
        duration: '3 hrs',
        address: '555 Park Lane, Hawthorn VIC 3122',
        priority: 'high',
        status: 'in_progress',
        assignedTo: 'STAFF-001',
        dueDate: new Date().toISOString().split('T')[0],
        estimatedPay: 150,
        notes: 'Keys under mat'
    },
    {
        id: 'JOB-2024-123',
        title: 'Lawn Mowing Service',
        description: 'Front and back yard mowing',
        customer: 'Robert Smith',
        customerPhone: '+61 400 567 890',
        customerEmail: 'robert@email.com',
        time: '7:30 AM',
        duration: '1 hr',
        address: '222 Green St, Kew VIC 3101',
        priority: 'low',
        status: 'completed',
        assignedTo: 'STAFF-001',
        dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        estimatedPay: 60,
        notes: 'Job completed successfully'
    },
    {
        id: 'JOB-2024-128',
        title: 'Window Cleaning - Commercial',
        description: 'Office building window cleaning',
        customer: 'ABC Corporation',
        customerPhone: '+61 3 9000 0000',
        customerEmail: 'admin@abc.com',
        time: '1:00 PM',
        duration: '2 hrs',
        address: '100 Business St, CBD VIC 3000',
        priority: 'normal',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        estimatedPay: 180,
        notes: 'Access via loading dock'
    },
    {
        id: 'JOB-2024-129',
        title: 'Gutter Cleaning',
        description: 'Clean gutters and downpipes',
        customer: 'Patricia Taylor',
        customerPhone: '+61 400 678 901',
        customerEmail: 'patricia@email.com',
        time: '10:00 AM',
        duration: '1.5 hrs',
        address: '888 Valley Rd, Camberwell VIC 3124',
        priority: 'normal',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        estimatedPay: 95,
        notes: 'Two-story house'
    },
    {
        id: 'JOB-2024-130',
        title: 'Carpet Steam Cleaning',
        description: 'Steam clean all carpets in 2BR apartment',
        customer: 'James Wilson',
        customerPhone: '+61 400 789 012',
        customerEmail: 'james@email.com',
        time: '3:00 PM',
        duration: '2 hrs',
        address: '45 Tower Ave, Southbank VIC 3006',
        priority: 'normal',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        estimatedPay: 110,
        notes: 'Apartment 1205, building entry code: 1234'
    },
    {
        id: 'JOB-2024-121',
        title: 'Pressure Washing - Driveway',
        description: 'Pressure wash driveway and pathways',
        customer: 'Sarah Mitchell',
        customerPhone: '+61 400 890 123',
        customerEmail: 'sarah@email.com',
        time: '9:00 AM',
        duration: '2 hrs',
        address: '77 Stone St, Malvern VIC 3144',
        priority: 'low',
        status: 'completed',
        assignedTo: 'STAFF-001',
        dueDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        estimatedPay: 130,
        notes: 'Customer very satisfied'
    },
    {
        id: 'JOB-2024-122',
        title: 'Air Conditioning Service',
        description: 'AC unit maintenance and filter replacement',
        customer: 'Tom Harris',
        customerPhone: '+61 400 901 234',
        customerEmail: 'tom@email.com',
        time: '2:30 PM',
        duration: '1 hr',
        address: '333 Summer Dr, St Kilda VIC 3182',
        priority: 'high',
        status: 'completed',
        assignedTo: 'STAFF-001',
        dueDate: new Date(Date.now() - 259200000).toISOString().split('T')[0],
        estimatedPay: 95,
        notes: 'Replaced filters'
    },
    {
        id: 'JOB-2024-131',
        title: 'Fence Repair',
        description: 'Repair damaged fence panels',
        customer: 'Jennifer Lee',
        customerPhone: '+61 400 012 345',
        customerEmail: 'jennifer@email.com',
        time: '11:00 AM',
        duration: '3 hrs',
        address: '199 Border St, Preston VIC 3072',
        priority: 'high',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        dueDate: new Date(Date.now() + 345600000).toISOString().split('T')[0],
        estimatedPay: 200,
        notes: 'Materials provided by customer'
    },
    {
        id: 'JOB-2024-120',
        title: 'Office Cleaning',
        description: 'Regular office cleaning service',
        customer: 'XYZ Business',
        customerPhone: '+61 3 9111 1111',
        customerEmail: 'office@xyz.com',
        time: '6:00 PM',
        duration: '2 hrs',
        address: '500 Corporate Blvd, Docklands VIC 3008',
        priority: 'low',
        status: 'completed',
        assignedTo: 'STAFF-001',
        dueDate: new Date(Date.now() - 345600000).toISOString().split('T')[0],
        estimatedPay: 140,
        notes: 'After-hours access'
    }
];

// Filter state
let currentFilter = {
    status: 'all',
    search: '',
    sort: 'date_desc',
    view: 'list' // 'list' or 'grid'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadJobs();
    setupEventListeners();
    
    // Close sidebar when clicking nav items on mobile
    const navItems = document.querySelectorAll('.sidebar .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            setTimeout(() => closeMobileSidebar(), 100);
        });
    });
});

function initializePage() {
    // Set staff name
    document.getElementById('staffName').textContent = currentStaff.name;
    
    // Initialize banner close
    const closeBtn = document.querySelector('.banner-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.querySelector('.limited-offer-banner').style.display = 'none';
        });
    }
    
    // Load saved view preference
    const savedView = localStorage.getItem('staffJobsView');
    if (savedView) {
        currentFilter.view = savedView;
        const buttons = document.querySelectorAll('.view-toggle button');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase().includes(savedView)) {
                btn.classList.add('active');
            }
        });
    }
    
    // Update stats
    updateStats();
}

function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(function(e) {
        currentFilter.search = e.target.value.toLowerCase();
        loadJobs();
    }, 300));
    
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', function(e) {
        currentFilter.sort = e.target.value;
        loadJobs();
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Load and display jobs
function loadJobs() {
    const jobsList = document.getElementById('jobsList');
    const emptyState = document.getElementById('emptyState');
    
    // Filter jobs assigned to this staff
    let filteredJobs = allJobs.filter(job => job.assignedTo === currentStaff.id);
    
    // Apply status filter
    if (currentFilter.status !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.status === currentFilter.status);
    }
    
    // Apply search filter
    if (currentFilter.search) {
        filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(currentFilter.search) ||
            job.customer.toLowerCase().includes(currentFilter.search) ||
            job.id.toLowerCase().includes(currentFilter.search) ||
            job.address.toLowerCase().includes(currentFilter.search)
        );
    }
    
    // Apply sorting
    filteredJobs = sortJobs(filteredJobs, currentFilter.sort);
    
    // Update results count
    document.getElementById('resultsCount').textContent = 
        filteredJobs.length === 0 ? 'No jobs found' :
        filteredJobs.length === 1 ? 'Showing 1 job' :
        `Showing ${filteredJobs.length} jobs`;
    
    // Show/hide empty state
    if (filteredJobs.length === 0) {
        jobsList.innerHTML = '';
        jobsList.className = currentFilter.view === 'grid' ? 'grid-view' : 'list-view';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Set view class
    jobsList.className = currentFilter.view === 'grid' ? 'grid-view' : 'list-view';
    
    // Render jobs based on view
    if (currentFilter.view === 'grid') {
        jobsList.innerHTML = filteredJobs.map(job => createJobCardGrid(job)).join('');
    } else {
        jobsList.innerHTML = filteredJobs.map(job => createJobCard(job)).join('');
    }
}

// Sort jobs
function sortJobs(jobs, sortType) {
    const sorted = [...jobs];
    
    switch(sortType) {
        case 'date_asc':
            return sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        case 'date_desc':
            return sorted.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        case 'priority':
            const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
            return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        case 'customer':
            return sorted.sort((a, b) => a.customer.localeCompare(b.customer));
        default:
            return sorted;
    }
}

// Create job card HTML
function createJobCard(job) {
    const priorityClass = `priority-${job.priority}`;
    const statusClass = job.status.replace('_', '');
    
    const priorityLabels = {
        'urgent': 'URGENT',
        'high': 'High Priority',
        'normal': 'Normal',
        'low': 'Low Priority'
    };
    
    const statusLabels = {
        'scheduled': 'Scheduled',
        'in_progress': 'In Progress',
        'on_hold': 'On Hold',
        'completed': 'Completed',
        'canceled': 'Canceled'
    };
    
    // Format date
    const dueDate = new Date(job.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(job.dueDate);
    due.setHours(0, 0, 0, 0);
    
    let dateLabel = '';
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) dateLabel = 'Today';
    else if (diffDays === 1) dateLabel = 'Tomorrow';
    else if (diffDays === -1) dateLabel = 'Yesterday';
    else if (diffDays > 1) dateLabel = `In ${diffDays} days`;
    else if (diffDays < -1) dateLabel = `${Math.abs(diffDays)} days ago`;
    
    // Action buttons based on status
    let actions = '';
    if (job.status === 'scheduled') {
        actions = `
            <div class="job-actions">
                <button class="job-action-btn success" onclick="startJob('${job.id}'); event.stopPropagation();">
                    <i class="fas fa-play"></i> Start Job
                </button>
                <button class="job-action-btn secondary" onclick="viewJobDetails('${job.id}'); event.stopPropagation();">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        `;
    } else if (job.status === 'in_progress') {
        actions = `
            <div class="job-actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="job-action-btn success" onclick="completeJob('${job.id}'); event.stopPropagation();" style="flex: 2; min-width: 120px;">
                    <i class="fas fa-check-circle"></i> <span>Complete Job</span>
                </button>
                <button class="job-action-btn" style="background: #f59e0b; color: white; flex: 1.5; min-width: 100px;" onclick="openOnHoldModal('${job.id}'); event.stopPropagation();">
                    <i class="fas fa-pause"></i> <span>On Hold</span>
                </button>
                <button class="job-action-btn" style="background: #ef4444; color: white; flex: 1.5; min-width: 120px;" onclick="openCannotCompleteModal('${job.id}'); event.stopPropagation();">
                    <i class="fas fa-times-circle"></i> <span>Cannot Complete</span>
                </button>
            </div>
        `;
    } else if (job.status === 'on_hold') {
        actions = `
            <div class="job-actions">
                <button class="job-action-btn success" onclick="resumeJob('${job.id}'); event.stopPropagation();">
                    <i class="fas fa-play"></i> Resume
                </button>
                <button class="job-action-btn secondary" onclick="viewHoldReason('${job.id}'); event.stopPropagation();">
                    <i class="fas fa-info-circle"></i> View Reason
                </button>
            </div>
        `;
    } else if (job.status === 'completed') {
        actions = `
            <div class="job-actions">
                <button class="job-action-btn secondary" onclick="viewJobDetails('${job.id}'); event.stopPropagation();">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        `;
    }
    
    return `
        <div class="job-card ${priorityClass}" onclick="viewJobDetails('${job.id}')">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
                        <span class="status-badge ${statusClass}">${statusLabels[job.status]}</span>
                        <span class="priority-badge ${job.priority}">${priorityLabels[job.priority]}</span>
                        ${job.status !== 'completed' ? `
                            <span style="display: flex; align-items: center; gap: 4px; color: #6b7280; font-size: 12px; font-weight: 500;">
                                <i class="fas fa-calendar"></i> ${dateLabel}
                            </span>
                        ` : ''}
                    </div>
                    <h4 style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 6px;">${job.title}</h4>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">${job.customer} • ${job.id}</p>
                    <p style="color: #9ca3af; font-size: 13px;">${job.description}</p>
                </div>
                <div style="text-align: right; min-width: 80px;">
                    <div style="font-size: 20px; font-weight: 700; color: #10b981; margin-bottom: 4px;">$${job.estimatedPay}</div>
                    <div style="font-size: 11px; color: #6b7280; text-transform: uppercase;">Est. Pay</div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; padding: 12px 0; border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-map-marker-alt" style="color: #ef4444; width: 16px;"></i>
                    <span style="color: #374151; font-size: 13px;">${job.address}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-clock" style="color: #3b82f6; width: 16px;"></i>
                    <span style="color: #374151; font-size: 13px;">${job.time} • ${job.duration}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-phone" style="color: #10b981; width: 16px;"></i>
                    <span style="color: #374151; font-size: 13px;">${job.customerPhone}</span>
                </div>
            </div>
            
            ${job.notes ? `
                <div style="margin-top: 12px; padding: 10px; background: #f9fafb; border-radius: 6px; border-left: 3px solid #6366f1;">
                    <div style="display: flex; align-items: start; gap: 8px;">
                        <i class="fas fa-sticky-note" style="color: #6366f1; margin-top: 2px;"></i>
                        <span style="color: #374151; font-size: 13px;">${job.notes}</span>
                    </div>
                </div>
            ` : ''}
            
            ${actions}
        </div>
    `;
}

// Create job card HTML for GRID view
function createJobCardGrid(job) {
    const statusClass = job.status.replace('_', '');
    
    const priorityLabels = {
        'urgent': 'URGENT',
        'high': 'High Priority',
        'normal': 'Normal',
        'low': 'Low Priority'
    };
    
    const statusLabels = {
        'scheduled': 'Scheduled',
        'in_progress': 'In Progress',
        'on_hold': 'On Hold',
        'completed': 'Completed',
        'canceled': 'Canceled'
    };
    
    // Format date
    const dueDate = new Date(job.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(job.dueDate);
    due.setHours(0, 0, 0, 0);
    
    let dateLabel = '';
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) dateLabel = 'Today';
    else if (diffDays === 1) dateLabel = 'Tomorrow';
    else if (diffDays === -1) dateLabel = 'Yesterday';
    else if (diffDays > 1) dateLabel = `In ${diffDays} days`;
    else if (diffDays < -1) dateLabel = `${Math.abs(diffDays)} days ago`;
    
    // Action buttons based on status
    let actions = '';
    if (job.status === 'scheduled') {
        actions = `
            <button class="job-action-btn success" onclick="startJob('${job.id}'); event.stopPropagation();" style="flex: 1;">
                <i class="fas fa-play"></i> Start
            </button>
            <button class="job-action-btn secondary" onclick="viewJobDetails('${job.id}'); event.stopPropagation();" style="flex: 1;">
                <i class="fas fa-eye"></i> Details
            </button>
        `;
    } else if (job.status === 'in_progress') {
        actions = `
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                <button class="job-action-btn success" onclick="completeJob('${job.id}'); event.stopPropagation();" style="flex: 2; min-width: 100px;">
                    <i class="fas fa-check-circle"></i> <span>Complete</span>
                </button>
                <button class="job-action-btn" style="background: #f59e0b; color: white; flex: 1.5; min-width: 90px;" onclick="openOnHoldModal('${job.id}'); event.stopPropagation();">
                    <i class="fas fa-pause"></i> <span>On Hold</span>
                </button>
                <button class="job-action-btn" style="background: #ef4444; color: white; flex: 1.5; min-width: 100px;" onclick="openCannotCompleteModal('${job.id}'); event.stopPropagation();">
                    <i class="fas fa-times-circle"></i> <span>Cannot Complete</span>
                </button>
            </div>
        `;
    } else if (job.status === 'on_hold') {
        actions = `
            <button class="job-action-btn success" onclick="resumeJob('${job.id}'); event.stopPropagation();" style="flex: 1;">
                <i class="fas fa-play"></i> Resume
            </button>
            <button class="job-action-btn secondary" onclick="viewHoldReason('${job.id}'); event.stopPropagation();" style="flex: 1;">
                <i class="fas fa-info-circle"></i> Reason
            </button>
        `;
    } else if (job.status === 'completed') {
        actions = `
            <button class="job-action-btn secondary" onclick="viewJobDetails('${job.id}'); event.stopPropagation();" style="flex: 1;">
                <i class="fas fa-eye"></i> View Details
            </button>
        `;
    }
    
    return `
        <div class="job-card-grid" onclick="viewJobDetails('${job.id}')">
            <div class="priority-indicator ${job.priority}"></div>
            
            <div class="card-header">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                    <span class="status-badge ${statusClass}">${statusLabels[job.status]}</span>
                    <span class="priority-badge ${job.priority}">${priorityLabels[job.priority]}</span>
                </div>
                
                <h3 style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; line-height: 1.3;">
                    ${job.title}
                </h3>
                
                <div style="display: flex; align-items: center; gap: 8px; color: #6b7280; font-size: 13px;">
                    <i class="fas fa-user"></i>
                    <span>${job.customer}</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px; color: #6b7280; font-size: 12px; margin-top: 4px;">
                    <i class="fas fa-hashtag"></i>
                    <span>${job.id}</span>
                    ${job.status !== 'completed' ? `
                        <span style="margin-left: auto; display: flex; align-items: center; gap: 4px; color: #f59e0b; font-weight: 600;">
                            <i class="fas fa-calendar"></i> ${dateLabel}
                        </span>
                    ` : ''}
                </div>
            </div>
            
            <div class="card-body">
                <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
                    ${job.description}
                </p>
                
                <div class="info-row">
                    <i class="fas fa-map-marker-alt" style="color: #ef4444;"></i>
                    <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${job.address.split(',')[0]}</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div class="info-row">
                        <i class="fas fa-clock" style="color: #3b82f6;"></i>
                        <span>${job.time}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-hourglass-half" style="color: #9333ea;"></i>
                        <span>${job.duration}</span>
                    </div>
                </div>
                
                ${job.notes ? `
                    <div class="notes-box">
                        <i class="fas fa-sticky-note" style="margin-right: 6px;"></i>${job.notes}
                    </div>
                ` : ''}
                
                <div class="pay-badge">
                    <i class="fas fa-dollar-sign"></i>
                    <span>${job.estimatedPay}</span>
                    <span style="font-size: 11px; font-weight: 500; opacity: 0.8;">EST.</span>
                </div>
            </div>
            
            <div class="card-footer">
                ${actions}
            </div>
        </div>
    `;
}

// Update statistics
function updateStats() {
    const myJobs = allJobs.filter(job => job.assignedTo === currentStaff.id);
    
    document.getElementById('statTotal').textContent = myJobs.length;
    document.getElementById('statScheduled').textContent = myJobs.filter(j => j.status === 'scheduled').length;
    document.getElementById('statInProgress').textContent = myJobs.filter(j => j.status === 'in_progress').length;
    document.getElementById('statOnHold').textContent = myJobs.filter(j => j.status === 'on_hold').length;
    document.getElementById('statCompleted').textContent = myJobs.filter(j => j.status === 'completed').length;
}

// Filter by status
function filterByStatus(status) {
    currentFilter.status = status;
    
    // Update active button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        const btnText = btn.textContent.trim().toLowerCase();
        if ((status === 'all' && btnText.includes('all')) ||
            btnText.includes(status.replace('_', ' '))) {
            btn.classList.add('active');
        }
    });
    
    loadJobs();
}

// Clear all filters
function clearFilters() {
    currentFilter = {
        status: 'all',
        search: '',
        sort: 'date_desc'
    };
    
    document.getElementById('searchInput').value = '';
    document.getElementById('sortSelect').value = 'date_desc';
    
    // Reset filter buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    buttons[0].classList.add('active'); // Activate "All Jobs"
    
    loadJobs();
}

// View toggle
function setView(viewType) {
    currentFilter.view = viewType;
    
    // Update active button
    const buttons = document.querySelectorAll('.view-toggle button');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Find and activate the correct button
    buttons.forEach(btn => {
        const btnText = btn.textContent.toLowerCase();
        if (btnText.includes(viewType)) {
            btn.classList.add('active');
        }
    });
    
    // Save preference to localStorage
    localStorage.setItem('staffJobsView', viewType);
    
    // Reload jobs with new view
    loadJobs();
    
    showNotification(`Switched to ${viewType} view`, 'info');
}

// ============================================================================
// JOB ACTIONS - Enhanced with Modals
// ============================================================================

// Current job being worked on
let currentJobId = null;

// Photo storage
let beforePhotos = [];
let afterPhotos = [];
let cannotCompletePhotos = [];

// Signature pad
let signaturePad = null;
let isDrawing = false;

// Start Job
function startJob(jobId) {
    event.stopPropagation();
    const job = allJobs.find(j => j.id === jobId);
    if (job) {
        if (confirm(`Start working on: ${job.title}?`)) {
            job.status = 'in_progress';
            loadJobs();
            updateStats();
            showNotification(`Started ${job.title}`, 'success');
        }
    }
}

// Complete Job - Open Modal
function completeJob(jobId) {
    event.stopPropagation();
    currentJobId = jobId;
    const job = allJobs.find(j => j.id === jobId);
    if (job) {
        // Reset form
        beforePhotos = [];
        afterPhotos = [];
        document.getElementById('beforePreview').innerHTML = '';
        document.getElementById('afterPreview').innerHTML = '';
        document.getElementById('workSummary').value = '';
        document.getElementById('hoursSpent').value = '0';
        document.getElementById('minutesSpent').value = '0';
        document.getElementById('materialsUsed').value = '';
        
        // Show modal
        document.getElementById('completeJobModal').classList.add('active');
    }
}

// Close Complete Job Modal
function closeCompleteJobModal() {
    document.getElementById('completeJobModal').classList.remove('active');
    currentJobId = null;
}

// Initialize Signature Pad
function initializeSignaturePad() {
    const canvas = document.getElementById('signaturePad');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Setup drawing
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    
    canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mouseout', () => drawing = false);
    
    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        drawing = true;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!drawing) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        [lastX, lastY] = [x, y];
    });
    
    canvas.addEventListener('touchend', () => drawing = false);
}

// Clear Signature
function clearSignature() {
    const canvas = document.getElementById('signaturePad');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Handle Photo Upload
function handlePhotoUpload(input, type) {
    const files = Array.from(input.files);
    const previewContainer = document.getElementById(`${type}Preview`);
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Store photo
            if (type === 'before') {
                beforePhotos.push(e.target.result);
            } else if (type === 'after') {
                afterPhotos.push(e.target.result);
            } else if (type === 'cannot_complete') {
                cannotCompletePhotos.push(e.target.result);
            }
            
            // Create preview
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-preview-item';
            photoItem.innerHTML = `
                <img src="${e.target.result}" alt="Photo">
                <button class="remove-photo" onclick="removePhoto('${type}', ${type === 'before' ? beforePhotos.length - 1 : type === 'after' ? afterPhotos.length - 1 : cannotCompletePhotos.length - 1})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            previewContainer.appendChild(photoItem);
        };
        reader.readAsDataURL(file);
    });
}

// Remove Photo
function removePhoto(type, index) {
    if (type === 'before') {
        beforePhotos.splice(index, 1);
        document.getElementById('beforePreview').innerHTML = '';
        beforePhotos.forEach((photo, i) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-preview-item';
            photoItem.innerHTML = `
                <img src="${photo}" alt="Photo">
                <button class="remove-photo" onclick="removePhoto('before', ${i})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            document.getElementById('beforePreview').appendChild(photoItem);
        });
    } else if (type === 'after') {
        afterPhotos.splice(index, 1);
        document.getElementById('afterPreview').innerHTML = '';
        afterPhotos.forEach((photo, i) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-preview-item';
            photoItem.innerHTML = `
                <img src="${photo}" alt="Photo">
                <button class="remove-photo" onclick="removePhoto('after', ${i})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            document.getElementById('afterPreview').appendChild(photoItem);
        });
    } else if (type === 'cannot_complete') {
        cannotCompletePhotos.splice(index, 1);
        document.getElementById('cannotCompletePreview').innerHTML = '';
        cannotCompletePhotos.forEach((photo, i) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-preview-item';
            photoItem.innerHTML = `
                <img src="${photo}" alt="Photo">
                <button class="remove-photo" onclick="removePhoto('cannot_complete', ${i})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            document.getElementById('cannotCompletePreview').appendChild(photoItem);
        });
    }
}

// Submit Job Completion
function submitJobCompletion() {
    const job = allJobs.find(j => j.id === currentJobId);
    if (!job) return;
    
    // Validate - Time Spent is required
    const hours = parseInt(document.getElementById('hoursSpent').value) || 0;
    const minutes = parseInt(document.getElementById('minutesSpent').value) || 0;
    
    if (hours === 0 && minutes === 0) {
        showNotification('Please enter time spent on the job', 'error');
        return;
    }
    
    // Work Summary is optional
    const workSummary = document.getElementById('workSummary').value.trim();
    
    // Save completion data
    job.status = 'completed';
    job.completionData = {
        beforePhotos: beforePhotos,
        afterPhotos: afterPhotos,
        workSummary: workSummary || '',
        timeSpent: { hours, minutes },
        materialsUsed: document.getElementById('materialsUsed').value || '',
        completedAt: new Date().toISOString(),
        completedBy: currentStaff.id
    };
    
    // Update UI
    loadJobs();
    updateStats();
    closeCompleteJobModal();
    showNotification(`Job completed successfully! 🎉`, 'success');
}

// ============================================================================
// ON HOLD WORKFLOW
// ============================================================================

function openOnHoldModal(jobId) {
    event.stopPropagation();
    currentJobId = jobId;
    
    // Reset form
    document.getElementById('holdReason').value = '';
    document.getElementById('holdNotes').value = '';
    document.getElementById('resumeDate').value = '';
    
    // Show modal
    document.getElementById('onHoldModal').classList.add('active');
}

function closeOnHoldModal() {
    document.getElementById('onHoldModal').classList.remove('active');
    currentJobId = null;
}

function submitOnHold() {
    const job = allJobs.find(j => j.id === currentJobId);
    if (!job) return;
    
    const reason = document.getElementById('holdReason').value;
    const notes = document.getElementById('holdNotes').value.trim();
    const resumeDate = document.getElementById('resumeDate').value;
    
    if (!reason) {
        showNotification('Please select a reason', 'error');
        return;
    }
    
    if (!notes) {
        showNotification('Please provide details', 'error');
        return;
    }
    
    // Save on hold data
    job.status = 'on_hold';
    job.onHoldData = {
        reason: reason,
        notes: notes,
        resumeDate: resumeDate,
        putOnHoldAt: new Date().toISOString(),
        putOnHoldBy: currentStaff.id
    };
    
    // Update UI
    loadJobs();
    updateStats();
    closeOnHoldModal();
    
    const reasonText = document.getElementById('holdReason').selectedOptions[0].text;
    showNotification(`Job put on hold: ${reasonText}`, 'warning');
}

function resumeJob(jobId) {
    event.stopPropagation();
    const job = allJobs.find(j => j.id === jobId);
    if (job) {
        if (confirm(`Resume job: ${job.title}?`)) {
            job.status = 'in_progress';
            loadJobs();
            updateStats();
            showNotification(`Resumed ${job.title}`, 'success');
        }
    }
}

function viewHoldReason(jobId) {
    event.stopPropagation();
    const job = allJobs.find(j => j.id === jobId);
    if (job && job.onHoldData) {
        const reasonLabel = {
            'customer_unavailable': '🏠 Customer Not Available',
            'weather': '🌧️ Weather Conditions',
            'missing_parts': '🔧 Missing Parts/Equipment',
            'awaiting_approval': '📞 Awaiting Customer Approval',
            'safety_concern': '🚨 Safety Concern',
            'access_issue': '🔒 Access Issue',
            'other': '📝 Other'
        };
        
        alert(`ON HOLD REASON\n━━━━━━━━━━━━━━━━━━━━━\n\nReason: ${reasonLabel[job.onHoldData.reason]}\n\nDetails:\n${job.onHoldData.notes}\n\n${job.onHoldData.resumeDate ? `Expected Resume: ${job.onHoldData.resumeDate}` : ''}`);
    }
}

// ============================================================================
// CANNOT COMPLETE WORKFLOW
// ============================================================================

function openCannotCompleteModal(jobId) {
    event.stopPropagation();
    currentJobId = jobId;
    
    // Reset form
    cannotCompletePhotos = [];
    document.getElementById('cannotCompleteReason').value = '';
    document.getElementById('cannotCompleteDetails').value = '';
    document.getElementById('cannotCompletePreview').innerHTML = '';
    
    // Show modal
    document.getElementById('cannotCompleteModal').classList.add('active');
}

function closeCannotCompleteModal() {
    document.getElementById('cannotCompleteModal').classList.remove('active');
    currentJobId = null;
}

function submitCannotComplete() {
    const job = allJobs.find(j => j.id === currentJobId);
    if (!job) return;
    
    const reason = document.getElementById('cannotCompleteReason').value;
    const details = document.getElementById('cannotCompleteDetails').value.trim();
    
    if (!reason) {
        showNotification('Please select a reason', 'error');
        return;
    }
    
    if (!details) {
        showNotification('Please provide detailed explanation', 'error');
        return;
    }
    
    // Save cannot complete data
    job.status = 'canceled'; // Or create new status 'cannot_complete'
    job.cannotCompleteData = {
        reason: reason,
        details: details,
        photos: cannotCompletePhotos,
        reportedAt: new Date().toISOString(),
        reportedBy: currentStaff.id
    };
    
    // Update UI
    loadJobs();
    updateStats();
    closeCannotCompleteModal();
    
    const reasonText = document.getElementById('cannotCompleteReason').selectedOptions[0].text;
    showNotification(`Manager notified: ${reasonText}`, 'info');
}

// ============================================================================
// JOB DETAILS MODAL
// ============================================================================

function viewJobDetails(jobId) {
    // Navigate to job detail page
    window.location.href = `job_detail.html?id=${jobId}`;
}

// Notification system
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
        animation: slideInRight 0.3s ease-out;
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

// Add animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
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
window.filterByStatus = filterByStatus;
window.toggleMobileSidebar = toggleMobileSidebar;
window.clearFilters = clearFilters;
window.setView = setView;
window.startJob = startJob;
window.completeJob = completeJob;
window.viewJobDetails = viewJobDetails;

// Export new modal functions
window.closeCompleteJobModal = closeCompleteJobModal;
window.handlePhotoUpload = handlePhotoUpload;
window.removePhoto = removePhoto;
window.submitJobCompletion = submitJobCompletion;

window.openOnHoldModal = openOnHoldModal;
window.closeOnHoldModal = closeOnHoldModal;
window.submitOnHold = submitOnHold;
window.resumeJob = resumeJob;
window.viewHoldReason = viewHoldReason;

window.openCannotCompleteModal = openCannotCompleteModal;
window.closeCannotCompleteModal = closeCannotCompleteModal;
window.submitCannotComplete = submitCannotComplete;

