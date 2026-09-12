// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UiImageViewer } from '../dedicated/UiImageViewer';

const waitForUpdate = () => new Promise((resolve) => setTimeout(resolve, 100));

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

  it('3. Standard Aspect Ratio: preserves cover fit attribute while using objectFit contain with scale for normal ratio images (16:9)', async () => {
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

    simulateImageLoad(img, 1920, 1080);
    await waitForUpdate();

    expect(img.getAttribute('data-extreme-ratio') ?? container.querySelector('.spm-image-viewer')?.getAttribute('data-extreme-ratio')).toBe('false');
    expect(img.style.objectFit).toBe('contain');
    expect(img.getAttribute('data-fit')).toBe('cover');
    expect(img.getAttribute('data-scale')).toBe('1.8');
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

    simulateImageLoad(img, 3000, 1000);
    await waitForUpdate();
    await waitForUpdate();

    const rootEl = container.querySelector('.spm-image-viewer') as HTMLElement;
    expect(rootEl.getAttribute('data-extreme-ratio')).toBe('true');
    expect(img.style.objectFit).toBe('contain');
    expect(img.getAttribute('data-fit')).toBe('contain');
    expect(img.getAttribute('data-scale')).toBe('1');
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

    simulateImageLoad(img, 400, 1000);
    await waitForUpdate();

    const rootEl = container.querySelector('.spm-image-viewer') as HTMLElement;
    expect(rootEl.getAttribute('data-extreme-ratio')).toBe('true');
    expect(img.style.objectFit).toBe('contain');
    expect(img.getAttribute('data-fit')).toBe('contain');
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
    simulateImageLoad(img, 1000, 1000);
    await waitForUpdate();

    expect(img.getAttribute('data-fit')).toBe('cover');
    expect(img.style.objectFit).toBe('contain');
    expect(img.getAttribute('data-scale')).toBe('1.8');
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
    expect(img.getAttribute('data-fit')).toBe('contain');
    expect(zoomBtn.textContent).toContain('Fill');

    // Click 1: Toggle to cover
    zoomBtn.click();
    await waitForUpdate();

    expect(img.style.objectFit).toBe('contain');
    expect(img.getAttribute('data-fit')).toBe('cover');
    expect(img.getAttribute('data-scale')).toBe('1.8');
    expect(zoomBtn.textContent).toContain('Fit');
    expect(onFitChange).toHaveBeenCalledWith('cover');

    // Click 2: Toggle back to contain
    zoomBtn.click();
    await waitForUpdate();

    expect(img.style.objectFit).toBe('contain');
    expect(img.getAttribute('data-fit')).toBe('contain');
    expect(img.getAttribute('data-scale')).toBe('1');
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

    expect(img.style.objectFit).toBe('contain');
    expect(img.getAttribute('data-fit')).toBe('cover');
    expect(img.style.cursor).toBe('grab');
    expect(onFitChange).toHaveBeenCalledWith('cover');

    // Click on image again -> zoom out (contain)
    img.click();
    await waitForUpdate();

    expect(img.style.objectFit).toBe('contain');
    expect(img.getAttribute('data-fit')).toBe('contain');
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
    expect(img1.getAttribute('data-fit')).toBe('cover');

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
    expect(img2.getAttribute('data-fit')).toBe('contain');
  });

  it('11. Interactive Multi-Level Zoom: Zoom In, Zoom Out, and Reset buttons update scale and trigger onScaleChange', async () => {
    const onScaleChange = vi.fn();
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/zoom.jpg"
        onScaleChange={onScaleChange}
        minScale={1}
        maxScale={3}
      />
    );
    await waitForUpdate();

    const zoomInBtn = container.querySelector('[data-testid="zoom-in-btn"]') as HTMLButtonElement;
    const zoomOutBtn = container.querySelector('[data-testid="zoom-out-btn"]') as HTMLButtonElement;
    const resetBtn = container.querySelector('[data-testid="zoom-reset-btn"]') as HTMLButtonElement;
    const img = container.querySelector('img') as HTMLImageElement;

    expect(zoomInBtn).not.toBeNull();
    expect(zoomOutBtn).not.toBeNull();
    expect(resetBtn).not.toBeNull();
    expect(img.style.transform).toBe('translate3d(0px, 0px, 0px) scale(1)');

    // Click Zoom In (+ 0.5 -> 1.5)
    zoomInBtn.click();
    await waitForUpdate();
    expect(img.style.transform).toBe('translate3d(0px, 0px, 0px) scale(1.5)');
    expect(onScaleChange).toHaveBeenCalledWith(1.5);

    // Click Zoom In (+ 0.5 -> 2)
    zoomInBtn.click();
    await waitForUpdate();
    expect(img.style.transform).toBe('translate3d(0px, 0px, 0px) scale(2)');
    expect(onScaleChange).toHaveBeenCalledWith(2);

    // Click Zoom Out (- 0.5 -> 1.5)
    zoomOutBtn.click();
    await waitForUpdate();
    expect(img.style.transform).toBe('translate3d(0px, 0px, 0px) scale(1.5)');
    expect(onScaleChange).toHaveBeenCalledWith(1.5);

    // Click Reset -> scale resets to 1
    resetBtn.click();
    await waitForUpdate();
    expect(img.style.transform).toBe('translate3d(0px, 0px, 0px) scale(1)');
    expect(onScaleChange).toHaveBeenCalledWith(1);
  });

  it('12. Mouse Drag Pan: allows panning when scale > 1 and updates cursor to grab/grabbing', async () => {
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/drag.jpg"
      />
    );
    await waitForUpdate();

    const zoomInBtn = container.querySelector('[data-testid="zoom-in-btn"]') as HTMLButtonElement;
    zoomInBtn.click(); // scale 1.5
    await waitForUpdate();

    const rootEl = container.querySelector('.spm-image-viewer') as HTMLElement;
    const img = container.querySelector('img') as HTMLImageElement;

    expect(rootEl.style.cursor).toBe('grab');

    // Simulate MouseDown
    rootEl.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100, bubbles: true, cancelable: true }));
    await waitForUpdate();
    expect(rootEl.getAttribute('data-dragging')).toBe('true');
    expect(rootEl.style.cursor).toBe('grabbing');

    // Simulate MouseMove
    rootEl.dispatchEvent(new MouseEvent('mousemove', { clientX: 150, clientY: 120, bubbles: true, cancelable: true }));
    await waitForUpdate();
    expect(img.style.transform).toBe('translate3d(50px, 20px, 0px) scale(1.5)');

    // Simulate MouseUp
    rootEl.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await waitForUpdate();
    expect(rootEl.getAttribute('data-dragging')).toBe('false');
    expect(rootEl.style.cursor).toBe('grab');
  });

  it('13. Touch Pan Support: touch events allow panning when zoomed in', async () => {
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/touch.jpg"
      />
    );
    await waitForUpdate();

    const zoomInBtn = container.querySelector('[data-testid="zoom-in-btn"]') as HTMLButtonElement;
    zoomInBtn.click(); // scale 1.5
    await waitForUpdate();

    const rootEl = container.querySelector('.spm-image-viewer') as HTMLElement;
    const img = container.querySelector('img') as HTMLImageElement;

    // Simulate TouchStart
    const touchStart = new CustomEvent('touchstart', { bubbles: true }) as any;
    touchStart.touches = [{ clientX: 200, clientY: 200 }];
    rootEl.dispatchEvent(touchStart);
    await waitForUpdate();

    // Simulate TouchMove
    const touchMove = new CustomEvent('touchmove', { bubbles: true }) as any;
    touchMove.touches = [{ clientX: 230, clientY: 210 }];
    rootEl.dispatchEvent(touchMove);
    await waitForUpdate();

    expect(img.style.transform).toBe('translate3d(30px, 10px, 0px) scale(1.5)');

    // Simulate TouchEnd
    rootEl.dispatchEvent(new CustomEvent('touchend', { bubbles: true }));
    await waitForUpdate();
    expect(rootEl.getAttribute('data-dragging')).toBe('false');
  });

  it('14. Smooth Wheel Zooming: wheel event adjusts scale smoothly and triggers onScaleChange', async () => {
    const onScaleChange = vi.fn();
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/wheel.jpg"
        onScaleChange={onScaleChange}
      />
    );
    await waitForUpdate();

    const rootEl = container.querySelector('.spm-image-viewer') as HTMLElement;
    const img = container.querySelector('img') as HTMLImageElement;

    // Scroll up (zoom in)
    const wheelUp = new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true });
    rootEl.dispatchEvent(wheelUp);
    await waitForUpdate();

    expect(img.style.transform).toBe('translate3d(0px, 0px, 0px) scale(1.25)');
    expect(onScaleChange).toHaveBeenCalledWith(1.25);

    // Scroll down (zoom out)
    const wheelDown = new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });
    rootEl.dispatchEvent(wheelDown);
    await waitForUpdate();

    expect(img.style.transform).toBe('translate3d(0px, 0px, 0px) scale(1)');
    expect(onScaleChange).toHaveBeenCalledWith(1);
  });

  it('15. Fill Mode Mouse Drag Pan: allows panning when fit="cover" using expanded scale', async () => {
    const root = createRoot(container);
    root.render(
      <UiImageViewer
        src="https://example.com/fill-drag.jpg"
        fit="cover"
      />
    );
    await waitForUpdate();

    const rootEl = container.querySelector('.spm-image-viewer') as HTMLElement;
    const img = container.querySelector('img') as HTMLImageElement;

    expect(rootEl.style.cursor).toBe('grab');
    expect(img.style.objectFit).toBe('contain');
    expect(img.getAttribute('data-scale')).toBe('1.8');

    // Simulate MouseDown
    rootEl.dispatchEvent(new MouseEvent('mousedown', { clientX: 200, clientY: 200, bubbles: true, cancelable: true }));
    await waitForUpdate();
    expect(rootEl.getAttribute('data-dragging')).toBe('true');
    expect(rootEl.style.cursor).toBe('grabbing');

    // Simulate MouseMove
    rootEl.dispatchEvent(new MouseEvent('mousemove', { clientX: 240, clientY: 230, bubbles: true, cancelable: true }));
    await waitForUpdate();
    expect(img.style.transform).toBe('translate3d(40px, 30px, 0px) scale(1.8)');

    // Simulate MouseUp
    rootEl.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await waitForUpdate();
    expect(rootEl.getAttribute('data-dragging')).toBe('false');
    expect(rootEl.style.cursor).toBe('grab');
  });
});
