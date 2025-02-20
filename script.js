// Initialize TinyMCE
let editor = null;

tinymce.init({
    selector: '#editor',
    height: 500,
    plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'wordcount'
    ],
    toolbar1: 'formatselect | styles | fontsizepicker | ' +
             'bold italic underline strikethrough | forecolor backcolor | superscript subscript',
    toolbar2: 'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lineheight link table | removeformat',
    toolbar_mode: 'wrap',
    toolbar_sticky: true,
    
    // Custom style formats
    style_formats: [
        { title: 'Paragraph', format: 'p', icon: 'paragraph' },
        { title: 'Heading 1', format: 'h1' },
        { title: 'Heading 2', format: 'h2' },
        { title: 'Heading 3', format: 'h3' },
        { title: 'Heading 4', format: 'h4' },
        { title: 'Heading 5', format: 'h5' },
        { title: 'Heading 6', format: 'h6' },
        { title: 'Blockquote', format: 'blockquote' },
        { title: 'Code Block', format: 'pre' }
    ],

    // Font sizes with icons
    fontsize_formats: '8pt 10pt 12pt 13pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 36pt 48pt 72pt',
    
    // Font families with icons
    font_family_formats: 'Arial=arial; Times New Roman=times; Courier New=courier; Georgia=georgia; Tahoma=tahoma; Trebuchet MS=trebuchet; Verdana=verdana',
    
    // Custom icons and button styling
    setup: function(ed) {
        editor = ed;
        
        // Add custom icons
        editor.ui.registry.addIcon('paragraph', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M10.5 5H18V7H10.5V5ZM6 5H8V19H6V5ZM10.5 9H18V11H10.5V9ZM10.5 13H18V15H10.5V13ZM10.5 17H18V19H10.5V17Z"/></svg>');
        editor.ui.registry.addIcon('font', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M9.93 13.5H14.07L12 7.98L9.93 13.5ZM12 2L1 21H4.5L6.72 15.89H17.28L19.5 21H23L12 2Z"/></svg>');
        editor.ui.registry.addIcon('text-size', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M2 5H10V7H6V19H4V7H0V5H2ZM14 5H22V7H18V19H16V7H12V5H14Z"/></svg>');

        // Style the buttons
        editor.on('init', function() {
            const statusbar = editor.getContainer().querySelector('.tox-statusbar__text-container');
            if (statusbar) {
                statusbar.innerHTML = 'foodfornewcreature.com';
            }

            // Add custom styles to the toolbar buttons
            const style = document.createElement('style');
            style.textContent = `
                .tox-toolbar__group button {
                    border-radius: 6px !important;
                }
                .tox-toolbar__group button:hover {
                    background-color: rgba(0, 0, 0, 0.05) !important;
                }
            `;
            editor.getContainer().appendChild(style);
        });
    },

    // Additional settings
    menubar: false,
    branding: false,
    promotion: false,
    resize: true,
    statusbar: true,
    elementpath: false,
    wordcount: false
});

// Handle file upload with drag and drop
const fileInput = document.getElementById('fileInput');
const uploadArea = document.querySelector('.upload-area');

function setEditorContent(content) {
    if (editor && editor.initialized) {
        editor.setContent(content);
    } else {
        tinymce.get('editor').setContent(content);
    }
}

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            setEditorContent(content);
            // Show success indicator
            const successIndicator = document.createElement('div');
            successIndicator.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 flex items-center';
            successIndicator.innerHTML = `
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                File uploaded successfully!
            `;
            document.body.appendChild(successIndicator);
            setTimeout(() => {
                successIndicator.style.opacity = '0';
                setTimeout(() => successIndicator.remove(), 500);
            }, 2000);
        } catch (error) {
            console.error('Error loading file content:', error);
            // Show error indicator
            const errorIndicator = document.createElement('div');
            errorIndicator.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 flex items-center';
            errorIndicator.innerHTML = `
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Error uploading file
            `;
            document.body.appendChild(errorIndicator);
            setTimeout(() => {
                errorIndicator.style.opacity = '0';
                setTimeout(() => errorIndicator.remove(), 500);
            }, 2000);
        }
    };
    
    reader.onerror = function(error) {
        console.error('Error reading file:', error);
    };
    
    reader.readAsText(file);
}

// Drag and drop functionality
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('drag-active');
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('drag-active');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('drag-active');
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.toLowerCase().endsWith('.txt')) {
        handleFile(file);
    } else {
        // Show invalid file type error
        const errorIndicator = document.createElement('div');
        errorIndicator.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 flex items-center';
        errorIndicator.innerHTML = `
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Please upload a .txt file only
        `;
        document.body.appendChild(errorIndicator);
        setTimeout(() => {
            errorIndicator.style.opacity = '0';
            setTimeout(() => errorIndicator.remove(), 500);
        }, 2000);
    }
});

// Click to upload
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.name.toLowerCase().endsWith('.txt')) {
        handleFile(file);
    } else if (file) {
        // Show invalid file type error
        const errorIndicator = document.createElement('div');
        errorIndicator.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 flex items-center';
        errorIndicator.innerHTML = `
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Please upload a .txt file only
        `;
        document.body.appendChild(errorIndicator);
        setTimeout(() => {
            errorIndicator.style.opacity = '0';
            setTimeout(() => errorIndicator.remove(), 500);
        }, 2000);
    }
});

// Download as HTML
function downloadAsHTML() {
    const content = tinymce.get('editor').getContent();
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.htm';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Download as Text
function downloadAsText() {
    const content = tinymce.get('editor').getContent();
    
    // Clean up the HTML content to make it more readable in text format
    const formattedContent = content
        .replace(/>\s+</g, '>\n<')  // Add newline between tags
        .replace(/(<\/[^>]+>)/g, '$1\n')  // Add newline after closing tags
        .trim();  // Remove leading/trailing whitespace
    
    const blob = new Blob([formattedContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
} 