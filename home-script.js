// ========================================
// GLOBAL STATE
// ========================================
const state = {
    sidebarExpanded: true,
    currentPage: 'home',
    notifications: [],
    tasks: [],
    storeName: 'My Store'
};

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
    sidebar: document.querySelector('.sidebar'),
    navItems: document.querySelectorAll('.nav-item'),
    bannerCloseBtn: document.querySelector('.banner-close-btn'),
    limitedOfferBanner: document.querySelector('.limited-offer-banner'),
    searchInput: document.querySelector('.search-input'),
    taskCheckboxes: document.querySelectorAll('.task-checkbox input[type="checkbox"]'),
    feedbackButtons: document.querySelectorAll('.feedback-btn'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    storeNameElement: document.querySelector('#storeName'),
    editStoreBtn: document.querySelector('.edit-store-btn')
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeKeyboardShortcuts();
    loadSavedState();
    animateOnLoad();
    initializeStoreName();
});

// ========================================
// EVENT LISTENERS
// ========================================
function initializeEventListeners() {
    // Sidebar Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Banner Close
    if (elements.bannerCloseBtn) {
        elements.bannerCloseBtn.addEventListener('click', closeBanner);
    }

    // Search Functionality
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', handleSearch);
        elements.searchInput.addEventListener('focus', handleSearchFocus);
        elements.searchInput.addEventListener('blur', handleSearchBlur);
    }

    // Task Checkboxes
    elements.taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleTaskToggle);
    });

    // Feedback Buttons
    elements.feedbackButtons.forEach(button => {
        button.addEventListener('click', handleFeedback);
    });

    // Tab Buttons
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', handleTabSwitch);
    });

    // Action Buttons
    const actionButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-task-action');
    actionButtons.forEach(button => {
        button.addEventListener('click', handleActionClick);
    });

    // Copy Domain Button
    const copyButton = document.querySelector('.btn-copy');
    if (copyButton) {
        copyButton.addEventListener('click', copyDomainToClipboard);
    }

    // Generate Theme Button
    const generateButton = document.querySelector('.btn-generate');
    if (generateButton) {
        generateButton.addEventListener('click', handleGenerateTheme);
    }
}

// ========================================
// NAVIGATION HANDLERS
// ========================================
function handleNavigation(e) {
    const navItem = e.currentTarget;
    
    // Remove active class from all items
    elements.navItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked item
    navItem.classList.add('active');
    
    // Handle submenu toggle
    if (navItem.classList.contains('has-submenu')) {
        toggleSubmenu(navItem);
    }
    
    // Update page content (in a real app, this would route to different pages)
    const pageName = navItem.querySelector('span').textContent;
    console.log(`Navigating to: ${pageName}`);
    
    // Show notification
    showNotification(`Navigated to ${pageName}`, 'info');
}

function toggleSubmenu(navItem) {
    const submenu = navItem.nextElementSibling;
    const icon = navItem.querySelector('.submenu-icon');
    
    if (submenu && submenu.classList.contains('submenu')) {
        submenu.classList.toggle('expanded');
        icon.style.transform = submenu.classList.contains('expanded') 
            ? 'rotate(180deg)' 
            : 'rotate(0deg)';
    }
}

// ========================================
// BANNER HANDLERS
// ========================================
function closeBanner() {
    if (elements.limitedOfferBanner) {
        elements.limitedOfferBanner.style.transform = 'translateY(-100%)';
        elements.limitedOfferBanner.style.opacity = '0';
        
        setTimeout(() => {
            elements.limitedOfferBanner.style.display = 'none';
            localStorage.setItem('bannerClosed', 'true');
        }, 300);
    }
}

// ========================================
// SEARCH HANDLERS
// ========================================
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    console.log('Searching for:', searchTerm);
    
    // In a real app, this would filter content or make an API call
    if (searchTerm.length > 2) {
        // Simulate search results
        console.log('Search results for:', searchTerm);
    }
}

