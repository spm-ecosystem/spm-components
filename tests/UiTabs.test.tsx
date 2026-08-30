// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UiTabs, UiTabItem } from '../dedicated/UiTabs';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiTabs', () => {
  let container: HTMLDivElement;
  let originalLocation: Location;

  const mockLocation = (urlStr: string) => {
    const url = new URL(urlStr);
    const mock = {
      href: url.toString(),
      search: url.search,
      origin: url.origin,
      pathname: url.pathname,
      hash: url.hash,
      host: url.host,
      hostname: url.hostname,
      port: url.port,
      protocol: url.protocol,
      assign: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn(),
      toString() {
        return this.href;
      },
    };

    Object.defineProperty(window, 'location', {
      value: mock,
      writable: true,
      configurable: true,
    });

    return mock;
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    originalLocation = window.location;
    mockLocation('http://localhost/');
  });

  afterEach(() => {
    document.body.removeChild(container);
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      configurable: true,
    });
  });

  it('1. Navigational Mode: renders href links and respects active flag without tabpanel', async () => {
    const tabs: UiTabItem[] = [
      { id: 'home', label: 'Home', href: '/home' },
      { id: 'docs', label: 'Docs', href: '/docs', active: true },
      { id: 'contact', label: 'Contact', href: '/contact' },
    ];

    const root = createRoot(container);
    root.render(<UiTabs tabs={tabs} />);
    await waitForUpdate();

    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).not.toBeNull();

    const renderedTabs = container.querySelectorAll('[role="tab"]');
    expect(renderedTabs.length).toBe(3);

    // All should be anchor tags
    expect(renderedTabs[0].tagName.toLowerCase()).toBe('a');
    expect(renderedTabs[0].getAttribute('href')).toBe('/home');
    expect(renderedTabs[0].getAttribute('aria-selected')).toBe('false');

    expect(renderedTabs[1].tagName.toLowerCase()).toBe('a');
    expect(renderedTabs[1].getAttribute('href')).toBe('/docs');
    expect(renderedTabs[1].getAttribute('aria-selected')).toBe('true');
    expect(renderedTabs[1].className).toContain('spm-tab-active');

    expect(renderedTabs[2].tagName.toLowerCase()).toBe('a');
    expect(renderedTabs[2].getAttribute('href')).toBe('/contact');
    expect(renderedTabs[2].getAttribute('aria-selected')).toBe('false');

    // No tabpanel should be rendered because no tabs have contentHtml
    const panel = container.querySelector('[role="tabpanel"]');
    expect(panel).toBeNull();
  });

  it('2. Local Panel Mode: switches contentHtml on click and manages ARIA attributes', async () => {
    const tabs: UiTabItem[] = [
      { id: 'overview', label: 'Overview', contentHtml: '<p>Overview Content</p>' },
      { id: 'specs', label: 'Specs', contentHtml: '<p>Specs Content</p>' },
      { id: 'reviews', label: 'Reviews', contentHtml: '<p>Reviews Content</p>' },
    ];

    const root = createRoot(container);
    root.render(<UiTabs tabs={tabs} />);
    await waitForUpdate();

    const renderedTabs = container.querySelectorAll('[role="tab"]');
    expect(renderedTabs.length).toBe(3);
    expect(renderedTabs[0].getAttribute('aria-selected')).toBe('true');
    expect(renderedTabs[1].getAttribute('aria-selected')).toBe('false');

    let panel = container.querySelector('[role="tabpanel"]');
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute('id')).toBe('spm-tabpanel-overview');
    expect(panel?.getAttribute('aria-labelledby')).toBe('spm-tab-overview');
    expect(panel?.innerHTML).toBe('<p>Overview Content</p>');

    // Click on the second tab (Specs)
    (renderedTabs[1] as HTMLElement).click();
    await waitForUpdate();

    expect(renderedTabs[0].getAttribute('aria-selected')).toBe('false');
    expect(renderedTabs[1].getAttribute('aria-selected')).toBe('true');
    expect(renderedTabs[1].className).toContain('spm-tab-active');

    panel = container.querySelector('[role="tabpanel"]');
    expect(panel?.getAttribute('id')).toBe('spm-tabpanel-specs');
    expect(panel?.getAttribute('aria-labelledby')).toBe('spm-tab-specs');
    expect(panel?.innerHTML).toBe('<p>Specs Content</p>');
  });

  it('3. Mixed Mode: supports href links and contentHtml tabs in same list', async () => {
    const tabs: UiTabItem[] = [
      { id: 'details', label: 'Details', contentHtml: '<p>Details text</p>' },
      { id: 'external', label: 'External Docs', href: 'https://example.com/docs' },
      { id: 'settings', label: 'Settings', contentHtml: '<p>Settings form</p>' },
    ];

    const root = createRoot(container);
    root.render(<UiTabs tabs={tabs} />);
    await waitForUpdate();

    const renderedTabs = container.querySelectorAll('[role="tab"]');
    expect(renderedTabs.length).toBe(3);

    expect(renderedTabs[0].tagName.toLowerCase()).toBe('button');
    expect(renderedTabs[1].tagName.toLowerCase()).toBe('a');
    expect(renderedTabs[1].getAttribute('href')).toBe('https://example.com/docs');
    expect(renderedTabs[2].tagName.toLowerCase()).toBe('button');

    let panel = container.querySelector('[role="tabpanel"]');
    expect(panel?.innerHTML).toBe('<p>Details text</p>');

    // Click settings panel tab
    (renderedTabs[2] as HTMLElement).click();
    await waitForUpdate();

    expect(renderedTabs[2].getAttribute('aria-selected')).toBe('true');
    panel = container.querySelector('[role="tabpanel"]');
    expect(panel?.innerHTML).toBe('<p>Settings form</p>');
  });

  it('4. Initial mount reading: reads URLSearchParams on mount with activeParamName', async () => {
    mockLocation('http://localhost/dashboard?section=tab-logs');

    const tabs: UiTabItem[] = [
      { id: 'tab-overview', label: 'Overview', contentHtml: '<p>Overview</p>', active: true },
      { id: 'tab-logs', label: 'Logs', contentHtml: '<p>Logs stream</p>' },
      { id: 'tab-metrics', label: 'Metrics', contentHtml: '<p>Metrics data</p>' },
    ];

    const root = createRoot(container);
    root.render(<UiTabs tabs={tabs} activeParamName="section" />);
    await waitForUpdate();

    const renderedTabs = container.querySelectorAll('[role="tab"]');
    expect(renderedTabs[0].getAttribute('aria-selected')).toBe('false');
    expect(renderedTabs[1].getAttribute('aria-selected')).toBe('true');

    const panel = container.querySelector('[role="tabpanel"]');
    expect(panel?.innerHTML).toBe('<p>Logs stream</p>');
  });

  it('5. Parameter writing: calls history.replaceState on tab click when activeParamName is provided', async () => {
    mockLocation('http://localhost/profile');
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

    const tabs: UiTabItem[] = [
      { id: 'profile-info', label: 'Profile', contentHtml: '<p>Profile Form</p>' },
      { id: 'security', label: 'Security', contentHtml: '<p>Security Settings</p>' },
    ];

    const root = createRoot(container);
    root.render(<UiTabs tabs={tabs} activeParamName="tab" />);
    await waitForUpdate();

    const renderedTabs = container.querySelectorAll('[role="tab"]');
    (renderedTabs[1] as HTMLElement).click();
    await waitForUpdate();

    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    const calledUrl = replaceStateSpy.mock.calls[0][2] as string;
    expect(calledUrl).toContain('tab=security');
  });

  it('6. Disabled tabs: ignores clicks on disabled tabs', async () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

    const tabs: UiTabItem[] = [
      { id: 'tab1', label: 'Active Tab', contentHtml: '<p>Active</p>' },
      { id: 'tab2', label: 'Disabled Tab', contentHtml: '<p>Disabled</p>', disabled: true },
    ];

    const root = createRoot(container);
    root.render(<UiTabs tabs={tabs} activeParamName="tab" />);
    await waitForUpdate();

    const renderedTabs = container.querySelectorAll('[role="tab"]');
    expect(renderedTabs[1].getAttribute('aria-disabled')).toBe('true');
    expect(renderedTabs[1].className).toContain('spm-tab-disabled');

    // Click disabled tab
    (renderedTabs[1] as HTMLElement).click();
    await waitForUpdate();

    // Tab 1 should still be active
    expect(renderedTabs[0].getAttribute('aria-selected')).toBe('true');
    expect(renderedTabs[1].getAttribute('aria-selected')).toBe('false');

    const panel = container.querySelector('[role="tabpanel"]');
    expect(panel?.innerHTML).toBe('<p>Active</p>');
    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it('7. Badges: renders string and numeric badges correctly', async () => {
    const tabs: UiTabItem[] = [
      { id: 'inbox', label: 'Inbox', badge: 42 },
      { id: 'updates', label: 'Updates', badge: 'NEW' },
      { id: 'archive', label: 'Archive' },
    ];

    const root = createRoot(container);
    root.render(<UiTabs tabs={tabs} />);
    await waitForUpdate();

    const badges = container.querySelectorAll('.spm-tab-badge');
    expect(badges.length).toBe(2);
    expect(badges[0].textContent).toBe('42');
    expect(badges[1].textContent).toBe('NEW');

    const renderedTabs = container.querySelectorAll('[role="tab"]');
    expect(renderedTabs[2].querySelector('.spm-tab-badge')).toBeNull();
  });

  it('8. Variants & Orientations: applies classes and attributes for underline, pill, boxed, horizontal, and vertical', async () => {
    const tabs: UiTabItem[] = [
      { id: 't1', label: 'Tab 1', contentHtml: '<p>Tab 1</p>' },
      { id: 't2', label: 'Tab 2', contentHtml: '<p>Tab 2</p>' },
    ];

    const root = createRoot(container);

    // Test default: underline + horizontal
    root.render(<UiTabs tabs={tabs} />);
    await waitForUpdate();

    let tabsContainer = container.querySelector('.spm-tabs-container');
    let tabList = container.querySelector('[role="tablist"]');
    expect(tabsContainer?.className).toContain('spm-tabs-underline');
    expect(tabsContainer?.className).toContain('spm-tabs-horizontal');
    expect(tabList?.getAttribute('aria-orientation')).toBe('horizontal');

    // Test pill + vertical
    root.render(<UiTabs tabs={tabs} variant="pill" orientation="vertical" />);
    await waitForUpdate();

    tabsContainer = container.querySelector('.spm-tabs-container');
    tabList = container.querySelector('[role="tablist"]');
    expect(tabsContainer?.className).toContain('spm-tabs-pill');
    expect(tabsContainer?.className).toContain('spm-tabs-vertical');
    expect(tabList?.getAttribute('aria-orientation')).toBe('vertical');

    // Test boxed
    root.render(<UiTabs tabs={tabs} variant="boxed" />);
    await waitForUpdate();

    tabsContainer = container.querySelector('.spm-tabs-container');
    tabList = container.querySelector('[role="tablist"]');
    expect(tabsContainer?.className).toContain('spm-tabs-boxed');
  });
});
