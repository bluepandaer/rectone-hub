import { useEffect } from 'react';
import type { MetaData } from '@/lib/seo';

interface SEOHeadProps {
  meta: MetaData;
}

const SEOHead = ({ meta }: SEOHeadProps) => {
  useEffect(() => {
    // Update title
    document.title = meta.title;
    
    // Update meta description
    updateMetaTag('description', meta.description);
    
    // Update canonical
    if (meta.canonical) {
      updateLinkTag('canonical', meta.canonical);
    }
    
    // Update Open Graph tags
    if (meta.og) {
      updateMetaTag('og:title', meta.og.title, 'property');
      updateMetaTag('og:description', meta.og.description, 'property');
      updateMetaTag('og:type', meta.og.type || 'website', 'property');
      updateMetaTag('og:url', meta.canonical || '', 'property');
      if (meta.og.image) {
        updateMetaTag('og:image', meta.og.image, 'property');
      }
    }
    
    // Update Twitter tags
    if (meta.twitter) {
      updateMetaTag('twitter:card', meta.twitter.card);
      updateMetaTag('twitter:title', meta.twitter.title);
      updateMetaTag('twitter:description', meta.twitter.description);
      if (meta.twitter.image) {
        updateMetaTag('twitter:image', meta.twitter.image);
      }
    }
    
    // Update structured data
    if (meta.structuredData) {
      updateStructuredData(meta.structuredData);
    }
  }, [meta]);

  return null;
};

const updateMetaTag = (name: string, content: string, type: 'name' | 'property' = 'name') => {
  let element = document.querySelector(`meta[${type}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(type, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
};

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  
  element.href = href;
};

const updateStructuredData = (data: any) => {
  const id = 'structured-data';
  let element = document.getElementById(id);
  
  if (!element) {
    element = document.createElement('script');
    element.id = id;
    (element as HTMLScriptElement).type = 'application/ld+json';
    document.head.appendChild(element);
  }
  
  element.textContent = JSON.stringify(data);
};

export default SEOHead;