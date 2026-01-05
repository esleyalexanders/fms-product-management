// Timesheet Details JavaScript (Refactored for MVP)
// Unifies data source with Timesheet Inbox (via payroll_store.js)

(function () {
    // 1. Dependency Check
    const Store = window.FMSPayrollStore;
    if (!Store) {
        console.error('FMSPayrollStore not found. Ensure payroll_store.js is loaded.');
        return;
    }

    // 2. Utils
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            staffId: params.get('staffId') || '',
            startDate: params.get('startDate') || '',
            endDate: params.get('endDate') || ''
        };
    }

    function toYmd(dateObj) {
        if (!dateObj) return '';
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function getMonthStartEnd() {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start: toYmd(start), end: toYmd(end) };
    }

    function timeFromIso(iso) {
        if (!iso) return '';
        const m = String(iso).match(/T(\d{2}:\d{2})/);
        return m ? m[1] : '';
    }

    function minutesToHms(mins) {
        const m = Math.max(0, Math.round(mins || 0));
        return (m / 60).toFixed(2) + 'h';
    }

    // 3. Render Logic
    // 3. Render Logic
    // const elStaff = document.getElementById('staffSelect'); // Removed, using custom UI
    const elStart = document.getElementById('startDate');
    const elEnd = document.getElementById('endDate');
    const elStatus = document.getElementById('statusFilter');
    const elTbody = document.getElementById('timesheetDetailTableBody');
    const elEmpty = document.getElementById('emptyState');
    const elTable = document.getElementById('timesheetDetailTable');
    const elBulkBar = document.getElementById('bulkActionsBar');
    const elSelectedCount = document.getElementById('selectedCount');

    // Multi-select elements
    const elStaffDisplay = document.getElementById('staffDisplay');
    const elStaffInput = document.getElementById('staffSearchInput');
    const elStaffDropdown = document.getElementById('staffDropdown');

    let allStaff = [];
    let selectedStaffIds = [];

    function populateStaffSelector() {
        allStaff = Store.loadStaff().filter(s => (s.status || 'active') === 'active');
        allStaff.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        renderDropdownOptions();
    }

    function renderDropdownOptions(filterText = '') {
        const query = filterText.toLowerCase();
        const filtered = allStaff.filter(s => {
            const name = (s.name || '').toLowerCase();
            return name.includes(query) && !selectedStaffIds.includes(s.id);
        });

        if (filtered.length === 0) {
            elStaffDropdown.innerHTML = '<div class="dropdown-option" style="cursor:default;color:#9ca3af;">No staff found</div>';
            return;
        }

        elStaffDropdown.innerHTML = filtered.map(s => `
            <div class="dropdown-option" data-id="${s.id}">
                ${s.name || `${s.firstName || ''} ${s.lastName || ''}`}
            </div>
        `).join('');

        // Attach click listeners
        elStaffDropdown.querySelectorAll('.dropdown-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const id = opt.dataset.id;
                if (id) addStaff(id);
            });
        });
    }

    function addStaff(id) {
        if (!selectedStaffIds.includes(id)) {
            selectedStaffIds.push(id);
            renderTags();
            elStaffInput.value = '';
            renderDropdownOptions();
            render(); // Refresh table
        }
    }

    function removeStaff(id) {
        selectedStaffIds = selectedStaffIds.filter(sid => sid !== id);
        renderTags();
        renderDropdownOptions();
        render(); // Refresh table
    }

    function renderTags() {
        // Clear existing tags (keep input)
        const tags = elStaffDisplay.querySelectorAll('.tag');
        tags.forEach(t => t.remove());

        selectedStaffIds.forEach(id => {
            const staff = allStaff.find(s => s.id === id);
            if (!staff) return;
            const name = staff.name || `${staff.firstName} ${staff.lastName}`;

            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerHTML = `
                ${name}
                <div class="tag-remove" data-id="${id}">
                    <i class="fas fa-times"></i>
                </div>
            `;
            elStaffDisplay.insertBefore(tag, elStaffInput);
        });

        // Tag remove listeners
        elStaffDisplay.querySelectorAll('.tag-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent input focus event messing up
                removeStaff(btn.dataset.id);
            });
        });

        // Hide/Show placeholder based on selection
        if (selectedStaffIds.length > 0) {
            elStaffInput.placeholder = '';
        } else {
            elStaffInput.placeholder = 'Select staff...';
        }
    }

    // Custom Event Listeners for Multi-Select
    elStaffInput.addEventListener('focus', () => {
        elStaffDropdown.classList.add('active');
        renderDropdownOptions(elStaffInput.value);
    });

    elStaffInput.addEventListener('input', () => {
        elStaffDropdown.classList.add('active');
        renderDropdownOptions(elStaffInput.value);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const wrapper = document.getElementById('staffMultiSelect');
        if (wrapper && !wrapper.contains(e.target)) {
            elStaffDropdown.classList.remove('active');
        }
    });

    elStaffDisplay.addEventListener('click', () => {
        elStaffInput.focus();
    });

    function buildRow(entry, session) {
        const serviceName = session?.learningServiceName || session?.title || session?.learningServiceType || 'Session';
        const date = session?.date || entry.scheduledStart?.split('T')[0] || '';

        const estMins = Store.minutesDiff(entry.scheduledStart, entry.scheduledEnd) || 0;
        const actualMins = entry.workedMinutes || 0;
        const diff = actualMins - estMins;

        const diffClass = diff > 0 ? 'over' : diff < 0 ? 'under' : '';
        const diffText = diff === 0 ? '' : (diff > 0 ? `+${(diff / 60).toFixed(2)}h` : `${(diff / 60).toFixed(2)}h`);

        const status = entry.status || 'draft';
        let statusBadgeClass = 'pending';
        let statusText = 'Draft';
        if (status === 'approved') { statusBadgeClass = 'approved'; statusText = 'Approved'; }
        if (status === 'declined') { statusBadgeClass = 'declined'; statusText = 'Declined'; }
        if (status === 'submitted') { statusBadgeClass = 'pending'; statusText = 'Submitted'; }

        const approvedMins = entry.managerApprovedMinutes !== null ? entry.managerApprovedMinutes : actualMins;

        return `
            <tr data-entry-id="${entry.id}">
                <td><input type="checkbox" class="row-checkbox" data-entry-id="${entry.id}"></td>
                <td>
                    <span class="job-id-cell">${session?.id || entry.sessionId}</span>
                    <div style="font-size:12px;color:#6b7280;">${serviceName}</div>
                </td>
                <td><span class="time-cell">${date}</span></td>
                <td><span class="time-cell">${timeFromIso(entry.scheduledStart)}</span></td>
                <td><span class="time-cell">${timeFromIso(entry.scheduledEnd)}</span></td>
                <td><span class="hours-cell estimated-hours">${(estMins / 60).toFixed(2)}</span></td>
                <td>
                    <div>
                        <span class="hours-cell actual-hours">${(actualMins / 60).toFixed(2)}</span>
                        ${diffText ? `<div class="hours-difference ${diffClass}">${diffText}</div>` : ''}
                    </div>
                </td>
                <td>
                   <div class="approve-cell">
                        <input type="number" class="approve-input" step="0.25"
                               data-entry-id="${entry.id}"
                               value="${(approvedMins / 60).toFixed(2)}"
                               ${status === 'approved' ? 'readonly' : ''}
                        >
                   </div>
                </td>
                <td>
                    <div class="status-cell">
                        <span class="status-badge ${statusBadgeClass}">${statusText}</span>
                    </div>
                </td>
                <td>
                    <div class="status-actions">
                        <button class="action-icon-btn" title="Approve" onclick="approveEntry('${entry.id}')">
                            <i class="fas fa-check" style="color: #10b981;"></i>
                        </button>
                        <button class="action-icon-btn" title="Decline" onclick="declineEntry('${entry.id}')">
                            <i class="fas fa-times" style="color: #ef4444;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    function render() {
        // const staffId = elStaff.value; // Old single select
        const start = elStart.value;
        const end = elEnd.value;
        const statusMode = elStatus.value; // 'all', 'pending', 'approved', 'declined'

        if (selectedStaffIds.length === 0) {
            elTable.style.display = 'none';
            elEmpty.style.display = 'block';
            elEmpty.innerHTML = '<p>Please select a staff member</p>';
            return;
        }

        // Load Data
        const sessions = Store.loadSessions();
        // Ensure entries exist for date range
        // Filter sessions by date first to avoid creating entries for ALL time
        const visibleSessions = sessions.filter(s => {
            if (!s.date) return false;
            return s.date >= start && s.date <= end;
        });

        visibleSessions.forEach(s => Store.ensureTimeEntriesForSession(s, { persist: true }));

        let entries = Store.loadTimeEntries().filter(e => selectedStaffIds.includes(e.staffId));

        // Filter by Date
        entries = entries.filter(e => {
            const d = e.scheduledStart ? e.scheduledStart.split('T')[0] : '';
            return d >= start && d <= end;
        });

        // Filter by Status
        if (statusMode !== 'all') {
            entries = entries.filter(e => {
                const s = e.status || 'draft';
                if (statusMode === 'pending') return s === 'draft' || s === 'submitted';
                return s === statusMode;
            });
        }

        if (entries.length === 0) {
            elTable.style.display = 'none';
            elEmpty.style.display = 'block';
            elEmpty.innerHTML = '<p>No timesheet entries found for this period.</p>';
            return;
        }

        elTable.style.display = 'table';
        elEmpty.style.display = 'none';

        // Sort by Date Desc
        entries.sort((a, b) => (b.scheduledStart || '').localeCompare(a.scheduledStart || ''));

        const sessionsMap = new Map(sessions.map(s => [s.id, s]));

        elTbody.innerHTML = entries.map(e => {
            const session = sessionsMap.get(e.sessionId);
            return buildRow(e, session);
        }).join('');

        attachEventListeners();
        updateBulkBar();
    }

    function attachEventListeners() {
        // Row Checkbox
        document.querySelectorAll('.row-checkbox').forEach(cb => {
            cb.addEventListener('change', updateBulkBar);
        });

        // Approve Input Change
        document.querySelectorAll('.approve-input').forEach(inp => {
            inp.addEventListener('change', (e) => {
                const id = e.target.dataset.entryId;
                const hours = parseFloat(e.target.value) || 0;
                const entry = Store.loadTimeEntries().find(x => x.id === id);
                if (entry) {
                    entry.managerApprovedMinutes = Math.round(hours * 60);
                    Store.upsertTimeEntry(entry, { persist: true });
                }
            });
        });
    }

    function updateBulkBar() {
        const checked = document.querySelectorAll('.row-checkbox:checked');
        const count = checked.length;
        if (count > 0) {
            elBulkBar.classList.add('active');
            elSelectedCount.textContent = count;
        } else {
            elBulkBar.classList.remove('active');
        }
    }

    // Bulk Actions
    window.bulkApprove = function () {
        const ids = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.dataset.entryId);
        if (!ids.length) return;
        if (!confirm(`Approve ${ids.length} entries?`)) return;

        ids.forEach(id => {
            const entry = Store.loadTimeEntries().find(e => e.id === id);
            if (entry && entry.status !== 'approved') { // Don't re-approve if already approved
                entry.status = 'approved';
                // If managerApprovedMinutes is not set, default to workedMinutes
                if (entry.managerApprovedMinutes === null || entry.managerApprovedMinutes === undefined) {
                    entry.managerApprovedMinutes = entry.workedMinutes;
                }
                Store.upsertTimeEntry(entry, { persist: true });
            }
        });
        render();
        // clear checkboxes
        document.getElementById('selectAll').checked = false;
    };

    window.bulkDecline = function () {
        const ids = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.dataset.entryId);
        if (!ids.length) return;
        if (!confirm(`Decline ${ids.length} entries?`)) return;

        ids.forEach(id => {
            const entry = Store.loadTimeEntries().find(e => e.id === id);
            if (entry) {
                entry.status = 'declined';
                entry.managerApprovedMinutes = 0;
                Store.upsertTimeEntry(entry, { persist: true });
            }
        });
        render();
        document.getElementById('selectAll').checked = false;
    };

    // Individual Actions
    window.approveEntry = function (id) {
        const entry = Store.loadTimeEntries().find(e => e.id === id);
        if (entry) {
            entry.status = 'approved';
            if (entry.managerApprovedMinutes === null || entry.managerApprovedMinutes === undefined) {
                entry.managerApprovedMinutes = entry.workedMinutes;
            }
            Store.upsertTimeEntry(entry, { persist: true });
            render();
        }
    }

    window.declineEntry = function (id) {
        if (!confirm('Are you sure you want to decline this entry?')) return;
        const entry = Store.loadTimeEntries().find(e => e.id === id);
        if (entry) {
            entry.status = 'declined';
            entry.managerApprovedMinutes = 0;
            Store.upsertTimeEntry(entry, { persist: true });
            render();
        }
    }

    window.toggleSelectAll = function () {
        const master = document.getElementById('selectAll');
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = master.checked);
        updateBulkBar();
    };

    // Initialization
    populateStaffSelector();

    // Set URLs defaults
    const params = getUrlParams();
    const range = getMonthStartEnd();
    elStart.value = params.startDate || range.start;
    elEnd.value = params.endDate || range.end;
    if (params.staffId) {
        // Handle pre-selection from URL
        // elStaff.value = params.staffId; 
        addStaff(params.staffId);
        // render(); // addStaff calls render
    }

    // Event Listeners for Filters
    // elStaff.addEventListener('change', render); // Removed
    elStart.addEventListener('change', render);
    elEnd.addEventListener('change', render);
    elStatus.addEventListener('change', render);

})();
