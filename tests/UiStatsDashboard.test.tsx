// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UiStatsDashboard, StatSection } from '../dedicated/UiStatsDashboard';

const waitForUpdate = () => new Promise((resolve) => setTimeout(resolve, 50));

describe('UiStatsDashboard', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders pageTitle, dateRangeText, sections, and trend indicators', async () => {
    const sections: StatSection[] = [
      {
        title: 'Top Traffic Sources',
        items: [
          { rank: 1, name: 'Direct Traffic', amount: '12,400', trend: 'up', change: '+15.2%' },
          { rank: 2, name: 'Search Engines', amount: '8,200', trend: 'down', change: '-3.1%' },
          { rank: 3, name: 'Social Referrals', amount: '2,100', trend: 'neutral', change: '0.0%' },
        ],
      },
    ];

    const root = createRoot(container);
    root.render(
      <UiStatsDashboard
        pageTitle="Traffic Analytics"
        dateRangeText="Last 7 Days"
        sections={sections}
      />
    );
    await waitForUpdate();

    expect(container.querySelector('h1')?.textContent).toBe('Traffic Analytics');
    expect(container.textContent).toContain('Last 7 Days');

    const card = container.querySelector('.spm-stat-card');
    expect(card).toBeTruthy();
    expect(card?.querySelector('h3')?.textContent).toBe('Top Traffic Sources');

    const trends = container.querySelectorAll('.spm-stat-trend-indicator');
    expect(trends.length).toBe(3);
    expect(trends[0].textContent).toContain('+15.2%');
    expect(trends[1].textContent).toContain('-3.1%');
  });

  it('tokenizes rank badge colors to CSS variables (--spm-rank-gold-bg, etc.)', async () => {
    const sections: StatSection[] = [
      {
        title: 'Leaderboard',
        items: [
          { place: 1, name: 'First Place', amount: '100' },
          { place: 2, name: 'Second Place', amount: '90' },
          { place: 3, name: 'Third Place', amount: '80' },
        ],
      },
    ];

    const root = createRoot(container);
    root.render(<UiStatsDashboard sections={sections} />);
    await waitForUpdate();

    const rankBadges = container.querySelectorAll('.spm-stat-item > div:first-child > span:first-child');
    expect(rankBadges.length).toBe(3);
    expect((rankBadges[0] as HTMLElement).style.background).toContain('var(--spm-rank-gold-bg');
    expect((rankBadges[1] as HTMLElement).style.background).toContain('var(--spm-rank-silver-bg');
    expect((rankBadges[2] as HTMLElement).style.background).toContain('var(--spm-rank-bronze-bg');
  });

  it('renders sparklineSlot, headerSlot, and toolbarSlot', async () => {
    const root = createRoot(container);
    root.render(
      <UiStatsDashboard
        headerSlot={<div id="test-header">Custom Header</div>}
        toolbarSlot={<div id="test-toolbar">Custom Toolbar</div>}
        sparklineSlot={<div id="test-sparkline">Sparkline Chart Canvas</div>}
      />
    );
    await waitForUpdate();

    expect(container.querySelector('#test-header')?.textContent).toBe('Custom Header');
    expect(container.querySelector('#test-toolbar')?.textContent).toBe('Custom Toolbar');
    expect(container.querySelector('#test-sparkline')?.textContent).toBe('Sparkline Chart Canvas');
  });
});
