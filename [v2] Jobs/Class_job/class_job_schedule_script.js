// Class Job Schedule - dedicated schedule for a single class job

let currentView = 'week';
let currentDate = new Date();
let classJob = null;
let classSessions = []; // computed sessions to display

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function loadClassJob() {
    const id = getQueryParam('id');
    if (!id) {
        document.getElementById('classScheduleSubtitle').textContent = 'Missing class job id in URL';
        return;
    }

    let stored = localStorage.getItem('job_' + id) || localStorage.getItem('currentJob');
    if (!stored) {
        document.getElementById('classScheduleSubtitle').textContent = 'Class job not found';
        return;
    }

    try {
        const jobData = JSON.parse(stored);
        if (!jobData.classMode || !jobData.classMode.enabled) {
            document.getElementById('classScheduleSubtitle').textContent = 'This job is not a class job';
            return;
        }
        classJob = jobData;
    } catch (e) {
        console.error('Error parsing class job', e);
        document.getElementById('classScheduleSubtitle').textContent = 'Error loading class job';
        return;
    }

    const titleEl = document.getElementById('classScheduleTitle');
    const subtitleEl = document.getElementById('classScheduleSubtitle');

    if (titleEl) {
        titleEl.textContent = classJob.classMode.name || classJob.name || 'Class Schedule';
    }
    if (subtitleEl) {
        subtitleEl.textContent = classJob.id || id;
    }

    const backBtn = document.getElementById('backToClassBtn');
    if (backBtn) {
        backBtn.onclick = () => {
            window.location.href = `class_job_detail.html?id=${encodeURIComponent(classJob.id || id)}`;
        };
    }
    
    // Align the calendar's current date with the class's scheduled date (if available)
    const baseDateStr = classJob.scheduleDate || classJob.classMode?.scheduleDate || null;
    if (baseDateStr) {
        const baseDate = new Date(baseDateStr + 'T00:00:00');
        if (!isNaN(baseDate.getTime())) {
            currentDate = baseDate;
        }
    }

    buildClassSessions();
    renderCurrentView();
}

function buildClassSessions() {
    classSessions = [];
    if (!classJob) return;

    // Base date/time for this class session
    const baseDate = classJob.scheduleDate || classJob.classMode?.scheduleDate || null;
    const startTime = classJob.scheduleTime || classJob.startTime || classJob.classMode?.startTime || '09:00';
    const endTime = classJob.endTime || classJob.classMode?.endTime || null;

    if (!baseDate) {
        return;
    }

    const bookings = (classJob.classMode && Array.isArray(classJob.classMode.bookings))
        ? classJob.classMode.bookings
        : (classJob.bookings || []);

    const capacity = classJob.classMode?.capacity || 0;

    const enrolledSlots = (bookings || [])
        .filter(b => b.status === 'confirmed' || b.status === 'paid')
        .reduce((sum, b) => sum + (b.slots || 1), 0);

    const waitlistedSlots = (bookings || [])
        .filter(b => b.status === 'waitlisted')
        .reduce((sum, b) => sum + (b.slots || 1), 0);

    classSessions.push({
        id: classJob.id,
        date: baseDate,
        startTime,
        endTime,
        capacity,
        enrolledSlots,
        waitlistedSlots,
        bookings
    });
}

function startOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Monday as first day
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function formatDateLabel(start, end) {
    const optsShort = { month: 'short', day: 'numeric' };
    const optsFull = { month: 'short', day: 'numeric', year: 'numeric' };

    if (start.toDateString() === end.toDateString()) {
        return start.toLocaleDateString('en-US', optsFull);
    }

    const sameMonth = start.getMonth() === end.getMonth();
    const sameYear = start.getFullYear() === end.getFullYear();

    if (sameMonth && sameYear) {
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}  ${end.getDate()}, ${end.getFullYear()}`;
    }

    return `${start.toLocaleDateString('en-US', optsShort)}  ${end.toLocaleDateString('en-US', optsFull)}`;
}

function renderWeekView() {
    const header = document.getElementById('calendarHeader');
    const grid = document.getElementById('calendarGrid');
    const label = document.getElementById('currentRangeLabel');

    if (!header || !grid || !label) return;

    const weekStart = startOfWeek(currentDate);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        weekDates.push(d);
    }

    const weekEnd = weekDates[6];
    label.textContent = formatDateLabel(weekStart, weekEnd);

    header.innerHTML = '';
    header.className = 'grid grid-cols-7 bg-gray-50 border-b border-gray-200';

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayStr = new Date().toISOString().split('T')[0];

    weekDates.forEach((d, idx) => {
        const dateStr = d.toISOString().split('T')[0];
        const isToday = dateStr === todayStr;
        const classes = isToday ? 'bg-emerald-50 border-l-2 border-r-2 border-emerald-500' : '';

        const col = document.createElement('div');
        col.className = `p-3 text-center text-sm ${classes}`;
        col.innerHTML = `
            <div class="font-semibold ${isToday ? 'text-emerald-700' : 'text-gray-700'}">${dayNames[idx]}</div>
            <div class="text-lg font-bold ${isToday ? 'text-emerald-900' : 'text-gray-900'} mt-1">${d.getDate()}</div>
            ${isToday ? '<div class="text-xs text-emerald-600 mt-1">Today</div>' : ''}
        `;
        header.appendChild(col);
    });

    const timeSlots = [];
    for (let h = 7; h <= 20; h++) {
        timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
    }

    grid.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'time-grid';

    timeSlots.forEach(time => {
        const labelCell = document.createElement('div');
        labelCell.className = 'time-label';
        labelCell.textContent = formatTimeDisplay(time);
        wrapper.appendChild(labelCell);

        weekDates.forEach(d => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.dataset.date = d.toISOString().split('T')[0];
            slot.dataset.time = time;

            const matchingSessions = classSessions.filter(s => s.date === slot.dataset.date && (s.startTime || '').slice(0,5) === time);

            matchingSessions.forEach((session, idx) => {
                const block = createSessionBlock(session, idx);
                slot.appendChild(block);
            });

            wrapper.appendChild(slot);
        });
    });

    grid.appendChild(wrapper);
}

function renderDayView() {
    const header = document.getElementById('calendarHeader');
    const grid = document.getElementById('calendarGrid');
    const label = document.getElementById('currentRangeLabel');

    if (!header || !grid || !label) return;

    const day = new Date(currentDate);
    day.setHours(0, 0, 0, 0);

    label.textContent = day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    header.innerHTML = '';
    header.className = 'bg-gray-50 border-b border-gray-200 p-4';

    const todayStr = new Date().toISOString().split('T')[0];
    const dateStr = day.toISOString().split('T')[0];
    const isToday = todayStr === dateStr;

    header.innerHTML = `
        <div class="text-center">
            <div class="text-2xl font-bold ${isToday ? 'text-emerald-900' : 'text-gray-900'}">${day.toLocaleDateString('en-US', { weekday: 'long' })}</div>
            <div class="text-lg ${isToday ? 'text-emerald-700' : 'text-gray-700'}">${day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            ${isToday ? '<div class="text-sm text-emerald-600 mt-1">Today</div>' : ''}
        </div>
    `;

    grid.innerHTML = '';

    const timeSlots = [];
    for (let h = 7; h <= 20; h++) {
        timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
    }

    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '80px 1fr';
    container.style.border = '1px solid #e5e7eb';
    container.style.background = 'white';

    const dateStrForDay = day.toISOString().split('T')[0];

    timeSlots.forEach(time => {
        const labelCell = document.createElement('div');
        labelCell.className = 'time-label';
        labelCell.textContent = formatTimeDisplay(time);
        container.appendChild(labelCell);

        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.dataset.date = dateStrForDay;
        slot.dataset.time = time;

        const matchingSessions = classSessions.filter(s => s.date === slot.dataset.date && (s.startTime || '').slice(0,5) === time);
        matchingSessions.forEach((session, idx) => {
            const block = createSessionBlock(session, idx);
            slot.appendChild(block);
        });

        container.appendChild(slot);
    });

    grid.appendChild(container);
}

function formatTimeDisplay(time) {
    const [hStr, mStr] = time.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return `${h}:${m} ${ampm}`;
}

function createSessionBlock(session, index) {
    const block = document.createElement('div');
    block.className = 'session-block bg-emerald-50 text-emerald-900 border border-emerald-200';

    const displayTime = session.endTime
        ? `${(session.startTime || '').slice(0,5)} - ${session.endTime.slice(0,5)}`
        : formatTimeDisplay((session.startTime || '').slice(0,5));

    const capacity = session.capacity || 0;
    const enrolled = session.enrolledSlots || 0;
    const waitlisted = session.waitlistedSlots || 0;

    let fillClass = 'text-emerald-900';
    if (capacity > 0) {
        const ratio = enrolled / capacity;
        if (ratio > 1) fillClass = 'text-red-700';
        else if (ratio > 0.8) fillClass = 'text-amber-700';
    }

    block.innerHTML = `
        <div class="flex flex-col gap-0.5">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold truncate">${classJob?.classMode?.name || classJob?.name || 'Class'}</span>
                <span class="text-[10px] font-medium ${fillClass}">${enrolled}/${capacity || '0'} seats</span>
            </div>
            <div class="text-[10px] font-medium opacity-90">${displayTime}</div>
            ${waitlisted > 0 ? `<div class="text-[10px] text-amber-700 mt-0.5">Waitlist: ${waitlisted}</div>` : ''}
        </div>
    `;

    const topOffset = index * 40;
    const baseHeight = 36;
    block.style.top = `${4 + topOffset}px`;
    block.style.height = `${baseHeight}px`;
    block.style.minHeight = `${baseHeight}px`;

    block.onclick = (e) => {
        e.stopPropagation();
        showSessionDetails(session);
    };

    return block;
}

function showSessionDetails(session) {
    const details = document.getElementById('selectedSessionDetails');
    const enrollSummary = document.getElementById('sessionEnrollmentSummary');

    if (!details || !enrollSummary) return;

    const dateLabel = new Date(session.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });

    details.innerHTML = `
        <div class="space-y-1">
            <p class="font-semibold text-gray-900">${classJob?.classMode?.name || classJob?.name || 'Class Session'}</p>
            <p class="text-gray-600">${dateLabel}</p>
            <p class="text-gray-600">Time: ${(session.startTime || '').slice(0,5)}${session.endTime ? '  ' + session.endTime.slice(0,5) : ''}</p>
        </div>
    `;

    const capacity = session.capacity || 0;
    const enrolled = session.enrolledSlots || 0;
    const waitlisted = session.waitlistedSlots || 0;

    const remaining = capacity > 0 ? capacity - enrolled : 0;

    enrollSummary.innerHTML = `
        <div class="space-y-1">
            <p><span class="font-medium">Capacity:</span> ${enrolled}/${capacity || '0'} seats</p>
            <p><span class="font-medium">Remaining:</span> ${remaining < 0 ? 0 : remaining}</p>
            <p><span class="font-medium">Waitlist:</span> ${waitlisted}</p>
        </div>
    `;
}

function renderCurrentView() {
    if (currentView === 'week') {
        renderWeekView();
    } else {
        renderDayView();
    }
}

function wireToolbar() {
    const weekBtn = document.getElementById('weekViewBtn');
    const dayBtn = document.getElementById('dayViewBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const todayBtn = document.getElementById('todayBtn');

    if (weekBtn && dayBtn) {
        weekBtn.onclick = () => {
            currentView = 'week';
            weekBtn.className = 'px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm';
            dayBtn.className = 'px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm';
            renderCurrentView();
        };
        dayBtn.onclick = () => {
            currentView = 'day';
            dayBtn.className = 'px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm';
            weekBtn.className = 'px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm';
            renderCurrentView();
        };
    }

    if (prevBtn) {
        prevBtn.onclick = () => {
            const delta = currentView === 'week' ? -7 : -1;
            currentDate.setDate(currentDate.getDate() + delta);
            renderCurrentView();
        };
    }
    if (nextBtn) {
        nextBtn.onclick = () => {
            const delta = currentView === 'week' ? 7 : 1;
            currentDate.setDate(currentDate.getDate() + delta);
            renderCurrentView();
        };
    }
    if (todayBtn) {
        todayBtn.onclick = () => {
            currentDate = new Date();
            renderCurrentView();
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    wireToolbar();
    loadClassJob();
});
