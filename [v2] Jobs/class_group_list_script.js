// Sample class/group enrollment jobs data
let allClasses = [
    {
        id: 'JOB-2024-028',
        name: 'Advanced Math Tutoring - All grade levels',
        scheduleDate: '2024-11-13',
        startTime: '09:00',
        endTime: '17:00',
        status: 'scheduled',
        assignedStaff: ['Daniel Davis'],
        total: 2400.00,
        classMode: {
            enabled: true,
            name: 'Advanced Math Tutoring - All grade levels',
            maxCapacity: 20,
            waitlistEnabled: true,
            skillLevel: 'All grade levels',
            pricebookItem: {
                id: 'PB-MATH-TUTORING',
                name: 'Math Tutoring - Group Session'
            }
        },
        bookings: [
            { id: 'booking-001', quoteId: 'Q-2024-015', slots: 2, customerName: 'Student 1', status: 'confirmed' },
            { id: 'booking-002', quoteId: 'Q-2024-016', slots: 1, customerName: 'Student 2', status: 'confirmed' },
            { id: 'booking-003', quoteId: 'Q-2024-017', slots: 1, customerName: 'Student 3', status: 'confirmed' }
        ]
    },
    {
        id: 'JOB-2024-029',
        name: 'Tuesday Evening Yoga',
        scheduleDate: '2024-11-14',
        startTime: '18:00',
        endTime: '19:00',
        status: 'scheduled',
        assignedStaff: ['Jennifer White'],
        total: 1500.00,
        classMode: {
            enabled: true,
            name: 'Tuesday Evening Yoga',
            maxCapacity: 15,
            waitlistEnabled: false,
            skillLevel: 'All levels',
            pricebookItem: {
                id: 'PB-YOGA-CLASS',
                name: 'Yoga Class - Group (per seat)'
            }
        },
        bookings: [
            { id: 'booking-004', quoteId: 'Q-2024-010', slots: 1, customerName: 'Sarah Johnson', status: 'confirmed' },
            { id: 'booking-005', quoteId: 'Q-2024-011', slots: 1, customerName: 'John Smith', status: 'confirmed' },
            { id: 'booking-006', quoteId: 'Q-2024-012', slots: 1, customerName: 'Mike Wilson', status: 'confirmed' },
            { id: 'booking-007', quoteId: 'Q-2024-013', slots: 1, customerName: 'Emma Davis', status: 'confirmed' }
        ]
    },
    {
        id: 'JOB-2024-030',
        name: 'Algebra II Group Tutoring',
        scheduleDate: '2024-11-15',
        startTime: '16:00',
        endTime: '18:00',
        status: 'scheduled',
        assignedStaff: ['Daniel Davis'],
        total: 400.00,
        classMode: {
            enabled: true,
            name: 'Algebra II Group Tutoring',
            maxCapacity: 20,
            waitlistEnabled: false,
            skillLevel: 'Grade 9-12',
            pricebookItem: {
                id: 'PB-ALGEBRA-II',
                name: 'Algebra II - Group Session'
            }
        },
        bookings: [
            { id: 'booking-008', quoteId: 'Q-2024-020', slots: 1, customerName: 'Student A', status: 'confirmed' },
            { id: 'booking-009', quoteId: 'Q-2024-021', slots: 1, customerName: 'Student B', status: 'confirmed' },
            { id: 'booking-010', quoteId: 'Q-2024-022', slots: 1, customerName: 'Student C', status: 'confirmed' },
            { id: 'booking-011', quoteId: 'Q-2024-023', slots: 1, customerName: 'Student D', status: 'confirmed' },
            { id: 'booking-012', quoteId: 'Q-2024-024', slots: 1, customerName: 'Student E', status: 'confirmed' },
            { id: 'booking-013', quoteId: 'Q-2024-025', slots: 1, customerName: 'Student F', status: 'confirmed' },
            { id: 'booking-014', quoteId: 'Q-2024-026', slots: 1, customerName: 'Student G', status: 'confirmed' },
            { id: 'booking-015', quoteId: 'Q-2024-027', slots: 1, customerName: 'Student H', status: 'confirmed' },
            { id: 'booking-016', quoteId: 'Q-2024-028', slots: 1, customerName: 'Student I', status: 'confirmed' },
            { id: 'booking-017', quoteId: 'Q-2024-029', slots: 1, customerName: 'Student J', status: 'confirmed' },
            { id: 'booking-018', quoteId: 'Q-2024-030', slots: 1, customerName: 'Student K', status: 'confirmed' },
            { id: 'booking-019', quoteId: 'Q-2024-031', slots: 1, customerName: 'Student L', status: 'confirmed' },
            { id: 'booking-020', quoteId: 'Q-2024-032', slots: 1, customerName: 'Student M', status: 'confirmed' },
            { id: 'booking-021', quoteId: 'Q-2024-033', slots: 1, customerName: 'Student N', status: 'confirmed' },
            { id: 'booking-022', quoteId: 'Q-2024-034', slots: 1, customerName: 'Student O', status: 'confirmed' },
            { id: 'booking-023', quoteId: 'Q-2024-035', slots: 1, customerName: 'Student P', status: 'confirmed' },
            { id: 'booking-024', quoteId: 'Q-2024-036', slots: 1, customerName: 'Student Q', status: 'confirmed' },
            { id: 'booking-025', quoteId: 'Q-2024-037', slots: 1, customerName: 'Student R', status: 'confirmed' }
        ]
    },
    {
        id: 'JOB-2024-031',
        name: 'Beginner Guitar Techniques',
        scheduleDate: '2024-11-12',
        startTime: '10:00',
        endTime: '11:30',
        status: 'in_progress',
        assignedStaff: ['James Wilson'],
        total: 350.00,
        classMode: {
            enabled: true,
            name: 'Beginner Guitar Techniques',
            maxCapacity: 10,
            waitlistEnabled: false,
            skillLevel: 'Beginner',
            pricebookItem: {
                id: 'PB-GUITAR-SESSION',
                name: 'Guitar Workshop - Group (per seat)'
            }
        },
        bookings: [
            { id: 'booking-026', quoteId: 'Q-2024-040', slots: 1, customerName: 'Participant 1', status: 'confirmed' },
            { id: 'booking-027', quoteId: 'Q-2024-041', slots: 1, customerName: 'Participant 2', status: 'confirmed' },
            { id: 'booking-028', quoteId: 'Q-2024-042', slots: 1, customerName: 'Participant 3', status: 'confirmed' },
            { id: 'booking-029', quoteId: 'Q-2024-043', slots: 1, customerName: 'Participant 4', status: 'confirmed' },
            { id: 'booking-030', quoteId: 'Q-2024-044', slots: 1, customerName: 'Participant 5', status: 'confirmed' },
            { id: 'booking-031', quoteId: 'Q-2024-045', slots: 1, customerName: 'Participant 6', status: 'confirmed' },
            { id: 'booking-032', quoteId: 'Q-2024-046', slots: 1, customerName: 'Participant 7', status: 'confirmed' },
            { id: 'booking-033', quoteId: 'Q-2024-047', slots: 1, customerName: 'Participant 8', status: 'confirmed' }
        ]
    },
    {
        id: 'JOB-2024-032',
        name: 'Physics Experiment Group',
        scheduleDate: '2024-11-14',
        startTime: '13:00',
        endTime: '15:00',
        status: 'scheduled',
        assignedStaff: ['Sarah Johnson'],
        total: 600.00,
        classMode: {
            enabled: true,
            name: 'Physics Experiment Group',
            maxCapacity: 12,
            waitlistEnabled: true,
            skillLevel: 'Advanced',
            pricebookItem: {
                id: 'PB-PHYSICS-WORKSHOP',
                name: 'Physics Workshop - Group'
            }
        },
        bookings: [
            { id: 'booking-034', quoteId: 'Q-2024-050', slots: 1, customerName: 'Science Student 1', status: 'confirmed' },
            { id: 'booking-035', quoteId: 'Q-2024-051', slots: 1, customerName: 'Science Student 2', status: 'confirmed' },
            { id: 'booking-036', quoteId: 'Q-2024-052', slots: 1, customerName: 'Science Student 3', status: 'confirmed' },
            { id: 'booking-037', quoteId: 'Q-2024-053', slots: 1, customerName: 'Science Student 4', status: 'confirmed' },
            { id: 'booking-038', quoteId: 'Q-2024-054', slots: 1, customerName: 'Science Student 5', status: 'confirmed' },
            { id: 'booking-039', quoteId: 'Q-2024-055', slots: 1, customerName: 'Science Student 6', status: 'confirmed' },
            { id: 'booking-040', quoteId: 'Q-2024-056', slots: 1, customerName: 'Science Student 7', status: 'confirmed' },
            { id: 'booking-041', quoteId: 'Q-2024-057', slots: 1, customerName: 'Science Student 8', status: 'confirmed' },
            { id: 'booking-042', quoteId: 'Q-2024-058', slots: 1, customerName: 'Science Student 9', status: 'confirmed' },
            { id: 'booking-043', quoteId: 'Q-2024-059', slots: 1, customerName: 'Science Student 10', status: 'confirmed' },
            { id: 'booking-044', quoteId: 'Q-2024-060', slots: 1, customerName: 'Science Student 11', status: 'confirmed' },
            { id: 'booking-045', quoteId: 'Q-2024-061', slots: 1, customerName: 'Science Student 12', status: 'confirmed' },
            { id: 'booking-046', quoteId: 'Q-2024-062', slots: 1, customerName: 'Science Student 13', status: 'waitlisted' },
            { id: 'booking-047', quoteId: 'Q-2024-063', slots: 1, customerName: 'Science Student 14', status: 'waitlisted' }
        ]
    }
];

