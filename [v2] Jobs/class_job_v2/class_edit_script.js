// Class Edit Script
// Handles form logic, validation, and data management for editing classes

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

// Sample pricebook items
const availablePricebookItems = [
    {
        id: 'PB-YOGA-CLASS',
        name: 'Yoga Class - Group (per seat)',
        description: '60-minute guided yoga session led by certified instructor',
        tag: 'Yoga',
        price: 50.00
    },
    {
        id: 'PB-MATH-TUTORING',
        name: 'Math Tutoring - Group Session',
        description: 'Group math tutoring session for up to 20 students',
        tag: 'Math',
        price: 120.00
    },
    {
        id: 'PB-ALGEBRA-II',
        name: 'Algebra II - Group Session',
        description: 'Advanced algebra group class covering quadratic equations, polynomials, and functions',
        tag: 'Math',
        price: 180.00
    },
    {
        id: 'PB-GUITAR-SESSION',
        name: 'Guitar Workshop - Group (per seat)',
        description: 'Small group guitar coaching, includes practice materials',
        tag: 'Guitar',
        price: 45.00
    },
    {
        id: 'PB-SCIENCE-LAB',
        name: 'Science Lab Session - Group',
        description: 'Hands-on science experiment session',
        tag: 'Science',
        price: 80.00
    },
    {
        id: 'PB-PHYSICS-WORKSHOP',
        name: 'Physics Workshop - Group',
        description: 'Group physics problem-solving and concept review',
        tag: 'Science',
        price: 200.00
    },
    {
        id: 'PB-WELLNESS-PASS',
        name: 'Wellness Drop-in Pass',
        description: 'Flexible pass that can be applied to yoga, stretch, or meditation classes',
        tag: 'Wellness',
        price: 35.00
    }
];

// Form state
let currentClass = null;
let formData = {
    selectedPricebookItem: null,
    selectedStaff: [],
    selectedDays: [],
    originalSchedule: null,
    originalStaff: []
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadClassData();
});

function loadClassData() {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('id');
    
    if (!classId) {
        showNotification('Class ID is required', 'error');
        setTimeout(() => {
            window.location.href = 'class_list.html';
        }, 2000);
        return;
    }
    
    // Load from localStorage
    try {
        const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
        currentClass = classes.find(c => c.id === classId);
        
        if (!currentClass) {
            showNotification('Class not found', 'error');
            setTimeout(() => {
                window.location.href = 'class_list.html';
            }, 2000);
            return;
        }
        
        populateForm();
        initializePage();
    } catch (error) {
        console.error('Error loading class:', error);
        showNotification('Error loading class data', 'error');
    }
}

function populateForm() {
    // Update header
    document.getElementById('classIdBadge').textContent = currentClass.id;
    updateStatusBadge();
    
    // Basic Information
    document.getElementById('className').value = currentClass.name || '';
    document.getElementById('description').value = currentClass.description || '';
    document.getElementById('skillLevel').value = currentClass.skillLevel || '';
    document.getElementById('status').value = currentClass.status || 'active';
    
    // Price Book Item
    if (currentClass.pricebookItem) {
        formData.selectedPricebookItem = currentClass.pricebookItem;
        renderSelectedPricebookItem();
    }
    
    // Schedule
    if (currentClass.schedule) {
        document.getElementById('frequency').value = currentClass.schedule.frequency || 'weekly';
        formData.selectedDays = currentClass.schedule.daysOfWeek || [];
        document.getElementById('startTime').value = currentClass.schedule.startTime || '';
        document.getElementById('endTime').value = currentClass.schedule.endTime || '';
        document.getElementById('duration').value = currentClass.schedule.duration || '';
        document.getElementById('startDate').value = currentClass.schedule.startDate || '';
        document.getElementById('endDate').value = currentClass.schedule.endDate || '';
        
        if (currentClass.schedule.frequency === 'custom') {
            document.getElementById('customInterval').value = currentClass.schedule.customInterval || 2;
            document.getElementById('customIntervalUnit').value = currentClass.schedule.customIntervalUnit || 'weeks';
        }
        
        // Store original schedule for comparison
        formData.originalSchedule = JSON.parse(JSON.stringify(currentClass.schedule));
    }
    
    // Staff
    if (currentClass.defaultStaff) {
        formData.selectedStaff = currentClass.defaultStaff.map(s => {
            // Find full staff object if available
            const fullStaff = sampleStaff.find(st => st.id === s.id);
            return fullStaff || s;
        });
        formData.originalStaff = JSON.parse(JSON.stringify(formData.selectedStaff));
    }
    
    // Capacity
    document.getElementById('maxCapacity').value = currentClass.maxCapacity || 10;
    
    updateSummary();
}

