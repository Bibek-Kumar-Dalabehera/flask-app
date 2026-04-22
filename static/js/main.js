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
//  Basic Client-Side Form Validation
// ----------------------------------------
function initFormValidation() {
    // Signup form — check password match
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            const pw = document.getElementById("password").value;
            const cpw = document.getElementById("confirmPassword").value;

            if (pw !== cpw) {
                e.preventDefault();
                alert("Passwords do not match!");
                document.getElementById("confirmPassword").focus();
            }
        });
    }
}
