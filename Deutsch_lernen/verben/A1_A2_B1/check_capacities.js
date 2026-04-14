const f = require('./json/verbs_index.json');
const getGroups = level => f.groups.filter(g => g.level === level).map(g => `${g.groupNameGerman} (${g.verbs.length})`).join(', ');
console.log('A1.1:', getGroups('A1.1'));
console.log('A1.2:', getGroups('A1.2'));
console.log('A2.1:', getGroups('A2.1'));
console.log('A2.2:', getGroups('A2.2'));
