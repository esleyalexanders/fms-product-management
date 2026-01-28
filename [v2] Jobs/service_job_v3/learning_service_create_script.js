/**
 * Learning Service Create Script
 * Handles form logic for creating new Learning Services (Class, Group, One-to-One)
 */

// ===== STATE MANAGEMENT =====
let selectedType = '';
let selectedDays = [];
let selectedPricebookItem = null;
let selectedStaff = [];

// NEW: Time Slot Builder State
let dailySchedule = []; // For daily frequency
let weeklySchedule = {
    selectedDays: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
};
let slotIdCounter = 0;

// GLOBAL ENTRY POINT (Debugging)
window.assignStaffGlobal = function (slotId, staffId, context) {
    console.log('GLOBAL ENTRY POINT: assignStaffGlobal called', { slotId, staffId, context });
    if (typeof addStaffToSlot === 'function') {
        addStaffToSlot(slotId, staffId, context);
    } else {
        alert('CRITICAL: addStaffToSlot function is missing!');
    }
};

// Sample staff data (would come from API)
// hourlyRate is the default pay rate from staff profile
const sampleStaff = [
    { id: 'staff1', name: 'John Smith', role: 'Senior Tutor', skills: ['Math', 'Physics', 'SAT Prep'], avatar: 'JS', type: 'staff', hourlyRate: 45.00 },
    { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist', skills: ['Algebra', 'Calculus', 'AP Math'], avatar: 'ED', type: 'staff', hourlyRate: 40.00 },
    { id: 'staff3', name: 'Michael Chen', role: 'Science Teacher', skills: ['Chemistry', 'Biology', 'Lab Work'], avatar: 'MC', type: 'staff', hourlyRate: 38.00 },
    { id: 'staff4', name: 'Sarah Wilson', role: 'English Tutor', skills: ['Essay Writing', 'Literature', 'Grammar'], avatar: 'SW', type: 'staff', hourlyRate: 35.00 },
    { id: 'staff5', name: 'David Brown', role: 'Test Prep Coach', skills: ['SAT', 'ACT', 'GRE'], avatar: 'DB', type: 'staff', hourlyRate: 50.00 }
];

// Sample teams data (would come from API)
const sampleTeams = [
    { id: 'team1', name: 'Math Department', role: 'Team', members: 4, skills: ['Math', 'Algebra', 'Calculus'], avatar: 'MT', type: 'team', hourlyRate: null },
    { id: 'team2', name: 'Science Team', role: 'Team', members: 3, skills: ['Physics', 'Chemistry', 'Biology'], avatar: 'ST', type: 'team', hourlyRate: null },
    { id: 'team3', name: 'Test Prep Squad', role: 'Team', members: 5, skills: ['SAT', 'ACT', 'GRE', 'GMAT'], avatar: 'TP', type: 'team', hourlyRate: null }
];

// Sample pricebook items (would come from API/localStorage)
const samplePricebookItems = [
    {
        id: 'pb1',
        name: 'Math Tutoring - Group Session',
        price: 50.00,
        unit: 'hour',
        category: 'Classes',
        type: 'service',
        packageModel: 'subscription',
        serviceType: 'group',
        sessionFrequency: 'weekly',
        capacity: { minimum: 5, maximum: 15 },
        sessionDuration: 90,
        minStaffCount: 2,
        requiredSkills: ['Math', 'Teaching'],
        equipmentNeeded: 'Whiteboard, Projector'
    },
    {
        id: 'pb2',
        name: 'Private Tutoring - One-to-One',
        price: 75.00,
        unit: 'hour',
        category: 'Tutoring',
        type: 'service',
        packageModel: 'subscription',
        serviceType: 'one-to-one',
        sessionFrequency: 'weekly',
        capacity: { minimum: 1, maximum: 1 },
        sessionDuration: 60,
        minStaffCount: 1,
        requiredSkills: ['Teaching'],
        equipmentNeeded: ''
    },
    {
        id: 'pb3',
        name: 'SAT Prep Course - Class',
        price: 45.00,
        unit: 'hour',
        category: 'Test Prep',
        type: 'service',
        packageModel: 'subscription',
        serviceType: 'class',
        sessionFrequency: 'weekly',
        capacity: { minimum: 10, maximum: 20 },
        sessionDuration: 120,
        minStaffCount: 1,
        requiredSkills: ['SAT', 'Test Prep'],
        equipmentNeeded: 'Whiteboard, Practice Tests'
    },
    {
        id: 'pb4',
        name: 'Science Lab - Group',
        price: 60.00,
        unit: 'hour',
        category: 'Science',
        type: 'service',
        packageModel: 'subscription',
        serviceType: 'group',
        sessionFrequency: 'weekly',
        capacity: { minimum: 4, maximum: 12 },
        sessionDuration: 90,
        minStaffCount: 2,
        requiredSkills: ['Science', 'Lab Safety'],
        equipmentNeeded: 'Lab Equipment, Safety Goggles'
    },
    {
        id: 'pb5',
        name: 'Essay Writing Workshop',
        price: 40.00,
        unit: 'hour',
        category: 'Workshops',
        type: 'service',
        packageModel: 'subscription',
        serviceType: 'class',
        sessionFrequency: 'monthly',
        capacity: { minimum: 8, maximum: 25 },
        sessionDuration: 120,
        minStaffCount: 1,
        requiredSkills: ['English', 'Writing'],
        equipmentNeeded: 'Projector'
    },
    {
        id: 'pb6',
        name: 'Music Lesson - One-to-One',
        price: 65.00,
        unit: 'hour',
        category: 'Music',
        type: 'service',
        packageModel: 'subscription',
        serviceType: 'one-to-one',
        sessionFrequency: 'weekly',
        capacity: { minimum: 1, maximum: 1 },
        sessionDuration: 45,
        minStaffCount: 1,
        requiredSkills: ['Music', 'Piano'],
        equipmentNeeded: 'Piano'
    },
    {
        id: 'pb7',
        name: 'Morning Study Hall - Group',
        price: 30.00,
        unit: 'hour',
        category: 'Study Support',
        type: 'service',
        packageModel: 'subscription',
        serviceType: 'group',
        sessionFrequency: 'daily',
        capacity: { minimum: 3, maximum: 10 },
        sessionDuration: 60,
        minStaffCount: 1,
        requiredSkills: ['Supervision', 'Tutoring'],
        equipmentNeeded: 'Study Materials'
    }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    initializeDaySelectors();
    initializeStaffSearch();
    initializePricebookModal();
    updateCapacityFieldsVisibility();
});