let filteredClasses = [...allClasses];
let sortBy = 'date_desc';

// Load classes from localStorage (if available)
function loadClassesFromStorage() {
    try {
        const stored = localStorage.getItem('classGroupJobs');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                allClasses = parsed;
                filteredClasses = [...allClasses];
            }
        }
    } catch (e) {
        console.error('Error loading classes from storage:', e);
    }
}

// Save classes to localStorage
function saveClassesToStorage() {
    try {
        localStorage.setItem('classGroupJobs', JSON.stringify(allClasses));
    } catch (e) {
        console.error('Error saving classes to storage:', e);
    }
}

// Initialize page
function initializePage() {
    loadClassesFromStorage();
    updateStatistics();
    renderClasses();
    
    // Setup event listeners
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);
    document.getElementById('dateFilter').addEventListener('change', handleFilter);
    document.getElementById('sortBy').addEventListener('change', handleSort);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
}

// Update statistics
function updateStatistics() {
    const totalClasses = allClasses.length;
    const totalEnrollment = allClasses.reduce((sum, cls) => {
        const confirmedSlots = (cls.bookings || []).filter(b => b.status === 'confirmed').reduce((s, b) => s + b.slots, 0);
        return sum + confirmedSlots;
    }, 0);
    const waitlisted = allClasses.reduce((sum, cls) => {
        const waitlistedSlots = (cls.bookings || []).filter(b => b.status === 'waitlisted').reduce((s, b) => s + b.slots, 0);
        return sum + waitlistedSlots;
    }, 0);
    
    let totalCapacity = 0;
    let totalFilled = 0;
    allClasses.forEach(cls => {
        if (cls.classMode?.enabled) {
            totalCapacity += cls.classMode.maxCapacity || 0;
            const confirmedSlots = (cls.bookings || []).filter(b => b.status === 'confirmed').reduce((s, b) => s + b.slots, 0);
            totalFilled += confirmedSlots;
        }
    });
    const avgOccupancy = totalCapacity > 0 ? Math.round((totalFilled / totalCapacity) * 100) : 0;
    
    document.getElementById('totalClassesCount').textContent = totalClasses;
    document.getElementById('totalEnrollmentCount').textContent = totalEnrollment;
    document.getElementById('waitlistedCount').textContent = waitlisted;
    document.getElementById('avgOccupancy').textContent = avgOccupancy + '%';
}

