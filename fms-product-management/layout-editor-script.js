// ========================================
// LAYOUT EDITOR SCRIPT
// ========================================

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeTreeToggles();
    initializeRangeSlider();
    initializeDragAndDrop();
    initializeSettingsPanel();
    initializeComponentManipulation();
    initializeLiveSelection();
    initializeResponsivePreview();
    initializeUndoRedo();
    initializeAutoSave();
    initializeKeyboardShortcuts();
    // initializeHoverBorders(); // CSS-only hover effects - no JS needed

    // Add draggable attributes to preview elements
    document.querySelectorAll('.product-card, .testimonial-card').forEach((el, index) => {
        el.id = `draggable-${index}`;
        el.setAttribute('data-draggable', 'true');
    });
});

// ========================================
// TREE NAVIGATION TOGGLES
// ========================================
function initializeTreeToggles() {
    const treeItems = document.querySelectorAll('.tree-item-header');
    
    treeItems.forEach(header => {
        header.addEventListener('click', function(e) {
            // Don't toggle if clicking on a button
            if (e.target.closest('.add-section-btn')) {
                return;
            }
            
            const treeItem = this.closest('.tree-item');
            const toggleIcon = this.querySelector('.toggle-icon');
            const children = treeItem.querySelector('.tree-item-children');
            
            if (children && toggleIcon) {
                // Toggle the children visibility
                if (children.style.display === 'none') {
                    children.style.display = 'block';
                    toggleIcon.classList.remove('fa-chevron-right');
                    toggleIcon.classList.add('fa-chevron-down');
                } else {
                    children.style.display = 'none';
                    toggleIcon.classList.remove('fa-chevron-down');
                    toggleIcon.classList.add('fa-chevron-right');
                }
            }
            
            // Remove active class from all items
            document.querySelectorAll('.tree-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            treeItem.classList.add('active');
        });
    });
}

// ========================================
// RANGE SLIDER SYNCHRONIZATION
// ========================================
function initializeRangeSlider() {
    const radiusSlider = document.querySelector('.radius-slider');
    const radiusInput = document.querySelector('.radius-input');
    const radiusIndicator = document.querySelector('.radius-indicator');
    
    if (!radiusSlider || !radiusInput || !radiusIndicator) {
        return;
    }
    
    // Update input when slider changes
    radiusSlider.addEventListener('input', function() {
        const { value } = this;
        radiusInput.value = value;
        radiusIndicator.style.borderRadius = `${value}px`;
    });
    
    // Update slider when input changes
    radiusInput.addEventListener('input', function() {
        const value = Math.min(Math.max(parseInt(this.value) || 0, 0), 50);
        this.value = value;
        radiusSlider.value = value;
        radiusIndicator.style.borderRadius = `${value}px`;
    });
}

// ========================================
// DRAG AND DROP FUNCTIONALITY
// ========================================
let draggedElement = null;
let draggedOverElement = null;
let dragStartIndex = null;
let dragOverIndex = null;

function initializeDragAndDrop() {
    const treeItems = document.querySelectorAll('.tree-item-header');
    
    treeItems.forEach(header => {
        const gripIcon = header.querySelector('.grip-icon');
        
        if (gripIcon) {
            // Make grip icon the drag handle
            gripIcon.addEventListener('mousedown', startDrag);
            gripIcon.style.cursor = 'grab';
            
            // Prevent text selection during drag
            gripIcon.addEventListener('selectstart', e => e.preventDefault());
        }
    });
    
    // Set up drop zones
    setupDropZones();
}

function startDrag(e) {
    const header = e.target.closest('.tree-item-header');
    const treeItem = header.closest('.tree-item');
    
    draggedElement = treeItem;
    dragStartIndex = Array.from(treeItem.parentElement.children).indexOf(treeItem);
    
    // Add visual feedback
    treeItem.classList.add('dragging');
    document.body.classList.add('dragging-active');
    
    // Create drag image
    const dragImage = treeItem.cloneNode(true);
    dragImage.className = 'drag-image';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.opacity = '0.8';
    dragImage.style.transform = 'rotate(5deg)';
    document.body.appendChild(dragImage);
    
    e.dataTransfer.setDragImage(dragImage, e.offsetX, e.offsetY);
    e.dataTransfer.effectAllowed = 'move';
    
    // Clean up drag image after drag starts
    setTimeout(() => document.body.removeChild(dragImage), 0);
    
    // Add global drag listeners
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);
    document.addEventListener('dragend', onDragEnd);
}

