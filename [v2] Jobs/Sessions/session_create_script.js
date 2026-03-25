/**
 * Session Create Script
 * Handles session creation with learning service selection and staff assignment
 */

// ===== STATE MANAGEMENT =====
let allLearningServices = [];
let filteredServices = [];
let selectedService = null;
let selectedServiceType = '';
let selectedAssignments = [];
let useDefaultStaff = true;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadLearningServices();
    initializeEventListeners();
    setMinDate();
});

// ===== DATA LOADING =====
function loadLearningServices() {
    const stored = localStorage.getItem('fms_learning_services');
    
    if (stored) {
        allLearningServices = JSON.parse(stored);
    } else {
        // Load sample data
        allLearningServices = getSampleLearningServices();
        localStorage.setItem('fms_learning_services', JSON.stringify(allLearningServices));
    }
    
    filteredServices = [...allLearningServices];
}

function getSampleLearningServices() {
    return [
        {
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
                duration: 90
            },
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor', skills: 'Math', hourlyRate: 45.00, assignedRate: 50.00 },
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist', skills: 'Calculus', hourlyRate: 40.00, assignedRate: 45.00 }
            ],
            maxCapacity: 20,
            minCapacity: null,
            curriculum: 'College Board AP Calculus AB',
            cohortStartDate: '2025-01-15',
            cohortEndDate: '2025-05-30',
            cohortSize: 20,
            sessionsCount: 45,
            avgEnrollment: 85,
            createdAt: '2024-11-01T10:00:00Z'
        },
        {
            id: 'ls_002',
            name: 'SAT Math Prep Group',
            type: 'Group',
            description: 'Small group SAT Math preparation with focus on problem-solving strategies and test-taking techniques.',
            skillLevel: 'Intermediate',
            status: 'active',
            pricebookItemId: 'pb2',
            pricebookItemName: 'SAT Prep - Group Session',
            pricebookPrice: 35.00,
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Tuesday', 'Thursday'],
                startTime: '17:00',
                endTime: '18:30',
                duration: 90
            },
            staff: [
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist', skills: 'SAT Prep', hourlyRate: 40.00, assignedRate: 45.00 }
            ],
            maxCapacity: 6,
            minCapacity: 2,
            sessionsCount: 24,
            avgEnrollment: 72,
            createdAt: '2024-11-05T14:00:00Z'
        },
        {
            id: 'ls_003',
            name: 'Private Math Tutoring',
            type: 'One-to-One',
            description: 'Personalized one-on-one math tutoring tailored to student needs. Focus on remediation and skill building.',
            skillLevel: 'All levels',
            status: 'active',
            pricebookItemId: 'pb3',
            pricebookItemName: 'Private Tutoring - 1 Hour',
            pricebookPrice: 75.00,
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                startTime: '14:00',
                endTime: '15:00',
                duration: 60
            },
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor', skills: 'Math', hourlyRate: 45.00, assignedRate: 75.00 }
            ],
            maxCapacity: 1,
            minCapacity: null,
            focusArea: 'Remediation',
            personalizationLevel: 'High',
            sessionsCount: 120,
            avgEnrollment: 100,
            createdAt: '2024-10-15T09:00:00Z'
        },
        {
            id: 'ls_004',
            name: 'Chemistry 101',
            type: 'Class',
            description: 'Introduction to Chemistry for high school students. Covers basic concepts, lab work, and practical applications.',
            skillLevel: 'Beginner',
            status: 'active',
            pricebookItemId: 'pb4',
            pricebookItemName: 'Science Course - Semester',
            pricebookPrice: 450.00,
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Wednesday'],
                startTime: '10:00',
                endTime: '11:30',
                duration: 90
            },
            staff: [
                { id: 'staff3', name: 'Michael Chen', role: 'Science Teacher', skills: 'Chemistry', hourlyRate: 38.00, assignedRate: 42.00 }
            ],
            maxCapacity: 15,
            minCapacity: null,
            curriculum: 'High School Chemistry Fundamentals',
            cohortStartDate: '2025-01-20',
            cohortEndDate: '2025-06-15',
            cohortSize: 15,
            sessionsCount: 32,
            avgEnrollment: 90,
            createdAt: '2024-11-10T11:00:00Z'
        },
        {
            id: 'ls_005',
            name: 'Essay Writing Workshop',
            type: 'Group',
            description: 'Collaborative workshop for improving essay writing skills. Focus on structure, argumentation, and style.',
            skillLevel: 'Intermediate',
            status: 'paused',
            pricebookItemId: 'pb5',
            pricebookItemName: 'Writing Workshop',
            pricebookPrice: 30.00,
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Saturday'],
                startTime: '10:00',
                endTime: '12:00',
                duration: 120
            },
            staff: [
                { id: 'staff4', name: 'Sarah Wilson', role: 'English Tutor', skills: 'Writing', hourlyRate: 35.00, assignedRate: 40.00 }
            ],
            maxCapacity: 8,
            minCapacity: 3,
            sessionsCount: 12,
            avgEnrollment: 65,
            createdAt: '2024-09-01T08:00:00Z'
        },
        {
            id: 'ls_006',
            name: 'ACT Prep - Private',
            type: 'One-to-One',
            description: 'Intensive one-on-one ACT preparation with focus on weak areas. Personalized study plan and practice tests.',
            skillLevel: 'All levels',
            status: 'active',
            pricebookItemId: 'pb6',
            pricebookItemName: 'ACT Prep - Private',
            pricebookPrice: 80.00,
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Tuesday', 'Thursday', 'Saturday'],
                startTime: '16:00',
                endTime: '17:30',
                duration: 90
            },
            staff: [
                { id: 'staff5', name: 'David Lee', role: 'Test Prep Specialist', skills: 'ACT', hourlyRate: 50.00, assignedRate: 80.00 }
            ],
            maxCapacity: 1,
            minCapacity: null,
            focusArea: 'Test Preparation',
            personalizationLevel: 'High',
            sessionsCount: 60,
            avgEnrollment: 100,
            createdAt: '2024-10-20T13:00:00Z'
        },
        {
            id: 'ls_007',
            name: 'Physics Advanced',
            type: 'Class',
            description: 'Advanced Physics course covering mechanics, thermodynamics, and electromagnetism. Prepares for AP Physics C.',
            skillLevel: 'Advanced',
            status: 'active',
            pricebookItemId: 'pb7',
            pricebookItemName: 'Advanced Physics - Semester',
            pricebookPrice: 550.00,
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Tuesday', 'Thursday'],
                startTime: '14:00',
                endTime: '15:30',
                duration: 90
            },
            staff: [
                { id: 'staff3', name: 'Michael Chen', role: 'Science Teacher', skills: 'Physics', hourlyRate: 38.00, assignedRate: 42.00 },
                { id: 'staff6', name: 'Robert Kim', role: 'Physics Professor', skills: 'Physics', hourlyRate: 55.00, assignedRate: 60.00 }
            ],
            maxCapacity: 12,
            minCapacity: null,
            curriculum: 'AP Physics C - Mechanics & E&M',
            cohortStartDate: '2025-02-01',
            cohortEndDate: '2025-06-30',
            cohortSize: 12,
            sessionsCount: 40,
            avgEnrollment: 95,
            createdAt: '2024-11-15T10:00:00Z'
        },
        {
            id: 'ls_008',
            name: 'Spanish Conversation Group',
            type: 'Group',
            description: 'Interactive Spanish conversation practice in small groups. Focus on speaking and listening skills.',
            skillLevel: 'Intermediate',
            status: 'active',
            pricebookItemId: 'pb8',
            pricebookItemName: 'Language Group Session',
            pricebookPrice: 25.00,
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Wednesday'],
                startTime: '18:00',
                endTime: '19:00',
                duration: 60
            },
            staff: [
                { id: 'staff7', name: 'Maria Garcia', role: 'Language Instructor', skills: 'Spanish', hourlyRate: 32.00, assignedRate: 35.00 }
            ],
            maxCapacity: 5,
            minCapacity: 2,
            sessionsCount: 30,
            avgEnrollment: 80,
            createdAt: '2024-11-20T09:00:00Z'
        },
        {
            id: 'ls_009',
            name: 'Reading Comprehension Tutoring',
            type: 'One-to-One',
            description: 'Personalized reading comprehension tutoring. Focus on critical thinking and analysis skills.',
            skillLevel: 'All levels',
            status: 'active',
            pricebookItemId: 'pb9',
            pricebookItemName: 'Reading Tutoring',
            pricebookPrice: 70.00,
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
                startTime: '15:00',
                endTime: '16:00',
                duration: 60
            },
            staff: [
                { id: 'staff4', name: 'Sarah Wilson', role: 'English Tutor', skills: 'Reading', hourlyRate: 35.00, assignedRate: 70.00 }
            ],
            maxCapacity: 1,
            minCapacity: null,
            focusArea: 'Skill Building',
            personalizationLevel: 'High',
            sessionsCount: 90,
            avgEnrollment: 100,
            createdAt: '2024-10-25T14:00:00Z'
        },
        {
            id: 'ls_010',
            name: 'Algebra II Mastery',
            type: 'Class',
            description: 'Comprehensive Algebra II course covering polynomials, functions, and advanced equations.',
            skillLevel: 'Intermediate',
            status: 'active',
            pricebookItemId: 'pb10',
            pricebookItemName: 'Math Course - Semester',
            pricebookPrice: 480.00,
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
                startTime: '13:00',
                endTime: '14:30',
                duration: 90
            },
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor', skills: 'Math', hourlyRate: 45.00, assignedRate: 50.00 }
            ],
            maxCapacity: 18,
            minCapacity: null,
            curriculum: 'Algebra II Comprehensive',
            cohortStartDate: '2025-01-10',
            cohortEndDate: '2025-05-20',
            cohortSize: 18,
            sessionsCount: 50,
            avgEnrollment: 88,
            createdAt: '2024-10-30T11:00:00Z'
        }
    ];
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Close autocomplete when clicking outside
    document.addEventListener('click', function (e) {
        const autocomplete = document.getElementById('learningServiceAutocomplete');
        const searchInput = document.getElementById('learningServiceSearch');
        
        if (autocomplete && !autocomplete.contains(e.target) && !searchInput.contains(e.target)) {
            autocomplete.classList.add('hidden');
        }
    });
    
    // Track form changes for summary updates
    document.getElementById('sessionDate')?.addEventListener('change', updateSummary);
    document.getElementById('startTime')?.addEventListener('change', updateSummary);
    document.getElementById('endTime')?.addEventListener('change', updateSummary);
    document.getElementById('sessionStatus')?.addEventListener('change', updateSummary);
    document.getElementById('maxCapacity')?.addEventListener('change', updateSummary);
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('sessionDate').setAttribute('min', today);
}

