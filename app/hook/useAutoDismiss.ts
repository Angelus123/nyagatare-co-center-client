'use client';
import { useEffect } from 'react';
export const useAutoDismiss = (visible: boolean, setVisible: (v: boolean) => void) => {
  useEffect(() => {
    if (!visible) return;
    
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [visible]);
};
