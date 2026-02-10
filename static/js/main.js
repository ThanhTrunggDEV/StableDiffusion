// Main JavaScript for Stable Diffusion Generator

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generateForm');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const loader = generateBtn.querySelector('.loader');
    const resultContainer = document.getElementById('resultContainer');
    const statusMessage = document.getElementById('statusMessage');
    const aspectRatioSelect = document.getElementById('aspect_ratio');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const dimensionInfo = document.getElementById('currentDimension');
    
    // Modal elements
    const modal = document.getElementById('customDimensionModal');
    const customWidthInput = document.getElementById('custom_width');
    const customHeightInput = document.getElementById('custom_height');
    const applyCustomBtn = document.getElementById('applyCustom');
    const cancelCustomBtn = document.getElementById('cancelCustom');

    // Aspect ratio presets
    const aspectRatioPresets = {
        '1:1': { width: 512, height: 512, name: 'Vuông' },
        '16:9': { width: 896, height: 512, name: 'Ngang 16:9' },
        '9:16': { width: 512, height: 896, name: 'Dọc 9:16' },
        '4:3': { width: 640, height: 480, name: 'Ngang 4:3' },
        '3:4': { width: 480, height: 640, name: 'Dọc 3:4' },
        '3:2': { width: 768, height: 512, name: 'Ngang 3:2' },
        '2:3': { width: 512, height: 768, name: 'Dọc 2:3' }
    };

    // Update dimension display
    function updateDimensionDisplay() {
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        dimensionInfo.textContent = `${width} × ${height} px`;
    }

    // Handle aspect ratio change
    aspectRatioSelect.addEventListener('change', (e) => {
        const selectedRatio = e.target.value;
        
        if (selectedRatio === 'custom') {
            // Show modal for custom dimensions
            customWidthInput.value = widthInput.value;
            customHeightInput.value = heightInput.value;
            modal.style.display = 'flex';
        } else if (aspectRatioPresets[selectedRatio]) {
            // Apply preset
            const preset = aspectRatioPresets[selectedRatio];
            widthInput.value = preset.width;
            heightInput.value = preset.height;
            updateDimensionDisplay();
        }
    });

    // Apply custom dimensions
    applyCustomBtn.addEventListener('click', () => {
        widthInput.value = customWidthInput.value;
        heightInput.value = customHeightInput.value;
        updateDimensionDisplay();
        modal.style.display = 'none';
        
        // Check if it matches a preset
        const matchedPreset = findMatchingPreset();
        if (matchedPreset) {
            aspectRatioSelect.value = matchedPreset;
        }
    });

    // Cancel custom dimensions
    cancelCustomBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        // Reset to previous selection or default
        const matchedPreset = findMatchingPreset();
        aspectRatioSelect.value = matchedPreset || '1:1';
        if (!matchedPreset) {
            widthInput.value = 512;
            heightInput.value = 512;
            updateDimensionDisplay();
        }
    });

    // Close modal on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cancelCustomBtn.click();
        }
    });

    // Check if current dimensions match any preset
    function findMatchingPreset() {
        const currentWidth = parseInt(widthInput.value);
        const currentHeight = parseInt(heightInput.value);
        
        for (const [ratio, preset] of Object.entries(aspectRatioPresets)) {
            if (preset.width === currentWidth && preset.height === currentHeight) {
                return ratio;
            }
        }
        return null;
    }

    // Initialize dimension display
    updateDimensionDisplay();

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            prompt: document.getElementById('prompt').value.trim(),
            negative_prompt: document.getElementById('negative_prompt').value.trim(),
            width: parseInt(document.getElementById('width').value),
            height: parseInt(document.getElementById('height').value),
            steps: parseInt(document.getElementById('steps').value),
            guidance_scale: parseFloat(document.getElementById('guidance_scale').value),
            seed: document.getElementById('seed').value.trim() || null,
            enhance_prompt: document.getElementById('enhance_prompt').checked,
            use_default_negative: document.getElementById('use_default_negative').checked
        };

        // Validate prompt
        if (!formData.prompt) {
            showStatus('Please enter a prompt', 'error');
            return;
        }

        // Disable form and show loading
        setLoading(true);
        showStatus('Generating image... This may take a minute.', 'info');

        try {
            // Send request to backend
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Display generated image
                displayImage(data.image_url);
                showStatus('Image generated successfully!', 'success');
            } else {
                throw new Error(data.error || 'Failed to generate image');
            }
        } catch (error) {
            console.error('Error:', error);
            showStatus(`Error: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    });

    // Display generated image
    function displayImage(imageUrl) {
        resultContainer.innerHTML = `
            <img src="${imageUrl}" alt="Generated image">
        `;
    }

    // Show status message
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        
        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    }

    // Set loading state
    function setLoading(isLoading) {
        generateBtn.disabled = isLoading;
        
        if (isLoading) {
            btnText.textContent = 'Generating...';
            loader.style.display = 'inline-block';
        } else {
            btnText.textContent = 'Generate Image';
            loader.style.display = 'none';
        }
    }

    // Validate numeric inputs
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener('change', () => {
            const min = parseInt(input.min);
            const max = parseInt(input.max);
            const value = parseInt(input.value);
            
            if (value < min) input.value = min;
            if (value > max) input.value = max;
        });
    });

    // Load application settings on page load
    loadSettings();
});

// Load application settings
async function loadSettings() {
    try {
        const response = await fetch('/api/settings');
        const settings = await response.json();
        
        console.log('Application settings:', settings);
        
        // Store settings globally
        window.appSettings = settings;
        
        // Update form defaults if needed
        document.getElementById('width').value = settings.default_width;
        document.getElementById('height').value = settings.default_height;
        document.getElementById('steps').value = settings.default_steps;
        document.getElementById('guidance_scale').value = settings.default_guidance_scale;
        
        // Update max values
        document.getElementById('width').max = settings.max_width;
        document.getElementById('height').max = settings.max_height;
        document.getElementById('steps').max = settings.max_steps;
        
        // Set enhancement options from config
        document.getElementById('enhance_prompt').checked = settings.auto_enhance_prompt;
        document.getElementById('use_default_negative').checked = settings.use_default_negative;
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Show defaults dialog
document.addEventListener('DOMContentLoaded', () => {
    const showDefaultsLink = document.getElementById('showDefaults');
    if (showDefaultsLink) {
        showDefaultsLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!window.appSettings) {
                alert('Settings not loaded yet. Please wait...');
                return;
            }
            
            const message = `📋 Default AI Enhancements:\\n\\n` +
                `✨ Quality Keywords:\\n${window.appSettings.quality_enhancement_keywords}\\n\\n` +
                `🛡️ Default Negative Prompt:\\n${window.appSettings.default_negative_prompt}\\n\\n` +
                `💡 These are automatically added to improve image quality!`;
            
            alert(message);
        });
    }
});
