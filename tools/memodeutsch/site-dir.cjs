const path = require('node:path');

// Tools mirror the Deutsch_lernen/ layout, so the data a tool used to sit next to lives at the same
// relative path under Deutsch_lernen/.
const TOOLS_ROOT = __dirname;
const SITE_ROOT = path.resolve(__dirname, '..', '..', 'Deutsch_lernen');

function siteDirFor(toolDir) {
  return path.join(SITE_ROOT, path.relative(TOOLS_ROOT, toolDir));
}

module.exports = siteDirFor;
