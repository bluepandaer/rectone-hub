# rect.one - AI & Development Tools Hub

A comprehensive platform for discovering, comparing, and choosing the best AI and development tools. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔍 **Tool Discovery**: Browse a curated directory of AI and development tools
- 🆚 **Tool Comparisons**: Side-by-side comparisons with detailed analysis
- 🔄 **Alternative Suggestions**: Find alternatives to popular tools
- 💰 **Deals & Offers**: Exclusive deals and discounts
- 🌐 **Multi-language Support**: English, Chinese, Spanish, German, Japanese
- 📱 **Responsive Design**: Works on all devices
- 🔒 **RLS Security**: Secure database with Row Level Security
- 🎨 **Modern UI**: Built with shadcn/ui components

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (optional, has JSON fallback)

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Data Sources

The application supports two data sources:

### 1. Supabase (Recommended)

To use Supabase as your data source:

1. Create a Supabase project
2. Run the database migration:
```sql
-- Execute the contents of supabase/migrations/001_initial_schema.sql
-- This creates all tables, policies, and sample data
```

3. Set environment variables:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Local JSON (Fallback)

The app automatically falls back to local JSON files when:
- Supabase environment variables are missing
- Supabase connection fails
- `VITE_USE_FALLBACK_DATA=true` is set

JSON files are located in `src/data/`:
- `tools.json` - Tool directory
- `categories.json` - Tool categories
- `tags.json` - Tool tags
- `deals.json` - Current deals
- `alternatives.json` - Tool alternatives
- `vspairs.json` - Tool comparisons

## Database Schema & RLS Setup

### Tables

- **tools**: Main tool directory with detailed information
- **categories**: Tool categories with counts
- **tags**: Tool tags with counts
- **deals**: Active deals and offers
- **alternatives**: Alternative tool suggestions
- **vspairs**: Tool comparison pairs
- **pending_submissions**: User-submitted tools awaiting review (secure RLS)

### Setting Up the Database

**Execute this SQL in your Supabase project** (SQL Editor or CLI):

```sql
-- Create pending_submissions table with secure RLS
create table if not exists public.pending_submissions(
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  website_url text,
  slogan text,
  categories text[] default '{}',
  tags text[] default '{}',
  price_type text,
  has_free_trial boolean default false,
  platforms text[] default '{}',
  integrations text[] default '{}',
  logo_url text,
  contact text,
  notes_md text
);

-- Enable Row Level Security
alter table public.pending_submissions enable row level security;

-- RLS Policies
drop policy if exists "Allow anonymous insert" on public.pending_submissions;
create policy "Allow anonymous insert" on public.pending_submissions
  for insert to anon with check (true);

-- Deny anonymous read/update/delete
revoke select, update, delete on public.pending_submissions from anon;
grant insert on public.pending_submissions to anon;
```

### RLS Security Model

- ✅ Anonymous **READ** access to all data tables (tools, categories, etc.)
- ✅ Anonymous **INSERT** to pending_submissions only  
- ❌ Anonymous **READ/UPDATE/DELETE** denied on pending_submissions
- ✅ Service role has full admin access

## Adding Content

### Add a New Tool

1. **Via Supabase Dashboard**:
```sql
INSERT INTO tools (slug, name, slogan, description_md, website_url, pricing, categories, tags, platforms, is_open_source, has_free_trial, supports_cn)
VALUES (
  'tool-slug',
  'Tool Name',
  'One-line description',
  'Detailed markdown description',
  'https://tool-website.com',
  '[{"plan": "Free", "price": "Free"}, {"plan": "Pro", "price": "$20/month"}]'::jsonb,
  ARRAY['category1', 'category2'],
  ARRAY['tag1', 'tag2'],
  ARRAY['Web', 'iOS'],
  false,
  true,
  false
);
```

2. **Via JSON File** (fallback mode):
Add to `src/data/tools.json` following the existing structure.

### Add Tool Alternatives

```sql
INSERT INTO alternatives (brand, description, items)
VALUES (
  'Brand Name',
  'Description of why you might want alternatives',
  '[{"tool_slug": "alternative-tool", "reason": "Why this is a good alternative"}]'::jsonb
);
```

### Add Tool Comparison

