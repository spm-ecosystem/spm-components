// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UiTerminalConsole, LogEntry } from '../dedicated/UiTerminalConsole';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiTerminalConsole', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders title and log lines correctly with timestamps and levels', async () => {
    const logs: LogEntry[] = [
      { id: '1', timestamp: '12:00:01', level: 'info', message: 'System initialization started' },
      { id: '2', timestamp: '12:00:02', level: 'warn', message: 'Low memory warning' },
      { id: '3', timestamp: '12:00:03', level: 'error', message: 'Connection failed' },
      { id: '4', timestamp: '12:00:04', level: 'debug', message: 'Debugging query trace' },
    ];

    const root = createRoot(container);
    root.render(
      <UiTerminalConsole
        title="Diagnostic Terminal"
        logs={logs}
      />
    );
    await waitForUpdate();

    // Verify Title
    expect(container.textContent).toContain('Diagnostic Terminal');

    // Verify Log messages
    expect(container.textContent).toContain('System initialization started');
    expect(container.textContent).toContain('Low memory warning');
    expect(container.textContent).toContain('Connection failed');
    expect(container.textContent).toContain('Debugging query trace');

    // Verify timestamps
    expect(container.textContent).toContain('[12:00:01]');
    expect(container.textContent).toContain('[12:00:02]');
    expect(container.textContent).toContain('[12:00:03]');
    expect(container.textContent).toContain('[12:00:04]');

    // Verify Level labels
    expect(container.textContent).toContain('INFO');
    expect(container.textContent).toContain('WARN');
    expect(container.textContent).toContain('ERROR');
    expect(container.textContent).toContain('DEBUG');

    // Check level colors
    const spans = container.querySelectorAll('div > div > span');
    const levelSpans = Array.from(spans).filter(s => ['INFO', 'WARN', 'ERROR', 'DEBUG'].includes(s.textContent || ''));
    expect(levelSpans.length).toBe(4);
    expect((levelSpans[0] as HTMLElement).style.color).toBe('rgb(56, 189, 248)'); // #38bdf8
    expect((levelSpans[1] as HTMLElement).style.color).toBe('rgb(251, 191, 36)'); // #fbbf24
    expect((levelSpans[2] as HTMLElement).style.color).toBe('rgb(248, 113, 113)'); // #f87171
    expect((levelSpans[3] as HTMLElement).style.color).toBe('rgb(148, 163, 184)'); // #94a3b8
  });

  it('filters logs when clicking filter buttons', async () => {
    const logs: LogEntry[] = [
      { id: '1', level: 'info', message: 'Info line 1' },
      { id: '2', level: 'warn', message: 'Warn line 1' },
      { id: '3', level: 'error', message: 'Error line 1' },
    ];

    const root = createRoot(container);
    root.render(<UiTerminalConsole logs={logs} />);
    await waitForUpdate();

    const buttons = container.querySelectorAll('button');
    const allBtn = Array.from(buttons).find(b => b.textContent === 'all');
    const infoBtn = Array.from(buttons).find(b => b.textContent === 'info');
    const warnBtn = Array.from(buttons).find(b => b.textContent === 'warn');
    const errorBtn = Array.from(buttons).find(b => b.textContent === 'error');

    expect(allBtn).toBeTruthy();
    expect(infoBtn).toBeTruthy();
    expect(warnBtn).toBeTruthy();
    expect(errorBtn).toBeTruthy();

    // Default filter is 'all'
    expect(container.textContent).toContain('Info line 1');
    expect(container.textContent).toContain('Warn line 1');
    expect(container.textContent).toContain('Error line 1');

    // Filter by 'warn'
    warnBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForUpdate();

    expect(container.textContent).not.toContain('Info line 1');
    expect(container.textContent).toContain('Warn line 1');
    expect(container.textContent).not.toContain('Error line 1');

    // Filter by 'error'
    errorBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForUpdate();

    expect(container.textContent).not.toContain('Info line 1');
    expect(container.textContent).not.toContain('Warn line 1');
    expect(container.textContent).toContain('Error line 1');

    // Back to 'all'
    allBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForUpdate();

    expect(container.textContent).toContain('Info line 1');
    expect(container.textContent).toContain('Warn line 1');
    expect(container.textContent).toContain('Error line 1');
  });

  it('respects initial filterLevel prop', async () => {
    const logs: LogEntry[] = [
      { id: '1', level: 'info', message: 'Info message' },
      { id: '2', level: 'error', message: 'Fatal crash' },
    ];

    const root = createRoot(container);
    root.render(<UiTerminalConsole logs={logs} filterLevel="error" />);
    await waitForUpdate();

    expect(container.textContent).not.toContain('Info message');
    expect(container.textContent).toContain('Fatal crash');
  });

  it('renders "No console logs." when logs are empty or filtered out completely', async () => {
    const root = createRoot(container);
    root.render(<UiTerminalConsole logs={[]} />);
    await waitForUpdate();

    expect(container.textContent).toContain('No console logs.');
  });

  it('applies custom className and style props', async () => {
    const root = createRoot(container);
    root.render(
      <UiTerminalConsole
        className="custom-console"
        style={{ height: '500px', opacity: 0.8 }}
      />
    );
    await waitForUpdate();

    const el = container.querySelector('.spm-terminal-console') as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.classList.contains('custom-console')).toBe(true);
    expect(el.style.height).toBe('500px');
    expect(el.style.opacity).toBe('0.8');
  });
});