function handleSearchFocus(e) {
    e.target.parentElement.style.borderColor = 'var(--primary-color)';
}

function handleSearchBlur(e) {
    e.target.parentElement.style.borderColor = 'var(--border-color)';
}

// ========================================
// TASK HANDLERS
// ========================================
function handleTaskToggle(e) {
    const checkbox = e.target;
    const taskItem = checkbox.closest('.task-item');
    
    if (checkbox.checked) {
        taskItem.style.opacity = '0.6';
        showNotification('Task completed! 🎉', 'success');
        updateTaskProgress();
    } else {
        taskItem.style.opacity = '1';
        updateTaskProgress();
    }
}

function updateTaskProgress() {
    const totalTasks = elements.taskCheckboxes.length;
    const completedTasks = Array.from(elements.taskCheckboxes).filter(cb => cb.checked).length;
    
    const progressIndicator = document.querySelector('.progress-indicator');
    if (progressIndicator) {
        progressIndicator.textContent = `${completedTasks} of ${totalTasks} tasks complete`;
    }
}

// ========================================
// FEEDBACK HANDLERS
// ========================================
function handleFeedback(e) {
    const button = e.currentTarget;
    const isPositive = button.querySelector('.fa-thumbs-up') !== null;
    
    // Add animation
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    // Show notification
    const message = isPositive 
        ? 'Thank you for your positive feedback!' 
        : 'Thank you for your feedback. We\'ll work on improving.';
    showNotification(message, 'success');
}

// ========================================
// TAB HANDLERS
// ========================================
function handleTabSwitch(e) {
    const button = e.currentTarget;
    
    // Remove active class from all tabs
    elements.tabButtons.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to clicked tab
    button.classList.add('active');
    
    // In a real app, this would load different content
    const tabName = button.textContent.split(' ')[0];
    console.log(`Switched to ${tabName} tab`);
}

// ========================================
// ACTION BUTTON HANDLERS
// ========================================
function handleActionClick(e) {
    const button = e.currentTarget;
    const buttonText = button.textContent.trim();
    
    // Add loading state
    button.disabled = true;
    button.style.opacity = '0.7';
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Simulate async action
    setTimeout(() => {
        button.disabled = false;
        button.style.opacity = '1';
        button.textContent = buttonText;
        
        showNotification(`Action "${buttonText}" completed successfully!`, 'success');
    }, 1500);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function copyDomainToClipboard() {
    const domainName = document.querySelector('.domain-name').textContent;
    
    navigator.clipboard.writeText(domainName).then(() => {
        showNotification('Domain copied to clipboard!', 'success');
        
        // Change icon temporarily
        const copyBtn = document.querySelector('.btn-copy');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        showNotification('Failed to copy domain', 'error');
        console.error('Copy failed:', err);
    });
}

function handleGenerateTheme() {
    const themeInput = document.querySelector('.theme-input');
    const themeDescription = themeInput.value.trim();
    
    if (!themeDescription) {
        showNotification('Please enter a business description', 'error');
        themeInput.focus();
        return;
    }
    
    const generateBtn = document.querySelector('.btn-generate');
    const originalHTML = generateBtn.innerHTML;
    
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    // Simulate theme generation
    setTimeout(() => {
        generateBtn.disabled = false;
        generateBtn.innerHTML = originalHTML;
        showNotification('Theme generated successfully! 🎨', 'success');
    }, 2500);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease-out',
        minWidth: '300px',
        maxWidth: '500px'
    });
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: 'var(--success-color)',
        error: 'var(--error-color)',
        warning: 'var(--warning-color)',
        info: 'var(--info-color)'
    };
    return colors[type] || colors.info;
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            elements.searchInput?.focus();
        }
        
        // ESC to clear search
        if (e.key === 'Escape' && document.activeElement === elements.searchInput) {
            elements.searchInput.value = '';
            elements.searchInput.blur();
        }
    });
}

