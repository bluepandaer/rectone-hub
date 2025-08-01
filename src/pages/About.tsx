import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/shared/SEOHead';
import { buildMeta } from '@/lib/seo';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/lib/i18n';

const About = () => {
  const { language, setLanguage } = useLanguage();
  
  const meta = buildMeta({
    title: `${t('nav.about', language)} - rect.one`,
    description: 'Learn about rect.one, the premier destination for discovering AI and development tools.',
    path: '/about',
    language,
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead meta={meta} />
      <NavBar language={language} onLanguageChange={setLanguage} />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h1>About rect.one</h1>
          
          <p className="lead">
            rect.one is your premier destination for discovering, comparing, and choosing the best AI and development tools for your projects.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            We believe that the right tools can transform how you work and create. Our mission is to help developers, creators, and teams discover powerful AI and development tools that can enhance their productivity and unlock new possibilities.
          </p>
          
          <h2>What We Offer</h2>
          <ul>
            <li><strong>Comprehensive Tool Directory:</strong> Curated collection of the best AI and development tools</li>
            <li><strong>Detailed Reviews:</strong> In-depth analysis of features, pricing, and use cases</li>
            <li><strong>Smart Comparisons:</strong> Side-by-side comparisons to help you choose</li>
            <li><strong>Alternative Recommendations:</strong> Find alternatives to popular tools</li>
            <li><strong>Exclusive Deals:</strong> Access to special offers and discounts</li>
            <li><strong>Community Insights:</strong> Real user experiences and recommendations</li>
          </ul>
          
          <h2>Why Trust rect.one?</h2>
          <p>
            Our team consists of experienced developers and AI enthusiasts who personally test and evaluate each tool in our directory. We maintain independence and transparency in our reviews, ensuring you get honest, unbiased information to make informed decisions.
          </p>
          
          <h2>For Tool Makers</h2>
          <p>
            Are you building an amazing AI or development tool? We'd love to learn about it! Submit your tool through our submission form, and our team will review it for inclusion in our directory.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            Have questions, suggestions, or feedback? We'd love to hear from you. Reach out to us through our contact page or connect with us on social media.
          </p>
          
          <div className="not-prose mt-12 p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Legal Notice:</strong> This website provides informational content about AI and development tools. 
              We are not legal advisors. Please consult with qualified professionals for legal or business advice.
            </p>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

export default About;