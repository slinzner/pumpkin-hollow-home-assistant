/** Pumpkin Hollow's optional visual layer. No entity or dashboard writes. */
const VERSION = '2026.10.15.2';
const ASSETS = new URL('./assets/', import.meta.url).href.replace(/\/$/, '');
const ROOT_ID = 'pumpkin-hollow-root-style';
const SHADOW_ID = 'pumpkin-hollow-shadow-style';
const ACCENT = '#FF9B32';
const GOLD = '#FFD56A';
const PLUM = '#38283A';
const IVORY = '#FFF4DF';
const MOTIFS = ['spider', 'bat', 'ghost', 'cat', 'owl', 'moth', 'pumpkin', 'leaf'];
const NAV_MOTIFS = ['pumpkin', 'bat', 'ghost', 'owl', 'cat', 'moth', 'spider', 'leaf'];

/** @param {Pick<CSSStyleDeclaration, 'getPropertyValue'>} style */
export function themeIsActive(style) {
  return style.getPropertyValue('--pumpkin-hollow-active').trim() === '1';
}

function themedTokens() {
  return `
    --md-sys-color-primary: ${ACCENT} !important;
    --md-sys-color-on-primary: #281821 !important;
    --md-sys-color-primary-container: #754429 !important;
    --md-sys-color-on-primary-container: ${IVORY} !important;
    --md-sys-color-secondary: #78C8CE !important;
    --md-sys-color-on-secondary: #1C2831 !important;
    --md-sys-color-surface: #241B2B !important;
    --md-sys-color-surface-container: ${PLUM} !important;
    --md-sys-color-surface-container-low: #302337 !important;
    --md-sys-color-surface-container-high: #49334A !important;
    --md-sys-color-surface-container-highest: #59405A !important;
    --md-sys-color-on-surface: ${IVORY} !important;
    --md-sys-color-on-surface-variant: #D8C9D4 !important;
    --md-sys-color-outline: #B88C8B !important;
    --md-sys-color-outline-variant: #936A69 !important;
    --md-sys-color-error: #ED8DAF !important;
    --md-sys-color-on-error: #281821 !important;
    --card-background-color: ${PLUM} !important;
    --primary-text-color: ${IVORY} !important;
    --secondary-text-color: #D8C9D4 !important;
    --primary-color: ${ACCENT} !important;
    --accent-color: ${GOLD} !important;
  `;
}

export function rootCss(base = ASSETS) {
  return `
    @font-face { font-family: 'Pumpkin Hollow Creepster'; src: url('${base}/Creepster-Regular.ttf') format('truetype'); font-display: swap; }
    :root, html, body, home-assistant { ${themedTokens()} }
    html { --lovelace-background: linear-gradient(90deg, rgba(32,20,38,.65), rgba(32,20,38,.27)), url('${base}/haunted-lake-desktop.webp') center center / cover fixed !important; }
    body { min-height: 100vh; background: linear-gradient(90deg, rgba(32,20,38,.70), rgba(32,20,38,.45)),
      url('${base}/haunted-lake-desktop.webp') center center / cover fixed !important; background-color: #241B2B !important; }
    @media (max-width: 700px) {
      html { --lovelace-background: linear-gradient(90deg, rgba(32,20,38,.66), rgba(32,20,38,.35)), url('${base}/haunted-lake-mobile.webp') 66% center / cover fixed !important; }
      body { background-image: linear-gradient(90deg, rgba(32,20,38,.72), rgba(32,20,38,.52)), url('${base}/haunted-lake-mobile.webp') !important; background-position: 66% center !important; }
    }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
  `;
}

