
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Fallback to hardcoded key if env var issue (copying from previous view_file output)
    api_key = "AIzaSyD3NnKfSR5KYig4PbUt-8s0sfpkR3fHYSM" 

print(f"Using API Key: {api_key[:10]}...")

genai.configure(api_key=api_key)

print("Listing available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")
