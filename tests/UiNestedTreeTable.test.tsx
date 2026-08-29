// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UiNestedTreeTable, TreeNode, TreeColumn } from '../dedicated/UiNestedTreeTable';

const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

describe('UiNestedTreeTable', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders title, table headers, and root items correctly', async () => {
    const columns: TreeColumn[] = [
      { key: 'size', title: 'File Size', width: '100px' },
      { key: 'type', title: 'File Type' },
    ];
    const data: TreeNode[] = [
      { id: '1', label: 'src', values: { size: '4 KB', type: 'Folder' }, icon: '📁' },
      { id: '2', label: 'package.json', values: { size: '1 KB', type: 'JSON' }, icon: '📄' },
    ];

    const root = createRoot(container);
    root.render(
      <UiNestedTreeTable
        title="Project Explorer"
        columns={columns}
        data={data}
      />
    );
    await waitForUpdate();

    // Verify Title
    const titleEl = container.querySelector('.spm-tree-table-container > div');
    expect(titleEl?.textContent).toBe('Project Explorer');

    // Verify Headers
    const ths = container.querySelectorAll('thead th');
    expect(ths.length).toBe(3); // Structure + File Size + File Type
    expect(ths[0].textContent).toBe('Structure');
    expect(ths[1].textContent).toBe('File Size');
    expect(ths[2].textContent).toBe('File Type');

    // Verify Rows
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    expect(rows[0].textContent).toContain('📁');
    expect(rows[0].textContent).toContain('src');
    expect(rows[0].textContent).toContain('4 KB');
    expect(rows[0].textContent).toContain('Folder');

    expect(rows[1].textContent).toContain('📄');
    expect(rows[1].textContent).toContain('package.json');
    expect(rows[1].textContent).toContain('1 KB');
    expect(rows[1].textContent).toContain('JSON');
  });

  it('renders nested children when depth < expandedDepth and toggles expansion on button click', async () => {
    const data: TreeNode[] = [
      {
        id: 'parent',
        label: 'Parent Node',
        children: [
          {
            id: 'child-1',
            label: 'Child Node 1',
            values: { info: 'detail-1' },
          },
          {
            id: 'child-2',
            label: 'Child Node 2',
            children: [
              {
                id: 'grandchild-1',
                label: 'Grandchild Node 1',
              },
            ],
          },
        ],
      },
    ];

    const root = createRoot(container);
    // expandedDepth = 1 => root (depth 0) is expanded by default, depth 1 is collapsed
    root.render(
      <UiNestedTreeTable
        columns={[{ key: 'info', title: 'Info' }]}
        data={data}
        expandedDepth={1}
      />
    );
    await waitForUpdate();

    // Depth 0 parent is expanded, so child-1 and child-2 should be visible
    expect(container.textContent).toContain('Parent Node');
    expect(container.textContent).toContain('Child Node 1');
    expect(container.textContent).toContain('Child Node 2');
    // Depth 1 child-2 is collapsed by default because depth 1 is not < expandedDepth 1
    expect(container.textContent).not.toContain('Grandchild Node 1');

    // Find the toggle button for Child Node 2
    let buttons = container.querySelectorAll('tbody button');
    expect(buttons.length).toBe(2); // parent toggle + child-2 toggle

    expect(buttons[0].textContent).toBe('▼');
    expect(buttons[1].textContent).toBe('►');

    // Expand Child 2
    buttons[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForUpdate();

    expect(container.textContent).toContain('Grandchild Node 1');
    buttons = container.querySelectorAll('tbody button');
    expect(buttons[1].textContent).toBe('▼');

    // Collapse Child 2
    buttons[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForUpdate();

    expect(container.textContent).not.toContain('Grandchild Node 1');
    buttons = container.querySelectorAll('tbody button');
    expect(buttons[1].textContent).toBe('►');

    // Collapse Parent
    buttons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForUpdate();

    expect(container.textContent).toContain('Parent Node');
    expect(container.textContent).not.toContain('Child Node 1');
    expect(container.textContent).not.toContain('Child Node 2');
    buttons = container.querySelectorAll('tbody button');
    expect(buttons[0].textContent).toBe('►');
  });

  it('renders default values and handles empty data gracefully', async () => {
    const root = createRoot(container);
    root.render(<UiNestedTreeTable />);
    await waitForUpdate();

    expect(container.querySelector('.spm-tree-table-container')).not.toBeNull();
    expect(container.querySelectorAll('tbody tr').length).toBe(0);
    expect(container.querySelector('.spm-tree-table-container > div')).toBeNull(); // no title rendered
  });

  it('applies custom className and style props', async () => {
    const root = createRoot(container);
    root.render(
      <UiNestedTreeTable
        className="custom-tree-table"
        style={{ marginTop: '20px', border: '2px solid red' }}
      />
    );
    await waitForUpdate();

    const wrapper = container.querySelector('.spm-tree-table-container') as HTMLDivElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper.classList.contains('custom-tree-table')).toBe(true);
    expect(wrapper.style.marginTop).toBe('20px');
    expect(wrapper.style.border).toBe('2px solid red');
  });
});
