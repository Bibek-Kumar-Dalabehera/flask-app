// ========================================
//  main.js — FlaskApp Frontend Logic
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    initPasswordToggle();
    initPasswordStrength();
    initFormValidation();
});


// ----------------------------------------
//  Toggle Password Visibility
// ----------------------------------------
function initPasswordToggle() {
    const toggleBtns = document.querySelectorAll(".toggle-password");

    toggleBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const input = btn.parentElement.querySelector("input");
            if (input.type === "password") {
                input.type = "text";
                btn.textContent = "🙈";
            } else {
                input.type = "password";
                btn.textContent = "👁";
            }
        });
    });
}


// ----------------------------------------
//  Password Strength Meter (Signup Page)
// ----------------------------------------
function initPasswordStrength() {
    const passwordInput = document.querySelector("#signupForm #password");
    const strengthFill = document.getElementById("strengthFill");
    const strengthText = document.getElementById("strengthText");

    if (!passwordInput || !strengthFill || !strengthText) return;

    passwordInput.addEventListener("input", () => {
        const val = passwordInput.value;
        let score = 0;

        if (val.length >= 6) score++;
        if (val.length >= 10) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        const levels = [
            { label: "",       color: "transparent", width: "0%"   },
            { label: "Weak",   color: "#ff5c5c",     width: "20%"  },
            { label: "Fair",   color: "#ffb84d",     width: "40%"  },
            { label: "Good",   color: "#ffb84d",     width: "60%"  },
            { label: "Strong", color: "#00d4aa",     width: "80%"  },
            { label: "Great",  color: "#00d4aa",     width: "100%" },
        ];

        const level = levels[score];
        strengthFill.style.width = level.width;
        strengthFill.style.background = level.color;
        strengthText.textContent = level.label;
        strengthText.style.color = level.color;
    });
}


// ----------------------------------------
//  Form Validation Utilities
// ----------------------------------------

// Validation rules and patterns
const VALIDATION_RULES = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address"
    },
    password: {
        minLength: 8,
        message: "Password must be at least 8 characters long"
    },
    passwordMatch: {
        message: "Passwords do not match"
    },
    required: {
        message: "This field is required"
    }
};

// Email validation
function validateEmail(email) {
    return VALIDATION_RULES.email.pattern.test(email);
}

// Password validation
function validatePassword(password) {
    return password.length >= VALIDATION_RULES.password.minLength;
}

// Password match validation
function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword && password.length > 0;
}

// Required field validation
function validateRequired(value) {
    return value.trim().length > 0;
}

// Display error message for a field
function showFieldError(fieldElement, errorMessage) {
    removeFieldError(fieldElement);
    
    fieldElement.classList.add("error");
    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = errorMessage;
    
    const wrapper = fieldElement.closest(".form-group") || fieldElement.parentElement;
    wrapper.appendChild(errorDiv);
}

// Remove error message from a field
function removeFieldError(fieldElement) {
    fieldElement.classList.remove("error");
    const errorDiv = fieldElement.closest(".form-group")?.querySelector(".field-error") || 
                     fieldElement.parentElement?.querySelector(".field-error");
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Display success state for a field
function showFieldSuccess(fieldElement) {
    fieldElement.classList.add("success");
    fieldElement.classList.remove("error");
    const errorDiv = fieldElement.closest(".form-group")?.querySelector(".field-error");
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Validate a single field with real-time feedback
function validateField(fieldElement) {
    const fieldValue = fieldElement.value;
    const fieldId = fieldElement.id;
    const fieldName = fieldElement.name;

    // Handle email field
    if (fieldId === "email" || fieldName === "email") {
        if (!validateRequired(fieldValue)) {
            showFieldError(fieldElement, VALIDATION_RULES.required.message);
            return false;
        } else if (!validateEmail(fieldValue)) {
            showFieldError(fieldElement, VALIDATION_RULES.email.message);
            return false;
        } else {
            showFieldSuccess(fieldElement);
            return true;
        }
    }

    // Handle password field (on signup)
    if (fieldId === "password" && fieldElement.closest("#signupForm")) {
        if (!validateRequired(fieldValue)) {
            showFieldError(fieldElement, VALIDATION_RULES.required.message);
            return false;
        } else if (!validatePassword(fieldValue)) {
            showFieldError(fieldElement, VALIDATION_RULES.password.message);
            return false;
        } else {
            showFieldSuccess(fieldElement);
            // Also validate confirm password if it has a value
            const confirmPwField = document.getElementById("confirmPassword");
            if (confirmPwField && confirmPwField.value) {
                validateField(confirmPwField);
            }
            return true;
        }
    }

    // Handle password field (on login)
    if (fieldId === "password" && fieldElement.closest("#loginForm")) {
        if (!validateRequired(fieldValue)) {
            showFieldError(fieldElement, VALIDATION_RULES.required.message);
            return false;
        } else {
            showFieldSuccess(fieldElement);
            return true;
        }
    }

    // Handle confirm password field
    if (fieldId === "confirmPassword") {
        const passwordField = document.getElementById("password");
        if (!validateRequired(fieldValue)) {
            showFieldError(fieldElement, VALIDATION_RULES.required.message);
            return false;
        } else if (!validatePasswordMatch(passwordField.value, fieldValue)) {
            showFieldError(fieldElement, VALIDATION_RULES.passwordMatch.message);
            return false;
        } else {
            showFieldSuccess(fieldElement);
            return true;
        }
    }

    // Handle name field
    if (fieldId === "name") {
        if (!validateRequired(fieldValue)) {
            showFieldError(fieldElement, VALIDATION_RULES.required.message);
            return false;
        } else {
            showFieldSuccess(fieldElement);
            return true;
        }
    }

    // Handle terms checkbox
    if (fieldId === "agreeTerms") {
        if (!fieldElement.checked) {
            showFieldError(fieldElement, "You must agree to the Terms of Service");
            return false;
        } else {
            removeFieldError(fieldElement);
            return true;
        }
    }

    // Default required validation
    if (!validateRequired(fieldValue)) {
        showFieldError(fieldElement, VALIDATION_RULES.required.message);
        return false;
    } else {
        showFieldSuccess(fieldElement);
        return true;
    }
}

// Validate entire form
function validateForm(formElement) {
    const fields = formElement.querySelectorAll("input[required], input[type='checkbox']");
    let isValid = true;

    fields.forEach((field) => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// Initialize form validation with real-time feedback
function initFormValidation() {
    // Setup real-time validation on all forms
    const forms = document.querySelectorAll("form");
    
    forms.forEach((form) => {
        const inputs = form.querySelectorAll("input[type='text'], input[type='email'], input[type='password'], input[type='checkbox']");
        
        inputs.forEach((input) => {
            // Real-time validation on blur
            input.addEventListener("blur", () => {
                validateField(input);
            });

            // Real-time validation on input for better UX
            input.addEventListener("input", () => {
                // Only validate if field already has an error
                if (input.classList.contains("error")) {
                    validateField(input);
                }
            });
        });

        // Form submission validation
        form.addEventListener("submit", (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
                // Focus on first invalid field
                const firstInvalid = form.querySelector("input.error");
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    });
}
