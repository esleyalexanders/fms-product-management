// Class List Script
// Handles class listing, filtering, and display

let allClasses = [];
let filteredClasses = [];
let searchTerm = '';
let statusFilter = 'all';
let pricebookFilter = 'all';
let sortBy = 'name_asc';

// Sample data for demo
function getSampleClasses() {
    return [
        {
            id: 'CLASS-2024-001',
            name: 'Advanced Yoga Class',
            type: 'Class',
            description: '60-minute advanced yoga session focusing on strength and flexibility',
            skillLevel: 'Advanced',
            status: 'active',
            pricebookItem: {
                id: 'PB-YOGA-CLASS',
                name: 'Yoga Class - Group (per seat)',
                description: '60-minute guided yoga session led by certified instructor',
                tag: 'Yoga',
                price: 50.00
            },
            pricebookItemId: 'PB-YOGA-CLASS',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
                startTime: '14:00',
                endTime: '15:00',
                duration: 60,
                startDate: '2024-12-01',
                endDate: null
            },
            defaultStaff: [
                { id: 'STAFF-004', name: 'Emily Rodriguez', email: 'emily.r@example.com', role: 'Instructor', department: 'Yoga' },
                { id: 'STAFF-008', name: 'Jennifer White', email: 'jennifer.w@example.com', role: 'Instructor', department: 'Yoga' }
            ],
            maxCapacity: 20,
            curriculum: 'Advanced Ashtanga Yoga Program',
            cohortStartDate: '2024-12-01',
            cohortEndDate: '2025-03-01',
            cohortSize: 20,
            createdAt: '2024-11-01T10:00:00Z',
            updatedAt: '2024-11-01T10:00:00Z'
        },
        {
            id: 'CLASS-2024-002',
            name: 'Math Tutoring - Group Session',
            type: 'Group',
            description: 'Group math tutoring for high school students covering algebra and geometry',
            skillLevel: 'Intermediate',
            status: 'active',
            pricebookItem: {
                id: 'PB-MATH-TUTORING',
                name: 'Math Tutoring - Group Session',
                description: 'Group math tutoring session for up to 20 students',
                tag: 'Math',
                price: 120.00
            },
            pricebookItemId: 'PB-MATH-TUTORING',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Tuesday', 'Thursday'],
                startTime: '16:00',
                endTime: '17:30',
                duration: 90,
                startDate: '2024-12-03',
                endDate: null
            },
            defaultStaff: [
                { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' },
                { id: 'STAFF-003', name: 'Michael Chen', email: 'michael.chen@example.com', role: 'Instructor', department: 'Math' }
            ],
            maxCapacity: 15,
            minCapacity: 3,
            createdAt: '2024-11-02T10:00:00Z',
            updatedAt: '2024-11-02T10:00:00Z'
        },
        {
            id: 'CLASS-2024-003',
            name: 'Guitar Workshop - Group',
            type: 'Group',
            description: 'Small group guitar coaching for beginners and intermediate players',
            skillLevel: 'Beginner',
            status: 'active',
            pricebookItem: {
                id: 'PB-GUITAR-SESSION',
                name: 'Guitar Workshop - Group (per seat)',
                description: 'Small group guitar coaching, includes practice materials',
                tag: 'Guitar',
                price: 45.00
            },
            pricebookItemId: 'PB-GUITAR-SESSION',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Saturday'],
                startTime: '10:00',
                endTime: '11:30',
                duration: 90,
                startDate: '2024-12-07',
                endDate: null
            },
            defaultStaff: [
                { id: 'STAFF-005', name: 'James Wilson', email: 'james.w@example.com', role: 'Instructor', department: 'Guitar' }
            ],
            maxCapacity: 8,
            minCapacity: 2,
            createdAt: '2024-11-03T10:00:00Z',
            updatedAt: '2024-11-03T10:00:00Z'
        },
        {
            id: 'CLASS-2024-004',
            name: 'Physics Workshop - Group',
            type: 'Class',
            description: 'Group physics problem-solving and concept review for advanced students',
            skillLevel: 'Advanced',
            status: 'paused',
            pricebookItem: {
                id: 'PB-PHYSICS-WORKSHOP',
                name: 'Physics Workshop - Group',
                description: 'Group physics problem-solving and concept review',
                tag: 'Science',
                price: 200.00
            },
            pricebookItemId: 'PB-PHYSICS-WORKSHOP',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Wednesday'],
                startTime: '18:00',
                endTime: '19:30',
                duration: 90,
                startDate: '2024-12-02',
                endDate: null
            },
            defaultStaff: [
                { id: 'STAFF-002', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Instructor', department: 'Science' },
                { id: 'STAFF-006', name: 'Lisa Anderson', email: 'lisa.a@example.com', role: 'Instructor', department: 'Science' }
            ],
            maxCapacity: 12,
            curriculum: 'Advanced Physics Problem Solving',
            cohortStartDate: '2024-12-02',
            cohortEndDate: '2025-02-28',
            cohortSize: 12,
            createdAt: '2024-11-04T10:00:00Z',
            updatedAt: '2024-11-10T10:00:00Z'
        },
        {
            id: 'CLASS-2024-005',
            name: 'Personalized Math Tutoring',
            type: 'One-to-One',
            description: 'One-on-one personalized math tutoring session tailored to individual student needs',
            skillLevel: 'All levels',
            status: 'active',
            pricebookItem: {
                id: 'PB-MATH-1ON1',
                name: 'Math Tutoring - One-to-One',
                description: 'Personalized one-on-one math tutoring session',
                tag: 'Math',
                price: 150.00
            },
            pricebookItemId: 'PB-MATH-1ON1',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
                startTime: '15:00',
                endTime: '16:00',
                duration: 60,
                startDate: '2024-12-01',
                endDate: null
            },
            defaultStaff: [
                { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' }
            ],
            maxCapacity: 1,
            focusArea: 'Algebra and Geometry',
            personalizationLevel: 'High',
            createdAt: '2024-11-05T10:00:00Z',
            updatedAt: '2024-11-05T10:00:00Z'
        },
        {
            id: 'CLASS-2024-006',
            name: 'Private Piano Lessons',
            type: 'One-to-One',
            description: 'Individual piano instruction with personalized curriculum',
            skillLevel: 'Beginner',
            status: 'active',
            pricebookItem: {
                id: 'PB-PIANO-1ON1',
                name: 'Piano Lessons - One-to-One',
                description: 'Private piano instruction session',
                tag: 'Music',
                price: 80.00
            },
            pricebookItemId: 'PB-PIANO-1ON1',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Tuesday', 'Thursday'],
                startTime: '14:00',
                endTime: '15:00',
                duration: 60,
                startDate: '2024-12-03',
                endDate: null
            },
            defaultStaff: [
                { id: 'STAFF-007', name: 'Robert Taylor', email: 'robert.t@example.com', role: 'Instructor', department: 'Music' }
            ],
            maxCapacity: 1,
            focusArea: 'Classical Piano Technique',
            personalizationLevel: 'Very High',
            createdAt: '2024-11-06T10:00:00Z',
            updatedAt: '2024-11-06T10:00:00Z'
        },
        {
            id: 'CLASS-2024-007',
            name: 'English Conversation Group',
            type: 'Group',
            description: 'Small group English conversation practice for ESL students',
            skillLevel: 'Intermediate',
            status: 'active',
            pricebookItem: {
                id: 'PB-ENGLISH-GROUP',
                name: 'English Conversation - Group',
                description: 'Group English conversation practice session',
                tag: 'Language',
                price: 35.00
            },
            pricebookItemId: 'PB-ENGLISH-GROUP',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
                startTime: '10:00',
                endTime: '11:00',
                duration: 60,
                startDate: '2024-12-02',
                endDate: null
            },
            defaultStaff: [
                { id: 'STAFF-009', name: 'Maria Garcia', email: 'maria.g@example.com', role: 'Instructor', department: 'Language' }
            ],
            maxCapacity: 6,
            minCapacity: 2,
            createdAt: '2024-11-07T10:00:00Z',
            updatedAt: '2024-11-07T10:00:00Z'
        },
        {
            id: 'CLASS-2024-008',
            name: 'Personalized Science Coaching',
            type: 'One-to-One',
            description: 'Individual science coaching with adaptive learning approach',
            skillLevel: 'Advanced',
            status: 'active',
            pricebookItem: {
                id: 'PB-SCIENCE-1ON1',
                name: 'Science Coaching - One-to-One',
                description: 'Personalized one-on-one science coaching',
                tag: 'Science',
                price: 180.00
            },
            pricebookItemId: 'PB-SCIENCE-1ON1',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Tuesday', 'Thursday'],
                startTime: '17:00',
                endTime: '18:00',
                duration: 60,
                startDate: '2024-12-03',
                endDate: null
            },
            defaultStaff: [
                { id: 'STAFF-002', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Instructor', department: 'Science' }
            ],
            maxCapacity: 1,
            focusArea: 'Chemistry and Biology',
            personalizationLevel: 'Very High',
            createdAt: '2024-11-08T10:00:00Z',
            updatedAt: '2024-11-08T10:00:00Z'
        }
    ];
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    loadClasses();
    setupEventListeners();
    renderClasses();
    updateStats();
});

