// My Calendar Script
// Displays both jobs and class sessions for the current user

// Get current user (in real app, from auth system)
function getCurrentUser() {
    // Try to get from localStorage, or use default
    const stored = localStorage.getItem('currentUser');
    if (stored) {
        return JSON.parse(stored);
    }
    // Default user for demo
    return {
        id: 'STAFF-001',
        name: 'Daniel Davis',
        email: 'daniel.davis@example.com',
        role: 'Instructor'
    };
}

// State
let currentUser = getCurrentUser();
let currentDate = new Date();
let currentView = 'month';
let allEvents = []; // Combined jobs and sessions

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
});

function initializeCalendar() {
    // Set current user
    document.getElementById('currentUserBadge').textContent = currentUser.name;
    
    // Initialize sample data if needed
    initializeSampleData();
    
    // Load events
    loadEvents();
    
    // Render initial view
    switchView('month');
}

function initializeSampleData() {
    // Initialize jobs if empty
    try {
        const existingJobs = localStorage.getItem('jobs');
        if (!existingJobs || JSON.parse(existingJobs).length === 0) {
            const sampleJobs = getSampleJobs();
            localStorage.setItem('jobs', JSON.stringify(sampleJobs));
        }
    } catch (error) {
        console.error('Error initializing jobs:', error);
    }
    
    // Initialize class sessions if empty
    try {
        const existingSessions = localStorage.getItem('class_sessions_v2');
        if (!existingSessions || JSON.parse(existingSessions).length === 0) {
            const sampleSessions = getSampleSessions();
            localStorage.setItem('class_sessions_v2', JSON.stringify(sampleSessions));
        }
    } catch (error) {
        console.error('Error initializing sessions:', error);
    }
}

function getSampleJobs() {
    // Get current date and create jobs for December 2025
    const today = new Date();
    const dec2025 = new Date(2025, 11, 1); // December 2025
    
    return [
        {
            id: 'JOB-2025-001',
            quoteId: 'Q-2025-001',
            customerName: 'Sarah Johnson',
            customerEmail: 'sarah.j@email.com',
            scheduleDate: '2025-12-05',
            scheduleTime: '10:00',
            assignedTo: 'STAFF-001',
            assignedStaff: ['Daniel Davis'],
            status: 'scheduled',
            total: 825.00,
            description: 'Math and Science tutoring session',
            address: '123 Main St, Melbourne VIC 3000',
            priority: 'normal',
            duration: '2 hours'
        },
        {
            id: 'JOB-2025-002',
            quoteId: 'Q-2025-002',
            customerName: 'Michael Chen',
            customerEmail: 'm.chen@email.com',
            scheduleDate: '2025-12-10',
            scheduleTime: '14:00',
            assignedTo: 'STAFF-001',
            assignedStaff: ['Daniel Davis'],
            status: 'scheduled',
            total: 450.00,
            description: 'English Literature tutoring',
            address: '456 Oak Ave, Melbourne VIC 3000',
            priority: 'normal',
            duration: '1.5 hours'
        },
        {
            id: 'JOB-2025-003',
            quoteId: 'Q-2025-003',
            customerName: 'Emma Wilson',
            customerEmail: 'emma.w@email.com',
            scheduleDate: '2025-12-15',
            scheduleTime: '09:00',
            assignedTo: 'STAFF-001',
            assignedStaff: ['Daniel Davis'],
            status: 'scheduled',
            total: 1200.00,
            description: 'Advanced Math program',
            address: '789 Park Lane, Melbourne VIC 3000',
            priority: 'high',
            duration: '3 hours'
        },
        {
            id: 'JOB-2025-004',
            quoteId: 'Q-2025-004',
            customerName: 'James Taylor',
            customerEmail: 'j.taylor@email.com',
            scheduleDate: '2025-12-20',
            scheduleTime: '15:30',
            assignedTo: 'STAFF-001',
            assignedStaff: ['Daniel Davis'],
            status: 'scheduled',
            total: 300.00,
            description: 'History tutoring session',
            address: '321 Hill St, Melbourne VIC 3000',
            priority: 'normal',
            duration: '1 hour'
        }
    ];
}

