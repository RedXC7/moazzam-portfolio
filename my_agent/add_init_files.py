# filepath: e:\Moazzam\py\my_agent\add_init_files.py
import os

# Base directory for the adk package
base_dir = r"e:\Moazzam\py\my_agent\packages\google\adk"

# Walk through all subdirectories
for root, dirs, files in os.walk(base_dir):
    # Skip __pycache__ directories
    if "__pycache__" in root:
        continue
    
    # Path to __init__.py
    init_file = os.path.join(root, "__init__.py")
    
    # Create if it doesn't exist
    if not os.path.exists(init_file):
        with open(init_file, "w") as f:
            f.write("# Auto-generated __init__.py\n")
        print(f"Created: {init_file}")
    else:
        print(f"Already exists: {init_file}")