// Class Create Script
// Handles form logic, validation, and data management

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

// Sample pricebook items (in real app, fetch from API/localStorage)
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
let formData = {
    selectedPricebookItem: null,
    selectedStaff: [],
    selectedDays: []
};

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
});

function initializePage() {
    initializeUnifiedAssignment();
    renderPricebookItemsList();
    setupDaySelectors();
    setupTimeInputs();

    // Set default time
    document.getElementById('startTime').value = '14:00';
    document.getElementById('endTime').value = '15:30';
    calculateDuration();
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
        showNotification('Pricebook item selected', 'success');
    }
}

function renderSelectedPricebookItem() {
    const container = document.getElementById('pricebookItemContainer');
    const btn = document.getElementById('selectPricebookBtn');

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
                        onclick="removePricebookItem()"
                        class="ml-4 text-red-500 hover:text-red-700"
                        title="Remove"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = btn.outerHTML;
    }
}

function removePricebookItem() {
    formData.selectedPricebookItem = null;
    renderSelectedPricebookItem();
    showNotification('Pricebook item removed', 'info');
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
    validateStaffSelection();
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
            <div class="staff-chip flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full">
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
    validateStaffSelection();
}

function validateStaffSelection() {
    const errorEl = document.getElementById('staffError');
    // Check if any assignment exists (individual or team)
    if (selectedAssignments.length === 0) {
        if (errorEl) errorEl.classList.remove('hidden');
        return false;
    } else {
        if (errorEl) errorEl.classList.add('hidden');
        return true;
    }
}

// ==================== Day Selection ====================

function setupDaySelectors() {
    const dayButtons = document.querySelectorAll('.day-selector');
    dayButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const day = this.dataset.day;
            toggleDay(day, this);
        });
    });
}

function toggleDay(day, buttonElement) {
    const index = formData.selectedDays.indexOf(day);
    if (index > -1) {
        formData.selectedDays.splice(index, 1);
        buttonElement.classList.remove('selected');
        buttonElement.classList.add('border-gray-300');
        buttonElement.classList.remove('text-white');
        buttonElement.classList.add('text-gray-700');
    } else {
        formData.selectedDays.push(day);
        buttonElement.classList.add('selected');
        buttonElement.classList.remove('border-gray-300');
        buttonElement.classList.add('text-white');
        buttonElement.classList.remove('text-gray-700');
    }
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
}

function setupTimeInputs() {
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');

    startTime.addEventListener('change', calculateDuration);
    endTime.addEventListener('change', calculateDuration);
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

        const duration = (end - start) / (1000 * 60); // Convert to minutes
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

// ==================== Form Validation ====================

function validateForm() {
    let isValid = true;

    // Validate class name
    const className = document.getElementById('className').value.trim();
    if (!className) {
        markFieldError('className', 'Class name is required');
        isValid = false;
    } else {
        markFieldSuccess('className');
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
    } else {
        const start = parseTime(startTime);
        const end = parseTime(endTime);
        if (end <= start) {
            showNotification('End time must be after start time', 'error');
            isValid = false;
        }
    }

    // Validate staff
    if (!validateStaffSelection()) {
        isValid = false;
    }

    // Validate capacity
    const maxCapacity = document.getElementById('maxCapacity').value;
    if (!maxCapacity || parseInt(maxCapacity) < 1) {
        markFieldError('maxCapacity', 'Max capacity must be at least 1');
        isValid = false;
    } else {
        markFieldSuccess('maxCapacity');
    }

    return isValid;
}

function markFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('field-error');
    field.classList.remove('field-success');
}

function markFieldSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove('field-error');
    field.classList.add('field-success');
}

// ==================== Form Submission ====================