function initializePage() {
    renderStaffList();
    renderPricebookItemsList();
    setupDaySelectors();
    setupTimeInputs();
    handleFrequencyChange();
    renderSelectedStaff();
    updateSelectedDays();
}

function updateStatusBadge() {
    const badge = document.getElementById('classStatusBadge');
    const status = currentClass.status || 'active';
    
    const statusConfig = {
        active: { text: 'Active', class: 'bg-green-100 text-green-700' },
        paused: { text: 'Paused', class: 'bg-yellow-100 text-yellow-700' },
        archived: { text: 'Archived', class: 'bg-gray-100 text-gray-700' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    badge.textContent = config.text;
    badge.className = `px-2 py-1 text-xs rounded ${config.class}`;
}

function updateSelectedDays() {
    const dayButtons = document.querySelectorAll('.day-selector');
    dayButtons.forEach(btn => {
        const day = btn.dataset.day;
        if (formData.selectedDays.includes(day)) {
            btn.classList.add('selected', 'bg-emerald-600', 'text-white');
            btn.classList.remove('border-gray-300', 'text-gray-700');
        } else {
            btn.classList.remove('selected', 'bg-emerald-600', 'text-white');
            btn.classList.add('border-gray-300', 'text-gray-700');
        }
    });
}

// ==================== Tab Switching ====================

function switchTab(tabName, event) {
    // Prevent default if event is provided
    if (event) {
        event.preventDefault();
    }
    
    // Hide all tab contents with fade effect
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.opacity = '0';
        setTimeout(() => {
            content.classList.add('hidden');
        }, 150);
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active', 'border-emerald-500', 'text-emerald-600');
        button.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
    });
    
    // Show selected tab content with fade effect
    setTimeout(() => {
        const selectedContent = document.getElementById(tabName + 'Content');
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
            selectedContent.style.opacity = '0';
            setTimeout(() => {
                selectedContent.style.opacity = '1';
                selectedContent.style.transition = 'opacity 0.3s ease-in-out';
            }, 10);
        }
        
        // Add active class to selected tab button
        const selectedButton = document.getElementById(tabName + 'Tab');
        if (selectedButton) {
            selectedButton.classList.add('active', 'border-emerald-500', 'text-emerald-600');
            selectedButton.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
        }
        
        // Update summary when switching tabs
        updateSummary();
        
        // Tab-specific actions
        if (tabName === 'schedule') {
            updateScheduleSummary();
        } else if (tabName === 'staff') {
            updateStaffSummary();
        }
    }, 150);
}

// ==================== Pricebook Item Selection ====================

function showPricebookModal() {
    document.getElementById('pricebookModal').classList.remove('hidden');
    filterPricebookItems();
}

function closePricebookModal() {
    document.getElementById('pricebookModal').classList.add('hidden');
    document.getElementById('pricebookSearch').value = '';
}

function filterPricebookItems() {
    const searchQuery = document.getElementById('pricebookSearch').value.toLowerCase();
    renderPricebookItemsList(searchQuery);
}

