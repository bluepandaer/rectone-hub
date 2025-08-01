import { Link } from "react-router-dom";
import { Github, Twitter, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { t, type Language } from "@/lib/i18n";

interface FooterProps {
  language?: Language;
}

const Footer = ({ language = "en" }: FooterProps) => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Implement newsletter subscription
      console.log("Subscribe:", email);
      setEmail("");
      // Show success message
    }
  };

  const text = {
    zh: {
      newsletter: "订阅更新",
      newsletterDesc: "获取最新AI工具推荐和优惠信息",
      emailPlaceholder: "输入您的邮箱",
      subscribe: "订阅",
      product: "产品",
      company: "公司",
      legal: "法律",
      social: "社交",
      tools: "工具库",
      alternatives: "替代品",
      deals: "优惠信息",
      submit: "提交工具",
      about: "关于我们",
      contact: "联系我们",
      blog: "博客",
      privacy: "隐私政策",
      terms: "使用条款",
      madeWith: "用",
      madeIn: "制作于中国",
      description: "rect.one - 发现最优秀的AI和开发工具",
    },
    en: {
      newsletter: "Newsletter",
      newsletterDesc: "Get the latest AI tools and deals",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      product: "Product",
      company: "Company", 
      legal: "Legal",
      social: "Social",
      tools: "Tools",
      alternatives: "Alternatives",
      deals: "Deals",
      submit: "Submit Tool",
      about: "About",
      contact: "Contact",
      blog: "Blog",
      privacy: "Privacy",
      terms: "Terms",
      madeWith: "Made with",
      madeIn: "in China",
      description: "rect.one - Discover the best AI & dev tools",
    }
  };

  const t = text[language as keyof typeof text];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground">rect.one</span>
                <span className="text-xs text-muted-foreground -mt-1">
                  {language === "zh" ? "AI & 开发工具导航" : "ToolsHub for AI & Dev"}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              {t.description}
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">{t.newsletter}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {t.newsletterDesc}
              </p>
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">{t.subscribe}</Button>
              </form>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">{t.product}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.tools}
                </Link>
              </li>
              <li>
                <Link to="/alternatives" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.alternatives}
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.deals}
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.submit}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">{t.company}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.contact}
                </Link>
              </li>
              <li>
                <a href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.blog}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">{t.legal}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.terms}
                </Link>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="font-semibold mb-4">{t.social}</h4>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://github.com/rect-one" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://twitter.com/rectone" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="mailto:hello@rect.one">
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2024 rect.one. All rights reserved.
          </div>
          <div className="text-sm text-muted-foreground flex items-center">
            {t.madeWith} <Heart className="h-4 w-4 mx-1 text-red-500" /> {t.madeIn}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;