// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UiDashboardPage, DashboardCard } from '../dedicated/UiDashboardPage';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiDashboardPage', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders pageTitle and subTitle header correctly', async () => {
    const root = createRoot(container);
    
    // Test with default title and no subtitle
    root.render(<UiDashboardPage />);
    await waitForUpdate();

    const h1Default = container.querySelector('h1');
    expect(h1Default).not.toBeNull();
    expect(h1Default?.textContent).toBe('Dashboard');
    expect(container.querySelector('header p')).toBeNull();

    // Test with custom title and subtitle
    root.render(<UiDashboardPage pageTitle="Admin Portal" subTitle="Manage system settings and plugins" />);
    await waitForUpdate();

    const h1Custom = container.querySelector('h1');
    expect(h1Custom?.textContent).toBe('Admin Portal');
    
    const subtitleElement = container.querySelector('header p');
    expect(subtitleElement).not.toBeNull();
    expect(subtitleElement?.textContent).toBe('Manage system settings and plugins');
  });

  it('shows "No options available." when cards list is empty', async () => {
    const root = createRoot(container);
    root.render(<UiDashboardPage cards={[]} />);
    await waitForUpdate();

    const mainDiv = container.querySelector('main');
    expect(mainDiv?.textContent?.trim()).toBe('No options available.');
  });

  it('renders a list of dashboard cards with their title, description, and links', async () => {
    const cards: DashboardCard[] = [
      {
        title: 'Packages',
        description: 'Install and update packages.',
        url: '/packages',
        urlLabel: 'Manage',
      },
      {
        title: 'Settings',
        description: 'Edit configuration settings.',
        url: '/settings',
      },
      {
        title: 'Updates',
        url: '/updates',
        urlLabel: 'Check now',
      }
    ];

    const root = createRoot(container);
    root.render(<UiDashboardPage cards={cards} />);
    await waitForUpdate();

    const cardElements = container.querySelectorAll('main > div');
    expect(cardElements.length).toBe(3);

    // Card 1: title, description, and custom urlLabel
    const h3_0 = cardElements[0].querySelector('h3');
    const a_0 = cardElements[0].querySelector('a');
    const p_0 = cardElements[0].querySelector('p');
    expect(h3_0?.textContent).toBe('Packages');
    expect(a_0?.getAttribute('href')).toBe('/packages');
    expect(a_0?.textContent).toBe('Manage');
    expect(p_0?.textContent).toBe('Install and update packages.');

    // Card 2: title, description, and fallback urlLabel
    const h3_1 = cardElements[1].querySelector('h3');
    const a_1 = cardElements[1].querySelector('a');
    const p_1 = cardElements[1].querySelector('p');
    expect(h3_1?.textContent).toBe('Settings');
    expect(a_1?.getAttribute('href')).toBe('/settings');
    expect(a_1?.textContent).toBe('Open →');
    expect(p_1?.textContent).toBe('Edit configuration settings.');

    // Card 3: title, no description, and custom urlLabel
    const h3_2 = cardElements[2].querySelector('h3');
    const a_2 = cardElements[2].querySelector('a');
    const p_2 = cardElements[2].querySelector('p');
    expect(h3_2?.textContent).toBe('Updates');
    expect(a_2?.getAttribute('href')).toBe('/updates');
    expect(a_2?.textContent).toBe('Check now');
    expect(p_2).toBeNull();
  });

  it('respects optional height, className, and style props', async () => {
    const root = createRoot(container);
    root.render(
      <UiDashboardPage
        height="400px"
        className="test-dashboard-class"
        style={{ opacity: 0.5 }}
      />
    );
    await waitForUpdate();

    const outerDiv = container.querySelector('.test-dashboard-class') as HTMLDivElement;
    expect(outerDiv).not.toBeNull();
    expect(outerDiv.style.height).toBe('400px');
    expect(outerDiv.style.opacity).toBe('0.5');
  });
});