function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const target = e.target.closest('.tree-item');
    if (!target || target === draggedElement) {
        return;
    }
    
    const rect = target.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    
    // Remove previous indicators
    document.querySelectorAll('.drop-indicator').forEach(indicator => indicator.remove());
    
    // Add drop indicator
    const indicator = document.createElement('div');
    indicator.className = 'drop-indicator';
    
    if (e.clientY < midpoint) {
        // Drop above
        target.parentElement.insertBefore(indicator, target);
        dragOverIndex = Array.from(target.parentElement.children).indexOf(target);
    } else {
        // Drop below
        target.parentElement.insertBefore(indicator, target.nextSibling);
        dragOverIndex = Array.from(target.parentElement.children).indexOf(target) + 1;
    }
    
    draggedOverElement = target;
}

function onDrop(e) {
    e.preventDefault();
    
    if (!draggedElement || !draggedOverElement) {
        return;
    }
    
    const container = draggedElement.parentElement;
    const indicator = document.querySelector('.drop-indicator');
    
    if (indicator) {
        container.insertBefore(draggedElement, indicator);
        indicator.remove();
    }
    
    // Update preview
    updatePreviewFromTree();
    
    // Show success notification
    showNotification('Component moved successfully', 'success');
}

function onDragEnd() {
    // Clean up
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
    }
    
    document.body.classList.remove('dragging-active');
    document.querySelectorAll('.drop-indicator').forEach(indicator => indicator.remove());
    
    draggedElement = null;
    draggedOverElement = null;
    dragStartIndex = null;
    dragOverIndex = null;
    
    // Remove global listeners
    document.removeEventListener('dragover', onDragOver);
    document.removeEventListener('drop', onDrop);
    document.removeEventListener('dragend', onDragEnd);
}

function setupDropZones() {
    const treeItems = document.querySelectorAll('.tree-item');
    
    treeItems.forEach(item => {
        item.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        item.addEventListener('drop', e => {
            e.preventDefault();
            
            if (draggedElement && draggedElement !== item) {
                const container = item.parentElement;
                const rect = item.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    container.insertBefore(draggedElement, item);
                } else {
                    container.insertBefore(draggedElement, item.nextSibling);
                }
                
                updatePreviewFromTree();
                showNotification('Component reordered', 'success');
            }
        });
    });
}

function updatePreviewFromTree() {
    // This function would update the preview area based on the tree structure
    // For now, just show a notification that the preview was updated
    console.log('Preview updated from tree structure');
}

// ========================================
// SETTINGS PANEL INTERACTIONS
// ========================================
function initializeSettingsPanel() {
    // Size button groups
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from siblings
            this.parentElement.querySelectorAll('.size-btn').forEach(b => {
                b.classList.remove('active');
            });
            // Add active to clicked
            this.classList.add('active');
            updatePreviewFromSettings();
        });
    });

    // Case button groups
    const caseButtons = document.querySelectorAll('.case-btn');
    caseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from siblings
            this.parentElement.querySelectorAll('.case-btn').forEach(b => {
                b.classList.remove('active');
            });
            // Add active to clicked
            this.classList.add('active');
            updatePreviewFromSettings();
        });
    });

    // Ratio button groups
    const ratioButtons = document.querySelectorAll('.ratio-btn');
    ratioButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from siblings
            this.parentElement.querySelectorAll('.ratio-btn').forEach(b => {
                b.classList.remove('active');
            });
            // Add active to clicked
            this.classList.add('active');
            updatePreviewFromSettings();
        });
    });

    // Layout controls
    const layoutSelects = document.querySelectorAll('.layout-row select');
    layoutSelects.forEach(select => {
        select.addEventListener('change', updatePreviewFromSettings);
    });

    // Typography controls
    const typographySelects = document.querySelectorAll('.typography-row select');
    typographySelects.forEach(select => {
        select.addEventListener('change', updatePreviewFromSettings);
    });

    // Color inputs
    const colorInputs = document.querySelectorAll('.settings-color');
    colorInputs.forEach(input => {
        input.addEventListener('input', updatePreviewFromSettings);
    });

    // Padding inputs
    const paddingInputs = document.querySelectorAll('.padding-input');
    paddingInputs.forEach(input => {
        input.addEventListener('input', updatePreviewFromSettings);
    });

    // Slider controls
    const sliders = document.querySelectorAll('.slider-control input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const numberInput = this.parentElement.querySelector('input[type="number"]');
            if (numberInput) {
                numberInput.value = this.value;
            }
            updatePreviewFromSettings();
        });
    });

    const numberInputs = document.querySelectorAll('.slider-control input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            const slider = this.parentElement.querySelector('input[type="range"]');
            if (slider) {
                slider.value = this.value;
            }
            updatePreviewFromSettings();
        });
    });

    // Add section buttons
    const addSectionButtons = document.querySelectorAll('.add-section-btn');
    addSectionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            showAddSectionModal(this);
        });
    });

    // Save button
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveState();
            showNotification('Changes saved successfully!', 'success');
        });
    }

    // Close sidebar button
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const rightSidebar = document.querySelector('.right-sidebar');
            rightSidebar.classList.toggle('open');
        });
    }

    // Remove block button
    const removeBtn = document.querySelector('.remove-section-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            if (selectedElement) {
                removeSelectedElement();
            } else {
                showNotification('No element selected', 'error');
            }
        });
    }
}

