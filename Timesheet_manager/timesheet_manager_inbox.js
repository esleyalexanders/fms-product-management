
document.addEventListener('DOMContentLoaded', () => {
    // --- State --- //
    const state = {
        period: 'month',
        startDate: '',
        endDate: '',
        staffIds: [], // Changed to array for multi-select
        status: 'all'
    };

    // --- Elements --- //
    const tableBody = document.getElementById('timesheet-table-body');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const statusSelect = document.getElementById('filter-status');
    const startDateInput = document.getElementById('filter-start-date');
    const endDateInput = document.getElementById('filter-end-date');
    const periodButtons = document.querySelectorAll('.period-btn');

    // Multi-select elements
    const staffMultiselectTrigger = document.getElementById('staff-multiselect-trigger');
    const staffMultiselectPanel = document.getElementById('staff-multiselect-panel');
    const staffMultiselectLabel = document.getElementById('staff-multiselect-label');
    const staffSearchInput = document.getElementById('staff-search-input');
    const staffSelectAll = document.getElementById('staff-select-all');
    const staffOptionsList = document.getElementById('staff-options-list');

    // Stats Elements
    const pendingCountEl = document.getElementById('pending-count');
    const totalPayableEl = document.getElementById('total-payable');
    const alertCountEl = document.getElementById('alert-count');
    const totalEntriesEl = document.getElementById('total-entries');
    const btnExport = document.getElementById('btn-export');

    // Multi-select state
    let selectedStaffIds = [];
    let allStaff = [];

    // --- Initialization --- //
    init();

    function init() {
        allStaff = window.timesheetService.getStaff();
        populateStaffOptions();
        setPeriod('month'); // Default
        setupEventListeners();
        render();
    }

    function populateStaffOptions() {
        staffOptionsList.innerHTML = '';
        allStaff.forEach(person => {
            const label = document.createElement('label');
            label.className = 'flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors staff-option';
            label.dataset.staffId = person.id;
            label.dataset.staffName = person.name.toLowerCase();

            label.innerHTML = `
                <input type="checkbox" value="${person.id}" class="staff-checkbox w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500">
                <div class="flex items-center gap-2 flex-1">
                    <div class="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xs font-bold">
                        ${person.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                        <div class="text-sm font-medium text-slate-900">${person.name}</div>
                        <div class="text-xs text-slate-500">${person.role}</div>
                    </div>
                </div>
            `;

            staffOptionsList.appendChild(label);
        });
    }

    function setupEventListeners() {
        // Multi-select trigger
        staffMultiselectTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            staffMultiselectPanel.classList.toggle('hidden');
            if (!staffMultiselectPanel.classList.contains('hidden')) {
                staffSearchInput.focus();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!document.getElementById('staff-multiselect-container').contains(e.target)) {
                staffMultiselectPanel.classList.add('hidden');
            }
        });

        // Search functionality
        staffSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const options = staffOptionsList.querySelectorAll('.staff-option');

            options.forEach(option => {
                const staffName = option.dataset.staffName;
                if (staffName.includes(searchTerm)) {
                    option.classList.remove('hidden');
                } else {
                    option.classList.add('hidden');
                }
            });
        });

        // Select All functionality
        staffSelectAll.addEventListener('change', (e) => {
            const checkboxes = staffOptionsList.querySelectorAll('.staff-checkbox:not([disabled])');
            const visibleCheckboxes = Array.from(checkboxes).filter(cb => !cb.closest('.staff-option').classList.contains('hidden'));

            visibleCheckboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });

        // Update Select All state when individual checkboxes change
        staffOptionsList.addEventListener('change', () => {
            const checkboxes = staffOptionsList.querySelectorAll('.staff-checkbox');
            const checkedCount = staffOptionsList.querySelectorAll('.staff-checkbox:checked').length;
            staffSelectAll.checked = checkedCount === checkboxes.length;
            staffSelectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
        });

        // Period Selectors
        periodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                periodButtons.forEach(b => {
                    b.classList.remove('bg-indigo-600', 'text-white');
                    b.classList.add('text-slate-600', 'hover:bg-slate-100');
                });

                e.target.classList.remove('text-slate-600', 'hover:bg-slate-100');
                e.target.classList.add('bg-indigo-600', 'text-white');

                setPeriod(e.target.dataset.period);
                render();
            });
        });

        // Manual Date Changes
        startDateInput.addEventListener('change', (e) => {
            state.startDate = e.target.value;
            render();
        });
        endDateInput.addEventListener('change', (e) => {
            state.endDate = e.target.value;
            render();
        });

        // Status Filter
        statusSelect.addEventListener('change', (e) => {
            state.status = e.target.value;
            render();
        });

        // Export
        btnExport.addEventListener('click', handleExport);
    }

    // Multi-select functions
    window.applyStaffSelection = () => {
        const checkboxes = staffOptionsList.querySelectorAll('.staff-checkbox:checked');
        selectedStaffIds = Array.from(checkboxes).map(cb => cb.value);
        state.staffIds = selectedStaffIds;

        updateStaffLabel();
        staffMultiselectPanel.classList.add('hidden');
        render();
    };

    window.clearStaffSelection = () => {
        const checkboxes = staffOptionsList.querySelectorAll('.staff-checkbox');
        checkboxes.forEach(cb => cb.checked = false);
        staffSelectAll.checked = false;
        selectedStaffIds = [];
        state.staffIds = [];

        updateStaffLabel();
        staffMultiselectPanel.classList.add('hidden');
        render();
    };

    function updateStaffLabel() {
        if (selectedStaffIds.length === 0) {
            staffMultiselectLabel.textContent = 'All Staff';
        } else if (selectedStaffIds.length === 1) {
            const staff = allStaff.find(s => s.id === selectedStaffIds[0]);
            staffMultiselectLabel.textContent = staff ? staff.name : 'All Staff';
        } else {
            staffMultiselectLabel.textContent = `${selectedStaffIds.length} Staff Selected`;
        }
    }

    // --- Date Logic --- //
    function setPeriod(period) {
        state.period = period;
        const now = new Date();
        let start = new Date();
        let end = new Date();

        switch (period) {
            case 'today':
                break;
            case 'week':
                const day = now.getDay() || 7;
                if (day !== 1) start.setHours(-24 * (day - 1));
                end.setDate(start.getDate() + 6);
                break;
            case 'month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'quarter':
                const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
                start = new Date(now.getFullYear(), quarterMonth, 1);
                end = new Date(now.getFullYear(), quarterMonth + 3, 0);
                break;
            case 'year':
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear(), 11, 31);
                break;
        }

        state.startDate = start.toISOString().split('T')[0];
        state.endDate = end.toISOString().split('T')[0];

        startDateInput.value = state.startDate;
        endDateInput.value = state.endDate;
    }

    // --- Rendering --- //
    function render() {
        loadingState.classList.remove('hidden');
        emptyState.classList.add('hidden');
        tableBody.innerHTML = '';

        // Get all data first
        let data = window.timesheetService.filterTimesheets({
            startDate: state.startDate,
            endDate: state.endDate,
            status: state.status
        });

        // Apply multi-staff filter
        if (state.staffIds.length > 0) {
            data = data.filter(item => state.staffIds.includes(item.staffId));
        }

        const pendingCount = data.filter(i => i.status === 'Pending').length;
        const totalPay = data.reduce((sum, item) => {
            const hours = item.finalHours !== undefined && item.finalHours !== null ? item.finalHours : item.actualHours;
            return sum + (hours * item.hourlyRate);
        }, 0);

        const alertCount = data.filter(i => i.actualHours !== i.estimatedHours).length;

        if (data.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            data.forEach(item => {
                tableBody.appendChild(createRow(item));
            });
        }

        pendingCountEl.textContent = pendingCount;
        totalPayableEl.textContent = formatCurrency(totalPay);
        if (alertCountEl) alertCountEl.textContent = alertCount;
        if (totalEntriesEl) totalEntriesEl.textContent = data.length;

        loadingState.classList.add('hidden');
    }

    function createRow(item) {
        const div = document.createElement('div');
        div.className = 'list-row grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors';

        const currentHours = item.finalHours !== undefined && item.finalHours !== null ? item.finalHours : item.actualHours;
        const total = currentHours * item.hourlyRate;
        const isDiscrepancy = item.actualHours !== item.estimatedHours;

        if (isDiscrepancy) div.classList.add('discrepancy-row');

        let hoursDisplay = '';
        if (item.status === 'Pending') {
            hoursDisplay = `
                <button onclick="openEditModal('${item.id}')" class="px-3 py-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all inline-flex items-center gap-2">
                    ${currentHours}h
                    <i class="fas fa-pencil-alt text-xs text-slate-400"></i>
                </button>
            `;
        } else {
            hoursDisplay = `<span class="text-sm font-bold text-slate-900">${currentHours}h</span>`;
        }

        let actionsDisplay = '';
        if (item.status === 'Pending') {
            actionsDisplay = `
                <div class="flex gap-2 justify-center">
                    <button onclick="handleAction('${item.id}', 'Approved')" class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 flex items-center justify-center shadow-sm transition-all" title="Approve">
                        <i class="fas fa-check text-sm"></i>
                    </button>
                    <button onclick="handleAction('${item.id}', 'Declined')" class="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center shadow-sm transition-all" title="Decline">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            `;
        } else {
            actionsDisplay = '<div class="text-center text-slate-400 text-sm">—</div>';
        }

        div.innerHTML = `
            <div class="col-span-2 text-sm font-medium text-slate-900">${formatDate(item.date)}</div>
            
            <div class="col-span-2 flex items-center gap-3">
                <div class="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xs font-bold flex-shrink-0">
                    ${getInitials(item.staffName)}
                </div>
                <div class="min-w-0">
                    <div class="text-sm font-medium text-slate-900 truncate">${item.staffName}</div>
                    <div class="text-xs text-slate-500">ID: ${item.staffId}</div>
                </div>
            </div>

            <div class="col-span-2">
                <div class="text-sm text-slate-900 truncate" title="${item.jobTitle}">${item.jobTitle}</div>
            </div>

            <div class="col-span-1 text-right">
                <div class="text-sm font-semibold ${isDiscrepancy ? 'text-amber-600' : 'text-slate-900'}">
                    ${item.actualHours}h
                    ${isDiscrepancy ? `<i class="fas fa-exclamation-triangle ml-1 text-xs" title="Differs from Estimate (${item.estimatedHours}h)"></i>` : ''}
                </div>
                <div class="text-xs text-slate-500">Est: ${item.estimatedHours}h</div>
            </div>

            <div class="col-span-2 text-right">
                ${hoursDisplay}
            </div>

            <div class="col-span-1 text-right font-bold text-slate-900" id="total-${item.id}">
                ${formatCurrency(total)}
            </div>

            <div class="col-span-1 text-center">
                <span class="status-${item.status.toLowerCase()} px-3 py-1 text-xs font-medium rounded-full inline-block">
                    ${item.status}
                </span>
            </div>

            <div class="col-span-1">
                ${actionsDisplay}
            </div>
        `;

        return div;
    }

    // --- Modal Logic --- //
    let currentEditId = null;
    let currentEditRate = 0;

    window.openEditModal = (id) => {
        const item = window.timesheetService.getAllTimesheets().find(i => i.id === id);
        if (!item) return;

        currentEditId = id;
        currentEditRate = item.hourlyRate;

        document.getElementById('modal-staff-name').textContent = item.staffName;
        document.getElementById('modal-job-title').textContent = item.jobTitle;
        document.getElementById('modal-staff-avatar').textContent = getInitials(item.staffName);

        const hours = item.finalHours !== undefined && item.finalHours !== null ? item.finalHours : item.actualHours;
        const input = document.getElementById('modal-hours-input');
        input.value = hours;

        updateModalTotal(hours);

        document.getElementById('edit-hours-modal').classList.remove('hidden');
        input.focus();
    };

    window.closeEditModal = () => {
        document.getElementById('edit-hours-modal').classList.add('hidden');
        currentEditId = null;
    };

    window.adjustModalHours = (delta) => {
        const input = document.getElementById('modal-hours-input');
        let val = parseFloat(input.value) || 0;
        val = Math.max(0, val + delta);
        input.value = val;
        updateModalTotal(val);
    };

    document.getElementById('modal-hours-input').addEventListener('input', (e) => {
        updateModalTotal(parseFloat(e.target.value) || 0);
    });

    function updateModalTotal(hours) {
        const total = hours * currentEditRate;
        document.getElementById('modal-total-pay').textContent = formatCurrency(total);
    }

    window.saveEditModal = () => {
        if (!currentEditId) return;
        const input = document.getElementById('modal-hours-input');
        const newHours = parseFloat(input.value) || 0;

        const item = window.timesheetService.getAllTimesheets().find(i => i.id === currentEditId);
        if (item) {
            window.timesheetService.updateStatus(currentEditId, item.status, newHours);
            render();
            closeEditModal();
        }
    };

    // --- Helper Functions --- //
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    }

    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2);
    }

    // --- Action Handlers --- //
    window.handleAction = (id, newStatus) => {
        if (confirm(`Mark this timesheet as ${newStatus}?`)) {
            const success = window.timesheetService.updateStatus(id, newStatus, null);
            if (success) {
                render();
            }
        }
    };

    function handleExport() {
        let data = window.timesheetService.filterTimesheets({
            startDate: state.startDate,
            endDate: state.endDate,
            status: state.status
        });

        if (state.staffIds.length > 0) {
            data = data.filter(item => state.staffIds.includes(item.staffId));
        }

        const csv = window.timesheetService.exportToCSV(data);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `timesheet_export_${state.startDate}_to_${state.endDate}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
});
