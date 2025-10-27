// Manage Team Detail Page Script
document.addEventListener('DOMContentLoaded', function() {
    const printBtn = document.getElementById('printBtn');
    const exportBtn = document.getElementById('exportBtn');

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

    // Load staff data (in a real app, this would come from an API based on URL parameter)
    function loadStaffData() {
        // Get staff ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const staffId = urlParams.get('id');

        if (staffId) {
            // In a real app, fetch data from API
            // For demo, data is already populated in HTML
            console.log('Loading data for staff ID:', staffId);
        }
    }

    // Initialize
    loadStaffData();
});