// ===== TYPE SELECTION =====
function selectType(type) {
    selectedType = type;
    document.getElementById('selectedType').value = type;

    // Update UI for type cards
    document.querySelectorAll('.type-card').forEach(card => {
        card.classList.remove('selected');
    });
    const selectedCard = document.querySelector(`.type-card[data-type="${type}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Hide error message
    document.getElementById('typeError').classList.add('hidden');

    // Show/hide type-specific fields
    updateTypeSpecificFields(type);

    // Update capacity fields based on type
    updateCapacityFieldsVisibility();

    // Update schedule date requirements for Class type
    updateScheduleDateRequirements();
}

function updateTypeSpecificFields(type) {
    const classFields = document.getElementById('classTypeFields');
    const groupFields = document.getElementById('groupTypeFields');
    const oneToOneFields = document.getElementById('oneToOneTypeFields');

    // Hide all type-specific sections
    classFields.classList.add('hidden');
    groupFields.classList.add('hidden');
    oneToOneFields.classList.add('hidden');

    // Show the relevant section
    switch (type) {
        case 'Class':
            classFields.classList.remove('hidden');
            break;
        case 'Group':
            groupFields.classList.remove('hidden');
            break;
        case 'One-to-One':
            oneToOneFields.classList.remove('hidden');
            break;
    }
}

function updateCapacityFieldsVisibility() {
    // Maximum Capacity is now directly in the Group Details section
    // We only need to manage the input field's value and required state
    const maxCapacityInput = document.getElementById('maxCapacity');

    if (!maxCapacityInput) return; // Safety check

    if (selectedType === 'One-to-One') {
        // For One-to-One, set capacity to 1 and make it read-only
        maxCapacityInput.value = 1;
        maxCapacityInput.required = false;
        maxCapacityInput.disabled = true;
        maxCapacityInput.style.background = '#f3f4f6';
        maxCapacityInput.style.cursor = 'not-allowed';
    } else {
        // For Class and Group, enable the field
        maxCapacityInput.disabled = false;
        maxCapacityInput.required = true;
        maxCapacityInput.style.background = '';
        maxCapacityInput.style.cursor = '';

        // Reset to default if it was set to 1
        if (maxCapacityInput.value == 1) {
            maxCapacityInput.value = 10;
        }
    }
}

function updateScheduleDateRequirements() {
    const scheduleStartRequired = document.getElementById('scheduleStartRequired');
    const scheduleEndRequired = document.getElementById('scheduleEndRequired');

    // Only update if elements exist (they may not be in the new UI)
    if (scheduleStartRequired && scheduleEndRequired) {
        if (selectedType === 'Class') {
            scheduleStartRequired.classList.remove('hidden');
            scheduleEndRequired.classList.remove('hidden');
        } else {
            scheduleStartRequired.classList.add('hidden');
            scheduleEndRequired.classList.add('hidden');
        }
    }
}

// ===== DAY SELECTORS =====
function initializeDaySelectors() {
    document.querySelectorAll('.day-selector').forEach(btn => {
        btn.addEventListener('click', function () {
            const day = this.dataset.day;
            toggleDaySelection(this, day);
        });
    });
}

function toggleDaySelection(button, day) {
    if (selectedDays.includes(day)) {
        selectedDays = selectedDays.filter(d => d !== day);
        button.classList.remove('selected');
    } else {
        selectedDays.push(day);
        button.classList.add('selected');
    }
}

// ===== FREQUENCY HANDLER =====
function handleFrequencyChange() {
    const frequency = document.getElementById('frequency').value;
    const daysOfWeekSection = document.getElementById('daysOfWeekSection');
    const customIntervalSection = document.getElementById('customIntervalSection');

    if (frequency === 'weekly') {
        daysOfWeekSection.classList.remove('hidden');
        customIntervalSection.classList.add('hidden');
    } else if (frequency === 'custom') {
        daysOfWeekSection.classList.add('hidden');
        customIntervalSection.classList.remove('hidden');
    } else {
        daysOfWeekSection.classList.add('hidden');
        customIntervalSection.classList.add('hidden');
    }
}

// ===== DURATION CALCULATOR =====
function calculateDuration() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    if (startTime && endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        let diff = (end - start) / 1000 / 60; // minutes

        if (diff < 0) {
            diff += 24 * 60; // handle overnight sessions
        }

        document.getElementById('duration').value = diff;
    }
}

// ===== STAFF/ASSIGNMENT SEARCH =====
function initializeStaffSearch() {
    const searchInput = document.getElementById('assignmentSearchInput');
    const autocomplete = document.getElementById('assignmentAutocomplete');

    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase().trim();

        if (query.length < 2) {
            autocomplete.classList.add('hidden');
            return;
        }

        // Search both staff and teams
        const filteredStaff = sampleStaff.filter(staff => {
            const inName = staff.name.toLowerCase().includes(query);
            const inRole = staff.role.toLowerCase().includes(query);
            const inSkills = staff.skills.some(s => s.toLowerCase().includes(query));
            const notSelected = !selectedStaff.find(s => s.id === staff.id);
            return (inName || inRole || inSkills) && notSelected;
        });

        const filteredTeams = sampleTeams.filter(team => {
            const inName = team.name.toLowerCase().includes(query);
            const inSkills = team.skills.some(s => s.toLowerCase().includes(query));
            const notSelected = !selectedStaff.find(s => s.id === team.id);
            return (inName || inSkills) && notSelected;
        });

        renderAssignmentAutocomplete(filteredStaff, filteredTeams);
    });

    // Close autocomplete when clicking outside
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !autocomplete.contains(e.target)) {
            autocomplete.classList.add('hidden');
        }
    });

    // Initialize recommended assignments
    renderRecommendedAssignments();
}

function renderAssignmentAutocomplete(staffList, teamsList) {
    const autocomplete = document.getElementById('assignmentAutocomplete');

    if (staffList.length === 0 && teamsList.length === 0) {
        autocomplete.innerHTML = `
            <div class="px-4 py-3 text-sm text-gray-500 italic">No matching staff or teams found</div>
        `;
    } else {
        let html = '';

        // Teams section
        if (teamsList.length > 0) {
            html += `<div class="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">Teams</div>`;
            html += teamsList.map(team => `
                <div class="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3" onclick="addAssignment('${team.id}', 'team')">
                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-semibold text-sm">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">${team.name}</p>
                        <p class="text-xs text-gray-500">${team.members} members • ${team.skills.slice(0, 2).join(', ')}</p>
                    </div>
                </div>
            `).join('');
        }

        // Staff section
        if (staffList.length > 0) {
            html += `<div class="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">Staff Members</div>`;
            html += staffList.map(staff => `
                <div class="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3" onclick="addAssignment('${staff.id}', 'staff')">
                    <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                        ${staff.avatar}
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">${staff.name}</p>
                        <p class="text-xs text-gray-500">${staff.role} • ${staff.skills.slice(0, 2).join(', ')}</p>
                    </div>
                </div>
            `).join('');
        }

        autocomplete.innerHTML = html;
    }

    autocomplete.classList.remove('hidden');
}

function addAssignment(id, type) {
    let assignment;
    if (type === 'team') {
        assignment = sampleTeams.find(t => t.id === id);
    } else {
        assignment = sampleStaff.find(s => s.id === id);
    }

    if (assignment && !selectedStaff.find(s => s.id === id)) {
        // Add with assignedRate defaulting to hourlyRate from staff profile
        selectedStaff.push({
            ...assignment,
            type,
            assignedRate: assignment.hourlyRate || null  // Default to profile rate
        });
        renderSelectedAssignments();
        renderRecommendedAssignments();
    }

    document.getElementById('assignmentSearchInput').value = '';
    document.getElementById('assignmentAutocomplete').classList.add('hidden');
}

function removeAssignment(id) {
    selectedStaff = selectedStaff.filter(s => s.id !== id);
    renderSelectedAssignments();
    renderRecommendedAssignments();
}

function renderSelectedAssignments() {
    const container = document.getElementById('selectedAssignmentsList');
    const countElement = document.getElementById('selectedAssignmentsCount');
    const noAssignmentsMessage = document.getElementById('noAssignmentsSelected');
    const staffError = document.getElementById('staffError');

    countElement.textContent = selectedStaff.length;

    if (selectedStaff.length === 0) {
        container.innerHTML = '';
        if (noAssignmentsMessage) noAssignmentsMessage.style.display = 'block';
    } else {
        if (noAssignmentsMessage) noAssignmentsMessage.style.display = 'none';
        if (staffError) staffError.classList.add('hidden');

        container.innerHTML = selectedStaff.map(item => {
            const isTeam = item.type === 'team';
            const bgColor = isTeam ? 'bg-purple-50' : 'bg-indigo-50';
            const borderColor = isTeam ? 'border-purple-200' : 'border-indigo-200';
            const iconBg = isTeam ? 'bg-purple-100' : 'bg-indigo-100';
            const iconColor = isTeam ? 'text-purple-600' : 'text-indigo-600';
            const currentRate = item.assignedRate !== undefined ? item.assignedRate : item.hourlyRate;

            return `
                <div class="p-3 ${bgColor} border ${borderColor} rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 ${iconBg} ${isTeam ? 'rounded-lg' : 'rounded-full'} flex items-center justify-center ${iconColor} font-semibold text-sm">
                                ${isTeam ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>` : item.avatar}
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-900">${item.name}</p>
                                <p class="text-xs text-gray-500">${item.role}${isTeam ? ` • ${item.members} members` : ''}</p>
                            </div>
                        </div>
                        <button type="button" onclick="removeAssignment('${item.id}')" class="text-gray-400 hover:text-red-500 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    ${!isTeam ? `
                    <div class="flex items-center gap-2 mt-2 pt-2 border-t ${borderColor}">
                        <label class="text-xs text-gray-600 whitespace-nowrap">Hourly Rate:</label>
                        <div class="relative flex-1 max-w-32">
                            <span class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <input type="number" 
                                value="${currentRate || ''}" 
                                step="0.01" 
                                min="0"
                                placeholder="${item.hourlyRate ? item.hourlyRate.toFixed(2) : '0.00'}"
                                onchange="updateAssignmentRate('${item.id}', this.value)"
                                class="w-full pl-5 pr-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        </div>
                        <span class="text-xs text-gray-400">/hr</span>
                        ${item.hourlyRate && currentRate !== item.hourlyRate ? `
                            <button type="button" onclick="resetAssignmentRate('${item.id}')" class="text-xs text-indigo-600 hover:text-indigo-800" title="Reset to default">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                    <p class="text-xs text-gray-400 mt-1">Default: $${item.hourlyRate ? item.hourlyRate.toFixed(2) : '0.00'}/hr from staff profile</p>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
}

function updateAssignmentRate(id, rate) {
    const assignment = selectedStaff.find(s => s.id === id);
    if (assignment) {
        assignment.assignedRate = parseFloat(rate) || assignment.hourlyRate;
    }
}

function resetAssignmentRate(id) {
    const assignment = selectedStaff.find(s => s.id === id);
    if (assignment) {
        assignment.assignedRate = assignment.hourlyRate;
        renderSelectedAssignments();
    }
}

function renderRecommendedAssignments() {
    const container = document.getElementById('recommendedAssignmentsList');
    if (!container) return;

    // Get available staff/teams not already selected
    const availableStaff = sampleStaff.filter(s => !selectedStaff.find(sel => sel.id === s.id));
    const availableTeams = sampleTeams.filter(t => !selectedStaff.find(sel => sel.id === t.id));

    // Show first 3 recommendations
    const recommendations = [...availableTeams.slice(0, 1), ...availableStaff.slice(0, 2)];

    if (recommendations.length === 0) {
        container.innerHTML = `<p class="text-xs text-gray-400 italic py-2">All available staff and teams have been added</p>`;
        return;
    }

    container.innerHTML = recommendations.map(item => {
        const isTeam = item.type === 'team';
        return `
            <div class="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 ${isTeam ? 'bg-purple-100 rounded-lg' : 'bg-indigo-100 rounded-full'} flex items-center justify-center ${isTeam ? 'text-purple-600' : 'text-indigo-600'} font-semibold text-xs">
                        ${isTeam ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>` : item.avatar}
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-900">${item.name}</p>
                        <p class="text-xs text-gray-500">${item.skills ? item.skills.slice(0, 2).join(', ') : ''}</p>
                    </div>
                </div>
                <button type="button" onclick="addAssignment('${item.id}', '${item.type}')" 
                    class="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors">
                    + Add
                </button>
            </div>
        `;
    }).join('');
}

function refreshRecommendations() {
    renderRecommendedAssignments();
    showNotification('info', 'Refreshed', 'Recommendations have been updated');
}

// Legacy function aliases for compatibility
function addStaff(staffId) {
    addAssignment(staffId, 'staff');
}

function removeStaff(staffId) {
    removeAssignment(staffId);
}

function renderSelectedStaff() {
    renderSelectedAssignments();
}

// ===== PRICEBOOK MODAL =====
function initializePricebookModal() {
    const searchInput = document.getElementById('pricebookSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            renderPricebookList(this.value);
        });
    }
}

