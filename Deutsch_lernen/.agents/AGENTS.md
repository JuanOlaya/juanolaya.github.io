# Antigravity Rules

## Cache Invalidation & Index Updates
- **Rule**: Whenever any changes are made to the codebase (HTML, CSS, JS, or JSON data files), you **MUST** always regenerate the `verbs_index.json` metadata index file to update the `lastUpdated` variable (using `node update_index.js`).
- This is critical because the browser relies on the `lastUpdated` variable to detect version updates and clear/hydrate its localStorage caches automatically.

## Git Version Control & Deployment
- **Rule**: After completing any task, regenerating the metadata index, and verifying everything is functional, you **MUST** stage the changes, commit them with a descriptive message, and push them to the GitHub remote repository (`git push origin master`).
- **Rule**: In your final response message, after presenting the index update console logs, you **MUST** always provide the following link to monitor the build status: https://github.com/JuanOlaya/juanolaya.github.io/actions/

