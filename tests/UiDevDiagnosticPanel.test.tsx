// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UiDevDiagnosticPanel, DevDiagnosticItem } from '../dedicated/UiDevDiagnosticPanel';

const waitForUpdate = () => new Promise((resolve) => setTimeout(resolve, 50));

describe('UiDevDiagnosticPanel', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  });

  it('renders collapsed badge with SPM DEV and green status dot when empty', async () => {
    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel items={[]} />);
    await waitForUpdate();

    expect(container.textContent).toContain('SPM DEV');
    const badgeCounter = container.querySelector('[data-testid="badge-counter"]');
    expect(badgeCounter?.textContent).toBe('0');

    const dotCircle = container.querySelector('[data-testid="status-dot"] circle');
    expect(dotCircle?.getAttribute('fill')).toBe('#10b981');
  });

  it('updates status dot to amber when only warnings are present', async () => {
    const items: DevDiagnosticItem[] = [
      {
        id: '1',
        type: 'MISSING_SELECTOR',
        severity: 'warning',
        title: 'Missing Container',
        message: 'Container selector .box not found',
        timestamp: Date.now(),
      },
    ];

    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel items={items} />);
    await waitForUpdate();

    const badgeCounter = container.querySelector('[data-testid="badge-counter"]');
    expect(badgeCounter?.textContent).toBe('1');

    const dotCircle = container.querySelector('[data-testid="status-dot"] circle');
    expect(dotCircle?.getAttribute('fill')).toBe('#f59e0b');
  });

  it('updates status dot to red when errors are present', async () => {
    const items: DevDiagnosticItem[] = [
      {
        id: '1',
        type: 'MISSING_SELECTOR',
        severity: 'warning',
        title: 'Missing Container',
        message: 'Container selector .box not found',
        timestamp: Date.now(),
      },
      {
        id: '2',
        type: 'BUILD_ERROR',
        severity: 'error',
        title: 'Compilation Failed',
        message: 'Failed to compile manifest',
        timestamp: Date.now(),
      },
    ];

    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel items={items} />);
    await waitForUpdate();

    const badgeCounter = container.querySelector('[data-testid="badge-counter"]');
    expect(badgeCounter?.textContent).toBe('2');

    const dotCircle = container.querySelector('[data-testid="status-dot"] circle');
    expect(dotCircle?.getAttribute('fill')).toBe('#ef4444');
  });

  it('expands drawer when collapsed badge is clicked and collapses when close button is clicked', async () => {
    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel items={[]} />);
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
    root.render(<UiDevDiagnosticPanel items={[]} initialExpanded={true} />);
    await waitForUpdate();

    expect(container.textContent).toContain('Dev Diagnostics');
  });

  it('filters diagnostics by severity tabs: All, Errors, Warnings', async () => {
    const items: DevDiagnosticItem[] = [
      {
        id: '1',
        type: 'MISSING_SELECTOR',
        severity: 'warning',
        title: 'Missing Reconstruct Container',
        message: 'Selector #app not found',
        timestamp: Date.now(),
      },
      {
        id: '2',
        type: 'BUILD_ERROR',
        severity: 'error',
        title: 'Dev Server Disconnected',
        message: 'Failed WebSocket handshake',
        timestamp: Date.now(),
      },
    ];

    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel items={items} initialExpanded={true} />);
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
    const items: DevDiagnosticItem[] = [
      {
        id: 'diag-1',
        type: 'MISSING_SELECTOR',
        severity: 'warning',
        title: 'Missing Component Selector',
        message: 'Selector .missing-nav matched 0 elements.',
        details: JSON.stringify({ selector: '.missing-nav', context: 'header' }, null, 2),
        timestamp: Date.now(),
      },
    ];

    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel items={items} initialExpanded={true} />);
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

  it('calls onClear callback when Clear button is clicked', async () => {
    const onClearMock = vi.fn();
    const items: DevDiagnosticItem[] = [
      {
        id: '1',
        type: 'MISSING_SELECTOR',
        severity: 'warning',
        title: 'Selector issue',
        message: 'Missing #id',
        timestamp: Date.now(),
      },
    ];

    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel items={items} onClear={onClearMock} initialExpanded={true} />);
    await waitForUpdate();

    expect(container.textContent).toContain('Selector issue');

    const clearBtn = container.querySelector('.spm-dev-diagnostic-clear-btn') as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();
    clearBtn.click();
    await waitForUpdate();

    expect(onClearMock).toHaveBeenCalledTimes(1);
  });

  it('renders occurrence count badge when occurrenceCount is greater than 1', async () => {
    const items: DevDiagnosticItem[] = [
      {
        id: 'item-single',
        type: 'MISSING_SELECTOR',
        severity: 'warning',
        title: 'Single Warning',
        message: 'Happened once',
        timestamp: Date.now(),
        occurrenceCount: 1,
      },
      {
        id: 'item-multi',
        type: 'BUILD_ERROR',
        severity: 'error',
        title: 'Repeated Error',
        message: 'Happened multiple times',
        timestamp: Date.now(),
        occurrenceCount: 5,
      },
    ];

    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel items={items} initialExpanded={true} />);
    await waitForUpdate();

    expect(container.querySelector('[data-testid="occurrence-badge-item-single"]')).toBeNull();
    const multiBadge = container.querySelector('[data-testid="occurrence-badge-item-multi"]');
    expect(multiBadge).toBeTruthy();
    expect(multiBadge?.textContent).toBe('(x5)');
  });

  it('reactively updates when items prop updates upon re-render', async () => {
    const root = createRoot(container);
    root.render(<UiDevDiagnosticPanel items={[]} initialExpanded={true} />);
    await waitForUpdate();

    expect(container.textContent).toContain('No diagnostic issues detected.');

    const newItems: DevDiagnosticItem[] = [
      {
        id: '1',
        type: 'INVALID_PROP',
        severity: 'warning',
        title: 'Invalid Prop Received',
        message: 'Expected number for count prop',
        timestamp: Date.now(),
      },
    ];

    root.render(<UiDevDiagnosticPanel items={newItems} initialExpanded={true} />);
    await waitForUpdate();

    expect(container.textContent).toContain('Invalid Prop Received');
    expect(container.textContent).toContain('All (1)');
  });
});
