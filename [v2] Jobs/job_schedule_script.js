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

// State
let currentDate = new Date();
let currentView = 'month';
let selectedJob = null;
let selectedStaff = [];
let staffFilter = '';
let draggedJobId = null;

// Calendar functions
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    document.getElementById('currentMonth').textContent = 
        currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    
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
        jobPill.className = `job-pill ${getJobColor(job.status)} truncate`;
        jobPill.textContent = `${job.scheduleTime} ${job.customerName}`;
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
    const unscheduled = jobs.filter(j => !j.scheduleDate);
    
    if (unscheduled.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic">No unscheduled jobs</p>';
        return;
    }
    
    container.innerHTML = unscheduled.map(job => `
        <div 
            draggable="true" 
            data-job-id="${job.id}"
            class="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-indigo-300 cursor-move transition-colors" 
            onclick="openScheduleModal('${job.id}')"
            ondragstart="handleDragStart(event)"
            ondragend="handleDragEnd(event)"
        >
            <div class="flex items-start gap-2">
                <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                </svg>
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-gray-900">${job.id}</p>
                    <p class="text-xs text-gray-600 truncate">${job.customerName}</p>
                    <p class="text-xs text-gray-500 truncate">${job.description}</p>
                    <p class="text-xs font-semibold text-gray-900 mt-1">$${job.total.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Quick Schedule Modal (for drag & drop)
let quickScheduleDate = null;

function openQuickScheduleModal(job, date) {
    selectedJob = job;
    quickScheduleDate = date;
    
    const modal = document.getElementById('quickScheduleModal');
    const details = document.getElementById('quickScheduleDetails');
    
    details.innerHTML = `
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
    
    selectedStaff = [];
    
    const modal = document.getElementById('scheduleModal');
    const details = document.getElementById('scheduleJobDetails');
    
    details.innerHTML = `
        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">${selectedJob.id}</h3>
            <p class="text-sm text-gray-700">Customer: ${selectedJob.customerName}</p>
            <p class="text-sm text-gray-700">Total: $${selectedJob.total.toFixed(2)}</p>
        </div>
    `;
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('scheduleDate').value = today;
    document.getElementById('scheduleDate').min = today;
    
    renderSelectedStaff();
    loadRecommendedStaff();
    initStaffSearch();
    
    modal.classList.remove('hidden');
}

function closeScheduleModal() {
    document.getElementById('scheduleModal').classList.add('hidden');
    selectedJob = null;
    selectedStaff = [];
}

function confirmSchedule() {
    if (!selectedJob) return;
    
    const date = document.getElementById('scheduleDate').value;
    const time = document.getElementById('scheduleTime').value;
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    // Update job
    selectedJob.scheduleDate = date;
    selectedJob.scheduleTime = time;
    selectedJob.status = 'scheduled';
    selectedJob.assignedStaff = selectedStaff.map(s => s.name);
    
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
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function goToToday() {
    currentDate = new Date();
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
    renderCalendar();
    renderUnscheduledJobs();
    
    document.getElementById('prevBtn').addEventListener('click', prevMonth);
    document.getElementById('nextBtn').addEventListener('click', nextMonth);
    document.getElementById('todayBtn').addEventListener('click', goToToday);
    
    // View toggles (placeholder)
    document.getElementById('monthViewBtn').addEventListener('click', function() {
        alert('Month view active');
    });
    document.getElementById('weekViewBtn').addEventListener('click', function() {
        alert('Week view - Coming soon');
    });
    document.getElementById('dayViewBtn').addEventListener('click', function() {
        alert('Day view - Coming soon');
    });
});
