// Static file generators for sitemap, robots.txt, and feeds

import type { Tool, Alternative, VSPair, Deal } from './types';

export interface StaticFileConfig {
  baseUrl: string;
  tools: Tool[];
  alternatives: Alternative[];
  vsPairs: VSPair[];
  deals: Deal[];
}

export const generateSitemap = (config: StaticFileConfig): string => {
  const { baseUrl, tools, alternatives, vsPairs } = config;
  
  const urls = [
    // Static pages
    { loc: baseUrl, lastmod: new Date().toISOString(), priority: '1.0' },
    { loc: `${baseUrl}/tools`, lastmod: new Date().toISOString(), priority: '0.9' },
    { loc: `${baseUrl}/categories`, lastmod: new Date().toISOString(), priority: '0.8' },
    { loc: `${baseUrl}/alternatives`, lastmod: new Date().toISOString(), priority: '0.8' },
    { loc: `${baseUrl}/vs`, lastmod: new Date().toISOString(), priority: '0.8' },
    { loc: `${baseUrl}/deals`, lastmod: new Date().toISOString(), priority: '0.7' },
    { loc: `${baseUrl}/submit`, lastmod: new Date().toISOString(), priority: '0.6' },
    { loc: `${baseUrl}/about`, lastmod: new Date().toISOString(), priority: '0.5' },
    { loc: `${baseUrl}/contact`, lastmod: new Date().toISOString(), priority: '0.5' },
    { loc: `${baseUrl}/privacy`, lastmod: new Date().toISOString(), priority: '0.3' },
    { loc: `${baseUrl}/terms`, lastmod: new Date().toISOString(), priority: '0.3' },
    
    // Tool pages
    ...tools.map(tool => ({
      loc: `${baseUrl}/tools/${tool.slug}`,
      lastmod: tool.updated_at,
      priority: '0.8',
    })),
    
    // Alternative pages
    ...alternatives.map(alt => ({
      loc: `${baseUrl}/alternatives/${alt.brand.toLowerCase().replace(/\s+/g, '-')}-alternatives`,
      lastmod: alt.updated_at,
      priority: '0.7',
    })),
    
    // VS pages
    ...vsPairs.map(vs => ({
      loc: `${baseUrl}/vs/${vs.a_slug}-vs-${vs.b_slug}`,
      lastmod: vs.updated_at,
      priority: '0.7',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

export const generateRobotsTxt = (config: StaticFileConfig): string => {
  const { baseUrl } = config;
  
  return `User-agent: *
Allow: /

# Disallow admin and private pages
Disallow: /admin/
Disallow: /_next/
Disallow: /api/auth/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1`;
};

export const generateRSSFeed = (config: StaticFileConfig): string => {
  const { baseUrl, tools, deals } = config;
  
  const latestTools = tools
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20);
  
  const latestDeals = deals
    .filter(deal => deal.is_active)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const items = [
    ...latestTools.map(tool => ({
      title: `New Tool: ${tool.name}`,
      link: `${baseUrl}/tools/${tool.slug}`,
      description: tool.slogan,
      pubDate: new Date(tool.created_at).toUTCString(),
      guid: `${baseUrl}/tools/${tool.slug}`,
    })),
    ...latestDeals.map(deal => ({
      title: `Deal: ${deal.title}`,
      link: deal.url,
      description: deal.description,
      pubDate: new Date(deal.created_at).toUTCString(),
      guid: `deal-${deal.id}`,
    })),
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()).slice(0, 20);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>rect.one - AI & Development Tools</title>
    <link>${baseUrl}</link>
    <description>Latest AI and development tools, deals, and updates</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    
${items.map(item => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${item.guid}</guid>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return xml;
};

export const generateJSONFeed = (config: StaticFileConfig): string => {
  const { baseUrl, tools, deals } = config;
  
  const latestTools = tools
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20);
  
  const latestDeals = deals
    .filter(deal => deal.is_active)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const items = [
    ...latestTools.map(tool => ({
      id: `${baseUrl}/tools/${tool.slug}`,
      title: `New Tool: ${tool.name}`,
      content_text: tool.slogan,
      content_html: `<p>${tool.slogan}</p>`,
      url: `${baseUrl}/tools/${tool.slug}`,
      date_published: tool.created_at,
      date_modified: tool.updated_at,
    })),
    ...latestDeals.map(deal => ({
      id: `deal-${deal.id}`,
      title: `Deal: ${deal.title}`,
      content_text: deal.description,
      content_html: `<p>${deal.description}</p>`,
      url: deal.url,
      date_published: deal.created_at,
      date_modified: deal.updated_at,
    })),
  ].sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime()).slice(0, 20);

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'rect.one - AI & Development Tools',
    home_page_url: baseUrl,
    feed_url: `${baseUrl}/feed.json`,
    description: 'Latest AI and development tools, deals, and updates',
    language: 'en',
    items,
  };

  return JSON.stringify(feed, null, 2);
};

// Helper function to generate all static files
export const generateAllStaticFiles = async (config: StaticFileConfig): Promise<{
  sitemap: string;
  robots: string;
  rss: string;
  json: string;
}> => {
  return {
    sitemap: generateSitemap(config),
    robots: generateRobotsTxt(config),
    rss: generateRSSFeed(config),
    json: generateJSONFeed(config),
  };
};