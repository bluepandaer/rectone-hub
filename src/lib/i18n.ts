// Internationalization utilities and translations

export type Language = 'en' | 'zh' | 'es' | 'de' | 'ja';

export const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  zh: { name: '简体中文', flag: '🇨🇳' },
  es: { name: 'Español', flag: '🇪🇸' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  ja: { name: '日本語', flag: '🇯🇵' },
} as const;

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.tools': 'Tools',
    'nav.categories': 'Categories',
    'nav.alternatives': 'Alternatives',
    'nav.vs': 'Compare',
    'nav.deals': 'Deals',
    'nav.submit': 'Submit Tool',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.search.placeholder': 'Search tools, categories, or tags...',

    // Hero
    'hero.title': 'Discover the Best AI & Dev Tools',
    'hero.subtitle': 'Find, compare, and choose the perfect tools for your projects',
    'hero.search.placeholder': 'Search for tools...',
    'hero.search.button': 'Search',

    // Categories
    'categories.title': 'Browse by Category',
    'categories.viewAll': 'View All',
    'categories.tools': 'tools',

    // Tools
    'tools.title': 'AI & Development Tools',
    'tools.subtitle': 'Discover the best tools for your workflow',
    'tools.filters.title': 'Filters',
    'tools.filters.category': 'Category',
    'tools.filters.allCategories': 'All Categories',
    'tools.filters.tags': 'Tags',
    'tools.filters.platforms': 'Platforms',
    'tools.filters.allPlatforms': 'All Platforms',
    'tools.filters.pricing': 'Pricing',
    'tools.filters.free': 'Free',
    'tools.filters.paid': 'Paid',
    'tools.filters.freemium': 'Freemium',
    'tools.filters.openSource': 'Open Source',
    'tools.filters.chineseSupport': 'Chinese Support',
    'tools.filters.freeTrial': 'Free Trial',
    'tools.filters.clear': 'Clear Filters',
    'tools.sort.title': 'Sort by',
    'tools.sort.trending': 'Trending',
    'tools.sort.newest': 'Newest',
    'tools.sort.updated': 'Recently Updated',
    'tools.sort.rating': 'Rating',
    'tools.sort.name': 'Name',
    'tools.results': 'results',
    'tools.noResults': 'No tools found',
    'tools.noResults.description': 'Try adjusting your search criteria or',
    'tools.submitNew': 'submit a new tool',

    // Tool cards
    'tool.website': 'Website',
    'tool.docs': 'Docs',
    'tool.try': 'Try Now',
    'tool.openSource': 'Open Source',
    'tool.freeTrial': 'Free Trial',
    'tool.chineseSupport': 'Chinese',
    'tool.rating': 'Rating',

    // Tool detail
    'toolDetail.overview': 'Overview',
    'toolDetail.features': 'Features',
    'toolDetail.pricing': 'Pricing',
    'toolDetail.faq': 'FAQ',
    'toolDetail.relatedTools': 'Related Tools',
    'toolDetail.alternatives': 'Alternatives',
    'toolDetail.pros': 'Pros',
    'toolDetail.cons': 'Cons',
    'toolDetail.platforms': 'Platforms',
    'toolDetail.integrations': 'Integrations',
    'toolDetail.loginMethods': 'Login Methods',
    'toolDetail.score.ease': 'Ease of Use',
    'toolDetail.score.value': 'Value for Money',
    'toolDetail.score.features': 'Features',
    'toolDetail.score.docs': 'Documentation',

    // Deals
    'deals.title': 'Latest Deals & Offers',
    'deals.subtitle': 'Save money on your favorite tools',
    'deals.endingSoon': 'Ending Soon',
    'deals.discount': 'off',
    'deals.getOffer': 'Get Offer',
    'deals.expired': 'Expired',
    'deals.noCode': 'No code needed',

    // Alternatives
    'alternatives.title': 'Tool Alternatives',
    'alternatives.subtitle': 'Find alternatives to popular tools',
    'alternatives.viewAlternatives': 'View Alternatives',
    'alternatives.reasons': 'Why consider alternatives?',

    // VS
    'vs.title': 'Tool Comparisons',
    'vs.subtitle': 'Compare tools side by side',
    'vs.compare': 'Compare',
    'vs.verdict.beginner': 'For Beginners',
    'vs.verdict.team': 'For Teams',
    'vs.verdict.enterprise': 'For Enterprise',

    // Submit
    'submit.title': 'Submit a Tool',
    'submit.subtitle': 'Help others discover great tools',
    'submit.form.name': 'Tool Name',
    'submit.form.website': 'Website URL',
    'submit.form.slogan': 'One-line description',
    'submit.form.description': 'Detailed description',
    'submit.form.category': 'Category',
    'submit.form.tags': 'Tags (comma-separated)',
    'submit.form.platforms': 'Platforms',
    'submit.form.pricing': 'Pricing Type',
    'submit.form.logo': 'Logo URL',
    'submit.form.contact': 'Your Email',
    'submit.form.notes': 'Additional Notes',
    'submit.form.freeTrial': 'Has Free Trial',
    'submit.form.openSource': 'Open Source',
    'submit.form.chineseSupport': 'Supports Chinese',
    'submit.form.submit': 'Submit Tool',
    'submit.success': 'Thank you! Your submission has been received and will be reviewed.',

    // Footer
    'footer.description': 'Discover the best AI and development tools for your projects',
    'footer.newsletter.title': 'Stay Updated',
    'footer.newsletter.description': 'Get the latest tools and deals in your inbox',
    'footer.newsletter.placeholder': 'Enter your email',
    'footer.newsletter.subscribe': 'Subscribe',
    'footer.links.tools': 'Tools',
    'footer.links.categories': 'Categories',
    'footer.links.alternatives': 'Alternatives',
    'footer.links.deals': 'Deals',
    'footer.links.about': 'About',
    'footer.links.contact': 'Contact',
    'footer.links.privacy': 'Privacy',
    'footer.links.terms': 'Terms',
    'footer.copyright': '© 2024 rect.one. All rights reserved.',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Try again',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.page': 'Page',
    'common.of': 'of',

    // Meta
    'meta.title': 'rect.one - AI & Development Tools Hub',
    'meta.description': 'Discover, compare, and choose the best AI and development tools for your projects. Find alternatives, deals, and detailed reviews.',

    // Coming soon
    'comingSoon.title': 'Coming Soon',
    'comingSoon.description': 'This page is under development. Check back soon!',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.tools': '工具库',
    'nav.categories': '分类',
    'nav.alternatives': '替代品',
    'nav.vs': '对比',
    'nav.deals': '优惠',
    'nav.submit': '提交工具',
    'nav.about': '关于',
    'nav.contact': '联系',
    'nav.search.placeholder': '搜索工具、分类或标签...',

    // Hero
    'hero.title': '发现最佳 AI 和开发工具',
    'hero.subtitle': '为您的项目寻找、比较和选择完美的工具',
    'hero.search.placeholder': '搜索工具...',
    'hero.search.button': '搜索',

    // Categories
    'categories.title': '按分类浏览',
    'categories.viewAll': '查看全部',
    'categories.tools': '个工具',

    // Tools
    'tools.title': 'AI 和开发工具',
    'tools.subtitle': '发现适合您工作流程的最佳工具',
    'tools.filters.title': '筛选',
    'tools.filters.category': '分类',
    'tools.filters.allCategories': '所有分类',
    'tools.filters.tags': '标签',
    'tools.filters.platforms': '平台',
    'tools.filters.allPlatforms': '所有平台',
    'tools.filters.pricing': '定价',
    'tools.filters.free': '免费',
    'tools.filters.paid': '付费',
    'tools.filters.freemium': '免费增值',
    'tools.filters.openSource': '开源',
    'tools.filters.chineseSupport': '中文支持',
    'tools.filters.freeTrial': '免费试用',
    'tools.filters.clear': '清除筛选',
    'tools.sort.title': '排序',
    'tools.sort.trending': '热门',
    'tools.sort.newest': '最新',
    'tools.sort.updated': '最近更新',
    'tools.sort.rating': '评分',
    'tools.sort.name': '名称',
    'tools.results': '个结果',
    'tools.noResults': '未找到工具',
    'tools.noResults.description': '尝试调整搜索条件或',
    'tools.submitNew': '提交新工具',

    // Tool cards
    'tool.website': '官网',
    'tool.docs': '文档',
    'tool.try': '立即试用',
    'tool.openSource': '开源',
    'tool.freeTrial': '免费试用',
    'tool.chineseSupport': '中文',
    'tool.rating': '评分',

    // Tool detail
    'toolDetail.overview': '概览',
    'toolDetail.features': '功能',
    'toolDetail.pricing': '定价',
    'toolDetail.faq': '常见问题',
    'toolDetail.relatedTools': '相关工具',
    'toolDetail.alternatives': '替代品',
    'toolDetail.pros': '优点',
    'toolDetail.cons': '缺点',
    'toolDetail.platforms': '平台',
    'toolDetail.integrations': '集成',
    'toolDetail.loginMethods': '登录方式',
    'toolDetail.score.ease': '易用性',
    'toolDetail.score.value': '性价比',
    'toolDetail.score.features': '功能完整度',
    'toolDetail.score.docs': '文档质量',

    // Deals
    'deals.title': '最新优惠和折扣',
    'deals.subtitle': '在您喜爱的工具上省钱',
    'deals.endingSoon': '即将结束',
    'deals.discount': '折扣',
    'deals.getOffer': '获取优惠',
    'deals.expired': '已过期',
    'deals.noCode': '无需代码',

    // Alternatives
    'alternatives.title': '工具替代品',
    'alternatives.subtitle': '寻找热门工具的替代方案',
    'alternatives.viewAlternatives': '查看替代品',
    'alternatives.reasons': '为什么考虑替代品？',

    // VS
    'vs.title': '工具对比',
    'vs.subtitle': '并排比较工具',
    'vs.compare': '对比',
    'vs.verdict.beginner': '适合初学者',
    'vs.verdict.team': '适合团队',
    'vs.verdict.enterprise': '适合企业',

    // Submit
    'submit.title': '提交工具',
    'submit.subtitle': '帮助他人发现优秀工具',
    'submit.form.name': '工具名称',
    'submit.form.website': '网站地址',
    'submit.form.slogan': '一句话描述',
    'submit.form.description': '详细描述',
    'submit.form.category': '分类',
    'submit.form.tags': '标签（逗号分隔）',
    'submit.form.platforms': '平台',
    'submit.form.pricing': '定价类型',
    'submit.form.logo': '徽标地址',
    'submit.form.contact': '您的邮箱',
    'submit.form.notes': '补充说明',
    'submit.form.freeTrial': '有免费试用',
    'submit.form.openSource': '开源',
    'submit.form.chineseSupport': '支持中文',
    'submit.form.submit': '提交工具',
    'submit.success': '谢谢！您的提交已收到，将会进行审核。',

    // Footer
    'footer.description': '为您的项目发现最佳 AI 和开发工具',
    'footer.newsletter.title': '保持更新',
    'footer.newsletter.description': '在收件箱中获取最新工具和优惠',
    'footer.newsletter.placeholder': '输入您的邮箱',
    'footer.newsletter.subscribe': '订阅',
    'footer.links.tools': '工具',
    'footer.links.categories': '分类',
    'footer.links.alternatives': '替代品',
    'footer.links.deals': '优惠',
    'footer.links.about': '关于',
    'footer.links.contact': '联系',
    'footer.links.privacy': '隐私',
    'footer.links.terms': '条款',
    'footer.copyright': '© 2024 rect.one. 版权所有。',

    // Common
    'common.loading': '加载中...',
    'common.error': '出现错误',
    'common.retry': '重试',
    'common.close': '关闭',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.view': '查看',
    'common.next': '下一页',
    'common.previous': '上一页',
    'common.page': '第',
    'common.of': '页，共',

    // Meta
    'meta.title': 'rect.one - AI 和开发工具中心',
    'meta.description': '发现、比较和选择最佳的 AI 和开发工具。查找替代品、优惠和详细评测。',

    // Coming soon
    'comingSoon.title': '即将推出',
    'comingSoon.description': '此页面正在开发中，敬请期待！',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.tools': 'Herramientas',
    'nav.categories': 'Categorías',
    'nav.alternatives': 'Alternativas',
    'nav.vs': 'Comparar',
    'nav.deals': 'Ofertas',
    'nav.submit': 'Enviar Herramienta',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.search.placeholder': 'Buscar herramientas, categorías o etiquetas...',

    // Meta
    'meta.title': 'rect.one - Centro de Herramientas de IA y Desarrollo',
    'meta.description': 'Descubre, compara y elige las mejores herramientas de IA y desarrollo para tus proyectos.',

    // Coming soon
    'comingSoon.title': 'Próximamente',
    'comingSoon.description': '¡Esta página está en desarrollo. Vuelve pronto!',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.tools': 'Werkzeuge',
    'nav.categories': 'Kategorien',
    'nav.alternatives': 'Alternativen',
    'nav.vs': 'Vergleichen',
    'nav.deals': 'Angebote',
    'nav.submit': 'Tool Einreichen',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.search.placeholder': 'Werkzeuge, Kategorien oder Tags suchen...',

    // Meta
    'meta.title': 'rect.one - KI- und Entwicklungswerkzeuge Hub',
    'meta.description': 'Entdecke, vergleiche und wähle die besten KI- und Entwicklungswerkzeuge für deine Projekte.',

    // Coming soon
    'comingSoon.title': 'Demnächst',
    'comingSoon.description': 'Diese Seite ist in Entwicklung. Schau bald wieder vorbei!',
  },
  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.tools': 'ツール',
    'nav.categories': 'カテゴリ',
    'nav.alternatives': '代替案',
    'nav.vs': '比較',
    'nav.deals': 'お得情報',
    'nav.submit': 'ツール投稿',
    'nav.about': '概要',
    'nav.contact': 'お問い合わせ',
    'nav.search.placeholder': 'ツール、カテゴリ、タグを検索...',

    // Meta
    'meta.title': 'rect.one - AIと開発ツールハブ',
    'meta.description': 'プロジェクトに最適なAIと開発ツールを発見、比較、選択してください。',

    // Coming soon
    'comingSoon.title': '近日公開',
    'comingSoon.description': 'このページは開発中です。また戻ってきてください！',
  },
} as const;

export const getLocalizedContent = (
  content: Record<string, any>,
  field: string,
  language: Language,
  fallback?: string
): string => {
  // Try localized version first
  const localizedField = `${field}_${language}`;
  if (content[localizedField]) {
    return content[localizedField];
  }
  
  // Fall back to base field
  if (content[field]) {
    return content[field];
  }
  
  // Fall back to provided fallback
  if (fallback) {
    return fallback;
  }
  
  return '';
};

export const t = (key: string, language: Language = 'en'): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

export const formatNumber = (num: number, language: Language): string => {
  return new Intl.NumberFormat(getLocale(language)).format(num);
};

export const formatDate = (date: string | Date, language: Language): string => {
  return new Intl.DateTimeFormat(getLocale(language), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

const getLocale = (language: Language): string => {
  const locales = {
    en: 'en-US',
    zh: 'zh-CN',
    es: 'es-ES',
    de: 'de-DE',
    ja: 'ja-JP',
  };
  return locales[language] || 'en-US';
};