// Job Schedule - JavaScript

// Sample data
const jobs = [
    // Week 1 - Nov 10-16
    { id: 'JOB-2024-001', customerName: 'Sarah Johnson', scheduleDate: '2024-11-15', scheduleTime: '10:00', status: 'scheduled', assignedStaff: ['Alice Anderson'], total: 825.00, description: 'Math tutoring session' },
    { id: 'JOB-2024-002', customerName: 'Michael Chen', scheduleDate: '2024-11-12', scheduleTime: '14:00', status: 'completed', assignedStaff: ['Benjamin Brooks'], total: 450.00, description: 'English Literature' },
    { id: 'JOB-2024-007', customerName: 'Sophie Martinez', scheduleDate: '2024-11-14', scheduleTime: '11:00', status: 'scheduled', assignedStaff: ['Daniel Davis'], total: 720.00, description: 'Algebra tutoring' },
    { id: 'JOB-2024-009', customerName: 'Jennifer Lee', scheduleDate: '2024-11-16', scheduleTime: '13:00', status: 'scheduled', assignedStaff: ['Emily Evans'], total: 540.00, description: 'English Grammar' },
    { id: 'JOB-2024-016', customerName: 'Oliver Smith', scheduleDate: '2024-11-11', scheduleTime: '09:00', status: 'scheduled', assignedStaff: ['Alice Anderson'], total: 620.00, description: 'Geometry basics' },
    { id: 'JOB-2024-017', customerName: 'Emma Davis', scheduleDate: '2024-11-13', scheduleTime: '15:00', status: 'scheduled', assignedStaff: ['Catherine Chen'], total: 480.00, description: 'Essay writing' },
    { id: 'JOB-2024-018', customerName: 'Lucas Brown', scheduleDate: '2024-11-15', scheduleTime: '14:30', status: 'scheduled', assignedStaff: ['Benjamin Brooks'], total: 750.00, description: 'Chemistry lab' },
    
    // Week 2 - Nov 17-23
    { id: 'JOB-2024-004', customerName: 'James Taylor', scheduleDate: '2024-11-18', scheduleTime: '15:30', status: 'on_hold', assignedStaff: ['Catherine Chen'], total: 300.00, description: 'History tutoring' },
    { id: 'JOB-2024-006', customerName: 'David Kim', scheduleDate: '2024-11-20', scheduleTime: '09:00', status: 'scheduled', assignedStaff: ['Alice Anderson', 'Benjamin Brooks'], total: 950.00, description: 'Physics and Chemistry' },
    { id: 'JOB-2024-011', customerName: 'Maria Garcia', scheduleDate: '2024-11-19', scheduleTime: '10:30', status: 'scheduled', assignedStaff: ['Catherine Chen'], total: 670.00, description: 'Spanish tutoring' },
    { id: 'JOB-2024-012', customerName: 'Kevin Zhang', scheduleDate: '2024-11-21', scheduleTime: '14:30', status: 'scheduled', assignedStaff: ['Alice Anderson'], total: 800.00, description: 'Statistics tutoring' },
    { id: 'JOB-2024-014', customerName: 'Daniel Park', scheduleDate: '2024-11-22', scheduleTime: '09:30', status: 'scheduled', assignedStaff: ['Benjamin Brooks', 'Daniel Davis'], total: 1250.00, description: 'SAT prep course' },
    { id: 'JOB-2024-019', customerName: 'Sophia Wilson', scheduleDate: '2024-11-17', scheduleTime: '10:00', status: 'scheduled', assignedStaff: ['Emily Evans'], total: 690.00, description: 'Biology study' },
    { id: 'JOB-2024-020', customerName: 'Noah Martinez', scheduleDate: '2024-11-20', scheduleTime: '13:30', status: 'scheduled', assignedStaff: ['Daniel Davis'], total: 820.00, description: 'Trigonometry' },
    { id: 'JOB-2024-021', customerName: 'Ava Johnson', scheduleDate: '2024-11-22', scheduleTime: '11:00', status: 'scheduled', assignedStaff: ['Catherine Chen'], total: 560.00, description: 'French basics' },
    
    // Week 3 - Nov 24-30
    { id: 'JOB-2024-022', customerName: 'Liam Anderson', scheduleDate: '2024-11-25', scheduleTime: '09:00', status: 'scheduled', assignedStaff: ['Alice Anderson'], total: 880.00, description: 'Advanced Calculus' },
    { id: 'JOB-2024-023', customerName: 'Isabella Lee', scheduleDate: '2024-11-26', scheduleTime: '14:00', status: 'scheduled', assignedStaff: ['Benjamin Brooks'], total: 720.00, description: 'Organic Chemistry' },
    { id: 'JOB-2024-024', customerName: 'Ethan White', scheduleDate: '2024-11-27', scheduleTime: '10:30', status: 'scheduled', assignedStaff: ['Emily Evans'], total: 640.00, description: 'Literature analysis' },
    { id: 'JOB-2024-025', customerName: 'Mia Garcia', scheduleDate: '2024-11-28', scheduleTime: '15:00', status: 'scheduled', assignedStaff: ['Daniel Davis'], total: 770.00, description: 'Physics mechanics' },
    
    // Recurring Job Instances
    { 
        id: 'JOB-2024-030', 
        customerName: 'Sarah Johnson', 
        scheduleDate: '2024-11-11', 
        scheduleTime: '10:00', 
        status: 'scheduled', 
        assignedStaff: ['Alice Anderson'], 
        total: 825.00, 
        description: 'Weekly Math Tutoring',
        isRecurring: true,
        templateId: 'RJT-2024-001',
        instanceNumber: 1,
        recurringTemplate: {
            frequency: 'weeks',
            customInterval: 1,
            selectedDays: ['Monday'],
            schedule: 'Every Monday',
            status: 'active',
            nextJobDate: '2024-11-18'
        }
    },
    { 
        id: 'JOB-2024-031', 
        customerName: 'Sarah Johnson', 
        scheduleDate: '2024-11-18', 
        scheduleTime: '10:00', 
        status: 'scheduled', 
        assignedStaff: ['Alice Anderson'], 
        total: 825.00, 
        description: 'Weekly Math Tutoring',
        isRecurring: true,
        templateId: 'RJT-2024-001',
        instanceNumber: 2,
        recurringTemplate: {
            frequency: 'weeks',
            customInterval: 1,
            selectedDays: ['Monday'],
            schedule: 'Every Monday',
            status: 'active',
            nextJobDate: '2024-11-25'
        }
    },
    { 
        id: 'JOB-2024-032', 
        customerName: 'Sarah Johnson', 
        scheduleDate: '2024-11-25', 
        scheduleTime: '10:00', 
        status: 'scheduled', 
        assignedStaff: ['Alice Anderson'], 
        total: 825.00, 
        description: 'Weekly Math Tutoring',
        isRecurring: true,
        templateId: 'RJT-2024-001',
        instanceNumber: 3,
        recurringTemplate: {
            frequency: 'weeks',
            customInterval: 1,
            selectedDays: ['Monday'],
            schedule: 'Every Monday',
            status: 'active',
            nextJobDate: '2024-12-02'
        }
    },
    
    // Recurring Job - Mon, Wed, Fri Weekly
    { 
        id: 'JOB-2024-033', 
        customerName: 'Michael Chen', 
        scheduleDate: '2024-11-11', 
        scheduleTime: '14:00', 
        status: 'scheduled', 
        assignedStaff: ['Benjamin Brooks'], 
        total: 450.00, 
        description: 'English Literature - Mon/Wed/Fri',
        isRecurring: true,
        templateId: 'RJT-2024-002',
        instanceNumber: 1,
        recurringTemplate: {
            frequency: 'weeks',
            customInterval: 1,
            selectedDays: ['Monday', 'Wednesday', 'Friday'],
            schedule: 'Every Monday, Wednesday, Friday',
            status: 'active',
            nextJobDate: '2024-11-13'
        }
    },
    { 
        id: 'JOB-2024-034', 
        customerName: 'Michael Chen', 
        scheduleDate: '2024-11-13', 
        scheduleTime: '14:00', 
        status: 'scheduled', 
        assignedStaff: ['Benjamin Brooks'], 
        total: 450.00, 
        description: 'English Literature - Mon/Wed/Fri',
        isRecurring: true,
        templateId: 'RJT-2024-002',
        instanceNumber: 2,
        recurringTemplate: {
            frequency: 'weeks',
            customInterval: 1,
            selectedDays: ['Monday', 'Wednesday', 'Friday'],
            schedule: 'Every Monday, Wednesday, Friday',
            status: 'active',
            nextJobDate: '2024-11-15'
        }
    },
    { 
        id: 'JOB-2024-035', 
        customerName: 'Michael Chen', 
        scheduleDate: '2024-11-15', 
        scheduleTime: '14:00', 
        status: 'scheduled', 
        assignedStaff: ['Benjamin Brooks'], 
        total: 450.00, 
        description: 'English Literature - Mon/Wed/Fri',
        isRecurring: true,
        templateId: 'RJT-2024-002',
        instanceNumber: 3,
        recurringTemplate: {
            frequency: 'weeks',
            customInterval: 1,
            selectedDays: ['Monday', 'Wednesday', 'Friday'],
            schedule: 'Every Monday, Wednesday, Friday',
            status: 'active',
            nextJobDate: '2024-11-18'
        }
    },
    { 
        id: 'JOB-2024-036', 
        customerName: 'Michael Chen', 
        scheduleDate: '2024-11-18', 
        scheduleTime: '14:00', 
        status: 'scheduled', 
        assignedStaff: ['Benjamin Brooks'], 
        total: 450.00, 
        description: 'English Literature - Mon/Wed/Fri',
        isRecurring: true,
        templateId: 'RJT-2024-002',
        instanceNumber: 4,
        recurringTemplate: {
            frequency: 'weeks',
            customInterval: 1,
            selectedDays: ['Monday', 'Wednesday', 'Friday'],
            schedule: 'Every Monday, Wednesday, Friday',
            status: 'active',
            nextJobDate: '2024-11-20'
        }
    },
    { 
        id: 'JOB-2024-037', 
        customerName: 'Michael Chen', 
        scheduleDate: '2024-11-20', 
        scheduleTime: '14:00', 
        status: 'scheduled', 
        assignedStaff: ['Benjamin Brooks'], 
        total: 450.00, 
        description: 'English Literature - Mon/Wed/Fri',
        isRecurring: true,
        templateId: 'RJT-2024-002',
        instanceNumber: 5,
        recurringTemplate: {
            frequency: 'weeks',
            customInterval: 1,
            selectedDays: ['Monday', 'Wednesday', 'Friday'],
            schedule: 'Every Monday, Wednesday, Friday',
            status: 'active',
            nextJobDate: '2024-11-22'
        }
    },
    { 
        id: 'JOB-2024-038', 
        customerName: 'Michael Chen', 
        scheduleDate: '2024-11-22', 
        scheduleTime: '14:00', 
        status: 'scheduled', 
        assignedStaff: ['Benjamin Brooks'], 
        total: 450.00, 
        description: 'English Literature - Mon/Wed/Fri',
        isRecurring: true,
        templateId: 'RJT-2024-002',
        instanceNumber: 6,
        recurringTemplate: {
            frequency: 'weeks',
            customInterval: 1,
            selectedDays: ['Monday', 'Wednesday', 'Friday'],
            schedule: 'Every Monday, Wednesday, Friday',
            status: 'active',
            nextJobDate: '2024-11-25'
        }
    },
    
    // Jobs with conflicts (same staff at same time) - for demonstration
    { id: 'JOB-2024-026', customerName: 'Alex Thompson', scheduleDate: '2024-11-13', scheduleTime: '15:00', status: 'scheduled', assignedStaff: ['Catherine Chen'], total: 400.00, description: 'Math review' }, // Conflicts with Emma Davis at 3:00 PM
    { id: 'JOB-2024-027', customerName: 'Maya Patel', scheduleDate: '2024-11-15', scheduleTime: '10:30', status: 'scheduled', assignedStaff: ['Alice Anderson'], total: 350.00, description: 'Algebra help' }, // Conflicts with Sarah Johnson at 10:00 AM
    
    // Class & Group Enrollment Jobs
    { 
        id: 'JOB-2024-028', 
        customerName: 'Math Tutoring Class', 
        scheduleDate: '2024-11-13', 
        scheduleTime: '09:00', 
        endTime: '17:00',
        status: 'scheduled', 
        assignedStaff: ['Alice Anderson'], 
        total: 2400.00, 
        description: 'Advanced Math Tutoring - All grade levels',
        classMode: {
            enabled: true,
            name: 'Advanced Math Tutoring - All grade levels',
            capacity: 20,
            waitlistEnabled: true,
            participants: [
                { name: 'Student 1', quoteId: 'Q-2024-015', services: ['Math'], status: 'confirmed' },
                { name: 'Student 2', quoteId: 'Q-2024-016', services: ['Math'], status: 'confirmed' },
                { name: 'Student 3', quoteId: 'Q-2024-017', services: ['Math'], status: 'confirmed' }
            ],
            skillLevel: 'All grade levels'
        }
    },
    { 
        id: 'JOB-2024-029', 
        customerName: 'Yoga Class Session', 
        scheduleDate: '2024-11-14', 
        scheduleTime: '18:00', 
        endTime: '19:00',
        status: 'scheduled', 
        assignedStaff: ['Emily Evans'], 
        total: 1500.00, 
        description: 'Tuesday Evening Yoga (15 seats)',
        classMode: {
            enabled: true,
            name: 'Tuesday Evening Yoga',
            capacity: 15,
            waitlistEnabled: false,
            participants: [
                { name: 'Sarah Johnson', quoteId: 'Q-2024-010', services: ['Yoga'], status: 'confirmed' },
                { name: 'John Smith', quoteId: 'Q-2024-011', services: ['Yoga'], status: 'confirmed' },
                { name: 'Mike Wilson', quoteId: 'Q-2024-012', services: ['Yoga'], status: 'confirmed' },
                { name: 'Emma Davis', quoteId: 'Q-2024-013', services: ['Yoga'], status: 'confirmed' }
            ],
            skillLevel: 'All levels'
        }
    },
    
    // Unscheduled jobs
    { id: 'JOB-2024-003', customerName: 'Emma Wilson', scheduleDate: null, scheduleTime: null, status: 'created', assignedStaff: [], total: 1200.00, description: 'Advanced Math program' },
    { id: 'JOB-2024-005', customerName: 'Lisa Anderson', scheduleDate: null, scheduleTime: null, status: 'created', assignedStaff: [], total: 650.00, description: 'Science tutoring' },
    { id: 'JOB-2024-008', customerName: 'Robert Brown', scheduleDate: null, scheduleTime: null, status: 'created', assignedStaff: [], total: 880.00, description: 'Biology tutoring' },
    { id: 'JOB-2024-010', customerName: 'Thomas White', scheduleDate: null, scheduleTime: null, status: 'created', assignedStaff: [], total: 990.00, description: 'Calculus tutoring' },
    { id: 'JOB-2024-013', customerName: 'Amanda Scott', scheduleDate: null, scheduleTime: null, status: 'created', assignedStaff: [], total: 1100.00, description: 'Chemistry lab prep' },
    { id: 'JOB-2024-015', customerName: 'Rachel Green', scheduleDate: null, scheduleTime: null, status: 'created', assignedStaff: [], total: 580.00, description: 'Reading comprehension' }
];

