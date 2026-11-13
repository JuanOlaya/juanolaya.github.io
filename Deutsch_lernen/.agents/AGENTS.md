# Antigravity Rules

## Cache Invalidation & Index Updates
- **Rule**: Whenever any changes are made to the codebase related to the verbs module (`Deutsch_lernen/verben/A1_A2_B1/` or its JSON data files), you **MUST** always regenerate the `verbs_index.json` metadata index file to update the `lastUpdated` variable (using `node tools/memodeutsch/verben/A1_A2_B1/update_index.js` from the repository root).
- This is critical because the browser relies on the `lastUpdated` variable to detect version updates and clear/hydrate its localStorage caches automatically.

## Git Version Control & Deployment
- **Rule**: After completing any task, regenerating the metadata index, and verifying everything is functional, you **MUST** stage the changes, commit them with a descriptive message, and push them to the GitHub remote repository (`git push origin master`).
- **Rule**: In your final response message, after presenting the index update console logs, you **MUST** always provide the following link to monitor the build status: https://github.com/JuanOlaya/juanolaya.github.io/actions/

## Permanent Home Page Project Exclusions
- **Rule**: You **MUST NEVER** add or link the following projects to the main home page (`src/home/projectPages.ts`, `src/home/projects.ts` or `index.html`):
  1. **MemoDeutsch** (`/Deutsch_lernen/`)
  2. **UX Infographics** (`/UX/`)
  3. **Project Management** (`/Project_Management/`)
  4. **ShapyPresence** (`/EurekaWall/pixelGrid/` or `/PixelGrid/`)
  5. **HCI BHT** (`/HCI_BHT_Website/`)
  These 5 projects are explicitly and permanently excluded from the public landing showcase by owner decision.

