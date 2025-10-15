/* ========================================
   TENANT LOGIN PAGE FUNCTIONALITY
   ======================================== */

class TenantLoginManager {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.loadTenantCustomization();
    }

    initializeElements() {
        // Form elements
        this.loginForm = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
        this.loginButton = this.loginForm.querySelector('.login-button');

        // Social login buttons
        this.googleLoginBtn = document.getElementById('googleLogin');
        this.microsoftLoginBtn = document.getElementById('microsoftLogin');

        // Tenant branding elements
        this.tenantLogo = document.getElementById('tenantLogo');
        this.tenantName = document.getElementById('tenantName');
        this.tenantTagline = document.getElementById('tenantTagline');

        // Customization panel elements
        this.customizationPanel = document.getElementById('customizationPanel');
        this.toggleCustomizationBtn = document.getElementById('toggleCustomization');
        this.closeCustomizationBtn = document.getElementById('closeCustomization');
        this.applyCustomizationBtn = document.getElementById('applyCustomization');
        this.resetCustomizationBtn = document.getElementById('resetCustomization');

        // Customization inputs
        this.customTenantName = document.getElementById('customTenantName');
        this.customTenantTagline = document.getElementById('customTenantTagline');
        this.customLogoIcon = document.getElementById('customLogoIcon');
        this.customPrimaryColor = document.getElementById('customPrimaryColor');
        this.customSecondaryColor = document.getElementById('customSecondaryColor');
        this.customBackgroundColor = document.getElementById('customBackgroundColor');
    }

    attachEventListeners() {
        // Form submission
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        // Social login buttons
        this.googleLoginBtn.addEventListener('click', () => this.handleSocialLogin('google'));
        this.microsoftLoginBtn.addEventListener('click', () => this.handleSocialLogin('microsoft'));

        // Password toggle
        this.passwordToggle.addEventListener('click', () => this.togglePassword());

        // Customization panel
        this.toggleCustomizationBtn.addEventListener('click', () => this.toggleCustomizationPanel());
        this.closeCustomizationBtn.addEventListener('click', () => this.closeCustomizationPanel());
        this.applyCustomizationBtn.addEventListener('click', () => this.applyCustomization());
        this.resetCustomizationBtn.addEventListener('click', () => this.resetCustomization());

        // Real-time customization preview
        this.customTenantName.addEventListener('input', () => this.previewChanges());
        this.customTenantTagline.addEventListener('input', () => this.previewChanges());
        this.customLogoIcon.addEventListener('change', () => this.previewChanges());
        this.customPrimaryColor.addEventListener('input', () => this.previewChanges());
        this.customSecondaryColor.addEventListener('input', () => this.previewChanges());
        this.customBackgroundColor.addEventListener('input', () => this.previewChanges());

        // Input validation
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('input', () => this.validatePassword());

        // Close customization panel when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    /* ========================================
       AUTHENTICATION FUNCTIONALITY
       ======================================== */
    
    handleSocialLogin(provider) {
        // Set loading state on the button
        const button = provider === 'google' ? this.googleLoginBtn : this.microsoftLoginBtn;
        const originalContent = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Connecting...</span>';

        // Simulate OAuth redirect
        setTimeout(() => {
            this.showNotification(`Redirecting to ${provider === 'google' ? 'Google' : 'Microsoft'} login...`, 'info');
            
            // In production, redirect to OAuth endpoint:
            // For Google: window.location.href = '/auth/google';
            // For Microsoft: window.location.href = '/auth/microsoft';
            
            // Reset button after demo
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = originalContent;
                this.showNotification('Social login is not configured in demo mode', 'info');
            }, 2000);
        }, 500);
    }

    async handleLogin(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        this.setLoadingState(true);

        try {
            // Simulate login process
            const loginData = {
                email: this.emailInput.value,
                password: this.passwordInput.value,
                rememberMe: this.rememberMeCheckbox.checked
            };

            // Replace this with actual authentication logic
            const result = await this.simulateLogin(loginData);
            
            if (result.success) {
                this.handleLoginSuccess(result);
            } else {
                this.handleLoginError(result.error);
            }
        } catch (error) {
            this.handleLoginError('An unexpected error occurred. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async simulateLogin(loginData) {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(() => {
                // Basic validation for demo purposes
                if (loginData.email === 'admin@tenant.com' && loginData.password === 'password123') {
                    resolve({
                        success: true,
                        user: {
                            name: 'Admin User',
                            email: loginData.email,
                            role: 'admin'
                        },
                        token: 'demo-jwt-token'
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'Invalid email or password. Try admin@tenant.com / password123'
                    });
                }
            }, 2000);
        });
    }

    handleLoginSuccess(result) {
        // Store authentication data
        if (this.rememberMeCheckbox.checked) {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userData', JSON.stringify(result.user));
        } else {
            sessionStorage.setItem('authToken', result.token);
            sessionStorage.setItem('userData', JSON.stringify(result.user));
        }

        // Show success message
        this.showNotification('Login successful! Redirecting...', 'success');

        // Redirect to dashboard (replace with actual redirect)
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
    }

    handleLoginError(errorMessage) {
        this.showNotification(errorMessage, 'error');
        this.emailInput.classList.add('error');
        this.passwordInput.classList.add('error');
        
        // Remove error styling after 3 seconds
        setTimeout(() => {
            this.emailInput.classList.remove('error');
            this.passwordInput.classList.remove('error');
        }, 3000);
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.loginButton.classList.add('loading');
            this.loginButton.disabled = true;
        } else {
            this.loginButton.classList.remove('loading');
            this.loginButton.disabled = false;
        }
    }

    /* ========================================
       FORM VALIDATION
       ======================================== */

    validateForm() {
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        return isEmailValid && isPasswordValid;
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showFieldError(this.emailInput, 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showFieldError(this.emailInput, 'Please enter a valid email address');
            return false;
        }
        
        this.clearFieldError(this.emailInput);
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showFieldError(this.passwordInput, 'Password is required');
            return false;
        }
        
        if (password.length < 6) {
            this.showFieldError(this.passwordInput, 'Password must be at least 6 characters');
            return false;
        }
        
        this.clearFieldError(this.passwordInput);
        return true;
    }

    showFieldError(input, message) {
        input.classList.add('error');
        let errorElement = input.parentNode.querySelector('.field-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.75rem;
                margin-top: 0.25rem;
                animation: fadeInUp 0.3s ease-out;
            `;
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /* ========================================
       PASSWORD VISIBILITY TOGGLE
       ======================================== */

    togglePassword() {
        const isPasswordVisible = this.passwordInput.type === 'text';
        this.passwordInput.type = isPasswordVisible ? 'password' : 'text';
        
        const icon = this.passwordToggle.querySelector('i');
        icon.className = isPasswordVisible ? 'fas fa-eye' : 'fas fa-eye-slash';
    }

    /* ========================================
       CUSTOMIZATION FUNCTIONALITY
       ======================================== */

    toggleCustomizationPanel() {
        this.customizationPanel.classList.toggle('open');
        if (this.customizationPanel.classList.contains('open')) {
            this.loadCurrentCustomization();
        }
    }

    closeCustomizationPanel() {
        this.customizationPanel.classList.remove('open');
    }

    loadCurrentCustomization() {
        // Load current values into the customization form
        this.customTenantName.value = this.tenantName.textContent;
        this.customTenantTagline.value = this.tenantTagline.textContent;
        
        // Get current CSS variables
        const computedStyle = getComputedStyle(document.documentElement);
        this.customPrimaryColor.value = this.rgbToHex(computedStyle.getPropertyValue('--tenant-primary-color').trim());
        this.customSecondaryColor.value = this.rgbToHex(computedStyle.getPropertyValue('--tenant-secondary-color').trim());
        this.customBackgroundColor.value = this.rgbToHex(computedStyle.getPropertyValue('--tenant-background-color').trim());
        
        // Get current logo icon
        const currentIcon = this.tenantLogo.querySelector('i').className;
        this.customLogoIcon.value = currentIcon;
    }

    previewChanges() {
        // Update tenant name and tagline
        if (this.customTenantName.value.trim()) {
            this.tenantName.textContent = this.customTenantName.value.trim();
        }
        
        if (this.customTenantTagline.value.trim()) {
            this.tenantTagline.textContent = this.customTenantTagline.value.trim();
        }

        // Update logo icon
        const logoIcon = this.tenantLogo.querySelector('i');
        logoIcon.className = this.customLogoIcon.value;

        // Update colors
        document.documentElement.style.setProperty('--tenant-primary-color', this.customPrimaryColor.value);
        document.documentElement.style.setProperty('--tenant-primary-hover', this.darkenColor(this.customPrimaryColor.value, 0.1));
        document.documentElement.style.setProperty('--tenant-secondary-color', this.customSecondaryColor.value);
        document.documentElement.style.setProperty('--tenant-background-color', this.customBackgroundColor.value);
    }

    applyCustomization() {
        // Save customization to localStorage
        const customization = {
            tenantName: this.customTenantName.value.trim(),
            tenantTagline: this.customTenantTagline.value.trim(),
            logoIcon: this.customLogoIcon.value,
            primaryColor: this.customPrimaryColor.value,
            secondaryColor: this.customSecondaryColor.value,
            backgroundColor: this.customBackgroundColor.value,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('tenantCustomization', JSON.stringify(customization));
        this.showNotification('Customization applied successfully!', 'success');
        this.closeCustomizationPanel();
    }

    resetCustomization() {
        // Reset to default values
        const defaultValues = {
            tenantName: 'Your Business Name',
            tenantTagline: 'Manage your franchise with ease',
            logoIcon: 'fas fa-store',
            primaryColor: '#3b82f6',
            secondaryColor: '#10b981',
            backgroundColor: '#f9fafb'
        };

        // Update form inputs
        this.customTenantName.value = defaultValues.tenantName;
        this.customTenantTagline.value = defaultValues.tenantTagline;
        this.customLogoIcon.value = defaultValues.logoIcon;
        this.customPrimaryColor.value = defaultValues.primaryColor;
        this.customSecondaryColor.value = defaultValues.secondaryColor;
        this.customBackgroundColor.value = defaultValues.backgroundColor;

        // Apply the reset
        this.previewChanges();
        
        // Remove from localStorage
        localStorage.removeItem('tenantCustomization');
        
        this.showNotification('Customization reset to defaults', 'info');
    }

    loadTenantCustomization() {
        const savedCustomization = localStorage.getItem('tenantCustomization');
        if (savedCustomization) {
            try {
                const customization = JSON.parse(savedCustomization);
                
                // Apply saved customization
                this.tenantName.textContent = customization.tenantName || 'Your Business Name';
                this.tenantTagline.textContent = customization.tenantTagline || 'Manage your franchise with ease';
                
                // Update logo icons
                const logoIcon = this.tenantLogo.querySelector('i');
                logoIcon.className = customization.logoIcon || 'fas fa-store';
                
                // Update colors
                document.documentElement.style.setProperty('--tenant-primary-color', customization.primaryColor || '#3b82f6');
                document.documentElement.style.setProperty('--tenant-primary-hover', this.darkenColor(customization.primaryColor || '#3b82f6', 0.1));
                document.documentElement.style.setProperty('--tenant-secondary-color', customization.secondaryColor || '#10b981');
                document.documentElement.style.setProperty('--tenant-background-color', customization.backgroundColor || '#f9fafb');
                
            } catch (error) {
                console.error('Error loading tenant customization:', error);
            }
        }
    }

    /* ========================================
       UTILITY FUNCTIONS
       ======================================== */

    rgbToHex(rgb) {
        // Convert rgb(r, g, b) to #rrggbb
        if (rgb.startsWith('#')) return rgb;
        
        const result = rgb.match(/\d+/g);
        if (result && result.length >= 3) {
            const r = parseInt(result[0]).toString(16).padStart(2, '0');
            const g = parseInt(result[1]).toString(16).padStart(2, '0');
            const b = parseInt(result[2]).toString(16).padStart(2, '0');
            return `#${r}${g}${b}`;
        }
        return '#3b82f6'; // fallback
    }

    darkenColor(hex, percent) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse r, g, b values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Darken each component
        const newR = Math.round(r * (1 - percent));
        const newG = Math.round(g * (1 - percent));
        const newB = Math.round(b * (1 - percent));
        
        // Convert back to hex
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            font-size: 0.875rem;
            font-weight: 500;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);

        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    handleOutsideClick(e) {
        if (this.customizationPanel.classList.contains('open') && 
            !this.customizationPanel.contains(e.target) && 
            e.target !== this.toggleCustomizationBtn) {
            this.closeCustomizationPanel();
        }
    }

    handleKeyboardShortcuts(e) {
        // ESC to close customization panel
        if (e.key === 'Escape' && this.customizationPanel.classList.contains('open')) {
            this.closeCustomizationPanel();
        }
        
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.loginForm.dispatchEvent(new Event('submit'));
        }
    }
}

/* ========================================
   INITIALIZE APPLICATION
   ======================================== */

// Initialize the login manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TenantLoginManager();
});

// Add some demo data for testing
window.addEventListener('load', () => {
    // Auto-fill demo credentials for testing (remove in production)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
        document.getElementById('email').value = 'admin@tenant.com';
        document.getElementById('password').value = 'password123';
    }
});