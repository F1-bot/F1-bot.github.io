// Pre-compile JSX → JS via Babel CLI, then wrap each output in an IIFE so
// top-level `const { useState, useEffect } = React;` declarations don't
// collide between files in the global script scope. Components/data are
// still exposed via `Object.assign(window, ...)` at the end of each source.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

execSync(
  'npx babel data.jsx thumbs.jsx sections.jsx app.jsx --out-dir dist --presets @babel/preset-react',
  { stdio: 'inherit' }
);

for (const name of ['data', 'thumbs', 'sections', 'app']) {
  const file = path.join('dist', `${name}.js`);
  const code = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, `(function () {\n${code}\n})();\n`);
  console.log(`Wrapped ${file}`);
}
