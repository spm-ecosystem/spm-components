// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UiPostDetails } from '../dedicated/UiPostDetails';
import { triggerProxyClick } from './mocks/engine-mock';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiPostDetails', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders image, layout, search bar, tags, statistics, and buttons correctly', async () => {
    const imageUrl = 'https://example.com/image.png';
    const tags = [
      { name: 'artist_name', count: '15', type: 'artist', url: '/search?q=artist_name' },
      { name: 'tag1', count: '100', type: 'general', url: '/search?q=tag1' },
      { name: 'tag2', count: '50', type: 'general', url: '/search?q=tag2' },
    ];
    const tagGroups = [
      { title: 'Artists', typeKey: 'artist' },
      { title: 'General Tags', typeKey: 'general' },
    ];
    const statisticsHtml = '<p>Views: 1234</p><p>Score: 56</p>';
    const buttons = [
      { label: 'Previous', url: '/prev', iconSvg: '<svg>prev</svg>' },
      { label: 'Next', url: '/next', targetSelector: '#next-button-selector', iconSvg: '<svg>next</svg>' },
      { label: 'Download', url: '/download' },
    ];

    const root = createRoot(container);
    root.render(
      <UiPostDetails
        imageUrl={imageUrl}
        tags={tags}
        tagGroups={tagGroups}
        statisticsHtml={statisticsHtml}
        buttons={buttons}
        showSearch={true}
        searchPlaceholder="Custom Search"
        searchSubmitUrl="/search"
        searchParamName="q"
      />
    );
    await waitForUpdate();

    // 1. Assert Image Container & Image URL
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toBe(imageUrl);
    expect(img.alt).toBe('Booru Post');

    // 2. Assert Sidebar Search
    const searchBar = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(searchBar).toBeTruthy();
    expect(searchBar.placeholder).toBe('Custom Search');

    // 3. Assert Tag Groups and Tags
    const sidebar = container.querySelector('aside');
    expect(sidebar).toBeTruthy();
    
    // Renders "Artists" and "General Tags"
    const headings = Array.from(sidebar!.querySelectorAll('h3')).map(h => h.textContent);
    expect(headings).toContain('Artists');
    expect(headings).toContain('General Tags');
    expect(headings).toContain('Statistics');

    // Check tags text and links
    const badgeContainers = container.querySelectorAll('.spm-tag-badge-container');
    expect(badgeContainers.length).toBe(3);
    
    const artistBadge = badgeContainers[0];
    expect(artistBadge.textContent).toContain('artist_name');
    expect(artistBadge.textContent).toContain('15');
    const artistLink = artistBadge.querySelector('a') as HTMLAnchorElement;
    expect(artistLink.getAttribute('href')).toBe('/search?q=artist_name');

    // 4. Assert Statistics Html
    expect(container.innerHTML).toContain('Views: 1234');
    expect(container.innerHTML).toContain('Score: 56');

    // 5. Assert Action Buttons
    const actionButtons = container.querySelectorAll('main a');
    expect(actionButtons.length).toBe(3);
    
    // Check icons and label texts
    expect(actionButtons[0].textContent).toContain('Previous');
    expect(actionButtons[0].querySelector('svg')).toBeTruthy();
    expect(actionButtons[1].textContent).toContain('Next');
    expect(actionButtons[2].textContent).toContain('Download');
  });

  it('handles clicking buttons and calls triggerProxyClick when targetSelector is provided', async () => {
    const imageUrl = 'https://example.com/image.png';
    const buttons = [
      { label: 'Prev', url: '/prev' }, // no targetSelector
      { label: 'Next', url: '/next', targetSelector: '#next-btn' }, // has targetSelector
    ];

    const root = createRoot(container);
    root.render(
      <UiPostDetails
        imageUrl={imageUrl}
        buttons={buttons}
        showSearch={false}
      />
    );
    await waitForUpdate();

    const btnLinks = container.querySelectorAll('main a');
    expect(btnLinks.length).toBe(2);

    // Click first button (no targetSelector)
    const prevBtn = btnLinks[0] as HTMLAnchorElement;
    prevBtn.click();
    expect(triggerProxyClick).not.toHaveBeenCalled();

    // Click second button (has targetSelector)
    const nextBtn = btnLinks[1] as HTMLAnchorElement;
    nextBtn.click();
    expect(triggerProxyClick).toHaveBeenCalledTimes(1);
    expect(triggerProxyClick).toHaveBeenCalledWith('#next-btn');
  });

  it('renders default fallback tag groups when tagGroups is not provided', async () => {
    const imageUrl = 'https://example.com/image.png';
    const tags = [
      { name: 'tag1', count: '10', type: 'general', url: '/q1' },
      { name: 'tag2', count: '20', type: 'artist', url: '/q2' },
      { name: 'tag3', count: '30', type: '', url: '/q3' }, // fallback type 'general'
    ];

    const root = createRoot(container);
    root.render(
      <UiPostDetails
        imageUrl={imageUrl}
        tags={tags}
        showSearch={false}
      />
    );
    await waitForUpdate();

    // Generates unique types capitalization: general -> Generals, artist -> Artists
    const headings = Array.from(container.querySelectorAll('aside h3')).map(h => h.textContent);
    expect(headings).toContain('Generals');
    expect(headings).toContain('Artists');
  });

  it('does not render search bar when showSearch is false or searchSubmitUrl is not provided', async () => {
    const imageUrl = 'https://example.com/image.png';

    const root = createRoot(container);
    root.render(
      <UiPostDetails
        imageUrl={imageUrl}
        showSearch={false}
        searchSubmitUrl="/search"
      />
    );
    await waitForUpdate();
    expect(container.querySelector('input[type="text"]')).toBeNull();

    root.render(
      <UiPostDetails
        imageUrl={imageUrl}
        showSearch={true}
        searchSubmitUrl=""
      />
    );
    await waitForUpdate();
    expect(container.querySelector('input[type="text"]')).toBeNull();
  });
});
