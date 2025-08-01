import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import { submitTool } from "@/lib/api";
import { buildMeta } from "@/lib/seo";
import SEOHead from "@/components/shared/SEOHead";

const formSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
  website_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  slogan: z.string().optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  price_type: z.enum(["free", "freemium", "paid"]).optional(),
  has_free_trial: z.boolean().default(false),
  platforms: z.array(z.string()).default([]),
  integrations: z.array(z.string()).default([]),
  logo_url: z.string().url().optional().or(z.literal("")),
  contact: z.string().email().optional().or(z.literal("")),
  notes_md: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const availableCategories = [
  "Writing", "Coding", "Design", "Productivity", "Data", "Marketing", 
  "Communication", "Project Management", "Analytics", "Art"
];

const availablePlatforms = [
  "Web", "Windows", "macOS", "Linux", "iOS", "Android", "API", "Chrome Extension"
];

const Submit = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newPlatform, setNewPlatform] = useState("");
  const [newIntegration, setNewIntegration] = useState("");

  const meta = buildMeta({
    title: "Submit AI Tool - rect.one",
    description: "Submit your AI tool to be featured on rect.one. Help the community discover your product.",
    path: "/submit"
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      website_url: "",
      slogan: "",
      categories: [],
      tags: [],
      platforms: [],
      integrations: [],
      has_free_trial: false,
      logo_url: "",
      contact: "",
      notes_md: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase
      const submission = await submitTool({
        name: data.name,
        website_url: data.website_url || null,
        slogan: data.slogan || null,
        categories: data.categories,
        tags: data.tags,
        price_type: data.price_type || null,
        has_free_trial: data.has_free_trial,
        platforms: data.platforms,
        integrations: data.integrations,
        logo_url: data.logo_url || null,
        contact: data.contact || null,
        notes_md: data.notes_md || null,
      });
      
      console.log('Submission successful:', submission.id);
      
      toast({
        title: t("submit.success", language),
        description: t("submit.successMessage", language),
      });
      
      form.reset();
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: t("submit.error", language),
        description: error instanceof Error ? error.message : t("submit.errorMessage", language),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !form.getValues("tags").includes(newTag.trim())) {
      form.setValue("tags", [...form.getValues("tags"), newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue("tags", form.getValues("tags").filter(tag => tag !== tagToRemove));
  };

  const addPlatform = () => {
    if (newPlatform.trim() && !form.getValues("platforms").includes(newPlatform.trim())) {
      form.setValue("platforms", [...form.getValues("platforms"), newPlatform.trim()]);
      setNewPlatform("");
    }
  };

  const removePlatform = (platformToRemove: string) => {
    form.setValue("platforms", form.getValues("platforms").filter(platform => platform !== platformToRemove));
  };

  const addIntegration = () => {
    if (newIntegration.trim() && !form.getValues("integrations").includes(newIntegration.trim())) {
      form.setValue("integrations", [...form.getValues("integrations"), newIntegration.trim()]);
      setNewIntegration("");
    }
  };

  const removeIntegration = (integrationToRemove: string) => {
    form.setValue("integrations", form.getValues("integrations").filter(integration => integration !== integrationToRemove));
  };

  const addCategory = (category: string) => {
    if (!form.getValues("categories").includes(category)) {
      form.setValue("categories", [...form.getValues("categories"), category]);
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    form.setValue("categories", form.getValues("categories").filter(cat => cat !== categoryToRemove));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead meta={meta} />
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t("submit.title", language)}</h1>
          <p className="text-muted-foreground">{t("submit.description", language)}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("submit.formTitle", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t("submit.basicInfo", language)}</h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("submit.toolName", language)} *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., ChatGPT" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("submit.website", language)}</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slogan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("submit.slogan", language)}</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of what the tool does" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes_md"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("submit.detailedDescription", language)}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of the tool's features and benefits"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Categorization */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t("submit.categorization", language)}</h3>
                  
                  {/* Categories */}
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("submit.category", language)}</FormLabel>
                        <div className="space-y-2">
                          <Select onValueChange={addCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select categories" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableCategories.filter(cat => !field.value.includes(cat)).map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((category) => (
                              <Badge key={category} variant="secondary" className="cursor-pointer" onClick={() => removeCategory(category)}>
                                {category} ×
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("submit.tags", language)}</FormLabel>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a tag"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            />
                            <Button type="button" onClick={addTag} variant="outline">
                              Add
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((tag) => (
                              <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                                {tag} ×
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Technical Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t("submit.technicalDetails", language)}</h3>
                  
                  {/* Platforms */}
                  <FormField
                    control={form.control}
                    name="platforms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("submit.platforms", language)}</FormLabel>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Select value={newPlatform} onValueChange={setNewPlatform}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                {availablePlatforms.filter(p => !field.value.includes(p)).map((platform) => (
                                  <SelectItem key={platform} value={platform}>
                                    {platform}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              type="button" 
                              onClick={addPlatform} 
                              variant="outline"
                              disabled={!newPlatform}
                            >
                              Add
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((platform) => (
                              <Badge key={platform} variant="secondary" className="cursor-pointer" onClick={() => removePlatform(platform)}>
                                {platform} ×
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Integrations */}
                  <FormField
                    control={form.control}
                    name="integrations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Integrations</FormLabel>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add an integration"
                              value={newIntegration}
                              onChange={(e) => setNewIntegration(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIntegration())}
                            />
                            <Button type="button" onClick={addIntegration} variant="outline">
                              Add
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((integration) => (
                              <Badge key={integration} variant="secondary" className="cursor-pointer" onClick={() => removeIntegration(integration)}>
                                {integration} ×
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("submit.pricingType", language)}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pricing model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="freemium">Freemium</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Feature Checkboxes */}
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="has_free_trial"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>
                            {t("submit.hasFreeTrial", language)}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Optional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t("submit.optionalInfo", language)}</h3>
                  
                  <FormField
                    control={form.control}
                    name="logo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("submit.logoUrl", language)}</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/logo.png" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("submit.contactEmail", language)}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("submit.submitting", language)}
                    </>
                  ) : (
                    t("submit.submitButton", language)
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Submit;