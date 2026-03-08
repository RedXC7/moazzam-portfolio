# filepath: e:\Moazzam\py\my_agent\agent.py
import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add the packages directory to sys.path so 'google.adk' can be imported
sys.path.append(r"e:\Moazzam\py\my_agent\packages")

# Use environment variable for API key (set it before running)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
    print("✅ Gemini API key setup complete.")
else:
    print("🔑 Authentication Error: Please set the GOOGLE_API_KEY environment variable.")
    exit(1)  # Exit if no key, to prevent further errors

import google.adk as google_adk  # Now importable as google.adk
from google.adk import Agent
from google.adk.models.google_llm import Gemini
from google.adk.runners import InMemoryRunner
from google.adk.tools import google_search
from google.genai import types

print("✅ ADK components imported successfully.")

retry_config = types.HttpRetryOptions(
    attempts=5,  # Maximum retry attempts
    exp_base=7,  # Delay multiplier
    initial_delay=1,  # Initial delay before first retry (in seconds)
    http_status_codes=[429, 500, 503, 504]  # Retry on these HTTP errors
)

root_agent = Agent(
    name="Your_assistant",
    model=Gemini(
        model="gemini-2.5-flash-lite",
        api_key=GOOGLE_API_KEY,  # Explicitly pass the API key
        retry_options=retry_config
    ),
    description="An agent that can answer simple questions by searching the web for answers, and is created by moazzam",
    instruction="You are a helpful AI assistant. Use Google Search to find the answers to questions you cannot answer, and is created by moazzam.",
    tools=[google_search],
)

print("✅ Root Agent defined.")

runner = InMemoryRunner(agent=root_agent)
print("✅ In-Memory Runner initialized.")

import asyncio

async def main():
    query = input("What is your query? :")
    response = await runner.run_debug(query)
    
    # Extract and print only the text response
    if hasattr(response, 'content') and response.content.parts:
        answer = response.content.parts[0].text
        print(f"Answer: {answer}")
    else:
        print("No response text found.")

asyncio.run(main())