function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    // Collect form data
    const classData = {
        id: 'CLASS-' + new Date().getFullYear() + '-' + generateId(),
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
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },

        defaultStaff: selectedAssignments.map(s => ({
            id: s.id,
            name: s.name,
            type: s.type || 'individual',
            rate: parseFloat(s.rate) || 0,
            displayName: s.displayName
        })),

        maxCapacity: parseInt(document.getElementById('maxCapacity').value),

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Add custom interval if frequency is custom
    if (classData.schedule.frequency === 'custom') {
        classData.schedule.customInterval = parseInt(document.getElementById('customInterval').value);
        classData.schedule.customIntervalUnit = document.getElementById('customIntervalUnit').value;
    }

    // Save to localStorage
    saveClass(classData);

    // Show success notification
    showNotification('Class created successfully!', 'success');

    // Redirect to class detail page after short delay
    setTimeout(() => {
        window.location.href = `class_detail.html?id=${classData.id}`;
    }, 1500);
}

function generateId() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// ==================== LocalStorage Management ====================

function saveClass(classData) {
    try {
        // Get existing classes
        const existingClasses = JSON.parse(localStorage.getItem('classes_v2') || '[]');

        // Add new class
        existingClasses.push(classData);

        // Save back to localStorage
        localStorage.setItem('classes_v2', JSON.stringify(existingClasses));

        console.log('Class saved:', classData);
    } catch (error) {
        console.error('Error saving class:', error);
        showNotification('Error saving class. Please try again.', 'error');
    }
}

// ==================== Notifications ====================

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    const notification = document.createElement('div');
    notification.className = `notification ${colors[type] || colors.info} text-white px-6 py-3 rounded-lg shadow-lg`;
    notification.textContent = message;

    container.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            container.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
document.addEventListener('click', function (event) {
    const modal = document.getElementById('pricebookModal');
    if (event.target === modal) {
        closePricebookModal();
    }
});

// ============================================================================
// UNIFIED ASSIGNMENT FUNCTIONS
// ============================================================================

// Available teams for assignment
const availableTeams = [
    {
        id: 'team-1',
        name: 'Math & Science Team',
        type: 'team',
        avatar: 'MST',
        color: 'indigo',
        skills: ['Math', 'Science', 'Physics', 'Chemistry'],
        members: [
            { id: 'STAFF-001', name: 'Daniel Davis', role: 'Instructor', avatar: 'DD' },
            { id: 'STAFF-002', name: 'Sarah Johnson', role: 'Instructor', avatar: 'SJ' }
        ]
    },
    {
        id: 'team-2',
        name: 'Yoga & Wellness Team',
        type: 'team',
        avatar: 'YWT',
        color: 'pink',
        skills: ['Yoga', 'Wellness', 'Meditation'],
        members: [
            { id: 'STAFF-004', name: 'Emily Rodriguez', role: 'Instructor', avatar: 'ER' },
            { id: 'STAFF-008', name: 'Jennifer White', role: 'Instructor', avatar: 'JW' }
        ]
    }
];

// Convert sampleStaff to match unified assignment format
function getAssignableEntities() {
    const individuals = sampleStaff.map(staff => {
        const initials = staff.name.split(' ').map(n => n[0]).join('');
        return {
            ...staff,
            type: 'individual',
            rate: 0,
            displayName: `${staff.name} (User)`,
            avatar: initials,
            color: getColorForStaff(staff.id),
            skills: [staff.department],
            role: staff.role
        };
    });

    const teams = availableTeams.map(team => ({
        ...team,
        rate: 0,
        displayName: `${team.name} (Team)`
    }));

    return [...individuals, ...teams];
}

function getColorForStaff(staffId) {
    const colors = ['blue', 'purple', 'green', 'orange', 'red', 'pink', 'indigo', 'gray'];
    const index = parseInt(staffId.replace('STAFF-', '')) % colors.length;
    return colors[index];
}

// Selected assignments tracking (unified system)
let selectedAssignments = [];

