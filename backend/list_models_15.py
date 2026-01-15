
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY") or "AIzaSyD3NnKfSR5KYig4PbUt-8s0sfpkR3fHYSM"
genai.configure(api_key=api_key)

print("Listing 1.5 models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods and '1.5' in m.name:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error: {e}")