function initializeData() {
    // Initialize sample data if localStorage is empty or doesn't exist
    try {
        const stored = localStorage.getItem('classes_v2');
        if (!stored) {
            // No data exists, initialize with sample data
            localStorage.setItem('classes_v2', JSON.stringify(getSampleClasses()));
            return;
        }
        
        // Check if stored data is empty array
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed) || parsed.length === 0) {
            localStorage.setItem('classes_v2', JSON.stringify(getSampleClasses()));
            return;
        }
        
        // Check if we need to add new sample groups (Group and One-to-One types)
        const sampleGroups = getSampleClasses();
        const existingIds = new Set(parsed.map(g => g.id));
        const newGroups = sampleGroups.filter(g => !existingIds.has(g.id));
        
        // Add new groups if any are missing
        if (newGroups.length > 0) {
            const updated = [...parsed, ...newGroups];
            localStorage.setItem('classes_v2', JSON.stringify(updated));
        }
    } catch (error) {
        console.error('Error initializing data:', error);
        // If there's an error parsing, initialize with sample data
        try {
            localStorage.setItem('classes_v2', JSON.stringify(getSampleClasses()));
        } catch (e) {
            console.error('Error setting sample data:', e);
        }
    }
}

function loadClasses() {
    try {
        const stored = localStorage.getItem('classes_v2');
        if (stored) {
            allClasses = JSON.parse(stored);
        } else {
            allClasses = getSampleClasses();
        }
        filteredClasses = [...allClasses];
    } catch (error) {
        console.error('Error loading classes:', error);
        allClasses = [];
        filteredClasses = [];
    }
}

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', function(e) {
        searchTerm = e.target.value.toLowerCase();
        filterAndSortClasses();
    });
    
    document.getElementById('statusFilter').addEventListener('change', function(e) {
        statusFilter = e.target.value;
        filterAndSortClasses();
    });
    
    document.getElementById('pricebookFilter').addEventListener('change', function(e) {
        pricebookFilter = e.target.value;
        filterAndSortClasses();
    });
    
    document.getElementById('sortBy').addEventListener('change', function(e) {
        sortBy = e.target.value;
        filterAndSortClasses();
    });
    
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
}

