/**
 * Session Slot Instance Script
 * Manages specific session slot instances with past/upcoming distinction
 * and override capabilities for staff and enrollment
 */

// ===== STATE MANAGEMENT =====
let currentSlotInstance = null;
let currentSession = null;
let allSessions = [];
let currentTab = 'overview';
let availableStaff = []; // All staff in the system

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadData();
    loadAvailableStaff();
});

// ===== DATA LOADING =====
function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const slotId = urlParams.get('slotId') || urlParams.get('sessionId'); // Support both names
    const serviceId = urlParams.get('serviceId');
    const date = urlParams.get('date');
    const startTime = urlParams.get('startTime');

    console.log('URL params:', { slotId, serviceId, date, startTime });

    if (!slotId || !serviceId || !date || !startTime) {
        alert('Missing required parameters');
        window.location.href = 'session_list.html';
        return;
    }

    // Load services from localStorage
    const storedServices = localStorage.getItem('fms_learning_services');
    if (storedServices) {
        allSessions = JSON.parse(storedServices);
    }

    console.log('All services:', allSessions);

    // Find the service (Learning Service)
    const service = allSessions.find(s => s.id === serviceId);
    if (!service) {
        console.error('Service not found. ServiceId:', serviceId);
        console.log('Available services:', allSessions);
        alert('Service not found');
        window.location.href = 'session_list.html';
        return;
    }

    // Find the slot within the service's schedule
    currentSession = findSlotInService(service, slotId);
    if (!currentSession) {
        console.error('Slot not found. SlotId:', slotId);
        console.log('Service schedule:', service.schedule);
        alert('Slot not found in service schedule');
        window.location.href = 'session_list.html';
        return;
    }

    // Store the service ID for navigation
    currentSession.serviceId = serviceId;

    console.log('Loaded slot (recurrence session):', currentSession);

    // Load or create slot instance
    currentSlotInstance = loadSlotInstance(null, slotId, date, startTime);

    console.log('Loaded slot instance:', currentSlotInstance);

    renderSlotInstance();
}

function findSlotInService(service, slotId) {
    // Use the same generation logic as session_detail_script.js
    const generated = generateSlotsFromService(service);
    return generated.find(s => s.id === slotId);
}

function generateSlotsFromService(service) {
    let slots = [];
    if (!service.schedule) return slots;

    if (service.schedule.config) {
        const config = service.schedule.config;
        if (service.schedule.frequency === 'daily' && config.dailySlots) {
            config.dailySlots.forEach(slot => {
                slots.push(createSlotObject(service, 'Daily', slot.startTime, slot.endTime, slot.duration));
            });
        }
        else if (service.schedule.frequency === 'weekly' && config.weeklySlots) {
            Object.keys(config.weeklySlots).forEach(day => {
                if (day === 'selectedDays') return;
                const daySlots = config.weeklySlots[day];
                daySlots.forEach(slot => {
                    slots.push(createSlotObject(service, capitalize(day), slot.startTime, slot.endTime, slot.duration));
                });
            });
        }
        else if (service.schedule.frequency === 'monthly' && config.monthlySlots) {
            config.monthlySlots.slots.forEach(slot => {
                slots.push(createSlotObject(service, 'Monthly', slot.startTime, slot.endTime, slot.duration));
            });
        }
    } else if (service.schedule.daysOfWeek) {
        service.schedule.daysOfWeek.forEach(day => {
            slots.push(createSlotObject(
                service,
                day,
                service.schedule.startTime,
                service.schedule.endTime,
                service.schedule.duration
            ));
        });
    }
    return slots;
}