/** @param {string} tagName */
export function shadowCss(tagName, base = ASSETS) {
  const tag = String(tagName).toUpperCase();
  const common = `:host { ${themedTokens()} }`;
  if (tag === 'HA-SIDEBAR') {
    return `${common}
      :host { background-color: #2D2133 !important; }
      .menu .title { font-family: 'Pumpkin Hollow Creepster', Georgia, serif !important;
        font-size: 21px !important; letter-spacing: .04em; color: ${GOLD} !important; }
    `;
  }
  if (tag === 'HA-LIST-ITEM-BUTTON') {
    return `${common}
      :host([data-pumpkin-nav]) [part="start"] { position: relative; }
      :host([data-pumpkin-nav]) [part="start"] slot { opacity: 0; }
      :host([data-pumpkin-nav]) [part="start"]::after {
        content: ''; position: absolute; inset: 0; width: 24px; height: 24px;
        background: url('${base}/pumpkin.svg') center / contain no-repeat;
        pointer-events: none; filter: drop-shadow(0 1px 2px rgba(14,6,18,.7));
      }
      ${NAV_MOTIFS.slice(1).map(m => `:host([data-pumpkin-nav="${m}"]) [part="start"]::after { background-image: url('${base}/${m}.svg'); }`).join('\n')}
      :host(.selected[data-pumpkin-nav]) [part="base"] {
        background-color: rgba(255,155,50,.2) !important;
        box-shadow: inset 3px 0 ${ACCENT}; border-radius: 10px;
      }
    `;
  }
  if (tag === 'HA-CARD') {
    return `${common}
      :host { --ha-card-background: ${PLUM} !important; --card-background-color: ${PLUM} !important;
        background: ${PLUM} !important; color: ${IVORY} !important;
        border: 1px solid #936A69 !important; border-radius: 18px !important;
        box-shadow: 0 10px 28px rgba(14,6,18,.33) !important; }
      .card-header { color: ${GOLD} !important; }
    `;
  }
  if (tag === 'MUSHROOM-SLIDER') {
    return `${common}
      :host .slider-track-background { background-color: #725D75 !important; }
      :host .slider-track-active::after {
        content: ''; position: absolute; top: 50%; right: 3px; width: 24px; height: 24px;
        transform: translateY(-50%); display: block;
        background: url('${base}/spider.svg') center / contain no-repeat !important;
        pointer-events: none !important; opacity: .9 !important;
        filter: drop-shadow(0 2px 2px rgba(14,6,18,.8));
      }
      ${MOTIFS.slice(1).map(m => `:host([data-pumpkin-motif="${m}"]) .slider-track-active::after { background-image: url('${base}/${m}.svg') !important; }`).join('\n')}
      :host .slider:focus-visible { outline: 2px solid ${GOLD} !important; outline-offset: 3px; }
    `;
  }
  if (tag === 'MUSHROOM-LIGHT-COLOR-CONTROL') {
    return `${common}
      :host mushroom-slider { border-radius: 12px; outline: 1px solid ${GOLD};
        outline-offset: 2px; box-shadow: 0 0 0 3px rgba(255,155,50,.15); }
    `;
  }
  if (tag === 'HA-SLIDER' || tag === 'HA-CONTROL-SLIDER') {
    return `${common}
      :host { --ha-slider-track-active-color: ${ACCENT} !important; --ha-slider-thumb-color: ${GOLD} !important; }
      [part="handle"]::after, [part="thumb"]::after, #handle::after, .handle::after, .thumb::after {
        content: ''; width: 22px; height: 22px; display: block;
        background: url('${base}/spider.svg') center / contain no-repeat;
        pointer-events: none !important; }
      :host([data-pumpkin-motif="bat"]) [part="handle"]::after,
      :host([data-pumpkin-motif="bat"]) .handle::after { background-image: url('${base}/bat.svg'); }
      :host([data-pumpkin-motif="ghost"]) [part="handle"]::after,
      :host([data-pumpkin-motif="ghost"]) .handle::after { background-image: url('${base}/ghost.svg'); }
    `;
  }
  if (tag === 'HUI-VIEW-BACKGROUND') {
    return `${common} :host { background: none !important; }`;
  }
  if (tag === 'HUI-HEADING-CARD') {
    return `${common}
      :host .content.title { position: relative; padding-right: 34px; }
      :host .content.title p, :host .content.title .heading { font-family: 'Pumpkin Hollow Creepster', Georgia, serif !important;
        font-size: 20px !important; letter-spacing: .035em; color: ${GOLD} !important; }
      :host .content.title::after { content: ''; position: absolute; right: 9px; top: 50%;
        width: 22px; height: 22px; transform: translateY(-50%);
        background: url('${base}/moth.svg') center / contain no-repeat; opacity: .75; pointer-events: none; }
      ${MOTIFS.map(m => `:host([data-pumpkin-motif="${m}"]) .content.title::after { background-image: url('${base}/${m}.svg'); }`).join('\n')}
    `;
  }
  if (tag === 'HA-PANEL-LOVELACE') {
    return `${common}
      :host { display: block !important; min-height: 100vh;
        background: linear-gradient(90deg, rgba(32,20,38,.48), rgba(32,20,38,.24)),
        url('${base}/haunted-lake-desktop.webp') center center / cover fixed !important; }
      @media (max-width: 700px) { :host { background-image: linear-gradient(90deg, rgba(32,20,38,.58), rgba(32,20,38,.32)), url('${base}/haunted-lake-mobile.webp') !important; } }
    `;
  }
  if (tag === 'HASS-TABS-SUBPAGE') {
    return `${common}
      :host { background: linear-gradient(90deg, rgba(32,20,38,.83), rgba(32,20,38,.58)),
        url('${base}/haunted-lake-desktop.webp') center center / cover fixed !important; }
      h1, h2, .page-title { font-family: 'Pumpkin Hollow Creepster', Georgia, serif !important; color: ${GOLD} !important; letter-spacing: .015em; }
    `;
  }
  return `${common}
    h1, h2, .section-title { font-family: 'Pumpkin Hollow Creepster', Georgia, serif !important; color: ${GOLD} !important; }
    button:focus-visible, a:focus-visible, [role="button"]:focus-visible { outline: 2px solid ${GOLD} !important; outline-offset: 2px; }
  `;
}