function filterAndSortClasses() {
    let filtered = [...allClasses];
    
    // Search filter
    if (searchTerm) {
        filtered = filtered.filter(cls => {
            const searchable = [
                cls.name || '',
                cls.description || '',
                cls.skillLevel || '',
                cls.pricebookItem?.name || '',
                cls.pricebookItem?.tag || ''
            ].join(' ').toLowerCase();
            return searchable.includes(searchTerm);
        });
    }
    
    // Status filter
    if (statusFilter !== 'all') {
        filtered = filtered.filter(cls => cls.status === statusFilter);
    }
    
    // Pricebook filter
    if (pricebookFilter !== 'all') {
        filtered = filtered.filter(cls => cls.pricebookItemId === pricebookFilter);
    }
    
    // Sort
    switch (sortBy) {
        case 'name_asc':
            filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        case 'name_desc':
            filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
            break;
        case 'date_desc':
            filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            break;
        case 'date_asc':
            filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
            break;
    }
    
    filteredClasses = filtered;
    renderClasses();
    updateStats();
}

function renderClasses() {
    const container = document.getElementById('groupsList');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');
    
    // Check if elements exist before accessing them
    if (!container || !emptyState || !resultsCount) {
        console.error('Required DOM elements not found');
        return;
    }
    
    resultsCount.textContent = `Showing ${filteredClasses.length} group${filteredClasses.length !== 1 ? 's' : ''}`;
    
    if (filteredClasses.length === 0) {
        emptyState.classList.remove('hidden');
        container.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    container.classList.remove('hidden');
    
    container.innerHTML = filteredClasses.map(cls => createClassCard(cls)).join('');
}

function createClassCard(cls) {
    const statusConfig = {
        active: { text: 'Active', class: 'bg-green-100 text-green-700' },
        paused: { text: 'Paused', class: 'bg-yellow-100 text-yellow-700' },
        archived: { text: 'Archived', class: 'bg-gray-100 text-gray-700' }
    };
    
    const status = statusConfig[cls.status] || statusConfig.active;
    
    // Type-specific color configuration
    const typeConfig = {
        'Class': {
            color: 'purple',
            borderColor: 'border-l-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
            badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
            icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>`
        },
        'Group': {
            color: 'amber',
            borderColor: 'border-l-amber-500',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700',
            badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
            icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>`
        },
        'One-to-One': {
            color: 'cyan',
            borderColor: 'border-l-cyan-500',
            bgColor: 'bg-cyan-50',
            textColor: 'text-cyan-700',
            badgeClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
            icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>`
        }
    };
    
    const type = cls.type || 'Class';
    const typeStyle = typeConfig[type] || typeConfig['Class'];
    
    // Get schedule summary
    let scheduleSummary = '-';
    if (cls.schedule) {
        if (cls.schedule.frequency === 'weekly' && cls.schedule.daysOfWeek && cls.schedule.daysOfWeek.length > 0) {
            const shortDays = cls.schedule.daysOfWeek.map(d => d.substring(0, 3)).join(', ');
            scheduleSummary = `Every ${shortDays} at ${cls.schedule.startTime || ''}`;
        } else if (cls.schedule.frequency === 'daily') {
            scheduleSummary = `Daily at ${cls.schedule.startTime || ''}`;
        } else if (cls.schedule.frequency === 'monthly') {
            scheduleSummary = `Monthly at ${cls.schedule.startTime || ''}`;
        } else if (cls.schedule.frequency === 'custom') {
            scheduleSummary = `Every ${cls.schedule.customInterval || ''} ${cls.schedule.customIntervalUnit || 'weeks'}`;
        }
    }
    
    // Get staff count
    const staffCount = cls.defaultStaff?.length || 0;
    
    return `
        <div class="border border-gray-200 ${typeStyle.borderColor} border-l-4 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${typeStyle.bgColor}" onclick="window.location.href='group_detail.html?id=${cls.id}'">
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 class="text-lg font-semibold text-gray-900">${cls.name || 'Unnamed Group'}</h3>
                        <span class="px-2 py-1 text-xs rounded border ${typeStyle.badgeClass} flex items-center gap-1">
                            ${typeStyle.icon}
                            ${type}
                        </span>
                        <span class="px-2 py-1 text-xs rounded ${status.class}">${status.text}</span>
                        <span class="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded">${cls.id}</span>
                    </div>
                    ${cls.description ? `<p class="text-sm text-gray-600 mb-2">${cls.description}</p>` : ''}
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>${cls.pricebookItem?.name || 'No pricebook item'}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span>${scheduleSummary}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            <span>${staffCount} staff</span>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold ${typeStyle.textColor}">${cls.maxCapacity || 0}</p>
                    <p class="text-xs text-gray-500 mt-1">Max Capacity</p>
                    ${type === 'One-to-One' ? '<p class="text-xs ' + typeStyle.textColor + ' mt-1 font-medium">1:1 Ratio</p>' : ''}
                    ${type === 'Group' ? '<p class="text-xs ' + typeStyle.textColor + ' mt-1 font-medium">Group Session</p>' : ''}
                    ${type === 'Class' ? '<p class="text-xs ' + typeStyle.textColor + ' mt-1 font-medium">Structured Course</p>' : ''}
                </div>
            </div>
            
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <div class="flex items-center gap-2">
                    ${cls.skillLevel ? `
                        <span class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">${cls.skillLevel}</span>
                    ` : ''}
                </div>
                <div class="flex gap-2">
                    <button 
                        onclick="event.stopPropagation(); window.location.href='group_detail.html?id=${cls.id}'"
                        class="px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                        View Details
                    </button>
                    <button 
                        onclick="event.stopPropagation(); window.location.href='group_edit.html?id=${cls.id}'"
                        class="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateStats() {
    const total = allClasses.length;
    const active = allClasses.filter(c => c.status === 'active').length;
    const paused = allClasses.filter(c => c.status === 'paused').length;
    
    // Count total sessions
    let totalSessions = 0;
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        totalSessions = sessions.length;
    } catch (error) {
        console.error('Error counting sessions:', error);
    }
    
    // Update stats with proper element IDs
    const totalGroupsEl = document.getElementById('totalGroups');
    const activeGroupsEl = document.getElementById('activeGroups');
    const pausedGroupsEl = document.getElementById('pausedGroups');
    const totalSessionsEl = document.getElementById('totalSessions');
    
    if (totalGroupsEl) totalGroupsEl.textContent = total;
    if (activeGroupsEl) activeGroupsEl.textContent = active;
    if (pausedGroupsEl) pausedGroupsEl.textContent = paused;
    if (totalSessionsEl) totalSessionsEl.textContent = totalSessions;
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('pricebookFilter').value = 'all';
    document.getElementById('sortBy').value = 'name_asc';
    
    searchTerm = '';
    statusFilter = 'all';
    pricebookFilter = 'all';
    sortBy = 'name_asc';
    
    filterAndSortClasses();
}