function renderPricebookItemsList(searchQuery = '') {
    const container = document.getElementById('pricebookItemsList');
    
    const filtered = availablePricebookItems.filter(item => {
        if (!searchQuery) return true;
        return item.name.toLowerCase().includes(searchQuery) ||
               item.description?.toLowerCase().includes(searchQuery) ||
               item.tag?.toLowerCase().includes(searchQuery);
    });
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-8">No pricebook items found</p>';
        return;
    }
    
    container.innerHTML = filtered.map(item => `
        <button
            type="button"
            onclick="selectPricebookItem('${item.id}')"
            class="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
        >
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">${item.name}</h4>
                    <p class="text-sm text-gray-600 mt-1">${item.description || ''}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">${item.tag || 'General'}</span>
                        <span class="text-sm font-semibold text-gray-900">$${item.price?.toFixed(2) || '0.00'}</span>
                    </div>
                </div>
                ${formData.selectedPricebookItem?.id === item.id ? `
                    <svg class="w-5 h-5 text-emerald-600 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                ` : ''}
            </div>
        </button>
    `).join('');
}

function selectPricebookItem(itemId) {
    const item = availablePricebookItems.find(pb => pb.id === itemId);
    if (item) {
        formData.selectedPricebookItem = item;
        renderSelectedPricebookItem();
        closePricebookModal();
        updateSummary();
        showNotification('Pricebook item updated', 'success');
    }
}

function renderSelectedPricebookItem() {
    const container = document.getElementById('pricebookItemContainer');
    
    if (formData.selectedPricebookItem) {
        container.innerHTML = `
            <div class="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-lg">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-emerald-900">${formData.selectedPricebookItem.name}</h4>
                        <p class="text-sm text-emerald-700 mt-1">${formData.selectedPricebookItem.description || ''}</p>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="px-2 py-1 text-xs bg-emerald-200 text-emerald-800 rounded">${formData.selectedPricebookItem.tag || 'General'}</span>
                            <span class="text-sm font-semibold text-emerald-900">$${formData.selectedPricebookItem.price?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onclick="showPricebookModal()"
                        class="ml-4 text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                    >
                        Change
                    </button>
                </div>
            </div>
        `;
    }
}

// ==================== Staff Selection ====================

function renderStaffList() {
    const container = document.getElementById('staffListContainer');
    const searchQuery = document.getElementById('staffSearch')?.value.toLowerCase() || '';
    
    const filtered = sampleStaff.filter(staff => {
        if (!searchQuery) return true;
        return staff.name.toLowerCase().includes(searchQuery) ||
               staff.email.toLowerCase().includes(searchQuery) ||
               staff.department?.toLowerCase().includes(searchQuery);
    });
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-4">No staff found</p>';
        return;
    }
    
    container.innerHTML = filtered.map(staff => {
        const isSelected = formData.selectedStaff.some(s => s.id === staff.id);
        return `
            <label class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input 
                    type="checkbox" 
                    class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    ${isSelected ? 'checked' : ''}
                    onchange="toggleStaff('${staff.id}')"
                />
                <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">${staff.name}</p>
                    <p class="text-xs text-gray-500">${staff.role} • ${staff.department}</p>
                </div>
            </label>
        `;
    }).join('');
}

function filterStaff() {
    renderStaffList();
}

function toggleStaff(staffId) {
    const staff = sampleStaff.find(s => s.id === staffId);
    if (!staff) return;
    
    const index = formData.selectedStaff.findIndex(s => s.id === staffId);
    if (index > -1) {
        formData.selectedStaff.splice(index, 1);
    } else {
        formData.selectedStaff.push(staff);
    }
    
    renderStaffList();
    renderSelectedStaff();
    checkStaffChanges();
    validateStaffSelection();
    updateSummary();
}

function renderSelectedStaff() {
    const container = document.getElementById('selectedStaffList');
    const countEl = document.getElementById('selectedStaffCount');
    
    countEl.textContent = formData.selectedStaff.length;
    
    if (formData.selectedStaff.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-400">No staff selected</p>';
        return;
    }
    
    container.innerHTML = formData.selectedStaff.map(staff => {
        const initials = staff.name.split(' ').map(n => n[0]).join('');
        return `
            <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full">
                <span class="text-xs font-semibold">${initials}</span>
                <span class="text-sm">${staff.name}</span>
                <button 
                    type="button"
                    onclick="removeStaff('${staff.id}')"
                    class="ml-1 text-emerald-600 hover:text-emerald-800"
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
    formData.selectedStaff = formData.selectedStaff.filter(s => s.id !== staffId);
    renderStaffList();
    renderSelectedStaff();
    checkStaffChanges();
    validateStaffSelection();
    updateSummary();
}

function validateStaffSelection() {
    const errorEl = document.getElementById('staffError');
    if (formData.selectedStaff.length === 0) {
        errorEl.classList.remove('hidden');
        return false;
    } else {
        errorEl.classList.add('hidden');
        return true;
    }
}

// ==================== Day Selection ====================

function setupDaySelectors() {
    const dayButtons = document.querySelectorAll('.day-selector');
    dayButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const day = this.dataset.day;
            toggleDay(day, this);
        });
    });
}

function toggleDay(day, buttonElement) {
    const index = formData.selectedDays.indexOf(day);
    if (index > -1) {
        formData.selectedDays.splice(index, 1);
        buttonElement.classList.remove('selected', 'bg-emerald-600', 'text-white');
        buttonElement.classList.add('border-gray-300', 'text-gray-700');
    } else {
        formData.selectedDays.push(day);
        buttonElement.classList.add('selected', 'bg-emerald-600', 'text-white');
        buttonElement.classList.remove('border-gray-300', 'text-gray-700');
    }
    checkScheduleChanges();
    updateSummary();
}

// ==================== Schedule Configuration ====================

