/**
 * Session List Script
 * Handles display, filtering, and management of Learning Service Sessions
 */

// ===== STATE MANAGEMENT =====
let allSessions = [];
let filteredSessions = [];
let currentTypeFilter = '';
let currentStatusFilter = '';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadSessions();
    renderSessions();
    updateStats();
    setDefaultDateRange();
});

// ===== DATA LOADING =====
function loadSessions() {
    const stored = localStorage.getItem('fms_sessions');

    if (stored) {
        allSessions = JSON.parse(stored);
    } else {
        // Load sample data
        allSessions = getSampleSessions();
        localStorage.setItem('fms_sessions', JSON.stringify(allSessions));
    }

    filteredSessions = [...allSessions];
}

function getSampleSessions() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    return [
        // AP Calculus AB Sessions (Class type)
        {
            id: 'session_001',
            learningServiceId: 'ls_001',
            learningServiceName: 'AP Calculus AB',
            learningServiceType: 'Class',
            date: formatDateForInput(tomorrow),
            startTime: '15:00',
            endTime: '16:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 20,
            minCapacity: null,
            enrolled: 17,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' },
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist' }
            ],
            notes: '',
            createdAt: '2024-12-01T10:00:00Z'
        },
        {
            id: 'session_002',
            learningServiceId: 'ls_001',
            learningServiceName: 'AP Calculus AB',
            learningServiceType: 'Class',
            date: formatDateForInput(nextWeek),
            startTime: '15:00',
            endTime: '16:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 20,
            minCapacity: null,
            enrolled: 18,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' },
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist' }
            ],
            notes: '',
            createdAt: '2024-12-01T10:00:00Z'
        },
        {
            id: 'session_003',
            learningServiceId: 'ls_001',
            learningServiceName: 'AP Calculus AB',
            learningServiceType: 'Class',
            date: formatDateForInput(today),
            startTime: '15:00',
            endTime: '16:30',
            duration: 90,
            status: 'in_progress',
            maxCapacity: 20,
            minCapacity: null,
            enrolled: 19,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' },
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist' }
            ],
            notes: 'Review session for midterm',
            createdAt: '2024-12-01T10:00:00Z'
        },
        {
            id: 'session_004',
            learningServiceId: 'ls_001',
            learningServiceName: 'AP Calculus AB',
            learningServiceType: 'Class',
            date: formatDateForInput(lastWeek),
            startTime: '15:00',
            endTime: '16:30',
            duration: 90,
            status: 'completed',
            maxCapacity: 20,
            minCapacity: null,
            enrolled: 20,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' }
            ],
            notes: '',
            createdAt: '2024-12-01T10:00:00Z'
        },

        // SAT Math Prep Group Sessions
        {
            id: 'session_005',
            learningServiceId: 'ls_002',
            learningServiceName: 'SAT Math Prep Group',
            learningServiceType: 'Group',
            date: formatDateForInput(tomorrow),
            startTime: '17:00',
            endTime: '18:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 6,
            minCapacity: 2,
            enrolled: 4,
            staff: [
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist' }
            ],
            notes: '',
            createdAt: '2024-12-02T11:00:00Z'
        },
        {
            id: 'session_006',
            learningServiceId: 'ls_002',
            learningServiceName: 'SAT Math Prep Group',
            learningServiceType: 'Group',
            date: formatDateForInput(nextWeek),
            startTime: '17:00',
            endTime: '18:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 6,
            minCapacity: 2,
            enrolled: 5,
            staff: [
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist' }
            ],
            notes: '',
            createdAt: '2024-12-02T11:00:00Z'
        },

        // Private Math Tutoring Sessions (One-to-One)
        {
            id: 'session_007',
            learningServiceId: 'ls_003',
            learningServiceName: 'Private Math Tutoring',
            learningServiceType: 'One-to-One',
            date: formatDateForInput(today),
            startTime: '14:00',
            endTime: '15:00',
            duration: 60,
            status: 'in_progress',
            maxCapacity: 1,
            minCapacity: null,
            enrolled: 1,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' }
            ],
            notes: 'Focus on algebra',
            createdAt: '2024-12-03T09:00:00Z'
        },
        {
            id: 'session_008',
            learningServiceId: 'ls_003',
            learningServiceName: 'Private Math Tutoring',
            learningServiceType: 'One-to-One',
            date: formatDateForInput(tomorrow),
            startTime: '14:00',
            endTime: '15:00',
            duration: 60,
            status: 'scheduled',
            maxCapacity: 1,
            minCapacity: null,
            enrolled: 1,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' }
            ],
            notes: '',
            createdAt: '2024-12-03T09:00:00Z'
        },
        {
            id: 'session_009',
            learningServiceId: 'ls_003',
            learningServiceName: 'Private Math Tutoring',
            learningServiceType: 'One-to-One',
            date: formatDateForInput(nextWeek),
            startTime: '15:00',
            endTime: '16:00',
            duration: 60,
            status: 'scheduled',
            maxCapacity: 1,
            minCapacity: null,
            enrolled: 0,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' }
            ],
            notes: '',
            createdAt: '2024-12-03T09:00:00Z'
        },

        // Chemistry 101 Sessions
        {
            id: 'session_010',
            learningServiceId: 'ls_004',
            learningServiceName: 'Chemistry 101',
            learningServiceType: 'Class',
            date: formatDateForInput(tomorrow),
            startTime: '10:00',
            endTime: '11:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 15,
            minCapacity: null,
            enrolled: 14,
            staff: [
                { id: 'staff3', name: 'Michael Chen', role: 'Science Teacher' }
            ],
            notes: 'Lab session',
            createdAt: '2024-12-04T10:00:00Z'
        },

        // ACT Prep - Private Sessions
        {
            id: 'session_011',
            learningServiceId: 'ls_006',
            learningServiceName: 'ACT Prep - Private',
            learningServiceType: 'One-to-One',
            date: formatDateForInput(today),
            startTime: '16:00',
            endTime: '17:30',
            duration: 90,
            status: 'completed',
            maxCapacity: 1,
            minCapacity: null,
            enrolled: 1,
            staff: [
                { id: 'staff5', name: 'David Lee', role: 'Test Prep Specialist' }
            ],
            notes: 'Practice test review',
            createdAt: '2024-12-05T14:00:00Z'
        },
        {
            id: 'session_012',
            learningServiceId: 'ls_006',
            learningServiceName: 'ACT Prep - Private',
            learningServiceType: 'One-to-One',
            date: formatDateForInput(tomorrow),
            startTime: '16:00',
            endTime: '17:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 1,
            minCapacity: null,
            enrolled: 1,
            staff: [
                { id: 'staff5', name: 'David Lee', role: 'Test Prep Specialist' }
            ],
            notes: '',
            createdAt: '2024-12-05T14:00:00Z'
        },

        // Spanish Conversation Group
        {
            id: 'session_013',
            learningServiceId: 'ls_008',
            learningServiceName: 'Spanish Conversation Group',
            learningServiceType: 'Group',
            date: formatDateForInput(tomorrow),
            startTime: '18:00',
            endTime: '19:00',
            duration: 60,
            status: 'scheduled',
            maxCapacity: 5,
            minCapacity: 2,
            enrolled: 3,
            staff: [
                { id: 'staff7', name: 'Maria Garcia', role: 'Language Instructor' }
            ],
            notes: '',
            createdAt: '2024-12-06T08:00:00Z'
        },

        // Reading Comprehension Tutoring
        {
            id: 'session_014',
            learningServiceId: 'ls_009',
            learningServiceName: 'Reading Comprehension Tutoring',
            learningServiceType: 'One-to-One',
            date: formatDateForInput(today),
            startTime: '15:00',
            endTime: '16:00',
            duration: 60,
            status: 'cancelled',
            maxCapacity: 1,
            minCapacity: null,
            enrolled: 0,
            staff: [
                { id: 'staff4', name: 'Sarah Wilson', role: 'English Tutor' }
            ],
            notes: 'Cancelled due to student illness',
            createdAt: '2024-12-07T10:00:00Z'
        },

        // Algebra II Mastery
        {
            id: 'session_015',
            learningServiceId: 'ls_010',
            learningServiceName: 'Algebra II Mastery',
            learningServiceType: 'Class',
            date: formatDateForInput(tomorrow),
            startTime: '13:00',
            endTime: '14:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 18,
            minCapacity: null,
            enrolled: 16,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' }
            ],
            notes: '',
            createdAt: '2024-12-08T09:00:00Z'
        },

        // Additional Sessions - More variety
        {
            id: 'session_016',
            learningServiceId: 'ls_001',
            learningServiceName: 'AP Calculus AB',
            learningServiceType: 'Class',
            date: formatDateForInput(today),
            startTime: '09:00',
            endTime: '10:30',
            duration: 90,
            status: 'completed',
            maxCapacity: 20,
            minCapacity: null,
            enrolled: 20,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' },
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist' }
            ],
            notes: 'Chapter 5 review completed',
            createdAt: '2024-12-01T10:00:00Z'
        },
        {
            id: 'session_017',
            learningServiceId: 'ls_002',
            learningServiceName: 'SAT Math Prep Group',
            learningServiceType: 'Group',
            date: formatDateForInput(today),
            startTime: '17:00',
            endTime: '18:30',
            duration: 90,
            status: 'completed',
            maxCapacity: 6,
            minCapacity: 2,
            enrolled: 6,
            staff: [
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist' }
            ],
            notes: 'Full capacity session',
            createdAt: '2024-12-02T11:00:00Z'
        },
        {
            id: 'session_018',
            learningServiceId: 'ls_004',
            learningServiceName: 'Chemistry 101',
            learningServiceType: 'Class',
            date: formatDateForInput(today),
            startTime: '10:00',
            endTime: '11:30',
            duration: 90,
            status: 'completed',
            maxCapacity: 15,
            minCapacity: null,
            enrolled: 15,
            staff: [
                { id: 'staff3', name: 'Michael Chen', role: 'Science Teacher' }
            ],
            notes: 'Lab experiment completed',
            createdAt: '2024-12-04T10:00:00Z'
        },
        {
            id: 'session_019',
            learningServiceId: 'ls_005',
            learningServiceName: 'Physics Fundamentals',
            learningServiceType: 'Class',
            date: formatDateForInput(tomorrow),
            startTime: '11:00',
            endTime: '12:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 12,
            minCapacity: null,
            enrolled: 8,
            staff: [
                { id: 'staff3', name: 'Michael Chen', role: 'Science Teacher' }
            ],
            notes: '',
            createdAt: '2024-12-09T10:00:00Z'
        },
        {
            id: 'session_020',
            learningServiceId: 'ls_005',
            learningServiceName: 'Physics Fundamentals',
            learningServiceType: 'Class',
            date: formatDateForInput(nextWeek),
            startTime: '11:00',
            endTime: '12:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 12,
            minCapacity: null,
            enrolled: 5,
            staff: [
                { id: 'staff3', name: 'Michael Chen', role: 'Science Teacher' }
            ],
            notes: '',
            createdAt: '2024-12-09T10:00:00Z'
        },
        {
            id: 'session_021',
            learningServiceId: 'ls_007',
            learningServiceName: 'English Writing Workshop',
            learningServiceType: 'Group',
            date: formatDateForInput(tomorrow),
            startTime: '14:00',
            endTime: '15:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 8,
            minCapacity: 3,
            enrolled: 6,
            staff: [
                { id: 'staff4', name: 'Sarah Wilson', role: 'English Tutor' }
            ],
            notes: 'Essay writing focus',
            createdAt: '2024-12-10T09:00:00Z'
        },
        {
            id: 'session_022',
            learningServiceId: 'ls_007',
            learningServiceName: 'English Writing Workshop',
            learningServiceType: 'Group',
            date: formatDateForInput(nextWeek),
            startTime: '14:00',
            endTime: '15:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 8,
            minCapacity: 3,
            enrolled: 3,
            staff: [
                { id: 'staff4', name: 'Sarah Wilson', role: 'English Tutor' }
            ],
            notes: '',
            createdAt: '2024-12-10T09:00:00Z'
        },
        {
            id: 'session_023',
            learningServiceId: 'ls_003',
            learningServiceName: 'Private Math Tutoring',
            learningServiceType: 'One-to-One',
            date: formatDateForInput(today),
            startTime: '16:00',
            endTime: '17:00',
            duration: 60,
            status: 'completed',
            maxCapacity: 1,
            minCapacity: null,
            enrolled: 1,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' }
            ],
            notes: 'Geometry review',
            createdAt: '2024-12-03T09:00:00Z'
        },
        {
            id: 'session_024',
            learningServiceId: 'ls_006',
            learningServiceName: 'ACT Prep - Private',
            learningServiceType: 'One-to-One',
            date: formatDateForInput(nextWeek),
            startTime: '16:00',
            endTime: '17:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 1,
            minCapacity: null,
            enrolled: 0,
            staff: [
                { id: 'staff5', name: 'David Lee', role: 'Test Prep Specialist' }
            ],
            notes: '',
            createdAt: '2024-12-05T14:00:00Z'
        },
        {
            id: 'session_025',
            learningServiceId: 'ls_008',
            learningServiceName: 'Spanish Conversation Group',
            learningServiceType: 'Group',
            date: formatDateForInput(today),
            startTime: '18:00',
            endTime: '19:00',
            duration: 60,
            status: 'completed',
            maxCapacity: 5,
            minCapacity: 2,
            enrolled: 4,
            staff: [
                { id: 'staff7', name: 'Maria Garcia', role: 'Language Instructor' }
            ],
            notes: 'Conversation practice',
            createdAt: '2024-12-06T08:00:00Z'
        },
        {
            id: 'session_026',
            learningServiceId: 'ls_008',
            learningServiceName: 'Spanish Conversation Group',
            learningServiceType: 'Group',
            date: formatDateForInput(nextWeek),
            startTime: '18:00',
            endTime: '19:00',
            duration: 60,
            status: 'scheduled',
            maxCapacity: 5,
            minCapacity: 2,
            enrolled: 2,
            staff: [
                { id: 'staff7', name: 'Maria Garcia', role: 'Language Instructor' }
            ],
            notes: '',
            createdAt: '2024-12-06T08:00:00Z'
        },
        {
            id: 'session_027',
            learningServiceId: 'ls_009',
            learningServiceName: 'Reading Comprehension Tutoring',
            learningServiceType: 'One-to-One',
            date: formatDateForInput(tomorrow),
            startTime: '15:00',
            endTime: '16:00',
            duration: 60,
            status: 'scheduled',
            maxCapacity: 1,
            minCapacity: null,
            enrolled: 1,
            staff: [
                { id: 'staff4', name: 'Sarah Wilson', role: 'English Tutor' }
            ],
            notes: '',
            createdAt: '2024-12-07T10:00:00Z'
        },
        {
            id: 'session_028',
            learningServiceId: 'ls_010',
            learningServiceName: 'Algebra II Mastery',
            learningServiceType: 'Class',
            date: formatDateForInput(today),
            startTime: '13:00',
            endTime: '14:30',
            duration: 90,
            status: 'in_progress',
            maxCapacity: 18,
            minCapacity: null,
            enrolled: 18,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' }
            ],
            notes: 'Currently in session',
            createdAt: '2024-12-08T09:00:00Z'
        },
        {
            id: 'session_029',
            learningServiceId: 'ls_010',
            learningServiceName: 'Algebra II Mastery',
            learningServiceType: 'Class',
            date: formatDateForInput(nextWeek),
            startTime: '13:00',
            endTime: '14:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 18,
            minCapacity: null,
            enrolled: 12,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' }
            ],
            notes: '',
            createdAt: '2024-12-08T09:00:00Z'
        },
        {
            id: 'session_030',
            learningServiceId: 'ls_001',
            learningServiceName: 'AP Calculus AB',
            learningServiceType: 'Class',
            date: formatDateForInput(lastWeek),
            startTime: '15:00',
            endTime: '16:30',
            duration: 90,
            status: 'completed',
            maxCapacity: 20,
            minCapacity: null,
            enrolled: 19,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' },
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist' }
            ],
            notes: 'Previous week session',
            createdAt: '2024-12-01T10:00:00Z'
        },
        {
            id: 'session_031',
            learningServiceId: 'ls_011',
            learningServiceName: 'Biology Advanced',
            learningServiceType: 'Class',
            date: formatDateForInput(tomorrow),
            startTime: '08:00',
            endTime: '09:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 16,
            minCapacity: null,
            enrolled: 14,
            staff: [
                { id: 'staff3', name: 'Michael Chen', role: 'Science Teacher' }
            ],
            notes: 'Early morning session',
            createdAt: '2024-12-11T07:00:00Z'
        },
        {
            id: 'session_032',
            learningServiceId: 'ls_012',
            learningServiceName: 'French Language Group',
            learningServiceType: 'Group',
            date: formatDateForInput(tomorrow),
            startTime: '19:00',
            endTime: '20:00',
            duration: 60,
            status: 'scheduled',
            maxCapacity: 6,
            minCapacity: 2,
            enrolled: 4,
            staff: [
                { id: 'staff7', name: 'Maria Garcia', role: 'Language Instructor' }
            ],
            notes: 'Evening session',
            createdAt: '2024-12-12T10:00:00Z'
        },
        {
            id: 'session_033',
            learningServiceId: 'ls_013',
            learningServiceName: 'Computer Science Tutoring',
            learningServiceType: 'One-to-One',
            date: formatDateForInput(today),
            startTime: '13:00',
            endTime: '14:00',
            duration: 60,
            status: 'completed',
            maxCapacity: 1,
            minCapacity: null,
            enrolled: 1,
            staff: [
                { id: 'staff6', name: 'Alex Johnson', role: 'CS Tutor' }
            ],
            notes: 'Python programming',
            createdAt: '2024-12-13T09:00:00Z'
        },
        {
            id: 'session_034',
            learningServiceId: 'ls_013',
            learningServiceName: 'Computer Science Tutoring',
            learningServiceType: 'One-to-One',
            date: formatDateForInput(tomorrow),
            startTime: '13:00',
            endTime: '14:00',
            duration: 60,
            status: 'scheduled',
            maxCapacity: 1,
            minCapacity: null,
            enrolled: 0,
            staff: [
                { id: 'staff6', name: 'Alex Johnson', role: 'CS Tutor' }
            ],
            notes: '',
            createdAt: '2024-12-13T09:00:00Z'
        },
        {
            id: 'session_035',
            learningServiceId: 'ls_014',
            learningServiceName: 'History Study Group',
            learningServiceType: 'Group',
            date: formatDateForInput(today),
            startTime: '16:00',
            endTime: '17:00',
            duration: 60,
            status: 'completed',
            maxCapacity: 7,
            minCapacity: 3,
            enrolled: 5,
            staff: [
                { id: 'staff8', name: 'Robert Brown', role: 'History Teacher' }
            ],
            notes: 'World War II discussion',
            createdAt: '2024-12-14T11:00:00Z'
        },
        {
            id: 'session_036',
            learningServiceId: 'ls_014',
            learningServiceName: 'History Study Group',
            learningServiceType: 'Group',
            date: formatDateForInput(nextWeek),
            startTime: '16:00',
            endTime: '17:00',
            duration: 60,
            status: 'scheduled',
            maxCapacity: 7,
            minCapacity: 3,
            enrolled: 3,
            staff: [
                { id: 'staff8', name: 'Robert Brown', role: 'History Teacher' }
            ],
            notes: '',
            createdAt: '2024-12-14T11:00:00Z'
        },
        {
            id: 'session_037',
            learningServiceId: 'ls_015',
            learningServiceName: 'Art Portfolio Review',
            learningServiceType: 'One-to-One',
            date: formatDateForInput(tomorrow),
            startTime: '10:00',
            endTime: '11:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 1,
            minCapacity: null,
            enrolled: 1,
            staff: [
                { id: 'staff9', name: 'Jessica Martinez', role: 'Art Instructor' }
            ],
            notes: 'Portfolio review session',
            createdAt: '2024-12-15T08:00:00Z'
        },
        {
            id: 'session_038',
            learningServiceId: 'ls_002',
            learningServiceName: 'SAT Math Prep Group',
            learningServiceType: 'Group',
            date: formatDateForInput(lastWeek),
            startTime: '17:00',
            endTime: '18:30',
            duration: 90,
            status: 'completed',
            maxCapacity: 6,
            minCapacity: 2,
            enrolled: 5,
            staff: [
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist' }
            ],
            notes: 'Previous week',
            createdAt: '2024-12-02T11:00:00Z'
        },
        {
            id: 'session_039',
            learningServiceId: 'ls_004',
            learningServiceName: 'Chemistry 101',
            learningServiceType: 'Class',
            date: formatDateForInput(nextWeek),
            startTime: '10:00',
            endTime: '11:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 15,
            minCapacity: null,
            enrolled: 11,
            staff: [
                { id: 'staff3', name: 'Michael Chen', role: 'Science Teacher' }
            ],
            notes: '',
            createdAt: '2024-12-04T10:00:00Z'
        },
        {
            id: 'session_040',
            learningServiceId: 'ls_016',
            learningServiceName: 'Music Theory Class',
            learningServiceType: 'Class',
            date: formatDateForInput(tomorrow),
            startTime: '16:00',
            endTime: '17:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 10,
            minCapacity: null,
            enrolled: 7,
            staff: [
                { id: 'staff10', name: 'Daniel White', role: 'Music Teacher' }
            ],
            notes: '',
            createdAt: '2024-12-16T10:00:00Z'
        }
    ];
}

function formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function setDefaultDateRange() {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    document.getElementById('startDate').value = formatDateForInput(today);
    document.getElementById('endDate').value = formatDateForInput(nextMonth);
}

// ===== RENDERING =====
function renderSessions() {
    const container = document.getElementById('sessionsList');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');

    if (!container) return;

    if (filteredSessions.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        if (resultsCount) resultsCount.textContent = 'No sessions found';
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (resultsCount) resultsCount.textContent = `Showing ${filteredSessions.length} session${filteredSessions.length !== 1 ? 's' : ''}`;

    // Sort by date and time
    const sorted = [...filteredSessions].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA - dateB;
    });

    container.innerHTML = sorted.map(session => createSessionCard(session)).join('');
}

function createSessionCard(session) {
    // Ensure learningServiceType is defined (safety check for old data)
    const serviceType = session.learningServiceType || 'Class';
    const typeStyles = getTypeStyles(serviceType);
    const statusBadge = getStatusBadge(session.status);
    const dateTime = formatDateTime(session.date, session.startTime, session.endTime);
    const staffNames = session.staff?.map(s => s.name).join(', ') || 'No staff assigned';
    const enrollmentRate = session.maxCapacity > 0 ? Math.round((session.enrolled / session.maxCapacity) * 100) : 0;
    const enrollmentText = serviceType === 'One-to-One'
        ? `${session.enrolled}/1`
        : `${session.enrolled}/${session.maxCapacity}`;
    const enrollmentColor = enrollmentRate >= 80 ? 'text-emerald-600' : enrollmentRate >= 50 ? 'text-amber-600' : 'text-gray-600';

    return `
        <div class="session-card rounded-lg border ${typeStyles.borderClass} ${typeStyles.bgClass} p-4 cursor-pointer"
             onclick="viewSessionDetail('${session.id}')">
            <div class="grid grid-cols-12 gap-4 items-center">
                <!-- Column 1: Date & Time (2 cols) -->
                <div class="col-span-12 sm:col-span-2">
                    <div class="text-sm font-semibold text-gray-900">${formatDate(session.date)}</div>
                    <div class="text-xs text-gray-500">${formatTime(session.startTime)} - ${formatTime(session.endTime)}</div>
                    <div class="text-xs text-gray-400 mt-1">${session.duration} min</div>
                </div>

                <!-- Column 2: Learning Service Info (4 cols) -->
                <div class="col-span-12 sm:col-span-4 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full ${typeStyles.badgeClass}">
                            ${typeStyles.icon} ${serviceType}
                        </span>
                        ${statusBadge}
                    </div>
                    <h3 class="text-base font-semibold text-gray-900 truncate">${session.learningServiceName}</h3>
                    <p class="text-xs text-gray-500 truncate">${session.notes || 'No notes'}</p>
                </div>

                <!-- Column 3: Staff (2 cols) -->
                <div class="hidden md:block col-span-2">
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span class="truncate">${staffNames}</span>
                    </div>
                </div>

                <!-- Column 4: Enrollment (2 cols) -->
                <div class="col-span-12 sm:col-span-2 text-center">
                    <p class="text-lg font-semibold ${enrollmentColor}">${enrollmentText}</p>
                    <p class="text-xs text-gray-500">${enrollmentRate}% filled</p>
                    ${serviceType === 'Group' && session.minCapacity ?
            `<p class="text-xs text-amber-600 mt-1">Min: ${session.minCapacity}</p>` : ''}
                </div>

                <!-- Column 5: Actions (2 cols) -->
                <div class="col-span-12 sm:col-span-2 flex justify-end items-center gap-2">
                    <button onclick="event.stopPropagation(); viewSessionDetail('${session.id}')" 
                            class="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        View
                    </button>
                    ${session.status === 'scheduled' ? `
                        <button onclick="event.stopPropagation(); editSession('${session.id}')" 
                                class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Edit
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// ===== FILTERING =====
function handleSearch(query) {
    if (!query || query.trim().length === 0) {
        applyFilters();
        return;
    }

    query = query.trim().toLowerCase();
    filteredSessions = allSessions.filter(session => {
        return session.learningServiceName.toLowerCase().includes(query) ||
            session.learningServiceType.toLowerCase().includes(query);
    });

    applyFilters();
    renderSessions();
    updateStats();
}

function filterByType(type) {
    currentTypeFilter = type;

    // Update button states
    document.querySelectorAll('.filter-type-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-indigo-100', 'border-indigo-300', 'text-indigo-700');
        btn.classList.add('hover:bg-gray-50');
    });

    const activeBtn = document.getElementById(`filter${type === '' ? 'All' : type.replace('-', '')}`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'bg-indigo-100', 'border-indigo-300', 'text-indigo-700');
        activeBtn.classList.remove('hover:bg-gray-50');
    }

    applyFilters();
    renderSessions();
    updateStats();
}

