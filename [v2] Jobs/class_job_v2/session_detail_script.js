// Session Detail Script
// Handles display and management of individual class session

// Sample staff data
const sampleStaff = [
    { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-002', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Instructor', department: 'Science' },
    { id: 'STAFF-003', name: 'Michael Chen', email: 'michael.chen@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-004', name: 'Emily Rodriguez', email: 'emily.r@example.com', role: 'Instructor', department: 'Yoga' },
    { id: 'STAFF-005', name: 'James Wilson', email: 'james.w@example.com', role: 'Instructor', department: 'Guitar' },
    { id: 'STAFF-006', name: 'Lisa Anderson', email: 'lisa.a@example.com', role: 'Instructor', department: 'Science' },
    { id: 'STAFF-007', name: 'Robert Taylor', email: 'robert.t@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-008', name: 'Jennifer White', email: 'jennifer.w@example.com', role: 'Instructor', department: 'Yoga' },
    { id: 'STAFF-009', name: 'David Kim', email: 'david.k@example.com', role: 'Instructor', department: 'Computer Science' },
    { id: 'STAFF-010', name: 'Amanda Martinez', email: 'amanda.m@example.com', role: 'Instructor', department: 'English' }
];

// Sample customers (in real app, from API/localStorage)
const sampleCustomers = [
    { id: 'CUST-001', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+61 400 123 456' },
    { id: 'CUST-002', name: 'Michael Chen', email: 'm.chen@email.com', phone: '+61 400 234 567' },
    { id: 'CUST-003', name: 'Emma Wilson', email: 'emma.w@email.com', phone: '+61 400 345 678' },
    { id: 'CUST-004', name: 'James Taylor', email: 'j.taylor@email.com', phone: '+61 400 456 789' },
    { id: 'CUST-005', name: 'Lisa Garcia', email: 'lisa.g@email.com', phone: '+61 400 567 890' }
];

// State
let currentSession = null;
let currentClass = null;
let sessionIdFromUrl = null;
let selectedCustomer = null;
let customerQuotes = [];
let isStaffOverridden = false;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadSessionData();
});

function loadSessionData() {
    const urlParams = new URLSearchParams(window.location.search);
    sessionIdFromUrl = urlParams.get('id');
    
    if (!sessionIdFromUrl) {
        showNotification('Session ID is required', 'error');
        setTimeout(() => {
            window.location.href = 'class_list.html';
        }, 2000);
        return;
    }
    
    // Load session from localStorage
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        currentSession = sessions.find(s => s.id === sessionIdFromUrl);
        
        if (!currentSession) {
            showNotification('Session not found', 'error');
            setTimeout(() => {
                window.location.href = 'class_list.html';
            }, 2000);
            return;
        }
        
        // Load class data
        const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
        currentClass = classes.find(c => c.id === currentSession.classId);
        
        if (!currentClass) {
            showNotification('Class not found for this session', 'error');
            return;
        }
        
        // Check if staff is overridden
        isStaffOverridden = currentSession.staffOverride || false;
        
        // Render session details
        renderSessionDetails();
        renderStaffAssignment();
        renderEnrollment();
        renderBookings();
        renderNotes();
        updateSummary();
    } catch (error) {
        console.error('Error loading session:', error);
        showNotification('Error loading session data', 'error');
    }
}

