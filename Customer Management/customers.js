// customers.js - Helper module for customer CRUD operations using localStorage
// Storage key: 'fms_customers' - array of customer objects

const STORAGE_KEY = 'fms_customers';

// Utility functions
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function nowISO() {
    return new Date().toISOString();
}

function getStoredCustomers() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading customers from localStorage:', e);
        return [];
    }
}

function setStoredCustomers(customers) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (e) {
        console.error('Error saving customers to localStorage:', e);
    }
}

// Main API functions
function getCustomers({ includeDeleted = false, q = '', limit = 100, offset = 0 } = {}) {
    let customers = getStoredCustomers();
    if (!includeDeleted) {
        customers = customers.filter(c => !c.deleted);
    }
    if (q) {
        const query = q.toLowerCase();
        customers = customers.filter(c =>
            (c.firstName + ' ' + c.lastName).toLowerCase().includes(query) ||
            (c.company || '').toLowerCase().includes(query) ||
            (c.email || '').toLowerCase().includes(query) ||
            (c.phone || '').toLowerCase().includes(query) ||
            (c.address?.city || '').toLowerCase().includes(query)
        );
    }
    return customers.slice(offset, offset + limit);
}

function getCustomerById(id) {
    const customers = getStoredCustomers();
    return customers.find(c => c.id === id) || null;
}

function createCustomer(customerData) {
    const customers = getStoredCustomers();
    const newCustomer = {
        id: generateId(),
        firstName: customerData.firstName || '',
        lastName: customerData.lastName || '',
        company: customerData.company || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        address: {
            street: customerData.street || '',
            city: customerData.city || '',
            state: customerData.state || '',
            postalCode: customerData.postalCode || '',
            country: customerData.country || 'Australia'
        },
        preferredContactMethod: customerData.preferredContactMethod || 'email',
        notes: customerData.notes || '',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        deleted: false
    };
    customers.push(newCustomer);
    setStoredCustomers(customers);
    return newCustomer;
}

function updateCustomer(id, patch) {
    const customers = getStoredCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    const customer = customers[index];
    Object.assign(customer, patch, { updatedAt: nowISO() });
    setStoredCustomers(customers);
    return customer;
}

function softDeleteCustomer(id) {
    const customers = getStoredCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return false;
    customers[index].deleted = true;
    customers[index].updatedAt = nowISO();
    setStoredCustomers(customers);
    return true;
}

function permanentlyDeleteCustomer(id) {
    const customers = getStoredCustomers();
    const filtered = customers.filter(c => c.id !== id);
    if (filtered.length === customers.length) return false;
    setStoredCustomers(filtered);
    return true;
}

// Export for use in other scripts
window.customersAPI = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    softDeleteCustomer,
    permanentlyDeleteCustomer
};