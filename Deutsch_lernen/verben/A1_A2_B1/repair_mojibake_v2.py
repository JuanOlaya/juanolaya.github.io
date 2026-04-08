import os
import re

def fix_mojibake_string(text):
    """
    Tries to fix mojibake in a string by detecting double-encoded UTF-8.
    """
    def replacement(match):
        m = match.group(0)
        try:
            # Try to restore the original byte sequence
            return m.encode('latin1').decode('utf-8')
        except (UnicodeEncodeError, UnicodeDecodeError):
            return m

    # Pattern for double encoded UTF-8 characters (like Ã¤, ðŸ)
    # This searches for sequences that shouldn't normally be in a clean UTF-8 file
    pattern = re.compile(r'[\xc3-\xc5][\x80-\xbf]|[\b\xf0][\x9f][\x80-\xbf]{2}')
    
    # Actually, a more reliable way if we know the WHOLE string might be messed up 
    # but mixed with good text is harder.
    # Let's target the known markers from the audit: Ã, ðŸ, â, ð
    
    # We'll use a byte-level scanner for sequences like:
    # c3 83 c2 a4 (which should be c3 a4 'ä')
    
    return text

def repair_file_surgical(file_path):
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
            
        original_content = content
        
        # 1. Broad heuristic repair: Latin1-to-UTF8 restoration
        # We try to find sequences that LOOK like double-encoded UTF8
        try:
            # Many of these files are UTF-8 files that were saved AS Latin-1 
            # (effectively taking the UTF-8 bytes and interpreting them as single chars)
            # then saved again as UTF-8.
            
            # If we decode as utf-8, then encode as latin1, we might get the original bytes.
            text = content.decode('utf-8')
            
            # REGEX to find ONLY the suspected mojibake parts
            def recover_match(m):
                try:
                    return m.group(0).encode('latin1').decode('utf-8')
                except:
                    return m.group(0)
            
            # Pattern for common mojibake starts
            # \u00c0-\u00ff are the extended Latin1 chars often seen in mojibake
            fixed_text = re.sub(r'[\u00c0-\u00ff][\u0080-\u00bf]+', recover_match, text)
            
            # Specific fix for the 'house' emoji observed in the audit: ðŸ  
            fixed_text = fixed_text.replace('ðŸ§ ', '🧠')
            fixed_text = fixed_text.replace('ðŸ  ', '🏠')
            fixed_text = fixed_text.replace('âœ…', '✅')
            fixed_text = fixed_text.replace('Ã¤', 'ä')
            fixed_text = fixed_text.replace('Ã¶', 'ö')
            fixed_text = fixed_text.replace('Ã¼', 'ü')
            fixed_text = fixed_text.replace('ÃŸ', 'ß')
            fixed_text = fixed_text.replace('Ã„', 'Ä')
            fixed_text = fixed_text.replace('Ã–', 'Ö')
            fixed_text = fixed_text.replace('Ãœ', 'Ü')
            
            new_content = fixed_text.encode('utf-8')
            
            if new_content != original_content:
                with open(file_path, 'wb') as f:
                    f.write(new_content)
                return True
        except Exception as e:
            # Fallback for more complex cases
            pass
            
    except Exception as e:
        print(f"Error repairing {file_path}: {e}")
    return False

def run_repair(root_dir):
    repaired_files = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.json', '.html', '.js')):
                path = os.path.join(root, file)
                if repair_file_surgical(path):
                    repaired_files.append(path)
    return repaired_files

if __name__ == "__main__":
    target = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1'
    fixed = run_repair(target)
    print(f"--- REPORTE DE SANEAMIENTO V2 (QUIRÚRGICO) ---")
    print(f"Archivos reparados: {len(fixed)}")
    print("-" * 40)
    for f in fixed[:20]:
        print(f"[REPARADO] {os.path.relpath(f, target)}")
    if len(fixed) > 20:
        print(f"... y {len(fixed) - 20} archivos más.")
