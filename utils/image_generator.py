import torch
from diffusers import StableDiffusionPipeline
from PIL import Image
import os
from datetime import datetime
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class ImageGenerator:
    """Stable Diffusion Image Generator"""
    
    def __init__(self, model_id, device="cuda"):
        """
        Initialize the image generator
        
        Args:
            model_id: Hugging Face model ID
            device: Device to run on ('cuda' or 'cpu')
        """
        self.model_id = model_id
        self.device = device if torch.cuda.is_available() else "cpu"
        self.pipe = None
        
        if self.device == "cuda" and not torch.cuda.is_available():
            logger.warning("CUDA not available, falling back to CPU")
            self.device = "cpu"
        
        logger.info(f"Using device: {self.device}")
    
    def load_model(self):
        """Load the Stable Diffusion model"""
        if self.pipe is None:
            logger.info(f"Loading model {self.model_id}...")
            
            try:
                self.pipe = StableDiffusionPipeline.from_pretrained(
                    self.model_id,
                    torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                    safety_checker=None,  # Disable safety checker for faster loading
                )
                self.pipe = self.pipe.to(self.device)
                
                # Enable memory optimizations
                if self.device == "cuda":
                    self.pipe.enable_attention_slicing()
                    
                logger.info("Model loaded successfully")
            except Exception as e:
                logger.error(f"Error loading model: {e}")
                raise
    
    def generate_image(
        self,
        prompt,
        negative_prompt="",
        width=512,
        height=512,
        num_inference_steps=50,
        guidance_scale=7.5,
        seed=None
    ):
        """
        Generate an image from a text prompt
        
        Args:
            prompt: Text prompt describing the desired image
            negative_prompt: Things to avoid in the image
            width: Image width
            height: Image height
            num_inference_steps: Number of denoising steps
            guidance_scale: How closely to follow the prompt
            seed: Random seed for reproducibility
        
        Returns:
            PIL Image object
        """
        if self.pipe is None:
            self.load_model()
        
        logger.info(f"Generating image with prompt: {prompt}")
        
        # Set random seed if provided
        generator = None
        if seed is not None:
            generator = torch.Generator(device=self.device).manual_seed(seed)
        
        try:
            # Generate image
            with torch.autocast(self.device):
                result = self.pipe(
                    prompt=prompt,
                    negative_prompt=negative_prompt if negative_prompt else None,
                    width=width,
                    height=height,
                    num_inference_steps=num_inference_steps,
                    guidance_scale=guidance_scale,
                    generator=generator,
                )
            
            image = result.images[0]
            logger.info("Image generated successfully")
            return image
            
        except Exception as e:
            logger.error(f"Error generating image: {e}")
            raise
    
    def save_image(self, image, output_dir, prefix="generated"):
        """
        Save image to disk
        
        Args:
            image: PIL Image object
            output_dir: Directory to save the image
            prefix: Filename prefix
        
        Returns:
            Path to saved image (relative to static directory)
        """
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{prefix}_{timestamp}.png"
        filepath = output_dir / filename
        
        # Save image
        image.save(filepath)
        logger.info(f"Image saved to {filepath}")
        
        return filename
    
    def unload_model(self):
        """Unload model from memory"""
        if self.pipe is not None:
            del self.pipe
            self.pipe = None
            
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            logger.info("Model unloaded from memory")