function renderSessionDetails() {
    // Header
    document.getElementById('sessionIdBadge').textContent = currentSession.id;
    document.getElementById('sessionTitle').textContent = currentClass.name;
    
    const date = formatDate(new Date(currentSession.date));
    const time = currentSession.startTime && currentSession.endTime 
        ? `${currentSession.startTime} - ${currentSession.endTime}`
        : currentSession.startTime || '-';
    document.getElementById('sessionDateTime').textContent = `${date} at ${time}`;
    
    document.getElementById('classNameLink').textContent = currentClass.name;
    document.getElementById('classNameLink').href = `class_detail.html?id=${currentClass.id}`;
    
    // Status badge
    updateStatusBadge();
    
    // Session Information
    document.getElementById('displayDate').textContent = formatDate(new Date(currentSession.date));
    document.getElementById('displayTime').textContent = time;
    document.getElementById('displayDuration').textContent = currentSession.duration ? `${currentSession.duration} minutes` : '-';
    
    const statusEl = document.getElementById('displayStatus');
    const status = currentSession.status || 'scheduled';
    const statusConfig = {
        scheduled: { text: 'Scheduled', class: 'bg-blue-100 text-blue-700' },
        in_progress: { text: 'In Progress', class: 'bg-green-100 text-green-700' },
        completed: { text: 'Completed', class: 'bg-gray-100 text-gray-700' },
        cancelled: { text: 'Cancelled', class: 'bg-red-100 text-red-700' }
    };
    const config = statusConfig[status] || statusConfig.scheduled;
    statusEl.textContent = config.text;
    statusEl.className = `inline-block px-2 py-1 text-xs rounded ${config.class}`;
}

function updateStatusBadge() {
    const badge = document.getElementById('sessionStatusBadge');
    const status = currentSession.status || 'scheduled';
    
    const statusConfig = {
        scheduled: { text: 'Scheduled', class: 'bg-blue-100 text-blue-700' },
        in_progress: { text: 'In Progress', class: 'bg-green-100 text-green-700' },
        completed: { text: 'Completed', class: 'bg-gray-100 text-gray-700' },
        cancelled: { text: 'Cancelled', class: 'bg-red-100 text-red-700' }
    };
    
    const config = statusConfig[status] || statusConfig.scheduled;
    badge.textContent = config.text;
    badge.className = `px-2 py-1 text-xs rounded ${config.class}`;
}

function renderStaffAssignment() {
    const container = document.getElementById('staffAssignmentContent');
    
    // Get staff (overridden or default)
    const staff = isStaffOverridden && currentSession.assignedStaff 
        ? currentSession.assignedStaff 
        : currentClass.defaultStaff || [];
    
    if (staff.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-400">No staff assigned</p>';
        return;
    }
    
    let html = '';
    if (isStaffOverridden) {
        html += '<div class="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">';
        html += '<p class="text-xs text-orange-700 font-medium">⚠️ Staff Override Active</p>';
        html += '<p class="text-xs text-orange-600 mt-1">This session uses custom staff assignment</p>';
        html += '</div>';
    } else {
        html += '<div class="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">';
        html += '<p class="text-xs text-blue-700 font-medium">ℹ️ Using Default Staff</p>';
        html += '<p class="text-xs text-blue-600 mt-1">Inherited from class default assignment</p>';
        html += '</div>';
    }
    
    html += '<div class="space-y-2">';
    staff.forEach(staffMember => {
        const staffObj = typeof staffMember === 'string' 
            ? sampleStaff.find(s => s.name === staffMember || s.id === staffMember)
            : staffMember;
        
        if (staffObj) {
            const initials = staffObj.name.split(' ').map(n => n[0]).join('');
            html += `
                <div class="flex items-center gap-3 p-2 border border-gray-200 rounded-lg">
                    <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span class="text-xs font-semibold text-emerald-700">${initials}</span>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">${staffObj.name}</p>
                        <p class="text-xs text-gray-500">${staffObj.role} - ${staffObj.department}</p>
                    </div>
                </div>
            `;
        }
    });
    html += '</div>';
    
    container.innerHTML = html;
}

function renderEnrollment() {
    const maxCapacity = currentSession.maxCapacity || currentClass.maxCapacity || 0;
    const confirmedSlots = currentSession.confirmedSlots || 0;
    const availableSlots = Math.max(0, maxCapacity - confirmedSlots);
    const enrollmentPercent = maxCapacity > 0 ? Math.round((confirmedSlots / maxCapacity) * 100) : 0;
    
    // Capacity display
    document.getElementById('capacityDisplay').textContent = `${confirmedSlots} / ${maxCapacity}`;
    
    // Progress bar
    const progressBar = document.getElementById('capacityProgress');
    progressBar.style.width = `${enrollmentPercent}%`;
    if (enrollmentPercent >= 100) {
        progressBar.classList.remove('bg-emerald-500');
        progressBar.classList.add('bg-red-500');
    } else if (enrollmentPercent >= 80) {
        progressBar.classList.remove('bg-emerald-500');
        progressBar.classList.add('bg-orange-500');
    } else {
        progressBar.classList.remove('bg-red-500', 'bg-orange-500');
        progressBar.classList.add('bg-emerald-500');
    }
    
    // Stats
    document.getElementById('confirmedSlots').textContent = confirmedSlots;
    document.getElementById('availableSlots').textContent = availableSlots;
}

