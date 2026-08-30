// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UiDevDiagnosticPanel } from '../dedicated/UiDevDiagnosticPanel';
import { DevDiagnosticCollector, DevDiagnosticCollectorClass } from '../../content/devDiagnostics';
import { runModernizer, SiteManifest } from '../../content/modernizer';

const waitForUpdate = () => new Promise((resolve) => setTimeout(resolve, 50));

describe('UiDevDiagnosticPanel', () => {
  let container: HTMLDivElement;
  let customCollector: DevDiagnosticCollectorClass;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    customCollector = new DevDiagnosticCollectorClass();
    DevDiagnosticCollector.clear();
  });

  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
    const host = document.getElementById('spm-dev-diagnostic-host');
    if (host && host.parentNode) {
      host.parentNode.removeChild(host);
    }
  });

  it('renders collapsed badge with SPM DEV and green status dot when empty', async () => {
    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel collector={customCollector} />);
    await waitForUpdate();

    expect(container.textContent).toContain('SPM DEV');
    const badgeCounter = container.querySelector('[data-testid="badge-counter"]');
    expect(badgeCounter?.textContent).toBe('0');

    const dotCircle = container.querySelector('[data-testid="status-dot"] circle');
    expect(dotCircle?.getAttribute('fill')).toBe('#10b981');
  });

  it('updates status dot to amber when only warnings are present', async () => {
    customCollector.addDiagnostic({
      type: 'MISSING_SELECTOR',
      severity: 'warning',
      title: 'Missing Container',
      message: 'Container selector .box not found',
    });

    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel collector={customCollector} />);
    await waitForUpdate();

    const badgeCounter = container.querySelector('[data-testid="badge-counter"]');
    expect(badgeCounter?.textContent).toBe('1');

    const dotCircle = container.querySelector('[data-testid="status-dot"] circle');
    expect(dotCircle?.getAttribute('fill')).toBe('#f59e0b');
  });

  it('updates status dot to red when errors are present', async () => {
    customCollector.addDiagnostic({
      type: 'MISSING_SELECTOR',
      severity: 'warning',
      title: 'Missing Container',
      message: 'Container selector .box not found',
    });
    customCollector.addDiagnostic({
      type: 'BUILD_ERROR',
      severity: 'error',
      title: 'Compilation Failed',
      message: 'Failed to compile manifest',
    });

    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel collector={customCollector} />);
    await waitForUpdate();

    const badgeCounter = container.querySelector('[data-testid="badge-counter"]');
    expect(badgeCounter?.textContent).toBe('2');

    const dotCircle = container.querySelector('[data-testid="status-dot"] circle');
    expect(dotCircle?.getAttribute('fill')).toBe('#ef4444');
  });

  it('expands drawer when collapsed badge is clicked and collapses when close button is clicked', async () => {
    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel collector={customCollector} />);
    await waitForUpdate();

    // Initially collapsed: drawer title not visible
    expect(container.textContent).not.toContain('Dev Diagnostics');

    // Click badge to expand
    const badgeBtn = container.querySelector('.spm-dev-diagnostic-badge') as HTMLButtonElement;
    expect(badgeBtn).toBeTruthy();
    badgeBtn.click();
    await waitForUpdate();

    // Now expanded: drawer header visible
    expect(container.textContent).toContain('Dev Diagnostics');
    expect(container.textContent).toContain('Clear');
    expect(container.textContent).toContain('All (0)');

    // Click close button
    const closeBtn = container.querySelector('.spm-dev-diagnostic-close-btn') as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();
    closeBtn.click();
    await waitForUpdate();

    // Collapsed again
    expect(container.textContent).not.toContain('Dev Diagnostics');
    expect(container.textContent).toContain('SPM DEV');
  });

  it('renders initialExpanded prop correctly', async () => {
    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel collector={customCollector} initialExpanded={true} />);
    await waitForUpdate();

    expect(container.textContent).toContain('Dev Diagnostics');
  });

  it('filters diagnostics by severity tabs: All, Errors, Warnings', async () => {
    customCollector.addDiagnostic({
      type: 'MISSING_SELECTOR',
      severity: 'warning',
      title: 'Missing Reconstruct Container',
      message: 'Selector #app not found',
    });
    customCollector.addDiagnostic({
      type: 'BUILD_ERROR',
      severity: 'error',
      title: 'Dev Server Disconnected',
      message: 'Failed WebSocket handshake',
    });

    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel collector={customCollector} initialExpanded={true} />);
    await waitForUpdate();

    expect(container.textContent).toContain('All (2)');
    expect(container.textContent).toContain('Errors (1)');
    expect(container.textContent).toContain('Warnings (1)');

    // Default "All": shows both
    expect(container.textContent).toContain('Missing Reconstruct Container');
    expect(container.textContent).toContain('Dev Server Disconnected');

    const buttons = Array.from(container.querySelectorAll('button'));
    const errorTab = buttons.find((b) => b.textContent?.includes('Errors (1)'));
    const warningTab = buttons.find((b) => b.textContent?.includes('Warnings (1)'));
    const allTab = buttons.find((b) => b.textContent?.includes('All (2)'));

    // Switch to Errors tab
    errorTab?.click();
    await waitForUpdate();

    expect(container.textContent).toContain('Dev Server Disconnected');
    expect(container.textContent).not.toContain('Missing Reconstruct Container');

    // Switch to Warnings tab
    warningTab?.click();
    await waitForUpdate();

    expect(container.textContent).toContain('Missing Reconstruct Container');
    expect(container.textContent).not.toContain('Dev Server Disconnected');

    // Switch back to All tab
    allTab?.click();
    await waitForUpdate();

    expect(container.textContent).toContain('Missing Reconstruct Container');
    expect(container.textContent).toContain('Dev Server Disconnected');
  });

  it('renders diagnostic cards with dark surface, SVG icons, and togglable details', async () => {
    customCollector.addDiagnostic({
      type: 'MISSING_SELECTOR',
      severity: 'warning',
      title: 'Missing Component Selector',
      message: 'Selector .missing-nav matched 0 elements.',
      details: JSON.stringify({ selector: '.missing-nav', context: 'header' }, null, 2),
    });

    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel collector={customCollector} initialExpanded={true} />);
    await waitForUpdate();

    expect(container.textContent).toContain('MISSING_SELECTOR');
    expect(container.textContent).toContain('Missing Component Selector');
    expect(container.textContent).toContain('Selector .missing-nav matched 0 elements.');

    // Warning icon present
    const warningIcon = container.querySelector('[data-testid="warning-icon"]');
    expect(warningIcon).toBeTruthy();

    // Details button present
    const detailsBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Details')
    );
    expect(detailsBtn).toBeTruthy();

    // Details pre tag initially not rendered
    expect(container.querySelector('pre')).toBeNull();

    // Click to expand details
    detailsBtn?.click();
    await waitForUpdate();

    const detailsPre = container.querySelector('pre');
    expect(detailsPre).toBeTruthy();
    expect(detailsPre?.textContent).toContain('.missing-nav');

    // Click to hide details
    detailsBtn?.click();
    await waitForUpdate();
    expect(container.querySelector('pre')).toBeNull();
  });

  it('clears all diagnostics when Clear button is clicked', async () => {
    customCollector.addDiagnostic({
      type: 'MISSING_SELECTOR',
      severity: 'warning',
      title: 'Selector issue',
      message: 'Missing #id',
    });

    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel collector={customCollector} initialExpanded={true} />);
    await waitForUpdate();

    expect(container.textContent).toContain('Selector issue');
    expect(customCollector.getItems()).toHaveLength(1);

    const clearBtn = container.querySelector('.spm-dev-diagnostic-clear-btn') as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();
    clearBtn.click();
    await waitForUpdate();

    expect(customCollector.getItems()).toHaveLength(0);
    expect(container.textContent).toContain('No diagnostic issues detected.');
    expect(container.textContent).toContain('All (0)');
  });

  it('reactively updates when collector receives new diagnostics while mounted', async () => {
    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel collector={customCollector} initialExpanded={true} />);
    await waitForUpdate();

    expect(container.textContent).toContain('No diagnostic issues detected.');

    customCollector.addDiagnostic({
      type: 'INVALID_PROP',
      severity: 'warning',
      title: 'Invalid Prop Received',
      message: 'Expected number for count prop',
    });
    await waitForUpdate();

    expect(container.textContent).toContain('Invalid Prop Received');
    expect(container.textContent).toContain('All (1)');
  });
});