const availableStaff = [
    { id: 'staff-1', name: 'Alice Anderson', role: 'Math Tutor', avatar: 'AA', color: 'blue' },
    { id: 'staff-2', name: 'Benjamin Brooks', role: 'Science Tutor', avatar: 'BB', color: 'green' },
    { id: 'staff-3', name: 'Catherine Chen', role: 'English Tutor', avatar: 'CC', color: 'purple' },
    { id: 'staff-4', name: 'Daniel Davis', role: 'Math Tutor', avatar: 'DD', color: 'red' },
    { id: 'staff-5', name: 'Emily Evans', role: 'Science Tutor', avatar: 'EE', color: 'pink' }
];

// State - Set to November 13, 2024 to match our sample data
let currentDate = new Date(2024, 10, 13); // November 13, 2024 (month is 0-indexed)
let currentView = 'week';
let selectedJob = null;
let selectedStaff = [];
let staffFilter = [];  // Changed to array for multi-select
let draggedJobId = null;

// Calendar functions
function renderCalendar() {
    if (currentView === 'week') {
        renderWeekView();
    } else if (currentView === 'day') {
        renderDayView();
    } else {
        renderMonthView();
    }
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
    timeHeaderCell.style.height = '80px';
    timeHeaderCell.style.display = 'flex';
    timeHeaderCell.style.alignItems = 'center';
    timeHeaderCell.style.justifyContent = 'center';
    timeHeaderCell.innerHTML = '<div class="text-xs font-semibold text-gray-600">Time</div>';
    header.appendChild(timeHeaderCell);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date(2024, 10, 13); // November 13, 2024 for sample data
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        
        const isToday = date.toDateString() === today.toDateString();
        
        const dayHeader = document.createElement('div');
        dayHeader.className = `p-3 text-center text-sm border-r border-gray-200 ${isToday ? 'bg-blue-50 border-l-2 border-r-2 border-blue-500' : ''}`;
        dayHeader.style.height = '80px';
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
    
    // Add current time indicator for week view
    // addCurrentTimeIndicator('week'); // Temporarily hidden
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
            
            // Add drag and drop handlers
            timeSlot.addEventListener('dragover', handleDragOver);
            timeSlot.addEventListener('drop', handleDrop);
            timeSlot.addEventListener('dragleave', handleDragLeave);
            
            // Find jobs for this time slot
            const hourStart = 8 + hour;
            const hourEnd = hourStart + 1;
            
            const slotJobs = jobs.filter(job => {
                if (job.scheduleDate !== dateStr) return false;
                
                const jobHour = parseInt(job.scheduleTime.split(':')[0]);
                
                // Show job in the hour slot where it starts
                // For class jobs with endTime, we still only show them in their starting hour
                // The time range (e.g., 9:00-17:00) is displayed in the job block itself
                const inTimeSlot = jobHour >= hourStart && jobHour < hourEnd;
                
                return inTimeSlot && shouldShowJob(job);
            });
            
            // Check for staff conflicts in this time slot
            const staffConflicts = checkStaffConflicts(slotJobs);
            
            // Add jobs to time slot with conflict indicators
            slotJobs.forEach((job, index) => {
                const hasConflict = staffConflicts.some(conflict => 
                    conflict.jobs.some(conflictJob => conflictJob.id === job.id)
                );
                const jobBlock = createJobBlock(job, index, hasConflict);
                timeSlot.appendChild(jobBlock);
            });
            
            // Add conflict warning if there are conflicts
            if (staffConflicts.length > 0) {
                const conflictWarning = createConflictWarning(staffConflicts);
                timeSlot.appendChild(conflictWarning);
            }
            
            grid.appendChild(timeSlot);
        }
    }
}

