// Job Create Simple - JavaScript

// ============================================================================
// QUOTE SELECTION FUNCTIONALITY
// ============================================================================

// Mock quotes database
const mockQuotesDatabase = [
    {
        id: 'Q-2024-001',
        customer: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        customerPhone: '+61 400 123 456',
        items: 5,
        total: 1650.00,
        createdDate: '2024-11-10',
        status: 'Approved',
        description: 'Complete Tutoring Package - Math, Science, English'
    },
    {
        id: 'Q-2024-002',
        customer: 'Michael Chen',
        customerEmail: 'michael.chen@email.com',
        customerPhone: '+61 400 123 457',
        items: 3,
        total: 950.00,
        createdDate: '2024-11-09',
        status: 'Pending',
        description: 'Physics and Chemistry Tutoring Sessions'
    },
    {
        id: 'Q-2024-003',
        customer: 'Emma Wilson',
        customerEmail: 'emma.wilson@email.com',
        customerPhone: '+61 400 123 458',
        items: 2,
        total: 600.00,
        createdDate: '2024-11-08',
        status: 'Approved',
        description: 'English Literature and Writing Support'
    },
    {
        id: 'Q-2024-004',
        customer: 'David Brown',
        customerEmail: 'david.brown@email.com',
        customerPhone: '+61 400 123 459',
        items: 4,
        total: 1200.00,
        createdDate: '2024-11-07',
        status: 'Approved',
        description: 'Advanced Mathematics Package'
    },
    {
        id: 'Q-2024-005',
        customer: 'Lisa Garcia',
        customerEmail: 'lisa.garcia@email.com',
        customerPhone: '+61 400 123 460',
        items: 6,
        total: 1800.00,
        createdDate: '2024-11-06',
        status: 'Draft',
        description: 'Comprehensive Science and Math Program'
    }
];

let selectedQuote = mockQuotesDatabase[0]; // Default to first quote

// Load main content on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Page loaded successfully');
    console.log('📊 Grid container found:', document.querySelector('.grid.grid-cols-1') ? 'Yes' : 'No');
    console.log('👤 Customer card found:', document.querySelector('.sticky.top-4') ? 'Yes' : 'No');
    console.log('📝 Notes section found:', document.querySelector('#internalNotes') ? 'Yes' : 'No');
    console.log('🔘 Change Quote button found:', document.querySelector('#changeQuoteBtn') ? 'Yes' : 'No');
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize quote selection
    initializeQuoteSelection();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('scheduleDate');
    if (dateInput) {
        dateInput.setAttribute('min', today);
    }
    
    // Load sample data for testing (but skip staff loading to avoid errors)
    loadSampleDataSimple();
});

function initializeEventListeners() {
    // Switch to Multiple Jobs button
    const switchBtn = document.getElementById('switchToMultipleBtn');
    if (switchBtn) {
        switchBtn.addEventListener('click', showSplitModal);
    }
    
    // Create Job button
    const createBtn = document.getElementById('createJobBtn');
    if (createBtn) {
        createBtn.addEventListener('click', createJob);
    }
    
    // Save Draft button
    const draftBtn = document.getElementById('saveDraftBtn');
    if (draftBtn) {
        draftBtn.addEventListener('click', saveDraft);
    }
    
    // Modal buttons
    const closeSplitBtn = document.getElementById('closeSplitModal');
    const cancelSplitBtn = document.getElementById('cancelSplitBtn');
    const confirmSplitBtn = document.getElementById('confirmSplitBtn');
    
    if (closeSplitBtn) closeSplitBtn.addEventListener('click', hideSplitModal);
    if (cancelSplitBtn) cancelSplitBtn.addEventListener('click', hideSplitModal);
    if (confirmSplitBtn) confirmSplitBtn.addEventListener('click', redirectToMultipleJobs);
    
    // Note: Staff assignment functionality removed in simplified UI
}

