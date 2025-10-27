// Manage Team List Page Script
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    const staffTable = document.getElementById('staffTable');
    const exportBtn = document.getElementById('exportBtn');

    // Current logged-in user ID (in production, this would come from session/auth)
    const currentUserId = 1; // John Smith is the current logged-in user

    // Sample staff data
    let staffData = [
        { id: 0, firstName: 'Robert', lastName: 'Anderson', role: 'Franchise Owner', jobTitle: 'Franchise Owner', email: 'robert.anderson@store.com', phone: '+1 234 567 8900', status: 'active', isOwner: true },
        { id: 1, firstName: 'John', lastName: 'Smith', role: 'Manager', jobTitle: 'Store Manager', email: 'john.smith@store.com', phone: '+1 234 567 8901', status: 'active', isCurrentUser: true },
        { id: 2, firstName: 'Sarah', lastName: 'Johnson', role: 'Staff', jobTitle: 'Senior HVAC Technician', email: 'sarah.johnson@store.com', phone: '+1 234 567 8902', status: 'active' },
        { id: 3, firstName: 'Mike', lastName: 'Davis', role: 'Staff', jobTitle: 'HVAC Technician', email: 'mike.davis@store.com', phone: '+1 234 567 8903', status: 'active' },
        { id: 4, firstName: 'Emily', lastName: 'Wilson', role: 'Staff', jobTitle: 'Lead Receptionist', email: 'emily.wilson@store.com', phone: '+1 234 567 8904', status: 'inactive' }
    ];

    // Filter staff based on search and filters
    function filterStaff() {
        const searchTerm = searchInput.value.toLowerCase();
        const roleValue = roleFilter.value;
        const statusValue = statusFilter.value;

        const filteredData = staffData.filter(staff => {
            const matchesSearch = `${staff.firstName} ${staff.lastName} ${staff.email} ${staff.phone}`.toLowerCase().includes(searchTerm);
            const matchesRole = !roleValue || staff.role.toLowerCase().includes(roleValue.toLowerCase()) || (staff.jobTitle && staff.jobTitle.toLowerCase().includes(roleValue.toLowerCase()));
            const matchesStatus = !statusValue || staff.status === statusValue;
            return matchesSearch && matchesRole && matchesStatus;
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
            const isCurrentUser = staff.id === currentUserId;
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
                : `<button class="btn-link" onclick="window.location.href='manage-team-detail.html?id=${staff.id}'">View</button><button class="btn-link" onclick="window.location.href='manage-team-edit.html?id=${staff.id}'">Edit</button><button class="btn-link ${actionBtn}" data-id="${staff.id}">${actionText}</button>`;

            row.innerHTML = `
                <td>${staff.firstName} ${staff.lastName}${userIndicator}</td>
                <td><span style="${roleBadgeStyle} padding:4px 8px; border-radius:4px; font-size:13px; font-weight:500;">${staff.role}</span></td>
                <td>${staff.jobTitle || '-'}</td>
                <td>${staff.email}</td>
                <td>${staff.phone}</td>
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
            const staffId = parseInt(e.target.dataset.id);
            const staff = staffData.find(s => s.id === staffId);
            if (staff) {
                const action = staff.status === 'active' ? 'deactivate' : 'reactivate';
                if (confirm(`Are you sure you want to ${action} ${staff.firstName} ${staff.lastName}?`)) {
                    staff.status = staff.status === 'active' ? 'inactive' : 'active';
                    filterStaff(); // Re-render with updated data
                }
            }
        }
    });

    // Initial render
    renderStaffTable(staffData);
});