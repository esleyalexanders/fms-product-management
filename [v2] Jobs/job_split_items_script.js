// Job Split Items - JavaScript
// Handles drag-and-drop item distribution across multiple jobs

// ============================================================================
// DATA & STATE
// ============================================================================

const quoteData = {
    id: 'Q-2024-001',
    customer: 'Sarah Johnson',
    items: [
        {
            id: 'item-1',
            name: 'Math Tutoring Session',
            description: '2 hours of advanced mathematics tutoring',
            quantity: 1,
            customPrice: 300,
            discount: 0,
            discountType: 'fixed',
            taxCategory: 'taxable_gst',
            category: 'Tutoring'
        },
        {
            id: 'item-2',
            name: 'Science Tutoring Session',
            description: '2 hours of science tutoring',
            quantity: 1,
            customPrice: 300,
            discount: 0,
            discountType: 'fixed',
            taxCategory: 'taxable_gst',
            category: 'Tutoring'
        },
        {
            id: 'item-3',
            name: 'English Tutoring Session',
            description: '2 hours of English and literature',
            quantity: 1,
            customPrice: 300,
            discount: 0,
            discountType: 'fixed',
            taxCategory: 'taxable_gst',
            category: 'Tutoring'
        },
        {
            id: 'item-4',
            name: 'Study Materials Package',
            description: 'Comprehensive study materials and workbooks',
            quantity: 1,
            customPrice: 150,
            discount: 0,
            discountType: 'fixed',
            taxCategory: 'taxable_gst',
            category: 'Materials'
        },
        {
            id: 'item-5',
            name: 'Progress Assessment',
            description: 'Comprehensive progress evaluation',
            quantity: 1,
            customPrice: 100,
            discount: 0,
            discountType: 'fixed',
            taxCategory: 'taxable_gst',
            category: 'Assessment'
        }
    ]
};

let jobs = [];
let availableItems = [...quoteData.items];
let jobCounter = 1;

// ============================================================================
// TAX & CALCULATION HELPERS
// ============================================================================

// Get tax rate based on tax category
function getTaxRate(taxCategory) {
    const taxRates = {
        'taxable_gst': 0.10,      // 10% GST
        'gst_free': 0.00,          // 0% GST-Free
        'input_taxed': 0.00        // 0% Input-Taxed
    };
    return taxRates[taxCategory] || 0.10; // Default to 10% if category not found
}

// Calculate tax for a single line item
function calculateLineItemTax(item) {
    const taxRate = getTaxRate(item.taxCategory);
    const lineTotal = item.customPrice * item.quantity;
    const discountAmount = item.discountType === 'percentage' 
        ? lineTotal * (item.discount / 100)
        : item.discount;
    const lineAfterDiscount = lineTotal - discountAmount;
    return lineAfterDiscount * taxRate;
}

// Calculate line total (price * quantity - discount)
function calculateLineTotal(item) {
    const lineTotal = item.customPrice * item.quantity;
    const discountAmount = item.discountType === 'percentage' 
        ? lineTotal * (item.discount / 100)
        : item.discount;
    return lineTotal - discountAmount;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeJobs();
    renderAvailableItems();
    renderJobCards();
    attachEventListeners();
    updateQuoteTotal();
});

function initializeJobs() {
    // Start with 2 empty jobs
    jobs = [
        createEmptyJob(),
        createEmptyJob()
    ];
}

function createEmptyJob() {
    return {
        id: `job-${jobCounter++}`,
        name: '',
        scheduleDate: '',
        scheduleTime: '',
        priority: 'medium',
        notes: '',
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0
    };
}

// ============================================================================
// RENDERING
// ============================================================================

function renderAvailableItems() {
    const container = document.getElementById('availableItemsList');
    const emptyState = document.getElementById('emptyState');
    const remainingCount = document.getElementById('remainingCount');
    
    if (availableItems.length === 0) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        remainingCount.textContent = '0 items';
        remainingCount.classList.remove('bg-orange-500');
        remainingCount.classList.add('bg-green-500');
    } else {
        container.classList.remove('hidden');
        emptyState.classList.add('hidden');
        remainingCount.textContent = `${availableItems.length} item${availableItems.length !== 1 ? 's' : ''}`;
        remainingCount.classList.remove('bg-green-500');
        remainingCount.classList.add('bg-orange-500');
        
        container.innerHTML = availableItems.map(item => createItemCard(item)).join('');
        
        // Attach drag event listeners
        container.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragend', handleDragEnd);
        });
    }
    
    updateCreateButton();
}