function createSlotObject(service, day, startTime, endTime, duration) {
    const id = `${service.id}_${day.toLowerCase()}_${startTime.replace(':', '')}`;
    return {
        id: id,
        day: day,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        name: `${service.name} - ${day} ${startTime}`,
        type: service.type,
        staff: service.staff || [],
        enrollments: service.enrollments || [],
        maxCapacity: service.maxCapacity,
        serviceId: service.id
    };
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function loadSlotInstance(instanceId, sessionId, date, startTime) {
    // Try to load from localStorage
    const storedInstances = localStorage.getItem('fms_slot_instances');
    let instances = storedInstances ? JSON.parse(storedInstances) : [];

    // Find existing instance or create new one
    let instance = instances.find(i =>
        i.sessionId === sessionId &&
        i.date === date &&
        i.startTime === startTime
    );

    if (!instance) {
        // Create new instance
        instance = {
            id: `slot_instance_${sessionId}_${date}_${startTime.replace(':', '')}`,
            sessionId: sessionId,
            date: date,
            startTime: startTime,
            endTime: calculateEndTime(startTime, currentSession.duration || 60),
            duration: currentSession.duration || 60,

            // Override flags
            staffOverride: { isActive: false },
            enrollmentOverride: { isActive: false },

            // Notes
            notes: [],

            // Metadata
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        instances.push(instance);
        localStorage.setItem('fms_slot_instances', JSON.stringify(instances));
    }

    return instance;
}

function calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

function loadAvailableStaff() {
    // Mock staff data - in real app, load from API/localStorage
    availableStaff = [
        { id: 'staff_001', name: 'Dr. Sarah Smith', role: 'Lead Instructor' },
        { id: 'staff_002', name: 'Dr. Michael Chen', role: 'Lead Instructor' },
        { id: 'staff_003', name: 'John Doe', role: 'Assistant' },
        { id: 'staff_004', name: 'Jane Wilson', role: 'Assistant' },
        { id: 'staff_005', name: 'Prof. David Lee', role: 'Lead Instructor' }
    ];
}

// ===== TIME-BASED LOGIC =====
function isSlotPast(date, startTime) {
    const now = new Date();
    const slotDateTime = new Date(`${date}T${startTime}`);
    return slotDateTime < now;
}

function getTimeStatus(date, startTime) {
    const isPast = isSlotPast(date, startTime);

    return {
        isPast: isPast,
        badge: isPast ? 'Past' : 'Upcoming',
        badgeClass: isPast
            ? 'bg-gray-200 text-gray-700'
            : 'bg-blue-100 text-blue-700',
        icon: isPast ? '✓' : '📅',
        cardClass: isPast ? 'past-session-card' : 'upcoming-session-card'
    };
}

// ===== RENDERING =====
function renderSlotInstance() {
    const timeStatus = getTimeStatus(currentSlotInstance.date, currentSlotInstance.startTime);

    // Update header
    document.getElementById('slotTitle').textContent = `${currentSession.name} - ${formatDateLong(currentSlotInstance.date)}`;
    document.getElementById('slotSubtitle').textContent = `${formatDateFull(currentSlotInstance.date)} • ${formatTime(currentSlotInstance.startTime)} - ${formatTime(currentSlotInstance.endTime)}`;

    // Time badge
    const timeBadge = document.getElementById('timeBadge');
    timeBadge.textContent = timeStatus.badge;
    timeBadge.className = `px-3 py-1 text-xs font-medium rounded-full ${timeStatus.badgeClass}`;

    // Type badge
    updateTypeBadge(currentSession.type || 'Class');

    // Session link
    document.getElementById('sessionLink').textContent = currentSession.name || 'View Recurrence Session';

    // Action buttons
    renderActionButtons(timeStatus.isPast);

    // Apply card styling
    const detailsCard = document.getElementById('instanceDetailsCard');
    detailsCard.className = `rounded-lg shadow-sm p-4 ${timeStatus.cardClass}`;

    // Render all sections (no tabs)
    renderOverview();
    renderAttendance(timeStatus.isPast);
    renderStaff(timeStatus.isPast);
    renderNotes();
    renderSidebar();
}

function renderActionButtons(isPast) {
    const container = document.getElementById('actionButtons');

    if (isPast) {
        // Past session - limited actions
        container.innerHTML = `
            <button onclick="exportReport()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                <i class="fas fa-download mr-2"></i>Export Report
            </button>
        `;
    } else {
        // Future session - full actions
        container.innerHTML = `
            <button onclick="sendReminder()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                <i class="fas fa-bell mr-2"></i>Send Reminder
            </button>
            <button onclick="cancelSlot()" class="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium">
                <i class="fas fa-times mr-2"></i>Cancel Slot
            </button>
        `;
    }
}

function renderOverview() {
    document.getElementById('viewDate').textContent = formatDateFull(currentSlotInstance.date);
    document.getElementById('viewTime').textContent = `${formatTime(currentSlotInstance.startTime)} - ${formatTime(currentSlotInstance.endTime)}`;
    document.getElementById('viewDuration').textContent = `${currentSlotInstance.duration} minutes`;

    // Link to recurrence session
    const viewSession = document.getElementById('viewSession');
    viewSession.textContent = currentSession.name || 'View Session';
    viewSession.href = `session_detail.html?slotId=${currentSlotInstance.sessionId}&serviceId=${currentSession.serviceId || currentSession.id}`;
}

function renderAttendance(isPast) {
    const effectiveEnrollment = getEffectiveEnrollment();
    const container = document.getElementById('attendanceList');
    const emptyState = document.getElementById('emptyAttendance');
    const actionsDiv = document.getElementById('attendanceActions');

    // Show/hide override indicator
    const overrideIndicator = document.getElementById('enrollmentOverrideIndicator');

    if (overrideIndicator) {
        if (currentSlotInstance.enrollmentOverride?.isActive) {
            overrideIndicator.classList.remove('hidden');
        } else {
            overrideIndicator.classList.add('hidden');
        }
    }

    if (effectiveEnrollment.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        container.innerHTML = effectiveEnrollment.map(student => {
            const isExcluded = currentSlotInstance.enrollmentOverride?.excludedStudents?.some(
                ex => ex.enrollmentId === student.id
            );
            const isAdded = currentSlotInstance.enrollmentOverride?.addedStudents?.some(
                add => add.id === student.id
            );

            return `
                <div class="p-4 border border-gray-200 rounded-lg ${isExcluded ? 'bg-gray-50 opacity-60' : 'bg-white'}">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span class="text-lg">👤</span>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">${student.attendeeName || student.studentName}</h4>
                                <p class="text-sm text-gray-600">${student.customerName || 'Customer'}</p>
                                ${isAdded ? '<p class="text-xs text-blue-600 mt-1 flex items-center gap-1"><i class="fas fa-exchange-alt"></i> Temporary Transfer</p>' : ''}
                                ${isExcluded ? '<p class="text-xs text-gray-500 mt-1">⊘ Excluded from this slot</p>' : ''}
                            </div>
                        </div>
                        <div class="flex flex-col items-end gap-1">
                            <span class="px-2 py-1 text-xs font-medium rounded-full ${isExcluded ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}">
                                ${isExcluded ? 'Excluded' : 'Attending'}
                            </span>
                             ${isAdded ? '<span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Temporary</span>' : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Show actions only for future sessions
    if (!isPast) {
        actionsDiv.classList.remove('hidden');
    } else {
        actionsDiv.classList.add('hidden');
    }
}

function renderStaff(isPast) {
    const effectiveStaff = getEffectiveStaff();
    const container = document.getElementById('staffList');
    const emptyState = document.getElementById('emptyStaff');
    const actionsDiv = document.getElementById('staffActions');

    // Show/hide override indicator
    const overrideIndicator = document.getElementById('staffOverrideIndicator');

    if (overrideIndicator) {
        if (currentSlotInstance.staffOverride?.isActive) {
            overrideIndicator.classList.remove('hidden');
        } else {
            overrideIndicator.classList.add('hidden');
        }
    }

    if (effectiveStaff.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        container.innerHTML = effectiveStaff.map(staff => {
            const isSubstitute = staff.isSubstitute || false;
            const isDefault = staff.isDefault || false;

            return `
                <div class="p-4 border ${isSubstitute ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'} rounded-lg">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span class="text-lg">👤</span>
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h4 class="font-semibold text-gray-900">${staff.name}</h4>
                                    ${isSubstitute ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Substitute</span>' : ''}
                                    ${isDefault ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Default</span>' : ''}
                                </div>
                                <p class="text-sm text-gray-600">${staff.role}</p>
                                ${staff.replacing ? `<p class="text-xs text-amber-600 mt-1">ℹ️ Replacing: ${getStaffName(staff.replacing)}</p>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Show actions only for future sessions
    if (!isPast) {
        actionsDiv.classList.remove('hidden');
    } else {
        actionsDiv.classList.add('hidden');
    }
}

function renderNotes() {
    const container = document.getElementById('notesList');
    const emptyState = document.getElementById('emptyNotes');
    const notes = currentSlotInstance.notes || [];

    if (notes.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        container.innerHTML = notes.map(note => `
            <div class="p-4 border border-gray-200 rounded-lg bg-white">
                <div class="flex items-start justify-between mb-2">
                    <span class="text-xs text-gray-500">${formatDateTime(note.createdAt)}</span>
                    <button onclick="deleteNote('${note.id}')" class="text-xs text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p class="text-sm text-gray-900">${note.content}</p>
                ${note.author ? `<p class="text-xs text-gray-500 mt-2">By: ${note.author}</p>` : ''}
            </div>
        `).join('');
    }
}

function renderSidebar() {
    document.getElementById('sidebarSessionName').textContent = currentSession.name;

    const typeBadge = document.getElementById('sidebarTypeBadge');
    const styles = getTypeStyles(currentSession.type || 'Class');
    typeBadge.textContent = currentSession.type || 'Class';
    typeBadge.className = `px-2 py-0.5 text-xs font-medium rounded-full ${styles.badgeClass}`;

    // Format schedule text
    const scheduleText = currentSession.day === 'Daily'
        ? 'Daily'
        : `Weekly (${currentSession.day || 'Not set'}) - ${formatTime(currentSession.startTime)} to ${formatTime(currentSession.endTime)}`;
    document.getElementById('sidebarSchedule').textContent = scheduleText;

    const defaultStaff = currentSession.staff || [];
    document.getElementById('sidebarDefaultStaff').textContent = defaultStaff.length > 0
        ? defaultStaff.map(s => s.name).join(', ')
        : 'None';
}

// ===== HELPER FUNCTIONS =====
function getEffectiveStaff() {
    console.log('Getting effective staff...');
    console.log('currentSession.staff:', currentSession.staff);
    console.log('currentSlotInstance.staffOverride:', currentSlotInstance.staffOverride);

    // If there's an override, return the override staff
    if (currentSlotInstance.staffOverride?.isActive && currentSlotInstance.staffOverride?.staff) {
        return currentSlotInstance.staffOverride.staff.map(s => ({ ...s, isSubstitute: true }));
    }

    // Otherwise return default staff from the session
    return (currentSession.staff || []).map(s => ({ ...s, isDefault: true }));
}

function getEffectiveEnrollment() {
    console.log('Getting effective enrollment...');
    console.log('currentSession:', currentSession);
    console.log('currentSession.enrollments:', currentSession.enrollments);
    console.log('currentSlotInstance.enrollmentOverride:', currentSlotInstance.enrollmentOverride);

    // If there's an override, return the customized list
    if (currentSlotInstance.enrollmentOverride?.isActive) {
        const excluded = currentSlotInstance.enrollmentOverride.excludedStudents || [];
        return (currentSession.enrollments || []).filter(student =>
            !excluded.includes(student.id)
        );
    }

    // Otherwise return default enrollment from the session
    return currentSession.enrollments || [];
}

function getStaffName(staffId) {
    const staff = availableStaff.find(s => s.id === staffId) ||
        currentSession.staff?.find(s => s.id === staffId);
    return staff ? staff.name : 'Unknown';
}

function updateTypeBadge(type) {
    const badge = document.getElementById('typeBadge');
    const styles = getTypeStyles(type);
    badge.textContent = `${styles.icon} ${type}`;
    badge.className = `px-2 py-0.5 text-xs font-medium rounded-full ${styles.badgeClass}`;
}

function getTypeStyles(type) {
    const styles = {
        'Class': { badgeClass: 'type-badge-class', icon: '📚' },
        'Group': { badgeClass: 'type-badge-group', icon: '👥' },
        'One-to-One': { badgeClass: 'type-badge-one-to-one', icon: '👤' }
    };
    return styles[type] || styles['Class'];
}

// ===== STAFF OVERRIDE =====
function openStaffOverrideModal() {
    const modal = document.getElementById('staffOverrideModal');
    const defaultStaff = currentSession.staff || [];

    // Update modal content
    document.getElementById('modalSlotDate').textContent = formatDateFull(currentSlotInstance.date);

    const defaultStaffList = document.getElementById('modalDefaultStaffList');
    if (defaultStaff.length > 0) {
        defaultStaffList.innerHTML = defaultStaff.map(s => `• ${s.name} (${s.role})`).join('<br>');
    } else {
        defaultStaffList.innerHTML = '<span class="text-gray-500">No default staff</span>';
    }

    // Render staff selection
    const selectionList = document.getElementById('staffSelectionList');
    selectionList.innerHTML = availableStaff.map(staff => `
        <div class="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
            <input type="checkbox" id="staff_${staff.id}" value="${staff.id}" 
                class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500">
            <label for="staff_${staff.id}" class="flex-1 text-sm cursor-pointer">
                ${staff.name} - ${staff.role}
            </label>
        </div>
    `).join('');

    modal.classList.add('active');
}

function closeStaffOverrideModal() {
    document.getElementById('staffOverrideModal').classList.remove('active');
}

function applyStaffOverride() {
    const selectedStaffIds = Array.from(document.querySelectorAll('#staffSelectionList input:checked'))
        .map(cb => cb.value);

    if (selectedStaffIds.length === 0) {
        alert('Please select at least one staff member');
        return;
    }

    const reason = document.getElementById('staffOverrideReason').value;
    const selectedStaff = selectedStaffIds.map(id => {
        const staff = availableStaff.find(s => s.id === id);
        const defaultStaff = currentSession.staff?.find(s => s.role === staff.role);

        return {
            staffId: id,
            name: staff.name,
            role: staff.role,
            isSubstitute: defaultStaff && defaultStaff.id !== id,
            replacing: defaultStaff ? defaultStaff.id : null,
            isDefault: defaultStaff && defaultStaff.id === id
        };
    });

    currentSlotInstance.staffOverride = {
        isActive: true,
        reason: reason,
        staff: selectedStaff,
        overriddenAt: new Date().toISOString()
    };

    saveSlotInstance();
    renderStaff(false);
    closeStaffOverrideModal();
    showNotification('success', 'Staff override applied');
}

function revertStaffOverride() {
    currentSlotInstance.staffOverride = { isActive: false };
    saveSlotInstance();
    renderStaff(false);
    showNotification('success', 'Reverted to default staff');
}

// ===== ENROLLMENT OVERRIDE =====
function openEnrollmentOverrideModal() {
    const modal = document.getElementById('enrollmentOverrideModal');
    const defaultEnrollment = currentSession.enrollments || [];

    document.getElementById('modalEnrollmentSlotDate').textContent = formatDateFull(currentSlotInstance.date);

    const checkboxList = document.getElementById('enrollmentCheckboxList');
    checkboxList.innerHTML = defaultEnrollment.map(student => {
        const isExcluded = currentSlotInstance.enrollmentOverride?.excludedStudents?.some(
            ex => ex.enrollmentId === student.id
        );

        return `
            <div class="flex items-start gap-2 p-2 border border-gray-200 rounded-lg">
                <input type="checkbox" id="enroll_${student.id}" value="${student.id}" 
                    ${!isExcluded ? 'checked' : ''}
                    onchange="updateEnrollmentSummary()"
                    class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 mt-1">
                <div class="flex-1">
                    <label for="enroll_${student.id}" class="text-sm font-medium cursor-pointer">
                        ${student.attendeeName}
                    </label>
                    <p class="text-xs text-gray-500">${student.customerName}</p>
                </div>
            </div>
        `;
    }).join('');

    updateEnrollmentSummary();
    modal.classList.add('active');
}

function closeEnrollmentOverrideModal() {
    document.getElementById('enrollmentOverrideModal').classList.remove('active');
}

function updateEnrollmentSummary() {
    const checkboxes = document.querySelectorAll('#enrollmentCheckboxList input[type="checkbox"]');
    const attendingCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const totalCount = checkboxes.length;
    const excludedCount = totalCount - attendingCount;

    document.getElementById('enrollmentSummary').textContent =
        `Summary: ${attendingCount} attending (${excludedCount} excluded)`;
}

function applyEnrollmentOverride() {
    const defaultEnrollment = currentSession.enrollments || [];
    const selectedIds = Array.from(document.querySelectorAll('#enrollmentCheckboxList input:checked'))
        .map(cb => cb.value);

    const excludedStudents = defaultEnrollment
        .filter(student => !selectedIds.includes(student.id))
        .map(student => ({
            enrollmentId: student.id,
            studentName: student.attendeeName,
            excludedAt: new Date().toISOString()
        }));

    currentSlotInstance.enrollmentOverride = {
        isActive: excludedStudents.length > 0,
        excludedStudents: excludedStudents,
        addedStudents: [], // Can be extended later
        expectedCount: defaultEnrollment.length,
        actualCount: selectedIds.length
    };

    saveSlotInstance();
    renderAttendance(false);
    renderOverview();
    closeEnrollmentOverrideModal();
    showNotification('success', 'Enrollment override applied');
}

function revertEnrollmentOverride() {
    currentSlotInstance.enrollmentOverride = { isActive: false };
    saveSlotInstance();
    renderAttendance(false);
    renderOverview();
    showNotification('success', 'Reverted to default enrollment');
}

// ===== NOTES =====
function addNote() {
    const content = document.getElementById('newNoteContent').value.trim();
    if (!content) return;

    const note = {
        id: `note_${Date.now()}`,
        content: content,
        author: 'Current User', // Replace with actual user
        createdAt: new Date().toISOString()
    };

    if (!currentSlotInstance.notes) {
        currentSlotInstance.notes = [];
    }
    currentSlotInstance.notes.push(note);

    saveSlotInstance();
    document.getElementById('newNoteContent').value = '';
    renderNotes();
    showNotification('success', 'Note added');
}

function deleteNote(noteId) {
    if (!confirm('Delete this note?')) return;

    currentSlotInstance.notes = currentSlotInstance.notes.filter(n => n.id !== noteId);
    saveSlotInstance();
    renderNotes();
    showNotification('success', 'Note deleted');
}

// ===== PERSISTENCE =====
function saveSlotInstance() {
    const storedInstances = localStorage.getItem('fms_slot_instances');
    let instances = storedInstances ? JSON.parse(storedInstances) : [];

    const index = instances.findIndex(i => i.id === currentSlotInstance.id);
    currentSlotInstance.updatedAt = new Date().toISOString();

    if (index >= 0) {
        instances[index] = currentSlotInstance;
    } else {
        instances.push(currentSlotInstance);
    }

    localStorage.setItem('fms_slot_instances', JSON.stringify(instances));
}

// ===== NAVIGATION =====
function goBack() {
    window.history.back();
}

function viewSession(event) {
    if (event) event.preventDefault();
    // Navigate to the recurrence session (session_detail.html)
    const slotId = currentSession.id || currentSlotInstance.sessionId;
    const serviceId = currentSession.serviceId || currentSession.id;
    window.location.href = `session_detail.html?slotId=${slotId}&serviceId=${serviceId}`;
}

function viewAllSlots() {
    window.location.href = `session_list.html`;
}

// ===== ACTIONS =====
function sendReminder() {
    showNotification('success', 'Reminder sent to all attendees');
}

function cancelSlot() {
    if (!confirm('Cancel this slot? This cannot be undone.')) return;
    showNotification('success', 'Slot cancelled');
    // Implement cancellation logic
}

function exportReport() {
    showNotification('info', 'Exporting report...');
    // Implement export logic
}

// ===== FORMATTING HELPERS =====
function formatTime(timeStr) {
    if (!timeStr) return '-';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
}

function formatDateLong(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatDateFull(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

// ===== NOTIFICATIONS =====
function showNotification(type, message) {
    // Simple alert for now - can be replaced with toast notifications
    alert(message);
}
