// Main JavaScript for Stable Diffusion Generator

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generateForm');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const loader = generateBtn.querySelector('.loader');
    const resultContainer = document.getElementById('resultContainer');
    const statusMessage = document.getElementById('statusMessage');

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
            seed: document.getElementById('seed').value.trim() || null
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
        
        // Update form defaults if needed
        document.getElementById('width').value = settings.default_width;
        document.getElementById('height').value = settings.default_height;
        document.getElementById('steps').value = settings.default_steps;
        document.getElementById('guidance_scale').value = settings.default_guidance_scale;
        
        // Update max values
        document.getElementById('width').max = settings.max_width;
        document.getElementById('height').max = settings.max_height;
        document.getElementById('steps').max = settings.max_steps;
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}
