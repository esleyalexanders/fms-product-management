// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeTagsInput();
    initializeMediaUpload();
    initializeFormActions();
    initializeToolbarButtons();
    initializeStatusToggle();
});

// Status Toggle Functionality
function initializeStatusToggle() {
    const statusToggleBtn = document.getElementById('statusToggleBtn');
    let isActive = false;
    
    statusToggleBtn.addEventListener('click', function() {
        isActive = !isActive;
        
        if (isActive) {
            this.classList.add('active');
            this.innerHTML = '<i class="fas fa-toggle-on"></i> Active';
        } else {
            this.classList.remove('active');
            this.innerHTML = '<i class="fas fa-toggle-off"></i> Inactive';
        }
    });
}

// Tags Input Functionality
function initializeTagsInput() {
    const tagsInput = document.getElementById('tagsInput');
    const tagsContainer = document.getElementById('tagsContainer');
    const tagsWrapper = document.querySelector('.tags-input-wrapper');
    
    let tags = [];
    
    // Focus input when wrapper is clicked
    tagsWrapper.addEventListener('click', function() {
        tagsInput.focus();
    });
    
    // Handle Enter key to add tag
    tagsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            e.preventDefault();
            addTag(this.value.trim());
            this.value = '';
        } else if (e.key === 'Backspace' && this.value === '' && tags.length > 0) {
            // Remove last tag on backspace if input is empty
            removeTag(tags.length - 1);
        }
    });
    
    // Handle comma to add tag
    tagsInput.addEventListener('input', function(e) {
        const value = this.value;
        if (value.includes(',')) {
            const tagValue = value.replace(',', '').trim();
            if (tagValue !== '') {
                addTag(tagValue);
            }
            this.value = '';
        }
    });
    
    function addTag(value) {
        if (!tags.includes(value)) {
            tags.push(value);
            renderTags();
        }
    }
    
    function removeTag(index) {
        tags.splice(index, 1);
        renderTags();
    }
    
    function renderTags() {
        tagsContainer.innerHTML = '';
        tags.forEach((tag, index) => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.innerHTML = `
                ${tag}
                <button type="button" class="tag-remove" onclick="removeTagByIndex(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            tagsContainer.appendChild(tagElement);
        });
    }
    
    // Make removeTagByIndex available globally
    window.removeTagByIndex = function(index) {
        removeTag(index);
    };
}

// Media Upload Functionality
function initializeMediaUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const addFilesBtn = document.getElementById('addFilesBtn');
    const addUrlBtn = document.getElementById('addUrlBtn');
    
    // Click to upload
    uploadArea.addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('upload-text') || 
            e.target.classList.contains('upload-icon')) {
            fileInput.click();
        }
    });
    
    addFilesBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        fileInput.click();
    });
    
    addUrlBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const url = prompt('Enter image URL:');
        if (url) {
            addMediaFromUrl(url);
        }
    });
    
    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                addMediaFromFile(file);
            }
        });
        // Reset input
        fileInput.value = '';
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#005bd3';
        this.style.backgroundColor = '#f6f8fa';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '#c9cccf';
        this.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#c9cccf';
        this.style.backgroundColor = 'transparent';
        
        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                addMediaFromFile(file);
            }
        });
    });
    
    function addMediaFromFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            createMediaPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }
    
    function addMediaFromUrl(url) {
        createMediaPreview(url);
    }
    
    function createMediaPreview(src) {
        // Check if media card exists
        let mediaCard = document.querySelector('.card .media-preview');
        if (!mediaCard) {
            // Create media card
            const mediaSection = document.querySelector('.media-card');
            const uploadArea = mediaSection.querySelector('.media-upload-area');
            
            const previewDiv = document.createElement('div');
            previewDiv.className = 'media-preview';
            mediaSection.insertBefore(previewDiv, uploadArea);
            mediaCard = previewDiv;
        }
        
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.innerHTML = `
            <img src="${src}" alt="Product image">
            <button type="button" class="media-remove" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        mediaCard.appendChild(mediaItem);
    }
}

