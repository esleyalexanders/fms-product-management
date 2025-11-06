// Job Create Simple - JavaScript

// Load main content on page load
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load the main content template (with cache busting)
        const response = await fetch('job_create_simple_content.html?v=' + Date.now());
        
        if (!response.ok) {
            throw new Error('Failed to load content');
        }
        
        const html = await response.text();
        document.getElementById('mainContent').innerHTML = html;
        
        console.log('✅ Content loaded successfully');
        console.log('📊 Grid container found:', document.querySelector('.grid.grid-cols-1') ? 'Yes' : 'No');
        console.log('👤 Customer card found:', document.querySelector('.sticky.top-4') ? 'Yes' : 'No');
        console.log('📝 Notes section found:', document.querySelector('#internalNotes') ? 'Yes' : 'No');
        console.log('📋 Total cards in left column:', document.querySelectorAll('.lg\\:col-span-8 > .bg-white').length);
        
        // Debug: Check what's actually in the DOM
        console.log('🔍 DEBUG: Right column exists?', document.querySelector('.lg\\:col-span-4') ? 'Yes' : 'No');
        console.log('🔍 DEBUG: Notes card exists?', document.querySelector('h2') ? Array.from(document.querySelectorAll('h2')).map(h => h.textContent) : 'No h2 tags');
        console.log('🔍 DEBUG: Total .bg-white cards:', document.querySelectorAll('.bg-white').length);
        
        // Initialize event listeners after content is loaded
        initializeEventListeners();
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('scheduleDate');
        if (dateInput) {
            dateInput.setAttribute('min', today);
        }
        
        // Load sample data for testing
        loadSampleData();
    } catch (error) {
        console.error('Error loading content:', error);
        // Show error message
        document.getElementById('mainContent').innerHTML = `
            <div class="bg-red-50 border-l-4 border-red-500 p-4">
                <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <p class="text-sm text-red-800 font-medium">Failed to load form content</p>
                        <p class="text-sm text-red-700 mt-1">
                            Please open this page using a web server (e.g., Live Server extension) or check that job_create_simple_content.html exists in the same directory.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
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
    
    // Priority radio buttons - update border colors
    const priorityInputs = document.querySelectorAll('input[name="priority"]');
    priorityInputs.forEach(input => {
        input.addEventListener('change', updatePriorityBorders);
    });
    
    // Assignment Mode Tabs
    const assignStaffTab = document.getElementById('assignStaffTab');
    const assignTeamTab = document.getElementById('assignTeamTab');
    
    if (assignStaffTab) assignStaffTab.addEventListener('click', () => switchAssignmentMode('staff'));
    if (assignTeamTab) assignTeamTab.addEventListener('click', () => switchAssignmentMode('team'));
    
    // Staff search functionality
    const staffSearchInput = document.getElementById('staffSearchInput');
    const clearStaffSearchBtn = document.getElementById('clearStaffSearchBtn');
    const refreshRecommendationsBtn = document.getElementById('refreshRecommendations');
    const removeStaffBtn = document.getElementById('removeStaffBtn');
    
    if (staffSearchInput) {
        staffSearchInput.addEventListener('input', handleStaffSearch);
        staffSearchInput.addEventListener('focus', () => {
            // Trigger search if there's already a value
            if (staffSearchInput.value.trim()) {
                handleStaffSearch({ target: staffSearchInput });
            }
        });
    }
    
    // Close autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        const autocomplete = document.getElementById('staffAutocomplete');
        const searchInput = document.getElementById('staffSearchInput');
        if (autocomplete && searchInput && 
            !autocomplete.contains(e.target) && 
            e.target !== searchInput) {
            autocomplete.classList.add('hidden');
        }
    });
    
    if (clearStaffSearchBtn) {
        clearStaffSearchBtn.addEventListener('click', clearStaffSearch);
    }
    
    if (refreshRecommendationsBtn) {
        refreshRecommendationsBtn.addEventListener('click', loadRecommendedStaff);
    }
    
    if (removeStaffBtn) {
        removeStaffBtn.addEventListener('click', removeSelectedStaff);
    }
    
    // Load recommended staff on page load
    loadRecommendedStaff();
    
    // Close autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#staffSearchInput') && !e.target.closest('#staffAutocomplete')) {
            document.getElementById('staffAutocomplete').classList.add('hidden');
        }
    });
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
        durationHours: parseInt(document.getElementById('durationHours').value) || 0,
        durationMinutes: parseInt(document.getElementById('durationMinutes').value) || 0,
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
    
    // Duration validation
    const durationHours = parseInt(document.getElementById('durationHours').value) || 0;
    const durationMinutes = parseInt(document.getElementById('durationMinutes').value) || 0;
    
    if (durationHours < 0 || durationHours > 24) {
        errors.push('Duration hours must be between 0 and 24');
        document.getElementById('durationHours').classList.add('border-red-500');
        isValid = false;
    } else {
        document.getElementById('durationHours').classList.remove('border-red-500');
    }
    
    if (durationMinutes < 0 || durationMinutes > 59) {
        errors.push('Duration minutes must be between 0 and 59');
        document.getElementById('durationMinutes').classList.add('border-red-500');
        isValid = false;
    } else {
        document.getElementById('durationMinutes').classList.remove('border-red-500');
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
    
    // Duration
    const durationHoursInput = document.getElementById('durationHours');
    const durationMinutesInput = document.getElementById('durationMinutes');
    if (durationHoursInput) durationHoursInput.value = '6';
    if (durationMinutesInput) durationMinutesInput.value = '0';
    
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
