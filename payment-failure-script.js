// Payment Failure Page JavaScript
// Handles button interactions and dynamic content

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializePage();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize the page with dynamic content
 */
function initializePage() {
    // Set current date for transaction date
    setTransactionDate();
    
    // Log page load for analytics (if needed)
    console.log('Payment Failure page loaded');
    
    // Add animation to icon
    animateIcon();
}

/**
 * Set up all event listeners for buttons and interactive elements
 */
function setupEventListeners() {
    // Retry Payment button
    const retryPaymentBtn = document.getElementById('retryPaymentBtn');
    if (retryPaymentBtn) {
        retryPaymentBtn.addEventListener('click', handleRetryPayment);
    }
    
    // Back to Home button
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', handleBackToHome);
    }
    
    // Support email link tracking
    const supportLinks = document.querySelectorAll('a[href^="mailto:"]');
    supportLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Support email clicked');
            // Analytics tracking can be added here
        });
    });
    
    // Phone link tracking
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Support phone clicked');
            // Analytics tracking can be added here
        });
    });
}

/**
 * Set the transaction date to current date
 */
function setTransactionDate() {
    const dateElement = document.getElementById('transactionDate');
    if (dateElement) {
        const currentDate = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = currentDate.toLocaleDateString('en-US', options);
        dateElement.textContent = formattedDate;
    }
}

/**
 * Handle retry payment button click
 */
function handleRetryPayment() {
    console.log('Retry payment clicked');
    
    // Show loading state
    const button = document.getElementById('retryPaymentBtn');
    const originalText = button.innerHTML;
    button.disabled = true;
    button.style.opacity = '0.7';
    button.innerHTML = '<span>Processing...</span>';
    
    // Simulate navigation delay (remove in production)
    setTimeout(() => {
        // Redirect to payment page
        // In a real application, you would redirect to your payment gateway
        // window.location.href = 'payment.html';
        
        // For demo purposes, show alert
        alert('Redirecting to payment page...\n\nIn a real application, this would take you to the payment form.');
        
        // Reset button
        button.disabled = false;
        button.style.opacity = '1';
        button.innerHTML = originalText;
    }, 1000);
}

/**
 * Handle back to home button click
 */
function handleBackToHome() {
    console.log('Back to home clicked');
    
    // Show loading state
    const button = document.getElementById('backToHomeBtn');
    const originalText = button.innerHTML;
    button.disabled = true;
    button.style.opacity = '0.7';
    
    // Simulate navigation delay (remove in production)
    setTimeout(() => {
        // Redirect to home page
        window.location.href = 'home.html';
        
        // Fallback if home.html doesn't exist
        if (!window.location.href.includes('home.html')) {
            window.location.href = 'index.html';
        }
    }, 500);
}

/**
 * Animate the failure icon on page load
 */
function animateIcon() {
    const iconWrapper = document.querySelector('.icon-wrapper');
    if (iconWrapper) {
        // Start with scale 0
        iconWrapper.style.transform = 'scale(0)';
        iconWrapper.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        // Animate to scale 1
        setTimeout(() => {
            iconWrapper.style.transform = 'scale(1)';
        }, 100);
    }
}

/**
 * Store transaction details in session storage (optional)
 * This can be used to track failed payment attempts
 */
function storeTransactionDetails() {
    try {
        const transactionDetails = {
            accountType: 'Franchise',
            subscriptionPlan: 'Starter',
            amount: '$60',
            date: new Date().toISOString(),
            errorCode: 'ERR_PAYMENT_DECLINED',
            status: 'failed'
        };
        
        sessionStorage.setItem('lastTransaction', JSON.stringify(transactionDetails));
        console.log('Transaction details stored');
    } catch (error) {
        console.error('Error storing transaction details:', error);
    }
}

/**
 * Send error report to server (optional)
 * This can be used for tracking and analytics
 */
function reportPaymentFailure() {
    try {
        // In a real application, you would send this to your server
        const errorReport = {
            timestamp: new Date().toISOString(),
            errorCode: 'ERR_PAYMENT_DECLINED',
            accountType: 'Franchise',
            amount: 60,
            userAgent: navigator.userAgent
        };
        
        console.log('Error report:', errorReport);
        
        // Example API call (uncomment in production):
        // fetch('/api/payment-errors', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(errorReport)
        // });
    } catch (error) {
        console.error('Error reporting failure:', error);
    }
}

// Store transaction details on page load (optional)
document.addEventListener('DOMContentLoaded', function() {
    storeTransactionDetails();
});

// Keyboard shortcuts (optional enhancement)
document.addEventListener('keydown', function(e) {
    // Press 'R' to retry payment
    if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRetryPayment();
    }
    
    // Press 'H' or ESC to go back to home
    if (e.key === 'h' || e.key === 'H' || e.key === 'Escape') {
        e.preventDefault();
        handleBackToHome();
    }
});

// Print functionality (optional)
function printPage() {
    window.print();
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleRetryPayment,
        handleBackToHome,
        setTransactionDate
    };
}
