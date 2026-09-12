// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UiNavHeader, NavLink } from '../dedicated/UiNavHeader';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiNavHeader', () => {
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
    mockLocation('http://example.com/index.php');
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    document.body.removeChild(container);
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      configurable: true,
    });
  });

  it('1. Combine primary and secondary links into a single scrollable nav flex container with flex-shrink 0', async () => {
    const primaryLinks: NavLink[] = [
      { label: 'Home', url: '/index.php?page=main' },
      { label: 'Posts', url: '/index.php?page=post&s=list' },
    ];
    const secondaryLinks: NavLink[] = [
      { label: 'Help', url: '/index.php?page=help' },
      { label: 'Video', url: '/index.php?page=post&s=list&tags=video' },
    ];

    const root = createRoot(container);
    root.render(
      <UiNavHeader
        siteName="TestSite"
        primaryLinks={primaryLinks}
        secondaryLinks={secondaryLinks}
        layout="standard"
      />
    );
    await waitForUpdate();

    const navContainer = container.querySelector('.spm-nav-container') as HTMLElement;
    expect(navContainer).not.toBeNull();
    expect(navContainer.style.display).toBe('flex');
    expect(navContainer.getAttribute('style')).toContain('flex-wrap: nowrap');
    expect(navContainer.style.overflowX).toBe('auto');

    const anchors = navContainer.querySelectorAll('a');
    expect(anchors.length).toBe(4);
    expect(anchors[0].textContent).toBe('Home');
    expect(anchors[1].textContent).toBe('Posts');
    expect(anchors[2].textContent).toBe('Help');
    expect(anchors[3].textContent).toBe('Video');

    anchors.forEach(a => {
      expect(a.style.flexShrink).toBe('0');
    });
  });

  it('2. Strict active query parameter matching prevents false positive activations', async () => {
    mockLocation('http://example.com/index.php?page=post&s=list&tags=video');

    const primaryLinks: NavLink[] = [
      { label: 'Posts', url: '/index.php?page=post&s=list' },
      { label: 'Video', url: '/index.php?page=post&s=list&tags=video' },
      { label: 'All', url: '/index.php?page=post&s=list&tags=all' },
    ];

    const root = createRoot(container);
    root.render(
      <UiNavHeader
        siteName="TestSite"
        primaryLinks={primaryLinks}
      />
    );
    await waitForUpdate();

    const navContainer = container.querySelector('.spm-nav-container') as HTMLElement;
    const anchors = Array.from(navContainer.querySelectorAll('a'));

    const postsLink = anchors.find(a => a.textContent === 'Posts') as HTMLAnchorElement;
    const videoLink = anchors.find(a => a.textContent === 'Video') as HTMLAnchorElement;
    const allLink = anchors.find(a => a.textContent === 'All') as HTMLAnchorElement;

    // Only 'Video' should be active for current URL page=post&s=list&tags=video
    expect(videoLink.style.color).toBe('var(--spm-accent)');
    expect(postsLink.style.color).toBe('var(--spm-text-muted)');
    expect(allLink.style.color).toBe('var(--spm-text-muted)');
  });

  it('3. Active link matching when current URL has no extra query parameters', async () => {
    mockLocation('http://example.com/index.php?page=post&s=list');

    const primaryLinks: NavLink[] = [
      { label: 'Posts', url: '/index.php?page=post&s=list' },
      { label: 'Video', url: '/index.php?page=post&s=list&tags=video' },
    ];

    const root = createRoot(container);
    root.render(
      <UiNavHeader
        siteName="TestSite"
        primaryLinks={primaryLinks}
      />
    );
    await waitForUpdate();

    const navContainer = container.querySelector('.spm-nav-container') as HTMLElement;
    const anchors = Array.from(navContainer.querySelectorAll('a'));

    const postsLink = anchors.find(a => a.textContent === 'Posts') as HTMLAnchorElement;
    const videoLink = anchors.find(a => a.textContent === 'Video') as HTMLAnchorElement;

    expect(postsLink.style.color).toBe('var(--spm-accent)');
    expect(videoLink.style.color).toBe('var(--spm-text-muted)');
  });
});
