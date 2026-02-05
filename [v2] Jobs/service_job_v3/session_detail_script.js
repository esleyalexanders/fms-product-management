/**
 * Session Detail Script (Refactored for Slot Pattern View)
 * Display details for a specific Configured Slot Pattern
 */

// ===== STATE MANAGEMENT =====
let currentSlot = null;
let currentService = null;
let allLearningServices = [];
let currentTab = 'overview';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadData();
});

// ===== DATA LOADING =====
function loadData() {
    const urlParams = new URLSearchParams(window.location.search);
    const slotId = urlParams.get('slotId');
    const serviceId = urlParams.get('serviceId');

    if (!slotId || !serviceId) {
        alert('Missing Slot or Service ID');
        window.location.href = 'session_list.html';
        return;
    }

    const storedServices = localStorage.getItem('fms_learning_services');
    if (storedServices) {
        allLearningServices = JSON.parse(storedServices);
    }

    currentService = allLearningServices.find(s => s.id === serviceId);

    if (!currentService) {
        alert('Learning Service not found');
        window.location.href = 'session_list.html';
        return;
    }

    // Re-construct the slot object from the service config using the ID parts
    currentSlot = findSlotInService(currentService, slotId);

    if (!currentSlot) {
        alert('Slot not found in Service Schedule');
        window.location.href = 'session_list.html';
        return;
    }

    renderSlotDetails();
}