// Handle search
function handleSearch(e) {
    searchTerm = e.target.value.toLowerCase();
    filterAndSortClasses();
}

// Handle filter changes
function handleFilter() {
    filterAndSortClasses();
}

// Handle sort changes
function handleSort() {
    sortBy = document.getElementById('sortBy').value;
    filterAndSortClasses();
}

// Filter and sort classes
function filterAndSortClasses() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const query = searchTerm;
    
    let filtered = allClasses.filter(cls => {
        // Search filter
        if (query) {
            const searchable = [
                cls.classMode?.name || cls.name,
                cls.classMode?.skillLevel || '',
                cls.assignedStaff?.join(' ') || '',
                cls.classMode?.pricebookItem?.name || ''
            ].join(' ').toLowerCase();
            if (!searchable.includes(query)) {
                return false;
            }
        }
        
        // Status filter
        if (statusFilter !== 'all') {
            const classStatus = getClassStatus(cls);
            if (statusFilter === 'upcoming' && classStatus !== 'upcoming') return false;
            if (statusFilter === 'active' && classStatus !== 'active') return false;
            if (statusFilter === 'full' && classStatus !== 'full') return false;
            if (statusFilter === 'completed' && cls.status !== 'completed') return false;
            if (statusFilter === 'cancelled' && cls.status !== 'cancelled') return false;
        }
        
        // Date filter
        if (dateFilter !== 'all' && cls.scheduleDate) {
            const classDate = new Date(cls.scheduleDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (dateFilter === 'today') {
                if (classDate.toDateString() !== today.toDateString()) return false;
            } else if (dateFilter === 'this_week') {
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                if (classDate < weekStart || classDate > weekEnd) return false;
            } else if (dateFilter === 'this_month') {
                if (classDate.getMonth() !== today.getMonth() || classDate.getFullYear() !== today.getFullYear()) return false;
            } else if (dateFilter === 'upcoming') {
                if (classDate < today) return false;
            } else if (dateFilter === 'past') {
                if (classDate >= today) return false;
            }
        }
        
        return true;
    });
    
    // Sort
    switch (sortBy) {
        case 'date_asc':
            filtered.sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate));
            break;
        case 'date_desc':
            filtered.sort((a, b) => new Date(b.scheduleDate) - new Date(a.scheduleDate));
            break;
        case 'name':
            filtered.sort((a, b) => (a.classMode?.name || a.name).localeCompare(b.classMode?.name || b.name));
            break;
    }
    
    filteredClasses = filtered;
    renderClasses();
}

