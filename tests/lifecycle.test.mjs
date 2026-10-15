import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Window } from 'happy-dom';

const companionUrl = new URL('../packages/companion/dist/pumpkin-hollow-companion.js', import.meta.url);
const companionSource = await readFile(companionUrl, 'utf8');
const moduleDirectory = await mkdtemp(join(tmpdir(), 'pumpkin-hollow-test-'));
const testWindow = new Window({ url: 'http://localhost/' });
const testDocument = testWindow.document;
const savedGlobalDescriptors = new Map();
const browserGlobals = [
  'window', 'document', 'Element', 'MutationObserver', 'getComputedStyle', 'clearInterval',
];

// Run the real module against Happy DOM, then restore Node's original globals.
for (const key of browserGlobals) {
  savedGlobalDescriptors.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
  const value = ['getComputedStyle', 'clearInterval'].includes(key)
    ? testWindow[key].bind(testWindow)
    : testWindow[key];
  Object.defineProperty(globalThis, key, { configurable: true, value });
}

let nextModuleId = 0;
const startedCompanions = new Set();

async function loadCompanionBuild(version = '2026.10.15.2') {
  // ES modules are cached by URL. A fresh file reruns the real startup code.
  // Overriding only VERSION exercises build takeover without runtime test hooks.
  const filename = join(moduleDirectory, `companion-${nextModuleId++}.mjs`);
  const buildSource = companionSource.replace(/const VERSION = '[^']+';/, `const VERSION = '${version}';`);
  await writeFile(filename, buildSource);
  const companion = await import(pathToFileURL(filename).href);
  if (testWindow.__pumpkinHollowCompanion) {
    startedCompanions.add(testWindow.__pumpkinHollowCompanion);
  }
  return companion;
}

function waitForDomUpdates() {
  return new Promise(resolve => setTimeout(resolve, 15));
}

function findShadowStyle(root) {
  return root.querySelector('#pumpkin-hollow-shadow-style');
}

function createHeadingCard() {
  const host = testDocument.createElement('hui-heading-card');
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = '<div class="content title"><h2 class="heading">Seasonal heading</h2></div>';
  testDocument.body.append(host);
  return host;
}

test.after(async () => {
  testWindow.__pumpkinHollowCompanion?.stop();
  await testWindow.happyDOM.close();
  for (const [key, descriptor] of savedGlobalDescriptors) {
    if (descriptor) {
      Object.defineProperty(globalThis, key, descriptor);
    } else {
      delete globalThis[key];
    }
  }
  await rm(moduleDirectory, { recursive: true, force: true });
});

test.beforeEach(() => {
  testWindow.__pumpkinHollowCompanion?.stop();
  testDocument.body.replaceChildren();
  testDocument.documentElement.style.setProperty('--pumpkin-hollow-active', '1');
});

test.afterEach(() => {
  // A failed takeover assertion must not leave an earlier build running.
  for (const owner of startedCompanions) {
    owner.stop();
  }
  startedCompanions.clear();
  delete testDocument.hidden;
});

test('removing a dashboard releases its styles and owned decorations', async () => {
  const companion = await loadCompanionBuild();
  const heading = createHeadingCard();
  await waitForDomUpdates();
  assert.ok(findShadowStyle(heading.shadowRoot));
  heading.remove();
  await waitForDomUpdates();
  assert.ok(!findShadowStyle(heading.shadowRoot), 'detached card retains stylesheet');
  assert.equal(heading.hasAttribute('data-pumpkin-motif'), false, 'detached card retains decoration');
  testDocument.body.append(heading);
  await waitForDomUpdates();
  assert.ok(findShadowStyle(heading.shadowRoot), 'reconnected card was not discovered');
  companion.unmount();
});

test('theme removal restores an existing decoration attribute', async () => {
  const heading = createHeadingCard();
  heading.setAttribute('data-pumpkin-motif', 'original-value');
  const companion = await loadCompanionBuild();
  companion.unmount();
  assert.equal(heading.getAttribute('data-pumpkin-motif'), 'original-value');
});

test('the companion recovers a stylesheet removed during a component render', async () => {
  await loadCompanionBuild();
  const heading = createHeadingCard();
  await waitForDomUpdates();
  findShadowStyle(heading.shadowRoot).remove();
  await waitForDomUpdates();
  assert.ok(findShadowStyle(heading.shadowRoot), 'removed stylesheet was never restored');
});

test('a serialized clone of an owned stylesheet is removed when changing theme', async () => {
  const companion = await loadCompanionBuild();
  const heading = createHeadingCard();
  await waitForDomUpdates();
  heading.shadowRoot.innerHTML += '<span>Component rerender</span>';
  await waitForDomUpdates();
  companion.unmount();
  assert.ok(!findShadowStyle(heading.shadowRoot), 'a cloned seasonal stylesheet survived theme removal');
});

