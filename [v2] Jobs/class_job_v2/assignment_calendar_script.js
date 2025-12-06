// Assignment Calendar Script
// Manager calendar with CRUD functionality for jobs and class sessions

// State
let currentDate = new Date();
let currentView = 'month';
let allEvents = []; // Combined jobs and sessions
let filteredEvents = [];
let selectedEvent = null;
let editingEvent = null;
let dragState = null;

// Filters
let filters = {
    jobs: true,
    sessions: true,
    scheduled: true,
    inProgress: true,
    completed: true
};

// Sample staff for assignment
const sampleStaff = [
    { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-002', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Instructor', department: 'Science' },
    { id: 'STAFF-003', name: 'Michael Chen', email: 'michael.chen@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-004', name: 'Emily Rodriguez', email: 'emily.r@example.com', role: 'Instructor', department: 'Yoga' },
    { id: 'STAFF-005', name: 'James Wilson', email: 'james.w@example.com', role: 'Instructor', department: 'Guitar' }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    initializeCalendar();
    setupEventListeners();
});

function initializeCalendar() {
    // Initialize sample data if needed
    initializeSampleData();

    // Load events
    loadEvents();

    // Render initial view
    switchView('month');

    // Update current time indicator in week/day view
    updateCurrentTimeIndicator();
    setInterval(updateCurrentTimeIndicator, 60000); // Update every minute
}

function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', function (e) {
        applyFilters();
    });

    // Click outside to close modals
    document.addEventListener('click', function (e) {
        if (!e.target.closest('#eventModal') && !e.target.closest('[onclick*="show"]')) {
            closeEventPopover();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeEventModal();
            closeEventPopover();
        } else if (e.key === 'c' && !e.target.matches('input, textarea')) {
            showCreateEventModal();
        } else if (e.key === 't' && !e.target.matches('input, textarea')) {
            navigateCalendar('today');
        }
    });
}

// ==================== Data Loading ====================

