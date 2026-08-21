// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';
import React from 'react';
import { UiModernGridPage, GridItem, TagItem, TagGroupConfig } from '../dedicated/UiModernGridPage';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiModernGridPage', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    window.matchMedia = vi.fn().mockImplementation(query => ({
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
    vi.restoreAllMocks();
  });

  const sampleItems: GridItem[] = [
    { id: 'item-1', title: 'Card Title 1', imageUrl: 'https://example.com/1.jpg', linkUrl: '/item/1' },
    { id: 'item-2', title: 'Card Title 2', imageUrl: 'https://example.com/2.jpg', linkUrl: '/item/2' },
  ];

  const sampleTags: TagItem[] = [
    { name: 'Nature', count: 12, type: 'category', url: '/tags/nature' },
    { name: 'Landscape', count: 5, type: 'category', url: '/tags/landscape' },
    { name: 'Canon', count: 8, type: 'camera', url: '/tags/canon' },
    { name: 'Sony', count: 4, type: 'camera', url: '/tags/sony' },
  ];

  const sampleTagGroups: TagGroupConfig[] = [
    { title: 'Categories', typeKey: 'category' },
    { title: 'Cameras', typeKey: 'camera' },
  ];

  it('renders pageTitle correctly', async () => {
    const root = createRoot(container);
    root.render(
      <UiModernGridPage
        pageTitle="My Awesome Grid"
        items={sampleItems}
      />
    );
    await waitForUpdate();

    const titleEl = container.querySelector('.spm-modern-grid-title');
    expect(titleEl).toBeTruthy();
    expect(titleEl?.textContent).toBe('My Awesome Grid');
  });

  it('renders grid items list correctly using UiImageCard children', async () => {
    const root = createRoot(container);
    root.render(
      <UiModernGridPage
        pageTitle="Test Grid"
        items={sampleItems}
      />
    );
    await waitForUpdate();

    const cards = container.querySelectorAll('.spm-image-card');
    expect(cards.length).toBe(2);

    expect(cards[0].getAttribute('id')).toBe('item-1');
    expect(cards[0].getAttribute('href')).toBe('/item/1');
    expect(cards[0].querySelector('img')?.getAttribute('src')).toBe('https://example.com/1.jpg');
    expect(cards[0].querySelector('p')?.textContent).toBe('Card Title 1');

    expect(cards[1].getAttribute('id')).toBe('item-2');
    expect(cards[1].getAttribute('href')).toBe('/item/2');
    expect(cards[1].querySelector('img')?.getAttribute('src')).toBe('https://example.com/2.jpg');
    expect(cards[1].querySelector('p')?.textContent).toBe('Card Title 2');
  });

  it('renders sidebar tags and tag groups correctly when tagGroups is supplied', async () => {
    const root = createRoot(container);
    root.render(
      <UiModernGridPage
        pageTitle="Test Grid"
        items={sampleItems}
        tags={sampleTags}
        tagGroups={sampleTagGroups}
      />
    );
    await waitForUpdate();

    // Verify tag group headings
    const headings = Array.from(container.querySelectorAll('.spm-modern-grid-sidebar h3'));
    const headingTexts = headings.map(h => h.textContent);
    expect(headingTexts).toContain('Categories');
    expect(headingTexts).toContain('Cameras');

    // Verify tag badges render inside the sidebar
    const tagBadges = container.querySelectorAll('.spm-modern-grid-sidebar .spm-tag-badge-container');
    expect(tagBadges.length).toBe(4);
    
    const tagTexts = Array.from(tagBadges).map(tb => tb.textContent);
    expect(tagTexts[0]).toContain('Nature');
    expect(tagTexts[0]).toContain('12');
    expect(tagTexts[1]).toContain('Landscape');
    expect(tagTexts[1]).toContain('5');
    expect(tagTexts[2]).toContain('Canon');
    expect(tagTexts[2]).toContain('8');
    expect(tagTexts[3]).toContain('Sony');
    expect(tagTexts[3]).toContain('4');
  });

  it('renders dynamic unique fallback tag groups when tagGroups is not supplied', async () => {
    const root = createRoot(container);
    root.render(
      <UiModernGridPage
        pageTitle="Test Grid"
        items={sampleItems}
        tags={sampleTags}
      />
    );
    await waitForUpdate();

    const headings = Array.from(container.querySelectorAll('.spm-modern-grid-sidebar h3'));
    const headingTexts = headings.map(h => h.textContent);
    
    // Type name mapping: type.charAt(0).toUpperCase() + type.slice(1).replace(/[-_]/g, ' ') + 's';
    // category -> Categorys
    // camera -> Cameras
    expect(headingTexts).toContain('Categorys');
    expect(headingTexts).toContain('Cameras');

    const tagBadges = container.querySelectorAll('.spm-modern-grid-sidebar .spm-tag-badge-container');
    expect(tagBadges.length).toBe(4);
  });

  it('renders sidebarHtml inside the sidebar instead of standard tags when sidebarHtml is provided', async () => {
    const customHtml = '<div class="custom-sidebar-content">Hello Sidebar</div>';
    const root = createRoot(container);
    root.render(
      <UiModernGridPage
        pageTitle="Test Grid"
        items={sampleItems}
        sidebarHtml={customHtml}
        tags={sampleTags}
        tagGroups={sampleTagGroups}
      />
    );
    await waitForUpdate();

    const customContent = container.querySelector('.custom-sidebar-content');
    expect(customContent).toBeTruthy();
    expect(customContent?.textContent).toBe('Hello Sidebar');

    // Should not render tag groups or search when sidebarHtml is provided
    const headings = container.querySelectorAll('.spm-modern-grid-sidebar h3');
    expect(headings.length).toBe(0);
  });

  it('supports pagination bar and floating pagination when pageLinks is supplied', async () => {
    const pageLinks = [
      { label: '<', url: '/prev-page' },
      { label: '1', url: '/page-1' },
      { label: '2', url: '/page-2' },
      { label: '>', url: '/next-page' },
    ];
    
    const root = createRoot(container);
    root.render(
      <UiModernGridPage
        pageTitle="Test Grid"
        items={sampleItems}
        pageLinks={pageLinks}
      />
    );
    await waitForUpdate();

    // Verify pagination bar is rendered in header
    const paginationBar = container.querySelector('.spm-modern-grid-pagination');
    expect(paginationBar).toBeTruthy();

    // Verify floating pagination is rendered
    const floatingPagination = container.querySelector('.spm-floating-pagination');
    expect(floatingPagination).toBeTruthy();
    
    const floatLinks = floatingPagination?.querySelectorAll('a');
    expect(floatLinks?.length).toBe(2);
    expect(floatLinks?.[0].textContent).toContain('Prev');
    expect(floatLinks?.[0].getAttribute('href')).toBe('/prev-page');
    expect(floatLinks?.[1].textContent).toContain('Next');
    expect(floatLinks?.[1].getAttribute('href')).toBe('/next-page');
  });

  it('supports search input when showSearch is true and searchSubmitUrl is provided', async () => {
    const root = createRoot(container);
    root.render(
      <UiModernGridPage
        pageTitle="Test Grid"
        items={sampleItems}
        showSearch={true}
        searchSubmitUrl="/search"
        searchPlaceholder="Custom Placeholder"
        searchDefaultValue="initial-query"
      />
    );
    await waitForUpdate();

    // Search header check
    const headings = Array.from(container.querySelectorAll('.spm-modern-grid-sidebar h3'));
    expect(headings.map(h => h.textContent)).toContain('Search');

    const searchInput = container.querySelector('.spm-modern-grid-sidebar input') as HTMLInputElement;
    expect(searchInput).toBeTruthy();
    expect(searchInput.placeholder).toBe('Custom Placeholder');
    expect(searchInput.value).toBe('initial-query');
  });

  it('calls onLoadMore when scrolling near the bottom', async () => {
    const newItems = [
      { id: 'item-3', title: 'Card Title 3', imageUrl: 'https://example.com/3.jpg', linkUrl: '/item/3' }
    ];
    const onLoadMoreMock = vi.fn().mockResolvedValue({
      items: newItems,
      hasMore: false
    });

    const root = createRoot(container);
    root.render(
      <UiModernGridPage
        pageTitle="Scroll Test"
        items={sampleItems}
        onLoadMore={onLoadMoreMock}
      />
    );
    await waitForUpdate();

    const mainEl = container.querySelector('.spm-modern-grid-main') as HTMLElement;
    expect(mainEl).toBeTruthy();

    // Mock scroll properties: scrollHeight: 1000, scrollTop: 700, clientHeight: 200
    // offset = 1000 - 700 - 200 = 100 <= threshold (300), so it triggers scroll load
    Object.defineProperty(mainEl, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(mainEl, 'scrollTop', { configurable: true, value: 700 });
    Object.defineProperty(mainEl, 'clientHeight', { configurable: true, value: 200 });

    const scrollEvent = new Event('scroll');
    mainEl.dispatchEvent(scrollEvent);

    // Wait for the async onLoadMore call and state updates
    await waitForUpdate();
    await waitForUpdate(); // two updates for async chain

    expect(onLoadMoreMock).toHaveBeenCalledTimes(1);

    // Verify the new item is now rendered in the grid
    const cards = container.querySelectorAll('.spm-image-card');
    expect(cards.length).toBe(3);
    expect(cards[2].getAttribute('id')).toBe('item-3');
    expect(cards[2].querySelector('p')?.textContent).toBe('Card Title 3');
  });

  it('hides/shows sidebar on mobile based on media query matches', async () => {
    // Override window.matchMedia to match mobile screen
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const root = createRoot(container);
    root.render(
      <UiModernGridPage
        pageTitle="Mobile Grid"
        items={sampleItems}
        hideSidebarOnMobile={true}
      />
    );
    await waitForUpdate();

    const sidebar = container.querySelector('.spm-modern-grid-sidebar') as HTMLElement;
    expect(sidebar).toBeTruthy();
    expect(sidebar.style.display).toBe('none'); // showSidebar is false on mobile if hideSidebarOnMobile is true
  });
});
