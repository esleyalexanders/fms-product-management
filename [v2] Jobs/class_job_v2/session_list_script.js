// Session List Script
// Handles session listing, filtering, and display

let allSessions = [];
let filteredSessions = [];
let allClasses = [];
let searchTerm = '';
let statusFilter = 'all';
let classFilter = 'all';
let dateFilter = 'all';
let sortBy = 'date_asc';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    loadSessions();
    loadClasses();
    populateClassFilter();
    setupEventListeners();
    filterAndSortSessions();
    updateStats();
});

function initializeData() {
    // Initialize sample data if localStorage is empty
    try {
        // Check if classes exist
        const storedClasses = localStorage.getItem('classes_v2');
        if (!storedClasses || JSON.parse(storedClasses).length === 0) {
            // No classes, sessions can't exist
            return;
        }
        
        // Check if sessions exist
        const storedSessions = localStorage.getItem('class_sessions_v2');
        if (!storedSessions || JSON.parse(storedSessions).length === 0) {
            // Sessions will be created when classes are created
            return;
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

function loadSessions() {
    try {
        const stored = localStorage.getItem('class_sessions_v2');
        if (stored) {
            allSessions = JSON.parse(stored);
        } else {
            allSessions = [];
        }
        filteredSessions = [...allSessions];
    } catch (error) {
        console.error('Error loading sessions:', error);
        allSessions = [];
        filteredSessions = [];
    }
}

function loadClasses() {
    try {
        const stored = localStorage.getItem('classes_v2');
        if (stored) {
            allClasses = JSON.parse(stored);
        } else {
            allClasses = [];
        }
    } catch (error) {
        console.error('Error loading classes:', error);
        allClasses = [];
    }
}

function populateClassFilter() {
    const classFilterSelect = document.getElementById('classFilter');
    if (!classFilterSelect) return;
    
    // Clear existing options except "All Classes"
    classFilterSelect.innerHTML = '<option value="all">All Classes</option>';
    
    // Add class options
    allClasses.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.id;
        option.textContent = cls.name || cls.id;
        classFilterSelect.appendChild(option);
    });
}

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', function(e) {
        searchTerm = e.target.value.toLowerCase();
        filterAndSortSessions();
    });
    
    document.getElementById('statusFilter').addEventListener('change', function(e) {
        statusFilter = e.target.value;
        filterAndSortSessions();
    });
    
    document.getElementById('classFilter').addEventListener('change', function(e) {
        classFilter = e.target.value;
        filterAndSortSessions();
    });
    
    document.getElementById('dateFilter').addEventListener('change', function(e) {
        dateFilter = e.target.value;
        filterAndSortSessions();
    });
    
    document.getElementById('sortBy').addEventListener('change', function(e) {
        sortBy = e.target.value;
        filterAndSortSessions();
    });
    
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
}

function filterAndSortSessions() {
    let filtered = [...allSessions];
    
    // Search filter
    if (searchTerm) {
        filtered = filtered.filter(session => {
            const classData = allClasses.find(c => c.id === session.classId);
            const className = classData?.name || '';
            const sessionId = session.id || '';
            const searchable = [
                className,
                sessionId,
                session.date || '',
                session.startTime || '',
                session.endTime || ''
            ].join(' ').toLowerCase();
            return searchable.includes(searchTerm);
        });
    }
    
    // Status filter
    if (statusFilter !== 'all') {
        filtered = filtered.filter(session => session.status === statusFilter);
    }
    
    // Class filter
    if (classFilter !== 'all') {
        filtered = filtered.filter(session => session.classId === classFilter);
    }
    
    // Date filter
    if (dateFilter !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(session => {
            const sessionDate = new Date(session.date);
            sessionDate.setHours(0, 0, 0, 0);
            
            switch (dateFilter) {
                case 'today':
                    return sessionDate.getTime() === today.getTime();
                case 'thisWeek':
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - today.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return sessionDate >= weekStart && sessionDate <= weekEnd;
                case 'thisMonth':
                    return sessionDate.getMonth() === today.getMonth() && 
                           sessionDate.getFullYear() === today.getFullYear();
                case 'upcoming':
                    return sessionDate >= today;
                case 'past':
                    return sessionDate < today;
                default:
                    return true;
            }
        });
    }
    
    // Sort
    switch (sortBy) {
        case 'date_asc':
            filtered.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
                const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
                return dateA - dateB;
            });
            break;
        case 'date_desc':
            filtered.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
                const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
                return dateB - dateA;
            });
            break;
        case 'class_asc':
            filtered.sort((a, b) => {
                const classA = allClasses.find(c => c.id === a.classId);
                const classB = allClasses.find(c => c.id === b.classId);
                const nameA = classA?.name || '';
                const nameB = classB?.name || '';
                return nameA.localeCompare(nameB);
            });
            break;
        case 'class_desc':
            filtered.sort((a, b) => {
                const classA = allClasses.find(c => c.id === a.classId);
                const classB = allClasses.find(c => c.id === b.classId);
                const nameA = classA?.name || '';
                const nameB = classB?.name || '';
                return nameB.localeCompare(nameA);
            });
            break;
    }
    
    filteredSessions = filtered;
    renderSessions();
    updateStats();
}

