import json
import os
import glob

# Load the combined verb data directly from the file
output_file_path = "C:\\Users\\juan\\Documents\\GitHub\\juanolaya.github.io\\Deutsch_lernen\\verben\\all_verbs_data_parsed.json"
with open(output_file_path, 'r', encoding='utf-8') as f:
    all_verbs_data = json.load(f)

cards_dir = "C:\\Users\\juan\\Documents\\GitHub\\juanolaya.github.io\\Deutsch_lernen\\verben\\A1\\json\\cards\\"
praesens_dir = "C:\\Users\\juan\\Documents\\GitHub\\juanolaya.github.io\\Deutsch_lernen\\verben\\A1\\json\\praesens\\"

# Ensure praesens directory exists
os.makedirs(praesens_dir, exist_ok=True)

# Get all cards JSON files
cards_files = glob.glob(os.path.join(cards_dir, "*.json"))

for card_file_path in cards_files:
    verb_name = os.path.basename(card_file_path).replace(".json", "")
    
    if verb_name in all_verbs_data:
        verb_info = all_verbs_data[verb_name]
        level = verb_info.get("level")
        vokalwechsel = None
        if "vokalwechsel" in verb_info and verb_info["vokalwechsel"] is not None:
            vokalwechsel = verb_info["vokalwechsel"]

        # --- Process cards JSON file ---
        with open(card_file_path, 'r+', encoding='utf-8') as f:
            cards_content = json.load(f)
            
            # Add 'verb' and 'level' as the first two attributes
            new_cards_content = {"verb": verb_name}
            if level:
                new_cards_content["level"] = level
            
            # Copy existing attributes, excluding old 'vokalwechsel' and 'irregularPraesens' if they exist
            for key, value in cards_content.items():
                if key not in ["verb", "level", "vokalwechsel", "irregularPraesens"]:
                    new_cards_content[key] = value
            
            # Set irregularPraesens if vokalwechsel exists
            if vokalwechsel:
                new_cards_content["irregularPraesens"] = True
            elif "irregularPraesens" in cards_content:
                new_cards_content["irregularPraesens"] = cards_content["irregularPraesens"]

            f.seek(0) # Rewind to the beginning of the file
            json.dump(new_cards_content, f, ensure_ascii=False, indent=4)
            f.truncate() # Remove remaining part

        # --- Process praesens JSON file ---
        praesens_file_path = os.path.join(praesens_dir, f"{verb_name}.json")
        praesens_content = {}

        if os.path.exists(praesens_file_path):
            with open(praesens_file_path, 'r', encoding='utf-8') as f:
                praesens_content = json.load(f)
        
        if vokalwechsel:
            praesens_content["vokalwechsel"] = vokalwechsel
        
        # Add praesens conjugation if available in all_verbs_data
        if "praesens" in verb_info:
            praesens_content["praesens"] = verb_info["praesens"]
        if "praesens_examples" in verb_info:
            praesens_content["praesens_examples"] = verb_info["praesens_examples"]

        with open(praesens_file_path, 'w', encoding='utf-8') as f:
            json.dump(praesens_content, f, ensure_ascii=False, indent=4)

print("All verb JSON files updated successfully!")