function renderBookings() {
    const container = document.getElementById('bookingsList');
    const emptyState = document.getElementById('emptyBookingsState');
    const bookings = currentSession.bookings || [];
    
    if (bookings.length === 0) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        document.getElementById('bookingsCount').textContent = '0 bookings';
        return;
    }
    
    container.classList.remove('hidden');
    emptyState.classList.add('hidden');
    document.getElementById('bookingsCount').textContent = `${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`;
    
    container.innerHTML = bookings.map(booking => {
        const statusConfig = {
            confirmed: { text: 'Confirmed', class: 'bg-green-100 text-green-700' },
            cancelled: { text: 'Cancelled', class: 'bg-gray-100 text-gray-700' }
        };
        const status = statusConfig[booking.status] || statusConfig.confirmed;
        
        return `
            <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <h4 class="font-semibold text-gray-900">${booking.customerName}</h4>
                        <span class="px-2 py-1 text-xs rounded ${status.class}">${status.text}</span>
                    </div>
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                        <span>Quote: ${booking.quoteId || '-'}</span>
                        <span>Slots: ${booking.slotsUsed || 1}</span>
                        ${booking.bookedAt ? `<span>Booked: ${formatDate(new Date(booking.bookedAt))}</span>` : ''}
                    </div>
                </div>
                <div class="flex gap-2">
                    <button 
                        onclick="viewCustomer('${booking.customerId}')"
                        class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                        View
                    </button>
                    <button 
                        onclick="cancelBooking('${booking.id}')"
                        class="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderNotes() {
    const notesContent = document.getElementById('notesContent');
    const notes = currentSession.notes || '';
    
    if (notes) {
        notesContent.textContent = notes;
    } else {
        notesContent.textContent = 'No notes added';
        notesContent.classList.add('text-gray-400');
    }
}

function updateSummary() {
    document.getElementById('summaryClassName').textContent = currentClass.name;
    document.getElementById('summaryCapacity').textContent = currentSession.maxCapacity || currentClass.maxCapacity || 0;
    document.getElementById('summaryEnrolled').textContent = currentSession.confirmedSlots || 0;
    document.getElementById('summaryAvailable').textContent = Math.max(0, (currentSession.maxCapacity || currentClass.maxCapacity || 0) - (currentSession.confirmedSlots || 0));
    
    const staff = isStaffOverridden && currentSession.assignedStaff 
        ? currentSession.assignedStaff 
        : currentClass.defaultStaff || [];
    document.getElementById('summaryStaff').textContent = `${staff.length} staff`;
}

// ==================== Staff Override ====================

function showStaffOverrideModal() {
    const modal = document.getElementById('staffOverrideModal');
    const container = document.getElementById('staffSelectionList');
    
    // Get current staff (overridden or default)
    const currentStaff = isStaffOverridden && currentSession.assignedStaff 
        ? currentSession.assignedStaff 
        : currentClass.defaultStaff || [];
    
    container.innerHTML = sampleStaff.map(staff => {
        const isSelected = currentStaff.some(s => {
            if (typeof s === 'string') {
                return s === staff.name || s === staff.id;
            }
            return s.id === staff.id || s.name === staff.name;
        });
        
        return `
            <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input type="checkbox" value="${staff.id}" ${isSelected ? 'checked' : ''} class="w-4 h-4 text-emerald-600 border-gray-300 rounded">
                <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">${staff.name}</p>
                    <p class="text-xs text-gray-500">${staff.role} - ${staff.department}</p>
                </div>
            </label>
        `;
    }).join('');
    
    modal.classList.remove('hidden');
}

function closeStaffOverrideModal() {
    document.getElementById('staffOverrideModal').classList.add('hidden');
}

function saveStaffOverride() {
    const selected = [];
    document.querySelectorAll('#staffSelectionList input[type="checkbox"]:checked').forEach(cb => {
        const staffId = cb.value;
        const staff = sampleStaff.find(s => s.id === staffId);
        if (staff) selected.push(staff);
    });
    
    if (selected.length === 0) {
        alert('Please select at least one staff member');
        return;
    }
    
    // Update session
    currentSession.assignedStaff = selected;
    currentSession.staffOverride = true;
    currentSession.updatedAt = new Date().toISOString();
    
    // Save to localStorage
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const index = sessions.findIndex(s => s.id === currentSession.id);
        if (index > -1) {
            sessions[index] = currentSession;
            localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
        }
    } catch (error) {
        console.error('Error saving staff override:', error);
        showNotification('Error saving staff override', 'error');
        return;
    }
    
    isStaffOverridden = true;
    renderStaffAssignment();
    updateSummary();
    closeStaffOverrideModal();
    showNotification('Staff override saved successfully', 'success');
}

function removeStaffOverride() {
    if (!confirm('Remove staff override and use default staff from class?')) {
        return;
    }
    
    // Remove override
    currentSession.staffOverride = false;
    currentSession.assignedStaff = currentClass.defaultStaff || [];
    currentSession.updatedAt = new Date().toISOString();
    
    // Save to localStorage
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const index = sessions.findIndex(s => s.id === currentSession.id);
        if (index > -1) {
            sessions[index] = currentSession;
            localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
        }
    } catch (error) {
        console.error('Error removing staff override:', error);
        showNotification('Error removing staff override', 'error');
        return;
    }
    
    isStaffOverridden = false;
    renderStaffAssignment();
    updateSummary();
    closeStaffOverrideModal();
    showNotification('Using default staff from class', 'success');
}

// ==================== Customer Booking ====================

function searchCustomers() {
    const query = document.getElementById('customerSearch').value.toLowerCase();
    const resultsContainer = document.getElementById('customerResults');
    
    if (!query) {
        resultsContainer.classList.add('hidden');
        return;
    }
    
    const filtered = sampleCustomers.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.email.toLowerCase().includes(query)
    );
    
    if (filtered.length === 0) {
        resultsContainer.innerHTML = '<p class="p-3 text-sm text-gray-500 text-center">No customers found</p>';
        resultsContainer.classList.remove('hidden');
        return;
    }
    
    resultsContainer.innerHTML = filtered.map(customer => `
        <button 
            onclick="selectCustomer('${customer.id}')"
            class="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
        >
            <p class="font-medium text-gray-900">${customer.name}</p>
            <p class="text-xs text-gray-500">${customer.email}</p>
        </button>
    `).join('');
    
    resultsContainer.classList.remove('hidden');
}

function selectCustomer(customerId) {
    selectedCustomer = sampleCustomers.find(c => c.id === customerId);
    if (!selectedCustomer) return;
    
    // Hide search results
    document.getElementById('customerResults').classList.add('hidden');
    document.getElementById('customerSearch').value = selectedCustomer.name;
    
    // Show customer info
    document.getElementById('selectedCustomerName').textContent = selectedCustomer.name;
    document.getElementById('selectedCustomerEmail').textContent = selectedCustomer.email;
    document.getElementById('selectedCustomerInfo').classList.remove('hidden');
    
    // Load customer quotes and slot inventory
    loadCustomerInventory();
}

function clearCustomerSelection() {
    selectedCustomer = null;
    document.getElementById('customerSearch').value = '';
    document.getElementById('selectedCustomerInfo').classList.add('hidden');
    document.getElementById('bookingForm').classList.add('hidden');
    customerQuotes = [];
}

function loadCustomerInventory() {
    if (!selectedCustomer || !currentClass.pricebookItemId) {
        return;
    }
    
    // In real app, fetch from API. For demo, simulate from quotes
    // Get quotes from localStorage (if available) or use mock data
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    
    // Filter quotes for this customer and pricebook item
    const relevantQuotes = quotes.filter(q => 
        q.customerId === selectedCustomer.id && 
        q.items && q.items.some(item => item.pricebookItemId === currentClass.pricebookItemId)
    );
    
    // Calculate total slots
    let totalSlots = 0;
    let usedSlots = 0;
    
    relevantQuotes.forEach(quote => {
        quote.items.forEach(item => {
            if (item.pricebookItemId === currentClass.pricebookItemId) {
                totalSlots += item.quantity || 0;
            }
        });
    });
    
    // Count used slots from bookings
    const allSessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
    allSessions.forEach(session => {
        if (session.classId === currentClass.id) {
            (session.bookings || []).forEach(booking => {
                if (booking.customerId === selectedCustomer.id && booking.status === 'confirmed') {
                    usedSlots += booking.slotsUsed || 1;
                }
            });
        }
    });
    
    const remainingSlots = totalSlots - usedSlots;
    
    // Display
    document.getElementById('remainingSlots').textContent = remainingSlots;
    
    // Quote breakdown
    if (relevantQuotes.length > 0) {
        const breakdown = relevantQuotes.map(q => 
            `Quote ${q.id}: ${q.items.find(i => i.pricebookItemId === currentClass.pricebookItemId)?.quantity || 0} slots`
        ).join(', ');
        document.getElementById('quoteBreakdown').innerHTML = `<p class="mt-2">${breakdown}</p>`;
    } else {
        document.getElementById('quoteBreakdown').innerHTML = '<p class="mt-2 text-orange-600">No quotes found for this customer</p>';
    }
    
    // Show booking form
    customerQuotes = relevantQuotes;
    renderQuoteSelection();
    document.getElementById('bookingForm').classList.remove('hidden');
    
    // Enable/disable book button
    const bookButton = document.getElementById('bookButton');
    if (remainingSlots <= 0) {
        bookButton.disabled = true;
        bookButton.textContent = 'No Slots Available';
        bookButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        bookButton.disabled = false;
        bookButton.textContent = 'Book Customer';
        bookButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

function renderQuoteSelection() {
    const select = document.getElementById('quoteSelection');
    select.innerHTML = '<option value="">Select a quote</option>';
    
    customerQuotes.forEach(quote => {
        const item = quote.items.find(i => i.pricebookItemId === currentClass.pricebookItemId);
        if (item) {
            const option = document.createElement('option');
            option.value = quote.id;
            option.textContent = `${quote.id} - ${item.quantity || 0} slots`;
            select.appendChild(option);
        }
    });
}

function bookCustomer() {
    if (!selectedCustomer) {
        alert('Please select a customer');
        return;
    }
    
    const quoteId = document.getElementById('quoteSelection').value;
    const slotsToBook = parseInt(document.getElementById('slotsToBook').value) || 1;
    
    if (!quoteId) {
        alert('Please select a quote');
        return;
    }
    
    // Check capacity
    const maxCapacity = currentSession.maxCapacity || currentClass.maxCapacity || 0;
    const confirmedSlots = currentSession.confirmedSlots || 0;
    const availableSlots = maxCapacity - confirmedSlots;
    
    if (slotsToBook > availableSlots) {
        alert(`Only ${availableSlots} slots available.`);
        return;
    }
    
    // Create booking
    const booking = {
        id: `BOOKING-${Date.now()}`,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        customerEmail: selectedCustomer.email,
        quoteId: quoteId,
        slotsUsed: slotsToBook,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
    };
    
    // Add to session bookings
    if (!currentSession.bookings) {
        currentSession.bookings = [];
    }
    currentSession.bookings.push(booking);
    
    // Update session stats
    currentSession.confirmedSlots = (currentSession.confirmedSlots || 0) + slotsToBook;
    
    currentSession.updatedAt = new Date().toISOString();
    
    // Save to localStorage
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const index = sessions.findIndex(s => s.id === currentSession.id);
        if (index > -1) {
            sessions[index] = currentSession;
            localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
        }
    } catch (error) {
        console.error('Error saving booking:', error);
        showNotification('Error saving booking', 'error');
        return;
    }
    
    // Refresh display
    renderBookings();
    renderEnrollment();
    updateSummary();
    
    // Clear form
    clearCustomerSelection();
    
    showNotification('Customer booked successfully', 'success');
}

function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    const booking = currentSession.bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Remove booking
    currentSession.bookings = currentSession.bookings.filter(b => b.id !== bookingId);
    
    // Update stats
    if (booking.status === 'confirmed') {
        currentSession.confirmedSlots = Math.max(0, (currentSession.confirmedSlots || 0) - (booking.slotsUsed || 1));
    } else {
    }
    
    currentSession.updatedAt = new Date().toISOString();
    
    // Save to localStorage
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const index = sessions.findIndex(s => s.id === currentSession.id);
        if (index > -1) {
            sessions[index] = currentSession;
            localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        showNotification('Error cancelling booking', 'error');
        return;
    }
    
    renderBookings();
    renderEnrollment();
    updateSummary();
    showNotification('Booking cancelled successfully', 'success');
}

// ==================== Notes ====================

function editNotes() {
    document.getElementById('notesDisplay').classList.add('hidden');
    document.getElementById('notesEdit').classList.remove('hidden');
    document.getElementById('notesInput').value = currentSession.notes || '';
}

function cancelEditNotes() {
    document.getElementById('notesDisplay').classList.remove('hidden');
    document.getElementById('notesEdit').classList.add('hidden');
}

function saveNotes() {
    const notes = document.getElementById('notesInput').value.trim();
    currentSession.notes = notes;
    currentSession.updatedAt = new Date().toISOString();
    
    // Save to localStorage
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const index = sessions.findIndex(s => s.id === currentSession.id);
        if (index > -1) {
            sessions[index] = currentSession;
            localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
        }
    } catch (error) {
        console.error('Error saving notes:', error);
        showNotification('Error saving notes', 'error');
        return;
    }
    
    renderNotes();
    cancelEditNotes();
    showNotification('Notes saved successfully', 'success');
}

// ==================== Actions ====================

function editSession() {
    window.location.href = `session_create.html?editId=${currentSession.id}`;
}

function cancelSession() {
    if (!confirm('Are you sure you want to cancel this session? All bookings will be cancelled.')) {
        return;
    }
    
    currentSession.status = 'cancelled';
    currentSession.updatedAt = new Date().toISOString();
    
    // Cancel all bookings
    if (currentSession.bookings) {
        currentSession.bookings.forEach(booking => {
            booking.status = 'cancelled';
        });
    }
    
    // Save to localStorage
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const index = sessions.findIndex(s => s.id === currentSession.id);
        if (index > -1) {
            sessions[index] = currentSession;
            localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
        }
    } catch (error) {
        console.error('Error cancelling session:', error);
        showNotification('Error cancelling session', 'error');
        return;
    }
    
    renderSessionDetails();
    renderBookings();
    showNotification('Session cancelled successfully', 'success');
}

function goBack() {
    if (currentClass) {
        window.location.href = `class_detail.html?id=${currentClass.id}`;
    } else {
        window.location.href = 'class_list.html';
    }
}

function viewClassDetail() {
    if (currentClass) {
        window.location.href = `class_detail.html?id=${currentClass.id}`;
    }
}

function viewAllSessions() {
    if (currentClass) {
        window.location.href = `session_list.html?classId=${currentClass.id}`;
    } else {
        window.location.href = 'session_list.html';
    }
}

function viewCustomerInventory() {
    window.location.href = 'customer_inventory.html';
}

function viewCustomer(customerId) {
    // In real app, navigate to customer detail page
    showNotification('Customer detail page coming soon', 'info');
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

function showNotification(message, type = 'info') {
    const container = document.createElement('div');
    container.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' :
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