// Runtime state

/** @typedef {Document | ShadowRoot} StyleRoot */
/** @typedef {{name: string, previous: string | null, value: string}} Decoration */
/** @typedef {{version: string, stop: () => void, diagnostics?: typeof getDiagnostics}} CompanionHandle */

// Observe wrapper roots too, but install styles only in these components.
const STYLED_COMPONENT_TAGS = new Set([
  'HA-SIDEBAR', 'HA-LIST-ITEM-BUTTON', 'HA-CARD', 'HA-SLIDER',
  'HA-CONTROL-SLIDER', 'MUSHROOM-SLIDER', 'MUSHROOM-LIGHT-COLOR-CONTROL',
  'HA-PANEL-LOVELACE', 'HUI-VIEW-BACKGROUND', 'HUI-HEADING-CARD', 'HASS-TABS-SUBPAGE',
]);
const SHADOW_ROOT_RETRY_MS = 800;

// Keep ownership records so removal and theme changes can undo only our work.
/** @type {Map<StyleRoot, HTMLStyleElement>} */
const ownedStyles = new Map();
/** @type {Map<StyleRoot, MutationObserver>} */
const rootObservers = new Map();
/** @type {Set<Element>} */
const pendingShadowHosts = new Set();
/** @type {Map<Element, Decoration[]>} */
const decoratedHosts = new Map();
/** @type {Map<string, string>} */
const cssCache = new Map();

/** @type {Set<Element>} */
const pendingSubtrees = new Set();
/** @type {Set<StyleRoot>} */
const rootsNeedingStyles = new Set();
let hasRemovedElements = false;
let flushQueued = false;
let discoveryGeneration = 0;

/** @type {Document | undefined} */
let activeDocument;
/** @type {number | undefined} */
let recoveryTimer;
let mounted = false;
let suspended = false;
let motifIndex = 0;
let navigationMotifIndex = 0;
let discoveryBatches = 0;
let visitedElements = 0;

