// Sample staff members (in real app, fetch from API/localStorage)
const sampleStaff = [
    { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-002', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Instructor', department: 'Science' },
    { id: 'STAFF-003', name: 'Michael Chen', email: 'michael.chen@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-004', name: 'Emily Rodriguez', email: 'emily.r@example.com', role: 'Instructor', department: 'Yoga' },
    { id: 'STAFF-005', name: 'James Wilson', email: 'james.w@example.com', role: 'Instructor', department: 'Guitar' },
    { id: 'STAFF-006', name: 'Lisa Anderson', email: 'lisa.a@example.com', role: 'Instructor', department: 'Science' },
    { id: 'STAFF-007', name: 'Robert Taylor', email: 'robert.t@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-008', name: 'Jennifer White', email: 'jennifer.w@example.com', role: 'Instructor', department: 'Yoga' },
    { id: 'STAFF-009', name: 'David Kim', email: 'david.k@example.com', role: 'Instructor', department: 'Computer Science' },
    { id: 'STAFF-010', name: 'Amanda Martinez', email: 'amanda.m@example.com', role: 'Instructor', department: 'English' },
    { id: 'STAFF-011', name: 'Chris Thompson', email: 'chris.t@example.com', role: 'Assistant', department: 'General' },
    { id: 'STAFF-012', name: 'Nicole Brown', email: 'nicole.b@example.com', role: 'Instructor', department: 'Wellness' }
];

