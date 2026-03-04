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

const getSearchQuery = () => {
  const search = window.location.search;
  if (!search) return {};
  return parseQuery(search.slice(1));
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [query, setQuery] = useState<Record<string, string>>(getSearchQuery());

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
      setQuery(getSearchQuery());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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

    window.history.pushState({}, '', target);
    setPathname(path);
    setQuery(parseQuery(queryString));
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

  // /blog/[slug]
  if (segments[0] === 'blog' && segments[1]) {
    return { slug: segments[1] };
  }

  return {};
};