function createJobBlock(job, index = 0, hasConflict = false) {
    const jobBlock = document.createElement('div');
    let jobColorClass = getJobColor(job.status);
    
    // Check if this is a class/group enrollment job
    const isClassJob = job.classMode && job.classMode.enabled;
    // Check if this is a recurring job instance
    const isRecurringJob = job.isRecurring && job.recurringTemplate;
    
    // Add conflict styling if there's a staff conflict
    if (hasConflict) {
        jobColorClass = 'bg-red-100 text-red-800 border border-red-300';
    } else if (isClassJob) {
        // Special styling for class jobs - emerald/green theme
        jobColorClass = 'bg-emerald-100 text-emerald-800 border border-emerald-300';
    } else if (isRecurringJob) {
        // Special styling for recurring jobs - blue/indigo theme
        jobColorClass = 'bg-indigo-100 text-indigo-800 border border-indigo-300';
    }
    
    jobBlock.className = `job-block ${jobColorClass}`;
    jobBlock.onclick = (e) => {
        e.stopPropagation();
        showJobModal(job);
    };
    
    // Add popup functionality
    jobBlock.addEventListener('mouseenter', (e) => {
        // Small delay before showing popup to avoid flickering
        popupTimeout = setTimeout(() => {
            showJobTooltip(e, job);
        }, 300);
    });
    jobBlock.addEventListener('mouseleave', () => {
        if (popupTimeout) {
            clearTimeout(popupTimeout);
            popupTimeout = null;
        }
        hideJobTooltip();
    });
    jobBlock.addEventListener('mousemove', (e) => {
        if (popupTimeout) {
            clearTimeout(popupTimeout);
            popupTimeout = setTimeout(() => {
                showJobTooltip(e, job);
            }, 100);
        } else {
            updatePopupPosition(e);
        }
    });
    
    // Position multiple jobs in the same slot
    // Simplified height for name and time only
    const baseHeight = 36;
    const topOffset = index * 40;
    jobBlock.style.top = `${4 + topOffset}px`;
    jobBlock.style.height = `${baseHeight}px`;
    jobBlock.style.minHeight = `${baseHeight}px`;
    
    // Add conflict indicator
    if (hasConflict) {
        jobBlock.style.borderLeft = '3px solid #dc2626';
        jobBlock.style.boxShadow = '0 0 0 1px #fecaca';
    } else if (isClassJob) {
        // Add class indicator border
        jobBlock.style.borderLeft = '3px solid #10b981';
    } else if (isRecurringJob) {
        // Add recurring indicator border
        jobBlock.style.borderLeft = '3px solid #6366f1';
    }
    
    // Build display content - Only job name and time
    let displayContent = '';
    let jobName = '';
    let displayTime = job.scheduleTime || 'TBD';
    
    if (isClassJob) {
        const classInfo = job.classMode;
        jobName = classInfo.name || job.customerName;
        displayTime = job.endTime ? `${job.scheduleTime} - ${job.endTime}` : job.scheduleTime;
    } else if (isRecurringJob) {
        const template = job.recurringTemplate;
        const instanceInfo = job.instanceNumber ? ` #${job.instanceNumber}` : '';
        jobName = `${job.customerName}${instanceInfo}`;
    } else {
        jobName = getDisplayName(job);
    }
    
    // Conflict indicator
    const conflictIndicator = hasConflict ? '<span class="text-red-600 ml-1 text-xs">⚠️</span>' : '';
    
    // Simple two-line layout: name on top, time on bottom
    displayContent = `
        <div class="flex flex-col gap-0.5">
            <div class="flex items-center min-w-0">
                <span class="text-xs font-bold truncate">${jobName}</span>
                ${conflictIndicator}
            </div>
            <div class="text-[10px] font-medium opacity-90">
                ${displayTime}
            </div>
        </div>
    `;
    
    jobBlock.innerHTML = displayContent;
    
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
    const isToday = currentDate.toDateString() === new Date(2024, 10, 13).toDateString();
    
    header.innerHTML = `
        <div class="text-center">
            <div class="text-2xl font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}">${dayName}</div>
            <div class="text-lg ${isToday ? 'text-blue-700' : 'text-gray-700'}">${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            ${isToday ? '<div class="text-sm text-blue-600 mt-1">Today</div>' : ''}
        </div>
    `;
    
    // Render day schedule
    renderDaySchedule();
    
    // Add current time indicator for day view
    // addCurrentTimeIndicator('day'); // Temporarily hidden
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
    scheduleContainer.style.cssText = `
        display: grid;
        grid-template-columns: 80px 1fr;
        border: 1px solid #e5e7eb;
        background: white;
    `;
    
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
        
        // Add drag and drop handlers
        timeSlotDiv.addEventListener('dragover', handleDragOver);
        timeSlotDiv.addEventListener('drop', handleDrop);
        timeSlotDiv.addEventListener('dragleave', handleDragLeave);
        
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
            return inTimeSlot && shouldShowJob(job);
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
    const isClassJob = job.classMode && job.classMode.enabled;
    const isRecurringJob = job.isRecurring && job.recurringTemplate;
    
    // Use emerald color for class jobs, indigo for recurring jobs
    let baseColorClass = getJobColor(job.status);
    let borderColor = 'currentColor';
    let padding = '8px 12px';
    
    if (isClassJob) {
        baseColorClass = 'bg-emerald-100 text-emerald-800 border border-emerald-300';
        borderColor = '#10b981';
        padding = '12px';
    } else if (isRecurringJob) {
        baseColorClass = 'bg-indigo-100 text-indigo-800 border border-indigo-300';
        borderColor = '#6366f1';
        padding = '10px 12px';
    }
    
    jobCard.className = `day-job-card ${baseColorClass}`;
    jobCard.style.cssText = `
        margin-bottom: 8px;
        padding: ${padding};
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        border-left: 4px solid ${borderColor};
    `;
    jobCard.onclick = (e) => {
        e.stopPropagation();
        showJobModal(job);
    };
    
    // Add popup functionality
    jobCard.addEventListener('mouseenter', (e) => {
        // Small delay before showing popup to avoid flickering
        popupTimeout = setTimeout(() => {
            showJobTooltip(e, job);
        }, 300);
    });
    jobCard.addEventListener('mouseleave', () => {
        if (popupTimeout) {
            clearTimeout(popupTimeout);
            popupTimeout = null;
        }
        hideJobTooltip();
    });
    jobCard.addEventListener('mousemove', (e) => {
        if (popupTimeout) {
            clearTimeout(popupTimeout);
            popupTimeout = setTimeout(() => {
                showJobTooltip(e, job);
            }, 100);
        } else {
            updatePopupPosition(e);
        }
    });
    
    // Get staff avatars
    const staffAvatars = job.assignedStaff.map(staffName => {
        const staff = availableStaff.find(s => s.name === staffName);
        if (staff) {
            const colorMap = {
                'blue': 'bg-blue-500',
                'green': 'bg-green-500',
                'purple': 'bg-purple-500',
                'red': 'bg-red-500',
                'pink': 'bg-pink-500'
            };
            return `<span class="inline-flex items-center justify-center w-6 h-6 ${colorMap[staff.color]} text-white rounded-full text-xs font-bold mr-2">${staff.avatar}</span>`;
        }
        return '';
    }).join('');
    
    let cardContent = '';
    
    if (isRecurringJob) {
        const template = job.recurringTemplate;
        const instanceInfo = job.instanceNumber ? `Instance #${job.instanceNumber}` : 'Recurring';
        
        cardContent = `
            <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-sm">${job.scheduleTime}</div>
                <div class="flex items-center gap-2">
                    <span class="text-xs px-2 py-0.5 bg-indigo-200 text-indigo-800 rounded-full font-medium">🔄 ${instanceInfo}</span>
                    <div class="text-sm font-semibold">$${job.total.toFixed(0)}</div>
                </div>
            </div>
            <div class="font-medium text-sm mb-1">${job.customerName}</div>
            <div class="text-xs text-indigo-700 mb-2 font-medium">${template.schedule || 'Recurring schedule'}</div>
            <div class="flex items-center gap-2 mb-2">
                ${staffAvatars}
                <span class="text-xs text-gray-600">${job.description}</span>
            </div>
            <div class="text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(job.status)} inline-block">
                ${job.status.replace('_', ' ').toUpperCase()}
            </div>
        `;
    } else if (isClassJob) {
        const classInfo = job.classMode;
        const participantCount = classInfo.participants ? classInfo.participants.length : 0;
        const capacity = classInfo.capacity || 0;
        const timeRange = job.endTime ? `${job.scheduleTime} - ${job.endTime}` : job.scheduleTime;
        
        // Show first 3 participants
        const participantsToShow = classInfo.participants ? classInfo.participants.slice(0, 3) : [];
        const remainingCount = participantCount > 3 ? participantCount - 3 : 0;
        
        const participantList = participantsToShow.map((p, idx) => {
            const statusColor = p.status === 'confirmed' ? 'text-emerald-700' : 
                               p.status === 'pending_payment' ? 'text-amber-700' : 
                               'text-gray-700';
            return `<span class="text-xs ${statusColor}">${p.name}</span>`;
        }).join(', ');
        
        cardContent = `
            <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-sm">${timeRange}</div>
                <div class="text-sm font-semibold">$${job.total.toFixed(0)}</div>
            </div>
            <div class="font-medium text-sm mb-1">${classInfo.name || job.customerName}</div>
            <div class="text-xs text-emerald-700 mb-2 font-medium">Skill: ${classInfo.skillLevel || 'All levels'}</div>
            <div class="flex items-center gap-2 mb-2">
                ${staffAvatars}
                <span class="text-xs text-gray-600">${participantCount}/${capacity} seats</span>
            </div>
            ${participantCount > 0 ? `
                <div class="text-xs text-gray-700 mb-2">
                    <span class="font-semibold">Participants:</span> ${participantList}${remainingCount > 0 ? ` +${remainingCount} more` : ''}
                </div>
            ` : ''}
            <div class="text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(job.status)} inline-block">
                ${job.status.replace('_', ' ').toUpperCase()}
            </div>
        `;
    } else {
        // Regular job display
        cardContent = `
        <div class="flex items-center justify-between mb-2">
            <div class="font-semibold text-sm">${job.scheduleTime}</div>
            <div class="text-sm font-semibold">$${job.total.toFixed(0)}</div>
        </div>
        <div class="font-medium text-sm mb-1">${getDisplayName(job)}</div>
        <div class="text-xs text-gray-600 mb-2">${job.description}</div>
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                ${staffAvatars}
                <span class="text-xs text-gray-600">for ${job.customerName}</span>
            </div>
            <div class="text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(job.status)}">
                ${job.status.replace('_', ' ').toUpperCase()}
            </div>
        </div>
    `;
    }
    
    jobCard.innerHTML = cardContent;
    
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
        case 'completed': return 'bg-green-100 text-green-800';
        case 'on_hold': return 'bg-orange-100 text-orange-800';
        case 'created': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function getDisplayName(job) {
    // Display staff names instead of customer name
    if (job.assignedStaff && job.assignedStaff.length > 0) {
        if (job.assignedStaff.length === 1) {
            return job.assignedStaff[0];
        } else if (job.assignedStaff.length === 2) {
            return job.assignedStaff.join(' & ');
        } else {
            return `${job.assignedStaff[0]} +${job.assignedStaff.length - 1}`;
        }
    }
    return 'Unassigned';
}

function renderMonthView() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    const monthElement = document.getElementById('currentWeek') || document.getElementById('currentMonth');
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

function createWeekDayCell(date) {
    const cell = document.createElement('div');
    const dateStr = date.toISOString().split('T')[0];
    const isToday = dateStr === new Date().toISOString().split('T')[0];
    
    cell.className = `calendar-day border-b border-r border-gray-200 p-3 bg-white min-h-96`;
    cell.setAttribute('data-date', dateStr);
    cell.addEventListener('dragover', handleDragOver);
    cell.addEventListener('drop', handleDrop);
    cell.addEventListener('dragleave', handleDragLeave);
    
    // Jobs for this day
    const dayJobs = jobs.filter(j => j.scheduleDate === dateStr);
    dayJobs.sort((a, b) => a.scheduleTime.localeCompare(b.scheduleTime));
    
    // Debug logging
    if (dateStr === '2024-11-13') {
        console.log('Jobs for today (2024-11-13):', dayJobs);
    }
    
    dayJobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = `job-pill ${getJobColor(job.status)} mb-2 p-2 rounded-lg cursor-pointer`;
        jobCard.onclick = () => viewJobDetails(job);
        
        // Enhanced job display with staff assignments
        const staffAvatars = job.assignedStaff.map(staffName => {
            const staff = availableStaff.find(s => s.name === staffName);
            if (staff) {
                const colorMap = {
                    'blue': 'bg-blue-500',
                    'green': 'bg-green-500',
                    'purple': 'bg-purple-500',
                    'red': 'bg-red-500',
                    'pink': 'bg-pink-500'
                };
                return `<span class="inline-flex items-center justify-center w-5 h-5 ${colorMap[staff.color]} text-white rounded-full text-xs font-bold mr-1">${staff.avatar}</span>`;
            }
            return '';
        }).join('');
        
        jobCard.innerHTML = `
            <div class="text-xs font-semibold mb-1">${job.scheduleTime}</div>
            <div class="text-sm font-medium mb-1">${getDisplayName(job)}</div>
            <div class="text-xs text-gray-600 mb-2">${job.description}</div>
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    ${staffAvatars}
                </div>
                <div class="text-xs font-semibold">$${job.total.toFixed(0)}</div>
            </div>
        `;
        
        cell.appendChild(jobCard);
    });
    
    return cell;
}

function createDayCell(day, isOtherMonth, date) {
    const cell = document.createElement('div');
    cell.className = `calendar-day border-b border-r border-gray-200 p-2 ${isOtherMonth ? 'bg-gray-50' : 'bg-white'}`;
    
    const dateStr = date.toISOString().split('T')[0];
    const isToday = dateStr === new Date().toISOString().split('T')[0];
    
    // Make cell a drop target
    cell.setAttribute('data-date', dateStr);
    cell.addEventListener('dragover', handleDragOver);
    cell.addEventListener('drop', handleDrop);
    cell.addEventListener('dragleave', handleDragLeave);
    
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
        const isClassJob = job.classMode && job.classMode.enabled;
        const colorClass = isClassJob ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : getJobColor(job.status);
        jobPill.className = `job-pill ${colorClass} truncate`;
        
        if (isClassJob) {
            const classInfo = job.classMode;
            const participantCount = classInfo.participants ? classInfo.participants.length : 0;
            const capacity = classInfo.capacity || 0;
            jobPill.innerHTML = `
                <div class="text-xs font-semibold">${job.scheduleTime}${job.endTime ? ` - ${job.endTime}` : ''}</div>
                <div class="text-xs font-medium">${classInfo.name || job.customerName}</div>
                <div class="text-xs">${participantCount}/${capacity} seats</div>
            `;
        } else {
        jobPill.textContent = `${job.scheduleTime} ${job.customerName}`;
        }
        
        jobPill.onclick = () => viewJobDetails(job);
        cell.appendChild(jobPill);
    });
    
    return cell;
}