function handleFrequencyChange() {
    const frequency = document.getElementById('frequency').value;
    const daysSection = document.getElementById('daysOfWeekSection');
    const customSection = document.getElementById('customIntervalSection');
    
    if (frequency === 'weekly') {
        daysSection.classList.remove('hidden');
        customSection.classList.add('hidden');
    } else if (frequency === 'custom') {
        daysSection.classList.add('hidden');
        customSection.classList.remove('hidden');
    } else {
        daysSection.classList.add('hidden');
        customSection.classList.add('hidden');
    }
    checkScheduleChanges();
    updateSummary();
}

function setupTimeInputs() {
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');
    
    startTime.addEventListener('change', function() {
        calculateDuration();
        checkScheduleChanges();
    });
    endTime.addEventListener('change', function() {
        calculateDuration();
        checkScheduleChanges();
    });
}

function calculateDuration() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const durationInput = document.getElementById('duration');
    
    if (startTime && endTime) {
        const start = parseTime(startTime);
        const end = parseTime(endTime);
        
        if (end < start) {
            durationInput.value = '';
            showNotification('End time must be after start time', 'error');
            return;
        }
        
        const duration = (end - start) / (1000 * 60);
        durationInput.value = duration > 0 ? duration : '';
    } else {
        durationInput.value = '';
    }
}

function parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// ==================== Change Detection ====================

function checkScheduleChanges() {
    const currentSchedule = {
        frequency: document.getElementById('frequency').value,
        daysOfWeek: [...formData.selectedDays],
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        duration: parseInt(document.getElementById('duration').value) || 0,
        startDate: document.getElementById('startDate').value || null,
        endDate: document.getElementById('endDate').value || null
    };
    
    const hasChanged = JSON.stringify(currentSchedule) !== JSON.stringify(formData.originalSchedule);
    const warningBanner = document.getElementById('scheduleWarningBanner');
    
    if (hasChanged) {
        warningBanner.classList.remove('hidden');
    } else {
        warningBanner.classList.add('hidden');
    }
}

function checkStaffChanges() {
    const currentStaffIds = formData.selectedStaff.map(s => s.id).sort();
    const originalStaffIds = formData.originalStaff.map(s => s.id).sort();
    
    const hasChanged = JSON.stringify(currentStaffIds) !== JSON.stringify(originalStaffIds);
    const warningBanner = document.getElementById('staffWarningBanner');
    
    if (hasChanged) {
        warningBanner.classList.remove('hidden');
    } else {
        warningBanner.classList.add('hidden');
    }
}

// ==================== Summary Updates ====================

function updateSummary() {
    // Pricebook
    const pricebookEl = document.getElementById('summaryPricebookItem');
    if (formData.selectedPricebookItem) {
        pricebookEl.textContent = formData.selectedPricebookItem.name;
    } else {
        pricebookEl.textContent = '-';
    }
    
    // Capacity
    document.getElementById('summaryCapacity').textContent = document.getElementById('maxCapacity').value || '-';
    
    // Staff
    document.getElementById('summaryStaff').textContent = `${formData.selectedStaff.length} selected`;
    
    // Schedule
    updateScheduleSummary();
}

function updateScheduleSummary() {
    const frequency = document.getElementById('frequency')?.value;
    if (frequency) {
        const frequencyEl = document.getElementById('summaryFrequency');
        if (frequencyEl) {
            frequencyEl.textContent = frequency.charAt(0).toUpperCase() + frequency.slice(1);
        }
        
        const days = formData.selectedDays.length > 0 ? formData.selectedDays.map(d => d.substring(0, 3)).join(', ') : '-';
        const daysEl = document.getElementById('summaryDays');
        if (daysEl) {
            daysEl.textContent = days;
        }
        
        const startTime = document.getElementById('startTime')?.value;
        const endTime = document.getElementById('endTime')?.value;
        const timeEl = document.getElementById('summaryTime');
        if (timeEl) {
            timeEl.textContent = startTime && endTime ? `${startTime} - ${endTime}` : '-';
        }
        
        const duration = document.getElementById('duration')?.value;
        const durationEl = document.getElementById('summaryDuration');
        if (durationEl) {
            durationEl.textContent = duration ? `${duration} min` : '-';
        }
    }
}

