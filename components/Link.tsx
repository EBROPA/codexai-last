import React from 'react';
import { useRouter } from '../lib/router';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Link: React.FC<LinkProps> = ({ href, className, children, onClick, ...props }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    
    // Handle internal links with client-side routing
    if (!e.defaultPrevented && href.startsWith('/')) {
      e.preventDefault();
      router.push(href);
    }
  };
  
  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};