function getJobColor(status) {
    const colors = {
        scheduled: 'bg-blue-100 text-blue-800 border border-blue-300',
        created: 'bg-gray-100 text-gray-800 border border-gray-300',
        completed: 'bg-green-100 text-green-800 border border-green-300',
        on_hold: 'bg-orange-100 text-orange-800 border border-orange-300'
    };
    return colors[status] || colors.created;
}

function renderUnscheduledJobs() {
    const container = document.getElementById('unscheduledJobs');
    const unscheduled = jobs.filter(j => !j.scheduleDate && shouldShowJob(j));
    
    if (unscheduled.length === 0) {
        const message = staffFilter.length > 0 ? 
            'No unscheduled jobs for selected staff' : 
            'No unscheduled jobs';
        container.innerHTML = `<p class="text-xs text-gray-500 italic">${message}</p>`;
        return;
    }
    
    container.innerHTML = unscheduled.map(job => {
        const isClassJob = job.classMode && job.classMode.enabled;
        const borderColor = isClassJob ? 'border-emerald-300 hover:border-emerald-400' : 'border-gray-200 hover:border-indigo-300';
        const bgColor = isClassJob ? 'bg-emerald-50' : 'bg-gray-50';
        
        let jobContent = '';
        if (isClassJob) {
            const classInfo = job.classMode;
            const participantCount = classInfo.participants ? classInfo.participants.length : 0;
            const capacity = classInfo.capacity || 0;
            jobContent = `
                <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <p class="text-xs font-semibold text-emerald-900">${job.id}</p>
                            <span class="text-[10px] px-1.5 py-0.5 bg-emerald-200 text-emerald-800 rounded-full font-medium">Class</span>
                        </div>
                        <p class="text-xs font-medium text-gray-900 truncate">${classInfo.name || job.customerName}</p>
                        <p class="text-xs text-gray-600 truncate">${job.description}</p>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs text-emerald-700">👥 ${participantCount}/${capacity} seats</span>
                            <span class="text-xs text-gray-500">•</span>
                            <span class="text-xs text-gray-600">Skill: ${classInfo.skillLevel || 'All levels'}</span>
                        </div>
                        <p class="text-xs font-semibold text-gray-900 mt-1">$${job.total.toFixed(2)}</p>
                    </div>
                </div>
            `;
        } else {
            jobContent = `
            <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                </svg>
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-gray-900">${job.id}</p>
                    <p class="text-xs text-gray-600 truncate">${getDisplayName(job)}</p>
                    <p class="text-xs text-gray-500 truncate">${job.description}</p>
                    <p class="text-xs font-semibold text-gray-900 mt-1">$${job.total.toFixed(2)}</p>
                </div>
            </div>
            `;
        }
        
        return `
            <div 
                draggable="true" 
                data-job-id="${job.id}"
                class="p-2 ${bgColor} border ${borderColor} rounded-lg cursor-move transition-colors relative" 
                onclick="openScheduleModal('${job.id}')"
                ondragstart="handleDragStart(event)"
                ondragend="handleDragEnd(event)"
            >
                ${jobContent}
        </div>
        `;
    }).join('');
}

// Quick Schedule Modal (for drag & drop)
let quickScheduleDate = null;

function openQuickScheduleModal(job, date) {
    selectedJob = job;
    quickScheduleDate = date;
    
    const modal = document.getElementById('quickScheduleModal');
    const details = document.getElementById('quickScheduleDetails');
    const isClassJob = job.classMode && job.classMode.enabled;
    
    let detailsContent = '';
    if (isClassJob) {
        const classInfo = job.classMode;
        const participantCount = classInfo.participants ? classInfo.participants.length : 0;
        const capacity = classInfo.capacity || 0;
        detailsContent = `
            <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                    <p class="text-sm font-semibold text-emerald-900">${job.id}</p>
                    <span class="text-[10px] px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded-full font-medium">Class</span>
                </div>
                <p class="text-sm font-medium text-gray-900 mb-1">${classInfo.name || job.customerName}</p>
                <p class="text-sm text-gray-600 mb-2">${job.description}</p>
                <div class="flex items-center gap-3 text-xs text-emerald-700 mb-2">
                    <span>👥 ${participantCount}/${capacity} seats</span>
                    <span>•</span>
                    <span>Skill: ${classInfo.skillLevel || 'All levels'}</span>
                </div>
                <div class="flex items-center gap-2 mt-2">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span class="text-sm font-medium text-emerald-600">${formatDate(date)}</span>
                </div>
            </div>
        `;
    } else {
        detailsContent = `
        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p class="text-sm font-semibold text-gray-900 mb-1">${job.id}</p>
            <p class="text-sm text-gray-700">${job.customerName}</p>
            <p class="text-sm text-gray-600">${job.description}</p>
            <div class="flex items-center gap-2 mt-2">
                <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="text-sm font-medium text-indigo-600">${formatDate(date)}</span>
            </div>
        </div>
    `;
    }
    
    details.innerHTML = detailsContent;
    
    modal.classList.remove('hidden');
}

function closeQuickScheduleModal() {
    document.getElementById('quickScheduleModal').classList.add('hidden');
    selectedJob = null;
    quickScheduleDate = null;
}

function confirmQuickSchedule() {
    if (!selectedJob || !quickScheduleDate) return;
    
    const time = document.getElementById('quickScheduleTime').value;
    
    // Update job
    selectedJob.scheduleDate = quickScheduleDate;
    selectedJob.scheduleTime = time;
    selectedJob.status = 'scheduled';
    
    // Format time for display
    const timeDisplay = formatTime(time);
    
    closeQuickScheduleModal();
    renderCalendar();
    renderUnscheduledJobs();
    
    showNotification(`✅ ${selectedJob.id} scheduled for ${formatDate(quickScheduleDate)} at ${timeDisplay}`);
}

function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Modal functions
function openScheduleModal(jobId) {
    selectedJob = jobs.find(j => j.id === jobId);
    if (!selectedJob) return;
    
    const modal = document.getElementById('scheduleModal');
    const isClassJob = selectedJob.classMode && selectedJob.classMode.enabled;
    const isRecurringJob = selectedJob.isRecurring && selectedJob.recurringTemplate;
    
    // Populate modal content using the unified structure
    let jobTitle = getDisplayName(selectedJob);
    if (isClassJob) {
        jobTitle = selectedJob.classMode.name || selectedJob.customerName;
    } else if (isRecurringJob) {
        const instanceInfo = selectedJob.instanceNumber ? ` (Instance #${selectedJob.instanceNumber})` : '';
        jobTitle = `${selectedJob.customerName}${instanceInfo}`;
    }
    
    document.getElementById('scheduleModalJobTitle').textContent = jobTitle;
    document.getElementById('scheduleModalJobId').textContent = selectedJob.id;
    
    // Show class info, recurring info, or customer name
    if (isRecurringJob) {
        const template = selectedJob.recurringTemplate;
        const instanceInfo = selectedJob.instanceNumber ? `Instance #${selectedJob.instanceNumber}` : 'Recurring';
        document.getElementById('scheduleModalCustomerName').innerHTML = `
            <div class="font-semibold">${selectedJob.customerName}</div>
            <div class="text-xs text-gray-600 mt-1">🔄 ${instanceInfo} • ${template.schedule || 'Recurring schedule'}</div>
            ${template.nextJobDate ? `<div class="text-xs text-indigo-600 mt-1">⏭️ Next: ${new Date(template.nextJobDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>` : ''}
        `;
    } else if (isClassJob) {
        const classInfo = selectedJob.classMode;
        const participantCount = classInfo.participants ? classInfo.participants.length : 0;
        const capacity = classInfo.capacity || 0;
        document.getElementById('scheduleModalCustomerName').innerHTML = `
            <div class="font-semibold">${classInfo.name || selectedJob.customerName}</div>
            <div class="text-xs text-gray-600 mt-1">👥 ${participantCount}/${capacity} seats • Skill: ${classInfo.skillLevel || 'All levels'}</div>
        `;
    } else {
    document.getElementById('scheduleModalCustomerName').textContent = selectedJob.customerName;
    }
    
    document.getElementById('scheduleModalJobValue').textContent = `$${selectedJob.total.toFixed(2)}`;
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('scheduleModalEditDate').value = today;
    document.getElementById('scheduleModalEditDate').min = today;
    document.getElementById('scheduleModalEditTime').value = '09:00';
    
    // Status badge
    const statusElement = document.getElementById('scheduleModalStatus');
    statusElement.textContent = 'UNSCHEDULED';
    statusElement.className = 'px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium';
    
    // Initialize staff assignment
    window.scheduleModalJobStaff = [...selectedJob.assignedStaff]; // Copy current staff
    updateScheduleModalStaffDisplay();
    initializeScheduleModalStaffSearch();
    
    // Description - show class participants if class job, or recurring info if recurring job
    let descriptionContent = selectedJob.description;
    if (isRecurringJob) {
        const template = selectedJob.recurringTemplate;
        descriptionContent = `
            ${selectedJob.description}
            <div class="mt-2 pt-2 border-t border-gray-200">
                <div class="text-xs font-semibold mb-1">🔄 Recurring Schedule: ${template.schedule || 'Custom schedule'}</div>
                <div class="text-xs text-gray-700 mb-1">Template ID: ${selectedJob.templateId || 'N/A'}</div>
                ${template.nextJobDate ? `<div class="text-xs text-indigo-600">⏭️ Next occurrence: ${new Date(template.nextJobDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>` : ''}
            </div>
        `;
    } else if (isClassJob && selectedJob.classMode.participants && selectedJob.classMode.participants.length > 0) {
        const participantsList = selectedJob.classMode.participants.map(p => {
            const statusBadge = p.status === 'confirmed' ? '✅' : 
                               p.status === 'pending_payment' ? '⏳' : 
                               '📋';
            return `${statusBadge} ${p.name}`;
        }).join(', ');
        
        descriptionContent = `
            ${selectedJob.description}
            <div class="mt-2 pt-2 border-t border-gray-200">
                <div class="text-xs font-semibold mb-1">Participants (${selectedJob.classMode.participants.length}):</div>
                <div class="text-xs text-gray-700">${participantsList}</div>
            </div>
        `;
    }
    document.getElementById('scheduleModalDescription').innerHTML = descriptionContent;
    
    modal.classList.remove('hidden');
}

function closeScheduleModal() {
    document.getElementById('scheduleModal').classList.add('hidden');
    selectedJob = null;
    selectedStaff = [];
}

function confirmSchedule() {
    if (!selectedJob) return;
    
    const date = document.getElementById('scheduleModalEditDate').value;
    const time = document.getElementById('scheduleModalEditTime').value;
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    // Update job
    selectedJob.scheduleDate = date;
    selectedJob.scheduleTime = time;
    selectedJob.status = 'scheduled';
    selectedJob.assignedStaff = [...window.scheduleModalJobStaff];
    
    closeScheduleModal();
    renderCalendar();
    renderUnscheduledJobs();
    
    alert(`Job ${selectedJob.id} scheduled for ${date} at ${time}`);
}

function viewJobDetails(job) {
    window.location.href = `job_detail.html?id=${job.id}`;
}

// Staff assignment functions
function initStaffSearch() {
    const searchInput = document.getElementById('staffSearch');
    const autocomplete = document.getElementById('staffAutocomplete');
    
    searchInput.value = '';
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (!query) {
            autocomplete.classList.add('hidden');
            return;
        }
        
        const filtered = availableStaff.filter(staff => 
            staff.name.toLowerCase().includes(query) || 
            staff.role.toLowerCase().includes(query)
        );
        
        if (filtered.length === 0) {
            autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No staff found</div>';
            autocomplete.classList.remove('hidden');
            return;
        }
        
        autocomplete.innerHTML = filtered.map(staff => {
            const colorMap = {
                'blue': 'bg-blue-100 text-blue-600',
                'purple': 'bg-purple-100 text-purple-600',
                'green': 'bg-green-100 text-green-600',
                'red': 'bg-red-100 text-red-600',
                'pink': 'bg-pink-100 text-pink-600'
            };
            const colorClass = colorMap[staff.color] || 'bg-blue-100 text-blue-600';
            
            return `
                <button onclick="selectStaff('${staff.id}')" class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-b-0">
                    <div class="w-10 h-10 ${colorClass} rounded-full flex items-center justify-center font-semibold text-sm">
                        ${staff.avatar}
                    </div>
                    <div class="flex-1">
                        <p class="font-semibold text-gray-900 text-sm">${staff.name}</p>
                        <p class="text-xs text-gray-600">${staff.role}</p>
                    </div>
                </button>
            `;
        }).join('');
        
        autocomplete.classList.remove('hidden');
    });
    
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !autocomplete.contains(e.target)) {
            autocomplete.classList.add('hidden');
        }
    });
}

