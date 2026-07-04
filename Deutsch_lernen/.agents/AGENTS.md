# Antigravity Rules

## Cache Invalidation & Index Updates
- **Rule**: Whenever any changes are made to the codebase (HTML, CSS, JS, or JSON data files), you **MUST** always regenerate the `verbs_index.json` metadata index file to update the `lastUpdated` variable (using `node update_index.js`).
- This is critical because the browser relies on the `lastUpdated` variable to detect version updates and clear/hydrate its localStorage caches automatically.
