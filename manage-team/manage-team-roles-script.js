// Manage Team Roles Page Script
document.addEventListener('DOMContentLoaded', function() {
    const addRoleBtn = document.getElementById('addRoleBtn');
    const roleModal = document.getElementById('roleModal');
    const roleForm = document.getElementById('roleForm');
    const cancelRoleBtn = document.getElementById('cancelRoleBtn');
    const modalTitle = document.getElementById('modalTitle');
    const saveRoleBtn = document.getElementById('saveRoleBtn');

    let editingRole = null;

    // Open modal for adding new role
    addRoleBtn.addEventListener('click', function() {
        editingRole = null;
        modalTitle.textContent = 'Add New Role';
        saveRoleBtn.textContent = 'Create Role';
        roleForm.reset();
        roleModal.classList.add('active');
    });

    // Close modal
    cancelRoleBtn.addEventListener('click', function() {
        roleModal.classList.remove('active');
        roleForm.reset();
    });

    // Edit role function (called from HTML)
    window.editRole = function(roleId) {
        editingRole = roleId;
        modalTitle.textContent = 'Edit Role';
        saveRoleBtn.textContent = 'Update Role';

        // Load existing role data (in a real app, this would come from an API)
        // For demo, we'll just open the modal
        roleModal.classList.add('active');
    };

    // Form submission
    roleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const roleData = {
            name: document.getElementById('roleName').value,
            description: document.getElementById('roleDescription').value,
            permissions: []
        };

        // Collect selected permissions
        const permissionCheckboxes = roleForm.querySelectorAll('input[type="checkbox"]:checked');
        permissionCheckboxes.forEach(checkbox => {
            roleData.permissions.push(checkbox.id.replace('perm_', ''));
        });

        console.log('Role data:', roleData);

        // Here you would typically send the data to your backend
        if (editingRole) {
            alert('Role updated successfully!');
        } else {
            alert('Role created successfully!');
        }

        roleModal.classList.remove('active');
        roleForm.reset();

        // In a real app, you would refresh the roles table here
    });

    // Permission group toggle (select all in group)
    const permissionGroups = document.querySelectorAll('.permission-group');
    permissionGroups.forEach(group => {
        const groupCheckboxes = group.querySelectorAll('input[type="checkbox"]');

        // Add a "Select All" checkbox to each group
        if (groupCheckboxes.length > 1) {
            const selectAllDiv = document.createElement('div');
            selectAllDiv.className = 'permission-item';
            selectAllDiv.innerHTML = `
                <input type="checkbox" id="select_all_${group.querySelector('h4').textContent.toLowerCase().replace(' ', '_')}">
                <label for="select_all_${group.querySelector('h4').textContent.toLowerCase().replace(' ', '_')}"><strong>Select All</strong></label>
            `;
            group.insertBefore(selectAllDiv, group.firstChild.nextSibling);

            const selectAllCheckbox = selectAllDiv.querySelector('input[type="checkbox"]');
            selectAllCheckbox.addEventListener('change', function() {
                groupCheckboxes.forEach(cb => cb.checked = this.checked);
            });

            // Update select all when individual checkboxes change
            groupCheckboxes.forEach(cb => {
                cb.addEventListener('change', function() {
                    const allChecked = Array.from(groupCheckboxes).every(cb => cb.checked);
                    const someChecked = Array.from(groupCheckboxes).some(cb => cb.checked);
                    selectAllCheckbox.checked = allChecked;
                    selectAllCheckbox.indeterminate = someChecked && !allChecked;
                });
            });
        }
    });
});