/** Only anonymous counts are exposed for support and performance inspection. */
export function getDiagnostics() {
  return Object.freeze({
    version: VERSION,
    mounted,
    suspended,
    roots: rootObservers.size,
    styles: ownedStyles.size,
    decoratedHosts: decoratedHosts.size,
    pendingHosts: pendingShadowHosts.size,
    recoveryScheduled: recoveryTimer !== undefined,
    queuedElements: pendingSubtrees.size,
    discoveryBatches,
    visitedElements,
  });
}

// Stylesheet and decoration ownership

/** @param {StyleRoot} root */
function ensureStylesheet(root) {
  const isDocument = !('host' in root);
  const tag = isDocument ? 'DOCUMENT' : root.host.tagName;
  if (!isDocument && !STYLED_COMPONENT_TAGS.has(tag)) {
    return;
  }

  const id = isDocument ? ROOT_ID : SHADOW_ID;
  const existing = root.querySelector(`#${id}`);
  if (existing) {
    // Some card renderers serialize their shadow markup, cloning our style.
    // Adopt only a marked clone of a style this instance already owns.
    if (ownedStyles.has(root) && existing.tagName === 'STYLE' &&
        existing.getAttribute('data-pumpkin-hollow-version') === VERSION) {
      ownedStyles.set(root, /** @type {HTMLStyleElement} */ (existing));
    }
    return;
  }

  if (!cssCache.has(tag)) {
    cssCache.set(tag, isDocument ? rootCss() : shadowCss(tag));
  }
  const style = ownedStyles.get(root)
    || root.ownerDocument?.createElement('style')
    || activeDocument?.createElement('style');
  if (!style) {
    return;
  }

  style.id = id;
  style.dataset.pumpkinHollowVersion = VERSION;
  style.textContent = cssCache.get(tag) || '';
  ownedStyles.set(root, style);
  const container = isDocument ? root.head || root.documentElement : root;
  container.append(style);
}

/**
 * @param {Element} host
 * @param {string} name
 * @param {string} value
 */
function setDecoration(host, name, value) {
  const decorations = decoratedHosts.get(host) || [];
  if (decorations.some(item => item.name === name)) {
    return;
  }
  decorations.push({ name, previous: host.getAttribute(name), value });
  decoratedHosts.set(host, decorations);
  host.setAttribute(name, value);
}

/** @param {Element} host */
function restoreDecorations(host) {
  for (const { name, previous, value } of decoratedHosts.get(host) || []) {
    // Leave a later change by another card or module intact.
    if (host.getAttribute(name) !== value) {
      continue;
    }
    if (previous === null) {
      host.removeAttribute(name);
    } else {
      host.setAttribute(name, previous);
    }
  }
  decoratedHosts.delete(host);
}

/** @param {StyleRoot} root */
function releaseRoot(root) {
  rootObservers.get(root)?.disconnect();
  rootObservers.delete(root);
  ownedStyles.get(root)?.remove();
  ownedStyles.delete(root);
  if ('host' in root) {
    restoreDecorations(root.host);
  }
}

function releaseDisconnectedNodes() {
  for (const root of rootObservers.keys()) {
    if ('host' in root && (!root.host.isConnected || root.host.ownerDocument !== activeDocument)) {
      releaseRoot(root);
    }
  }
  for (const host of pendingShadowHosts) {
    if (!host.isConnected || host.ownerDocument !== activeDocument) {
      pendingShadowHosts.delete(host);
    }
  }
}

// DOM discovery and batched updates

function discardQueuedDiscovery() {
  // Microtasks cannot be cancelled. A new generation makes an old flush inert.
  discoveryGeneration++;
  flushQueued = false;
  pendingSubtrees.clear();
  rootsNeedingStyles.clear();
  hasRemovedElements = false;
}

/**
 * @param {StyleRoot} root
 * @param {MutationRecord[]} mutations
 */
