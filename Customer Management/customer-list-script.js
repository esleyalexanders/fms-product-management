// customer-list-script.js - UI logic for customer management page

document.addEventListener('DOMContentLoaded', function() {
    const { customersAPI } = window;
    if (!customersAPI) {
        console.error('customersAPI not loaded');
        return;
    }

    const tableBody = document.querySelector('#customerTable tbody');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importModal = document.getElementById('importModal');
    const confirmImportBtn = document.getElementById('confirmImportBtn');
    const cancelImportBtn = document.getElementById('cancelImportBtn');
    const importFile = document.getElementById('importFile');
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    let deletingCustomerId = null;

    // Mask email function
    function maskEmail(email) {
        if (!email) return '-';
        const [username, domain] = email.split('@');
        if (!domain) return email;
        const maskedUsername = username.length > 2 
            ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
            : username[0] + '*';
        return `${maskedUsername}@${domain}`;
    }

    // Mask phone function
    function maskPhone(phone) {
        if (!phone) return '-';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length < 4) return phone;
        const lastFour = cleaned.slice(-4);
        const masked = '*'.repeat(cleaned.length - 4) + lastFour;
        return phone.replace(cleaned, masked);
    }

    // Render customers
    function renderCustomers() {
        const query = searchInput.value.trim();
        const customers = customersAPI.getCustomers({ q: query });
        if (customers.length > 0) {
            tableBody.innerHTML = '';
            emptyState.style.display = 'none';
            customers.forEach(customer => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-blue-50 transition-colors';
                
                // Get full name (handle both old and new format)
                const fullName = customer.fullName || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown';
                
                // Generate initials for avatar
                const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                
                // Random color for avatar
                const colors = ['blue', 'green', 'purple', 'pink', 'orange', 'indigo', 'red', 'yellow'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // Get address (handle both old and new format)
                const address = typeof customer.address === 'string' 
                    ? customer.address 
                    : (customer.address?.city || customer.address?.street || '-');
                
                row.innerHTML = `
                    <td class="p-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center text-${color}-600 font-semibold">${initials}</div>
                            <span class="font-semibold text-gray-900">${fullName}</span>
                        </div>
                    </td>
                    <td class="p-4 ${customer.company ? 'text-gray-600' : 'text-gray-400 italic'}">${customer.company || 'No company'}</td>
                    <td class="p-4 text-gray-600">${maskEmail(customer.email)}</td>
                    <td class="p-4 text-gray-600">${maskPhone(customer.phone)}</td>
                    <td class="p-4 text-gray-600">${address}</td>
                    <td class="p-4">
                        <div class="flex items-center justify-center gap-2">
                            <button class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors edit-btn" data-id="${customer.id}" title="Edit">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button class="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors delete-btn" data-id="${customer.id}" title="Delete">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            // If no customers, show the static sample rows (already in HTML)
            emptyState.style.display = 'none';
        }
    }

    // Open modal for edit
    function openEditModal(customerId) {
        window.location.href = `customer-create.html?edit=${customerId}`;
    }

    // Close modal
    function closeModal() {
        deleteModal.classList.add('hidden');
        importModal.classList.add('hidden');
        deletingCustomerId = null;
    }

    // Handle delete
    function handleDelete(customerId) {
        deletingCustomerId = customerId;
        deleteModal.classList.remove('hidden');
    }

    // Handle import
    function handleImport() {
        const file = importFile.files[0];
        if (!file) {
            alert('Please select a file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const csv = e.target.result;
            const lines = csv.split('\n').filter(line => line.trim());
            if (lines.length < 2) {
                alert('CSV must have at least a header and one data row.');
                return;
            }
            const headers = lines[0].split(',').map(h => h.trim());
            const expectedHeaders = ['Full Name', 'Company', 'Role', 'Email', 'Phone', 'Address', 'Notes'];
            // Allow flexible headers, map by index
            const dataLines = lines.slice(1);
            let successCount = 0;
            let errorCount = 0;
            dataLines.forEach(line => {
                const values = line.split(',').map(v => v.trim());
                if (values.length >= 2) { // at least name and email
                    const customerData = {
                        fullName: values[0] || '',
                        company: values[1] || '',
                        role: values[2] || '',
                        email: values[3] || '',
                        phone: values[4] || '',
                        address: values[5] || '',
                        notes: values[6] || ''
                    };
                    try {
                        customersAPI.createCustomer(customerData);
                        successCount++;
                    } catch (e) {
                        console.error('Error creating customer:', e);
                        errorCount++;
                    }
                } else {
                    errorCount++;
                }
            });
            alert(`Import complete: ${successCount} customers imported, ${errorCount} errors.`);
            closeModal();
            renderCustomers();
        };
        reader.readAsText(file);
    }

    function confirmDelete() {
        if (deletingCustomerId) {
            customersAPI.softDeleteCustomer(deletingCustomerId);
            closeModal();
            renderCustomers();
        }
    }

    // Export to CSV
    function exportCustomers() {
        const customers = customersAPI.getCustomers({ includeDeleted: false });
        if (customers.length === 0) {
            alert('No customers to export.');
            return;
        }
        const csv = [
            ['ID', 'Full Name', 'Company', 'Role', 'Email', 'Phone', 'Address', 'Notes', 'Created At'],
            ...customers.map(c => {
                const fullName = c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim();
                const address = typeof c.address === 'string' ? c.address : (c.address?.city || '');
                return [
                    c.id, fullName, c.company, c.role, c.email, c.phone, address, c.notes, c.createdAt
                ];
            })
        ].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'customers.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Event listeners
    searchInput.addEventListener('input', renderCustomers);
    exportBtn.addEventListener('click', exportCustomers);
    importBtn.addEventListener('click', () => importModal.classList.remove('hidden'));
    confirmImportBtn.addEventListener('click', handleImport);
    cancelImportBtn.addEventListener('click', () => importModal.classList.add('hidden'));
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', closeModal);

    // Delegate events for edit and delete buttons
    tableBody.addEventListener('click', function(e) {
        const target = e.target;
        if (target.classList.contains('edit-btn')) {
            const id = target.dataset.id;
            openEditModal(id);
        } else if (target.classList.contains('delete-btn')) {
            const id = target.dataset.id;
            handleDelete(id);
        }
    });

    // Initial render
    renderCustomers();
});