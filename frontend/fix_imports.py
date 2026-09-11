import os

src_dir = r"m:\flycast\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # Only process if we have the bad import
    if "import api from '../utils/api';" in content:
        # Remove all instances of the bad import line
        lines = content.split('\n')
        new_lines = [line for line in lines if "import api from '../utils/api';" not in line]
        
        # Add the import safely right at the top (e.g. after the very first line, or just at the top)
        new_lines.insert(0, "import api from '../utils/api';")
        
        updated_content = '\n'.join(new_lines)
        if updated_content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"Fixed {filepath}")

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))