// ========================================
// LIVE PREVIEW UPDATES
// ========================================
function updatePreviewFromSettings() {
    if (!selectedElement) {
        return;
    }

    const settingsPanel = document.querySelector('.settings-panel');

    // Update text content
    const textArea = settingsPanel.querySelector('.settings-textarea');
    if (textArea && selectedElement.textContent) {
        selectedElement.textContent = textArea.value;
    }

    // Update text color
    const colorInput = settingsPanel.querySelector('.settings-color');
    if (colorInput) {
        selectedElement.style.color = colorInput.value;
    }

    // Update font size
    const fontSizeInput = settingsPanel.querySelector('.settings-number');
    if (fontSizeInput) {
        selectedElement.style.fontSize = fontSizeInput.value + 'px';
    }

    // Update background color
    const bgColorInputs = settingsPanel.querySelectorAll('.settings-color');
    if (bgColorInputs.length > 1) {
        selectedElement.style.backgroundColor = bgColorInputs[1].value;
    }

    // Update padding
    const paddingInputs = settingsPanel.querySelectorAll('.padding-input');
    if (paddingInputs.length === 4) {
        selectedElement.style.padding = `${paddingInputs[0].value}px ${paddingInputs[1].value}px ${paddingInputs[2].value}px ${paddingInputs[3].value}px`;
    }

    // Update layout classes
    const layoutSelects = settingsPanel.querySelectorAll('.layout-row select');
    if (layoutSelects.length >= 2) {
        selectedElement.className = selectedElement.className.replace(/\b(layout-\w+)\b/g, '');
        selectedElement.classList.add(`layout-${layoutSelects[0].value.toLowerCase()}`);
        selectedElement.classList.add(`width-${layoutSelects[1].value.toLowerCase()}`);
    }

    // Save state for undo/redo
    saveState();
}

// ========================================
// ELEMENT REMOVAL
// ========================================
function removeSelectedElement() {
    if (!selectedElement) {
        return;
    }

    // Don't allow removing critical elements
    if (selectedElement.classList.contains('store-header') ||
        selectedElement.classList.contains('preview-container')) {
        showNotification('Cannot remove this element', 'error');
        return;
    }

    if (confirm('Are you sure you want to remove this element?')) {
        selectedElement.remove();
        deselectElement();
        updatePreviewFromTree();
        saveState();
        showNotification('Element removed', 'success');
    }
}

// ========================================
// ENHANCED COMPONENT ACTIONS
// ========================================
function handleComponentActions(e) {
    const { target } = e;

    // Add section button
    if (target.closest('.add-section-btn')) {
        e.stopPropagation();
        showAddSectionModal(target.closest('.add-section-btn'));
        return;
    }

    // Duplicate component
    if (target.closest('.duplicate-btn')) {
        e.stopPropagation();
        const treeItem = target.closest('.tree-item');
        duplicateComponent(treeItem);
        return;
    }

    // Delete component
    if (target.closest('.delete-btn')) {
        e.stopPropagation();
        const treeItem = target.closest('.tree-item');
        deleteComponent(treeItem);
        return;
    }

    // Move up/down buttons
    if (target.closest('.block-move-up')) {
        e.stopPropagation();
        const blockItem = target.closest('.block-item');
        moveBlock(blockItem, 'up');
        return;
    }

    if (target.closest('.block-move-down')) {
        e.stopPropagation();
        const blockItem = target.closest('.block-item');
        moveBlock(blockItem, 'down');
        return;
    }

    // Block duplicate/delete
    if (target.closest('.block-duplicate')) {
        e.stopPropagation();
        const blockItem = target.closest('.block-item');
        duplicateBlock(blockItem);
        return;
    }

    if (target.closest('.block-delete')) {
        e.stopPropagation();
        const blockItem = target.closest('.block-item');
        deleteBlock(blockItem);
        return;
    }
}

function moveBlock(blockItem, direction) {
    const container = blockItem.parentElement;
    const index = Array.from(container.children).indexOf(blockItem);

    if (direction === 'up' && index > 0) {
        container.insertBefore(blockItem, container.children[index - 1]);
        updatePreviewFromTree();
        saveState();
        showNotification('Block moved up', 'success');
    } else if (direction === 'down' && index < container.children.length - 1) {
        container.insertBefore(blockItem, container.children[index + 2]);
        updatePreviewFromTree();
        saveState();
        showNotification('Block moved down', 'success');
    }
}

