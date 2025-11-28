// Class Job Data
let classJobData = {
    id: null,
    classId: null,
    className: '',
    date: null,
    startTime: null,
    endTime: null,
    assignedStaff: [],
    notes: '',
    status: 'scheduled',
    bookings: [],
    maxCapacity: 10
};

// Load job data
function loadJobData() {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');
    const classId = urlParams.get('classId');
    
    if (!jobId) {
        showNotification('Job ID is required', 'error');
        return;
    }
    
    // In a real app, fetch from API
    // For now, use sample data
    classJobData.id = jobId;
    classJobData.classId = classId || 'CLASS-2024-001';
    classJobData.className = 'Yoga Class - Group';
    classJobData.date = '2025-11-25';
    classJobData.startTime = '10:00';
    classJobData.endTime = '11:00';
    classJobData.status = 'scheduled';
    classJobData.maxCapacity = 10;
    classJobData.bookings = [
        {
            id: 'booking-1',
            quoteId: 'Q-2024-020',
            slots: 2,
            customerName: 'Miss A',
            customerEmail: 'missa@example.com',
            status: 'confirmed',
            paymentStatus: 'partial',
            amountPaid: 50.00,
            quoteTotal: 100.00
        },
        {
            id: 'booking-2',
            quoteId: 'Q-2024-121',
            slots: 2,
            customerName: 'Miss A',
            customerEmail: 'missa@example.com',
            status: 'confirmed',
            paymentStatus: 'paid',
            amountPaid: 150.00,
            quoteTotal: 150.00
        }
    ];
    
    populateJobForm();
    renderJobBookings();
    updateJobSummary();
}

// Populate job form
function populateJobForm() {
    document.getElementById('jobTitle').textContent = classJobData.className + ' - Job';
    document.getElementById('jobId').textContent = classJobData.id;
    document.getElementById('linkedClassName').textContent = classJobData.className;
    
    if (classJobData.date) {
        document.getElementById('jobDate').value = classJobData.date;
    }
    if (classJobData.startTime) {
        document.getElementById('jobStartTime').value = classJobData.startTime;
    }
    if (classJobData.endTime) {
        document.getElementById('jobEndTime').value = classJobData.endTime;
    }
    if (classJobData.assignedStaff.length > 0) {
        document.getElementById('jobStaff').value = classJobData.assignedStaff.join(', ');
    }
    if (classJobData.notes) {
        document.getElementById('jobNotes').value = classJobData.notes;
    }
    
    // Update header info
    updateJobHeader();
    updateJobStatusBadge();
}

