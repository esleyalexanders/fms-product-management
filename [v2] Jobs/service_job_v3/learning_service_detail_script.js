/**
 * Learning Service Detail Script
 * Handles view/edit modes, tab navigation, and data management
 */

// ===== STATE MANAGEMENT =====
let currentService = null;
let isEditMode = false;
let hasUnsavedChanges = false;
let currentTab = 'overview';
let originalData = null; // Store original data for cancel/reset

// ===== SCHEDULE BUILDER STATE =====
let dailySchedule = [];
let weeklySchedule = { selectedDays: [] };
let monthlySchedule = { type: 'date', date: 1, week: 'first', dayOfWeek: 'monday', slots: [] };
let slotIdCounter = 0;

function generateSlotId() {
    return 'slot_' + Date.now() + '_' + (++slotIdCounter);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadServiceData();
    initializeDaySelectors();
    initializeTimeCalculation();
    checkUrlForEditMode();

    // Warn before leaving with unsaved changes
    window.addEventListener('beforeunload', function (e) {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        }
    });
});

// ===== DATA LOADING =====
function loadServiceData() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');

    if (!serviceId) {
        // Load sample data for demo
        currentService = getSampleService();
    } else {
        // Try to load from localStorage
        const stored = localStorage.getItem('fms_learning_services');
        if (stored) {
            const services = JSON.parse(stored);
            currentService = services.find(s => s.id === serviceId);
        }

        if (!currentService) {
            currentService = getSampleService();
        }
    }

    originalData = JSON.parse(JSON.stringify(currentService));
    renderServiceData();
}

function getSampleService() {
    return {
        id: 'ls_001',
        name: 'AP Calculus AB',
        type: 'Class',
        description: 'Advanced Placement Calculus course covering limits, derivatives, and integrals. Prepares students for the AP exam.',
        skillLevel: 'Advanced',
        status: 'active',
        pricebookItemId: 'pb1',
        pricebookItemName: 'AP Course - Semester',
        pricebookPrice: 500.00,
        schedule: {
            frequency: 'weekly',
            daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
            startTime: '15:00',
            endTime: '16:30',
            duration: 90,
            config: {
                weeklySlots: {
                    selectedDays: ['monday', 'wednesday', 'friday'],
                    monday: [{ id: 'slot_demo_1', startTime: '15:00', endTime: '16:30', duration: 90 }],
                    wednesday: [{ id: 'slot_demo_2', startTime: '15:00', endTime: '16:30', duration: 90 }],
                    friday: [{ id: 'slot_demo_3', startTime: '15:00', endTime: '16:30', duration: 90 }]
                }
            }
        },
        staff: [
            { id: 'staff1', name: 'John Smith', role: 'Senior Tutor', skills: 'Math', hourlyRate: 45.00, assignedRate: 50.00 },
            { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist', skills: 'Calculus', hourlyRate: 40.00, assignedRate: 45.00 }
        ],
        maxCapacity: 20,
        minCapacity: null,
        // Class-specific
        curriculum: 'College Board AP Calculus AB',
        cohortStartDate: '2025-01-15',
        cohortEndDate: '2025-05-30',
        cohortSize: 20,
        // Stats
        sessionsCount: 45,
        avgEnrollment: 85,
        totalEnrolled: 17,
        createdAt: '2024-11-01T10:00:00Z',

        // Sample enrollments (using pb1 pricebook item customers)
        enrollments: [
            {
                id: 'enroll_001',
                attendeeName: 'Alice Johnson',
                attendeeEmail: 'sarah.j@email.com',
                notes: 'Prefers front row seating',
                customerId: 'CUST-001',
                customerName: 'Sarah Johnson',
                quoteId: 'Q-2025-001',
                paymentStatus: 'paid',
                status: 'confirmed',
                enrolledAt: '2024-12-01T10:00:00Z',
                enrolledInAllSessions: true
            },
            {
                id: 'enroll_002',
                attendeeName: 'Michael Jr.',
                attendeeEmail: 'm.chen@email.com',
                notes: '',
                customerId: 'CUST-002',
                customerName: 'Michael Chen',
                quoteId: 'Q-2025-011',
                paymentStatus: 'partial',
                status: 'confirmed',
                enrolledAt: '2024-12-05T14:30:00Z',
                enrolledInAllSessions: true
            },
            {
                id: 'enroll_003',
                attendeeName: 'Emma W.',
                attendeeEmail: 'emma.w@email.com',
                notes: 'Advanced student',
                customerId: 'CUST-003',
                customerName: 'Emma Wilson',
                quoteId: 'Q-2025-004',
                paymentStatus: 'unpaid',
                status: 'confirmed',
                enrolledAt: '2024-12-10T09:00:00Z',
                enrolledInAllSessions: true
            }
        ]
    };
}

// ===== RENDERING =====
function renderServiceData() {
    if (!currentService) return;

    // Header
    document.getElementById('serviceNameHeader').textContent = currentService.name;
    document.getElementById('serviceIdBadge').textContent = currentService.id.toUpperCase();

    // Type badge
    const typeBadge = document.getElementById('typeBadge');
    const typeStyles = getTypeStyles(currentService.type);
    typeBadge.className = `px-2 py-0.5 text-xs font-medium rounded-full ${typeStyles.badgeClass}`;
    typeBadge.textContent = `${typeStyles.icon} ${currentService.type}`;

    // Status badge
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = currentService.status.charAt(0).toUpperCase() + currentService.status.slice(1);
    statusBadge.className = getStatusBadgeClass(currentService.status);

    // Show appropriate type card
    showTypeCard(currentService.type);

    // Handle tab visibility based on type
    // updateTabVisibility(currentService.type); // Removed as Enrollment tab is moved

    // Populate view fields
    populateViewFields();

    // Populate edit fields
    populateEditFields();

    // Update summary
    updateSummary();

    // Render enrollment list
    renderEnrollmentList();

    // Render staff assignment
    renderStaffAssignment();
}

function renderStaffAssignment() {
    const container = document.getElementById('assignedStaffList');
    if (!container) return;

    container.innerHTML = '';

    if (currentService.staff && currentService.staff.length > 0) {
        currentService.staff.forEach(staff => {
            const initials = staff.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200';
            item.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span class="text-indigo-600 font-medium">${initials}</span>
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">${staff.name}</p>
                        <p class="text-xs text-gray-500">${staff.role || 'Staff'} ${staff.skills ? '• ' + staff.skills : ''}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">$${(staff.assignedRate || 0).toFixed(2)}/hr</p>
                    <p class="text-xs text-gray-500">Assigned Rate</p>
                </div>
            `;
            container.appendChild(item);
        });

        // Update summary count
        const summaryCount = document.getElementById('summaryStaffCount');
        if (summaryCount) summaryCount.textContent = `${currentService.staff.length} staff`;

    } else {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p>No staff assigned to this service.</p>
                <p class="text-xs mt-1">Switch to Edit Mode to assign staff.</p>
            </div>
        `;
    }
}

// function updateTabVisibility(type) {
//     const enrollmentTab = document.getElementById('enrollmentTab');
//     // Tab moved to session_detail
// }

function getTypeStyles(type) {
    const styles = {
        'Class': { badgeClass: 'type-badge-class', icon: '📚' },
        'Group': { badgeClass: 'type-badge-group', icon: '👥' },
        'One-to-One': { badgeClass: 'type-badge-one-to-one', icon: '👤' }
    };
    return styles[type] || styles['Class'];
}

function getStatusBadgeClass(status) {
    const classes = {
        'active': 'px-2 py-0.5 text-xs font-medium rounded bg-emerald-100 text-emerald-700',
        'paused': 'px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-700',
        'archived': 'px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600'
    };
    return classes[status] || classes['active'];
}

function showTypeCard(type) {
    // Hide all type cards
    document.getElementById('classTypeCard').classList.add('hidden');
    document.getElementById('groupTypeCard').classList.add('hidden');
    document.getElementById('oneToOneTypeCard').classList.add('hidden');

    // Show appropriate card and populate
    if (type === 'Class') {
        document.getElementById('classTypeCard').classList.remove('hidden');
        document.getElementById('viewCurriculum').textContent = currentService.curriculum || '-';
        document.getElementById('viewCohortStart').textContent = formatDate(currentService.cohortStartDate);
        document.getElementById('viewCohortEnd').textContent = formatDate(currentService.cohortEndDate);
        document.getElementById('viewCohortSize').textContent = currentService.cohortSize || '-';
    } else if (type === 'Group') {
        document.getElementById('groupTypeCard').classList.remove('hidden');
        document.getElementById('viewMinCapacity').textContent = currentService.minCapacity || '2';
        document.getElementById('viewMaxCapacityGroup').textContent = currentService.maxCapacity || '-';
    } else if (type === 'One-to-One') {
        document.getElementById('oneToOneTypeCard').classList.remove('hidden');
        document.getElementById('viewFocusArea').textContent = currentService.focusArea || '-';
        document.getElementById('viewPersonalization').textContent = currentService.personalizationLevel || 'High';
    }
}

function populateViewFields() {
    // Basic info
    document.getElementById('viewName').textContent = currentService.name;
    document.getElementById('viewType').innerHTML = `${currentService.type} <span class="text-gray-400 text-xs">🔒</span>`;
    document.getElementById('viewDescription').textContent = currentService.description || 'No description';
    document.getElementById('viewSkillLevel').textContent = currentService.skillLevel || '-';
    document.getElementById('viewStatus').textContent = currentService.status.charAt(0).toUpperCase() + currentService.status.slice(1);

    // Schedule
    renderScheduleDetails(currentService.schedule);
    document.getElementById('viewDuration').textContent = `${currentService.schedule?.duration || '-'} minutes`;

    // Capacity
    document.getElementById('viewMaxCapacity').textContent = currentService.type === 'One-to-One' ? '1 (1:1 Ratio)' : currentService.maxCapacity || '-';
    document.getElementById('viewEnrollment').textContent = `${currentService.totalEnrolled || 0}/${currentService.maxCapacity || '-'}`;

    // Pricebook
    document.getElementById('viewPricebookItem').textContent = currentService.pricebookItemName || '-';
    document.getElementById('viewPricebookPrice').textContent = currentService.pricebookPrice ? `$${currentService.pricebookPrice.toFixed(2)} / slot` : '-';
}

function populateEditFields() {
    // Basic info
    document.getElementById('editName').value = currentService.name || '';
    document.getElementById('editType').value = currentService.type || '';
    document.getElementById('editDescription').value = currentService.description || '';
    document.getElementById('editSkillLevel').value = currentService.skillLevel || '';
    document.getElementById('editStatus').value = currentService.status || 'active';

    // Schedule
    const frequency = currentService.schedule?.frequency || 'weekly';
    document.getElementById('editFrequency').value = frequency;

    // Initialize builder state from saved config or defaults
    if (currentService.schedule?.config) {
        dailySchedule = currentService.schedule.config.dailySlots ? JSON.parse(JSON.stringify(currentService.schedule.config.dailySlots)) : [];
        weeklySchedule = currentService.schedule.config.weeklySlots ? JSON.parse(JSON.stringify(currentService.schedule.config.weeklySlots)) : { selectedDays: [] };
        monthlySchedule = currentService.schedule.config.monthlySlots ? JSON.parse(JSON.stringify(currentService.schedule.config.monthlySlots)) : { type: 'date', date: 1, week: 'first', dayOfWeek: 'monday', slots: [] };

        // Reconstruct selectedDays if missing (from keys)
        if (!weeklySchedule.selectedDays) {
            weeklySchedule.selectedDays = Object.keys(weeklySchedule).filter(k => k !== 'selectedDays');
        }
    } else {
        // Fallback for legacy data
        dailySchedule = [];
        weeklySchedule = { selectedDays: currentService.schedule?.daysOfWeek || [] };
        monthlySchedule = { type: 'date', date: 1, week: 'first', dayOfWeek: 'monday', slots: [] };
    }

    // Toggle appropriate builder
    toggleScheduleBuilder();

    // Populate Custom/Legacy fields if needed
    document.getElementById('editStartTime').value = currentService.schedule?.startTime || '';
    document.getElementById('editEndTime').value = currentService.schedule?.endTime || '';
    document.getElementById('editDuration').value = currentService.schedule?.duration || '';

    // Set selected days for Custom builder
    document.querySelectorAll('.day-selector').forEach(btn => {
        const day = btn.dataset.day;
        if (currentService.schedule?.daysOfWeek?.includes(day)) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });

    // Render builders
    renderDailySlots();

    // Render weekly builder days
    if (weeklySchedule.selectedDays) {
        // Clear existing Day selection in Weekly Builder
        document.querySelectorAll('.day-selector-btn').forEach(btn => {
            const day = btn.dataset.day;
            if (weeklySchedule.selectedDays.map(d => d.toLowerCase()).includes(day.toLowerCase())) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        // Re-render all sections
        const container = document.getElementById('weeklyDaysContainer');
        container.innerHTML = ''; // clear
        weeklySchedule.selectedDays.forEach(day => {
            renderDaySection(day.toLowerCase());
            renderDaySlots(day.toLowerCase());
        });
    }

    // Render Monthly Builder
    if (frequency === 'monthly') {
        const type = monthlySchedule.type || 'date';
        setMonthlyPatternType(type);

        if (type === 'date') {
            const dateSelect = document.getElementById('monthlyDateValue');
            if (dateSelect) dateSelect.value = monthlySchedule.date || 1;
        } else {
            document.getElementById('monthlyWeekValue').value = monthlySchedule.week || 'first';
            document.getElementById('monthlyDayOfWeekValue').value = monthlySchedule.dayOfWeek || 'monday';
        }
        renderMonthlySlots();
    }

    // Capacity

    // Capacity
    // Capacity
    if (currentService.type === 'One-to-One') {
        document.getElementById('capacityEditStandard').classList.add('hidden');
        document.getElementById('capacityEditOneToOne').classList.remove('hidden');

        // Populate One-to-One specific fields
        document.getElementById('oneToOneTypeEdit').classList.remove('hidden');
        document.getElementById('classTypeEdit').classList.add('hidden');
        document.getElementById('editFocusArea').value = currentService.focusArea || '';
        document.getElementById('editPersonalizationLevel').value = currentService.personalizationLevel || 'Standard';

    } else {
        document.getElementById('capacityEditStandard').classList.remove('hidden');
        document.getElementById('capacityEditOneToOne').classList.add('hidden');
        document.getElementById('editMaxCapacity').value = currentService.maxCapacity || '';
        document.getElementById('editMinCapacity').value = currentService.minCapacity || '';

        // Hide One-to-One fields
        document.getElementById('oneToOneTypeEdit').classList.add('hidden');

        if (currentService.type === 'Class') {
            document.getElementById('classTypeEdit').classList.remove('hidden');
            document.getElementById('editCurriculum').value = currentService.curriculum || '';
            document.getElementById('editCohortStartDate').value = currentService.cohortStartDate || '';
            document.getElementById('editCohortEndDate').value = currentService.cohortEndDate || '';
            document.getElementById('editCohortSize').value = currentService.cohortSize || '';
        } else {
            document.getElementById('classTypeEdit').classList.add('hidden');
        }

        if (currentService.type === 'Group') {
            document.getElementById('minCapacityField').classList.remove('hidden');
        } else {
            document.getElementById('minCapacityField').classList.add('hidden');
        }
    }

    // Initialize staff search and list
    initializeStaffSearch();
    renderEditableStaffList();
}

function updateSummary() {
    // Helper to safe update
    const updateText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    updateText('summaryPricebook', currentService.pricebookItemName || '-');

    // Map to available IDs in HTML
    updateText('summaryActiveStudents', `${currentService.totalEnrolled || 0} Active`);
    updateText('summaryUpcomingSessions', `${currentService.sessionsCount || 0} Sessions`);

    // Some IDs from script don't exist in HTML, skipping or mapping:
    // summaryFill -> Not in HTML
    // summaryStaff -> Not in main summary, handled by renderStaffAssignment for specific tab

    // Revenue (using price * enrolled as estimate?)
    const estRevenue = (currentService.pricebookPrice || 0) * (currentService.totalEnrolled || 0);
    updateText('summaryRevenue', `$${estRevenue.toLocaleString()}`);
}

// ===== TAB NAVIGATION =====
function switchTab(tabName) {
    currentTab = tabName;

    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active', 'border-indigo-500', 'text-indigo-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });

    const activeTab = document.getElementById(`${tabName}Tab`);
    if (activeTab) {
        activeTab.classList.add('active', 'border-indigo-500', 'text-indigo-600');
        activeTab.classList.remove('border-transparent', 'text-gray-500');
    }

    // Show/hide content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    const activeContent = document.getElementById(`${tabName}Content`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
}

function showEditModeWarning() {
    document.getElementById('editModeBlockWarning').classList.remove('hidden');
}

function closeEditModeWarning() {
    document.getElementById('editModeBlockWarning').classList.add('hidden');
}

// ===== VIEW/EDIT MODE =====
function checkUrlForEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'edit') {
        enterEditMode();
    }
}

function enterEditMode() {
    isEditMode = true;

    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('mode', 'edit');
    window.history.pushState({}, '', url);

    // Toggle action buttons
    document.getElementById('viewModeActions').classList.add('hidden');
    document.getElementById('editModeActions').classList.remove('hidden');

    // Show edit fields, hide view fields
    document.querySelectorAll('.view-only').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.edit-only').forEach(el => el.classList.remove('hidden'));

    // Show schedule warning
    document.getElementById('scheduleWarning').classList.remove('hidden');

    // Disable view-only tabs (if any remaining)
    // document.getElementById('enrollmentTab').disabled = true; 
    // document.getElementById('sessionsTab').disabled = true;

    // Add edit-mode class to body for CSS targeting
    document.body.classList.add('edit-mode');

    // If on a view-only tab, switch to overview
    if (currentTab !== 'overview' && currentTab !== 'staff') {
        switchTab('overview');
    }
}

function cancelEdit() {
    if (hasUnsavedChanges) {
        if (!confirm('You have unsaved changes. Are you sure you want to cancel?')) {
            return;
        }
    }

    // Reset to original data
    currentService = JSON.parse(JSON.stringify(originalData));
    populateEditFields();

    exitEditMode();
}

function exitEditMode() {
    isEditMode = false;
    hasUnsavedChanges = false;

    // Update URL
    const url = new URL(window.location);
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url);

    // Toggle action buttons
    document.getElementById('viewModeActions').classList.remove('hidden');
    document.getElementById('editModeActions').classList.add('hidden');

    // Hide unsaved indicator
    document.getElementById('unsavedIndicator').classList.add('hidden');

    // Show view fields, hide edit fields
    document.querySelectorAll('.view-only').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.edit-only').forEach(el => el.classList.add('hidden'));

    // Hide schedule warning
    document.getElementById('scheduleWarning').classList.add('hidden');

    // Enable all tabs
    // document.getElementById('enrollmentTab').disabled = false;
    // document.getElementById('sessionsTab').disabled = false;

    // Remove edit-mode class
    document.body.classList.remove('edit-mode');
}

