#!/usr/bin/env python3
"""
Script to run the FastAPI server for the AI assistant.
"""
import subprocess
import sys
import os

# Change to the my_agent directory
os.chdir(r"e:\Moazzam\py\my_agent")

# Run the API server
try:
    subprocess.run([sys.executable, "api.py"], check=True)
except KeyboardInterrupt:
    print("\nServer stopped.")
except subprocess.CalledProcessError as e:
    print(f"Error running server: {e}")</content>
<parameter name="filePath">e:\Moazzam\py\my_agent\run_server.py