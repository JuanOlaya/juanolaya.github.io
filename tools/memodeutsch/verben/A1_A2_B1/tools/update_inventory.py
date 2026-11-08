import os
import json
import datetime
from pathlib import Path

# Absolute path based on user environment
BASE_DIR = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1"
GROUPS_DIR = os.path.join(BASE_DIR, "json", "groups")
INVENTORY_FILE = os.path.join(BASE_DIR, "VERB_INVENTORY.md")

LEVELS = ["A1_1", "A1_2", "A2_1", "A2_2", "B1_1"]
LEVEL_DISPLAY = {
    "A1_1": "A1.1",
    "A1_2": "A1.2",
    "A2_1": "A2.1",
    "A2_2": "A2.2",
    "B1_1": "B1.1"
}

def get_group_number(filename):
    # filename example: A1_1_group_6.json
    try:
        base = os.path.splitext(filename)[0]
        parts = base.split('_')
        return int(parts[-1])
    except:
        return 999

def main():
    report_lines = []
    report_lines.append("# Complete Verb Inventory by Level and Group\n")
    report_lines.append(f"**Generated:** {datetime.date.today().isoformat()}")
    
    total_groups = 0
    total_verbs = 0
    
    level_stats = [] # (level_name, group_count, verb_count)
    
    content_blocks = []

    for level in LEVELS:
        level_path = os.path.join(GROUPS_DIR, level)
        if not os.path.exists(level_path):
            continue
            
        files = [f for f in os.listdir(level_path) if f.endswith('.json')]
        files.sort(key=get_group_number)
        
        level_verb_count = 0
        level_groups = []
        
        for f in files:
            file_path = os.path.join(level_path, f)
            try:
                with open(file_path, 'r', encoding='utf-8') as jf:
                    data = json.load(jf)
                    
                group_num = get_group_number(f)
                german_name = data.get("germanName", "Unknown")
                short_name = data.get("shortName", "Unknown")
                verbs = data.get("verbs", [])
                
                level_verb_count += len(verbs)
                level_groups.append({
                    "num": group_num,
                    "name": f"{german_name} / {short_name}",
                    "verbs": verbs
                })
            except Exception as e:
                print(f"Error reading {file_path}: {e}")
            
        total_groups += len(level_groups)
        total_verbs += level_verb_count
        
        level_stats.append({
            "level": LEVEL_DISPLAY[level],
            "groups": len(level_groups),
            "verbs": level_verb_count
        })
        
        # Build block for this level
        block = []
        block.append(f"## {LEVEL_DISPLAY[level]} - {len(level_groups)} Groups, {level_verb_count} Verbs\n")
        
        for g in level_groups:
            verb_list = ", ".join(g["verbs"])
            block.append(f"### Group {g['num']}: {g['name']} ({len(g['verbs'])} verbs)")
            block.append(f"{verb_list}\n")
            
        content_blocks.append("\n".join(block))
        
    # We need to construct the header after calculating totals, but in list logic we append it early.
    # Actually, we can just insert the totals lines after the header.
    
    # Header modification
    report_lines.append(f"**Total Groups:** {total_groups}")
    report_lines.append(f"**Total Verbs:** {total_verbs}\n")
    report_lines.append("---\n")
    
    # Add blocks
    for block in content_blocks:
        report_lines.append(block)
        report_lines.append("---\n")
        
    # Add summary table
    report_lines.append("## Summary Statistics\n")
    report_lines.append("| Level | Groups | Verbs | Avg Verbs/Group |")
    report_lines.append("|-------|--------|-------|-----------------|")
    
    for stat in level_stats:
        avg = round(stat["verbs"] / stat["groups"], 1) if stat["groups"] > 0 else 0
        report_lines.append(f"| {stat['level']}  | {stat['groups']}     | {stat['verbs']}    | {avg}             |")
        
    total_avg = round(total_verbs / total_groups, 1) if total_groups > 0 else 0
    report_lines.append(f"| **Total** | **{total_groups}** | **{total_verbs}** | **{total_avg}** |")
    report_lines.append("\n---\n")
    report_lines.append(f"*This inventory reflects the current state of verb groups as of {datetime.date.today().isoformat()}*")

    with open(INVENTORY_FILE, 'w', encoding='utf-8') as f:
        f.write("\n".join(report_lines))
        
    print(f"Inventory updated {INVENTORY_FILE}")
    print(f"Total Verbs: {total_verbs}")
    print(f"Total Groups: {total_groups}")
    # Print stats to verify for user
    for stat in level_stats:
        print(f"{stat['level']}: {stat['verbs']} verbs")

if __name__ == "__main__":
    main()
