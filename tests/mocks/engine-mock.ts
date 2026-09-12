import { vi } from 'vitest';

export const triggerProxyClick = vi.fn((_selector: string, _index?: number) => {
  // Mock implementation
});

if (typeof window !== 'undefined') {
  (window as any).spmTriggerProxyClick = triggerProxyClick;
}
