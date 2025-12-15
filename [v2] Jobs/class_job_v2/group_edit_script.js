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
document.addEventListener('DOMContentLoaded', function () {
    loadClassData();
});

function loadClassData() {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('id');

    if (!classId) {
        showNotification('Class ID is required', 'error');
        setTimeout(() => {
            window.location.href = 'group_list.html';
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
                window.location.href = 'group_list.html';
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
        const allEntities = getAssignableEntities();
        formData.selectedStaff = [];

        currentClass.defaultStaff.forEach(s => {
            const entity = allEntities.find(e => e.id === s.id);
            if (entity) {
                // Merge saved rate if exists
                const savedRate = s.rate !== undefined ? s.rate : 0;
                formData.selectedStaff.push({
                    ...entity,
                    rate: savedRate
                });
            }
        });

        formData.originalStaff = JSON.parse(JSON.stringify(formData.selectedStaff));
    }

    // Capacity
    document.getElementById('maxCapacity').value = currentClass.maxCapacity || 10;

    updateSummary();
}

function initializePage() {
    initializeUnifiedAssignment();
    renderPricebookItemsList();
    setupDaySelectors();
    setupTimeInputs();
    handleFrequencyChange();
    renderSelectedAssignments();
    loadRecommendedAssignments();
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

function initializeUnifiedAssignment() {
    const searchInput = document.getElementById('assignmentSearchInput');
    const autocompleteDiv = document.getElementById('assignmentAutocomplete');
    const refreshBtn = document.getElementById('refreshAssignmentRecommendations');

    if (searchInput) {
        // Remove existing listeners to avoid duplicates
        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);
        newSearchInput.addEventListener('input', handleAssignmentSearch);

        // Close autocomplete when clicking outside
        document.addEventListener('click', function (e) {
            if (!newSearchInput.contains(e.target) && autocompleteDiv && !autocompleteDiv.contains(e.target)) {
                autocompleteDiv.classList.add('hidden');
            }
        });
    }

    if (refreshBtn) {
        const newRefreshBtn = refreshBtn.cloneNode(true);
        refreshBtn.parentNode.replaceChild(newRefreshBtn, refreshBtn);
        newRefreshBtn.addEventListener('click', function (e) {
            e.preventDefault();
            loadRecommendedAssignments();
        });
    }
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
    if (formData.selectedStaff.find(s => s.id === entityId)) {
        return;
    }

    formData.selectedStaff.push(entity);
    renderSelectedAssignments();
    loadRecommendedAssignments();
    checkStaffChanges();
    validateStaffSelection();
    updateSummary();

    // Clear search
    const searchInput = document.getElementById('assignmentSearchInput');
    const autocomplete = document.getElementById('assignmentAutocomplete');
    if (searchInput) searchInput.value = '';
    if (autocomplete) autocomplete.classList.add('hidden');
}

function removeAssignment(entityId) {
    formData.selectedStaff = formData.selectedStaff.filter(s => s.id !== entityId);
    renderSelectedAssignments();
    loadRecommendedAssignments();
    checkStaffChanges();
    validateStaffSelection();
    updateSummary();
}

function updateAssignmentRate(entityId, newRate) {
    const assignment = formData.selectedStaff.find(s => s.id === entityId);
    if (assignment) {
        assignment.rate = parseFloat(newRate) || 0;
        // Trigger summary or validation if needed (rates don't affect validation currently)
    }
}

function renderSelectedAssignments() {
    const container = document.getElementById('selectedAssignmentsList');
    const countEl = document.getElementById('selectedAssignmentsCount');

    if (!container || !countEl) return;

    countEl.textContent = formData.selectedStaff.length;

    if (formData.selectedStaff.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic">No assignments selected yet</p>';
        return;
    }

    container.innerHTML = formData.selectedStaff.map(entity => {
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
        .filter(e => e.type === 'individual' && !formData.selectedStaff.find(sel => sel.id === e.id))
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

function validateStaffSelection() {
    const errorEl = document.getElementById('staffError');
    if (formData.selectedStaff.length === 0) {
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

    startTime.addEventListener('change', function () {
        calculateDuration();
        checkScheduleChanges();
    });
    endTime.addEventListener('change', function () {
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
                const colorMap = {
                    'blue': 'bg-blue-100 text-blue-800',
                    'purple': 'bg-purple-100 text-purple-800',
                    'green': 'bg-green-100 text-green-800',
                    'orange': 'bg-orange-100 text-orange-800',
                    'red': 'bg-red-100 text-red-800',
                    'pink': 'bg-pink-100 text-pink-800',
                    'indigo': 'bg-indigo-100 text-indigo-800',
                    'gray': 'bg-gray-100 text-gray-800'
                };
                const colorClass = colorMap[staff.color] || colorMap['blue'];
                // For summary, we use a simpler display
                const initials = staff.avatar || '??';

                return `
                    <div class="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                        <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center">
                            <span class="text-xs font-semibold">${initials}</span>
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900">${staff.displayName}</p>
                            <p class="text-xs text-gray-500">${staff.role || 'Team'}</p>
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
            name: s.name,
            type: s.type, // Save type
            rate: parseFloat(s.rate) || 0,
            displayName: s.displayName
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
                window.location.href = `group_detail.html?id=${currentClass.id}`;
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
                    window.location.href = 'group_list.html';
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
        window.location.href = `group_detail.html?id=${id}`;
    } else {
        showNotification('Class ID is required', 'error');
    }
}

// ==================== Notifications ====================

function showNotification(message, type = 'info') {
    const container = document.createElement('div');
    container.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${type === 'success' ? 'bg-green-500' :
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
document.addEventListener('click', function (event) {
    const modal = document.getElementById('pricebookModal');
    if (event.target === modal) {
        closePricebookModal();
    }
});



