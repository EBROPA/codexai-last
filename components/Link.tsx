import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Link: React.FC<LinkProps> = ({ href, className, children, ...props }) => {
  // Construct hash URL if it starts with /
  const target = href.startsWith('/') ? `#${href}` : href;
  
  return (
    <a href={target} className={className} {...props}>
      {children}
    </a>
  );
};