function duplicateBlock(blockItem) {
    const clonedBlock = blockItem.cloneNode(true);
    blockItem.parentElement.insertBefore(clonedBlock, blockItem.nextSibling);
    updatePreviewFromTree();
    saveState();
    showNotification('Block duplicated', 'success');
}

function deleteBlock(blockItem) {
    if (confirm('Delete this block?')) {
        blockItem.remove();
        updatePreviewFromTree();
        saveState();
        showNotification('Block deleted', 'success');
    }
}

// ========================================
// ENHANCED DRAG AND DROP
// ========================================
function initializeDragAndDrop() {
    const treeItems = document.querySelectorAll('.tree-item-header');

    treeItems.forEach(header => {
        const gripIcon = header.querySelector('.grip-icon');

        if (gripIcon) {
            // Make grip icon the drag handle
            gripIcon.addEventListener('mousedown', startDrag);
            gripIcon.style.cursor = 'grab';

            // Prevent text selection during drag
            gripIcon.addEventListener('selectstart', e => e.preventDefault());
        }
    });

    // Set up drop zones
    setupDropZones();

    // Add drag and drop for preview elements
    setupPreviewDragAndDrop();
}

function setupPreviewDragAndDrop() {
    const draggableElements = document.querySelectorAll('.preview-container [data-draggable="true"], .preview-container .product-card, .preview-container .testimonial-card');

    draggableElements.forEach(element => {
        element.draggable = true;
        element.addEventListener('dragstart', handlePreviewDragStart);
        element.addEventListener('dragend', handlePreviewDragEnd);
    });

    // Set up drop zones in preview
    const dropZones = document.querySelectorAll('.preview-container .products-section, .preview-container .testimonials-section, .preview-container .featured-section');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handlePreviewDragOver);
        zone.addEventListener('drop', handlePreviewDrop);
    });
}

function handlePreviewDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id || 'dragged-element');
    e.target.classList.add('dragging');
}

function handlePreviewDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handlePreviewDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handlePreviewDrop(e) {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(draggedId) || document.querySelector('.dragging');

    if (draggedElement && e.target !== draggedElement) {
        const dropZone = e.target.closest('.products-section, .testimonials-section, .featured-section');
        if (dropZone) {
            dropZone.appendChild(draggedElement);
            updatePreviewFromTree();
            saveState();
            showNotification('Element moved', 'success');
        }
    }
}