function handleFilterChange() {
    applyFilters();
    renderSessions();
    updateStats();
}

function applyFilters() {
    let filtered = [...allSessions];

    // Type filter
    if (currentTypeFilter) {
        filtered = filtered.filter(s => s.learningServiceType === currentTypeFilter);
    }

    // Status filter
    const statusFilter = document.getElementById('statusFilter').value;
    if (statusFilter) {
        filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Date range filter
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (startDate) {
        filtered = filtered.filter(s => s.date >= startDate);
    }
    if (endDate) {
        filtered = filtered.filter(s => s.date <= endDate);
    }

    // Search filter (if active)
    const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchQuery) {
        filtered = filtered.filter(s =>
            s.learningServiceName.toLowerCase().includes(searchQuery) ||
            s.learningServiceType.toLowerCase().includes(searchQuery)
        );
    }

    filteredSessions = filtered;
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    setDefaultDateRange();
    currentTypeFilter = '';
    filterByType('');
}

// ===== STATS UPDATE =====
function updateStats() {
    const now = new Date();
    const today = formatDateForInput(now);

    const total = filteredSessions.length;
    const upcoming = filteredSessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate >= now && s.status !== 'cancelled' && s.status !== 'completed';
    }).length;
    const todayCount = filteredSessions.filter(s => s.date === today && s.status !== 'cancelled').length;

    // Calculate average enrollment
    const sessionsWithCapacity = filteredSessions.filter(s => s.maxCapacity > 0);
    const avgEnrollment = sessionsWithCapacity.length > 0
        ? Math.round(sessionsWithCapacity.reduce((sum, s) => sum + (s.enrolled / s.maxCapacity * 100), 0) / sessionsWithCapacity.length)
        : 0;

    // Count by type
    const classCount = filteredSessions.filter(s => s.learningServiceType === 'Class').length;
    const groupCount = filteredSessions.filter(s => s.learningServiceType === 'Group').length;
    const oneToOneCount = filteredSessions.filter(s => s.learningServiceType === 'One-to-One').length;

    document.getElementById('totalSessions').textContent = total;
    document.getElementById('upcomingSessions').textContent = upcoming;
    document.getElementById('todaySessions').textContent = todayCount;
    document.getElementById('avgEnrollment').textContent = `${avgEnrollment}%`;
    document.getElementById('sessionsByType').textContent = `📚 ${classCount} • 👥 ${groupCount} • 👤 ${oneToOneCount}`;
}

