// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UiTableListPage, TableColumnConfig } from '../dedicated/UiTableListPage';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiTableListPage', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders date and currency columns correctly', async () => {
    const columns: TableColumnConfig[] = [
      { key: 'name', header: 'Name', type: 'text' },
      { key: 'created', header: 'Created Date', type: 'date' },
      { key: 'price', header: 'Price', type: 'currency' },
    ];

    const rows = [
      { name: 'Item A', created: '2026-08-20T12:00:00Z', price: 1200 },
      { name: 'Item B', created: '2026-05-15', price: '350.5' },
      { name: 'Item C', created: '', price: null },
    ];

    const root = createRoot(container);
    root.render(<UiTableListPage columns={columns} tableRows={rows} />);
    await waitForUpdate();

    // Check header rendering
    const headers = container.querySelectorAll('th');
    expect(headers.length).toBe(3);
    expect(headers[0].textContent).toContain('Name');
    expect(headers[1].textContent).toContain('Created Date');
    expect(headers[2].textContent).toContain('Price');

    // Check cells rendering
    const cells = container.querySelectorAll('td');
    // Row 1
    expect(cells[0].textContent).toBe('Item A');
    expect(cells[1].textContent).not.toBe('2026-08-20T12:00:00Z');
    expect(cells[2].textContent).toBe('$1,200.00');

    // Row 2
    expect(cells[3].textContent).toBe('Item B');
    expect(cells[4].textContent).not.toBe('2026-05-15');
    expect(cells[5].textContent).toBe('$350.50');

    // Row 3 (empty values)
    expect(cells[6].textContent).toBe('Item C');
    expect(cells[7].textContent).toBe('-');
    expect(cells[8].textContent).toBe('-');
  });

  it('sorts date and currency columns correctly', async () => {
    const columns: TableColumnConfig[] = [
      { key: 'name', header: 'Name', type: 'text' },
      { key: 'created', header: 'Created Date', type: 'date' },
      { key: 'price', header: 'Price', type: 'currency' },
    ];

    const rows = [
      { name: 'Item A', created: '2026-08-20', price: 1200 },
      { name: 'Item B', created: '2026-05-15', price: 350.5 },
      { name: 'Item C', created: '2026-06-10', price: 2000 },
    ];

    const root = createRoot(container);
    root.render(<UiTableListPage columns={columns} tableRows={rows} />);
    await waitForUpdate();

    // Let's click the PRICE header to sort asc
    const headers = container.querySelectorAll('th');
    const priceHeader = headers[2];

    priceHeader.click();
    await waitForUpdate();

    // Check order: Item B ($350.50), Item A ($1,200.00), Item C ($2,000.00)
    let cells = container.querySelectorAll('td');
    expect(cells[0].textContent).toBe('Item B');
    expect(cells[3].textContent).toBe('Item A');
    expect(cells[6].textContent).toBe('Item C');

    // Click again to sort desc
    priceHeader.click();
    await waitForUpdate();

    // Check order: Item C ($2,000.00), Item A ($1,200.00), Item B ($350.50)
    cells = container.querySelectorAll('td');
    expect(cells[0].textContent).toBe('Item C');
    expect(cells[3].textContent).toBe('Item A');
    expect(cells[6].textContent).toBe('Item B');

    // Click the CREATED DATE header to sort by date
    const dateHeader = headers[1];
    dateHeader.click();
    await waitForUpdate();

    // Check date asc order: Item B (May 15), Item C (Jun 10), Item A (Aug 20)
    cells = container.querySelectorAll('td');
    expect(cells[0].textContent).toBe('Item B');
    expect(cells[3].textContent).toBe('Item C');
    expect(cells[6].textContent).toBe('Item A');
  });
});
