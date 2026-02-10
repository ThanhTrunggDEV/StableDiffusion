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
    
    # Prompt enhancement settings
    DEFAULT_NEGATIVE_PROMPT = (
        "blurry, low quality, low-res, distorted, deformed, ugly, bad anatomy, "
        "bad proportions, extra limbs, cloned face, disfigured, gross proportions, "
        "malformed limbs, missing arms, missing legs, extra arms, extra legs, "
        "fused fingers, too many fingers, long neck, watermark, signature, text, "
        "username, jpeg artifacts, worst quality"
    )
    
    QUALITY_ENHANCEMENT_KEYWORDS = (
        "highly detailed, professional, 8k, sharp focus, masterpiece, "
        "best quality, ultra-detailed"
    )
    
    # Enable/disable features by default
    AUTO_ENHANCE_PROMPT = True  # Automatically add quality keywords
    USE_DEFAULT_NEGATIVE = True  # Automatically use default negative prompt
    
    # File settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    
    @staticmethod
    def init_app():
        """Initialize application directories"""
        Config.GENERATED_DIR.mkdir(parents=True, exist_ok=True)
        (Config.GENERATED_DIR / '.gitkeep').touch(exist_ok=True)
