/**
 * Seed Data for FMS Subscription Sessions
 * Generates test data covering the 3-layer hierarchy:
 * 1. Learning Service (Config + Default Staff)
 * 2. Subscription Session (Slot Pattern + Staff Override)
 * 3. Session Slots (Concrete Instances)
 */

const SEED_DATA_VERSION = '1.0';

function seedData() {
    console.log('Seeding FMS data...');

    // Clear existing (optional, maybe ask user? for now we overwrite for consistent testing)
    localStorage.removeItem('fms_learning_services');

    const services = [
        createClassService(),
        createGroupService(),
        createOneToOneService()
    ];

    localStorage.setItem('fms_learning_services', JSON.stringify(services));

    alert('Test data seeded successfully! 3 Services created with different types and schedules.');
    window.location.reload();
}

// ==========================================
// 1. CLASS SERVICE (Hidden Enrollment Tab)
// ==========================================
function createClassService() {
    return {
        id: 'ls_class_001',
        name: 'Violin Masterclass 2025',
        type: 'Class', // Hierarchy Level 1
        description: 'Advanced violin techniques for Grade 8+ students. Fixed cohort.',
        status: 'active',
        pricebookItemName: 'Music Class Term',
        pricebookPrice: 1200.00,

        // Schedule Config (Defines the Slot Patterns)
        schedule: {
            frequency: 'weekly',
            config: {
                weeklySlots: {
                    'Monday': [{ startTime: '18:00', endTime: '20:00', duration: 120 }], // Slot Pattern 1
                    'Wednesday': [{ startTime: '18:00', endTime: '20:00', duration: 120 }] // Slot Pattern 2
                }
            }
        },

        // Default Staff (Inherited by Slot Patterns)
        staff: [
            { id: 'st_001', name: 'Maestro Giovanni', role: 'Instructor' }
        ],

        // Class-specific
        curriculum: 'Suzuki Book 4-5',
        cohortStartDate: '2025-02-01',
        cohortEndDate: '2025-06-30',
        cohortSize: 15,

        // Stats
        maxCapacity: 15,
        totalEnrolled: 12,

        // Enrollment (At Class Level for 'Class' type)
        enrollments: generateMockEnrollments(12, 'Class')
    };
}

// ==========================================
// 2. GROUP SERVICE (Visible Enrollment Tab)
// ==========================================
function createGroupService() {
    return {
        id: 'ls_group_001',
        name: 'Yoga Flows',
        type: 'Group',
        description: 'Vinyasa yoga flow for all levels. Drop-in or term booking.',
        status: 'active',
        pricebookItemName: 'Yoga Session',
        pricebookPrice: 25.00,

        schedule: {
            frequency: 'weekly',
            config: {
                weeklySlots: {
                    'Tuesday': [{ startTime: '07:00', endTime: '08:00', duration: 60 }],
                    'Thursday': [{ startTime: '07:00', endTime: '08:00', duration: 60 }],
                    'Saturday': [{ startTime: '09:00', endTime: '10:00', duration: 60 }]
                }
            }
        },

        staff: [
            { id: 'st_002', name: 'Sarah Yogi', role: 'Instructor' }
        ],

        maxCapacity: 20,
        minCapacity: 3,
        totalEnrolled: 0, // Calculated per slot pattern usually, but for mock we leave 0 here
        enrollments: [] // Enrollments are per slot pattern for Group/1:1 ideally, but strictly stored here in this v2 model
    };
}

// ==========================================
// 3. ONE-TO-ONE SERVICE (1:1 Capacity)
// ==========================================
function createOneToOneService() {
    return {
        id: 'ls_pvt_001',
        name: 'Private Piano',
        type: 'One-to-One',
        description: 'Personalized piano tuition.',
        status: 'active',
        pricebookItemName: 'Private Lesson 30m',
        pricebookPrice: 45.00,

        schedule: {
            frequency: 'weekly',
            config: {
                weeklySlots: {
                    'Monday': [
                        { startTime: '15:00', endTime: '15:30', duration: 30 },
                        { startTime: '15:30', endTime: '16:00', duration: 30 }, // Verify distinct slots
                        { startTime: '16:00', endTime: '16:30', duration: 30 }
                    ]
                }
            }
        },

        staff: [
            { id: 'st_003', name: 'Clara Schumann', role: 'Teacher' } // Default
        ],

        maxCapacity: 1, // Fixed

        // Mocking an enrollment for the first slot
        enrollments: [
            {
                id: 'enr_pvt_1',
                attendeeName: 'Little Timmy',
                customerName: 'Timmy Mom',
                status: 'confirmed',
                paymentStatus: 'paid',
                // In a real DB, this would include slotId linkage. 
                // For v2 UI mock, we just show it in the list.
                notes: 'Preparing for Grade 1'
            }
        ]
    };
}

function generateMockEnrollments(count, type) {
    const list = [];
    for (let i = 0; i < count; i++) {
        list.push({
            id: `enr_${i}`,
            attendeeName: `Student ${i + 1}`,
            customerName: `Parent ${i + 1}`,
            status: 'confirmed',
            paymentStatus: Math.random() > 0.8 ? 'unpaid' : 'paid',
            enrolledAt: new Date().toISOString()
        });
    }
    return list;
}
