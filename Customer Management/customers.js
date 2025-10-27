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

// Seed sample customers for demo
function seedSampleCustomers() {
    // Clear existing for demo
    localStorage.removeItem(STORAGE_KEY);

    const samples = [
        {
            firstName: 'John',
            lastName: 'Doe',
            company: 'ABC Corp',
            email: 'john.doe@abc.com',
            phone: '+1 234 567 8901',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
            preferredContactMethod: 'email',
            notes: 'Regular customer, prefers email communication'
        },
        {
            firstName: 'Jane',
            lastName: 'Smith',
            company: '',
            email: 'jane.smith@email.com',
            phone: '+61 400 123 456',
            street: '456 Oak Avenue',
            city: 'Sydney',
            state: 'NSW',
            postalCode: '2000',
            country: 'Australia',
            preferredContactMethod: 'phone',
            notes: 'New customer, interested in home cleaning services'
        },
        {
            firstName: 'Mike',
            lastName: 'Johnson',
            company: 'XYZ Services',
            email: 'mike@xyzservices.com',
            phone: '+1 987 654 3210',
            street: '789 Pine Road',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90210',
            country: 'USA',
            preferredContactMethod: 'email',
            notes: 'Business client, needs commercial cleaning quote'
        },
        {
            firstName: 'Sarah',
            lastName: 'Williams',
            company: '',
            email: 'sarah.williams@gmail.com',
            phone: '+61 411 222 333',
            street: '321 Beach Boulevard',
            city: 'Melbourne',
            state: 'VIC',
            postalCode: '3000',
            country: 'Australia',
            preferredContactMethod: 'whatsapp',
            notes: 'Residential customer, prefers WhatsApp for updates'
        },
        {
            firstName: 'David',
            lastName: 'Brown',
            company: 'Brown Enterprises',
            email: 'david@brownent.com',
            phone: '+1 555 123 4567',
            street: '654 Elm Street',
            city: 'Chicago',
            state: 'IL',
            postalCode: '60601',
            country: 'USA',
            preferredContactMethod: 'phone',
            notes: 'Enterprise client, multiple locations'
        }
    ];

    samples.forEach(sample => createCustomer(sample));
}

// Export for use in other scripts
window.customersAPI = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    softDeleteCustomer,
    permanentlyDeleteCustomer,
    seedSampleCustomers
};