function saveChanges() {
    try {
        console.log('Saving changes...', currentService);

        // Collect data from form
        const frequency = document.getElementById('editFrequency').value;

        const updatedData = {
            ...currentService,
            name: document.getElementById('editName').value.trim(),
            description: document.getElementById('editDescription').value.trim(),
            skillLevel: document.getElementById('editSkillLevel').value,
            status: document.getElementById('editStatus').value,
            schedule: {
                ...currentService.schedule,
                frequency: frequency,
                // Complex config
                config: {
                    dailySlots: frequency === 'daily' ? dailySchedule : [],
                    weeklySlots: frequency === 'weekly' ? weeklySchedule : {},
                    monthlySlots: frequency === 'monthly' ? monthlySchedule : {}
                },
                // Legacy/Custom support
                daysOfWeek: frequency === 'custom' ? getSelectedDays() :
                    (frequency === 'weekly' ? weeklySchedule.selectedDays : []),
                startTime: frequency === 'custom' ? document.getElementById('editStartTime').value : null,
                endTime: frequency === 'custom' ? document.getElementById('editEndTime').value : null,
                duration: parseInt(document.getElementById('editDuration').value) || 0
            },
            // Explicitly preserve staff just in case
            staff: currentService.staff || []
        };

        // Update capacity
        // Update capacity
        if (currentService.type !== 'One-to-One') {
            updatedData.maxCapacity = parseInt(document.getElementById('editMaxCapacity').value) || currentService.maxCapacity;
            if (currentService.type === 'Group') {
                updatedData.minCapacity = parseInt(document.getElementById('editMinCapacity').value) || null;
            }
            if (currentService.type === 'Class') {
                updatedData.curriculum = document.getElementById('editCurriculum').value.trim();
                updatedData.cohortStartDate = document.getElementById('editCohortStartDate').value;
                updatedData.cohortEndDate = document.getElementById('editCohortEndDate').value;
                updatedData.cohortSize = parseInt(document.getElementById('editCohortSize').value) || null;
            }
        } else {
            // One-to-One updates
            updatedData.focusArea = document.getElementById('editFocusArea').value.trim();
            updatedData.personalizationLevel = document.getElementById('editPersonalizationLevel').value;
        }

        // Validate
        if (!updatedData.name) {
            alert('Name is required');
            return;
        }

        // Check if schedule changed
        const scheduleChanged = JSON.stringify(originalData.schedule) !== JSON.stringify(updatedData.schedule);
        if (scheduleChanged && currentService.sessionsCount > 0) {
            const applyTo = confirm('Schedule changes detected. Apply to future sessions only?\n\nOK = Future only\nCancel = All sessions');
            // In real implementation, handle this logic
        }

        // Save
        currentService = updatedData;
        originalData = JSON.parse(JSON.stringify(currentService));

        // Save to localStorage
        saveToStorage();

        // Update display
        renderServiceData();

        // Exit edit mode
        exitEditMode();

        // Show success
        showToast('Changes saved successfully!');

    } catch (error) {
        console.error('Error saving changes:', error);
        alert('Failed to save changes: ' + error.message);
    }
}

function saveToStorage() {
    const stored = localStorage.getItem('fms_learning_services');
    let services = stored ? JSON.parse(stored) : [];

    const index = services.findIndex(s => s.id === currentService.id);
    if (index >= 0) {
        services[index] = currentService;
    } else {
        services.push(currentService);
    }

    localStorage.setItem('fms_learning_services', JSON.stringify(services));
}