// ========================================
// AUTO-SAVE FUNCTIONALITY
// ========================================
let autoSaveTimer;
function initializeAutoSave() {
    // Auto-save every 30 seconds
    autoSaveTimer = setInterval(() => {
        saveState();
        console.log('Auto-saved at', new Date().toLocaleTimeString());
    }, 30000);

    // Save on page unload
    window.addEventListener('beforeunload', () => {
        saveState();
    });
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+S for save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveState();
            showNotification('Saved!', 'success');
        }

        // Delete key for selected element
        if (e.key === 'Delete' && selectedElement) {
            e.preventDefault();
            removeSelectedElement();
        }

        // Escape to deselect
        if (e.key === 'Escape') {
            deselectElement();
        }
    });
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: type === 'success' ? '#10b981' : '#3b82f6',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease-out',
        fontSize: '0.875rem',
        fontWeight: '500'
    });
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

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
`;
document.head.appendChild(style);

// ========================================
// COMPONENT MANIPULATION
// ========================================
function initializeComponentManipulation() {
    // Add event listeners for component actions
    document.addEventListener('click', handleComponentActions);
}

function handleComponentActions(e) {
    const { target } = e;
    
    // Add section button
    if (target.closest('.add-section-btn')) {
        e.stopPropagation();
        showAddSectionModal(target.closest('.add-section-btn'));
        return;
    }
    
    // Duplicate component
    if (target.closest('.duplicate-btn')) {
        e.stopPropagation();
        const treeItem = target.closest('.tree-item');
        duplicateComponent(treeItem);
        return;
    }
    
    // Delete component
    if (target.closest('.delete-btn')) {
        e.stopPropagation();
        const treeItem = target.closest('.tree-item');
        deleteComponent(treeItem);
        return;
    }
}

function showAddSectionModal(addButton) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add Section</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="section-grid">
                    <div class="section-option" data-type="hero">
                        <i class="fas fa-image"></i>
                        <span>Hero Banner</span>
                    </div>
                    <div class="section-option" data-type="text">
                        <i class="fas fa-align-left"></i>
                        <span>Text Block</span>
                    </div>
                    <div class="section-option" data-type="products">
                        <i class="fas fa-th-large"></i>
                        <span>Product Grid</span>
                    </div>
                    <div class="section-option" data-type="testimonials">
                        <i class="fas fa-quote-left"></i>
                        <span>Testimonials</span>
                    </div>
                    <div class="section-option" data-type="gallery">
                        <i class="fas fa-images"></i>
                        <span>Image Gallery</span>
                    </div>
                    <div class="section-option" data-type="contact">
                        <i class="fas fa-envelope"></i>
                        <span>Contact Form</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.closest('.modal-close')) {
            modal.remove();
        }
        
        const option = e.target.closest('.section-option');
        if (option) {
            const sectionType = option.dataset.type;
            addNewSection(addButton, sectionType);
            modal.remove();
        }
    });
}

function addNewSection(addButton, sectionType) {
    const container = addButton.closest('.tree-item-children') || addButton.closest('.components-tree');
    
    // Create new section
    const sectionData = getSectionTemplate(sectionType);
    const newSection = createTreeItem(sectionData);
    
    // Insert before the add button
    container.insertBefore(newSection, addButton.closest('.tree-item'));
    
    // Update preview
    updatePreviewFromTree();
    
    showNotification(`${sectionData.name} section added`, 'success');
}

function duplicateComponent(treeItem) {
    const clonedItem = treeItem.cloneNode(true);
    
    // Update any IDs or references if needed
    const newId = Date.now();
    clonedItem.dataset.id = newId;
    
    // Insert after original
    treeItem.parentElement.insertBefore(clonedItem, treeItem.nextSibling);
    
    // Re-initialize drag and drop for new element
    initializeDragAndDrop();
    
    // Update preview
    updatePreviewFromTree();
    
    showNotification('Component duplicated', 'success');
}

function deleteComponent(treeItem) {
    // Don't allow deleting if it's the last component
    const siblings = Array.from(treeItem.parentElement.children).filter(child => 
        child.classList.contains('tree-item') && !child.querySelector('.add-section-btn')
    );
    
    if (siblings.length <= 1) {
        showNotification('Cannot delete the last component', 'error');
        return;
    }
    
    // Confirm deletion
    if (confirm('Are you sure you want to delete this component?')) {
        treeItem.remove();
        updatePreviewFromTree();
        showNotification('Component deleted', 'success');
    }
}

function getSectionTemplate(type) {
    const templates = {
        hero: {
            name: 'Hero',
            icon: 'fas fa-image',
            children: [
                { name: 'Background Image', icon: 'fas fa-image' },
                { name: 'Heading', icon: 'fas fa-heading' },
                { name: 'Subheading', icon: 'fas fa-text-height' },
                { name: 'Button', icon: 'fas fa-mouse-pointer' }
            ]
        },
        text: {
            name: 'Text Block',
            icon: 'fas fa-align-left',
            children: [
                { name: 'Heading', icon: 'fas fa-heading' },
                { name: 'Paragraph', icon: 'fas fa-paragraph' }
            ]
        },
        products: {
            name: 'Product Grid',
            icon: 'fas fa-th-large',
            children: [
                { name: 'Header', icon: 'fas fa-heading' },
                { name: 'Product Cards', icon: 'fas fa-shopping-bag' }
            ]
        },
        testimonials: {
            name: 'Testimonials',
            icon: 'fas fa-quote-left',
            children: [
                { name: 'Testimonial 1', icon: 'fas fa-user' },
                { name: 'Testimonial 2', icon: 'fas fa-user' }
            ]
        },
        gallery: {
            name: 'Gallery',
            icon: 'fas fa-images',
            children: [
                { name: 'Image 1', icon: 'fas fa-image' },
                { name: 'Image 2', icon: 'fas fa-image' },
                { name: 'Image 3', icon: 'fas fa-image' }
            ]
        },
        contact: {
            name: 'Contact Form',
            icon: 'fas fa-envelope',
            children: [
                { name: 'Form Fields', icon: 'fas fa-list' },
                { name: 'Submit Button', icon: 'fas fa-paper-plane' }
            ]
        }
    };
    
    return templates[type] || templates.text;
}

function createTreeItem(data) {
    const item = document.createElement('div');
    item.className = 'tree-item';
    item.dataset.id = Date.now();
    
    let childrenHtml = '';
    if (data.children && data.children.length > 0) {
        childrenHtml = '<div class="tree-item-children">' +
            data.children.map(child => `
                <div class="tree-item nested-2">
                    <div class="tree-item-header">
                        <i class="fas fa-grip-vertical grip-icon"></i>
                        <i class="${child.icon} item-icon"></i>
                        <span>${child.name}</span>
                        <div class="component-actions">
                            <button class="action-btn duplicate-btn" title="Duplicate">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="action-btn delete-btn" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('') +
            '</div>';
    }
    
    item.innerHTML = `
        <div class="tree-item-header">
            <i class="fas fa-chevron-right toggle-icon"></i>
            <i class="fas fa-grip-vertical grip-icon"></i>
            <i class="${data.icon} item-icon"></i>
            <span>${data.name}</span>
            <div class="component-actions">
                <button class="action-btn duplicate-btn" title="Duplicate">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="action-btn delete-btn" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        ${childrenHtml}
    `;
    
    return item;
}