test('a saved stop handle cannot delete the replacement module owner', async () => {
  await loadCompanionBuild('2026.10.15.1');
  const previousCompanion = testWindow.__pumpkinHollowCompanion;
  await loadCompanionBuild('2026.10.15.2');
  const currentCompanion = testWindow.__pumpkinHollowCompanion;
  previousCompanion.stop();
  assert.equal(testWindow.__pumpkinHollowCompanion, currentCompanion);
});

test('a late older module cannot downgrade the current companion', async () => {
  await loadCompanionBuild('2026.10.15.10');
  const currentCompanion = testWindow.__pumpkinHollowCompanion;
  await loadCompanionBuild('2026.10.15.2');
  assert.equal(testWindow.__pumpkinHollowCompanion, currentCompanion);
});

test('theme changes activate through the Home Assistant inline theme variables', async () => {
  testDocument.documentElement.style.removeProperty('--pumpkin-hollow-active');
  await loadCompanionBuild();
  const heading = createHeadingCard();
  await waitForDomUpdates();
  assert.ok(!findShadowStyle(heading.shadowRoot));
  testDocument.documentElement.style.setProperty('--pumpkin-hollow-active', '1');
  await waitForDomUpdates();
  assert.ok(findShadowStyle(heading.shadowRoot), 'theme application waited for a global poll');
  testDocument.documentElement.style.removeProperty('--pumpkin-hollow-active');
  await waitForDomUpdates();
  assert.ok(!findShadowStyle(heading.shadowRoot));
});

test('repeated route churn leaves no detached roots or decoration records', async () => {
  const companion = await loadCompanionBuild();
  for (let i = 0; i < 50; i++) {
    const heading = createHeadingCard();
    await waitForDomUpdates();
    heading.remove();
    await waitForDomUpdates();
  }
  const diagnostics = companion.getDiagnostics();
  assert.equal(diagnostics.roots, 1, 'only the document observer should remain');
  assert.equal(diagnostics.styles, 1, 'only the document stylesheet should remain');
  assert.equal(diagnostics.decoratedHosts, 0);
  assert.equal(diagnostics.pendingHosts, 0);
  assert.equal(diagnostics.recoveryScheduled, false);
});

test('same-version duplicates preserve the owner and existing styles', async () => {
  const heading = createHeadingCard();
  await loadCompanionBuild();
  const owner = testWindow.__pumpkinHollowCompanion;
  const style = findShadowStyle(heading.shadowRoot);
  await loadCompanionBuild();
  assert.ok(testWindow.__pumpkinHollowCompanion === owner);
  assert.ok(findShadowStyle(heading.shadowRoot) === style);
  assert.equal(heading.shadowRoot.querySelectorAll('style').length, 1);
});

test('hidden documents pause discovery and reconcile newly added cards on return', async () => {
  let hidden = false;
  Object.defineProperty(testDocument, 'hidden', { configurable: true, get: () => hidden });
  const companion = await loadCompanionBuild();
  const waitingHost = testDocument.createElement('ph-waiting-root');
  testDocument.body.append(waitingHost);
  await waitForDomUpdates();
  hidden = true;
  testDocument.dispatchEvent(new testWindow.Event('visibilitychange'));
  const heading = createHeadingCard();
  await waitForDomUpdates();
  assert.ok(!findShadowStyle(heading.shadowRoot), 'background document continued scanning');
  assert.equal(companion.getDiagnostics().recoveryScheduled, false);
  hidden = false;
  testDocument.dispatchEvent(new testWindow.Event('visibilitychange'));
  await waitForDomUpdates();
  assert.ok(findShadowStyle(heading.shadowRoot));
});

test('page cache suspension resumes without leaving stale styles', async () => {
  const companion = await loadCompanionBuild();
  testWindow.dispatchEvent(new testWindow.Event('pagehide'));
  const heading = createHeadingCard();
  await waitForDomUpdates();
  assert.ok(!findShadowStyle(heading.shadowRoot), 'page cache continued scanning');
  testWindow.dispatchEvent(new testWindow.Event('pageshow'));
  await waitForDomUpdates();
  assert.ok(findShadowStyle(heading.shadowRoot));
  assert.equal(companion.getDiagnostics().suspended, false);
});

test('text-only state updates do not rescan component subtrees', async () => {
  const companion = await loadCompanionBuild();
  const heading = createHeadingCard();
  await waitForDomUpdates();
  const visited = companion.getDiagnostics().visitedElements;
  for (let i = 0; i < 100; i++) {
    heading.shadowRoot.querySelector('h2').textContent = `State ${i}`;
  }
  await waitForDomUpdates();
  assert.equal(companion.getDiagnostics().visitedElements, visited);
});
