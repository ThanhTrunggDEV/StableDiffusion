from flask import Flask, render_template, request, jsonify, send_from_directory
from config import Config
from utils.image_generator import ImageGenerator
import os
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize directories
Config.init_app()

# Initialize image generator
generator = None


def get_generator():
    """Get or create the image generator instance"""
    global generator
    if generator is None:
        generator = ImageGenerator(
            model_id=Config.MODEL_ID,
            device=Config.DEVICE
        )
    return generator


@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')


@app.route('/gallery')
def gallery():
    """Gallery page showing all generated images"""
    generated_dir = Config.GENERATED_DIR
    images = []
    
    if generated_dir.exists():
        # Get all image files
        for file in generated_dir.glob('*.png'):
            images.append({
                'filename': file.name,
                'url': f'/static/generated/{file.name}',
                'created': file.stat().st_mtime
            })
        
        # Sort by creation time (newest first)
        images.sort(key=lambda x: x['created'], reverse=True)
    
    return render_template('gallery.html', images=images)


@app.route('/generate', methods=['POST'])
def generate():
    """Generate image from prompt"""
    try:
        # Get parameters from request
        data = request.get_json()
        prompt = data.get('prompt', '').strip()
        negative_prompt = data.get('negative_prompt', '').strip()
        width = int(data.get('width', Config.DEFAULT_WIDTH))
        height = int(data.get('height', Config.DEFAULT_HEIGHT))
        steps = int(data.get('steps', Config.DEFAULT_STEPS))
        guidance_scale = float(data.get('guidance_scale', Config.DEFAULT_GUIDANCE_SCALE))
        seed = data.get('seed')
        
        # Validate parameters
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        if width > Config.MAX_WIDTH or height > Config.MAX_HEIGHT:
            return jsonify({'error': f'Image dimensions too large'}), 400
        
        if steps > Config.MAX_STEPS:
            return jsonify({'error': f'Too many steps'}), 400
        
        # Convert seed to integer if provided
        if seed:
            try:
                seed = int(seed)
            except ValueError:
                seed = None
        
        logger.info(f"Generating image: {prompt}")
        
        # Get generator and generate image
        gen = get_generator()
        image = gen.generate_image(
            prompt=prompt,
            negative_prompt=negative_prompt,
            width=width,
            height=height,
            num_inference_steps=steps,
            guidance_scale=guidance_scale,
            seed=seed
        )
        
        # Save image
        filename = gen.save_image(image, Config.GENERATED_DIR)
        
        return jsonify({
            'success': True,
            'image_url': f'/static/generated/{filename}',
            'filename': filename
        })
        
    except Exception as e:
        logger.error(f"Error generating image: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/settings')
def get_settings():
    """Get current settings"""
    return jsonify({
        'default_width': Config.DEFAULT_WIDTH,
        'default_height': Config.DEFAULT_HEIGHT,
        'default_steps': Config.DEFAULT_STEPS,
        'default_guidance_scale': Config.DEFAULT_GUIDANCE_SCALE,
        'max_width': Config.MAX_WIDTH,
        'max_height': Config.MAX_HEIGHT,
        'max_steps': Config.MAX_STEPS,
        'model_id': Config.MODEL_ID,
        'device': Config.DEVICE
    })


@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
