import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/shared/SEOHead';
import { buildMeta } from '@/lib/seo';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/lib/i18n';

const Terms = () => {
  const { language, setLanguage } = useLanguage();
  
  const meta = buildMeta({
    title: `Terms of Service - rect.one`,
    description: 'Read the terms and conditions for using rect.one and our services.',
    path: '/terms',
    language,
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead meta={meta} />
      <NavBar language={language} onLanguageChange={setLanguage} />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h1>Terms of Service</h1>
          
          <p className="lead">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div className="not-prose mb-8 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Legal Notice:</strong> This is a sample terms of service for demonstration purposes. 
              Please consult with legal professionals to create proper terms of service for your actual website.
            </p>
          </div>
          
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using rect.one, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          
          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of rect.one's materials for personal, non-commercial transitory viewing only.
          </p>
          
          <h3>This license shall not allow you to:</h3>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for commercial purposes or public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or proprietary notations from the materials</li>
          </ul>
          
          <h2>User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times.
          </p>
          
          <h2>Prohibited Uses</h2>
          <p>You may not use our service:</p>
          <ul>
            <li>For any unlawful purpose or to solicit others to unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
            <li>To upload or transmit viruses or any other type of malicious code</li>
          </ul>
          
          <h2>Content</h2>
          <p>
            Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content you post.
          </p>
          
          <h2>Tool Submissions</h2>
          <p>
            When you submit tool information to our directory:
          </p>
          <ul>
            <li>You represent that you have the right to submit this information</li>
            <li>You grant us permission to review, modify, and publish the submission</li>
            <li>You understand that submissions are subject to our review process</li>
            <li>We reserve the right to reject any submission without explanation</li>
          </ul>
          
          <h2>Intellectual Property Rights</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the exclusive property of rect.one and its licensors.
          </p>
          
          <h2>Termination</h2>
          <p>
            We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          
          <h2>Disclaimer</h2>
          <p>
            The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company:
          </p>
          <ul>
            <li>Excludes all representations and warranties relating to this website and its contents</li>
            <li>Does not warrant the accuracy, completeness, or timeliness of tool information</li>
            <li>Makes no guarantees about the availability or functionality of external tools</li>
          </ul>
          
          <h2>Limitations</h2>
          <p>
            In no event shall rect.one or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.
          </p>
          
          <h2>External Links</h2>
          <p>
            Our website contains links to external tools and services. We have no control over the content and practices of these sites and cannot accept responsibility or liability for their respective privacy policies.
          </p>
          
          <h2>Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the United States.
          </p>
          
          <h2>Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
          </p>
          
          <h2>Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at legal@rect.one.
          </p>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

export default Terms;