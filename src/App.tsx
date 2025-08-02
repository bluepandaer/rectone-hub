
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import ToolDetail from "./pages/ToolDetail";
import Alternatives from "./pages/Alternatives";
import AlternativeDetail from "./pages/AlternativeDetail";
import Vs from "./pages/Vs";
import VsDetail from "./pages/VsDetail";
import Deals from "./pages/Deals";
import Submit from "./pages/Submit";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import CookieNotice from "./components/shared/CookieNotice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/:slug" element={<ToolDetail />} />
            <Route path="/alternatives" element={<Alternatives />} />
            <Route path="/alternatives/:brand" element={<AlternativeDetail />} />
            <Route path="/vs" element={<Vs />} />
            <Route path="/vs/:comparison" element={<VsDetail />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieNotice />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