// ========================================
// LIVE ELEMENT SELECTION
// ========================================
let selectedElement = null;
let selectedElementOutline = null;

function initializeLiveSelection() {
    const previewContainer = document.querySelector('.preview-container');
    
    if (previewContainer) {
        previewContainer.addEventListener('click', handlePreviewClick);
        previewContainer.addEventListener('mouseover', handlePreviewHover);
        previewContainer.addEventListener('mouseout', handlePreviewOut);
    }
}

function handlePreviewClick(e) {
    const { target } = e;
    
    // Find the selectable element (avoid clicking on interactive elements)
    const selectableElement = findSelectableElement(target);
    
    if (selectableElement) {
        selectElement(selectableElement);
        e.stopPropagation();
    } else {
        // Clicked on empty space, deselect
        deselectElement();
    }
}

function handlePreviewHover(e) {
    const { target } = e;
    const selectableElement = findSelectableElement(target);
    
    if (selectableElement && selectableElement !== selectedElement) {
        showHoverOutline(selectableElement);
    } else {
        hideHoverOutline();
    }
}

function handlePreviewOut(e) {
    hideHoverOutline();
}

function findSelectableElement(element) {
    // Define which elements are selectable
    const selectableSelectors = [
        '.store-header',
        '.store-logo',
        '.nav-link',
        '.section-title',
        '.product-card',
        '.product-title',
        '.product-price',
        '.email-section h2',
        '.email-section p',
        '.email-form input',
        '.email-form button'
    ];
    
    // Walk up the DOM to find a selectable element
    let current = element;
    while (current && current !== document.querySelector('.preview-container')) {
        for (const selector of selectableSelectors) {
            if (current.matches && current.matches(selector)) {
                return current;
            }
        }
        current = current.parentElement;
    }
    
    return null;
}

function selectElement(element) {
    // Deselect previous element
    deselectElement();
    
    // Select new element
    selectedElement = element;
    selectedElement.classList.add('selected-element');
    
    // Add selection outline
    selectedElementOutline = document.createElement('div');
    selectedElementOutline.className = 'selection-outline';
    
    const rect = element.getBoundingClientRect();
    const containerRect = document.querySelector('.preview-container').getBoundingClientRect();
    
    selectedElementOutline.style.position = 'absolute';
    selectedElementOutline.style.top = (rect.top - containerRect.top) + 'px';
    selectedElementOutline.style.left = (rect.left - containerRect.left) + 'px';
    selectedElementOutline.style.width = rect.width + 'px';
    selectedElementOutline.style.height = rect.height + 'px';
    
    document.querySelector('.preview-container').appendChild(selectedElementOutline);
    
    // Update settings panel for this element
    updateSettingsForElement(element);
    
    // Highlight corresponding tree item
    highlightTreeItem(element);
}

function deselectElement() {
    if (selectedElement) {
        selectedElement.classList.remove('selected-element');
        selectedElement = null;
    }
    
    if (selectedElementOutline) {
        selectedElementOutline.remove();
        selectedElementOutline = null;
    }
    
    // Reset settings panel
    resetSettingsPanel();
    
    // Remove tree highlighting
    document.querySelectorAll('.tree-item.highlighted').forEach(item => {
        item.classList.remove('highlighted');
    });
}

function showHoverOutline(element) {
    hideHoverOutline();
    
    const outline = document.createElement('div');
    outline.className = 'hover-outline';
    
    const rect = element.getBoundingClientRect();
    const containerRect = document.querySelector('.preview-container').getBoundingClientRect();
    
    outline.style.position = 'absolute';
    outline.style.top = (rect.top - containerRect.top) + 'px';
    outline.style.left = (rect.left - containerRect.left) + 'px';
    outline.style.width = rect.width + 'px';
    outline.style.height = rect.height + 'px';
    
    document.querySelector('.preview-container').appendChild(outline);
}

function hideHoverOutline() {
    const existing = document.querySelector('.hover-outline');
    if (existing) {
        existing.remove();
    }
}