function showPricebookModal() {
    document.getElementById('pricebookModal').classList.remove('hidden');
    document.getElementById('pricebookSearch').value = '';
    renderPricebookList('');
}

function closePricebookModal() {
    document.getElementById('pricebookModal').classList.add('hidden');
}

function renderPricebookList(query) {
    const container = document.getElementById('pricebookList');
    const filteredItems = samplePricebookItems.filter(item => {
        if (!query) return true;
        return item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase());
    });

    if (filteredItems.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p>No pricebook items found</p>
            </div>
        `;
    } else {
        container.innerHTML = filteredItems.map(item => {
            // Service type badge styling
            const typeColors = {
                'class': 'bg-purple-100 text-purple-700 border-purple-200',
                'group': 'bg-blue-100 text-blue-700 border-blue-200',
                'one-to-one': 'bg-green-100 text-green-700 border-green-200'
            };
            const typeBadgeClass = typeColors[item.serviceType] || 'bg-gray-100 text-gray-700 border-gray-200';
            const typeLabel = item.serviceType === 'one-to-one' ? 'One-to-One' :
                item.serviceType.charAt(0).toUpperCase() + item.serviceType.slice(1);

            // Frequency label
            const frequencyLabel = item.sessionFrequency ?
                item.sessionFrequency.charAt(0).toUpperCase() + item.sessionFrequency.slice(1) : '';

            // Duration display
            const durationDisplay = item.sessionDuration ?
                `${item.sessionDuration} min` : '';

            // Capacity display
            const capacityDisplay = item.capacity ?
                `${item.capacity.minimum}-${item.capacity.maximum} students` : '';

            return `
                <div class="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-colors" onclick="selectPricebookItem('${item.id}')">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <p class="font-medium text-gray-900">${item.name}</p>
                                <span class="px-2 py-0.5 text-xs font-medium rounded border ${typeBadgeClass}">${typeLabel}</span>
                            </div>
                            <p class="text-sm text-gray-500">${item.category}</p>
                        </div>
                        <span class="text-lg font-semibold text-indigo-600">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100">
                        ${frequencyLabel ? `<span class="flex items-center gap-1">📅 ${frequencyLabel}</span>` : ''}
                        ${durationDisplay ? `<span class="flex items-center gap-1">⏱️ ${durationDisplay}</span>` : ''}
                        ${capacityDisplay ? `<span class="flex items-center gap-1">👥 ${capacityDisplay}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
}

function selectPricebookItem(itemId) {
    const item = samplePricebookItems.find(i => i.id === itemId);
    if (item) {
        selectedPricebookItem = item;
        document.getElementById('pricebookItemId').value = item.id;
        document.getElementById('selectedPricebookName').textContent = item.name;
        document.getElementById('selectedPricebookPrice').textContent = `$${item.price.toFixed(2)} per ${item.unit}`;

        document.getElementById('selectPricebookBtn').classList.add('hidden');
        document.getElementById('selectedPricebookDisplay').classList.remove('hidden');

        // AUTO-FILL FIELDS FROM PRICEBOOK
        autoFillFromPricebook(item);

        closePricebookModal();
    }
}

function autoFillFromPricebook(item) {
    // 1. Auto-select Service Type and make it read-only
    if (item.serviceType) {
        const typeMap = {
            'class': 'Class',
            'group': 'Group',
            'one-to-one': 'One-to-One'
        };
        const mappedType = typeMap[item.serviceType.toLowerCase()];
        if (mappedType) {
            selectType(mappedType);
            // Disable type cards
            document.querySelectorAll('.type-card').forEach(card => {
                card.style.pointerEvents = 'none';
                card.style.opacity = '0.6';
            });
        }
    }

    // 2. Auto-fill and lock Min/Max Capacity
    if (item.capacity) {
        const minCapacityInput = document.getElementById('minCapacity');
        const maxCapacityInput = document.getElementById('maxCapacity');

        if (minCapacityInput) {
            minCapacityInput.value = item.capacity.minimum;
            minCapacityInput.disabled = true;
            minCapacityInput.style.background = '#f3f4f6';
            minCapacityInput.style.cursor = 'not-allowed';
        }

        if (maxCapacityInput && item.serviceType !== 'one-to-one') {
            maxCapacityInput.value = item.capacity.maximum;
            maxCapacityInput.disabled = true;
            maxCapacityInput.style.background = '#f3f4f6';
            maxCapacityInput.style.cursor = 'not-allowed';
        }
    }

    // 4. Store session duration for use in schedule builder
    if (item.sessionDuration) {
        // Duration will be used by the schedule builder when creating time slots
        // No need to set on individual fields since they're in the dynamic builder now
    }

    // 5. Display read-only info about min staff, skills, equipment
    displayPricebookInfo(item);

    // 7. Initialize the schedule builder based on frequency
    initializeScheduleBuilder();
}

function autoCalculateEndTime() {
    const startTime = this.value;
    const duration = parseInt(this.getAttribute('data-duration'));

    if (startTime && duration) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startDate = new Date(2000, 0, 1, hours, minutes);
        const endDate = new Date(startDate.getTime() + duration * 60000);

        const endHours = String(endDate.getHours()).padStart(2, '0');
        const endMinutes = String(endDate.getMinutes()).padStart(2, '0');

        document.getElementById('endTime').value = `${endHours}:${endMinutes}`;
        document.getElementById('duration').value = duration;
    }
}

function displayPricebookInfo(item) {
    // Find or create info display section
    let infoSection = document.getElementById('pricebookInfoDisplay');

    if (!infoSection) {
        // Create info section after the pricebook selection
        const pricebookSection = document.querySelector('.section-card');
        infoSection = document.createElement('div');
        infoSection.id = 'pricebookInfoDisplay';
        infoSection.className = 'bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4';
        pricebookSection.appendChild(infoSection);
    }

    infoSection.innerHTML = `
        <h4 class="text-sm font-semibold text-blue-900 mb-3">Service Configuration (from Pricebook)</h4>
        <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
                <span class="text-blue-700 font-medium">Duration:</span>
                <span class="text-blue-900">${item.sessionDuration} minutes</span>
            </div>
            <div>
                <span class="text-blue-700 font-medium">Min Staff:</span>
                <span class="text-blue-900">${item.minStaffCount}</span>
            </div>
            <div class="col-span-2">
                <span class="text-blue-700 font-medium">Required Skills:</span>
                <span class="text-blue-900">${item.requiredSkills.join(', ')}</span>
            </div>
            ${item.equipmentNeeded ? `
            <div class="col-span-2">
                <span class="text-blue-700 font-medium">Equipment:</span>
                <span class="text-blue-900">${item.equipmentNeeded}</span>
            </div>
            ` : ''}
        </div>
    `;
}

function clearPricebookSelection() {
    selectedPricebookItem = null;
    document.getElementById('pricebookItemId').value = '';
    document.getElementById('selectPricebookBtn').classList.remove('hidden');
    document.getElementById('selectedPricebookDisplay').classList.add('hidden');

    // Re-enable all fields
    document.querySelectorAll('.type-card').forEach(card => {
        card.style.pointerEvents = 'auto';
        card.style.opacity = '1';
    });

    const frequencySelect = document.getElementById('frequency');
    if (frequencySelect) {
        frequencySelect.disabled = false;
        frequencySelect.style.background = '';
        frequencySelect.style.cursor = '';
    }

    ['minCapacity', 'maxCapacity', 'endTime'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.disabled = false;
            input.style.background = '';
            input.style.cursor = '';
        }
    });

    // Remove info display
    const infoSection = document.getElementById('pricebookInfoDisplay');
    if (infoSection) {
        infoSection.remove();
    }

    // Remove auto-calc note
    const note = document.querySelector('.auto-calc-note');
    if (note) {
        note.remove();
    }
}

// ===== FORM VALIDATION =====
function validateForm() {
    let isValid = true;
    const errors = [];

    // Validate type selection
    if (!selectedType) {
        document.getElementById('typeError').classList.remove('hidden');
        errors.push('Please select a type');
        isValid = false;
    }

    // Validate service name
    const serviceName = document.getElementById('serviceName').value.trim();
    if (!serviceName) {
        errors.push('Service name is required');
        isValid = false;
    }

    // Validate type-specific required fields
    if (selectedType === 'Class') {
        const curriculum = document.getElementById('curriculum').value.trim();
        const cohortStartDate = document.getElementById('cohortStartDate').value;
        const cohortEndDate = document.getElementById('cohortEndDate').value;

        if (!curriculum) {
            errors.push('Curriculum is required for Class type');
            isValid = false;
        }
        if (!cohortStartDate) {
            errors.push('Cohort start date is required for Class type');
            isValid = false;
        }
        if (!cohortEndDate) {
            errors.push('Cohort end date is required for Class type');
            isValid = false;
        }
        if (cohortStartDate && cohortEndDate && new Date(cohortStartDate) >= new Date(cohortEndDate)) {
            errors.push('Cohort end date must be after start date');
            isValid = false;
        }
    }

    if (selectedType === 'Group') {
        const minCapacity = document.getElementById('minCapacity').value;
        if (!minCapacity || parseInt(minCapacity) < 2) {
            errors.push('Minimum capacity must be at least 2 for Group type');
            isValid = false;
        }
    }

    // Staff selection is optional during creation
    // Can be assigned later before generating sessions

    // Validate schedule times
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    if (!startTime || !endTime) {
        errors.push('Start and end time are required');
        isValid = false;
    }

    // Show validation errors
    if (!isValid) {
        showNotification('error', 'Validation Error', errors.join('. '));
    }

    return isValid;
}

// ===== FORM SUBMISSION =====
function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    // Collect form data
    const formData = {
        id: generateId(),
        type: selectedType,
        name: document.getElementById('serviceName').value.trim(),
        description: document.getElementById('description').value.trim(),
        skillLevel: document.getElementById('skillLevel').value,
        status: 'active', // Default to active on creation
        pricebookItemId: selectedPricebookItem?.id || null,
        pricebookItemName: selectedPricebookItem?.name || null,
        schedule: {
            frequency: document.getElementById('frequency').value,
            frequency: document.getElementById('frequency').value,
            // Complex schedule data config
            config: {
                dailySlots: document.getElementById('frequency').value === 'daily' ? dailySchedule : [],
                weeklySlots: document.getElementById('frequency').value === 'weekly' ? weeklySchedule : {}
            },
            // Legacy/Simple support (fallback)
            daysOfWeek: selectedDays,
            startTime: null, // No longer single start time
            endTime: null,   // No longer single end time
            duration: parseInt(document.getElementById('duration').value) || 0,
            startDate: document.getElementById('scheduleStartDate').value || null,
            endDate: document.getElementById('scheduleEndDate').value || null,
        },
        staff: selectedStaff.map(s => ({
            id: s.id,
            name: s.name,
            role: s.role,
            type: s.type,
            hourlyRate: s.hourlyRate,  // Default from profile
            assignedRate: s.assignedRate || s.hourlyRate  // Rate for this learning service
        })),
        maxCapacity: selectedType === 'One-to-One' ? 1 : parseInt(document.getElementById('maxCapacity').value),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Add type-specific fields
    if (selectedType === 'Class') {
        formData.curriculum = document.getElementById('curriculum').value.trim();
        formData.cohortStartDate = document.getElementById('cohortStartDate').value;
        formData.cohortEndDate = document.getElementById('cohortEndDate').value;
        formData.cohortSize = parseInt(document.getElementById('cohortSize').value) || null;
    } else if (selectedType === 'Group') {
        formData.minCapacity = parseInt(document.getElementById('minCapacity').value);
    } else if (selectedType === 'One-to-One') {
        formData.focusArea = document.getElementById('focusArea').value.trim();
        formData.personalizationLevel = document.getElementById('personalizationLevel').value;
    }

    // Save to localStorage
    saveLearningService(formData);

    // Show success and redirect to detail page
    showNotification('success', 'Success', 'Learning Service created successfully!');
    setTimeout(() => {
        window.location.href = `learning_service_detail.html?id=${formData.id}`;
    }, 1500);
}

function saveLearningService(data) {
    const storageKey = 'fms_learning_services';
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existing.push(data);
    localStorage.setItem(storageKey, JSON.stringify(existing));
}

function generateId() {
    return 'ls_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===== NOTIFICATIONS =====
function showNotification(type, title, message) {
    const colors = {
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    const icons = {
        success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
        error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
        warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>',
        info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
    };

    const notification = document.createElement('div');
    notification.className = `notification ${colors[type]} border rounded-lg p-4 shadow-lg max-w-md`;
    notification.innerHTML = `
        <div class="flex items-start gap-3">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${icons[type]}
            </svg>
            <div>
                <p class="font-semibold">${title}</p>
                <p class="text-sm mt-1">${message}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}


// ===== TIME SLOT BUILDER FUNCTIONS =====

// Initialize schedule builder based on Pricebook frequency
function initializeScheduleBuilder() {
    if (!selectedPricebookItem) return;

    const frequency = selectedPricebookItem.sessionFrequency;

    if (frequency === 'daily') {
        document.getElementById('dailyScheduleBuilder').classList.remove('hidden');
        document.getElementById('weeklyScheduleBuilder').classList.add('hidden');
    } else if (frequency === 'weekly') {
        document.getElementById('dailyScheduleBuilder').classList.add('hidden');
        document.getElementById('weeklyScheduleBuilder').classList.remove('hidden');
    }
}

// Generate unique slot ID
function generateSlotId() {
    return `slot_${Date.now()}_${slotIdCounter++}`;
}

// ===== DAILY SCHEDULE FUNCTIONS =====

function addDailyTimeSlot() {
    if (!selectedPricebookItem) {
        showNotification('error', 'Error', 'Please select a Pricebook item first');
        return;
    }

    const slot = {
        id: generateSlotId(),
        startTime: '',
        endTime: '',
        duration: selectedPricebookItem.sessionDuration,
        staffIds: []
    };

    dailySchedule.push(slot);
    renderDailySlots();
}

function removeDailyTimeSlot(slotId) {
    dailySchedule = dailySchedule.filter(s => s.id !== slotId);
    renderDailySlots();
}

function renderDailySlots() {
    const container = document.getElementById('dailySlotsList');

    if (dailySchedule.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500 italic py-4">No time slots configured. Click "+ Add Time Slot" to begin.</p>';
        return;
    }

    container.innerHTML = dailySchedule.map(slot => renderTimeSlotCard(slot, 'daily')).join('');
}

// ===== WEEKLY SCHEDULE FUNCTIONS =====

function toggleWeeklyBuilderDay(dayName) {
    const btn = document.querySelector(`[data-day="${dayName}"]`);

    if (weeklySchedule.selectedDays.includes(dayName)) {
        // Deselect day
        weeklySchedule.selectedDays = weeklySchedule.selectedDays.filter(d => d !== dayName);
        btn.classList.remove('selected');
        // Remove day section
        const daySection = document.querySelector(`[data-day-section="${dayName}"]`);
        if (daySection) daySection.remove();
    } else {
        // Select day
        weeklySchedule.selectedDays.push(dayName);
        btn.classList.add('selected');
        // Add day section
        renderDaySection(dayName);
    }
}

function renderDaySection(dayName) {
    const container = document.getElementById('weeklyDaysContainer');
    const dayLabel = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    const daySection = document.createElement('div');
    daySection.className = 'day-schedule-section';
    daySection.setAttribute('data-day-section', dayName);
    daySection.innerHTML = `
        <div class="flex items-center justify-between mb-3">
            <h4 class="text-lg font-semibold text-gray-900">${dayLabel}</h4>
            <button type="button" onclick="toggleDaySelection('${dayName}')" 
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
    if (!selectedPricebookItem) {
        showNotification('error', 'Error', 'Please select a Pricebook item first');
        return;
    }

    const slot = {
        id: generateSlotId(),
        startTime: '',
        endTime: '',
        duration: selectedPricebookItem.sessionDuration,
        staffIds: []
    };

    if (!weeklySchedule[dayName]) {
        weeklySchedule[dayName] = [];
    }

    weeklySchedule[dayName].push(slot);
    renderDaySlots(dayName);
}

function removeWeeklyTimeSlot(dayName, slotId) {
    weeklySchedule[dayName] = weeklySchedule[dayName].filter(s => s.id !== slotId);
    renderDaySlots(dayName);
}

function renderDaySlots(dayName) {
    const container = document.getElementById(`${dayName}SlotsList`);
    const slots = weeklySchedule[dayName] || [];

    if (slots.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500 italic">No time slots for this day. Click "+ Add Time Slot" below.</p>';
        return;
    }

    container.innerHTML = slots.map(slot => renderTimeSlotCard(slot, dayName)).join('');
}

// ===== TIME SLOT CARD RENDERING =====

function renderTimeSlotCard(slot, context) {
    const duration = selectedPricebookItem?.sessionDuration || 60;

    return `
        <div class="time-slot-card" data-slot-id="${slot.id}">
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
                        <div class="flex items-center justify-center pt-5">
                            <span class="duration-badge">${duration} min</span>
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

function renderStaffDropdownOptions(slotId, context) {
    // Use all available staff instead of pre-selected staff
    if (sampleStaff.length === 0) {
        return '<div class="px-4 py-3 text-sm text-gray-500">No staff available in the system.</div>';
    }

    console.log('Rendering dropdown options for slot:', slotId, 'Context:', context);

    return sampleStaff.map(staff => `
        <div class="staff-option" style="cursor: pointer; position: relative; z-index: 50;" 
             onclick="console.log('Click detected on staff option'); window.assignStaffGlobal('${slotId}', '${staff.id}', '${context}')">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-xs">
                    ${staff.avatar || staff.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-900">${staff.name}</p>
                    <p class="text-xs text-gray-500">${staff.role}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== SLOT MANAGEMENT FUNCTIONS =====

function updateSlotStartTime(slotId, startTime, context) {
    const slot = findSlot(slotId, context);
    if (!slot) return;

    slot.startTime = startTime;
    slot.endTime = calculateEndTime(startTime, slot.duration);

    // Re-render the specific context
    if (context === 'daily') {
        renderDailySlots();
    } else {
        renderDaySlots(context);
    }
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
    } else {
        // Context is a day name
        return weeklySchedule[context]?.find(s => s.id === slotId);
    }
}

function removeTimeSlot(slotId, context) {
    if (context === 'daily') {
        removeDailyTimeSlot(slotId);
    } else {
        removeWeeklyTimeSlot(context, slotId);
    }
}

// ===== STAFF ASSIGNMENT TO SLOTS =====

function showStaffDropdown(slotId, context) {
    // Hide all other dropdowns
    document.querySelectorAll('.add-staff-dropdown').forEach(d => d.classList.add('hidden'));

    // Show this dropdown
    const dropdown = document.getElementById(`staffDropdown_${slotId}`);
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

// Standard function declaration for hoisting reliability
function addStaffToSlot(slotId, staffId, context) {
    console.log('addStaffToSlot called:', { slotId, staffId, context });

    try {
        const slot = findSlot(slotId, context);

        if (!slot) {
            const msg = `Slot not found: ${slotId} in ${context}`;
            console.error(msg);
            alert(msg + '\nPlease start fresh or refresh the page.');
            return;
        }

        if (!slot.staffIds.includes(staffId)) {
            slot.staffIds.push(staffId);
            console.log('Staff added successfully. New list:', slot.staffIds);

            // Re-render
            if (context === 'daily') {
                renderDailySlots();
            } else {
                renderDaySlots(context);
            }
            showNotification('success', 'Staff Added', 'Staff member assigned to slot');
        } else {
            showNotification('info', 'Info', 'Staff member already assigned');
        }

        // Hide dropdown
        const dropdown = document.getElementById(`staffDropdown_${slotId}`);
        if (dropdown) dropdown.classList.add('hidden');

    } catch (e) {
        console.error('CRITICAL ERROR:', e);
        alert('Error: ' + e.message);
    }
}

function removeStaffFromSlot(slotId, staffId, context) {
    const slot = findSlot(slotId, context);
    if (!slot) return;

    slot.staffIds = slot.staffIds.filter(id => id !== staffId);

    // Re-render
    if (context === 'daily') {
        renderDailySlots();
    } else {
        renderDaySlots(context);
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function (e) {
    if (!e.target.closest('.add-staff-dropdown') && !e.target.closest('[onclick*="showStaffDropdown"]')) {
        document.querySelectorAll('.add-staff-dropdown').forEach(d => d.classList.add('hidden'));
    }
});

console.log("Script Updated & Loaded: Staff Assignment Fix Active");
