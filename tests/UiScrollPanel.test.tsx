// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UiScrollPanel } from '../dedicated/UiScrollPanel';
const mockTriggerProxyClick = vi.fn();
vi.mock('../../content/engine', () => ({
  triggerProxyClick: (selector: string, index?: number) => {
    if (index !== undefined) {
      mockTriggerProxyClick(selector, index);
    } else {
      mockTriggerProxyClick(selector);
    }
  },
}));

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiScrollPanel', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Empty Sidebar & Divider Isolation', () => {
    it('renders no <aside> or <hr> element when tags array is empty and no other content is provided', async () => {
      const root = createRoot(container);
      root.render(<UiScrollPanel tags={[]} />);
      await waitForUpdate();

      expect(container.querySelector('aside')).toBeNull();
      expect(container.querySelector('hr')).toBeNull();
      expect(container.innerHTML).toBe('');
    });

    it('renders no <aside> or <hr> when tags=[], buttons=[], statisticsHtml=undefined, and onClose is provided', async () => {
      const onClose = vi.fn();
      const root = createRoot(container);
      root.render(
        <UiScrollPanel
          tags={[]}
          buttons={[]}
          statisticsHtml={undefined}
          onClose={onClose}
        />
      );
      await waitForUpdate();

      expect(container.querySelector('aside')).toBeNull();
      expect(container.querySelector('hr')).toBeNull();
      expect(container.querySelector('button')).toBeNull();
      expect(container.innerHTML).toBe('');
    });

    it('renders no <aside> or <hr> when statisticsHtml is an empty whitespace string and no other content', async () => {
      const root = createRoot(container);
      root.render(
        <UiScrollPanel
          tags={[]}
          buttons={[]}
          statisticsHtml="   "
        />
      );
      await waitForUpdate();

      expect(container.querySelector('aside')).toBeNull();
      expect(container.querySelector('hr')).toBeNull();
      expect(container.innerHTML).toBe('');
    });

    it('renders no <hr> divider when only tags are present without action buttons', async () => {
      const root = createRoot(container);
      root.render(
        <UiScrollPanel
          tags={[{ name: 'solo_tag', type: 'general' }]}
          buttons={[]}
        />
      );
      await waitForUpdate();

      const aside = container.querySelector('aside');
      expect(aside).toBeTruthy();
      expect(container.querySelector('hr')).toBeNull();
      expect(container.textContent).toContain('solo_tag');
    });

    it('renders no <hr> divider when only buttons are present without tags or statistics', async () => {
      const root = createRoot(container);
      root.render(
        <UiScrollPanel
          tags={[]}
          buttons={[{ label: 'Previous' }]}
        />
      );
      await waitForUpdate();

      const aside = container.querySelector('aside');
      expect(aside).toBeTruthy();
      expect(container.querySelector('hr')).toBeNull();
      expect(container.textContent).toContain('Previous');
    });

    it('renders an <hr> divider when both action buttons and tags are present', async () => {
      const root = createRoot(container);
      root.render(
        <UiScrollPanel
          tags={[{ name: 'hatsune_miku', type: 'character' }]}
          buttons={[{ label: 'Next' }]}
        />
      );
      await waitForUpdate();

      expect(container.querySelector('aside')).toBeTruthy();
      expect(container.querySelector('hr')).toBeTruthy();
    });

    it('renders an <hr> divider when both action buttons and statisticsHtml are present', async () => {
      const root = createRoot(container);
      root.render(
        <UiScrollPanel
          tags={[]}
          buttons={[{ label: 'Download' }]}
          statisticsHtml="<p>Score: 99</p>"
        />
      );
      await waitForUpdate();

      expect(container.querySelector('aside')).toBeTruthy();
      expect(container.querySelector('hr')).toBeTruthy();
      expect(container.innerHTML).toContain('Score: 99');
    });
  });

  describe('Tag Word Break & Overflow Wrapping', () => {
    it('applies word-break: break-word, overflow-wrap: anywhere, and flex-wrap: wrap to tag badge group containers', async () => {
      const longTag = 'super_ultra_extremely_long_unbroken_tag_name_that_could_overflow_the_sidebar_container_width';
      const root = createRoot(container);
      root.render(
        <UiScrollPanel
          tags={[{ name: longTag, type: 'general', count: '100' }]}
        />
      );
      await waitForUpdate();

      const groupContainer = container.querySelector('.spm-tag-group-container') as HTMLDivElement;
      expect(groupContainer).toBeTruthy();
      expect(groupContainer.style.display).toBe('flex');
      expect(groupContainer.style.flexWrap).toBe('wrap');
      expect(groupContainer.style.wordBreak).toBe('break-word');
      expect(groupContainer.style.overflowWrap).toBe('anywhere');

      const aside = container.querySelector('aside') as HTMLElement;
      expect(aside.style.overflowX).toBe('hidden');
      expect(aside.style.wordBreak).toBe('break-word');
      expect(aside.style.overflowWrap).toBe('anywhere');

      const tagText = container.textContent;
      expect(tagText).toContain(longTag);
    });

    it('passes word-break and overflow-wrap styles to individual UiTagBadge components', async () => {
      const longTag = 'very_long_tag_name_with_extra_characters_1234567890';
      const root = createRoot(container);
      root.render(
        <UiScrollPanel
          tags={[{ name: longTag, type: 'artist', url: '/artist/1' }]}
        />
      );
      await waitForUpdate();

      const badgeDiv = container.querySelector('.spm-tag-badge-container div') as HTMLDivElement;
      expect(badgeDiv).toBeTruthy();
      expect(badgeDiv.style.wordBreak).toBe('break-word');
      expect(badgeDiv.style.overflowWrap).toBe('anywhere');
      expect(badgeDiv.style.maxWidth).toBe('100%');
    });
  });

  describe('Content Rendering & Interaction', () => {
    it('renders tags categorized into appropriate sections, including fallback for untyped tags', async () => {
      const tags = [
        { name: 'module_1', type: 'modules' },
        { name: 'tech_1', type: 'technology' },
        { name: 'cat_1', type: 'categories' },
        { name: 'tag_1', type: 'general' },
        { name: 'meta_1', type: 'meta' },
        { name: 'untyped_tag', type: '' },
      ];
      const root = createRoot(container);
      root.render(<UiScrollPanel tags={tags} />);
      await waitForUpdate();

      const aside = container.querySelector('aside');
      expect(aside).toBeTruthy();

      const headings = Array.from(container.querySelectorAll('aside p')).map(p => p.textContent);
      expect(headings).toContain('MODULES');
      expect(headings).toContain('TECHNOLOGY');
      expect(headings).toContain('CATEGORIES');
      expect(headings).toContain('TAGS');
      expect(headings).toContain('METADATA');

      expect(container.textContent).toContain('untyped_tag');
    });

    it('renders search bar when showSearch and searchSubmitUrl are provided', async () => {
      const root = createRoot(container);
      root.render(
        <UiScrollPanel
          tags={[]}
          showSearch={true}
          searchPlaceholder="Find images..."
          searchSubmitUrl="/search"
          searchParamName="tags"
        />
      );
      await waitForUpdate();

      const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      expect(searchInput).toBeTruthy();
      expect(searchInput.placeholder).toBe('Find images...');
    });

    it('triggers proxy click when clicking action button with targetSelector', async () => {
      const buttons = [
        { label: 'Next Page', targetSelector: '#pagination-next' },
        { label: 'Original', url: 'https://example.com/original.jpg' },
      ];
      const root = createRoot(container);
      root.render(<UiScrollPanel buttons={buttons} />);
      await waitForUpdate();

      const links = container.querySelectorAll('aside a');
      expect(links.length).toBe(2);

      const nextLink = links[0] as HTMLAnchorElement;
      nextLink.click();
      expect(mockTriggerProxyClick).toHaveBeenCalledWith('#pagination-next');
    });

    it('calls onClose callback when close button is clicked', async () => {
      const onClose = vi.fn();
      const root = createRoot(container);
      root.render(
        <UiScrollPanel
          tags={[{ name: 'sample', type: 'general' }]}
          onClose={onClose}
        />
      );
      await waitForUpdate();

      const closeButton = container.querySelector('button') as HTMLButtonElement;
      expect(closeButton).toBeTruthy();
      closeButton.click();
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