// Update job header
function updateJobHeader() {
    const date = classJobData.date ? new Date(classJobData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set';
    const time = classJobData.startTime && classJobData.endTime 
        ? `${formatTime(classJobData.startTime)} - ${formatTime(classJobData.endTime)}`
        : 'Not set';
    document.getElementById('jobDateTime').textContent = `${date} • ${time}`;
    
    const totalBooked = classJobData.bookings.reduce((sum, b) => sum + (b.status === 'confirmed' ? b.slots : 0), 0);
    document.getElementById('jobEnrollment').textContent = `${totalBooked} / ${classJobData.maxCapacity}`;
}

// Format time
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Update job status badge
function updateJobStatusBadge() {
    const statusConfig = {
        scheduled: { icon: '📋', text: 'Scheduled', color: 'green' },
        in_progress: { icon: '🔄', text: 'In Progress', color: 'blue' },
        completed: { icon: '✅', text: 'Completed', color: 'emerald' },
        cancelled: { icon: '❌', text: 'Cancelled', color: 'red' }
    };
    
    const status = statusConfig[classJobData.status] || statusConfig.scheduled;
    const badge = document.getElementById('jobStatusBadge');
    badge.textContent = `${status.icon} ${status.text}`;
    badge.className = `px-3 py-1.5 text-xs font-semibold rounded-full bg-${status.color}-100 text-${status.color}-700 border border-${status.color}-200`;
    
    document.getElementById('jobStatus').value = classJobData.status;
}

// Render job bookings
function renderJobBookings() {
    const container = document.getElementById('jobBookingsList');
    
    if (classJobData.bookings.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <p class="text-gray-500">No bookings yet</p>
                <p class="text-sm text-gray-400 mt-1">Bookings will appear here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = classJobData.bookings.map((booking, index) => {
        const statusConfig = {
            confirmed: { color: 'green', icon: '✅', text: 'Confirmed' },
            pending_payment: { color: 'amber', icon: '⏳', text: 'Pending Payment' },
            waitlisted: { color: 'gray', icon: '📋', text: 'Waitlisted' }
        };
        const status = statusConfig[booking.status] || statusConfig.pending_payment;
        
        const paymentInfo = getPaymentStatusInfo(booking.paymentStatus || 'unpaid');
        const amountPaid = booking.amountPaid || 0;
        const quoteTotal = booking.quoteTotal || 0;
        
        return `
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div class="p-4">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 flex-wrap mb-1">
                                <h3 class="text-lg font-semibold text-gray-900">${booking.customerName || 'Unknown Customer'}</h3>
                                <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-${status.color}-100 text-${status.color}-700">
                                    ${status.icon} ${status.text}
                                </span>
                                <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                    ${booking.slots} ${booking.slots === 1 ? 'slot' : 'slots'}
                                </span>
                            </div>
                            ${booking.customerEmail ? `
                                <p class="text-sm text-gray-500">${booking.customerEmail}</p>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Quote</p>
                            <p class="text-sm font-semibold text-gray-900">${booking.quoteId || 'N/A'}</p>
                            ${quoteTotal > 0 ? `
                                <p class="text-xs text-gray-600">${formatCurrencyDisplay(quoteTotal)}</p>
                            ` : ''}
                        </div>
                        
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Payment</p>
                            <div class="flex items-center gap-1.5">
                                <span class="text-sm">${paymentInfo.icon}</span>
                                <p class="text-sm font-semibold text-${paymentInfo.color}-700">${paymentInfo.label}</p>
                            </div>
                            ${quoteTotal > 0 ? `
                                <p class="text-xs text-gray-600">${formatCurrencyDisplay(amountPaid)} / ${formatCurrencyDisplay(quoteTotal)}</p>
                            ` : ''}
                        </div>
                        
                        ${quoteTotal > 0 && amountPaid < quoteTotal ? `
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Outstanding</p>
                                <p class="text-sm font-semibold text-amber-600">${formatCurrencyDisplay(quoteTotal - amountPaid)}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Update job summary
function updateJobSummary() {
    const totalBooked = classJobData.bookings.reduce((sum, b) => sum + (b.status === 'confirmed' ? b.slots : 0), 0);
    const confirmed = classJobData.bookings.filter(b => b.status === 'confirmed').length;
    const pending = classJobData.bookings.filter(b => b.status === 'pending_payment').length;
    const waitlisted = classJobData.bookings.filter(b => b.status === 'waitlisted').length;
    
    document.getElementById('jobCapacityDisplay').textContent = `${totalBooked} / ${classJobData.maxCapacity}`;
    const percentage = classJobData.maxCapacity > 0 ? (totalBooked / classJobData.maxCapacity) * 100 : 0;
    document.getElementById('jobCapacityProgressBar').style.width = `${percentage}%`;
    
    document.getElementById('jobConfirmedCount').textContent = confirmed;
    document.getElementById('jobPendingCount').textContent = pending;
    document.getElementById('jobWaitlistedCount').textContent = waitlisted;
}

// Get class ID
function getClassId() {
    return classJobData.classId || 'CLASS-2024-001';
}

// Format currency
function formatCurrencyDisplay(value) {
    const num = Number(value) || 0;
    return `$${num.toFixed(2)}`;
}

// Get payment status info
function getPaymentStatusInfo(status) {
    switch (status) {
        case 'paid':
            return { label: 'Paid', color: 'emerald', icon: '✅' };
        case 'partial':
            return { label: 'Partially Paid', color: 'amber', icon: '🌓' };
        default:
            return { label: 'Unpaid', color: 'rose', icon: '⚠️' };
    }
}

// Save job
function saveJob() {
    classJobData.date = document.getElementById('jobDate').value;
    classJobData.startTime = document.getElementById('jobStartTime').value;
    classJobData.endTime = document.getElementById('jobEndTime').value;
    classJobData.status = document.getElementById('jobStatus').value;
    classJobData.notes = document.getElementById('jobNotes').value;
    
    const staffValue = document.getElementById('jobStaff').value;
    classJobData.assignedStaff = staffValue ? staffValue.split(',').map(s => s.trim()) : [];
    
    updateJobHeader();
    updateJobStatusBadge();
    
    showNotification('Job saved successfully', 'success');
}

// View on schedule
function viewOnSchedule() {
    window.location.href = 'job_schedule.html';
}

// Export roster
function exportRoster() {
    showNotification('Exporting roster...', 'info');
    // Implement export logic
}

// Show notification
function showNotification(message, type = 'info') {
    // Simple notification - in real app, use a proper notification system
    alert(message);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    loadJobData();
});