function updateSettingsForElement(element) {
    const settingsPanel = document.querySelector('.settings-panel');
    const header = settingsPanel.querySelector('.sidebar-header h3');
    
    // Update header
    header.textContent = getElementDisplayName(element);
    
    // Clear existing settings
    const existingSections = settingsPanel.querySelectorAll('.settings-section:not(:first-child)');
    existingSections.forEach(section => section.remove());
    
    // Add element-specific settings
    const elementSettings = getElementSettings(element);
    elementSettings.forEach(setting => {
        const section = document.createElement('div');
        section.className = 'settings-section';
        section.innerHTML = setting.html;
        settingsPanel.appendChild(section);
    });
    
    // Re-initialize settings interactions
    initializeSettingsPanel();
}

function resetSettingsPanel() {
    const settingsPanel = document.querySelector('.settings-panel');
    const header = settingsPanel.querySelector('.sidebar-header h3');
    
    header.textContent = 'Menu';
    
    // Clear element-specific settings
    const existingSections = settingsPanel.querySelectorAll('.settings-section:not(:first-child)');
    existingSections.forEach(section => section.remove());
    
    // Restore original menu settings
    const originalSettings = getOriginalMenuSettings();
    originalSettings.forEach(setting => {
        const section = document.createElement('div');
        section.className = 'settings-section';
        section.innerHTML = setting.html;
        settingsPanel.appendChild(section);
    });
    
    initializeSettingsPanel();
}

function getElementDisplayName(element) {
    if (element.classList.contains('store-logo')) {
        return 'Store Logo';
    }
    if (element.classList.contains('nav-link')) {
        return 'Navigation Link';
    }
    if (element.classList.contains('section-title')) {
        return 'Section Title';
    }
    if (element.classList.contains('product-card')) {
        return 'Product Card';
    }
    if (element.classList.contains('product-title')) {
        return 'Product Title';
    }
    if (element.classList.contains('product-price')) {
        return 'Product Price';
    }
    if (element.matches('.email-section h2')) {
        return 'Email Section Heading';
    }
    if (element.matches('.email-section p')) {
        return 'Email Section Text';
    }
    if (element.matches('.email-form input')) {
        return 'Email Input Field';
    }
    if (element.matches('.email-form button')) {
        return 'Email Submit Button';
    }
    return 'Selected Element';
}

function getElementSettings(element) {
    const settings = [];
    
    // Text content settings
    if (element.textContent && !element.querySelector('input, button')) {
        settings.push({
            html: `
                <label class="settings-label">Content</label>
                <textarea class="settings-textarea" rows="3">${element.textContent.trim()}</textarea>
            `
        });
    }
    
    // Color settings
    if (window.getComputedStyle(element).color) {
        settings.push({
            html: `
                <label class="settings-label">Text Color</label>
                <input type="color" class="settings-color" value="${rgbToHex(window.getComputedStyle(element).color)}">
            `
        });
    }
    
    // Font size settings
    if (window.getComputedStyle(element).fontSize) {
        const fontSize = parseInt(window.getComputedStyle(element).fontSize);
        settings.push({
            html: `
                <label class="settings-label">Font Size</label>
                <div class="settings-group">
                    <input type="range" class="settings-slider" min="8" max="72" value="${fontSize}">
                    <input type="number" class="settings-number" min="8" max="72" value="${fontSize}">
                    <span class="unit">px</span>
                </div>
            `
        });
    }
    
    // Background color for certain elements
    if (element.classList.contains('product-card') || element.classList.contains('email-section')) {
        settings.push({
            html: `
                <label class="settings-label">Background Color</label>
                <input type="color" class="settings-color" value="${rgbToHex(window.getComputedStyle(element).backgroundColor)}">
            `
        });
    }
    
    return settings;
}

function getOriginalMenuSettings() {
    return [
        {
            html: `
                <label class="settings-label">Menu</label>
                <select class="settings-select">
                    <option>Main menu</option>
                </select>
            `
        },
        {
            html: `
                <label class="settings-label">Color scheme</label>
                <select class="settings-select">
                    <option>Scheme 1</option>
                </select>
            `
        }
        // Add other original settings as needed
    ];
}

function highlightTreeItem(element) {
    // This would map preview elements to tree items
    // For now, just highlight a random tree item as example
    const treeItems = document.querySelectorAll('.tree-item');
    if (treeItems.length > 0) {
        treeItems[Math.floor(Math.random() * treeItems.length)].classList.add('highlighted');
    }
}

function rgbToHex(rgb) {
    if (rgb.startsWith('#')) {
        return rgb;
    }
    if (rgb.startsWith('rgb')) {
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (match) {
            return "#" + ((1 << 24) + (parseInt(match[1]) << 16) + (parseInt(match[2]) << 8) + parseInt(match[3])).toString(16).slice(1);
        }
    }
    return '#000000';
}

