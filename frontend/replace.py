import os
import re

src_dir = r"m:\flycast\frontend\src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # Check if we need to replace anything
    if 'http://localhost:5000/api' in content:
        # We replace 'http://localhost:5000/api' with `api`
        # BUT we also need to change axios.get(...) to api.get(...)
        # Wait, the easiest way is to import api, and then replace `axios.get('http://localhost:5000/api/...` with `api.get('/...`
        
        # Replace axios.<method>('http://localhost:5000/api/...') with api.<method>('/...')
        content = re.sub(r"axios\.([a-z]+)\('http://localhost:5000/api", r"api.\1('", content)
        content = re.sub(r'axios\.([a-z]+)\("http://localhost:5000/api', r'api.\1("', content)
        content = re.sub(r"axios\.([a-z]+)\(`http://localhost:5000/api", r"api.\1(`", content)

        if content != original_content:
            # Add import statement at the top if not present
            if 'import api from' not in content:
                # determine relative path to utils/api
                rel_path = os.path.relpath(r"m:\flycast\frontend\src\utils\api", os.path.dirname(filepath)).replace("\\", "/")
                # add import after the last import statement or at the top
                imports_end = 0
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if line.startswith('import '):
                        imports_end = i
                
                lines.insert(imports_end + 1, f"import api from '{rel_path}';")
                content = '\n'.join(lines)
                
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))
