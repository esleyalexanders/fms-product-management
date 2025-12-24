// Manage Team Create Page Script (source of truth: localStorage.fms_staff)
document.addEventListener('DOMContentLoaded', function () {
    const StaffStore = window.FMSStaffStore;
    StaffStore?.ensureStaffSeededFromSamples?.();

    const form = document.getElementById('staffForm');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const profilePhotoInput = document.getElementById('profilePhoto');
    const photoPreview = document.getElementById('photoPreview');

    // Tab switching (page currently has 1 tab but keep generic)
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const tabName = this.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            const target = document.getElementById(tabName + '-tab');
            if (target) target.classList.add('active');
        });
    });

    // Photo upload preview (pure UI; we don't persist image to avoid localStorage bloat)
    profilePhotoInput?.addEventListener('change', function (e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (evt) {
            photoPreview.innerHTML = `<img src="${evt.target.result}" alt="Profile photo">`;
        };
        reader.readAsDataURL(file);
    });

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => (el.textContent = ''));
    }

    function validateForm() {
        clearErrors();

        let isValid = true;
        const fullName = document.getElementById('fullName')?.value?.trim() || '';
        const email = document.getElementById('email')?.value?.trim() || '';
        const phone = document.getElementById('phone')?.value?.trim() || '';
        const role = document.getElementById('role')?.value || '';
        const payRateRaw = document.getElementById('payRate')?.value;

        if (!fullName) {
            const el = document.getElementById('fullNameError');
            if (el) el.textContent = 'Full name is required';
            isValid = false;
        }

        if (!role) {
            const el = document.getElementById('roleError');
            if (el) el.textContent = 'Role is required';
            isValid = false;
        }

        if (!email) {
            const el = document.getElementById('emailError');
            if (el) el.textContent = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            const el = document.getElementById('emailError');
            if (el) el.textContent = 'Please enter a valid email address';
            isValid = false;
        }

        if (!phone) {
            const el = document.getElementById('phoneError');
            if (el) el.textContent = 'Phone number is required';
            isValid = false;
        } else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
            const el = document.getElementById('phoneError');
            if (el) el.textContent = 'Please enter a valid phone number';
            isValid = false;
        }

        const payRate = payRateRaw === '' || payRateRaw === undefined ? NaN : Number(payRateRaw);
        if (Number.isNaN(payRate) || payRate < 0) {
            const el = document.getElementById('payRateError');
            if (el) el.textContent = 'Please enter a valid hourly pay rate';
            isValid = false;
        }

        return isValid;
    }

    form?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateForm()) return;

        const fullName = document.getElementById('fullName').value.trim();
        const { firstName, lastName, name } = StaffStore?.splitName?.(fullName) || { firstName: '', lastName: '', name: fullName };

        const staff = {
            // Canonical id is generated in store; the input "Staff ID" is treated as employeeId
            employeeId: document.getElementById('staffId')?.value?.trim() || '',

            name,
            firstName,
            lastName,
            role: document.getElementById('role').value,
            jobTitle: document.getElementById('jobTitle')?.value?.trim() || '',
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            dateOfBirth: document.getElementById('dateOfBirth')?.value || '',
            status: 'active',

            // Payroll fields (Phase 0 minimum)
            defaultPayProfileId: '',
            hourlyRateOverride: Number(document.getElementById('payRate').value),
        };

        try {
            StaffStore?.upsertStaff?.(staff);
        } catch (err) {
            console.error(err);
            alert('Failed to create staff member (see console).');
            return;
        }

        alert('Staff member created successfully!');
        window.location.href = 'manage-team.html';
    });
});