function handleRootMutations(root, mutations) {
  if (!mounted || suspended) {
    return;
  }

  let changed = false;
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType !== 1) {
        continue;
      }
      const element = /** @type {Element} */ (node);
      if (element.id === ROOT_ID || element.id === SHADOW_ID) {
        continue;
      }
      pendingSubtrees.add(element);
      changed = true;
    }
    for (const node of mutation.removedNodes) {
      if (node.nodeType !== 1) {
        continue;
      }
      hasRemovedElements = true;
      changed = true;
      const ownedStyle = ownedStyles.get(root);
      if (ownedStyle && node.contains(ownedStyle)) {
        rootsNeedingStyles.add(root);
      }
    }
  }

  if (!changed || flushQueued) {
    return;
  }
  flushQueued = true;
  const scheduledGeneration = discoveryGeneration;
  queueMicrotask(() => {
    if (scheduledGeneration !== discoveryGeneration) {
      return;
    }
    flushQueued = false;
    if (!mounted || suspended) {
      return;
    }
    flushDiscoveryChanges();
  });
}

function flushDiscoveryChanges() {
  discoveryBatches++;
  if (hasRemovedElements) {
    releaseDisconnectedNodes();
  }
  hasRemovedElements = false;

  // Restore only affected styles; do not query every root on every update.
  for (const root of rootsNeedingStyles) {
    if (rootObservers.has(root)) {
      ensureStylesheet(root);
    }
  }
  rootsNeedingStyles.clear();

  const addedSubtrees = new Set(pendingSubtrees);
  pendingSubtrees.clear();
  for (const element of addedSubtrees) {
    if (!element.isConnected || element.ownerDocument !== activeDocument) {
      continue;
    }

    // An added ancestor will discover its descendants in the same pass.
    let parent = element.parentElement;
    while (parent && !addedSubtrees.has(parent)) {
      parent = parent.parentElement;
    }
    if (!parent) {
      discoverSubtree(element);
    }
  }
  scheduleShadowRootRetry();
}

/** @param {StyleRoot} root */
function observeRoot(root) {
  if (rootObservers.has(root) || !activeDocument?.defaultView) {
    return;
  }

  if ('host' in root) {
    const host = root.host;
    // Sidebar navigation shares this tag with ordinary lists and menus.
    // Restrict icon replacement to direct sidebar panel entries.
    if (host.tagName === 'HA-LIST-ITEM-BUTTON' && host.id.startsWith('sidebar-panel-') &&
        /** @type {ShadowRoot} */ (host.getRootNode()).host?.tagName === 'HA-SIDEBAR') {
      setDecoration(host, 'data-pumpkin-nav', NAV_MOTIFS[navigationMotifIndex++ % NAV_MOTIFS.length]);
    }
    if (host.tagName === 'MUSHROOM-SLIDER' || host.tagName === 'HUI-HEADING-CARD') {
      setDecoration(host, 'data-pumpkin-motif', MOTIFS[motifIndex++ % MOTIFS.length]);
    }
  }

  ensureStylesheet(root);
  const observer = new activeDocument.defaultView.MutationObserver(mutations => handleRootMutations(root, mutations));
  rootObservers.set(root, observer);
  observer.observe(root, { childList: true, subtree: true });
  for (const child of root.querySelectorAll('*')) {
    discoverShadowRoot(child);
  }
}

/** @param {Element} host */
function discoverShadowRoot(host) {
  visitedElements++;
  if (host.shadowRoot) {
    pendingShadowHosts.delete(host);
    observeRoot(host.shadowRoot);
  } else if (host.localName.includes('-')) {
    // attachShadow() produces no host mutation. Retry while visible and active.
    pendingShadowHosts.add(host);
  }
}

/** @param {Element} element */
function discoverSubtree(element) {
  discoverShadowRoot(element);
  for (const child of element.querySelectorAll('*')) {
    discoverShadowRoot(child);
  }
}

function cancelShadowRootRetry() {
  if (recoveryTimer !== undefined) {
    activeDocument?.defaultView?.clearTimeout(recoveryTimer);
  }
  recoveryTimer = undefined;
}

function discoverPendingShadowRoots() {
  for (const host of pendingShadowHosts) {
    if (!host.isConnected || host.ownerDocument !== activeDocument) {
      pendingShadowHosts.delete(host);
    } else if (host.shadowRoot) {
      discoverShadowRoot(host);
    }
  }
}

