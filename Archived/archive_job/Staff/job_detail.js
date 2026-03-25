// Staff Job Detail JavaScript

// Current staff member
const currentStaff = {
    id: 'STAFF-001',
    name: 'John Smith'
};

// Sample jobs data (same as jobs.js)
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
        notes: 'Customer requests front yard focus',
        quoteId: 'Q-2024-001',
        invoiceId: 'INV-2024-001',
        createdAt: '2024-11-18',
        updatedAt: '2024-11-19'
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
        notes: 'Pool equipment in garage',
        quoteId: 'Q-2024-002',
        invoiceId: 'INV-2024-002',
        createdAt: '2024-11-18',
        updatedAt: '2024-11-19'
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
        status: 'in_progress',
        assignedTo: 'STAFF-001',
        dueDate: new Date().toISOString().split('T')[0],
        estimatedPay: 120,
        notes: 'URGENT - Water leak active',
        quoteId: 'Q-2024-003',
        invoiceId: 'INV-2024-003',
        createdAt: '2024-11-19',
        updatedAt: new Date().toISOString().split('T')[0],
        completionData: {
            beforePhotos: [],
            afterPhotos: [],
            workSummary: 'Fixed the leaking pipe. Replaced damaged section.',
            timeSpent: { hours: 1, minutes: 15 },
            materialsUsed: 'Pipe section, connectors, sealant',
            signature: null,
            completedAt: new Date().toISOString(),
            completedBy: 'STAFF-001'
        }
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
        notes: 'Keys under mat',
        quoteId: 'Q-2024-004',
        invoiceId: 'INV-2024-004',
        createdAt: '2024-11-15',
        updatedAt: new Date().toISOString().split('T')[0]
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
        status: 'on_hold',
        assignedTo: 'STAFF-001',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        estimatedPay: 95,
        notes: 'Two-story house',
        quoteId: 'Q-2024-005',
        invoiceId: 'INV-2024-005',
        createdAt: '2024-11-17',
        updatedAt: new Date().toISOString().split('T')[0],
        onHoldData: {
            reason: 'customer_unavailable',
            notes: 'Customer was not home when we arrived. Left a note to reschedule.',
            resumeDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            putOnHoldAt: new Date().toISOString(),
            putOnHoldBy: 'STAFF-001'
        }
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
        notes: 'Job completed successfully',
        quoteId: 'Q-2024-006',
        invoiceId: 'INV-2024-006',
        createdAt: '2024-11-16',
        updatedAt: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        completionData: {
            beforePhotos: [],
            afterPhotos: [],
            workSummary: 'Completed lawn mowing for front and back yard',
            timeSpent: { hours: 1, minutes: 0 },
            materialsUsed: 'Lawn mower, trimmer',
            signature: null,
            completedAt: new Date(Date.now() - 86400000).toISOString(),
            completedBy: 'STAFF-001'
        }
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
        notes: 'Access via loading dock',
        quoteId: 'Q-2024-007',
        invoiceId: 'INV-2024-007',
        createdAt: '2024-11-18',
        updatedAt: '2024-11-19'
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
        notes: 'Apartment 1205, building entry code: 1234',
        quoteId: 'Q-2024-008',
        invoiceId: 'INV-2024-008',
        createdAt: '2024-11-18',
        updatedAt: '2024-11-19'
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
        notes: 'Customer very satisfied',
        quoteId: 'Q-2024-009',
        invoiceId: 'INV-2024-009',
        createdAt: '2024-11-14',
        updatedAt: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        completionData: {
            beforePhotos: [],
            afterPhotos: [],
            workSummary: 'Pressure washed driveway and all pathways. Excellent results.',
            timeSpent: { hours: 2, minutes: 0 },
            materialsUsed: 'Pressure washer, cleaning solution',
            signature: null,
            completedAt: new Date(Date.now() - 172800000).toISOString(),
            completedBy: 'STAFF-001'
        }
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
        notes: 'Replaced filters',
        quoteId: 'Q-2024-010',
        invoiceId: 'INV-2024-010',
        createdAt: '2024-11-13',
        updatedAt: new Date(Date.now() - 259200000).toISOString().split('T')[0],
        completionData: {
            beforePhotos: [],
            afterPhotos: [],
            workSummary: 'AC unit serviced and filters replaced. System running efficiently.',
            timeSpent: { hours: 1, minutes: 15 },
            materialsUsed: 'AC filters, cleaning supplies',
            signature: null,
            completedAt: new Date(Date.now() - 259200000).toISOString(),
            completedBy: 'STAFF-001'
        }
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
        notes: 'Materials provided by customer',
        quoteId: 'Q-2024-011',
        invoiceId: 'INV-2024-011',
        createdAt: '2024-11-18',
        updatedAt: '2024-11-19'
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
        notes: 'After-hours access',
        quoteId: 'Q-2024-012',
        invoiceId: 'INV-2024-012',
        createdAt: '2024-11-12',
        updatedAt: new Date(Date.now() - 345600000).toISOString().split('T')[0],
        completionData: {
            beforePhotos: [],
            afterPhotos: [],
            workSummary: 'Completed regular office cleaning service. All areas cleaned and sanitized.',
            timeSpent: { hours: 2, minutes: 0 },
            materialsUsed: 'Cleaning supplies, sanitizer',
            signature: null,
            completedAt: new Date(Date.now() - 345600000).toISOString(),
            completedBy: 'STAFF-001'
        }
    }
];

// Current job
let currentJob = null;

// Activity/Comments data
let activityFeed = [];
let currentTab = 'all';
let commentAttachments = [];
let mentionSuggestions = ['Manager', 'Team Leader', 'Customer'];

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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadJobFromURL();
    initializeCommentSystem();
    
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
    
    // Set staff initials
    const initials = currentStaff.name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('staffInitials').textContent = initials;
}