function getSampleSessions() {
    // Get classes first
    const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
    const sessions = [];
    const danielDavis = { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' };
    
    if (classes.length === 0) {
        // If no classes, create some sample sessions directly
        return [
            {
                id: 'SESSION-2025-001',
                classId: 'CLASS-2024-002',
                date: '2025-12-03',
                startTime: '16:00',
                endTime: '17:30',
                duration: 90,
                status: 'scheduled',
                maxCapacity: 15,
                confirmedSlots: 8,
                assignedStaff: [danielDavis],
                bookings: [],
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'SESSION-2025-002',
                classId: 'CLASS-2024-002',
                date: '2025-12-05',
                startTime: '16:00',
                endTime: '17:30',
                duration: 90,
                status: 'scheduled',
                maxCapacity: 15,
                confirmedSlots: 12,
                assignedStaff: [danielDavis],
                bookings: [],
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'SESSION-2025-003',
                classId: 'CLASS-2024-002',
                date: '2025-12-10',
                startTime: '16:00',
                endTime: '17:30',
                duration: 90,
                status: 'scheduled',
                maxCapacity: 15,
                confirmedSlots: 10,
                assignedStaff: [danielDavis],
                bookings: [],
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'SESSION-2025-004',
                classId: 'CLASS-2024-002',
                date: '2025-12-12',
                startTime: '16:00',
                endTime: '17:30',
                duration: 90,
                status: 'scheduled',
                maxCapacity: 15,
                confirmedSlots: 15,
                assignedStaff: [danielDavis],
                bookings: [],
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }
    
    // Create sessions for December 2025 for classes that have Daniel Davis as staff
    classes.forEach(cls => {
        // Check if Daniel Davis is in default staff
        const hasDaniel = cls.defaultStaff && cls.defaultStaff.some(s => 
            (s.id === 'STAFF-001' || s.name === 'Daniel Davis')
        );
        
        if (hasDaniel && cls.schedule) {
            // Create sessions based on schedule
            const daysOfWeek = cls.schedule.daysOfWeek || [];
            const startTime = cls.schedule.startTime || '14:00';
            const endTime = cls.schedule.endTime || '15:00';
            
            // Create sessions for December 2025
            daysOfWeek.forEach(dayName => {
                const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayName);
                
                if (dayIndex === -1) return;
                
                // Find all occurrences of this day in December 2025
                for (let week = 0; week < 4; week++) {
                    const date = new Date(2025, 11, 1); // December 1, 2025
                    const firstDayOfWeek = date.getDay();
                    let targetDate = 1 + (dayIndex - firstDayOfWeek + 7) % 7 + (week * 7);
                    
                    if (targetDate <= 31) {
                        const dateStr = `2025-12-${String(targetDate).padStart(2, '0')}`;
                        
                        sessions.push({
                            id: `SESSION-2025-${cls.id}-${targetDate}`,
                            classId: cls.id,
                            date: dateStr,
                            startTime: startTime,
                            endTime: endTime,
                            duration: cls.schedule.duration || 60,
                            status: 'scheduled',
                            maxCapacity: cls.maxCapacity || 20,
                            confirmedSlots: Math.floor(Math.random() * (cls.maxCapacity || 20)),
                            assignedStaff: cls.defaultStaff || [danielDavis],
                            bookings: [],
                            notes: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                    }
                }
            });
        }
    });
    
    return sessions;
}

function loadEvents() {
    allEvents = [];
    
    // Load jobs
    try {
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const filteredJobs = jobs.filter(job => {
            // Check if job is assigned to current user
            if (job.assignedTo === currentUser.id) {
                return true;
            }
            // Check if job has assignedStaff array
            if (job.assignedStaff && Array.isArray(job.assignedStaff)) {
                return job.assignedStaff.some(staff => {
                    if (typeof staff === 'string') {
                        return staff === currentUser.name || staff === currentUser.id;
                    }
                    return staff.id === currentUser.id || staff.name === currentUser.name;
                });
            }
            return false;
        });
        
        // Convert jobs to events
        filteredJobs.forEach(job => {
            const eventDate = job.scheduleDate || job.date;
            if (eventDate) {
                // Normalize time format (handle '10:00 AM' -> '10:00')
                let timeStr = job.scheduleTime || job.time || '00:00';
                timeStr = normalizeTime(timeStr);
                
                allEvents.push({
                    id: job.id,
                    type: 'job',
                    title: job.title || job.customerName || job.id,
                    description: job.description || '',
                    date: eventDate,
                    time: timeStr,
                    endTime: job.endTime ? normalizeTime(job.endTime) : null,
                    duration: job.duration || '',
                    customer: job.customerName || job.customer || '',
                    address: job.address || '',
                    status: job.status || 'scheduled',
                    priority: job.priority || 'normal',
                    notes: job.notes || '',
                    data: job
                });
            }
        });
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
    
    // Load class sessions
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
        
        const filteredSessions = sessions.filter(session => {
            // Check if session has assigned staff
            if (session.assignedStaff && Array.isArray(session.assignedStaff)) {
                return session.assignedStaff.some(staff => {
                    if (typeof staff === 'string') {
                        return staff === currentUser.name || staff === currentUser.id;
                    }
                    return staff.id === currentUser.id || staff.name === currentUser.name;
                });
            }
            return false;
        });
        
        // Convert sessions to events
        filteredSessions.forEach(session => {
            const classData = classes.find(c => c.id === session.classId);
            const eventDate = session.date;
            if (eventDate) {
                allEvents.push({
                    id: session.id,
                    type: 'session',
                    title: classData ? classData.name : 'Class Session',
                    description: classData ? classData.description : '',
                    date: eventDate,
                    time: session.startTime || '00:00',
                    endTime: session.endTime || null,
                    duration: session.duration ? `${session.duration} min` : '',
                    classId: session.classId,
                    className: classData ? classData.name : '',
                    status: session.status || 'scheduled',
                    capacity: session.maxCapacity || classData?.maxCapacity || 0,
                    confirmedSlots: session.confirmedSlots || 0,
                    notes: session.notes || '',
                    data: session
                });
            }
        });
    } catch (error) {
        console.error('Error loading sessions:', error);
    }
    
    // Sort events by date and time
    allEvents.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });
    
    updateEventCount();
}

function updateEventCount() {
    const count = allEvents.length;
    document.getElementById('eventCount').textContent = count;
}

// ==================== View Switching ====================

function switchView(view) {
    currentView = view;
    
    // Update button states
    document.getElementById('viewMonth').classList.remove('bg-emerald-600', 'text-white');
    document.getElementById('viewMonth').classList.add('text-gray-700', 'hover:bg-gray-50');
    document.getElementById('viewWeek').classList.remove('bg-emerald-600', 'text-white');
    document.getElementById('viewWeek').classList.add('text-gray-700', 'hover:bg-gray-50');
    document.getElementById('viewDay').classList.remove('bg-emerald-600', 'text-white');
    document.getElementById('viewDay').classList.add('text-gray-700', 'hover:bg-gray-50');
    
    // Hide all views
    document.getElementById('monthView').classList.add('hidden');
    document.getElementById('weekView').classList.add('hidden');
    document.getElementById('dayView').classList.add('hidden');
    
    // Show selected view
    if (view === 'month') {
        document.getElementById('viewMonth').classList.add('bg-emerald-600', 'text-white');
        document.getElementById('viewMonth').classList.remove('text-gray-700', 'hover:bg-gray-50');
        document.getElementById('monthView').classList.remove('hidden');
        renderMonthView();
    } else if (view === 'week') {
        document.getElementById('viewWeek').classList.add('bg-emerald-600', 'text-white');
        document.getElementById('viewWeek').classList.remove('text-gray-700', 'hover:bg-gray-50');
        document.getElementById('weekView').classList.remove('hidden');
        renderWeekView();
    } else if (view === 'day') {
        document.getElementById('viewDay').classList.add('bg-emerald-600', 'text-white');
        document.getElementById('viewDay').classList.remove('text-gray-700', 'hover:bg-gray-50');
        document.getElementById('dayView').classList.remove('hidden');
        renderDayView();
    }
    
    updateDateRange();
}

// ==================== Navigation ====================

function navigateCalendar(direction) {
    if (direction === 'today') {
        currentDate = new Date();
    } else if (direction === 'prev') {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() - 7);
        } else if (currentView === 'day') {
            currentDate.setDate(currentDate.getDate() - 1);
        }
    } else if (direction === 'next') {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else if (currentView === 'day') {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    
    switchView(currentView);
}

function updateDateRange() {
    let rangeText = '';
    
    if (currentView === 'month') {
        const monthName = currentDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
        rangeText = monthName;
    } else if (currentView === 'week') {
        const weekStart = getWeekStart(currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        rangeText = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    } else if (currentView === 'day') {
        rangeText = formatDate(currentDate);
    }
    
    document.getElementById('currentDateRange').textContent = rangeText;
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

// ==================== Month View ====================

function renderMonthView() {
    const container = document.getElementById('monthCalendar');
    container.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and how many days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get previous month's days for padding
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    // Render days
    let dayCount = 0;
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date = new Date(year, month - 1, day);
        const dateStr = formatDateString(date);
        container.appendChild(createDayCell(date, dateStr, true));
        dayCount++;
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDateString(date);
        container.appendChild(createDayCell(date, dateStr, false));
        dayCount++;
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - dayCount; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month + 1, day);
        const dateStr = formatDateString(date);
        container.appendChild(createDayCell(date, dateStr, true));
    }
}

function createDayCell(date, dateStr, isOtherMonth) {
    const cell = document.createElement('div');
    cell.className = `calendar-day p-2 border border-gray-200 ${isOtherMonth ? 'other-month' : ''}`;
    
    const today = new Date();
    if (!isOtherMonth && dateStr === formatDateString(today)) {
        cell.classList.add('today');
    }
    
    // Day number
    const dayNum = document.createElement('div');
    dayNum.className = 'text-sm font-semibold text-gray-900 mb-1';
    dayNum.textContent = date.getDate();
    cell.appendChild(dayNum);
    
    // Events for this day
    const dayEvents = allEvents.filter(e => e.date === dateStr);
    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'space-y-1';
    
    dayEvents.slice(0, 3).forEach(event => {
        const eventEl = document.createElement('div');
        eventEl.className = `calendar-event ${event.type === 'job' ? 'event-job' : 'event-session'}`;
        eventEl.textContent = `${event.time.substring(0, 5)} ${event.title.substring(0, 15)}${event.title.length > 15 ? '...' : ''}`;
        eventEl.onclick = () => showEventDetails(event);
        eventsContainer.appendChild(eventEl);
    });
    
    if (dayEvents.length > 3) {
        const moreEl = document.createElement('div');
        moreEl.className = 'text-xs text-gray-500 mt-1';
        moreEl.textContent = `+${dayEvents.length - 3} more`;
        eventsContainer.appendChild(moreEl);
    }
    
    cell.appendChild(eventsContainer);
    
    return cell;
}

// ==================== Week View ====================

function renderWeekView() {
    const weekStart = getWeekStart(currentDate);
    
    // Render day headers
    const weekDaysContainer = document.getElementById('weekDays');
    weekDaysContainer.innerHTML = '';
    
    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        const header = document.createElement('div');
        header.className = 'p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50 border-r border-gray-200';
        header.innerHTML = `
            <div>${day.toLocaleDateString('en-AU', { weekday: 'short' })}</div>
            <div class="text-lg font-bold">${day.getDate()}</div>
        `;
        weekDaysContainer.appendChild(header);
    }
    
    // Render time slots
    const calendarContainer = document.getElementById('weekCalendar');
    calendarContainer.innerHTML = '';
    
    // Time column
    const timeColumn = document.createElement('div');
    timeColumn.className = 'border-r border-gray-200';
    
    for (let hour = 0; hour < 24; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'week-hour p-2 border-b border-gray-200';
        timeSlot.innerHTML = `<div class="text-xs text-gray-500">${formatHour(hour)}</div>`;
        timeColumn.appendChild(timeSlot);
    }
    
    calendarContainer.appendChild(timeColumn);
    
    // Day columns
    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        const dateStr = formatDateString(day);
        
        const dayColumn = document.createElement('div');
        dayColumn.className = 'border-r border-gray-200 relative';
        
        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'week-hour border-b border-gray-200';
            timeSlot.dataset.date = dateStr;
            timeSlot.dataset.hour = hour;
            dayColumn.appendChild(timeSlot);
        }
        
        // Add events for this day
        const dayEvents = allEvents.filter(e => e.date === dateStr);
        dayEvents.forEach(event => {
            const eventEl = createWeekEvent(event);
            dayColumn.appendChild(eventEl);
        });
        
        calendarContainer.appendChild(dayColumn);
    }
}

