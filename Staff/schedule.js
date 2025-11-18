// Staff Schedule JavaScript

// Current staff member
const currentStaff = {
    id: 'STAFF-001',
    name: 'John Smith'
};

// Sample jobs data - filtered to only show jobs assigned to current staff
// In production, this would come from API filtered by assignedTo
const allJobs = [
    {
        id: 'JOB-2024-124',
        title: 'Garden Maintenance',
        description: 'Regular garden maintenance including mowing, trimming, and weeding',
        customer: 'Michael Chen',
        customerPhone: '+61 400 123 456',
        customerEmail: 'michael@email.com',
        scheduleDate: new Date().toISOString().split('T')[0],
        scheduleTime: '09:00',
        duration: '2.5 hrs',
        address: '456 Oak Ave, Melbourne VIC 3000',
        priority: 'normal',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        estimatedPay: 75,
        notes: 'Customer requests front yard focus'
    },
    {
        id: 'JOB-2024-125',
        title: 'Pool Cleaning & Maintenance',
        description: 'Complete pool cleaning, chemical balance check, and filter maintenance',
        customer: 'Emma Wilson',
        customerPhone: '+61 400 234 567',
        customerEmail: 'emma@email.com',
        scheduleDate: new Date().toISOString().split('T')[0],
        scheduleTime: '11:30',
        duration: '1.5 hrs',
        address: '789 Beach Rd, Brighton VIC 3186',
        priority: 'normal',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        estimatedPay: 85,
        notes: 'Pool equipment in garage'
    },
    {
        id: 'JOB-2024-126',
        title: 'Emergency Plumbing Repair',
        description: 'Fix leaking pipe in kitchen',
        customer: 'David Brown',
        customerPhone: '+61 400 345 678',
        customerEmail: 'david@email.com',
        scheduleDate: new Date().toISOString().split('T')[0],
        scheduleTime: '14:00',
        duration: '1 hr',
        address: '321 Hill St, Richmond VIC 3121',
        priority: 'urgent',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        estimatedPay: 120,
        notes: 'URGENT - Water leak active'
    },
    {
        id: 'JOB-2024-127',
        title: 'Home Deep Cleaning',
        description: '3-bedroom house deep clean',
        customer: 'Lisa Anderson',
        customerPhone: '+61 400 456 789',
        customerEmail: 'lisa@email.com',
        scheduleDate: new Date().toISOString().split('T')[0],
        scheduleTime: '08:00',
        duration: '3 hrs',
        address: '555 Park Lane, Hawthorn VIC 3122',
        priority: 'high',
        status: 'in_progress',
        assignedTo: 'STAFF-001',
        estimatedPay: 150,
        notes: 'Keys under mat'
    },
    {
        id: 'JOB-2024-128',
        title: 'Window Cleaning - Commercial',
        description: 'Office building window cleaning',
        customer: 'ABC Corporation',
        customerPhone: '+61 3 9000 0000',
        customerEmail: 'admin@abc.com',
        scheduleDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        scheduleTime: '13:00',
        duration: '2 hrs',
        address: '100 Business St, CBD VIC 3000',
        priority: 'normal',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        estimatedPay: 180,
        notes: 'Access via loading dock'
    },
    {
        id: 'JOB-2024-129',
        title: 'Gutter Cleaning',
        description: 'Clean gutters and downpipes',
        customer: 'Patricia Taylor',
        customerPhone: '+61 400 678 901',
        customerEmail: 'patricia@email.com',
        scheduleDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        scheduleTime: '10:00',
        duration: '1.5 hrs',
        address: '888 Valley Rd, Camberwell VIC 3124',
        priority: 'normal',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        estimatedPay: 95,
        notes: 'Two-story house'
    },
    {
        id: 'JOB-2024-130',
        title: 'Carpet Steam Cleaning',
        description: 'Steam clean all carpets in 2BR apartment',
        customer: 'James Wilson',
        customerPhone: '+61 400 789 012',
        customerEmail: 'james@email.com',
        scheduleDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        scheduleTime: '15:00',
        duration: '2 hrs',
        address: '45 Tower Ave, Southbank VIC 3006',
        priority: 'normal',
        status: 'scheduled',
        assignedTo: 'STAFF-001',
        estimatedPay: 110,
        notes: 'Apartment 1205, building entry code: 1234'
    }
];

// Filter jobs to only show those assigned to current staff
const jobs = allJobs.filter(job => job.assignedTo === currentStaff.id);

