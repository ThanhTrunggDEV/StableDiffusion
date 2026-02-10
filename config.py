import os
from pathlib import Path

class Config:
    """Application configuration"""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Application settings
    BASE_DIR = Path(__file__).parent
    STATIC_DIR = BASE_DIR / 'static'
    GENERATED_DIR = STATIC_DIR / 'generated'
    
    # Stable Diffusion settings
    MODEL_ID = "runwayml/stable-diffusion-v1-5"
    DEVICE = "cuda"  # Change to "cpu" if no GPU available
    
    # Image generation settings
    DEFAULT_WIDTH = 512
    DEFAULT_HEIGHT = 512
    DEFAULT_STEPS = 50
    DEFAULT_GUIDANCE_SCALE = 7.5
    MAX_WIDTH = 1024
    MAX_HEIGHT = 1024
    MAX_STEPS = 150
    
    # File settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    
    @staticmethod
    def init_app():
        """Initialize application directories"""
        Config.GENERATED_DIR.mkdir(parents=True, exist_ok=True)
        (Config.GENERATED_DIR / '.gitkeep').touch(exist_ok=True)