function createWeekEvent(event) {
    const eventEl = document.createElement('div');
    eventEl.className = `week-event ${event.type === 'job' ? 'event-job' : 'event-session'}`;
    
    const startTime = parseTime(event.time);
    const endTime = event.endTime ? parseTime(event.endTime) : startTime + 1;
    const startHour = Math.floor(startTime);
    const startMin = (startTime - startHour) * 60;
    const duration = (endTime - startTime) * 60; // in minutes
    
    eventEl.style.top = `${(startHour * 60 + startMin) * (60 / 60)}px`;
    eventEl.style.height = `${duration * (60 / 60)}px`;
    eventEl.innerHTML = `
        <div class="font-medium">${event.title}</div>
        <div class="text-xs opacity-75">${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</div>
    `;
    eventEl.onclick = () => showEventDetails(event);
    
    return eventEl;
}

// ==================== Day View ====================

function renderDayView() {
    const dateStr = formatDateString(currentDate);
    document.getElementById('dayViewDate').textContent = formatDate(currentDate);
    
    // Render time slots
    const timeSlotsContainer = document.getElementById('dayTimeSlots');
    timeSlotsContainer.innerHTML = '';
    
    for (let hour = 0; hour < 24; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'day-hour p-3 border-b border-gray-200';
        timeSlot.innerHTML = `<div class="text-sm font-medium text-gray-700">${formatHour(hour)}</div>`;
        timeSlotsContainer.appendChild(timeSlot);
    }
    
    // Render events
    const eventsContainer = document.getElementById('dayEvents');
    eventsContainer.innerHTML = '';
    
    const dayEvents = allEvents.filter(e => e.date === dateStr);
    
    if (dayEvents.length === 0) {
        eventsContainer.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <svg class="mx-auto mb-3 text-gray-400 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="text-sm font-medium text-gray-700">No events scheduled</p>
            </div>
        `;
        return;
    }
    
    dayEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = `border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${event.type === 'job' ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'}`;
        eventCard.onclick = () => showEventDetails(event);
        
        eventCard.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-900">${event.title}</h3>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="px-2 py-1 text-xs rounded ${event.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">
                            ${event.type === 'job' ? 'Job' : 'Class Session'}
                        </span>
                        <span class="text-xs text-gray-500">${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</span>
                    </div>
                </div>
            </div>
            ${event.description ? `<p class="text-sm text-gray-600 mt-2">${event.description}</p>` : ''}
            ${event.customer ? `<p class="text-sm text-gray-600 mt-1"><span class="font-medium">Customer:</span> ${event.customer}</p>` : ''}
            ${event.address ? `<p class="text-sm text-gray-600 mt-1"><span class="font-medium">Address:</span> ${event.address}</p>` : ''}
            ${event.duration ? `<p class="text-sm text-gray-600 mt-1"><span class="font-medium">Duration:</span> ${event.duration}</p>` : ''}
        `;
        
        eventsContainer.appendChild(eventCard);
    });
}

// ==================== Event Details Modal ====================

function showEventDetails(event) {
    const modal = document.getElementById('eventModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = event.title;
    
    let content = `
        <div class="space-y-4">
            <div class="flex items-center gap-2">
                <span class="px-3 py-1 text-sm rounded ${event.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">
                    ${event.type === 'job' ? 'Job' : 'Class Session'}
                </span>
                <span class="px-3 py-1 text-sm rounded bg-gray-100 text-gray-700">
                    ${event.status}
                </span>
            </div>
            
            <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Date & Time</h4>
                <p class="text-sm text-gray-900">${formatDate(new Date(event.date))} at ${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</p>
            </div>
    `;
    
    if (event.type === 'job') {
        content += `
            ${event.customer ? `
                <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Customer</h4>
                    <p class="text-sm text-gray-900">${event.customer}</p>
                </div>
            ` : ''}
            ${event.address ? `
                <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Address</h4>
                    <p class="text-sm text-gray-900">${event.address}</p>
                </div>
            ` : ''}
            ${event.priority ? `
                <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Priority</h4>
                    <p class="text-sm text-gray-900 capitalize">${event.priority}</p>
                </div>
            ` : ''}
        `;
    } else if (event.type === 'session') {
        content += `
            ${event.className ? `
                <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Class</h4>
                    <p class="text-sm text-gray-900">${event.className}</p>
                </div>
            ` : ''}
            ${event.capacity ? `
                <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Capacity</h4>
                    <p class="text-sm text-gray-900">${event.confirmedSlots || 0} / ${event.capacity} slots</p>
                </div>
            ` : ''}
        `;
    }
    
    content += `
            ${event.description ? `
                <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Description</h4>
                    <p class="text-sm text-gray-900">${event.description}</p>
                </div>
            ` : ''}
            ${event.notes ? `
                <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                    <p class="text-sm text-gray-900">${event.notes}</p>
                </div>
            ` : ''}
            ${event.duration ? `
                <div>
                    <h4 class="text-sm font-medium text-gray-500 mb-1">Duration</h4>
                    <p class="text-sm text-gray-900">${event.duration}</p>
                </div>
            ` : ''}
        </div>
        
        <div class="mt-6 pt-4 border-t border-gray-200 flex gap-2">
            ${event.type === 'job' ? `
                <button 
                    onclick="window.location.href='../job_detail.html?id=${event.id}'"
                    class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                    View Job Details
                </button>
            ` : `
                <button 
                    onclick="window.location.href='session_detail.html?id=${event.id}'"
                    class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                    View Session Details
                </button>
            `}
            <button 
                onclick="closeEventModal()"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
                Close
            </button>
        </div>
    `;
    
    modalContent.innerHTML = content;
    modal.classList.remove('hidden');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.add('hidden');
}

// ==================== Helper Functions ====================

function formatDate(date) {
    return date.toLocaleDateString('en-AU', { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
}

function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatHour(hour) {
    return `${String(hour).padStart(2, '0')}:00`;
}

function parseTime(timeStr) {
    // Handle formats like '10:00 AM', '14:30', '2:00 PM'
    let normalized = normalizeTime(timeStr);
    const [hours, minutes] = normalized.split(':').map(Number);
    return hours + (minutes || 0) / 60;
}

function normalizeTime(timeStr) {
    if (!timeStr) return '00:00';
    
    // If already in 24-hour format (HH:MM), return as is
    if (/^\d{1,2}:\d{2}$/.test(timeStr.trim())) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    
    // Handle 12-hour format (e.g., '10:00 AM', '2:30 PM')
    const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
        let hours = parseInt(match[1]);
        const minutes = match[2];
        const period = match[3].toUpperCase();
        
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return `${String(hours).padStart(2, '0')}:${minutes}`;
    }
    
    return '00:00';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('eventModal');
    if (event.target === modal) {
        closeEventModal();
    }
});

