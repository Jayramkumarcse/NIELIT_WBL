// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
const confirmPassword = document.getElementById('confirmPassword');
const registerPassword = document.getElementById('registerPassword');
const successToast = document.getElementById('successToast');
const errorToast = document.getElementById('errorToast');

// Initialize Bootstrap components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize all popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Add password strength indicator
    addPasswordStrengthIndicator();
    
    // Add real-time validation
    addRealTimeValidation();
});

// Password Toggle Functionality
function togglePasswordVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Event listeners for password toggles
toggleLoginPassword.addEventListener('click', () => {
    togglePasswordVisibility('loginPassword', 'toggleLoginPassword');
});

toggleRegisterPassword.addEventListener('click', () => {
    togglePasswordVisibility('registerPassword', 'toggleRegisterPassword');
});

// Password Strength Indicator
function addPasswordStrengthIndicator() {
    const passwordInput = document.getElementById('registerPassword');
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    passwordInput.parentNode.appendChild(strengthIndicator);
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        strengthIndicator.className = 'password-strength ' + strength.level;
        
        if (password.length > 0) {
            strengthIndicator.style.display = 'block';
        } else {
            strengthIndicator.style.display = 'none';
        }
    });
}

function checkPasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');
    
    // Lowercase check
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');
    
    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');
    
    // Numbers check
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Include numbers');
    
    // Special characters check
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Include special characters');
    
    if (score <= 2) return { level: 'weak', score, feedback };
    if (score <= 3) return { level: 'medium', score, feedback };
    return { level: 'strong', score, feedback };
}

// Real-time Validation
function addRealTimeValidation() {
    const inputs = document.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
    
    // Special validation for confirm password
    confirmPassword.addEventListener('input', function() {
        const password = registerPassword.value;
        const confirm = this.value;
        
        if (confirm && password !== confirm) {
            this.classList.add('is-invalid');
            this.nextElementSibling.textContent = 'Passwords do not match';
        } else if (confirm) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Check if field is empty
    if (!value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else {
        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if (field.type === 'tel') {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Password validation for register form
        if (field.id === 'registerPassword') {
            const strength = checkPasswordStrength(value);
            if (strength.score < 3) {
                isValid = false;
                errorMessage = 'Password is too weak';
            }
        }
    }
    
    // Apply validation classes
    if (isValid) {
        field.classList.add('is-valid');
    } else {
        field.classList.add('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = errorMessage;
        }
    }
}

// Toast Notification System
function showToast(type, message) {
    const toast = type === 'success' ? successToast : errorToast;
    const messageElement = type === 'success' ? 
        document.getElementById('successMessage') : 
        document.getElementById('errorMessage');
    
    messageElement.textContent = message;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Form Submission Handlers
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (this.checkValidity()) {
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Signing In...';
        submitBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('loading');
            
            // Show success message
            showToast('success', 'Login successful! Redirecting...');
            
            // Redirect after 2 seconds (replace with actual redirect logic)
            setTimeout(() => {
                window.location.href = 'dashboard.html'; // Replace with your dashboard URL
            }, 2000);
        }, 2000);
    } else {
        this.classList.add('was-validated');
        showToast('error', 'Please fill in all required fields correctly.');
    }
});

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (this.checkValidity()) {
        // Check if passwords match
        const password = registerPassword.value;
        const confirm = confirmPassword.value;
        
        if (password !== confirm) {
            showToast('error', 'Passwords do not match');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating Account...';
        submitBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('loading');
            
            // Show success message
            showToast('success', 'Account created successfully! Please check your email for verification.');
            
            // Clear form
            this.reset();
            this.classList.remove('was-validated');
            
            // Switch to login tab
            const loginTab = document.getElementById('login-tab');
            const loginTabInstance = new bootstrap.Tab(loginTab);
            loginTabInstance.show();
        }, 2000);
    } else {
        this.classList.add('was-validated');
        showToast('error', 'Please fill in all required fields correctly.');
    }
});

// Social Login Handlers
document.querySelectorAll('.btn-outline-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const provider = this.querySelector('i').className.includes('google') ? 'Google' :
                        this.querySelector('i').className.includes('facebook') ? 'Facebook' :
                        'LinkedIn';
        
        showToast('info', `${provider} login functionality will be implemented here.`);
    });
});

// Forgot Password Handler
document.querySelector('a[href="#"]').addEventListener('click', function(e) {
    e.preventDefault();
    showToast('info', 'Password reset functionality will be implemented here.');
});

// Terms and Conditions Handler
document.querySelector('a[href="#"]').addEventListener('click', function(e) {
    e.preventDefault();
    showToast('info', 'Terms and Conditions will be displayed here.');
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Tab key navigation
    if (e.key === 'Tab') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('form-control')) {
            setTimeout(() => {
                validateField(activeElement);
            }, 100);
        }
    }
    
    // Enter key submission
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'INPUT') {
            const form = activeElement.closest('form');
            if (form) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.click();
                }
            }
        }
    }
});

// Form Reset Handler
function resetForms() {
    [loginForm, registerForm].forEach(form => {
        form.reset();
        form.classList.remove('was-validated');
        
        // Clear validation classes
        form.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
    });
}

// Auto-save form data to localStorage
function autoSaveFormData() {
    const forms = [loginForm, registerForm];
    
    forms.forEach(form => {
        const formId = form.id;
        const inputs = form.querySelectorAll('input');
        
        // Save on input change
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                const formData = {};
                form.querySelectorAll('input').forEach(inp => {
                    if (inp.value) {
                        formData[inp.id] = inp.value;
                    }
                });
                localStorage.setItem(`${formId}_data`, JSON.stringify(formData));
            });
        });
        
        // Load saved data on page load
        const savedData = localStorage.getItem(`${formId}_data`);
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`#${key}`);
                if (input) {
                    input.value = data[key];
                }
            });
        }
    });
}

// Initialize auto-save
autoSaveFormData();

// Clear saved data on successful submission
function clearSavedData() {
    localStorage.removeItem('loginForm_data');
    localStorage.removeItem('registerForm_data');
}

// Add to form submission handlers
loginForm.addEventListener('submit', clearSavedData);
registerForm.addEventListener('submit', clearSavedData);

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (!input.getAttribute('aria-label')) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.setAttribute('aria-label', label.textContent);
            }
        }
    });
    
    // Add skip link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only sr-only-focusable position-absolute';
    skipLink.style.cssText = 'top: -40px; left: 6px; z-index: 1000; background: #000; color: #fff; padding: 8px; text-decoration: none;';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const formSection = document.querySelector('.form-section');
    if (formSection) {
        formSection.id = 'main-content';
        formSection.setAttribute('role', 'main');
    }
});

// Performance optimization - Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to validation
const debouncedValidation = debounce(validateField, 300);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showToast('error', 'An unexpected error occurred. Please try again.');
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