function renderSessions() {
    const container = document.getElementById('sessionsList');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');
    
    resultsCount.textContent = `Showing ${filteredSessions.length} session${filteredSessions.length !== 1 ? 's' : ''}`;
    
    if (filteredSessions.length === 0) {
        emptyState.classList.remove('hidden');
        container.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    container.classList.remove('hidden');
    
    container.innerHTML = filteredSessions.map(session => createSessionCard(session)).join('');
}

function createSessionCard(session) {
    const classData = allClasses.find(c => c.id === session.classId);
    const className = classData?.name || 'Unknown Class';
    
    const statusConfig = {
        scheduled: { text: 'Scheduled', class: 'bg-blue-100 text-blue-700' },
        completed: { text: 'Completed', class: 'bg-gray-100 text-gray-700' },
        cancelled: { text: 'Cancelled', class: 'bg-red-100 text-red-700' }
    };
    
    const status = statusConfig[session.status] || statusConfig.scheduled;
    
    // Format date
    const sessionDate = new Date(session.date);
    const dateStr = sessionDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    // Format time
    const timeStr = session.startTime && session.endTime 
        ? `${session.startTime} - ${session.endTime}`
        : session.startTime || '-';
    
    // Get bookings count
    const bookingsCount = session.bookings?.length || 0;
    const confirmedBookings = session.bookings?.filter(b => b.status === 'confirmed').length || 0;
    const maxCapacity = session.maxCapacity || classData?.maxCapacity || 0;
    
    // Get staff count
    const staffCount = session.assignedStaff?.length || session.staffOverride?.length || classData?.defaultStaff?.length || 0;
    
    return `
        <div class="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer" onclick="window.location.href='session_detail.html?id=${session.id}'">
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-semibold text-gray-900">${className}</h3>
                        <span class="px-2 py-1 text-xs rounded ${status.class}">${status.text}</span>
                        <span class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">${session.id}</span>
                    </div>
                    <div class="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span>${dateStr}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>${timeStr}</span>
                        </div>
                        ${session.duration ? `
                            <div class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>${session.duration} min</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            <span>${staffCount} staff</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                            <span>${confirmedBookings}/${maxCapacity} booked</span>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-gray-900">${confirmedBookings}</p>
                    <p class="text-xs text-gray-500 mt-1">Bookings</p>
                </div>
            </div>
            
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <div class="flex items-center gap-2">
                    ${classData?.skillLevel ? `
                        <span class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">${classData.skillLevel}</span>
                    ` : ''}
                    ${classData?.pricebookItem?.tag ? `
                        <span class="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded">${classData.pricebookItem.tag}</span>
                    ` : ''}
                </div>
                <div class="flex gap-2">
                    <button 
                        onclick="event.stopPropagation(); window.location.href='session_detail.html?id=${session.id}'"
                        class="px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                        View Details
                    </button>
                    ${session.status === 'scheduled' ? `
                        <button 
                            onclick="event.stopPropagation(); window.location.href='class_detail.html?id=${session.classId}'"
                            class="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            View Class
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function updateStats() {
    const total = allSessions.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcoming = allSessions.filter(s => {
        const sessionDate = new Date(s.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate >= today && s.status !== 'cancelled';
    }).length;
    
    const completed = allSessions.filter(s => s.status === 'completed').length;
    const cancelled = allSessions.filter(s => s.status === 'cancelled').length;
    
    document.getElementById('totalSessions').textContent = total;
    document.getElementById('upcomingSessions').textContent = upcoming;
    document.getElementById('completedSessions').textContent = completed;
    document.getElementById('cancelledSessions').textContent = cancelled;
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('classFilter').value = 'all';
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('sortBy').value = 'date_asc';
    
    searchTerm = '';
    statusFilter = 'all';
    classFilter = 'all';
    dateFilter = 'all';
    sortBy = 'date_asc';
    
    filterAndSortSessions();
}





