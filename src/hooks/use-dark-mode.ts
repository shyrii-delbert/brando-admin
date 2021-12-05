import { useEffect } from 'react';

export const useDarkMode = () => {
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    if (mql.matches) {
      document.body.setAttribute('theme-mode', 'dark');
    }

    function matchMode(e: MediaQueryListEvent) {
      const body = document.body;
      if (e.matches) {
        if (!body.hasAttribute('theme-mode')) {
          body.setAttribute('theme-mode', 'dark');
        }
      } else {
        if (body.hasAttribute('theme-mode')) {
          body.removeAttribute('theme-mode');
        }
      }
    }

    mql.addEventListener('change', matchMode);

    return () => {
      mql.removeEventListener('change', matchMode);
    };
  }, []);
};
