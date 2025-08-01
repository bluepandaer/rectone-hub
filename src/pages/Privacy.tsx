import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/shared/SEOHead';
import { buildMeta } from '@/lib/seo';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/lib/i18n';

const Privacy = () => {
  const { language, setLanguage } = useLanguage();
  
  const meta = buildMeta({
    title: `Privacy Policy - rect.one`,
    description: 'Learn about how rect.one collects, uses, and protects your personal information.',
    path: '/privacy',
    language,
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead meta={meta} />
      <NavBar language={language} onLanguageChange={setLanguage} />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h1>Privacy Policy</h1>
          
          <p className="lead">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div className="not-prose mb-8 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Legal Notice:</strong> This is a sample privacy policy for demonstration purposes. 
              Please consult with legal professionals to create a proper privacy policy for your actual website.
            </p>
          </div>
          
          <h2>Information We Collect</h2>
          
          <h3>Information You Provide</h3>
          <ul>
            <li>Contact information when you reach out to us</li>
            <li>Tool submission data when you suggest new tools</li>
            <li>Feedback and survey responses</li>
          </ul>
          
          <h3>Information Automatically Collected</h3>
          <ul>
            <li>Website usage data and analytics</li>
            <li>Browser type and device information</li>
            <li>IP address and location data</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
          
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Respond to your inquiries and requests</li>
            <li>Send important updates and notifications</li>
            <li>Analyze website usage and performance</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
          
          <h2>Information Sharing</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
          <ul>
            <li>With your explicit consent</li>
            <li>To service providers who assist in our operations</li>
            <li>When required by law or to protect our rights</li>
            <li>In connection with a business transfer or acquisition</li>
          </ul>
          
          <h2>Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience. You can control cookie preferences through your browser settings or our cookie consent banner.
          </p>
          
          <h3>Types of Cookies We Use</h3>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          </ul>
          
          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <h2>Your Rights</h2>
          <p>Depending on your location, you may have rights to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your personal information</li>
            <li>Restrict or object to processing</li>
            <li>Data portability</li>
          </ul>
          
          <h2>Third-Party Services</h2>
          <p>
            Our website may contain links to third-party services. We are not responsible for the privacy practices of these external sites.
          </p>
          
          <h2>Children's Privacy</h2>
          <p>
            Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.
          </p>
          
          <h2>International Users</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence.
          </p>
          
          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at privacy@rect.one.
          </p>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

export default Privacy;