function findSlotInService(service, slotId) {
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
                if (day === 'selectedDays') return; // Skip non-schedule key
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
    const slotId = `${service.id}_${day.toLowerCase()}_${startTime.replace(':', '')}`;
    return {
        id: slotId,
        serviceId: service.id,
        serviceName: service.name,
        serviceType: service.type,
        day: day,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        capacity: service.maxCapacity
    };
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===== RENDERING =====
function renderSlotDetails() {
    // Header
    document.getElementById('sessionTitle').textContent = `${currentService.name} - ${currentSlot.day} Session`;
    const idBadge = document.getElementById('sessionIdBadge');
    idBadge.textContent = 'SUBSCRIPTION';
    idBadge.className = 'px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium';

    // Type Badge
    updateTypeBadge(currentService.type);
    updateTabVisibility(currentService.type);

    // Status Badge
    const statusBadge = document.getElementById('sessionStatusBadge');
    statusBadge.textContent = 'Active Subscription';
    statusBadge.className = 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700';

    // Link
    const lsLink = document.getElementById('sessionLink');
    if (lsLink) lsLink.textContent = currentService.name;

    // Slot Info (Overview Tab)
    setText('viewDate', `Weekly on ${currentSlot.day}`);
    setText('viewTime', `${formatTime(currentSlot.startTime)} - ${formatTime(currentSlot.endTime)}`);
    setText('viewDuration', `${currentSlot.duration} minutes`);
    setText('viewStatus', 'Recurring');
    setText('viewSession', currentService.name);

    // Hide Edit Mode inputs/buttons
    document.querySelectorAll('.edit-only').forEach(el => el.classList.add('hidden'));

    // Capacity (Enrollment Tab)
    const cap = currentSlot.capacity ? `${currentSlot.capacity} Students` : 'Unlimited';
    setText('capacityDisplay', cap);
    setText('capacityInfo', 'Max enrollment per instance');

    // Sidebar Info
    setText('sidebarSessionName', currentService.name);
    setText('sidebarTypeBadge', currentService.type);
    document.getElementById('sidebarTypeBadge').className = `px-2 py-0.5 text-xs font-medium rounded-full ${getTypeStyles(currentService.type).badgeClass}`;
    setText('sidebarSchedule', `${currentService.schedule.frequency === 'daily' ? 'Daily' : 'Weekly'} (${currentService.sessionsCount || 0} sessions)`);
    setText('sidebarCapacity', `${currentService.totalEnrolled || 0} / ${currentService.maxCapacity || '-'}`);
    setText('sidebarStaff', currentService.staff?.length > 0 ? `${currentService.staff.length} staff` : 'None');


    // Staff (Staff Tab)
    renderStaff();

    // Enrollment (Enrollment Tab)
    renderEnrollmentList();

    // Sessions (Sessions Tab)
    renderSessionInstances();
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function updateTypeBadge(type) {
    const badge = document.getElementById('sessionTypeBadge');
    if (!badge) return;

    if (type === 'Class') {
        badge.textContent = '📚 Class';
        badge.className = 'px-2 py-1 text-xs font-medium rounded-full type-badge-class';
    } else if (type === 'Group') {
        badge.textContent = '👥 Group';
        badge.className = 'px-2 py-1 text-xs font-medium rounded-full type-badge-group';
    } else {
        badge.textContent = '👤 One-to-One';
        badge.className = 'px-2 py-1 text-xs font-medium rounded-full type-badge-one-to-one';
    }
}

function updateTabVisibility(type) {
    const enrollmentTab = document.getElementById('enrollmentTab');
    if (!enrollmentTab) return;

    // Hide Enrollment tab for Class type as they don't have pattern-specific enrollments in this view
    if (type === 'Class') {
        enrollmentTab.classList.add('hidden');
    } else {
        enrollmentTab.classList.remove('hidden');
    }
}

function getTypeStyles(type) {
    const styles = {
        'Class': { badgeClass: 'type-badge-class', icon: '📚' },
        'Group': { badgeClass: 'type-badge-group', icon: '👥' },
        'One-to-One': { badgeClass: 'type-badge-one-to-one', icon: '👤' }
    };
    return styles[type] || styles['Class'];
}

function renderStaff() {
    // Show default staff from Service
    const container = document.getElementById('defaultStaffList');
    if (!container) return;

    console.log('=== renderStaff DEBUG ===');
    console.log('currentService:', currentService);
    console.log('currentService.staff:', currentService.staff);

    container.innerHTML = '';

    if (currentService.staff && currentService.staff.length > 0) {
        currentService.staff.forEach(staff => {
            const badge = document.createElement('div');
            badge.className = 'inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-sm';
            badge.innerHTML = `
                <span class="font-medium text-indigo-900">${staff.name}</span>
                <span class="text-indigo-600">${staff.role}</span>
            `;
            container.appendChild(badge);
        });
        document.getElementById('defaultStaffSection').classList.remove('hidden');
    } else {
        console.warn('No staff found on currentService');
        container.innerHTML = '<span class="text-gray-500 text-sm">No default staff assigned</span>';
    }

    // Hide override section
    document.getElementById('overrideStaffSection').classList.add('hidden');
}

function formatTime(timeStr) {
    if (!timeStr) return '-';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
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

// ===== SESSION INSTANCES =====
function renderSessionInstances() {
    const list = document.getElementById('sessionsList');
    const empty = document.getElementById('emptySessions');

    // Generate instances based on schedule
    const instances = generateSlotInstances();

    console.log('Generated instances:', instances); // Debug logging

    if (instances.length === 0) {
        list.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    list.innerHTML = instances.map((session, index) => {
        const dateStr = session.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const month = session.date.toLocaleDateString('en-US', { month: 'short' });
        const dayNum = session.date.getDate();

        // Check if slot is past or upcoming
        const now = new Date();
        const slotDateTime = new Date(session.date);
        slotDateTime.setHours(parseInt(session.startTime.split(':')[0]), parseInt(session.startTime.split(':')[1]));
        const isPast = slotDateTime < now;

        // Format date for URL
        const dateForUrl = session.date.toISOString().split('T')[0];

        // Build URL to session slot instance - pass both slotId and serviceId
        const instanceUrl = `session_slot_instance.html?slotId=${currentSlot.id}&serviceId=${currentService.id}&date=${dateForUrl}&startTime=${session.startTime}`;

        // Styling based on past/upcoming
        const cardClass = isPast
            ? 'bg-gray-50 border-gray-200 opacity-75'
            : 'bg-white border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50';
        const badgeClass = isPast
            ? 'bg-gray-200 text-gray-600'
            : 'bg-blue-100 text-blue-700';
        const badgeText = isPast ? '✓ Past' : '📅 Upcoming';
        const textClass = isPast ? 'text-gray-600' : 'text-gray-900';
        const subtextClass = isPast ? 'text-gray-400' : 'text-gray-500';

        return `
        <a href="${instanceUrl}" class="block">
            <div class="flex items-center justify-between p-3 ${cardClass} rounded-lg border transition-all cursor-pointer">
                <div class="flex items-center gap-4">
                    <div class="text-center min-w-16 ${isPast ? 'opacity-60' : ''}">
                        <p class="text-lg font-bold ${textClass}">${dayNum}</p>
                        <p class="text-xs ${subtextClass}">${month}</p>
                    </div>
                    <div class="border-l border-gray-300 pl-4">
                        <p class="font-medium ${textClass}">${formatTime(session.startTime)} - ${formatTime(session.endTime)}</p>
                        <p class="text-sm ${subtextClass}">Staff: ${session.staff} • Duration: ${currentSlot.duration} min</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <p class="text-sm font-medium ${textClass}">${session.enrolled}/${session.capacity}</p>
                        <p class="text-xs ${subtextClass}">${isPast ? 'Attended' : 'Enrolled'}</p>
                    </div>
                    <span class="px-2 py-0.5 text-xs font-medium rounded-full ${badgeClass}">${badgeText}</span>
                    <svg class="w-5 h-5 ${subtextClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </div>
        </a>
        `;
    }).join('');
}

function generateSlotInstances() {
    const instances = [];
    const daysMap = { 'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6 };

    let date = new Date();

    // Handle 'Daily' case
    if (currentSlot.day === 'Daily') {
        // Generate next 10 days
        for (let i = 0; i < 10; i++) {
            instances.push({
                date: new Date(date),
                startTime: currentSlot.startTime,
                endTime: currentSlot.endTime,
                enrolled: currentService.totalEnrolled || 0,
                capacity: currentService.maxCapacity || 20,
                staff: currentService.staff?.[0]?.name || 'Staff'
            });
            date.setDate(date.getDate() + 1);
        }
    } else if (currentSlot.day === 'Monthly') {
        // Handle Monthly case
        const config = currentService.schedule?.config?.monthlySlots || { type: 'date', date: 1 };

        // Generate next 6 occurrences
        // Start from current month
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();

        for (let i = 0; i < 6; i++) {
            let instanceDate = new Date(currentYear, currentMonth + i, 1);

            if (config.type === 'date') {
                // Fixed date (e.g., 15th)
                instanceDate.setDate(config.date || 1);
            } else {
                // Relative day (e.g., First Monday)
                const targetDay = daysMap[(config.dayOfWeek || 'monday').toLowerCase()];
                const weekMap = { 'first': 0, 'second': 1, 'third': 2, 'fourth': 3, 'last': 4 }; // Simplified 'last'
                const weekOffset = weekMap[config.week || 'first'] || 0;

                // Find first occurrence of day in month
                while (instanceDate.getDay() !== targetDay) {
                    instanceDate.setDate(instanceDate.getDate() + 1);
                }

                // Add weeks
                instanceDate.setDate(instanceDate.getDate() + (weekOffset * 7));
            }

            instances.push({
                date: instanceDate,
                startTime: currentSlot.startTime,
                endTime: currentSlot.endTime,
                enrolled: currentService.totalEnrolled || 0,
                capacity: currentService.maxCapacity || 20,
                staff: currentService.staff?.[0]?.name || 'Staff'
            });
        }
    } else {
        // Weekly schedule - find target day
        const targetDay = daysMap[currentSlot.day.trim().toLowerCase()];

        if (targetDay !== undefined) {
            // Advance to next occurrence
            while (date.getDay() !== targetDay) {
                date.setDate(date.getDate() + 1);
            }

            // Generate next 8 weeks
            for (let i = 0; i < 8; i++) {
                instances.push({
                    date: new Date(date),
                    startTime: currentSlot.startTime,
                    endTime: currentSlot.endTime,
                    enrolled: currentService.totalEnrolled || 0,
                    capacity: currentService.maxCapacity || 20,
                    staff: currentService.staff?.[0]?.name || 'Staff'
                });
                date.setDate(date.getDate() + 7);
            }
        }
    }

    return instances;
}

function generateSessions() {
    // Auto-generate and render session instances
    renderSessionInstances();
    showNotification('success', 'Slots generated successfully');
}

// ===== ENROLLMENT MANAGEMENT =====
// Copied and adapted from learning_service_detail_script.js

let selectedCustomer = null;
let selectedQuote = null;
let slotUsage = {};

// Sample customers (Simplified for this view)
const sampleCustomers = [
    { id: 'CUST-001', name: 'Sarah Johnson', email: 'sarah.j@email.com', quotes: [{ id: 'Q-2025-001', pricebookItemId: 'pb1', slots: 5, total: 100, status: 'approved', paymentStatus: 'paid', amountPaid: 100 }] },
    { id: 'CUST-002', name: 'Michael Chen', email: 'm.chen@email.com', quotes: [{ id: 'Q-2025-011', pricebookItemId: 'pb1', slots: 6, total: 1080, status: 'approved', paymentStatus: 'partial', amountPaid: 540 }] }
];

function renderEnrollmentList() {
    const enrollments = currentService.enrollments || [];
    const container = document.getElementById('attendeesList'); // Fixed ID mismatch
    const emptyState = document.getElementById('emptyAttendeesState');
    const countEl = document.getElementById('enrolledCount');

    if (enrollments.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        if (countEl) countEl.textContent = '0'; // Stats number
        updateEnrollmentStats();
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    container.innerHTML = enrollments.map(e => {
        const paymentBadge = e.paymentStatus === 'paid' ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Paid</span>' :
            e.paymentStatus === 'partial' ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Partial</span>' :
                '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">Unpaid</span>';

        return `
            <div class="border border-gray-200 rounded-lg p-3 hover:border-emerald-300 transition-colors bg-white">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h4 class="font-semibold text-gray-900">${e.attendeeName}</h4>
                            <span class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">Confirmed</span>
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
            </div>
        `;
    }).join('');

    updateEnrollmentStats();
}

function updateEnrollmentStats() {
    const enrollments = currentService.enrollments || [];
    const maxCapacity = currentService?.type === 'One-to-One' ? 1 : (currentService.maxCapacity || 1);

    setText('enrolledCount', enrollments.length);
    setText('confirmedCount', enrollments.filter(e => e.status === 'confirmed').length);
    setText('availableCount', Math.max(0, maxCapacity - enrollments.length));

    const fillRate = maxCapacity > 0 ? Math.round((enrollments.length / maxCapacity) * 100) : 0;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = `${fillRate}%`;
}

function openBookCustomerModal() {
    document.getElementById('bookCustomerModal').classList.remove('hidden');
    // Simplified specific implementation would go here
    // For now reusing the HTML structure but hiding search for simplicity in this demo
}

function closeBookCustomerModal() {
    document.getElementById('bookCustomerModal').classList.add('hidden');
}

function searchCustomersForBooking(query) {
    // Mock search
    const autocomplete = document.getElementById('customerAutocomplete');
    if (!query || query.length < 2) {
        autocomplete.classList.add('hidden');
        return;
    }

    autocomplete.innerHTML = `
        <div class="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onclick="selectMockCustomer()">
            <p class="font-medium">Sarah Johnson</p>
            <p class="text-xs text-gray-500">sarah.j@email.com</p>
        </div>
    `;
    autocomplete.classList.remove('hidden');
}

function selectMockCustomer() {
    document.getElementById('customerAutocomplete').classList.add('hidden');
    document.getElementById('slotBookingForm').classList.remove('hidden');
    document.getElementById('slotBookCustomerName').innerHTML = 'Sarah Johnson';
    document.getElementById('inventoryAvailable').innerHTML = '5';

    selectedCustomer = sampleCustomers[0];
    selectedQuote = sampleCustomers[0].quotes[0];
    updateBookingButtonState();
}

function updateBookingButtonState() {
    const attendeeName = document.getElementById('attendeeName').value.trim();
    document.getElementById('confirmBookingBtn').disabled = !attendeeName;
}

function confirmEnrollment() {
    const attendeeName = document.getElementById('attendeeName').value.trim();
    if (!attendeeName) return;

    const enrollment = {
        id: `enroll_${Date.now()}`,
        attendeeName,
        customerName: selectedCustomer ? selectedCustomer.name : 'Unknown',
        status: 'confirmed',
        paymentStatus: 'paid',
        enrolledAt: new Date().toISOString()
    };

    if (!currentService.enrollments) currentService.enrollments = [];
    currentService.enrollments.push(enrollment);

    saveToStorage();
    renderEnrollmentList();
    closeBookCustomerModal();
}

function saveToStorage() {
    const stored = localStorage.getItem('fms_learning_services');
    let services = stored ? JSON.parse(stored) : [];
    const index = services.findIndex(s => s.id === currentService.id);
    if (index >= 0) services[index] = currentService;
    localStorage.setItem('fms_learning_services', JSON.stringify(services));
}

// Navigation
function viewSession() {
    window.location.href = `learning_service_detail.html?id=${currentService.id}`;
}

function viewAllSessions() {
    window.location.href = `session_list.html?serviceId=${currentService.id}`;
}

function openStaffOverrideModal() {
    alert('Staff override logic coming soon');
}
