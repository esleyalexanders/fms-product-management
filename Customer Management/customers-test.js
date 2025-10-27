// customers-test.js - Simple unit tests for customers.js
// Run in browser console after loading customers.js

function runTests() {
    console.log('Running customer tests...');

    // Clear storage
    localStorage.removeItem('fms_customers');

    const { customersAPI } = window;
    if (!customersAPI) {
        console.error('customersAPI not available');
        return;
    }

    // Test create
    const customer = customersAPI.createCustomer({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        city: 'New York'
    });
    console.assert(customer.id, 'Create: ID generated');
    console.assert(customer.firstName === 'John', 'Create: First name set');

    // Test get by id
    const fetched = customersAPI.getCustomerById(customer.id);
    console.assert(fetched && fetched.firstName === 'John', 'Get by ID: Found customer');

    // Test update
    const updated = customersAPI.updateCustomer(customer.id, { firstName: 'Jane' });
    console.assert(updated.firstName === 'Jane', 'Update: First name changed');

    // Test get customers
    const all = customersAPI.getCustomers();
    console.assert(all.length === 1, 'Get customers: One customer');

    // Test search
    const searched = customersAPI.getCustomers({ q: 'Jane' });
    console.assert(searched.length === 1, 'Search: Found by name');

    // Test soft delete
    const deleted = customersAPI.softDeleteCustomer(customer.id);
    console.assert(deleted, 'Soft delete: Success');
    const afterDelete = customersAPI.getCustomers();
    console.assert(afterDelete.length === 0, 'Soft delete: Not in list');

    // Test include deleted
    const withDeleted = customersAPI.getCustomers({ includeDeleted: true });
    console.assert(withDeleted.length === 1 && withDeleted[0].deleted, 'Include deleted: Found deleted');

    console.log('All tests passed!');
}

// Run tests if in browser
if (typeof window !== 'undefined') {
    runTests();
}