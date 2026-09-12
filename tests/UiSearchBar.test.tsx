// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UiSearchBar } from '../dedicated/UiSearchBar';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiSearchBar', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders input with defaultValue and placeholder', async () => {
    const root = createRoot(container);
    root.render(
      <UiSearchBar
        placeholder="Search tags…"
        defaultValue="cat_ears"
        submitUrl="https://example.com/search"
      />
    );
    await waitForUpdate();

    const input = container.querySelector('input[name="q"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Search tags…');
    expect(input.value).toBe('cat_ears');
  });

  it('automatically parses query parameters from submitUrl and renders them as hidden input fields', async () => {
    const root = createRoot(container);
    root.render(
      <UiSearchBar
        submitUrl="https://safebooru.org/index.php?page=post&s=list"
        queryParamName="tags"
        defaultValue="zenless_zone_zero"
      />
    );
    await waitForUpdate();

    const form = container.querySelector('form') as HTMLFormElement;
    expect(form).toBeTruthy();
    expect(form.getAttribute('action')).toBe('https://safebooru.org/index.php');

    const hiddenPage = container.querySelector('input[type="hidden"][name="page"]') as HTMLInputElement;
    const hiddenS = container.querySelector('input[type="hidden"][name="s"]') as HTMLInputElement;

    expect(hiddenPage).toBeTruthy();
    expect(hiddenPage.value).toBe('post');

    expect(hiddenS).toBeTruthy();
    expect(hiddenS.value).toBe('list');
  });

  it('invokes onSearch callback when submitted', async () => {
    const onSearchMock = vi.fn();
    const root = createRoot(container);
    root.render(
      <UiSearchBar
        defaultValue="test_query"
        onSearch={onSearchMock}
      />
    );
    await waitForUpdate();

    const form = container.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    await waitForUpdate();

    expect(onSearchMock).toHaveBeenCalledWith('test_query');
  });
});
