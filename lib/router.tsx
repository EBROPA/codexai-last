import React, { createContext, useContext, useEffect, useState } from 'react';

interface RouterContextType {
  pathname: string;
  query: Record<string, string>;
  push: (href: string) => void;
  back: () => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

const parseQuery = (queryString: string) => {
  const searchParams = new URLSearchParams(queryString);
  const q: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    q[key] = val;
  });
  return q;
};

const getHashQuery = () => {
  const hash = window.location.hash.slice(1);
  if (!hash.includes('?')) return {};
  return parseQuery(hash.split('?')[1]);
};

const getSearchQuery = () => {
  const search = window.location.search;
  if (!search) return {};
  return parseQuery(search.slice(1));
};

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
          setQuery(getHashQuery());
      } else {
          const searchQuery = getSearchQuery();
          setQuery(searchQuery);
          const searchString = new URLSearchParams(Object.entries(searchQuery)).toString();
          if (searchString) {
            const nextHash = `${currentPath}?${searchString}`;
            if (hash !== nextHash) {
              window.location.hash = nextHash;
            }
          }
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle initial query params if present
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const push = (href: string) => {
    const [path, existingQuery] = href.split('?');
    const merged = new URLSearchParams(existingQuery || '');
    Object.entries(query).forEach(([key, value]) => {
      if (!merged.has(key)) {
        merged.set(key, String(value));
      }
    });
    const queryString = merged.toString();
    const target = queryString ? `${path}?${queryString}` : path;
    // Update hash triggers hashchange event
    window.location.hash = target;
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
    return new URLSearchParams(Object.entries(context.query));
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