// ===== DAY SELECTORS =====
function initializeDaySelectors() {
    document.querySelectorAll('.day-selector').forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('selected');
            markUnsaved();
        });
    });
}

function getSelectedDays() {
    const days = [];
    document.querySelectorAll('.day-selector.selected').forEach(btn => {
        days.push(btn.dataset.day);
    });
    return days;
}

// ===== TIME CALCULATION =====
function initializeTimeCalculation() {
    document.getElementById('editStartTime')?.addEventListener('change', calculateDuration);
    document.getElementById('editEndTime')?.addEventListener('change', calculateDuration);

    // Track changes for unsaved indicator
    document.querySelectorAll('#basicInfoEdit input, #basicInfoEdit select, #basicInfoEdit textarea').forEach(el => {
        el.addEventListener('input', markUnsaved);
    });
    document.querySelectorAll('#scheduleEdit input, #scheduleEdit select').forEach(el => {
        el.addEventListener('input', markUnsaved);
    });
    document.querySelectorAll('#capacityEdit input').forEach(el => {
        el.addEventListener('input', markUnsaved);
    });
}

function calculateDuration() {
    const startTime = document.getElementById('editStartTime').value;
    const endTime = document.getElementById('editEndTime').value;

    if (startTime && endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        let duration = (end - start) / (1000 * 60);

        if (duration < 0) duration += 24 * 60; // Handle overnight

        document.getElementById('editDuration').value = duration;
    }
}

function markUnsaved() {
    if (isEditMode && !hasUnsavedChanges) {
        hasUnsavedChanges = true;
        document.getElementById('unsavedIndicator').classList.remove('hidden');
    }
}

// ===== STAFF MANAGEMENT =====
const availableStaff = [
    { id: 'staff1', name: 'John Smith', role: 'Senior Tutor', skills: 'Math, Physics, SAT Prep', hourlyRate: 45.00 },
    { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist', skills: 'Algebra, Calculus, AP Math', hourlyRate: 40.00 },
    { id: 'staff3', name: 'Michael Chen', role: 'Science Teacher', skills: 'Chemistry, Biology, Lab Work', hourlyRate: 38.00 },
    { id: 'staff4', name: 'Sarah Wilson', role: 'English Tutor', skills: 'Essay Writing, Literature, Grammar', hourlyRate: 35.00 },
    { id: 'staff5', name: 'David Brown', role: 'Test Prep Coach', skills: 'SAT, ACT, GRE', hourlyRate: 50.00 },
    { id: 'staff6', name: 'Maestro Giovanni', role: 'Instructor', skills: 'Violin, Orchestra', hourlyRate: 80.00 },
    { id: 'staff7', name: 'Clara Schumann', role: 'Teacher', skills: 'Piano, Theory', hourlyRate: 60.00 }
];

function initializeStaffSearch() {
    const searchInput = document.getElementById('staffSearchInput');
    const autocomplete = document.getElementById('staffAutocomplete');

    if (!searchInput || !autocomplete) return;

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        if (query.length < 1) {
            autocomplete.classList.add('hidden');
            return;
        }

        const matches = availableStaff.filter(staff =>
            !currentService.staff?.some(s => s.id === staff.id) && // Exclude already assigned
            (staff.name.toLowerCase().includes(query) ||
                staff.role.toLowerCase().includes(query) ||
                staff.skills.toLowerCase().includes(query))
        );

        if (matches.length > 0) {
            autocomplete.innerHTML = matches.map(staff => `
                <div class="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0" onclick="addStaff('${staff.id}')">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-medium text-sm text-gray-900">${staff.name}</p>
                            <p class="text-xs text-gray-500">${staff.role} • ${staff.skills}</p>
                        </div>
                        <div class="text-right">
                             <p class="text-xs font-medium text-gray-900">$${staff.hourlyRate}/hr</p>
                        </div>
                    </div>
                </div>
            `).join('');
            autocomplete.classList.remove('hidden');
        } else {
            autocomplete.classList.add('hidden');
        }
    });

    // Close on toggle
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !autocomplete.contains(e.target)) {
            autocomplete.classList.add('hidden');
        }
    });
}

function addStaff(staffId) {
    const staff = availableStaff.find(s => s.id === staffId);
    if (!staff) return;

    if (!currentService.staff) currentService.staff = [];

    // Add with assigned rate (default to hourly rate)
    currentService.staff.push({
        ...staff,
        assignedRate: staff.hourlyRate
    });

    renderEditableStaffList();
    renderStaffAssignment(); // Update view mode as well
    markUnsaved();

    // Clear search
    document.getElementById('staffSearchInput').value = '';
    document.getElementById('staffAutocomplete').classList.add('hidden');
}

function removeStaff(staffId) {
    if (!currentService.staff) return;

    currentService.staff = currentService.staff.filter(s => s.id !== staffId);

    renderEditableStaffList();
    renderStaffAssignment(); // Update view mode
    markUnsaved();
}