function showSplitModal() {
    const modal = document.getElementById('splitItemsModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function hideSplitModal() {
    const modal = document.getElementById('splitItemsModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function redirectToMultipleJobs() {
    // Redirect to the advanced multi-job creation screen
    window.location.href = 'job_create_from_quote.html';
}

function updatePriorityBorders() {
    const priorityInputs = document.querySelectorAll('input[name="priority"]');
    priorityInputs.forEach(input => {
        const label = input.closest('label');
        if (input.checked) {
            label.classList.remove('border-gray-200');
            if (input.value === 'high') {
                label.classList.add('border-red-500');
            } else if (input.value === 'medium') {
                label.classList.add('border-blue-500');
            } else if (input.value === 'low') {
                label.classList.add('border-green-500');
            }
        } else {
            label.classList.remove('border-red-500', 'border-blue-500', 'border-green-500');
            label.classList.add('border-gray-200');
        }
    });
}

function createJob() {
    const button = document.getElementById('createJobBtn');
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const jobData = getFormData();
    
    // Show loading state
    button.disabled = true;
    button.innerHTML = `
        <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Creating job...
    `;
    
    // Simulate API call
    setTimeout(() => {
        console.log('Creating job with data:', jobData);
        
        // Show success message
        showSuccessToast('Job J-2024-001 created successfully!');
        
        // Redirect to job detail page
        setTimeout(() => {
            window.location.href = 'job_detail.html?id=J-2024-001';
        }, 1000);
    }, 1500);
}

function saveDraft() {
    const button = document.getElementById('saveDraftBtn');
    
    // Get form data
    const jobData = getFormData();
    jobData.status = 'draft';
    
    // Show loading state
    button.disabled = true;
    button.innerHTML = `
        <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Saving...
    `;
    
    // Simulate API call
    setTimeout(() => {
        console.log('Saving draft with data:', jobData);
        
        // Show success message
        showSuccessToast('Draft saved successfully!');
        
        // Reset button
        button.disabled = false;
        button.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Update Draft
        `;
    }, 1000);
}

function getFormData() {
    return {
        quoteId: 'Q-2024-001',
        jobName: document.getElementById('jobName').value || 'Job from Quote Q-2024-001',
        priority: document.querySelector('input[name="priority"]:checked').value,
        scheduleDate: document.getElementById('scheduleDate').value || null,
        scheduleTime: document.getElementById('scheduleTime').value || null,
        startTime: document.getElementById('startTime').value || null,
        endTime: document.getElementById('endTime').value || null,
        assignedTeam: document.getElementById('assignedTeam').value || null,
        internalNotes: document.getElementById('internalNotes').value || '',
        // Quote data (would come from API in real implementation)
        customerId: 'C-001',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        customerPhone: '+61 400 123 456',
        serviceAddress: {
            street: '123 Main Street',
            city: 'Melbourne',
            state: 'VIC',
            postcode: '3000'
        },
        lineItems: [
            { id: 1, name: 'Math Tutoring Session', quantity: 1, unitPrice: 300, total: 300 },
            { id: 2, name: 'Science Tutoring Session', quantity: 1, unitPrice: 300, total: 300 },
            { id: 3, name: 'English Tutoring Session', quantity: 1, unitPrice: 300, total: 300 },
            { id: 4, name: 'Study Materials Package', quantity: 1, unitPrice: 150, total: 150 },
            { id: 5, name: 'Progress Assessment', quantity: 1, unitPrice: 100, total: 100 }
        ],
        subtotal: 1500,
        totalTax: 150,
        total: 1650,
        depositAmount: 825,
        balanceDue: 825
    };
}

function validateForm() {
    let isValid = true;
    const errors = [];
    
    // Job name validation (optional but has max length)
    const jobName = document.getElementById('jobName').value;
    if (jobName && jobName.length > 100) {
        errors.push('Job name must be 100 characters or less');
        document.getElementById('jobName').classList.add('border-red-500');
        isValid = false;
    } else {
        document.getElementById('jobName').classList.remove('border-red-500');
    }
    
    // Internal notes validation (optional but has max length)
    const internalNotes = document.getElementById('internalNotes').value;
    if (internalNotes && internalNotes.length > 500) {
        errors.push('Internal notes must be 500 characters or less');
        document.getElementById('internalNotes').classList.add('border-red-500');
        isValid = false;
    } else {
        document.getElementById('internalNotes').classList.remove('border-red-500');
    }
    
    // Date validation (must be today or future)
    const scheduleDate = document.getElementById('scheduleDate').value;
    if (scheduleDate) {
        const selectedDate = new Date(scheduleDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errors.push('Schedule date must be today or in the future');
            document.getElementById('scheduleDate').classList.add('border-red-500');
            isValid = false;
        } else {
            document.getElementById('scheduleDate').classList.remove('border-red-500');
        }
    }
    
    // Time range validation
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (startTime && endTime) {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        // Check if end time is before start time (same day)
        if (endMinutes <= startMinutes) {
            // Allow overnight shifts, but warn if duration seems too long
            const durationMinutes = (endMinutes + 24 * 60) - startMinutes;
            if (durationMinutes > 16 * 60) { // More than 16 hours
                errors.push('Duration seems unusually long. Please verify start and end times.');
                document.getElementById('startTime').classList.add('border-yellow-500');
                document.getElementById('endTime').classList.add('border-yellow-500');
            }
        } else {
            document.getElementById('startTime').classList.remove('border-yellow-500');
            document.getElementById('endTime').classList.remove('border-yellow-500');
        }
    }
    
    // Show errors if any
    if (!isValid) {
        showErrorToast(errors.join('<br>'));
    }
    
    return isValid;
}

function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
    toast.innerHTML = `
        <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
    toast.innerHTML = `
        <div class="flex items-start gap-2">
            <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>${message}</div>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// ============================================================================
// STAFF SEARCH & RECOMMENDATION FUNCTIONS
// ============================================================================

// Mock staff database (A-Z)
const mockStaffDatabase = [
    {
        id: 'S001',
        name: 'Alice Anderson',
        initials: 'AA',
        firstName: 'Alice',
        lastName: 'Anderson',
        email: 'alice.anderson@fms.com',
        phone: '+1 234 567 8901',
        skills: ['Art', 'Design', 'Creative Writing'],
        availability: 'Available',
        rating: 4.8,
        completedJobs: 145,
        specialties: ['Tutoring', 'Arts Education'],
        role: 'Art Tutor',
        employeeId: 'EMP001',
        hourlyRate: 35
    },
    {
        id: 'S002',
        name: 'Benjamin Brooks',
        initials: 'BB',
        firstName: 'Benjamin',
        lastName: 'Brooks',
        email: 'benjamin.brooks@fms.com',
        phone: '+1 234 567 8902',
        skills: ['Biology', 'Chemistry', 'Science'],
        availability: 'Available',
        rating: 4.9,
        completedJobs: 198,
        specialties: ['Tutoring', 'Life Sciences'],
        role: 'Science Tutor',
        employeeId: 'EMP002',
        hourlyRate: 42
    },
    {
        id: 'S003',
        name: 'Catherine Clark',
        initials: 'CC',
        firstName: 'Catherine',
        lastName: 'Clark',
        email: 'catherine.clark@fms.com',
        phone: '+1 234 567 8903',
        skills: ['Computer Science', 'Programming', 'Math'],
        availability: 'Busy',
        rating: 4.7,
        completedJobs: 112,
        specialties: ['Tutoring', 'Technology'],
        role: 'Tech Tutor',
        employeeId: 'EMP003',
        hourlyRate: 45
    },
    {
        id: 'S004',
        name: 'David Davis',
        initials: 'DD',
        firstName: 'David',
        lastName: 'Davis',
        email: 'david.davis@fms.com',
        phone: '+1 234 567 8904',
        skills: ['Drama', 'Theater', 'Public Speaking'],
        availability: 'Available',
        rating: 4.6,
        completedJobs: 87,
        specialties: ['Tutoring', 'Performing Arts'],
        role: 'Drama Tutor',
        employeeId: 'EMP004',
        hourlyRate: 38
    },
    {
        id: 'S005',
        name: 'Emily Evans',
        initials: 'EE',
        firstName: 'Emily',
        lastName: 'Evans',
        email: 'emily.evans@fms.com',
        phone: '+1 234 567 8905',
        skills: ['English', 'Literature', 'Writing'],
        availability: 'Available',
        rating: 4.9,
        completedJobs: 203,
        specialties: ['Tutoring', 'Language Arts'],
        role: 'English Tutor',
        employeeId: 'EMP005',
        hourlyRate: 40
    },
    {
        id: 'S006',
        name: 'Frank Foster',
        initials: 'FF',
        firstName: 'Frank',
        lastName: 'Foster',
        email: 'frank.foster@fms.com',
        phone: '+1 234 567 8906',
        skills: ['French', 'Spanish', 'Languages'],
        availability: 'Available',
        rating: 4.8,
        completedJobs: 156,
        specialties: ['Tutoring', 'Foreign Languages'],
        role: 'Language Tutor',
        employeeId: 'EMP006',
        hourlyRate: 38
    },
    {
        id: 'S007',
        name: 'Grace Garcia',
        initials: 'GG',
        firstName: 'Grace',
        lastName: 'Garcia',
        email: 'grace.garcia@fms.com',
        phone: '+1 234 567 8907',
        skills: ['Geography', 'History', 'Social Studies'],
        availability: 'Available',
        rating: 4.7,
        completedJobs: 134,
        specialties: ['Tutoring', 'Social Sciences'],
        role: 'Social Studies Tutor',
        employeeId: 'EMP007',
        hourlyRate: 36
    },
    {
        id: 'S008',
        name: 'Henry Harris',
        initials: 'HH',
        firstName: 'Henry',
        lastName: 'Harris',
        email: 'henry.harris@fms.com',
        phone: '+1 234 567 8908',
        skills: ['History', 'Government', 'Economics'],
        availability: 'Busy',
        rating: 4.8,
        completedJobs: 167,
        specialties: ['Tutoring', 'Humanities'],
        role: 'History Tutor',
        employeeId: 'EMP008',
        hourlyRate: 39
    },
    {
        id: 'S009',
        name: 'Isabella Jackson',
        initials: 'IJ',
        firstName: 'Isabella',
        lastName: 'Jackson',
        email: 'isabella.jackson@fms.com',
        phone: '+1 234 567 8909',
        skills: ['Italian', 'Music', 'Art'],
        availability: 'Available',
        rating: 4.6,
        completedJobs: 92,
        specialties: ['Tutoring', 'Arts & Culture'],
        role: 'Arts Tutor',
        employeeId: 'EMP009',
        hourlyRate: 34
    },
    {
        id: 'S010',
        name: 'James Johnson',
        initials: 'JJ',
        firstName: 'James',
        lastName: 'Johnson',
        email: 'james.johnson@fms.com',
        phone: '+1 234 567 8910',
        skills: ['Japanese', 'Asian Studies', 'Languages'],
        availability: 'Available',
        rating: 4.7,
        completedJobs: 78,
        specialties: ['Tutoring', 'International Studies'],
        role: 'Language Tutor',
        employeeId: 'EMP010',
        hourlyRate: 37
    },
    {
        id: 'S011',
        name: 'Katherine King',
        initials: 'KK',
        firstName: 'Katherine',
        lastName: 'King',
        email: 'katherine.king@fms.com',
        phone: '+1 234 567 8911',
        skills: ['Kindergarten', 'Early Education', 'Reading'],
        availability: 'Available',
        rating: 4.9,
        completedJobs: 215,
        specialties: ['Tutoring', 'Early Childhood'],
        role: 'Early Education Tutor',
        employeeId: 'EMP011',
        hourlyRate: 36
    },
    {
        id: 'S012',
        name: 'Liam Lee',
        initials: 'LL',
        firstName: 'Liam',
        lastName: 'Lee',
        email: 'liam.lee@fms.com',
        phone: '+1 234 567 8912',
        skills: ['Literature', 'Latin', 'Classics'],
        availability: 'Available',
        rating: 4.8,
        completedJobs: 143,
        specialties: ['Tutoring', 'Classical Studies'],
        role: 'Classics Tutor',
        employeeId: 'EMP012',
        hourlyRate: 39
    },
    {
        id: 'S013',
        name: 'Maria Martinez',
        initials: 'MM',
        firstName: 'Maria',
        lastName: 'Martinez',
        email: 'maria.martinez@fms.com',
        phone: '+1 234 567 8913',
        skills: ['Math', 'Algebra', 'Geometry'],
        availability: 'Available',
        rating: 4.9,
        completedJobs: 234,
        specialties: ['Tutoring', 'Mathematics'],
        role: 'Math Tutor',
        employeeId: 'EMP013',
        hourlyRate: 43
    },
    {
        id: 'S014',
        name: 'Nathan Nelson',
        initials: 'NN',
        firstName: 'Nathan',
        lastName: 'Nelson',
        email: 'nathan.nelson@fms.com',
        phone: '+1 234 567 8914',
        skills: ['Nutrition', 'Health', 'Biology'],
        availability: 'Busy',
        rating: 4.6,
        completedJobs: 89,
        specialties: ['Tutoring', 'Health Sciences'],
        role: 'Health Tutor',
        employeeId: 'EMP014',
        hourlyRate: 35
    },
    {
        id: 'S015',
        name: 'Olivia O\'Brien',
        initials: 'OO',
        firstName: 'Olivia',
        lastName: 'O\'Brien',
        email: 'olivia.obrien@fms.com',
        phone: '+1 234 567 8915',
        skills: ['Orchestra', 'Music Theory', 'Piano'],
        availability: 'Available',
        rating: 4.8,
        completedJobs: 167,
        specialties: ['Tutoring', 'Music Education'],
        role: 'Music Tutor',
        employeeId: 'EMP015',
        hourlyRate: 40
    },
    {
        id: 'S016',
        name: 'Patrick Parker',
        initials: 'PP',
        firstName: 'Patrick',
        lastName: 'Parker',
        email: 'patrick.parker@fms.com',
        phone: '+1 234 567 8916',
        skills: ['Physics', 'Math', 'Engineering'],
        availability: 'Available',
        rating: 4.9,
        completedJobs: 189,
        specialties: ['Tutoring', 'STEM Education'],
        role: 'Physics Tutor',
        employeeId: 'EMP016',
        hourlyRate: 44
    },
    {
        id: 'S017',
        name: 'Quinn Roberts',
        initials: 'QR',
        firstName: 'Quinn',
        lastName: 'Roberts',
        email: 'quinn.roberts@fms.com',
        phone: '+1 234 567 8917',
        skills: ['Quantum Physics', 'Advanced Math', 'Science'],
        availability: 'Available',
        rating: 4.7,
        completedJobs: 76,
        specialties: ['Tutoring', 'Advanced Sciences'],
        role: 'Advanced Science Tutor',
        employeeId: 'EMP017',
        hourlyRate: 46
    },
    {
        id: 'S018',
        name: 'Rachel Rodriguez',
        initials: 'RR',
        firstName: 'Rachel',
        lastName: 'Rodriguez',
        email: 'rachel.rodriguez@fms.com',
        phone: '+1 234 567 8918',
        skills: ['Reading', 'Writing', 'English'],
        availability: 'Available',
        rating: 4.8,
        completedJobs: 198,
        specialties: ['Tutoring', 'Literacy'],
        role: 'Literacy Tutor',
        employeeId: 'EMP018',
        hourlyRate: 38
    },
    {
        id: 'S019',
        name: 'Samuel Smith',
        initials: 'SS',
        firstName: 'Samuel',
        lastName: 'Smith',
        email: 'samuel.smith@fms.com',
        phone: '+1 234 567 8919',
        skills: ['Science', 'Chemistry', 'Lab Work'],
        availability: 'Busy',
        rating: 4.9,
        completedJobs: 221,
        specialties: ['Tutoring', 'Laboratory Sciences'],
        role: 'Chemistry Tutor',
        employeeId: 'EMP019',
        hourlyRate: 42
    },
    {
        id: 'S020',
        name: 'Taylor Thompson',
        initials: 'TT',
        firstName: 'Taylor',
        lastName: 'Thompson',
        email: 'taylor.thompson@fms.com',
        phone: '+1 234 567 8920',
        skills: ['Technology', 'Coding', 'Robotics'],
        availability: 'Available',
        rating: 4.8,
        completedJobs: 145,
        specialties: ['Tutoring', 'Tech Education'],
        role: 'Technology Tutor',
        employeeId: 'EMP020',
        hourlyRate: 41
    },
    {
        id: 'S021',
        name: 'Uma Patel',
        initials: 'UP',
        firstName: 'Uma',
        lastName: 'Patel',
        email: 'uma.patel@fms.com',
        phone: '+1 234 567 8921',
        skills: ['Urdu', 'Hindi', 'Languages'],
        availability: 'Available',
        rating: 4.6,
        completedJobs: 67,
        specialties: ['Tutoring', 'South Asian Languages'],
        role: 'Language Tutor',
        employeeId: 'EMP021',
        hourlyRate: 35
    },
    {
        id: 'S022',
        name: 'Victor Valdez',
        initials: 'VV',
        firstName: 'Victor',
        lastName: 'Valdez',
        email: 'victor.valdez@fms.com',
        phone: '+1 234 567 8922',
        skills: ['Violin', 'Music', 'Performance'],
        availability: 'Available',
        rating: 4.7,
        completedJobs: 112,
        specialties: ['Tutoring', 'String Instruments'],
        role: 'Music Tutor',
        employeeId: 'EMP022',
        hourlyRate: 38
    },
    {
        id: 'S023',
        name: 'Wendy Wilson',
        initials: 'WW',
        firstName: 'Wendy',
        lastName: 'Wilson',
        email: 'wendy.wilson@fms.com',
        phone: '+1 234 567 8923',
        skills: ['Writing', 'Journalism', 'English'],
        availability: 'Available',
        rating: 4.9,
        completedJobs: 187,
        specialties: ['Tutoring', 'Creative Writing'],
        role: 'Writing Tutor',
        employeeId: 'EMP023',
        hourlyRate: 41
    },
    {
        id: 'S024',
        name: 'Xavier Young',
        initials: 'XY',
        firstName: 'Xavier',
        lastName: 'Young',
        email: 'xavier.young@fms.com',
        phone: '+1 234 567 8924',
        skills: ['Xylophone', 'Music', 'Percussion'],
        availability: 'Busy',
        rating: 4.5,
        completedJobs: 54,
        specialties: ['Tutoring', 'Percussion Instruments'],
        role: 'Music Tutor',
        employeeId: 'EMP024',
        hourlyRate: 33
    },
    {
        id: 'S025',
        name: 'Yuki Yamamoto',
        initials: 'YY',
        firstName: 'Yuki',
        lastName: 'Yamamoto',
        email: 'yuki.yamamoto@fms.com',
        phone: '+1 234 567 8925',
        skills: ['Yoga', 'Physical Education', 'Wellness'],
        availability: 'Available',
        rating: 4.8,
        completedJobs: 134,
        specialties: ['Tutoring', 'Health & Wellness'],
        role: 'Wellness Tutor',
        employeeId: 'EMP025',
        hourlyRate: 37
    },
    {
        id: 'S026',
        name: 'Zachary Zhang',
        initials: 'ZZ',
        firstName: 'Zachary',
        lastName: 'Zhang',
        email: 'zachary.zhang@fms.com',
        phone: '+1 234 567 8926',
        skills: ['Zoology', 'Biology', 'Environmental Science'],
        availability: 'Available',
        rating: 4.7,
        completedJobs: 98,
        specialties: ['Tutoring', 'Life Sciences'],
        role: 'Biology Tutor',
        employeeId: 'EMP026',
        hourlyRate: 39
    }
];

function handleStaffSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const autocomplete = document.getElementById('staffAutocomplete');
    
    if (!query) {
        autocomplete.classList.add('hidden');
        return;
    }
    
    // Filter staff (exclude already selected)
    const results = mockStaffDatabase.filter(staff => {
        const nameMatch = staff.name.toLowerCase().includes(query);
        const skillMatch = staff.skills.some(skill => skill.toLowerCase().includes(query));
        const specialtyMatch = staff.specialties && staff.specialties.some(spec => spec.toLowerCase().includes(query));
        const alreadySelected = selectedStaffList.some(s => s.id === staff.id);
        return (nameMatch || skillMatch || specialtyMatch) && !alreadySelected;
    });
    
    if (results.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500 text-center">No staff found</div>';
        autocomplete.classList.remove('hidden');
        return;
    }
    
    // Sort by rating
    results.sort((a, b) => b.rating - a.rating);
    
    autocomplete.innerHTML = results.map(staff => createStaffResultCard(staff)).join('');
    autocomplete.classList.remove('hidden');
    
    // Add click handlers
    autocomplete.querySelectorAll('[data-staff-id]').forEach(card => {
        card.addEventListener('click', () => {
            const staffId = card.dataset.staffId;
            const staff = mockStaffDatabase.find(s => s.id === staffId);
            if (staff) {
                selectStaff(staff);
            }
        });
    });
}

function createStaffResultCard(staff) {
    const availabilityColor = staff.availability === 'Available' ? 'green' : 'orange';
    return `
        <div class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0" data-staff-id="${staff.id}">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    ${staff.initials}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-0.5">
                        <p class="font-semibold text-gray-900">${staff.name}</p>
                        <span class="px-2 py-0.5 text-xs rounded-full bg-${availabilityColor}-100 text-${availabilityColor}-700">
                            ${staff.availability}
                        </span>
                    </div>
                    <p class="text-xs text-indigo-600 font-medium">${staff.role}</p>
                    <p class="text-xs text-gray-600 mt-0.5">${staff.skills.join(', ')}</p>
                    <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>${staff.completedJobs} jobs</span>
                        <span>•</span>
                        <span>$${staff.hourlyRate}/hr</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function clearStaffSearch() {
    document.getElementById('staffSearchInput').value = '';
    document.getElementById('clearStaffSearchBtn').classList.add('hidden');
    document.getElementById('staffAutocomplete').classList.add('hidden');
}

function loadRecommendedStaff() {
    // In real app, this would analyze job requirements and recommend best matches
    // For now, we'll show top-rated available staff
    
    const jobRequirements = {
        skills: ['Math', 'Science', 'English'], // From line items
        date: document.getElementById('scheduleDate').value,
        duration: 6 // hours
    };
    
    // Filter and sort staff (exclude already selected)
    const recommended = mockStaffDatabase
        .filter(staff => staff.availability === 'Available')
        .filter(staff => staff.skills.some(skill => jobRequirements.skills.includes(skill)))
        .filter(staff => !selectedStaffList.some(s => s.id === staff.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    
    const container = document.getElementById('recommendedStaffList');
    
    if (recommended.length > 0) {
        container.innerHTML = recommended.map(staff => createRecommendedStaffCard(staff)).join('');
        
        // Add click handlers
        container.querySelectorAll('[data-staff-id]').forEach(card => {
            card.addEventListener('click', () => {
                const staffId = card.dataset.staffId;
                const staff = mockStaffDatabase.find(s => s.id === staffId);
                selectStaff(staff);
            });
        });
    } else {
        container.innerHTML = `
            <div class="p-3 text-center text-gray-500 text-sm bg-gray-50 rounded-lg">
                No recommended staff available for this job
            </div>
        `;
    }
}

function createRecommendedStaffCard(staff) {
    // Calculate match score based on skills overlap
    const jobSkills = ['Math', 'Science', 'English'];
    const matchingSkills = staff.skills.filter(skill => jobSkills.includes(skill));
    const matchScore = Math.round((matchingSkills.length / jobSkills.length) * 100);
    
    return `
        <div class="p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors" data-staff-id="${staff.id}">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    ${staff.initials}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <p class="font-semibold text-gray-900">${staff.name}</p>
                        <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                            ${matchScore}% match
                        </span>
                    </div>
                    <p class="text-xs text-indigo-600 font-medium">${staff.role}</p>
                    <p class="text-xs text-gray-600 mt-0.5">${matchingSkills.join(', ')}</p>
                    <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>${staff.completedJobs} jobs</span>
                        <span>•</span>
                        <span>$${staff.hourlyRate}/hr</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function selectStaff(staff) {
    // Add to selected list if not already there
    if (!selectedStaffList.some(s => s.id === staff.id)) {
        selectedStaffList.push(staff);
        updateSelectedStaffDisplay();
        
        // Clear search
        const searchInput = document.getElementById('staffSearchInput');
        if (searchInput) searchInput.value = '';
        document.getElementById('staffAutocomplete').classList.add('hidden');
        
        // Refresh recommendations to exclude selected staff
        loadRecommendedStaff();
        
        // Uncheck auto-assign
        document.getElementById('autoAssignStaff').checked = false;
        
        // Show success message
        showSuccessToast(`${staff.name} added to assignment`);
    }
}

function removeSelectedStaff(staffId) {
    selectedStaffList = selectedStaffList.filter(s => s.id !== staffId);
    updateSelectedStaffDisplay();
    
    // Refresh recommendations to include removed staff
    loadRecommendedStaff();
    
    // Re-enable auto-assign if list is empty
    if (selectedStaffList.length === 0) {
        document.getElementById('autoAssignStaff').checked = true;
    }
}

function updateSelectedStaffDisplay() {
    const container = document.getElementById('selectedStaffList');
    const countLabel = document.getElementById('selectedStaffCount');
    
    if (countLabel) {
        countLabel.textContent = selectedStaffList.length;
    }
    
    if (!container) return;
    
    if (selectedStaffList.length === 0) {
        container.innerHTML = '<div class="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">No staff selected. Search above or choose from recommendations.</div>';
        return;
    }
    
    container.innerHTML = selectedStaffList.map(staff => `
        <div class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                ${staff.initials}
            </div>
            <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 text-sm">${staff.name}</p>
                <p class="text-xs text-indigo-600 font-medium">${staff.role} • ${staff.employeeId}</p>
                <p class="text-xs text-gray-600 mt-0.5">${staff.skills.join(', ')}</p>
                <div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>$${staff.hourlyRate}/hr</span>
                    <span>•</span>
                    <span>${staff.phone}</span>
                </div>
            </div>
            <button onclick="removeSelectedStaff('${staff.id}')" class="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

// ============================================
// Assignment Mode Switching
// ============================================

let currentAssignmentMode = 'staff';
let selectedStaffList = [];

function switchAssignmentMode(mode) {
    currentAssignmentMode = mode;
    
    // Update tab styles
    const tabs = {
        staff: document.getElementById('assignStaffTab'),
        team: document.getElementById('assignTeamTab')
    };
    
    // Reset all tabs
    Object.values(tabs).forEach(tab => {
        if (tab) {
            tab.classList.remove('bg-white', 'text-blue-600', 'shadow-sm', 'text-indigo-600');
            tab.classList.add('text-gray-600');
        }
    });
    
    // Highlight active tab
    if (tabs[mode]) {
        tabs[mode].classList.remove('text-gray-600');
        tabs[mode].classList.add('bg-white', 'shadow-sm');
        
        if (mode === 'staff') tabs[mode].classList.add('text-blue-600');
        if (mode === 'team') tabs[mode].classList.add('text-indigo-600');
    }
    
    // Show/hide mode sections
    const staffMode = document.getElementById('staffAssignmentMode');
    const teamMode = document.getElementById('teamAssignmentMode');
    
    if (staffMode) staffMode.classList.add('hidden');
    if (teamMode) teamMode.classList.add('hidden');
    
    if (mode === 'staff' && staffMode) {
        staffMode.classList.remove('hidden');
        loadRecommendedStaff();
    } else if (mode === 'team' && teamMode) {
        teamMode.classList.remove('hidden');
    }
}

function initializeMultipleStaffMode() {
    const multiStaffSearchInput = document.getElementById('multiStaffSearchInput');
    
    if (multiStaffSearchInput && !multiStaffSearchInput.dataset.initialized) {
        multiStaffSearchInput.addEventListener('input', handleMultiStaffSearch);
        multiStaffSearchInput.dataset.initialized = 'true';
    }
    
    updateMultipleStaffDisplay();
}

function handleMultiStaffSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const autocomplete = document.getElementById('multiStaffAutocomplete');
    
    if (!query) {
        autocomplete.classList.add('hidden');
        return;
    }
    
    // Filter staff (exclude already selected)
    const results = mockStaffDatabase.filter(staff => {
        const nameMatch = staff.name.toLowerCase().includes(query);
        const skillMatch = staff.skills.some(skill => skill.toLowerCase().includes(query));
        const alreadySelected = selectedMultipleStaff.some(s => s.id === staff.id);
        return (nameMatch || skillMatch) && !alreadySelected;
    });
    
    if (results.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500 text-center">No staff found</div>';
        autocomplete.classList.remove('hidden');
        return;
    }
    
    autocomplete.innerHTML = results.map(staff => `
        <div class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0" onclick="addMultipleStaff(${JSON.stringify(staff).replace(/"/g, '&quot;')})">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    ${staff.initials}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${staff.name}</p>
                    <p class="text-xs text-gray-600">${staff.skills.join(', ')}</p>
                </div>
                <button class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded hover:bg-purple-200">
                    Add
                </button>
            </div>
        </div>
    `).join('');
    
    autocomplete.classList.remove('hidden');
}

function addMultipleStaff(staff) {
    if (!selectedMultipleStaff.some(s => s.id === staff.id)) {
        selectedMultipleStaff.push(staff);
        updateMultipleStaffDisplay();
        
        // Clear search
        const searchInput = document.getElementById('multiStaffSearchInput');
        if (searchInput) searchInput.value = '';
        document.getElementById('multiStaffAutocomplete').classList.add('hidden');
        
        showSuccessToast(`${staff.name} added to assignment`);
    }
}

function removeMultipleStaff(staffId) {
    selectedMultipleStaff = selectedMultipleStaff.filter(s => s.id !== staffId);
    updateMultipleStaffDisplay();
}

function updateMultipleStaffDisplay() {
    const container = document.getElementById('selectedMultipleStaffList');
    const countLabel = document.querySelector('#selectedMultipleStaffContainer p');
    
    if (countLabel) {
        countLabel.textContent = `Selected Staff (${selectedMultipleStaff.length})`;
    }
    
    if (!container) return;
    
    if (selectedMultipleStaff.length === 0) {
        container.innerHTML = '<div class="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">No staff selected yet. Search and add staff above.</div>';
        return;
    }
    
    container.innerHTML = selectedMultipleStaff.map(staff => `
        <div class="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                ${staff.initials}
            </div>
            <div class="flex-1">
                <p class="font-semibold text-gray-900 text-sm">${staff.name}</p>
                <p class="text-xs text-gray-600">${staff.skills.join(', ')}</p>
            </div>
            <button onclick="removeMultipleStaff('${staff.id}')" class="text-gray-400 hover:text-red-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

// ============================================
// ============================================
// Time Selection Functions
// ============================================

function toggleCustomTime() {
    const select = document.getElementById('scheduleTimeSelect');
    const customTimeContainer = document.getElementById('customTimeContainer');
    const customTimeInput = document.getElementById('scheduleTime');
    
    if (select.value === 'custom') {
        customTimeContainer.classList.remove('hidden');
        setTimeout(() => customTimeInput.focus(), 100);
    } else {
        customTimeContainer.classList.add('hidden');
        customTimeInput.value = '';
    }
}

function clearCustomTime() {
    const select = document.getElementById('scheduleTimeSelect');
    const customTimeContainer = document.getElementById('customTimeContainer');
    const customTimeInput = document.getElementById('scheduleTime');
    
    // Reset to flexible
    select.value = 'flexible';
    customTimeContainer.classList.add('hidden');
    customTimeInput.value = '';
}

// ============================================
// Sample Data for Testing
// ============================================

function loadSampleData() {
    // Job Details
    const jobNameInput = document.getElementById('jobName');
    if (jobNameInput) {
        jobNameInput.value = 'Complete Tutoring Package - Sarah Johnson';
    }
    
    // Priority - set to High
    const highPriorityRadio = document.querySelector('input[name="priority"][value="high"]');
    if (highPriorityRadio) {
        highPriorityRadio.checked = true;
        updatePriorityBorders();
    }
    
    // Schedule Date - set to 3 days from now
    const scheduleDateInput = document.getElementById('scheduleDate');
    if (scheduleDateInput) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 3);
        scheduleDateInput.value = futureDate.toISOString().split('T')[0];
    }
    
    // Schedule Time
    const scheduleTimeInput = document.getElementById('scheduleTime');
    if (scheduleTimeInput) {
        scheduleTimeInput.value = '10:00';
    }
    
    // Time Range
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    if (startTimeInput) startTimeInput.value = '09:00';
    if (endTimeInput) endTimeInput.value = '15:00';
    
    // Internal Notes
    const internalNotesInput = document.getElementById('internalNotes');
    if (internalNotesInput) {
        internalNotesInput.value = 'High priority client. Student preparing for final exams. Please ensure all materials are ready before the session. Focus on algebra and essay writing techniques.';
    }
    
    // Initialize selected staff display
    setTimeout(() => {
        updateSelectedStaffDisplay();
        loadRecommendedStaff();
    }, 500);
    
    console.log('✅ Sample data loaded for testing');
}

// Simplified sample data loading (without staff functionality)
function loadSampleDataSimple() {
    // Job Details
    const jobNameInput = document.getElementById('jobName');
    if (jobNameInput) {
        jobNameInput.value = 'Complete Tutoring Package - Sarah Johnson';
    }
    
    // Priority - set to Medium (default)
    const prioritySelect = document.getElementById('priority');
    if (prioritySelect) {
        prioritySelect.value = 'medium';
    }
    
    // Internal Notes
    const internalNotesInput = document.getElementById('internalNotes');
    if (internalNotesInput) {
        internalNotesInput.value = 'High priority client. Student preparing for final exams. Please ensure all materials are ready before the session.';
    }
    
    console.log('✅ Simplified sample data loaded');
}

// ============================================================================
// QUOTE SELECTION FUNCTIONS
// ============================================================================

function initializeQuoteSelection() {
    console.log('🔧 Initializing quote selection...');
    
    const changeQuoteBtn = document.getElementById('changeQuoteBtn');
    const closeModalBtn = document.getElementById('closeQuoteModal');
    const quoteSearchInput = document.getElementById('quoteSearchInput');
    const modal = document.getElementById('quoteSearchModal');
    
    console.log('🔘 Change Quote button:', changeQuoteBtn ? 'Found' : 'Not found');
    console.log('❌ Close Modal button:', closeModalBtn ? 'Found' : 'Not found');
    console.log('🔍 Search input:', quoteSearchInput ? 'Found' : 'Not found');
    console.log('📋 Modal:', modal ? 'Found' : 'Not found');
    
    if (changeQuoteBtn) {
        changeQuoteBtn.addEventListener('click', function(e) {
            console.log('🔘 Change Quote button clicked!');
            e.preventDefault();
            showQuoteModal();
        });
        console.log('✅ Change Quote button event listener added');
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideQuoteModal);
    }
    
    if (quoteSearchInput) {
        quoteSearchInput.addEventListener('input', handleQuoteSearch);
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('quoteSearchModal');
        if (modal && e.target === modal) {
            hideQuoteModal();
        }
    });
    
    // Initialize with selected quote
    updateSelectedQuoteDisplay();
    console.log('✅ Quote selection initialized');
}

function handleQuoteSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('quoteSearchResults');
    
    let quotesToShow = mockQuotesDatabase;
    
    if (query) {
        // Filter quotes
        quotesToShow = mockQuotesDatabase.filter(quote => 
            quote.id.toLowerCase().includes(query) ||
            quote.customer.toLowerCase().includes(query) ||
            quote.description.toLowerCase().includes(query)
        );
    }
    
    if (quotesToShow.length === 0) {
        resultsContainer.innerHTML = '<div class="p-4 text-center text-gray-500">No quotes found</div>';
        return;
    }
    
    // Sort by date (newest first)
    quotesToShow.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    
    resultsContainer.innerHTML = quotesToShow.map(quote => createQuoteModalCard(quote)).join('');
    
    // Add click handlers
    resultsContainer.querySelectorAll('[data-quote-id]').forEach(card => {
        card.addEventListener('click', () => {
            const quoteId = card.dataset.quoteId;
            const quote = mockQuotesDatabase.find(q => q.id === quoteId);
            if (quote) {
                selectQuote(quote);
                hideQuoteModal();
            }
        });
    });
}

function createQuoteModalCard(quote) {
    const statusColors = {
        'Approved': 'bg-green-100 text-green-700',
        'Pending': 'bg-yellow-100 text-yellow-700',
        'Draft': 'bg-gray-100 text-gray-700'
    };
    
    const statusColor = statusColors[quote.status] || statusColors['Draft'];
    
    return `
        <div class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors" data-quote-id="${quote.id}">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="font-semibold text-gray-900">${quote.id}</span>
                        <span class="px-2 py-1 text-xs rounded-full ${statusColor}">${quote.status}</span>
                    </div>
                    <p class="text-sm text-gray-700 font-medium mb-1">${quote.customer}</p>
                    <p class="text-xs text-gray-600 mb-2">${quote.description}</p>
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                        <span>${quote.items} items</span>
                        <span class="font-medium text-emerald-600">$${quote.total.toFixed(2)}</span>
                        <span>${formatDate(quote.createdDate)}</span>
                    </div>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    `;
}

function showQuoteModal() {
    console.log('📋 showQuoteModal called');
    const modal = document.getElementById('quoteSearchModal');
    const searchInput = document.getElementById('quoteSearchInput');
    
    console.log('📋 Modal element:', modal ? 'Found' : 'Not found');
    console.log('🔍 Search input element:', searchInput ? 'Found' : 'Not found');
    
    if (modal) {
        console.log('📋 Removing hidden class from modal');
        modal.classList.remove('hidden');
        
        // Load all quotes initially
        console.log('📋 Loading initial quotes');
        handleQuoteSearch({ target: { value: '' } });
        
        // Focus search input
        if (searchInput) {
            setTimeout(() => {
                console.log('🔍 Focusing search input');
                searchInput.focus();
            }, 100);
        }
        
        console.log('✅ Modal should now be visible');
    } else {
        console.error('❌ Modal element not found!');
    }
}

function hideQuoteModal() {
    const modal = document.getElementById('quoteSearchModal');
    const searchInput = document.getElementById('quoteSearchInput');
    
    if (modal) {
        modal.classList.add('hidden');
    }
    
    if (searchInput) {
        searchInput.value = '';
    }
}

function showRecentQuotes() {
    const autocomplete = document.getElementById('quoteAutocomplete');
    const recentQuotes = mockQuotesDatabase
        .filter(q => q.status === 'Approved')
        .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
        .slice(0, 5);
    
    if (recentQuotes.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500 text-center">No recent quotes available</div>';
    } else {
        autocomplete.innerHTML = `
            <div class="p-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">Recent Approved Quotes</div>
            ${recentQuotes.map(quote => createQuoteResultCard(quote)).join('')}
        `;
        
        // Add click handlers
        autocomplete.querySelectorAll('[data-quote-id]').forEach(card => {
            card.addEventListener('click', () => {
                const quoteId = card.dataset.quoteId;
                const quote = mockQuotesDatabase.find(q => q.id === quoteId);
                if (quote) {
                    selectQuote(quote);
                }
            });
        });
    }
    
    autocomplete.classList.remove('hidden');
}

function selectQuote(quote) {
    selectedQuote = quote;
    updateSelectedQuoteDisplay();
    updateQuoteInfoBar();
    updateCustomerInfo();
    updateInfoBanner();
    
    // Clear search
    const searchInput = document.getElementById('quoteSearchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Hide autocomplete
    const autocomplete = document.getElementById('quoteAutocomplete');
    if (autocomplete) {
        autocomplete.classList.add('hidden');
    }
    
    // Hide recent quotes section
    const recentSection = document.getElementById('recentQuotesSection');
    if (recentSection) {
        recentSection.classList.add('hidden');
    }
    
    showSuccessToast(`Quote ${quote.id} selected successfully!`);
}

function updateSelectedQuoteDisplay() {
    const quoteIdEl = document.getElementById('selectedQuoteId');
    
    if (quoteIdEl) {
        quoteIdEl.textContent = `${selectedQuote.id} • ${selectedQuote.customer} • $${selectedQuote.total.toFixed(2)}`;
    }
    
    // Update summary section
    updateCustomerInfo();
}

function updateQuoteInfoBar() {
    // Update the quote info bar at the top
    const elements = {
        quoteId: document.querySelector('.bg-gray-50 .font-semibold'),
        customer: document.querySelectorAll('.bg-gray-50 .font-semibold')[1],
        total: document.querySelectorAll('.bg-gray-50 .font-semibold')[2]
    };
    
    if (elements.quoteId) elements.quoteId.textContent = selectedQuote.id;
    if (elements.customer) elements.customer.textContent = selectedQuote.customer;
    if (elements.total) elements.total.textContent = `${selectedQuote.items} items • $${selectedQuote.total.toFixed(2)}`;
}

function updateCustomerInfo() {
    console.log('🔄 Updating customer info...');
    
    // Update customer name in summary
    const customerNameEl = document.querySelector('.bg-gray-50 .font-semibold.text-gray-900');
    console.log('👤 Customer name element:', customerNameEl ? 'Found' : 'Not found');
    if (customerNameEl) {
        customerNameEl.textContent = selectedQuote.customer;
        console.log('✅ Updated customer name to:', selectedQuote.customer);
    }
    
    // Update email and phone links
    const emailLink = document.querySelector('a[href^="mailto:"]');
    const phoneLink = document.querySelector('a[href^="tel:"]');
    
    console.log('📧 Email link:', emailLink ? 'Found' : 'Not found');
    console.log('📞 Phone link:', phoneLink ? 'Found' : 'Not found');
    
    if (emailLink) {
        emailLink.href = `mailto:${selectedQuote.customerEmail}`;
    }
    
    if (phoneLink) {
        phoneLink.href = `tel:${selectedQuote.customerPhone}`;
    }
    
    // Check if quote summary section exists
    const quoteSummarySection = document.querySelector('.bg-emerald-50');
    console.log('💚 Quote summary section:', quoteSummarySection ? 'Found' : 'Not found');
    
    if (quoteSummarySection) {
        // Update quote details in summary
        const quoteDetailsEls = quoteSummarySection.querySelectorAll('.flex.justify-between .font-medium, .flex.justify-between .font-semibold');
        console.log('📊 Quote detail elements found:', quoteDetailsEls.length);
        
        if (quoteDetailsEls.length >= 3) {
            quoteDetailsEls[0].textContent = selectedQuote.id;
            quoteDetailsEls[1].textContent = `${selectedQuote.items} items`;
            quoteDetailsEls[2].textContent = `$${selectedQuote.total.toFixed(2)}`;
            console.log('✅ Updated quote details');
        } else {
            console.log('❌ Not enough quote detail elements found');
        }
    } else {
        console.log('❌ Quote summary section (.bg-emerald-50) not found in DOM');
        // Let's check what elements do exist
        const allElements = document.querySelectorAll('.bg-emerald-50, .emerald, [class*="emerald"]');
        console.log('🔍 Elements with emerald classes:', allElements.length);
    }
}

function updateInfoBanner() {
    const titleEl = document.getElementById('infoBannerTitle');
    const textEl = document.getElementById('infoBannerText');
    
    if (titleEl) {
        titleEl.textContent = `Creating job from quote ${selectedQuote.id}`;
    }
    
    if (textEl) {
        textEl.textContent = `All quote line items will be included in this job. You can adjust the details below before creating the job.`;
    }
}

function showQuoteSelection() {
    const searchInput = document.getElementById('quoteSearchInput');
    if (searchInput) {
        searchInput.focus();
        showRecentQuotes();
    }
}

function loadRecentQuotes() {
    const recentSection = document.getElementById('recentQuotesSection');
    const recentList = document.getElementById('recentQuotesList');
    
    if (!recentList) return;
    
    const recentQuotes = mockQuotesDatabase
        .filter(q => q.status === 'Approved' && q.id !== selectedQuote.id)
        .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
        .slice(0, 3);
    
    if (recentQuotes.length === 0) {
        recentList.innerHTML = '<div class="p-3 text-sm text-gray-500 text-center">No other recent quotes available</div>';
        return;
    }
    
    recentList.innerHTML = recentQuotes.map(quote => `
        <button onclick="selectQuote(mockQuotesDatabase.find(q => q.id === '${quote.id}'))" 
                class="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="font-semibold text-gray-900 text-sm">${quote.id}</span>
                        <span class="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">${quote.status}</span>
                    </div>
                    <p class="text-sm text-gray-700">${quote.customer}</p>
                    <p class="text-xs text-gray-500">${quote.items} items • $${quote.total.toFixed(2)}</p>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </button>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// ============================================================================
// DURATION CALCULATION
// ============================================================================

function calculateDuration() {
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const durationDisplay = document.getElementById('calculatedDuration');
    
    if (!startTimeInput || !endTimeInput || !durationDisplay) return;
    
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    
    if (!startTime || !endTime) {
        durationDisplay.textContent = '--';
        return;
    }
    
    // Parse times
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    // Convert to minutes
    const startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // Handle overnight shifts (end time next day)
    if (endMinutes <= startMinutes) {
        endMinutes += 24 * 60; // Add 24 hours
    }
    
    // Calculate duration in minutes
    const durationMinutes = endMinutes - startMinutes;
    
    // Convert back to hours and minutes
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    // Format display
    if (hours === 0) {
        durationDisplay.textContent = `${minutes} minutes`;
    } else if (minutes === 0) {
        durationDisplay.textContent = `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
        durationDisplay.textContent = `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
    }
}