function loadEvents() {
    allEvents = [];

    // Load jobs
    try {
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        jobs.forEach(job => {
            const eventDate = job.scheduleDate || job.date;
            if (eventDate) {
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
                    assignedTo: job.assignedTo || '',
                    assignedStaff: job.assignedStaff || [],
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

        sessions.forEach(session => {
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
                    assignedStaff: session.assignedStaff || [],
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

    applyFilters();
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
            assignedTo: 'STAFF-002',
            assignedStaff: ['Sarah Johnson'],
            status: 'scheduled',
            total: 450.00,
            description: 'English Literature tutoring',
            address: '456 Oak Ave, Melbourne VIC 3000',
            priority: 'normal',
            duration: '1.5 hours'
        }
    ];
}

function getSampleSessions() {
    const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
    const sessions = [];

    if (classes.length > 0) {
        classes.forEach(cls => {
            if (cls.schedule && cls.defaultStaff) {
                const daysOfWeek = cls.schedule.daysOfWeek || [];
                const startTime = cls.schedule.startTime || '14:00';
                const endTime = cls.schedule.endTime || '15:00';

                daysOfWeek.forEach(dayName => {
                    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayName);
                    if (dayIndex === -1) return;

                    for (let week = 0; week < 4; week++) {
                        const date = new Date(2025, 11, 1);
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
                                assignedStaff: cls.defaultStaff || [],
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
    }

    return sessions;
}

// ==================== Filtering ====================

function applyFilters() {
    let filtered = [...allEvents];

    // Type filters
    if (!filters.jobs) {
        filtered = filtered.filter(e => e.type !== 'job');
    }
    if (!filters.sessions) {
        filtered = filtered.filter(e => e.type !== 'session');
    }

    // Status filters
    const statusFilters = [];
    if (filters.scheduled) statusFilters.push('scheduled');
    if (filters.inProgress) statusFilters.push('in_progress');
    if (filters.completed) statusFilters.push('completed');

    if (statusFilters.length > 0) {
        filtered = filtered.filter(e => statusFilters.includes(e.status));
    }

    // Search filter
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    if (searchQuery) {
        filtered = filtered.filter(event => {
            return event.title.toLowerCase().includes(searchQuery) ||
                event.description.toLowerCase().includes(searchQuery) ||
                (event.customer && event.customer.toLowerCase().includes(searchQuery)) ||
                (event.className && event.className.toLowerCase().includes(searchQuery));
        });
    }

    filteredEvents = filtered;
    updateEventCount();
    renderCurrentView();
}

function toggleFilters() {
    const panel = document.getElementById('filtersPanel');
    panel.classList.toggle('hidden');
}

// ==================== View Switching ====================

function switchView(view) {
    currentView = view;

    // Update button states
    ['Month', 'Week', 'Day'].forEach(v => {
        const btn = document.getElementById(`view${v}`);
        if (v.toLowerCase() === view) {
            btn.classList.add('bg-blue-600', 'text-white');
            btn.classList.remove('text-gray-700', 'hover:bg-gray-50');
        } else {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('text-gray-700', 'hover:bg-gray-50');
        }
    });

    // Hide all views
    document.getElementById('monthView').classList.add('hidden');
    document.getElementById('weekView').classList.add('hidden');
    document.getElementById('dayView').classList.add('hidden');

    // Show selected view
    document.getElementById(`${view}View`).classList.remove('hidden');

    // Render view
    renderCurrentView();
    updateDateRange();
}

function renderCurrentView() {
    if (currentView === 'month') {
        renderMonthView();
    } else if (currentView === 'week') {
        renderWeekView();
    } else if (currentView === 'day') {
        renderDayView();
    }
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

    renderCurrentView();
    updateDateRange();
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

    document.getElementById('dateRange').textContent = rangeText;
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

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();

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

    // Next month days
    const remainingDays = 42 - dayCount;
    for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month + 1, day);
        const dateStr = formatDateString(date);
        container.appendChild(createDayCell(date, dateStr, true));
    }
}

function createDayCell(date, dateStr, isOtherMonth) {
    const cell = document.createElement('div');
    cell.className = `calendar-day p-2 ${isOtherMonth ? 'other-month' : ''}`;
    cell.dataset.date = dateStr;

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
    const dayEvents = filteredEvents.filter(e => e.date === dateStr);
    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'space-y-1';

    dayEvents.slice(0, 3).forEach(event => {
        const eventEl = document.createElement('div');
        eventEl.className = `calendar-event ${event.type === 'job' ? 'event-job' : 'event-session'}`;
        eventEl.textContent = `${event.time.substring(0, 5)} ${event.title.substring(0, 15)}${event.title.length > 15 ? '...' : ''}`;
        eventEl.onclick = (e) => {
            e.stopPropagation();
            showEventPopover(event, eventEl);
        };
        eventEl.ondblclick = (e) => {
            e.stopPropagation();
            showEditEventModal(event);
        };
        eventsContainer.appendChild(eventEl);
    });

    if (dayEvents.length > 3) {
        const moreEl = document.createElement('div');
        moreEl.className = 'text-xs text-gray-500 mt-1 cursor-pointer';
        moreEl.textContent = `+${dayEvents.length - 3} more`;
        moreEl.onclick = () => {
            currentDate = date;
            switchView('day');
        };
        eventsContainer.appendChild(moreEl);
    }

    // Click to create event
    cell.onclick = (e) => {
        if (e.target === cell || e.target === dayNum) {
            showCreateEventModal(dateStr);
        }
    };

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
        dayColumn.dataset.date = dateStr;

        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'week-hour border-b border-gray-200';
            timeSlot.dataset.date = dateStr;
            timeSlot.dataset.hour = hour;
            timeSlot.onclick = (e) => {
                if (e.target === timeSlot) {
                    showCreateEventModal(dateStr, `${String(hour).padStart(2, '0')}:00`);
                }
            };
            dayColumn.appendChild(timeSlot);
        }

        // Add events for this day
        const dayEvents = filteredEvents.filter(e => e.date === dateStr);
        dayEvents.forEach(event => {
            const eventEl = createWeekEvent(event);
            dayColumn.appendChild(eventEl);
        });

        calendarContainer.appendChild(dayColumn);
    }

    updateCurrentTimeIndicator();
}

function createWeekEvent(event) {
    const eventEl = document.createElement('div');
    eventEl.className = `week-event ${event.type === 'job' ? 'event-job' : 'event-session'}`;
    eventEl.dataset.eventId = event.id;

    const startTime = parseTime(event.time);
    const endTime = event.endTime ? parseTime(event.endTime) : startTime + 1;
    const startHour = Math.floor(startTime);
    const startMin = (startTime - startHour) * 60;
    const duration = (endTime - startTime) * 60;

    eventEl.style.top = `${(startHour * 60 + startMin) * 1}px`;
    eventEl.style.height = `${Math.max(duration * 1, 30)}px`;
    eventEl.innerHTML = `
        <div class="font-medium text-xs">${event.title}</div>
        <div class="text-xs opacity-75">${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</div>
    `;

    eventEl.onclick = (e) => {
        e.stopPropagation();
        showEventPopover(event, eventEl);
    };
    eventEl.ondblclick = (e) => {
        e.stopPropagation();
        showEditEventModal(event);
    };

    // Drag and drop
    makeEventDraggable(eventEl, event);

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
        timeSlot.dataset.hour = hour;
        timeSlot.onclick = () => {
            showCreateEventModal(dateStr, `${String(hour).padStart(2, '0')}:00`);
        };
        timeSlot.innerHTML = `<div class="text-sm font-medium text-gray-700">${formatHour(hour)}</div>`;
        timeSlotsContainer.appendChild(timeSlot);
    }

    // Render events
    const eventsContainer = document.getElementById('dayEvents');
    eventsContainer.innerHTML = '';

    const dayEvents = filteredEvents.filter(e => e.date === dateStr);

    if (dayEvents.length === 0) {
        eventsContainer.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <svg class="mx-auto mb-3 text-gray-400 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="text-sm font-medium text-gray-700">No events scheduled</p>
                <p class="text-xs text-gray-500 mt-1">Click a time slot to create an event</p>
            </div>
        `;
        return;
    }

    dayEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = `border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${event.type === 'job' ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'}`;
        eventCard.onclick = () => showEventPopover(event, eventCard);
        eventCard.ondblclick = () => showEditEventModal(event);

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
            ${event.className ? `<p class="text-sm text-gray-600 mt-1"><span class="font-medium">Class:</span> ${event.className}</p>` : ''}
            ${event.address ? `<p class="text-sm text-gray-600 mt-1"><span class="font-medium">Address:</span> ${event.address}</p>` : ''}
            ${event.duration ? `<p class="text-sm text-gray-600 mt-1"><span class="font-medium">Duration:</span> ${event.duration}</p>` : ''}
        `;

        eventsContainer.appendChild(eventCard);
    });
}

// ==================== Event Popover ====================

function showEventPopover(event, element) {
    closeEventPopover();

    const popover = document.getElementById('eventPopover');
    const rect = element.getBoundingClientRect();

    popover.style.left = `${rect.left}px`;
    popover.style.top = `${rect.bottom + 8}px`;
    popover.classList.remove('hidden');

    popover.innerHTML = `
        <div class="space-y-2">
            <div class="flex items-center gap-2">
                <span class="px-2 py-1 text-xs rounded ${event.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">
                    ${event.type === 'job' ? 'Job' : 'Class Session'}
                </span>
                <span class="text-xs text-gray-500">${event.status}</span>
            </div>
            <h4 class="font-semibold text-gray-900">${event.title}</h4>
            <p class="text-sm text-gray-600">${formatDate(new Date(event.date))} at ${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</p>
            ${event.description ? `<p class="text-sm text-gray-700">${event.description}</p>` : ''}
            <div class="flex gap-2 pt-2 border-t border-gray-200">
                <button onclick="showEditEventModal(${JSON.stringify(event).replace(/"/g, '&quot;')})" class="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded">
                    Edit
                </button>
                <button onclick="deleteEvent('${event.id}', '${event.type}')" class="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded">
                    Delete
                </button>
            </div>
        </div>
    `;

    selectedEvent = event;
}

function closeEventPopover() {
    document.getElementById('eventPopover').classList.add('hidden');
    selectedEvent = null;
}

// ==================== Create/Edit Modal ====================

function showCreateEventModal(date = null, time = null) {
    editingEvent = null;
    document.getElementById('modalTitle').textContent = 'Create Event';

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select id="eventType" onchange="handleEventTypeChange()" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="job" disabled class="text-gray-400">Job (Upcoming)</option>
                    <option value="session">Class Session</option>
                    <option value="class">Class</option>
                </select>
            </div>
            
            <div id="titleField">
                <label class="block text-sm font-medium text-gray-700 mb-2">Title <span class="text-red-500">*</span></label>
                <input type="text" id="eventTitle" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Event title">
            </div>
            
            <div class="grid grid-cols-2 gap-3" id="dateTimeFields">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date <span class="text-red-500">*</span></label>
                    <input type="date" id="eventDate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${date || formatDateString(new Date())}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Time <span class="text-red-500">*</span></label>
                    <input type="time" id="eventTime" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${time || '09:00'}">
                </div>
            </div>
            
            <div id="jobFields">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                    <input type="text" id="eventCustomer" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Customer name">
                </div>
                <div class="mt-3">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input type="text" id="eventAddress" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Address">
                </div>
            </div>
            
            <div id="sessionFields" class="hidden">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Class</label>
                    <select id="eventClassId" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select a class</option>
                    </select>
                </div>
            </div>
            
            <div id="classFields" class="hidden space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Class Name <span class="text-red-500">*</span></label>
                    <input type="text" id="className" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Advanced Yoga Class">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea id="classDescription" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Class description"></textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Price Book Item <span class="text-red-500">*</span></label>
                    <div id="classPricebookContainer">
                        <button type="button" id="selectClassPricebookBtn" onclick="showClassPricebookModal()" class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                <div>
                                    <p class="text-sm font-medium text-gray-700">Select Price Book Item</p>
                                    <p class="text-xs text-gray-500">Link to a purchasable service</p>
                                </div>
                            </div>
                        </button>
                    </div>
                    <input type="hidden" id="classPricebookItemId" value="">
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                        <select id="classSkillLevel" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select skill level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="All levels">All levels</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Max Capacity</label>
                        <input type="number" id="classMaxCapacity" min="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="20">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                    <select id="classFrequency" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="weekly">Weekly</option>
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
                    <div class="flex flex-wrap gap-2">
                        <button type="button" class="day-selector px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50" data-day="Monday">Mon</button>
                        <button type="button" class="day-selector px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50" data-day="Tuesday">Tue</button>
                        <button type="button" class="day-selector px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50" data-day="Wednesday">Wed</button>
                        <button type="button" class="day-selector px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50" data-day="Thursday">Thu</button>
                        <button type="button" class="day-selector px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50" data-day="Friday">Fri</button>
                        <button type="button" class="day-selector px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50" data-day="Saturday">Sat</button>
                        <button type="button" class="day-selector px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50" data-day="Sunday">Sun</button>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                        <input type="time" id="classStartTime" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                        <input type="time" id="classEndTime" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
            </div>
            
            <div id="descriptionField">
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea id="eventDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Event description"></textarea>
            </div>
            
            <div id="staffField">
                <label class="block text-sm font-medium text-gray-700 mb-2">Default Staff Assignment</label>
                
                <!-- Search Input -->
                <div class="relative mb-3">
                    <svg class="absolute left-3 top-2.5 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input type="text" id="staffSearchInput" placeholder="Search staff by name or role..." 
                        oninput="filterStaffSearch()" onfocus="showStaffDropdown()"
                        class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" autocomplete="off" />
                    <div id="staffSearchDropdown" class="hidden absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        <!-- Search results will appear here -->
                    </div>
                </div>
                
                <!-- Selected Staff -->
                <div class="mb-2">
                    <p class="text-xs font-medium text-gray-600 mb-2">Selected (<span id="selectedStaffCount">0</span>)</p>
                    <div id="selectedStaffList" class="flex flex-wrap gap-2">
                        <!-- Selected staff chips will appear here -->
                        <p id="noStaffSelected" class="text-xs text-gray-400 italic">No staff selected</p>
                    </div>
                </div>
                
                <!-- Recommended Staff -->
                <div class="border-t border-gray-200 pt-2 mt-2">
                    <p class="text-xs font-medium text-gray-600 mb-2">Recommended</p>
                    <div id="recommendedStaffList" class="flex flex-wrap gap-2">
                        <!-- Recommended staff will appear here -->
                    </div>
                </div>
            </div>
            
            <div id="statusField">
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select id="eventStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            
            <div class="flex gap-2 pt-4 border-t border-gray-200">
                <button onclick="saveEvent()" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Save
                </button>
                <button onclick="closeEventModal()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Cancel
                </button>
            </div>
        </div>
    `;

    // Load classes for session selection
    loadClassesForSelection();

    // Load staff for selection
    loadStaffForSelection();

    // Initialize day selector click handlers
    initializeDaySelectors();

    // Initial field visibility
    handleEventTypeChange();

    document.getElementById('eventModal').classList.remove('hidden');
}

function handleEventTypeChange() {
    const eventType = document.getElementById('eventType').value;
    const titleField = document.getElementById('titleField');
    const dateTimeFields = document.getElementById('dateTimeFields');
    const descriptionField = document.getElementById('descriptionField');
    const staffField = document.getElementById('staffField');
    const statusField = document.getElementById('statusField');

    // Hide all type-specific fields
    document.getElementById('jobFields').classList.add('hidden');
    document.getElementById('sessionFields').classList.add('hidden');
    document.getElementById('classFields').classList.add('hidden');

    // Show/hide common fields based on type
    if (eventType === 'class') {
        // For class creation, hide title/datetime/description/staff/status (they're in classFields)
        titleField.classList.add('hidden');
        dateTimeFields.classList.add('hidden');
        descriptionField.classList.add('hidden');
        staffField.classList.add('hidden');
        statusField.classList.add('hidden');
        document.getElementById('classFields').classList.remove('hidden');
    } else {
        // For job/session, show all common fields
        titleField.classList.remove('hidden');
        dateTimeFields.classList.remove('hidden');
        descriptionField.classList.remove('hidden');
        staffField.classList.remove('hidden');
        statusField.classList.remove('hidden');

        if (eventType === 'job') {
            document.getElementById('jobFields').classList.remove('hidden');
        } else {
            document.getElementById('sessionFields').classList.remove('hidden');
        }
    }
}

function initializeDaySelectors() {
    document.querySelectorAll('.day-selector').forEach(btn => {
        btn.onclick = function (e) {
            e.preventDefault();
            this.classList.toggle('bg-blue-600');
            this.classList.toggle('text-white');
            this.classList.toggle('border-blue-600');
        };
    });
}

function showEditEventModal(event) {
    editingEvent = event;
    document.getElementById('modalTitle').textContent = 'Edit Event';

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select id="eventType" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
                    <option value="job" ${event.type === 'job' ? 'selected' : ''}>Job (Upcoming)</option>
                    <option value="session" ${event.type === 'session' ? 'selected' : ''}>Class Session</option>
                    <option value="class" ${event.type === 'class' ? 'selected' : ''}>Class</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Title <span class="text-red-500">*</span></label>
                <input type="text" id="eventTitle" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${event.title}">
            </div>
            
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date <span class="text-red-500">*</span></label>
                    <input type="date" id="eventDate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${event.date}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Time <span class="text-red-500">*</span></label>
                    <input type="time" id="eventTime" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${event.time}">
                </div>
            </div>
            
            <div id="jobFields" ${event.type === 'session' ? 'class="hidden"' : ''}>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                    <input type="text" id="eventCustomer" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${event.customer || ''}">
                </div>
                <div class="mt-3">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input type="text" id="eventAddress" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${event.address || ''}">
                </div>
            </div>
            
            <div id="sessionFields" ${event.type === 'job' ? 'class="hidden"' : ''}>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Class</label>
                    <select id="eventClassId" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select a class</option>
                    </select>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea id="eventDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">${event.description || ''}</textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Assigned Staff</label>
                <div id="staffSelection" class="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    <!-- Staff checkboxes will be rendered here -->
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select id="eventStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="scheduled" ${event.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                    <option value="in_progress" ${event.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${event.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${event.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
            
            <div class="flex gap-2 pt-4 border-t border-gray-200">
                <button onclick="saveEvent()" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Save Changes
                </button>
                <button onclick="closeEventModal()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Cancel
                </button>
            </div>
        </div>
    `;

    // Load classes and staff
    loadClassesForSelection(event.classId);
    loadStaffForSelection(event.assignedStaff || []);

    document.getElementById('eventModal').classList.remove('hidden');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.add('hidden');
    editingEvent = null;
    closeEventPopover();
}

// ==================== Save/Delete Events ====================

function saveEvent() {
    const eventType = document.getElementById('eventType').value;

    // Handle class creation separately
    if (eventType === 'class') {
        const className = document.getElementById('className').value.trim();
        if (!className) {
            alert('Please enter a class name');
            return;
        }

        // Get selected days
        const selectedDays = [];
        document.querySelectorAll('.day-selector.bg-blue-600').forEach(btn => {
            selectedDays.push(btn.dataset.day);
        });

        // Get selected staff
        const selectedStaff = [];
        document.querySelectorAll('#staffSelection input[type="checkbox"]:checked').forEach(cb => {
            const staffId = cb.value;
            const staff = sampleStaff.find(s => s.id === staffId);
            if (staff) selectedStaff.push(staff);
        });

        createClass({
            name: className,
            description: document.getElementById('classDescription').value.trim(),
            skillLevel: document.getElementById('classSkillLevel').value,
            maxCapacity: parseInt(document.getElementById('classMaxCapacity').value) || 20,
            status: 'active',
            schedule: {
                frequency: document.getElementById('classFrequency').value,
                daysOfWeek: selectedDays,
                startTime: document.getElementById('classStartTime').value,
                endTime: document.getElementById('classEndTime').value,
                duration: calculateDuration(
                    document.getElementById('classStartTime').value,
                    document.getElementById('classEndTime').value
                )
            },
            defaultStaff: selectedStaff
        });

        closeEventModal();
        loadEvents();
        showNotification('Class created successfully', 'success');
        return;
    }

    // Existing job/session logic
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const description = document.getElementById('eventDescription').value.trim();
    const status = document.getElementById('eventStatus').value;

    if (!title || !date || !time) {
        alert('Please fill in all required fields');
        return;
    }

    // Get selected staff
    const selectedStaff = [];
    document.querySelectorAll('#staffSelection input[type="checkbox"]:checked').forEach(cb => {
        const staffId = cb.value;
        const staff = sampleStaff.find(s => s.id === staffId);
        if (staff) selectedStaff.push(staff);
    });

    if (editingEvent) {
        // Update existing event
        if (eventType === 'job') {
            updateJob(editingEvent.id, {
                title: title,
                customerName: document.getElementById('eventCustomer').value.trim(),
                scheduleDate: date,
                scheduleTime: time,
                description: description,
                status: status,
                address: document.getElementById('eventAddress').value.trim(),
                assignedStaff: selectedStaff.map(s => s.name)
            });
        } else {
            updateSession(editingEvent.id, {
                classId: document.getElementById('eventClassId').value,
                date: date,
                startTime: time,
                description: description,
                status: status,
                assignedStaff: selectedStaff
            });
        }
    } else {
        // Create new event
        if (eventType === 'job') {
            createJob({
                title: title,
                customerName: document.getElementById('eventCustomer').value.trim(),
                scheduleDate: date,
                scheduleTime: time,
                description: description,
                status: status,
                address: document.getElementById('eventAddress').value.trim(),
                assignedStaff: selectedStaff.map(s => s.name)
            });
        } else {
            createSession({
                classId: document.getElementById('eventClassId').value,
                date: date,
                startTime: time,
                description: description,
                status: status,
                assignedStaff: selectedStaff
            });
        }
    }

    closeEventModal();
    loadEvents();
    showNotification(editingEvent ? 'Event updated successfully' : 'Event created successfully', 'success');
}

function calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return 60;

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return endMinutes - startMinutes;
}

function deleteEvent(eventId, eventType) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }

    if (eventType === 'job') {
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const filtered = jobs.filter(j => j.id !== eventId);
        localStorage.setItem('jobs', JSON.stringify(filtered));
    } else {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const filtered = sessions.filter(s => s.id !== eventId);
        localStorage.setItem('class_sessions_v2', JSON.stringify(filtered));
    }

    closeEventPopover();
    loadEvents();
    showNotification('Event deleted successfully', 'success');
}

function createClass(data) {
    const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
    const newClass = {
        id: `CLASS-${new Date().getFullYear()}-${String(classes.length + 1).padStart(3, '0')}`,
        name: data.name,
        description: data.description,
        skillLevel: data.skillLevel,
        maxCapacity: data.maxCapacity,
        status: data.status,
        schedule: data.schedule,
        defaultStaff: data.defaultStaff,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    classes.push(newClass);
    localStorage.setItem('classes_v2', JSON.stringify(classes));
}

function createJob(data) {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const newJob = {
        id: `JOB-${new Date().getFullYear()}-${String(jobs.length + 1).padStart(3, '0')}`,
        quoteId: '',
        customerName: data.customerName,
        customerEmail: '',
        scheduleDate: data.scheduleDate,
        scheduleTime: data.scheduleTime,
        assignedStaff: data.assignedStaff,
        status: data.status,
        total: 0,
        description: data.description,
        address: data.address,
        priority: 'normal',
        duration: ''
    };
    jobs.push(newJob);
    localStorage.setItem('jobs', JSON.stringify(jobs));
}

function updateJob(jobId, data) {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const index = jobs.findIndex(j => j.id === jobId);
    if (index > -1) {
        jobs[index] = { ...jobs[index], ...data };
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }
}

function createSession(data) {
    const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
    const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
    const classData = classes.find(c => c.id === data.classId);

    const newSession = {
        id: `SESSION-${new Date().getFullYear()}-${String(sessions.length + 1).padStart(3, '0')}`,
        classId: data.classId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime || null,
        duration: classData?.schedule?.duration || 60,
        status: data.status,
        maxCapacity: classData?.maxCapacity || 20,
        confirmedSlots: 0,
        assignedStaff: data.assignedStaff,
        bookings: [],
        notes: data.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    sessions.push(newSession);
    localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
}

function updateSession(sessionId, data) {
    const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index > -1) {
        sessions[index] = { ...sessions[index], ...data, updatedAt: new Date().toISOString() };
        localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
    }
}

// ==================== Helper Functions ====================

function loadClassesForSelection(selectedId = null) {
    const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
    const select = document.getElementById('eventClassId');
    if (!select) return;

    select.innerHTML = '<option value="">Select a class</option>';
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.id;
        option.textContent = cls.name;
        if (selectedId === cls.id) option.selected = true;
        select.appendChild(option);
    });
}

// Selected staff array for the modal
let selectedModalStaff = [];

function loadStaffForSelection(selectedStaff = []) {
    selectedModalStaff = selectedStaff.map(s => {
        if (typeof s === 'string') {
            return sampleStaff.find(staff => staff.name === s) || { id: s, name: s, role: 'Staff' };
        }
        return s;
    });

    updateSelectedStaffDisplay();
    loadRecommendedStaff();

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        const dropdown = document.getElementById('staffSearchDropdown');
        const input = document.getElementById('staffSearchInput');
        if (dropdown && input && !dropdown.contains(e.target) && !input.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

function showStaffDropdown() {
    const dropdown = document.getElementById('staffSearchDropdown');
    if (dropdown) {
        renderStaffSearchResults(sampleStaff);
        dropdown.classList.remove('hidden');
    }
}

function filterStaffSearch() {
    const input = document.getElementById('staffSearchInput');
    const searchTerm = input?.value.toLowerCase() || '';

    const filtered = sampleStaff.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm) ||
        staff.role.toLowerCase().includes(searchTerm) ||
        (staff.department && staff.department.toLowerCase().includes(searchTerm))
    );

    renderStaffSearchResults(filtered);
}

function renderStaffSearchResults(staffList) {
    const dropdown = document.getElementById('staffSearchDropdown');
    if (!dropdown) return;

    const availableStaff = staffList.filter(s => !selectedModalStaff.some(sel => sel.id === s.id));

    if (availableStaff.length === 0) {
        dropdown.innerHTML = '<p class="p-3 text-sm text-gray-500 text-center">No staff found</p>';
    } else {
        dropdown.innerHTML = availableStaff.map(staff => `
            <div onclick="selectStaffFromSearch('${staff.id}')" 
                 class="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                        ${staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-900">${staff.name}</p>
                        <p class="text-xs text-gray-500">${staff.role}${staff.department ? ' • ' + staff.department : ''}</p>
                    </div>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </div>
        `).join('');
    }

    dropdown.classList.remove('hidden');
}

function selectStaffFromSearch(staffId) {
    const staff = sampleStaff.find(s => s.id === staffId);
    if (staff && !selectedModalStaff.some(s => s.id === staffId)) {
        selectedModalStaff.push(staff);
        updateSelectedStaffDisplay();

        // Clear search and close dropdown
        const input = document.getElementById('staffSearchInput');
        if (input) input.value = '';

        const dropdown = document.getElementById('staffSearchDropdown');
        if (dropdown) dropdown.classList.add('hidden');
    }
}

function removeSelectedStaff(staffId) {
    selectedModalStaff = selectedModalStaff.filter(s => s.id !== staffId);
    updateSelectedStaffDisplay();
}

function updateSelectedStaffDisplay() {
    const container = document.getElementById('selectedStaffList');
    const countEl = document.getElementById('selectedStaffCount');
    const noStaffEl = document.getElementById('noStaffSelected');

    if (countEl) countEl.textContent = selectedModalStaff.length;

    if (!container) return;

    if (selectedModalStaff.length === 0) {
        container.innerHTML = '<p id="noStaffSelected" class="text-xs text-gray-400 italic">No staff selected</p>';
    } else {
        container.innerHTML = selectedModalStaff.map(staff => `
            <div class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                <span class="font-medium">${staff.name}</span>
                <button type="button" onclick="removeSelectedStaff('${staff.id}')" class="hover:text-blue-600">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }
}

function loadRecommendedStaff() {
    const container = document.getElementById('recommendedStaffList');
    if (!container) return;

    // Get 3 random staff not already selected
    const available = sampleStaff.filter(s => !selectedModalStaff.some(sel => sel.id === s.id));
    const recommended = available.slice(0, 3);

    container.innerHTML = recommended.map(staff => `
        <button type="button" onclick="selectStaffFromSearch('${staff.id}')" 
                class="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 text-gray-700 rounded-full text-xs hover:border-blue-500 hover:bg-blue-50">
            <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>${staff.name}</span>
        </button>
    `).join('');
}

// Get selected staff IDs for saving
function getSelectedStaffIds() {
    return selectedModalStaff.map(s => s.id);
}


function makeEventDraggable(element, event) {
    // Simple drag implementation - can be enhanced with a library
    element.draggable = true;
    element.addEventListener('dragstart', (e) => {
        dragState = { event, element };
        element.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });

    element.addEventListener('dragend', () => {
        element.classList.remove('dragging');
        dragState = null;
    });
}

function updateCurrentTimeIndicator() {
    if (currentView !== 'week' && currentView !== 'day') return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTime = currentHour * 60 + currentMin;

    // Remove existing indicator
    document.querySelectorAll('.current-time-line').forEach(el => el.remove());

    // Add indicator if viewing today
    const todayStr = formatDateString(now);
    if (currentView === 'week') {
        const weekStart = getWeekStart(currentDate);
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(day.getDate() + i);
            if (formatDateString(day) === todayStr) {
                const dayColumn = document.querySelector(`[data-date="${todayStr}"]`)?.parentElement;
                if (dayColumn) {
                    const line = document.createElement('div');
                    line.className = 'current-time-line';
                    line.style.top = `${currentTime * 1}px`;
                    dayColumn.appendChild(line);
                }
            }
        }
    } else if (currentView === 'day') {
        if (formatDateString(currentDate) === todayStr) {
            const timeSlots = document.getElementById('dayTimeSlots');
            if (timeSlots) {
                const line = document.createElement('div');
                line.className = 'current-time-line';
                line.style.top = `${currentTime * 1.33}px`;
                timeSlots.appendChild(line);
            }
        }
    }
}

function updateEventCount() {
    document.getElementById('eventCount').textContent = filteredEvents.length;
}

function formatDate(date) {
    return date.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
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
    let normalized = normalizeTime(timeStr);
    const [hours, minutes] = normalized.split(':').map(Number);
    return hours + (minutes || 0) / 60;
}

function normalizeTime(timeStr) {
    if (!timeStr) return '00:00';
    if (/^\d{1,2}:\d{2}$/.test(timeStr.trim())) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
        let hours = parseInt(match[1]);
        const minutes = match[2];
        const period = match[3].toUpperCase();
        if (period === 'PM' && hours !== 12) hours += 12;
        else if (period === 'AM' && hours === 12) hours = 0;
        return `${String(hours).padStart(2, '0')}:${minutes}`;
    }
    return '00:00';
}

function showNotification(message, type = 'info') {
    const container = document.createElement('div');
    container.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
        }`;
    container.textContent = message;

    document.body.appendChild(container);

    setTimeout(() => {
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        }, 300);
    }, 3000);
}

// Update filter checkboxes
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('filterJobs').addEventListener('change', function () {
        filters.jobs = this.checked;
        applyFilters();
    });
    document.getElementById('filterSessions').addEventListener('change', function () {
        filters.sessions = this.checked;
        applyFilters();
    });
    document.getElementById('filterScheduled').addEventListener('change', function () {
        filters.scheduled = this.checked;
        applyFilters();
    });
    document.getElementById('filterInProgress').addEventListener('change', function () {
        filters.inProgress = this.checked;
        applyFilters();
    });
    document.getElementById('filterCompleted').addEventListener('change', function () {
        filters.completed = this.checked;
        applyFilters();
    });
});

// Sample pricebook items for class linking
const samplePricebookItems = [
    { id: 'PB-001', name: 'Yoga Class Drop-in', price: 25.00, unit: 'per session', category: 'Fitness' },
    { id: 'PB-002', name: 'Yoga Monthly Membership', price: 150.00, unit: 'per month', category: 'Fitness' },
    { id: 'PB-003', name: 'Private Tutoring - 1 Hour', price: 75.00, unit: 'per hour', category: 'Education' },
    { id: 'PB-004', name: 'Group Tutoring Session', price: 35.00, unit: 'per session', category: 'Education' },
    { id: 'PB-005', name: 'Music Lesson - Beginner', price: 45.00, unit: 'per lesson', category: 'Music' },
    { id: 'PB-006', name: 'Music Lesson - Advanced', price: 65.00, unit: 'per lesson', category: 'Music' },
    { id: 'PB-007', name: 'Dance Class Drop-in', price: 20.00, unit: 'per class', category: 'Fitness' },
    { id: 'PB-008', name: 'Workshop - Full Day', price: 120.00, unit: 'per day', category: 'General' }
];

let selectedPricebookItem = null;

// Show pricebook modal for class creation
function showClassPricebookModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('classPricebookModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'classPricebookModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[70vh] overflow-hidden flex flex-col">
                <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">Select Price Book Item</h3>
                    <button onclick="closeClassPricebookModal()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-4">
                    <input type="text" id="pricebookSearchInput" placeholder="Search pricebook items..." oninput="filterPricebookItems()"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />
                </div>
                <div id="pricebookItemsList" class="px-4 pb-4 overflow-y-auto flex-1 space-y-2">
                    <!-- Pricebook items will be rendered here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Render pricebook items
    renderPricebookItems(samplePricebookItems);
    modal.classList.remove('hidden');
}

// Close pricebook modal
function closeClassPricebookModal() {
    const modal = document.getElementById('classPricebookModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Render pricebook items in the modal
function renderPricebookItems(items) {
    const container = document.getElementById('pricebookItemsList');
    if (!container) return;

    container.innerHTML = items.map(item => `
        <div onclick="selectClassPricebookItem('${item.id}')" 
             class="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors ${selectedPricebookItem?.id === item.id ? 'border-blue-500 bg-blue-50' : ''}">
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-medium text-gray-900">${item.name}</p>
                    <p class="text-xs text-gray-500">${item.category} • ${item.unit}</p>
                </div>
                <span class="text-sm font-semibold text-blue-600">$${item.price.toFixed(2)}</span>
            </div>
        </div>
    `).join('');
}

// Filter pricebook items based on search
function filterPricebookItems() {
    const searchInput = document.getElementById('pricebookSearchInput');
    const searchTerm = searchInput?.value.toLowerCase() || '';

    const filtered = samplePricebookItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );

    renderPricebookItems(filtered);
}

// Select a pricebook item
function selectClassPricebookItem(itemId) {
    const item = samplePricebookItems.find(p => p.id === itemId);
    if (!item) return;

    selectedPricebookItem = item;
    document.getElementById('classPricebookItemId').value = item.id;

    // Update the container to show selected item
    const container = document.getElementById('classPricebookContainer');
    if (container) {
        container.innerHTML = `
            <div class="flex items-center justify-between p-3 border border-blue-500 bg-blue-50 rounded-lg">
                <div>
                    <p class="font-medium text-gray-900">${item.name}</p>
                    <p class="text-xs text-gray-500">${item.category} • ${item.unit} • <span class="text-blue-600 font-medium">$${item.price.toFixed(2)}</span></p>
                </div>
                <button type="button" onclick="removePricebookSelection()" class="text-gray-400 hover:text-red-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
    }

    closeClassPricebookModal();
}

// Remove pricebook selection
function removePricebookSelection() {
    selectedPricebookItem = null;
    document.getElementById('classPricebookItemId').value = '';

    const container = document.getElementById('classPricebookContainer');
    if (container) {
        container.innerHTML = `
            <button type="button" id="selectClassPricebookBtn" onclick="showClassPricebookModal()" class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <div>
                        <p class="text-sm font-medium text-gray-700">Select Price Book Item</p>
                        <p class="text-xs text-gray-500">Link to a purchasable service</p>
                    </div>
                </div>
            </button>
        `;
    }
}