// Form Actions
function initializeFormActions() {
    const saveBtn = document.querySelector('.save-btn');
    const discardBtn = document.querySelector('.discard-btn');
    const backBtn = document.querySelector('.back-btn');
    
    saveBtn.addEventListener('click', function() {
        if (validateForm()) {
            saveProduct();
        }
    });
    
    discardBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to discard all changes?')) {
            resetForm();
        }
    });
    
    backBtn.addEventListener('click', function() {
        if (confirm('You have unsaved changes. Do you want to leave this page?')) {
            window.history.back();
        }
    });
}

// Form Validation
function validateForm() {
    const title = document.getElementById('productTitle').value.trim();
    
    if (title === '') {
        alert('Please enter a product title');
        document.getElementById('productTitle').focus();
        return false;
    }
    
    return true;
}

// Save Product
function saveProduct() {
    const statusToggleBtn = document.getElementById('statusToggleBtn');
    const isActive = statusToggleBtn.classList.contains('active');
    
    const formData = {
        title: document.getElementById('productTitle').value,
        type: document.getElementById('productType').value,
        description: document.getElementById('productDescription').value,
        category: document.getElementById('categorySelect').value,
        price: document.getElementById('productPrice').value,
        quantity: document.getElementById('inventoryQuantity').value,
        tags: Array.from(document.querySelectorAll('.tag')).map(tag => 
            tag.textContent.trim().replace('×', '')
        ),
        isActive: isActive
    };
    
    console.log('Saving product:', formData);
    
    // Show success message
    alert('Product saved successfully!');
    
    // Here you would typically send the data to your backend
    // For now, we'll just log it to the console
}

// Reset Form
function resetForm() {
    document.querySelectorAll('input[type="text"], input[type="number"], textarea, select').forEach(input => {
        input.value = '';
    });
    
    document.querySelector('#tagsContainer').innerHTML = '';
    
    const mediaPreview = document.querySelector('.media-preview');
    if (mediaPreview) {
        mediaPreview.remove();
    }
}

// Toolbar Buttons Functionality
function initializeToolbarButtons() {
    const description = document.getElementById('productDescription');
    
    // Bold
    document.querySelector('[data-action="bold"]')?.addEventListener('click', function() {
        insertTextAtCursor(description, '**', '**');
    });
    
    // Italic
    document.querySelector('[data-action="italic"]')?.addEventListener('click', function() {
        insertTextAtCursor(description, '*', '*');
    });
    
    // Underline
    document.querySelector('[data-action="underline"]')?.addEventListener('click', function() {
        insertTextAtCursor(description, '<u>', '</u>');
    });
    
    // Link
    document.querySelector('[data-action="link"]')?.addEventListener('click', function() {
        const url = prompt('Enter URL:');
        if (url) {
            const text = prompt('Enter link text:');
            if (text) {
                insertTextAtCursor(description, `[${text}](${url})`, '');
            }
        }
    });
    
    // Image
    document.querySelector('[data-action="image"]')?.addEventListener('click', function() {
        const url = prompt('Enter image URL:');
        if (url) {
            insertTextAtCursor(description, `![Image](${url})`, '');
        }
    });
    
    // Bullet List
    document.querySelector('[data-action="ul"]')?.addEventListener('click', function() {
        insertTextAtCursor(description, '\n- ', '');
    });
    
    // Numbered List
    document.querySelector('[data-action="ol"]')?.addEventListener('click', function() {
        insertTextAtCursor(description, '\n1. ', '');
    });
    
    // Heading
    document.querySelector('[data-action="heading"]')?.addEventListener('click', function() {
        insertTextAtCursor(description, '\n## ', '');
    });
}

// Helper function to insert text at cursor position
function insertTextAtCursor(textarea, before, after) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    textarea.value = newText;
    
    // Set cursor position
    const newCursorPos = start + before.length + selectedText.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
}

// Auto-save functionality (optional)
let autoSaveTimer;
function enableAutoSave() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                console.log('Auto-saving...');
                // You can implement auto-save logic here
            }, 2000);
        });
    });
}

// Call enableAutoSave if you want auto-save feature
// enableAutoSave();
