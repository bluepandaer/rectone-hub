import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/shared/SEOHead';
import { buildMeta } from '@/lib/seo';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, Globe, Github, Twitter } from 'lucide-react';

const Contact = () => {
  const { language, setLanguage } = useLanguage();
  
  const meta = buildMeta({
    title: `${t('nav.contact', language)} - rect.one`,
    description: 'Get in touch with the rect.one team. We\'d love to hear your feedback and suggestions.',
    path: '/contact',
    language,
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead meta={meta} />
      <NavBar language={language} onLanguageChange={setLanguage} />
      
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Send us a message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What's this about?" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us more..."
                  rows={6}
                />
              </div>
              
              <Button className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">hello@rect.one</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Website</p>
                    <p className="text-muted-foreground">rect.one</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a 
                  href="https://github.com/rectone" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                
                <a 
                  href="https://twitter.com/rectone" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">How do I submit a tool?</h4>
                  <p className="text-sm text-muted-foreground">
                    Use our tool submission form to suggest new tools for our directory.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">How are tools reviewed?</h4>
                  <p className="text-sm text-muted-foreground">
                    Our team personally tests and evaluates each tool before adding it to our directory.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Can I advertise my tool?</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact us to discuss partnership and advertising opportunities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

export default Contact;