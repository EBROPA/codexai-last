import React, { createContext, useContext, useEffect, useState } from 'react';

interface RouterContextType {
  pathname: string;
  query: Record<string, string>;
  push: (href: string) => void;
  back: () => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

// Helper to get path from hash
const getHashPath = () => {
  // Get hash, remove first char '#'.
  const hash = window.location.hash.slice(1);
  // If empty, default to '/'
  if (!hash) return '/';
  
  // Extract path part (before '?')
  return hash.split('?')[0]; 
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState('/');
  const [query, setQuery] = useState<Record<string, string>>({});

  useEffect(() => {
    // Set initial path
    setPathname(getHashPath());

    const handleHashChange = () => {
      const currentPath = getHashPath();
      setPathname(currentPath);
      
      // Extract query from hash if needed e.g. #/path?foo=bar
      const hash = window.location.hash.slice(1);
      if (hash.includes('?')) {
          const searchParams = new URLSearchParams(hash.split('?')[1]);
          const q: Record<string, string> = {};
          searchParams.forEach((val, key) => { q[key] = val; });
          setQuery(q);
      } else {
          setQuery({});
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle initial query params if present
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const push = (href: string) => {
    // Update hash triggers hashchange event
    window.location.hash = href;
    window.scrollTo(0, 0);
  };

  const back = () => {
    window.history.back();
  };

  return (
    <RouterContext.Provider value={{ pathname, query, push, back }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const usePathname = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('usePathname must be used within a RouterProvider');
  }
  return context.pathname;
};

export const useSearchParams = () => {
    const context = useContext(RouterContext);
    if (!context) {
        throw new Error('useSearchParams must be used within a RouterProvider');
    }
    return new URLSearchParams(context.query);
}

export const useParams = () => {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    
    // /services/[slug]
    if (segments[0] === 'services' && segments[1]) {
        return { slug: segments[1] };
    }
    
    return {};
};