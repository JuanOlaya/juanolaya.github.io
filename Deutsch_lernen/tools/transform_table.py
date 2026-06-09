#!/usr/bin/env python3
"""
Script to transform einkaufsvokabular.html table structure 
to match the format used in abstraktes-deutsches-substantiv.html
"""

import re

def transform_table_row(content):
    """Transform a single table row from old format to new format"""
    
    # Pattern to match the old table structure
    pattern = r'(\s+)<tr>\s*\n\s*<td data-label="Deutsches Substantiv \(German Noun\)">([^<]+)</td>\s*\n\s*<td data-label="Aussprache \(Pronunciation\)">([^<]+)</td>\s*\n\s*<td data-label="Englisch \(English\)">([^<]+)</td>\s*\n\s*<td data-label="Spanisch \(Spanish\)">([^<]+)</td>\s*\n\s*<td data-label="Emoji">([^<]+)</td>\s*\n\s*<td data-label="Definiter Artikel">([^<]+(?:<[^>]*>[^<]*</[^>]*>)*[^<]*)</td>\s*\n\s*<td data-label="Indefiniter Artikel">([^<]+(?:<[^>]*>[^<]*</[^>]*>)*[^<]*)</td>\s*\n\s*<td data-label="Negation">([^<]+(?:<[^>]*>[^<]*</[^>]*>)*[^<]*)</td>\s*\n\s*<td data-label="Beispielsatz 1 \(German\)">([^<]+(?:<[^>]*>[^<]*</[^>]*>)*[^<]*)</td>\s*\n\s*<td data-label="Beispielsatz 2 \(German\)">([^<]+(?:<[^>]*>[^<]*</[^>]*>)*[^<]*)</td>\s*\n\s*</tr>'
    
    def replace_match(match):
        indent = match.group(1)
        noun = match.group(2)
        pronunciation = match.group(3)
        english = match.group(4)
        spanish = match.group(5)
        emoji = match.group(6)
        definite_article = match.group(7)
        indefinite_article = match.group(8)
        negation = match.group(9)
        example1 = match.group(10)
        example2 = match.group(11)
        
        # Extract noun details (article and gender color)
        noun_match = re.search(r'<strong><span class="(der|die|das)-color">([^<]+)</span></strong>', noun)
        if not noun_match:
            return match.group(0)  # Return original if pattern doesn't match
            
        gender = noun_match.group(1)
        noun_text = noun_match.group(2)
        
        # Create appropriate case examples for nominativ/akkusativ
        if gender == "der":
            nom_def = f"<strong><span class=\"{gender}-color\">Der {noun_text.split()[1]}</span></strong> ist geöffnet."
            acc_def = definite_article.replace(f"<strong><span class=\"{gender}-color\">der</span></strong>", f"<strong><span class=\"{gender}-color\">den</span></strong>").replace(f"<strong><span class=\"{gender}-color\">dem</span></strong>", f"<strong><span class=\"{gender}-color\">den</span></strong>")
            nom_indef = f"Das ist <strong><span class=\"{gender}-color\">ein {noun_text.split()[1]}</span></strong>."
            acc_indef = f"Ich suche <strong><span class=\"{gender}-color\">einen {noun_text.split()[1]}</span></strong>."
            nom_neg = f"<strong><span class=\"{gender}-color\">Kein {noun_text.split()[1]}</span></strong> ist hier."
            acc_neg = negation
        elif gender == "die":
            nom_def = f"<strong><span class=\"{gender}-color\">Die {noun_text.split()[1]}</span></strong> ist geöffnet."
            acc_def = definite_article
            nom_indef = f"Das ist <strong><span class=\"{gender}-color\">eine {noun_text.split()[1]}</span></strong>."
            acc_indef = f"Ich suche <strong><span class=\"{gender}-color\">eine {noun_text.split()[1]}</span></strong>."
            nom_neg = f"<strong><span class=\"{gender}-color\">Keine {noun_text.split()[1]}</span></strong> ist hier."
            acc_neg = negation
        else:  # das
            nom_def = f"<strong><span class=\"{gender}-color\">Das {noun_text.split()[1]}</span></strong> ist hier."
            acc_def = definite_article
            nom_indef = f"Das ist <strong><span class=\"{gender}-color\">ein {noun_text.split()[1]}</span></strong>."
            acc_indef = f"Ich suche <strong><span class=\"{gender}-color\">ein {noun_text.split()[1]}</span></strong>."
            nom_neg = f"<strong><span class=\"{gender}-color\">Kein {noun_text.split()[1]}</span></strong> ist hier."
            acc_neg = negation
        
        # Format translations with flags
        def add_flags(text):
            return text.replace("<i>", "🇬🇧 <i>").replace("</i> <br/> <i>", "</i> <br/> 🇪🇸 <i>")
        
        nom_def_flags = add_flags(nom_def + "<br/>🇬🇧 <i>The ... is open.</i><br/>🇪🇸 <i>... está abierto/a.</i>")
        acc_def_flags = add_flags(acc_def).replace("<br/>", "<br/>").replace(" <br/> ", "<br/>")
        nom_indef_flags = add_flags(nom_indef + "<br/>🇬🇧 <i>That is a ...</i><br/>🇪🇸 <i>Esa es una/un ...</i>")
        acc_indef_flags = add_flags(acc_indef + "<br/>🇬🇧 <i>I'm looking for a ...</i><br/>🇪🇸 <i>Busco una/un ...</i>")
        nom_neg_flags = add_flags(nom_neg + "<br/>🇬🇧 <i>No ... is here.</i><br/>🇪🇸 <i>No hay ... aquí.</i>")
        acc_neg_flags = add_flags(acc_neg).replace("<br/>", "<br/>").replace(" <br/> ", "<br/>")
        
        # Build the new row
        new_row = f'''{indent}<tr>
{indent}  <td data-label="Substantiv">{noun} <br/> {emoji}</td>
{indent}  <td data-label="Aussprache Englisch Spanisch">🇩🇪 {pronunciation} <br/> 🇬🇧 <i>{english}</i> <br/> 🇪🇸 <i>{spanish}</i></td>
{indent}  <td data-label="Beispielsatz">{add_flags(example1)}</td>
{indent}  <td data-label="Beispielsatz">{add_flags(example2)}</td>
{indent}  <td data-label="Definiter Artikel (Nominativ)">{nom_def_flags}</td>
{indent}  <td data-label="Definiter Artikel (Akkusativ)">{acc_def_flags}</td>
{indent}  <td data-label="Indefiniter Artikel (Nominativ)">{nom_indef_flags}</td>
{indent}  <td data-label="Indefiniter Artikel (Akkusativ)">{acc_indef_flags}</td>
{indent}  <td data-label="Negation (Nominativ)">{nom_neg_flags}</td>
{indent}  <td data-label="Negation (Akkusativ)">{acc_neg_flags}</td>
{indent}</tr>'''
        
        return new_row
    
    return re.sub(pattern, replace_match, content, flags=re.MULTILINE | re.DOTALL)

def main():
    file_path = r"C:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\einkaufsvokabular.html"
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Transform the content
    transformed_content = transform_table_row(content)
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(transformed_content)
    
    print("Table transformation completed!")

if __name__ == "__main__":
    main()