// Load job from URL parameter
function loadJobFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    let jobId = urlParams.get('id');
    
    // If no job ID provided, default to most recent job assigned to this staff
    if (!jobId) {
        const myJobs = allJobs.filter(j => j.assignedTo === currentStaff.id);
        if (myJobs.length > 0) {
            // Sort by updated date (most recent first) or created date
            myJobs.sort((a, b) => {
                const dateA = new Date(a.updatedAt || a.createdAt || 0);
                const dateB = new Date(b.updatedAt || b.createdAt || 0);
                return dateB - dateA;
            });
            // Default to most recent job
            jobId = myJobs[0].id;
            // Update URL without reload
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('id', jobId);
            window.history.replaceState({}, '', newUrl);
        } else {
            // No jobs assigned - show helpful message
            showNoJobSelected();
            return;
        }
    }
    
    // Find job
    const job = allJobs.find(j => j.id === jobId);
    
    if (!job) {
        showError('Job not found. Redirecting to jobs list...');
        setTimeout(() => {
            window.location.href = 'jobs.html';
        }, 2000);
        return;
    }
    
    // Check if job is assigned to this staff
    if (job.assignedTo !== currentStaff.id) {
        showError('You do not have access to this job. Redirecting to jobs list...');
        setTimeout(() => {
            window.location.href = 'jobs.html';
        }, 2000);
        return;
    }
    
    currentJob = job;
    displayJobDetails();
}

