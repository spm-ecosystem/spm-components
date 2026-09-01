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
});
