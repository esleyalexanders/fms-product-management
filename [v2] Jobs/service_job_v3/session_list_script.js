/**
 * Session List Script (Refactored for Slot Pattern View)
 * Display distinct configured time slots from Learning Services
 */

// ===== STATE MANAGEMENT =====
let allSlots = [];
let filteredSlots = [];
let allLearningServices = [];
let currentTypeFilter = '';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadData();
    renderSlots();
    updateStats();
});

// ===== DATA LOADING =====
function loadData() {
    // 1. Load Learning Services
    const storedServices = localStorage.getItem('fms_learning_services');
    if (storedServices) {
        allLearningServices = JSON.parse(storedServices);
    } else {
        // Fallback or empty if not found (usually should be there)
        allLearningServices = [];
    }

    // 2. Generate Slots from Services
    allSlots = generateSlotsFromServices(allLearningServices);
    filteredSlots = [...allSlots];
}

function generateSlotsFromServices(services) {
    let slots = [];

    services.forEach(service => {
        if (!service.schedule) return;

        // A. Complex Schedule (Config Object)
        if (service.schedule.config) {
            const config = service.schedule.config;

            // 1. Daily Slots
            if (service.schedule.frequency === 'daily' && config.dailySlots) {
                config.dailySlots.forEach(slot => {
                    slots.push(createSlotObject(service, 'Daily', slot.startTime, slot.endTime, slot.duration));
                });
            }
            // 2. Weekly Slots (Complex)
            else if (service.schedule.frequency === 'weekly' && config.weeklySlots) {
                Object.keys(config.weeklySlots).forEach(day => {
                    const daySlots = config.weeklySlots[day];
                    daySlots.forEach(slot => {
                        slots.push(createSlotObject(service, capitalize(day), slot.startTime, slot.endTime, slot.duration));
                    });
                });
            }
        }
        // B. Simple/Legacy Schedule
        else if (service.schedule.daysOfWeek) {
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
    });

    return slots;
}

function createSlotObject(service, day, startTime, endTime, duration) {
    // Create a unique ID for this slot pattern
    // ID format: lsId_day_startTime
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
        capacity: service.maxCapacity, // Using max capacity for now
        staffCount: service.staff ? service.staff.length : 0
    };
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===== RENDERING =====
function renderSlots() {
    const listContainer = document.getElementById('sessionsList');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');

    listContainer.innerHTML = '';

    if (filteredSlots.length === 0) {
        listContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        resultsCount.textContent = '0 slots found';
        return;
    }

    listContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    resultsCount.textContent = `${filteredSlots.length} slots found`;

    filteredSlots.forEach(slot => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow session-card cursor-pointer';
        card.onclick = () => window.location.href = `session_detail.html?slotId=${slot.id}&serviceId=${slot.serviceId}`;

        const typeStyles = getTypeStyles(slot.serviceType);

        card.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${typeStyles.bgClass}">
                        <span class="text-xl">${typeStyles.icon}</span>
                    </div>
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <h3 class="font-semibold text-gray-900">${slot.serviceName}</h3>
                            <span class="px-2 py-0.5 text-xs font-medium rounded-full ${typeStyles.badgeClass}">
                                ${slot.serviceType}
                            </span>
                        </div>
                        <p class="text-sm font-medium text-indigo-700">
                            ${slot.day} at ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}
                        </p>
                        <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <div class="flex items-center gap-1">
                                <i class="fas fa-clock"></i>
                                <span>${slot.duration} min</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <i class="fas fa-users"></i>
                                <span>Mask Cap: ${slot.capacity || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <button class="text-gray-400 hover:text-indigo-600">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

function getTypeStyles(type) {
    switch (type) {
        case 'Class':
            return { badgeClass: 'type-badge-class', bgClass: 'bg-purple-100', icon: '📚' };
        case 'Group':
            return { badgeClass: 'type-badge-group', bgClass: 'bg-amber-100', icon: '👥' };
        case 'One-to-One':
            return { badgeClass: 'type-badge-one-to-one', bgClass: 'bg-cyan-100', icon: '👤' };
        default:
            return { badgeClass: 'bg-gray-100 text-gray-800', bgClass: 'bg-gray-100', icon: '🔹' };
    }
}

function formatTime(timeStr) {
    if (!timeStr) return '-';
    // Simple 24h to 12h conversion
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
}

// ===== FILTERING =====
function handleSearch(query) {
    filterSlots(query, currentTypeFilter);
}

function filterByType(type) {
    currentTypeFilter = type;

    // Update button states
    const buttons = ['filterAll', 'filterClass', 'filterGroup', 'filterOneToOne'];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if ((type === '' && id === 'filterAll') || (type !== '' && id === `filter${type.replace(/-/g, '')}`)) {
            btn.classList.add('active', 'bg-indigo-100', 'border-indigo-300', 'text-indigo-700');
            btn.classList.remove('hover:bg-gray-50');
        } else {
            btn.classList.remove('active', 'bg-indigo-100', 'border-indigo-300', 'text-indigo-700');
            btn.classList.add('hover:bg-gray-50');
        }
    });

    const searchVal = document.getElementById('searchInput').value;
    filterSlots(searchVal, type);
}

function filterSlots(searchQuery, type) {
    const lowerQuery = searchQuery.toLowerCase();

    filteredSlots = allSlots.filter(slot => {
        const matchesSearch =
            slot.serviceName.toLowerCase().includes(lowerQuery) ||
            slot.day.toLowerCase().includes(lowerQuery);
        const matchesType = type === '' || slot.serviceType === type;

        return matchesSearch && matchesType;
    });

    renderSlots();
    updateStats();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    currentTypeFilter = '';

    // Reset buttons
    filterByType('');
}

// ===== STATS =====
function updateStats() {
    // Total Slots
    document.getElementById('totalSessions').textContent = filteredSlots.length;

    // Unique Services
    const uniqueServices = new Set(filteredSlots.map(s => s.serviceId)).size;
    document.getElementById('upcomingSessions').textContent = uniqueServices; // Reusing ID for "Unique Services"
    document.getElementById('upcomingSessions').previousElementSibling.textContent = "Unique Services";

    // Most Common Day
    const dayCounts = {};
    filteredSlots.forEach(s => dayCounts[s.day] = (dayCounts[s.day] || 0) + 1);
    let topDay = '-';
    let max = 0;
    Object.keys(dayCounts).forEach(day => {
        if (dayCounts[day] > max) {
            max = dayCounts[day];
            topDay = day;
        }
    });
    document.getElementById('todaySessions').textContent = topDay; // Reusing ID
    document.getElementById('todaySessions').previousElementSibling.textContent = "Most Active Day";

    // Hide other stats cards that aren't relevant for now if needed, 
    // or just leave them with placeholders? 
    // For now I'll just set them to '-' to avoid confusion or repurpose them.
    document.getElementById('avgEnrollment').textContent = '-';
    document.getElementById('sessionsByType').textContent = '-';
}