// ========================================
// STATE MANAGEMENT
// ========================================
function loadSavedState() {
    // Check if banner was previously closed
    const bannerClosed = localStorage.getItem('bannerClosed');
    if (bannerClosed === 'true') {
        elements.limitedOfferBanner.style.display = 'none';
    }
    
    // Load other saved preferences
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

function saveState() {
    localStorage.setItem('currentPage', state.currentPage);
    localStorage.setItem('sidebarExpanded', state.sidebarExpanded);
}

// ========================================
// ANIMATIONS
// ========================================
function animateOnLoad() {
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .action-card,
        .setup-card,
        .service-card {
            animation: fadeInUp 0.5s ease-out;
        }
        
        .action-card:nth-child(1) { animation-delay: 0.1s; }
        .action-card:nth-child(2) { animation-delay: 0.2s; }
        .action-card:nth-child(3) { animation-delay: 0.3s; }
    `;
    document.head.appendChild(style);
    
    // Animate cards on scroll
    observeElements();
}

function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.action-card, .setup-card, .service-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(el);
    });
}

// ========================================
// AUTO-SAVE
// ========================================
setInterval(() => {
    saveState();
}, 30000); // Save every 30 seconds

// Save on page unload
window.addEventListener('beforeunload', () => {
    saveState();
});

// ========================================
// RESPONSIVE SIDEBAR TOGGLE
// ========================================
function toggleSidebar() {
    state.sidebarExpanded = !state.sidebarExpanded;
    elements.sidebar.classList.toggle('collapsed');
}

// ========================================
// STORE NAME MANAGEMENT
// ========================================
function initializeStoreName() {
    // Load saved store name
    const savedStoreName = localStorage.getItem('storeName');
    if (savedStoreName) {
        state.storeName = savedStoreName;
        if (elements.storeNameElement) {
            elements.storeNameElement.textContent = savedStoreName;
        }
    }
    
    // Add click event to edit store name
    if (elements.storeNameElement) {
        elements.storeNameElement.addEventListener('click', editStoreName);
    }
    
    if (elements.editStoreBtn) {
        elements.editStoreBtn.addEventListener('click', editStoreName);
    }
}

function editStoreName() {
    const currentName = elements.storeNameElement.textContent;
    
    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'store-name-input';
    input.style.cssText = `
        font-size: 1.125rem;
        font-weight: 700;
        padding: 0.25rem 0.5rem;
        border: 2px solid var(--primary-color);
        border-radius: 4px;
        outline: none;
        width: 150px;
        font-family: inherit;
    `;
    
    // Replace span with input
    elements.storeNameElement.replaceWith(input);
    input.focus();
    input.select();
    
    // Handle save on Enter or blur
    const saveStoreName = () => {
        const newName = input.value.trim() || 'My Store';
        
        // Create new span element
        const span = document.createElement('span');
        span.className = 'logo-text';
        span.id = 'storeName';
        span.textContent = newName;
        span.style.cursor = 'pointer';
        span.addEventListener('click', editStoreName);
        
        // Replace input with span
        input.replaceWith(span);
        
        // Update state and save
        state.storeName = newName;
        localStorage.setItem('storeName', newName);
        elements.storeNameElement = span;
        
        showNotification(`Store name updated to "${newName}"`, 'success');
    };
    
    input.addEventListener('blur', saveStoreName);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveStoreName();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Cancel editing
            const span = document.createElement('span');
            span.className = 'logo-text';
            span.id = 'storeName';
            span.textContent = currentName;
            span.style.cursor = 'pointer';
            span.addEventListener('click', editStoreName);
            input.replaceWith(span);
            elements.storeNameElement = span;
        }
    });
}

// ========================================
// CONSOLE GREETING
// ========================================
console.log('%c🎉 Welcome to Franchise Management System!', 
    'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ for modern franchise businesses', 
    'color: #10b981; font-size: 14px;');
