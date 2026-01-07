document.addEventListener('DOMContentLoaded', () => {
    // --- State --- //
    const state = {
        startDate: '',
        endDate: '',
        searchTerm: ''
    };

    // --- Elements --- //
    const tableBody = document.getElementById('overview-table-body');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');
    const startDateInput = document.getElementById('filter-start-date');
    const endDateInput = document.getElementById('filter-end-date');
    const btnApplyFilters = document.getElementById('btn-apply-filters');
    const btnExport = document.getElementById('btn-export');

    // Stats Elements
    const totalHoursEl = document.getElementById('total-hours');
    const pendingHoursEl = document.getElementById('pending-hours');
    const approvedHoursEl = document.getElementById('approved-hours');
    const activeStaffEl = document.getElementById('active-staff');

    // --- Initialization --- //
    init();

    function init() {
        setDefaultDates();
        setupEventListeners();
        render();
    }

    function setDefaultDates() {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        state.startDate = start.toISOString().split('T')[0];
        state.endDate = end.toISOString().split('T')[0];

        startDateInput.value = state.startDate;
        endDateInput.value = state.endDate;
    }

    function setupEventListeners() {
        searchInput.addEventListener('input', (e) => {
            state.searchTerm = e.target.value.toLowerCase();
            render();
        });

        startDateInput.addEventListener('change', (e) => {
            state.startDate = e.target.value;
        });

        endDateInput.addEventListener('change', (e) => {
            state.endDate = e.target.value;
        });

        btnApplyFilters.addEventListener('click', () => {
            render();
        });

        btnExport.addEventListener('click', handleExport);
    }

    // --- Rendering --- //
    function render() {
        loadingState.classList.remove('hidden');
        emptyState.classList.add('hidden');
        tableBody.innerHTML = '';

        // Get all timesheets
        const allTimesheets = window.timesheetService.filterTimesheets({
            startDate: state.startDate,
            endDate: state.endDate,
            staffId: 'all',
            status: 'all'
        });

        // Group by staff
        const staffMap = new Map();
        const allStaff = window.timesheetService.getStaff();

        allStaff.forEach(staff => {
            staffMap.set(staff.id, {
                id: staff.id,
                name: staff.name,
                role: staff.role,
                pending: 0,
                approved: 0,
                declined: 0,
                total: 0,
                entries: 0
            });
        });

        // Aggregate hours
        allTimesheets.forEach(entry => {
            if (staffMap.has(entry.staffId)) {
                const staff = staffMap.get(entry.staffId);
                const hours = entry.finalHours !== undefined && entry.finalHours !== null ? entry.finalHours : entry.actualHours;

                staff.total += hours;
                staff.entries++;

                if (entry.status === 'Pending') {
                    staff.pending += hours;
                } else if (entry.status === 'Approved') {
                    staff.approved += hours;
                } else if (entry.status === 'Declined') {
                    staff.declined += hours;
                }
            }
        });

        // Filter by search term and only show staff with entries
        let staffData = Array.from(staffMap.values())
            .filter(staff => staff.entries > 0)
            .filter(staff => {
                if (!state.searchTerm) return true;
                return staff.name.toLowerCase().includes(state.searchTerm) ||
                    staff.role.toLowerCase().includes(state.searchTerm);
            })
            .sort((a, b) => b.total - a.total); // Sort by total hours descending

        // Calculate overall stats
        const totalHours = staffData.reduce((sum, staff) => sum + staff.total, 0);
        const pendingHours = staffData.reduce((sum, staff) => sum + staff.pending, 0);
        const approvedHours = staffData.reduce((sum, staff) => sum + staff.approved, 0);
        const activeStaff = staffData.length;

        // Update stats
        totalHoursEl.textContent = `${totalHours.toFixed(1)}h`;
        pendingHoursEl.textContent = `${pendingHours.toFixed(1)}h`;
        approvedHoursEl.textContent = `${approvedHours.toFixed(1)}h`;
        activeStaffEl.textContent = activeStaff;

        if (staffData.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            staffData.forEach(staff => {
                tableBody.appendChild(createRow(staff));
            });
        }

        loadingState.classList.add('hidden');
    }

    function createRow(staff) {
        const div = document.createElement('div');
        div.className = 'staff-row list-row grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors';
        div.onclick = () => viewStaffDetails(staff.id, staff.name);

        div.innerHTML = `
            <div class="col-span-4 flex items-center gap-3">
                <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-sm font-bold flex-shrink-0">
                    ${getInitials(staff.name)}
                </div>
                <div class="min-w-0">
                    <div class="text-sm font-semibold text-slate-900">${staff.name}</div>
                    <div class="text-xs text-slate-500">${staff.role} • ${staff.entries} entries</div>
                </div>
            </div>

            <div class="col-span-2 text-right">
                <div class="text-base font-bold text-amber-600">${staff.pending.toFixed(1)}h</div>
            </div>

            <div class="col-span-2 text-right">
                <div class="text-base font-bold text-emerald-600">${staff.approved.toFixed(1)}h</div>
            </div>

            <div class="col-span-2 text-right">
                <div class="text-base font-bold text-red-600">${staff.declined.toFixed(1)}h</div>
            </div>

            <div class="col-span-2 text-right">
                <div class="text-lg font-bold text-slate-900">${staff.total.toFixed(1)}h</div>
            </div>
        `;

        return div;
    }

    // --- Helper Functions --- //
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    function viewStaffDetails(staffId, staffName) {
        // Redirect to timesheet manager with staff filter pre-applied
        window.location.href = `timesheet_manager_inbox.html?staff=${staffId}&name=${encodeURIComponent(staffName)}`;
    }

    function handleExport() {
        const allTimesheets = window.timesheetService.filterTimesheets({
            startDate: state.startDate,
            endDate: state.endDate,
            staffId: 'all',
            status: 'all'
        });

        const csv = window.timesheetService.exportToCSV(allTimesheets);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `timesheet_overview_${state.startDate}_to_${state.endDate}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
});
