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

const formSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
  website_url: z.string().url("Please enter a valid URL"),
  slogan: z.string().min(1, "Slogan is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  pricing_type: z.enum(["free", "freemium", "paid"]).optional(),
  has_free_trial: z.boolean().default(false),
  is_open_source: z.boolean().default(false),
  supports_cn: z.boolean().default(false),
  logo_url: z.string().url().optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  additional_notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const categories = [
  "ai-writing", "productivity", "development", "design", "marketing", 
  "analytics", "communication", "project-management", "note-taking", "code-editors"
];

const platforms = [
  "Web", "Windows", "macOS", "Linux", "iOS", "Android", "API", "Chrome Extension"
];

const Submit = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newPlatform, setNewPlatform] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      website_url: "",
      slogan: "",
      description: "",
      category: "",
      tags: [],
      platforms: [],
      has_free_trial: false,
      is_open_source: false,
      supports_cn: false,
      logo_url: "",
      contact_email: "",
      additional_notes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Here you would normally submit to your API
      // For now, we'll just simulate a submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: t("submit.success", language),
        description: t("submit.successMessage", language),
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: t("submit.error", language),
        description: t("submit.errorMessage", language),
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

  return (
    <div className="min-h-screen bg-background">
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
                        <FormLabel>{t("submit.website", language)} *</FormLabel>
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
                        <FormLabel>{t("submit.slogan", language)} *</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of what the tool does" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
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
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("submit.category", language)}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                                {platforms.filter(p => !field.value.includes(p)).map((platform) => (
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

                  <FormField
                    control={form.control}
                    name="pricing_type"
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

                    <FormField
                      control={form.control}
                      name="is_open_source"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>
                            {t("submit.isOpenSource", language)}
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="supports_cn"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>
                            {t("submit.supportsChina", language)}
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
                    name="contact_email"
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

                  <FormField
                    control={form.control}
                    name="additional_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("submit.additionalNotes", language)}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional information about the tool"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("submit.submitTool", language)}
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