function initializeUnifiedAssignment() {
    const searchInput = document.getElementById('assignmentSearchInput');
    const autocompleteDiv = document.getElementById('assignmentAutocomplete');

    if (!searchInput || !autocompleteDiv) return;

    // Search input handler
    searchInput.addEventListener('input', handleAssignmentSearch);

    // Close autocomplete when clicking outside
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !autocompleteDiv.contains(e.target)) {
            autocompleteDiv.classList.add('hidden');
        }
    });

    // Initialize display
    renderSelectedAssignments();
    loadRecommendedAssignments();

    // Sync with formData.selectedStaff for backward compatibility
    syncAssignmentsToFormData();
}

function handleAssignmentSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const autocomplete = document.getElementById('assignmentAutocomplete');

    if (!query) {
        autocomplete.classList.add('hidden');
        return;
    }

    const entities = getAssignableEntities();
    const filtered = entities.filter(entity =>
        entity.name.toLowerCase().includes(query) ||
        entity.role?.toLowerCase().includes(query) ||
        entity.skills?.some(skill => skill.toLowerCase().includes(query)) ||
        entity.displayName.toLowerCase().includes(query) ||
        entity.department?.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No matches found</div>';
        autocomplete.classList.remove('hidden');
        return;
    }

    autocomplete.innerHTML = filtered.map(entity => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-600',
            'purple': 'bg-purple-100 text-purple-600',
            'green': 'bg-green-100 text-green-600',
            'orange': 'bg-orange-100 text-orange-600',
            'red': 'bg-red-100 text-red-600',
            'pink': 'bg-pink-100 text-pink-600',
            'indigo': 'bg-indigo-100 text-indigo-600',
            'gray': 'bg-gray-100 text-gray-600'
        };
        const colorClass = colorMap[entity.color] || colorMap['blue'];

        return `
            <button onclick="selectAssignment('${entity.id}', '${entity.type}')" class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left">
                <div class="w-10 h-10 ${colorClass} rounded-full flex items-center justify-center font-semibold text-sm">
                    ${entity.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${entity.displayName}</p>
                    <p class="text-xs text-gray-600">${entity.role || 'Team'}</p>
                    ${entity.skills ? `<p class="text-xs text-gray-500">${entity.skills.join(', ')}</p>` : ''}
                </div>
            </button>
        `;
    }).join('');

    autocomplete.classList.remove('hidden');
}

function selectAssignment(entityId, entityType) {
    const entities = getAssignableEntities();
    const entity = entities.find(e => e.id === entityId);

    if (!entity) return;

    // Check if already selected
    if (selectedAssignments.find(s => s.id === entityId)) {
        return;
    }

    selectedAssignments.push(entity);
    renderSelectedAssignments();
    loadRecommendedAssignments();
    syncAssignmentsToFormData();
    validateStaffSelection();

    // Clear search
    const searchInput = document.getElementById('assignmentSearchInput');
    const autocomplete = document.getElementById('assignmentAutocomplete');
    if (searchInput) searchInput.value = '';
    if (autocomplete) autocomplete.classList.add('hidden');
}

function removeAssignment(entityId) {
    selectedAssignments = selectedAssignments.filter(s => s.id !== entityId);
    renderSelectedAssignments();
    loadRecommendedAssignments();
    syncAssignmentsToFormData();
    validateStaffSelection();
}

function updateAssignmentRate(entityId, newRate) {
    const assignment = selectedAssignments.find(s => s.id === entityId);
    if (assignment) {
        assignment.rate = parseFloat(newRate) || 0;
        syncAssignmentsToFormData();
    }
}