let searchTerm = '';

// Get class status
function getClassStatus(cls) {
    if (cls.status === 'completed') return 'completed';
    if (cls.status === 'cancelled') return 'cancelled';
    
    const confirmedSlots = (cls.bookings || []).filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.slots, 0);
    const capacity = cls.classMode?.maxCapacity || 0;
    
    if (confirmedSlots >= capacity) return 'full';
    
    const classDate = cls.scheduleDate ? new Date(cls.scheduleDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (classDate && classDate < today) return 'completed';
    if (classDate && classDate >= today) return 'upcoming';
    
    if (cls.status === 'in_progress') return 'active';
    
    return 'upcoming';
}

// Get status badge HTML
function getStatusBadge(status) {
    const badges = {
        created: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">📝 Created</span>',
        scheduled: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">📋 Scheduled</span>',
        in_progress: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">🔄 In Progress</span>',
        completed: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">✅ Completed</span>',
        cancelled: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">❌ Cancelled</span>'
    };
    return badges[status] || badges.created;
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Render classes
function renderClasses() {
    filterAndSortClasses();
    updateStatistics();
    
    const container = document.getElementById('classesList');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');
    
    resultsCount.textContent = `Showing ${filteredClasses.length} class${filteredClasses.length !== 1 ? 'es' : ''}`;
    
    if (filteredClasses.length === 0) {
        emptyState.classList.remove('hidden');
        container.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    container.classList.remove('hidden');
    
    container.innerHTML = filteredClasses.map(cls => createClassListItem(cls)).join('');
}

// Create class card (grid view)
function createClassCard(cls) {
    const classInfo = cls.classMode;
    const participants = classInfo?.participants || [];
    const participantCount = participants.length;
    const capacity = classInfo?.capacity || 0;
    const occupancyPercent = capacity > 0 ? Math.round((participantCount / capacity) * 100) : 0;
    const waitlistedCount = participants.filter(p => p.status === 'waitlisted').length;
    const status = getClassStatus(cls);
    
    const statusConfig = {
        upcoming: { color: 'blue', text: 'Upcoming', emoji: '📅' },
        active: { color: 'green', text: 'Active', emoji: '🔄' },
        full: { color: 'purple', text: 'Full', emoji: '✅' },
        completed: { color: 'gray', text: 'Completed', emoji: '✓' },
        cancelled: { color: 'red', text: 'Cancelled', emoji: '❌' }
    };
    
    const statusInfo = statusConfig[status] || statusConfig.upcoming;
    const scheduleDate = cls.scheduleDate ? new Date(cls.scheduleDate).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
    }) : 'Not scheduled';
    const timeRange = cls.endTime ? `${cls.scheduleTime} - ${cls.endTime}` : cls.scheduleTime;
    
    return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 class-card overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3">
                <div class="flex items-start justify-between mb-2">
                    <h3 class="text-lg font-bold text-white truncate flex-1">${classInfo?.name || cls.name}</h3>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-white bg-opacity-20 text-white ml-2">
                        ${statusInfo.emoji} ${statusInfo.text}
                    </span>
                </div>
                <div class="flex items-center gap-2 text-emerald-100 text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>${scheduleDate}</span>
                    <span>•</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>${timeRange}</span>
                </div>
            </div>
            
            <!-- Body -->
            <div class="p-4 space-y-4">
                <!-- Enrollment Stats -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Enrollment</span>
                        <span class="text-sm font-bold text-gray-900">${participantCount}/${capacity}</span>
                    </div>
                    <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            class="h-full enrollment-progress ${occupancyPercent >= 100 ? 'bg-purple-500' : occupancyPercent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}" 
                            style="width: ${Math.min(occupancyPercent, 100)}%"
                        ></div>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                        <span class="text-xs text-gray-500">${occupancyPercent}% full</span>
                        ${waitlistedCount > 0 ? `<span class="text-xs text-amber-600 font-medium">${waitlistedCount} waitlisted</span>` : ''}
                    </div>
                </div>
                
                <!-- Details -->
                <div class="space-y-2 text-sm">
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span class="text-gray-600">Instructor:</span>
                        <span class="font-medium text-gray-900">${cls.assignedStaff?.[0] || 'Unassigned'}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <span class="text-gray-600">Skill Level:</span>
                        <span class="font-medium text-gray-900">${classInfo?.skillLevel || 'All levels'}</span>
                    </div>
                    ${classInfo?.waitlistEnabled ? `
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-xs text-amber-600 font-medium">Waitlist enabled</span>
                    </div>
                    ` : ''}
                </div>
                
                <!-- Pricebook Items -->
                ${classInfo?.pricebookItems && classInfo.pricebookItems.length > 0 ? `
                <div class="pt-2 border-t border-gray-200">
                    <p class="text-xs text-gray-500 mb-1">Services:</p>
                    <div class="flex flex-wrap gap-1">
                        ${classInfo.pricebookItems.map(item => `
                            <span class="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">${item.name}</span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            
            <!-- Footer Actions -->
            <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
                <button 
                    onclick="viewClassDetails('${cls.id}')"
                    class="flex-1 px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                    View Details
                </button>
                <button 
                    onclick="manageParticipants('${cls.id}')"
                    class="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    title="Manage Participants"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// Create class list item (list view)
function createClassListItem(cls) {
    const classInfo = cls.classMode;
    const participants = classInfo?.participants || [];
    const participantCount = participants.length;
    const capacity = classInfo?.capacity || 0;
    const occupancyPercent = capacity > 0 ? Math.round((participantCount / capacity) * 100) : 0;
    const status = getClassStatus(cls);
    
    const statusConfig = {
        upcoming: { color: 'blue', text: 'Upcoming', emoji: '📅' },
        active: { color: 'green', text: 'Active', emoji: '🔄' },
        full: { color: 'purple', text: 'Full', emoji: '✅' },
        completed: { color: 'gray', text: 'Completed', emoji: '✓' },
        cancelled: { color: 'red', text: 'Cancelled', emoji: '❌' }
    };
    
    const statusInfo = statusConfig[status] || statusConfig.upcoming;
    const scheduleDate = cls.scheduleDate ? new Date(cls.scheduleDate).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
    }) : 'Not scheduled';
    const timeRange = cls.endTime ? `${cls.scheduleTime} - ${cls.endTime}` : cls.scheduleTime;
    
    return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 class-card">
            <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-bold text-gray-900 truncate">${classInfo?.name || cls.name}</h3>
                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-${statusInfo.color}-100 text-${statusInfo.color}-700">
                            ${statusInfo.emoji} ${statusInfo.text}
                        </span>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span class="text-gray-500">Date:</span>
                            <span class="font-medium text-gray-900 ml-1">${scheduleDate}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">Time:</span>
                            <span class="font-medium text-gray-900 ml-1">${timeRange}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">Enrollment:</span>
                            <span class="font-medium text-gray-900 ml-1">${participantCount}/${capacity}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">Instructor:</span>
                            <span class="font-medium text-gray-900 ml-1">${cls.assignedStaff?.[0] || 'Unassigned'}</span>
                        </div>
                    </div>
                    <div class="mt-2">
                        <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden max-w-md">
                            <div 
                                class="h-full enrollment-progress ${occupancyPercent >= 100 ? 'bg-purple-500' : occupancyPercent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}" 
                                style="width: ${Math.min(occupancyPercent, 100)}%"
                            ></div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2 ml-4">
                    <button 
                        onclick="viewClassDetails('${cls.id}')"
                        class="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                        View
                    </button>
                    <button 
                        onclick="manageParticipants('${cls.id}')"
                        class="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Manage Participants"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('sortBy').value = 'date_desc';
    searchTerm = '';
    sortBy = 'date_desc';
    filterAndSortClasses();
}

// View class details
function viewClassDetails(classId) {
    // Save class data to localStorage for class job detail page
    const cls = allClasses.find(c => c.id === classId);
    if (cls) {
        localStorage.setItem('currentJob', JSON.stringify(cls));
        window.location.href = `class_job_detail.html?id=${classId}`;
    }
}

// Manage participants
function manageParticipants(classId) {
    const cls = allClasses.find(c => c.id === classId);
    if (cls) {
        localStorage.setItem('currentJob', JSON.stringify(cls));
        // Navigate to job detail page with participants section focused
        window.location.href = `job_detail.html?id=${classId}&section=participants`;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializePage);