function selectStaff(staffId) {
    const staff = availableStaff.find(s => s.id === staffId);
    if (!staff) return;
    
    if (selectedStaff.find(s => s.id === staffId)) {
        alert('Staff already selected');
        return;
    }
    
    selectedStaff.push(staff);
    renderSelectedStaff();
    loadRecommendedStaff();
    
    document.getElementById('staffSearch').value = '';
    document.getElementById('staffAutocomplete').classList.add('hidden');
}

function removeStaff(staffId) {
    selectedStaff = selectedStaff.filter(s => s.id !== staffId);
    renderSelectedStaff();
    loadRecommendedStaff();
}

function renderSelectedStaff() {
    const container = document.getElementById('selectedStaffList');
    
    if (selectedStaff.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic">No staff assigned yet</p>';
        return;
    }
    
    container.innerHTML = selectedStaff.map(staff => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-600',
            'purple': 'bg-purple-100 text-purple-600',
            'green': 'bg-green-100 text-green-600',
            'red': 'bg-red-100 text-red-600',
            'pink': 'bg-pink-100 text-pink-600'
        };
        const colorClass = colorMap[staff.color] || 'bg-blue-100 text-blue-600';
        
        return `
            <div class="flex items-center gap-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center font-semibold text-xs">
                    ${staff.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${staff.name}</p>
                    <p class="text-xs text-gray-600">${staff.role}</p>
                </div>
                <button onclick="removeStaff('${staff.id}')" class="p-1 hover:bg-red-100 rounded">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
    }).join('');
}

function loadRecommendedStaff() {
    const container = document.getElementById('recommendedStaffList');
    const recommended = availableStaff.filter(s => !selectedStaff.find(sel => sel.id === s.id)).slice(0, 3);
    
    if (recommended.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic">All staff selected</p>';
        return;
    }
    
    container.innerHTML = recommended.map(staff => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-600',
            'purple': 'bg-purple-100 text-purple-600',
            'green': 'bg-green-100 text-green-600',
            'red': 'bg-red-100 text-red-600',
            'pink': 'bg-pink-100 text-pink-600'
        };
        const colorClass = colorMap[staff.color] || 'bg-blue-100 text-blue-600';
        
        return `
            <button onclick="selectStaff('${staff.id}')" class="w-full flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left">
                <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center font-semibold text-xs">
                    ${staff.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${staff.name}</p>
                    <p class="text-xs text-gray-600">${staff.role}</p>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </button>
        `;
    }).join('');
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

// Drag and drop handlers
function handleDragStart(event) {
    const jobId = event.target.closest('[data-job-id]').getAttribute('data-job-id');
    draggedJobId = jobId;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', event.target.innerHTML);
    event.target.style.opacity = '0.4';
}

function handleDragEnd(event) {
    event.target.style.opacity = '1';
    draggedJobId = null;
}

function handleDragOver(event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
    event.dataTransfer.dropEffect = 'move';
    
    const cell = event.currentTarget;
    if (!cell.classList.contains('drag-over')) {
        cell.classList.add('bg-indigo-50', 'border-indigo-400', 'drag-over');
    }
    
    return false;
}

function handleDragLeave(event) {
    const cell = event.currentTarget;
    cell.classList.remove('bg-indigo-50', 'border-indigo-400', 'drag-over');
}

function handleDrop(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    
    const cell = event.currentTarget;
    cell.classList.remove('bg-indigo-50', 'border-indigo-400', 'drag-over');
    
    if (!draggedJobId) return false;
    
    const dropDate = cell.getAttribute('data-date');
    const job = jobs.find(j => j.id === draggedJobId);
    
    if (!job) return false;
    
    // Open quick schedule modal with time selection
    openQuickScheduleModal(job, dropDate);
    
    return false;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ============================================================================
// STAFF CONFLICT DETECTION
// ============================================================================

function checkStaffConflicts(jobs) {
    const conflicts = [];
    const staffTimeMap = new Map();
    
    // Group jobs by staff member
    jobs.forEach(job => {
        job.assignedStaff.forEach(staffName => {
            if (!staffTimeMap.has(staffName)) {
                staffTimeMap.set(staffName, []);
            }
            staffTimeMap.get(staffName).push(job);
        });
    });
    
    // Check for conflicts (same staff member assigned to multiple jobs at overlapping times)
    staffTimeMap.forEach((staffJobs, staffName) => {
        if (staffJobs.length > 1) {
            // Check for time overlaps
            for (let i = 0; i < staffJobs.length; i++) {
                for (let j = i + 1; j < staffJobs.length; j++) {
                    const job1 = staffJobs[i];
                    const job2 = staffJobs[j];
                    
                    if (jobsOverlap(job1, job2)) {
                        // Find existing conflict or create new one
                        let existingConflict = conflicts.find(c => 
                            c.staff === staffName && 
                            (c.jobs.some(j => j.id === job1.id) || c.jobs.some(j => j.id === job2.id))
                        );
                        
                        if (existingConflict) {
                            // Add jobs to existing conflict if not already present
                            if (!existingConflict.jobs.some(j => j.id === job1.id)) {
                                existingConflict.jobs.push(job1);
                            }
                            if (!existingConflict.jobs.some(j => j.id === job2.id)) {
                                existingConflict.jobs.push(job2);
                            }
                        } else {
                            // Create new conflict
                            conflicts.push({
                                staff: staffName,
                                jobs: [job1, job2],
                                type: 'time_overlap'
                            });
                        }
                    }
                }
            }
        }
    });
    
    return conflicts;
}

function jobsOverlap(job1, job2) {
    // Same date check
    if (job1.scheduleDate !== job2.scheduleDate) {
        return false;
    }
    
    // Parse times
    const time1 = parseJobTime(job1.scheduleTime);
    const time2 = parseJobTime(job2.scheduleTime);
    
    // Assume each job is 1 hour long (you can make this configurable)
    const duration = 60; // minutes
    
    const end1 = time1 + duration;
    const end2 = time2 + duration;
    
    // Check for overlap: job1 starts before job2 ends AND job2 starts before job1 ends
    return time1 < end2 && time2 < end1;
}

function parseJobTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + (minutes || 0);
}

function createConflictWarning(conflicts) {
    const warning = document.createElement('div');
    warning.className = 'conflict-warning';
    warning.style.cssText = `
        position: absolute;
        top: 2px;
        right: 2px;
        background: #dc2626;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        z-index: 20;
        cursor: pointer;
    `;
    
    warning.textContent = '!';
    warning.title = `Staff Conflict: ${conflicts.map(c => 
        `${c.staff} assigned to ${c.jobs.length} overlapping jobs`
    ).join(', ')}`;
    
    warning.onclick = (e) => {
        e.stopPropagation();
        showConflictDetails(conflicts);
    };
    
    return warning;
}

function showConflictDetails(conflicts) {
    const details = conflicts.map(conflict => 
        `⚠️ ${conflict.staff} is assigned to ${conflict.jobs.length} overlapping jobs:\n` +
        conflict.jobs.map(job => `  • ${job.customerName} (${job.scheduleTime})`).join('\n')
    ).join('\n\n');
    
    alert(`Staff Scheduling Conflicts:\n\n${details}\n\nPlease reassign staff to resolve conflicts.`);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in';
    notification.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Initializing job schedule...');
    console.log('📅 Current date set to:', currentDate.toDateString());
    console.log('📊 Total jobs in database:', jobs.length);
    console.log('📋 Jobs with scheduleDate:', jobs.filter(j => j.scheduleDate).length);
    
    // Set initial view to week
    switchView('week');
    renderUnscheduledJobs();
    
    // Navigation
    document.getElementById('prevBtn').addEventListener('click', prevPeriod);
    document.getElementById('nextBtn').addEventListener('click', nextPeriod);
    document.getElementById('todayBtn').addEventListener('click', goToToday);
    
    // View toggles
    document.getElementById('monthViewBtn').addEventListener('click', () => switchView('month'));
    document.getElementById('weekViewBtn').addEventListener('click', () => switchView('week'));
    document.getElementById('dayViewBtn').addEventListener('click', () => switchView('day'));
    
    // Initialize staff filter
    initializeStaffFilter();
    
    console.log('✅ Job Schedule initialized with week view');
});

// ============================================================================
// SIMPLIFIED STAFF FILTER FUNCTIONALITY
// ============================================================================

function initializeStaffFilter() {
    const searchInput = document.getElementById('staffSearchInput');
    const dropdown = document.getElementById('staffAutocompleteDropdown');
    
    // Search functionality with autocomplete
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (!query) {
            dropdown.classList.add('hidden');
            return;
        }
        
        showStaffAutocomplete(query);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
    
    // Clear search when pressing Escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            dropdown.classList.add('hidden');
        }
    });
    
    // Initialize empty state
    updateSelectedStaffTags();
}

function showStaffAutocomplete(query) {
    const dropdown = document.getElementById('staffAutocompleteDropdown');
    
    // Filter staff that aren't already selected and match the query
    const availableForSelection = availableStaff.filter(staff => 
        !staffFilter.includes(staff.name) &&
        (staff.name.toLowerCase().includes(query) || staff.role.toLowerCase().includes(query))
    );
    
    if (availableForSelection.length === 0) {
        dropdown.innerHTML = '<div class="p-3 text-sm text-gray-500">No staff found</div>';
        dropdown.classList.remove('hidden');
        return;
    }
    
    const colorMap = {
        'blue': 'bg-blue-500',
        'green': 'bg-green-500',
        'purple': 'bg-purple-500',
        'red': 'bg-red-500',
        'pink': 'bg-pink-500'
    };
    
    dropdown.innerHTML = availableForSelection.map(staff => `
        <button 
            onclick="selectStaffForFilter('${staff.id}')" 
            class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-b-0"
        >
            <div class="w-8 h-8 ${colorMap[staff.color]} rounded-full flex items-center justify-center text-white font-bold text-xs">
                ${staff.avatar}
            </div>
            <div>
                <div class="font-medium text-sm text-gray-900">${staff.name}</div>
                <div class="text-xs text-gray-500">${staff.role}</div>
            </div>
        </button>
    `).join('');
    
    dropdown.classList.remove('hidden');
}

function selectStaffForFilter(staffId) {
    const staff = availableStaff.find(s => s.id === staffId);
    if (!staff || staffFilter.includes(staff.name)) return;
    
    // Add staff to filter
    staffFilter.push(staff.name);
    
    // Clear search input and hide dropdown
    document.getElementById('staffSearchInput').value = '';
    document.getElementById('staffAutocompleteDropdown').classList.add('hidden');
    
    // Update UI and refresh calendar
    updateSelectedStaffTags();
    renderCalendar();
    renderUnscheduledJobs();
}

function removeStaffFromFilter(staffName) {
    staffFilter = staffFilter.filter(name => name !== staffName);
    updateSelectedStaffTags();
    renderCalendar();
    renderUnscheduledJobs();
}

function clearAllStaffFilters() {
    staffFilter = [];
    updateSelectedStaffTags();
    renderCalendar();
    renderUnscheduledJobs();
}

function updateSelectedStaffTags() {
    const container = document.getElementById('selectedStaffTags');
    
    if (staffFilter.length === 0) {
        container.innerHTML = '<span class="text-xs text-gray-500 py-1">All staff shown</span>';
        return;
    }
    
    const colorMap = {
        'Alice Anderson': 'bg-blue-100 text-blue-800',
        'Benjamin Brooks': 'bg-green-100 text-green-800',
        'Catherine Chen': 'bg-purple-100 text-purple-800',
        'Daniel Davis': 'bg-red-100 text-red-800',
        'Emily Evans': 'bg-pink-100 text-pink-800'
    };
    
    const tags = staffFilter.map(staffName => {
        const staff = availableStaff.find(s => s.name === staffName);
        const colorClass = colorMap[staffName] || 'bg-gray-100 text-gray-800';
        
        return `
            <span class="inline-flex items-center gap-1 px-2 py-1 ${colorClass} rounded-full text-xs font-medium">
                ${staff ? staff.avatar : staffName.split(' ').map(n => n[0]).join('')}
                ${staffName}
                <button 
                    onclick="removeStaffFromFilter('${staffName}')" 
                    class="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </span>
        `;
    }).join('');
    
    const clearAllButton = staffFilter.length > 1 ? `
        <button 
            onclick="clearAllStaffFilters()" 
            class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full text-xs font-medium"
        >
            Clear all
        </button>
    ` : '';
    
    container.innerHTML = tags + clearAllButton;
}

// ============================================================================
// CURRENT TIME INDICATOR (Google Calendar Style)
// ============================================================================

function addCurrentTimeIndicator(viewType) {
    console.log('🕐 Adding current time indicator for:', viewType);
    
    // Remove existing indicator
    const existingIndicator = document.querySelector('.current-time-indicator, .current-time-line');
    if (existingIndicator) {
        existingIndicator.remove();
        console.log('🗑️ Removed existing indicator');
    }
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    console.log('⏰ Current time:', now.toLocaleTimeString(), 'Hour:', currentHour, 'Minute:', currentMinute);
    console.log('📅 Today:', today);
    console.log('📅 Current date:', currentDate.toISOString().split('T')[0]);
    
    // For demo purposes, always show indicator on Wednesday (Nov 13, 2024) with current time
    const demoToday = '2024-11-13'; // Wednesday in our sample data
    const isViewingToday = viewType === 'day' ? 
        currentDate.toISOString().split('T')[0] === demoToday :
        true; // For week view, always show if current week contains Nov 13, 2024
    
    console.log('👁️ Is viewing today:', isViewingToday);
    console.log('📅 Demo today (Nov 13):', demoToday);
    
    if (!isViewingToday) {
        console.log('❌ Not viewing today, skipping indicator');
        return;
    }
    
    if (viewType === 'week') {
        console.log('📊 Adding week time indicator');
        addWeekTimeIndicator(now, demoToday, currentHour, currentMinute);
    } else if (viewType === 'day') {
        console.log('📋 Adding day time indicator');
        addDayTimeIndicator(now, today, currentHour, currentMinute);
    }
    
    // Update indicator every minute
    setTimeout(() => {
        if (document.querySelector('.current-time-indicator, .current-time-line')) {
            addCurrentTimeIndicator(viewType);
        }
    }, 60000);
}

function addWeekTimeIndicator(now, today, currentHour, currentMinute) {
    const grid = document.getElementById('calendarGrid');
    if (!grid || !grid.classList.contains('time-grid')) return;
    
    // Check if current time is within our display range (8 AM - 7 PM)
    if (currentHour < 8 || currentHour >= 19) return;
    
    // Wait for grid to be fully rendered
    setTimeout(() => {
        // Find a specific time slot to use as reference for positioning
        const timeSlots = grid.querySelectorAll('.time-slot');
        if (timeSlots.length === 0) {
            console.log('❌ No time slots found');
            return;
        }
        
        // The grid has 12 rows (8 AM to 7 PM) and 7 columns (Sun-Sat)
        // Wednesday is column 3 (0-indexed)
        const wednesdayColumn = 3;
        
        // Calculate which row we should be in (0-11 for 8 AM to 7 PM)
        const targetHourRow = currentHour - 8; // 0-based row index
        
        // Find the Wednesday time slot for the current hour
        const targetSlotIndex = (targetHourRow * 7) + wednesdayColumn;
        const targetSlot = timeSlots[targetSlotIndex];
        
        if (!targetSlot) {
            console.log('❌ Target slot not found, index:', targetSlotIndex);
            return;
        }
        
        // Get the position of the target slot
        const slotRect = targetSlot.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        
        // Calculate position relative to grid
        const relativeTop = slotRect.top - gridRect.top;
        const relativeLeft = slotRect.left - gridRect.left;
        const slotWidth = slotRect.width;
        
        // Add minute offset within the hour (each hour slot is ~60px tall)
        const minuteOffset = (currentMinute / 60) * 60; // 60px per hour
        const finalTop = relativeTop + minuteOffset;
        
        const indicator = document.createElement('div');
        indicator.className = 'current-time-line';
        indicator.style.cssText = `
            position: absolute;
            top: ${finalTop}px;
            left: ${relativeLeft}px;
            width: ${slotWidth}px;
            height: 2px;
            background: #dc2626;
            z-index: 100;
            box-shadow: 0 0 6px rgba(220, 38, 38, 0.5);
        `;
        
        // Add red circle at the start and current time label
        const timeLabel = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        indicator.innerHTML = `
            <div style="
                position: absolute;
                left: -6px;
                top: -4px;
                width: 10px;
                height: 10px;
                background: #dc2626;
                border-radius: 50%;
                box-shadow: 0 0 6px rgba(220, 38, 38, 0.5);
            "></div>
            <div style="
                position: absolute;
                left: -50px;
                top: -12px;
                background: #dc2626;
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: 600;
                white-space: nowrap;
            ">${timeLabel}</div>
        `;
        
        grid.appendChild(indicator);
        
        console.log('🔴 Time indicator added at:', timeLabel);
        console.log('📍 Using slot index:', targetSlotIndex, 'for hour:', currentHour);
        console.log('📍 Position - Top:', finalTop, 'Left:', relativeLeft);
        console.log('📏 Slot dimensions - Width:', slotWidth, 'Height:', slotRect.height);
        console.log('⏰ Minute offset:', minuteOffset);
    }, 200); // Increased delay to ensure grid is fully rendered
}

function addDayTimeIndicator(now, today, currentHour, currentMinute) {
    const grid = document.getElementById('calendarGrid');
    const scheduleContainer = grid.querySelector('.day-schedule-container');
    if (!scheduleContainer) return;
    
    // Check if we're viewing today
    if (currentDate.toISOString().split('T')[0] !== today) return;
    
    // Check if current time is within our display range (7 AM - 8 PM)
    if (currentHour < 7 || currentHour >= 20) return;
    
    // Calculate position based on 30-minute intervals
    const hoursSinceStart = currentHour - 7; // 7 AM is our start for day view
    const minuteProgress = currentMinute / 60;
    const totalHours = hoursSinceStart + minuteProgress;
    
    // Each 30-minute slot is approximately 40px (min-height)
    const slotsFromStart = totalHours * 2; // 2 slots per hour
    const topPosition = slotsFromStart * 40;
    
    const indicator = document.createElement('div');
    indicator.className = 'current-time-indicator';
    indicator.style.cssText = `
        position: absolute;
        top: ${topPosition}px;
        left: 80px;
        right: 0;
        height: 2px;
        background: #dc2626;
        z-index: 100;
        box-shadow: 0 0 6px rgba(220, 38, 38, 0.5);
    `;
    
    // Add red circle and time label
    const timeLabel = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    indicator.innerHTML = `
        <div style="
            position: absolute;
            left: -6px;
            top: -4px;
            width: 10px;
            height: 10px;
            background: #dc2626;
            border-radius: 50%;
            box-shadow: 0 0 6px rgba(220, 38, 38, 0.5);
        "></div>
        <div style="
            position: absolute;
            left: -70px;
            top: -8px;
            background: #dc2626;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            white-space: nowrap;
        ">${timeLabel}</div>
    `;
    
    scheduleContainer.appendChild(indicator);
}

// Update job filtering logic
function shouldShowJob(job) {
    if (staffFilter.length === 0) {
        return true; // Show all jobs when no filter is applied
    }
    
    // Show job if any of its assigned staff are in the filter
    return job.assignedStaff.some(staffName => staffFilter.includes(staffName));
}

// ============================================================================
// TOOLTIP AND MODAL FUNCTIONALITY
// ============================================================================

let currentPopupJob = null;
let popupTimeout = null;
let popupKeepOpen = false;

function keepPopupOpen() {
    popupKeepOpen = true;
    if (popupTimeout) {
        clearTimeout(popupTimeout);
        popupTimeout = null;
    }
}

function showJobTooltip(event, job) {
    // Clear any existing timeout
    if (popupTimeout) {
        clearTimeout(popupTimeout);
    }
    
    // Store current job for popup actions
    currentPopupJob = job;
    
    const popup = document.getElementById('jobPopup');
    const isClassJob = job.classMode && job.classMode.enabled;
    const isRecurringJob = job.isRecurring && job.recurringTemplate;
    
    // Format schedule date
    const scheduleDate = job.scheduleDate ? 
        new Date(job.scheduleDate).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        }) : 'Not scheduled';
    
    // Set header class based on job type
    const header = document.getElementById('jobPopupHeader');
    header.className = 'job-popup-header';
    if (isClassJob) {
        header.classList.add('class-job');
    } else if (isRecurringJob) {
        header.classList.add('recurring-job');
    }
    
    // Set title and badge
    let title = job.customerName;
    let badge = job.status.replace('_', ' ').toUpperCase();
    
    if (isClassJob) {
        title = job.classMode.name || job.customerName;
        badge = 'CLASS';
    } else if (isRecurringJob) {
        const instanceInfo = job.instanceNumber ? `Instance #${job.instanceNumber}` : 'Recurring';
        title = `${job.customerName} - ${instanceInfo}`;
        badge = 'RECURRING';
    }
    
    document.getElementById('jobPopupTitle').textContent = title;
    document.getElementById('jobPopupId').textContent = job.id;
    document.getElementById('jobPopupBadge').textContent = badge;
    
    // Build body content
    let bodyContent = '';
    
    if (isRecurringJob) {
        const template = job.recurringTemplate;
        const staffAvatars = job.assignedStaff.map(staffName => {
            const staff = availableStaff.find(s => s.name === staffName);
            if (staff) {
                const colorMap = {
                    'blue': 'bg-blue-500',
                    'green': 'bg-green-500',
                    'purple': 'bg-purple-500',
                    'red': 'bg-red-500',
                    'pink': 'bg-pink-500'
                };
                return `<span class="inline-flex items-center justify-center w-8 h-8 ${colorMap[staff.color]} text-white rounded-full text-xs font-bold">${staff.avatar}</span>`;
            }
            return '';
        }).join('');
        
        bodyContent = `
            <div class="space-y-3">
                <div>
                    <p class="text-sm text-gray-600 mb-2">${job.description}</p>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="text-xs text-gray-500 mb-1">Date</div>
                        <div class="text-sm font-semibold text-gray-900">${scheduleDate}</div>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="text-xs text-gray-500 mb-1">Time</div>
                        <div class="text-sm font-semibold text-gray-900">${job.scheduleTime || 'TBD'}</div>
                    </div>
                </div>
                <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                    <div class="text-xs text-indigo-600 mb-1 font-medium">🔄 Recurring Schedule</div>
                    <div class="text-sm font-semibold text-indigo-900">${template.schedule || 'Custom schedule'}</div>
                    ${template.nextJobDate ? `<div class="text-xs text-indigo-600 mt-1">⏭️ Next: ${new Date(template.nextJobDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>` : ''}
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                    <div class="text-xs text-gray-500 mb-2">Assigned Staff</div>
                    <div class="flex items-center gap-2">
                        ${staffAvatars || '<span class="text-sm text-gray-500">No staff assigned</span>'}
                    </div>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span class="text-sm text-gray-600">Total Value</span>
                    <span class="text-lg font-bold text-gray-900">$${job.total.toFixed(2)}</span>
                </div>
            </div>
        `;
    } else if (isClassJob) {
        const classInfo = job.classMode;
        const participantCount = classInfo.participants ? classInfo.participants.length : 0;
        const capacity = classInfo.capacity || 0;
        const timeRange = job.endTime ? `${job.scheduleTime} - ${job.endTime}` : job.scheduleTime;
        const occupancyPercent = capacity > 0 ? Math.round((participantCount / capacity) * 100) : 0;
        
        const staffAvatars = job.assignedStaff.map(staffName => {
            const staff = availableStaff.find(s => s.name === staffName);
            if (staff) {
                const colorMap = {
                    'blue': 'bg-blue-500',
                    'green': 'bg-green-500',
                    'purple': 'bg-purple-500',
                    'red': 'bg-red-500',
                    'pink': 'bg-pink-500'
                };
                return `<span class="inline-flex items-center justify-center w-8 h-8 ${colorMap[staff.color]} text-white rounded-full text-xs font-bold">${staff.avatar}</span>`;
            }
            return '';
        }).join('');
        
        // Participants list
        const participantsList = classInfo.participants && classInfo.participants.length > 0
            ? classInfo.participants.slice(0, 5).map(p => {
                const statusIcon = p.status === 'confirmed' ? '✅' : 
                                 p.status === 'pending_payment' ? '⏳' : 
                                 '📋';
                return `<div class="flex items-center gap-2 text-sm py-1">
                    <span>${statusIcon}</span>
                    <span class="text-gray-700">${p.name}</span>
                </div>`;
            }).join('')
            : '<div class="text-sm text-gray-500 py-2">No participants yet</div>';
        
        const moreParticipants = participantCount > 5 ? `<div class="text-xs text-gray-500 mt-2">+${participantCount - 5} more participants</div>` : '';
        
        bodyContent = `
            <div class="space-y-3">
                <div>
                    <p class="text-sm text-gray-600 mb-2">${job.description}</p>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="text-xs text-gray-500 mb-1">Date</div>
                        <div class="text-sm font-semibold text-gray-900">${scheduleDate}</div>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="text-xs text-gray-500 mb-1">Time</div>
                        <div class="text-sm font-semibold text-gray-900">${timeRange}</div>
                    </div>
                </div>
                <div class="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <div class="flex items-center justify-between mb-2">
                        <div class="text-xs text-emerald-600 font-medium">📚 Skill Level</div>
                        <div class="text-sm font-semibold text-emerald-900">${classInfo.skillLevel || 'All levels'}</div>
                    </div>
                    <div class="mt-2">
                        <div class="flex items-center justify-between text-xs text-emerald-700 mb-1">
                            <span>Enrollment</span>
                            <span class="font-semibold">${participantCount}/${capacity} seats</span>
                        </div>
                        <div class="w-full bg-emerald-200 rounded-full h-2">
                            <div class="bg-emerald-600 h-2 rounded-full transition-all" style="width: ${occupancyPercent}%"></div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                    <div class="text-xs text-gray-500 mb-2">Instructor</div>
                    <div class="flex items-center gap-2">
                        ${staffAvatars || '<span class="text-sm text-gray-500">No instructor assigned</span>'}
                    </div>
                </div>
                ${participantCount > 0 ? `
                <div class="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                    <div class="text-xs text-gray-500 mb-2 font-medium">Participants</div>
                    ${participantsList}
                    ${moreParticipants}
                </div>
                ` : ''}
                <div class="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span class="text-sm text-gray-600">Total Value</span>
                    <span class="text-lg font-bold text-gray-900">$${job.total.toFixed(2)}</span>
                </div>
            </div>
        `;
    } else {
        // Regular job popup
        const staffAvatars = job.assignedStaff.map(staffName => {
            const staff = availableStaff.find(s => s.name === staffName);
            if (staff) {
                const colorMap = {
                    'blue': 'bg-blue-500',
                    'green': 'bg-green-500',
                    'purple': 'bg-purple-500',
                    'red': 'bg-red-500',
                    'pink': 'bg-pink-500'
                };
                return `<span class="inline-flex items-center justify-center w-8 h-8 ${colorMap[staff.color]} text-white rounded-full text-xs font-bold">${staff.avatar}</span>`;
            }
            return '';
        }).join('');
        
        bodyContent = `
            <div class="space-y-3">
                <div>
                    <p class="text-sm text-gray-600 mb-2">${job.description}</p>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="text-xs text-gray-500 mb-1">Date</div>
                        <div class="text-sm font-semibold text-gray-900">${scheduleDate}</div>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="text-xs text-gray-500 mb-1">Time</div>
                        <div class="text-sm font-semibold text-gray-900">${job.scheduleTime || 'TBD'}</div>
                    </div>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                    <div class="text-xs text-gray-500 mb-2">Assigned Staff</div>
                    <div class="flex items-center gap-2">
                        ${staffAvatars || '<span class="text-sm text-gray-500">No staff assigned</span>'}
                    </div>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span class="text-sm text-gray-600">Total Value</span>
                    <span class="text-lg font-bold text-gray-900">$${job.total.toFixed(2)}</span>
                </div>
            </div>
        `;
    }
    
    document.getElementById('jobPopupBody').innerHTML = bodyContent;
    
    // Position popup
    updatePopupPosition(event, popup);
    
    // Show popup with animation
    popup.classList.add('show');
}

function hideJobTooltip() {
    if (popupKeepOpen) {
        popupKeepOpen = false;
        return;
    }
    
    const popup = document.getElementById('jobPopup');
    popup.classList.remove('show');
    currentPopupJob = null;
    
    // Clear timeout if exists
    if (popupTimeout) {
        clearTimeout(popupTimeout);
        popupTimeout = null;
    }
}

function updatePopupPosition(event, popup) {
    if (!popup) popup = document.getElementById('jobPopup');
    const rect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Default position: below and to the right of cursor
    let x = event.pageX + 15;
    let y = event.pageY + 15;
    
    // Adjust if popup would go off right edge
    if (x + rect.width > viewportWidth) {
        x = event.pageX - rect.width - 15;
        // Update arrow position
        const arrow = popup.querySelector('.popup-arrow');
        if (arrow) {
            arrow.classList.remove('left');
            arrow.classList.add('right');
        }
    } else {
        const arrow = popup.querySelector('.popup-arrow');
        if (arrow) {
            arrow.classList.remove('right');
            arrow.classList.add('left');
        }
    }
    
    // Adjust if popup would go off bottom edge
    if (y + rect.height > viewportHeight) {
        y = event.pageY - rect.height - 15;
        // Update arrow position
        const arrow = popup.querySelector('.popup-arrow');
        if (arrow) {
            arrow.classList.remove('top');
            arrow.classList.add('bottom');
        }
    } else {
        const arrow = popup.querySelector('.popup-arrow');
        if (arrow) {
            arrow.classList.remove('bottom');
            arrow.classList.add('top');
        }
    }
    
    // Keep within viewport bounds
    x = Math.max(10, Math.min(x, viewportWidth - rect.width - 10));
    y = Math.max(10, Math.min(y, viewportHeight - rect.height - 10));
    
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
}

function closeJobPopup() {
    hideJobTooltip();
}

function viewJobFromPopup() {
    if (currentPopupJob) {
        showJobModal(currentPopupJob);
        hideJobTooltip();
    }
}

function showJobModal(job) {
    const modal = document.getElementById('jobDetailsModal');
    const isClassJob = job.classMode && job.classMode.enabled;
    const isRecurringJob = job.isRecurring && job.recurringTemplate;
    
    // Populate modal content
    let jobTitle = getDisplayName(job);
    if (isClassJob) {
        jobTitle = job.classMode.name || job.customerName;
    } else if (isRecurringJob) {
        const instanceInfo = job.instanceNumber ? ` (Instance #${job.instanceNumber})` : '';
        jobTitle = `${job.customerName}${instanceInfo}`;
    }
    
    document.getElementById('modalJobTitle').textContent = jobTitle;
    document.getElementById('modalJobId').textContent = job.id;
    
    // Show class info, recurring info, or customer name
    if (isRecurringJob) {
        const template = job.recurringTemplate;
        const instanceInfo = job.instanceNumber ? `Instance #${job.instanceNumber}` : 'Recurring';
        document.getElementById('modalCustomerName').innerHTML = `
            <div class="font-semibold">${job.customerName}</div>
            <div class="text-xs text-gray-600 mt-1">🔄 ${instanceInfo} • ${template.schedule || 'Recurring schedule'}</div>
            ${template.nextJobDate ? `<div class="text-xs text-indigo-600 mt-1">⏭️ Next: ${new Date(template.nextJobDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>` : ''}
        `;
    } else if (isClassJob) {
        const classInfo = job.classMode;
        const participantCount = classInfo.participants ? classInfo.participants.length : 0;
        const capacity = classInfo.capacity || 0;
        document.getElementById('modalCustomerName').innerHTML = `
            <div class="font-semibold">${classInfo.name || job.customerName}</div>
            <div class="text-xs text-gray-600 mt-1">👥 ${participantCount}/${capacity} seats • Skill: ${classInfo.skillLevel || 'All levels'}</div>
        `;
    } else {
    document.getElementById('modalCustomerName').textContent = `Customer: ${job.customerName}`;
    }
    
    document.getElementById('modalJobValue').textContent = `$${job.total.toFixed(2)}`;
    
    // Populate editable date and time fields
    if (job.scheduleDate) {
        document.getElementById('modalEditDate').value = job.scheduleDate;
        document.getElementById('modalEditTime').value = job.scheduleTime || '09:00';
    } else {
        document.getElementById('modalEditDate').value = '';
        document.getElementById('modalEditTime').value = '09:00';
    }
    
    // Status badge
    const statusElement = document.getElementById('modalStatus');
    statusElement.textContent = job.status.replace('_', ' ').toUpperCase();
    statusElement.className = `px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(job.status)}`;
    
    // Initialize staff assignment
    window.modalJobStaff = [...job.assignedStaff]; // Copy current staff
    updateModalStaffDisplay();
    initializeModalStaffSearch();
    
    // Description - show class participants if class job, or recurring info if recurring job
    let descriptionContent = job.description;
    if (isRecurringJob) {
        const template = job.recurringTemplate;
        descriptionContent = `
            ${job.description}
            <div class="mt-2 pt-2 border-t border-gray-200">
                <div class="text-xs font-semibold mb-1">🔄 Recurring Schedule: ${template.schedule || 'Custom schedule'}</div>
                <div class="text-xs text-gray-700 mb-1">Template ID: ${job.templateId || 'N/A'}</div>
                ${template.nextJobDate ? `<div class="text-xs text-indigo-600">⏭️ Next occurrence: ${new Date(template.nextJobDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>` : ''}
            </div>
        `;
    } else if (isClassJob && job.classMode.participants && job.classMode.participants.length > 0) {
        const timeRange = job.endTime ? `${job.scheduleTime} - ${job.endTime}` : job.scheduleTime;
        const participantsList = job.classMode.participants.map(p => {
            const statusBadge = p.status === 'confirmed' ? '✅' : 
                               p.status === 'pending_payment' ? '⏳' : 
                               '📋';
            return `${statusBadge} ${p.name}`;
        }).join(', ');
        
        descriptionContent = `
            ${job.description}
            <div class="mt-2 pt-2 border-t border-gray-200">
                <div class="text-xs font-semibold mb-1">Time: ${timeRange}</div>
                <div class="text-xs font-semibold mb-1">Participants (${job.classMode.participants.length}):</div>
                <div class="text-xs text-gray-700">${participantsList}</div>
            </div>
        `;
    }
    document.getElementById('modalDescription').innerHTML = descriptionContent;
    
    // Store current job for editing
    window.currentModalJob = job;
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Hide tooltip if showing
    hideJobTooltip();
}

function closeJobModal() {
    const modal = document.getElementById('jobDetailsModal');
    modal.classList.add('hidden');
    window.currentModalJob = null;
    window.modalJobStaff = [];
    
    // Clear staff search
    document.getElementById('modalStaffSearch').value = '';
    document.getElementById('modalStaffAutocomplete').classList.add('hidden');
}

function updateModalStaffDisplay() {
    const container = document.getElementById('modalCurrentStaff');
    
    if (!window.modalJobStaff || window.modalJobStaff.length === 0) {
        container.innerHTML = '<div class="text-sm text-gray-500 italic">No staff assigned</div>';
        return;
    }
    
    const colorMap = {
        'Alice Anderson': 'bg-blue-500',
        'Benjamin Brooks': 'bg-green-500',
        'Catherine Chen': 'bg-purple-500',
        'Daniel Davis': 'bg-red-500',
        'Emily Evans': 'bg-pink-500'
    };
    
    const staffCards = window.modalJobStaff.map(staffName => {
        const staff = availableStaff.find(s => s.name === staffName);
        const bgColor = colorMap[staffName] || 'bg-gray-500';
        
        return `
            <div class="flex items-center gap-2 bg-white p-2 rounded-lg border">
                <div class="w-6 h-6 ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-xs">
                    ${staff ? staff.avatar : staffName.split(' ').map(n => n[0]).join('')}
                </div>
                <div class="flex-1">
                    <div class="font-medium text-sm">${staffName}</div>
                    <div class="text-xs text-gray-600">${staff ? staff.role : 'Staff'}</div>
                </div>
                <button 
                    onclick="removeModalStaff('${staffName}')" 
                    class="p-1 hover:bg-red-100 rounded text-red-600"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = staffCards;
}

function initializeModalStaffSearch() {
    const searchInput = document.getElementById('modalStaffSearch');
    const autocomplete = document.getElementById('modalStaffAutocomplete');
    
    // Clear previous event listeners
    searchInput.replaceWith(searchInput.cloneNode(true));
    const newSearchInput = document.getElementById('modalStaffSearch');
    
    newSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (!query) {
            autocomplete.classList.add('hidden');
            return;
        }
        
        // Filter available staff (not already assigned)
        const availableForSelection = availableStaff.filter(staff => 
            !window.modalJobStaff.includes(staff.name) &&
            (staff.name.toLowerCase().includes(query) || staff.role.toLowerCase().includes(query))
        );
        
        if (availableForSelection.length === 0) {
            autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No staff found</div>';
            autocomplete.classList.remove('hidden');
            return;
        }
        
        const colorMap = {
            'blue': 'bg-blue-500',
            'green': 'bg-green-500',
            'purple': 'bg-purple-500',
            'red': 'bg-red-500',
            'pink': 'bg-pink-500'
        };
        
        autocomplete.innerHTML = availableForSelection.map(staff => `
            <button 
                onclick="addModalStaff('${staff.name}')" 
                class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
            >
                <div class="w-6 h-6 ${colorMap[staff.color]} rounded-full flex items-center justify-center text-white font-bold text-xs">
                    ${staff.avatar}
                </div>
                <div>
                    <div class="font-medium text-sm text-gray-900">${staff.name}</div>
                    <div class="text-xs text-gray-500">${staff.role}</div>
                </div>
            </button>
        `).join('');
        
        autocomplete.classList.remove('hidden');
    });
    
    // Close autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        if (!newSearchInput.contains(e.target) && !autocomplete.contains(e.target)) {
            autocomplete.classList.add('hidden');
        }
    });
}

function addModalStaff(staffName) {
    if (!window.modalJobStaff.includes(staffName)) {
        window.modalJobStaff.push(staffName);
        updateModalStaffDisplay();
        
        // Clear search
        document.getElementById('modalStaffSearch').value = '';
        document.getElementById('modalStaffAutocomplete').classList.add('hidden');
    }
}

function removeModalStaff(staffName) {
    window.modalJobStaff = window.modalJobStaff.filter(name => name !== staffName);
    updateModalStaffDisplay();
}

function saveJobChanges() {
    if (!window.currentModalJob) return;
    
    const newDate = document.getElementById('modalEditDate').value;
    const newTime = document.getElementById('modalEditTime').value;
    
    // Validate inputs
    if (!newDate || !newTime) {
        alert('Please fill in both date and time');
        return;
    }
    
    // Update the job
    const job = window.currentModalJob;
    const oldDate = job.scheduleDate;
    const oldTime = job.scheduleTime;
    const oldStaff = [...job.assignedStaff];
    
    job.scheduleDate = newDate;
    job.scheduleTime = newTime;
    job.assignedStaff = [...window.modalJobStaff];
    job.status = job.scheduleDate ? 'scheduled' : 'created';
    
    // Close modal
    closeJobModal();
    
    // Refresh calendar
    renderCalendar();
    renderUnscheduledJobs();
    
    // Show success message
    const changes = [];
    if (oldDate !== newDate || oldTime !== newTime) {
        changes.push('schedule updated');
    }
    if (JSON.stringify(oldStaff) !== JSON.stringify(job.assignedStaff)) {
        changes.push('staff assignment updated');
    }
    
    if (changes.length > 0) {
        showNotification(`✅ Job ${job.id}: ${changes.join(' and ')}`);
    }
}

function viewFullJobDetails() {
    if (window.currentModalJob) {
        // This would typically navigate to a full job details page
        // For now, we'll show an alert with the job ID
        alert(`Navigating to full details for ${window.currentModalJob.id}\n\nThis would typically open a dedicated job details page with:\n• Complete job information\n• Customer contact details\n• Full service history\n• Payment information\n• Notes and attachments\n• Edit capabilities`);
        
        // In a real application, you might do:
        // window.location.href = `job_details.html?id=${window.currentModalJob.id}`;
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
        closeScheduleModal();
        hideJobTooltip();
    }
});

// Schedule Modal Staff Management Functions
function updateScheduleModalStaffDisplay() {
    const container = document.getElementById('scheduleModalCurrentStaff');
    if (!window.scheduleModalJobStaff) {
        window.scheduleModalJobStaff = [];
    }
    
    if (window.scheduleModalJobStaff.length === 0) {
        container.innerHTML = '<div class="text-sm text-gray-500 italic">No staff assigned</div>';
        return;
    }
    
    const colorMap = {
        'blue': 'bg-blue-500',
        'green': 'bg-green-500', 
        'purple': 'bg-purple-500',
        'red': 'bg-red-500',
        'pink': 'bg-pink-500'
    };
    
    container.innerHTML = window.scheduleModalJobStaff.map(staffName => {
        const staff = availableStaff.find(s => s.name === staffName);
        if (!staff) return '';
        
        return `
            <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div class="w-5 h-5 ${colorMap[staff.color]} rounded-full flex items-center justify-center text-white font-bold text-xs">
                    ${staff.avatar}
                </div>
                <span class="text-sm font-medium text-gray-900">${staff.name}</span>
                <button onclick="removeScheduleModalStaff('${staff.name}')" class="ml-auto text-red-500 hover:text-red-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
    }).join('');
}

function initializeScheduleModalStaffSearch() {
    const searchInput = document.getElementById('scheduleModalStaffSearch');
    const autocomplete = document.getElementById('scheduleModalStaffAutocomplete');
    
    if (!searchInput || !autocomplete) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            autocomplete.classList.add('hidden');
            return;
        }
        
        // Filter available staff (not already assigned)
        const availableForSelection = availableStaff.filter(staff => 
            !window.scheduleModalJobStaff.includes(staff.name) &&
            (staff.name.toLowerCase().includes(query) || staff.role.toLowerCase().includes(query))
        );
        
        if (availableForSelection.length === 0) {
            autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No staff found</div>';
            autocomplete.classList.remove('hidden');
            return;
        }
        
        const colorMap = {
            'blue': 'bg-blue-500',
            'green': 'bg-green-500',
            'purple': 'bg-purple-500',
            'red': 'bg-red-500',
            'pink': 'bg-pink-500'
        };
        
        autocomplete.innerHTML = availableForSelection.map(staff => `
            <button 
                onclick="addScheduleModalStaff('${staff.name}')" 
                class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
            >
                <div class="w-6 h-6 ${colorMap[staff.color]} rounded-full flex items-center justify-center text-white font-bold text-xs">
                    ${staff.avatar}
                </div>
                <div>
                    <div class="font-medium text-sm text-gray-900">${staff.name}</div>
                    <div class="text-xs text-gray-500">${staff.role}</div>
                </div>
            </button>
        `).join('');
        
        autocomplete.classList.remove('hidden');
    });
    
    // Close autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !autocomplete.contains(e.target)) {
            autocomplete.classList.add('hidden');
        }
    });
}

function addScheduleModalStaff(staffName) {
    if (!window.scheduleModalJobStaff.includes(staffName)) {
        window.scheduleModalJobStaff.push(staffName);
        updateScheduleModalStaffDisplay();
        
        // Clear search and hide autocomplete
        const searchInput = document.getElementById('scheduleModalStaffSearch');
        const autocomplete = document.getElementById('scheduleModalStaffAutocomplete');
        if (searchInput) searchInput.value = '';
        if (autocomplete) autocomplete.classList.add('hidden');
    }
}

function removeScheduleModalStaff(staffName) {
    window.scheduleModalJobStaff = window.scheduleModalJobStaff.filter(name => name !== staffName);
    updateScheduleModalStaffDisplay();
}