// Sample customers with quotes (in real app, fetch from API/localStorage)
const sampleCustomers = [
    {
        id: 'CUST-001',
        name: 'Miss A',
        email: 'missa@example.com',
        previousQuotes: 3,
        quotes: [
            { id: 'Q-2024-020', pricebookItemId: 'PB-YOGA-CLASS', total: 100.00, status: 'approved', slots: 2 },
            { id: 'Q-2024-121', pricebookItemId: 'PB-YOGA-CLASS', total: 150.00, status: 'approved', slots: 3 },
            { id: 'Q-2024-125', pricebookItemId: 'PB-WELLNESS-PASS', total: 70.00, status: 'approved', slots: 2 },
            { id: 'Q-2024-025', pricebookItemId: 'PB-MATH-TUTORING', total: 240.00, status: 'approved', slots: 2 },
            { id: 'Q-2024-030', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-002',
        name: 'Mr. B',
        email: 'mrb@example.com',
        previousQuotes: 2,
        quotes: [
            { id: 'Q-2024-021', pricebookItemId: 'PB-YOGA-CLASS', total: 50.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-026', pricebookItemId: 'PB-GUITAR-SESSION', total: 45.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-003',
        name: 'Mrs. C',
        email: 'mrsc@example.com',
        previousQuotes: 4,
        quotes: [
            { id: 'Q-2024-022', pricebookItemId: 'PB-MATH-TUTORING', total: 120.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-027', pricebookItemId: 'PB-SCIENCE-LAB', total: 80.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-004',
        name: 'John Smith',
        email: 'john@example.com',
        previousQuotes: 1,
        quotes: [
            { id: 'Q-2024-023', pricebookItemId: 'PB-YOGA-CLASS', total: 150.00, status: 'approved', slots: 3 }
        ]
    },
    {
        id: 'CUST-005',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        previousQuotes: 2,
        quotes: [
            { id: 'Q-2024-024', pricebookItemId: 'PB-WELLNESS-PASS', total: 35.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-031', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 2 }
        ]
    },
    {
        id: 'CUST-006',
        name: 'Sam Wilson',
        email: 'sam.wilson@example.com',
        previousQuotes: 3,
        quotes: [
            { id: 'Q-2024-032', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-033', pricebookItemId: 'PB-CHEMISTRY-LAB', total: 95.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-007',
        name: 'Sandra Martinez',
        email: 'sandra.m@example.com',
        previousQuotes: 5,
        quotes: [
            { id: 'Q-2024-034', pricebookItemId: 'PB-ALGEBRA-II', total: 360.00, status: 'approved', slots: 2 },
            { id: 'Q-2024-035', pricebookItemId: 'PB-PHYSICS-WORKSHOP', total: 200.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-008',
        name: 'David Chen',
        email: 'david.chen@example.com',
        previousQuotes: 2,
        quotes: [
            { id: 'Q-2024-036', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-037', pricebookItemId: 'PB-MATH-TUTORING', total: 120.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-009',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        previousQuotes: 4,
        quotes: [
            { id: 'Q-2024-038', pricebookItemId: 'PB-ALGEBRA-II', total: 540.00, status: 'approved', slots: 3 },
            { id: 'Q-2024-039', pricebookItemId: 'PB-YOGA-CLASS', total: 100.00, status: 'approved', slots: 2 }
        ]
    },
    {
        id: 'CUST-010',
        name: 'Michael Brown',
        email: 'michael.b@example.com',
        previousQuotes: 1,
        quotes: [
            { id: 'Q-2024-040', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-011',
        name: 'Lisa Anderson',
        email: 'lisa.a@example.com',
        previousQuotes: 3,
        quotes: [
            { id: 'Q-2024-041', pricebookItemId: 'PB-ALGEBRA-II', total: 360.00, status: 'approved', slots: 2 },
            { id: 'Q-2024-042', pricebookItemId: 'PB-SCIENCE-LAB', total: 80.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-012',
        name: 'Robert Taylor',
        email: 'robert.t@example.com',
        previousQuotes: 2,
        quotes: [
            { id: 'Q-2024-043', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-044', pricebookItemId: 'PB-MATH-TUTORING', total: 240.00, status: 'approved', slots: 2 }
        ]
    },
    {
        id: 'CUST-013',
        name: 'Samantha Lee',
        email: 'samantha.lee@example.com',
        previousQuotes: 6,
        quotes: [
            { id: 'Q-2024-045', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-046', pricebookItemId: 'PB-CHEMISTRY-LAB', total: 95.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-047', pricebookItemId: 'PB-YOGA-CLASS', total: 50.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-014',
        name: 'James Wilson',
        email: 'james.w@example.com',
        previousQuotes: 2,
        quotes: [
            { id: 'Q-2024-048', pricebookItemId: 'PB-ALGEBRA-II', total: 540.00, status: 'approved', slots: 3 }
        ]
    },
    {
        id: 'CUST-015',
        name: 'Sophie Martin',
        email: 'sophie.m@example.com',
        previousQuotes: 3,
        quotes: [
            { id: 'Q-2024-049', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-050', pricebookItemId: 'PB-PHYSICS-WORKSHOP', total: 200.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-016',
        name: 'Alex Thompson',
        email: 'alex.t@example.com',
        previousQuotes: 4,
        quotes: [
            { id: 'Q-2024-051', pricebookItemId: 'PB-YOGA-CLASS', total: 100.00, status: 'approved', slots: 2 },
            { id: 'Q-2024-052', pricebookItemId: 'PB-WELLNESS-PASS', total: 70.00, status: 'approved', slots: 2 }
        ]
    },
    {
        id: 'CUST-017',
        name: 'Maria Garcia',
        email: 'maria.g@example.com',
        previousQuotes: 2,
        quotes: [
            { id: 'Q-2024-053', pricebookItemId: 'PB-YOGA-CLASS', total: 50.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-054', pricebookItemId: 'PB-MATH-TUTORING', total: 120.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-018',
        name: 'Chris Anderson',
        email: 'chris.a@example.com',
        previousQuotes: 5,
        quotes: [
            { id: 'Q-2024-055', pricebookItemId: 'PB-YOGA-CLASS', total: 150.00, status: 'approved', slots: 3 },
            { id: 'Q-2024-056', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-019',
        name: 'Jennifer White',
        email: 'jennifer.w@example.com',
        previousQuotes: 3,
        quotes: [
            { id: 'Q-2024-057', pricebookItemId: 'PB-YOGA-CLASS', total: 50.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-058', pricebookItemId: 'PB-SCIENCE-LAB', total: 80.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-059', pricebookItemId: 'PB-CHEMISTRY-LAB', total: 95.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-020',
        name: 'Daniel Kim',
        email: 'daniel.k@example.com',
        previousQuotes: 2,
        quotes: [
            { id: 'Q-2024-060', pricebookItemId: 'PB-MATH-TUTORING', total: 240.00, status: 'approved', slots: 2 },
            { id: 'Q-2024-061', pricebookItemId: 'PB-ALGEBRA-II', total: 360.00, status: 'approved', slots: 2 }
        ]
    },
    {
        id: 'CUST-021',
        name: 'Amanda Rodriguez',
        email: 'amanda.r@example.com',
        previousQuotes: 4,
        quotes: [
            { id: 'Q-2024-062', pricebookItemId: 'PB-YOGA-CLASS', total: 100.00, status: 'approved', slots: 2 },
            { id: 'Q-2024-063', pricebookItemId: 'PB-WELLNESS-PASS', total: 35.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-022',
        name: 'Kevin Patel',
        email: 'kevin.p@example.com',
        previousQuotes: 1,
        quotes: [
            { id: 'Q-2024-064', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-065', pricebookItemId: 'PB-PHYSICS-WORKSHOP', total: 200.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-023',
        name: 'Nicole Brown',
        email: 'nicole.b@example.com',
        previousQuotes: 6,
        quotes: [
            { id: 'Q-2024-066', pricebookItemId: 'PB-YOGA-CLASS', total: 50.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-067', pricebookItemId: 'PB-GUITAR-SESSION', total: 45.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-068', pricebookItemId: 'PB-WELLNESS-PASS', total: 35.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-024',
        name: 'Ryan Miller',
        email: 'ryan.m@example.com',
        previousQuotes: 3,
        quotes: [
            { id: 'Q-2024-069', pricebookItemId: 'PB-MATH-TUTORING', total: 120.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-070', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-071', pricebookItemId: 'PB-COMPUTER-SCIENCE', total: 150.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-025',
        name: 'Lauren Taylor',
        email: 'lauren.t@example.com',
        previousQuotes: 2,
        quotes: [
            { id: 'Q-2024-072', pricebookItemId: 'PB-YOGA-CLASS', total: 150.00, status: 'approved', slots: 3 },
            { id: 'Q-2024-073', pricebookItemId: 'PB-SCIENCE-LAB', total: 80.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-026',
        name: 'Thomas Wright',
        email: 'thomas.w@example.com',
        previousQuotes: 4,
        quotes: [
            { id: 'Q-2024-074', pricebookItemId: 'PB-ALGEBRA-II', total: 540.00, status: 'approved', slots: 3 },
            { id: 'Q-2024-075', pricebookItemId: 'PB-MATH-TUTORING', total: 120.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-027',
        name: 'Jessica Moore',
        email: 'jessica.m@example.com',
        previousQuotes: 3,
        quotes: [
            { id: 'Q-2024-076', pricebookItemId: 'PB-YOGA-CLASS', total: 50.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-077', pricebookItemId: 'PB-WELLNESS-PASS', total: 70.00, status: 'approved', slots: 2 }
        ]
    },
    {
        id: 'CUST-028',
        name: 'Brian Clark',
        email: 'brian.c@example.com',
        previousQuotes: 5,
        quotes: [
            { id: 'Q-2024-078', pricebookItemId: 'PB-GUITAR-SESSION', total: 45.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-079', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-080', pricebookItemId: 'PB-CHEMISTRY-LAB', total: 95.00, status: 'approved', slots: 1 }
        ]
    },
    {
        id: 'CUST-029',
        name: 'Michelle Lewis',
        email: 'michelle.l@example.com',
        previousQuotes: 2,
        quotes: [
            { id: 'Q-2024-081', pricebookItemId: 'PB-YOGA-CLASS', total: 100.00, status: 'approved', slots: 2 },
            { id: 'Q-2024-082', pricebookItemId: 'PB-MATH-TUTORING', total: 240.00, status: 'approved', slots: 2 }
        ]
    },
    {
        id: 'CUST-030',
        name: 'Andrew Walker',
        email: 'andrew.w@example.com',
        previousQuotes: 1,
        quotes: [
            { id: 'Q-2024-083', pricebookItemId: 'PB-ALGEBRA-II', total: 180.00, status: 'approved', slots: 1 },
            { id: 'Q-2024-084', pricebookItemId: 'PB-PHYSICS-WORKSHOP', total: 200.00, status: 'approved', slots: 1 }
        ]
    }
];

// Sample pricebook items for class enrollment
const availablePricebookItems = [
    {
        id: 'PB-YOGA-CLASS',
        name: 'Yoga Class - Group (per seat)',
        description: '60-minute guided yoga session led by certified instructor',
        tag: 'Yoga',
        price: 50.00
    },
    {
        id: 'PB-MATH-TUTORING',
        name: 'Math Tutoring - Group Session',
        description: 'Group math tutoring session for up to 20 students',
        tag: 'Math',
        price: 120.00
    },
    {
        id: 'PB-ALGEBRA-II',
        name: 'Algebra II - Group Session',
        description: 'Advanced algebra group class covering quadratic equations, polynomials, and functions',
        tag: 'Math',
        price: 180.00
    },
    {
        id: 'PB-GUITAR-SESSION',
        name: 'Guitar Workshop - Group (per seat)',
        description: 'Small group guitar coaching, includes practice materials',
        tag: 'Guitar',
        price: 45.00
    },
    {
        id: 'PB-SCIENCE-LAB',
        name: 'Science Lab Session - Group',
        description: 'Hands-on science experiment session',
        tag: 'Science',
        price: 80.00
    },
    {
        id: 'PB-CHEMISTRY-LAB',
        name: 'Chemistry Lab - Group Session',
        description: 'Interactive chemistry experiments and lab work',
        tag: 'Science',
        price: 95.00
    },
    {
        id: 'PB-PHYSICS-WORKSHOP',
        name: 'Physics Workshop - Group',
        description: 'Group physics problem-solving and concept review',
        tag: 'Science',
        price: 200.00
    },
    {
        id: 'PB-WELLNESS-PASS',
        name: 'Wellness Drop-in Pass',
        description: 'Flexible pass that can be applied to yoga, stretch, or meditation classes',
        tag: 'Wellness',
        price: 35.00
    },
    {
        id: 'PB-ENGLISH-LIT',
        name: 'English Literature - Group Class',
        description: 'Group discussion and analysis of literary works',
        tag: 'English',
        price: 90.00
    },
    {
        id: 'PB-COMPUTER-SCIENCE',
        name: 'Computer Science - Group Session',
        description: 'Programming fundamentals and coding practice',
        tag: 'Technology',
        price: 150.00
    }
];

function assignQuotePaymentStatuses() {
    sampleCustomers.forEach(customer => {
        (customer.quotes || []).forEach(quote => {
            const numericId = parseInt(quote.id?.replace(/\D/g, ''), 10) || 0;
            const mod = numericId % 3;
            let status = 'unpaid';
            if (mod === 0) status = 'paid';
            else if (mod === 1) status = 'partial';
            quote.paymentStatus = status;
            if (status === 'paid') {
                quote.amountPaid = quote.total;
            } else if (status === 'partial') {
                quote.amountPaid = Number((quote.total * 0.5).toFixed(2));
            } else {
                quote.amountPaid = 0;
            }
        });
    });
}

assignQuotePaymentStatuses();

function formatCurrencyDisplay(value) {
    const num = Number(value) || 0;
    return `$${num.toFixed(2)}`;
}

function getPaymentStatusInfo(status) {
    switch (status) {
        case 'paid':
            return { label: 'Paid', color: 'emerald', icon: '✅' };
        case 'partial':
            return { label: 'Partially Paid', color: 'amber', icon: '🌓' };
        default:
            return { label: 'Unpaid', color: 'rose', icon: '⚠️' };
    }
}

// Tab switching function
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('[id^="tab-content-"]').forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('[id^="tab-"]').forEach(button => {
        button.classList.remove('active', 'border-emerald-600', 'text-emerald-600');
        button.classList.add('border-transparent', 'text-gray-500');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(`tab-content-${tabName}`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
        selectedContent.classList.add('active');
    }
    
    // Add active class to selected tab button
    const selectedButton = document.getElementById(`tab-${tabName}`);
    if (selectedButton) {
        selectedButton.classList.add('active', 'border-emerald-600', 'text-emerald-600');
        selectedButton.classList.remove('border-transparent', 'text-gray-500');
    }
}

// Current class job data
let classJobData = {
    id: null,
    name: '',
    skillLevel: '',
    pricebookItem: null,
    maxCapacity: 10,
    waitlistEnabled: false,
    scheduleDate: null,
    startTime: null,
    endTime: null,
    bookings: [], // Array of { quoteId, slots, customerName, status }
    assignedStaff: [],
    status: 'created'
};

// Load class job data
function loadClassJobData() {
    // Get job ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');
    
    if (!jobId) {
        // New class job - initialize with defaults
        classJobData.id = 'JOB-2024-CLASS-' + Date.now().toString().slice(-6);
        
        // Auto-select first pricebook item as default
        if (availablePricebookItems.length > 0 && !classJobData.pricebookItem) {
            classJobData.pricebookItem = availablePricebookItems[0];
        }
        
        renderPricebookSelector();
        updateEnrollmentStats();
        
        // Enable customer search if pricebook item is selected
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            if (classJobData.pricebookItem) {
                enableCustomerSearch();
            }
        }, 100);
        
        return;
    }
    
    // Load existing job from localStorage
    try {
        const stored = localStorage.getItem('job_' + jobId) || localStorage.getItem('currentJob');
        if (stored) {
            const jobData = JSON.parse(stored);
            
            // Extract class-specific data
            if (jobData.classMode && jobData.classMode.enabled) {
                classJobData.id = jobData.id;
                classJobData.name = jobData.classMode.name || jobData.name || '';
                classJobData.skillLevel = jobData.classMode.skillLevel || '';
                classJobData.maxCapacity = jobData.classMode.capacity || 10;
                classJobData.waitlistEnabled = jobData.classMode.waitlistEnabled || false;
                // Convert old participants format to bookings format if needed
                if (jobData.classMode.bookings) {
                    classJobData.bookings = jobData.classMode.bookings;
                } else if (jobData.classMode.participants || jobData.participants) {
                    // Migrate old participants to bookings (1 slot per participant)
                    const oldParticipants = jobData.classMode.participants || jobData.participants || [];
                    classJobData.bookings = oldParticipants.map(p => ({
                        quoteId: p.quoteId || null,
                        slots: 1,
                        customerName: p.name || null,
                        status: p.status || 'confirmed'
                    }));
                } else {
                    classJobData.bookings = [];
                }
                classJobData.scheduleDate = jobData.scheduleDate || null;
                classJobData.startTime = jobData.scheduleTime || null;
                classJobData.endTime = jobData.endTime || null;
                classJobData.assignedStaff = jobData.assignedStaff || [];
                classJobData.status = jobData.status || 'created';
                
                // Load recurring template if exists
                if (jobData.isRecurring && jobData.recurringTemplate) {
                    classJobData.recurringTemplate = jobData.recurringTemplate;
                    classJobData.templateId = jobData.templateId;
                    classJobData.instanceNumber = jobData.instanceNumber || 1;
                }
                
                // Get single pricebook item (first one if multiple exist)
                if (jobData.classMode.pricebookItems && jobData.classMode.pricebookItems.length > 0) {
                    const pbItem = jobData.classMode.pricebookItems[0];
                    classJobData.pricebookItem = availablePricebookItems.find(pb => pb.id === pbItem.id) || pbItem;
                }
            } else {
                // Not a class job - redirect to regular job detail
                window.location.href = `job_detail.html?id=${jobId}`;
                return;
            }
        } else {
            showNotification('Class job not found', 'error');
            setTimeout(() => {
                window.location.href = 'class_group_list.html';
            }, 2000);
            return;
        }
    } catch (e) {
        console.error('Error loading class job:', e);
        showNotification('Error loading class job', 'error');
    }
    
    // Populate form
    populateForm();
    renderPricebookSelector();
    renderBookings();
    renderSelectedCustomers();
    updateEnrollmentStats();
    
    // Enable customer search if pricebook item is selected
    if (classJobData.pricebookItem) {
        enableCustomerSearch();
    }
}

// Enable customer search function
function enableCustomerSearch() {
    if (!classJobData.pricebookItem) {
        return; // No pricebook item selected
    }
    
    const searchInput = document.getElementById('customerSearchInput');
    const searchHint = document.getElementById('customerSearchHint');
    
    if (searchInput) {
        searchInput.disabled = false;
        searchInput.placeholder = `Search customers with quotes for "${classJobData.pricebookItem.name}"...`;
        searchInput.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    if (searchHint) {
        searchHint.innerHTML = `<span class="text-emerald-600">✓</span> You can now search for customers who have quotes for this pricebook item`;
        searchHint.classList.remove('text-gray-500', 'text-amber-600');
        searchHint.classList.add('text-emerald-600');
    }
}

// Populate form with loaded data
function populateForm() {
    document.getElementById('classJobTitle').textContent = classJobData.name || 'Class Job Details';
    document.getElementById('classJobId').textContent = classJobData.id;
    document.getElementById('className').value = classJobData.name;
    document.getElementById('skillLevel').value = classJobData.skillLevel;
    document.getElementById('maxCapacity').value = classJobData.maxCapacity;
    document.getElementById('waitlistEnabled').checked = classJobData.waitlistEnabled;
    document.getElementById('scheduleDate').value = classJobData.scheduleDate || '';
    document.getElementById('startTime').value = classJobData.startTime || '';
    document.getElementById('endTime').value = classJobData.endTime || '';
    // Set instructor/staff - handle both string and array
    const instructorField = document.getElementById('instructor');
    if (instructorField) {
        if (Array.isArray(classJobData.assignedStaff) && classJobData.assignedStaff.length > 0) {
            instructorField.value = classJobData.assignedStaff[0];
        } else if (typeof classJobData.assignedStaff === 'string') {
            instructorField.value = classJobData.assignedStaff;
        } else {
            instructorField.value = '';
        }
    }
    document.getElementById('jobStatus').value = classJobData.status;
    
    // Update info bar
    const confirmedSlots = (classJobData.bookings || [])
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.slots, 0);
    document.getElementById('enrollmentDisplay').textContent = `${confirmedSlots} / ${classJobData.maxCapacity} slots`;
    document.getElementById('pricebookDisplay').textContent = classJobData.pricebookItem?.name || 'Not selected';
    
    // Update status badge
    const statusConfig = {
        created: { emoji: '📝', text: 'Created', color: 'bg-gray-100 text-gray-700 border-gray-200' },
        scheduled: { emoji: '📋', text: 'Scheduled', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
        in_progress: { emoji: '🔄', text: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        completed: { emoji: '✅', text: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' },
        cancelled: { emoji: '❌', text: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' }
    };
    const status = statusConfig[classJobData.status] || statusConfig.created;
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.className = `px-3 py-1.5 text-xs font-semibold rounded-full ${status.color} border`;
    statusBadge.textContent = `${status.emoji} ${status.text}`;
    
    calculateDuration();
}

// Render pricebook selector
function renderPricebookSelector() {
    const container = document.getElementById('pricebookItemContainer');
    const searchInput = document.getElementById('pricebookSearch');
    
    if (classJobData.pricebookItem) {
        // Show selected pricebook item
        container.innerHTML = `
            <div class="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-lg">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-emerald-900">${classJobData.pricebookItem.name}</h4>
                        <p class="text-sm text-emerald-700 mt-1">${classJobData.pricebookItem.description || ''}</p>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="px-2 py-1 text-xs bg-emerald-200 text-emerald-800 rounded">${classJobData.pricebookItem.tag || 'General'}</span>
                            <span class="text-sm font-semibold text-emerald-900">$${classJobData.pricebookItem.price?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>
                    <button 
                        onclick="removePricebookItem()"
                        class="ml-4 text-red-500 hover:text-red-700"
                        title="Remove"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        document.getElementById('selectPricebookBtn').textContent = 'Change Pricebook Item';
        
        // Update info bar
        const pricebookDisplay = document.getElementById('pricebookDisplay');
        if (pricebookDisplay) {
            pricebookDisplay.textContent = classJobData.pricebookItem.name;
        }
        
        // If customer is selected, keep the panel visible
        const selectedCustomerName = document.getElementById('selectedCustomerName')?.textContent;
        if (selectedCustomerName && selectedCustomerName !== 'Customer Name') {
            const customer = sampleCustomers.find(c => c.name === selectedCustomerName);
            if (customer) {
                selectedCustomerForBooking = customer;
            }
        }
    } else {
        container.innerHTML = '<p class="text-sm text-gray-500 italic">No pricebook item selected</p>';
        document.getElementById('selectPricebookBtn').innerHTML = `
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Select Pricebook Item
        `;
        
        // Update info bar
        const pricebookDisplay = document.getElementById('pricebookDisplay');
        if (pricebookDisplay) {
            pricebookDisplay.textContent = 'Not selected';
        }
    }
    
    // Render pricebook items list in modal
    if (searchInput) {
        renderPricebookItemsList();
    }
}

// Render pricebook items list
function renderPricebookItemsList() {
    const container = document.getElementById('pricebookItemsList');
    const searchQuery = document.getElementById('pricebookSearch')?.value.toLowerCase() || '';
    
    const filtered = availablePricebookItems.filter(item => {
        return item.name.toLowerCase().includes(searchQuery) ||
               item.description?.toLowerCase().includes(searchQuery) ||
               item.tag?.toLowerCase().includes(searchQuery);
    });
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-8">No pricebook items found</p>';
        return;
    }
    
    container.innerHTML = filtered.map(item => `
        <button
            onclick="selectPricebookItem('${item.id}')"
            class="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
        >
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">${item.name}</h4>
                    <p class="text-sm text-gray-600 mt-1">${item.description || ''}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">${item.tag || 'General'}</span>
                        <span class="text-sm font-semibold text-gray-900">$${item.price?.toFixed(2) || '0.00'}</span>
                    </div>
                </div>
                ${classJobData.pricebookItem?.id === item.id ? `
                    <svg class="w-5 h-5 text-emerald-600 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                ` : ''}
            </div>
        </button>
    `).join('');
}

// Show pricebook selector modal
function showPricebookSelector() {
    document.getElementById('pricebookModal').classList.remove('hidden');
    renderPricebookItemsList();
    
    // Setup search
    const searchInput = document.getElementById('pricebookSearch');
    searchInput.addEventListener('input', renderPricebookItemsList);
}

// Close pricebook modal
function closePricebookModal() {
    document.getElementById('pricebookModal').classList.add('hidden');
}

// Select pricebook item
function selectPricebookItem(itemId) {
    const item = availablePricebookItems.find(pb => pb.id === itemId);
    if (item) {
        classJobData.pricebookItem = item;
        renderPricebookSelector();
        closePricebookModal();
        showNotification('Pricebook item selected', 'success');
        
        // Enable customer search input
        enableCustomerSearch();
    }
}

// Remove pricebook item
function removePricebookItem() {
    if (confirm('Remove the selected pricebook item? This will clear customer search.')) {
        classJobData.pricebookItem = null;
        renderPricebookSelector();
        
        // Disable customer search and clear selection
        const searchInput = document.getElementById('customerSearchInput');
        const searchHint = document.getElementById('customerSearchHint');
        const selectedPanel = document.getElementById('selectedCustomerPanel');
        
        if (searchInput) {
            searchInput.disabled = true;
            searchInput.value = '';
            searchInput.placeholder = 'Select pricebook item first, then search customers...';
        }
        if (searchHint) {
            searchHint.innerHTML = `<span class="text-amber-600">⚠️</span> Please select a pricebook item above to search for customers`;
            searchHint.classList.remove('text-emerald-600');
            searchHint.classList.add('text-gray-500');
        }
        if (selectedPanel) {
            selectedPanel.classList.add('hidden');
        }
        document.getElementById('customerAutocomplete').classList.add('hidden');
        
        showNotification('Pricebook item removed', 'info');
    }
}

// Render bookings
function renderBookings() {
    const container = document.getElementById('bookingsList');
    
    if (classJobData.bookings.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <p class="text-gray-500">No bookings yet</p>
                <p class="text-sm text-gray-400 mt-1">Book slots from quotes to manage class enrollment</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = classJobData.bookings.map((booking, index) => {
        const statusConfig = {
            confirmed: { color: 'green', icon: '✅', text: 'Confirmed' },
            pending_payment: { color: 'amber', icon: '⏳', text: 'Pending Payment' },
            waitlisted: { color: 'gray', icon: '📋', text: 'Waitlisted' }
        };
        const status = statusConfig[booking.status] || statusConfig.pending_payment;
        
        const paymentInfo = getPaymentStatusInfo(booking.paymentStatus || 'unpaid');
        const amountPaid = booking.amountPaid || 0;
        const quoteTotal = booking.quoteTotal || 0;
        
        // Format booking date
        let bookingDate = '';
        if (booking.bookedAt) {
            const date = new Date(booking.bookedAt);
            bookingDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        
        // Get quote details if available
        const customer = sampleCustomers.find(c => c.name === booking.customerName);
        const quote = customer?.quotes?.find(q => q.id === booking.quoteId);
        
        return `
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div class="p-4">
                    <!-- Header -->
                    <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                            <div class="flex items-center gap-2 flex-wrap mb-1">
                                <h3 class="text-lg font-semibold text-gray-900">${booking.customerName || 'Unknown Customer'}</h3>
                            <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-${status.color}-100 text-${status.color}-700">
                                ${status.icon} ${status.text}
                            </span>
                                <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                ${booking.slots} ${booking.slots === 1 ? 'slot' : 'slots'}
                            </span>
                        </div>
                            ${booking.customerEmail ? `
                                <p class="text-sm text-gray-500">${booking.customerEmail}</p>
                            ` : ''}
                            ${booking.note ? `
                                <p class="mt-2 text-sm text-gray-700 whitespace-pre-wrap">${booking.note}</p>
                            ` : ''}
                    </div>
                    <button 
                        onclick="removeBooking(${index})"
                            class="ml-3 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5"
                        title="Remove booking"
                    >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                            Remove
                    </button>
                    </div>
                    
                    <!-- Key Info Row -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
                        <!-- Quote -->
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Quote</p>
                            <p class="text-sm font-semibold text-gray-900">${booking.quoteId || 'N/A'}</p>
                            ${quoteTotal > 0 ? `
                                <p class="text-xs text-gray-600">${formatCurrencyDisplay(quoteTotal)}</p>
                            ` : ''}
                        </div>
                        
                        <!-- Payment Status -->
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Payment</p>
                            <div class="flex items-center gap-1.5">
                                <span class="text-sm">${paymentInfo.icon}</span>
                                <p class="text-sm font-semibold text-${paymentInfo.color}-700">${paymentInfo.label}</p>
                            </div>
                            ${quoteTotal > 0 ? `
                                <p class="text-xs text-gray-600">${formatCurrencyDisplay(amountPaid)} / ${formatCurrencyDisplay(quoteTotal)}</p>
                            ` : ''}
                        </div>
                        
                        <!-- Outstanding (if any) -->
                        ${quoteTotal > 0 && amountPaid < quoteTotal ? `
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Outstanding</p>
                                <p class="text-sm font-semibold text-amber-600">${formatCurrencyDisplay(quoteTotal - amountPaid)}</p>
                            </div>
                        ` : ''}
                        
                        <!-- Booking Date -->
                        ${bookingDate ? `
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Booked</p>
                                <p class="text-sm text-gray-700">${bookingDate}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Store selected customers (pending bookings) - similar to quote items
let selectedCustomersForBooking = [];

// Search customers (only shows customers with quotes matching selected pricebook item, and NOT already booked)
function searchCustomers(query) {
    const resultsContainer = document.getElementById('customerAutocomplete');
    const selectedPricebookItem = classJobData.pricebookItem;
    
    // Check if pricebook item is selected
    if (!selectedPricebookItem) {
        if (query && query.length >= 2) {
            resultsContainer.innerHTML = '<div class="p-3 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded">⚠️ Please select a pricebook item first to search for customers</div>';
            resultsContainer.classList.remove('hidden');
        } else {
            resultsContainer.classList.add('hidden');
        }
        return;
    }
    
    if (!query || query.trim().length < 2) {
        resultsContainer.classList.add('hidden');
        return;
    }
    
    // Trim the query
    query = query.trim();
    
    // Get list of already booked quote IDs
    const bookedQuoteIds = classJobData.bookings.map(b => b.quoteId).filter(Boolean);
    // Get map of customer ID to their selected quote IDs (for customers already in selectedCustomersForBooking)
    const selectedQuoteIdsByCustomer = selectedCustomersForBooking.reduce((map, c) => {
        if (c.selectedQuoteId) {
            if (!map.has(c.id)) map.set(c.id, []);
            map.get(c.id).push(c.selectedQuoteId);
        }
        return map;
    }, new Map());
    
    // Filter customers who:
    // 1. Match the search query (name or email)
    // 2. Have at least one approved quote with the selected pricebook item
    // 3. Show ALL quotes for the customer, but filter out:
    //    - Quotes that are already booked
    //    - Quotes that are already selected for that customer in selectedCustomersForBooking
    const matchingEntries = sampleCustomers.reduce((entries, customer) => {
        const queryLower = query.toLowerCase().trim();
        const matchesSearch = customer.name.toLowerCase().includes(queryLower) || 
                             customer.email.toLowerCase().includes(queryLower);
        
        if (!matchesSearch) return entries;
        
        // Check if customer has quotes matching the selected pricebook item
        // Make sure customer has quotes array
        if (!customer.quotes || !Array.isArray(customer.quotes)) return entries;
        
        // Get quotes that match the pricebook item and are approved
        const matchingQuotes = customer.quotes.filter(quote => 
            quote.pricebookItemId === selectedPricebookItem.id && 
            quote.status === 'approved'
        );
        
        // Filter out quotes that are already booked or already selected for this customer
        matchingQuotes.forEach(quote => {
            // Skip if quote is already booked
            if (bookedQuoteIds.includes(quote.id)) return;
            
            // Skip if quote is already selected for this customer
            const customerSelectedQuotes = selectedQuoteIdsByCustomer.get(customer.id) || [];
            if (customerSelectedQuotes.includes(quote.id)) return;
            
            entries.push({ customer, quote });
        });
        
        return entries;
    }, []);
    
    if (matchingEntries.length === 0) {
        let debugMessage = `No available quotes found for "${selectedPricebookItem.name}"`;
        if (bookedQuoteIds.length > 0) {
            debugMessage += ` (${bookedQuoteIds.length} quote${bookedQuoteIds.length > 1 ? 's' : ''} already booked)`;
        }
        
        resultsContainer.innerHTML = `
            <div class="p-3 text-sm text-gray-500">
                ${debugMessage}
            </div>
        `;
        resultsContainer.classList.remove('hidden');
        return;
    }
    
    const groupedByCustomer = matchingEntries.reduce((map, entry) => {
        if (!map.has(entry.customer.id)) {
            map.set(entry.customer.id, { customer: entry.customer, quotes: [] });
        }
        map.get(entry.customer.id).quotes.push(entry.quote);
        return map;
    }, new Map());

    resultsContainer.innerHTML = Array.from(groupedByCustomer.values()).map(group => `
        <div class="p-3 border-b border-gray-200 last:border-b-0 bg-blue-50 rounded-lg mb-2">
            <div class="flex items-center justify-between mb-2">
                <div>
                    <p class="font-semibold text-gray-900 text-sm">${group.customer.name}</p>
                    <p class="text-xs text-gray-600 mt-0.5">${group.customer.email}</p>
                </div>
                <span class="text-xs text-gray-500">${group.quotes.length} quote${group.quotes.length > 1 ? 's' : ''}</span>
            </div>
            <div class="space-y-1">
                ${group.quotes.map(quote => `
                    <button 
                        type="button"
                        onclick="selectCustomer('${group.customer.id}', '${quote.id}')"
                        class="w-full text-left px-3 py-2 border border-blue-200 rounded-lg bg-white hover:bg-blue-100 transition-colors flex items-center justify-between text-xs text-gray-700"
                    >
                        <div>
                            <p class="font-medium text-gray-900">${quote.id}</p>
                            <p class="text-[11px] text-gray-500">Quote Total: ${formatCurrencyDisplay(quote.total)}</p>
                    </div>
                        <div class="text-right text-[11px] text-gray-600">
                            <p>${quote.slots} slot${quote.slots > 1 ? 's' : ''} available</p>
                </div>
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    resultsContainer.classList.remove('hidden');
}

// Search staff members
function searchStaff(query) {
    const resultsContainer = document.getElementById('staffAutocomplete');
    
    if (!query || query.trim().length < 2) {
        resultsContainer.classList.add('hidden');
        return;
    }
    
    const queryLower = query.toLowerCase().trim();
    const filtered = sampleStaff.filter(staff => 
        staff.name.toLowerCase().includes(queryLower) || 
        staff.email.toLowerCase().includes(queryLower) ||
        staff.role.toLowerCase().includes(queryLower) ||
        staff.department.toLowerCase().includes(queryLower)
    );
    
    if (filtered.length === 0) {
        resultsContainer.innerHTML = `
            <div class="p-3 text-sm text-gray-500">
                No staff members found
            </div>
        `;
        resultsContainer.classList.remove('hidden');
        return;
    }
    
    resultsContainer.innerHTML = filtered.map(staff => `
        <div 
            onclick="selectStaff('${staff.id}')"
            class="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
        >
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <p class="font-medium text-gray-900 text-sm">${staff.name}</p>
                    <p class="text-xs text-gray-600 mt-0.5">${staff.email}</p>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">${staff.role}</span>
                        <span class="text-xs text-gray-500">${staff.department}</span>
                    </div>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </div>
    `).join('');
    
    resultsContainer.classList.remove('hidden');
}

// Select staff member
function selectStaff(staffId) {
    const staff = sampleStaff.find(s => s.id === staffId);
    if (!staff) return;
    
    // Set the instructor field value
    const instructorField = document.getElementById('instructor');
    if (instructorField) {
        instructorField.value = staff.name;
    }
    
    // Hide autocomplete
    document.getElementById('staffAutocomplete').classList.add('hidden');
    
    // Update classJobData
    classJobData.assignedStaff = [staff.name];
}

// Store current quick book customer
let currentQuickBookCustomer = null;

// Select customer - shows quick book form
function selectCustomer(customerId, initialQuoteId = null) {
    const customer = sampleCustomers.find(c => c.id === customerId);
    if (!customer || !initialQuoteId) return;
    
    // Check if this specific quote is already booked
    const bookedQuoteIds = classJobData.bookings.map(b => b.quoteId).filter(Boolean);
    
    if (bookedQuoteIds.includes(initialQuoteId)) {
        showNotification('This quote is already booked', 'warning');
        return;
    }
    
    // Get matching quotes for this customer
    const selectedPricebookItem = classJobData.pricebookItem;
    const matchingQuotes = customer.quotes.filter(quote => 
        quote.pricebookItemId === selectedPricebookItem.id && 
        quote.status === 'approved'
    );
    const selectedQuote = matchingQuotes.find(q => q.id === initialQuoteId);
    
    if (!selectedQuote) {
        showNotification('Quote not found', 'error');
        return;
    }
    
    const paymentStatus = selectedQuote?.paymentStatus || 'unpaid';
    const amountPaid = selectedQuote?.amountPaid || 0;
    
    // Store current quick book customer
    currentQuickBookCustomer = {
        ...customer,
        matchingQuotes: matchingQuotes,
        selectedQuoteId: initialQuoteId,
        paymentStatus,
        amountPaid,
        quoteTotal: selectedQuote?.total || 0,
        slots: 1
    };
    
    // Hide autocomplete and clear search
    document.getElementById('customerAutocomplete').classList.add('hidden');
    document.getElementById('customerSearchInput').value = '';
    
    // Show quick book form
    showQuickBookForm();
}

// Show quick book form
function showQuickBookForm() {
    if (!currentQuickBookCustomer) return;
    
    const form = document.getElementById('quickBookForm');
    const customerName = document.getElementById('quickBookCustomerName');
    const customerEmail = document.getElementById('quickBookCustomerEmail');
    const quoteDisplay = document.getElementById('quickBookQuoteDisplay');
    const slotsInput = document.getElementById('quickBookSlots');
    const paymentStatusDisplay = document.getElementById('quickBookPaymentStatus');
    
    // Set customer info
    customerName.textContent = currentQuickBookCustomer.name;
    customerEmail.textContent = currentQuickBookCustomer.email;
    
    // Set quote info
    const selectedQuote = currentQuickBookCustomer.matchingQuotes.find(q => q.id === currentQuickBookCustomer.selectedQuoteId);
    quoteDisplay.innerHTML = `
        <div class="flex items-center justify-between text-sm font-semibold text-emerald-900">
            <span>${currentQuickBookCustomer.selectedQuoteId}</span>
            <span>${formatCurrencyDisplay(currentQuickBookCustomer.quoteTotal)}</span>
        </div>
        ${selectedQuote ? `
            <div class="flex items-center gap-2 text-xs text-emerald-700 mt-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>${selectedQuote.slots} slot${selectedQuote.slots === 1 ? '' : 's'} available</span>
            </div>
        ` : ''}
    `;
    
    // Set slots (max available from quote)
    const maxSlots = selectedQuote?.slots || 1;
    slotsInput.max = maxSlots;
    slotsInput.value = Math.min(currentQuickBookCustomer.slots || 1, maxSlots);
    
    // Set payment status
    const paymentInfo = getPaymentStatusInfo(currentQuickBookCustomer.paymentStatus);
    paymentStatusDisplay.innerHTML = `
        <div class="flex items-center gap-2 text-sm font-semibold text-${paymentInfo.color}-800">
            <span>${paymentInfo.icon}</span>
            <span>${paymentInfo.label}</span>
        </div>
        <p class="text-xs text-gray-600 mt-1">Paid ${formatCurrencyDisplay(currentQuickBookCustomer.amountPaid)} of ${formatCurrencyDisplay(currentQuickBookCustomer.quoteTotal)}</p>
    `;
    
    // Show form
    form.classList.remove('hidden');
}

// Clear quick book form
function clearQuickBook() {
    currentQuickBookCustomer = null;
    document.getElementById('quickBookForm').classList.add('hidden');
    document.getElementById('customerSearchInput').value = '';
    const slotsInput = document.getElementById('quickBookSlots');
    if (slotsInput) {
        slotsInput.value = 1;
    }
    const notesInput = document.getElementById('quickBookNotes');
    if (notesInput) {
        notesInput.value = '';
    }
}

// Update quick book slots
function updateQuickBookSlots(value) {
    if (!currentQuickBookCustomer) return;
    
    const slots = parseInt(value) || 1;
    const selectedQuote = currentQuickBookCustomer.matchingQuotes.find(q => q.id === currentQuickBookCustomer.selectedQuoteId);
    
    // Validate against quote's available slots
    if (selectedQuote && slots > selectedQuote.slots) {
        showNotification(`Maximum ${selectedQuote.slots} slots available from this quote`, 'warning');
        document.getElementById('quickBookSlots').value = selectedQuote.slots;
        currentQuickBookCustomer.slots = selectedQuote.slots;
    } else {
        currentQuickBookCustomer.slots = slots;
    }
}

// Book quick customer
function bookQuickCustomer() {
    if (!currentQuickBookCustomer) return;
    
    const slotsInput = document.getElementById('quickBookSlots');
    const slots = parseInt(slotsInput.value) || 1;
    const notesInput = document.getElementById('quickBookNotes');
    const bookingNote = notesInput ? notesInput.value.trim() : '';
    
    // Update current customer slots and note
    currentQuickBookCustomer.slots = slots;
    currentQuickBookCustomer.bookingNote = bookingNote;
    
    // Create a temporary customer object for booking
    const tempCustomer = {
        ...currentQuickBookCustomer,
        slots: slots,
        bookingNote
    };
    
    // Use the existing booking logic
    const index = 0; // Dummy index for the booking function
    selectedCustomersForBooking = [tempCustomer];
    bookSelectedCustomer(0);
}

// Remove selected customer (before booking)
function removeSelectedCustomer(customerId) {
    selectedCustomersForBooking = selectedCustomersForBooking.filter(c => c.id !== customerId);
    renderSelectedCustomers();
}

// Render selected customers (similar to quote items)
function renderSelectedCustomers() {
    const emptyState = document.getElementById('emptyCustomerState');
    const container = document.getElementById('selectedCustomersContainer');
    
    if (selectedCustomersForBooking.length === 0) {
        emptyState.classList.remove('hidden');
        container.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    container.classList.remove('hidden');
    
    container.innerHTML = selectedCustomersForBooking.map((customer, index) => {
        const matchingQuotes = customer.matchingQuotes || [];
        const selectedQuote = matchingQuotes.find(q => q.id === customer.selectedQuoteId);
        
        return `
            <div class="relative bg-white border border-emerald-200 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden">
                <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400"></div>
                <div class="p-5 space-y-4">
                <!-- Header Row -->
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-[11px] uppercase tracking-[0.3em] text-emerald-500 font-semibold mb-1">Selected Customer</p>
                            <div class="flex items-center gap-2 flex-wrap">
                                <h3 class="text-xl font-semibold text-gray-900">${customer.name}</h3>
                                <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ${matchingQuotes.length} quote${matchingQuotes.length !== 1 ? 's' : ''} available
                                </span>
                        </div>
                            <p class="text-sm text-gray-500 mt-1">${customer.email}</p>
                    </div>
                    <button 
                        onclick="removeSelectedCustomer('${customer.id}')"
                            class="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove customer"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <!-- Booking Details Grid -->
                    <div class="grid gap-4 md:grid-cols-3">
                        <div>
                            <label class="text-xs text-gray-500 block mb-1">Quote</label>
                            ${customer.selectedQuoteId ? `
                                <div class="p-4 border border-emerald-200 rounded-xl bg-gradient-to-br from-emerald-50 to-white">
                                    <div class="flex items-center justify-between text-sm font-semibold text-emerald-900">
                                        <span>${customer.selectedQuoteId}</span>
                                        <span>${formatCurrencyDisplay(selectedQuote?.total || 0)}</span>
                    </div>
                                    <div class="flex items-center gap-2 text-xs text-emerald-700 mt-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>${selectedQuote?.slots || 0} slot${(selectedQuote?.slots || 0) === 1 ? '' : 's'} available</span>
                                    </div>
                                </div>
                            ` : `
                                <div class="p-4 border border-amber-200 rounded-xl bg-amber-50 text-xs text-amber-700">
                                    No matching quote found for this pricebook item.
                                </div>
                            `}
                        </div>
                        <div>
                        <label class="text-xs text-gray-500 block mb-1">Number of Slots <span class="text-red-500">*</span></label>
                            <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <input 
                            type="number"
                            value="${customer.slots}"
                            onchange="updateSelectedCustomerSlots(${index}, this.value)"
                                    class="w-full px-3 py-2 text-center text-lg font-semibold text-gray-900 focus:outline-none"
                            min="1"
                            max="20"
                        />
                    </div>
                            <p class="text-[11px] text-gray-400 mt-1 text-center">Adjust seats to allocate</p>
                    </div>
                        <div>
                            <label class="text-xs text-gray-500 block mb-1">Payment Status</label>
                            ${(() => {
                                const info = getPaymentStatusInfo(customer.paymentStatus);
                                return `
                                    <div class="p-4 border border-${info.color}-200 rounded-xl bg-${info.color}-50">
                                        <div class="flex items-center gap-2 text-sm font-semibold text-${info.color}-800">
                                            <span>${info.icon}</span>
                                            <span>${info.label}</span>
                                        </div>
                                        <p class="text-xs text-gray-600 mt-1">Paid ${formatCurrencyDisplay(customer.amountPaid)} of ${formatCurrencyDisplay(customer.quoteTotal)}</p>
                                    </div>
                                `;
                            })()}
                        </div>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
                        <p class="text-xs text-gray-500 text-center sm:text-left">Booking auto-checks capacity before confirming seats.</p>
                        <button 
                            onclick="bookSelectedCustomer(${index})"
                            class="w-full sm:w-auto px-5 py-2 rounded-xl text-sm font-semibold transition-all ${!customer.selectedQuoteId ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-emerald-600 text-white hover:-translate-y-0.5 hover:shadow-lg'}"
                            ${!customer.selectedQuoteId ? 'disabled' : ''}
                        >
                            Book Slots
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Update selected customer quote
function updateSelectedCustomerQuote(index, quoteId) {
    if (selectedCustomersForBooking[index]) {
        selectedCustomersForBooking[index].selectedQuoteId = quoteId;
        // Auto-set slots to quote's available slots if quote selected
        if (quoteId) {
            const customer = selectedCustomersForBooking[index];
            const quote = customer.matchingQuotes.find(q => q.id === quoteId);
            if (quote) {
                customer.slots = Math.min(customer.slots || 1, quote.slots);
            }
        }
        renderSelectedCustomers();
    }
}

// Update selected customer slots
function updateSelectedCustomerSlots(index, value) {
    if (selectedCustomersForBooking[index]) {
        const slots = parseInt(value) || 1;
        const customer = selectedCustomersForBooking[index];
        
        // Validate against quote's available slots
        if (customer.selectedQuoteId) {
            const quote = customer.matchingQuotes.find(q => q.id === customer.selectedQuoteId);
            if (quote && slots > quote.slots) {
                showNotification(`Maximum ${quote.slots} slots available from this quote`, 'warning');
                selectedCustomersForBooking[index].slots = quote.slots;
            } else {
                selectedCustomersForBooking[index].slots = slots;
            }
        } else {
            selectedCustomersForBooking[index].slots = slots;
        }
        renderSelectedCustomers();
    }
}

// Book selected customer
function bookSelectedCustomer(index) {
    // Validate index
    if (index < 0 || index >= selectedCustomersForBooking.length) {
        console.error('Invalid customer index:', index);
        showNotification('Error: Invalid customer selection', 'error');
        return;
    }
    
    const customer = selectedCustomersForBooking[index];
    
    if (!customer) {
        console.error('Customer not found at index:', index);
        showNotification('Error: Customer not found', 'error');
        return;
    }
    
    if (!customer.selectedQuoteId) {
        showNotification('Please select a quote ID', 'error');
        return;
    }
    
    const slots = customer.slots || 1;
    const status = 'confirmed';
    
    // Check if quote already booked
    const existingBooking = classJobData.bookings.find(b => b.quoteId === customer.selectedQuoteId);
    if (existingBooking) {
        if (!confirm(`Quote ${customer.selectedQuoteId} is already booked for ${existingBooking.slots} slot(s). Replace with ${slots} slot(s)?`)) {
            return;
        }
        // Remove existing booking
        const bookingIndex = classJobData.bookings.indexOf(existingBooking);
        classJobData.bookings.splice(bookingIndex, 1);
    }
    
    // Check capacity
    const totalConfirmedSlots = classJobData.bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.slots, 0);
    
    const totalAfterBooking = status === 'confirmed' ? totalConfirmedSlots + slots : totalConfirmedSlots;
    
    let finalStatus = status;
    if (status === 'confirmed' && totalAfterBooking > classJobData.maxCapacity) {
        if (!classJobData.waitlistEnabled) {
            showNotification(`Class capacity is ${classJobData.maxCapacity} slots. Current bookings: ${totalConfirmedSlots} slots. Cannot add ${slots} more slot(s).`, 'error');
            return;
        }
        if (!confirm(`Class capacity is ${classJobData.maxCapacity} slots. Adding ${slots} slot(s) will exceed capacity. Add as waitlisted instead?`)) {
            return;
        }
        finalStatus = 'waitlisted';
    }
    
    // Get quote details for additional info
    const quote = customer.matchingQuotes?.find(q => q.id === customer.selectedQuoteId);
    
    const booking = {
        id: 'booking-' + Date.now(),
        quoteId: customer.selectedQuoteId,
        slots: slots,
        customerName: customer.name,
        customerEmail: customer.email,
        status: finalStatus,
        paymentStatus: customer.paymentStatus || 'unpaid',
        amountPaid: customer.amountPaid || 0,
        quoteTotal: quote?.total || customer.quoteTotal || 0,
        bookedAt: new Date().toISOString(),
        note: customer.bookingNote || ''
    };
    
    classJobData.bookings.push(booking);
    renderBookings();
    updateEnrollmentStats();
    
    // Remove from selected customers
    selectedCustomersForBooking.splice(index, 1);
    
    // Clear quick book form if it was used
    if (currentQuickBookCustomer && currentQuickBookCustomer.selectedQuoteId === customer.selectedQuoteId) {
        clearQuickBook();
    } else {
    renderSelectedCustomers();
    }
    
    showNotification(`Booked ${slots} slot(s) from ${customer.selectedQuoteId}`, 'success');
}



// Remove booking by quote ID
function removeBookingByQuote(quoteId) {
    const booking = classJobData.bookings.find(b => b.quoteId === quoteId);
    if (!booking) return;
    
    if (confirm(`Remove booking for ${quoteId} (${booking.slots} slot(s))?`)) {
        const index = classJobData.bookings.indexOf(booking);
        classJobData.bookings.splice(index, 1);
        renderBookings();
        updateEnrollmentStats();
        
        // Refresh matching quotes
        const customerName = booking.customerName;
        const customer = sampleCustomers.find(c => c.name === customerName);
        if (customer) {
            renderMatchingQuotes(customer);
        }
        
        showNotification('Booking removed', 'info');
    }
}


// Remove booking
function removeBooking(index) {
    const booking = classJobData.bookings[index];
    const bookingInfo = booking.quoteId 
        ? `${booking.customerName} - ${booking.quoteId} (${booking.slots} slot(s))`
        : `${booking.customerName} (${booking.slots} slot(s) - manual booking)`;
    
    if (confirm(`Remove booking for ${bookingInfo}?`)) {
        classJobData.bookings.splice(index, 1);
        renderBookings();
        updateEnrollmentStats();
        
        // Refresh matching quotes if customer is selected
        if (selectedCustomerForBooking && booking.customerName === selectedCustomerForBooking.name) {
            renderMatchingQuotes(selectedCustomerForBooking);
        }
        
        showNotification('Booking removed', 'info');
    }
}

// Update enrollment statistics
function updateEnrollmentStats() {
    const maxCapacity = parseInt(document.getElementById('maxCapacity').value) || 0;
    classJobData.maxCapacity = maxCapacity;
    
    // Calculate slots from bookings
    const totalSlots = classJobData.bookings.reduce((sum, b) => sum + b.slots, 0);
    const confirmedSlots = classJobData.bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.slots, 0);
    const pendingSlots = classJobData.bookings
        .filter(b => b.status === 'pending_payment')
        .reduce((sum, b) => sum + b.slots, 0);
    const waitlistedSlots = classJobData.bookings
        .filter(b => b.status === 'waitlisted')
        .reduce((sum, b) => sum + b.slots, 0);
    
    const occupancyPercent = maxCapacity > 0 ? Math.round((confirmedSlots / maxCapacity) * 100) : 0;
    
    // Update displays (showing slots instead of participants)
    document.getElementById('enrollmentCount').textContent = `${totalSlots} / ${maxCapacity} slots`;
    document.getElementById('capacityDisplay').textContent = `${confirmedSlots} / ${maxCapacity} slots`;
    document.getElementById('confirmedCount').textContent = `${confirmedSlots} slots`;
    document.getElementById('pendingCount').textContent = `${pendingSlots} slots`;
    document.getElementById('waitlistedCount').textContent = `${waitlistedSlots} slots`;
    
    // Update info bar enrollment
    const enrollmentDisplay = document.getElementById('enrollmentDisplay');
    if (enrollmentDisplay) {
        enrollmentDisplay.textContent = `${confirmedSlots} / ${maxCapacity} slots`;
    }
    
    // Update progress bars
    const enrollmentBar = document.getElementById('enrollmentProgressBar');
    const capacityBar = document.getElementById('capacityProgressBar');
    
    if (enrollmentBar) {
        enrollmentBar.style.width = `${Math.min(occupancyPercent, 100)}%`;
        enrollmentBar.className = `h-full enrollment-progress ${
            occupancyPercent >= 100 ? 'bg-purple-500' : 
            occupancyPercent >= 80 ? 'bg-amber-500' : 
            'bg-emerald-500'
        }`;
    }
    
    if (capacityBar) {
        capacityBar.style.width = `${Math.min(occupancyPercent, 100)}%`;
    }
    
    // Update percentage and waitlist
    document.getElementById('enrollmentPercent').textContent = `${occupancyPercent}% full`;
    const waitlistEl = document.getElementById('waitlistCount');
    if (waitlistedSlots > 0) {
        waitlistEl.textContent = `${waitlistedSlots} slots waitlisted`;
        waitlistEl.classList.remove('hidden');
    } else {
        waitlistEl.textContent = '';
        waitlistEl.classList.add('hidden');
    }
}

// Calculate duration
function calculateDuration() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const durationEl = document.getElementById('durationDisplay');
    
    if (startTime && endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        const diffMs = end - start;
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.round((diffMs % 3600000) / 60000);
        
        if (diffMs > 0) {
            durationEl.textContent = `Duration: ${diffHrs}h ${diffMins}m`;
            classJobData.startTime = startTime;
            classJobData.endTime = endTime;
        } else {
            durationEl.textContent = 'Duration: Invalid time range';
        }
    } else {
        durationEl.textContent = 'Duration: --';
    }
}

// Save class job
function saveClassJob() {
    // Validate required fields
    const className = document.getElementById('className').value.trim();
    if (!className) {
        showNotification('Please enter a class name', 'error');
        document.getElementById('className').focus();
        return;
    }
    
    if (!classJobData.pricebookItem) {
        showNotification('Please select a pricebook item', 'error');
        showPricebookSelector();
        return;
    }
    
    const maxCapacity = parseInt(document.getElementById('maxCapacity').value);
    if (!maxCapacity || maxCapacity < 1) {
        showNotification('Please set a valid capacity (at least 1)', 'error');
        document.getElementById('maxCapacity').focus();
        return;
    }
    
    // Collect form data
    classJobData.name = className;
    classJobData.skillLevel = document.getElementById('skillLevel').value.trim();
    classJobData.maxCapacity = maxCapacity;
    classJobData.waitlistEnabled = document.getElementById('waitlistEnabled').checked;
    classJobData.scheduleDate = document.getElementById('scheduleDate').value;
    classJobData.startTime = document.getElementById('startTime').value;
    classJobData.endTime = document.getElementById('endTime').value;
    classJobData.status = document.getElementById('jobStatus').value;
    
    const instructor = document.getElementById('instructor').value.trim();
    if (instructor) {
        classJobData.assignedStaff = [instructor];
    }
    
    // Collect recurring configuration if enabled
    const isRecurring = document.getElementById('enableRecurring')?.checked || false;
    let recurringTemplate = null;
    
    if (isRecurring) {
        const interval = parseInt(document.getElementById('recurringInterval')?.value) || 1;
        const frequency = document.getElementById('recurringFrequency')?.value || 'weeks';
        const endCondition = document.querySelector('input[name="recurringEndCondition"]:checked')?.value || 'date';
        const autoCreateDays = parseInt(document.getElementById('recurringAutoCreateDays')?.value) || 7;
        
        const selectedDays = [];
        if (frequency === 'weeks') {
            document.querySelectorAll('.recurring-day-selector.active').forEach(btn => {
                selectedDays.push(btn.dataset.day);
            });
        }
        
        let endDate = null;
        let numberOfOccurrences = null;
        
        if (endCondition === 'date') {
            endDate = document.getElementById('recurringEndDate')?.value;
        } else if (endCondition === 'occurrences') {
            numberOfOccurrences = parseInt(document.getElementById('recurringNumberOfOccurrences')?.value) || 12;
        }
        
        // Generate template ID
        const timestamp = Date.now();
        const templateId = 'RJT-CLASS-' + String(timestamp).slice(-6);
        
        recurringTemplate = {
            frequency: frequency,
            interval: interval,
            selectedDays: selectedDays,
            endCondition: endCondition,
            endDate: endDate,
            numberOfOccurrences: numberOfOccurrences,
            autoCreateDays: autoCreateDays,
            status: 'active',
            generatedJobs: [classJobData.id],
            nextJobDate: calculateNextOccurrences(frequency, interval, 1)[0] || classJobData.scheduleDate
        };
        
        classJobData.templateId = templateId;
        classJobData.instanceNumber = 1;
    }
    
    // Calculate total slots booked
    const totalSlots = classJobData.bookings.reduce((sum, b) => sum + b.slots, 0);
    
    // Build job data structure compatible with job_detail.html
    const jobData = {
        id: classJobData.id,
        name: classJobData.name,
        status: classJobData.status,
        scheduleDate: classJobData.scheduleDate,
        scheduleTime: classJobData.startTime,
        endTime: classJobData.endTime,
        assignedStaff: classJobData.assignedStaff,
        total: classJobData.pricebookItem?.price ? 
            (classJobData.pricebookItem.price * totalSlots) : 0,
        isRecurring: isRecurring,
        recurringTemplate: recurringTemplate,
        templateId: classJobData.templateId,
        instanceNumber: classJobData.instanceNumber,
        classMode: {
            enabled: true,
            name: classJobData.name,
            capacity: classJobData.maxCapacity,
            waitlistEnabled: classJobData.waitlistEnabled,
            skillLevel: classJobData.skillLevel,
            bookings: classJobData.bookings,
            pricebookItems: classJobData.pricebookItem ? [classJobData.pricebookItem] : []
        },
        bookings: classJobData.bookings
    };
    
    // Save to localStorage
    localStorage.setItem('currentJob', JSON.stringify(jobData));
    localStorage.setItem('job_' + jobData.id, JSON.stringify(jobData));
    
    // Update class list
    try {
        const existingClasses = JSON.parse(localStorage.getItem('classGroupJobs') || '[]');
        const existingIndex = existingClasses.findIndex(c => c.id === jobData.id);
        if (existingIndex >= 0) {
            existingClasses[existingIndex] = jobData;
        } else {
            existingClasses.push(jobData);
        }
        localStorage.setItem('classGroupJobs', JSON.stringify(existingClasses));
    } catch (e) {
        console.error('Error saving to class list:', e);
    }
    
    showNotification('Class job saved successfully!', 'success');
    
    // Update page title
    document.getElementById('classJobTitle').textContent = classJobData.name;
}

// View on schedule
function viewOnSchedule() {
    if (classJobData.id) {
        window.location.href = `job_schedule.html?highlight=${classJobData.id}`;
    } else {
        window.location.href = 'job_schedule.html';
    }
}

// Export roster
function exportRoster() {
    if (classJobData.bookings.length === 0) {
        showNotification('No bookings to export', 'info');
        return;
    }
    
    // Simple CSV export
    const csv = [
        ['Quote ID', 'Customer Name', 'Slots', 'Status'].join(','),
        ...classJobData.bookings.map(b => [
            b.quoteId || '',
            b.customerName || '',
            b.slots,
            b.status
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class-bookings-${classJobData.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Bookings exported successfully', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-orange-500'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ============================================================================
// RECURRING SCHEDULING FUNCTIONS
// ============================================================================

// Toggle recurring configuration section
function toggleRecurringSection() {
    const checkbox = document.getElementById('enableRecurring');
    const section = document.getElementById('recurringConfigSection');
    const toggle = document.getElementById('recurringToggle');
    const icon = document.getElementById('recurringIcon');
    const description = document.getElementById('recurringDescription');
    
    if (checkbox.checked) {
        // Show section with animation
        section.classList.remove('hidden');
        setTimeout(() => {
            section.classList.add('show');
        }, 10);
        
        // Update description
        description.textContent = 'Recurring schedule is active';
        description.classList.add('text-blue-600', 'font-medium');
        
        // Set default end date to 6 months from now
        const defaultEnd = new Date();
        defaultEnd.setMonth(defaultEnd.getMonth() + 6);
        const endDateInput = document.getElementById('recurringEndDate');
        if (endDateInput) {
            endDateInput.value = defaultEnd.toISOString().split('T')[0];
        }
        updateRecurringPreview();
    } else {
        // Hide section with animation
        section.classList.remove('show');
        setTimeout(() => {
            section.classList.add('hidden');
        }, 300);
        
        // Reset description
        description.textContent = 'Set up automatic recurring schedule';
        description.classList.remove('text-blue-600', 'font-medium');
    }
}

// Toggle day of week container visibility
function toggleDayOfWeekContainer() {
    const frequency = document.getElementById('recurringFrequency').value;
    const container = document.getElementById('dayOfWeekContainer');
    
    if (frequency === 'weeks') {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
    updateRecurringPreview();
}

// Toggle day selection for recurring
function toggleRecurringDaySelection(button) {
    const wasActive = button.classList.contains('active');
    
    button.classList.toggle('active');
    button.classList.toggle('border-blue-500');
    button.classList.toggle('bg-blue-500');
    button.classList.toggle('text-white');
    button.classList.toggle('border-gray-300');
    button.classList.toggle('bg-white');
    button.classList.toggle('text-gray-700');
    
    // Add visual feedback
    if (!wasActive) {
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    }
    
    updateRecurringPreview();
}

// Toggle recurring end condition visibility
function toggleRecurringEndCondition() {
    const endCondition = document.querySelector('input[name="recurringEndCondition"]:checked')?.value || 'date';
    const endDateInput = document.getElementById('recurringEndDate');
    const occurrencesInput = document.getElementById('recurringNumberOfOccurrences');
    
    if (endDateInput && occurrencesInput) {
        if (endCondition === 'date') {
            endDateInput.disabled = false;
            occurrencesInput.disabled = true;
        } else if (endCondition === 'occurrences') {
            endDateInput.disabled = true;
            occurrencesInput.disabled = false;
        } else {
            endDateInput.disabled = true;
            occurrencesInput.disabled = true;
        }
    }
    updateRecurringPreview();
}

// Update recurring preview
function updateRecurringPreview() {
    const interval = parseInt(document.getElementById('recurringInterval')?.value) || 1;
    const frequency = document.getElementById('recurringFrequency')?.value || 'weeks';
    const endCondition = document.querySelector('input[name="recurringEndCondition"]:checked')?.value || 'date';
    const previewEl = document.getElementById('recurringPreview');
    const occurrencesEl = document.getElementById('recurringUpcomingOccurrences');
    
    if (!previewEl) return;
    
    // Build frequency text
    let frequencyText = '';
    if (frequency === 'days') {
        frequencyText = interval === 1 ? 'Every day' : `Every ${interval} days`;
    } else if (frequency === 'weeks') {
        const selectedDays = [];
        document.querySelectorAll('.recurring-day-selector.active').forEach(btn => {
            selectedDays.push(btn.dataset.day);
        });
        if (selectedDays.length > 0) {
            const dayAbbrs = selectedDays.map(day => day.substring(0, 3));
            if (interval === 1) {
                frequencyText = `Every ${dayAbbrs.join(', ')}`;
            } else {
                frequencyText = `Every ${interval} weeks on ${dayAbbrs.join(', ')}`;
            }
        } else {
            frequencyText = interval === 1 ? 'Every week' : `Every ${interval} weeks`;
        }
    } else if (frequency === 'months') {
        frequencyText = interval === 1 ? 'Every month' : `Every ${interval} months`;
    }
    
    // Build end condition text
    let endText = '';
    if (endCondition === 'never') {
        endText = ' (never ends)';
    } else if (endCondition === 'date') {
        const endDate = document.getElementById('recurringEndDate')?.value;
        if (endDate) {
            const date = new Date(endDate);
            endText = ` until ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
    } else if (endCondition === 'occurrences') {
        const occurrences = parseInt(document.getElementById('recurringNumberOfOccurrences')?.value) || 12;
        endText = ` (${occurrences} occurrences)`;
    }
    
    // Update preview
    previewEl.textContent = frequencyText + endText;
    
    // Calculate and show next 5 occurrences
    if (occurrencesEl) {
        const occurrences = calculateNextOccurrences(frequency, interval, 5);
        if (occurrences.length > 0) {
            occurrencesEl.innerHTML = '<div class="font-semibold mb-2 text-emerald-800">📅 Next 5 occurrences:</div>' +
                occurrences.map((date, idx) => {
                    const dateObj = new Date(date);
                    const isToday = dateObj.toDateString() === new Date().toDateString();
                    return `<div class="flex items-center gap-2 ${isToday ? 'font-semibold text-emerald-900' : ''}">
                        <span class="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-800">${idx + 1}</span>
                        <span>${dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        ${isToday ? '<span class="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">Today</span>' : ''}
                    </div>`;
                }).join('');
        } else {
            occurrencesEl.innerHTML = '<div class="text-gray-500 italic">No upcoming occurrences</div>';
        }
    }
}

// Calculate next N occurrences
function calculateNextOccurrences(frequency, interval, count) {
    const occurrences = [];
    const today = new Date();
    let currentDate = new Date(today);
    
    // Get selected days for weekly
    const selectedDays = [];
    if (frequency === 'weeks') {
        document.querySelectorAll('.recurring-day-selector.active').forEach(btn => {
            selectedDays.push(btn.dataset.day);
        });
    }
    
    // Get start date from schedule
    const scheduleDate = document.getElementById('scheduleDate')?.value;
    if (scheduleDate) {
        currentDate = new Date(scheduleDate);
    }
    
    for (let i = 0; i < count; i++) {
        if (frequency === 'days') {
            currentDate.setDate(currentDate.getDate() + (i === 0 ? interval : interval));
        } else if (frequency === 'weeks') {
            if (selectedDays.length > 0) {
                // Find next occurrence of selected day
                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const dayIndex = dayNames.indexOf(selectedDays[i % selectedDays.length]);
                const currentDay = currentDate.getDay();
                let daysUntil = (dayIndex - currentDay + 7) % 7;
                if (daysUntil === 0 && i > 0) daysUntil = 7;
                currentDate.setDate(currentDate.getDate() + daysUntil);
            } else {
                currentDate.setDate(currentDate.getDate() + (7 * interval));
            }
        } else if (frequency === 'months') {
            currentDate.setMonth(currentDate.getMonth() + (i === 0 ? interval : interval));
        }
        
        occurrences.push(currentDate.toISOString().split('T')[0]);
    }
    
    return occurrences;
}

// Close autocomplete when clicking outside
document.addEventListener('click', function(e) {
    const customerAutocomplete = document.getElementById('customerAutocomplete');
    const customerSearchInput = document.getElementById('customerSearchInput');
    const staffAutocomplete = document.getElementById('staffAutocomplete');
    const instructorInput = document.getElementById('instructor');
    
    if (customerAutocomplete && !customerAutocomplete.contains(e.target) && e.target !== customerSearchInput) {
        customerAutocomplete.classList.add('hidden');
    }
    
    if (staffAutocomplete && !staffAutocomplete.contains(e.target) && e.target !== instructorInput) {
        staffAutocomplete.classList.add('hidden');
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadClassJobData();
    
    // Ensure search is enabled after DOM is fully loaded
    setTimeout(() => {
        if (classJobData.pricebookItem) {
            enableCustomerSearch();
        }
    }, 200);
    
    // Setup event listeners
    document.getElementById('maxCapacity').addEventListener('input', updateEnrollmentStats);
    
    // Listen for manual customer name input
    const manualNameInput = document.getElementById('manualCustomerName');
    if (manualNameInput) {
        manualNameInput.addEventListener('input', function() {
            if (isManualEntryMode) {
                showBookingFormForManualEntry();
            }
        });
    }
    document.getElementById('waitlistEnabled').addEventListener('change', function() {
        classJobData.waitlistEnabled = this.checked;
    });
    
    // Ensure customer search is enabled if pricebook item is selected
    if (classJobData.pricebookItem) {
        enableCustomerSearch();
    }
    
    // Initialize recurring section
    const defaultEnd = new Date();
    defaultEnd.setMonth(defaultEnd.getMonth() + 6);
    const endDateInput = document.getElementById('recurringEndDate');
    if (endDateInput) {
        endDateInput.value = defaultEnd.toISOString().split('T')[0];
    }
    
    // Initialize end condition
    toggleRecurringEndCondition();
    
    // Load existing recurring config if present
    if (classJobData.recurringTemplate) {
        document.getElementById('enableRecurring').checked = true;
        toggleRecurringSection();
        // Populate recurring fields from existing template
        const template = classJobData.recurringTemplate;
        if (document.getElementById('recurringInterval')) {
            document.getElementById('recurringInterval').value = template.interval || 1;
        }
        if (document.getElementById('recurringFrequency')) {
            document.getElementById('recurringFrequency').value = template.frequency || 'weeks';
            toggleDayOfWeekContainer();
        }
        if (template.selectedDays) {
            template.selectedDays.forEach(day => {
                const button = document.querySelector(`.recurring-day-selector[data-day="${day}"]`);
                if (button && !button.classList.contains('active')) {
                    toggleRecurringDaySelection(button);
                }
            });
        }
        if (document.getElementById('recurringEndDate') && template.endDate) {
            document.getElementById('recurringEndDate').value = template.endDate;
        }
        if (document.getElementById('recurringNumberOfOccurrences') && template.numberOfOccurrences) {
            document.getElementById('recurringNumberOfOccurrences').value = template.numberOfOccurrences;
        }
        if (document.getElementById('recurringAutoCreateDays') && template.autoCreateDays) {
            document.getElementById('recurringAutoCreateDays').value = template.autoCreateDays;
        }
        const endConditionRadio = document.querySelector(`input[name="recurringEndCondition"][value="${template.endCondition || 'date'}"]`);
        if (endConditionRadio) {
            endConditionRadio.checked = true;
            toggleRecurringEndCondition();
        }
        updateRecurringPreview();
    }
    
    // Render linked jobs
    renderLinkedJobs();
    
    // Close staff autocomplete when clicking outside
    document.addEventListener('click', function(e) {
        const autocomplete = document.getElementById('newJobStaffAutocomplete');
        const searchInput = document.getElementById('newJobStaffSearch');
        
        if (autocomplete && !autocomplete.contains(e.target) && e.target !== searchInput && !searchInput.contains(e.target)) {
            autocomplete.classList.add('hidden');
        }
    });
});

// Sample linked jobs data (in real app, fetch from API)
let linkedJobs = [
    {
        id: 'JOB-2024-001',
        date: '2025-11-25',
        startTime: '10:00',
        endTime: '11:00',
        status: 'scheduled',
        bookings: 4,
        capacity: 10
    },
    {
        id: 'JOB-2024-002',
        date: '2025-12-02',
        startTime: '10:00',
        endTime: '11:00',
        status: 'scheduled',
        bookings: 2,
        capacity: 10
    }
];

// Render linked jobs
function renderLinkedJobs() {
    const container = document.getElementById('linkedJobsList');
    if (!container) return;
    
    if (linkedJobs.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <p class="text-gray-500">No jobs created yet</p>
                <p class="text-sm text-gray-400 mt-1">Create jobs from this class template</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = linkedJobs.map(job => {
        const statusConfig = {
            scheduled: { icon: '📋', text: 'Scheduled', color: 'green' },
            in_progress: { icon: '🔄', text: 'In Progress', color: 'blue' },
            completed: { icon: '✅', text: 'Completed', color: 'emerald' },
            cancelled: { icon: '❌', text: 'Cancelled', color: 'red' }
        };
        const status = statusConfig[job.status] || statusConfig.scheduled;
        
        const date = job.date ? new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set';
        const time = job.startTime && job.endTime 
            ? `${formatTimeForJob(job.startTime)} - ${formatTimeForJob(job.endTime)}`
            : 'Not set';
        
        return `
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div class="p-4">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 flex-wrap mb-1">
                                <h3 class="text-lg font-semibold text-gray-900">${job.id}</h3>
                                <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-${status.color}-100 text-${status.color}-700">
                                    ${status.icon} ${status.text}
                                </span>
                            </div>
                            <p class="text-sm text-gray-600">${date} • ${time}</p>
                            <p class="text-sm text-gray-500 mt-1">${job.bookings} / ${job.capacity} slots booked</p>
                        </div>
                        <button 
                            onclick="window.location.href='class_job.html?id=${job.id}&classId=' + (classJobData.id || 'CLASS-2024-001')"
                            class="ml-3 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                        >
                            View Job
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Format time for job display
function formatTimeForJob(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Create new job - opens modal
function createNewJob() {
    // Populate class info in modal
    const className = document.getElementById('className')?.value || classJobData.name || 'Class';
    const pricebookItem = classJobData.pricebookItem?.name || 'Not selected';
    const maxCapacity = classJobData.maxCapacity || 10;
    
    document.getElementById('newJobClassName').textContent = className;
    document.getElementById('newJobPricebookItem').textContent = pricebookItem;
    document.getElementById('newJobMaxCapacity').textContent = maxCapacity;
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('newJobDate').value = today;
    
    // Set default end date for recurring (6 months from now)
    const defaultEnd = new Date();
    defaultEnd.setMonth(defaultEnd.getMonth() + 6);
    document.getElementById('newJobRecurringEndDate').value = defaultEnd.toISOString().split('T')[0];
    
    // Initialize day container visibility
    toggleNewJobDayOfWeekContainer();
    
    // Initialize selected staff list
    renderNewJobSelectedStaff();
    
    // Show modal
    document.getElementById('createJobModal').classList.remove('hidden');
}

// Close create job modal
function closeCreateJobModal() {
    document.getElementById('createJobModal').classList.add('hidden');
    // Reset form
    document.getElementById('newJobEnableRecurring').checked = false;
    toggleNewJobRecurringSection();
    // Reset selected staff
    newJobSelectedStaff = [];
    renderNewJobSelectedStaff();
    // Clear search
    document.getElementById('newJobStaffSearch').value = '';
    document.getElementById('newJobStaffAutocomplete').classList.add('hidden');
}

// Toggle recurring section for new job
function toggleNewJobRecurringSection() {
    const checkbox = document.getElementById('newJobEnableRecurring');
    const section = document.getElementById('newJobRecurringConfigSection');
    
    if (checkbox.checked) {
        section.classList.remove('hidden');
    } else {
        section.classList.add('hidden');
    }
}

// Toggle custom time for new job
function toggleNewJobCustomTime() {
    const select = document.getElementById('newJobPreferredTime');
    const container = document.getElementById('newJobCustomTimeContainer');
    
    if (select.value === 'custom') {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
        // Auto-fill time range based on preferred time
        const preferredTime = select.value;
        const startTimeInput = document.getElementById('newJobStartTime');
        const endTimeInput = document.getElementById('newJobEndTime');
        
        if (preferredTime === 'morning') {
            startTimeInput.value = '09:00';
            endTimeInput.value = '12:00';
        } else if (preferredTime === 'afternoon') {
            startTimeInput.value = '12:00';
            endTimeInput.value = '17:00';
        } else if (preferredTime === 'evening') {
            startTimeInput.value = '17:00';
            endTimeInput.value = '21:00';
        }
        
        calculateNewJobDuration();
    }
}

// Clear custom time for new job
function clearNewJobCustomTime() {
    document.getElementById('newJobCustomTime').value = '';
    document.getElementById('newJobPreferredTime').value = 'flexible';
    document.getElementById('newJobCustomTimeContainer').classList.add('hidden');
}

// Calculate duration for new job
function calculateNewJobDuration() {
    const startTime = document.getElementById('newJobStartTime').value;
    const endTime = document.getElementById('newJobEndTime').value;
    const durationEl = document.getElementById('newJobCalculatedDuration');
    
    if (startTime && endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        const diffMs = end - start;
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.round((diffMs % 3600000) / 60000);
        
        if (diffMs > 0) {
            durationEl.textContent = `${diffHrs}h ${diffMins}m`;
        } else {
            durationEl.textContent = 'Invalid time range';
        }
    } else {
        durationEl.textContent = '--';
    }
}

// Staff search for new job
let newJobSelectedStaff = [];

function searchNewJobStaff(query) {
    const resultsContainer = document.getElementById('newJobStaffAutocomplete');
    
    if (!query || query.trim().length < 2) {
        resultsContainer.classList.add('hidden');
        return;
    }
    
    const queryLower = query.toLowerCase().trim();
    const filtered = sampleStaff.filter(staff => 
        staff.name.toLowerCase().includes(queryLower) || 
        staff.email.toLowerCase().includes(queryLower) ||
        staff.role.toLowerCase().includes(queryLower) ||
        staff.department.toLowerCase().includes(queryLower)
    );
    
    if (filtered.length === 0) {
        resultsContainer.innerHTML = `
            <div class="p-3 text-sm text-gray-500">
                No staff members found
            </div>
        `;
        resultsContainer.classList.remove('hidden');
        return;
    }
    
    resultsContainer.innerHTML = filtered.map(staff => {
        const isSelected = newJobSelectedStaff.some(s => s.id === staff.id);
        return `
            <div 
                onclick="${isSelected ? '' : `selectNewJobStaff('${staff.id}')`}"
                class="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${isSelected ? 'opacity-50 bg-gray-50' : ''}"
            >
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <p class="font-medium text-gray-900 text-sm">${staff.name} ${isSelected ? '(Selected)' : ''}</p>
                        <p class="text-xs text-gray-600 mt-0.5">${staff.email}</p>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">${staff.role}</span>
                            <span class="text-xs text-gray-500">${staff.department}</span>
                        </div>
                    </div>
                    ${isSelected ? `
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    ` : `
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    `}
                </div>
            </div>
        `;
    }).join('');
    
    resultsContainer.classList.remove('hidden');
}

// Select staff for new job
function selectNewJobStaff(staffId) {
    const staff = sampleStaff.find(s => s.id === staffId);
    if (!staff) return;
    
    // Check if already selected
    if (newJobSelectedStaff.some(s => s.id === staffId)) {
        return;
    }
    
    newJobSelectedStaff.push(staff);
    renderNewJobSelectedStaff();
    
    // Clear search and hide autocomplete
    document.getElementById('newJobStaffSearch').value = '';
    document.getElementById('newJobStaffAutocomplete').classList.add('hidden');
}

// Remove staff from new job
function removeNewJobStaff(staffId) {
    newJobSelectedStaff = newJobSelectedStaff.filter(s => s.id !== staffId);
    renderNewJobSelectedStaff();
}

// Render selected staff for new job
function renderNewJobSelectedStaff() {
    const container = document.getElementById('newJobSelectedAssignmentsList');
    const countEl = document.getElementById('newJobSelectedAssignmentsCount');
    
    if (newJobSelectedStaff.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic">No staff assigned yet</p>';
        countEl.textContent = '0';
        return;
    }
    
    countEl.textContent = newJobSelectedStaff.length;
    container.innerHTML = newJobSelectedStaff.map(staff => `
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-xs font-semibold text-blue-600">${staff.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div>
                    <p class="text-sm font-semibold text-gray-900">${staff.name}</p>
                    <p class="text-xs text-gray-600">${staff.role} • ${staff.department}</p>
                </div>
            </div>
            <button 
                onclick="removeNewJobStaff('${staff.id}')"
                class="text-red-500 hover:text-red-700 transition-colors"
                title="Remove"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

// Toggle day of week container for new job
function toggleNewJobDayOfWeekContainer() {
    const frequency = document.getElementById('newJobRecurringFrequency').value;
    const container = document.getElementById('newJobDayOfWeekContainer');
    
    if (frequency === 'weeks') {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
}

// Toggle day selection for new job
function toggleNewJobDaySelection(button) {
    button.classList.toggle('active');
    button.classList.toggle('border-blue-500');
    button.classList.toggle('bg-blue-500');
    button.classList.toggle('text-white');
    button.classList.toggle('border-gray-300');
    button.classList.toggle('bg-white');
    button.classList.toggle('text-gray-700');
}

// Submit new job
function submitNewJob() {
    const date = document.getElementById('newJobDate').value;
    const startTime = document.getElementById('newJobStartTime').value;
    const endTime = document.getElementById('newJobEndTime').value;
    const priority = document.getElementById('newJobPriority').value;
    const notes = document.getElementById('newJobNotes').value;
    const isRecurring = document.getElementById('newJobEnableRecurring').checked;
    const assignedStaff = newJobSelectedStaff.map(s => s.name);
    
    // Validation
    if (!date || !startTime || !endTime) {
        showNotification('Please fill in date and time fields', 'error');
        return;
    }
    
    // Generate job ID
    const timestamp = Date.now();
    const newJobId = 'JOB-2024-' + String(timestamp).slice(-6);
    
    // Create job data
    const jobData = {
        id: newJobId,
        classId: classJobData.id || 'CLASS-2024-001',
        className: classJobData.name || document.getElementById('className')?.value || 'Class',
        date: date,
        startTime: startTime,
        endTime: endTime,
        status: 'scheduled',
        priority: priority,
        assignedStaff: assignedStaff.length > 0 ? assignedStaff : (document.getElementById('newJobAutoAssign').checked ? ['Auto-assign'] : []),
        notes: notes,
        bookings: [],
        maxCapacity: classJobData.maxCapacity || 10,
        pricebookItem: classJobData.pricebookItem,
        createdAt: new Date().toISOString()
    };
    
    // Add recurring template if enabled
    if (isRecurring) {
        const interval = parseInt(document.getElementById('newJobRecurringInterval').value) || 1;
        const frequency = document.getElementById('newJobRecurringFrequency').value;
        const endCondition = document.querySelector('input[name="newJobRecurringEndCondition"]:checked').value;
        
        const selectedDays = [];
        if (frequency === 'weeks') {
            document.querySelectorAll('#newJobDayOfWeekContainer button.active').forEach(btn => {
                selectedDays.push(btn.dataset.day);
            });
        }
        
        let endDate = null;
        let numberOfOccurrences = null;
        if (endCondition === 'date') {
            endDate = document.getElementById('newJobRecurringEndDate').value;
        } else if (endCondition === 'occurrences') {
            numberOfOccurrences = parseInt(document.getElementById('newJobRecurringOccurrences').value) || 12;
        }
        
        jobData.isRecurring = true;
        jobData.templateId = 'RJT-2024-' + String(Date.now()).slice(-6);
        jobData.instanceNumber = 1;
        jobData.recurringTemplate = {
            frequency: frequency,
            customInterval: interval,
            selectedDays: selectedDays.length > 0 ? selectedDays : null,
            startDate: date,
            endCondition: endCondition,
            endDate: endDate,
            numberOfOccurrences: numberOfOccurrences,
            status: 'active'
        };
    }
    
    // Save to localStorage
    localStorage.setItem('job_' + newJobId, JSON.stringify(jobData));
    
    // Add to linked jobs
    linkedJobs.push({
        id: newJobId,
        date: date,
        startTime: startTime,
        endTime: endTime,
        status: 'scheduled',
        bookings: 0,
        capacity: jobData.maxCapacity
    });
    
    // Update UI
    renderLinkedJobs();
    closeCreateJobModal();
    showNotification(`Job ${newJobId} created successfully`, 'success');
    
    // Navigate to the new job
    setTimeout(() => {
        window.location.href = `class_job.html?id=${newJobId}&classId=${jobData.classId}`;
    }, 1000);
}

