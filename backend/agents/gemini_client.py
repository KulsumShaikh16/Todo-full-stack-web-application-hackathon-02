import os
import google.generativeai as genai
import logging
try:
    from db import settings
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from db import settings

logger = logging.getLogger(__name__)

def init_gemini():
    """Initialize the Gemini API with the key from settings."""
    api_key = os.getenv("GEMINI_API_KEY") or settings.gemini_api_key
    if not api_key:
        logger.error("GEMINI_API_KEY not found in environment or settings")
        return False
        
    genai.configure(api_key=api_key)
    logger.info("Gemini API initialized successfully")
    return True

def get_model(model_name=None, tools=None, system_instruction=None):
    """Get a Gemini model instance."""
    name = model_name or os.getenv("GEMINI_MODEL") or settings.gemini_model or "gemini-1.5-flash"
    
    return genai.GenerativeModel(
        model_name=name,
        tools=tools,
        system_instruction=system_instruction
    )
