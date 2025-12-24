// Manage Team List Page Script
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const staffTable = document.getElementById('staffTable');
    const exportBtn = document.getElementById('exportBtn');

    const StaffStore = window.FMSStaffStore;
    if (!StaffStore) {
        console.error('FMSStaffStore not found. Did you include staff_store.js?');
    }

    // Ensure store exists (non-breaking seed from samples if empty)
    StaffStore?.ensureStaffSeededFromSamples?.();

    // Load staff from source of truth
    let staffData = StaffStore?.loadStaff?.() || [];

    // Current logged-in user ID (in production, this would come from session/auth)
    const currentUserId = StaffStore?.getCurrentUserStaffId?.() || null;

    // Mask email function
    function maskEmail(email) {
        const [username, domain] = email.split('@');
        if (username.length <= 2) return email;
        const visibleChars = 2;
        const masked = username.substring(0, visibleChars) + '*'.repeat(username.length - visibleChars);
        return masked + '@' + domain;
    }

    // Mask phone function
    function maskPhone(phone) {
        // Keep first 3 and last 4 digits, mask the rest
        const digits = phone.replace(/\D/g, '');
        if (digits.length <= 7) return phone;
        const masked = phone.substring(0, 6) + '*'.repeat(digits.length - 7) + phone.substring(phone.length - 4);
        return masked;
    }

    // Filter staff based on search and filters
    function filterStaff() {
        const searchTerm = searchInput.value.toLowerCase();
        const contactValue = roleFilter.value.toLowerCase();
        const statusValue = statusFilter.value;

        const filteredData = staffData.filter(staff => {
            // Search by name, role, and status
            const matchesSearch = `${staff.firstName} ${staff.lastName} ${staff.role} ${staff.status}`.toLowerCase().includes(searchTerm);
            // Search by contact (email and phone)
            const matchesContact = !contactValue || staff.email.toLowerCase().includes(contactValue) || staff.phone.toLowerCase().includes(contactValue);
            const matchesStatus = !statusValue || staff.status === statusValue;
            return matchesSearch && matchesContact && matchesStatus;
        });

        renderStaffTable(filteredData);
    }

    // Render staff table
    function renderStaffTable(data) {
        const tbody = staffTable.querySelector('tbody');
        tbody.innerHTML = '';

        if (data.length === 0) {
            document.getElementById('emptyState').style.display = 'block';
            return;
        }

        document.getElementById('emptyState').style.display = 'none';

        data.forEach(staff => {
            const row = document.createElement('tr');
            const statusClass = staff.status === 'active' ? 'status-active' : 'status-inactive';
            const statusText = staff.status.charAt(0).toUpperCase() + staff.status.slice(1);
            const actionBtn = staff.status === 'active' ? 'delete-btn' : 'activate-btn';
            const actionText = staff.status === 'active' ? 'Deactivate' : 'Reactivate';
            const isCurrentUser = (currentUserId && staff.id === currentUserId) || Boolean(staff.isCurrentUser);
            const isOwner = staff.isOwner || staff.role === 'Franchise Owner';
            
            // Apply grey background to current user's row and owner's row
            if (isCurrentUser || isOwner) {
                row.style.backgroundColor = '#f9fafb';
            }
            
            // Role badge styling
            let roleBadgeStyle;
            if (staff.role === 'Franchise Owner') {
                roleBadgeStyle = 'background:#e9d5ff; color:#6b21a8;';
            } else if (staff.role === 'Manager') {
                roleBadgeStyle = 'background:#dbeafe; color:#1e40af;';
            } else {
                roleBadgeStyle = 'background:#f3f4f6; color:#374151;';
            }
            
            // Current user indicator
            const userIndicator = isCurrentUser 
                ? '<span style="background:#dcfce7; color:#166534; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:600; margin-left:8px;">YOU</span>' 
                : '';
            
            // Action buttons - show nothing for current user and owner, full actions for others
            const actionButtons = (isCurrentUser || isOwner)
                ? '<span style="color:#9ca3af; font-size:13px; font-style:italic;">—</span>' 
                : `<button class="btn-link" onclick="window.location.href='manage-team-detail.html?id=${encodeURIComponent(staff.id)}'">View</button><button class="btn-link" onclick="window.location.href='manage-team-edit.html?id=${encodeURIComponent(staff.id)}'">Edit</button><button class="btn-link ${actionBtn}" data-id="${staff.id}">${actionText}</button>`;

            row.innerHTML = `
                <td>${staff.firstName} ${staff.lastName}${userIndicator}</td>
                <td><span style="${roleBadgeStyle} padding:4px 8px; border-radius:4px; font-size:13px; font-weight:500;">${staff.role}</span></td>
                <td>${staff.jobTitle || '-'}</td>
                <td>${maskEmail(staff.email)}</td>
                <td>${maskPhone(staff.phone)}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td class="staff-actions">
                    ${actionButtons}
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Event listeners
    searchInput.addEventListener('input', filterStaff);
    roleFilter.addEventListener('input', filterStaff);
    statusFilter.addEventListener('change', filterStaff);

    // Export functionality
    exportBtn.addEventListener('click', function() {
        // Simple CSV export
        const headers = ['Name', 'Role', 'Job Title', 'Email', 'Phone', 'Status'];
        const csvContent = [
            headers.join(','),
            ...staffData.map(staff =>
                [`"${staff.firstName} ${staff.lastName}"`, staff.role, `"${staff.jobTitle || ''}"`, staff.email, staff.phone, staff.status].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'staff-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    });

    // Handle deactivate/reactivate
    staffTable.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn') || e.target.classList.contains('activate-btn')) {
            const staffId = e.target.dataset.id;
            // Reload latest in case another page updated data
            staffData = StaffStore?.loadStaff?.() || staffData;
            const staff = staffData.find(s => String(s.id) === String(staffId));
            if (staff) {
                const action = staff.status === 'active' ? 'deactivate' : 'reactivate';
                if (confirm(`Are you sure you want to ${action} ${staff.firstName} ${staff.lastName}?`)) {
                    staff.status = staff.status === 'active' ? 'inactive' : 'active';
                    StaffStore?.saveStaff?.(staffData);
                    filterStaff(); // Re-render with updated data
                }
            }
        }
    });

    // Set default status filter to active
    statusFilter.value = 'active';
    
    // Initial render with active filter
    filterStaff();
});