describe('modernizer dev diagnostic Shadow DOM host integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    DevDiagnosticCollector.clear();
    delete (window as any).__spm_dev_manifest;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete (window as any).__spm_dev_manifest;
  });

  it('mounts #spm-dev-diagnostic-host Shadow DOM root when isDev is true', () => {
    const manifest: SiteManifest = {
      reconstructs: [
        {
          containerSelector: '#non-existent-box',
          layoutComponent: 'UiSearchBar',
          children: [],
        },
      ],
    };

    runModernizer(document, manifest, '', '', true);

    const devHost = document.getElementById('spm-dev-diagnostic-host');
    expect(devHost).toBeTruthy();
    expect(devHost?.shadowRoot).toBeTruthy();
    expect(devHost?.style.position).toBe('fixed');
    expect(devHost?.style.bottom).toBe('0px');
    expect(devHost?.style.right).toBe('0px');
    expect(devHost?.style.zIndex).toBe('999999');
  });

  it('does NOT mount #spm-dev-diagnostic-host when isDev is false and __spm_dev_manifest is absent', () => {
    const manifest: SiteManifest = {};
    runModernizer(document, manifest, '', '', false);

    const devHost = document.getElementById('spm-dev-diagnostic-host');
    expect(devHost).toBeNull();
  });

  it('mounts #spm-dev-diagnostic-host when window.__spm_dev_manifest is defined', () => {
    (window as any).__spm_dev_manifest = {
      components: [],
    };

    runModernizer(document, {}, '', '', false);

    const devHost = document.getElementById('spm-dev-diagnostic-host');
    expect(devHost).toBeTruthy();
    expect(devHost?.shadowRoot).toBeTruthy();
  });
});
