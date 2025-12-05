import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CustomCursor } from './CustomCursor';
import { FluidBackground } from './FluidBackground';
import { Awards } from './Awards';
import { usePathname } from '../lib/router';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isContactPage = pathname === '/contact';

  return (
    <>
      <CustomCursor />
      <FluidBackground />
      <Navbar />
      <Awards />
      
      {children}

      {!isContactPage && (
        <Footer />
      )}
    </>
  );
};
