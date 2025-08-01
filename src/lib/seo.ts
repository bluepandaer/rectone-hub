// SEO utilities for meta tags and JSON-LD structured data

import type { Tool, Alternative, VSPair, Language } from './types';
import { t, getLocalizedContent } from './i18n';

export interface MetaData {
  title: string;
  description: string;
  canonical?: string;
  og?: {
    title: string;
    description: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    image?: string;
  };
  structuredData?: any;
}

export const buildMeta = (params: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
  language?: Language;
}): MetaData => {
  const { title, description, path, image, type = 'website', language = 'en' } = params;
  const baseUrl = 'https://rect.one';
  const canonical = `${baseUrl}${path}`;
  
  const ogImage = image || '/placeholder.svg';
  
  return {
    title,
    description,
    canonical,
    og: {
      title,
      description,
      image: ogImage,
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: ogImage,
    },
  };
};

export const buildToolJsonLD = (tool: Tool, language: Language = 'en'): any => {
  const baseUrl = 'https://rect.one';
  const toolName = getLocalizedContent(tool, 'name', language);
  const toolDescription = getLocalizedContent(tool, 'description_md', language);
  
  const offers = tool.pricing.map(plan => ({
    '@type': 'Offer',
    name: plan.plan,
    price: plan.price === 'Free' ? '0' : plan.price.replace(/[^0-9.]/g, ''),
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    description: plan.notes || '',
  }));

  const aggregateRating = tool.score ? {
    '@type': 'AggregateRating',
    ratingValue: ((tool.score.ease + tool.score.value + tool.score.features + tool.score.docs) / 4).toFixed(1),
    bestRating: 5,
    worstRating: 1,
    ratingCount: 1,
  } : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: toolName,
    description: toolDescription,
    url: tool.website_url,
    applicationCategory: tool.categories.join(', '),
    operatingSystem: tool.platforms.join(', '),
    offers,
    ...(aggregateRating && { aggregateRating }),
    provider: {
      '@type': 'Organization',
      name: 'rect.one',
      url: baseUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/tools/${tool.slug}`,
    },
  };
};

export const buildFAQJsonLD = (faqs: Array<{ q: string; a: string }>): any => {
  if (!faqs.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
};

export const buildAlternativesJsonLD = (alternative: Alternative, tools: Tool[]): any => {
  const faqs = [
    {
      q: `What are the best alternatives to ${alternative.brand}?`,
      a: `Popular alternatives include ${tools.slice(0, 3).map(t => t.name).join(', ')} and others.`,
    },
    {
      q: `Why consider ${alternative.brand} alternatives?`,
      a: alternative.description || 'Different tools offer unique features, pricing models, and user experiences.',
    },
    {
      q: `How do I choose the right ${alternative.brand} alternative?`,
      a: 'Consider your specific needs, budget, technical requirements, and team size when selecting an alternative.',
    },
  ];

  return buildFAQJsonLD(faqs);
};

export const buildVSJsonLD = (vsPair: VSPair, toolA: Tool, toolB: Tool): any => {
  const faqs = [
    {
      q: `What's the difference between ${toolA.name} and ${toolB.name}?`,
      a: vsPair.summary || `${toolA.name} and ${toolB.name} are both excellent tools with different strengths and use cases.`,
    },
    {
      q: `Which is better for beginners: ${toolA.name} or ${toolB.name}?`,
      a: vsPair.verdict_for.beginner,
    },
    {
      q: `Which is better for teams: ${toolA.name} or ${toolB.name}?`,
      a: vsPair.verdict_for.team,
    },
    {
      q: `Which is better for enterprise: ${toolA.name} or ${toolB.name}?`,
      a: vsPair.verdict_for.enterprise,
    },
  ];

  return buildFAQJsonLD(faqs);
};

// React hook for managing page meta data
export const usePageMeta = (meta: MetaData) => {
  const updateMeta = () => {
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
  };

  // Call updateMeta when component mounts or meta changes
  React.useEffect(() => {
    updateMeta();
  }, [meta]);
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

// Import React for useEffect
import { useEffect } from 'react';

// Fix the React import issue
declare const React: {
  useEffect: typeof useEffect;
};