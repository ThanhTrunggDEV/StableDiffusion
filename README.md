# Stable Diffusion Image Generator

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ThanhTrunggDEV/StableDiffusion/blob/main/StableDiffusion_Colab.ipynb)

A web application for generating images using Stable Diffusion with Flask.

## 🚀 Quick Start

### Option 1: Run on Google Colab (Easiest - No Installation Required!)
**Perfect for testing without local setup**

1. Click the "Open in Colab" badge above
2. Follow the instructions in the notebook
3. Get your free ngrok token from [ngrok.com](https://ngrok.com/)
4. Run all cells and enjoy!

### Option 2: Run Locally

## Features

- 🎨 Generate images from text prompts
- ⚙️ Adjustable generation parameters (steps, guidance scale, dimensions)
- 🖼️ Image gallery to view generated images
- 🎯 Clean and responsive UI
- 💾 Save generated images locally

## Requirements

- Python 3.8+
- CUDA-compatible GPU (recommended) or CPU
- 8GB+ RAM (16GB+ recommended for GPU)

## Installation

1. Clone or download this project

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. (Optional) Create a `.env` file for configuration:
```env
SECRET_KEY=your-secret-key-here
DEVICE=cuda  # or cpu if no GPU available
```

## Usage

1. Start the Flask application:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

3. Enter a text prompt and click "Generate" to create images

## Configuration

Edit `config.py` to customize:
- Model ID (default: runwayml/stable-diffusion-v1-5)
- Device (cuda/cpu)
- Default image dimensions
- Maximum generation parameters

## Project Structure

```
StableDiffusion/
├── app.py                  # Main Flask application
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── utils/
│   └── image_generator.py # Image generation logic
├── static/
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   └── generated/        # Generated images
└── templates/            # HTML templates
    ├── index.html        # Main page
    └── gallery.html      # Gallery page
```

## Notes

- First run will download the Stable Diffusion model (~4GB)
- Generation time depends on your hardware (GPU: ~5-10s, CPU: 1-5 minutes)
- Adjust image dimensions based on your VRAM/RAM availability

## License

MIT License