// Show "No Job Selected" state
function showNoJobSelected() {
    const contentWrapper = document.querySelector('.content-wrapper');
    if (!contentWrapper) return;
    
    contentWrapper.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; padding: 40px;">
            <div style="width: 120px; height: 120px; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                <i class="fas fa-briefcase" style="font-size: 48px; color: #9ca3af;"></i>
            </div>
            <h2 style="font-size: 24px; font-weight: 600; color: #111827; margin-bottom: 12px;">No Job Selected</h2>
            <p style="font-size: 16px; color: #6b7280; margin-bottom: 32px; max-width: 500px;">
                Please select a job from your jobs list to view its details.
            </p>
            <a href="jobs.html" class="action-btn success" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                <i class="fas fa-arrow-left"></i>
                Go to My Jobs
            </a>
        </div>
    `;
}

// Display job details
function displayJobDetails() {
    if (!currentJob) return;
    
    // Header
    const jobTitleEl = document.getElementById('jobTitle');
    if (jobTitleEl) jobTitleEl.textContent = currentJob.title;
    
    const jobIdDisplayEl = document.getElementById('jobIdDisplay');
    if (jobIdDisplayEl) jobIdDisplayEl.textContent = currentJob.id;
    
    // Job Information
    const detailJobIdEl = document.getElementById('detailJobId');
    if (detailJobIdEl) detailJobIdEl.textContent = currentJob.id;
    
    const detailServiceEl = document.getElementById('detailService');
    if (detailServiceEl) detailServiceEl.textContent = currentJob.title;
    
    const detailDescriptionEl = document.getElementById('detailDescription');
    if (detailDescriptionEl) detailDescriptionEl.textContent = currentJob.description;
    
    // Priority
    const priorityLabels = {
        'urgent': { text: 'URGENT', class: 'urgent' },
        'high': { text: 'High Priority', class: 'high' },
        'normal': { text: 'Normal', class: 'normal' },
        'low': { text: 'Low Priority', class: 'low' }
    };
    const priority = priorityLabels[currentJob.priority] || priorityLabels.normal;
    const detailPriorityEl = document.getElementById('detailPriority');
    if (detailPriorityEl) {
        detailPriorityEl.innerHTML = `<span class="priority-badge ${priority.class}">${priority.text}</span>`;
    }
    
    // Status
    const statusLabels = {
        'scheduled': 'Scheduled',
        'in_progress': 'In Progress',
        'on_hold': 'On Hold',
        'completed': 'Completed',
        'canceled': 'Canceled',
        'awaiting_cancellation': 'Awaiting Cancellation'
    };
    const statusClass = currentJob.status.replace('_', '');
    const detailStatusEl = document.getElementById('detailStatus');
    if (detailStatusEl) {
        detailStatusEl.innerHTML = `<span class="status-badge ${statusClass}">${statusLabels[currentJob.status]}</span>`;
    }
    
    // Schedule
    const dueDate = new Date(currentJob.dueDate);
    const detailScheduledDateEl = document.getElementById('detailScheduledDate');
    if (detailScheduledDateEl) {
        detailScheduledDateEl.textContent = dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    const detailScheduledTimeEl = document.getElementById('detailScheduledTime');
    if (detailScheduledTimeEl) detailScheduledTimeEl.textContent = currentJob.time;
    
    const detailDurationEl = document.getElementById('detailDuration');
    if (detailDurationEl) detailDurationEl.textContent = currentJob.duration;
    
    const detailEstimatedPayEl = document.getElementById('detailEstimatedPay');
    if (detailEstimatedPayEl) detailEstimatedPayEl.textContent = `$${currentJob.estimatedPay}`;
    
    // Notes
    const specialNotesEl = document.getElementById('specialNotes');
    const specialNotesSectionEl = document.getElementById('specialNotesSection');
    if (specialNotesSectionEl) {
        if (currentJob.notes && specialNotesEl) {
            specialNotesEl.textContent = currentJob.notes;
            specialNotesSectionEl.style.display = 'block';
        } else {
            specialNotesSectionEl.style.display = 'none';
        }
    }
    
    // Customer Information (check if elements exist - customerDetailsCard may be hidden)
    const detailCustomerNameEl = document.getElementById('detailCustomerName');
    if (detailCustomerNameEl) {
        detailCustomerNameEl.textContent = currentJob.customer;
    }
    
    const detailCustomerPhoneEl = document.getElementById('detailCustomerPhone');
    if (detailCustomerPhoneEl) {
        detailCustomerPhoneEl.textContent = currentJob.customerPhone;
        detailCustomerPhoneEl.href = `tel:${currentJob.customerPhone}`;
    }
    
    const detailCustomerEmailEl = document.getElementById('detailCustomerEmail');
    if (detailCustomerEmailEl) {
        detailCustomerEmailEl.textContent = currentJob.customerEmail;
        detailCustomerEmailEl.href = `mailto:${currentJob.customerEmail}`;
    }
    
    const detailAddressEl = document.getElementById('detailAddress');
    if (detailAddressEl) {
        detailAddressEl.textContent = currentJob.address;
    }
    
    // Quick Access Bar - Customer Information (Copyable)
    const quickCustomerNameEl = document.getElementById('quickCustomerName');
    if (quickCustomerNameEl) {
        quickCustomerNameEl.textContent = currentJob.customer || 'N/A';
    }
    
    const quickCustomerPhoneEl = document.getElementById('quickCustomerPhone');
    if (quickCustomerPhoneEl) {
        quickCustomerPhoneEl.textContent = currentJob.customerPhone || 'N/A';
    }
    
    const quickCustomerEmailEl = document.getElementById('quickCustomerEmail');
    if (quickCustomerEmailEl) {
        quickCustomerEmailEl.textContent = currentJob.customerEmail || 'N/A';
    }
    
    const quickAddressEl = document.getElementById('quickAddress');
    if (quickAddressEl) {
        quickAddressEl.textContent = currentJob.address || 'N/A';
    }
    
    // Sidebar
    const statusBadgeEl = document.getElementById('statusBadge');
    if (statusBadgeEl) {
        statusBadgeEl.textContent = statusLabels[currentJob.status];
        statusBadgeEl.className = `status-badge ${statusClass}`;
    }
    
    const createdDateEl = document.getElementById('createdDate');
    if (createdDateEl) {
        createdDateEl.textContent = currentJob.createdAt || 'N/A';
    }
    
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = currentJob.updatedAt || 'N/A';
    }
    
    // Optional elements (may not exist in all versions)
    const quoteIdEl = document.getElementById('quoteId');
    if (quoteIdEl) {
        quoteIdEl.textContent = currentJob.quoteId || 'N/A';
    }
    
    const invoiceIdEl = document.getElementById('invoiceId');
    if (invoiceIdEl) {
        invoiceIdEl.textContent = currentJob.invoiceId || 'N/A';
    }
    
    // Status-specific sections
    updateStatusBanner();
    updateQuickActions();
    
    // Show completion data if completed
    if (currentJob.status === 'completed' && currentJob.completionData) {
        displayCompletionData();
    } else {
        document.getElementById('completionDataSection').style.display = 'none';
    }
    
    // Show on hold data if on hold
    if (currentJob.status === 'on_hold' && currentJob.onHoldData) {
        displayOnHoldData();
    } else {
        document.getElementById('onHoldDataSection').style.display = 'none';
    }
    
    // Initialize and load activity/comments
    // Always initialize sample data when job is loaded
    initializeActivityFeed();
    // Load after a brief delay to ensure DOM is ready
    setTimeout(() => {
        loadActivityFeed();
    }, 150);
}

// Update primary action banner
function updateStatusBanner() {
    const banner = document.getElementById('primaryActionBanner');
    const icon = document.getElementById('statusIcon');
    const title = document.getElementById('statusTitle');
    const message = document.getElementById('statusMessage');
    const actionsContainer = document.getElementById('primaryActionContainer');
    
    // Reset banner classes
    banner.className = 'primary-action-banner';
    actionsContainer.innerHTML = '';
    
    switch(currentJob.status) {
        case 'scheduled':
            banner.classList.add('scheduled');
            icon.innerHTML = '<i class="fas fa-calendar-check" style="font-size: 28px; color: white;"></i>';
            title.textContent = 'Job is Scheduled';
            message.textContent = 'Ready to start when you arrive at location';
            actionsContainer.innerHTML = `
                <button class="primary-action-btn success" onclick="startJob()">
                    <i class="fas fa-play" style="font-size: 18px;"></i>
                    <span>Start Job</span>
                </button>
            `;
            break;
            
        case 'in_progress':
            banner.classList.add('in-progress');
            icon.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size: 28px; color: white;"></i>';
            title.textContent = 'Job in Progress';
            message.textContent = 'Complete the job when finished';
            actionsContainer.innerHTML = `
                <button class="primary-action-btn success" onclick="openCompleteModal()">
                    <i class="fas fa-check-circle" style="font-size: 18px;"></i>
                    <span>Complete Job</span>
                </button>
                <div class="secondary-actions">
                    <button class="secondary-action-btn warning" onclick="openOnHoldModal()">
                        <i class="fas fa-pause"></i>
                        <span>On Hold</span>
                    </button>
                    <button class="secondary-action-btn danger" onclick="openCannotCompleteModal()">
                        <i class="fas fa-times-circle"></i>
                        <span>Cannot Complete</span>
                    </button>
                </div>
            `;
            break;
            
        case 'on_hold':
            banner.classList.add('on-hold');
            icon.innerHTML = '<i class="fas fa-pause-circle" style="font-size: 28px; color: white;"></i>';
            title.textContent = 'Job is On Hold';
            message.textContent = 'This job has been paused';
            actionsContainer.innerHTML = `
                <button class="primary-action-btn success" onclick="resumeJob()">
                    <i class="fas fa-play" style="font-size: 18px;"></i>
                    <span>Resume Job</span>
                </button>
            `;
            break;
            
        case 'completed':
            banner.classList.add('completed');
            icon.innerHTML = '<i class="fas fa-check-circle" style="font-size: 28px; color: white;"></i>';
            title.textContent = 'Job Completed';
            message.textContent = 'This job has been successfully completed';
            actionsContainer.innerHTML = '';
            break;
            
        case 'canceled':
            banner.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            icon.innerHTML = '<i class="fas fa-times-circle" style="font-size: 28px; color: white;"></i>';
            title.textContent = 'Job Canceled';
            message.textContent = 'This job has been canceled';
            actionsContainer.innerHTML = '';
            break;
            
        case 'awaiting_cancellation':
            banner.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            icon.innerHTML = '<i class="fas fa-hourglass-half" style="font-size: 28px; color: white;"></i>';
            title.textContent = 'Awaiting Manager Decision';
            message.textContent = 'Manager has been notified. Waiting for cancellation confirmation.';
            actionsContainer.innerHTML = '';
            break;
    }
}

// Update quick actions sidebar
function updateQuickActions() {
    const container = document.getElementById('quickActionsContainer');
    container.innerHTML = '';
    
    switch(currentJob.status) {
        case 'scheduled':
            container.innerHTML = `
                <button class="action-btn success" onclick="startJob()" style="width: 100%;">
                    <i class="fas fa-play"></i> Start Job
                </button>
                <button class="action-btn danger" onclick="openRejectJobModal()" style="width: 100%;">
                    <i class="fas fa-times"></i> Reject Job
                </button>
            `;
            break;
            
        case 'in_progress':
            container.innerHTML = `
                <button class="action-btn success" onclick="openCompleteModal()" style="width: 100%; white-space: nowrap;">
                    <i class="fas fa-check-circle"></i> <span>Complete Job</span>
                </button>
                <button class="action-btn warning" onclick="openOnHoldModal()" style="width: 100%; white-space: nowrap;">
                    <i class="fas fa-pause"></i> <span>Put On Hold</span>
                </button>
                <button class="action-btn danger" onclick="openCannotCompleteModal()" style="width: 100%; white-space: nowrap;">
                    <i class="fas fa-times-circle"></i> <span>Cannot Complete</span>
                </button>
            `;
            break;
            
        case 'on_hold':
            container.innerHTML = `
                <button class="action-btn success" onclick="resumeJob()" style="width: 100%;">
                    <i class="fas fa-play"></i> Resume Job
                </button>
                <button class="action-btn secondary" onclick="viewHoldReason()" style="width: 100%;">
                    <i class="fas fa-info-circle"></i> View Hold Reason
                </button>
            `;
            break;
            
        case 'completed':
            container.innerHTML = `
                <a href="jobs.html" class="action-btn secondary" style="width: 100%; text-align: center; text-decoration: none;">
                    <i class="fas fa-arrow-left"></i> Back to Jobs
                </a>
            `;
            break;
            
        case 'awaiting_cancellation':
            container.innerHTML = `
                <div style="padding: 12px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; text-align: center;">
                    <i class="fas fa-hourglass-half" style="color: #f59e0b; margin-bottom: 8px; font-size: 24px;"></i>
                    <p style="font-size: 13px; color: #92400e; margin: 0; font-weight: 500;">Waiting for manager to confirm cancellation</p>
                </div>
            `;
            break;
    }
}

// Display completion data
function displayCompletionData() {
    const data = currentJob.completionData;
    document.getElementById('completionDataSection').style.display = 'block';
    
    document.getElementById('completionSummary').textContent = data.workSummary || 'No summary provided';
    
    const timeText = `${data.timeSpent.hours} hour${data.timeSpent.hours !== 1 ? 's' : ''} ${data.timeSpent.minutes} minute${data.timeSpent.minutes !== 1 ? 's' : ''}`;
    document.getElementById('completionTime').textContent = timeText;
    
    if (data.materialsUsed) {
        document.getElementById('completionMaterialsText').textContent = data.materialsUsed;
        document.getElementById('completionMaterials').style.display = 'block';
    } else {
        document.getElementById('completionMaterials').style.display = 'none';
    }
    
    // Display photos
    const photosContainer = document.getElementById('completionPhotos');
    photosContainer.innerHTML = '';
    
    if (data.afterPhotos && data.afterPhotos.length > 0) {
        data.afterPhotos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.innerHTML = `<img src="${photo}" alt="After photo ${index + 1}">`;
            photoItem.onclick = () => window.open(photo, '_blank');
            photosContainer.appendChild(photoItem);
        });
    } else {
        photosContainer.innerHTML = '<p style="color: #6b7280; font-size: 14px;">No photos uploaded</p>';
    }
    
    // Display signature
    if (data.signature) {
        document.getElementById('completionSignature').src = data.signature;
        document.getElementById('completionSignatureSection').style.display = 'block';
    } else {
        document.getElementById('completionSignatureSection').style.display = 'none';
    }
}

// Display on hold data
function displayOnHoldData() {
    const data = currentJob.onHoldData;
    document.getElementById('onHoldDataSection').style.display = 'block';
    
    const reasonLabels = {
        'customer_unavailable': '🏠 Customer Not Available',
        'weather': '🌧️ Weather Conditions',
        'missing_parts': '🔧 Missing Parts/Equipment',
        'awaiting_approval': '📞 Awaiting Customer Approval',
        'safety_concern': '🚨 Safety Concern',
        'access_issue': '🔒 Access Issue',
        'other': '📝 Other'
    };
    
    document.getElementById('holdReasonDisplay').textContent = reasonLabels[data.reason] || data.reason;
    document.getElementById('holdDetailsDisplay').textContent = data.notes;
    
    if (data.resumeDate) {
        const resumeDate = new Date(data.resumeDate);
        document.getElementById('holdResumeDateDisplay').textContent = 
            resumeDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('holdResumeDate').style.display = 'flex';
    } else {
        document.getElementById('holdResumeDate').style.display = 'none';
    }
}

// Job actions
function startJob() {
    // Validate status - can only start from scheduled
    if (currentJob.status !== 'scheduled') {
        showNotification('Job must be scheduled before starting', 'error');
        return;
    }
    
    if (confirm(`Start working on: ${currentJob.title}?`)) {
        currentJob.status = 'in_progress';
        currentJob.updatedAt = new Date().toISOString().split('T')[0];
        
        // Add activity
        addActivityItem({
            type: 'status',
            message: 'started the job',
            author: currentStaff.name,
            authorType: 'staff'
        });
        
        displayJobDetails();
        showNotification('Job started successfully', 'success');
    }
}

function resumeJob() {
    // Validate status - can only resume from on_hold
    if (currentJob.status !== 'on_hold') {
        showNotification('Job must be on hold before resuming', 'error');
        return;
    }
    
    if (confirm(`Resume job: ${currentJob.title}?`)) {
        currentJob.status = 'in_progress';
        currentJob.updatedAt = new Date().toISOString().split('T')[0];
        
        // Clear on hold data
        if (currentJob.onHoldData) {
            currentJob.onHoldData.resumedAt = new Date().toISOString();
            currentJob.onHoldData.resumedBy = currentStaff.id;
        }
        
        // Add activity
        addActivityItem({
            type: 'status',
            message: 'resumed the job',
            author: currentStaff.name,
            authorType: 'staff'
        });
        
        displayJobDetails();
        showNotification('Job resumed successfully', 'success');
    }
}

// Add Activity Item
function addActivityItem(item) {
    const activity = {
        ...item,
        timestamp: new Date().toISOString()
    };
    
    activityFeed.unshift(activity);
    
    if (!currentJob.comments) {
        currentJob.comments = [];
    }
    currentJob.comments.push(activity);
    
    loadActivityFeed();
}

function viewHoldReason() {
    if (currentJob.onHoldData) {
        const reasonLabels = {
            'customer_unavailable': '🏠 Customer Not Available',
            'weather': '🌧️ Weather Conditions',
            'missing_parts': '🔧 Missing Parts/Equipment',
            'awaiting_approval': '📞 Awaiting Customer Approval',
            'safety_concern': '🚨 Safety Concern',
            'access_issue': '🔒 Access Issue',
            'other': '📝 Other'
        };
        
        alert(`ON HOLD REASON\n━━━━━━━━━━━━━━━━━━━━━\n\nReason: ${reasonLabels[currentJob.onHoldData.reason]}\n\nDetails:\n${currentJob.onHoldData.notes}\n\n${currentJob.onHoldData.resumeDate ? `Expected Resume: ${currentJob.onHoldData.resumeDate}` : ''}`);
    }
}

// ============================================================================
// MODAL FUNCTIONS
// ============================================================================

// Photo storage
let beforePhotos = [];
let afterPhotos = [];
let cannotCompletePhotos = [];

// Open Complete Modal
function openCompleteModal() {
    if (!currentJob) return;
    
    // Validate status - can only complete from in_progress
    if (currentJob.status !== 'in_progress') {
        showNotification('Job must be in progress before completing', 'error');
        return;
    }
    
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

// Close Complete Job Modal
function closeCompleteJobModal() {
    document.getElementById('completeJobModal').classList.remove('active');
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
    if (!currentJob) return;
    
    // Validate status - can only complete from in_progress
    if (currentJob.status !== 'in_progress') {
        showNotification('Job must be in progress before completing', 'error');
        closeCompleteJobModal();
        return;
    }
    
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
    currentJob.status = 'completed';
    currentJob.completionData = {
        beforePhotos: beforePhotos,
        afterPhotos: afterPhotos,
        workSummary: workSummary || '',
        timeSpent: { hours, minutes },
        materialsUsed: document.getElementById('materialsUsed').value || '',
        completedAt: new Date().toISOString(),
        completedBy: currentStaff.id
    };
    currentJob.updatedAt = new Date().toISOString().split('T')[0];
    
    // Add activity
    addActivityItem({
        type: 'completed',
        message: 'completed the job',
        author: currentStaff.name,
        authorType: 'staff'
    });
    
    // Update UI
    displayJobDetails();
    closeCompleteJobModal();
    showNotification(`Job completed successfully! 🎉`, 'success');
}

// Open On Hold Modal
function openOnHoldModal() {
    if (!currentJob) return;
    
    // Validate status - can only put on hold from in_progress
    if (currentJob.status !== 'in_progress') {
        showNotification('Job must be in progress before putting on hold', 'error');
        return;
    }
    
    // Reset form
    document.getElementById('holdReason').value = '';
    document.getElementById('holdNotes').value = '';
    document.getElementById('resumeDate').value = '';
    
    // Show modal
    document.getElementById('onHoldModal').classList.add('active');
}

// Close On Hold Modal
function closeOnHoldModal() {
    document.getElementById('onHoldModal').classList.remove('active');
}

// Submit On Hold
function submitOnHold() {
    if (!currentJob) return;
    
    // Validate status - can only put on hold from in_progress
    if (currentJob.status !== 'in_progress') {
        showNotification('Job must be in progress before putting on hold', 'error');
        closeOnHoldModal();
        return;
    }
    
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
    currentJob.status = 'on_hold';
    currentJob.onHoldData = {
        reason: reason,
        notes: notes,
        resumeDate: resumeDate,
        putOnHoldAt: new Date().toISOString(),
        putOnHoldBy: currentStaff.id
    };
    currentJob.updatedAt = new Date().toISOString().split('T')[0];
    
    // Add activity
    addActivityItem({
        type: 'on_hold',
        message: 'put job on hold',
        author: currentStaff.name,
        authorType: 'staff',
        reason: document.getElementById('holdReason').selectedOptions[0].text
    });
    
    // Update UI
    displayJobDetails();
    closeOnHoldModal();
    
    const reasonText = document.getElementById('holdReason').selectedOptions[0].text;
    showNotification(`Job put on hold: ${reasonText}`, 'warning');
}

// Open Reject Job Modal
function openRejectJobModal() {
    if (!currentJob) return;
    
    // Validate status - can only reject from scheduled
    if (currentJob.status !== 'scheduled') {
        showNotification('Job must be scheduled before rejecting', 'error');
        return;
    }
    
    // Reset form
    document.getElementById('rejectJobReason').value = '';
    document.getElementById('rejectJobDetails').value = '';
    
    // Show modal
    document.getElementById('rejectJobModal').classList.add('active');
}

// Close Reject Job Modal
function closeRejectJobModal() {
    document.getElementById('rejectJobModal').classList.remove('active');
}

// Submit Reject Job
function submitRejectJob() {
    if (!currentJob) return;
    
    // Validate status - can only reject from scheduled
    if (currentJob.status !== 'scheduled') {
        showNotification('Job must be scheduled before rejecting', 'error');
        closeRejectJobModal();
        return;
    }
    
    const reason = document.getElementById('rejectJobReason').value;
    const details = document.getElementById('rejectJobDetails').value.trim();
    
    if (!reason) {
        showNotification('Please select a reason', 'error');
        return;
    }
    
    if (!details) {
        showNotification('Please provide details', 'error');
        return;
    }
    
    // Save reject data
    currentJob.rejectData = {
        reason: reason,
        details: details,
        rejectedAt: new Date().toISOString(),
        rejectedBy: currentStaff.id
    };
    
    // Change status to canceled (rejected jobs are canceled)
    currentJob.status = 'canceled';
    currentJob.updatedAt = new Date().toISOString().split('T')[0];
    
    // Add activity
    addActivityItem({
        type: 'rejected',
        message: 'rejected the job',
        author: currentStaff.name,
        authorType: 'staff',
        reason: document.getElementById('rejectJobReason').selectedOptions[0].text
    });
    
    // Update UI
    displayJobDetails();
    closeRejectJobModal();
    
    const reasonText = document.getElementById('rejectJobReason').selectedOptions[0].text;
    showNotification(`Job rejected: ${reasonText}. Manager will be notified.`, 'warning');
}

// Open Cannot Complete Modal
function openCannotCompleteModal() {
    if (!currentJob) return;
    
    // Validate status - can only report cannot complete from in_progress
    if (currentJob.status !== 'in_progress') {
        showNotification('Job must be in progress before reporting cannot complete', 'error');
        return;
    }
    
    // Reset form
    cannotCompletePhotos = [];
    document.getElementById('cannotCompleteReason').value = '';
    document.getElementById('cannotCompleteDetails').value = '';
    document.getElementById('cannotCompletePreview').innerHTML = '';
    
    // Show modal
    document.getElementById('cannotCompleteModal').classList.add('active');
}

// Close Cannot Complete Modal
function closeCannotCompleteModal() {
    document.getElementById('cannotCompleteModal').classList.remove('active');
}

// Submit Cannot Complete
function submitCannotComplete() {
    if (!currentJob) return;
    
    // Validate status - can only report cannot complete from in_progress
    if (currentJob.status !== 'in_progress') {
        showNotification('Job must be in progress before reporting cannot complete', 'error');
        closeCannotCompleteModal();
        return;
    }
    
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
    
    // Save cannot complete data - status changes to awaiting_cancellation (not canceled yet)
    currentJob.status = 'awaiting_cancellation';
    currentJob.cannotCompleteData = {
        reason: reason,
        details: details,
        photos: cannotCompletePhotos,
        reportedAt: new Date().toISOString(),
        reportedBy: currentStaff.id,
        awaitingManagerConfirmation: true
    };
    currentJob.updatedAt = new Date().toISOString().split('T')[0];
    
    // Add activity log to notify manager
    addActivityItem({
        type: 'cannot_complete',
        message: 'reported job cannot be completed - awaiting manager confirmation',
        author: currentStaff.name,
        authorType: 'staff',
        reason: document.getElementById('cannotCompleteReason').selectedOptions[0].text,
        details: details,
        notifyManager: true
    });
    
    // Update UI
    displayJobDetails();
    closeCannotCompleteModal();
    
    const reasonText = document.getElementById('cannotCompleteReason').selectedOptions[0].text;
    showNotification(`Manager notified. Job awaiting cancellation confirmation.`, 'warning');
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

function showError(message) {
    showNotification(message, 'error');
}

// ============================================================================
// COMMENT & ACTIVITY SYSTEM
// ============================================================================

function initializeCommentSystem() {
    const commentInput = document.getElementById('commentInput');
    if (!commentInput) return;
    
    // Keyboard shortcuts
    commentInput.addEventListener('keydown', function(e) {
        // Ctrl+Enter to submit
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            addComment();
        }
        
        // @ mention detection
        if (e.key === '@') {
            setTimeout(() => showMentionSuggestions(), 100);
        }
    });
}

// Initialize Activity Feed with Sample Data
function initializeActivityFeed() {
    if (!currentJob) {
        console.log('No current job for activity feed initialization');
        return;
    }
    
    // Check if we should preserve user-generated comments
    const existingUserComments = activityFeed.filter(item => 
        item.authorType === 'staff' && 
        item.type === 'comment' && 
        !item.message.includes('Job Instructions') && 
        !item.message.includes('Customer Notes') &&
        !item.message.includes('Work Completed') &&
        !item.message.includes('Job On Hold')
    );
    
    // Always initialize with sample data for demonstration
    const now = new Date();
    activityFeed = [];
    
    // 1. Job Assignment (oldest - 3 days ago)
    activityFeed.push({
        type: 'status',
        message: 'Job assigned to you',
        author: 'System',
        authorType: 'system',
        timestamp: new Date(now.getTime() - 3 * 86400000).toISOString()
    });
    
    // 2. Manager Instructions (2 days ago)
    activityFeed.push({
        type: 'comment',
        message: '📋 **Job Instructions:**\n\n• Please arrive 15 minutes early to set up equipment\n• Customer prefers morning visits\n• Bring all necessary tools from the checklist\n• Call customer 30 minutes before arrival',
        author: 'Sarah Johnson',
        authorType: 'manager',
        timestamp: new Date(now.getTime() - 2 * 86400000).toISOString()
    });
    
    // 3. Customer Notes (1 day ago)
    activityFeed.push({
        type: 'comment',
        message: '🏠 **Customer Notes:**\n\n• Front gate code: 1234\n• Ring doorbell when you arrive\n• Park in the driveway\n• Customer will be home between 9 AM - 12 PM',
        author: 'Mike Wilson',
        authorType: 'manager',
        timestamp: new Date(now.getTime() - 86400000).toISOString()
    });
    
    // 4. Special Instructions (if job has notes)
    if (currentJob.notes) {
        activityFeed.push({
            type: 'comment',
            message: `⚠️ **Special Note:** ${currentJob.notes}`,
            author: 'System',
            authorType: 'system',
            timestamp: new Date(now.getTime() - 43200000).toISOString()
        });
    }
    
    // 5. Priority Information
    if (currentJob.priority === 'urgent' || currentJob.priority === 'high') {
        activityFeed.push({
            type: 'comment',
            message: `🚨 **Priority Job:** This is a ${currentJob.priority === 'urgent' ? 'URGENT' : 'HIGH PRIORITY'} job. Please prioritize accordingly.`,
            author: 'System',
            authorType: 'system',
            timestamp: new Date(now.getTime() - 36000000).toISOString()
        });
    }
    
    // 6. Scheduled reminder (for scheduled jobs)
    if (currentJob.status === 'scheduled') {
        activityFeed.push({
            type: 'status',
            message: `Job scheduled for ${currentJob.dueDate} at ${currentJob.time}`,
            author: 'System',
            authorType: 'system',
            timestamp: new Date(now.getTime() - 43200000).toISOString()
        });
    }
    
    // 7. Status-specific activities (most recent)
    if (currentJob.status === 'in_progress') {
        activityFeed.push({
            type: 'status',
            message: 'started the job',
            author: currentStaff.name,
            authorType: 'staff',
            timestamp: new Date(now.getTime() - 7200000).toISOString()
        });
    } else if (currentJob.status === 'completed') {
        activityFeed.push({
            type: 'completed',
            message: 'completed the job',
            author: currentStaff.name,
            authorType: 'staff',
            timestamp: new Date(now.getTime() - 3600000).toISOString()
        });
        
        // Add completion summary if available
        if (currentJob.completionData) {
            activityFeed.push({
                type: 'comment',
                message: `✅ **Work Completed:**\n\n${currentJob.completionData.workSummary || 'Job completed successfully'}\n\n⏱️ Time spent: ${currentJob.completionData.timeSpent.hours}h ${currentJob.completionData.timeSpent.minutes}m`,
                author: currentStaff.name,
                authorType: 'staff',
                timestamp: new Date(now.getTime() - 3600000).toISOString()
            });
        }
    } else if (currentJob.status === 'on_hold') {
        activityFeed.push({
            type: 'on_hold',
            message: 'put job on hold',
            author: currentStaff.name,
            authorType: 'staff',
            timestamp: new Date(now.getTime() - 1800000).toISOString()
        });
        
        // Add hold reason if available
        if (currentJob.onHoldData) {
            const reasonLabels = {
                'customer_unavailable': '🏠 Customer Not Available',
                'weather': '🌧️ Weather Conditions',
                'missing_parts': '🔧 Missing Parts/Equipment',
                'awaiting_approval': '📞 Awaiting Customer Approval',
                'safety_concern': '🚨 Safety Concern',
                'access_issue': '🔒 Access Issue',
                'other': '📝 Other'
            };
            
            activityFeed.push({
                type: 'comment',
                message: `⏸️ **Job On Hold:**\n\nReason: ${reasonLabels[currentJob.onHoldData.reason] || currentJob.onHoldData.reason}\n\nDetails: ${currentJob.onHoldData.notes}`,
                author: currentStaff.name,
                authorType: 'staff',
                timestamp: new Date(now.getTime() - 1800000).toISOString()
            });
        }
    }
    
    // Add back any user-generated comments
    if (existingUserComments.length > 0) {
        activityFeed.push(...existingUserComments);
    }
    
    // Sort by timestamp (oldest to newest)
    activityFeed.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Save to job for persistence
    if (!currentJob.comments) {
        currentJob.comments = [];
    }
    currentJob.comments = [...activityFeed];
    
    console.log('Activity feed initialized with', activityFeed.length, 'items');
}

// Switch Activity Tab
function switchActivityTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
    
    // Reload activity feed
    loadActivityFeed();
}

// Load Activity Feed
function loadActivityFeed() {
    const activityList = document.getElementById('activityList');
    const emptyActivity = document.getElementById('emptyActivity');
    const activityCount = document.getElementById('activityCount');
    
    if (!activityList) {
        console.log('Activity list element not found');
        return;
    }
    
    // If no activity feed data, initialize it
    if (!activityFeed || activityFeed.length === 0) {
        if (currentJob) {
            initializeActivityFeed();
            // If still empty after initialization, show empty state
            if (!activityFeed || activityFeed.length === 0) {
                if (emptyActivity) {
                    emptyActivity.style.display = 'block';
                }
                activityList.innerHTML = '';
                if (activityCount) activityCount.textContent = '0';
                return;
            }
        } else {
            if (emptyActivity) {
                emptyActivity.style.display = 'block';
            }
            activityList.innerHTML = '';
            if (activityCount) activityCount.textContent = '0';
            return;
        }
    }
    
    // Update activity count
    if (activityCount) {
        activityCount.textContent = activityFeed.length.toString();
    }
    
    // Filter by tab
    let filtered = [...activityFeed];
    if (currentTab === 'comments') {
        filtered = activityFeed.filter(item => item.type === 'comment');
    } else if (currentTab === 'history') {
        filtered = activityFeed.filter(item => item.type !== 'comment');
    }
    
    if (filtered.length === 0) {
        activityList.innerHTML = '';
        if (emptyActivity) {
            emptyActivity.style.display = 'block';
        }
        return;
    }
    
    if (emptyActivity) {
        emptyActivity.style.display = 'none';
    }
    
    // Sort by timestamp (newest first for display)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Render activities
    activityList.innerHTML = filtered.map(item => createActivityItem(item)).join('');
    
    // Extract and display instructions in the instructions card
    
    // Scroll to bottom to show most recent
    const feedContainer = document.getElementById('activityFeed');
    if (feedContainer) {
        feedContainer.scrollTop = feedContainer.scrollHeight;
    }
}


// Toggle Communication Panel
function toggleCommunicationPanel() {
    const content = document.getElementById('communicationContent');
    const icon = document.getElementById('communicationToggleIcon');
    
    if (!content) return;
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.className = 'fas fa-chevron-down';
    } else {
        content.style.display = 'none';
        icon.className = 'fas fa-chevron-up';
    }
}

// Create Activity Item HTML
function createActivityItem(item) {
    const time = new Date(item.timestamp);
    const timeAgo = getTimeAgo(time);
    
    if (item.type === 'comment') {
        const avatarClass = item.authorType === 'manager' ? 'manager' : 
                           item.authorType === 'customer' ? 'customer' : 'staff';
        const badgeClass = item.authorType === 'manager' ? 'manager' : 'staff';
        const initials = item.author.split(' ').map(n => n[0]).join('').toUpperCase();
        
        return `
            <div class="comment-item">
                <div class="comment-avatar ${avatarClass}">${initials}</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${item.author}</span>
                        <span class="comment-badge ${badgeClass}">${item.authorType}</span>
                        <span class="comment-time">${timeAgo}</span>
                    </div>
                    <div class="comment-text">${formatCommentText(item.message)}</div>
                    ${item.attachments && item.attachments.length > 0 ? `
                        <div class="comment-attachments">
                            ${item.attachments.map(att => `
                                <a href="#" class="attachment-item">
                                    <i class="fas fa-paperclip"></i>
                                    <span>${att.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    } else {
        // Activity item (status change, etc.)
        const iconClass = item.type === 'completed' ? 'completed' : 
                         item.type === 'status' ? 'status' : 'comment';
        const icon = item.type === 'completed' ? 'fa-check-circle' :
                    item.type === 'status' ? 'fa-sync-alt' :
                    'fa-info-circle';
        
        return `
            <div class="activity-item">
                <div class="activity-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="activity-content">
                    <div>${formatActivityMessage(item)}</div>
                    <div class="activity-time">${timeAgo}</div>
                </div>
            </div>
        `;
    }
}

// Format Activity Message
function formatActivityMessage(item) {
    if (item.type === 'status') {
        return `<strong>${item.author}</strong> ${item.message}`;
    } else if (item.type === 'completed') {
        return `<strong>${item.author}</strong> completed the job`;
    } else if (item.type === 'on_hold') {
        return `<strong>${item.author}</strong> put job on hold: ${item.reason || ''}`;
    }
    return item.message;
}

// Format Comment Text (basic HTML)
function formatCommentText(text) {
    if (!text) return '';
    
    // Simple formatting - in production, use a proper sanitizer
    let formatted = text
        // Bold markdown **text**
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic markdown *text*
        .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
        // Bullet points
        .replace(/^•\s+(.+)$/gm, '<li>$1</li>')
        // Numbered lists
        .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
        // Line breaks
        .replace(/\n/g, '<br>');
    
    // Wrap list items in ul tags if found
    if (formatted.includes('<li>')) {
        formatted = formatted.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
        // Clean up multiple ul tags
        formatted = formatted.replace(/<\/ul><br><ul>/g, '');
    }
    
    return formatted;
}

// Get Time Ago
function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format Comment (Bold, Italic, Lists)
function formatComment(command) {
    document.execCommand(command, false, null);
    document.getElementById('commentInput').focus();
}

// Insert Emoji
function insertEmoji() {
    const emojis = ['😀', '😃', '😄', '😁', '😊', '😍', '👍', '👎', '👏', '🙏', '✅', '❌', '⚠️', '🎉', '💪', '🔥', '⭐', '💯'];
    
    // Simple emoji picker - show alert for now, can be enhanced
    const emoji = prompt('Select emoji:\n\n' + emojis.join(' '));
    if (emoji && emojis.includes(emoji)) {
        const input = document.getElementById('commentInput');
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(emoji));
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            input.textContent += emoji;
        }
        input.focus();
    }
}

