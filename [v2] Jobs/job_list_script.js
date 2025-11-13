// Job List - JavaScript
console.log('📄 job_list_script.js loaded successfully');

// Sample job data
const jobs = [
    {
        id: 'JOB-2024-001',
        quoteId: 'Q-2024-001',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        scheduleDate: '2024-11-15',
        scheduleTime: '10:00 AM',
        assignedStaff: ['Alice Anderson', 'Benjamin Brooks'],
        status: 'scheduled',
        total: 825.00,
        description: 'Math and Science tutoring session'
    },
    {
        id: 'JOB-2024-002',
        quoteId: 'Q-2024-002',
        customerName: 'Michael Chen',
        customerEmail: 'm.chen@email.com',
        scheduleDate: '2024-11-12',
        scheduleTime: '2:00 PM',
        assignedStaff: ['Catherine Chen'],
        status: 'completed',
        total: 450.00,
        description: 'English Literature tutoring'
    },
    {
        id: 'JOB-2024-003',
        quoteId: 'Q-2024-003',
        customerName: 'Emma Wilson',
        customerEmail: 'emma.w@email.com',
        scheduleDate: '2024-11-20',
        scheduleTime: '9:00 AM',
        assignedStaff: ['Daniel Davis', 'Emily Evans'],
        status: 'created',
        total: 1200.00,
        description: 'Advanced Math program'
    },
    {
        id: 'JOB-2024-004',
        quoteId: 'Q-2024-004',
        customerName: 'James Taylor',
        customerEmail: 'j.taylor@email.com',
        scheduleDate: '2024-11-18',
        scheduleTime: '3:30 PM',
        assignedStaff: ['Frank Foster'],
        status: 'on_hold',
        total: 300.00,
        description: 'History tutoring session'
    }
];

// State
let filteredJobs = [...jobs];
let searchTerm = '';
let statusFilter = '';
let sortBy = 'date_desc';

// Helper functions
function getStatusBadge(status) {
    const badges = {
        created: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">📝 Created</span>',
        scheduled: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">📋 Scheduled</span>',
        completed: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">✅ Completed</span>',
        on_hold: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">⏸️ On Hold</span>'
    };
    return badges[status] || badges.created;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Filter and sort
function filterAndSortJobs() {
    let filtered = [...jobs];
    
    // Search filter
    if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(j => 
            j.customerName.toLowerCase().includes(search) ||
            j.id.toLowerCase().includes(search) ||
            j.customerEmail.toLowerCase().includes(search)
        );
    }
    
    // Status filter
    if (statusFilter) {
        filtered = filtered.filter(j => j.status === statusFilter);
    }
    
    // Sort
    switch (sortBy) {
        case 'date_asc':
            filtered.sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate));
            break;
        case 'date_desc':
            filtered.sort((a, b) => new Date(b.scheduleDate) - new Date(a.scheduleDate));
            break;
        case 'customer':
            filtered.sort((a, b) => a.customerName.localeCompare(b.customerName));
            break;
    }
    
    filteredJobs = filtered;
}

// Render jobs
function renderJobs() {
    console.log('🔄 Rendering jobs...');
    filterAndSortJobs();
    updateStats();
    
    const container = document.getElementById('jobsList');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');
    
    console.log('📋 Filtered jobs:', filteredJobs.length);
    console.log('🎯 Container found:', !!container);
    console.log('📭 Empty state found:', !!emptyState);
    
    resultsCount.textContent = `Showing ${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''}`;
    
    if (filteredJobs.length === 0) {
        emptyState.classList.remove('hidden');
        container.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    container.classList.remove('hidden');
    
    container.innerHTML = filteredJobs.map(job => `
        <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer" onclick="window.location.href='job_detail.html?id=${job.id}'">
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-semibold text-gray-900">${job.id}</h3>
                        ${getStatusBadge(job.status)}
                    </div>
                    <p class="text-sm text-gray-600 mb-1">${job.description}</p>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            <span>${job.customerName}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span>${formatDate(job.scheduleDate)} at ${job.scheduleTime}</span>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-gray-900">$${job.total.toFixed(2)}</p>
                    <p class="text-xs text-gray-500 mt-1">Total</p>
                </div>
            </div>
            
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-600">Assigned:</span>
                    <div class="flex -space-x-2">
                        ${job.assignedStaff.slice(0, 3).map((staff, idx) => {
                            const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500'];
                            const initials = staff.split(' ').map(n => n[0]).join('');
                            return `
                                <div class="w-7 h-7 ${colors[idx % 3]} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" title="${staff}">
                                    ${initials}
                                </div>
                            `;
                        }).join('')}
                        ${job.assignedStaff.length > 3 ? `<div class="w-7 h-7 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-700 text-xs font-bold">+${job.assignedStaff.length - 3}</div>` : ''}
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="event.stopPropagation(); window.location.href='job_detail.html?id=${job.id}'" class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update stats
function updateStats() {
    document.getElementById('totalJobs').textContent = jobs.length;
    document.getElementById('scheduledJobs').textContent = jobs.filter(j => j.status === 'scheduled').length;
    document.getElementById('onHoldJobs').textContent = jobs.filter(j => j.status === 'on_hold').length;
    document.getElementById('completedJobs').textContent = jobs.filter(j => j.status === 'completed').length;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Job List initialized');
    console.log('📊 Sample jobs loaded:', jobs.length);
    
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchTerm = e.target.value;
            renderJobs();
        });
    }
    
    // Status filter
    const statusFilterEl = document.getElementById('statusFilter');
    if (statusFilterEl) {
        statusFilterEl.addEventListener('change', function(e) {
            statusFilter = e.target.value;
            renderJobs();
        });
    }
    
    // Sort
    const sortByEl = document.getElementById('sortBy');
    if (sortByEl) {
        sortByEl.addEventListener('change', function(e) {
            sortBy = e.target.value;
            renderJobs();
        });
    }
    
    // Clear filters
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            if (statusFilterEl) statusFilterEl.value = '';
            if (sortByEl) sortByEl.value = 'date_desc';
            searchTerm = '';
            statusFilter = '';
            sortBy = 'date_desc';
            renderJobs();
        });
    }
    
    // Export
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            alert('Export functionality - would export jobs to CSV/Excel');
        });
    }
    
    // Note: Calendar/Schedule button now uses onclick in HTML, no need for event listener here
    
    // Initial render
    renderJobs();
});
