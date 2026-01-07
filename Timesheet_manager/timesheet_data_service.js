
/**
 * TimesheetDataService
 * Handles data generation, storage, and retrieval for the Timesheet Manager.
 * Uses LocalStorage to persist changes during the session.
 */

const STAFF_DATA = [
    { id: 'S001', name: 'Sarah Connor', role: 'Senior Instructor', defaultRate: 85.00, avatar: 'SC' },
    { id: 'S002', name: 'John Smith', role: 'Assistant Coach', defaultRate: 45.00, avatar: 'JS' },
    { id: 'S003', name: 'Emily Chen', role: 'Yoga Specialist', defaultRate: 60.00, avatar: 'EC' },
    { id: 'S004', name: 'Mike Ross', role: 'Admin Staff', defaultRate: 30.00, avatar: 'MR' },
];

const JOB_TYPES = ['Class', 'Private Session', 'Workshop', 'Admin Task'];

class TimesheetDataService {
    constructor() {
        this.STORAGE_KEY = 'fms_timesheets_v2';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const initialData = this.generateMockData();
            this.saveData(initialData);
        }
    }

    getStaff() {
        return STAFF_DATA;
    }

    getAllTimesheets() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    /**
     * Updates the status and optionally the final hours
     */
    updateStatus(id, status, finalHours = null) {
        const allData = this.getAllTimesheets();
        const index = allData.findIndex(item => item.id === id);
        if (index !== -1) {
            allData[index].status = status;
            if (finalHours !== null) {
                allData[index].finalHours = parseFloat(finalHours);
            }
            allData[index].updatedAt = new Date().toISOString();
            this.saveData(allData);
            return true;
        }
        return false;
    }

    /**
     * Filters timesheets based on criteria
     * @param {Object} criteria - { startDate, endDate, staffId, status, period }
     */
    filterTimesheets(criteria = {}) {
        let data = this.getAllTimesheets();

        // 1. Filter by Staff
        if (criteria.staffId && criteria.staffId !== 'all') {
            data = data.filter(item => item.staffId === criteria.staffId);
        }

        // 2. Filter by Status
        if (criteria.status && criteria.status !== 'all') {
            data = data.filter(item => item.status.toLowerCase() === criteria.status.toLowerCase());
        }

        // 3. Filter by Date Range
        if (criteria.startDate && criteria.endDate) {
            const start = new Date(criteria.startDate).setHours(0, 0, 0, 0);
            const end = new Date(criteria.endDate).setHours(23, 59, 59, 999);

            data = data.filter(item => {
                const itemDate = new Date(item.date).getTime();
                return itemDate >= start && itemDate <= end;
            });
        }

        return data;
    }

    /**
     * Generates CSV content from the filtered data
     */
    exportToCSV(data) {
        const headers = ['ID', 'Date', 'Staff Name', 'Job Title', 'Est Hours', 'Actual Hours', 'Final Hours', 'Rate ($)', 'Total Pay ($)', 'Status'];
        const rows = data.map(item => [
            item.id,
            new Date(item.date).toLocaleDateString(),
            item.staffName,
            item.jobTitle,
            item.estimatedHours,
            item.actualHours,
            item.finalHours || item.actualHours,
            item.hourlyRate.toFixed(2),
            ((item.finalHours || item.actualHours) * item.hourlyRate).toFixed(2),
            item.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.join(','))
        ].join('\n');

        return csvContent;
    }

    // --- Data Generation Helper --- //
    generateMockData() {
        const entries = [];
        const today = new Date();

        // Generate data for the last 60 days and next 7 days
        for (let i = -60; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);

            // Randomly decide if there are jobs on this day (70% chance)
            if (Math.random() > 0.3) {
                // 1-3 jobs per day
                const numJobs = Math.floor(Math.random() * 3) + 1;

                for (let j = 0; j < numJobs; j++) {
                    const staff = STAFF_DATA[Math.floor(Math.random() * STAFF_DATA.length)];
                    const estHours = [1, 1.5, 2, 3][Math.floor(Math.random() * 4)];

                    // Logic for Actual Hours Discrepancy (20% chance of discrepancy)
                    let actHours = estHours;
                    if (Math.random() < 0.2) {
                        // Fluctuate by +/- 0.5 or 1 hour
                        const diff = (Math.random() > 0.5 ? 0.5 : -0.5);
                        actHours = Math.max(0.5, estHours + diff);
                    }

                    // Status Logic based on date
                    let status = 'Pending';
                    if (i < -5) status = Math.random() > 0.1 ? 'Approved' : 'Declined'; // Older items mostly approved
                    if (i > 0) status = 'Pending'; // Future items

                    entries.push({
                        id: `TS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        staffId: staff.id,
                        staffName: staff.name,
                        date: date.toISOString(),
                        jobTitle: `${JOB_TYPES[Math.floor(Math.random() * JOB_TYPES.length)]} - Session ${j + 1}`,
                        estimatedHours: estHours,
                        actualHours: actHours,
                        finalHours: actHours, // Default to actual
                        hourlyRate: staff.defaultRate,
                        status: status,
                        notes: actHours !== estHours ? 'Hours adjusted due to cleanup.' : ''
                    });
                }
            }
        }

        // Sort by date descending
        return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

// Export a singleton instance for simplicity in vanilla JS usage
const timesheetService = new TimesheetDataService();
window.timesheetService = timesheetService; // Expose to window for easy access
