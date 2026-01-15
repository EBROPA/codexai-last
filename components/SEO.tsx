import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description }) => {
  useEffect(() => {
    // Basic Title Update
    document.title = `${title} | CODEXAI`;
    
    // Helper function to update or create meta tags
    const updateMeta = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update standard description
    updateMeta('name', 'description', description);

    // Update Open Graph tags
    updateMeta('property', 'og:title', `${title} | CODEXAI`);
    updateMeta('property', 'og:description', description);
    
    // We can assume the URL is dynamic or base, here we leave it or update if we had routing info
    // updateMeta('property', 'og:url', window.location.href);

  }, [title, description]);

  return null;
};