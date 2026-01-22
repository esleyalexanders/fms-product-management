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
        this.renderPendingActivities();
        this.renderUpcomingSchedule();
    }

    // Render Pending Quotes & Invoices List
    renderPendingActivities() {
        try {
            const container = document.getElementById('pending-activity-list');
            if (!container) return;

            // Get Quotes
            const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
            const activeQuotes = quotes.filter(q =>
                ['sent', 'draft'].includes(q.status?.toLowerCase())
            ).map(q => ({
                type: 'quote',
                id: q.id,
                title: `${q.customerName} • ${q.serviceName || 'Service'}`,
                subtitle: `$${parseFloat(q.totalAmount || 0).toLocaleString()} • ${q.status === 'sent' ? 'Sent' : 'Draft'}`,
                status: q.status,
                date: q.dateCreated,
                iconClass: 'fa-file-contract',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                borderColor: 'hover:border-blue-300',
                url: '[v2] Quotes/quote_simple/quote_edit_simple.html'
            }));

            // Get Invoices
            const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
            const activeInvoices = invoices.filter(inv =>
                ['unpaid', 'overdue', 'pending'].includes(inv.status?.toLowerCase())
            ).map(inv => ({
                type: 'invoice',
                id: inv.id,
                title: `${inv.customerName} • ${inv.serviceName || 'Service'}`,
                subtitle: `$${parseFloat(inv.totalAmount || 0).toLocaleString()} • Due ${inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'soon'}`,
                status: inv.status,
                date: inv.dueDate, // Sort by due date for invoices
                iconClass: inv.status === 'overdue' ? 'fa-exclamation-triangle' : 'fa-file-invoice-dollar',
                iconBg: inv.status === 'overdue' ? 'bg-red-100' : 'bg-amber-100',
                iconColor: inv.status === 'overdue' ? 'text-red-600' : 'text-amber-600',
                borderColor: inv.status === 'overdue' ? 'hover:border-red-300' : 'hover:border-amber-300',
                url: '[v2] Quotes/quote_simple/invoice_detail_simple.html'
            }));

            // Combine and Sort by Date (descending)
            const allActivities = [...activeQuotes, ...activeInvoices].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            }).slice(0, 5); // Show top 5

            if (allActivities.length === 0) {
                container.innerHTML = '<div class="text-center py-6 text-gray-500">No pending activities</div>';
                return;
            }

            container.innerHTML = allActivities.map(item => `
                <div class="activity-item p-3 rounded-lg border border-gray-200 cursor-pointer ${item.borderColor}"
                    onclick="window.location.href='${item.url}?id=${item.id}'">
                    <div class="flex items-start gap-3">
                        <div class="w-10 h-10 ${item.iconBg} rounded-lg flex items-center justify-center flex-shrink-0">
                            <i class="fas ${item.iconClass} ${item.iconColor}"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-medium text-gray-900">${item.id}</p>
                            <p class="text-sm text-gray-600">${item.title}</p>
                            <p class="text-xs text-gray-500 mt-1">${item.subtitle}</p>
                        </div>
                        <span class="px-2 py-1 ${this.getStatusBadgeColor(item.status)} text-xs rounded-full capitalize">${item.status}</span>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error rendering pending activities:', error);
        }
    }

    // Render Upcoming Schedule List
    renderUpcomingSchedule() {
        try {
            const container = document.getElementById('upcoming-schedule-list');
            if (!container) return;

            const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Filter for Today and Tomorrow
            const todaySessions = sessions.filter(s => {
                const d = new Date(s.date);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === today.getTime();
            });

            const tomorrowSessions = sessions.filter(s => {
                const d = new Date(s.date);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === tomorrow.getTime();
            });

            if (todaySessions.length === 0 && tomorrowSessions.length === 0) {
                container.innerHTML = '<div class="text-center py-6 text-gray-500">No upcoming sessions</div>';
                return;
            }

            let html = '';

            // Render Today's Sessions
            if (todaySessions.length > 0) {
                html += `
                <div class="mb-3">
                    <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Today - ${today.toLocaleDateString()}</p>
                    <div class="space-y-2">
                        ${todaySessions.map(s => this.createSessionCard(s)).join('')}
                    </div>
                </div>`;
            }

            // Render Tomorrow's Sessions
            if (tomorrowSessions.length > 0) {
                html += `
                <div>
                    <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Tomorrow - ${tomorrow.toLocaleDateString()}</p>
                    <div class="space-y-2">
                        ${tomorrowSessions.map(s => this.createSessionCard(s)).join('')}
                    </div>
                </div>`;
            }

            container.innerHTML = html;

        } catch (error) {
            console.error('Error rendering schedule:', error);
        }
    }

    createSessionCard(session) {
        // Map session types to icon/colors
        const types = {
            individual: { icon: 'fa-book-reader', bg: 'bg-purple-100', color: 'text-purple-600', border: 'hover:border-purple-300' },
            group: { icon: 'fa-users', bg: 'bg-blue-100', color: 'text-blue-600', border: 'hover:border-blue-300' },
            science: { icon: 'fa-calculator', bg: 'bg-amber-100', color: 'text-amber-600', border: 'hover:border-amber-300' },
            language: { icon: 'fa-language', bg: 'bg-green-100', color: 'text-green-600', border: 'hover:border-green-300' }
        };

        const style = types[session.type] || types.individual;

        return `
        <div class="activity-item p-3 rounded-lg border border-gray-200 cursor-pointer ${style.border}">
            <div class="flex items-start gap-3">
                <div class="w-10 h-10 ${style.bg} rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="fas ${style.icon} ${style.color}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 truncate">${session.title}</p>
                    <p class="text-sm text-gray-600">${session.customerName} • ${session.startTime} - ${session.endTime}</p>
                </div>
            </div>
        </div>`;
    }

    getStatusBadgeColor(status) {
        const map = {
            sent: 'bg-blue-100 text-blue-700',
            draft: 'bg-yellow-100 text-yellow-700',
            unpaid: 'bg-amber-100 text-amber-700',
            overdue: 'bg-red-100 text-red-700',
            paid: 'bg-green-100 text-green-700'
        };
        return map[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
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