function scheduleShadowRootRetry() {
  if (!pendingShadowHosts.size) {
    cancelShadowRootRetry();
  }
  if (recoveryTimer !== undefined || !mounted || suspended || activeDocument?.hidden || !pendingShadowHosts.size) {
    return;
  }

  recoveryTimer = activeDocument?.defaultView?.setTimeout(() => {
    recoveryTimer = undefined;
    if (!mounted || suspended || activeDocument?.hidden) {
      return;
    }
    discoverPendingShadowRoots();
    scheduleShadowRootRetry();
  }, SHADOW_ROOT_RETRY_MS);
}

// Theme and page lifecycle

export function mount(doc = document) {
  if (activeDocument && activeDocument !== doc) {
    unmount();
  }
  activeDocument = doc;
  if (!mounted) {
    mounted = true;
    observeRoot(doc);
  }
  discoverPendingShadowRoots();
  scheduleShadowRootRetry();
}

export function unmount() {
  mounted = false;
  discardQueuedDiscovery();
  cancelShadowRootRetry();
  for (const root of [...rootObservers.keys()]) {
    releaseRoot(root);
  }
  pendingShadowHosts.clear();
  motifIndex = 0;
  navigationMotifIndex = 0;
}

export function syncTheme(doc = document) {
  const themeStyle = doc.defaultView?.getComputedStyle(doc.documentElement) || doc.documentElement.style;
  if (themeIsActive(themeStyle)) {
    if (!doc.hidden && !suspended) {
      mount(doc);
    }
  } else {
    unmount();
  }
}

/** @param {string | undefined} existingVersion */
function shouldKeepExistingBuild(existingVersion) {
  if (!existingVersion || !/^\d+(\.\d+)*$/.test(existingVersion)) {
    return false;
  }
  const existingParts = existingVersion.split('.').map(Number);
  const incomingParts = VERSION.split('.').map(Number);
  for (let index = 0; index < Math.max(existingParts.length, incomingParts.length); index++) {
    const difference = (existingParts[index] || 0) - (incomingParts[index] || 0);
    if (difference) {
      return difference > 0;
    }
  }
  // An equal build is already running; leave its observers and styles intact.
  return true;
}

function start() {
  const registry = /** @type {Window & {__pumpkinHollowCompanion?: CompanionHandle}} */ (window);
  if (shouldKeepExistingBuild(registry.__pumpkinHollowCompanion?.version)) {
    return;
  }
  registry.__pumpkinHollowCompanion?.stop();

  const doc = document;
  activeDocument = doc;
  let stopped = false;
  const onThemeChange = () => {
    if (!stopped) {
      syncTheme(doc);
    }
  };
  const suspend = () => {
    // Keep the visible styles, but stop discovery while the page is inactive.
    suspended = true;
    discardQueuedDiscovery();
    cancelShadowRootRetry();
    for (const observer of rootObservers.values()) {
      observer.disconnect();
    }
  };
  const resume = () => {
    if (doc.hidden) {
      return;
    }
    if (suspended) {
      // Rebuild observations: components may have changed while disconnected.
      unmount();
      suspended = false;
    }
    onThemeChange();
  };
  const onVisibilityChange = () => {
    if (doc.hidden) {
      suspend();
    } else {
      resume();
    }
  };

  // Home Assistant applies theme variables through the root's inline style.
  const themeObserver = new MutationObserver(onThemeChange);
  themeObserver.observe(doc.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
  doc.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', suspend);
  window.addEventListener('pageshow', resume);

  /** @type {CompanionHandle} */
  const owner = {
    version: VERSION,
    diagnostics: getDiagnostics,
    stop() {
      if (stopped) {
        return;
      }
      stopped = true;
      themeObserver.disconnect();
      doc.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', suspend);
      window.removeEventListener('pageshow', resume);
      unmount();
      if (registry.__pumpkinHollowCompanion === owner) {
        delete registry.__pumpkinHollowCompanion;
      }
    },
  };
  registry.__pumpkinHollowCompanion = owner;
  onVisibilityChange();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  start();
}
