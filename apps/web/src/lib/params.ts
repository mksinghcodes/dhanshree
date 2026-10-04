import { use } from 'react';

export function useResolvedParams<T = Record<string, string>>(params: any): T {
  if (params && typeof params.then === 'function') {
    return use(params as Promise<T>);
  }
  return (params || {}) as T;
}
