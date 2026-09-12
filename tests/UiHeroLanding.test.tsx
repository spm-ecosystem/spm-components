// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UiHeroLanding } from '../dedicated/UiHeroLanding';

const waitForUpdate = () => new Promise((resolve) => setTimeout(resolve, 50));

describe('UiHeroLanding', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders siteName, tagline, subtext, CTA, and primary links correctly', async () => {
    const primaryLinks = [
      { label: 'Link 1', url: '/link1' },
      { label: 'Link 2', url: '/link2' },
    ];

    const root = createRoot(container);
    root.render(
      <UiHeroLanding
        siteName="Test Landing"
        tagline="Building modern software"
        subtext="Fast, clean, reliable."
        ctaLabel="Get Started"
        ctaUrl="/start"
        primaryLinks={primaryLinks}
      />
    );
    await waitForUpdate();

    expect(container.textContent).toContain('Test Landing');
    expect(container.querySelector('h1')?.textContent).toBe('Building modern software');
    expect(container.textContent).toContain('Fast, clean, reliable.');
    const ctaBtn = container.querySelector('.spm-hero-cta-button') as HTMLAnchorElement;
    expect(ctaBtn).toBeTruthy();
    expect(ctaBtn.textContent).toBe('Get Started');
    expect(ctaBtn.getAttribute('href')).toBe('/start');

    const navLinks = container.querySelectorAll('nav a');
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].textContent).toBe('Link 1');
  });

  it('supports alignment variants (centered, split-horizontal, left-aligned, compact-banner)', async () => {
    const root = createRoot(container);
    root.render(<UiHeroLanding align="split-horizontal" siteName="Split Landing" />);
    await waitForUpdate();

    let heroDiv = container.querySelector('.spm-hero-landing');
    expect(heroDiv?.classList.contains('spm-hero-split-horizontal')).toBe(true);

    root.render(<UiHeroLanding align="compact-banner" siteName="Compact Landing" />);
    await waitForUpdate();

    heroDiv = container.querySelector('.spm-hero-landing');
    expect(heroDiv?.classList.contains('spm-hero-compact-banner')).toBe(true);
  });

  it('renders actionsSlot, mediaSlot, brandSlot, and backgroundSlot', async () => {
    const root = createRoot(container);
    root.render(
      <UiHeroLanding
        backgroundSlot={<div id="test-bg">Background Video</div>}
        brandSlot={<div id="test-brand">Custom Brand Logo</div>}
        actionsSlot={<button id="test-action">Secondary CTA</button>}
        mediaSlot={<img id="test-media" src="illustration.svg" alt="Illustration" />}
      />
    );
    await waitForUpdate();

    expect(container.querySelector('#test-bg')?.textContent).toBe('Background Video');
    expect(container.querySelector('#test-brand')?.textContent).toBe('Custom Brand Logo');
    expect(container.querySelector('#test-action')?.textContent).toBe('Secondary CTA');
    expect(container.querySelector('#test-media')).toBeTruthy();
  });

  it('supports glassmorphic variant styling', async () => {
    const root = createRoot(container);
    root.render(<UiHeroLanding variant="glassmorphic" siteName="Glass Landing" />);
    await waitForUpdate();

    const heroDiv = container.querySelector('.spm-hero-landing');
    expect(heroDiv?.classList.contains('spm-hero-glassmorphic')).toBe(true);
  });

  it('renders popularTags and popularTagsPrefix correctly', async () => {
    const tags = [
      { label: 'Anime', url: '/tag/anime' },
      { label: 'Art', url: '/tag/art' },
    ];
    const root = createRoot(container);
    root.render(<UiHeroLanding popularTags={tags} popularTagsPrefix="Trending:" />);
    await waitForUpdate();

    const prefix = container.querySelector('.spm-hero-tags-prefix');
    expect(prefix?.textContent).toBe('Trending:');

    const tagChips = container.querySelectorAll('.spm-hero-tag-chip');
    expect(tagChips.length).toBe(2);
    expect(tagChips[0].textContent).toBe('Anime');
    expect(tagChips[0].getAttribute('href')).toBe('/tag/anime');
    expect(tagChips[1].textContent).toBe('Art');
    expect(tagChips[1].getAttribute('href')).toBe('/tag/art');
  });

  it('renders statsText pill badge correctly', async () => {
    const root = createRoot(container);
    root.render(<UiHeroLanding statsText="Serving 5,234,109 posts" />);
    await waitForUpdate();

    const statsBadge = container.querySelector('.spm-hero-stats-badge');
    expect(statsBadge).toBeTruthy();
    expect(statsBadge?.textContent).toBe('Serving 5,234,109 posts');
  });

  it('renders headerSlot, footerSlot, counterSlot, and filterButtonSlot', async () => {
    const root = createRoot(container);
    root.render(
      <UiHeroLanding
        headerSlot={<div id="test-header">Header Navigation</div>}
        footerSlot={<div id="test-footer">Footer Navigation</div>}
        counterSlot={<div id="test-counter">Counter 123</div>}
        filterButtonSlot={<button id="test-filter">Filter</button>}
      />
    );
    await waitForUpdate();

    expect(container.querySelector('#test-header')?.textContent).toBe('Header Navigation');
    expect(container.querySelector('#test-footer')?.textContent).toBe('Footer Navigation');
    expect(container.querySelector('#test-counter')?.textContent).toBe('Counter 123');
    expect(container.querySelector('#test-filter')?.textContent).toBe('Filter');
  });

  it('renders counterSlot HTML string with properly formatted small text styling', async () => {
    const root = createRoot(container);
    const counterHtml = '<div><img src="chibi1.png" /><small>Total Visitors: 42</small></div>';
    root.render(<UiHeroLanding counterSlot={counterHtml} />);
    await waitForUpdate();

    const counterSlotEl = container.querySelector('.spm-hero-counter-slot');
    expect(counterSlotEl).toBeTruthy();
    expect(counterSlotEl?.querySelector('small')?.textContent).toBe('Total Visitors: 42');
    const styleEl = counterSlotEl?.querySelector('style');
    expect(styleEl?.textContent).toContain('.spm-hero-counter-slot small');
    expect(styleEl?.textContent).toContain('text-align: center;');
    expect(styleEl?.textContent).toContain('margin-top: 10px;');
    expect(styleEl?.textContent).toContain('width: 100%;');
  });

  it('renders search bar with default neutral searchPlaceholder ("Search…") and searchParamName ("q")', async () => {
    const root = createRoot(container);
    root.render(<UiHeroLanding searchSubmitUrl="/search" />);
    await waitForUpdate();

    const input = container.querySelector('input[name="q"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Search…');
  });

  it('agnostically separates counter images and counter text into distinct containers', async () => {
    const root = createRoot(container);
    const counterHtml = '<img src="7.gif" /><img src="2.gif" /><br />Total number of visitors so far: 72,678,548';
    root.render(<UiHeroLanding counterSlot={counterHtml} />);
    await waitForUpdate();

    const counterSlotEl = container.querySelector('.spm-hero-counter-slot');
    expect(counterSlotEl).toBeTruthy();

    const imagesContainer = counterSlotEl?.querySelector('.spm-hero-counter-images');
    expect(imagesContainer).toBeTruthy();
    expect(imagesContainer?.querySelectorAll('img').length).toBe(2);

    const textContainer = counterSlotEl?.querySelector('.spm-hero-counter-text');
    expect(textContainer).toBeTruthy();
    expect(textContainer?.textContent).toContain('Total number of visitors so far: 72,678,548');
  });
});