// Attach File
function attachFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = function(e) {
        Array.from(e.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(event) {
                commentAttachments.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: event.target.result
                });
                updateAttachmentsDisplay();
            };
            reader.readAsDataURL(file);
        });
    };
    input.click();
}

// Update Attachments Display
function updateAttachmentsDisplay() {
    const container = document.getElementById('fileAttachments');
    const list = document.getElementById('attachmentsList');
    
    if (commentAttachments.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    list.innerHTML = commentAttachments.map((att, index) => `
        <div style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: #f3f4f6; border-radius: 6px; font-size: 12px;">
            <i class="fas fa-paperclip"></i>
            <span>${att.name}</span>
            <button onclick="removeAttachment(${index})" style="border: none; background: transparent; color: #ef4444; cursor: pointer; padding: 0 4px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Remove Attachment
function removeAttachment(index) {
    commentAttachments.splice(index, 1);
    updateAttachmentsDisplay();
}

// Show Mention Suggestions
function showMentionSuggestions() {
    // Simple implementation - can be enhanced with dropdown
    const suggestions = ['@Manager', '@Team Leader', '@Customer'];
    const mention = prompt('Mention:\n\n' + suggestions.join('\n'));
    if (mention) {
        const input = document.getElementById('commentInput');
        input.textContent += mention + ' ';
        input.focus();
    }
}

// Add Comment
function addComment() {
    const commentInput = document.getElementById('commentInput');
    const text = commentInput.textContent.trim();
    
    if (!text && commentAttachments.length === 0) {
        showNotification('Please enter a comment or attach a file', 'warning');
        return;
    }
    
    if (!currentJob) return;
    
    // Create comment object
    const comment = {
        type: 'comment',
        message: text,
        author: currentStaff.name,
        authorType: 'staff',
        timestamp: new Date().toISOString(),
        attachments: commentAttachments.length > 0 ? [...commentAttachments] : []
    };
    
    // Add to activity feed
    activityFeed.unshift(comment);
    
    // Save to job
    if (!currentJob.comments) {
        currentJob.comments = [];
    }
    currentJob.comments.push(comment);
    
    // Clear input
    commentInput.textContent = '';
    commentAttachments = [];
    updateAttachmentsDisplay();
    
    // Reload feed
    loadActivityFeed();
    
    // Show notification
    showNotification('Comment posted successfully', 'success');
}

// Cancel Comment
function cancelComment() {
    const commentInput = document.getElementById('commentInput');
    commentInput.textContent = '';
    commentAttachments = [];
    updateAttachmentsDisplay();
}

// Export functions to window
window.switchActivityTab = switchActivityTab;
window.formatComment = formatComment;
window.insertEmoji = insertEmoji;
window.attachFile = attachFile;
window.removeAttachment = removeAttachment;
window.addComment = addComment;
window.cancelComment = cancelComment;
// Copy to clipboard function
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const text = element.textContent.trim();
    
    // Use modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(elementId);
        }).catch(() => {
            // Fallback for older browsers
            fallbackCopyToClipboard(text, elementId);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(text, elementId);
    }
}

// Fallback copy method
function fallbackCopyToClipboard(text, elementId) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback(elementId);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
    
    document.body.removeChild(textArea);
}

// Show copy feedback
function showCopyFeedback(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const copyBtn = element.nextElementSibling;
    if (copyBtn && (copyBtn.classList.contains('copy-btn') || copyBtn.classList.contains('copy-btn-inline'))) {
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.classList.remove('copied');
        }, 2000);
    }
}

window.toggleMobileSidebar = toggleMobileSidebar;
window.copyToClipboard = copyToClipboard;
window.startJob = startJob;
window.resumeJob = resumeJob;
window.viewHoldReason = viewHoldReason;
window.openCompleteModal = openCompleteModal;
window.closeCompleteJobModal = closeCompleteJobModal;
window.clearSignature = clearSignature;
window.handlePhotoUpload = handlePhotoUpload;
window.removePhoto = removePhoto;
window.submitJobCompletion = submitJobCompletion;
window.openOnHoldModal = openOnHoldModal;
window.closeOnHoldModal = closeOnHoldModal;
window.submitOnHold = submitOnHold;
window.openRejectJobModal = openRejectJobModal;
window.closeRejectJobModal = closeRejectJobModal;
window.submitRejectJob = submitRejectJob;
window.openCannotCompleteModal = openCannotCompleteModal;
window.closeCannotCompleteModal = closeCannotCompleteModal;
window.submitCannotComplete = submitCannotComplete;
window.toggleCommunicationPanel = toggleCommunicationPanel;

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

