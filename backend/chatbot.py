import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")

def get_response(user_message):
    prompt = f"""
    You are an AI assistant for college students.

    Rules:
    - Give concise answers.
    - Use simple language.
    - Keep answers under 100 words.
    - Avoid markdown symbols like ** or ##.
    - Explain with a simple example when possible.

    Question:
    {user_message}
    """

    response = model.generate_content(prompt)
    return response.text