// ===== TYPE FILTERING =====
function filterByType(type) {
    selectedServiceType = type;
    
    // Update button states
    document.querySelectorAll('.filter-type-btn').forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('active', 'bg-indigo-100', 'border-indigo-300', 'text-indigo-700');
            btn.classList.remove('hover:bg-gray-50');
        } else {
            btn.classList.remove('active', 'bg-indigo-100', 'border-indigo-300', 'text-indigo-700');
            btn.classList.add('hover:bg-gray-50');
        }
    });
    
    // Filter services
    if (type === '') {
        filteredServices = [...allLearningServices];
    } else {
        filteredServices = allLearningServices.filter(service => service.type === type);
    }
    
    // Clear current search if it doesn't match filter
    const searchInput = document.getElementById('learningServiceSearch');
    if (searchInput.value) {
        searchLearningServices(searchInput.value);
    }
}

// ===== SEARCH FUNCTIONALITY =====
function searchLearningServices(query) {
    const autocomplete = document.getElementById('learningServiceAutocomplete');
    
    if (!query || query.trim().length < 1) {
        autocomplete.classList.add('hidden');
        return;
    }
    
    query = query.trim().toLowerCase();
    
    // Filter services based on search query and type filter
    const matching = filteredServices.filter(service => {
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesDescription = service.description?.toLowerCase().includes(query);
        const matchesType = service.type.toLowerCase().includes(query);
        const matchesSkillLevel = service.skillLevel?.toLowerCase().includes(query);
        
        return matchesName || matchesDescription || matchesType || matchesSkillLevel;
    });
    
    if (matching.length === 0) {
        autocomplete.innerHTML = `
            <div class="p-3 text-sm text-gray-500 text-center">
                No learning services found
            </div>
        `;
        autocomplete.classList.remove('hidden');
        return;
    }
    
    // Render results
    autocomplete.innerHTML = matching.map(service => {
        const typeStyles = getTypeStyles(service.type);
        return `
            <div class="p-3 border-b border-gray-200 last:border-b-0 hover:bg-indigo-50 cursor-pointer transition-colors"
                 onclick="selectLearningService('${service.id}')">
                <div class="flex items-start gap-3">
                    <div class="px-2 py-1 text-xs font-medium rounded-full ${typeStyles.badgeClass} flex-shrink-0">
                        ${typeStyles.icon} ${service.type}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-900">${service.name}</p>
                        <p class="text-xs text-gray-500 mt-1 line-clamp-2">${service.description || 'No description'}</p>
                        <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>${service.skillLevel || 'All levels'}</span>
                            <span>•</span>
                            <span>${formatSchedule(service.schedule)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    autocomplete.classList.remove('hidden');
}

function getTypeStyles(type) {
    const styles = {
        'Class': { badgeClass: 'type-badge-class', icon: '📚' },
        'Group': { badgeClass: 'type-badge-group', icon: '👥' },
        'One-to-One': { badgeClass: 'type-badge-one-to-one', icon: '👤' }
    };
    return styles[type] || styles['Class'];
}

function formatSchedule(schedule) {
    if (!schedule) return '-';
    const days = schedule.daysOfWeek?.map(d => d.substring(0, 3)).join(', ') || '-';
    const time = schedule.startTime ? schedule.startTime.substring(0, 5) : '-';
    return `${days} at ${time}`;
}

// ===== SERVICE SELECTION =====
function selectLearningService(serviceId) {
    selectedService = allLearningServices.find(s => s.id === serviceId);
    
    if (!selectedService) return;
    
    // Hide autocomplete
    document.getElementById('learningServiceAutocomplete').classList.add('hidden');
    
    // Set search input value
    document.getElementById('learningServiceSearch').value = selectedService.name;
    
    // Show selected service info
    displaySelectedService();
    
    // Update form based on service
    updateFormForService();
    updateSummary();
}

function displaySelectedService() {
    const infoDiv = document.getElementById('selectedServiceInfo');
    const typeStyles = getTypeStyles(selectedService.type);
    
    // Type badge
    const badge = document.getElementById('serviceTypeBadge');
    badge.className = `px-2 py-1 text-xs font-medium rounded-full ${typeStyles.badgeClass}`;
    badge.textContent = `${typeStyles.icon} ${selectedService.type}`;
    
    // Service details
    document.getElementById('serviceName').textContent = selectedService.name;
    document.getElementById('serviceDescription').textContent = selectedService.description || 'No description';
    document.getElementById('serviceSchedule').textContent = formatSchedule(selectedService.schedule);
    
    // Capacity
    if (selectedService.type === 'One-to-One') {
        document.getElementById('serviceCapacity').textContent = '1 (1:1 Ratio)';
    } else if (selectedService.minCapacity) {
        document.getElementById('serviceCapacity').textContent = `${selectedService.minCapacity}-${selectedService.maxCapacity}`;
    } else {
        document.getElementById('serviceCapacity').textContent = selectedService.maxCapacity || '-';
    }
    
    // Staff
    const staffNames = selectedService.staff?.map(s => s.name).join(', ') || 'None';
    document.getElementById('serviceStaff').textContent = staffNames || 'None';
    
    // Price book
    document.getElementById('servicePricebook').textContent = selectedService.pricebookItemName || '-';
    
    // Show info card
    infoDiv.classList.remove('hidden');
}

function clearServiceSelection() {
    selectedService = null;
    document.getElementById('learningServiceSearch').value = '';
    document.getElementById('selectedServiceInfo').classList.add('hidden');
    document.getElementById('sessionCapacityDisplay').textContent = '-';
    document.getElementById('capacityOneToOne').classList.add('hidden');
    document.getElementById('defaultStaffSection').classList.add('hidden');
    document.getElementById('overrideStaffSection').classList.add('hidden');
    document.getElementById('useDefaultStaff').checked = true;
    useDefaultStaff = true;
    updateSummary();
}

function updateFormForService() {
    if (!selectedService) return;
    
    // Update capacity display
    const capacityDisplay = document.getElementById('sessionCapacityDisplay');
    
    if (selectedService.type === 'One-to-One') {
        document.getElementById('capacityOneToOne').classList.remove('hidden');
        capacityDisplay.textContent = '1 (1:1 Ratio)';
    } else {
        document.getElementById('capacityOneToOne').classList.add('hidden');
        if (selectedService.minCapacity) {
            capacityDisplay.textContent = `Min: ${selectedService.minCapacity}, Max: ${selectedService.maxCapacity}`;
        } else {
            capacityDisplay.textContent = `Max: ${selectedService.maxCapacity}`;
        }
    }
    
    // Update default staff display
    renderDefaultStaff();
    
    // Set default time from service schedule
    if (selectedService.schedule) {
        document.getElementById('startTime').value = selectedService.schedule.startTime || '';
        document.getElementById('endTime').value = selectedService.schedule.endTime || '';
        calculateDuration();
    }
}

function renderDefaultStaff() {
    const container = document.getElementById('defaultStaffList');
    
    if (!selectedService?.staff || selectedService.staff.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500">No default staff assigned</p>';
        return;
    }
    
    container.innerHTML = selectedService.staff.map(staff => `
        <div class="px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs">
            <span class="font-medium text-gray-900">${staff.name}</span>
            <span class="text-gray-500 ml-1">(${staff.role})</span>
        </div>
    `).join('');
    
    document.getElementById('defaultStaffSection').classList.remove('hidden');
}

// ===== STAFF ASSIGNMENT =====
function handleDefaultStaffToggle() {
    useDefaultStaff = document.getElementById('useDefaultStaff').checked;
    
    if (useDefaultStaff) {
        document.getElementById('overrideStaffSection').classList.add('hidden');
        selectedAssignments = [];
    } else {
        document.getElementById('overrideStaffSection').classList.remove('hidden');
    }
    
    updateSummary();
}

// ===== TIME CALCULATION =====
function calculateDuration() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (startTime && endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        let duration = (end - start) / (1000 * 60);
        
        if (duration < 0) duration += 24 * 60; // Handle overnight
        
        document.getElementById('duration').value = duration;
    }
}

// ===== SUMMARY =====
function updateSummary() {
    // Service name
    document.getElementById('summaryServiceName').textContent = selectedService?.name || '-';
    
    // Date
    const date = document.getElementById('sessionDate').value;
    document.getElementById('summaryDate').textContent = date ? formatDate(date) : '-';
    
    // Time
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    if (startTime && endTime) {
        document.getElementById('summaryTime').textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    } else {
        document.getElementById('summaryTime').textContent = '-';
    }
    
    // Duration
    const duration = document.getElementById('duration').value;
    document.getElementById('summaryDuration').textContent = duration ? `${duration} min` : '-';
    
    // Status
    const status = document.getElementById('sessionStatus').value;
    document.getElementById('summaryStatus').textContent = formatStatus(status);
    
    // Capacity (inherited from Learning Service)
    if (selectedService?.type === 'One-to-One') {
        document.getElementById('summaryCapacity').textContent = '1 (1:1)';
    } else if (selectedService?.minCapacity) {
        document.getElementById('summaryCapacity').textContent = `Min: ${selectedService.minCapacity}, Max: ${selectedService.maxCapacity}`;
    } else if (selectedService?.maxCapacity) {
        document.getElementById('summaryCapacity').textContent = selectedService.maxCapacity;
    } else {
        document.getElementById('summaryCapacity').textContent = '-';
    }
    
    // Staff
    if (useDefaultStaff && selectedService?.staff) {
        const staffNames = selectedService.staff.map(s => s.name).join(', ');
        document.getElementById('summaryStaff').textContent = staffNames || 'None';
    } else if (selectedAssignments.length > 0) {
        const staffNames = selectedAssignments.map(a => a.name).join(', ');
        document.getElementById('summaryStaff').textContent = staffNames;
    } else {
        document.getElementById('summaryStaff').textContent = 'None';
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr) {
    if (!timeStr) return '-';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function formatStatus(status) {
    const statusMap = {
        'scheduled': 'Scheduled',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

// ===== FORM SUBMISSION =====
function handleSave() {
    // Validation
    if (!selectedService) {
        alert('Please select a Learning Service');
        return;
    }
    
    const date = document.getElementById('sessionDate').value;
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    // Check if date is in past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
        if (!confirm('Selected date is in the past. Continue anyway?')) {
            return;
        }
    }
    
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (!startTime || !endTime) {
        alert('Please enter both start and end times');
        return;
    }
    
    if (startTime >= endTime) {
        alert('Start time must be before end time');
        return;
    }
    
    // Collect session data
    const sessionData = {
        id: `session_${Date.now()}`,
        learningServiceId: selectedService.id,
        learningServiceName: selectedService.name,
        learningServiceType: selectedService.type,
        date: date,
        startTime: startTime,
        endTime: endTime,
        duration: parseInt(document.getElementById('duration').value) || 0,
        status: document.getElementById('sessionStatus').value,
        maxCapacity: selectedService.type === 'One-to-One' ? 1 : selectedService.maxCapacity,
        minCapacity: selectedService.minCapacity || null,
        staff: useDefaultStaff ? selectedService.staff : selectedAssignments,
        notes: document.getElementById('sessionNotes').value.trim(),
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const stored = localStorage.getItem('fms_sessions');
    let sessions = stored ? JSON.parse(stored) : [];
    sessions.push(sessionData);
    localStorage.setItem('fms_sessions', JSON.stringify(sessions));
    
    // Show success message
    alert(`Session created successfully!\n\n${selectedService.name}\n${formatDate(date)} at ${formatTime(startTime)}`);
    
    // Redirect to session list or detail
    window.location.href = `session_list.html?serviceId=${selectedService.id}`;
}

function goBack() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('serviceId');
    
    if (serviceId) {
        window.location.href = `learning_service_detail.html?id=${serviceId}`;
    } else {
        window.location.href = 'session_list.html';
    }
}

