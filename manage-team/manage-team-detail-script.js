// Manage Team Detail Page Script
document.addEventListener('DOMContentLoaded', function() {
    const printBtn = document.getElementById('printBtn');
    const exportBtn = document.getElementById('exportBtn');
    const StaffStore = window.FMSStaffStore;
    StaffStore?.ensureStaffSeededFromSamples?.();

    // Print functionality
    printBtn.addEventListener('click', function() {
        window.print();
    });

    // Export functionality
    exportBtn.addEventListener('click', function() {
        const staffData = {
            name: document.getElementById('staffName').textContent,
            role: document.getElementById('staffRole').textContent,
            email: document.getElementById('email').textContent,
            phone: document.getElementById('phone').textContent,
            dateOfBirth: document.getElementById('dateOfBirth').textContent,
            employeeId: document.getElementById('employeeId').textContent,
            startDate: document.getElementById('startDate').textContent,
            employmentType: document.getElementById('employmentType').textContent,
            hourlyRate: document.getElementById('hourlyRate').textContent,
            roleTitle: document.getElementById('role').textContent
        };

        // Create CSV content
        const csvContent = [
            'Field,Value',
            `Name,"${staffData.name}"`,
            `Role,"${staffData.role}"`,
            `Email,"${staffData.email}"`,
            `Phone,"${staffData.phone}"`,
            `Date of Birth,"${staffData.dateOfBirth}"`,
            `Employee ID,"${staffData.employeeId}"`,
            `Start Date,"${staffData.startDate}"`,
            `Employment Type,"${staffData.employmentType}"`,
            `Hourly Rate,"${staffData.hourlyRate}"`,
            `Role,"${staffData.roleTitle}"`
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${staffData.name.replace(' ', '_')}_details.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    });

    function formatDate(value) {
        if (!value) return '-';
        // ISO date: YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const d = new Date(value + 'T00:00:00');
            if (!Number.isNaN(d.getTime())) return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        }
        return value;
    }

    function formatMoney(value) {
        const n = Number(value);
        if (Number.isNaN(n)) return '-';
        return `$${n.toFixed(2)}`;
    }

    function loadStaffData() {
        const urlParams = new URLSearchParams(window.location.search);
        const staffId = urlParams.get('id');
        if (!staffId) {
            window.location.href = 'manage-team.html';
            return;
        }

        const staffList = StaffStore?.loadStaff?.() || [];
        const staff = StaffStore?.findStaffByIdOrLegacy?.(staffList, staffId);
        if (!staff) {
            alert('Staff member not found.');
            window.location.href = 'manage-team.html';
            return;
        }

        // Update "Edit Staff" link in actions bar
        const editLink = document.querySelector('.actions-bar a[href^="manage-team-edit.html"]');
        if (editLink) editLink.href = `manage-team-edit.html?id=${encodeURIComponent(staff.id)}`;

        // Header
        const staffName = staff.name || `${staff.firstName || ''} ${staff.lastName || ''}`.trim();
        const staffNameEl = document.getElementById('staffName');
        if (staffNameEl) staffNameEl.textContent = staffName || '-';

        const staffRoleEl = document.getElementById('staffRole');
        if (staffRoleEl) staffRoleEl.textContent = staff.jobTitle || staff.role || '-';

        const statusEl = document.getElementById('staffStatus');
        if (statusEl) {
            const isActive = staff.status === 'active';
            statusEl.textContent = isActive ? 'Active' : 'Inactive';
            statusEl.classList.remove('status-active', 'status-inactive');
            statusEl.classList.add(isActive ? 'status-active' : 'status-inactive');
        }

        // Personal section
        const firstNameEl = document.getElementById('firstName');
        if (firstNameEl) firstNameEl.textContent = staff.firstName || '-';
        const lastNameEl = document.getElementById('lastName');
        if (lastNameEl) lastNameEl.textContent = staff.lastName || '-';
        const emailEl = document.getElementById('email');
        if (emailEl) emailEl.textContent = staff.email || '-';
        const phoneEl = document.getElementById('phone');
        if (phoneEl) phoneEl.textContent = staff.phone || '-';
        const dobEl = document.getElementById('dateOfBirth');
        if (dobEl) dobEl.textContent = formatDate(staff.dateOfBirth);

        // Employment section
        const employeeIdEl = document.getElementById('employeeId');
        if (employeeIdEl) employeeIdEl.textContent = staff.employeeId || '-';
        const startDateEl = document.getElementById('startDate');
        if (startDateEl) startDateEl.textContent = formatDate(staff.startDate);
        const employmentTypeEl = document.getElementById('employmentType');
        if (employmentTypeEl) employmentTypeEl.textContent = staff.employmentType || '-';
        const hourlyRateEl = document.getElementById('hourlyRate');
        if (hourlyRateEl) {
            hourlyRateEl.textContent =
                staff.hourlyRateOverride !== undefined ? `${formatMoney(staff.hourlyRateOverride)}/hr` : '-';
        }
        const roleEl = document.getElementById('role');
        if (roleEl) roleEl.textContent = staff.role || '-';
    }

    loadStaffData();
});