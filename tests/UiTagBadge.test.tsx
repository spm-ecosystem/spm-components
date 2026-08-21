// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UiTagBadge } from '../dedicated/UiTagBadge';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiTagBadge', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders only the label as a non-link when only label is provided', async () => {
    const root = createRoot(container);
    root.render(<UiTagBadge label="TypeScript" />);
    await waitForUpdate();

    // The label should be in a span (not an anchor) since href is not provided
    const span = container.querySelector('span span');
    expect(span).toBeTruthy();
    expect(span?.textContent).toBe('TypeScript');
    expect(span?.getAttribute('style')).toContain('font-weight: 600');

    // No anchors should be present
    const anchors = container.querySelectorAll('a');
    expect(anchors.length).toBe(0);

    // No count badge should be present
    const badges = container.querySelectorAll('span');
    // Expecting 2 span tags (the container span, and the label span)
    expect(badges.length).toBe(2);
  });

  it('renders label and count correctly', async () => {
    const root = createRoot(container);
    root.render(<UiTagBadge label="React" count={42} />);
    await waitForUpdate();

    // Renders label
    const labelSpan = container.querySelector('span span:first-of-type');
    expect(labelSpan?.textContent).toBe('React');

    // Renders count
    const spans = container.querySelectorAll('span');
    // container (0), outer div wrapper (has no tag, it's div), inner span for label, inner span for count.
    // Let's find the span containing "42"
    let countSpan: HTMLSpanElement | null = null;
    spans.forEach(span => {
      if (span.textContent === '42') {
        countSpan = span as HTMLSpanElement;
      }
    });
    expect(countSpan).toBeTruthy();
    expect(countSpan?.style.fontSize).toBe('9px');
  });

  it('renders main label as an anchor when href is provided', async () => {
    const root = createRoot(container);
    root.render(<UiTagBadge label="Vue" href="https://vuejs.org" />);
    await waitForUpdate();

    const anchor = container.querySelector('a');
    expect(anchor).toBeTruthy();
    expect(anchor?.getAttribute('href')).toBe('https://vuejs.org');
    expect(anchor?.textContent).toBe('Vue');
  });

  it('renders add action (+ anchor) when addUrl is provided', async () => {
    const root = createRoot(container);
    root.render(<UiTagBadge label="Svelte" addUrl="https://svelte.dev/add" />);
    await waitForUpdate();

    const anchors = container.querySelectorAll('a');
    expect(anchors.length).toBe(1);
    expect(anchors[0].getAttribute('href')).toBe('https://svelte.dev/add');
    expect(anchors[0].textContent).toBe('+');
    expect(anchors[0].getAttribute('title')).toBe('Add to search');
  });

  it('renders remove action (- anchor) when removeUrl is provided', async () => {
    const root = createRoot(container);
    root.render(<UiTagBadge label="Angular" removeUrl="https://angular.io/remove" />);
    await waitForUpdate();

    const anchors = container.querySelectorAll('a');
    expect(anchors.length).toBe(1);
    expect(anchors[0].getAttribute('href')).toBe('https://angular.io/remove');
    expect(anchors[0].textContent).toBe('-');
    expect(anchors[0].getAttribute('title')).toBe('Exclude from search');
  });

  it('renders everything (addUrl, removeUrl, href, count) correctly', async () => {
    const root = createRoot(container);
    root.render(
      <UiTagBadge
        label="Ember"
        count="15"
        href="https://emberjs.com"
        addUrl="https://emberjs.com/add"
        removeUrl="https://emberjs.com/remove"
      />
    );
    await waitForUpdate();

    // We should have 3 anchors: add, remove, and main label
    const anchors = container.querySelectorAll('a');
    expect(anchors.length).toBe(3);

    expect(anchors[0].getAttribute('href')).toBe('https://emberjs.com/add');
    expect(anchors[0].textContent).toBe('+');

    expect(anchors[1].getAttribute('href')).toBe('https://emberjs.com/remove');
    expect(anchors[1].textContent).toBe('-');

    expect(anchors[2].getAttribute('href')).toBe('https://emberjs.com');
    expect(anchors[2].textContent).toBe('Ember');

    // Count should be rendered
    const spans = container.querySelectorAll('span');
    let hasCount = false;
    spans.forEach(span => {
      if (span.textContent === '15') {
        hasCount = true;
      }
    });
    expect(hasCount).toBe(true);
  });

  it('triggers interactive styles on hover events', async () => {
    const root = createRoot(container);
    root.render(
      <UiTagBadge
        label="Interactive"
        href="https://interactive.dev"
        addUrl="https://interactive.dev/add"
        removeUrl="https://interactive.dev/remove"
      />
    );
    await waitForUpdate();

    // Find the badge wrapper div (it has onMouseEnter and onMouseLeave)
    const badgeWrapper = container.querySelector('span > div');
    expect(badgeWrapper).toBeTruthy();

    // Trigger hover on wrapper using mouseover
    badgeWrapper?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: document.body }));
    expect((badgeWrapper as HTMLElement).style.borderColor).toBe('var(--spm-accent)');
    expect((badgeWrapper as HTMLElement).style.background).toBe('var(--spm-bg-secondary)');

    // Trigger leave on wrapper using mouseout
    badgeWrapper?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body }));
    expect((badgeWrapper as HTMLElement).style.borderColor).toBe('var(--spm-border)');
    expect((badgeWrapper as HTMLElement).style.background).toBe('var(--spm-bg-tertiary)');

    // Check add link hover
    const addAnchor = container.querySelector('a[title="Add to search"]');
    expect(addAnchor).toBeTruthy();
    addAnchor?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: document.body }));
    expect((addAnchor as HTMLElement).style.color).toBe('rgb(34, 197, 94)'); // green (#22c55e)
    expect((addAnchor as HTMLElement).style.background).toBe('rgba(34, 197, 94, 0.15)');

    addAnchor?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body }));
    expect((addAnchor as HTMLElement).style.color).toBe('var(--spm-text-muted)');
    expect((addAnchor as HTMLElement).style.background).toBe('transparent');

    // Check remove link hover
    const removeAnchor = container.querySelector('a[title="Exclude from search"]');
    expect(removeAnchor).toBeTruthy();
    removeAnchor?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: document.body }));
    expect((removeAnchor as HTMLElement).style.color).toBe('rgb(239, 68, 68)'); // red (#ef4444)
    expect((removeAnchor as HTMLElement).style.background).toBe('rgba(239, 68, 68, 0.15)');

    removeAnchor?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body }));
    expect((removeAnchor as HTMLElement).style.color).toBe('var(--spm-text-muted)');
    expect((removeAnchor as HTMLElement).style.background).toBe('transparent');

    // Check main link hover
    const mainAnchor = container.querySelector('a:not([title])');
    expect(mainAnchor).toBeTruthy();
    mainAnchor?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: document.body }));
    expect((mainAnchor as HTMLElement).style.color).toBe('var(--spm-accent)');

    mainAnchor?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body }));
    expect((mainAnchor as HTMLElement).style.color).toBe('inherit');
  });
});
