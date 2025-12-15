// Session Create Script
// Handles form logic, validation, and data management for creating sessions

// Sample staff data (in real app, fetch from API/localStorage)
const sampleStaff = [
    { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-002', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Instructor', department: 'Science' },
    { id: 'STAFF-003', name: 'Michael Chen', email: 'michael.chen@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-004', name: 'Emily Rodriguez', email: 'emily.r@example.com', role: 'Instructor', department: 'Yoga' },
    { id: 'STAFF-005', name: 'James Wilson', email: 'james.w@example.com', role: 'Instructor', department: 'Guitar' },
    { id: 'STAFF-006', name: 'Lisa Anderson', email: 'lisa.a@example.com', role: 'Instructor', department: 'Science' },
    { id: 'STAFF-007', name: 'Robert Taylor', email: 'robert.t@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-008', name: 'Jennifer White', email: 'jennifer.w@example.com', role: 'Instructor', department: 'Yoga' },
    { id: 'STAFF-009', name: 'David Kim', email: 'david.k@example.com', role: 'Instructor', department: 'Computer Science' },
    { id: 'STAFF-010', name: 'Amanda Martinez', email: 'amanda.m@example.com', role: 'Instructor', department: 'English' }
];

// Form state
let currentClass = null;
let classIdFromUrl = null;
let selectedStaff = [];
let allStaff = [...sampleStaff];
let filteredStaff = [...sampleStaff];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadClassData();
});

function loadClassData() {
    const urlParams = new URLSearchParams(window.location.search);
    classIdFromUrl = urlParams.get('classId');
    
    if (!classIdFromUrl) {
        showNotification('Class ID is required', 'error');
        setTimeout(() => {
            window.location.href = 'group_list.html';
        }, 2000);
        return;
    }
    
    // Load class from localStorage
    try {
        const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
        currentClass = classes.find(c => c.id === classIdFromUrl);
        
        if (!currentClass) {
            showNotification('Class not found', 'error');
            setTimeout(() => {
                window.location.href = 'group_list.html';
            }, 2000);
            return;
        }
        
        // Populate class info
        document.getElementById('classIdBadge').textContent = currentClass.id;
        document.getElementById('className').textContent = currentClass.name || 'Sunshine Tutoring - Melbourne East';
        document.getElementById('summaryClassName').textContent = currentClass.name || '-';
        document.getElementById('classDefaultCapacity').textContent = `${currentClass.maxCapacity || '-'} students`;
        
        // Set default capacity
        if (currentClass.maxCapacity) {
            document.getElementById('maxCapacity').value = currentClass.maxCapacity;
        }
        
        // Set default time from class schedule
        if (currentClass.schedule) {
            if (currentClass.schedule.startTime) {
                document.getElementById('startTime').value = currentClass.schedule.startTime;
            }
            if (currentClass.schedule.endTime) {
                document.getElementById('endTime').value = currentClass.schedule.endTime;
            }
            calculateDuration();
        }
        
        // Show default staff
        renderDefaultStaff();
        
        // Render staff list
        renderStaffList();
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('sessionDate').setAttribute('min', today);
        
        // Update summary
        updateSummary();
        
        // Add event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Error loading class:', error);
        showNotification('Error loading class data', 'error');
    }
}

function setupEventListeners() {
    document.getElementById('sessionDate').addEventListener('change', updateSummary);
    document.getElementById('startTime').addEventListener('change', updateSummary);
    document.getElementById('endTime').addEventListener('change', updateSummary);
    document.getElementById('status').addEventListener('change', updateSummary);
    document.getElementById('maxCapacity').addEventListener('input', updateSummary);
}

