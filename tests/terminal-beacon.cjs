// Run: node tests/terminal-beacon.cjs
// Transpile the pure helpers in memory; no additional test dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
      fileName: filename,
    });
    module._compile(compiled.outputText, filename);
  };
}
const { firstCsvCell } = require('../src/components/StudioBeacon.tsx');
const { findProjects } = require('../src/data/terminalCatalog.ts');
assert.equal(firstCsvCell('Simple message,ignored\r\nnext row'), 'Simple message');
assert.equal(firstCsvCell('\uFEFF"A comma, and a ""quote""",ignored'), 'A comma, and a "quote"');
assert.equal(firstCsvCell('"Line one\nLine two",ignored'), 'Line one\nLine two');
assert.equal(firstCsvCell(''), '');
assert.throws(() => firstCsvCell('"unclosed message'), /Incomplete/);
assert.equal(findProjects('INFINITE-DRAFTING')[0].id, 'infinite-drafting');
assert.equal(findProjects('audio').length, 1);
assert.equal(findProjects('audio')[0].id, 'andysaudiolooper');
assert.ok(findProjects('factor').length > 1, 'Ambiguous terms must not select one app');
assert.equal(findProjects('no-such-project-123').length, 0);
assert.equal(findProjects('infinite-drafting')[0].url, undefined, 'Unreleased app must not launch');
console.log('11 Beacon CSV and project-resolution checks passed.');
