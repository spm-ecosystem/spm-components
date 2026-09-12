import { vi } from 'vitest';

export const triggerProxyClick = vi.fn((selector: string, index?: number) => {
  // Mock implementation
});

if (typeof window !== 'undefined') {
  (window as any).spmTriggerProxyClick = triggerProxyClick;
}