function renderDefaultStaff() {
    const container = document.getElementById('defaultStaffList');
    if (!currentClass.defaultStaff || currentClass.defaultStaff.length === 0) {
        container.innerHTML = '<span class="text-xs text-emerald-600">No default staff assigned</span>';
        return;
    }
    
    container.innerHTML = currentClass.defaultStaff.map(staff => {
        const initials = staff.name.split(' ').map(n => n[0]).join('');
        return `
            <span class="px-2 py-1 bg-emerald-200 text-emerald-800 rounded text-xs font-medium">
                ${staff.name}
            </span>
        `;
    }).join('');
}

function renderStaffList() {
    const container = document.getElementById('staffListContainer');
    
    if (filteredStaff.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-4">No staff found</p>';
        return;
    }
    
    container.innerHTML = filteredStaff.map(staff => {
        const isSelected = selectedStaff.some(s => s.id === staff.id);
        const initials = staff.name.split(' ').map(n => n[0]).join('');
        
        return `
            <div class="p-3 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer ${isSelected ? 'bg-emerald-100 border-emerald-500' : ''}" onclick="toggleStaff('${staff.id}')">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span class="text-sm font-semibold text-emerald-700">${initials}</span>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">${staff.name}</p>
                        <p class="text-xs text-gray-500">${staff.role} - ${staff.department}</p>
                    </div>
                    ${isSelected ? `
                        <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function filterStaff() {
    const searchQuery = document.getElementById('staffSearch').value.toLowerCase();
    filteredStaff = allStaff.filter(staff => {
        return staff.name.toLowerCase().includes(searchQuery) ||
               staff.email.toLowerCase().includes(searchQuery) ||
               staff.role.toLowerCase().includes(searchQuery) ||
               staff.department.toLowerCase().includes(searchQuery);
    });
    renderStaffList();
}

function toggleStaff(staffId) {
    const staff = allStaff.find(s => s.id === staffId);
    if (!staff) return;
    
    const index = selectedStaff.findIndex(s => s.id === staffId);
    if (index > -1) {
        selectedStaff.splice(index, 1);
    } else {
        selectedStaff.push(staff);
    }
    
    renderStaffList();
    renderSelectedStaff();
    updateSummary();
}

function renderSelectedStaff() {
    const container = document.getElementById('selectedStaffList');
    const countEl = document.getElementById('selectedStaffCount');
    
    countEl.textContent = selectedStaff.length;
    
    if (selectedStaff.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-400">No staff selected (will use class defaults)</p>';
        return;
    }
    
    container.innerHTML = selectedStaff.map(staff => {
        const initials = staff.name.split(' ').map(n => n[0]).join('');
        return `
            <div class="staff-chip px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-2">
                <span class="text-xs font-medium">${staff.name}</span>
                <button 
                    type="button"
                    onclick="removeStaff('${staff.id}')"
                    class="text-emerald-600 hover:text-emerald-800"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
    }).join('');
}

function removeStaff(staffId) {
    selectedStaff = selectedStaff.filter(s => s.id !== staffId);
    renderStaffList();
    renderSelectedStaff();
    updateSummary();
}

function calculateDuration() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (!startTime || !endTime) {
        document.getElementById('duration').value = '';
        return;
    }
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (end < start) {
        // End time is next day
        end.setDate(end.getDate() + 1);
    }
    
    const diffMs = end - start;
    const diffMins = Math.round(diffMs / 60000);
    
    document.getElementById('duration').value = diffMins;
    updateSummary();
}

function updateSummary() {
    const date = document.getElementById('sessionDate').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const status = document.getElementById('status').value;
    const capacity = document.getElementById('maxCapacity').value || currentClass?.maxCapacity || '-';
    
    // Date
    if (date) {
        const dateObj = new Date(date);
        document.getElementById('summaryDate').textContent = dateObj.toLocaleDateString('en-AU', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    } else {
        document.getElementById('summaryDate').textContent = '-';
    }
    
    // Time
    if (startTime && endTime) {
        document.getElementById('summaryTime').textContent = `${startTime} - ${endTime}`;
    } else {
        document.getElementById('summaryTime').textContent = '-';
    }
    
    // Duration
    const duration = document.getElementById('duration').value;
    document.getElementById('summaryDuration').textContent = duration ? `${duration} minutes` : '-';
    
    // Status
    const statusConfig = {
        scheduled: 'Scheduled',
        in_progress: 'In Progress',
        completed: 'Completed',
        cancelled: 'Cancelled'
    };
    document.getElementById('summaryStatus').textContent = statusConfig[status] || status;
    
    // Capacity
    document.getElementById('summaryCapacity').textContent = capacity;
    
    // Staff
    if (selectedStaff.length > 0) {
        document.getElementById('summaryStaff').textContent = `${selectedStaff.length} selected`;
    } else if (currentClass?.defaultStaff && currentClass.defaultStaff.length > 0) {
        document.getElementById('summaryStaff').textContent = `${currentClass.defaultStaff.length} (default)`;
    } else {
        document.getElementById('summaryStaff').textContent = '-';
    }
}

function handleSave() {
    // Validation
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const sessionData = {
        id: generateSessionId(),
        classId: classIdFromUrl,
        date: document.getElementById('sessionDate').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        duration: parseInt(document.getElementById('duration').value) || 0,
        status: document.getElementById('status').value,
        maxCapacity: document.getElementById('maxCapacity').value ? parseInt(document.getElementById('maxCapacity').value) : currentClass.maxCapacity,
        assignedStaff: selectedStaff.length > 0 ? selectedStaff : currentClass.defaultStaff || [],
        notes: document.getElementById('notes').value || '',
        confirmedSlots: 0,
        bookings: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        sessions.push(sessionData);
        localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
        
        showNotification('Session created successfully', 'success');
        setTimeout(() => {
            window.location.href = `group_detail.html?id=${classIdFromUrl}`;
        }, 1500);
    } catch (error) {
        console.error('Error saving session:', error);
        showNotification('Error saving session', 'error');
    }
}

function validateForm() {
    let isValid = true;
    
    // Date
    const date = document.getElementById('sessionDate').value;
    if (!date) {
        showFieldError('sessionDate', 'Date is required');
        isValid = false;
    } else {
        clearFieldError('sessionDate');
    }
    
    // Start time
    const startTime = document.getElementById('startTime').value;
    if (!startTime) {
        showFieldError('startTime', 'Start time is required');
        isValid = false;
    } else {
        clearFieldError('startTime');
    }
    
    // End time
    const endTime = document.getElementById('endTime').value;
    if (!endTime) {
        showFieldError('endTime', 'End time is required');
        isValid = false;
    } else {
        clearFieldError('endTime');
    }
    
    // Time logic
    if (startTime && endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        let end = new Date(`2000-01-01T${endTime}`);
        if (end < start) {
            end.setDate(end.getDate() + 1);
        }
        const diffMs = end - start;
        const diffMins = Math.round(diffMs / 60000);
        
        if (diffMins <= 0) {
            showNotification('End time must be after start time', 'error');
            isValid = false;
        }
    }
    
    if (!isValid) {
        showNotification('Please fix the errors in the form', 'error');
    }
    
    return isValid;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('border-red-500');
        field.classList.remove('border-gray-300');
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('border-red-500');
        field.classList.add('border-gray-300');
    }
}

function generateSessionId() {
    const year = new Date().getFullYear();
    const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
    const count = sessions.length + 1;
    return `SESSION-${year}-${String(count).padStart(3, '0')}`;
}

function goBack() {
    if (classIdFromUrl) {
        window.location.href = `group_detail.html?id=${classIdFromUrl}`;
    } else {
                window.location.href = 'group_list.html';
    }
}

// ==================== Notifications ====================

function showNotification(message, type = 'info') {
    const container = document.createElement('div');
    container.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    container.textContent = message;
    
    document.body.appendChild(container);
    
    setTimeout(() => {
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        }, 300);
    }, 3000);
}