// ===== HELPER FUNCTIONS =====
function getTypeStyles(type) {
    const styles = {
        'Class': {
            badgeClass: 'type-badge-class',
            borderClass: 'border-l-4 border-purple-500',
            bgClass: 'bg-purple-50/50',
            icon: '📚'
        },
        'Group': {
            badgeClass: 'type-badge-group',
            borderClass: 'border-l-4 border-amber-500',
            bgClass: 'bg-amber-50/50',
            icon: '👥'
        },
        'One-to-One': {
            badgeClass: 'type-badge-one-to-one',
            borderClass: 'border-l-4 border-cyan-500',
            bgClass: 'bg-cyan-50/50',
            icon: '👤'
        }
    };

    // Return default style if type is not found or is undefined
    return styles[type] || {
        badgeClass: 'type-badge-class',
        borderClass: 'border-l-4 border-gray-500',
        bgClass: 'bg-gray-50/50',
        icon: '📋'
    };
}

function getStatusBadge(status) {
    const badges = {
        'scheduled': '<span class="px-2 py-0.5 text-xs font-medium rounded-full status-scheduled">Scheduled</span>',
        'in_progress': '<span class="px-2 py-0.5 text-xs font-medium rounded-full status-in_progress">In Progress</span>',
        'completed': '<span class="px-2 py-0.5 text-xs font-medium rounded-full status-completed">Completed</span>',
        'cancelled': '<span class="px-2 py-0.5 text-xs font-medium rounded-full status-cancelled">Cancelled</span>'
    };
    return badges[status] || badges['scheduled'];
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(timeStr) {
    if (!timeStr) return '-';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function formatDateTime(date, startTime, endTime) {
    return `${formatDate(date)} ${formatTime(startTime)} - ${formatTime(endTime)}`;
}

// ===== ACTIONS =====
function viewSessionDetail(sessionId) {
    window.location.href = `session_detail.html?id=${sessionId}`;
}

function editSession(sessionId) {
    window.location.href = `session_detail.html?id=${sessionId}&mode=edit`;
}

