import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const elements = [];
class AudioMock {
  paused = true;
  volume = 1;
  constructor() { elements.push(this); }
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
}
const gains = [];
class ContextMock {
  state = 'running'; currentTime = 0; destination = {};
  createGain() {
    const gain = { value: 1, cancelScheduledValues() {}, setTargetAtTime(value) { this.value = value; } };
    gains.push(gain);
    return { gain, connect() {} };
  }
  close() { this.state = 'closed'; return Promise.resolve(); }
  createDynamicsCompressor() { return { threshold: {}, ratio: {}, connect() {} }; }
}
globalThis.Audio = AudioMock;
globalThis.window = { AudioContext: ContextMock };
const source = fs.readFileSync(new URL('../src/utils/audio.ts', import.meta.url), 'utf8')
  .replace(/import\.meta\.glob\([^;]+\)/, "({'/public/assets/music/test.ogg': ''})");
const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { audio } = await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
audio.setMusicDucked(true);
assert.equal(elements.length, 0, 'ducking must not start music');
audio.toggleMusic(true);
assert.equal(elements.at(-1).paused, true, 'music enabled during video stays paused');
assert.equal(gains[2].value, 0, 'procedural music has an independent duck gain');
audio.nextTrack();
assert.equal(elements.at(-1).paused, true, 'track changes preserve pause');
audio.setMusicDucked(false);
assert.equal(elements.at(-1).volume, 0.4);
assert.equal(gains[2].value, 1);
audio.setMusicDucked(true);
audio.toggleMusic(false);
audio.setMusicDucked(false);
assert.equal(elements.at(-1).paused, true, 'restoring volume must respect music turned off');
audio.toggleMusic(true);
const count = elements.length;
audio.toggleMusic(true);
assert.equal(elements.length, count, 'repeated enable must not create overlapping tracks');
audio.setMusicDucked(true);
audio.setMusicDucked(false);
assert.equal(elements.length, count, 'video completion resumes the same track');
assert.equal(elements.at(-1).paused, false);
audio.dispose();
assert.ok(elements.every(e => e.paused), 'disposing engine stops every old file player');
console.log('Video pause/resume, user mute, duplicate enable, track changes and hot-reload cleanup passed.');
