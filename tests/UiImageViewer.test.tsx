// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UiImageViewer } from '../dedicated/UiImageViewer';

const waitForUpdate = () => new Promise((resolve) => setTimeout(resolve, 50));

function simulateImageLoad(img: HTMLImageElement, width: number, height: number) {
  Object.defineProperty(img, 'naturalWidth', { value: width, configurable: true });
  Object.defineProperty(img, 'naturalHeight', { value: height, configurable: true });
  img.dispatchEvent(new Event('load'));
}

describe('UiImageViewer', () => {
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

  it('1. Empty State: renders fallback placeholder when src is missing', async () => {
    const root = createRoot(container);
    root.render(<UiImageViewer />);
    await waitForUpdate();

    expect(container.textContent).toContain('No image');
    const img = container.querySelector('img');
    expect(img).toBeNull();
    const zoomBtn = container.querySelector('[data-testid="zoom-toggle-btn"]');
    expect(zoomBtn).toBeNull();
  });

  it('2. Basic Rendering: renders img element with default contain fit and custom styles', async () => {
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/test.jpg"
        alt="Test Image"
        className="custom-viewer-class"
        background="#112233"
        style={{ margin: '10px' }}
      />
    );
    await waitForUpdate();

    const rootEl = container.querySelector('.spm-image-viewer') as HTMLElement;
    expect(rootEl).not.toBeNull();
    expect(rootEl.className).toContain('custom-viewer-class');
    expect(rootEl.style.background).toBe('rgb(17, 34, 51)');
    expect(rootEl.style.margin).toBe('10px');

    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.src).toBe('https://example.com/test.jpg');
    expect(img.alt).toBe('Test Image');
    expect(img.style.objectFit).toBe('contain');

    const zoomBtn = container.querySelector('[data-testid="zoom-toggle-btn"]');
    expect(zoomBtn).not.toBeNull();
    expect(zoomBtn?.textContent).toContain('Fill');
  });

  it('3. Standard Aspect Ratio: preserves cover fit for normal ratio images (16:9)', async () => {
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/standard.jpg"
        fit="cover"
      />
    );
    await waitForUpdate();

    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).not.toBeNull();

    // 1920 / 1080 = 1.778 (between 0.5 and 2.2)
    simulateImageLoad(img, 1920, 1080);
    await waitForUpdate();

    expect(img.getAttribute('data-extreme-ratio') ?? container.querySelector('.spm-image-viewer')?.getAttribute('data-extreme-ratio')).toBe('false');
    expect(img.style.objectFit).toBe('cover');
    expect(img.getAttribute('data-fit')).toBe('cover');
  });

  it('4. Ultra-Wide Aspect Ratio: automatically falls back from cover to contain for ultra-wide images (> 2.2:1)', async () => {
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/panoramic.jpg"
        fit="cover"
      />
    );
    await waitForUpdate();

    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).not.toBeNull();

    // 3000 / 1000 = 3.0 (> 2.2)
    simulateImageLoad(img, 3000, 1000);
    await waitForUpdate();

    const rootEl = container.querySelector('.spm-image-viewer') as HTMLElement;
    expect(rootEl.getAttribute('data-extreme-ratio')).toBe('true');
    expect(img.style.objectFit).toBe('contain');
    expect(img.getAttribute('data-fit')).toBe('contain');
  });

  it('5. Ultra-Tall Aspect Ratio: automatically falls back from cover to contain for vertical strips (< 0.5:1)', async () => {
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/tall-strip.jpg"
        imageFit="cover"
      />
    );
    await waitForUpdate();

    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).not.toBeNull();

    // 400 / 1000 = 0.4 (< 0.5)
    simulateImageLoad(img, 400, 1000);
    await waitForUpdate();

    const rootEl = container.querySelector('.spm-image-viewer') as HTMLElement;
    expect(rootEl.getAttribute('data-extreme-ratio')).toBe('true');
    expect(img.style.objectFit).toBe('contain');
  });

  it('6. imageFit precedence: imageFit prop overrides fit prop', async () => {
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/precedence.jpg"
        fit="contain"
        imageFit="cover"
      />
    );
    await waitForUpdate();

    const img = container.querySelector('img') as HTMLImageElement;
    simulateImageLoad(img, 1000, 1000); // 1:1 square
    await waitForUpdate();

    expect(img.style.objectFit).toBe('cover');
  });

  it('7. Interactive Zoom Toggle Button: clicking button toggles fit mode and calls onFitChange', async () => {
    const onFitChange = vi.fn();
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/interactive.jpg"
        fit="contain"
        onFitChange={onFitChange}
      />
    );
    await waitForUpdate();

    const img = container.querySelector('img') as HTMLImageElement;
    const zoomBtn = container.querySelector('[data-testid="zoom-toggle-btn"]') as HTMLButtonElement;
    expect(zoomBtn).not.toBeNull();
    expect(img.style.objectFit).toBe('contain');
    expect(zoomBtn.textContent).toContain('Fill');

    // Click 1: Toggle to cover
    zoomBtn.click();
    await waitForUpdate();

    expect(img.style.objectFit).toBe('cover');
    expect(zoomBtn.textContent).toContain('Fit');
    expect(onFitChange).toHaveBeenCalledWith('cover');

    // Click 2: Toggle back to contain
    zoomBtn.click();
    await waitForUpdate();

    expect(img.style.objectFit).toBe('contain');
    expect(zoomBtn.textContent).toContain('Fill');
    expect(onFitChange).toHaveBeenCalledWith('contain');
  });

  it('8. Click-to-Zoom on Image: clicking the image element toggles fit mode and updates cursor', async () => {
    const onFitChange = vi.fn();
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/click-zoom.jpg"
        fit="contain"
        enableZoom={true}
        onFitChange={onFitChange}
      />
    );
    await waitForUpdate();

    const img = container.querySelector('img') as HTMLImageElement;
    expect(img.style.cursor).toBe('zoom-in');
    expect(img.style.objectFit).toBe('contain');

    // Click on image -> zoom in (cover)
    img.click();
    await waitForUpdate();

    expect(img.style.objectFit).toBe('cover');
    expect(img.style.cursor).toBe('zoom-out');
    expect(onFitChange).toHaveBeenCalledWith('cover');

    // Click on image again -> zoom out (contain)
    img.click();
    await waitForUpdate();

    expect(img.style.objectFit).toBe('contain');
    expect(img.style.cursor).toBe('zoom-in');
    expect(onFitChange).toHaveBeenCalledWith('contain');
  });

  it('9. enableZoom=false: hides zoom button and disables click-to-zoom', async () => {
    const onFitChange = vi.fn();
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/no-zoom.jpg"
        fit="contain"
        enableZoom={false}
        onFitChange={onFitChange}
      />
    );
    await waitForUpdate();

    const zoomBtn = container.querySelector('[data-testid="zoom-toggle-btn"]');
    expect(zoomBtn).toBeNull();

    const img = container.querySelector('img') as HTMLImageElement;
    expect(img.style.cursor).toBe('default');

    // Clicking image should do nothing
    img.click();
    await waitForUpdate();

    expect(img.style.objectFit).toBe('contain');
    expect(onFitChange).not.toHaveBeenCalled();
  });

  it('10. Source change reset: resets user zoom state and extreme ratio on src update', async () => {
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/photo1.jpg"
        fit="contain"
      />
    );
    await waitForUpdate();

    const img1 = container.querySelector('img') as HTMLImageElement;
    img1.click(); // User overrides to cover
    await waitForUpdate();
    expect(img1.style.objectFit).toBe('cover');

    // Update src to photo2 with cover
    root.render(
      <UiImageViewer
        src="https://example.com/photo2-ultrawide.jpg"
        fit="cover"
      />
    );
    await waitForUpdate();

    const img2 = container.querySelector('img') as HTMLImageElement;
    simulateImageLoad(img2, 4000, 1000); // 4:1 ultra wide
    await waitForUpdate();

    // Should fall back to contain
    expect(img2.style.objectFit).toBe('contain');
  });
});
