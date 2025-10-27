// Manage Team Edit Page Script
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('staffForm');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const profilePhotoInput = document.getElementById('profilePhoto');
    const photoPreview = document.getElementById('photoPreview');
    const deactivateBtn = document.getElementById('deactivateBtn');
    const currentStatus = document.getElementById('currentStatus');

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;

            // Update tab buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });

    // Photo upload preview
    profilePhotoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="Profile photo">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Deactivate/Reactivate functionality
    deactivateBtn.addEventListener('click', function() {
        const currentStatusText = currentStatus.textContent.toLowerCase();
        const action = currentStatusText === 'active' ? 'deactivate' : 'reactivate';
        const newStatus = currentStatusText === 'active' ? 'Inactive' : 'Active';

        if (confirm(`Are you sure you want to ${action} this staff member?`)) {
            currentStatus.textContent = newStatus;
            currentStatus.className = `status-badge status-${newStatus.toLowerCase()}`;
            deactivateBtn.textContent = currentStatusText === 'active' ? 'Reactivate Staff Member' : 'Deactivate Staff Member';
        }
    });

    // Form validation (similar to create script)
    function validateForm() {
        let isValid = true;
        const errors = {};

        // Personal info validation
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const startDate = document.getElementById('startDate').value;
        const role = document.getElementById('role').value.trim();

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        if (!firstName) {
            errors.firstName = 'First name is required';
            isValid = false;
        }

        if (!lastName) {
            errors.lastName = 'Last name is required';
            isValid = false;
        }

        if (!email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!phone) {
            errors.phone = 'Phone number is required';
            isValid = false;
        } else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
            errors.phone = 'Please enter a valid phone number';
            isValid = false;
        }

        if (!startDate) {
            errors.startDate = 'Start date is required';
            isValid = false;
        } else if (new Date(startDate) > new Date()) {
            errors.startDate = 'Start date cannot be in the future';
            isValid = false;
        }

        if (!role) {
            errors.role = 'Role is required';
            isValid = false;
        }

        // Display errors
        Object.keys(errors).forEach(field => {
            const errorEl = document.getElementById(field + 'Error');
            if (errorEl) {
                errorEl.textContent = errors[field];
            }
        });

        return isValid;
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm()) {
            // Collect form data
            const formData = new FormData();
            formData.append('firstName', document.getElementById('firstName').value);
            formData.append('lastName', document.getElementById('lastName').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('phone', document.getElementById('phone').value);
            formData.append('dateOfBirth', document.getElementById('dateOfBirth').value);
            formData.append('employeeId', document.getElementById('employeeId').value);
            formData.append('startDate', document.getElementById('startDate').value);
            formData.append('employmentType', document.getElementById('employmentType').value);
            formData.append('hourlyRate', document.getElementById('hourlyRate').value);
            formData.append('role', document.getElementById('role').value);
            formData.append('jobTitle', document.getElementById('jobTitle').value);
            formData.append('sendUpdateNotification', document.getElementById('sendUpdateNotification').checked);

            // Scheduling fields: collect from dynamic UI
            function collectScheduling(){
                const scheduling = {};
                scheduling.locations = (document.getElementById('locations')||{value:''}).value.split(',').map(s=>s.trim()).filter(Boolean);
                scheduling.skills = (document.getElementById('skills')||{value:''}).value.split(',').map(s=>s.trim()).filter(Boolean);
                scheduling.availability = {};
                Array.from(availabilityContainer.children).forEach(dayBox => {
                    const dayKey = dayBox.querySelector('strong')?.textContent?.toLowerCase();
                    if (!dayKey) return;
                    const ranges = [];
                    Array.from(dayBox.querySelectorAll('.ranges > div')).forEach(r => {
                        const s = r.querySelector('.range-start')?.value || null;
                        const e = r.querySelector('.range-end')?.value || null;
                        if (s && e) ranges.push({ start: s, end: e });
                    });
                    scheduling.availability[dayKey] = ranges;
                });

                scheduling.blocked = Array.from(blockedContainer.querySelectorAll('div')).map(b => ({ from: b.querySelector('.blocked-from')?.value||null, to: b.querySelector('.blocked-to')?.value||null })).filter(x=>x.from && x.to);
                scheduling.maxHoursPerWeek = (document.getElementById('maxHoursPerWeek')||{value:''}).value;
                scheduling.maxConsecutiveDays = (document.getElementById('maxConsecutiveDays')||{value:''}).value;
                scheduling.minShiftLengthMins = (document.getElementById('minShiftLengthMins')||{value:''}).value;
                scheduling.shiftPaddingMins = (document.getElementById('shiftPaddingMins')||{value:''}).value;
                
                // Home base location handling
                const homeBaseType = document.getElementById('homeBaseType')?.value || 'store';
                if (homeBaseType === 'custom') {
                    scheduling.homeBase = (document.getElementById('homeBase')||{value:''}).value;
                    scheduling.homeBaseType = 'custom';
                } else {
                    scheduling.homeBase = document.getElementById('storeAddressText')?.textContent || '';
                    scheduling.homeBaseType = 'store';
                }
                
                scheduling.certifications = Array.from(certContainer.querySelectorAll('.cert-row')).map(r=>({ name: r.querySelector('.cert-name')?.value||'', expires: r.querySelector('.cert-expires')?.value||'', file: r.querySelector('.cert-file')?.files?.[0]?.name || null }));
                return scheduling;
            }

            formData.append('scheduling', JSON.stringify(collectScheduling()));

            if (profilePhotoInput.files[0]) {
                formData.append('profilePhoto', profilePhotoInput.files[0]);
            }

            // Here you would typically send the data to your backend
            console.log('Form data collected:', Object.fromEntries(formData));

            // Show success message and redirect
            alert('Staff member updated successfully!');
            window.location.href = 'manage-team.html';
        }
    });

    // Certifications dynamic UI
    const certContainer = document.getElementById('certificationsContainer');
    const addCertBtn = document.getElementById('addCertBtn');
    function createCertRow(name='', expires=''){
        const div = document.createElement('div');
        div.className = 'cert-row';
        div.style.display = 'flex';
        div.style.gap = '8px';
        div.style.marginTop = '8px';
        div.innerHTML = `<input class="cert-name" placeholder="Name" value="${name}"><input type="date" class="cert-expires" value="${expires}"><input type="file" class="cert-file" accept="application/pdf,image/*"><button type="button" class="btn-danger remove-cert">Remove</button>`;
        div.querySelector('.remove-cert').addEventListener('click', ()=>div.remove());
        return div;
    }
    addCertBtn.addEventListener('click', ()=>{ certContainer.appendChild(createCertRow()); });

    // Availability UI
    const availabilityContainer = document.getElementById('availabilityContainer');
    const days = ['mon','tue','wed','thu','fri','sat','sun'];
    function createAvailabilityDay(dayLabel){
        const wrapper = document.createElement('div');
        wrapper.className = 'avail-day';
        wrapper.innerHTML = `<div class="avail-day-header"><strong>${dayLabel.toUpperCase()}</strong><div><button type="button" class="btn-secondary add-range">Add range</button></div></div><div class="ranges"></div>`;
        wrapper.querySelector('.add-range').addEventListener('click', ()=>{ wrapper.querySelector('.ranges').appendChild(createRangeRow()); });
        return wrapper;
    }

    function createRangeRow(start='', end=''){
        const r = document.createElement('div');
        r.className = 'range-row';
        r.innerHTML = `<input type="time" class="range-start" value="${start}"> <span class="range-to">to</span> <input type="time" class="range-end" value="${end}"><button type="button" class="btn-danger remove-range">Remove</button>`;
        r.querySelector('.remove-range').addEventListener('click', ()=>r.remove());
        return r;
    }

    // initialize day containers
    days.forEach(d=> availabilityContainer.appendChild(createAvailabilityDay(d)));

    // weekday preset (uses user-editable preset times)
    const applyWeekdayPresetBtn = document.getElementById('applyWeekdayPreset');
    applyWeekdayPresetBtn.addEventListener('click', ()=>{
        const start = (document.getElementById('weekdayPresetStart')||{}).value || '09:00';
        const end = (document.getElementById('weekdayPresetEnd')||{}).value || '17:00';
        if (!start || !end) { alert('Please set both start and end times for the preset.'); return; }
        if (start >= end) { alert('Preset start time must be earlier than end time.'); return; }
        days.slice(0,5).forEach(d=>{
            const dayBox = Array.from(availabilityContainer.children).find(c => c.querySelector('strong').textContent.toLowerCase()===d);
            if (dayBox){
                dayBox.querySelector('.ranges').innerHTML = '';
                dayBox.querySelector('.ranges').appendChild(createRangeRow(start,end));
            }
        });
    });

    // Blocked date ranges
    const blockedContainer = document.getElementById('blockedContainer');
    const addBlockedBtn = document.getElementById('addBlockedBtn');
    function createBlockedRow(from='', to=''){
        const div = document.createElement('div');
        div.className = 'blocked-row';
        div.innerHTML = `<input type="date" class="blocked-from" value="${from}"> <span class="range-to">to</span> <input type="date" class="blocked-to" value="${to}"><button type="button" class="btn-danger remove-blocked">Remove</button>`;
        div.querySelector('.remove-blocked').addEventListener('click', ()=>div.remove());
        return div;
    }
    addBlockedBtn.addEventListener('click', ()=> blockedContainer.appendChild(createBlockedRow()));

    // Home Base Location toggle
    const homeBaseType = document.getElementById('homeBaseType');
    const homeBaseInput = document.getElementById('homeBase');
    const storeAddressDisplay = document.getElementById('storeAddressDisplay');

    if (homeBaseType) {
        homeBaseType.addEventListener('change', function() {
            if (this.value === 'custom') {
                homeBaseInput.style.display = 'block';
                storeAddressDisplay.style.display = 'none';
                homeBaseInput.focus();
            } else {
                homeBaseInput.style.display = 'none';
                storeAddressDisplay.style.display = 'block';
                homeBaseInput.value = ''; // Clear custom address when switching back
            }
        });
    }

    // Load existing data (in a real app, this would come from an API)
    // For demo purposes, data is already populated in the HTML
});