function updateStaffSummary() {
    const countEl = document.getElementById('summaryStaffCount');
    const listEl = document.getElementById('summaryStaffList');
    
    if (countEl) {
        countEl.textContent = `${formData.selectedStaff.length} selected`;
    }
    
    if (listEl) {
        if (formData.selectedStaff.length === 0) {
            listEl.innerHTML = '<p class="text-sm text-gray-400">No staff selected</p>';
        } else {
            listEl.innerHTML = formData.selectedStaff.map(staff => {
                const initials = staff.name.split(' ').map(n => n[0]).join('');
                return `
                    <div class="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                        <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span class="text-xs font-semibold text-emerald-700">${initials}</span>
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900">${staff.name}</p>
                            <p class="text-xs text-gray-500">${staff.role} - ${staff.department}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

// ==================== Form Submission ====================

function handleSave() {
    if (!validateForm()) {
        return;
    }
    
    // Collect form data
    const updatedClass = {
        ...currentClass,
        name: document.getElementById('className').value.trim(),
        description: document.getElementById('description').value.trim(),
        skillLevel: document.getElementById('skillLevel').value || null,
        status: document.getElementById('status').value,
        
        pricebookItemId: formData.selectedPricebookItem.id,
        pricebookItem: formData.selectedPricebookItem,
        
        schedule: {
            frequency: document.getElementById('frequency').value,
            daysOfWeek: formData.selectedDays,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            duration: parseInt(document.getElementById('duration').value),
            startDate: document.getElementById('startDate').value || null,
            endDate: document.getElementById('endDate').value || null,
            timezone: currentClass.schedule?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        
        defaultStaff: formData.selectedStaff.map(s => ({
            id: s.id,
            name: s.name
        })),
        
        maxCapacity: parseInt(document.getElementById('maxCapacity').value),
        
        updatedAt: new Date().toISOString()
    };
    
    // Add custom interval if frequency is custom
    if (updatedClass.schedule.frequency === 'custom') {
        updatedClass.schedule.customInterval = parseInt(document.getElementById('customInterval').value);
        updatedClass.schedule.customIntervalUnit = document.getElementById('customIntervalUnit').value;
    }
    
    // Save to localStorage
    try {
        const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
        const index = classes.findIndex(c => c.id === currentClass.id);
        if (index > -1) {
            classes[index] = updatedClass;
            localStorage.setItem('classes_v2', JSON.stringify(classes));
            
            showNotification('Class updated successfully!', 'success');
            
            // Redirect to detail page
            setTimeout(() => {
                window.location.href = `class_detail.html?id=${currentClass.id}`;
            }, 1500);
        }
    } catch (error) {
        console.error('Error saving class:', error);
        showNotification('Error saving class. Please try again.', 'error');
    }
}

function validateForm() {
    let isValid = true;
    
    // Validate class name
    const className = document.getElementById('className').value.trim();
    if (!className) {
        showNotification('Class name is required', 'error');
        isValid = false;
    }
    
    // Validate pricebook item
    if (!formData.selectedPricebookItem) {
        showNotification('Please select a Price Book Item', 'error');
        isValid = false;
    }
    
    // Validate schedule
    const frequency = document.getElementById('frequency').value;
    if (frequency === 'weekly' && formData.selectedDays.length === 0) {
        showNotification('Please select at least one day of the week', 'error');
        isValid = false;
    }
    
    // Validate times
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    if (!startTime || !endTime) {
        showNotification('Start time and end time are required', 'error');
        isValid = false;
    }
    
    // Validate staff
    if (!validateStaffSelection()) {
        isValid = false;
    }
    
    // Validate capacity
    const maxCapacity = document.getElementById('maxCapacity').value;
    if (!maxCapacity || parseInt(maxCapacity) < 1) {
        showNotification('Max capacity must be at least 1', 'error');
        isValid = false;
    }
    
    return isValid;
}

function handleArchive() {
    if (confirm('Are you sure you want to archive this class? This will pause all future session generation.')) {
        currentClass.status = 'archived';
        currentClass.updatedAt = new Date().toISOString();
        
        try {
            const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
            const index = classes.findIndex(c => c.id === currentClass.id);
            if (index > -1) {
                classes[index] = currentClass;
                localStorage.setItem('classes_v2', JSON.stringify(classes));
                
                showNotification('Class archived successfully', 'success');
                setTimeout(() => {
                    window.location.href = 'class_list.html';
                }, 1500);
            }
        } catch (error) {
            console.error('Error archiving class:', error);
            showNotification('Error archiving class', 'error');
        }
    }
}

function getClassId() {
    return currentClass?.id || '';
}

function viewDetails() {
    const id = getClassId();
    if (id) {
        window.location.href = `class_detail.html?id=${id}`;
    } else {
        showNotification('Class ID is required', 'error');
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
            document.body.removeChild(container);
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('pricebookModal');
    if (event.target === modal) {
        closePricebookModal();
    }
});