// State
let currentDate = new Date();
let currentView = 'week';
let selectedJob = null;

// Mobile sidebar toggle
function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
    }
}

// Calendar functions
function renderCalendar() {
    if (currentView === 'week') {
        renderWeekView();
    } else if (currentView === 'day') {
        renderDayView();
    } else {
        renderMonthView();
    }
    updateTodaySummary();
}

function renderWeekView() {
    // Get start of week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    // Update week display
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const weekElement = document.getElementById('currentWeek');
    if (weekElement) {
        weekElement.textContent = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${endOfWeek.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
    }
    
    // Update header with dates
    const header = document.getElementById('calendarHeader');
    header.innerHTML = '';
    
    // Add empty cell for time column
    const timeHeaderCell = document.createElement('div');
    timeHeaderCell.className = 'p-3 bg-gray-100 border-r border-gray-200';
    timeHeaderCell.style.width = '80px';
    timeHeaderCell.style.height = '60px';
    timeHeaderCell.style.display = 'flex';
    timeHeaderCell.style.alignItems = 'center';
    timeHeaderCell.style.justifyContent = 'center';
    timeHeaderCell.innerHTML = '<div class="text-xs font-semibold text-gray-600">Time</div>';
    header.appendChild(timeHeaderCell);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        
        const isToday = date.toDateString() === today.toDateString();
        
        const dayHeader = document.createElement('div');
        dayHeader.className = `p-3 text-center text-sm border-r border-gray-200 ${isToday ? 'bg-blue-50 border-l-2 border-r-2 border-blue-500' : ''}`;
        dayHeader.style.height = '60px';
        dayHeader.style.display = 'flex';
        dayHeader.style.flexDirection = 'column';
        dayHeader.style.justifyContent = 'center';
        
        dayHeader.innerHTML = `
            <div class="font-semibold ${isToday ? 'text-blue-700' : 'text-gray-700'}">${dayNames[i]}</div>
            <div class="text-lg font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'} mt-1">${date.getDate()}</div>
            ${isToday ? '<div class="text-xs text-blue-600 mt-1">Today</div>' : ''}
        `;
        
        header.appendChild(dayHeader);
    }
    
    // Update header grid layout to match time grid
    header.className = 'bg-gray-50 border-b border-gray-200';
    header.style.display = 'grid';
    header.style.gridTemplateColumns = '80px repeat(7, 1fr)';
    header.style.border = '1px solid #e5e7eb';
    header.style.borderBottom = '1px solid #e5e7eb';
    
    // Render time grid
    renderTimeGrid(startOfWeek);
}

function renderTimeGrid(startOfWeek) {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    grid.className = 'time-grid';
    
    // Time slots from 8 AM to 7 PM (12 hours)
    const timeSlots = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
        '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', 
        '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
    ];
    
    // Get current time for highlighting
    const now = new Date();
    const currentHour = now.getHours();
    const currentDate = now.toISOString().split('T')[0];
    
    // Create grid cells
    for (let hour = 0; hour < 12; hour++) {
        const slotHour = 8 + hour;
        const isCurrentHour = currentHour === slotHour;
        
        // Time label
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        
        // Highlight current hour
        if (isCurrentHour) {
            timeLabel.style.cssText = `
                border-right: 1px solid #e5e7eb;
                border-bottom: 1px solid #f3f4f6;
                background-color: #dbeafe;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                font-weight: 600;
                color: #1d4ed8;
            `;
            timeLabel.innerHTML = `
                ${timeSlots[hour]}
                <div style="font-size: 8px; margin-left: 4px; color: #1d4ed8;">NOW</div>
            `;
        } else {
            timeLabel.textContent = timeSlots[hour];
        }
        
        grid.appendChild(timeLabel);
        
        // Day columns
        for (let day = 0; day < 7; day++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + day);
            const dateStr = date.toISOString().split('T')[0];
            
            const isToday = dateStr === currentDate;
            const isCurrentTimeSlot = isToday && isCurrentHour;
            
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.setAttribute('data-date', dateStr);
            timeSlot.setAttribute('data-hour', slotHour);
            
            // Highlight current time slot
            if (isCurrentTimeSlot) {
                timeSlot.style.cssText = `
                    border-right: 1px solid #e5e7eb;
                    border-bottom: 1px solid #f3f4f6;
                    position: relative;
                    background: linear-gradient(135deg, #dbeafe 0%, #ffffff 100%);
                    border-left: 3px solid #3b82f6;
                    box-shadow: inset 0 0 0 1px #bfdbfe;
                `;
            }
            
            // Find jobs for this time slot
            const hourStart = 8 + hour;
            const hourEnd = hourStart + 1;
            
            const slotJobs = jobs.filter(job => {
                if (!job.scheduleDate || job.scheduleDate !== dateStr) return false;
                
                const jobHour = parseInt(job.scheduleTime.split(':')[0]);
                const inTimeSlot = jobHour >= hourStart && jobHour < hourEnd;
                
                return inTimeSlot;
            });
            
            // Add jobs to time slot
            slotJobs.forEach((job, index) => {
                const jobBlock = createJobBlock(job, index);
                timeSlot.appendChild(jobBlock);
            });
            
            grid.appendChild(timeSlot);
        }
    }
}