function createItemCard(item) {
    const lineTotal = calculateLineTotal(item);
    const lineTotalBeforeDiscount = item.customPrice * item.quantity;
    const discountAmount = item.discountType === 'percentage' 
        ? lineTotalBeforeDiscount * (item.discount / 100)
        : item.discount;
    
    // Tax badge
    let taxBadge = '';
    if (item.taxCategory) {
        const taxLabels = {
            'taxable_gst': '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700">📋 GST (10%)</span>',
            'gst_free': '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-50 text-gray-600">GST-Free</span>',
            'input_taxed': '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-50 text-gray-600">Input-Taxed</span>'
        };
        taxBadge = taxLabels[item.taxCategory] || '';
    }
    
    return `
        <div 
            class="item-card bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
            draggable="true"
            data-item-id="${item.id}"
        >
            <div class="flex items-start gap-2">
                <div class="flex-shrink-0 mt-1">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                    </svg>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900 text-sm">${item.name}</h3>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">${item.category}</span>
                                ${taxBadge}
                            </div>
                        </div>
                        <div class="text-right ml-2">
                            <div class="text-lg font-bold text-gray-900">$${lineTotal.toFixed(2)}</div>
                            ${item.discount > 0 ? `<div class="text-xs text-green-600">-$${discountAmount.toFixed(2)} off</div>` : ''}
                        </div>
                    </div>
                    <p class="text-xs text-gray-600 mb-2">${item.description}</p>
                    <div class="flex items-center gap-3 text-xs text-gray-500">
                        <span>Qty: ${item.quantity}</span>
                        <span>•</span>
                        <span>$${item.customPrice.toFixed(2)} each</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderJobCards() {
    const container = document.getElementById('jobCardsContainer');
    container.innerHTML = jobs.map((job, index) => createJobCard(job, index)).join('');
    
    // Attach event listeners
    jobs.forEach((job, index) => {
        const card = document.querySelector(`[data-job-id="${job.id}"]`);
        const dropZone = card.querySelector('.drop-zone');
        
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', (e) => handleDrop(e, index));
        
        // Remove item buttons
        card.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.itemId;
                removeItemFromJob(index, itemId);
            });
        });
        
        // Remove job button
        const removeJobBtn = card.querySelector('.remove-job-btn');
        if (removeJobBtn) {
            removeJobBtn.addEventListener('click', () => removeJob(index));
        }
        
        // Toggle collapse
        const toggleBtn = card.querySelector('.toggle-collapse-btn');
        const configSection = card.querySelector('.config-section');
        if (toggleBtn && configSection) {
            toggleBtn.addEventListener('click', () => {
                configSection.classList.toggle('hidden');
                const icon = toggleBtn.querySelector('svg');
                icon.style.transform = configSection.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            });
        }
        
        // Form inputs
        const nameInput = card.querySelector('.job-name-input');
        const dateInput = card.querySelector('.job-date-input');
        const timeInput = card.querySelector('.job-time-input');
        const notesInput = card.querySelector('.job-notes-input');
        const priorityInputs = card.querySelectorAll('.job-priority-input');
        
        if (nameInput) nameInput.addEventListener('input', (e) => updateJobField(index, 'name', e.target.value));
        if (dateInput) dateInput.addEventListener('change', (e) => updateJobField(index, 'scheduleDate', e.target.value));
        if (timeInput) timeInput.addEventListener('change', (e) => updateJobField(index, 'scheduleTime', e.target.value));
        if (notesInput) notesInput.addEventListener('input', (e) => updateJobField(index, 'notes', e.target.value));
        
        priorityInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                if (e.target.checked) {
                    updateJobField(index, 'priority', e.target.value);
                }
            });
        });
    });
}

function createJobCard(job, index) {
    const jobNumber = index + 1;
    const hasItems = job.items.length > 0;
    
    return `
        <div class="job-card bg-white rounded-lg shadow-sm overflow-hidden animate-slide-in" data-job-id="${job.id}">
            <!-- Header -->
            <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <span class="text-white font-bold text-sm">${jobNumber}</span>
                        </div>
                        <div>
                            <h3 class="font-semibold text-white">Job ${jobNumber}</h3>
                            <p class="text-emerald-100 text-xs">${job.items.length} item${job.items.length !== 1 ? 's' : ''} • $${job.total.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="toggle-collapse-btn p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors">
                            <svg class="w-5 h-5 text-white transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="transform: rotate(180deg);">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        ${jobs.length > 2 ? `
                        <button class="remove-job-btn p-1 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>

            <!-- Configuration Section -->
            <div class="config-section p-4 bg-gray-50 border-b border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Job Name (Optional)</label>
                        <input 
                            type="text" 
                            class="job-name-input w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="e.g., Week 1 Tutoring"
                            value="${job.name}"
                        >
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-1">📅 Date</label>
                            <input 
                                type="date" 
                                class="job-date-input w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                value="${job.scheduleDate}"
                            >
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-700 mb-1">🕐 Time</label>
                            <input 
                                type="time" 
                                class="job-time-input w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                value="${job.scheduleTime}"
                            >
                        </div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <label class="block text-xs font-semibold text-gray-700 mb-2">Priority</label>
                    <div class="flex gap-2">
                        <label class="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 ${job.priority === 'high' ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-lg cursor-pointer hover:border-red-300 transition-colors">
                            <input type="radio" name="priority-${job.id}" value="high" class="job-priority-input" ${job.priority === 'high' ? 'checked' : ''}>
                            <span class="text-sm font-medium">🔴 High</span>
                        </label>
                        <label class="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 ${job.priority === 'medium' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                            <input type="radio" name="priority-${job.id}" value="medium" class="job-priority-input" ${job.priority === 'medium' ? 'checked' : ''}>
                            <span class="text-sm font-medium">🔵 Medium</span>
                        </label>
                        <label class="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 ${job.priority === 'low' ? 'border-green-500 bg-green-50' : 'border-gray-200'} rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                            <input type="radio" name="priority-${job.id}" value="low" class="job-priority-input" ${job.priority === 'low' ? 'checked' : ''}>
                            <span class="text-sm font-medium">🟢 Low</span>
                        </label>
                    </div>
                </div>
                
                <div class="mt-4">
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Internal Notes</label>
                    <textarea 
                        class="job-notes-input w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        rows="2"
                        placeholder="Add notes for this job..."
                    >${job.notes}</textarea>
                </div>
            </div>

            <!-- Drop Zone -->
            <div class="drop-zone p-4 ${!hasItems ? 'empty' : ''}" data-job-index="${index}">
                ${hasItems ? `
                    <div class="space-y-2">
                        ${job.items.map(item => {
                            const lineTotal = calculateLineTotal(item);
                            const discountAmount = item.discountType === 'percentage' 
                                ? (item.customPrice * item.quantity) * (item.discount / 100)
                                : item.discount;
                            
                            // Tax badge
                            let taxBadge = '';
                            if (item.taxCategory) {
                                const taxLabels = {
                                    'taxable_gst': '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700">📋 GST (10%)</span>',
                                    'gst_free': '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-50 text-gray-600">GST-Free</span>',
                                    'input_taxed': '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-50 text-gray-600">Input-Taxed</span>'
                                };
                                taxBadge = taxLabels[item.taxCategory] || '';
                            }
                            
                            return `
                            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="flex-1">
                                        <h4 class="font-semibold text-gray-900 text-sm">${item.name}</h4>
                                        <div class="flex items-center gap-2 mt-1">
                                            <span class="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded">${item.category}</span>
                                            ${taxBadge}
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="text-right">
                                            <div class="text-lg font-bold text-emerald-700">$${lineTotal.toFixed(2)}</div>
                                            ${item.discount > 0 ? `<div class="text-xs text-green-600">-$${discountAmount.toFixed(2)} off</div>` : ''}
                                        </div>
                                        <button class="remove-item-btn p-1 hover:bg-red-100 rounded transition-colors" data-item-id="${item.id}">
                                            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p class="text-xs text-gray-600 mb-2">${item.description}</p>
                                <div class="flex items-center gap-3 text-xs text-gray-500">
                                    <span>Qty: ${item.quantity}</span>
                                    <span>•</span>
                                    <span>$${item.customPrice.toFixed(2)} each</span>
                                </div>
                            </div>
                        `;
                        }).join('')}
                    </div>
                ` : `
                    <div class="text-center py-8">
                        <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                        <p class="text-sm text-gray-500 font-medium">Drop items here</p>
                        <p class="text-xs text-gray-400 mt-1">Drag items from the left panel</p>
                    </div>
                `}
            </div>

            <!-- Financial Summary -->
            ${hasItems ? `
            <div class="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Subtotal:</span>
                    <span class="font-semibold text-gray-900">$${job.subtotal.toFixed(2)}</span>
                </div>
                <div class="border-t border-gray-200 mt-2 pt-2">
                    <div class="text-xs text-gray-600 mb-1">Tax Breakdown:</div>
                    <div class="space-y-1 text-xs">
                        ${(() => {
                            const taxBreakdown = { taxable_gst: 0, gst_free: 0, input_taxed: 0 };
                            job.items.forEach(item => {
                                const taxAmount = calculateLineItemTax(item);
                                if (item.taxCategory && taxBreakdown.hasOwnProperty(item.taxCategory)) {
                                    taxBreakdown[item.taxCategory] += taxAmount;
                                } else {
                                    taxBreakdown.taxable_gst += taxAmount;
                                }
                            });
                            
                            let html = '';
                            if (taxBreakdown.taxable_gst > 0) {
                                html += '<div class="flex justify-between"><span>GST (10%):</span><span>$' + taxBreakdown.taxable_gst.toFixed(2) + '</span></div>';
                            }
                            if (taxBreakdown.gst_free > 0) {
                                html += '<div class="flex justify-between text-gray-500"><span>GST-Free:</span><span>$0.00</span></div>';
                            }
                            if (taxBreakdown.input_taxed > 0) {
                                html += '<div class="flex justify-between text-gray-500"><span>Input-Taxed:</span><span>$0.00</span></div>';
                            }
                            return html || '<div class="text-gray-400">No taxable items</div>';
                        })()}
                    </div>
                    <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <span class="text-sm text-gray-600">Total Tax:</span>
                        <span class="text-sm font-semibold text-gray-900">$${job.tax.toFixed(2)}</span>
                    </div>
                </div>
                <div class="flex items-center justify-between text-base mt-2 pt-2 border-t-2 border-gray-300">
                    <span class="font-bold text-gray-900">Total:</span>
                    <span class="font-bold text-emerald-600 text-lg">$${job.total.toFixed(2)}</span>
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

// ============================================================================
// DRAG & DROP HANDLERS
// ============================================================================

let draggedItem = null;

function handleDragStart(e) {
    draggedItem = e.target.dataset.itemId;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedItem = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e, jobIndex) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedItem) return;
    
    const item = availableItems.find(i => i.id === draggedItem);
    if (!item) return;
    
    // Move item to job
    availableItems = availableItems.filter(i => i.id !== draggedItem);
    jobs[jobIndex].items.push(item);
    calculateJobTotals(jobIndex);
    
    // Re-render
    renderAvailableItems();
    renderJobCards();
}

// ============================================================================
// JOB MANAGEMENT
// ============================================================================

function updateJobField(jobIndex, field, value) {
    jobs[jobIndex][field] = value;
}

function calculateJobTotals(jobIndex) {
    const job = jobs[jobIndex];
    
    // Calculate subtotal (sum of line totals after discounts)
    job.subtotal = job.items.reduce((sum, item) => {
        return sum + calculateLineTotal(item);
    }, 0);
    
    // Calculate tax (sum of tax for each line item based on tax category)
    job.tax = job.items.reduce((sum, item) => {
        return sum + calculateLineItemTax(item);
    }, 0);
    
    // Calculate total
    job.total = job.subtotal + job.tax;
}

function removeItemFromJob(jobIndex, itemId) {
    const job = jobs[jobIndex];
    const item = job.items.find(i => i.id === itemId);
    
    if (!item) return;
    
    // Move item back to available
    job.items = job.items.filter(i => i.id !== itemId);
    availableItems.push(item);
    calculateJobTotals(jobIndex);
    
    // Re-render
    renderAvailableItems();
    renderJobCards();
}

function removeJob(jobIndex) {
    if (jobs.length <= 2) {
        showToast('Minimum 2 jobs required', 'error');
        return;
    }
    
    // Return all items to available
    const job = jobs[jobIndex];
    availableItems.push(...job.items);
    
    // Remove job
    jobs.splice(jobIndex, 1);
    
    // Re-render
    renderAvailableItems();
    renderJobCards();
}

function addJob() {
    if (jobs.length >= 10) {
        showToast('Maximum 10 jobs allowed', 'error');
        return;
    }
    
    jobs.push(createEmptyJob());
    renderJobCards();
}

// ============================================================================
// QUICK ACTIONS
// ============================================================================

function splitEvenly() {
    if (availableItems.length === 0) {
        showToast('No items to distribute', 'error');
        return;
    }
    
    // Clear all jobs
    jobs.forEach(job => {
        availableItems.push(...job.items);
        job.items = [];
    });
    
    // Distribute evenly
    const itemsPerJob = Math.floor(availableItems.length / jobs.length);
    const remainder = availableItems.length % jobs.length;
    
    let currentIndex = 0;
    jobs.forEach((job, index) => {
        const count = itemsPerJob + (index < remainder ? 1 : 0);
        const itemsToAssign = availableItems.slice(currentIndex, currentIndex + count);
        job.items = itemsToAssign;
        calculateJobTotals(index);
        currentIndex += count;
    });
    
    availableItems = [];
    
    renderAvailableItems();
    renderJobCards();
    showToast('Items distributed evenly', 'success');
}

function splitByType() {
    if (availableItems.length === 0) {
        showToast('No items to distribute', 'error');
        return;
    }
    
    // Clear all jobs
    jobs.forEach(job => {
        availableItems.push(...job.items);
        job.items = [];
    });
    
    // Group by category
    const groups = {};
    availableItems.forEach(item => {
        const category = item.category || 'Other';
        if (!groups[category]) groups[category] = [];
        groups[category].push(item);
    });
    
    const categories = Object.keys(groups);
    
    // Ensure enough jobs
    while (jobs.length < categories.length && jobs.length < 10) {
        jobs.push(createEmptyJob());
    }
    
    // Assign groups to jobs
    categories.forEach((category, index) => {
        if (index < jobs.length) {
            jobs[index].items = groups[category];
            jobs[index].name = `${category} Services`;
            calculateJobTotals(index);
        }
    });
    
    availableItems = [];
    
    renderAvailableItems();
    renderJobCards();
    showToast('Items grouped by type', 'success');
}

function clearAllAssignments() {
    jobs.forEach(job => {
        availableItems.push(...job.items);
        job.items = [];
        job.subtotal = 0;
        job.tax = 0;
        job.total = 0;
    });
    
    renderAvailableItems();
    renderJobCards();
    showToast('All assignments cleared', 'success');
}

// ============================================================================
// VALIDATION & SUBMISSION
// ============================================================================

function updateCreateButton() {
    const btn = document.getElementById('createAllJobsBtn');
    const allAssigned = availableItems.length === 0;
    const allJobsHaveItems = jobs.every(job => job.items.length > 0);
    
    btn.disabled = !allAssigned || !allJobsHaveItems;
}

function createAllJobs() {
    // Validate
    if (availableItems.length > 0) {
        showToast('All items must be assigned', 'error');
        return;
    }
    
    if (jobs.some(job => job.items.length === 0)) {
        showToast('Each job must have at least one item', 'error');
        return;
    }
    
    // Show loading
    const btn = document.getElementById('createAllJobsBtn');
    btn.disabled = true;
    btn.innerHTML = `
        <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Creating ${jobs.length} jobs...
    `;
    
    // Simulate API call
    setTimeout(() => {
        console.log('Creating jobs:', jobs);
        showToast(`${jobs.length} jobs created successfully!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'job_list.html';
        }, 1500);
    }, 2000);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function attachEventListeners() {
    document.getElementById('splitEvenlyBtn').addEventListener('click', splitEvenly);
    document.getElementById('splitByTypeBtn').addEventListener('click', splitByType);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllAssignments);
    document.getElementById('addJobBtn').addEventListener('click', addJob);
    document.getElementById('createAllJobsBtn').addEventListener('click', createAllJobs);
}

// ============================================================================
// QUOTE TOTAL DISPLAY
// ============================================================================

function updateQuoteTotal() {
    // Calculate quote total from all items
    const subtotal = quoteData.items.reduce((sum, item) => {
        return sum + calculateLineTotal(item);
    }, 0);
    
    const tax = quoteData.items.reduce((sum, item) => {
        return sum + calculateLineItemTax(item);
    }, 0);
    
    const total = subtotal + tax;
    
    // Update display in header (if element exists)
    const quoteTotalElement = document.querySelector('[data-quote-total]');
    if (quoteTotalElement) {
        quoteTotalElement.textContent = `${quoteData.items.length} items • $${total.toFixed(2)}`;
    }
}

// ============================================================================
// UTILITIES
// ============================================================================

function showToast(message, type = 'success') {
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`;
    toast.innerHTML = `
        <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${type === 'success' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'}"></path>
            </svg>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}