function renderSelectedAssignments() {
    const container = document.getElementById('selectedAssignmentsList');
    const countEl = document.getElementById('selectedAssignmentsCount');

    if (!container || !countEl) return;

    countEl.textContent = selectedAssignments.length;

    if (selectedAssignments.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic">No assignments selected yet</p>';
        return;
    }

    container.innerHTML = selectedAssignments.map(entity => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-600',
            'purple': 'bg-purple-100 text-purple-600',
            'green': 'bg-green-100 text-green-600',
            'orange': 'bg-orange-100 text-orange-600',
            'red': 'bg-red-100 text-red-600',
            'pink': 'bg-pink-100 text-pink-600',
            'indigo': 'bg-indigo-100 text-indigo-600',
            'gray': 'bg-gray-100 text-gray-600'
        };
        const colorClass = colorMap[entity.color] || colorMap['blue'];

        let html = `
            <div class="flex items-center gap-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center font-semibold text-xs">
                    ${entity.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${entity.displayName}</p>
                    <p class="text-xs text-gray-600">${entity.role || 'Team'}</p>
                </div>
                <div class="flex items-center gap-1 mr-2 bg-white px-2 py-1 rounded border border-gray-200">
                    <span class="text-xs text-gray-500 font-medium">$</span>
                    <input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        value="${entity.rate || 0}"
                        onchange="updateAssignmentRate('${entity.id}', this.value)"
                        onclick="event.stopPropagation()"
                        class="w-16 text-xs border-0 border-b border-gray-300 focus:border-emerald-500 focus:ring-0 px-0 py-0.5 text-right bg-transparent"
                        placeholder="0.00"
                    />
                    <span class="text-xs text-gray-500">/hr</span>
                </div>
                <button onclick="removeAssignment('${entity.id}')" class="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

        // Add team members display if it's a team
        if (entity.type === 'team' && entity.members) {
            html += `
                <div class="ml-11 mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p class="text-xs font-medium text-gray-700 mb-2">Team Members:</p>
                    <div class="space-y-1">
                        ${entity.members.map(member => `
                            <div class="flex items-center gap-2 text-xs">
                                <div class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center font-semibold text-gray-600">
                                    ${member.avatar}
                                </div>
                                <span class="text-gray-700">${member.name}</span>
                                <span class="text-gray-500">• ${member.role}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return html;
    }).join('');
}

function loadRecommendedAssignments() {
    const container = document.getElementById('recommendedAssignmentsList');
    if (!container) return;

    const entities = getAssignableEntities();
    // Get entities not already selected (only individuals for classes)
    const recommended = entities
        .filter(e => e.type === 'individual' && !selectedAssignments.find(sel => sel.id === e.id))
        .slice(0, 3);

    if (recommended.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic">All available assignments selected</p>';
        return;
    }

    container.innerHTML = recommended.map(entity => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-600',
            'purple': 'bg-purple-100 text-purple-600',
            'green': 'bg-green-100 text-green-600',
            'orange': 'bg-orange-100 text-orange-600',
            'red': 'bg-red-100 text-red-600',
            'pink': 'bg-pink-100 text-pink-600',
            'indigo': 'bg-indigo-100 text-indigo-600',
            'gray': 'bg-gray-100 text-gray-600'
        };
        const colorClass = colorMap[entity.color] || colorMap['blue'];

        return `
            <button onclick="selectAssignment('${entity.id}', '${entity.type}')" class="w-full flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-left">
                <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center font-semibold text-xs">
                    ${entity.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${entity.displayName}</p>
                    <p class="text-xs text-gray-600">${entity.role || 'Team'}</p>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </button>
        `;
    }).join('');
}

// Sync selectedAssignments to formData.selectedStaff for backward compatibility
function syncAssignmentsToFormData() {
    // Only sync individual staff (not teams) to formData.selectedStaff
    formData.selectedStaff = selectedAssignments
        .filter(a => a.type === 'individual')
        .map(a => ({
            id: a.id,
            name: a.name,
            email: a.email || '',
            role: a.role,
            department: a.department || a.skills?.[0] || ''
        }));
}

// Initialize refresh button for recommendations
document.addEventListener('DOMContentLoaded', function () {
    const refreshBtn = document.getElementById('refreshAssignmentRecommendations');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function (e) {
            e.preventDefault();
            loadRecommendedAssignments();
        });
    }
});