function createJobBlock(job, index = 0) {
    const jobBlock = document.createElement('div');
    let jobColorClass = getJobColor(job.status);
    
    jobBlock.className = `job-block ${jobColorClass}`;
    jobBlock.onclick = (e) => {
        e.stopPropagation();
        showJobModal(job);
    };
    
    // Add tooltip functionality
    jobBlock.addEventListener('mouseenter', (e) => showJobTooltip(e, job));
    jobBlock.addEventListener('mouseleave', hideJobTooltip);
    jobBlock.addEventListener('mousemove', (e) => updateTooltipPosition(e));
    
    // Position multiple jobs in the same slot
    const topOffset = index * 20;
    jobBlock.style.top = `${4 + topOffset}px`;
    jobBlock.style.height = '16px';
    
    jobBlock.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center min-w-0 flex-1">
                <span class="text-xs font-medium truncate mr-1">${job.customer}</span>
            </div>
            <span class="text-xs font-semibold ml-1">$${job.estimatedPay.toFixed(0)}</span>
        </div>
    `;
    
    return jobBlock;
}

function renderDayView() {
    // Update day display
    const dayElement = document.getElementById('currentWeek');
    if (dayElement) {
        dayElement.textContent = currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
    
    // Update header for day view
    const header = document.getElementById('calendarHeader');
    header.innerHTML = '';
    header.className = 'bg-gray-50 border-b border-gray-200 p-4';
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[currentDate.getDay()];
    const isToday = currentDate.toDateString() === new Date().toDateString();
    
    header.innerHTML = `
        <div class="text-center">
            <div class="text-2xl font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}">${dayName}</div>
            <div class="text-lg ${isToday ? 'text-blue-700' : 'text-gray-700'}">${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            ${isToday ? '<div class="text-sm text-blue-600 mt-1">Today</div>' : ''}
        </div>
    `;
    
    // Render day schedule
    renderDaySchedule();
}

function renderDaySchedule() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    grid.className = 'day-schedule';
    
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Time slots from 7 AM to 8 PM (13 hours) with 30-minute intervals
    const timeSlots = [];
    for (let hour = 7; hour <= 20; hour++) {
        timeSlots.push(`${hour}:00`);
        if (hour < 20) timeSlots.push(`${hour}:30`);
    }
    
    // Create day schedule container
    const scheduleContainer = document.createElement('div');
    scheduleContainer.className = 'day-schedule-container';
    
    // Get all jobs for this day
    const dayJobs = jobs.filter(j => j.scheduleDate === dateStr);
    
    // Get current time for highlighting
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const isToday = dateStr === now.toISOString().split('T')[0];
    
    timeSlots.forEach((timeSlot, index) => {
        const [hour, minute] = timeSlot.split(':').map(Number);
        
        // Check if this is the current time slot
        const isCurrentTimeSlot = isToday && 
            currentHour === hour && 
            currentMinute >= minute && 
            currentMinute < (minute + 30);
        
        // Check if this time slot is in the past today
        const isPastTimeSlot = isToday && 
            (currentHour > hour || (currentHour === hour && currentMinute > minute + 30));
        
        // Time label
        const timeLabel = document.createElement('div');
        timeLabel.className = 'day-time-label';
        
        let timeLabelStyle = `
            padding: 12px 8px;
            border-right: 1px solid #e5e7eb;
            border-bottom: 1px solid #f3f4f6;
            font-size: 0.75rem;
            font-weight: 500;
            text-align: center;
        `;
        
        if (isCurrentTimeSlot) {
            timeLabelStyle += `
                background-color: #dbeafe;
                color: #1d4ed8;
                font-weight: 600;
                border-right: 2px solid #3b82f6;
            `;
        } else if (isPastTimeSlot) {
            timeLabelStyle += `
                background-color: #f3f4f6;
                color: #9ca3af;
            `;
        } else {
            timeLabelStyle += `
                background-color: #f9fafb;
                color: #6b7280;
            `;
        }
        
        timeLabel.style.cssText = timeLabelStyle;
        
        const displayTime = hour > 12 ? `${hour - 12}:${minute.toString().padStart(2, '0')} PM` : 
                           hour === 12 ? `12:${minute.toString().padStart(2, '0')} PM` :
                           hour === 0 ? `12:${minute.toString().padStart(2, '0')} AM` :
                           `${hour}:${minute.toString().padStart(2, '0')} AM`;
        timeLabel.textContent = displayTime;
        
        // Add "NOW" indicator for current time slot
        if (isCurrentTimeSlot) {
            timeLabel.innerHTML = `
                ${displayTime}
                <div style="font-size: 8px; font-weight: 700; color: #1d4ed8; margin-top: 2px;">NOW</div>
            `;
        }
        
        // Time slot
        const timeSlotDiv = document.createElement('div');
        timeSlotDiv.className = 'day-time-slot';
        
        let timeSlotStyle = `
            padding: 8px 12px;
            border-bottom: 1px solid #f3f4f6;
            min-height: 40px;
            position: relative;
        `;
        
        if (isCurrentTimeSlot) {
            timeSlotStyle += `
                background: linear-gradient(90deg, #dbeafe 0%, #ffffff 100%);
                border-left: 3px solid #3b82f6;
                box-shadow: inset 0 0 0 1px #bfdbfe;
            `;
        } else if (isPastTimeSlot) {
            timeSlotStyle += `
                background: #fafafa;
                opacity: 0.7;
            `;
        } else {
            timeSlotStyle += `
                background: white;
            `;
        }
        
        timeSlotDiv.style.cssText = timeSlotStyle;
        timeSlotDiv.setAttribute('data-date', dateStr);
        timeSlotDiv.setAttribute('data-time', timeSlot);
        
        // Find jobs for this time slot
        const slotJobs = dayJobs.filter(job => {
            const jobTime = job.scheduleTime;
            const jobHour = parseInt(jobTime.split(':')[0]);
            const jobMinute = parseInt(jobTime.split(':')[1] || '0');
            
            // Check if job falls within this 30-minute slot
            const slotStart = hour * 60 + minute;
            const slotEnd = slotStart + 30;
            const jobTimeMinutes = jobHour * 60 + jobMinute;
            
            const inTimeSlot = jobTimeMinutes >= slotStart && jobTimeMinutes < slotEnd;
            return inTimeSlot;
        });
        
        // Add jobs to time slot
        slotJobs.forEach(job => {
            const jobCard = createDayJobCard(job);
            timeSlotDiv.appendChild(jobCard);
        });
        
        scheduleContainer.appendChild(timeLabel);
        scheduleContainer.appendChild(timeSlotDiv);
    });
    
    grid.appendChild(scheduleContainer);
}

function createDayJobCard(job) {
    const jobCard = document.createElement('div');
    jobCard.className = `day-job-card ${getJobColor(job.status)}`;
    jobCard.onclick = (e) => {
        e.stopPropagation();
        showJobModal(job);
    };
    
    // Add tooltip functionality
    jobCard.addEventListener('mouseenter', (e) => showJobTooltip(e, job));
    jobCard.addEventListener('mouseleave', hideJobTooltip);
    jobCard.addEventListener('mousemove', (e) => updateTooltipPosition(e));
    
    jobCard.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <div class="font-semibold text-sm">${formatTime(job.scheduleTime)}</div>
            <div class="text-sm font-semibold">$${job.estimatedPay.toFixed(0)}</div>
        </div>
        <div class="font-medium text-sm mb-1">${job.title}</div>
        <div class="text-xs text-gray-600 mb-2">${job.description}</div>
        <div class="flex items-center justify-between">
            <div class="text-xs text-gray-600">${job.customer}</div>
            <div class="text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(job.status)}">
                ${job.status.replace('_', ' ').toUpperCase()}
            </div>
        </div>
    `;
    
    // Add hover effect
    jobCard.addEventListener('mouseenter', () => {
        jobCard.style.transform = 'translateY(-2px)';
        jobCard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });
    
    jobCard.addEventListener('mouseleave', () => {
        jobCard.style.transform = 'translateY(0)';
        jobCard.style.boxShadow = 'none';
    });
    
    return jobCard;
}

function getStatusBadgeColor(status) {
    switch (status) {
        case 'scheduled': return 'bg-blue-100 text-blue-800';
        case 'in_progress': return 'bg-purple-100 text-purple-800';
        case 'completed': return 'bg-green-100 text-green-800';
        case 'on_hold': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function renderMonthView() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    const monthElement = document.getElementById('currentWeek');
    if (monthElement) {
        monthElement.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    grid.className = 'grid grid-cols-7';
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        grid.appendChild(createDayCell(day, true, new Date(year, month - 1, day)));
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        grid.appendChild(createDayCell(day, false, date));
    }
    
    // Next month days
    const totalCells = grid.children.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let day = 1; day <= remainingCells; day++) {
        grid.appendChild(createDayCell(day, true, new Date(year, month + 1, day)));
    }
}

function createDayCell(day, isOtherMonth, date) {
    const cell = document.createElement('div');
    cell.className = `calendar-day border-b border-r border-gray-200 p-2 ${isOtherMonth ? 'bg-gray-50' : 'bg-white'}`;
    
    const dateStr = date.toISOString().split('T')[0];
    const isToday = dateStr === new Date().toISOString().split('T')[0];
    
    // Day number
    const dayNum = document.createElement('div');
    dayNum.className = `text-sm font-semibold mb-1 ${isOtherMonth ? 'text-gray-400' : 'text-gray-700'}`;
    if (isToday) {
        dayNum.innerHTML = `<span class="inline-flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full text-xs">${day}</span>`;
    } else {
        dayNum.textContent = day;
    }
    cell.appendChild(dayNum);
    
    // Jobs for this day
    const dayJobs = jobs.filter(j => j.scheduleDate === dateStr);
    dayJobs.forEach(job => {
        const jobPill = document.createElement('div');
        jobPill.className = `job-pill ${getJobColor(job.status)} truncate text-xs p-1 mb-1 rounded`;
        jobPill.textContent = `${formatTime(job.scheduleTime)} ${job.customer}`;
        jobPill.onclick = () => showJobModal(job);
        cell.appendChild(jobPill);
    });
    
    return cell;
}

function getJobColor(status) {
    const colors = {
        scheduled: 'bg-blue-100 text-blue-800 border border-blue-300',
        in_progress: 'bg-purple-100 text-purple-800 border border-purple-300',
        completed: 'bg-green-100 text-green-800 border border-green-300',
        on_hold: 'bg-orange-100 text-orange-800 border border-orange-300'
    };
    return colors[status] || colors.scheduled;
}

function formatTime(time24) {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes || '00'} ${ampm}`;
}

function updateTodaySummary() {
    const today = new Date().toISOString().split('T')[0];
    const todayJobs = jobs.filter(job => job.scheduleDate === today);
    
    const summaryContainer = document.getElementById('todaySummary');
    if (!summaryContainer) return;
    
    if (todayJobs.length === 0) {
        summaryContainer.innerHTML = '<p class="text-gray-500 italic">No jobs scheduled for today</p>';
        return;
    }
    
    const scheduled = todayJobs.filter(j => j.status === 'scheduled').length;
    const inProgress = todayJobs.filter(j => j.status === 'in_progress').length;
    const completed = todayJobs.filter(j => j.status === 'completed').length;
    const totalPay = todayJobs.reduce((sum, job) => sum + (job.estimatedPay || 0), 0);
    
    summaryContainer.innerHTML = `
        <div class="space-y-2">
            <div class="flex justify-between">
                <span class="text-gray-600">Total Jobs:</span>
                <span class="font-semibold">${todayJobs.length}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">Scheduled:</span>
                <span class="font-semibold text-blue-600">${scheduled}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">In Progress:</span>
                <span class="font-semibold text-purple-600">${inProgress}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">Completed:</span>
                <span class="font-semibold text-green-600">${completed}</span>
            </div>
            <div class="pt-2 border-t border-gray-200">
                <div class="flex justify-between">
                    <span class="text-gray-600">Total Pay:</span>
                    <span class="font-bold text-green-600">$${totalPay.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `;
}

// Navigation
function prevPeriod() {
    if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() - 7);
    } else if (currentView === 'day') {
        currentDate.setDate(currentDate.getDate() - 1);
    } else {
        currentDate.setMonth(currentDate.getMonth() - 1);
    }
    renderCalendar();
}

function nextPeriod() {
    if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() + 7);
    } else if (currentView === 'day') {
        currentDate.setDate(currentDate.getDate() + 1);
    } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    renderCalendar();
}

function goToToday() {
    currentDate = new Date();
    renderCalendar();
}

function switchView(view) {
    currentView = view;
    
    // Update button states
    document.querySelectorAll('[id$="ViewBtn"]').forEach(btn => {
        btn.className = 'px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm';
    });
    
    document.getElementById(view + 'ViewBtn').className = 'px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm';
    
    renderCalendar();
}

// Tooltip and Modal functions
function showJobTooltip(event, job) {
    const tooltip = document.getElementById('jobTooltip');
    
    // Format schedule date
    const scheduleDate = job.scheduleDate ? 
        new Date(job.scheduleDate).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        }) : 'Not scheduled';
    
    // Create tooltip content
    const tooltipContent = `
        <div class="font-semibold mb-1">${job.title}</div>
        <div class="text-xs mb-1">${job.customer}</div>
        <div class="text-xs mb-1">📅 ${scheduleDate} at ${formatTime(job.scheduleTime) || 'TBD'}</div>
        <div class="text-xs mb-1">💰 $${job.estimatedPay.toFixed(2)}</div>
        <div class="text-xs mt-1 opacity-75">Click for details</div>
    `;
    
    tooltip.innerHTML = tooltipContent;
    tooltip.classList.add('show');
    
    updateTooltipPosition(event);
}

function hideJobTooltip() {
    const tooltip = document.getElementById('jobTooltip');
    tooltip.classList.remove('show');
}

function updateTooltipPosition(event) {
    const tooltip = document.getElementById('jobTooltip');
    const rect = tooltip.getBoundingClientRect();
    
    let x = event.pageX + 10;
    let y = event.pageY - rect.height - 10;
    
    // Keep tooltip within viewport
    if (x + rect.width > window.innerWidth) {
        x = event.pageX - rect.width - 10;
    }
    
    if (y < 0) {
        y = event.pageY + 10;
    }
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

function showJobModal(job) {
    const modal = document.getElementById('jobDetailsModal');
    
    // Populate modal content
    document.getElementById('modalJobTitle').textContent = job.title;
    document.getElementById('modalJobId').textContent = job.id;
    document.getElementById('modalCustomerName').textContent = job.customer;
    document.getElementById('modalJobValue').textContent = `$${job.estimatedPay.toFixed(2)}`;
    
    // Schedule info
    if (job.scheduleDate) {
        const scheduleDate = new Date(job.scheduleDate);
        document.getElementById('modalScheduleDate').textContent = scheduleDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
        document.getElementById('modalScheduleTime').textContent = formatTime(job.scheduleTime);
    } else {
        document.getElementById('modalScheduleDate').textContent = 'Not scheduled';
        document.getElementById('modalScheduleTime').textContent = 'Not scheduled';
    }
    
    document.getElementById('modalDuration').textContent = job.duration || '-';
    document.getElementById('modalAddress').textContent = job.address || '-';
    document.getElementById('modalDescription').textContent = job.description || '-';
    
    // Map link
    if (job.address) {
        const mapLink = document.getElementById('modalMapLink');
        mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`;
    }
    
    // Store current job
    selectedJob = job;
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Hide tooltip if showing
    hideJobTooltip();
}

function closeJobModal() {
    const modal = document.getElementById('jobDetailsModal');
    modal.classList.add('hidden');
    selectedJob = null;
}

function viewFullJobDetails() {
    if (selectedJob) {
        window.location.href = `job_detail.html?id=${selectedJob.id}`;
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('jobDetailsModal');
    if (modal && e.target === modal) {
        closeJobModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeJobModal();
        hideJobTooltip();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Initializing staff schedule...');
    console.log('📊 Total jobs assigned:', jobs.length);
    
    // Set initial view to week
    switchView('week');
    
    // Navigation
    document.getElementById('prevBtn').addEventListener('click', prevPeriod);
    document.getElementById('nextBtn').addEventListener('click', nextPeriod);
    document.getElementById('todayBtn').addEventListener('click', goToToday);
    
    // View toggles
    document.getElementById('monthViewBtn').addEventListener('click', () => switchView('month'));
    document.getElementById('weekViewBtn').addEventListener('click', () => switchView('week'));
    document.getElementById('dayViewBtn').addEventListener('click', () => switchView('day'));
    
    console.log('✅ Staff Schedule initialized');
});