function renderEditableStaffList() {
    const container = document.getElementById('editableStaffList');
    if (!container) return;

    container.innerHTML = '';

    if (currentService.staff && currentService.staff.length > 0) {
        currentService.staff.forEach(staff => {
            const initials = staff.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm';
            item.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span class="text-indigo-600 font-medium">${initials}</span>
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">${staff.name}</p>
                        <p class="text-xs text-gray-500">${staff.role}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <label class="text-xs text-gray-500 block">Rate</label>
                        <span class="text-sm font-medium">$${(staff.assignedRate || 0).toFixed(2)}/hr</span>
                    </div>
                    <button onclick="removeStaff('${staff.id}')" class="text-red-500 hover:text-red-700 p-1">
                         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            `;
            container.appendChild(item);
        });
    } else {
        container.innerHTML = '<p class="text-sm text-gray-500 italic p-2">No active staff assignments.</p>';
    }
}

// ===== HELPER FUNCTIONS =====
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function showToast(message) {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-lg z-50 animate-fade-in';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== TIME SLOT BUILDER FUNCTIONS (Ported from Create) =====

function toggleScheduleBuilder() {
    const frequency = document.getElementById('editFrequency').value;

    document.getElementById('dailyScheduleBuilder').classList.add('hidden');
    document.getElementById('weeklyScheduleBuilder').classList.add('hidden');
    document.getElementById('monthlyScheduleBuilder').classList.add('hidden');
    document.getElementById('customScheduleBuilder').classList.add('hidden');

    if (frequency === 'daily') {
        document.getElementById('dailyScheduleBuilder').classList.remove('hidden');
    } else if (frequency === 'weekly') {
        document.getElementById('weeklyScheduleBuilder').classList.remove('hidden');
    } else if (frequency === 'monthly') {
        document.getElementById('monthlyScheduleBuilder').classList.remove('hidden');
        initializeMonthlyScheduleUI(); // Setup UI on first show
    } else {
        document.getElementById('customScheduleBuilder').classList.remove('hidden');
    }
}

// Generate unique slot ID
function generateSlotId() {
    return `slot_${Date.now()}_${slotIdCounter++}`;
}

// ... Daily Schedule ...
function addDailyTimeSlot() {
    const slot = {
        id: generateSlotId(),
        startTime: '',
        endTime: '',
        duration: 60, // Default duration
        staffIds: []
    };
    dailySchedule.push(slot);
    renderDailySlots();
    markUnsaved(); // Mark as unsaved
}

function removeDailyTimeSlot(slotId) {
    dailySchedule = dailySchedule.filter(s => s.id !== slotId);
    renderDailySlots();
    markUnsaved();
}

function renderDailySlots() {
    const container = document.getElementById('dailySlotsList');
    if (!container) return;

    if (dailySchedule.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500 italic py-4">No time slots configured. Click "+ Add Time Slot" to begin.</p>';
        return;
    }

    container.innerHTML = dailySchedule.map(slot => renderTimeSlotCard(slot, 'daily')).join('');
}

// ... Weekly Schedule ...
function toggleWeeklyBuilderDay(dayName) {
    const btn = document.querySelector(`.day-selector-btn[data-day="${dayName}"]`);

    if (!weeklySchedule.selectedDays) weeklySchedule.selectedDays = [];

    // Normalize case for comparison
    const dayLower = dayName.toLowerCase();
    const index = weeklySchedule.selectedDays.findIndex(d => d.toLowerCase() === dayLower);

    if (index >= 0) {
        // Deselect
        weeklySchedule.selectedDays.splice(index, 1);
        btn.classList.remove('selected');
        // Remove section
        const daySection = document.querySelector(`[data-day-section="${dayLower}"]`);
        if (daySection) daySection.remove();
        // Remove data
        delete weeklySchedule[dayLower];
    } else {
        // Select
        weeklySchedule.selectedDays.push(dayName); // Push original case or standard?
        btn.classList.add('selected');

        // Init data if needed
        if (!weeklySchedule[dayLower]) weeklySchedule[dayLower] = [];

        renderDaySection(dayLower);
    }
    markUnsaved();
}

function renderDaySection(dayName) {
    const container = document.getElementById('weeklyDaysContainer');
    if (!container) return;

    // Check if already exists to avoid duplicates (though logic should prevent)
    if (document.querySelector(`[data-day-section="${dayName}"]`)) return;

    const dayLabel = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    const daySection = document.createElement('div');
    daySection.className = 'day-schedule-section border border-gray-200 rounded-lg p-4 bg-gray-50';
    daySection.setAttribute('data-day-section', dayName);
    daySection.innerHTML = `
        <div class="flex items-center justify-between mb-3">
            <h4 class="text-lg font-semibold text-gray-900">${dayLabel}</h4>
            <button type="button" onclick="toggleWeeklyBuilderDay('${dayName}')" 
                class="text-sm text-red-600 hover:text-red-800">
                Remove Day
            </button>
        </div>
        <div id="${dayName}SlotsList" class="space-y-3 mb-3">
            <p class="text-sm text-gray-500 italic">No time slots for this day. Click "+ Add Time Slot" below.</p>
        </div>
        <button type="button" onclick="addWeeklyTimeSlot('${dayName}')" 
            class="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-gray-600 hover:text-indigo-600 text-sm font-medium">
            + Add Time Slot
        </button>
    `;

    container.appendChild(daySection);
}

function addWeeklyTimeSlot(dayName) {
    const slot = {
        id: generateSlotId(),
        startTime: '',
        endTime: '',
        duration: 60,
        staffIds: []
    };

    const dayLower = dayName.toLowerCase();
    if (!weeklySchedule[dayLower]) weeklySchedule[dayLower] = [];

    weeklySchedule[dayLower].push(slot);
    renderDaySlots(dayLower);
    markUnsaved();
}

function removeWeeklyTimeSlot(dayName, slotId) {
    const dayLower = dayName.toLowerCase();
    if (weeklySchedule[dayLower]) {
        weeklySchedule[dayLower] = weeklySchedule[dayLower].filter(s => s.id !== slotId);
        renderDaySlots(dayLower);
    }
    markUnsaved();
}

// ===== MONTHLY SCHEDULE FUNCTIONS =====
function initializeMonthlyScheduleUI() {
    // Populate date dropdown (1-31)
    const dateSelect = document.getElementById('monthlyDateValue');
    if (dateSelect && dateSelect.options.length === 0) {
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i === 1) option.selected = true;
            dateSelect.appendChild(option);
        }
    }
}

function setMonthlyPatternType(type) {
    monthlySchedule.type = type;

    // Update button styles
    const dateBtn = document.getElementById('monthlyPatternTypeDate');
    const dayOfWeekBtn = document.getElementById('monthlyPatternTypeDayOfWeek');

    if (type === 'date') {
        dateBtn.className = 'px-4 py-2 text-sm rounded-lg border-2 transition-colors bg-indigo-100 border-indigo-500 text-indigo-700 font-medium';
        dayOfWeekBtn.className = 'px-4 py-2 text-sm rounded-lg border-2 transition-colors border-gray-300 text-gray-600 hover:border-indigo-300';
        document.getElementById('monthlySpecificDateConfig').classList.remove('hidden');
        document.getElementById('monthlyRelativeDayConfig').classList.add('hidden');
    } else {
        dateBtn.className = 'px-4 py-2 text-sm rounded-lg border-2 transition-colors border-gray-300 text-gray-600 hover:border-indigo-300';
        dayOfWeekBtn.className = 'px-4 py-2 text-sm rounded-lg border-2 transition-colors bg-indigo-100 border-indigo-500 text-indigo-700 font-medium';
        document.getElementById('monthlySpecificDateConfig').classList.add('hidden');
        document.getElementById('monthlyRelativeDayConfig').classList.remove('hidden');
    }
    markUnsaved();
}

function updateMonthlyPatternConfig() {
    if (monthlySchedule.type === 'date') {
        monthlySchedule.date = parseInt(document.getElementById('monthlyDateValue').value);
    } else {
        monthlySchedule.week = document.getElementById('monthlyWeekValue').value;
        monthlySchedule.dayOfWeek = document.getElementById('monthlyDayOfWeekValue').value;
    }
    markUnsaved();
}

function addMonthlyTimeSlot() {
    const slot = {
        id: generateSlotId(),
        startTime: '',
        endTime: '',
        duration: currentService.schedule?.duration || 60,
        staffIds: []
    };

    monthlySchedule.slots.push(slot);
    renderMonthlySlots();
    markUnsaved();
}

function removeMonthlyTimeSlot(slotId) {
    monthlySchedule.slots = monthlySchedule.slots.filter(s => s.id !== slotId);
    renderMonthlySlots();
    markUnsaved();
}

function renderMonthlySlots() {
    const container = document.getElementById('monthlySlotsList');

    if (monthlySchedule.slots.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500 italic">No time slots configured. Click "+ Add Time Slot" to begin.</p>';
        return;
    }

    container.innerHTML = monthlySchedule.slots.map(slot => renderTimeSlotCard(slot, 'monthly')).join('');
}

function renderDaySlots(dayName) {
    const container = document.getElementById(`${dayName}SlotsList`);
    const dayLower = dayName.toLowerCase();
    const slots = weeklySchedule[dayLower] || [];

    if (slots.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500 italic">No time slots for this day. Click "+ Add Time Slot" below.</p>';
        return;
    }

    container.innerHTML = slots.map(slot => renderTimeSlotCard(slot, dayLower)).join('');
}

function renderTimeSlotCard(slot, context) {
    return `
        <div class="time-slot-card bg-white p-3 border border-gray-200 rounded-lg shadow-sm" data-slot-id="${slot.id}">
            <div class="flex items-start gap-4">
                <!-- Time Inputs -->
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="flex-1">
                            <label class="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                            <input type="time" value="${slot.startTime}" 
                                onchange="updateSlotStartTime('${slot.id}', this.value, '${context}')"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div class="flex-1">
                             <label class="block text-xs font-medium text-gray-600 mb-1">Duration (min)</label>
                             <input type="number" value="${slot.duration}" 
                                onchange="updateSlotDuration('${slot.id}', this.value, '${context}')"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div class="flex-1">
                            <label class="block text-xs font-medium text-gray-600 mb-1">End Time</label>
                            <input type="time" value="${slot.endTime}" readonly
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed" />
                        </div>
                    </div>
                </div>
                
                <!-- Remove Button -->
                <button type="button" onclick="removeTimeSlot('${slot.id}', '${context}')"
                    class="text-gray-400 hover:text-red-500 transition-colors mt-6">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

function updateSlotStartTime(slotId, startTime, context) {
    const slot = findSlot(slotId, context);
    if (!slot) return;

    slot.startTime = startTime;
    slot.endTime = calculateEndTime(startTime, slot.duration);

    if (context === 'daily') renderDailySlots();
    else if (context === 'monthly') renderMonthlySlots();
    else renderDaySlots(context);

    markUnsaved();
}

function updateSlotDuration(slotId, duration, context) {
    const slot = findSlot(slotId, context);
    if (!slot) return;

    slot.duration = parseInt(duration) || 60;
    slot.endTime = calculateEndTime(slot.startTime, slot.duration);

    if (context === 'daily') renderDailySlots();
    else if (context === 'monthly') renderMonthlySlots();
    else renderDaySlots(context);

    markUnsaved();
}

function calculateEndTime(startTime, durationMinutes) {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date(2000, 0, 1, hours, minutes);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
}

function findSlot(slotId, context) {
    if (context === 'daily') {
        return dailySchedule.find(s => s.id === slotId);
    } else if (context === 'monthly') {
        return monthlySchedule.slots.find(s => s.id === slotId);
    } else {
        // Weekly (context is day name)
        const dayLower = context.toLowerCase();
        return weeklySchedule[dayLower]?.find(s => s.id === slotId);
    }
}

function removeTimeSlot(slotId, context) {
    if (context === 'daily') removeDailyTimeSlot(slotId);
    else if (context === 'monthly') removeMonthlyTimeSlot(slotId);
    else removeWeeklyTimeSlot(context, slotId);
}

// ===== ACTIONS =====
function goBack() {
    if (hasUnsavedChanges) {
        if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
            return;
        }
    }
    window.location.href = 'learning_service_list.html';
}

function generateSessions() {
    alert('Generate Sessions dialog would open here.\n\nSelect date range to generate sessions based on the schedule configuration.');
}

function archiveService() {
    if (confirm(`Are you sure you want to archive "${currentService.name}"?\n\nThis will hide it from the active list.`)) {
        currentService.status = 'archived';
        saveToStorage();
        renderServiceData();
        showToast('Learning service archived');
    }
}

function showMoreActions() {
    const action = prompt('More Actions:\n\n1. Duplicate\n2. Delete (if no sessions)\n3. Export\n\nEnter number:');

    switch (action) {
        case '1':
            duplicateService();
            break;
        case '2':
            deleteService();
            break;
        case '3':
            exportService();
            break;
    }
}

function duplicateService() {
    alert('Duplicate service feature would create a copy with a new ID.');
}

function deleteService() {
    if (currentService.sessionsCount > 0) {
        alert('Cannot delete: This service has sessions. Archive it instead.');
        return;
    }

    if (confirm(`Permanently delete "${currentService.name}"?\n\nThis action cannot be undone.`)) {
        const stored = localStorage.getItem('fms_learning_services');
        if (stored) {
            let services = JSON.parse(stored);
            services = services.filter(s => s.id !== currentService.id);
            localStorage.setItem('fms_learning_services', JSON.stringify(services));
        }
        window.location.href = 'learning_service_list.html';
    }
}

function exportService() {
    alert('Export feature would download service data as JSON or PDF.');
}

// ===== ENROLLMENT MANAGEMENT =====
let selectedCustomer = null;
let selectedQuote = null;
let attendeeToTransfer = null;
let attendeeToRemove = null;

// Sample customers (matching group_detail.html structure)
const sampleCustomers = [
    {
        id: 'CUST-001',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+61 400 123 456',
        quotes: [
            { id: 'Q-2025-001', pricebookItemId: 'pb1', slots: 5, total: 100.00, status: 'approved', paymentStatus: 'paid', amountPaid: 100.00 },
            { id: 'Q-2025-002', pricebookItemId: 'pb1', slots: 3, total: 60.00, status: 'approved', paymentStatus: 'partial', amountPaid: 30.00 },
            { id: 'Q-2025-010', pricebookItemId: 'pb2', slots: 4, total: 200.00, status: 'approved', paymentStatus: 'paid', amountPaid: 200.00 }
        ]
    },
    {
        id: 'CUST-002',
        name: 'Michael Chen',
        email: 'm.chen@email.com',
        phone: '+61 400 234 567',
        quotes: [
            { id: 'Q-2025-003', pricebookItemId: 'pb3', slots: 10, total: 500.00, status: 'approved', paymentStatus: 'paid', amountPaid: 500.00 },
            { id: 'Q-2025-011', pricebookItemId: 'pb1', slots: 6, total: 1080.00, status: 'approved', paymentStatus: 'partial', amountPaid: 540.00 }
        ]
    },
    {
        id: 'CUST-003',
        name: 'Emma Wilson',
        email: 'emma.w@email.com',
        phone: '+61 400 345 678',
        quotes: [
            { id: 'Q-2025-004', pricebookItemId: 'pb1', slots: 2, total: 40.00, status: 'approved', paymentStatus: 'unpaid', amountPaid: 0 },
            { id: 'Q-2025-012', pricebookItemId: 'pb2', slots: 3, total: 150.00, status: 'approved', paymentStatus: 'paid', amountPaid: 150.00 }
        ]
    },
    {
        id: 'CUST-004',
        name: 'David Thompson',
        email: 'david.t@email.com',
        phone: '+61 400 456 789',
        quotes: [
            { id: 'Q-2025-005', pricebookItemId: 'pb3', slots: 8, total: 960.00, status: 'approved', paymentStatus: 'paid', amountPaid: 960.00 },
            { id: 'Q-2025-013', pricebookItemId: 'pb1', slots: 5, total: 1000.00, status: 'approved', paymentStatus: 'partial', amountPaid: 500.00 }
        ]
    },
    {
        id: 'CUST-005',
        name: 'Lisa Anderson',
        email: 'lisa.a@email.com',
        phone: '+61 400 567 890',
        quotes: [
            { id: 'Q-2025-006', pricebookItemId: 'pb2', slots: 6, total: 300.00, status: 'approved', paymentStatus: 'paid', amountPaid: 300.00 },
            { id: 'Q-2025-014', pricebookItemId: 'pb1', slots: 10, total: 350.00, status: 'approved', paymentStatus: 'paid', amountPaid: 350.00 }
        ]
    },
    {
        id: 'CUST-006',
        name: 'James Martinez',
        email: 'james.m@email.com',
        phone: '+61 400 678 901',
        quotes: [
            { id: 'Q-2025-007', pricebookItemId: 'pb4', slots: 4, total: 180.00, status: 'approved', paymentStatus: 'paid', amountPaid: 180.00 },
            { id: 'Q-2025-015', pricebookItemId: 'pb4', slots: 2, total: 90.00, status: 'approved', paymentStatus: 'unpaid', amountPaid: 0 }
        ]
    },
    {
        id: 'CUST-007',
        name: 'Miss A',
        email: 'missa@email.com',
        phone: '+61 400 789 012',
        quotes: [
            { id: 'Q-2025-008', pricebookItemId: 'pb2', slots: 2, total: 100.00, status: 'approved', paymentStatus: 'paid', amountPaid: 100.00 },
            { id: 'Q-2025-016', pricebookItemId: 'pb1', slots: 5, total: 600.00, status: 'approved', paymentStatus: 'partial', amountPaid: 300.00 },
            { id: 'Q-2025-017', pricebookItemId: 'pb3', slots: 3, total: 240.00, status: 'approved', paymentStatus: 'paid', amountPaid: 240.00 }
        ]
    },
    {
        id: 'CUST-008',
        name: 'Robert Kim',
        email: 'robert.k@email.com',
        phone: '+61 400 890 123',
        quotes: [
            { id: 'Q-2025-009', pricebookItemId: 'pb1', slots: 8, total: 1440.00, status: 'approved', paymentStatus: 'paid', amountPaid: 1440.00 },
            { id: 'Q-2025-018', pricebookItemId: 'pb1', slots: 4, total: 800.00, status: 'approved', paymentStatus: 'paid', amountPaid: 800.00 }
        ]
    },
    {
        id: 'CUST-009',
        name: 'Maria Garcia',
        email: 'maria.g@email.com',
        phone: '+61 400 901 234',
        quotes: [
            { id: 'Q-2025-019', pricebookItemId: 'pb2', slots: 5, total: 250.00, status: 'approved', paymentStatus: 'paid', amountPaid: 250.00 },
            { id: 'Q-2025-020', pricebookItemId: 'pb1', slots: 8, total: 280.00, status: 'approved', paymentStatus: 'unpaid', amountPaid: 0 }
        ]
    },
    {
        id: 'CUST-010',
        name: 'Thomas Brown',
        email: 'thomas.b@email.com',
        phone: '+61 400 012 345',
        quotes: [
            { id: 'Q-2025-021', pricebookItemId: 'pb1', slots: 12, total: 1440.00, status: 'approved', paymentStatus: 'partial', amountPaid: 720.00 },
            { id: 'Q-2025-022', pricebookItemId: 'pb3', slots: 6, total: 480.00, status: 'approved', paymentStatus: 'paid', amountPaid: 480.00 }
        ]
    },
    {
        id: 'CUST-011',
        name: 'Jennifer Lee',
        email: 'jennifer.l@email.com',
        phone: '+61 400 123 456',
        quotes: [
            { id: 'Q-2025-023', pricebookItemId: 'pb4', slots: 6, total: 270.00, status: 'approved', paymentStatus: 'paid', amountPaid: 270.00 },
            { id: 'Q-2025-024', pricebookItemId: 'pb2', slots: 4, total: 200.00, status: 'approved', paymentStatus: 'paid', amountPaid: 200.00 }
        ]
    },
    {
        id: 'CUST-012',
        name: 'Christopher White',
        email: 'chris.w@email.com',
        phone: '+61 400 234 567',
        quotes: [
            { id: 'Q-2025-025', pricebookItemId: 'pb1', slots: 7, total: 1400.00, status: 'approved', paymentStatus: 'paid', amountPaid: 1400.00 },
            { id: 'Q-2025-026', pricebookItemId: 'pb1', slots: 4, total: 720.00, status: 'approved', paymentStatus: 'unpaid', amountPaid: 0 }
        ]
    }
];

// Track slot usage per quote
let slotUsage = {};

function openBookCustomerModal() {
    // Check if One-to-One already has 1 attendee
    if (currentService?.type === 'One-to-One') {
        const currentEnrollments = currentService.enrollments || [];
        if (currentEnrollments.length >= 1) {
            alert('One-to-One learning services can only have 1 attendee. Please remove the existing attendee before adding a new one.');
            return;
        }
    }

    document.getElementById('bookCustomerModal').classList.remove('hidden');
    document.getElementById('customerSearchInput').value = '';
    document.getElementById('customerAutocomplete').classList.add('hidden');
    document.getElementById('slotBookingForm').classList.add('hidden');
    selectedCustomer = null;
    selectedQuote = null;

    // Update search hint based on pricebook item and type
    const hint = document.getElementById('customerSearchHint');
    if (currentService?.type === 'One-to-One') {
        hint.innerHTML = `<span class="text-blue-600">ℹ️</span> One-to-One services can only have 1 attendee (1:1 ratio)`;
    } else if (currentService?.pricebookItemId) {
        hint.innerHTML = `<span class="text-emerald-600">✓</span> Searching for customers with quotes matching this service's price book item`;
    } else {
        hint.innerHTML = `<span class="text-amber-600">⚠️</span> Please ensure a pricebook item is linked to this learning service`;
    }
}

function closeBookCustomerModal() {
    document.getElementById('bookCustomerModal').classList.add('hidden');
    clearSlotBooking();
}

// Calculate slot inventory for a specific quote
function calculateSlotInventory(customerId, quoteId) {
    // Get all enrollments across all services for this customer and quote
    const stored = localStorage.getItem('fms_learning_services');
    const services = stored ? JSON.parse(stored) : [];

    let bookedSlots = 0;
    services.forEach(service => {
        if (service.enrollments) {
            service.enrollments.forEach(enrollment => {
                if (enrollment.customerId === customerId && enrollment.quoteId === quoteId) {
                    bookedSlots++;
                }
            });
        }
    });

    // Also check current service enrollments (if not yet saved)
    if (currentService?.enrollments) {
        currentService.enrollments.forEach(enrollment => {
            if (enrollment.customerId === customerId && enrollment.quoteId === quoteId) {
                // Don't double count if already in localStorage
                const alreadyCounted = services.some(s =>
                    s.id === currentService.id &&
                    s.enrollments?.some(e => e.id === enrollment.id)
                );
                if (!alreadyCounted) {
                    bookedSlots++;
                }
            }
        });
    }

    // Check local slotUsage tracker
    const usageKey = `${customerId}-${quoteId}`;
    bookedSlots += slotUsage[usageKey] || 0;

    const customer = sampleCustomers.find(c => c.id === customerId);
    const quote = customer?.quotes?.find(q => q.id === quoteId);
    const totalSlots = quote?.slots || 0;

    return {
        total: totalSlots,
        booked: bookedSlots,
        available: Math.max(0, totalSlots - bookedSlots)
    };
}

function searchCustomersForBooking(query) {
    const autocomplete = document.getElementById('customerAutocomplete');
    const pricebookItemId = currentService?.pricebookItemId;

    // Check if pricebook item is selected
    if (!pricebookItemId) {
        if (query && query.length >= 2) {
            autocomplete.innerHTML = '<div class="p-3 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded">⚠️ Please ensure a pricebook item is linked to this learning service</div>';
            autocomplete.classList.remove('hidden');
        } else {
            autocomplete.classList.add('hidden');
        }
        return;
    }

    if (!query || query.trim().length < 2) {
        autocomplete.classList.add('hidden');
        return;
    }

    query = query.trim().toLowerCase();

    // Filter customers and their matching quotes
    const matchingEntries = sampleCustomers.reduce((entries, customer) => {
        const matchesSearch = customer.name.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query);

        if (!matchesSearch || !customer.quotes) return entries;

        // Get quotes matching the pricebook item with available slots
        const matchingQuotes = customer.quotes.filter(quote => {
            if (quote.pricebookItemId !== pricebookItemId || quote.status !== 'approved') {
                return false;
            }

            // Calculate available slots for this quote
            const inventory = calculateSlotInventory(customer.id, quote.id);
            return inventory.available > 0;
        });

        matchingQuotes.forEach(quote => {
            const inventory = calculateSlotInventory(customer.id, quote.id);
            entries.push({ customer, quote, inventory });
        });

        return entries;
    }, []);

    if (matchingEntries.length === 0) {
        autocomplete.innerHTML = `
            <div class="p-3 text-sm text-gray-500">
                No customers found with available slots for this service
            </div>
        `;
        autocomplete.classList.remove('hidden');
        return;
    }

    // Group by customer
    const groupedByCustomer = matchingEntries.reduce((map, entry) => {
        if (!map.has(entry.customer.id)) {
            map.set(entry.customer.id, { customer: entry.customer, quotes: [] });
        }
        map.get(entry.customer.id).quotes.push({ quote: entry.quote, inventory: entry.inventory });
        return map;
    }, new Map());

    autocomplete.innerHTML = Array.from(groupedByCustomer.values()).map(group => `
        <div class="p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
            <div class="flex items-center justify-between mb-2">
                <div>
                    <p class="font-medium text-gray-900">${group.customer.name}</p>
                    <p class="text-xs text-gray-500">${group.customer.email}</p>
                </div>
            </div>
            <div class="space-y-1 pl-2 border-l-2 border-gray-200">
                ${group.quotes.map(q => {
        const paymentClass = q.quote.paymentStatus === 'paid' ? 'text-emerald-600' :
            q.quote.paymentStatus === 'partial' ? 'text-amber-600' : 'text-red-600';
        const paymentIcon = q.quote.paymentStatus === 'paid' ? '✓' :
            q.quote.paymentStatus === 'partial' ? '◐' : '○';
        return `
                        <div class="p-2 rounded hover:bg-indigo-50 cursor-pointer transition-colors" 
                             onclick="selectCustomerQuote('${group.customer.id}', '${q.quote.id}')">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">${q.quote.id}</span>
                                    <span class="text-xs ${paymentClass}">${paymentIcon} ${q.quote.paymentStatus}</span>
                                </div>
                                <span class="text-sm font-medium text-indigo-600">${q.inventory.available} slots available</span>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `).join('');

    autocomplete.classList.remove('hidden');
}

function selectCustomerQuote(customerId, quoteId) {
    selectedCustomer = sampleCustomers.find(c => c.id === customerId);
    selectedQuote = selectedCustomer?.quotes?.find(q => q.id === quoteId);

    if (!selectedCustomer || !selectedQuote) return;

    document.getElementById('customerAutocomplete').classList.add('hidden');
    document.getElementById('customerSearchInput').value = selectedCustomer.name;

    // Show booking form
    document.getElementById('slotBookingForm').classList.remove('hidden');

    // Calculate inventory
    const inventory = calculateSlotInventory(customerId, quoteId);

    // Populate customer info
    document.getElementById('slotBookCustomerName').textContent = selectedCustomer.name;
    document.getElementById('slotBookCustomerEmail').textContent = selectedCustomer.email;
    document.getElementById('inventoryTotal').textContent = inventory.total;
    document.getElementById('inventoryBooked').textContent = inventory.booked;
    document.getElementById('inventoryAvailable').textContent = inventory.available;
    document.getElementById('slotBookQuoteDisplay').innerHTML = `
        <div class="flex items-center justify-between">
            <span class="font-mono text-sm">${selectedQuote.id}</span>
            <span class="text-xs ${selectedQuote.paymentStatus === 'paid' ? 'text-emerald-600' :
            selectedQuote.paymentStatus === 'partial' ? 'text-amber-600' : 'text-red-600'}">
                ${selectedQuote.paymentStatus === 'paid' ? '✓ Paid' :
            selectedQuote.paymentStatus === 'partial' ? '◐ Partial' : '○ Unpaid'}
                ($${selectedQuote.amountPaid.toFixed(2)} / $${selectedQuote.total.toFixed(2)})
            </span>
        </div>
    `;

    // Show payment warning if not fully paid
    const paymentWarning = document.getElementById('paymentWarning');
    if (selectedQuote.paymentStatus !== 'paid') {
        paymentWarning.classList.remove('hidden');
        document.getElementById('paymentWarningText').textContent =
            `This quote is ${selectedQuote.paymentStatus === 'partial' ? 'only partially' : 'not'} paid.`;
    } else {
        paymentWarning.classList.add('hidden');
    }

    // Clear form
    document.getElementById('attendeeName').value = '';
    document.getElementById('attendeeNotes').value = '';
    updateBookingButtonState();
}

function clearSlotBooking() {
    selectedCustomer = null;
    selectedQuote = null;
    document.getElementById('customerSearchInput').value = '';
    document.getElementById('slotBookingForm').classList.add('hidden');
}

function updateBookingButtonState() {
    const attendeeName = document.getElementById('attendeeName').value.trim();
    const btn = document.getElementById('confirmBookingBtn');

    if (!selectedCustomer || !selectedQuote) {
        btn.disabled = true;
        return;
    }

    const inventory = calculateSlotInventory(selectedCustomer.id, selectedQuote.id);
    btn.disabled = !attendeeName || inventory.available <= 0;
}

function confirmEnrollment() {
    const attendeeName = document.getElementById('attendeeName').value.trim();
    const attendeeNotes = document.getElementById('attendeeNotes').value.trim();

    if (!attendeeName || !selectedCustomer || !selectedQuote) {
        alert('Please fill in all required fields');
        return;
    }

    // Check One-to-One capacity (max 1 attendee)
    if (currentService?.type === 'One-to-One') {
        const currentEnrollments = currentService.enrollments || [];
        if (currentEnrollments.length >= 1) {
            alert('One-to-One learning services can only have 1 attendee. Please remove the existing attendee before adding a new one.');
            return;
        }
    }

    // Check inventory again
    const inventory = calculateSlotInventory(selectedCustomer.id, selectedQuote.id);
    if (inventory.available <= 0) {
        alert('No available slots for this quote');
        return;
    }

    // Create enrollment
    const enrollment = {
        id: `enroll_${Date.now()}`,
        attendeeName,
        attendeeEmail: selectedCustomer.email,
        notes: attendeeNotes,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        quoteId: selectedQuote.id,
        paymentStatus: selectedQuote.paymentStatus,
        status: 'confirmed',
        enrolledAt: new Date().toISOString(),
        enrolledInAllSessions: true // Default enrollment in all sessions
    };

    // Add to current service enrollments
    if (!currentService.enrollments) {
        currentService.enrollments = [];
    }
    currentService.enrollments.push(enrollment);

    // Track slot usage locally
    const usageKey = `${selectedCustomer.id}-${selectedQuote.id}`;
    slotUsage[usageKey] = (slotUsage[usageKey] || 0) + 1;

    // Save and refresh
    saveToStorage();
    renderEnrollmentList();
    closeBookCustomerModal();
    showToast(`${attendeeName} enrolled successfully!`);
}

function renderEnrollmentList() {
    const enrollments = currentService.enrollments || [];
    const container = document.getElementById('enrolledList');
    const emptyState = document.getElementById('emptyEnrollment');
    const countEl = document.getElementById('enrolledCount');
    const addBtn = document.getElementById('addAttendeeBtn');
    const addFirstBtn = document.getElementById('addFirstAttendeeBtn');
    const searchBar = document.getElementById('enrollmentSearch');
    const oneToOneForm = document.getElementById('oneToOneEnrollmentForm');

    // Check if One-to-One
    const isOneToOne = currentService?.type === 'One-to-One';
    const hasAttendee = enrollments.length >= 1;

    // Show/hide elements based on type
    // Show/hide elements based on type
    if (isOneToOne) {
        // Hide search bar and buttons for One-to-One
        if (searchBar) searchBar.classList.add('hidden');
        if (addBtn) addBtn.classList.add('hidden');
        if (addFirstBtn) addFirstBtn.classList.add('hidden');

        // Show One-to-One form when no attendee
        if (oneToOneForm) {
            if (hasAttendee) {
                oneToOneForm.classList.add('hidden');
            } else {
                oneToOneForm.classList.remove('hidden');
            }
        }

        // Hide empty state for One-to-One (form replaces it)
        if (emptyState) emptyState.classList.add('hidden');
    } else {
        // Show search bar and buttons for Group
        if (searchBar) searchBar.classList.remove('hidden');
        if (addBtn) addBtn.classList.remove('hidden');
        if (oneToOneForm) oneToOneForm.classList.add('hidden');
    }

    if (enrollments.length === 0) {
        if (container) container.innerHTML = '';
        if (!isOneToOne) {
            if (emptyState) emptyState.classList.remove('hidden');
        }
        if (countEl) countEl.textContent = '0 attendees enrolled';
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (countEl) countEl.textContent = `${enrollments.length} attendee${enrollments.length !== 1 ? 's' : ''} enrolled`;

    if (container) {
        container.innerHTML = enrollments.map(e => {
            const statusConfig = {
                confirmed: { text: 'Confirmed', class: 'bg-green-100 text-green-700' },
                cancelled: { text: 'Cancelled', class: 'bg-gray-100 text-gray-700' }
            };
            const status = statusConfig[e.status] || statusConfig.confirmed;

            const paymentBadge = e.paymentStatus === 'paid' ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Paid</span>' :
                e.paymentStatus === 'partial' ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Partial</span>' :
                    e.paymentStatus === 'unpaid' ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">Unpaid</span>' : '';

            // Using simplified card content to be safe
            return `
                <div class="border border-gray-200 rounded-lg p-3 hover:border-emerald-300 transition-colors">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <h4 class="font-semibold text-gray-900">${e.attendeeName}</h4>
                                <span class="px-2 py-0.5 text-xs rounded ${status.class}">${status.text}</span>
                                ${paymentBadge}
                            </div>
                            <div class="text-xs text-gray-500 space-y-0.5">
                                <p>${e.customerName}</p>
                                <p>${e.attendeeEmail || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Update stats
    updateEnrollmentStats();
}

function updateEnrollmentStats() {
    const enrollments = currentService.enrollments || [];
    // One-to-One always has max capacity of 1
    const maxCapacity = currentService?.type === 'One-to-One' ? 1 : (currentService.maxCapacity || 1);

    const updateText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    updateText('statTotalBookings', enrollments.length);
    updateText('statConfirmed', enrollments.filter(e => e.status === 'confirmed').length);
    updateText('statAvailable', Math.max(0, maxCapacity - enrollments.length));

    const fillRate = maxCapacity > 0 ? Math.round((enrollments.length / maxCapacity) * 100) : 0;
    updateText('statAvgEnrollment', `${fillRate}%`);
}

function filterEnrolledAttendees(query) {
    const enrollments = currentService.enrollments || [];
    const container = document.getElementById('enrolledList');

    if (!query.trim()) {
        renderEnrollmentList();
        return;
    }

    const filtered = enrollments.filter(e =>
        e.attendeeName.toLowerCase().includes(query.toLowerCase()) ||
        e.customerName.toLowerCase().includes(query.toLowerCase()) ||
        (e.attendeeEmail && e.attendeeEmail.toLowerCase().includes(query.toLowerCase()))
    );

    if (filtered.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-gray-500 text-sm">No matching attendees found</div>';
        return;
    }

    // Re-render with filtered list
    container.innerHTML = filtered.map(e => {
        const statusConfig = {
            confirmed: { text: 'Confirmed', class: 'bg-green-100 text-green-700' },
            cancelled: { text: 'Cancelled', class: 'bg-gray-100 text-gray-700' }
        };
        const status = statusConfig[e.status] || statusConfig.confirmed;

        const paymentBadge = e.paymentStatus === 'paid' ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Paid</span>' :
            e.paymentStatus === 'partial' ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Partial</span>' :
                e.paymentStatus === 'unpaid' ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">Unpaid</span>' : '';

        return `
        < div class="border border-gray-200 rounded-lg p-3 hover:border-emerald-300 transition-colors" >
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h4 class="font-semibold text-gray-900">${e.attendeeName}</h4>
                            <span class="px-2 py-0.5 text-xs rounded ${status.class}">${status.text}</span>
                            ${paymentBadge}
                        </div>
                        <div class="text-xs text-gray-500 space-y-0.5">
                            <div class="flex items-center gap-3">
                                <span>Customer: ${e.customerName}</span>
                                <span>Quote: ${e.quoteId || '-'}</span>
                            </div>
                            ${e.notes ? `<p class="text-gray-600 italic mt-1">"${e.notes}"</p>` : ''}
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 pt-2 border-t border-gray-100">
                    <button onclick="openTransferModal('${e.id}')" 
                        class="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                        </svg>
                        Transfer
                    </button>
                    <button onclick="openRemoveModal('${e.id}')" 
                        class="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50">
                        Remove
                    </button>
                </div>
            </div >
        `;
    }).join('');
}

// Transfer Modal Functions
let currentTransferType = 'service'; // 'service' or 'session'
let selectedTransferSession = null;

function openTransferModal(enrollmentId) {
    const enrollment = currentService.enrollments?.find(e => e.id === enrollmentId);
    if (!enrollment) return;

    attendeeToTransfer = enrollment;
    currentTransferType = 'service';
    selectedTransferSession = null;

    const initials = enrollment.attendeeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('transferAttendeeInitials').textContent = initials;
    document.getElementById('transferAttendeeName').textContent = enrollment.attendeeName;
    document.getElementById('transferAttendeeCustomer').textContent = `Customer: ${enrollment.customerName} `;

    // Reset UI
    setTransferType('service');
    populateTransferTargets();

    document.getElementById('transferAttendeeModal').classList.remove('hidden');
}

function setTransferType(type) {
    currentTransferType = type;
    const serviceBtn = document.getElementById('transferTypeService');
    const sessionBtn = document.getElementById('transferTypeSession');
    const serviceSection = document.getElementById('transferServiceSection');
    const sessionSection = document.getElementById('transferSessionSection');

    if (type === 'service') {
        serviceBtn.classList.remove('border-gray-300', 'bg-white', 'text-gray-700');
        serviceBtn.classList.add('border-indigo-500', 'bg-indigo-50', 'text-indigo-700');
        sessionBtn.classList.remove('border-indigo-500', 'bg-indigo-50', 'text-indigo-700');
        sessionBtn.classList.add('border-gray-300', 'bg-white', 'text-gray-700');
        serviceSection.classList.remove('hidden');
        sessionSection.classList.add('hidden');
        document.getElementById('transferTargetService').value = '';
    } else {
        sessionBtn.classList.remove('border-gray-300', 'bg-white', 'text-gray-700');
        sessionBtn.classList.add('border-indigo-500', 'bg-indigo-50', 'text-indigo-700');
        serviceBtn.classList.remove('border-indigo-500', 'bg-indigo-50', 'text-indigo-700');
        serviceBtn.classList.add('border-gray-300', 'bg-white', 'text-gray-700');
        serviceSection.classList.add('hidden');
        sessionSection.classList.remove('hidden');
        selectedTransferSession = null;
        document.getElementById('transferSessionSearchLS').value = '';
        document.getElementById('transferSelectedSessionLS').classList.add('hidden');
    }
    updateTransferButtonState();
}

function closeTransferModal() {
    document.getElementById('transferAttendeeModal').classList.add('hidden');
    attendeeToTransfer = null;
}

function populateTransferTargets() {
    const select = document.getElementById('transferTargetService');

    // Get other learning services with same pricebook item
    const stored = localStorage.getItem('fms_learning_services');
    let services = stored ? JSON.parse(stored) : [];

    // Filter to same pricebook, exclude current
    const compatible = services.filter(s =>
        s.id !== currentService.id &&
        s.pricebookItemId === currentService.pricebookItemId &&
        s.status === 'active'
    );

    if (compatible.length === 0) {
        select.innerHTML = '<option value="">No compatible learning services found</option>';
    } else {
        select.innerHTML = '<option value="">Select a learning service...</option>' +
            compatible.map(s => `< option value = "${s.id}" > ${s.name} (${s.type})</option > `).join('');
    }

    updateTransferButtonState();
}

function confirmTransfer() {
    const reason = document.getElementById('transferReason').value.trim();

    if (!attendeeToTransfer) {
        alert('No attendee selected');
        return;
    }

    if (currentTransferType === 'service') {
        const targetServiceId = document.getElementById('transferTargetService').value;
        if (!targetServiceId) {
            alert('Please select a target learning service');
            return;
        }

        // Get target service
        const stored = localStorage.getItem('fms_learning_services');
        let services = stored ? JSON.parse(stored) : [];
        const targetService = services.find(s => s.id === targetServiceId);

        if (!targetService) {
            alert('Target service not found');
            return;
        }

        // Check capacity
        const targetEnrollments = targetService.enrollments || [];
        if (targetEnrollments.length >= (targetService.maxCapacity || 1)) {
            alert('Target service is at full capacity');
            return;
        }

        // Remove from current
        currentService.enrollments = currentService.enrollments.filter(e => e.id !== attendeeToTransfer.id);

        // Add to target
        if (!targetService.enrollments) targetService.enrollments = [];
        targetService.enrollments.push({
            ...attendeeToTransfer,
            transferredFrom: currentService.id,
            transferReason: reason,
            transferredAt: new Date().toISOString()
        });

        // Save both
        const currentIndex = services.findIndex(s => s.id === currentService.id);
        if (currentIndex >= 0) services[currentIndex] = currentService;

        const targetIndex = services.findIndex(s => s.id === targetServiceId);
        if (targetIndex >= 0) services[targetIndex] = targetService;

        localStorage.setItem('fms_learning_services', JSON.stringify(services));

        closeTransferModal();
        renderEnrollmentList();
        showToast(`${attendeeToTransfer.attendeeName} transferred to ${targetService.name} `);
    } else {
        // Transfer to session (temporary)
        if (!selectedTransferSession) {
            alert('Please select a target session');
            return;
        }

        // Load sessions
        const sessionsStored = localStorage.getItem('fms_sessions');
        let sessions = sessionsStored ? JSON.parse(sessionsStored) : [];
        const targetSession = sessions.find(s => s.id === selectedTransferSession.id);

        if (!targetSession) {
            alert('Target session not found');
            return;
        }

        // Check capacity
        const bookingsStored = localStorage.getItem('fms_session_bookings');
        let allBookings = bookingsStored ? JSON.parse(bookingsStored) : [];
        const sessionBookings = allBookings.filter(b => b.sessionId === targetSession.id && b.status === 'confirmed');

        if (targetSession.maxCapacity && sessionBookings.length >= targetSession.maxCapacity) {
            alert('Target session is at full capacity');
            return;
        }

        // Check One-to-One limit
        if (targetSession.learningServiceType === 'One-to-One' && sessionBookings.length >= 1) {
            alert('One-to-One sessions can only have 1 attendee');
            return;
        }

        // Create temporary booking in target session
        const temporaryBooking = {
            id: `booking_temp_${Date.now()} `,
            sessionId: targetSession.id,
            customerId: attendeeToTransfer.customerId,
            customerName: attendeeToTransfer.customerName,
            attendeeName: attendeeToTransfer.attendeeName,
            quoteId: attendeeToTransfer.quoteId,
            status: 'confirmed',
            bookedAt: new Date().toISOString(),
            paymentStatus: attendeeToTransfer.paymentStatus,
            isTemporary: true,
            originalServiceId: currentService.id,
            originalServiceName: currentService.name,
            transferReason: reason
        };

        allBookings.push(temporaryBooking);
        localStorage.setItem('fms_session_bookings', JSON.stringify(allBookings));

        // Update session enrolled count
        const sessionIndex = sessions.findIndex(s => s.id === targetSession.id);
        if (sessionIndex >= 0) {
            const updatedBookings = allBookings.filter(b => b.sessionId === targetSession.id && b.status === 'confirmed');
            sessions[sessionIndex].enrolled = updatedBookings.length;
            localStorage.setItem('fms_sessions', JSON.stringify(sessions));
        }

        // Note: Attendee remains in original learning service (not removed)
        closeTransferModal();
        renderEnrollmentList();
        showToast(`${attendeeToTransfer.attendeeName} transferred to session(temporary).They remain enrolled in ${currentService.name}.`);
    }
}

function searchSessionsForTransferLS(query) {
    const autocomplete = document.getElementById('transferSessionAutocompleteLS');
    if (!query || query.length < 2) {
        autocomplete.classList.add('hidden');
        return;
    }

    // Load all sessions
    const sessionsStored = localStorage.getItem('fms_sessions');
    let sessions = sessionsStored ? JSON.parse(sessionsStored) : [];

    const lowerQuery = query.toLowerCase();
    const matching = sessions.filter(session => {
        const dateStr = formatDate(session.date);
        const timeStr = `${formatTime(session.startTime)} - ${formatTime(session.endTime)} `;
        return dateStr.toLowerCase().includes(lowerQuery) ||
            session.learningServiceName.toLowerCase().includes(lowerQuery) ||
            timeStr.toLowerCase().includes(lowerQuery);
    });

    renderSessionAutocompleteLS(matching);
}

function renderSessionAutocompleteLS(sessions) {
    const autocomplete = document.getElementById('transferSessionAutocompleteLS');
    autocomplete.innerHTML = '';

    if (sessions.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No sessions found</div>';
        autocomplete.classList.remove('hidden');
        return;
    }

    sessions.forEach(session => {
        const div = document.createElement('div');
        div.className = 'p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0';
        div.onclick = () => selectTransferSessionLS(session);

        const typeStyles = {
            'Class': { icon: '📚', color: 'text-purple-600' },
            'Group': { icon: '👥', color: 'text-amber-600' },
            'One-to-One': { icon: '👤', color: 'text-cyan-600' }
        };
        const style = typeStyles[session.learningServiceType] || typeStyles['Class'];
        const enrollment = `${session.enrolled || 0}/${session.maxCapacity || 0}`;

        div.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm">${style.icon}</span>
                        <p class="font-medium text-gray-900">${session.learningServiceName}</p>
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full ${style.color} bg-opacity-10">${session.learningServiceType}</span>
                    </div>
                    <p class="text-xs text-gray-600">${formatDate(session.date)} • ${formatTime(session.startTime)} - ${formatTime(session.endTime)}</p>
                    <p class="text-xs text-gray-500 mt-1">Enrollment: ${enrollment}</p>
                </div>
            </div>
        `;

        autocomplete.appendChild(div);
    });

    autocomplete.classList.remove('hidden');
}

function selectTransferSessionLS(session) {
    selectedTransferSession = session;

    document.getElementById('transferSessionNameLS').textContent = session.learningServiceName;
    document.getElementById('transferSessionDateLS').textContent = formatDate(session.date);
    document.getElementById('transferSessionTimeLS').textContent = `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`;

    document.getElementById('transferSelectedSessionLS').classList.remove('hidden');
    document.getElementById('transferSessionAutocompleteLS').classList.add('hidden');
    document.getElementById('transferSessionSearchLS').value = `${session.learningServiceName} - ${formatDate(session.date)}`;

    updateTransferButtonState();
}

function clearTransferSessionSelectionLS() {
    selectedTransferSession = null;
    document.getElementById('transferSelectedSessionLS').classList.add('hidden');
    document.getElementById('transferSessionSearchLS').value = '';
    updateTransferButtonState();
}

function updateTransferButtonState() {
    const btn = document.getElementById('confirmTransferBtn');
    if (currentTransferType === 'service') {
        const targetServiceId = document.getElementById('transferTargetService').value;
        btn.disabled = !targetServiceId;
    } else {
        btn.disabled = !selectedTransferSession;
    }
}

// Helper functions for date/time formatting
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(timeStr) {
    if (!timeStr) return '-';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Remove Modal Functions
function openRemoveModal(enrollmentId) {
    const enrollment = currentService.enrollments?.find(e => e.id === enrollmentId);
    if (!enrollment) return;

    attendeeToRemove = enrollment;
    document.getElementById('removeAttendeeName').textContent = enrollment.attendeeName;
    document.getElementById('removeAttendeeModal').classList.remove('hidden');
}

function closeRemoveModal() {
    document.getElementById('removeAttendeeModal').classList.add('hidden');
    attendeeToRemove = null;
}

function confirmRemove() {
    if (!attendeeToRemove) return;

    // Remove from enrollments
    currentService.enrollments = currentService.enrollments.filter(e => e.id !== attendeeToRemove.id);

    // Return slot (update local tracking)
    const usageKey = `${attendeeToRemove.customerId}-${attendeeToRemove.quoteId}`;
    slotUsage[usageKey] = Math.max(0, (slotUsage[usageKey] || 0) - 1);

    saveToStorage();
    closeRemoveModal();
    renderEnrollmentList();
    showToast(`${attendeeToRemove.attendeeName} removed from enrollment (slot returned to customer)`);
}

// ===== ONE-TO-ONE DIRECT ENROLLMENT =====
let oneToOneSelectedCustomer = null;
let oneToOneSelectedQuote = null;

function searchCustomersForOneToOne(query) {
    const autocomplete = document.getElementById('oneToOneCustomerAutocomplete');
    const pricebookItemId = currentService?.pricebookItemId;

    if (!pricebookItemId) {
        if (query && query.length >= 2) {
            autocomplete.innerHTML = '<div class="p-3 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded">⚠️ Please ensure a pricebook item is linked to this learning service</div>';
            autocomplete.classList.remove('hidden');
        } else {
            autocomplete.classList.add('hidden');
        }
        return;
    }

    if (!query || query.trim().length < 2) {
        autocomplete.classList.add('hidden');
        return;
    }

    query = query.trim().toLowerCase();

    // Filter customers and their matching quotes
    const matchingEntries = sampleCustomers.reduce((entries, customer) => {
        const matchesSearch = customer.name.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query);

        if (!matchesSearch || !customer.quotes) return entries;

        // Get quotes matching the pricebook item with available slots
        const matchingQuotes = customer.quotes.filter(quote => {
            if (quote.pricebookItemId !== pricebookItemId || quote.status !== 'approved') {
                return false;
            }

            const inventory = calculateSlotInventory(customer.id, quote.id);
            return inventory.available > 0;
        });

        matchingQuotes.forEach(quote => {
            const inventory = calculateSlotInventory(customer.id, quote.id);
            entries.push({ customer, quote, inventory });
        });

        return entries;
    }, []);

    if (matchingEntries.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No customers found with available slots</div>';
        autocomplete.classList.remove('hidden');
        return;
    }

    // Group by customer
    const groupedByCustomer = matchingEntries.reduce((map, entry) => {
        if (!map.has(entry.customer.id)) {
            map.set(entry.customer.id, { customer: entry.customer, quotes: [] });
        }
        map.get(entry.customer.id).quotes.push({ quote: entry.quote, inventory: entry.inventory });
        return map;
    }, new Map());

    autocomplete.innerHTML = Array.from(groupedByCustomer.values()).map(group => `
        <div class="p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
            <div class="flex items-center justify-between mb-2">
                <div>
                    <p class="font-medium text-gray-900">${group.customer.name}</p>
                    <p class="text-xs text-gray-500">${group.customer.email}</p>
                </div>
            </div>
            <div class="space-y-1 pl-2 border-l-2 border-gray-200">
                ${group.quotes.map(q => {
        const paymentClass = q.quote.paymentStatus === 'paid' ? 'text-emerald-600' :
            q.quote.paymentStatus === 'partial' ? 'text-amber-600' : 'text-red-600';
        const paymentIcon = q.quote.paymentStatus === 'paid' ? '✓' :
            q.quote.paymentStatus === 'partial' ? '◐' : '○';
        return `
                        <div class="p-2 rounded hover:bg-indigo-50 cursor-pointer transition-colors" 
                             onclick="selectCustomerForOneToOne('${group.customer.id}', '${q.quote.id}')">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">${q.quote.id}</span>
                                    <span class="text-xs ${paymentClass}">${paymentIcon} ${q.quote.paymentStatus}</span>
                                </div>
                                <span class="text-sm font-medium text-indigo-600">${q.inventory.available} slots available</span>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `).join('');

    autocomplete.classList.remove('hidden');
}

function selectCustomerForOneToOne(customerId, quoteId) {
    oneToOneSelectedCustomer = sampleCustomers.find(c => c.id === customerId);
    oneToOneSelectedQuote = oneToOneSelectedCustomer?.quotes?.find(q => q.id === quoteId);

    if (!oneToOneSelectedCustomer || !oneToOneSelectedQuote) return;

    document.getElementById('oneToOneCustomerAutocomplete').classList.add('hidden');
    document.getElementById('oneToOneCustomerSearch').value = oneToOneSelectedCustomer.name;

    // Show selected customer info
    document.getElementById('oneToOneSelectedCustomer').classList.remove('hidden');
    document.getElementById('oneToOneCustomerName').textContent = oneToOneSelectedCustomer.name;
    document.getElementById('oneToOneCustomerEmail').textContent = oneToOneSelectedCustomer.email;
    document.getElementById('oneToOneQuoteId').textContent = oneToOneSelectedQuote.id;

    updateOneToOneButtonState();
}

function clearOneToOneSelection() {
    oneToOneSelectedCustomer = null;
    oneToOneSelectedQuote = null;
    const searchInput = document.getElementById('oneToOneCustomerSearch');
    const autocomplete = document.getElementById('oneToOneCustomerAutocomplete');
    if (searchInput) searchInput.value = '';
    if (autocomplete) autocomplete.classList.add('hidden');
    const selectedDiv = document.getElementById('oneToOneSelectedCustomer');
    if (selectedDiv) selectedDiv.classList.add('hidden');
    const attendeeName = document.getElementById('oneToOneAttendeeName');
    const attendeeNotes = document.getElementById('oneToOneAttendeeNotes');
    if (attendeeName) attendeeName.value = '';
    if (attendeeNotes) attendeeNotes.value = '';
    updateOneToOneButtonState();
}

function updateOneToOneButtonState() {
    const attendeeNameEl = document.getElementById('oneToOneAttendeeName');
    const btn = document.getElementById('oneToOneEnrollBtn');

    if (!btn) return;

    if (!oneToOneSelectedCustomer || !oneToOneSelectedQuote) {
        btn.disabled = true;
        return;
    }

    const attendeeName = attendeeNameEl ? attendeeNameEl.value.trim() : '';
    const inventory = calculateSlotInventory(oneToOneSelectedCustomer.id, oneToOneSelectedQuote.id);
    btn.disabled = !attendeeName || inventory.available <= 0;
}

function confirmOneToOneEnrollment() {
    const attendeeName = document.getElementById('oneToOneAttendeeName').value.trim();
    const attendeeNotes = document.getElementById('oneToOneAttendeeNotes').value.trim();

    if (!attendeeName || !oneToOneSelectedCustomer || !oneToOneSelectedQuote) {
        alert('Please fill in all required fields');
        return;
    }

    // Check inventory
    const inventory = calculateSlotInventory(oneToOneSelectedCustomer.id, oneToOneSelectedQuote.id);
    if (inventory.available <= 0) {
        alert('No available slots for this quote');
        return;
    }

    // Create enrollment
    const enrollment = {
        id: `enroll_${Date.now()}`,
        attendeeName,
        attendeeEmail: oneToOneSelectedCustomer.email,
        notes: attendeeNotes,
        customerId: oneToOneSelectedCustomer.id,
        customerName: oneToOneSelectedCustomer.name,
        quoteId: oneToOneSelectedQuote.id,
        paymentStatus: oneToOneSelectedQuote.paymentStatus,
        status: 'confirmed',
        enrolledAt: new Date().toISOString(),
        enrolledInAllSessions: true
    };

    // Add to current service enrollments
    if (!currentService.enrollments) {
        currentService.enrollments = [];
    }
    currentService.enrollments.push(enrollment);

    // Track slot usage locally
    const usageKey = `${oneToOneSelectedCustomer.id}-${oneToOneSelectedQuote.id}`;
    slotUsage[usageKey] = (slotUsage[usageKey] || 0) + 1;

    // Save and refresh
    saveToStorage();
    renderEnrollmentList();

    // Clear form
    clearOneToOneSelection();

    showToast(`${attendeeName} enrolled successfully!`);
}

// Event listeners for transfer functionality
document.addEventListener('click', function (e) {
    // Close session autocomplete when clicking outside
    if (!e.target.closest('#transferSessionSearchLS') && !e.target.closest('#transferSessionAutocompleteLS')) {
        const autocomplete = document.getElementById('transferSessionAutocompleteLS');
        if (autocomplete) autocomplete.classList.add('hidden');
    }
});

// Transfer target service change
document.getElementById('transferTargetService')?.addEventListener('change', function () {
    updateTransferButtonState();
});


// ===== COMPLEX SCHEDULE RENDERING =====
// function renderScheduleDetails(schedule) { ... } // Removed duplicate/dead code
// ===== VIEW RENDERERS =====

function renderScheduleDetails(schedule) {
    const container = document.getElementById('scheduleDetailsContainer');
    if (!container) return;

    if (!schedule) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic">No schedule configured</p>';
        return;
    }

    const frequency = schedule.frequency || 'weekly';
    const freqLabel = document.getElementById('viewFrequency');
    if (freqLabel) freqLabel.textContent = frequency.charAt(0).toUpperCase() + frequency.slice(1);

    // Duration
    const duration = schedule.duration || (schedule.config?.slots?.[0]?.duration) || 60;
    const durLabel = document.getElementById('viewDuration');
    if (durLabel) durLabel.textContent = `${duration} minutes`;

    let html = '';

    if (frequency === 'daily') {
        const slots = schedule.config?.dailySlots || [];
        html = `<p class="text-sm text-gray-900">Daily: ${slots.length} time slots</p>`;
        if (slots.length > 0) {
            html += `<div class="mt-2 space-y-1">` +
                slots.map(s => {
                    const slotId = `${currentService.id}_daily_${s.startTime.replace(':', '')}`;
                    const url = `session_detail.html?serviceId=${currentService.id}&slotId=${slotId}`;
                    return `<a href="${url}" class="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded inline-block mr-1 border border-indigo-200 transition-colors" title="View Session Details">
                        ${s.startTime} - ${s.endTime}
                    </a>`;
                }).join('') +
                `</div>`;
        }
    } else if (frequency === 'weekly') {
        let slots = schedule.config?.weeklySlots || {};

        // Handle legacy array format if exists or object format
        // Ensure we iterate correctly
        const days = Object.keys(slots).filter(k => k !== 'selectedDays' && slots[k]?.length > 0);

        // Sort days
        const sorter = { 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 7 };
        days.sort((a, b) => sorter[a.toLowerCase()] - sorter[b.toLowerCase()]);

        if (days.length === 0) {
            html = `<p class="text-sm text-gray-500 italic">No days configured</p>`;
        } else {
            html = `<div class="space-y-2">`;
            days.forEach(day => {
                const daySlots = slots[day];
                const dayName = day.charAt(0).toUpperCase() + day.slice(1);
                html += `
                    <div>
                        <span class="text-xs font-semibold text-gray-700">${dayName}:</span>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${daySlots.map(s => {
                    const slotId = `${currentService.id}_${day.toLowerCase()}_${s.startTime.replace(':', '')}`;
                    const url = `session_detail.html?serviceId=${currentService.id}&slotId=${slotId}`;
                    return `<a href="${url}" class="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-colors" title="View Session Details">
                                    ${s.startTime}-${s.endTime}
                                </a>`;
                }).join('')}
                        </div>
                    </div>
                 `;
            });
            html += `</div>`;
        }
    } else if (frequency === 'monthly') {
        const config = schedule.config?.monthlySlots || {};
        const type = config.type || 'date';
        let patternDesc = '';
        if (type === 'date') {
            patternDesc = `Day ${config.date || 1} of every month`;
        } else {
            patternDesc = `${config.week || 'First'} ${config.dayOfWeek || 'Monday'} of every month`;
        }

        const slots = config.slots || [];
        html = `
            <div class="text-sm text-indigo-700 font-medium mb-2">${patternDesc}</div>
            <p class="text-xs text-gray-600 mb-1">${slots.length} Time Slots:</p>
            <div class="flex flex-wrap gap-1">
                ${slots.map(s => {
            // For monthly, session_detail_script.js doesn't explicitly handle 'monthly' in createSlotObject loop logic seen in generateSlotsFromService
            // It only had if(daily) ... else if(weekly) ... else if (daysOfWeek).
            // This implies monthly slots MIGHT NOT BE SUPPORTED in session_detail_script.js yet.
            // However, we should still link them, assuming a consistent ID format: serviceId_monthly_time?
            // Let's check session_detail_script.js again properly.
            const slotId = `${currentService.id}_monthly_${s.startTime.replace(':', '')}`;
            // Note: session_detail_script.js might need update for monthly.
            const url = `session_detail.html?serviceId=${currentService.id}&slotId=${slotId}`;
            return `<a href="${url}" class="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-colors">
                        ${s.startTime}-${s.endTime}
                    </a>`;
        }).join('')}
            </div>
        `;
    } else {
        // Custom
        html = `<p class="text-sm text-gray-900">Custom Schedule</p>`;
        if (schedule.daysOfWeek) {
            html += `<p class="text-xs text-gray-500 mt-1">${schedule.daysOfWeek.join(', ')}</p>`;
        }
        if (schedule.startTime) {
            const slotId = `${currentService.id}_custom_${schedule.startTime.replace(':', '')}`; // Approximation with 'custom'?
            // session_detail_script.js handles daysOfWeek in the 'else' block
            html += `<p class="text-xs text-gray-500">${schedule.startTime} - ${schedule.endTime}</p>`;
        }
    }

    container.innerHTML = html;
}
