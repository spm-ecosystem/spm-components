// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UiPaginationBar } from '../dedicated/UiPaginationBar';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiPaginationBar', () => {
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
  });

  afterEach(() => {
    document.body.removeChild(container);
    // Restore window.location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      configurable: true,
    });
  });

  it('renders null when pageLinks is empty or not provided', async () => {
    mockLocation('http://localhost/');
    const root = createRoot(container);
    
    root.render(<UiPaginationBar />);
    await waitForUpdate();
    expect(container.firstChild).toBeNull();

    root.render(<UiPaginationBar pageLinks={[]} />);
    await waitForUpdate();
    expect(container.firstChild).toBeNull();
  });

  it('renders page links properly and highlights active page when matching current location', async () => {
    mockLocation('http://localhost/posts?pid=10');

    const pageLinks = [
      { label: 'Page 1', url: 'http://localhost/posts?pid=0' },
      { label: 'Page 2', url: 'http://localhost/posts?pid=10' },
      { label: 'Page 3', url: 'http://localhost/posts?pid=20' },
    ];

    const root = createRoot(container);
    root.render(<UiPaginationBar pageLinks={pageLinks} />);
    await waitForUpdate();

    // Verify nav is rendered
    const nav = container.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav?.getAttribute('aria-label')).toBe('Pagination');

    // Verify all three page links are rendered as anchors
    const anchors = container.querySelectorAll('a');
    
    // We should have:
    // - 1 for Prev link (since pid=10 > 0)
    // - 3 for Page 1, Page 2, Page 3
    // - 1 for Next link (since pid=10 + 10 <= 20)
    // Total anchors = 5
    expect(anchors.length).toBe(5);

    // Verify individual page links
    const page1Anchor = Array.from(anchors).find(a => a.textContent === 'Page 1');
    const page2Anchor = Array.from(anchors).find(a => a.textContent === 'Page 2');
    const page3Anchor = Array.from(anchors).find(a => a.textContent === 'Page 3');

    expect(page1Anchor).toBeTruthy();
    expect(page1Anchor?.getAttribute('href')).toBe('http://localhost/posts?pid=0');
    expect(page1Anchor?.getAttribute('aria-current')).toBeNull();

    // Page 2 should be active/highlighted
    expect(page2Anchor).toBeTruthy();
    expect(page2Anchor?.getAttribute('href')).toBe('http://localhost/posts?pid=10');
    expect(page2Anchor?.getAttribute('aria-current')).toBe('page');
    // Active style should have fontWeight 700 / bold
    expect((page2Anchor as HTMLElement).style.fontWeight).toBe('700');

    expect(page3Anchor).toBeTruthy();
    expect(page3Anchor?.getAttribute('href')).toBe('http://localhost/posts?pid=20');
    expect(page3Anchor?.getAttribute('aria-current')).toBeNull();
  });

  it('respects a custom parameter name', async () => {
    mockLocation('http://localhost/posts?custom_page=5');

    const pageLinks = [
      { label: 'P1', url: 'http://localhost/posts?custom_page=0' },
      { label: 'P2', url: 'http://localhost/posts?custom_page=5' },
      { label: 'P3', url: 'http://localhost/posts?custom_page=10' },
    ];

    const root = createRoot(container);
    root.render(<UiPaginationBar pageLinks={pageLinks} paramName="custom_page" />);
    await waitForUpdate();

    const p2Anchor = container.querySelector('a[aria-current="page"]');
    expect(p2Anchor).toBeTruthy();
    expect(p2Anchor?.textContent).toBe('P2');
  });

  it('correctly disables/enables prev and next page buttons based on pid position', async () => {
    const pageLinks = [
      { label: '1', url: 'http://localhost/posts?pid=0' },
      { label: '2', url: 'http://localhost/posts?pid=10' },
      { label: '3', url: 'http://localhost/posts?pid=20' },
    ];

    const root = createRoot(container);

    // Case A: First page (pid=0)
    mockLocation('http://localhost/posts?pid=0');
    root.render(<UiPaginationBar pageLinks={pageLinks} />);
    await waitForUpdate();

    // Prev button should be a disabled span (since pid=0 is the first page)
    const prevSpan = container.querySelector('span');
    expect(prevSpan).toBeTruthy();
    expect(prevSpan?.textContent).toBe('‹');
    expect(prevSpan?.style.color).toBe('var(--spm-text-muted)');

    // Next button should be an active anchor (pointing to pid=10)
    const nextAnchor = container.querySelector('a[aria-label="Next page"]');
    expect(nextAnchor).toBeTruthy();
    expect(nextAnchor?.getAttribute('href')).toContain('pid=10');

    // Case B: Last page (pid=20)
    mockLocation('http://localhost/posts?pid=20');
    root.render(<UiPaginationBar pageLinks={pageLinks} />);
    await waitForUpdate();

    // Prev button should be an active anchor (pointing to pid=10)
    const prevAnchor = container.querySelector('a[aria-label="Previous page"]');
    expect(prevAnchor).toBeTruthy();
    expect(prevAnchor?.getAttribute('href')).toContain('pid=10');

    // Next button should be a disabled span (since pid=20 is the max page)
    // There will be a span for Next page (›)
    const spans = container.querySelectorAll('span');
    const nextSpan = Array.from(spans).find(s => s.textContent === '›');
    expect(nextSpan).toBeTruthy();
    expect(nextSpan?.style.color).toBe('var(--spm-text-muted)');
  });

  it('handles custom styling and className props', async () => {
    mockLocation('http://localhost/');
    const pageLinks = [{ label: '1', url: 'http://localhost/?pid=0' }];
    const root = createRoot(container);

    root.render(
      <UiPaginationBar
        pageLinks={pageLinks}
        className="my-custom-pagination"
        style={{ marginTop: '20px' }}
      />
    );
    await waitForUpdate();

    const nav = container.querySelector('nav');
    expect(nav?.classList.contains('my-custom-pagination')).toBe(true);
    expect(nav?.style.marginTop).toBe('20px');
  });

  it('triggers hover and interactive styles correctly', async () => {
    mockLocation('http://localhost/posts?pid=0');
    const pageLinks = [
      { label: '1', url: 'http://localhost/posts?pid=0' },
      { label: '2', url: 'http://localhost/posts?pid=10' },
    ];
    const root = createRoot(container);
    root.render(<UiPaginationBar pageLinks={pageLinks} />);
    await waitForUpdate();

    // 1. Next button hover (it is an anchor)
    const nextAnchor = container.querySelector('a[aria-label="Next page"]') as HTMLElement;
    expect(nextAnchor).toBeTruthy();
    
    nextAnchor.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    nextAnchor.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(nextAnchor.style.background).toBe('var(--spm-bg-tertiary)');
    
    nextAnchor.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    nextAnchor.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(nextAnchor.style.background).toBe('var(--spm-bg-secondary)');

    // 2. Active Page Link (should not change background on hover)
    const activePage = Array.from(container.querySelectorAll('a')).find(a => a.textContent === '1') as HTMLElement;
    expect(activePage).toBeTruthy();
    const originalBackground = activePage.style.background;
    activePage.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    activePage.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(activePage.style.background).toBe(originalBackground);

    // 3. Inactive Page Link hover
    const inactivePage = Array.from(container.querySelectorAll('a')).find(a => a.textContent === '2') as HTMLElement;
    expect(inactivePage).toBeTruthy();
    inactivePage.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    inactivePage.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(inactivePage.style.background).toBe('var(--spm-bg-tertiary)');
    inactivePage.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    inactivePage.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(inactivePage.style.background).toBe('var(--spm-bg-secondary)');

    // 4. Form input focus/blur style changes
    const input = container.querySelector('input[name="pageid"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    input.focus();
    expect(input.style.borderColor).toBe('var(--spm-accent)');
    input.blur();
    expect(input.style.borderColor).toBe('var(--spm-border)');

    // 5. Form button hover
    const formButton = container.querySelector('button[type="submit"]') as HTMLElement;
    expect(formButton).toBeTruthy();
    formButton.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    formButton.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(formButton.style.background).toBe('var(--spm-bg-tertiary)');
    formButton.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    formButton.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(formButton.style.background).toBe('var(--spm-bg-secondary)');
  });

  it('redirects to the correct page url upon manual page submit', async () => {
    const loc = mockLocation('http://localhost/posts?pid=10');
    const pageLinks = [
      { label: '1', url: 'http://localhost/posts?pid=0' },
      { label: '2', url: 'http://localhost/posts?pid=10' },
      { label: '3', url: 'http://localhost/posts?pid=20' },
    ];
    const root = createRoot(container);
    root.render(<UiPaginationBar pageLinks={pageLinks} />);
    await waitForUpdate();

    const form = container.querySelector('form') as HTMLFormElement;
    const input = container.querySelector('input[name="pageid"]') as HTMLInputElement;
    
    expect(form).toBeTruthy();
    expect(input).toBeTruthy();

    // Set page value to "3".
    // Calculated offset for Page 3 is (3 - 1) * postsPerPage = 2 * 10 = 20
    input.value = '3';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    // Assert that we assigned the new href
    expect(loc.href).toContain('pid=20');

    // Test invalid input (e.g. "abc") - shouldn't trigger changes
    const loc2 = mockLocation('http://localhost/posts?pid=10');
    root.render(<UiPaginationBar pageLinks={pageLinks} />);
    await waitForUpdate();
    
    const form2 = container.querySelector('form') as HTMLFormElement;
    const input2 = container.querySelector('input[name="pageid"]') as HTMLInputElement;
    input2.value = 'abc';
    form2.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    // href should remain unchanged
    expect(loc2.href).toBe('http://localhost/posts?pid=10');
  });
});