// ========================================
// RESPONSIVE PREVIEW MODES
// ========================================
let currentPreviewMode = 'desktop';

function initializeResponsivePreview() {
    const previewButtons = document.querySelectorAll('.preview-mode-btn');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const { dataset: { mode } } = this;
            setPreviewMode(mode);
        });
    });
    
    // Set initial mode
    setPreviewMode('desktop');
}

function setPreviewMode(mode) {
    currentPreviewMode = mode;
    
    // Update button states
    document.querySelectorAll('.preview-mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    // Update preview container
    const previewContainer = document.querySelector('.preview-container');
    previewContainer.className = 'preview-container';
    previewContainer.classList.add(`preview-${mode}`);
    
    // Update preview area background and scaling
    const previewArea = document.querySelector('.preview-area');
    previewArea.className = 'preview-area';
    previewArea.classList.add(`preview-${mode}`);
    
    // Show notification
    showNotification(`${mode.charAt(0).toUpperCase() + mode.slice(1)} preview`, 'info');
}

// ========================================
// UNDO/REDO SYSTEM (BASIC)
// ========================================
let historyStack = [];
let historyIndex = -1;
let maxHistorySize = 50;

function initializeUndoRedo() {
    // Listen for keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
                e.preventDefault();
                redo();
            }
        }
    });
    
    // Add button event listeners
    const undoBtn = document.querySelector('.undo-btn');
    const redoBtn = document.querySelector('.redo-btn');
    
    if (undoBtn) {
        undoBtn.addEventListener('click', undo);
    }
    if (redoBtn) {
        redoBtn.addEventListener('click', redo);
    }
    
    // Save initial state
    saveState();
}

function saveState() {
    const state = {
        treeStructure: getTreeStructure(),
        previewContent: getPreviewContent(),
        timestamp: Date.now()
    };
    
    // Remove any history after current index
    historyStack = historyStack.slice(0, historyIndex + 1);
    
    // Add new state
    historyStack.push(state);
    historyIndex++;
    
    // Limit history size
    if (historyStack.length > maxHistorySize) {
        historyStack.shift();
        historyIndex--;
    }
    
    updateUndoRedoButtons();
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreState(historyStack[historyIndex]);
        showNotification('Undid last action', 'info');
    } else {
        showNotification('Nothing to undo', 'error');
    }
    updateUndoRedoButtons();
}

function redo() {
    if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        restoreState(historyStack[historyIndex]);
        showNotification('Redid last action', 'success');
    } else {
        showNotification('Nothing to redo', 'error');
    }
    updateUndoRedoButtons();
}

function restoreState(state) {
    // Restore tree structure
    restoreTreeStructure(state.treeStructure);
    
    // Restore preview content
    restorePreviewContent(state.previewContent);
}

function getTreeStructure() {
    // Simplified - just return the HTML of the components tree
    return document.querySelector('.components-tree').innerHTML;
}

function getPreviewContent() {
    // Simplified - just return the HTML of the preview container
    return document.querySelector('.preview-container').innerHTML;
}

function restoreTreeStructure(html) {
    document.querySelector('.components-tree').innerHTML = html;
    // Re-initialize drag and drop for restored elements
    initializeDragAndDrop();
}

function restorePreviewContent(html) {
    document.querySelector('.preview-container').innerHTML = html;
}

function updateUndoRedoButtons() {
    // Update any undo/redo button states if they exist
    const undoBtn = document.querySelector('.undo-btn');
    const redoBtn = document.querySelector('.redo-btn');
    
    if (undoBtn) {
        undoBtn.disabled = historyIndex <= 0;
    }
    if (redoBtn) {
        redoBtn.disabled = historyIndex >= historyStack.length - 1;
    }
}

// ========================================
// RESPONSIVE MENU TOGGLE
// ========================================
const moreBtn = document.querySelector('.more-btn');
if (moreBtn) {
    moreBtn.addEventListener('click', function() {
        const rightSidebar = document.querySelector('.right-sidebar');
        rightSidebar.classList.toggle('open');
    });
}

// ========================================
// CONSOLE INFO
// ========================================
console.log('%c🎨 Layout Editor Loaded', 'color: #2c6ecb; font-size: 16px; font-weight: bold;');
console.log('%cThis is a visual mockup - interactive functionality not fully implemented', 'color: #6b7280; font-size: 12px;');

// ========================================
// HOVER BORDER FUNCTIONALITY
// ========================================
// Note: Hover borders are implemented via CSS only for better performance
// No JavaScript initialization needed - CSS handles all hover effects
