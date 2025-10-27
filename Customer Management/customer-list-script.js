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

    // Render customers
    function renderCustomers() {
        const query = searchInput.value.trim();
        const customers = customersAPI.getCustomers({ q: query });
        if (customers.length > 0) {
            tableBody.innerHTML = '';
            emptyState.style.display = 'none';
            customers.forEach(customer => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${customer.firstName} ${customer.lastName}</td>
                    <td>${customer.company || '-'}</td>
                    <td>${customer.email || '-'}</td>
                    <td>${customer.phone || '-'}</td>
                    <td>${customer.address?.city || '-'}</td>
                    <td class="customer-actions">
                        <button class="btn-link edit-btn" data-id="${customer.id}">Edit</button>
                        <button class="btn-link delete-btn" data-id="${customer.id}">Delete</button>
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
        window.location.href = `customer-edit.html?id=${customerId}`;
    }

    // Close modal
    function closeModal() {
        deleteModal.classList.remove('active');
        importModal.classList.remove('active');
        deletingCustomerId = null;
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
            const expectedHeaders = ['First Name', 'Last Name', 'Company', 'Email', 'Phone', 'Street', 'City', 'State', 'Postal Code', 'Country', 'Notes'];
            // Allow flexible headers, map by index
            const dataLines = lines.slice(1);
            let successCount = 0;
            let errorCount = 0;
            dataLines.forEach(line => {
                const values = line.split(',').map(v => v.trim());
                if (values.length >= 3) { // at least name and email
                    const customerData = {
                        firstName: values[0] || '',
                        lastName: values[1] || '',
                        company: values[2] || '',
                        email: values[3] || '',
                        phone: values[4] || '',
                        street: values[5] || '',
                        city: values[6] || '',
                        state: values[7] || '',
                        postalCode: values[8] || '',
                        country: values[9] || 'Australia',
                        notes: values[10] || ''
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
            const expectedHeaders = ['First Name', 'Last Name', 'Company', 'Email', 'Phone', 'Street', 'City', 'State', 'Postal Code', 'Country', 'Notes'];
            // Allow flexible headers, map by index
            const dataLines = lines.slice(1);
            let successCount = 0;
            let errorCount = 0;
            dataLines.forEach(line => {
                const values = line.split(',').map(v => v.trim());
                if (values.length >= 3) { // at least name and email
                    const customerData = {
                        firstName: values[0] || '',
                        lastName: values[1] || '',
                        company: values[2] || '',
                        email: values[3] || '',
                        phone: values[4] || '',
                        street: values[5] || '',
                        city: values[6] || '',
                        state: values[7] || '',
                        postalCode: values[8] || '',
                        country: values[9] || 'Australia',
                        notes: values[10] || ''
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

    // Export to CSV
    function exportCustomers() {
        const customers = customersAPI.getCustomers({ includeDeleted: false });
        if (customers.length === 0) {
            alert('No customers to export.');
            return;
        }
        const csv = [
            ['ID', 'First Name', 'Last Name', 'Company', 'Email', 'Phone', 'City', 'Notes', 'Created At'],
            ...customers.map(c => [
                c.id, c.firstName, c.lastName, c.company, c.email, c.phone, c.address?.city, c.notes, c.createdAt
            ])
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
    importBtn.addEventListener('click', () => importModal.classList.add('active'));
    confirmImportBtn.addEventListener('click', handleImport);
    cancelImportBtn.addEventListener('click', () => importModal.classList.remove('active'));
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