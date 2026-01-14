// Home Dashboard Statistics
// This file calculates and displays real-time statistics on the home dashboard

class DashboardStats {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadStats());
        } else {
            this.loadStats();
        }
    }

    loadStats() {
        this.updateQuoteStats();
        this.updateInvoiceStats();
        this.updateSessionStats();
    }

    // Update Quote Statistics
    updateQuoteStats() {
        try {
            // Get quotes from localStorage (assuming you have a quote store)
            const quotesData = localStorage.getItem('quotes');
            const quotes = quotesData ? JSON.parse(quotesData) : [];

            // Filter active quotes (Sent, Draft, Accepted statuses)
            const activeQuotes = quotes.filter(q =>
                ['sent', 'draft', 'accepted'].includes(q.status?.toLowerCase())
            );

            // Calculate total value
            const totalValue = activeQuotes.reduce((sum, quote) => {
                const value = parseFloat(quote.totalAmount || quote.total || 0);
                return sum + value;
            }, 0);

            // Update DOM
            const countElement = document.querySelector('[data-stat="active-quotes-count"]');
            const valueElement = document.querySelector('[data-stat="active-quotes-value"]');

            if (countElement) {
                countElement.textContent = activeQuotes.length;
            }
            if (valueElement) {
                valueElement.textContent = this.formatCurrency(totalValue);
            }
        } catch (error) {
            console.error('Error updating quote stats:', error);
        }
    }

    // Update Invoice Statistics
    updateInvoiceStats() {
        try {
            // Get invoices from localStorage
            const invoicesData = localStorage.getItem('invoices');
            const invoices = invoicesData ? JSON.parse(invoicesData) : [];

            // Filter pending/unpaid invoices
            const pendingInvoices = invoices.filter(inv =>
                ['pending', 'unpaid', 'sent', 'overdue'].includes(inv.status?.toLowerCase())
            );

            // Calculate outstanding amount
            const outstandingAmount = pendingInvoices.reduce((sum, invoice) => {
                const amount = parseFloat(invoice.totalAmount || invoice.total || 0);
                return sum + amount;
            }, 0);

            // Update DOM
            const countElement = document.querySelector('[data-stat="pending-invoices-count"]');
            const valueElement = document.querySelector('[data-stat="pending-invoices-value"]');

            if (countElement) {
                countElement.textContent = pendingInvoices.length;
            }
            if (valueElement) {
                valueElement.textContent = this.formatCurrency(outstandingAmount);
            }
        } catch (error) {
            console.error('Error updating invoice stats:', error);
        }
    }

    // Update Session Statistics
    updateSessionStats() {
        try {
            // Get sessions from localStorage
            const sessionsData = localStorage.getItem('sessions');
            const sessions = sessionsData ? JSON.parse(sessionsData) : [];

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const weekEnd = new Date(today);
            weekEnd.setDate(weekEnd.getDate() + 7);

            // Count today's sessions
            const todaySessions = sessions.filter(session => {
                const sessionDate = new Date(session.date || session.startDate);
                sessionDate.setHours(0, 0, 0, 0);
                return sessionDate.getTime() === today.getTime();
            });

            // Count this week's sessions
            const weekSessions = sessions.filter(session => {
                const sessionDate = new Date(session.date || session.startDate);
                return sessionDate >= today && sessionDate < weekEnd;
            });

            // Count upcoming sessions today
            const now = new Date();
            const upcomingSessions = todaySessions.filter(session => {
                const sessionDateTime = new Date(session.startDate || session.date);
                return sessionDateTime > now;
            });

            // Update DOM
            const todayCountElement = document.querySelector('[data-stat="sessions-today-count"]');
            const todayUpcomingElement = document.querySelector('[data-stat="sessions-today-upcoming"]');
            const weekCountElement = document.querySelector('[data-stat="sessions-week-count"]');

            if (todayCountElement) {
                todayCountElement.textContent = todaySessions.length;
            }
            if (todayUpcomingElement) {
                todayUpcomingElement.textContent = `${upcomingSessions.length} upcoming`;
            }
            if (weekCountElement) {
                weekCountElement.textContent = weekSessions.length;
            }
        } catch (error) {
            console.error('Error updating session stats:', error);
        }
    }

    // Format currency
    formatCurrency(amount) {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        } else {
            return `$${amount.toFixed(0)}`;
        }
    }

    // Refresh stats (can be called periodically or on data changes)
    refresh() {
        this.loadStats();
    }
}

// Initialize dashboard stats
const dashboardStats = new DashboardStats();

// Expose globally for manual refresh if needed
window.dashboardStats = dashboardStats;
