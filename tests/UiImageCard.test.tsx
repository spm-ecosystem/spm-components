// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UiImageCard } from '../dedicated/UiImageCard';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiImageCard', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('sets aspectRatio="auto" on media container when aspectRatio="auto"', async () => {
    const root = createRoot(container);
    root.render(
      <UiImageCard
        id="test-card"
        imageUrl="https://example.com/test.jpg"
        linkUrl="/test"
        title="Test Image"
        aspectRatio="auto"
      />
    );
    await waitForUpdate();

    const mediaEl = container.querySelector('.spm-image-card-media') as HTMLElement;
    expect(mediaEl).toBeTruthy();
    expect(mediaEl.style.aspectRatio).toBe('auto');
  });

  it('sets preset aspectRatio values correctly on media container', async () => {
    const root = createRoot(container);
    root.render(
      <UiImageCard
        id="test-card-2"
        imageUrl="https://example.com/test2.jpg"
        linkUrl="/test2"
        title="Video Aspect"
        aspectRatio="video"
      />
    );
    await waitForUpdate();

    const mediaEl = container.querySelector('.spm-image-card-media') as HTMLElement;
    expect(mediaEl).toBeTruthy();
    expect(mediaEl.style.aspectRatio).toBe('16 / 9');
  });
});
