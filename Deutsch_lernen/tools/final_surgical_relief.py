import os

def final_surgical_fix(file_path):
    print(f"--- SANEAMIENTO DE PRECISIÓN: {os.path.basename(file_path)} ---")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # Dictionary of literal patterns seen in the viewing tool
        # We target the actual corruption signatures
        fixes = {
            'cayó': 'cayó',
            'qué?': 'qué',
            'construyó?': 'construyó',
            'Berl?n': 'Berlín',
            'Berln': 'Berlín',
            'divisin': 'división',
            'divisi?n': 'división',
            'a?o': 'año',
            'ao': 'año',
            '?En': '¿En',
            'opinin': 'opinión',
            'opini?n': 'opinión',
            'reunin': 'reunión',
            'reuni?n': 'reunión',
            'manifestacin': 'manifestación',
            'manifestaci?n': 'manifestación',
            'circulacin': 'circulación',
            'circulaci?n': 'circulación',
            'discriminacin': 'discriminación',
            'discriminaci?n': 'discriminación',
            'repblica': 'república',
            'rep?blica': 'república',
            'democrtico': 'democrático',
            'democr?tico': 'democrático',
            'soberana': 'soberanía',
            'soberan?a': 'soberanía',
            'legislacin': 'legislación',
            'legislaci?n': 'legislación',
            'separacin': 'separación',
            'separaci?n': 'separación',
            'poblacin': 'población',
            'poblaci?n': 'población',
            'eleccin': 'elección',
            'elecci?n': 'elección',
            'emisin': 'emisión',
            'emisi?n': 'emisión',
            'votacin': 'votación',
            'votaci?n': 'votación',
            'participacin': 'participación',
            'participaci?n': 'participación',
            'escao': 'escaño',
            'esca?o': 'escaño',
            'coalicin': 'coalición',
            'coalici?n': 'coalición',
            'oposicin': 'oposición',
            'oposici?n': 'oposición',
            'mayora': 'mayoría',
            'mayor?a': 'mayoría',
            'minora': 'minoría',
            'minor?a': 'minoría',
            'fraccin': 'fracción',
            'fracci?n': 'fracción',
            'pase': 'paíse',
            'pa?se': 'paíse',
            'polica': 'policía',
            'polic?a': 'policía',
            'crcel': 'cárcel',
            'c?rcel': 'cárcel',
            'religin': 'religión',
            'religi?n': 'religión',
            'integracin': 'integración',
            'integraci?n': 'integración',
            'histricamente': 'históricamente',
            'hist?ricamente': 'históricamente',
            'Da': 'Día',
            'D?a': 'Día',
            'guila': 'Águila',
            '?guila': 'Águila',
            'econmico': 'económico',
            'econ?mico': 'económico',
            'smbolo': 'símbolo',
            'asociacin': 'asociación',
            'asociaci?n': 'asociación',
            'difusin': 'difusión',
            'difusi?n': 'difusión',
        }
        
        for bad, good in fixes.items():
            content = content.replace(bad, good)
            
        # Global replacement for remaining orphan replacement characters
        # Just in case some escaped the specific word fixes
        content = content.replace('', '') # Remove if lone
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Error in {file_path}: {e}")
    return False

target = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\Einbürgerungstest\lid_kompakt_modal.js'
if final_surgical_fix(target):
    print(f"[RESTAURADO DEFINITIVO] {target}")
