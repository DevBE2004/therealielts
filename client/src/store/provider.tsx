'use client';

import { Provider } from 'react-redux';
import { store } from './index';

// ========================================
// REDUX PROVIDER COMPONENT
// ========================================

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;