```sql
INSERT INTO vspairs (a_slug, b_slug, matrix, summary, verdict_for)
VALUES (
  'tool-a-slug',
  'tool-b-slug',
  '{"price": {"Tool A": "$20/month", "Tool B": "$30/month"}, "features": ["Feature 1", "Feature 2"]}'::jsonb,
  'Comparison summary',
  '{"beginner": "Tool A is better for beginners", "team": "Tool B is better for teams", "enterprise": "Tool A is better for enterprise"}'::jsonb
);
```

### Add a Deal

```sql
INSERT INTO deals (tool_slug, title, code, url, description, discount_percentage, starts_at, ends_at)
VALUES (
  'tool-slug',
  'Special Offer Title',
  'DISCOUNT20',
  'https://tool-website.com/offer',
  'Get 20% off your first year',
  20,
  NOW(),
  NOW() + INTERVAL '30 days'
);
```

## Scripts

### Generate Static Files

Generate sitemap.xml, robots.txt, and feeds:

```bash
npm run generate:static
```

This creates:
- `public/sitemap.xml` - Search engine sitemap
- `public/robots.txt` - Crawler instructions
- `public/feed.xml` - RSS feed
- `public/feed.json` - JSON feed

### Sync Supabase to JSON

Export Supabase data to local JSON files:

```bash
npm run sync:fallback
```

This is useful for:
- Creating backups
- Switching to JSON mode
- Development without Supabase

## Configuration

### Analytics

Configure analytics in the Settings page (`/settings`):

1. **Google Analytics 4**: Set tracking ID (GA_MEASUREMENT_ID)
2. **Plausible**: Set domain name
3. **Umami**: Set tracking ID
4. **None**: Disable all tracking

### Language Support

The app supports 5 languages with automatic fallbacks:

- **English (en)**: Default language
- **Chinese (zh)**: Simplified Chinese
- **Spanish (es)**: Spanish
- **German (de)**: German
- **Japanese (ja)**: Japanese

Content can be localized using fields like `name_zh`, `description_zh`, etc.

### Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Force JSON fallback (optional)
VITE_USE_FALLBACK_DATA=true

# Analytics (configured via UI)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_PLAUSIBLE_DOMAIN=yourdomain.com
VITE_UMAMI_TRACKING_ID=your-tracking-id
```

## SEO Features

- ✅ Dynamic meta titles and descriptions
- ✅ Open Graph and Twitter Card tags
- ✅ Canonical URLs
- ✅ JSON-LD structured data
- ✅ Sitemap generation
- ✅ RSS and JSON feeds

### Structured Data

- **Tools**: SoftwareApplication schema with pricing, ratings, and features
- **Alternatives**: FAQPage schema with common questions
- **Comparisons**: FAQPage schema with comparison insights

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel/Netlify

1. Connect your Git repository
2. Set environment variables
3. Deploy automatically on push

### Generate Static Files

After deployment, generate static files:

```bash
npm run generate:static
```

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (NavBar, Footer)
│   ├── shared/         # Shared components (SEO, Loading, etc.)
│   ├── tools/          # Tool-specific components
│   └── ui/             # shadcn/ui components
├── data/               # JSON fallback data
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API functions
├── pages/              # Page components
└── scripts/            # Build and utility scripts
```

### Adding New Features

1. **New Page**: Create in `src/pages/` and add route to `App.tsx`
2. **New Component**: Add to appropriate `src/components/` folder
3. **New API Function**: Add to `src/lib/api.ts` and `src/lib/supabase.ts`
4. **New Translation**: Add to `src/lib/i18n.ts`

### Code Style

- Use TypeScript for all new code
- Follow the existing component patterns
- Use semantic color tokens from the design system
- Prefer composition over inheritance
- Keep components small and focused

## Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Check environment variables
   - Verify RLS policies are correctly set
   - App will fallback to JSON automatically

2. **Missing Data**
   - Run `npm run sync:fallback` to export from Supabase
   - Check JSON files in `src/data/`

3. **Build Errors**
   - Ensure all TypeScript types are correct
   - Check for missing imports

4. **Performance Issues**
   - Enable image lazy loading
   - Use React.memo for expensive components
   - Implement virtual scrolling for large lists

### Support

For issues and questions:
- Check existing GitHub issues
- Create a new issue with detailed information
- Contact: hello@rect.one

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Built with ❤️ by the rect.one team