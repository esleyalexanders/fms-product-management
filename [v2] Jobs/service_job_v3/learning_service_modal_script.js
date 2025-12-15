/**
 * Learning Service Modal Script
 * Handles form logic for creating new Learning Services (Class, Group, One-to-One) within a modal
 */

// ===== STATE MANAGEMENT (Namespaced to avoid conflicts) =====
const ServiceCreation = {
    selectedType: '',
    selectedDays: [],
    selectedStaff: [],
    selectedPricebookItem: null,

    // Sample data (mirrored from original script)
    sampleStaff: [
        { id: 'staff1', name: 'John Smith', role: 'Senior Tutor', skills: ['Math', 'Physics', 'SAT Prep'], avatar: 'JS', type: 'staff', hourlyRate: 45.00 },
        { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist', skills: ['Algebra', 'Calculus', 'AP Math'], avatar: 'ED', type: 'staff', hourlyRate: 40.00 },
        { id: 'staff3', name: 'Michael Chen', role: 'Science Teacher', skills: ['Chemistry', 'Biology', 'Lab Work'], avatar: 'MC', type: 'staff', hourlyRate: 38.00 },
        { id: 'staff4', name: 'Sarah Wilson', role: 'English Tutor', skills: ['Essay Writing', 'Literature', 'Grammar'], avatar: 'SW', type: 'staff', hourlyRate: 35.00 },
        { id: 'staff5', name: 'David Brown', role: 'Test Prep Coach', skills: ['SAT', 'ACT', 'GRE'], avatar: 'DB', type: 'staff', hourlyRate: 50.00 }
    ],

    sampleTeams: [
        { id: 'team1', name: 'Math Department', role: 'Team', members: 4, skills: ['Math', 'Algebra', 'Calculus'], avatar: 'MT', type: 'team', hourlyRate: null },
        { id: 'team2', name: 'Science Team', role: 'Team', members: 3, skills: ['Physics', 'Chemistry', 'Biology'], avatar: 'ST', type: 'team', hourlyRate: null },
        { id: 'team3', name: 'Test Prep Squad', role: 'Team', members: 5, skills: ['SAT', 'ACT', 'GRE', 'GMAT'], avatar: 'TP', type: 'team', hourlyRate: null }
    ],

    samplePricebookItems: [
        { id: 'pb1', name: 'Private Tutoring - 1 Hour', price: 75.00, unit: 'session', category: 'Tutoring' },
        { id: 'pb2', name: 'Group Class - Math', price: 35.00, unit: 'session', category: 'Classes' },
        { id: 'pb3', name: 'SAT Prep Course', price: 299.00, unit: 'course', category: 'Test Prep' },
        { id: 'pb4', name: 'Small Group Session (2-4)', price: 45.00, unit: 'session', category: 'Groups' },
        { id: 'pb5', name: 'AP Calculus Course', price: 450.00, unit: 'course', category: 'Classes' },
        { id: 'pb6', name: 'Essay Writing Workshop', price: 25.00, unit: 'session', category: 'Workshops' }
    ]
};

// ===== INITIALIZATION =====
function initServiceCreation() {
    initializeDaySelectors();
    initializeStaffSearch();
    initializePricebookModal();
    // updateCapacityFieldsVisibility() will be called when type is selected or modal opens
}

function openServiceCreationModal() {
    const modal = document.getElementById('createServiceModal');
    if (modal) {
        // Reset form state
        ServiceCreation.selectedType = '';
        ServiceCreation.selectedDays = [];
        ServiceCreation.selectedStaff = [];
        ServiceCreation.selectedPricebookItem = null;

        document.getElementById('learningServiceForm').reset();

        // Clear selections in UI
        document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
        document.querySelectorAll('.day-selector').forEach(b => b.classList.remove('selected'));
        document.getElementById('selectedAssignmentsList').innerHTML = '';
        document.getElementById('selectedAssignmentsCount').textContent = '0';
        document.getElementById('noAssignmentsSelected').style.display = 'block';

        clearPricebookSelection();

        // Hide type fields
        document.getElementById('classTypeFields').classList.add('hidden');
        document.getElementById('groupTypeFields').classList.add('hidden');
        document.getElementById('oneToOneTypeFields').classList.add('hidden');
        document.getElementById('typeError').classList.add('hidden');

        // Show modal
        modal.classList.remove('hidden');
    }
}

function closeServiceCreationModal() {
    const modal = document.getElementById('createServiceModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// ===== TYPE SELECTION =====
function selectServiceType(type) {
    ServiceCreation.selectedType = type;
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
    const maxCapacityField = document.getElementById('maxCapacityField');
    const oneToOneCapacityMessage = document.getElementById('oneToOneCapacityMessage');

    if (ServiceCreation.selectedType === 'One-to-One') {
        maxCapacityField.classList.add('hidden');
        oneToOneCapacityMessage.classList.remove('hidden');
        document.getElementById('maxCapacity').value = 1;
        document.getElementById('maxCapacity').required = false;
    } else {
        maxCapacityField.classList.remove('hidden');
        oneToOneCapacityMessage.classList.add('hidden');
        document.getElementById('maxCapacity').required = true;
        if (ServiceCreation.selectedType === 'Class' || ServiceCreation.selectedType === 'Group') {
            if (document.getElementById('maxCapacity').value == 1) {
                document.getElementById('maxCapacity').value = 10;
            }
        }
    }
}

function updateScheduleDateRequirements() {
    const scheduleStartRequired = document.getElementById('scheduleStartRequired');
    const scheduleEndRequired = document.getElementById('scheduleEndRequired');

    if (ServiceCreation.selectedType === 'Class') {
        scheduleStartRequired.classList.remove('hidden');
        scheduleEndRequired.classList.remove('hidden');
    } else {
        scheduleStartRequired.classList.add('hidden');
        scheduleEndRequired.classList.add('hidden');
    }
}

// ===== DAY SELECTORS =====
function initializeDaySelectors() {
    document.querySelectorAll('.day-selector').forEach(btn => {
        // Remove existing listener to avoid duplicates if re-initialized
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', function () {
            const day = this.dataset.day;
            toggleDaySelection(this, day);
        });
    });
}

function toggleDaySelection(button, day) {
    if (ServiceCreation.selectedDays.includes(day)) {
        ServiceCreation.selectedDays = ServiceCreation.selectedDays.filter(d => d !== day);
        button.classList.remove('selected');
    } else {
        ServiceCreation.selectedDays.push(day);
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

    // Replace element to remove old listeners
    const newInput = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(newInput, searchInput);

    newInput.addEventListener('input', function () {
        const query = this.value.toLowerCase().trim();

        if (query.length < 2) {
            autocomplete.classList.add('hidden');
            return;
        }

        // Search both staff and teams
        const filteredStaff = ServiceCreation.sampleStaff.filter(staff => {
            const inName = staff.name.toLowerCase().includes(query);
            const inRole = staff.role.toLowerCase().includes(query);
            const inSkills = staff.skills.some(s => s.toLowerCase().includes(query));
            const notSelected = !ServiceCreation.selectedStaff.find(s => s.id === staff.id);
            return (inName || inRole || inSkills) && notSelected;
        });

        const filteredTeams = ServiceCreation.sampleTeams.filter(team => {
            const inName = team.name.toLowerCase().includes(query);
            const inSkills = team.skills.some(s => s.toLowerCase().includes(query));
            const notSelected = !ServiceCreation.selectedStaff.find(s => s.id === team.id);
            return (inName || inSkills) && notSelected;
        });

        renderAssignmentAutocomplete(filteredStaff, filteredTeams);
    });

    // Close autocomplete when clicking outside
    document.addEventListener('click', function (e) {
        if (!newInput.contains(e.target) && !autocomplete.contains(e.target)) {
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
        assignment = ServiceCreation.sampleTeams.find(t => t.id === id);
    } else {
        assignment = ServiceCreation.sampleStaff.find(s => s.id === id);
    }

    if (assignment && !ServiceCreation.selectedStaff.find(s => s.id === id)) {
        // Add with assignedRate defaulting to hourlyRate from staff profile
        ServiceCreation.selectedStaff.push({
            ...assignment,
            type,
            assignedRate: assignment.hourlyRate || null  // Default to profile rate
        });
        renderSelectedAssignments();
        renderRecommendedAssignments();
    }

    const input = document.getElementById('assignmentSearchInput');
    if (input) input.value = '';

    document.getElementById('assignmentAutocomplete').classList.add('hidden');
}

function removeAssignment(id) {
    ServiceCreation.selectedStaff = ServiceCreation.selectedStaff.filter(s => s.id !== id);
    renderSelectedAssignments();
    renderRecommendedAssignments();
}

function renderSelectedAssignments() {
    const container = document.getElementById('selectedAssignmentsList');
    const countElement = document.getElementById('selectedAssignmentsCount');
    const noAssignmentsMessage = document.getElementById('noAssignmentsSelected');
    const staffError = document.getElementById('staffError');

    countElement.textContent = ServiceCreation.selectedStaff.length;

    if (ServiceCreation.selectedStaff.length === 0) {
        container.innerHTML = '';
        if (noAssignmentsMessage) noAssignmentsMessage.style.display = 'block';
    } else {
        if (noAssignmentsMessage) noAssignmentsMessage.style.display = 'none';
        if (staffError) staffError.classList.add('hidden');

        container.innerHTML = ServiceCreation.selectedStaff.map(item => {
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
    const assignment = ServiceCreation.selectedStaff.find(s => s.id === id);
    if (assignment) {
        assignment.assignedRate = parseFloat(rate) || assignment.hourlyRate;
    }
}

function resetAssignmentRate(id) {
    const assignment = ServiceCreation.selectedStaff.find(s => s.id === id);
    if (assignment) {
        assignment.assignedRate = assignment.hourlyRate;
        renderSelectedAssignments();
    }
}

function renderRecommendedAssignments() {
    const container = document.getElementById('recommendedAssignmentsList');
    if (!container) return;

    // Get available staff/teams not already selected
    const availableStaff = ServiceCreation.sampleStaff.filter(s => !ServiceCreation.selectedStaff.find(sel => sel.id === s.id));
    const availableTeams = ServiceCreation.sampleTeams.filter(t => !ServiceCreation.selectedStaff.find(sel => sel.id === t.id));

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
}

// ===== PRICEBOOK MODAL =====
function initializePricebookModal() {
    const searchInput = document.getElementById('pricebookSearch');
    if (searchInput) {
        // Clone to remove old listeners
        const newInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newInput, searchInput);

        newInput.addEventListener('input', function () {
            renderPricebookList(this.value);
        });
    }
}

function showPricebookModal() {
    document.getElementById('pricebookModal').classList.remove('hidden');
    const input = document.getElementById('pricebookSearch');
    if (input) input.value = '';
    renderPricebookList('');
}

function closePricebookModal() {
    document.getElementById('pricebookModal').classList.add('hidden');
}

function renderPricebookList(query) {
    const container = document.getElementById('pricebookList');
    const filteredItems = ServiceCreation.samplePricebookItems.filter(item => {
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
        container.innerHTML = filteredItems.map(item => `
            <div class="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-colors" onclick="selectPricebookItem('${item.id}')">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-medium text-gray-900">${item.name}</p>
                        <p class="text-sm text-gray-500">${item.category} • per ${item.unit}</p>
                    </div>
                    <span class="text-lg font-semibold text-indigo-600">$${item.price.toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    }
}

function selectPricebookItem(itemId) {
    const item = ServiceCreation.samplePricebookItems.find(i => i.id === itemId);
    if (item) {
        ServiceCreation.selectedPricebookItem = item;
        document.getElementById('pricebookItemId').value = item.id;
        document.getElementById('selectedPricebookName').textContent = item.name;
        document.getElementById('selectedPricebookPrice').textContent = `$${item.price.toFixed(2)} per ${item.unit}`;

        document.getElementById('selectPricebookBtn').classList.add('hidden');
        document.getElementById('selectedPricebookDisplay').classList.remove('hidden');

        closePricebookModal();
    }
}

function clearPricebookSelection() {
    ServiceCreation.selectedPricebookItem = null;
    document.getElementById('pricebookItemId').value = '';
    document.getElementById('selectPricebookBtn').classList.remove('hidden');
    document.getElementById('selectedPricebookDisplay').classList.add('hidden');
}

// ===== FORM VALIDATION =====
function validateServiceForm() {
    let isValid = true;
    const errors = [];

    // Validate type selection
    if (!ServiceCreation.selectedType) {
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
    if (ServiceCreation.selectedType === 'Class') {
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

    if (ServiceCreation.selectedType === 'Group') {
        const minCapacity = document.getElementById('minCapacity').value;
        if (!minCapacity || parseInt(minCapacity) < 2) {
            errors.push('Minimum capacity must be at least 2 for Group type');
            isValid = false;
        }
    }

    // Validate schedule times
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    if (!startTime || !endTime) {
        errors.push('Start and end time are required');
        isValid = false;
    }

    // Show validation errors
    if (!isValid) {
        // We'll use the notification system from the calendar page if available, or alert
        if (typeof showNotification === 'function') {
            showNotification('error', 'Validation Error', errors.join('. '));
        } else {
            alert(errors.join('\n'));
        }
    }

    return isValid;
}

// ===== FORM SUBMISSION =====
function handleServiceSubmit(event) {
    event.preventDefault();

    if (!validateServiceForm()) {
        return;
    }

    // Collect form data
    const formData = {
        id: 'ls_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        type: ServiceCreation.selectedType,
        name: document.getElementById('serviceName').value.trim(),
        description: document.getElementById('description').value.trim(),
        skillLevel: document.getElementById('skillLevel').value,
        status: 'active',
        pricebookItemId: ServiceCreation.selectedPricebookItem?.id || null,
        pricebookItemName: ServiceCreation.selectedPricebookItem?.name || null,
        schedule: {
            frequency: document.getElementById('frequency').value,
            daysOfWeek: ServiceCreation.selectedDays,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            duration: parseInt(document.getElementById('duration').value) || 0,
            startDate: document.getElementById('scheduleStartDate').value || null,
            endDate: document.getElementById('scheduleEndDate').value || null,
            customInterval: document.getElementById('customInterval').value || null,
            customIntervalUnit: document.getElementById('customIntervalUnit').value || null
        },
        staff: ServiceCreation.selectedStaff.map(s => ({
            id: s.id,
            name: s.name,
            role: s.role,
            type: s.type,
            hourlyRate: s.hourlyRate,
            assignedRate: s.assignedRate || s.hourlyRate
        })),
        maxCapacity: ServiceCreation.selectedType === 'One-to-One' ? 1 : parseInt(document.getElementById('maxCapacity').value),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Add type-specific fields
    if (ServiceCreation.selectedType === 'Class') {
        formData.curriculum = document.getElementById('curriculum').value.trim();
        formData.cohortStartDate = document.getElementById('cohortStartDate').value;
        formData.cohortEndDate = document.getElementById('cohortEndDate').value;
        formData.cohortSize = parseInt(document.getElementById('cohortSize').value) || null;
    } else if (ServiceCreation.selectedType === 'Group') {
        formData.minCapacity = parseInt(document.getElementById('minCapacity').value);
    } else if (ServiceCreation.selectedType === 'One-to-One') {
        formData.focusArea = document.getElementById('focusArea').value.trim();
        formData.personalizationLevel = document.getElementById('personalizationLevel').value;
    }

    // Save to localStorage
    const storageKey = 'fms_learning_services';
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existing.push(formData);
    localStorage.setItem(storageKey, JSON.stringify(existing));

    // Success and Close
    if (typeof showNotification === 'function') {
        showNotification('success', 'Success', 'Learning Service created successfully!');
    } else {
        alert('Learning Service created successfully!');
    }

    closeServiceCreationModal();

    // Refresh calendar if available
    if (typeof loadEvents === 'function') {
        // Minor delay to allow local storage msg to propagate if real app, but here just direct refresh
        loadEvents();
    }
}
